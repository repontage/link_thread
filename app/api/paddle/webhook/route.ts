import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("paddle-signature") || "";
    const secret = process.env.PADDLE_WEBHOOK_SECRET;

    // Verify webhook signature
    if (secret) {
      const expected = crypto
        .createHmac("sha256", secret)
        .update(rawBody)
        .digest("hex");

      try {
        const isValid = crypto.timingSafeEqual(
          Buffer.from(expected, "hex"),
          Buffer.from(signature, "hex"),
        );
        if (!isValid) {
          console.error("[PADDLE_WEBHOOK] Invalid signature");
          return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
        }
      } catch {
        console.error("[PADDLE_WEBHOOK] Signature verification failed");
        return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
      }
    } else {
      console.warn("[PADDLE_WEBHOOK] PADDLE_WEBHOOK_SECRET not set — skipping verification");
    }

    const event = JSON.parse(rawBody);
    const eventType = event.event_type;

    // Handle Paddle subscription events
    switch (eventType) {
      case "subscription.created": {
        const subscription = event.data;
        const customData = subscription.custom_data || {};
        const userId = customData.userId;

        if (userId) {
          await prisma.user.update({
            where: { id: userId },
            data: {
              isPro: true,
              subscriptionStatus: "active",
              paddleCustomerId: subscription.customer_id,
              paddleSubscriptionId: subscription.id,
              subscriptionEnd: subscription.current_billing_period?.ends_at
                ? new Date(subscription.current_billing_period.ends_at)
                : null,
            },
          });
          console.log(`[PADDLE_WEBHOOK] User ${userId} upgraded to Pro (sub: ${subscription.id})`);
        }
        break;
      }

      case "subscription.updated": {
        const sub = event.data;
        const status = sub.status;
        const customData = sub.custom_data || {};
        const userId = customData.userId;

        if (userId) {
          await prisma.user.update({
            where: { id: userId },
            data: {
              isPro: status === "active",
              subscriptionStatus: status,
              subscriptionEnd: sub.current_billing_period?.ends_at
                ? new Date(sub.current_billing_period.ends_at)
                : null,
            },
          });
          console.log(`[PADDLE_WEBHOOK] User ${userId} subscription updated: ${status}`);
        }
        break;
      }

      case "subscription.canceled": {
        const sub = event.data;
        const customData = sub.custom_data || {};
        const userId = customData.userId;

        if (userId) {
          await prisma.user.update({
            where: { id: userId },
            data: {
              isPro: false,
              subscriptionStatus: "canceled",
            },
          });
          console.log(`[PADDLE_WEBHOOK] User ${userId} subscription canceled`);
        }
        break;
      }

      default:
        console.log(`[PADDLE_WEBHOOK] Unhandled event type: ${eventType}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("[PADDLE_WEBHOOK_ERROR]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
