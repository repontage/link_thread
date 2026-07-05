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
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">Last updated: July 5, 2026</p>

      <section className="mb-8">
        <h2 className={sectionH2}>1. Information We Collect</h2>
        <p className={bodyText}>When you use VoidSay, we may collect the following personal information:</p>
        <ul className={listClass}>
          <li><strong className="text-gray-900 dark:text-white">Account Information:</strong> Email address, display name, and authentication credentials (Passkeys/WebAuthn).</li>
          <li><strong className="text-gray-900 dark:text-white">Content:</strong> Comments, reactions, upvotes, and other content you post.</li>
          <li><strong className="text-gray-900 dark:text-white">Usage Data:</strong> Pages visited, features used, and interaction patterns for service improvement (only with your consent where required by law).</li>
          <li><strong className="text-gray-900 dark:text-white">Payment Information:</strong> Processed by Lemon Squeezy (Merchant of Record) — we do not store your full credit card details. We receive subscription status and transaction IDs from Lemon Squeezy.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className={sectionH2}>2. Legal Basis for Processing (GDPR)</h2>
        <p className={bodyText}>For users in the European Economic Area (EEA) and the UK, we process your personal data on the following legal bases:</p>
        <ul className={listClass}>
          <li><strong className="text-gray-900 dark:text-white">Contractual necessity:</strong> To provide the Service you requested (account creation, comment posting, subscription management).</li>
          <li><strong className="text-gray-900 dark:text-white">Legitimate interests:</strong> To improve and protect our Service (analytics, spam detection, security monitoring).</li>
          <li><strong className="text-gray-900 dark:text-white">Consent:</strong> Where required by law (e.g., non-essential cookies such as analytics and functional cookies). You may withdraw consent at any time.</li>
          <li><strong className="text-gray-900 dark:text-white">Legal obligation:</strong> To comply with applicable laws and regulations.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className={sectionH2}>3. EU & UK Representative</h2>
        <p className={bodyText}>
          In accordance with Article 27 of the GDPR and Article 27 of the UK GDPR, VoidSay has
          appointed a representative in the European Union and the United Kingdom for data protection
          matters. Data subjects in the EEA and the UK may address inquiries regarding the processing
          of their personal data to:
        </p>
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 mt-2">
          <p className="text-gray-700 dark:text-gray-300"><strong className="text-gray-900 dark:text-white">EU Representative:</strong> DataRep</p>
          <p className="text-gray-700 dark:text-gray-300">
            Via the DataRep web form:{" "}
            <a href="https://www.datarep.com/data-request" target="_blank" rel="noopener noreferrer" className={linkClass}>
              datarep.com/data-request
            </a>
          </p>
          <p className="text-gray-700 dark:text-gray-300 mt-2">Alternatively, you may always contact our Privacy Officer directly at{" "}
            <a href="mailto:repontage@gmail.com" className={linkClass}>repontage@gmail.com</a>.
          </p>
        </div>
      </section>

      <section className="mb-8">
        <h2 className={sectionH2}>4. Purpose of Processing</h2>
        <p className={bodyText}>We use your information to:</p>
        <ul className={listClass}>
          <li>Provide, maintain, and improve the Service</li>
          <li>Process payments and manage Pro subscriptions</li>
          <li>Personalize your feed and content recommendations</li>
          <li>Communicate with you about account updates and service changes</li>
          <li>Detect and prevent abuse, spam, fraud, and Terms violations</li>
          <li>Distribute your public content to linked ActivityPub/Fediverse instances (see Section 6)</li>
          <li>Forward webhook event data to third-party URLs you have registered (see Section 6)</li>
          <li>Comply with legal obligations</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className={sectionH2}>5. Data Retention & Destruction</h2>
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
        <h2 className={sectionH2}>6. Data Sharing & Third-Party Processors</h2>
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

        <h3 className={sectionH3}>ActivityPub / Fediverse Data Sharing</h3>
        <p className={bodyText}>
          VoidSay may offer ActivityPub integration, which enables your public profile information,
          comments, and activity data to be broadcast to federated servers (other Fediverse instances)
          outside of our direct control. Once data is transmitted to a federated server, that server&apos;s
          privacy policy governs further processing. You may opt out of ActivityPub federation by
          adjusting your account settings. By using the Service with federation enabled, you acknowledge
          that your public content may be distributed across the Fediverse.
        </p>

        <h3 className={sectionH3}>Webhook Data Transmission</h3>
        <p className={bodyText}>
          Pro subscribers may configure webhooks that cause comment and reaction data (including data about
          other users) to be transmitted to third-party URLs designated by the subscriber. The subscriber
          is responsible for the privacy practices of the receiving endpoint. We recommend that subscribers
          provide their own privacy notice to users whose data may be received via webhook. If you are a
          user whose data is transmitted via webhook and wish to exercise your rights, contact the webhook
          operator or our Privacy Officer.
        </p>

        <p className={bodyText}>
          We may also disclose data when required by law, to protect our rights, or in
          connection with a business transfer (merger, acquisition, or sale of assets).
        </p>
      </section>

      <section className="mb-8">
        <h2 className={sectionH2}>7. International Data Transfers</h2>
        <p className={bodyText}>
          Your data may be transferred to and processed in countries outside your country of
          residence, including the United States (where Vercel and Turso operate) and the
          United Kingdom (where Lemon Squeezy operates). We ensure appropriate safeguards are in
          place, including standard contractual clauses and reliance on adequacy decisions
          where applicable. For EEA and UK users, we have executed Data Processing Agreements
          (DPAs) with our processors where required. Vercel&apos;s DPA is available at{" "}
          <a href="https://vercel.com/legal/dpa" target="_blank" rel="noopener noreferrer" className={linkClass}>
            vercel.com/legal/dpa
          </a>.
        </p>
      </section>

      <section className="mb-8">
        <h2 className={sectionH2}>8. Data Security</h2>
        <p className={bodyText}>
          We implement reasonable technical and organizational security measures including:
          encrypted connections (HTTPS/TLS 1.3), WebAuthn/Passkey-based passwordless
          authentication, and access controls. However, no method of transmission over the
          internet is 100% secure, and we cannot guarantee absolute security.
        </p>
      </section>

      <section className="mb-8">
        <h2 className={sectionH2}>9. Cookies</h2>
        <p className={bodyText}>
          We use the following categories of cookies:
        </p>
        <ul className={listClass}>
          <li><strong className="text-gray-900 dark:text-white">Essential Cookies:</strong> Required for authentication and session management. These are strictly necessary under GDPR/ePrivacy and do not require consent. They are always active.</li>
          <li><strong className="text-gray-900 dark:text-white">Analytics Cookies:</strong> Used to understand how visitors interact with the Service (via Vercel Analytics). We only set these with your explicit consent. You may withdraw consent at any time by clearing your browser data or adjusting preferences through our cookie consent banner.</li>
          <li><strong className="text-gray-900 dark:text-white">Functional Cookies:</strong> Enable enhanced features such as theme preferences, language settings, and embedded third-party content (YouTube, X/Twitter). These are only set with your consent.</li>
        </ul>
        <p className={`${bodyText} mt-2`}>
          On your first visit, a cookie consent banner will appear allowing you to accept all cookies,
          accept only essential cookies, or customize your preferences. Your choice is stored for 12 months,
          after which we will ask for your consent again. You can change your preferences at any time by
          clearing your browser cookies for our domain, which will cause the consent banner to reappear.
        </p>
      </section>

      <section className="mb-8">
        <h2 className={sectionH2}>10. Automated Decision-Making (GDPR Article 22)</h2>
        <p className={bodyText}>
          VoidSay uses automated content moderation systems to detect and flag potentially harmful
          content (spam, harassment, hate speech). These systems may automatically:
        </p>
        <ul className={listClass}>
          <li>Flag content for administrative review</li>
          <li>Temporarily hide content pending human review (&ldquo;shadow moderation&rdquo;)</li>
          <li>Apply visibility restrictions based on toxicity scoring</li>
        </ul>
        <p className={`${bodyText} mt-2`}>
          <strong className="text-gray-900 dark:text-white">Your rights:</strong> Under GDPR Article 22,
          you have the right not to be subject to a decision based solely on automated processing that
          produces legal effects or similarly significantly affects you. If your content has been
          automatically moderated and you believe the decision was incorrect:
        </p>
        <ul className={listClass}>
          <li>You are notified when your content is flagged or hidden</li>
          <li>You have the right to request human review of any automated moderation decision</li>
          <li>You may appeal moderation decisions by contacting our Privacy Officer at{" "}
            <a href="mailto:repontage@gmail.com" className={linkClass}>repontage@gmail.com</a></li>
          <li>We will respond to appeals within 14 days</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className={sectionH2}>11. Your Rights</h2>
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
          <li>Right not to be subject to automated decision-making (Article 22)</li>
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
        <h2 className={sectionH2}>12. Privacy Officer / 개인정보 보호책임자</h2>
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <p className="text-gray-700 dark:text-gray-300"><strong className="text-gray-900 dark:text-white">Name:</strong> Yeonwoo Jung (정연우)</p>
          <p className="text-gray-700 dark:text-gray-300"><strong className="text-gray-900 dark:text-white">Email:</strong> repontage@gmail.com</p>
          <p className="text-gray-700 dark:text-gray-300"><strong className="text-gray-900 dark:text-white">Role:</strong> Developer & Privacy Officer</p>
          <p className="text-gray-700 dark:text-gray-300 mt-1">
            <strong className="text-gray-900 dark:text-white">EU Representative:</strong> DataRep —{" "}
            <a href="https://www.datarep.com/data-request" target="_blank" rel="noopener noreferrer" className={linkClass}>
              datarep.com/data-request
            </a>
          </p>
        </div>
      </section>

      <section className="mb-8">
        <h2 className={sectionH2}>13. Third-Party Services</h2>
        <p className={bodyText}>
          VoidSay may embed or link to third-party content (e.g., YouTube videos, X/Twitter posts,
          Instagram content via official oEmbed APIs). These services have their own privacy policies
          and may set their own cookies. We encourage you to review them. We are not responsible for
          the privacy practices of third parties. Third-party embeds are only loaded if you have
          accepted functional cookies (where required by law).
        </p>
      </section>

      <section className="mb-8">
        <h2 className={sectionH2}>14. Children&apos;s Privacy</h2>
        <p className={bodyText}>
          VoidSay is not intended for children under 13 (or the applicable minimum age in your
          country — 14 in South Korea, up to 16 in some EU countries). We do not knowingly
          collect personal information from children under the applicable age. We implement age
          verification at account creation to prevent underage sign-ups. If you believe
          we have inadvertently collected such information, please contact us immediately and
          we will delete it.
        </p>
      </section>

      <section className="mb-8">
        <h2 className={sectionH2}>15. Changes to This Policy</h2>
        <p className={bodyText}>
          We may update this Privacy Policy from time to time. We will notify users of
          material changes by posting a notice on the Service or sending an email. Continued
          use after changes become effective constitutes acceptance of the updated policy.
        </p>
      </section>

      <section className="mb-8">
        <h2 className={sectionH2}>16. Contact</h2>
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
