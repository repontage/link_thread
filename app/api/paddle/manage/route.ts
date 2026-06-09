import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { PaddleSDK } from "@/lib/paddle-server";

export async function POST() {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        paddleSubscriptionId: true,
        paddleCustomerId: true,
        isPro: true,
        subscriptionStatus: true,
      },
    });

    if (!user || !user.isPro) {
      return NextResponse.json(
        { error: "Pro subscription required" },
        { status: 403 }
      );
    }

    const paddle = new PaddleSDK();

    // Get subscription details if available
    let subscriptionInfo = null;
    if (user.paddleSubscriptionId) {
      subscriptionInfo = await paddle.getSubscription(
        user.paddleSubscriptionId
      );
    }

    return NextResponse.json({
      customerPortalUrl: null, // Paddle doesn't provide vendor-hosted portal
      paddleSubscriptionId: user.paddleSubscriptionId,
      subscriptionStatus: user.subscriptionStatus || subscriptionInfo?.status,
      nextBilledAt: subscriptionInfo?.nextBilledAt || null,
    });
  } catch (error) {
    console.error("[PADDLE_MANAGE_ERROR]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

/** Cancel subscription at end of billing period */
export async function DELETE() {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        paddleSubscriptionId: true,
        isPro: true,
      },
    });

    if (!user || !user.isPro || !user.paddleSubscriptionId) {
      return NextResponse.json(
        { error: "No active subscription found" },
        { status: 400 }
      );
    }

    const paddle = new PaddleSDK();
    const cancelled = await paddle.cancelSubscription(user.paddleSubscriptionId);

    if (!cancelled) {
      return NextResponse.json(
        { error: "Failed to cancel subscription" },
        { status: 500 }
      );
    }

    await prisma.user.update({
      where: { id: userId },
      data: { subscriptionStatus: "canceled" },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[PADDLE_CANCEL_ERROR]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

