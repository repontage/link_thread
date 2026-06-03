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
    const userEmail = session.user.email;
    const userName = session.user.name;

    if (!userEmail) {
      return NextResponse.json(
        { error: "Account requires an email address" },
        { status: 400 },
      );
    }

    // Require Paddle configuration
    if (!process.env.PADDLE_API_KEY || !process.env.PADDLE_PRICE_ID) {
      return NextResponse.json(
        { error: "Paddle is not configured" },
        { status: 503 },
      );
    }

    // Fetch user's Paddle customer ID from DB
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { paddleCustomerId: true },
    });

    const paddle = new PaddleSDK();

    // Find or create Paddle customer
    const customer = await paddle.findOrCreateCustomer({
      userId,
      email: userEmail,
      name: userName || undefined,
      paddleCustomerId: user?.paddleCustomerId,
    });

    // Save customer ID to DB if new
    if (!user?.paddleCustomerId || user.paddleCustomerId !== customer.id) {
      await prisma.user.update({
        where: { id: userId },
        data: { paddleCustomerId: customer.id },
      });
    }

    // Create Paddle transaction with custom_data containing userId
    const successUrl = `${process.env.AUTH_URL || process.env.NEXT_PUBLIC_APP_URL || "https://voidsay.com"}/pro/success`;
    const transaction = await paddle.createCheckoutTransaction({
      priceId: process.env.PADDLE_PRICE_ID!,
      customerId: customer.id,
      userId,
      successUrl,
    });

    return NextResponse.json({
      transactionId: transaction.id,
      environment: paddle.environment,
    });
  } catch (error) {
    console.error("[PADDLE_CHECKOUT_ERROR]", error);
    const message =
      error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
