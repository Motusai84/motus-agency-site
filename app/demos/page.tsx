import type { Metadata } from "next";
import { ArrowLeft, ArrowRight, ShieldCheck } from "lucide-react";
import Link from "next/link";
import DemoShowroom from "@/components/DemoShowroom";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Bookings, enquiries and invoices: try the examples | Motus",
  description:
    "Try three working examples for bookings, customer enquiries and invoices. See what a website or business tool could make easier.",
  alternates: {
    canonical: "/demos",
  },
  openGraph: {
    title: "Bookings, enquiries and invoices: try the examples | Motus",
    description:
      "Try working examples for bookings, customer enquiries and invoices, built around everyday business needs.",
    url: "/demos",
  },
};

export default function DemosPage() {
  return (
    <main className={styles.page}>
      <SiteHeader />

      <section className={styles.hero} id="main-content" tabIndex={-1}>
        <Link id="demos-back-link" className={styles.backLink} href="/">
          <ArrowLeft size={15} aria-hidden="true" /> Back to Motus
        </Link>
        <p className={styles.eyebrow}>Examples to try</p>
        <h1>See what could work for you.</h1>
        <p className={styles.lead}>
          Try an example for bookings, customer messages or invoices.
        </p>
        <div className={styles.notice}>
          <ShieldCheck size={20} aria-hidden="true" />
          <p>
            Fictional demos. Nothing is booked or sent.
          </p>
        </div>
      </section>

      <section className={styles.library} aria-labelledby="library-title">
        <div className={styles.sectionHeading}>
          <div>
            <h2 id="library-title">Choose an example.</h2>
          </div>
        </div>

        <DemoShowroom />
      </section>

      <section className={styles.model} aria-labelledby="model-title">
        <div>
          <p className={styles.eyebrow}>Built around your business</p>
          <h2 id="model-title">A clear next step for everyone.</h2>
        </div>
        <div className={styles.modelSteps}>
          <article>
            <span>Your customer</span>
            <strong>An easy way to get started</strong>
            <p>A website, booking page or form that makes the next step clear.</p>
          </article>
          <ArrowRight size={21} aria-hidden="true" />
          <article>
            <span>Your team</span>
            <strong>The details where you need them</strong>
            <p>Keep messages, bookings and job updates together, with less copying and chasing.</p>
          </article>
          <ArrowRight size={21} aria-hidden="true" />
          <article>
            <span>You</span>
            <strong>A clear view of what needs doing</strong>
            <p>See what is moving, what is waiting and what needs your decision.</p>
          </article>
        </div>
      </section>

      <section className={styles.cta}>
        <div>
          <p className={styles.eyebrow}>Have something else in mind?</p>
          <h2>Tell us what you’d like to make easier.</h2>
        </div>
        <div>
          <p>
            You don’t need to know which tool to choose. Tell us what your business needs and we’ll talk it through.
          </p>
          <Link id="demos-enquiry-link" href="/#contact">
            Tell us what you need <ArrowRight size={17} aria-hidden="true" />
          </Link>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
