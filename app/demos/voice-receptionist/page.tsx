import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "After-hours AI receptionist concept | Motus demos",
  description:
    "Watch a scripted UK after-hours call and see how a booking request and team handover could work. AI voices and simulated calendar and email scenes.",
  alternates: { canonical: "/demos/voice-receptionist" },
};

export default function VoiceReceptionistDemo() {
  return (
    <main className={styles.page} id="main-content" tabIndex={-1}>
      <SiteHeader />
      <div className={styles.top}>
        <Link id="voice-demo-back-link" className={styles.back} href="/demos">
          <ArrowLeft size={16} aria-hidden="true" /> All examples
        </Link>

        <section className={styles.hero} aria-labelledby="voice-demo-title">
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>Motus / After-hours calls</p>
            <h1 id="voice-demo-title">One call, from enquiry to handover.</h1>
            <p className={styles.lead}>
              A customer rings a bicycle workshop after closing. Watch how a proposed AI receptionist could handle the conversation and pass on the details.
            </p>
            <a id="voice-demo-watch-link" className={styles.watchLink} href="#voice-demo-film">
              <span aria-hidden="true">▶</span> Watch the 60-second film
            </a>
          </div>

          <section id="voice-demo-film" className={styles.film} aria-label="AI receptionist concept film">
            <div className={styles.filmHeader}>
              <span>Example call / 20:42</span>
              <span>01:00</span>
            </div>
            <video
              id="ai-receptionist-concept-video"
              className={styles.video}
              controls
              playsInline
              preload="metadata"
              poster="/video/ai-receptionist-still.jpg"
              width="1920"
              height="1080"
              aria-label="Scripted AI receptionist concept showing an after-hours call and proposed booking flow"
            >
              <source src="/video/ai-receptionist-concept.mp4" type="video/mp4" />
              <track
                src="/video/ai-receptionist-concept.vtt"
                kind="captions"
                srcLang="en"
                label="English captions"
              />
              Your browser does not support the video. The dialogue is available in the transcript below.
            </video>
            <p className={styles.disclosure}>
              <strong>Scripted concept.</strong> Both voices are AI-generated. The calendar and email scenes are simulated; no live booking is shown.
            </p>
          </section>
        </section>
      </div>

      <section className={styles.route} aria-labelledby="voice-demo-route-title">
        <div className={styles.routeInner}>
          <div className={styles.routeHeading}>
            <div>
              <p className={styles.eyebrow}>In the film</p>
              <h2 id="voice-demo-route-title">What happens to the enquiry</h2>
            </div>
            <span>Illustrative route</span>
          </div>
          <ol className={styles.stages}>
            <li>
              <span>20:42 / Call</span>
              <strong>A customer gets an answer</strong>
              <p>The workshop is closed. The caller asks about a bike assessment.</p>
            </li>
            <li>
              <span>Friday 14:00 / Request</span>
              <strong>The time changes</strong>
              <p>The caller switches from Thursday to Friday during the conversation.</p>
            </li>
            <li>
              <span>20:43 / Handover</span>
              <strong>The team gets the details</strong>
              <p>The film shows a proposed calendar entry and email summary.</p>
            </li>
          </ol>
        </div>
      </section>

      <section className={styles.pilot} aria-labelledby="voice-demo-pilot-title">
        <div>
          <p className={styles.eyebrow}>For a real business</p>
          <h2 id="voice-demo-pilot-title">A pilot starts with your actual call process.</h2>
        </div>
        <div className={styles.pilotDetails}>
          <p>
            We would map what callers ask, when an appointment can be offered, and which details your team needs. The voice and booking experience would be tested before any live calls are forwarded.
          </p>
          <ul className={styles.pilotList}>
            <li><span>01</span>Your phone number and opening hours</li>
            <li><span>02</span>Booking rules and calendar access</li>
            <li><span>03</span>Handover details and exceptions</li>
            <li><span>04</span>Test calls with your team</li>
          </ul>
          <Link id="voice-demo-pilot-link" className={styles.pilotLink} href="/#contact">
            Discuss a pilot <ArrowRight size={17} aria-hidden="true" />
          </Link>
          <details className={styles.transcript}>
            <summary id="voice-demo-transcript-toggle">Read the call transcript</summary>
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
      <SiteFooter />
    </main>
  );
}
