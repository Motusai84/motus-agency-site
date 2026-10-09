"use client";

import { FormEvent, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
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
        <div className="hero-copy">
          <p className="badge" data-enter="60">For UK small businesses</p>
          <h1 id="hero-title" data-enter="150">Websites and tools <em>made for your business.</em></h1>
          <p className="subheading" data-enter="240">Make it easier for customers to book, get in touch and work with you. Keep your customers, jobs and everyday tasks organised.</p>
          <div className="hero-actions" data-enter="330">
            <a id="hero-examples-link" className="primary-button" href="#examples">See examples</a>
            <a id="hero-enquiry-link" className="secondary-button" href="#contact">Tell us what you need</a>
            <button
              id="dashboard-tour"
              className="tour-button"
              type="button"
              aria-pressed={dashboardHighlighted}
              aria-label="Highlight the demo workspace"
              onClick={() => setDashboardHighlighted((current) => !current)}
            ><span aria-hidden="true">▶</span></button>
          </div>
          <p className="tour-status" aria-live="polite">{dashboardHighlighted ? "Demo workspace highlighted. Fictional records only; nothing is sent." : ""}</p>
        </div>

        <section className={`dashboard-preview${dashboardHighlighted ? " is-highlighted" : ""}`} id="dashboard-preview" aria-label="Illustrative Motus tailored system preview">
          <div className="dashboard-window">
            <header className="dashboard-topbar">
              <div className="dashboard-brand"><span>M</span><strong>Motus</strong><i aria-hidden="true">⌄</i></div>
              <label className="search"><span aria-hidden="true">⌕</span><input id="dashboard-search" aria-describedby="dashboard-search-feedback" aria-label="Search illustrative preview" value={dashboardSearch} onChange={(event) => setDashboardSearch(event.target.value)} placeholder="Search work, people and actions" /><kbd>⌘ K</kbd><span className="dashboard-search-feedback" id="dashboard-search-feedback" role="status">{dashboardSearchTerm ? `${visibleDashboardWork.length} illustrative ${visibleDashboardWork.length === 1 ? "match" : "matches"}` : ""}</span></label>
              <div className="dashboard-tools"><button id="dashboard-new-enquiry" type="button" aria-label="Add a fictional enquiry to the preview" onClick={() => handleDashboardAction("New enquiry")}>New enquiry</button><button id="dashboard-notifications" className="dashboard-notifications" type="button" aria-label="Read illustrative notifications" onClick={() => setDashboardMessage("No new notifications in this fictional preview.")}>◌</button><b>M</b></div>
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

      <section className="site-section examples-section" id="examples" aria-labelledby="examples-title">
        <div className="section-intro reveal">
          <span>Examples to try</span>
          <h2 id="examples-title">See what could work for you.</h2>
          <p>Bookings, customer messages or invoices. Try an example and see what it could make easier in your business.</p>
          <p className="muted-note">Demos use fictional information. Nothing is booked or sent.</p>
        </div>
        <div className="showroom-demo-list">
          {showroomDemos.map((demo) => (
            <article className="ledger-card reveal" key={demo.slug}>
              <div><span>{demo.name ?? demo.title}</span><small>Demo you can try</small></div>
              <h3>{demo.category ?? demo.title}</h3>
              <p>{demo.demoSummary ?? demo.interfaceSummary}</p>
              <a id={demo.slug === "ledger-desk" ? "ledger-demo-link" : `showroom-demo-${demo.slug}-link`} href={demo.url ?? "/demos"}>{demo.ctaLabel ?? "Try this example"} <b aria-hidden="true">→</b></a>
            </article>
          ))}
        </div>
        <a id="view-showroom-link" className="text-route reveal" href="/demos">See all examples <b aria-hidden="true">→</b></a>
      </section>

      <section className="site-section solutions-section" id="solutions" aria-labelledby="solutions-title">
        <div className="section-intro reveal"><span>What we can build</span><h2 id="solutions-title">What would you like to make easier?</h2><p>A better website, easier bookings or somewhere to keep track of your work. Start with what your business needs.</p></div>
        <div className="solution-grid">
          {solutions.map(([service, title, text], index) => <article className="solution-item reveal" key={title}><small>{String(index + 1).padStart(2, "0")}</small><span>{service}</span><h3>{title}</h3><p>{text}</p><a id={`solution-${index + 1}-link`} href="#contact" onClick={() => setSelectedOutcome(title)}>Ask about this <b aria-hidden="true">→</b></a></article>)}
        </div>
        <a id="custom-solution-link" className="text-route reveal" href="#contact" onClick={() => setSelectedOutcome("Something different")}>Need something different? Tell us about it <b aria-hidden="true">→</b></a>
      </section>

      <section className="site-section automation-section" id="automation" aria-labelledby="automation-title">
        <div className="section-intro reveal"><span>How it works</span><h2 id="automation-title">Keep your work together.</h2><p>A customer books, sends a message or asks for a quote. The useful details go where your team needs them, so you can see what has happened and what needs doing.</p><p className="muted-note">Your workspace is a place to keep track of customers, jobs and bookings. Try the demo below to see how that could look.</p></div>
        <div className="light-control-desk reveal" aria-label="Illustrative business control desk"><header><div><span>Demo workspace · Fictional records</span><strong>Today’s work</strong></div><p>See what is moving and what needs you.</p></header><div className="desk-filters" role="group" aria-label="Filter illustrative work queue">{(["all", "moving", "attention", "complete"] as QueueFilter[]).map((filter) => <button id={`queue-filter-${filter}`} type="button" key={filter} aria-pressed={queueFilter === filter} onClick={() => setQueueFilter(filter)}>{filter === "all" ? "All work" : filter === "attention" ? "Needs you" : filter[0].toUpperCase() + filter.slice(1)} <b>{filter === "all" ? 5 : filter === "moving" || filter === "attention" ? 2 : 1}</b></button>)}</div><div className="desk-labels" aria-hidden="true"><span>Work received</span><span>Already handled</span><span>Next action</span><span>Status</span></div><div className="desk-rows" aria-live="polite">{visibleQueue.map(([status, type, title, handled, next, label]) => <article key={title} data-queue-status={status}><div><small>{type}</small><strong>{title}</strong></div><p>{handled}</p><p>{next}</p><em>{label}</em></article>)}</div></div>
        <div className="principles reveal"><span>Useful tools for customers and your team</span><span>You check anything unclear</span><span>Work and price agreed before building</span></div>
      </section>

      <section className="site-section calculator-section" id="calculator" aria-labelledby="calculator-title">
        <div className="section-intro reveal"><span>A quick estimate</span><h2 id="calculator-title">What might repeated admin be costing?</h2><p>Move the sliders to estimate the time and cost of repeated admin. This is a starting point for a conversation, not a promised saving or a price for the work.</p><aside><strong>Some tasks still need a person.</strong> We talk through what makes sense to change before building anything.</aside></div>
        <div className="light-calculator reveal"><label htmlFor="calculator-team-size"><span>Team size</span><strong>{teamSize} {teamSize === 1 ? "person" : "people"}</strong></label><input id="calculator-team-size" type="range" min="1" max="50" value={teamSize} onChange={(event) => setTeamSize(Number(event.target.value))} /><label htmlFor="calculator-admin-time"><span>Working time spent on repeated admin</span><strong>{adminTime}%</strong></label><input id="calculator-admin-time" type="range" min="5" max="60" step="5" value={adminTime} onChange={(event) => setAdminTime(Number(event.target.value))} /><label htmlFor="calculator-hourly-cost"><span>Estimated hourly cost</span><strong>£{hourlyCost}</strong></label><input id="calculator-hourly-cost" type="range" min="12" max="60" value={hourlyCost} onChange={(event) => setHourlyCost(Number(event.target.value))} /><dl><div><dt>Repeated-admin hours</dt><dd>{estimate.weeklyHours}<small>/week</small></dd></div><div><dt>Estimated yearly cost</dt><dd>£{estimate.annualCost.toLocaleString("en-GB")}</dd></div></dl><a id="calculator-enquiry-link" href="#contact" onClick={() => setSelectedOutcome("Cut repeated admin")}>Tell us what keeps repeating <b aria-hidden="true">→</b></a></div>
      </section>

      <section className="site-section pricing-section" id="pricing" aria-labelledby="pricing-title"><div className="section-intro reveal"><span>Website prices</span><h2 id="pricing-title">A clear place to start.</h2><p>We talk through what you need and choose a suitable website package. Workspaces and other business tools are priced separately once we agree the work.</p></div><div className="package-grid">{packages.map(([name, price, care, text, features], index) => <article className={`package${index === 1 ? " featured" : ""} reveal`} key={name}>{index === 1 && <em>Most useful for established businesses</em>}<span>{name}</span><strong>{price}</strong><small>{care} website care</small><p>{text}</p><ul>{features.map((feature) => <li key={feature}>{feature}</li>)}</ul><a id={`package-${index + 1}-link`} href="#contact" onClick={() => setSelectedOutcome(name)}>Tell us what you need <b aria-hidden="true">→</b></a></article>)}</div><p className="vat-note reveal">Motus is not currently VAT registered. VAT is not added to the prices shown.</p></section>

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
