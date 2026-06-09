import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { PaddleSDK } from "@/lib/paddle-server";

export async function POST() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    if (!userId) {
      return NextResponse.json({ error: "User ID not found" }, { status: 400 });
    }

    const userEmail = session.user.email;
    const userName = session.user.name;

    if (!userEmail) {
      return NextResponse.json(
        { error: "Account requires an email address" },
        { status: 400 }
      );
    }

    // Look up existing Paddle customer ID (ctm_01...) if user has one.
    // Only pass it if it's a real Paddle-issued ID, not the app UUID.
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { paddleCustomerId: true },
    });

    const paddle = new PaddleSDK();

    const { transactionId } = await paddle.createTransaction({
      userId,
      email: userEmail,
      name: userName || undefined,
      paddleCustomerId: user?.paddleCustomerId || null,
    });

    // The frontend uses NEXT_PUBLIC_PADDLE_* env vars directly for Paddle.js init.
    // We only return the transactionId needed for Checkout.open().
    return NextResponse.json({ transactionId });
  } catch (error) {
    console.error("[PADDLE_CHECKOUT_ERROR]", error);
    const message =
      error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

