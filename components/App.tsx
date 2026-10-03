"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { demoCatalog } from "@/lib/demo-catalog";

type FormStatus = "idle" | "sending" | "success" | "error";
type QueueFilter = "all" | "moving" | "attention" | "complete";
type Theme = "dark" | "light";
const dashboardViews = ["Overview", "Enquiries", "Work queue", "Bookings", "Invoices", "Reports", "Follow-ups", "Notifications", "Settings"] as const;
const dashboardActions = ["New enquiry", "Reply", "Assign", "Record update", "Prepare invoice", "Follow up"] as const;
type DashboardView = (typeof dashboardViews)[number];
type DashboardAction = (typeof dashboardActions)[number];
type DashboardActivity = { date: string; description: string; outcome: string; status: "pending" | "moving" | "complete" };
type DashboardWorkItem = { id: string; dot: "indigo" | "amber" | "green"; title: string; status: string };
type DashboardStat = { label: string; value: number; tone?: "attention" };
type DashboardViewContent = {
  eyebrow: string;
  title: string;
  metric: number;
  metricLabel: string;
  metricDescription: string;
  stats: DashboardStat[];
  workTitle: string;
  work: DashboardWorkItem[];
  activities: DashboardActivity[];
};

const overviewWorkItems: DashboardWorkItem[] = [
  { id: "growth", dot: "indigo", title: "Growth consultation", status: "Needs you" },
  { id: "invoice", dot: "amber", title: "Invoice follow-up", status: "2 days" },
  { id: "booking", dot: "green", title: "Booking request", status: "Moving" },
];

const defaultDashboardActivities: DashboardActivity[] = [
  { date: "Today", description: "Website enquiry received", outcome: "Acknowledgement sent", status: "pending" },
  { date: "Today", description: "Growth consultation", outcome: "Thursday held", status: "moving" },
  { date: "Yesterday", description: "Booking request", outcome: "Record updated", status: "complete" },
  { date: "Yesterday", description: "Invoice reminder", outcome: "Owner notified", status: "complete" },
];

