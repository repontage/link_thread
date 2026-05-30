import { NextResponse } from "next/server";
import Stripe from "stripe";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = req.headers.get("stripe-signature");

    if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET || !signature) {
      console.warn("Stripe keys or signature missing. Skipping webhook validation.");
      return NextResponse.json({ received: true });
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2023-10-16" as any,
    });

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err: any) {
      console.error(`Webhook signature verification failed: ${err.message}`);
      return NextResponse.json({ error: "Webhook signature verification failed" }, { status: 400 });
    }

    const session = event.data.object as any;

    if (event.type === "checkout.session.completed") {
      const userId = session.metadata?.userId;

      if (userId) {
        await prisma.user.update({
          where: { id: userId },
          data: {
            isPro: true,
            subscriptionStatus: "active",
          },
        });
        console.log(`[STRIPE_WEBHOOK] User ${userId} upgraded to Pro.`);
      }
    }

    if (event.type === "customer.subscription.deleted" || event.type === "customer.subscription.updated") {
      const status = session.status;
      const userId = session.metadata?.userId;
      
      if (userId) {
        await prisma.user.update({
          where: { id: userId },
          data: {
            isPro: status === "active",
            subscriptionStatus: status,
          },
        });
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("[STRIPE_WEBHOOK_ERROR]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
