import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { LemonSqueezySDK } from "@/lib/ls-server";

export const dynamic = "force-dynamic";

/**
 * Resolve user ID from LS webhook payload.
 * Checks custom_data, then falls back to DB lookup by subscription/customer ID.
 */
async function resolveUserId(event: any): Promise<string | null> {
  // 1. custom_data from order/subscription
  const customData = event.data?.attributes?.custom_data || event.meta?.custom_data || {};
  if (customData.userId) return customData.userId;

  // 2. Fallback: look up by subscription ID
  const subscriptionId = event.data?.id;
  if (subscriptionId) {
    const user = await prisma.user.findFirst({
      where: { lsSubscriptionId: subscriptionId },
      select: { id: true },
    });
    if (user) return user.id;
  }

  // 3. Fallback: look up by customer ID
  const customerId = event.data?.attributes?.customer_id;
  if (customerId) {
    const user = await prisma.user.findFirst({
      where: { lsCustomerId: String(customerId) },
      select: { id: true },
    });
    if (user) return user.id;
  }

  return null;
}

/**
 * Lemon Squeezy webhook handler.
 *
 * Events handled:
 * - order_created              → new order (first reliable subscription ID)
 * - subscription_created       → subscription started
 * - subscription_updated       → status changed
 * - subscription_cancelled     → cancelled
 * - subscription_expired       → expired
 * - subscription_payment_success → renewal payment succeeded
 * - subscription_payment_failed  → payment failed
 */
export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-signature") || "";

    // Verify webhook signature
    const ls = new LemonSqueezySDK();
    if (!ls.verifyWebhook(rawBody, signature)) {
      console.error("[LS_WEBHOOK] Signature verification failed");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const event = JSON.parse(rawBody);
    const eventName = event.meta?.event_name;
    const eventData = event.data;

    console.log(`[LS_WEBHOOK] Received event: ${eventName}`);

    // Handle order_created — first reliable subscription ID
    if (eventName === "order_created") {
      const customData = eventData?.attributes?.custom_data || {};
      const userId = customData.userId;
      const firstSubItem = eventData?.attributes?.first_order_item;
      const subscriptionId = firstSubItem?.subscription_id || null;
      const customerId = eventData?.attributes?.customer_id;

      if (userId) {
        await prisma.user.update({
          where: { id: userId },
          data: {
            isPro: true,
            subscriptionStatus: "active",
            lsCustomerId: customerId ? String(customerId) : undefined,
            lsSubscriptionId: subscriptionId || undefined,
          },
        });
        console.log(
          `[LS_WEBHOOK] User ${userId} upgraded to Pro (sub: ${subscriptionId})`
        );
      } else {
        console.warn("[LS_WEBHOOK] order_created: no userId in custom_data, skipping");
      }
      return NextResponse.json({ received: true });
    }

    // Handle subscription_created
    if (eventName === "subscription_created") {
      const userId = await resolveUserId(event);
      const status = eventData?.attributes?.status || "active";
      const subId = eventData?.id;

      if (userId) {
        await prisma.user.update({
          where: { id: userId },
          data: {
            isPro: status === "active",
            subscriptionStatus: status,
            lsSubscriptionId: subId,
          },
        });
        console.log(
          `[LS_WEBHOOK] User ${userId} subscription created: ${status}`
        );
      } else {
        console.warn(
          `[LS_WEBHOOK] subscription_created: cannot resolve userId (sub: ${subId})`
        );
      }
      return NextResponse.json({ received: true });
    }

    // Handle subscription_updated
    if (eventName === "subscription_updated") {
      const userId = await resolveUserId(event);
      const status = eventData?.attributes?.status;
      const renewsAt = eventData?.attributes?.renews_at;

      if (userId) {
        const isActive = status === "active";
        await prisma.user.update({
          where: { id: userId },
          data: {
            isPro: isActive,
            subscriptionStatus: status,
            subscriptionEnd: renewsAt ? new Date(renewsAt) : null,
          },
        });
        console.log(
          `[LS_WEBHOOK] User ${userId} subscription updated: ${status}`
        );
      } else {
        console.warn(
          `[LS_WEBHOOK] subscription_updated: cannot resolve userId`
        );
      }
      return NextResponse.json({ received: true });
    }

    // Handle subscription_cancelled
    if (eventName === "subscription_cancelled") {
      const userId = await resolveUserId(event);
      const endsAt = eventData?.attributes?.ends_at;

      if (userId) {
        await prisma.user.update({
          where: { id: userId },
          data: {
            isPro: true, // Pro stays until end of billing period
            subscriptionStatus: "cancelled",
            subscriptionEnd: endsAt ? new Date(endsAt) : null,
          },
        });
        console.log(
          `[LS_WEBHOOK] User ${userId} subscription cancelled (Pro until period end)`
        );
      } else {
        console.warn(
          `[LS_WEBHOOK] subscription_cancelled: cannot resolve userId`
        );
      }
      return NextResponse.json({ received: true });
    }

    // Handle subscription_expired
    if (eventName === "subscription_expired") {
      const userId = await resolveUserId(event);

      if (userId) {
        await prisma.user.update({
          where: { id: userId },
          data: {
            isPro: false,
            subscriptionStatus: "expired",
          },
        });
        console.log(`[LS_WEBHOOK] User ${userId} subscription expired`);
      }
      return NextResponse.json({ received: true });
    }

    // Handle subscription_payment_success (renewal)
    if (eventName === "subscription_payment_success") {
      const userId = await resolveUserId(event);

      if (userId) {
        await prisma.user.update({
          where: { id: userId },
          data: {
            isPro: true,
            subscriptionStatus: "active",
          },
        });
        console.log(`[LS_WEBHOOK] User ${userId} renewal payment succeeded`);
      }
      return NextResponse.json({ received: true });
    }

    // Handle subscription_payment_failed
    if (eventName === "subscription_payment_failed") {
      const userId = await resolveUserId(event);

      if (userId) {
        await prisma.user.update({
          where: { id: userId },
          data: { subscriptionStatus: "past_due" },
        });
        console.log(`[LS_WEBHOOK] User ${userId} payment failed`);
      }
      return NextResponse.json({ received: true });
    }

    console.log(`[LS_WEBHOOK] Unhandled event type: ${eventName}`);
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("[LS_WEBHOOK_ERROR]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
