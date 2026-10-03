import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import styles from "./not-found.module.css";

export const metadata: Metadata = {
  title: "Page not found | Motus",
  description: "Return to Motus websites, automation and practical digital solutions.",
};

export default function NotFound() {
  return (
    <main className={styles.page}>
      <SiteHeader />
      <section className={styles.content} id="main-content" tabIndex={-1}>
        <div className={styles.code} aria-hidden="true">404</div>
        <div className={styles.message}>
          <p>That route does not exist</p>
          <h1>Let&apos;s get you back to something useful.</h1>
          <span>
            The page may have moved, or the address may be incorrect. Return to Motus or tell us what your business
            needs.
          </span>
          <div className={styles.actions}>
            <Link id="not-found-home-link" href="/">
              Return to Motus <ArrowRight size={16} aria-hidden="true" />
            </Link>
            <Link id="not-found-contact-link" href="/#contact">
              Tell us what you need
            </Link>
          </div>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