const dashboardViewContent: Record<DashboardView, DashboardViewContent> = {
  Overview: { eyebrow: "Illustrative owner view", title: "See what needs you.", metric: 6, metricLabel: "actions", metricDescription: "need a clear next step today", stats: [{ label: "New", value: 3 }, { label: "Waiting", value: 2 }, { label: "Overdue", value: 1, tone: "attention" }], workTitle: "Work today", work: overviewWorkItems, activities: defaultDashboardActivities },
  Enquiries: { eyebrow: "Illustrative customer interest", title: "Review new enquiries.", metric: 3, metricLabel: "enquiries", metricDescription: "are ready for a person to qualify", stats: [{ label: "New", value: 3 }, { label: "Acknowledged", value: 2 }, { label: "Needs reply", value: 1, tone: "attention" }], workTitle: "Enquiries to review", work: [{ id: "landscape", dot: "indigo", title: "Landscaping enquiry", status: "Needs review" }, { id: "office", dot: "amber", title: "Office fit-out question", status: "Needs you" }, { id: "consultation", dot: "green", title: "Growth consultation", status: "Moving" }], activities: [{ date: "Today", description: "Landscaping enquiry received", outcome: "Acknowledgement sent", status: "pending" }, { date: "Today", description: "Office fit-out question", outcome: "Review requested", status: "pending" }, { date: "Yesterday", description: "Growth consultation", outcome: "Thursday held", status: "moving" }, { date: "Yesterday", description: "Website enquiry archived", outcome: "No action needed", status: "complete" }] },
  "Work queue": { eyebrow: "Illustrative work queue", title: "Keep the next step visible.", metric: 5, metricLabel: "items", metricDescription: "are moving through the team view", stats: [{ label: "Needs you", value: 2, tone: "attention" }, { label: "Moving", value: 2 }, { label: "Complete", value: 1 }], workTitle: "Next work", work: [{ id: "consultation", dot: "indigo", title: "Growth consultation", status: "Needs you" }, { id: "site-visit", dot: "amber", title: "Site visit request", status: "Needs you" }, { id: "invoice-follow-up", dot: "green", title: "Invoice follow-up", status: "2 days" }], activities: [{ date: "Today", description: "Site visit request routed", outcome: "Owner review requested", status: "pending" }, { date: "Today", description: "Growth consultation assigned", outcome: "Thursday held", status: "moving" }, { date: "Yesterday", description: "Invoice follow-up prepared", outcome: "Awaiting check", status: "pending" }, { date: "Yesterday", description: "Work item completed", outcome: "No action needed", status: "complete" }] },
  Bookings: { eyebrow: "Illustrative booking view", title: "See requests that need a person.", metric: 2, metricLabel: "bookings", metricDescription: "need an availability decision", stats: [{ label: "New", value: 1 }, { label: "Confirmed", value: 1 }, { label: "Unavailable", value: 0, tone: "attention" }], workTitle: "Booking requests", work: [{ id: "haircut", dot: "indigo", title: "Weekend booking request", status: "Needs review" }, { id: "consult", dot: "green", title: "Growth consultation", status: "Confirmed" }, { id: "reschedule", dot: "amber", title: "Reschedule request", status: "Needs you" }], activities: [{ date: "Today", description: "Weekend booking request", outcome: "Availability check needed", status: "pending" }, { date: "Today", description: "Growth consultation", outcome: "Confirmed", status: "complete" }, { date: "Yesterday", description: "Reschedule request", outcome: "Owner notified", status: "pending" }, { date: "Yesterday", description: "Booking reminder", outcome: "Recorded", status: "complete" }] },
  Invoices: { eyebrow: "Illustrative invoice view", title: "Bring follow-ups forward.", metric: 2, metricLabel: "invoices", metricDescription: "need a clear owner decision", stats: [{ label: "Overdue", value: 1, tone: "attention" }, { label: "Due soon", value: 1 }, { label: "Cleared", value: 3 }], workTitle: "Invoice follow-ups", work: [{ id: "invoice-204", dot: "amber", title: "Invoice INV-204", status: "Needs review" }, { id: "invoice-198", dot: "indigo", title: "Invoice INV-198", status: "2 days" }, { id: "invoice-191", dot: "green", title: "Invoice INV-191", status: "Cleared" }], activities: [{ date: "Today", description: "Invoice INV-204 flagged", outcome: "Human review requested", status: "pending" }, { date: "Today", description: "Invoice INV-198 reminder", outcome: "Due in two days", status: "moving" }, { date: "Yesterday", description: "Invoice INV-191", outcome: "Record matched", status: "complete" }, { date: "Yesterday", description: "Invoice check", outcome: "Owner notified", status: "complete" }] },
  Reports: { eyebrow: "Illustrative owner report", title: "See patterns before they become problems.", metric: 4, metricLabel: "signals", metricDescription: "summarise the week so far", stats: [{ label: "Enquiries", value: 6 }, { label: "Bookings", value: 4 }, { label: "Needs review", value: 2, tone: "attention" }], workTitle: "This week", work: [{ id: "enquiry-pattern", dot: "indigo", title: "Enquiry response pattern", status: "Needs review" }, { id: "booking-handover", dot: "green", title: "Booking handover", status: "Moving" }, { id: "invoice-age", dot: "amber", title: "Invoice age review", status: "Needs you" }], activities: [{ date: "Today", description: "Weekly owner summary", outcome: "Ready to review", status: "pending" }, { date: "Today", description: "Booking handover pattern", outcome: "Moving", status: "moving" }, { date: "Yesterday", description: "Enquiry response pattern", outcome: "Recorded", status: "complete" }, { date: "Yesterday", description: "Invoice age review", outcome: "Owner notified", status: "pending" }] },
  "Follow-ups": { eyebrow: "Illustrative follow-up view", title: "Keep useful promises moving.", metric: 2, metricLabel: "follow-ups", metricDescription: "need a person to decide the next step", stats: [{ label: "Due today", value: 1, tone: "attention" }, { label: "Scheduled", value: 1 }, { label: "Completed", value: 4 }], workTitle: "Follow-ups due", work: [{ id: "consult-follow-up", dot: "indigo", title: "Growth consultation follow-up", status: "Needs you" }, { id: "invoice-follow-up", dot: "amber", title: "Invoice follow-up", status: "2 days" }, { id: "booking-follow-up", dot: "green", title: "Booking follow-up", status: "Complete" }], activities: [{ date: "Today", description: "Growth consultation follow-up", outcome: "Owner decision needed", status: "pending" }, { date: "Today", description: "Invoice follow-up", outcome: "Scheduled", status: "moving" }, { date: "Yesterday", description: "Booking follow-up", outcome: "Completed", status: "complete" }, { date: "Yesterday", description: "Website enquiry follow-up", outcome: "Recorded", status: "complete" }] },
  Notifications: { eyebrow: "Illustrative notifications", title: "Read the updates that need attention.", metric: 3, metricLabel: "updates", metricDescription: "have been surfaced for the owner", stats: [{ label: "New", value: 1 }, { label: "Mentioned", value: 1 }, { label: "Needs review", value: 1, tone: "attention" }], workTitle: "Latest updates", work: [{ id: "new-enquiry", dot: "indigo", title: "New website enquiry", status: "Needs review" }, { id: "staff-update", dot: "green", title: "Staff update recorded", status: "New" }, { id: "invoice-alert", dot: "amber", title: "Invoice attention alert", status: "Needs you" }], activities: [{ date: "Now", description: "New website enquiry", outcome: "Review requested", status: "pending" }, { date: "Today", description: "Staff update", outcome: "Recorded", status: "complete" }, { date: "Today", description: "Invoice attention alert", outcome: "Owner notified", status: "pending" }, { date: "Yesterday", description: "Booking update", outcome: "Completed", status: "complete" }] },
  Settings: { eyebrow: "Illustrative setup", title: "Shape the view around how work happens.", metric: 4, metricLabel: "choices", metricDescription: "define the useful owner view", stats: [{ label: "Views", value: 3 }, { label: "Rules", value: 1 }, { label: "Changes pending", value: 0, tone: "attention" }], workTitle: "View setup", work: [{ id: "owner-view", dot: "indigo", title: "Owner attention view", status: "Active" }, { id: "notification-rule", dot: "green", title: "Notification rule", status: "Active" }, { id: "review-rule", dot: "amber", title: "Human review rule", status: "Active" }], activities: [{ date: "Today", description: "Owner view preference", outcome: "Saved locally", status: "complete" }, { date: "Today", description: "Notification rule", outcome: "Human review retained", status: "complete" }, { date: "Yesterday", description: "Work queue preference", outcome: "Recorded", status: "complete" }, { date: "Yesterday", description: "Change review", outcome: "No action needed", status: "complete" }] },
};

