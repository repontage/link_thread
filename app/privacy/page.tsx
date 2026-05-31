import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy - VoidSay",
  description: "VoidSay Privacy Policy",
};

export default function PrivacyPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-16 prose prose-gray dark:prose-invert">
      <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
      <p className="text-sm text-gray-500 mb-8">Last updated: May 31, 2026</p>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">1. Information We Collect</h2>
        <p>When you use VoidSay, we may collect the following information:</p>
        <ul className="list-disc pl-6 space-y-2 mt-2">
          <li><strong>Account Information:</strong> Email address, display name, and authentication credentials when you create an account.</li>
          <li><strong>Content:</strong> Comments, reactions, and other content you post on the Service.</li>
          <li><strong>Usage Data:</strong> Pages visited, features used, and interaction patterns to improve the Service.</li>
          <li><strong>Payment Information:</strong> Processed securely by Paddle — we do not store your full credit card details.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">2. How We Use Your Information</h2>
        <p>We use your information to:</p>
        <ul className="list-disc pl-6 space-y-2 mt-2">
          <li>Provide and maintain the Service</li>
          <li>Process payments and manage subscriptions</li>
          <li>Personalize your feed and improve content recommendations</li>
          <li>Communicate with you about account updates and service changes</li>
          <li>Detect and prevent abuse, spam, and violations of our Terms</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">3. Data Sharing</h2>
        <p>
          We do not sell your personal data. We may share data with:
        </p>
        <ul className="list-disc pl-6 space-y-2 mt-2">
          <li><strong>Paddle:</strong> Our payment processor, to handle subscriptions and billing.</li>
          <li><strong>Vercel:</strong> Our hosting provider, where service data is stored and processed.</li>
          <li><strong>Turso:</strong> Our database provider, storing user and content data.</li>
          <li><strong>Legal obligations:</strong> When required by law or to protect our rights.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">4. Data Storage & Security</h2>
        <p>
          Your data is stored on Turso (libSQL) databases and Vercel&apos;s infrastructure.
          We implement reasonable security measures to protect your data, including encrypted
          connections (HTTPS/TLS) and secure authentication protocols (WebAuthn/Passkeys).
          However, no method of transmission over the internet is 100% secure.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">5. Cookies</h2>
        <p>
          We use essential cookies for authentication and session management. We may also use
          analytics cookies to understand how the Service is used and improve it.
          You can control cookie preferences through your browser settings.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">6. Your Rights</h2>
        <p>Depending on your jurisdiction, you may have the right to:</p>
        <ul className="list-disc pl-6 space-y-2 mt-2">
          <li>Access the personal data we hold about you</li>
          <li>Request correction or deletion of your data</li>
          <li>Object to or restrict processing of your data</li>
          <li>Data portability</li>
        </ul>
        <p className="mt-2">
          To exercise these rights, contact us at{" "}
          <a href="mailto:repontage@gmail.com" className="text-blue-600 hover:underline">
            repontage@gmail.com
          </a>.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">7. Third-Party Services</h2>
        <p>
          VoidSay may integrate with third-party services (e.g., Paddle for payments, YouTube for
          embedded content). These services have their own privacy policies, and we encourage you
          to review them.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">8. Children&apos;s Privacy</h2>
        <p>
          VoidSay is not intended for use by children under 13. We do not knowingly collect
          personal information from children under 13. If you believe we have collected such
          information, please contact us immediately.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">9. Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. We will notify users of material
          changes through the Service or via email.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">10. Contact</h2>
        <p>
          For privacy-related inquiries, contact us at{" "}
          <a href="mailto:repontage@gmail.com" className="text-blue-600 hover:underline">
            repontage@gmail.com
          </a>.
        </p>
      </section>
    </main>
  );
}
