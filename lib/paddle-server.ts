import { Paddle as PaddleSDKClient } from "@paddle/paddle-node-sdk";
import { Environment } from "@paddle/paddle-node-sdk";

export class PaddleSDK {
  private client: PaddleSDKClient;

  constructor() {
    const apiKey = process.env.PADDLE_API_KEY;
    if (!apiKey) {
      throw new Error("PADDLE_API_KEY is not set");
    }
    const isSandbox = process.env.PADDLE_ENVIRONMENT !== "live";
    this.client = new PaddleSDKClient(apiKey, {
      environment: isSandbox ? Environment.sandbox : Environment.production,
    });
  }

  async getCustomerByEmail(email: string): Promise<{ id: string } | null> {
    const collection = await this.client.customers.list({ email: [email] });
    const customers = await collection.next();
    return customers[0] || null;
  }

  async createCustomer(email: string, name?: string) {
    return await this.client.customers.create({
      email,
      name,
    });
  }

  async createCustomerPortalSession(customerId: string) {
    const session = await this.client.customerPortalSessions.create(customerId, []);
    return {
      url: session.urls.general.overview,
    };
  }
}

/**
 * Paddle webhook payload verification.
 * Implements HMAC signature verification as per Paddle docs.
 */
export function verifyPaddleWebhook(
  payload: string,
  signature: string,
): boolean {
  const secret = process.env.PADDLE_WEBHOOK_SECRET;
  if (!secret) {
    console.warn("PADDLE_WEBHOOK_SECRET is not set — skipping webhook verification");
    return false;
  }

  const crypto = require("crypto");
  const expected = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("hex");

  return crypto.timingSafeEqual(
    Buffer.from(expected, "hex"),
    Buffer.from(signature, "hex"),
  );
}
