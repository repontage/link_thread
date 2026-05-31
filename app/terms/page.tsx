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
          By accessing or using VoidSay (&ldquo;the Service&rdquo;), operated by an individual
          developer (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;), you agree to be
          bound by these Terms of Service and our Privacy Policy. If you do not agree, please do
          not use the Service.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">2. Description of Service</h2>
        <p>
          VoidSay is a universal commenting platform that allows users to create and participate
          in discussion threads on any URL across the internet. The Service includes both free
          and paid (Pro) subscription tiers. Pro subscriptions are processed by Paddle, our
          third-party payment provider (Merchant of Record).
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">3. Eligibility & User Accounts</h2>
        <p>
          You must be at least 13 years old (or the minimum age required by your country of
          residence, whichever is higher) to use the Service. If you are under the age of
          majority in your jurisdiction, you must have parental or guardian consent.
        </p>
        <p>
          You are responsible for maintaining the confidentiality of your account credentials.
          You must provide accurate and complete information when creating an account.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">4. Pro Subscription & Billing</h2>
        <p>
          VoidSay offers a Pro subscription at $29/month. Subscriptions are billed monthly and
          automatically renew until cancelled. Payments are processed by Paddle, and by subscribing
          you agree to Paddle&apos;s terms of service. You may cancel your subscription at any time
          through the account management portal. Upon cancellation, you will retain Pro access
          until the end of the current billing period. See our Refund Policy for details on
          cancellations and refunds.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">5. User Content & DMCA Notice</h2>
        <p>
          You retain ownership of content you post on VoidSay. By posting, you grant VoidSay a
          worldwide, non-exclusive, royalty-free license to display and distribute your content
          on the Service. You are solely responsible for the content you post and must not post
          illegal, harmful, or infringing content.
        </p>
        <p>
          If you believe that content on VoidSay infringes your copyright, please send a DMCA
          notice to{" "}
          <a href="mailto:repontage@gmail.com" className="text-blue-600 hover:underline">
            repontage@gmail.com
          </a>{" "}
          with: (a) identification of the copyrighted work, (b) identification of the infringing
          material, (c) your contact information, (d) a statement of good faith belief, and
          (e) a statement under penalty of perjury. We will respond to valid DMCA notices in
          accordance with applicable law.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">6. Prohibited Conduct</h2>
        <p>You agree not to:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Post spam, malicious content, or engage in harassment or hate speech</li>
          <li>Attempt to gain unauthorized access to the Service</li>
          <li>Use the Service for any illegal purpose</li>
          <li>Violate the intellectual property rights of others</li>
          <li>Use automated means (bots, scrapers) without our permission</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">7. Termination</h2>
        <p>
          We reserve the right to suspend or terminate your account at any time for violation
          of these terms, with or without notice. You may delete your account at any time
          through the account settings. Upon termination, your right to use the Service will
          immediately cease. Sections that by their nature should survive termination
          (including disclaimers, limitations of liability, and indemnification) will survive.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">8. Disclaimer of Warranties</h2>
        <p>
          THE SERVICE IS PROVIDED &ldquo;AS IS&rdquo; AND &ldquo;AS AVAILABLE&rdquo; WITHOUT
          WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO
          IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND
          NON-INFRINGEMENT. WE DO NOT GUARANTEE UNINTERRUPTED, SECURE, OR ERROR-FREE
          OPERATION OF THE SERVICE.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">9. Limitation of Liability</h2>
        <p>
          TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, VOIDSAY AND ITS OPERATOR SHALL
          NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE
          DAMAGES, INCLUDING LOSS OF PROFITS, DATA, OR GOODWILL, ARISING FROM YOUR USE OF
          THE SERVICE. OUR TOTAL LIABILITY FOR ANY CLAIM ARISING FROM THESE TERMS OR THE
          SERVICE SHALL NOT EXCEED THE AMOUNT YOU PAID US IN THE 12 MONTHS PRECEDING THE
          CLAIM, OR $100 IF YOU HAVE NOT PAID ANY FEES.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">10. Changes to Terms</h2>
        <p>
          We reserve the right to modify these Terms at any time. We will notify users of
          material changes by posting a notice on the Service or sending an email. Your
          continued use of the Service after changes become effective constitutes acceptance
          of the updated Terms. If you do not agree to the changes, you must stop using the
          Service.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">11. Governing Law</h2>
        <p>
          These Terms shall be governed by and construed in accordance with the laws of the
          Republic of Korea (South Korea), without regard to conflict of law principles. Any
          disputes arising from these Terms shall be subject to the exclusive jurisdiction of
          the courts of Seoul, Republic of Korea. For users in the European Union, you may
          also have rights under your local consumer protection laws.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">12. Contact</h2>
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
