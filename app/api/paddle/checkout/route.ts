import { NextResponse } from "next/server";
import { auth } from "@/auth";
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

    const paddle = new PaddleSDK();

    const { transactionId } = await paddle.createTransaction({
      userId,
      email: userEmail,
      name: userName || undefined,
    });

    // Return the Paddle client token (PADDLE_CLIENT_TOKEN) and transaction ID
    // The frontend will use Paddle.js to open the checkout overlay
    return NextResponse.json({
      transactionId,
      clientToken: process.env.PADDLE_CLIENT_TOKEN || "",
      environment: process.env.PADDLE_ENVIRONMENT || "sandbox",
    });
  } catch (error) {
    console.error("[PADDLE_CHECKOUT_ERROR]", error);
    const message =
      error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
