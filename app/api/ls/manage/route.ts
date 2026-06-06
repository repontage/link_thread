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
      select: { lsSubscriptionId: true, isPro: true },
    });

    if (!user || !user.isPro) {
      return NextResponse.json(
        { error: "Pro subscription required" },
        { status: 403 }
      );
    }

    if (!user.lsSubscriptionId) {
      return NextResponse.json(
        { error: "No active subscription found" },
        { status: 400 }
      );
    }

    const ls = new LemonSqueezySDK();
    const subscription = await ls.getSubscription(user.lsSubscriptionId);

    if (!subscription) {
      return NextResponse.json(
        { error: "Failed to retrieve subscription details" },
        { status: 500 }
      );
    }

    // Return the customer portal URL for subscription management
    return NextResponse.json({
      customerPortalUrl: subscription.customerPortalUrl,
      updatePaymentMethodUrl: subscription.updatePaymentMethodUrl,
      status: subscription.status,
    });
  } catch (error) {
    console.error("[LS_MANAGE_ERROR]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