const dashboardActionContent: Record<DashboardAction, { message: string; activity: DashboardActivity }> = {
  "New enquiry": { message: "Fictional enquiry added for human review. Nothing has been sent.", activity: { date: "Now", description: "Fictional website enquiry added", outcome: "Human review requested", status: "pending" } },
  Reply: { message: "Illustrative reply drafted for a person to review. Nothing has been sent.", activity: { date: "Now", description: "Reply drafted", outcome: "Ready for human review", status: "pending" } },
  Assign: { message: "Illustrative work has been assigned in this preview only.", activity: { date: "Now", description: "Growth consultation assigned", outcome: "Owner view updated", status: "moving" } },
  "Record update": { message: "Illustrative update recorded locally in this preview.", activity: { date: "Now", description: "Work update recorded", outcome: "Activity register updated", status: "complete" } },
  "Prepare invoice": { message: "Illustrative invoice draft prepared for a person to check.", activity: { date: "Now", description: "Invoice draft prepared", outcome: "Awaiting human check", status: "pending" } },
  "Follow up": { message: "Illustrative follow-up queued. A person still owns the decision.", activity: { date: "Now", description: "Follow-up queued", outcome: "Owner decision remains", status: "moving" } },
};

const solutions = [
  ["Website · From GBP 495", "Get online professionally", "A website shaped around your offer, customer journey and the next step you need people to take."],
  ["Tailored system · Scoped and quoted", "Never miss an enquiry", "Receive new interest, acknowledge it and make the useful next action visible to the right person."],
  ["Tailored system · Scoped and quoted", "Fill more bookings", "Make booking easier, keep the handover clear and surface requests that need a person."],
  ["Tailored system · Scoped and quoted", "Cut repeated admin", "Reduce copying, chasing and retyping around the process your team already uses."],
  ["Tailored system · Scoped and quoted", "Stay on top of invoices", "Bring overdue or unclear work forward with the evidence an owner needs to review it."],
  ["Tailored system · Scoped and quoted", "See what needs attention", "Give customers, staff and owners the useful view each person needs to act and decide."],
] as const;

const packages = [
  ["Motus Launch", "GBP 495", "GBP 49/month", "A focused professional presence for a business getting online properly.", ["One clear customer journey", "Mobile-first build", "Contact route", "Technical care"]],
  ["Motus Business", "GBP 895", "GBP 69/month", "A fuller service website for a business with more to explain or organise.", ["Expanded page structure", "Service-led content", "Stronger enquiry journey", "Technical care"]],
  ["Motus Growth", "GBP 1,395", "GBP 89/month", "A richer foundation for a business ready to demonstrate how it works.", ["Advanced page structure", "Interactive demonstration", "Conversion-focused journey", "Technical care"]],
] as const;

const queueItems = [
  ["attention", "Enquiry", "Growth consultation · #0248", "Details checked and acknowledgement sent", "Confirm Thursday availability", "Needs you"],
  ["attention", "Field job", "Boiler service · Job #107", "Staff update and photos recorded", "Prepare the invoice", "Needs you"],
  ["moving", "Renewal", "Policy renewal · R-418", "Reminder sent and documents recorded", "Waiting for the customer", "Moving"],
  ["moving", "Candidate", "Application · C-309", "Application logged and receipt confirmed", "Eligibility checks running", "Moving"],
  ["complete", "Invoice", "Payment received · INV-204", "Record matched and account updated", "No action required", "Complete"],
] as const;

const process = [
  ["Understand", "Identify the outcome, current process and person who owns the decision."],
  ["Build", "Create only the agreed website, automation or practical solution."],
  ["Approve", "Review the real scope, behaviour and evidence before release."],
  ["Operate", "Maintain the agreed service without turning support into unlimited development."],
] as const;

