import { Paddle as PaddleSDKClient, Environment, type EventEntity } from "@paddle/paddle-node-sdk";

/**
 * Paddle SDK wrapper for VoidSay Pro subscription management.
 * Handles customers, transactions, subscriptions, and webhooks.
 */
export class PaddleSDK {
  private client: PaddleSDKClient;
  private isSandbox: boolean;

  constructor() {
    const apiKey = process.env.PADDLE_API_KEY;
    if (!apiKey) {
      throw new Error("PADDLE_API_KEY is not set");
    }
    this.isSandbox = process.env.PADDLE_ENVIRONMENT !== "live";
    this.client = new PaddleSDKClient(apiKey, {
      environment: this.isSandbox ? Environment.sandbox : Environment.production,
    });
  }

  get environment(): string {
    return this.isSandbox ? "sandbox" : "production";
  }

  /**
   * Find or create a Paddle customer for the given user.
   * Uses paddleCustomerId from DB first, then falls back to email lookup.
   */
  async findOrCreateCustomer(params: {
    userId: string;
    email: string;
    name?: string;
    paddleCustomerId?: string | null;
  }): Promise<{ id: string }> {
    // If user already has a paddleCustomerId, verify it exists
    if (params.paddleCustomerId) {
      try {
        const customer = await this.client.customers.get(params.paddleCustomerId);
        if (customer) return { id: customer.id };
      } catch {
        // Customer not found — create a new one below
      }
    }

    // Look up by email
    const collection = await this.client.customers.list({ email: [params.email] });
    const customers = await collection.next();
    if (customers.length > 0) {
      return { id: customers[0].id };
    }

    // Create new customer
    const newCustomer = await this.client.customers.create({
      email: params.email,
      name: params.name || params.email,
    });
    return { id: newCustomer.id };
  }

  /**
   * Create a Paddle transaction for the checkout flow.
   * Returns the transaction ID for Paddle.js Checkout.open().
   */
  async createCheckoutTransaction(params: {
    priceId: string;
    customerId: string;
    userId: string;
    successUrl: string;
  }): Promise<{ id: string }> {
    const transaction = await this.client.transactions.create({
      items: [
        {
          priceId: params.priceId,
          quantity: 1,
        },
      ],
      customerId: params.customerId,
      customData: { userId: params.userId },
      checkout: {
        url: params.successUrl,
      },
    });

    return { id: transaction.id };
  }

  /**
   * Verify and unmarshal a Paddle webhook event.
   */
  async verifyWebhook(
    rawBody: string,
    signature: string,
  ): Promise<EventEntity | null> {
    const secret = process.env.PADDLE_WEBHOOK_SECRET;
    if (!secret) return null;

    try {
      const event = await this.client.webhooks.unmarshal(
        rawBody,
        secret,
        signature,
      );
      return event;
    } catch (error) {
      console.error("[PADDLE_WEBHOOK] Signature verification failed:", error);
      return null;
    }
  }

  /**
   * Create a customer portal session for subscription management.
   */
  async createCustomerPortalSession(customerId: string): Promise<{ url: string }> {
    const session = await this.client.customerPortalSessions.create(customerId, []);
    return {
      url: session.urls.general.overview,
    };
  }

  /**
   * Get subscription details by ID.
   */
  async getSubscription(subscriptionId: string) {
    try {
      return await this.client.subscriptions.get(subscriptionId);
    } catch {
      return null;
    }
  }
}
