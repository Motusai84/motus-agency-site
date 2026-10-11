"use client";

import { FormEvent, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { demoCatalog } from "@/lib/demo-catalog";
import { motion, useReducedMotion } from "framer-motion";
import { CursorGlow, HeroShowcase, MotionPanel, SignalField, SignalRoute, useAmbientEffects, useSiteMotion } from "@/components/SiteMotion";

type FormStatus = "idle" | "sending" | "success" | "error";
type QueueFilter = "all" | "moving" | "attention" | "complete";
type Theme = "dark" | "light";
const solutions = [
  ["Website · From £495", "Get online professionally", "Show what you offer and make it easy for customers to get in touch."],
  ["Price agreed before work starts", "Keep track of enquiries", "Keep customer messages together and know who needs a reply."],
  ["Price agreed before work starts", "Make booking easier", "Help customers choose a time and keep your team up to date."],
  ["Price agreed before work starts", "Cut repeated admin", "Spend less time copying details, chasing updates and typing the same things again."],
  ["Price agreed before work starts", "Stay on top of invoices", "Bring finished work and billing details together, ready for you to check."],
  ["Price agreed before work starts", "See what needs attention", "A workspace to keep track of customers, jobs and the next thing to do."],
] as const;

const packages = [
  ["Motus Launch", "£495", "£49/month", "A clear website for a business getting online.", ["Show what you offer", "Works on phones", "A way to contact you", "Website care"]],
  ["Motus Business", "£895", "£69/month", "More room to explain your services and help customers choose.", ["More pages for your business", "Clear service information", "An easy enquiry form", "Website care"]],
  ["Motus Growth", "£1,395", "£89/month", "A website that lets customers explore more of what you do.", ["A fuller website", "An interactive example", "Clear next steps for customers", "Website care"]],
] as const;

const queueItems = [
  ["attention", "Enquiry", "Growth consultation · #0248", "Details checked and acknowledgement sent", "Confirm Thursday availability", "Needs you"],
  ["attention", "Field job", "Boiler service · Job #107", "Staff update and photos recorded", "Prepare the invoice", "Needs you"],
  ["moving", "Renewal", "Policy renewal · R-418", "Reminder sent and documents recorded", "Waiting for the customer", "Moving"],
  ["moving", "Candidate", "Application · C-309", "Application logged and receipt confirmed", "Eligibility checks running", "Moving"],
  ["complete", "Invoice", "Payment received · INV-204", "Record matched and account updated", "No action required", "Complete"],
] as const;

const process = [
  ["Talk it through", "Tell us what you want to make easier and how your business works today."],
  ["Agree the work", "We agree what to build, the price and what is included before work starts."],
  ["Build and check", "We build it, check it with you, and get your approval before it goes live."],
  ["Keep it looked after", "Get a clear explanation of how to use it and the support we have agreed."],
] as const;

function subscribeToExample(onChange: () => void) {
  window.addEventListener("popstate", onChange);
  window.addEventListener("hashchange", onChange);
  return () => {
    window.removeEventListener("popstate", onChange);
    window.removeEventListener("hashchange", onChange);
  };
}

function getExampleSnapshot() {
  return new URLSearchParams(window.location.search).get("example") ?? "";
}

function getPrivacySnapshot() {
  return new URLSearchParams(window.location.search).get("privacy") === "1";
}

function clearExampleInterest() {
  const url = new URL(window.location.href);
  url.searchParams.delete("example");
  window.history.replaceState(window.history.state, "", url);
  window.dispatchEvent(new Event("popstate"));
}

function clearPrivacyInterest() {
  const url = new URL(window.location.href);
  url.searchParams.delete("privacy");
  window.history.replaceState(window.history.state, "", url);
  window.dispatchEvent(new Event("popstate"));
}

export default function App() {
  const rootRef = useRef<HTMLElement>(null);
  const [effectsPaused, setEffectsPaused] = useState(false);
  useAmbientEffects(rootRef, effectsPaused);
  useSiteMotion(rootRef);
  const reducedMotion = useReducedMotion();
  const [queueMotion, setQueueMotion] = useState(false);
  const [theme, setTheme] = useState<Theme>("dark");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileMenuMotion, setMobileMenuMotion] = useState(false);
  const [queueFilter, setQueueFilter] = useState<QueueFilter>("all");
  const [teamSize, setTeamSize] = useState(5);
  const [adminTime, setAdminTime] = useState(20);
  const [hourlyCost, setHourlyCost] = useState(18);
  const [selectedOutcome, setSelectedOutcome] = useState<string | null>(null);
  const [formStatus, setFormStatus] = useState<FormStatus>("idle");
  const [formMessage, setFormMessage] = useState("");

  const showroomDemos = demoCatalog.filter((demo) => demo.status === "ready");
  const exampleSlug = useSyncExternalStore(subscribeToExample, getExampleSnapshot, () => "");
  const privacyEnquiry = useSyncExternalStore(subscribeToExample, getPrivacySnapshot, () => false);
  const selectedDemo = showroomDemos.find((demo) => demo.slug === exampleSlug && demo.url);
  const enquiryOutcome = selectedOutcome ?? (privacyEnquiry ? "Privacy question" : selectedDemo?.enquiryOutcome ?? "");
  const estimate = useMemo(() => {
    const weeklyHours = Math.round(teamSize * 40 * (adminTime / 100));
    return { weeklyHours, annualCost: weeklyHours * hourlyCost * 52 };
  }, [adminTime, hourlyCost, teamSize]);
  const visibleQueue = queueFilter === "all" ? queueItems : queueItems.filter(([status]) => status === queueFilter);
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileMenuMotion(false);
        setMobileMenuOpen(false);
        document.getElementById("mobile-menu-toggle")?.focus();
      }
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [mobileMenuOpen]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (formStatus === "sending") return;
    const form = event.currentTarget;
    const data = new FormData(form);
    const payload = {
      fullName: String(data.get("fullName") ?? "").trim(),
      businessName: String(data.get("businessName") ?? "").trim() || (privacyEnquiry ? "Privacy question" : ""),
      email: String(data.get("email") ?? "").trim(),
      outcome: privacyEnquiry ? "Privacy question" : String(data.get("outcome") ?? "").trim() || "Something different",
      headache: String(data.get("headache") ?? "").trim(),
      investment: String(data.get("investment") ?? "").trim() || "Not sure yet",
      existing: String(data.get("existing") ?? "").trim() || "Not provided yet",
      websiteUrl: String(data.get("websiteUrl") ?? "").trim(),
      website: String(data.get("website") ?? "").trim(),
      system: privacyEnquiry ? "" : selectedDemo?.title ?? "",
    };
    setFormStatus("sending");
    setFormMessage("Sending your enquiry…");
    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = (await response.json().catch(() => ({}))) as { message?: string };
      if (!response.ok) throw new Error(result.message || "Your enquiry could not be sent.");
      form.reset();
      setSelectedOutcome(null);
      clearExampleInterest();
      clearPrivacyInterest();
      setFormStatus("success");
      setFormMessage("Thanks. Your enquiry has been received. Motus will reply by email within two business days.");
    } catch (error) {
      setFormStatus("error");
      setFormMessage(error instanceof Error ? error.message : "Your enquiry could not be sent.");
    }
  };

  return (
    <main ref={rootRef} id="top" className="landing-page" data-effects-paused={effectsPaused}>
      <CursorGlow rootRef={rootRef} paused={effectsPaused} />
      <div className="reading-progress" aria-hidden="true"><span /></div>
      <a id="home-skip-link" className="skip-link" href="#main-content">Skip to content</a>
      <video
        className="background-video"
        muted
        autoPlay
        loop
        playsInline
        preload="metadata"
        aria-hidden="true"
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260319_015952_e1deeb12-8fb7-4071-a42a-60779fc64ab6.mp4"
      />
      <div className="backdrop" aria-hidden="true" />

      <header className="navbar">
        <a id="motus-home-link" className="logo" href="#top" aria-label="Motus home"><span aria-hidden="true">✦</span> Motus</a>
        <nav aria-label="Primary navigation">
          <a id="nav-home-link" href="#top">Home</a>
          <a id="nav-pricing-link" href="#pricing">Pricing</a>
          <a id="nav-examples-link" href="#examples">Examples</a>
          <a id="nav-automation-link" href="#automation">How it works</a>
          <a id="nav-contact-link" href="#contact">Contact</a>
        </nav>
        <div className="header-actions">
          <button id="effects-toggle" className="effects-toggle" type="button" aria-pressed={effectsPaused} aria-label={effectsPaused ? "Resume decorative effects" : "Pause decorative effects"} onClick={() => setEffectsPaused((current) => !current)}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" aria-hidden="true">{effectsPaused ? <path d="M3 1.5 10 6 3 10.5Z" /> : <path d="M2 2h3v8H2zm5 0h3v8H7z" />}</svg>
            <span>{effectsPaused ? "Resume effects" : "Pause effects"}</span>
          </button>
          <button
            id="theme-toggle"
            className="theme-toggle"
            type="button"
            aria-pressed={theme === "dark"}
            onClick={() => setTheme((current) => current === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? "Light view" : "Dark view"}
          </button>
          <a id="header-enquiry-link" className="header-cta" href="#contact">Tell us what you need</a>
          <button
            id="mobile-menu-toggle"
            className="mobile-menu-toggle"
            type="button"
            aria-controls="mobile-navigation"
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? "Close navigation" : "Open navigation"}
            onClick={(event) => {
              setMobileMenuMotion(event.detail > 0);
              setMobileMenuOpen((open) => !open);
            }}
          >
            <span aria-hidden="true">{mobileMenuOpen ? "×" : "☰"}</span>
          </button>
        </div>
        <nav id="mobile-navigation" className="mobile-navigation" data-open={mobileMenuOpen} data-motion={mobileMenuMotion ? "on" : "off"} aria-label="Mobile navigation" aria-hidden={!mobileMenuOpen} inert={!mobileMenuOpen}>
          <a id="mobile-nav-home-link" href="#top" onClick={() => { setMobileMenuMotion(false); setMobileMenuOpen(false); }}>Home</a>
          <a id="mobile-nav-pricing-link" href="#pricing" onClick={() => { setMobileMenuMotion(false); setMobileMenuOpen(false); }}>Pricing</a>
          <a id="mobile-nav-examples-link" href="#examples" onClick={() => { setMobileMenuMotion(false); setMobileMenuOpen(false); }}>Examples</a>
          <a id="mobile-nav-automation-link" href="#automation" onClick={() => { setMobileMenuMotion(false); setMobileMenuOpen(false); }}>How it works</a>
          <a id="mobile-nav-contact-link" href="#contact" onClick={() => { setMobileMenuMotion(false); setMobileMenuOpen(false); }}>Contact</a>
        </nav>
      </header>

      <section className="hero" id="main-content" tabIndex={-1} aria-labelledby="hero-title">
        <SignalField />
        <div className="hero-copy">
          <p className="badge" data-enter="60">For UK small businesses</p>
          <h1 id="hero-title" data-enter="150"><span className="hero-title-mask"><span data-title-reveal>Websites and tools </span></span><span className="hero-title-mask"><em data-title-reveal>made for your business.</em></span></h1>
          <p className="subheading" data-enter="240">Make it easier for customers to book, get in touch and work with you. Keep your customers, jobs and everyday tasks organised.</p>
          <div className="hero-actions" data-enter="330">
            <a id="hero-examples-link" className="primary-button" href="#examples">See examples</a>
            <a id="hero-enquiry-link" className="secondary-button" href="#contact">Tell us what you need</a>
          </div>
        </div>

        <HeroShowcase paused={effectsPaused} />
      </section>

      <section className="site-section examples-section" id="examples" aria-labelledby="examples-title">
        <div className="section-intro reveal">
          <span>Examples to try</span>
          <h2 id="examples-title">See what could work for you.</h2>
          <p>Bookings, customer messages or invoices. Try an example and see what it could make easier in your business.</p>
          <p className="muted-note">Demos use fictional information. Nothing is booked or sent.</p>
        </div>
        <div className="showroom-demo-list">
          {showroomDemos.map((demo) => (
            <MotionPanel className="ledger-card reveal" key={demo.slug}>
              <div><span>{demo.name ?? demo.title}</span><small>Demo you can try</small></div>
              <h3>{demo.category ?? demo.title}</h3>
              <p>{demo.demoSummary ?? demo.interfaceSummary}</p>
              <a id={demo.slug === "ledger-desk" ? "ledger-demo-link" : `showroom-demo-${demo.slug}-link`} href={demo.url ?? "/demos"}>{demo.ctaLabel ?? "Try this example"} <b aria-hidden="true">→</b></a>
            </MotionPanel>
          ))}
        </div>
        <a id="view-showroom-link" className="text-route reveal" href="/demos">See all examples <b aria-hidden="true">→</b></a>
      </section>

      <section className="site-section solutions-section" id="solutions" aria-labelledby="solutions-title">
        <div className="section-intro reveal"><span>What we can build</span><h2 id="solutions-title">What would you like to make easier?</h2><p>A better website, easier bookings or somewhere to keep track of your work. Start with what your business needs.</p></div>
        <div className="solution-grid">
          {solutions.map(([service, title, text], index) => <MotionPanel className="solution-item reveal" key={title}><small>{String(index + 1).padStart(2, "0")}</small><span>{service}</span><h3>{title}</h3><p>{text}</p><a id={`solution-${index + 1}-link`} href="#contact" onClick={() => setSelectedOutcome(title)}>Ask about this <b aria-hidden="true">→</b></a></MotionPanel>)}
        </div>
        <a id="custom-solution-link" className="text-route reveal" href="#contact" onClick={() => setSelectedOutcome("Something different")}>Need something different? Tell us about it <b aria-hidden="true">→</b></a>
      </section>

      <section className="site-section automation-section" id="automation" aria-labelledby="automation-title">
        <div className="section-intro reveal"><span>How it works</span><h2 id="automation-title">Keep your work together.</h2><p>A customer books, sends a message or asks for a quote. The useful details go where your team needs them, so you can see what has happened and what needs doing.</p><p className="muted-note">Your workspace is a place to keep track of customers, jobs and bookings. Try the demo below to see how that could look.</p></div>
        <div className="light-control-desk reveal" aria-label="Illustrative business control desk"><header><div><span>Demo workspace · Fictional records</span><strong>Today’s work</strong></div><p>See what is moving and what needs you.</p></header><SignalRoute /><div className="desk-filters" role="group" aria-label="Filter illustrative work queue">{(["all", "moving", "attention", "complete"] as QueueFilter[]).map((filter) => <button id={`queue-filter-${filter}`} type="button" key={filter} aria-pressed={queueFilter === filter} onClick={(event) => { setQueueMotion(event.detail > 0); setQueueFilter(filter); }}>{filter === "all" ? "All work" : filter === "attention" ? "Needs you" : filter[0].toUpperCase() + filter.slice(1)} <b>{filter === "all" ? 5 : filter === "moving" || filter === "attention" ? 2 : 1}</b>{queueFilter === filter && <motion.span className="filter-indicator" layoutId="queue-filter-indicator" transition={{ duration: queueMotion && !reducedMotion ? .22 : 0, ease: [.22, 1, .36, 1] }} aria-hidden="true" />}</button>)}</div><div className="desk-labels" aria-hidden="true"><span>Work received</span><span>Already handled</span><span>Next action</span><span>Status</span></div><div className="desk-rows" aria-live="polite">{visibleQueue.map(([status, type, title, handled, next, label]) => <motion.article key={title} data-queue-status={status} initial={queueMotion && !reducedMotion ? { opacity: .35, transform: "translateY(4px)" } : false} animate={{ opacity: 1, transform: "translateY(0)" }} layout={queueMotion && !reducedMotion ? "position" : false} transition={{ duration: queueMotion && !reducedMotion ? .22 : 0, ease: [.22, 1, .36, 1] }}><div><small>{type}</small><strong>{title}</strong></div><p>{handled}</p><p>{next}</p><em>{label}</em></motion.article>)}</div></div>
        <div className="principles reveal"><span>Useful tools for customers and your team</span><span>You check anything unclear</span><span>Work and price agreed before building</span></div>
      </section>

      <section className="site-section calculator-section" id="calculator" aria-labelledby="calculator-title">
        <div className="section-intro reveal"><span>A quick estimate</span><h2 id="calculator-title">What might repeated admin be costing?</h2><p>Move the sliders to estimate the time and cost of repeated admin. This is a starting point for a conversation, not a promised saving or a price for the work.</p><aside><strong>Some tasks still need a person.</strong> We talk through what makes sense to change before building anything.</aside></div>
        <div className="light-calculator reveal"><label htmlFor="calculator-team-size"><span>Team size</span><strong>{teamSize} {teamSize === 1 ? "person" : "people"}</strong></label><input id="calculator-team-size" type="range" min="1" max="50" value={teamSize} onChange={(event) => setTeamSize(Number(event.target.value))} /><label htmlFor="calculator-admin-time"><span>Working time spent on repeated admin</span><strong>{adminTime}%</strong></label><input id="calculator-admin-time" type="range" min="5" max="60" step="5" value={adminTime} onChange={(event) => setAdminTime(Number(event.target.value))} /><label htmlFor="calculator-hourly-cost"><span>Estimated hourly cost</span><strong>£{hourlyCost}</strong></label><input id="calculator-hourly-cost" type="range" min="12" max="60" value={hourlyCost} onChange={(event) => setHourlyCost(Number(event.target.value))} /><dl><div><dt>Repeated-admin hours</dt><dd>{estimate.weeklyHours}<small>/week</small></dd></div><div><dt>Estimated yearly cost</dt><dd>£{estimate.annualCost.toLocaleString("en-GB")}</dd></div></dl><a id="calculator-enquiry-link" href="#contact" onClick={() => setSelectedOutcome("Cut repeated admin")}>Tell us what keeps repeating <b aria-hidden="true">→</b></a></div>
      </section>

      <section className="site-section pricing-section" id="pricing" aria-labelledby="pricing-title"><div className="section-intro reveal"><span>Website prices</span><h2 id="pricing-title">A clear place to start.</h2><p>We talk through what you need and choose a suitable website package. Workspaces and other business tools are priced separately once we agree the work.</p></div><div className="package-grid">{packages.map(([name, price, care, text, features], index) => <MotionPanel className={`package${index === 1 ? " featured" : ""} reveal`} key={name}>{index === 1 && <em>Most useful for established businesses</em>}<span>{name}</span><strong>{price}</strong><small>{care} website care</small><p>{text}</p><ul>{features.map((feature) => <li key={feature}>{feature}</li>)}</ul><a id={`package-${index + 1}-link`} href="#contact" onClick={() => setSelectedOutcome(name)}>Tell us what you need <b aria-hidden="true">→</b></a></MotionPanel>)}</div><p className="vat-note reveal">Motus is not currently VAT registered. VAT is not added to the prices shown.</p></section>

      <section className="site-section process-section" id="about" aria-labelledby="process-title"><div className="section-intro reveal"><span>Working with Motus</span><h2 id="process-title">Clear steps. Agreed from the start.</h2><p>Custom websites and workspaces, built around what your business needs.</p><p className="muted-note">We talk it through, agree the work and check it together. You know what is being built and what support is included.</p></div><ol className="process-list">{process.map(([title, text], index) => <li className="reveal" key={title}><span>{String(index + 1).padStart(2, "0")}</span><div><strong>{title}</strong><p>{text}</p></div></li>)}</ol></section>

      <section className="site-section contact-section" id="contact" aria-labelledby="contact-title">
        <div className="section-intro reveal">
          <span>A useful first step</span>
          <h2 id="contact-title" tabIndex={-1}>{privacyEnquiry ? "Contact Motus about your information." : "Tell us what you’d like to make easier."}</h2>
          <p>{privacyEnquiry ? "Use this form for a privacy question or a request about your information. A business name is optional. Motus normally replies by email within two business days." : "A few lines about your business and what you need are enough to start. Motus normally replies by email within two business days with a next step."}</p>
          <div className="contact-trust">
            <p><strong>We agree the work first.</strong> You know the price and what is included before building starts.</p>
            <p><strong>You stay in control.</strong> Anything important or unclear comes back to you to check.</p>
          </div>
        </div>
        <form className="light-form reveal" id="enquiry-form" onSubmit={handleSubmit}>
          {privacyEnquiry && (
            <div className="enquiry-interest" role="status">
              <p><strong>Privacy question</strong></p>
              <button id="enquiry-clear-privacy" type="button" onClick={() => { setSelectedOutcome(null); clearPrivacyInterest(); }}>Return to business enquiry</button>
            </div>
          )}
          {!privacyEnquiry && selectedDemo && (
            <div className="enquiry-interest" role="status">
              <p>Asking about <strong>{selectedDemo.name ?? selectedDemo.title}</strong> · {selectedDemo.category}</p>
              <button id="enquiry-clear-example" type="button" onClick={clearExampleInterest}>Clear example</button>
            </div>
          )}
          <div className="form-pair">
            <label htmlFor="enquiry-name">Your name<input id="enquiry-name" name="fullName" autoComplete="name" maxLength={100} required /></label>
            <label htmlFor="enquiry-business">Business name{privacyEnquiry && <small>(optional)</small>}<input id="enquiry-business" name="businessName" autoComplete="organization" maxLength={160} required={!privacyEnquiry} /></label>
          </div>
          <label htmlFor="enquiry-email">Your email<input id="enquiry-email" name="email" type="email" autoComplete="email" maxLength={200} required /></label>
          <label htmlFor="enquiry-problem">{privacyEnquiry ? "Your privacy question" : "What would you like help with?"}<textarea id="enquiry-problem" name="headache" rows={4} maxLength={1200} placeholder={privacyEnquiry ? "Briefly describe your question or request. Leave out sensitive details." : "Tell us what you need or what is getting in the way."} required /></label>
          <label htmlFor="enquiry-outcome">What is this about? <small>(optional)</small>
            <select id="enquiry-outcome" name="outcome" value={enquiryOutcome} onChange={(event) => setSelectedOutcome(event.target.value)}>
              <option value="">Not sure yet</option>
              {privacyEnquiry ? <option>Privacy question</option> : <>
                {solutions.map(([, title]) => <option key={title}>{title}</option>)}
                {packages.map(([name]) => <option key={name}>{name}</option>)}
                <option>Something different</option>
              </>}
            </select>
          </label>
          {!privacyEnquiry && <details className="enquiry-details">
            <summary id="enquiry-more-details">Add more details <span>(optional)</span></summary>
            <div className="enquiry-details-fields">
              <label htmlFor="enquiry-investment">Do you have a budget in mind?
                <select id="enquiry-investment" name="investment" defaultValue="Not sure yet">
                  <option>Not sure yet</option><option value="Under GBP 500">Under £500</option><option value="GBP 500-999">£500–999</option><option value="GBP 1,000-2,499">£1,000–2,499</option><option value="GBP 2,500-4,999">£2,500–4,999</option><option value="GBP 5,000 or more">£5,000 or more</option>
                </select>
              </label>
              <label htmlFor="enquiry-existing">What do you use now?<input id="enquiry-existing" name="existing" maxLength={300} placeholder="A website, booking app, spreadsheet or something else" /></label>
              <label htmlFor="enquiry-url">Your website<input id="enquiry-url" name="websiteUrl" type="url" maxLength={500} placeholder="https://" /></label>
            </div>
          </details>}
          <label className="honeypot" aria-hidden="true" htmlFor="enquiry-website">Leave this field empty<input id="enquiry-website" name="website" tabIndex={-1} autoComplete="off" /></label>
          <p>This is an enquiry, with no commitment to buy. Please leave out passwords, private business information and personal details about your customers. <Link id="enquiry-privacy-link" href="/privacy">Read the privacy notice.</Link></p>
          <button id="enquiry-submit-button" type="submit" disabled={formStatus === "sending"}>{formStatus === "sending" ? "Sending…" : "Send enquiry"} <b aria-hidden="true">→</b></button>
          <output className={formMessage ? "is-visible" : undefined} data-status={formStatus} aria-live="polite">{formMessage}</output>
        </form>
      </section>

      <footer className="site-footer"><a id="footer-home-link" className="logo" href="#top"><span aria-hidden="true">✦</span> Motus</a><p>Custom websites and business tools for UK small businesses.</p><nav aria-label="Footer navigation"><a id="footer-solutions-link" href="#solutions">What we build</a><Link id="footer-examples-link" href="/demos">Examples</Link><a id="footer-pricing-link" href="#pricing">Website pricing</a><Link id="footer-privacy-link" href="/privacy">Privacy</Link></nav><small>© 2026 Motus.</small></footer>
    </main>
  );
}
