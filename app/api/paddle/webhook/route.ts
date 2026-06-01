import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("paddle-signature") || "";
    const secret = process.env.PADDLE_WEBHOOK_SECRET;

    // Verify webhook signature
    // Paddle sends header format: "ts=TIMESTAMP;h1=HEX_HASH"
    if (secret) {
      try {
        const sigParts = Object.fromEntries(
          signature.split(";").map((p) => p.split("=")),
        );
        const ts = sigParts["ts"];
        const h1 = sigParts["h1"];

        if (!ts || !h1) {
          console.error("[PADDLE_WEBHOOK] Missing ts or h1 in signature header");
          return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
        }

        const payload = `${ts}:${rawBody}`;
        const expected = crypto
          .createHmac("sha256", secret)
          .update(payload)
          .digest("hex");

        const isValid = crypto.timingSafeEqual(
          Buffer.from(expected, "hex"),
          Buffer.from(h1, "hex"),
        );
        if (!isValid) {
          console.error("[PADDLE_WEBHOOK] Invalid signature");
          return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
        }
      } catch (e) {
        console.error("[PADDLE_WEBHOOK] Signature verification failed:", e);
        return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
      }
    } else {
      console.error("[PADDLE_WEBHOOK] PADDLE_WEBHOOK_SECRET not configured — rejecting all webhooks");
      return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 });
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
