import { lemonSqueezySetup, createCheckout, getSubscription } from "@lemonsqueezy/lemonsqueezy.js";
import crypto from "crypto";

// Initialize Lemon Squeezy once
const apiKey = process.env.LEMONSQUEEZY_API_KEY;
if (apiKey) {
  lemonSqueezySetup({ apiKey });
}

/**
 * Lemon Squeezy SDK wrapper for VoidSay Pro subscription management.
 * Replaces the Paddle SDK — handles checkouts, webhooks, and subscriptions.
 */
export class LemonSqueezySDK {
  private storeId: string;
  private variantId: string;

  constructor() {
    const storeId = process.env.LEMONSQUEEZY_STORE_ID;
    const variantId = process.env.LEMONSQUEEZY_VARIANT_ID;
    if (!storeId || !variantId) {
      throw new Error("LEMONSQUEEZY_STORE_ID and LEMONSQUEEZY_VARIANT_ID are required");
    }
    this.storeId = storeId;
    this.variantId = variantId;
  }

  /**
   * Create a checkout and return the checkout URL.
   * The user will be redirected to Lemon Squeezy's hosted checkout page.
   * Passes userId via custom data for webhook identification.
   */
  async createCheckout(params: {
    userId: string;
    email: string;
    name?: string;
    successUrl: string;
  }): Promise<{ url: string; id: string }> {
    const response = await createCheckout(this.storeId, this.variantId, {
      productOptions: {
        redirectUrl: params.successUrl,
      },
      checkoutData: {
        email: params.email,
        name: params.name || params.email,
        custom: { userId: params.userId },
      },
      checkoutOptions: {
        embed: false, // Use hosted checkout page — simpler, more reliable
      },
    });

    if (response.error) {
      throw new Error(`Lemon Squeezy checkout creation failed: ${response.error.message}`);
    }

    const checkout = response.data!;
    const checkoutUrl = checkout.data.attributes.url;
    const checkoutId = checkout.data.id;

    return { url: checkoutUrl, id: String(checkoutId) };
  }

  /**
   * Verify a Lemon Squeezy webhook signature.
   * Uses HMAC SHA256 with the webhook secret.
   */
  verifyWebhook(rawBody: string, signature: string): boolean {
    const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;
    if (!secret) {
      console.error("[LS_WEBHOOK] Missing LEMONSQUEEZY_WEBHOOK_SECRET");
      return false;
    }

    const hmac = crypto.createHmac("sha256", secret);
    const digest = hmac.update(rawBody).digest("hex");
    if (digest.length !== signature.length) return false;
    return crypto.timingSafeEqual(
      Buffer.from(digest),
      Buffer.from(signature)
    );
  }

  /**
   * Get subscription details by ID.
   * Returns urls.customer_portal for customer self-service.
   */
  async getSubscription(subscriptionId: string): Promise<{
    status: string;
    renewsAt: string | null;
    customerPortalUrl: string | null;
    updatePaymentMethodUrl: string | null;
  } | null> {
    try {
      const response = await getSubscription(subscriptionId);
      if (response.error || !response.data) return null;

      const attrs = response.data.data.attributes;
      return {
        status: attrs.status,
        renewsAt: attrs.renews_at,
        customerPortalUrl: attrs.urls.customer_portal || null,
        updatePaymentMethodUrl: attrs.urls.update_payment_method || null,
      };
    } catch (error) {
      console.error("[LS] getSubscription error:", error);
      return null;
    }
  }
}
