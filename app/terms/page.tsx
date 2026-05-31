import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service - VoidSay",
  description: "VoidSay Terms of Service",
};

export default function TermsPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-16 prose prose-gray dark:prose-invert">
      <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>
      <p className="text-sm text-gray-500 mb-8">Last updated: May 31, 2026</p>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">1. Acceptance of Terms</h2>
        <p>
          By accessing or using VoidSay (&ldquo;the Service&rdquo;), you agree to be bound by these
          Terms of Service. If you do not agree, please do not use the Service.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">2. Description of Service</h2>
        <p>
          VoidSay is a universal commenting platform that allows users to create and participate in
          discussion threads on any URL across the internet. The Service includes both free and paid
          (Pro) subscription tiers.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">3. User Accounts</h2>
        <p>
          You are responsible for maintaining the confidentiality of your account credentials. You
          must provide accurate and complete information when creating an account. You must be at
          least 13 years old to use the Service.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">4. Pro Subscription</h2>
        <p>
          VoidSay offers a Pro subscription at $29/month. Subscriptions are billed monthly and
          automatically renew until cancelled. You may cancel your subscription at any time through
          the account management portal. Upon cancellation, you will retain Pro access until the end
          of the current billing period.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">5. User Content</h2>
        <p>
          You retain ownership of content you post on VoidSay. By posting, you grant VoidSay a
          worldwide, non-exclusive, royalty-free license to display and distribute your content on
          the Service. You are solely responsible for the content you post and must not post
          illegal, harmful, or infringing content.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">6. Prohibited Conduct</h2>
        <p>You agree not to:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Post spam, malicious content, or engage in harassment</li>
          <li>Attempt to gain unauthorized access to the Service</li>
          <li>Use the Service for any illegal purpose</li>
          <li>Violate the intellectual property rights of others</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">7. Termination</h2>
        <p>
          We reserve the right to suspend or terminate your account at any time for violation of
          these terms. You may delete your account at any time through the account settings.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">8. Disclaimer</h2>
        <p>
          The Service is provided &ldquo;as is&rdquo; without warranties of any kind. We do not
          guarantee uninterrupted or error-free operation of the Service.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">9. Contact</h2>
        <p>
          For questions about these Terms, please contact us at{" "}
          <a href="mailto:repontage@gmail.com" className="text-blue-600 hover:underline">
            repontage@gmail.com
          </a>.
        </p>
      </section>
    </main>
  );
}