export default function App() {
  const rootRef = useRef<HTMLElement>(null);
  const [theme, setTheme] = useState<Theme>("dark");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileMenuMotion, setMobileMenuMotion] = useState(false);
  const [dashboardHighlighted, setDashboardHighlighted] = useState(false);
  const [dashboardView, setDashboardView] = useState<DashboardView>("Overview");
  const [dashboardSearch, setDashboardSearch] = useState("");
  const [dashboardMessage, setDashboardMessage] = useState("This preview uses fictional local data only. Nothing is sent.");
  const [dashboardActivity, setDashboardActivity] = useState<DashboardActivity | null>(null);
  const [hasPreviewEnquiry, setHasPreviewEnquiry] = useState(false);
  const [hasPreviewItem, setHasPreviewItem] = useState(false);
  const [dashboardOptionsOpen, setDashboardOptionsOpen] = useState(false);
  const [dashboardOptionsMotion, setDashboardOptionsMotion] = useState(false);
  const [queueFilter, setQueueFilter] = useState<QueueFilter>("all");
  const [teamSize, setTeamSize] = useState(5);
  const [adminTime, setAdminTime] = useState(20);
  const [hourlyCost, setHourlyCost] = useState(18);
  const [selectedOutcome, setSelectedOutcome] = useState("");
  const [formStatus, setFormStatus] = useState<FormStatus>("idle");
  const [formMessage, setFormMessage] = useState("");

  const showroomDemos = demoCatalog.filter((demo) => demo.status === "ready");
  const estimate = useMemo(() => {
    const weeklyHours = Math.round(teamSize * 40 * (adminTime / 100));
    return { weeklyHours, annualCost: weeklyHours * hourlyCost * 52 };
  }, [adminTime, hourlyCost, teamSize]);
  const visibleQueue = queueFilter === "all" ? queueItems : queueItems.filter(([status]) => status === queueFilter);
  const dashboardViewInfo = dashboardViewContent[dashboardView];
  const dashboardMetric = dashboardViewInfo.metric + (dashboardView === "Enquiries" && hasPreviewEnquiry ? 1 : 0) + (dashboardView === "Work queue" && hasPreviewItem ? 1 : 0);
  const dashboardStats = dashboardViewInfo.stats.map((stat) => ({
    ...stat,
    value: stat.value + (dashboardView === "Enquiries" && hasPreviewEnquiry && stat.label === "New" ? 1 : 0) + (dashboardView === "Work queue" && hasPreviewItem && stat.label === "Needs you" ? 1 : 0),
  }));
  const dashboardWork = [
    ...dashboardViewInfo.work,
    ...(hasPreviewEnquiry && dashboardView === "Enquiries" ? [{ id: "preview-enquiry", dot: "indigo" as const, title: "New fictional website enquiry", status: "Needs review" }] : []),
    ...(hasPreviewItem && dashboardView === "Work queue" ? [{ id: "quote", dot: "amber" as const, title: "Supplier quote review", status: "Needs you" }] : []),
  ];
  const dashboardSearchTerm = dashboardSearch.trim().toLowerCase();
  const visibleDashboardWork = dashboardSearchTerm
    ? dashboardWork.filter((item) => `${item.title} ${item.status}`.toLowerCase().includes(dashboardSearchTerm))
    : dashboardWork;
  const dashboardActivityRows = dashboardActivity ? [dashboardActivity, ...dashboardViewInfo.activities.slice(0, 3)] : dashboardViewInfo.activities;

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

  useEffect(() => {
    if (!dashboardOptionsOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setDashboardOptionsMotion(false);
        setDashboardOptionsOpen(false);
        document.getElementById("dashboard-more-options")?.focus();
      }
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [dashboardOptionsOpen]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const targets = Array.from(root.querySelectorAll<HTMLElement>(".reveal"));
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion || !("IntersectionObserver" in window)) {
      targets.forEach((target) => target.classList.add("is-visible"));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }),
      { threshold: 0.12 },
    );
    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (formStatus === "sending") return;
    const form = event.currentTarget;
    const data = new FormData(form);
    const payload = {
      fullName: String(data.get("fullName") ?? "").trim(),
      businessName: String(data.get("businessName") ?? "").trim(),
      email: String(data.get("email") ?? "").trim(),
      outcome: String(data.get("outcome") ?? "").trim(),
      headache: String(data.get("headache") ?? "").trim(),
      investment: String(data.get("investment") ?? "").trim(),
      existing: String(data.get("existing") ?? "").trim(),
      websiteUrl: String(data.get("websiteUrl") ?? "").trim(),
      website: String(data.get("website") ?? "").trim(),
      system: "",
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
      setSelectedOutcome("");
      setFormStatus("success");
      setFormMessage("Received. Motus will review the requirement and reply by email.");
    } catch (error) {
      setFormStatus("error");
      setFormMessage(error instanceof Error ? error.message : "Your enquiry could not be sent.");
    }
  };

  const handleDashboardAction = (action: DashboardAction) => {
    const content = dashboardActionContent[action];
    if (action === "New enquiry") {
      setHasPreviewEnquiry(true);
      setDashboardView("Enquiries");
    }
    setDashboardActivity(content.activity);
    setDashboardMessage(content.message);
  };

  const handleDashboardViewChange = (view: DashboardView) => {
    setDashboardView(view);
    setDashboardActivity(null);
    setDashboardMessage(`Showing ${view.toLowerCase()} in this fictional preview.`);
  };

  const addDashboardItem = () => {
    setDashboardView("Work queue");
    setHasPreviewItem(true);
    setDashboardActivity({ date: "Now", description: "Illustrative work item added", outcome: "Owner review requested", status: "pending" });
    setDashboardMessage("Illustrative work item added for owner review. Nothing is connected or sent.");
  };

  const resetDashboardPreview = () => {
    setDashboardView("Overview");
    setDashboardSearch("");
    setDashboardActivity(null);
    setHasPreviewEnquiry(false);
    setHasPreviewItem(false);
    setDashboardOptionsOpen(false);
    setDashboardOptionsMotion(false);
    setDashboardMessage("Preview reset. All records remain fictional and local to this page.");
  };

  return (
    <main ref={rootRef} id="top" className="landing-page">
      <a className="skip-link" href="#main-content">Skip to content</a>
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
          <a id="nav-automation-link" href="#automation">Automation</a>
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
          <a id="mobile-nav-automation-link" href="#automation" onClick={() => { setMobileMenuMotion(false); setMobileMenuOpen(false); }}>Automation</a>
          <a id="mobile-nav-contact-link" href="#contact" onClick={() => { setMobileMenuMotion(false); setMobileMenuOpen(false); }}>Contact</a>
        </nav>
      </header>

      <section className="hero" id="main-content" tabIndex={-1} aria-labelledby="hero-title">
        <div className="hero-copy">
          <p className="badge" data-enter="60">Tailored digital systems for UK businesses</p>
          <h1 id="hero-title" data-enter="150">Built around your business. <em>Not the other way round.</em></h1>
          <p className="subheading" data-enter="240">Generic software asks your company to adapt to it. Motus adapts the system to your company.</p>
          <div className="hero-actions" data-enter="330">
            <a id="hero-enquiry-link" className="primary-button" href="#contact">Tell us what you need</a>
            <button
              id="dashboard-tour"
              className="tour-button"
              type="button"
              aria-pressed={dashboardHighlighted}
            aria-label="Highlight the illustrative tailored system preview"
              onClick={() => setDashboardHighlighted((current) => !current)}
            ><span aria-hidden="true">▶</span></button>
          </div>
          <p className="tour-status" aria-live="polite">{dashboardHighlighted ? "Illustrative tailored system highlighted. Human decisions remain visible." : ""}</p>
        </div>

        <section className={`dashboard-preview${dashboardHighlighted ? " is-highlighted" : ""}`} id="dashboard-preview" aria-label="Illustrative Motus tailored system preview">
          <div className="dashboard-window">
            <header className="dashboard-topbar">
              <div className="dashboard-brand"><span>M</span><strong>Motus</strong><i aria-hidden="true">⌄</i></div>
              <label className="search"><span aria-hidden="true">⌕</span><input id="dashboard-search" aria-describedby="dashboard-search-feedback" aria-label="Search illustrative preview" value={dashboardSearch} onChange={(event) => setDashboardSearch(event.target.value)} placeholder="Search work, people and actions" /><kbd>⌘ K</kbd><span className="dashboard-search-feedback" id="dashboard-search-feedback" role="status">{dashboardSearchTerm ? `${visibleDashboardWork.length} illustrative ${visibleDashboardWork.length === 1 ? "match" : "matches"}` : ""}</span></label>
              <div className="dashboard-tools"><button id="dashboard-new-enquiry" type="button" aria-label="Add a fictional enquiry to the preview" onClick={() => handleDashboardAction("New enquiry")}>New enquiry</button><button id="dashboard-notifications" className="dashboard-notifications" type="button" aria-label="Read illustrative notifications" onClick={() => setDashboardMessage("No new notifications in this fictional preview.")}>◌</button><b>AY</b></div>
            </header>
            <div className="dashboard-body">
              <nav className="sidebar" aria-label="Illustrative dashboard navigation">
                {dashboardViews.slice(0, 6).map((view) => <button id={`dashboard-view-${view.toLowerCase().replaceAll(" ", "-")}`} className={dashboardView === view ? "active" : undefined} type="button" key={view} aria-current={dashboardView === view ? "page" : undefined} onClick={() => handleDashboardViewChange(view)}>{view} {view === "Enquiries" && <b>{3 + Number(hasPreviewEnquiry)}</b>}</button>)}
                <small>Workflows</small>
                {dashboardViews.slice(6).map((view) => <button id={`dashboard-view-${view.toLowerCase().replaceAll(" ", "-")}`} className={dashboardView === view ? "active" : undefined} type="button" key={view} aria-current={dashboardView === view ? "page" : undefined} onClick={() => handleDashboardViewChange(view)}>{view}</button>)}
              </nav>
              <div className="dashboard-main">
                <div className="dashboard-greeting"><div><p>{dashboardViewInfo.eyebrow}</p><h2>{dashboardViewInfo.title}</h2></div><a id="dashboard-customise-link" href="#contact">Tell Motus how you work</a></div>
                <div className="dashboard-actions" aria-label="Illustrative actions">{dashboardActions.map((action) => <button id={`dashboard-action-${action.toLowerCase().replaceAll(" ", "-")}`} className={action === "New enquiry" ? "accent" : undefined} type="button" key={action} onClick={() => handleDashboardAction(action)}>{action}</button>)}</div>
                <output className="dashboard-action-status" aria-live="polite">{dashboardMessage}</output>
                <div className="dashboard-cards">
                  <article className="opportunity-card"><div className="card-title"><span>{dashboardViewInfo.eyebrow}</span><b>✓</b></div><strong>{dashboardMetric}<span> {dashboardViewInfo.metricLabel}</span></strong><p>{dashboardViewInfo.metricDescription}</p><div className="mini-stats">{dashboardStats.map((stat) => <span key={stat.label}>{stat.label} <b className={stat.tone === "attention" ? "attention" : undefined}>{stat.value}</b></span>)}</div><svg viewBox="0 0 310 92" role="img" aria-label="Illustrative activity chart"><defs><linearGradient id="activity-fill" x1="0" x2="0" y1="0" y2="1"><stop stopColor="#5964f2" stopOpacity=".22" /><stop offset="1" stopColor="#5964f2" stopOpacity="0" /></linearGradient></defs><path d="M0 76 C23 69, 31 38, 58 57 S85 46, 109 54 S138 14, 163 34 S194 22, 219 37 S253 12, 279 25 S295 9, 310 15 V92 H0Z" fill="url(#activity-fill)" /><path d="M0 76 C23 69, 31 38, 58 57 S85 46, 109 54 S138 14, 163 34 S194 22, 219 37 S253 12, 279 25 S295 9, 310 15" fill="none" stroke="#5964f2" strokeWidth="2" /></svg></article>
                  <article className="work-card">
                    <header>
                      <strong>{dashboardViewInfo.workTitle}</strong>
                      <button id="dashboard-add-item" type="button" aria-label="Add an illustrative work item" onClick={addDashboardItem}>+</button>
                      <div className="dashboard-options">
                        <button
                          id="dashboard-more-options"
                          type="button"
                          aria-expanded={dashboardOptionsOpen}
                          aria-controls="dashboard-options-menu"
                          aria-label={dashboardOptionsOpen ? "Close preview options" : "Open preview options"}
                          onClick={(event) => {
                            setDashboardOptionsMotion(event.detail > 0);
                            setDashboardOptionsOpen((open) => !open);
                          }}
                        >•••</button>
                        <div
                          className="dashboard-options-menu"
                          id="dashboard-options-menu"
                          role="group"
                          aria-label="Preview options"
                          data-open={dashboardOptionsOpen}
                          data-motion={dashboardOptionsMotion ? "on" : "off"}
                          aria-hidden={!dashboardOptionsOpen}
                          inert={!dashboardOptionsOpen}
                        >
                          <button id="dashboard-reset-preview" type="button" onClick={resetDashboardPreview}>Reset preview</button>
                        </div>
                      </div>
                    </header>
                    <ul>{visibleDashboardWork.length ? visibleDashboardWork.map((item) => <li key={item.id}><span className={`dot ${item.dot}`} /><span>{item.title}</span><b>{item.status}</b></li>) : <li className="empty">No illustrative work matches that search.</li>}</ul>
                  </article>
                </div>
                <section className="recent-activity"><h3>Recent activity</h3><div className="activity-table" role="table" aria-label="Illustrative activity register"><div role="row" className="table-head"><span role="columnheader">Date</span><span role="columnheader">Description</span><span role="columnheader">Outcome</span><span role="columnheader">Status</span></div>{dashboardActivityRows.map((activity, index) => <div role="row" key={`${activity.description}-${index}`}><span>{activity.date}</span><span>{activity.description}</span><span>{activity.outcome}</span><b className={activity.status}>{activity.status === "pending" ? "Needs review" : activity.status === "moving" ? "Moving" : "Complete"}</b></div>)}</div></section>
              </div>
            </div>
          </div>
        </section>
      </section>

      <section className="site-section solutions-section" id="solutions" aria-labelledby="solutions-title">
        <div className="section-intro reveal"><span>01 / Start with the outcome</span><h2 id="solutions-title">What should work better?</h2><p>You do not need to choose the technology. Choose the outcome you recognise and Motus will shape the sensible route around how your business works.</p></div>
        <div className="solution-grid">
          {solutions.map(([service, title, text], index) => <article className="solution-item reveal" key={title}><small>{String(index + 1).padStart(2, "0")}</small><span>{service}</span><h3>{title}</h3><p>{text}</p><a id={`solution-${index + 1}-link`} href="#contact" onClick={() => setSelectedOutcome(title)}>Discuss this outcome <b aria-hidden="true">→</b></a></article>)}
        </div>
        <a id="custom-solution-link" className="text-route reveal" href="#contact" onClick={() => setSelectedOutcome("Something different")}>Need something different? Tell Motus how it works <b aria-hidden="true">→</b></a>
      </section>

      <section className="site-section automation-section" id="automation" aria-labelledby="automation-title">
        <div className="section-intro reveal"><span>02 / See the work, not the workflow</span><h2 id="automation-title">One place to see what moved, what is waiting and what needs you.</h2><p>The starting point could be a website, booking screen, staff form, client portal, internal tool or owner view. Motus shapes the useful solution around the job: people take action, repeatable work moves and the business sees the result.</p><p className="muted-note">The visible experience follows how your business works. The foundations stay practical and maintainable.</p></div>
        <div className="light-control-desk reveal" aria-label="Illustrative business control desk"><header><div><span>Illustrative business control desk</span><strong>Today’s work</strong></div><p>Different solutions. One clear view of the next action.</p></header><div className="desk-filters" role="group" aria-label="Filter illustrative work queue">{(["all", "moving", "attention", "complete"] as QueueFilter[]).map((filter) => <button id={`queue-filter-${filter}`} type="button" key={filter} aria-pressed={queueFilter === filter} onClick={() => setQueueFilter(filter)}>{filter === "all" ? "All work" : filter === "attention" ? "Needs you" : filter[0].toUpperCase() + filter.slice(1)} <b>{filter === "all" ? 5 : filter === "moving" || filter === "attention" ? 2 : 1}</b></button>)}</div><div className="desk-labels" aria-hidden="true"><span>Work received</span><span>Already handled</span><span>Next action</span><span>Status</span></div><div className="desk-rows" aria-live="polite">{visibleQueue.map(([status, type, title, handled, next, label]) => <article key={title} data-queue-status={status}><div><small>{type}</small><strong>{title}</strong></div><p>{handled}</p><p>{next}</p><em>{label}</em></article>)}</div></div>
        <div className="principles reveal"><span>Customer, staff and owner interfaces</span><span>Human review for unclear cases</span><span>Custom solutions scoped after review</span></div>
      </section>

      <section className="site-section calculator-section" id="calculator" aria-labelledby="calculator-title">
        <div className="section-intro reveal"><span>03 / Illustrative calculator</span><h2 id="calculator-title">What might repeated admin be costing?</h2><p>Adjust three simple inputs to create a starting estimate for discussion. This is not a guaranteed saving, audit or quotation.</p><aside><strong>Not every task can or should be automated.</strong> Motus reviews the process, exceptions, data and ownership first.</aside></div>
        <div className="light-calculator reveal"><label htmlFor="calculator-team-size"><span>Team size</span><strong>{teamSize} {teamSize === 1 ? "person" : "people"}</strong></label><input id="calculator-team-size" type="range" min="1" max="50" value={teamSize} onChange={(event) => setTeamSize(Number(event.target.value))} /><label htmlFor="calculator-admin-time"><span>Working time spent on repeated admin</span><strong>{adminTime}%</strong></label><input id="calculator-admin-time" type="range" min="5" max="60" step="5" value={adminTime} onChange={(event) => setAdminTime(Number(event.target.value))} /><label htmlFor="calculator-hourly-cost"><span>Indicative hourly employment cost</span><strong>GBP {hourlyCost}</strong></label><input id="calculator-hourly-cost" type="range" min="12" max="60" value={hourlyCost} onChange={(event) => setHourlyCost(Number(event.target.value))} /><dl><div><dt>Repeated-admin hours</dt><dd>{estimate.weeklyHours}<small>/week</small></dd></div><div><dt>Indicative annual cost</dt><dd>GBP {estimate.annualCost.toLocaleString("en-GB")}</dd></div></dl><a id="calculator-enquiry-link" href="#contact" onClick={() => setSelectedOutcome("Cut repeated admin")}>Tell us what keeps repeating <b aria-hidden="true">→</b></a></div>
      </section>

      <section className="site-section examples-section" id="examples" aria-labelledby="examples-title">
        <div className="section-intro reveal"><span>04 / Working showroom</span><h2 id="examples-title">Working examples, not fixed products.</h2><p>Each example is a fictional tailored solution. It appears here only after Motus has built, reviewed and approved it for public exploration.</p></div>
        <div className="showroom-demo-list">
          {showroomDemos.map((demo) => (
            <article className="ledger-card reveal" key={demo.slug}>
              <div><span>{demo.sector}</span><small>Working fictional example</small></div>
              <h3>{demo.title}</h3>
              <p>{demo.interfaceSummary}</p>
              <p className="ledger-boundary">{demo.boundary ?? "Illustrative data only. This is a tailored example, not a fixed product."}</p>
              <a id={demo.slug === "ledger-desk" ? "ledger-demo-link" : `showroom-demo-${demo.slug}-link`} href={demo.url ?? "/demos"}>{demo.ctaLabel ?? "Explore this example"} <b aria-hidden="true">→</b></a>
            </article>
          ))}
        </div>
        <Link id="view-showroom-link" className="text-route reveal" href="/demos">View working examples <b aria-hidden="true">→</b></Link>
      </section>

      <section className="site-section pricing-section" id="pricing" aria-labelledby="pricing-title"><div className="section-intro reveal"><span>05 / Website packages</span><h2 id="pricing-title">Clear website starting points.</h2><p>Motus recommends the suitable package after reviewing the requirement. Tailored systems are discovered, scoped and quoted separately.</p></div><div className="package-grid">{packages.map(([name, price, care, text, features], index) => <article className={`package${index === 1 ? " featured" : ""} reveal`} key={name}>{index === 1 && <em>Most useful for established businesses</em>}<span>{name}</span><strong>{price}</strong><small>{care} technical care</small><p>{text}</p><ul>{features.map((feature) => <li key={feature}>{feature}</li>)}</ul><a id={`package-${index + 1}-link`} href="#contact" onClick={() => setSelectedOutcome(name)}>Tell us what you need <b aria-hidden="true">→</b></a></article>)}</div><p className="vat-note reveal">Motus is not currently VAT registered. VAT is not added to the prices shown.</p></section>

      <section className="site-section process-section" aria-labelledby="process-title"><div className="section-intro reveal"><span>06 / How Motus works</span><h2 id="process-title">A controlled route from need to tailored solution.</h2></div><ol className="process-list">{process.map(([title, text], index) => <li className="reveal" key={title}><span>{String(index + 1).padStart(2, "0")}</span><div><strong>{title}</strong><p>{text}</p></div></li>)}</ol></section>

      <section className="site-section contact-section" id="contact" aria-labelledby="contact-title"><div className="section-intro reveal"><span>07 / A useful first step</span><h2 id="contact-title" tabIndex={-1}>Tell us what you need.</h2><p>Send a short description of the outcome you want and how work happens now. Motus normally replies by email within two business days with a website package, short fit check, paid discovery exercise or scoped quotation.</p><div className="contact-trust"><p><strong>Human decisions stay visible.</strong> Important or unclear cases stop for a person.</p><p><strong>Examples stay honest.</strong> Illustrative data is labelled and results are not guaranteed.</p></div></div><form className="light-form reveal" id="enquiry-form" onSubmit={handleSubmit}><div className="form-pair"><label htmlFor="enquiry-name">Your name<input id="enquiry-name" name="fullName" autoComplete="name" maxLength={100} required /></label><label htmlFor="enquiry-business">Business name<input id="enquiry-business" name="businessName" autoComplete="organization" maxLength={160} required /></label></div><label htmlFor="enquiry-email">Business email<input id="enquiry-email" name="email" type="email" autoComplete="email" maxLength={200} required /></label><label htmlFor="enquiry-outcome">What outcome do you need?<select id="enquiry-outcome" name="outcome" value={selectedOutcome} onChange={(event) => setSelectedOutcome(event.target.value)} required><option value="">Choose the closest outcome</option>{solutions.map(([, title]) => <option key={title}>{title}</option>)}{packages.map(([name]) => <option key={name}>{name}</option>)}<option>Something different</option></select></label><label htmlFor="enquiry-problem">What is happening now?<textarea id="enquiry-problem" name="headache" rows={4} maxLength={1200} required /></label><div className="form-pair"><label htmlFor="enquiry-investment">Estimated investment<select id="enquiry-investment" name="investment" required><option value="">Choose a range</option><option>Under GBP 500</option><option>GBP 500-999</option><option>GBP 1,000-2,499</option><option>GBP 2,500-4,999</option><option>GBP 5,000 or more</option><option>Not sure yet</option></select></label><label htmlFor="enquiry-existing">What already exists?<input id="enquiry-existing" name="existing" maxLength={300} placeholder="Website, booking system, CRM…" required /></label></div><label htmlFor="enquiry-url">Public website URL <small>(optional)</small><input id="enquiry-url" name="websiteUrl" type="url" maxLength={500} placeholder="https://example.co.uk" /></label><label className="honeypot" aria-hidden="true" htmlFor="enquiry-website">Leave this field empty<input id="enquiry-website" name="website" tabIndex={-1} autoComplete="off" /></label><p>Sending this form is an enquiry only. It does not create a contract or require Motus to accept the work. Please do not include passwords, confidential information or personal data about your customers. <Link id="enquiry-privacy-link" href="/privacy">Read the privacy notice.</Link></p><button id="enquiry-submit-button" type="submit" disabled={formStatus === "sending"}>{formStatus === "sending" ? "Sending…" : "Send enquiry"} <b aria-hidden="true">→</b></button><output className={formMessage ? "is-visible" : undefined} aria-live="polite">{formMessage}</output></form></section>

      <footer className="site-footer"><a id="footer-home-link" className="logo" href="#top"><span aria-hidden="true">✦</span> Motus</a><p>Tailored digital systems for UK businesses.</p><nav aria-label="Footer navigation"><a id="footer-solutions-link" href="#solutions">Solutions</a><Link id="footer-examples-link" href="/demos">Examples</Link><a id="footer-pricing-link" href="#pricing">Website pricing</a><Link id="footer-privacy-link" href="/privacy">Privacy</Link></nav><small>© 2026 Oluwaseun Ayomide Oyepitan trading as Motus.</small></footer>
    </main>
  );
}
