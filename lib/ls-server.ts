import { lemonSqueezySetup, createCheckout, getSubscription, cancelSubscription } from "@lemonsqueezy/lemonsqueezy.js";
import crypto from "crypto";

// Initialize Lemon Squeezy once at module load
const apiKey = process.env.LEMONSQUEEZY_API_KEY;
if (apiKey) {
  lemonSqueezySetup({ apiKey });
}

/**
 * Verify a Lemon Squeezy webhook signature using HMAC SHA256.
 * Standalone function — does not require SDK instantiation.
 * Wraps crypto.timingSafeEqual in try-catch: when buffer lengths differ
 * (e.g. empty/malformed x-signature header), returns false instead of throwing.
 */
export function verifyLemonSqueezyWebhook(rawBody: string, signatureHeader: string): boolean {
  const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;
  if (!secret) {
    console.error("[LS_WEBHOOK] Missing LEMONSQUEEZY_WEBHOOK_SECRET");
    return false;
  }

  try {
    const hmac = crypto.createHmac("sha256", secret);
    const digest = hmac.update(rawBody).digest("hex");
    return crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(signatureHeader));
  } catch {
    return false;
  }
}

/**
 * Lemon Squeezy SDK wrapper for VoidSay Pro subscription management.
 * Handles checkouts, webhooks, and subscription lifecycle.
 *
 * Unlike Paddle's overlay-based approach, LS uses hosted checkout pages.
 * The client redirects users to the LS checkout URL.
 */
export class LemonSqueezySDK {
  private storeId: number;
  private variantId: number;

  constructor() {
    const storeId = process.env.LEMONSQUEEZY_STORE_ID;
    const variantId = process.env.LEMONSQUEEZY_VARIANT_ID;

    if (!storeId || !variantId) {
      throw new Error("LEMONSQUEEZY_STORE_ID and LEMONSQUEEZY_VARIANT_ID are required");
    }

    this.storeId = Number(storeId);
    this.variantId = Number(variantId);
  }

  /**
   * Create a Lemon Squeezy checkout and return the hosted checkout URL.
   * The client will redirect the user to this URL.
   */
  async createCheckout(params: {
    userId: string;
    email: string;
    name?: string;
  }): Promise<{ checkoutUrl: string }> {
    const response = await createCheckout(this.storeId, this.variantId, {
      productOptions: {
        redirectUrl: `${process.env.NEXTAUTH_URL || "https://voidsay.com"}/pro/success`,
      },
      checkoutData: {
        email: params.email,
        name: params.name || undefined,
        custom: { userId: params.userId },
      },
      checkoutOptions: {
        embed: false,
      },
    });

    const checkoutUrl = response.data!.data.attributes.url;
    if (!checkoutUrl) {
      throw new Error("Lemon Squeezy checkout creation failed");
    }

    return { checkoutUrl };
  }

  /**
   * Verify a Lemon Squeezy webhook signature using HMAC SHA256.
   * Delegates to the standalone function.
   */
  verifyWebhook(rawBody: string, signatureHeader: string): boolean {
    return verifyLemonSqueezyWebhook(rawBody, signatureHeader);
  }

  /**
   * Get subscription details by subscription ID.
   */
  async getSubscription(subscriptionId: string): Promise<{
    status: string;
    nextBilledAt: string | null;
    customerPortalUrl: string | null;
  } | null> {
    try {
      const response = await getSubscription(subscriptionId);
      if (!response.data?.data) {
        console.error("[LS] getSubscription: no data in response");
        return null;
      }
      const attrs = response.data.data.attributes;

      return {
        status: attrs.status,
        nextBilledAt: attrs.renews_at || null,
        customerPortalUrl: attrs.urls.customer_portal || null,
      };
    } catch (error) {
      console.error("[LS] getSubscription error:", error);
      return null;
    }
  }

  /**
   * Cancel a subscription using Lemon Squeezy API.
   */
  async cancelSubscription(subscriptionId: string): Promise<boolean> {
    try {
      await cancelSubscription(subscriptionId);
      return true;
    } catch (error) {
      console.error("[LS] cancelSubscription error:", error);
      return false;
    }
  }
}
