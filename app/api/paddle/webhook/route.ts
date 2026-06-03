import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { PaddleSDK } from "@/lib/paddle-server";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("paddle-signature") || "";

    // Verify webhook signature using Paddle SDK
    const paddle = new PaddleSDK();
    const event = await paddle.verifyWebhook(rawBody, signature);

    if (!event) {
      console.error("[PADDLE_WEBHOOK] Signature verification failed");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    console.log(`[PADDLE_WEBHOOK] Received event: ${event.eventType}`);

    // Handle subscription lifecycle events
    switch (event.eventType) {
      case "subscription.activated":
      case "subscription.created": {
        const subscription = event.data;
        const customData = (subscription as any).customData || (subscription as any).custom_data || {};
        const userId = customData.userId;

        if (!userId) {
          console.warn("[PADDLE_WEBHOOK] No userId in custom_data — cannot link subscription");
          break;
        }

        const subscriptionId = (subscription as any).id;
        const customerId = (subscription as any).customerId || (subscription as any).customer_id;

        await prisma.user.update({
          where: { id: userId },
          data: {
            isPro: true,
            subscriptionStatus: "active",
            paddleCustomerId: customerId || undefined,
            paddleSubscriptionId: subscriptionId || undefined,
            subscriptionEnd: (subscription as any).currentBillingPeriod?.endsAt
              ? new Date((subscription as any).currentBillingPeriod.endsAt)
              : null,
          },
        });
        console.log(`[PADDLE_WEBHOOK] User ${userId} upgraded to Pro (sub: ${subscriptionId})`);
        break;
      }

      case "subscription.updated": {
        const sub = event.data;
        const customData = (sub as any).customData || (sub as any).custom_data || {};
        const userId = customData.userId;
        const status = (sub as any).status;

        if (!userId) break;

        await prisma.user.update({
          where: { id: userId },
          data: {
            isPro: status === "active" || status === "trialing",
            subscriptionStatus: status,
            subscriptionEnd: (sub as any).currentBillingPeriod?.endsAt
              ? new Date((sub as any).currentBillingPeriod.endsAt)
              : undefined,
          },
        });
        console.log(`[PADDLE_WEBHOOK] User ${userId} subscription updated: ${status}`);
        break;
      }

      case "subscription.canceled":
      case "subscription.past_due": {
        const sub = event.data;
        const customData = (sub as any).customData || (sub as any).custom_data || {};
        const userId = customData.userId;
        const eventType = event.eventType;

        if (!userId) break;

        const isCanceled = eventType === "subscription.canceled";
        await prisma.user.update({
          where: { id: userId },
          data: {
            isPro: false,
            subscriptionStatus: isCanceled ? "canceled" : "past_due",
          },
        });
        console.log(`[PADDLE_WEBHOOK] User ${userId} subscription ${eventType}`);
        break;
      }

      case "subscription.paused": {
        const sub = event.data;
        const customData = (sub as any).customData || (sub as any).custom_data || {};
        const userId = customData.userId;

        if (!userId) break;

        await prisma.user.update({
          where: { id: userId },
          data: {
            isPro: false,
            subscriptionStatus: "paused",
          },
        });
        console.log(`[PADDLE_WEBHOOK] User ${userId} subscription paused`);
        break;
      }

      case "subscription.resumed": {
        const sub = event.data;
        const customData = (sub as any).customData || (sub as any).custom_data || {};
        const userId = customData.userId;

        if (!userId) break;

        await prisma.user.update({
          where: { id: userId },
          data: {
            isPro: true,
            subscriptionStatus: "active",
          },
        });
        console.log(`[PADDLE_WEBHOOK] User ${userId} subscription resumed`);
        break;
      }

      // transaction.completed can serve as a backup to subscription.activated
      case "transaction.completed": {
        const txn = event.data;
        const customData = (txn as any).customData || (txn as any).custom_data || {};
        const userId = customData.userId;
        const subscriptionId = (txn as any).subscriptionId || (txn as any).subscription_id;

        if (!userId) break;

        // Only update if we don't already have an active subscription via subscription event
        const user = await prisma.user.findUnique({
          where: { id: userId },
          select: { isPro: true },
        });

        if (!user?.isPro) {
          await prisma.user.update({
            where: { id: userId },
            data: {
              isPro: true,
              subscriptionStatus: "active",
              paddleSubscriptionId: subscriptionId || undefined,
            },
          });
          console.log(`[PADDLE_WEBHOOK] User ${userId} Pro activated via transaction.completed`);
        }
        break;
      }

      default:
        console.log(`[PADDLE_WEBHOOK] Unhandled event type: ${event.eventType}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("[PADDLE_WEBHOOK_ERROR]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
