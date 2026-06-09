import { Environment, Paddle } from "@paddle/paddle-node-sdk";
import crypto from "crypto";

// Initialize Paddle once
const apiKey = process.env.PADDLE_API_KEY;
const environment = (process.env.PADDLE_ENVIRONMENT || "sandbox") as "sandbox" | "production";

let paddle: Paddle | null = null;
function getPaddle(): Paddle {
  if (!paddle && apiKey) {
    paddle = new Paddle(apiKey, {
      environment: environment === "production" ? Environment.production : Environment.sandbox,
    });
  }
  if (!paddle) {
    throw new Error("Paddle is not initialized — check PADDLE_API_KEY");
  }
  return paddle;
}

/**
 * Paddle SDK wrapper for VoidSay Pro subscription management.
 * Handles checkouts, webhooks, and subscription lifecycle.
 */
export class PaddleSDK {
  private priceId: string;

  constructor() {
    const priceId = process.env.PADDLE_PRICE_ID;
    if (!priceId) {
      throw new Error("PADDLE_PRICE_ID is required");
    }
    this.priceId = priceId;
  }

  /**
   * Create a Paddle transaction and return the transaction ID.
   * The client will use Paddle.js to open the checkout overlay with this ID.
   */
  async createTransaction(params: {
    userId: string;
    email: string;
    name?: string;
  }): Promise<{ transactionId: string }> {
    const p = getPaddle();

    const transaction = await p.transactions.create({
      items: [
        {
          priceId: this.priceId,
          quantity: 1,
        },
      ],
      customData: { userId: params.userId },
    });

    if (!transaction || !transaction.id) {
      throw new Error("Paddle transaction creation failed");
    }

    return { transactionId: transaction.id };
  }

  /**
   * Verify a Paddle webhook signature.
   * Paddle sends raw body with Paddle-Signature header.
   * Format: ts=...;h1=...
   */
  verifyWebhook(rawBody: string, signatureHeader: string): boolean {
    const secret = process.env.PADDLE_WEBHOOK_SECRET;
    if (!secret) {
      console.error("[PADDLE_WEBHOOK] Missing PADDLE_WEBHOOK_SECRET");
      return false;
    }

    // Parse the signature header: ts=...;h1=...
    const sigParams = new Map<string, string>();
    signatureHeader.split(";").forEach((part) => {
      const [key, value] = part.trim().split("=");
      if (key && value) sigParams.set(key, value);
    });

    const ts = sigParams.get("ts");
    const h1 = sigParams.get("h1");

    if (!ts || !h1) {
      console.error("[PADDLE_WEBHOOK] Missing ts or h1 in signature header");
      return false;
    }

    // Recompute signature: hmac(ts + ":" + rawBody)
    const payload = `${ts}:${rawBody}`;
    const computed = crypto
      .createHmac("sha256", secret)
      .update(payload)
      .digest("hex");

    return crypto.timingSafeEqual(Buffer.from(computed), Buffer.from(h1));
  }

  /**
   * Get the customer portal URL for subscription self-service.
   * Paddle doesn't have a direct "customer portal URL" API for v1 billing.
   * The vendor dashboard URL serves as the management portal.
   */
  getCustomerPortalUrl(_customerId: string): string {
    return environment === "production"
      ? "https://vendors.paddle.com/subscriptions/customers"
      : "https://sandbox-vendors.paddle.com/subscriptions/customers";
  }

  /**
   * Get subscription details by subscription ID.
   */
  async getSubscription(subscriptionId: string): Promise<{
    status: string;
    nextBilledAt: string | null;
  } | null> {
    try {
      const p = getPaddle();
      const sub = await p.subscriptions.get(subscriptionId);

      if (!sub) return null;

      return {
        status: sub.status,
        nextBilledAt: sub.nextBilledAt || null,
      };
    } catch (error) {
      console.error("[PADDLE] getSubscription error:", error);
      return null;
    }
  }
}
