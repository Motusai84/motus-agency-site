import type { Metadata } from "next";
import Link from "next/link";
import PrivacyHeader from "./PrivacyHeader";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Privacy notice | Motus",
  description: "How Motus handles information submitted through its business enquiry form.",
  alternates: {
    canonical: "/privacy",
  },
};

export default function PrivacyPage() {
  return (
    <main className={`landing-page ${styles.page}`}>
      <a className={styles.skipLink} href="#main-content">Skip to privacy notice</a>
      <PrivacyHeader />

      <div className={styles.content} id="main-content" tabIndex={-1}>
        <header className={styles.hero}>
          <p className={styles.badge}>Privacy and data use</p>
          <h1>
            Privacy, <em>with no surprises.</em>
          </h1>
          <p className={styles.intro}>
            This notice explains how Motus uses personal information submitted through the business enquiry form and
            during the resulting business conversation.
          </p>
          <div className={styles.summary} aria-label="Privacy notice summary">
            <p><span>What</span> Business-enquiry details</p>
            <p><span>Why</span> To assess, respond and deliver accepted work</p>
            <p><span>Questions</span> ayomideautomations@gmail.com</p>
          </div>
        </header>

        <div className={styles.readingLayout}>
          <aside className={styles.sectionNav} aria-label="Privacy notice sections">
            <p>In this notice</p>
            <a href="#information">Information collected</a>
            <a href="#use">How it is used</a>
            <a href="#processors">Who processes it</a>
            <a href="#retention">How long it is kept</a>
            <a href="#rights">Your rights</a>
          </aside>

          <article className={styles.notice}>
            <section id="responsible">
              <p className={styles.sectionNumber}>01</p>
              <div>
                <h2>Who is responsible for your information</h2>
                <p>
                  The controller is <strong>Oluwaseun Ayomide Oyepitan trading as Motus</strong>. For privacy
                  questions, contact <a href="mailto:ayomideautomations@gmail.com">ayomideautomations@gmail.com</a>.
                </p>
              </div>
            </section>

            <section id="information">
              <p className={styles.sectionNumber}>02</p>
              <div>
                <h2>What information the enquiry form collects</h2>
                <ul>
                  <li>Your name, business name and business email.</li>
                  <li>The outcome you select and your description of what is happening now.</li>
                  <li>Your estimated investment range and the systems you already use.</li>
                  <li>An optional public website URL and any selected sector or demonstration interest.</li>
                  <li>A fixed source label showing that the enquiry came from the Motus website.</li>
                </ul>
                <p>
                  Please do not submit passwords, confidential information or personal data about your customers
                  through the enquiry form.
                </p>
                <p>
                  You do not have to use the form. If the required fields are not provided, Motus cannot assess or
                  respond to the enquiry through this route.
                </p>
              </div>
            </section>

            <section id="use">
              <p className={styles.sectionNumber}>03</p>
              <div>
                <h2>Why Motus uses it</h2>
                <p>
                  Motus uses this information to assess and respond to business enquiries, recommend an appropriate
                  paid route, prevent abuse, maintain necessary commercial evidence and deliver a service that Motus
                  accepts.
                </p>
                <h3>Lawful bases</h3>
                <p>
                  Motus relies on legitimate interests for proportionate business-to-business enquiry handling and
                  service security. Motus may also process information to take steps you request before a contract,
                  to perform a contract, or to meet a legal obligation where a record must be retained.
                </p>
              </div>
            </section>

            <section id="processors">
              <p className={styles.sectionNumber}>04</p>
              <div>
                <h2>Who may process it</h2>
                <p>
                  Cloudflare provides website, security and edge processing. Motus&apos;s controlled n8n automation and
                  its Postgres database run on a Contabo VPS in Portsmouth, United Kingdom. Google provides the Gmail
                  account used for internal enquiry notifications and may also process limited operational-error
                  records in Google Sheets.
                </p>
                <p>
                  Cloudflare and Google operate internationally, so limited information may be processed outside the
                  United Kingdom. Where that happens, Motus relies on the provider&apos;s applicable contractual and legal
                  transfer safeguards and keeps the information shared with each provider proportionate to the
                  service.
                </p>
              </div>
            </section>

            <section id="retention">
              <p className={styles.sectionNumber}>05</p>
              <div>
                <h2>How long it is kept</h2>
                <ul>
                  <li>Unsuccessful enquiry records: six months after the last meaningful contact.</li>
                  <li>
                    Accepted-client contract, invoice and material-decision records: up to six years after the
                    relationship ends where needed for tax, legal or dispute evidence.
                  </li>
                  <li>
                    The Motus n8n enquiry workflows are configured not to retain successful or failed execution
                    payloads after completion. Limited operational error metadata may be recorded separately for
                    investigation.
                  </li>
                  <li>Cloudflare Worker logs use short provider-managed retention, currently no more than seven days.</li>
                </ul>
              </div>
            </section>

            <section id="rights">
              <p className={styles.sectionNumber}>06</p>
              <div>
                <h2>Your rights</h2>
                <p>
                  Depending on the circumstances, you may ask for access, correction, deletion, restriction or
                  portability of your information, or object to its use. Contact Motus using the email above.
                </p>
                <p>
                  You can also complain to the{" "}
                  <a href="https://ico.org.uk/make-a-complaint/" rel="noreferrer">
                    Information Commissioner&apos;s Office
                  </a>.
                </p>
                <p>
                  <strong>Your right to object:</strong> where Motus relies on legitimate interests, you may object to
                  that processing. Motus will consider the circumstances and stop unless there is a lawful reason to
                  continue.
                </p>
              </div>
            </section>

            <section id="cookies">
              <p className={styles.sectionNumber}>07</p>
              <div>
                <h2>Cookies and analytics</h2>
                <p>
                  Motus does not currently add non-essential analytics, advertising cookies or newsletter tracking to
                  this website. Any strictly necessary security or hosting technologies used by the live service must
                  be verified before release.
                </p>
              </div>
            </section>

            <section id="form-boundary">
              <p className={styles.sectionNumber}>08</p>
              <div>
                <h2>What this form does not do</h2>
                <p>
                  Motus does not sell the information submitted through this form. The form does not subscribe you to
                  a newsletter or marketing list, and no automated decision accepts or rejects you as a client.
                </p>
              </div>
            </section>

            <footer className={styles.articleFooter}>
              <p>Last reviewed: 30 July 2026.</p>
              <Link id="privacy-enquiry-link" href="/#contact">Return to the enquiry form <span aria-hidden="true">→</span></Link>
            </footer>
          </article>
        </div>
      </div>

      <footer className="site-footer">
        <Link id="privacy-footer-home-link" className="logo" href="/">
          <span aria-hidden="true">✦</span> Motus
        </Link>
        <p>Tailored digital systems for UK businesses.</p>
        <nav aria-label="Footer navigation">
          <Link id="privacy-footer-solutions-link" href="/#solutions">Solutions</Link>
          <Link id="privacy-footer-examples-link" href="/demos">Examples</Link>
          <Link id="privacy-footer-pricing-link" href="/#pricing">Website pricing</Link>
          <Link id="privacy-footer-link" href="/privacy">Privacy</Link>
        </nav>
        <small>© 2026 Oluwaseun Ayomide Oyepitan trading as Motus.</small>
      </footer>
    </main>
  );
}
