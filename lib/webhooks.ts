import crypto from "crypto";
import prisma from "./prisma";
import { logger } from "./logger";

export interface WebhookEventPayload {
  id: string;
  event: string;
  timestamp: number;
  data: any;
}

/**
 * Dispatches a webhook event to all active subscriptions matching the event type.
 * Runs asynchronously without blocking the caller.
 *
 * @param event The event identifier (e.g. "comment.created", "reaction.created")
 * @param data The payload data associated with the event
 */
export function triggerWebhook(event: string, data: any) {
  // Fire and forget so we don't block the HTTP thread
  triggerWebhookAsync(event, data).catch((err) => {
    logger.error("[Webhook Dispatch] Unhandled error during dispatch:", err);
  });
}

async function triggerWebhookAsync(event: string, data: any) {
  try {
    // Find active subscriptions that match the specific event or are subscribed to all "*"
    const subscriptions = await prisma.webhookSubscription.findMany({
      where: {
        active: true,
        OR: [{ event: event }, { event: "*" }],
      },
    });

    if (subscriptions.length === 0) {
      return;
    }

    const deliveryId = crypto.randomUUID();
    const timestamp = Date.now();
    const payloadEnvelope: WebhookEventPayload = {
      id: deliveryId,
      event,
      timestamp,
      data,
    };

    const payloadString = JSON.stringify(payloadEnvelope);

    logger.info(`[Webhook Dispatch] Triggering event "${event}" (ID: ${deliveryId}) for ${subscriptions.length} subscribers`);

    // Dispatch to all subscribers in parallel
    await Promise.all(
      subscriptions.map(async (sub) => {
        try {
          const headers: Record<string, string> = {
            "Content-Type": "application/json",
            "x-voidsay-delivery-id": deliveryId,
            "x-voidsay-event": event,
            "User-Agent": "VoidSay-Webhook-Dispatcher/1.0",
          };

          if (sub.secret) {
            // Generate HMAC-SHA256 signature
            const hmac = crypto.createHmac("sha256", sub.secret);
            hmac.update(payloadString);
            const signature = hmac.digest("hex");
            headers["x-voidsay-signature"] = `sha256=${signature}`;
          }

          // Fetch with a reasonable timeout (e.g., 5 seconds)
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 5000);

          const response = await fetch(sub.url, {
            method: "POST",
            headers,
            body: payloadString,
            signal: controller.signal,
          });

          clearTimeout(timeoutId);

          if (!response.ok) {
            logger.warn(
              `[Webhook Dispatch] Subscriber ${sub.id} (${sub.url}) responded with status ${response.status}`
            );
          } else {
            logger.info(`[Webhook Dispatch] Event ${deliveryId} delivered to ${sub.url} successfully`);
          }
        } catch (subErr: any) {
          logger.error(
            `[Webhook Dispatch] Failed to deliver event ${deliveryId} to ${sub.url}:`,
            subErr.message || subErr
          );
        }
      })
    );
  } catch (error) {
    logger.error("[Webhook Dispatch] Failed to dispatch webhook:", error);
  }
}
