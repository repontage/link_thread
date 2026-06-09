import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { PaddleSDK } from "@/lib/paddle-server";

export const dynamic = "force-dynamic";

/**
 * Look up a user by Paddle subscription or customer ID.
 * Falls back when custom_data.userId is not available in subscription events.
 */
async function findUserByPaddleData(eventData: any): Promise<{ id: string } | null> {
  const subscriptionId = eventData?.id || eventData?.subscription_id;
  const customerId = eventData?.customer_id;

  if (subscriptionId) {
    const bySub = await prisma.user.findFirst({
      where: { paddleSubscriptionId: subscriptionId },
      select: { id: true },
    });
    if (bySub) return bySub;
  }

  if (customerId) {
    const byCust = await prisma.user.findFirst({
      where: { paddleCustomerId: customerId },
      select: { id: true },
    });
    if (byCust) return byCust;
  }

  return null;
}

/**
 * Paddle webhook handler.
 *
 * Events handled:
 * - subscription.created     → subscription started
 * - subscription.updated     → subscription changed (status change, renewal, etc.)
 * - subscription.canceled    → subscription cancelled
 * - subscription.past_due    → payment failed
 * - transaction.completed    → first payment completed
 */
export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const signatureHeader = req.headers.get("paddle-signature") || "";

    // Verify webhook signature
    const paddle = new PaddleSDK();
    if (!paddle.verifyWebhook(rawBody, signatureHeader)) {
      console.error("[PADDLE_WEBHOOK] Signature verification failed");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const event = JSON.parse(rawBody);
    const eventType = event.event_type;
    const eventData = event.data;
    console.log(`[PADDLE_WEBHOOK] Received event: ${eventType}`);

    const customData = eventData?.custom_data || {};

    // Resolve userId — custom_data from transaction, or fallback lookup
    const resolveUserId = async (): Promise<string | null> => {
      if (customData.userId) return customData.userId;
      const user = await findUserByPaddleData(eventData);
      return user?.id || null;
    }

    // Handle transaction.completed — first payment succeeded
    if (eventType === "transaction.completed") {
      const txUserId = customData.userId;
      const subscriptionId = eventData?.subscription_id || null;

      if (txUserId) {
        await prisma.user.update({
          where: { id: txUserId },
          data: {
            isPro: true,
            subscriptionStatus: "active",
            paddleCustomerId: eventData?.customer_id || undefined,
            paddleSubscriptionId: subscriptionId || undefined,
          },
        });
        console.log(
          `[PADDLE_WEBHOOK] User ${txUserId} upgraded to Pro (sub: ${subscriptionId})`
        );
      } else {
        console.warn("[PADDLE_WEBHOOK] transaction.completed: no userId in custom_data, skipping");
      }
      return NextResponse.json({ received: true });
    }

    // Handle subscription.created
    if (eventType === "subscription.created") {
      const subUserId = await resolveUserId();
      const subId = eventData.id;
      const status = eventData.status || "active";

      if (subUserId) {
        await prisma.user.update({
          where: { id: subUserId },
          data: {
            isPro: status === "active" || status === "trialing",
            subscriptionStatus: status,
            paddleSubscriptionId: subId,
          },
        });
        console.log(
          `[PADDLE_WEBHOOK] User ${subUserId} subscription created: ${status}`
        );
      } else {
        console.warn(
          `[PADDLE_WEBHOOK] subscription.created: cannot resolve userId (sub: ${subId})`
        );
      }
      return NextResponse.json({ received: true });
    }

    // Handle subscription.updated
    if (eventType === "subscription.updated") {
      const subUserId = await resolveUserId();
      const status = eventData.status;

      if (subUserId) {
        const isActive = status === "active" || status === "trialing";
        await prisma.user.update({
          where: { id: subUserId },
          data: {
            isPro: isActive,
            subscriptionStatus: status,
            subscriptionEnd: eventData.next_billed_at
              ? new Date(eventData.next_billed_at)
              : null,
          },
        });
        console.log(
          `[PADDLE_WEBHOOK] User ${subUserId} subscription updated: ${status}`
        );
      } else {
        console.warn(
          `[PADDLE_WEBHOOK] subscription.updated: cannot resolve userId`
        );
      }
      return NextResponse.json({ received: true });
    }

    // Handle subscription.canceled — keep Pro until billing period ends
    if (eventType === "subscription.canceled") {
      const subUserId = await resolveUserId();
      const canceledAt = eventData.canceled_at
        ? new Date(eventData.canceled_at)
        : null;

      if (subUserId) {
        await prisma.user.update({
          where: { id: subUserId },
          data: {
            isPro: true, // Pro 권한은 청구 주기 종료까지 유지
            subscriptionStatus: "canceled",
            subscriptionEnd: eventData.current_billing_period?.ends_at
              ? new Date(eventData.current_billing_period.ends_at)
              : canceledAt,
          },
        });
        console.log(
          `[PADDLE_WEBHOOK] User ${subUserId} subscription cancelled (Pro until billing period end)`
        );
      } else {
        console.warn(
          `[PADDLE_WEBHOOK] subscription.canceled: cannot resolve userId`
        );
      }
      return NextResponse.json({ received: true });
    }

    // Handle subscription.past_due — payment failed
    if (eventType === "subscription.past_due") {
      const subUserId = await resolveUserId();

      if (subUserId) {
        await prisma.user.update({
          where: { id: subUserId },
          data: { subscriptionStatus: "past_due" },
        });
        console.log(
          `[PADDLE_WEBHOOK] User ${subUserId} payment past due`
        );
      } else {
        console.warn(
          `[PADDLE_WEBHOOK] subscription.past_due: cannot resolve userId`
        );
      }
      return NextResponse.json({ received: true });
    }

    console.log(`[PADDLE_WEBHOOK] Unhandled event type: ${eventType}`);
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("[PADDLE_WEBHOOK_ERROR]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

