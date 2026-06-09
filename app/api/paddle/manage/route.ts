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

    if (!user.paddleCustomerId) {
      return NextResponse.json(
        { error: "No active subscription found" },
        { status: 400 }
      );
    }

    const paddle = new PaddleSDK();
    const portalUrl = await paddle.getCustomerPortalUrl(user.paddleCustomerId);

    // Also get subscription details if available
    let subscriptionInfo = null;
    if (user.paddleSubscriptionId) {
      subscriptionInfo = await paddle.getSubscription(
        user.paddleSubscriptionId
      );
    }

    return NextResponse.json({
      customerPortalUrl: portalUrl,
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
