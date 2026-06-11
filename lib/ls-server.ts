import {
  lemonSqueezySetup,
  createCheckout,
  getSubscription,
  cancelSubscription,
  getCustomer,
} from "@lemonsqueezy/lemonsqueezy.js";
import crypto from "crypto";

const apiKey = process.env.LEMONSQUEEZY_API_KEY || "";
const storeId = process.env.LEMONSQUEEZY_STORE_ID || "";
const variantId = process.env.LEMONSQUEEZY_VARIANT_ID || "";

function ensureSetup() {
  if (!apiKey) throw new Error("LEMONSQUEEZY_API_KEY is not set");
  if (!storeId) throw new Error("LEMONSQUEEZY_STORE_ID is not set");
  if (!variantId) throw new Error("LEMONSQUEEZY_VARIANT_ID is not set");
  lemonSqueezySetup({ apiKey });
}

/**
 * Create a Lemon Squeezy checkout for VoidSay Pro ($29/mo).
 * Returns the hosted checkout URL.
 */
export async function lsCreateCheckout(params: {
  userId: string;
  email: string;
  name?: string;
}): Promise<{ checkoutUrl: string }> {
  ensureSetup();

  const result = await createCheckout(storeId, variantId, {
    checkoutData: {
      email: params.email,
      name: params.name || "",
      custom: {
        user_id: params.userId,
      },
    },
  });

  const data = result.data as any;
  const checkoutUrl = data?.attributes?.url;
  if (!checkoutUrl) {
    throw new Error("Failed to create Lemon Squeezy checkout: no URL returned");
  }

  return { checkoutUrl };
}

/**
 * Verify Lemon Squeezy webhook signature.
 * LS sends X-Signature header with HMAC-SHA256 of the raw body.
 */
export function verifyWebhook(rawBody: string, signature: string): boolean {
  const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;
  if (!secret) {
    console.error("[LS_WEBHOOK] Missing LEMONSQUEEZY_WEBHOOK_SECRET");
    return false;
  }

  const hmac = crypto.createHmac("sha256", secret);
  hmac.update(rawBody);
  const digest = hmac.digest("hex");

  try {
    return crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(signature));
  } catch {
    return false;
  }
}

/**
 * Get subscription details by subscription ID.
 */
export async function lsGetSubscription(subscriptionId: string): Promise<{
  status: string;
  renewsAt: string | null;
} | null> {
  try {
    ensureSetup();
    const result = await getSubscription(subscriptionId);
    const attrs = (result.data as any)?.attributes;
    if (!attrs) return null;

    return {
      status: attrs.status,
      renewsAt: attrs.renews_at || null,
    };
  } catch (error) {
    console.error("[LS] getSubscription error:", error);
    return null;
  }
}

/**
 * Cancel a subscription at the end of the billing period.
 */
export async function lsCancelSubscription(subscriptionId: string): Promise<boolean> {
  try {
    ensureSetup();
    await cancelSubscription(subscriptionId);
    return true;
  } catch (error) {
    console.error("[LS] cancelSubscription error:", error);
    return false;
  }
}

/**
 * Get customer portal URL for self-service subscription management.
 */
export async function lsGetCustomerPortalUrl(customerId: string): Promise<string | null> {
  try {
    ensureSetup();
    const result = await getCustomer(customerId);
    const urls = (result.data as any)?.attributes?.urls;
    return urls?.customer_portal || null;
  } catch (error) {
    console.error("[LS] getCustomerPortalUrl error:", error);
    return null;
  }
}
