import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { LemonSqueezySDK } from "@/lib/ls-server";

export const dynamic = "force-dynamic";

/**
 * Lemon Squeezy webhook handler.
 * 
 * Events handled:
 * - order_created          → new order with subscription info
 * - subscription_created   → subscription started
 * - subscription_updated   → subscription changed (status change, renewal, etc.)
 * - subscription_cancelled → subscription cancelled
 * - subscription_expired   → subscription ended
 * - subscription_payment_success → payment succeeded
 * - subscription_payment_failed  → payment failed
 */
export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-signature") || "";

    // Verify webhook signature — static call, no STORE_ID/VARIANT_ID needed
    if (!LemonSqueezySDK.verifyWebhook(rawBody, signature)) {
      console.error("[LS_WEBHOOK] Signature verification failed");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const event = JSON.parse(rawBody);
    const eventName = event.meta?.event_name;
    console.log(`[LS_WEBHOOK] Received event: ${eventName}`);

    // Extract custom data from the event meta
    const customData = event.meta?.custom_data || {};

    // For order_created, custom_data is in the order attributes
    if (eventName === "order_created") {
      const orderCustomData = event.data?.attributes?.custom_data || customData;
      const orderUserId = orderCustomData.userId;
      const subscriptionId = event.data?.attributes?.first_subscription_item?.subscription_id
        ? String(event.data.attributes.first_subscription_item.subscription_id)
        : null;

      if (orderUserId) {
        await prisma.user.update({
          where: { id: orderUserId },
          data: {
            isPro: true,
            subscriptionStatus: "active",
            lsCustomerId: event.data?.attributes?.customer_id
              ? String(event.data.attributes.customer_id)
              : undefined,
            lsSubscriptionId: subscriptionId || undefined,
          },
        });
        console.log(`[LS_WEBHOOK] User ${orderUserId} upgraded to Pro (sub: ${subscriptionId})`);
      }
      return NextResponse.json({ received: true });
    }

    // For subscription_created
    if (eventName === "subscription_created") {
      const subUserId = event.data?.attributes?.custom_data?.userId || customData.userId;
      const subId = String(event.data.id);
      const status = event.data?.attributes?.status || "active";

      if (subUserId) {
        await prisma.user.update({
          where: { id: subUserId },
          data: {
            isPro: status === "active" || status === "on_trial",
            subscriptionStatus: status,
            lsSubscriptionId: subId,
          },
        });
        console.log(`[LS_WEBHOOK] User ${subUserId} subscription created: ${status}`);
      }
      return NextResponse.json({ received: true });
    }

    // For subscription_updated
    if (eventName === "subscription_updated") {
      const subUserId = event.data?.attributes?.custom_data?.userId || customData.userId;
      const status = event.data?.attributes?.status;

      if (subUserId) {
        const isActive = status === "active" || status === "on_trial";
        await prisma.user.update({
          where: { id: subUserId },
          data: {
            isPro: isActive,
            subscriptionStatus: status,
            subscriptionEnd: event.data?.attributes?.renews_at
              ? new Date(event.data.attributes.renews_at)
              : null,
          },
        });
        console.log(`[LS_WEBHOOK] User ${subUserId} subscription updated: ${status}`);
      }
      return NextResponse.json({ received: true });
    }

    // For subscription_cancelled — keep Pro until billing period ends
    if (eventName === "subscription_cancelled") {
      const subUserId = event.data?.attributes?.custom_data?.userId || customData.userId;
      const endsAt = event.data?.attributes?.ends_at;

      if (subUserId) {
        await prisma.user.update({
          where: { id: subUserId },
          data: {
            isPro: true, // Pro 권한은 청구 주기 종료까지 유지
            subscriptionStatus: "canceled",
            subscriptionEnd: endsAt ? new Date(endsAt) : null,
          },
        });
        console.log(`[LS_WEBHOOK] User ${subUserId} subscription cancelled (Pro until ${endsAt})`);
      }
      return NextResponse.json({ received: true });
    }

    // For subscription_expired — billing period ended, revoke Pro
    if (eventName === "subscription_expired") {
      const subUserId = event.data?.attributes?.custom_data?.userId || customData.userId;

      if (subUserId) {
        await prisma.user.update({
          where: { id: subUserId },
          data: {
            isPro: false,
            subscriptionStatus: "expired",
            subscriptionEnd: null,
          },
        });
        console.log(`[LS_WEBHOOK] User ${subUserId} subscription expired — Pro revoked`);
      }
      return NextResponse.json({ received: true });
    }

    // For payment events
    if (eventName === "subscription_payment_failed" || eventName === "subscription_payment_success") {
      const subUserId = event.data?.attributes?.custom_data?.userId || customData.userId;
      if (eventName === "subscription_payment_failed" && subUserId) {
        await prisma.user.update({
          where: { id: subUserId },
          data: { subscriptionStatus: "past_due" },
        });
        console.log(`[LS_WEBHOOK] User ${subUserId} payment failed — marked past_due`);
      }
      if (eventName === "subscription_payment_success" && subUserId) {
        await prisma.user.update({
          where: { id: subUserId },
          data: { isPro: true, subscriptionStatus: "active" },
        });
        console.log(`[LS_WEBHOOK] User ${subUserId} payment success — Pro re-activated`);
      }
      return NextResponse.json({ received: true });
    }

    console.log(`[LS_WEBHOOK] Unhandled event type: ${eventName}`);
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("[LS_WEBHOOK_ERROR]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
