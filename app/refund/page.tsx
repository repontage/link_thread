import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refund Policy - VoidSay",
  description: "VoidSay Refund Policy",
};

const linkClass = "text-blue-600 dark:text-blue-400 hover:underline";
const sectionH2 = "text-xl font-semibold mb-4 text-gray-900 dark:text-white";
const bodyText = "text-gray-700 dark:text-gray-300";
const listClass = "list-disc pl-6 space-y-2 mt-2 text-gray-700 dark:text-gray-300";

export default function RefundPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-16 text-gray-900 dark:text-gray-100 leading-relaxed">
      <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">Refund Policy</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">Last updated: May 31, 2026</p>

      <section className="mb-8">
        <h2 className={sectionH2}>1. General Policy</h2>
        <p className={bodyText}>
          VoidSay offers a Pro subscription at $29/month. We want you to be satisfied with
          our Service. This Refund Policy complies with applicable consumer protection laws,
          including the Korean Act on Consumer Protection in Electronic Commerce (전자상거래법).
        </p>
      </section>

      <section className="mb-8">
        <h2 className={sectionH2}>2. 7-Day Cancellation Right (청약철회)</h2>
        <p className={bodyText}>
          Under Korean law and for most jurisdictions, you have the right to cancel your
          purchase within 7 days of the subscription date and receive a full refund. To
          request a refund, contact us at{" "}
          <a href="mailto:repontage@gmail.com" className={linkClass}>
            repontage@gmail.com
          </a>{" "}
          with your account email and purchase details.
        </p>
      </section>

      <section className="mb-8">
        <h2 className={sectionH2}>3. Digital Content Exception</h2>
        <p className={bodyText}>
          <strong className="text-gray-900 dark:text-white">Important:</strong> Under Korean Electronic Commerce Act Article 17(2) and
          similar laws in other jurisdictions, the right to cancel may be limited for digital
          content where:
        </p>
        <ul className={listClass}>
          <li>The digital service has been fully consumed or accessed during the cancellation period;</li>
          <li>You have explicitly acknowledged the loss of cancellation rights before purchase.</li>
        </ul>
        <p className={`${bodyText} mt-2`}>
          VoidSay Pro provides immediate access to premium features (ad-free experience,
          developer portal, etc.). If you have actively used Pro features during the 7-day
          period, your cancellation right may be limited. However, we evaluate all refund
          requests on a case-by-case basis and strive to be fair.
        </p>
      </section>

      <section className="mb-8">
        <h2 className={sectionH2}>4. Renewal Charges</h2>
        <p className={bodyText}>
          Pro subscriptions automatically renew each month. Renewal charges are generally
          non-refundable after the 7-day cancellation period. However:
        </p>
        <ul className={listClass}>
          <li>If you were charged after timely cancelling due to a processing delay, contact us for a refund.</li>
          <li>If you did not receive prior notice of an upcoming renewal, you may be entitled to a refund.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className={sectionH2}>5. How to Cancel</h2>
        <p className={bodyText}>
          You can cancel your Pro subscription at any time through the account management
          portal at{" "}
          <a href="/pro/manage" className={linkClass}>
            voidsay.com/pro/manage
          </a>. Upon cancellation, you will continue to have Pro access until the end of your
          current billing period. No partial refunds are provided for unused portions of a
          billing period beyond the 7-day window.
        </p>
      </section>

      <section className="mb-8">
        <h2 className={sectionH2}>6. Refund Processing</h2>
        <p className={bodyText}>
          Approved refunds are processed through Lemon Squeezy, our payment provider (Merchant of
          Record). Refunds typically appear in your account within 5-10 business days,
          depending on your payment method and financial institution.
        </p>
        <p className={`${bodyText} mt-2`}>
          Under Korean law, refunds must be processed within 3 business days of the refund
          determination. Lemon Squeezy&apos;s standard processing time may extend this; we will keep
          you informed of the status.
        </p>
      </section>

      <section className="mb-8">
        <h2 className={sectionH2}>7. Refund Method</h2>
        <p className={bodyText}>
          Refunds are issued to the original payment method used for the purchase. If the
          original payment method is no longer valid, we will work with you to arrange an
          alternative refund method.
        </p>
      </section>

      <section className="mb-8">
        <h2 className={sectionH2}>8. Exceptions</h2>
        <p className={bodyText}>Refunds may be denied in cases of:</p>
        <ul className={listClass}>
          <li>Violation of our Terms of Service</li>
          <li>Fraudulent or abusive usage patterns</li>
          <li>Chargeback abuse or payment fraud</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className={sectionH2}>9. Korean Consumer Rights (한국 소비자 권리)</h2>
        <p className={bodyText}>
          대한민국 거주자는 전자상거래 등에서의 소비자보호에 관한 법률에 따라 다음과 같은
          권리를 가집니다:
        </p>
        <ul className={listClass}>
          <li>계약서 교부 및 이용약관 확인권</li>
          <li>청약철회권 (구독 후 7일 이내, 단 디지털콘텐츠 예외 적용 가능)</li>
          <li>환불 받을 권리 (환불 사유 발생 시 3영업일 이내 처리)</li>
          <li>소비자 분쟁 해결: 한국소비자원 (www.kca.go.kr, 국번없이 1372)</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className={sectionH2}>10. Contact</h2>
        <p className={bodyText}>
          For refund requests or questions, contact us at{" "}
          <a href="mailto:repontage@gmail.com" className={linkClass}>
            repontage@gmail.com
          </a>. We aim to respond within 2 business days.
        </p>
      </section>
    </main>
  );
}
