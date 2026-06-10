import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyWebhook } from "@/lib/ls-server";

export const dynamic = "force-dynamic";

/**
 * Look up a user by LS subscription or customer ID.
 */
async function findUserByLSData(eventData: any): Promise<{ id: string } | null> {
  const subscriptionId = eventData?.id;
  const customerId = eventData?.attributes?.customer_id;

  if (subscriptionId) {
    const bySub = await prisma.user.findFirst({
      where: { lsSubscriptionId: String(subscriptionId) },
      select: { id: true },
    });
    if (bySub) return bySub;
  }

  if (customerId) {
    const byCust = await prisma.user.findFirst({
      where: { lsCustomerId: String(customerId) },
      select: { id: true },
    });
    if (byCust) return byCust;
  }

  return null;
}

/**
 * Lemon Squeezy webhook handler.
 *
 * Events handled:
 * - order_created              → first payment completed
 * - subscription_created       → subscription started
 * - subscription_updated       → status change, renewal, etc.
 * - subscription_cancelled      → subscription cancelled
 * - subscription_expired        → subscription fully expired
 * - subscription_payment_failed → payment failed
 */
export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-signature") || "";

    if (!verifyWebhook(rawBody, signature)) {
      console.error("[LS_WEBHOOK] Signature verification failed");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const event = JSON.parse(rawBody);
    const eventName = event.meta?.event_name;
    const eventData = event.data;
    console.log(`[LS_WEBHOOK] Received event: ${eventName}`);

    const customData = event.meta?.custom_data || {};

    const resolveUserId = async (): Promise<string | null> => {
      if (customData.user_id) return customData.user_id;
      const user = await findUserByLSData(eventData);
      return user?.id || null;
    };

    // Handle order_created — first payment succeeded
    if (eventName === "order_created") {
      const orderUserId = customData.user_id;
      const subscriptionId = eventData?.attributes?.subscription_id || null;

      if (orderUserId) {
        await prisma.user.update({
          where: { id: orderUserId },
          data: {
            isPro: true,
            subscriptionStatus: "active",
            lsCustomerId: String(eventData?.attributes?.customer_id || ""),
            lsSubscriptionId: subscriptionId ? String(subscriptionId) : null,
            lsVariantId: String(eventData?.attributes?.variant_id || ""),
          },
        });
        console.log(
          `[LS_WEBHOOK] User ${orderUserId} upgraded to Pro (sub: ${subscriptionId})`
        );
      }
      return NextResponse.json({ received: true });
    }

    // Handle subscription_created
    if (eventName === "subscription_created") {
      const subUserId = await resolveUserId();
      const subId = String(eventData.id);
      const status = eventData.attributes?.status || "active";

      if (subUserId) {
        await prisma.user.update({
          where: { id: subUserId },
          data: {
            isPro: status === "active" || status === "on_trial",
            subscriptionStatus: status,
            lsSubscriptionId: subId,
            lsCustomerId: String(eventData.attributes?.customer_id || ""),
            lsVariantId: String(eventData.attributes?.variant_id || ""),
          },
        });
        console.log(
          `[LS_WEBHOOK] User ${subUserId} subscription created: ${status}`
        );
      }
      return NextResponse.json({ received: true });
    }

    // Handle subscription_updated
    if (eventName === "subscription_updated") {
      const subUserId = await resolveUserId();
      const status = eventData.attributes?.status;

      if (subUserId) {
        const isActive = status === "active" || status === "on_trial";
        await prisma.user.update({
          where: { id: subUserId },
          data: {
            isPro: isActive,
            subscriptionStatus: status,
            subscriptionEnd: eventData.attributes?.renews_at
              ? new Date(eventData.attributes.renews_at)
              : null,
          },
        });
        console.log(
          `[LS_WEBHOOK] User ${subUserId} subscription updated: ${status}`
        );
      }
      return NextResponse.json({ received: true });
    }

    // Handle subscription_cancelled
    if (eventName === "subscription_cancelled") {
      const subUserId = await resolveUserId();
      const endsAt = eventData.attributes?.ends_at;

      if (subUserId) {
        await prisma.user.update({
          where: { id: subUserId },
          data: {
            isPro: true, // Pro until billing period ends
            subscriptionStatus: "cancelled",
            subscriptionEnd: endsAt ? new Date(endsAt) : null,
          },
        });
        console.log(
          `[LS_WEBHOOK] User ${subUserId} subscription cancelled (Pro until period end)`
        );
      }
      return NextResponse.json({ received: true });
    }

    // Handle subscription_expired
    if (eventName === "subscription_expired") {
      const subUserId = await resolveUserId();

      if (subUserId) {
        await prisma.user.update({
          where: { id: subUserId },
          data: {
            isPro: false,
            subscriptionStatus: "expired",
          },
        });
        console.log(
          `[LS_WEBHOOK] User ${subUserId} Pro subscription expired`
        );
      }
      return NextResponse.json({ received: true });
    }

    // Handle subscription_payment_failed
    if (eventName === "subscription_payment_failed") {
      const subUserId = await resolveUserId();

      if (subUserId) {
        await prisma.user.update({
          where: { id: subUserId },
          data: { subscriptionStatus: "past_due" },
        });
        console.log(`[LS_WEBHOOK] User ${subUserId} payment failed`);
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
