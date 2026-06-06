import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy - VoidSay",
  description: "VoidSay Privacy Policy",
};

const linkClass = "text-blue-600 dark:text-blue-400 hover:underline";
const sectionH2 = "text-xl font-semibold mb-4 text-gray-900 dark:text-white";
const sectionH3 = "text-lg font-semibold mt-4 mb-2 text-gray-900 dark:text-white";
const bodyText = "text-gray-700 dark:text-gray-300";
const listClass = "list-disc pl-6 space-y-2 mt-2 text-gray-700 dark:text-gray-300";

export default function PrivacyPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-16 text-gray-900 dark:text-gray-100 leading-relaxed">
      <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">Privacy Policy</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">Last updated: May 31, 2026</p>

      <section className="mb-8">
        <h2 className={sectionH2}>1. Information We Collect</h2>
        <p className={bodyText}>When you use VoidSay, we may collect the following personal information:</p>
        <ul className={listClass}>
          <li><strong className="text-gray-900 dark:text-white">Account Information:</strong> Email address, display name, and authentication credentials (Passkeys/WebAuthn).</li>
          <li><strong className="text-gray-900 dark:text-white">Content:</strong> Comments, reactions, upvotes, and other content you post.</li>
          <li><strong className="text-gray-900 dark:text-white">Usage Data:</strong> Pages visited, features used, and interaction patterns for service improvement.</li>
          <li><strong className="text-gray-900 dark:text-white">Payment Information:</strong> Processed by Lemon Squeezy (Merchant of Record) — we do not store your full credit card details. We receive subscription status and transaction IDs from Lemon Squeezy.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className={sectionH2}>2. Legal Basis for Processing (GDPR)</h2>
        <p className={bodyText}>For users in the European Economic Area (EEA) and the UK, we process your personal data on the following legal bases:</p>
        <ul className={listClass}>
          <li><strong className="text-gray-900 dark:text-white">Contractual necessity:</strong> To provide the Service you requested (account creation, comment posting, subscription management).</li>
          <li><strong className="text-gray-900 dark:text-white">Legitimate interests:</strong> To improve and protect our Service (analytics, spam detection, security monitoring).</li>
          <li><strong className="text-gray-900 dark:text-white">Consent:</strong> Where required by law (e.g., non-essential cookies). You may withdraw consent at any time.</li>
          <li><strong className="text-gray-900 dark:text-white">Legal obligation:</strong> To comply with applicable laws and regulations.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className={sectionH2}>3. Purpose of Processing</h2>
        <p className={bodyText}>We use your information to:</p>
        <ul className={listClass}>
          <li>Provide, maintain, and improve the Service</li>
          <li>Process payments and manage Pro subscriptions</li>
          <li>Personalize your feed and content recommendations</li>
          <li>Communicate with you about account updates and service changes</li>
          <li>Detect and prevent abuse, spam, fraud, and Terms violations</li>
          <li>Comply with legal obligations</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className={sectionH2}>4. Data Retention & Destruction</h2>
        <p className={bodyText}>
          We retain your personal data only for as long as necessary to fulfill the purposes
          described in this policy, or as required by law:
        </p>
        <ul className={listClass}>
          <li><strong className="text-gray-900 dark:text-white">Account data:</strong> Retained while your account is active. Upon account deletion, data is removed within 30 days.</li>
          <li><strong className="text-gray-900 dark:text-white">Comments & content:</strong> Retained while your account is active or until you delete them. Anonymized content may be retained for archival purposes.</li>
          <li><strong className="text-gray-900 dark:text-white">Payment records:</strong> Retained for 5 years as required by Korean tax law.</li>
          <li><strong className="text-gray-900 dark:text-white">Usage logs:</strong> Retained for up to 12 months, then anonymized or deleted.</li>
        </ul>
        <p className={`${bodyText} mt-2`}>
          <strong className="text-gray-900 dark:text-white">Destruction method:</strong> Personal data is permanently deleted from our
          databases (Turso/libSQL) and backups. Electronic records are irrecoverably deleted
          using technical measures. Printed records (if any) are shredded.
        </p>
      </section>

      <section className="mb-8">
        <h2 className={sectionH2}>5. Data Sharing & Third-Party Processors</h2>
        <p className={bodyText}>
          We do not sell your personal data. We share data only with the following service
          providers (&ldquo;data processors&rdquo; or &ldquo;수탁사&rdquo;) who process data
          on our behalf:
        </p>
        <div className="overflow-x-auto mt-2 mb-2">
          <table className="w-full text-sm border-collapse border border-gray-300 dark:border-gray-600">
            <thead className="bg-gray-100 dark:bg-gray-800">
              <tr>
                <th className="text-left py-2 px-3 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white">Provider</th>
                <th className="text-left py-2 px-3 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white">Purpose</th>
                <th className="text-left py-2 px-3 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white">Location</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="py-2 px-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300">Lemon Squeezy</td>
                <td className="py-2 px-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300">Payment processing (Merchant of Record)</td>
                <td className="py-2 px-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300">UK / Global</td>
              </tr>
              <tr>
                <td className="py-2 px-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300">Vercel Inc.</td>
                <td className="py-2 px-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300">Hosting & infrastructure</td>
                <td className="py-2 px-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300">USA</td>
              </tr>
              <tr>
                <td className="py-2 px-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300">Turso (ChiselStrike)</td>
                <td className="py-2 px-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300">Database hosting</td>
                <td className="py-2 px-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300">USA</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className={bodyText}>
          We may also disclose data when required by law, to protect our rights, or in
          connection with a business transfer (merger, acquisition, or sale of assets).
        </p>
      </section>

      <section className="mb-8">
        <h2 className={sectionH2}>6. International Data Transfers</h2>
        <p className={bodyText}>
          Your data may be transferred to and processed in countries outside your country of
          residence, including the United States (where Vercel and Turso operate) and the
          United Kingdom (where Lemon Squeezy operates). We ensure appropriate safeguards are in
          place, including standard contractual clauses and reliance on adequacy decisions
          where applicable.
        </p>
      </section>

      <section className="mb-8">
        <h2 className={sectionH2}>7. Data Security</h2>
        <p className={bodyText}>
          We implement reasonable technical and organizational security measures including:
          encrypted connections (HTTPS/TLS 1.3), WebAuthn/Passkey-based passwordless
          authentication, and access controls. However, no method of transmission over the
          internet is 100% secure, and we cannot guarantee absolute security.
        </p>
      </section>

      <section className="mb-8">
        <h2 className={sectionH2}>8. Cookies</h2>
        <p className={bodyText}>
          We use essential cookies for authentication and session management (these are
          strictly necessary and do not require consent under GDPR). We may use analytics
          cookies to understand Service usage — for these, we will request your consent
          where required by law. You can control cookie preferences through your browser
          settings.
        </p>
      </section>

      <section className="mb-8">
        <h2 className={sectionH2}>9. Your Rights</h2>
        <p className={bodyText}>Depending on your jurisdiction, you have the following rights regarding your personal data:</p>

        <h3 className={sectionH3}>For EEA/UK Users (GDPR):</h3>
        <ul className={listClass}>
          <li>Right to access your data</li>
          <li>Right to rectification (correction)</li>
          <li>Right to erasure (&ldquo;right to be forgotten&rdquo;)</li>
          <li>Right to restrict processing</li>
          <li>Right to data portability</li>
          <li>Right to object to processing</li>
          <li>Right to withdraw consent (where processing is based on consent)</li>
          <li>Right to lodge a complaint with your local data protection supervisory authority</li>
        </ul>

        <h3 className={sectionH3}>For Korean Users (개인정보보호법):</h3>
        <ul className={listClass}>
          <li>개인정보 열람 요구권 (Right to access)</li>
          <li>개인정보 정정·삭제 요구권 (Right to correction/deletion)</li>
          <li>개인정보 처리정지 요구권 (Right to suspend processing)</li>
          <li>개인정보 수집·이용·제공 동의 철회권 (Right to withdraw consent)</li>
          <li>개인정보 침해 신고: 개인정보침해 신고센터 (privacy.kisa.or.kr, 국번없이 118)</li>
        </ul>

        <h3 className={sectionH3}>For California Residents (CCPA/CPRA):</h3>
        <ul className={listClass}>
          <li>Right to know what personal information is collected, used, shared, or sold</li>
          <li>Right to delete personal information</li>
          <li>Right to opt-out of the sale or sharing of personal information</li>
          <li>Right to non-discrimination for exercising CCPA rights</li>
          <li><strong className="text-gray-900 dark:text-white">We do not sell your personal information</strong> as defined under the CCPA.</li>
        </ul>

        <p className={`${bodyText} mt-4`}>
          To exercise any of these rights, contact our Privacy Officer at{" "}
          <a href="mailto:repontage@gmail.com" className={linkClass}>
            repontage@gmail.com
          </a>. We will respond within 30 days (or the timeframe required by applicable law).
        </p>
      </section>

      <section className="mb-8">
        <h2 className={sectionH2}>10. Privacy Officer / 개인정보 보호책임자</h2>
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <p className="text-gray-700 dark:text-gray-300"><strong className="text-gray-900 dark:text-white">Name:</strong> Yeonwoo Jung (정연우)</p>
          <p className="text-gray-700 dark:text-gray-300"><strong className="text-gray-900 dark:text-white">Email:</strong> repontage@gmail.com</p>
          <p className="text-gray-700 dark:text-gray-300"><strong className="text-gray-900 dark:text-white">Role:</strong> Developer & Privacy Officer</p>
        </div>
      </section>

      <section className="mb-8">
        <h2 className={sectionH2}>11. Third-Party Services</h2>
        <p className={bodyText}>
          VoidSay may embed or link to third-party content (e.g., YouTube videos, external
          websites). These services have their own privacy policies, and we encourage you to
          review them. We are not responsible for the privacy practices of third parties.
        </p>
      </section>

      <section className="mb-8">
        <h2 className={sectionH2}>12. Children&apos;s Privacy</h2>
        <p className={bodyText}>
          VoidSay is not intended for children under 13 (or the applicable minimum age in your
          country — 14 in South Korea, up to 16 in some EU countries). We do not knowingly
          collect personal information from children under the applicable age. If you believe
          we have inadvertently collected such information, please contact us immediately and
          we will delete it.
        </p>
      </section>

      <section className="mb-8">
        <h2 className={sectionH2}>13. Changes to This Policy</h2>
        <p className={bodyText}>
          We may update this Privacy Policy from time to time. We will notify users of
          material changes by posting a notice on the Service or sending an email. Continued
          use after changes become effective constitutes acceptance of the updated policy.
        </p>
      </section>

      <section className="mb-8">
        <h2 className={sectionH2}>14. Contact</h2>
        <p className={bodyText}>
          For privacy-related inquiries or to exercise your rights, contact our Privacy
          Officer at{" "}
          <a href="mailto:repontage@gmail.com" className={linkClass}>
            repontage@gmail.com
          </a>.
        </p>
      </section>
    </main>
  );
}
