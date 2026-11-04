import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "AI receptionist concept preview | Motus",
  description: "A scripted example of a proposed after-hours call, appointment request and team handover.",
  robots: { index: false, follow: false },
};

export default function VoiceReceptionistPreview() {
  if (process.env.MOTUS_LOCAL_PREVIEW !== "1") notFound();

  return (
    <main className={styles.page} id="main-content" tabIndex={-1}>
      <SiteHeader />
      <div className={styles.body}>
        <Link id="voice-preview-back-link" className={styles.back} href="/demos">
          <ArrowLeft size={17} aria-hidden="true" /> All examples
        </Link>

        <header className={styles.intro}>
          <p className={styles.eyebrow}>Motus / concept preview</p>
          <h1>A customer calls after closing. What happens next?</h1>
          <p className={styles.lead}>
            Watch a scripted conversation about a bike assessment. The caller changes the time; the proposed receptionist handles the request and shows how the details could reach the workshop.
          </p>
          <p className={styles.disclosure}>
            This is an illustrative film for a service in development. Both voices are AI-generated; the call, calendar entry and email handover are simulated. No live booking is shown.
          </p>
        </header>

        <section className={styles.screening} aria-label="AI receptionist concept film">
          <div className={styles.screeningHeader}>
            <span>After hours / 20:42</span>
            <span>01:00 · two voices</span>
          </div>
          <video
            id="ai-receptionist-concept-video"
            className={styles.video}
            controls
            playsInline
            preload="metadata"
            poster="/video/ai-receptionist-poster.png"
            width="1920"
            height="1080"
            aria-label="Scripted AI receptionist concept showing an after-hours call and proposed booking flow"
          >
            <source src="/video/ai-receptionist-concept.mp4?v=3" type="video/mp4" />
            <track src="/video/ai-receptionist-concept.vtt?v=3" kind="captions" srcLang="en" label="English captions" />
            Your browser does not support the video. The dialogue is available in the transcript below.
          </video>
          <div className={styles.screeningFooter}>
            <span>Customer enquiry</span><span className={styles.signal} aria-hidden="true" /><span>Appointment request</span><span className={styles.signal} aria-hidden="true" /><span>Team handover</span>
          </div>
        </section>

        <section className={styles.details} aria-labelledby="voice-preview-details-title">
          <div>
            <p className={styles.eyebrow}>What this demonstrates</p>
            <h2 id="voice-preview-details-title">A proposed route for the next call.</h2>
          </div>
          <div className={styles.detailsCopy}>
            <p>
              A customer gets an answer outside business hours, changes their preferred appointment time and hears what happens next. A pilot would be scoped around the business&apos;s actual phone number, booking diary, rules and follow-up process.
            </p>
            <details className={styles.transcript}>
              <summary id="voice-preview-transcript-toggle">Read the call transcript</summary>
              <div>
                <p><strong>Caller:</strong> Hi. I know you&apos;re closed. Can I still book a bike assessment?</p>
                <p><strong>AI receptionist:</strong> Yes, I can help. Is it a repair, or a general check?</p>
                <p><strong>Caller:</strong> My brakes are squeaking. I&apos;d like someone to take a look.</p>
                <p><strong>AI receptionist:</strong> Got it. I can offer Thursday at eleven, or Friday at two.</p>
                <p><strong>Caller:</strong> Thursday at eleven, please. Actually, could we make it Friday at two?</p>
                <p><strong>AI receptionist:</strong> Of course. Friday at two. Can I take your name for the appointment?</p>
                <p><strong>Caller:</strong> Alex Morgan. The number I&apos;m calling from is fine for confirmation.</p>
                <p><strong>AI receptionist:</strong> Your Friday two o&apos;clock assessment is in the diary. I&apos;ll send the confirmation and share the details with the team.</p>
                <p><strong>Caller:</strong> Brilliant. Thank you.</p>
                <p><strong>AI receptionist:</strong> You&apos;re welcome, Alex. See you Friday.</p>
              </div>
            </details>
          </div>
        </section>

        <section className={styles.cta} aria-labelledby="voice-preview-cta-title">
          <div><p className={styles.eyebrow}>Your business</p><h2 id="voice-preview-cta-title">Where do calls go when you close?</h2></div>
          <Link id="voice-preview-pilot-link" href="/#contact">Discuss a pilot <ArrowRight size={20} aria-hidden="true" /></Link>
        </section>
      </div>
      <SiteFooter />
    </main>
  );
}
