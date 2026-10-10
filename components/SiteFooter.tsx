import Link from "next/link";
import styles from "./SiteChrome.module.css";

export default function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div>
        <Link id="footer-home-link" className={styles.footerWordmark} href="/">Motus</Link>
        <p>Custom websites and business tools for UK small businesses.</p>
      </div>
      <nav aria-label="Footer navigation">
        <Link id="footer-solutions-link" href="/#solutions">What we build</Link>
        <Link id="footer-examples-link" href="/demos">Examples</Link>
        <Link id="footer-pricing-link" href="/#pricing">Website pricing</Link>
        <Link id="footer-privacy-link" href="/privacy">Privacy</Link>
        <Link id="footer-contact-link" href="/#contact">Tell us what you need</Link>
      </nav>
      <p className={styles.footerGate}>© 2026 Motus.</p>
    </footer>
  );
}
