"use client";

import { FormEvent, useEffect, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import Image from "next/image";
import { demoCatalog } from "@/lib/demo-catalog";
import { applySiteTheme, type SiteTheme } from "@/lib/site-theme";
import { ArrowRight, CalendarDays, Check, FileText, Globe2, LayoutDashboard, Link2, ListChecks, MessageSquare, Workflow } from "lucide-react";
import { CursorGlow, HeroShowcase, MotionPanel, SignalField, useAmbientEffects, useSiteMotion } from "@/components/SiteMotion";
import BusinessImpact from "@/components/BusinessImpact";
import { businessImpact, type ClientConfig } from "@/src/clients/business-impact";

const impactConfig: ClientConfig = businessImpact;

type FormStatus = "idle" | "sending" | "success" | "error";
const solutions = [
  { title: "Websites", label: "For your customers", icon: Globe2, text: "A clear, professional website that shows what you offer and helps customers enquire, book or buy.", example: "Service websites, booking pages and online shops." },
  { title: "Custom online apps", label: "For your day-to-day work", icon: LayoutDashboard, text: "Tools that open in a web browser, on a phone or computer. Manage clients, bookings, jobs or billing in a place built around your process.", example: "Dashboards, booking tools and business trackers." },
  { title: "Automations and workflows", label: "For routine tasks", icon: Workflow, text: "Set repeat steps to happen automatically, such as recording an enquiry, sending a reminder or preparing an invoice draft.", example: "Less copying, chasing and entering the same details." },
  { title: "Connect your tools", label: "For the software you already use", icon: Link2, text: "Link your website, forms, calendar, email and business records so useful information can move between them.", example: "A booking form connected to your tracker and calendar." },
] as const;

const connectionExamples = [
  {
    id: "bookings", label: "Event bookings", title: "One enquiry. A clearer booking process.",
    description: "For an events business, the website can collect the details, update a tracker and help the owner manage the next steps.",
    tools: ["Website", "Google Sheets", "Google Calendar", "Email"],
    steps: [
      { title: "Customer enquires", text: "A form collects the event date, venue and requirements.", icon: Globe2 },
      { title: "Details are recorded", text: "The enquiry goes into a tracker and the owner gets an alert.", icon: LayoutDashboard },
      { title: "Owner approves", text: "The owner reviews the event and agrees the final quote.", icon: Check },
      { title: "Next steps stay clear", text: "Track the invoice, confirmed date and preparation tasks.", icon: CalendarDays },
    ],
    note: "Illustrative concept. The owner approves prices and booking decisions. Connections depend on the tools and scope agreed.",
  },
  {
    id: "enquiries", label: "Customer enquiries", title: "New messages, with a clear next step.",
    description: "Bring enquiries from supported channels into a shared record so the team can see who needs a reply.",
    tools: ["Website forms", "Email", "Customer tracker", "Team alerts"],
    steps: [
      { title: "A message arrives", text: "A customer gets in touch through a form or connected inbox.", icon: MessageSquare },
      { title: "Details come together", text: "Keep the request, contact details and source in one record.", icon: LayoutDashboard },
      { title: "Someone takes ownership", text: "Assign the right person and flag any missing information.", icon: Check },
      { title: "Follow-up is tracked", text: "Set the next action and a reminder to respond.", icon: ListChecks },
    ],
    note: "Illustrative concept. Your team can check replies before they are sent. Available connections are reviewed before building.",
  },
  {
    id: "billing", label: "Job admin and billing", title: "Finished work, ready for the next step.",
    description: "Connect a completed job with the information needed for billing, helping the owner spot missing details before an invoice is sent.",
    tools: ["Job records", "Forms", "Document storage", "Invoice drafts"],
    steps: [
      { title: "Work is marked complete", text: "A team member submits the job details and notes.", icon: ListChecks },
      { title: "Records are gathered", text: "Bring together the agreed price and completed-work details.", icon: LayoutDashboard },
      { title: "A draft is prepared", text: "Prepare the invoice details and flag anything that differs.", icon: FileText },
      { title: "Owner checks the details", text: "Review the amount and approve the next step.", icon: Check },
    ],
    note: "Illustrative concept. Invoice details are reviewed before sending. Your existing accounting setup is considered in the scope.",
  },
] as const;

const questions = [
  ["What am I buying from Motus?", "You’re hiring us to design and build something for your business: a website, a custom online app, an automated workflow or connections between your existing tools.\n\nThe demos show examples of what we can build. Your project’s features, price and support are agreed with you before work starts."],
  ["What do you mean by an online app?", "A tool that opens in a web browser, such as a dashboard, job tracker or booking tool. It can be designed for a phone or computer. If you need an app downloaded from an app store, we discuss that as a separate project."],
  ["What is an automated workflow?", "A series of steps that runs when something happens. For example, a new enquiry can create a record, notify you and set a follow-up task. We agree which steps run automatically and where a person needs to review."],
  ["Can you connect the tools I already use?", "Yes, where the tools support it. We look at your current setup, check what can be connected and explain any limits or ongoing costs before agreeing the work."],
  ["Do I need a whole new system?", "You can start with one website, one online tool or one repetitive task. We agree a practical scope around what your business needs now."],
] as const;

const projectSteps = [
  ["Tell us what you need", "Describe what you want to build or improve and what you use today. You don’t need a technical brief."],
  ["Agree the plan", "We explain the proposed solution, what’s included, the price and the expected timescale."],
  ["Build and check together", "We build the agreed solution, walk you through it and get your approval before launch."],
  ["Launch and hand over", "We show you how to use it and confirm who will look after it, including any ongoing support."],
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

export default function App({ heroDirection = "type" }: { heroDirection?: "signal" | "flow" | "type" }) {
  const rootRef = useRef<HTMLElement>(null);
  useAmbientEffects(rootRef);
  useSiteMotion(rootRef);
  const [theme, setTheme] = useState<SiteTheme>("dark");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileMenuMotion, setMobileMenuMotion] = useState(false);
  const [connectionIndex, setConnectionIndex] = useState(0);
  const [selectedOutcome, setSelectedOutcome] = useState<string | null>(null);
  const [formStatus, setFormStatus] = useState<FormStatus>("idle");
  const [formMessage, setFormMessage] = useState("");
  const previewOnly = process.env.NEXT_PUBLIC_MOTUS_LOCAL_PREVIEW === "1";

  const showroomDemos = demoCatalog.filter((demo) => demo.status === "ready");
  const exampleSlug = useSyncExternalStore(subscribeToExample, getExampleSnapshot, () => "");
  const privacyEnquiry = useSyncExternalStore(subscribeToExample, getPrivacySnapshot, () => false);
  const selectedDemo = showroomDemos.find((demo) => demo.slug === exampleSlug && demo.url);
  const connection = connectionExamples[connectionIndex];
  const enquiryTopics = [
    { value: "Websites", label: "Website" },
    { value: "Custom online apps", label: "Custom online app" },
    { value: "Automations and workflows", label: "Automation or workflow" },
    { value: "Connect your tools", label: "Connect existing tools" },
    { value: "Free workflow review", label: "Free workflow review" },
    { value: "Something different", label: "Something else" },
  ];
  // Keep existing demo/calculator links useful with the shorter topic list.
  // Values sent to the existing enquiry endpoint retain their established names.
  const legacyTopics: Record<string, string> = {
    "Get online professionally": "Websites",
    "Make booking easier": "Custom online apps",
    "Stay on top of invoices": "Automations and workflows",
    "Keep track of enquiries": "Automations and workflows",
    "Cut repeated admin": "Automations and workflows",
    "See what needs attention": "Custom online apps",
  };
  const requestedTopic = selectedOutcome ?? selectedDemo?.enquiryOutcome ?? "";
  const enquiryOutcome = privacyEnquiry ? "Privacy question" : enquiryTopics.some((topic) => topic.value === requestedTopic)
    ? requestedTopic : legacyTopics[requestedTopic] ?? (requestedTopic ? "Something different" : "");
  useEffect(() => {
    return applySiteTheme(theme);
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
    if (previewOnly) {
      setFormStatus("idle");
      setFormMessage("Preview only. Your enquiry has not been sent and your details have not been saved.");
      return;
    }
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
    <main ref={rootRef} id="top" className="landing-page offer-clarity-page">
      <CursorGlow rootRef={rootRef} />
      <div className="reading-progress" aria-hidden="true"><span /></div>
      <a id="home-skip-link" className="skip-link" href="#main-content">Skip to content</a>
      <div className="backdrop" aria-hidden="true" />

      <header className="navbar">
        <a id="motus-home-link" className="logo" href="#top" aria-label="Motus home"><span aria-hidden="true">✦</span> Motus</a>
        <nav aria-label="Primary navigation">
          <a id="nav-solutions-link" href="#solutions">What we build</a>
          <a id="nav-pricing-link" href="#pricing">Your project</a>
          <a id="nav-examples-link" href="#examples">Examples</a>
          <a id="nav-automation-link" href="#automation">How tools connect</a>
          <a id="nav-client-feedback-link" href="#client-feedback">Client feedback</a>
          <a id="nav-contact-link" href="#contact">Contact</a>
        </nav>
        <div className="header-actions">
          <button
            id="theme-toggle"
            className="theme-toggle"
            type="button"
            aria-pressed={theme === "dark"}
            onClick={() => setTheme((current) => current === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? "Light view" : "Dark view"}
          </button>
          <a id="header-enquiry-link" className="header-cta" href="#contact">Discuss a project</a>
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
          <a id="mobile-nav-solutions-link" href="#solutions" onClick={() => { setMobileMenuMotion(false); setMobileMenuOpen(false); }}>What we build</a>
          <a id="mobile-nav-pricing-link" href="#pricing" onClick={() => { setMobileMenuMotion(false); setMobileMenuOpen(false); }}>Your project</a>
          <a id="mobile-nav-examples-link" href="#examples" onClick={() => { setMobileMenuMotion(false); setMobileMenuOpen(false); }}>Examples</a>
          <a id="mobile-nav-automation-link" href="#automation" onClick={() => { setMobileMenuMotion(false); setMobileMenuOpen(false); }}>How tools connect</a>
          <a id="mobile-nav-client-feedback-link" href="#client-feedback" onClick={() => { setMobileMenuMotion(false); setMobileMenuOpen(false); }}>Client feedback</a>
          <a id="mobile-nav-contact-link" href="#contact" onClick={() => { setMobileMenuMotion(false); setMobileMenuOpen(false); }}>Contact</a>
        </nav>
      </header>

      <section className="hero" id="main-content" tabIndex={-1} aria-labelledby="hero-title">
        <SignalField />
        <div className="hero-copy">
          <p className="badge" data-enter="60">For UK small businesses</p>
          <h1 id="hero-title" data-enter="150"><span className="hero-title-mask"><span data-title-reveal>Websites, apps &amp; automations.</span></span><span className="hero-title-mask"><em data-title-reveal>Built around your business.</em></span></h1>
          <p className="subheading" data-enter="240">We build websites, custom online apps and automated workflows for small businesses. We also connect the tools you already use, so enquiries, bookings and everyday work stay organised.</p>
          <div className="hero-actions" data-enter="330">
            <a id="hero-enquiry-link" className="primary-button" href="#contact">Discuss a project <ArrowRight size={15} aria-hidden="true" /></a>
            <a id="hero-examples-link" className="secondary-button" href="#examples">Try the demos</a>
          </div>
        </div>

        <HeroShowcase direction={heroDirection} />
      </section>


      <section className="site-section solutions-section" id="solutions" aria-labelledby="solutions-title">
        <div className="section-intro reveal">
          <span>What we build</span>
          <h2 id="solutions-title">The right tools.<br /><em>Built for the way you work.</em></h2>
          <p>A website for your customers. An app for your team. Automations that handle repeat tasks. We help you choose the parts your business needs and connect them where useful.</p>
        </div>
        <div className="solution-grid capability-grid">
          {solutions.map(({ title, label, text, example, icon: Icon }, index) => (
            <MotionPanel className="solution-item capability-item reveal" key={title}>
              <div className="capability-heading"><Icon size={23} strokeWidth={1.4} aria-hidden="true" /><span>{label}</span></div>
              <h3>{title}</h3>
              <p>{text}</p>
              <p className="capability-example">{example}</p>
              <a id={"solution-" + (index + 1) + "-link"} href="#contact" onClick={() => setSelectedOutcome(title)}>Discuss {index === 0 ? "a website" : index === 1 ? "an online app" : index === 2 ? "an automation" : "a connection"} <ArrowRight size={14} aria-hidden="true" /></a>
            </MotionPanel>
          ))}
        </div>
        <div className="scope-note reveal"><strong>Start with what you need now.</strong><p>One website, one repetitive task or a connected setup. We design and build it for your business, with the scope, price and support agreed before work starts.</p></div>
      </section>

      <section className="site-section examples-section" id="examples" aria-labelledby="examples-title">
        <div className="section-intro reveal">
          <span>Examples to try</span>
          <h2 id="examples-title">Explore a website.<br /><em>Try an online tool.</em></h2>
          <p>Open a complete salon website, try bookings, enquiries and invoices, or see property emails organised. Each example shows a different part of what we can build for your business.</p>
          <p className="muted-note">These are demonstrations with fictional information. Your project is scoped separately. Nothing is booked or sent.</p>
        </div>
        <div className="showroom-demo-list">
          {showroomDemos.map((demo) => (
            <MotionPanel className="ledger-card reveal" key={demo.slug}>
              <div><span>{demo.name ?? demo.title}</span><small>{demo.slug === "salon-website" ? "Website demonstration" : demo.slug === "property-desk" ? "Email automation demonstration" : "Online app and workflow demo"}</small></div>
              <h3>{demo.enquiryOutcome ?? demo.category ?? demo.title}</h3>
              <p>{demo.demoSummary ?? demo.interfaceSummary}</p>
              {demo.startHint && <p className="demo-start-hint"><strong>Try it:</strong> {demo.startHint}</p>}
              <a id={demo.slug === "ledger-desk" ? "ledger-demo-link" : "showroom-demo-" + demo.slug + "-link"} href={demo.url ?? "/demos"}>{demo.ctaLabel ?? "Try this example"} <b aria-hidden="true">→</b></a>
            </MotionPanel>
          ))}
        </div>
        <a id="view-showroom-link" className="text-route reveal" href="/demos">See all examples <b aria-hidden="true">→</b></a>
      </section>

      <section className="site-section automation-section connected-section" id="automation" aria-labelledby="automation-title">
        <div className="section-intro reveal">
          <span>How the pieces connect</span>
          <h2 id="automation-title">Your tools.<br /><em>Working together.</em></h2>
          <p>Connect your website, forms, email, calendars and business records so information reaches the right place and the next step stays clear.</p>
          <p id="connection-instructions" className="muted-note">Choose an example below to see how the steps connect. These are possible setups; the tools and steps are agreed around your business.</p>
        </div>
        <div className="connection-console reveal">
          <div className="connection-tabs" role="tablist" aria-label="Choose a connected workflow example" aria-describedby="connection-instructions">
            {connectionExamples.map((example, index) => <button id={"connection-tab-" + example.id} key={example.id} type="button" role="tab" aria-selected={connectionIndex === index} aria-controls="connection-example-panel" tabIndex={connectionIndex === index ? 0 : -1} onClick={() => { setConnectionIndex(index); }} onKeyDown={(event) => {
              const direction = event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;
              const next = event.key === "Home" ? 0 : event.key === "End" ? connectionExamples.length - 1 : direction ? (index + direction + connectionExamples.length) % connectionExamples.length : null;
              if (next === null) return;
              event.preventDefault();
              setConnectionIndex(next);
              document.getElementById("connection-tab-" + connectionExamples[next].id)?.focus();
            }}>{example.label}</button>)}
          </div>
          <div id="connection-example-panel" className="connection-example" role="tabpanel" tabIndex={0} aria-labelledby={"connection-tab-" + connection.id}>
            <span className="example-kind">Illustrative concept</span>
            <h3>{connection.title}</h3>
            <p>{connection.description}</p>
            <ol className="connection-steps">
              {connection.steps.map(({ title, text, icon: Icon }, index) => <li key={title}>
                <div className="connection-step-icon"><Icon size={21} strokeWidth={1.5} aria-hidden="true" /></div>
                <div><small>Step {index + 1}</small><h4>{title}</h4><p>{text}</p></div>
              </li>)}
            </ol>
            <div className="connection-tools"><span>Tools that could be connected</span><ul>{connection.tools.map((tool) => <li key={tool}>{tool}</li>)}</ul></div>
            <p className="connection-boundary">{connection.note}</p>

          </div>
        </div>
      </section>

      <BusinessImpact config={impactConfig} onDiscuss={setSelectedOutcome} />

      <section className="site-section project-section" id="pricing" aria-labelledby="pricing-title">
        <div className="section-intro reveal"><span>Your project</span><h2 id="pricing-title">Know what’s included before we start.</h2><p>Tell us what you need. We’ll explain the options and agree what we’ll build, the price and the support included before work begins.</p></div>
        <div className="project-agreement reveal">
          <span className="project-eyebrow">Built around your business</span>
          <h3>Let’s talk it through.</h3>
          <dl><div><dt>The work</dt><dd>The website, app, automation or connections we’ll build, with the features and limits clearly explained.</dd></div><div><dt>The price</dt><dd>A quote and expected delivery timescale, with any ongoing software, hosting or support costs explained.</dd></div><div><dt>The support</dt><dd>Guidance on using what we build, who will look after it and what help is included afterwards.</dd></div></dl>
          <a id="project-enquiry-link" className="primary-button" href="#contact">Discuss a project <b aria-hidden="true">→</b></a>
        </div>
      </section>

      <section className="site-section client-feedback-section" id="client-feedback" aria-labelledby="client-feedback-title">
        <div className="section-intro reveal"><span>Client feedback</span><h2 id="client-feedback-title">Clear communication.<br /><em>Personal support.</em></h2><p>Good work starts with a conversation. You speak directly with the person building your website, app or automation.</p></div>
        <figure className="client-feedback reveal">
          <div className="client-feedback-photo"><Image src="/images/client-feedback/london-barber.webp" alt="Illustrative photograph of a barber working, viewed from behind" width={800} height={1000} unoptimized loading="lazy" /><span>Illustrative image · not the client</span></div>
          <figcaption>
            <div className="feedback-stars" role="img" aria-label="Craig’s five-star rating">{[0, 1, 2, 3, 4].map((star) => <svg key={star} viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01Z" /></svg>)}</div>
            <blockquote>“One of the best tools I’ve used for my business. It’s been tailored to the way I work, so it feels simple to use and makes sense for me. The service has been excellent too, with personal attention, clear explanations and someone who takes the time to understand what I need.”</blockquote>
            <div className="feedback-client"><strong>Craig</strong><span>Men’s grooming specialist</span></div>
          </figcaption>
        </figure>
      </section>

      <section className="site-section process-section" id="about" aria-labelledby="process-title"><div className="section-intro reveal"><span>Working with Motus</span><h2 id="process-title">From your first conversation to a working solution.</h2></div><ol className="process-list">{projectSteps.map(([title, text], index) => <li className="reveal" key={title}><span>{String(index + 1).padStart(2, "0")}</span><div><strong>{title}</strong><p>{text}</p></div></li>)}</ol></section>


      <section className="site-section questions-section" id="questions" aria-labelledby="questions-title">
        <div className="section-intro reveal"><span>A few useful answers</span><h2 id="questions-title">You bring the business.<br /><em>We explain the options.</em></h2><p>You do not need a technical brief. Start with what you want to build or the task you want to make easier.</p></div>
        <div className="questions-list">{questions.map(([question, answer], index) => <details className="reveal" key={question}><summary id={"question-" + (index + 1)}>{question}<span aria-hidden="true">+</span></summary>{answer.split("\n\n").map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</details>)}</div>
      </section>

      <section className="site-section contact-section" id="contact" aria-labelledby="contact-title">
        <div className="section-intro reveal">
          <span>A useful first step</span>
          <h2 id="contact-title" tabIndex={-1}>{privacyEnquiry ? "Contact Motus about your information." : "Tell us what you want to build or improve."}</h2>
          {privacyEnquiry ? <p>Use this form for a privacy question or a request about your information. A business name is optional. Motus normally replies by email within two business days.</p> : <>
            <p>A short explanation is enough to get started. Tell us what you have in mind, what’s taking up your time or what you’d like to work better.</p>
            <p>Not sure where to start? Ask for a free workflow review. We’ll look at one routine process with you, identify repeated work and suggest a practical next step.</p>
            <p>We normally reply by email within two business days.</p>
          </>}
          <div className="contact-trust">
            <p><strong>We agree the work first.</strong> You know the price and what is included before building starts.</p>
            <p><strong>You stay in control.</strong> Anything important or unclear comes back to you to check.</p>
          </div>
        </div>
        <form className="light-form reveal" id="enquiry-form" onSubmit={handleSubmit}>
          {previewOnly && <p className="preview-form-note"><strong>Website preview.</strong> You can try this form. Your details will not be sent or saved.</p>}
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
                {enquiryTopics.map(({ value, label }) => <option key={value} value={value}>{label}</option>)}
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

      <footer className="site-footer"><a id="footer-home-link" className="logo" href="#top"><span aria-hidden="true">✦</span> Motus</a><p>Websites, online apps and automations for UK small businesses.</p><nav aria-label="Footer navigation"><a id="footer-solutions-link" href="#solutions">What we build</a><Link id="footer-examples-link" href="/demos">Examples</Link><a id="footer-pricing-link" href="#pricing">Your project</a><Link id="footer-privacy-link" href="/privacy">Privacy</Link></nav><small>© 2026 Motus.</small></footer>
    </main>
  );
}
