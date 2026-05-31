import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refund Policy - VoidSay",
  description: "VoidSay Refund Policy",
};

export default function RefundPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-16 prose prose-gray dark:prose-invert">
      <h1 className="text-3xl font-bold mb-8">Refund Policy</h1>
      <p className="text-sm text-gray-500 mb-8">Last updated: May 31, 2026</p>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">1. Subscription Refunds</h2>
        <p>
          VoidSay offers a Pro subscription at $29/month. We want you to be satisfied with our
          Service. Our refund policy is as follows:
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">2. 7-Day Money-Back Guarantee</h2>
        <p>
          If you are not satisfied with your Pro subscription, you may request a full refund within
          7 days of your initial purchase. To request a refund, please contact us at{" "}
          <a href="mailto:repontage@gmail.com" className="text-blue-600 hover:underline">
            repontage@gmail.com
          </a>{" "}
          with your account email and purchase details.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">3. Renewal Charges</h2>
        <p>
          Pro subscriptions automatically renew each month. Renewal charges are generally
          non-refundable. However, if you were charged after cancelling your subscription due to a
          processing delay, please contact us and we will issue a refund for the unintended charge.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">4. How to Cancel</h2>
        <p>
          You can cancel your Pro subscription at any time through the account management portal
          at{" "}
          <a href="/pro/manage" className="text-blue-600 hover:underline">
            voidsay.com/pro/manage
          </a>. Upon cancellation, you will continue to have Pro access until the end of your
          current billing period. No partial refunds are provided for unused portions of a billing
          period.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">5. Processing Time</h2>
        <p>
          Approved refunds are processed through Paddle, our payment provider. Refunds typically
          appear in your account within 5-10 business days, depending on your payment method and
          financial institution.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">6. Exceptions</h2>
        <p>Refunds may be denied in cases of:</p>
        <ul className="list-disc pl-6 space-y-2 mt-2">
          <li>Violation of our Terms of Service</li>
          <li>Fraudulent or abusive usage patterns</li>
          <li>Chargeback abuse</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">7. Contact</h2>
        <p>
          For refund requests or questions, please contact us at{" "}
          <a href="mailto:repontage@gmail.com" className="text-blue-600 hover:underline">
            repontage@gmail.com
          </a>.
        </p>
      </section>
    </main>
  );
}
