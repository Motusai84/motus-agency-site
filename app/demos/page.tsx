import type { Metadata } from "next";
import { ArrowLeft, ArrowRight, ShieldCheck } from "lucide-react";
import Link from "next/link";
import DemoShowroom from "@/components/DemoShowroom";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Interactive solution examples | Motus",
  description:
    "Explore approved Motus demonstrations of websites, dashboards, portals and practical operational systems.",
  alternates: {
    canonical: "/demos",
  },
  openGraph: {
    title: "Interactive solution examples | Motus",
    description:
      "Explore approved Motus demonstrations of websites, dashboards, portals and practical operational systems.",
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
        <p className={styles.eyebrow}>Interactive solution showroom</p>
        <h1>Choose a sector. See the whole solution.</h1>
        <p className={styles.lead}>
          Each Motus demonstration is built as a separate working interface for a fictional business. See what the
          customer, employee or owner uses, what happens next and where a person stays in control.
        </p>
        <div className={styles.notice}>
          <ShieldCheck size={20} aria-hidden="true" />
          <p>
            Every active example uses fictional illustrative data unless clearly labelled as verified evidence.
            Nothing in this showroom is presented as a client case study or guaranteed result.
          </p>
        </div>
      </section>

      <section className={styles.library} aria-labelledby="library-title">
        <div className={styles.sectionHeading}>
          <div>
            <p className={styles.eyebrow}>Approved working examples</p>
            <h2 id="library-title">Browse by sector or by the solution you need.</h2>
          </div>
          <p>
            This page is the catalogue. Each interactive demonstration remains its own project, so the interface can
            be designed properly for that sector and linked here only after review.
          </p>
        </div>

        <DemoShowroom />
      </section>

      <section className={styles.model} aria-labelledby="model-title">
        <div>
          <p className={styles.eyebrow}>The demonstration model</p>
          <h2 id="model-title">One process. The right useful views.</h2>
        </div>
        <div className={styles.modelSteps}>
          <article>
            <span>Customer or employee</span>
            <strong>The interface where the action starts</strong>
            <p>A website, booking page, request form, portal or focused internal tool.</p>
          </article>
          <ArrowRight size={21} aria-hidden="true" />
          <article>
            <span>Motus operational layer</span>
            <strong>The agreed repeatable work</strong>
            <p>Validation, recording, messaging, routing and safe stop rules.</p>
          </article>
          <ArrowRight size={21} aria-hidden="true" />
          <article>
            <span>Owner or team</span>
            <strong>The result and next decision</strong>
            <p>A dashboard or workspace showing progress, exceptions and what still needs a person.</p>
          </article>
        </div>
      </section>

      <section className={styles.cta}>
        <div>
          <p className={styles.eyebrow}>Your business may need a different view</p>
          <h2>Tell Motus what needs to happen.</h2>
        </div>
        <div>
          <p>
            Describe the outcome, who uses the system and what currently gets missed, copied or chased. Motus will
            recommend the sensible route.
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
