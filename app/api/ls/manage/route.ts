import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { LemonSqueezySDK } from "@/lib/ls-server";

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
        lsSubscriptionId: true,
        lsCustomerId: true,
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

    const ls = new LemonSqueezySDK();

    // Get subscription details if available
    let subscriptionInfo = null;
    if (user.lsSubscriptionId) {
      subscriptionInfo = await ls.getSubscription(user.lsSubscriptionId);
    }

    return NextResponse.json({
      customerPortalUrl: subscriptionInfo?.customerPortalUrl || null,
      lsSubscriptionId: user.lsSubscriptionId,
      subscriptionStatus: user.subscriptionStatus || subscriptionInfo?.status,
      nextBilledAt: subscriptionInfo?.nextBilledAt || null,
    });
  } catch (error) {
    console.error("[LS_MANAGE_ERROR]", error);
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
        lsSubscriptionId: true,
        isPro: true,
      },
    });

    if (!user || !user.isPro || !user.lsSubscriptionId) {
      return NextResponse.json(
        { error: "No active subscription found" },
        { status: 400 }
      );
    }

    const ls = new LemonSqueezySDK();
    const cancelled = await ls.cancelSubscription(user.lsSubscriptionId);

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
    console.error("[LS_CANCEL_ERROR]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
