import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "../../../lib/prisma";
import { revalidatePath } from "next/cache";



export async function PATCH(req: Request) {
  try {
    const session = await auth();

    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, username, bio, image, profileBackground } = body;

    // Convert empty or whitespace-only username to null to prevent UNIQUE constraint collisions
    const dbUsername = username && username.trim() !== "" ? username.trim() : null;

    // Validate username uniqueness if provided and not null
    if (dbUsername) {
      const existingUser = await prisma.user.findUnique({
        where: { username: dbUsername },
      });

      if (existingUser && existingUser.id !== session.user.id) {
        return NextResponse.json(
          { error: "Username is already taken" },
          { status: 400 }
        );
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        ...(name !== undefined && { name }),
        ...(username !== undefined && { username: dbUsername }),
        ...(bio !== undefined && { bio }),
        ...(image !== undefined && { image }),
        ...(profileBackground !== undefined && { profileBackground }),
      },
    });

    // If the user's name is updated, bulk-update the 'author' field in all comments they wrote
    // This maintains data consistency across existing comments without affecting query read speeds.
    if (name !== undefined && name.trim() !== "") {
      try {
        await prisma.comment.updateMany({
          where: { userId: session.user.id },
          data: { author: name.trim() },
        });
      } catch (commentUpdateError) {
        console.error("Failed to sync comment author names:", commentUpdateError);
        // We don't block the main profile update success even if comment syncing fails.
      }
    }

    // Force Next.js router/page static cache revalidation across the site
    try {
      revalidatePath("/", "layout");
    } catch (revalidateError) {
      console.error("Revalidation failed:", revalidateError);
    }

    return NextResponse.json(updatedUser);
  } catch (error: any) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}