import type { Metadata } from "next";
import { ArrowLeft, ArrowRight, ShieldCheck } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import DemoShowroom from "@/components/DemoShowroom";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Websites, online apps and workflows: try the examples | Motus",
  description:
    "Explore a website, online apps and automation demos for bookings, enquiries, billing and email organisation. See what Motus can build around your work.",
  alternates: {
    canonical: "/demos",
  },
  openGraph: {
    title: "Websites, online apps and workflows: try the examples | Motus",
    description:
      "Explore a salon website and interactive examples for bookings, customer enquiries, invoices and email organisation.",
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
        <h1>Websites, apps and automations.<br />See them in use.</h1>
        <p className={styles.lead}>
          {process.env.MOTUS_LOCAL_PREVIEW === "1"
            ? "Watch a proposed after-hours call, explore a complete salon website, try apps for bookings, enquiries and invoices, or follow Property Desk through an email automation. Motus can design and build a setup around your business."
            : "Explore a complete salon website, try apps for bookings, enquiries and invoices, or follow Property Desk through an email automation. Choose Gmail or Outlook and watch the example at your own pace. Motus can design and build a setup around your business."}
        </p>
        <div className={styles.notice}>
          <ShieldCheck size={20} aria-hidden="true" />
          <p>
            Demonstrations with fictional information. Your project is scoped separately. Nothing is booked or sent.
          </p>
        </div>
      </section>

      <section className={styles.library} aria-labelledby="library-title">
        <div className={styles.sectionHeading}>
          <div>
            <h2 id="library-title">Choose an example.</h2>
          </div>
        </div>

        {process.env.MOTUS_LOCAL_PREVIEW === "1" && (
          <Link id="demos-voice-receptionist-film-link" className={styles.filmFeature} href="/preview/voice-receptionist">
            <span className={styles.filmImage}><Image src="/video/ai-receptionist-poster.png" alt="" width={1920} height={1080} /></span>
            <span className={styles.filmCopy}>
              <small>Concept film · 60 seconds</small>
              <strong>When a customer calls after closing</strong>
              <span>Watch a proposed AI receptionist handle a booking request and pass the details to the team. Scripted example; no live booking.</span>
              <span className={styles.filmAction}>Watch the film <ArrowRight size={18} aria-hidden="true" /></span>
            </span>
          </Link>
        )}

        <DemoShowroom />
      </section>

      <section className={styles.model} aria-labelledby="model-title">
        <div>
          <p className={styles.eyebrow}>Built around your business</p>
          <h2 id="model-title">A website, an app and the steps between them.</h2>
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
            <strong>Tools that share the details</strong>
            <p>Connect forms, email and records so useful information reaches the right place.</p>
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
          <p className={styles.eyebrow}>Your project</p>
          <h2>What would you like to build or connect?</h2>
        </div>
        <div>
          <p>
            A website, a custom online app, an automation or a connection between existing tools. Tell us what your business needs and we will talk it through.
          </p>
          <Link id="demos-enquiry-link" href="/#contact">
            Discuss a project <ArrowRight size={17} aria-hidden="true" />
          </Link>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
