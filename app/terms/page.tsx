import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service - VoidSay",
  description: "VoidSay Terms of Service",
};

export default function TermsPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-16 text-gray-900 dark:text-gray-100 leading-relaxed">
      <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">Terms of Service</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">Last updated: July 5, 2026</p>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">1. Acceptance of Terms</h2>
        <p className="text-gray-700 dark:text-gray-300">
          By accessing or using VoidSay (&ldquo;the Service&rdquo;), operated by Yeonwoo Jung
          (&ldquo;VoidSay,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;), you agree
          to be bound by these Terms of Service and our Privacy Policy. If you do not agree, please do
          not use the Service.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">2. Service Provider Information</h2>
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 text-sm">
          <p className="text-gray-700 dark:text-gray-300"><strong className="text-gray-900 dark:text-white">Operator:</strong> Yeonwoo Jung (정연우)</p>
          <p className="text-gray-700 dark:text-gray-300"><strong className="text-gray-900 dark:text-white">Address:</strong> Seoul, Gwangjin-gu, 05001, Republic of Korea</p>
          <p className="text-gray-700 dark:text-gray-300"><strong className="text-gray-900 dark:text-white">Email:</strong> repontage@gmail.com</p>
          <p className="text-gray-700 dark:text-gray-300"><strong className="text-gray-900 dark:text-white">Business Registration:</strong> Pending (Individual Developer/Sole Proprietor)</p>
          <p className="text-gray-700 dark:text-gray-300"><strong className="text-gray-900 dark:text-white">EU Representative (GDPR Art. 27):</strong> DataRep —{" "}
            <a href="https://www.datarep.com/data-request" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">
              datarep.com/data-request
            </a>
          </p>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">3. Description of Service</h2>
        <p className="text-gray-700 dark:text-gray-300">
          VoidSay is a universal commenting platform that allows users to create and participate
          in discussion threads on any URL across the internet. The Service includes both free
          and paid (Pro) subscription tiers. Pro subscriptions are processed by Lemon Squeezy, our
          third-party payment provider (Merchant of Record).
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">4. Eligibility & Age Verification</h2>
        <p className="text-gray-700 dark:text-gray-300">
          You must be at least 13 years old (or the applicable minimum age in your country:
          14 in South Korea, up to 16 in some EU countries per GDPR Article 8) to use the Service.
          By creating an account, you represent and warrant that you meet the applicable age
          requirement. We implement age verification at account creation and reserve the right to
          request additional verification. If you are under the age of majority in your jurisdiction,
          you must have parental or guardian consent.
        </p>
        <p className="text-gray-700 dark:text-gray-300 mt-2">
          You are responsible for maintaining the confidentiality of your account credentials.
          You must provide accurate and complete information when creating an account.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">5. Pro Subscription & Billing</h2>
        <p className="text-gray-700 dark:text-gray-300">
          VoidSay offers a Pro subscription at $29/month. Subscriptions are billed monthly and
          automatically renew until cancelled. Payments are processed by Lemon Squeezy, and by subscribing
          you agree to Lemon Squeezy&apos;s terms of service. You may cancel your subscription at any time
          through the account management portal. Upon cancellation, you will retain Pro access
          until the end of the current billing period. See our Refund Policy for details on
          cancellations and refunds.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">6. Right of Withdrawal (EU/EEA Consumers)</h2>
        <p className="text-gray-700 dark:text-gray-300">
          If you are a consumer residing in the European Union or European Economic Area, you have
          the right to withdraw from your Pro subscription within 14 days of purchase without giving
          any reason, in accordance with the EU Consumer Rights Directive (2011/83/EU). To exercise
          this right, contact us at{" "}
          <a href="mailto:repontage@gmail.com" className="text-blue-600 dark:text-blue-400 hover:underline">repontage@gmail.com</a>
          . However, if you explicitly consent to the immediate performance of the digital service
          and acknowledge that you lose your right of withdrawal upon full performance, the 14-day
          withdrawal period may not apply. Refunds will be processed within 14 days of receiving
          your withdrawal notice. For detailed refund procedures, see our{" "}
          <a href="/refund" className="text-blue-600 dark:text-blue-400 hover:underline">Refund Policy</a>.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">7. User Content & DMCA Copyright Policy</h2>
        <p className="text-gray-700 dark:text-gray-300">
          You retain ownership of content you post on VoidSay. By posting, you grant VoidSay a
          worldwide, non-exclusive, royalty-free license to display and distribute your content
          on the Service (including via ActivityPub/Fediverse federation for public content).
          You are solely responsible for the content you post and must not post
          illegal, harmful, or infringing content.
        </p>

        <h3 className="text-lg font-semibold mt-4 mb-2 text-gray-900 dark:text-white">DMCA Notice & Takedown (17 U.S.C. § 512)</h3>
        <p className="text-gray-700 dark:text-gray-300">
          VoidSay respects intellectual property rights and complies with the Digital Millennium
          Copyright Act (DMCA). Our designated DMCA agent is registered with the U.S. Copyright Office.
          If you believe that content on VoidSay infringes your copyright, please send a DMCA
          takedown notice to{" "}
          <a href="mailto:repontage@gmail.com" className="text-blue-600 dark:text-blue-400 hover:underline">
            repontage@gmail.com
          </a>{" "}
          with the following information:
        </p>
        <ul className="list-disc pl-6 space-y-2 mt-2 text-gray-700 dark:text-gray-300">
          <li>A physical or electronic signature of the copyright owner or authorized agent</li>
          <li>Identification of the copyrighted work claimed to have been infringed</li>
          <li>Identification of the infringing material and its location on the Service (URL)</li>
          <li>Your contact information (name, address, phone, email)</li>
          <li>A statement that you have a good faith belief that the use is not authorized</li>
          <li>A statement, under penalty of perjury, that the information in the notice is accurate</li>
        </ul>

        <h3 className="text-lg font-semibold mt-4 mb-2 text-gray-900 dark:text-white">Counter-Notification</h3>
        <p className="text-gray-700 dark:text-gray-300">
          If your content was removed due to a DMCA notice and you believe it was removed in error,
          you may file a counter-notification with the above information plus a statement that you
          consent to the jurisdiction of the federal district court for your judicial district (or
          any U.S. district court if outside the U.S.) and will accept service from the complaining
          party. We will forward the counter-notification to the original complainant and may restore
          the content within 10-14 business days unless a court action is filed.
        </p>
        <p className="text-gray-700 dark:text-gray-300 mt-2">
          VoidSay has a policy of terminating, in appropriate circumstances, the accounts of
          repeat infringers.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">8. Content Moderation & Appeals (EU DSA)</h2>
        <p className="text-gray-700 dark:text-gray-300">
          VoidSay uses a combination of automated tools and human review to moderate content.
          We may remove, hide, or restrict content that violates these Terms. For users in the
          European Union, in accordance with the Digital Services Act (DSA):
        </p>
        <ul className="list-disc pl-6 space-y-2 mt-2 text-gray-700 dark:text-gray-300">
          <li>You will receive a clear statement of reasons when your content is removed or restricted</li>
          <li>You have the right to appeal moderation decisions through our internal complaint-handling system by contacting{" "}
            <a href="mailto:repontage@gmail.com" className="text-blue-600 dark:text-blue-400 hover:underline">repontage@gmail.com</a></li>
          <li>Appeals will be reviewed and responded to within a reasonable timeframe</li>
          <li>You may also seek out-of-court dispute resolution through certified bodies designated under the DSA</li>
          <li>We publish transparency reports on our content moderation practices periodically</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">9. Prohibited Conduct</h2>
        <p className="text-gray-700 dark:text-gray-300">You agree not to:</p>
        <ul className="list-disc pl-6 space-y-2 mt-2 text-gray-700 dark:text-gray-300">
          <li>Post spam, malicious content, or engage in harassment or hate speech</li>
          <li>Attempt to gain unauthorized access to the Service</li>
          <li>Use the Service for any illegal purpose</li>
          <li>Violate the intellectual property rights of others</li>
          <li>Use automated means (bots, scrapers) without our permission</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">10. Termination</h2>
        <p className="text-gray-700 dark:text-gray-300">
          We reserve the right to suspend or terminate your account at any time for violation
          of these terms, with or without notice. You may delete your account at any time
          through the account settings. Upon termination, your right to use the Service will
          immediately cease. Sections that by their nature should survive termination
          (including disclaimers, limitations of liability, and indemnification) will survive.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">11. Disclaimer of Warranties</h2>
        <p className="text-gray-700 dark:text-gray-300">
          THE SERVICE IS PROVIDED &ldquo;AS IS&rdquo; AND &ldquo;AS AVAILABLE&rdquo; WITHOUT
          WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. TO THE EXTENT PERMITTED BY APPLICABLE
          LAW, WE DISCLAIM ALL WARRANTIES INCLUDING IMPLIED WARRANTIES OF MERCHANTABILITY,
          FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. WE DO NOT GUARANTEE UNINTERRUPTED,
          SECURE, OR ERROR-FREE OPERATION OF THE SERVICE.
        </p>
        <p className="text-gray-700 dark:text-gray-300 mt-2">
          <strong className="text-gray-900 dark:text-white">Note for Australian Consumers:</strong> Nothing
          in these terms excludes, restricts, or modifies any right or remedy you may have under the
          Australian Consumer Law (Schedule 2 of the Competition and Consumer Act 2010 (Cth)), including
          any statutory guarantees that cannot be excluded. To the extent VoidSay is permitted to limit
          its liability under the Australian Consumer Law, our liability is limited to (at our option)
          the re-supply of the services or the payment of the cost of having them re-supplied.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">12. Limitation of Liability</h2>
        <p className="text-gray-700 dark:text-gray-300">
          TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, VOIDSAY AND ITS OPERATOR SHALL
          NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE
          DAMAGES, INCLUDING LOSS OF PROFITS, DATA, OR GOODWILL, ARISING FROM YOUR USE OF
          THE SERVICE. OUR TOTAL LIABILITY FOR ANY CLAIM ARISING FROM THESE TERMS OR THE
          SERVICE SHALL NOT EXCEED THE AMOUNT YOU PAID US IN THE 12 MONTHS PRECEDING THE
          CLAIM, OR $100 IF YOU HAVE NOT PAID ANY FEES.
        </p>
        <p className="text-gray-700 dark:text-gray-300 mt-2">
          Some jurisdictions do not allow the exclusion of certain warranties or the limitation
          of liability for certain types of damages. Accordingly, some of the above limitations
          may not apply to you. In such cases, our liability is limited to the fullest extent
          permitted by applicable law.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">13. Changes to Terms</h2>
        <p className="text-gray-700 dark:text-gray-300">
          We reserve the right to modify these Terms at any time. We will notify users of
          material changes by posting a notice on the Service or sending an email. Your
          continued use of the Service after changes become effective constitutes acceptance
          of the updated Terms. If you do not agree to the changes, you must stop using the
          Service.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">14. Governing Law</h2>
        <p className="text-gray-700 dark:text-gray-300">
          These Terms shall be governed by and construed in accordance with the laws of the
          Republic of Korea (South Korea), without regard to conflict of law principles. Any
          disputes arising from these Terms shall be subject to the exclusive jurisdiction of
          the courts of Seoul, Republic of Korea. For users in the European Union, you may
          also have rights under your local consumer protection laws. For Australian consumers,
          the Australian Consumer Law may apply to the extent it cannot be excluded.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">15. Contact</h2>
        <p className="text-gray-700 dark:text-gray-300">
          For questions about these Terms, please contact us at{" "}
          <a href="mailto:repontage@gmail.com" className="text-blue-600 dark:text-blue-400 hover:underline">
            repontage@gmail.com
          </a>.
        </p>
      </section>
    </main>
  );
}
