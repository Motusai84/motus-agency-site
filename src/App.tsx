import {
  ArrowDown,
  ArrowRight,
  BellRing,
  CalendarCheck2,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock3,
  FileCheck2,
  Inbox,
  LockKeyhole,
  Mail,
  Menu,
  MessageSquareText,
  PhoneMissed,
  Route,
  ShieldCheck,
  Sparkles,
  User,
  Workflow,
  X,
  Zap,
  type LucideIcon,
} from "lucide-react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type Variants,
} from "framer-motion";
import { useRef, useState, type FormEvent } from "react";

const NAV_ITEMS = [
  { label: "What we fix", id: "problems" },
  { label: "See an example", id: "example" },
  { label: "Results", id: "results" },
];

const WORKFLOWS = {
  "Missed calls": {
    intro: "A potential customer calls while your team is busy.",
    before: ["The call is missed", "Someone writes a note", "The reply is delayed", "The lead may go elsewhere"],
    after: [
      { title: "Call detected", detail: "The missed call is recognised immediately.", icon: PhoneMissed },
      { title: "Helpful reply sent", detail: "The customer receives a text within moments.", icon: MessageSquareText },
      { title: "Lead recorded", detail: "Their details are added to the right place.", icon: FileCheck2 },
      { title: "Team notified", detail: "The right person knows what needs attention.", icon: BellRing },
    ],
    result: "The opportunity stays warm without somebody watching the phone.",
  },
  Enquiries: {
    intro: "A customer submits a question through your website.",
    before: ["Email enters a busy inbox", "Details are copied manually", "A reply is drafted", "Follow-up is easily forgotten"],
    after: [
      { title: "Enquiry received", detail: "The request enters one organised process.", icon: Inbox },
      { title: "Details checked", detail: "The important information is captured.", icon: FileCheck2 },
      { title: "Response prepared", detail: "A clear acknowledgement goes out quickly.", icon: Mail },
      { title: "Next step created", detail: "A task is assigned instead of being forgotten.", icon: Route },
    ],
    result: "Every enquiry receives a consistent first response and a clear next step.",
  },
  Bookings: {
    intro: "A customer wants to arrange an appointment or site visit.",
    before: ["Dates go back and forth", "Availability is checked", "Details are retyped", "Reminders are sent manually"],
    after: [
      { title: "Request received", detail: "The customer starts from one clear booking route.", icon: Inbox },
      { title: "Time confirmed", detail: "Available times are presented automatically.", icon: CalendarCheck2 },
      { title: "Records updated", detail: "The booking details stay organised.", icon: FileCheck2 },
      { title: "Reminder scheduled", detail: "The customer is reminded before the appointment.", icon: BellRing },
    ],
    result: "Bookings move forward with fewer messages and fewer no-shows.",
  },
} as const;

const OUTCOMES = [
  {
    icon: Clock3,
    title: "More time for valuable work",
    text: "Routine admin moves in the background while your team focuses on customers and delivery.",
  },
  {
    icon: CheckCircle2,
    title: "Fewer things fall through gaps",
    text: "Important steps are recorded, checked and handed to the right person.",
  },
  {
    icon: Zap,
    title: "Faster customer responses",
    text: "Enquiries receive a useful first response without waiting for someone to become available.",
  },
];

const PROCESS = [
  {
    number: "01",
    title: "Show us the bottleneck",
    text: "We look at one repetitive process that is costing your team time.",
  },
  {
    number: "02",
    title: "See a practical plan",
    text: "We explain what can be improved, what should stay human and what it would involve.",
  },
  {
    number: "03",
    title: "Build without disruption",
    text: "If it makes sense, we connect the workflow to the tools your business already uses.",
  },
];

const reveal: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  },
};

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

export default function App() {
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const navScale = useTransform(scrollYProgress, [0, 0.08], [1, 0.95]);
  const navTop = useTransform(scrollYProgress, [0, 0.08], [18, 10]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [activeWorkflow, setActiveWorkflow] = useState<keyof typeof WORKFLOWS>("Missed calls");
  const [workflowRunning, setWorkflowRunning] = useState(false);
  const [formStatus, setFormStatus] = useState<"idle" | "sending" | "success">("idle");

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setMenuOpen(false);
  };

  const chooseWorkflow = (workflow: keyof typeof WORKFLOWS) => {
    setActiveWorkflow(workflow);
    setWorkflowRunning(false);
  };

  const openReview = () => {
    setMenuOpen(false);
    setReviewOpen(true);
  };

  const closeReview = () => {
    if (formStatus !== "sending") setReviewOpen(false);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (formStatus !== "idle") return;
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    setFormStatus("sending");

    fetch("https://seunayomide.app.n8n.cloud/webhook/lead-capture", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).catch(() => undefined);

    window.setTimeout(() => {
      setFormStatus("success");
      form.reset();
    }, 850);
  };

  return (
    <div className="motus-site min-h-screen overflow-x-hidden bg-[#020305] text-white">
      <BackgroundField />

      <motion.header
        style={{ top: reduceMotion ? 14 : navTop }}
        className="fixed left-1/2 z-50 w-[calc(100%-24px)] max-w-5xl -translate-x-1/2"
      >
        <motion.div
          style={{ scale: reduceMotion ? 1 : navScale }}
          className="nav-shell flex origin-top items-center justify-between rounded-full border border-white/10 bg-black/75 px-2.5 py-2 shadow-2xl backdrop-blur-xl sm:px-4"
        >
          <button
            id="nav-home-btn"
            type="button"
            onClick={() => scrollTo("top")}
            className="flex items-center gap-2 rounded-full px-2 py-1.5"
            aria-label="Back to top"
          >
            <span className="grid h-9 w-9 place-items-center rounded-full border border-blue-400/30 bg-blue-500/10">
              <Sparkles className="h-4 w-4 text-blue-400" />
            </span>
            <span className="hidden text-sm font-bold tracking-[0.18em] sm:block">MOTUS</span>
          </button>

          <nav className="hidden items-center gap-1 md:flex" aria-label="Main navigation">
            {NAV_ITEMS.map((item) => (
              <button
                id={`nav-${item.id}`}
                key={item.id}
                type="button"
                onClick={() => scrollTo(item.id)}
                className="rounded-full px-4 py-2 text-sm font-medium text-slate-400 transition hover:bg-white/5 hover:text-white"
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              id="nav-review-btn"
              type="button"
              onClick={openReview}
              className="rounded-full bg-blue-600 px-4 py-2.5 text-xs font-semibold shadow-lg shadow-blue-600/20 transition hover:bg-blue-500 sm:px-5 sm:text-sm"
            >
              Free review
            </button>
            <button
              id="mobile-menu-btn"
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/5 md:hidden"
              aria-label="Toggle navigation"
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </motion.div>

        <AnimatePresence>
          {menuOpen && (
            <motion.nav
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              className="mt-2 rounded-[28px] border border-white/10 bg-black/95 p-3 shadow-2xl backdrop-blur-xl md:hidden"
            >
              {NAV_ITEMS.map((item) => (
                <button
                  id={`mobile-nav-${item.id}`}
                  key={item.id}
                  type="button"
                  onClick={() => scrollTo(item.id)}
                  className="flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left text-sm font-medium text-slate-300 hover:bg-white/5"
                >
                  {item.label}
                  <ChevronRight className="h-4 w-4 text-slate-600" />
                </button>
              ))}
            </motion.nav>
          )}
        </AnimatePresence>
      </motion.header>

      <main>
        <section id="top" className="relative flex min-h-screen items-center overflow-hidden px-5 pb-16 pt-32 md:px-8 md:pt-36">
          <div className="mx-auto grid w-full max-w-7xl items-center gap-12 lg:grid-cols-[1fr_0.9fr] lg:gap-16">
            <motion.div initial="hidden" animate="visible" variants={stagger} className="relative z-10">
              <motion.div variants={reveal} className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-500/25 bg-blue-500/10 px-3 py-1.5 text-xs font-semibold text-blue-300">
                <span className="relative h-2 w-2 rounded-full bg-blue-400">
                  <span className="motion-status-ping absolute inset-0 rounded-full bg-blue-400" />
                </span>
                Business automation, explained clearly
              </motion.div>

              <motion.h1 variants={reveal} className="max-w-3xl text-[3.4rem] font-semibold leading-[0.96] tracking-[-0.055em] sm:text-6xl md:text-7xl">
                Less repetitive admin.
                <span className="mt-2 block text-slate-600">More room to grow.</span>
              </motion.h1>

              <motion.p variants={reveal} className="mt-7 max-w-2xl text-base font-medium leading-8 text-slate-400 sm:text-lg">
                Motus connects the tools your business already uses, so enquiries move faster, records stay organised and your team spends less time chasing routine tasks.
              </motion.p>

              <motion.div variants={reveal} className="mt-9 flex flex-col gap-3 sm:flex-row">
                <button
                  id="hero-review-btn"
                  type="button"
                  onClick={openReview}
                  className="group flex min-h-14 items-center justify-center gap-3 rounded-full bg-blue-600 px-7 font-semibold shadow-[0_14px_55px_rgba(37,99,235,.25)] transition hover:bg-blue-500"
                >
                  Book a free workflow review
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
                <button
                  id="hero-example-btn"
                  type="button"
                  onClick={() => scrollTo("example")}
                  className="flex min-h-14 items-center justify-center gap-3 rounded-full border border-white/10 bg-white/[0.025] px-7 font-semibold text-slate-300 transition hover:bg-white/5 hover:text-white"
                >
                  See a simple example
                  <ArrowDown className="h-4 w-4" />
                </button>
              </motion.div>

              <motion.div variants={reveal} className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-xs font-medium text-slate-500">
                <span className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-emerald-400" />No obligation</span>
                <span className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-emerald-400" />Plain-English advice</span>
                <span className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-emerald-400" />Built for UK businesses</span>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="relative mx-auto w-full max-w-xl"
            >
              <ActivityPreview />
            </motion.div>
          </div>
        </section>

        <MotionRibbon />

        <ChaosToClarityScene />

        <section id="example" className="relative border-t border-white/5 px-5 py-24 md:px-8 md:py-28">
          <div className="mx-auto max-w-7xl">
            <SectionIntro
              eyebrow="One practical example"
              title="See how one routine task can move."
              text="Choose a common process, then run the example. This is the level of automation we mean: useful, understandable and built around real work."
            />

            <div className="mt-12 flex flex-wrap justify-center gap-2">
              {(Object.keys(WORKFLOWS) as Array<keyof typeof WORKFLOWS>).map((workflow) => (
                <button
                  id={`workflow-${workflow.toLowerCase().replace(" ", "-")}`}
                  key={workflow}
                  type="button"
                  onClick={() => chooseWorkflow(workflow)}
                  className={`rounded-full border px-5 py-2.5 text-sm font-semibold transition ${
                    activeWorkflow === workflow
                      ? "border-blue-500/40 bg-blue-500/15 text-blue-300"
                      : "border-white/10 bg-white/[0.02] text-slate-500 hover:text-white"
                  }`}
                >
                  {workflow}
                </button>
              ))}
            </div>

            <motion.div
              layout
              className="mt-8 overflow-hidden rounded-[32px] border border-white/10 bg-[#07090d] shadow-2xl shadow-black/30"
            >
              <div className="grid lg:grid-cols-[0.8fr_1.2fr]">
                <div className="border-b border-white/10 p-6 sm:p-9 lg:border-b-0 lg:border-r">
                  <span className="text-xs font-bold uppercase tracking-[0.18em] text-slate-600">Without a connected process</span>
                  <p className="mt-4 text-lg font-medium leading-relaxed text-slate-300">{WORKFLOWS[activeWorkflow].intro}</p>
                  <div className="mt-7 space-y-3">
                    {WORKFLOWS[activeWorkflow].before.map((item, index) => (
                      <motion.div
                        key={item}
                        animate={{ opacity: workflowRunning ? 0.25 : 1, x: workflowRunning ? -5 : 0 }}
                        transition={{ duration: 0.45, delay: index * 0.05 }}
                        className="flex items-center gap-3 rounded-2xl border border-white/[0.07] bg-black/30 p-4"
                      >
                        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-white/5 text-xs text-slate-600">{index + 1}</span>
                        <span className="text-sm font-medium text-slate-400">{item}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div className="relative overflow-hidden p-6 sm:p-9">
                  <div className="engine-grid absolute inset-0 opacity-20" />
                  <div className="relative z-10">
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <span className="text-xs font-bold uppercase tracking-[0.18em] text-blue-400">With Motus</span>
                        <h3 className="mt-2 text-2xl font-semibold">One clear, reliable flow</h3>
                      </div>
                      <button
                        id="run-workflow-btn"
                        type="button"
                        onClick={() => setWorkflowRunning(true)}
                        className="group flex min-h-12 items-center justify-center gap-2 rounded-full bg-white px-5 text-sm font-bold text-black transition hover:bg-blue-100"
                      >
                        {workflowRunning ? "Example running" : "Run the example"}
                        {workflowRunning ? <CheckCircle2 className="h-4 w-4 text-emerald-600" /> : <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />}
                      </button>
                    </div>

                    <div className="relative mt-9 grid gap-3 sm:grid-cols-2">
                      {WORKFLOWS[activeWorkflow].after.map((step, index) => (
                        <WorkflowStep
                          key={step.title}
                          step={step}
                          index={index}
                          active={workflowRunning}
                        />
                      ))}
                    </div>

                    <motion.div
                      animate={{
                        opacity: workflowRunning ? 1 : 0.45,
                        borderColor: workflowRunning ? "rgba(52,211,153,.3)" : "rgba(255,255,255,.08)",
                      }}
                      className="mt-5 flex items-start gap-3 rounded-2xl border bg-emerald-500/[0.05] p-4"
                    >
                      <CheckCircle2 className={`mt-0.5 h-5 w-5 shrink-0 ${workflowRunning ? "text-emerald-400" : "text-slate-600"}`} />
                      <p className="text-sm font-medium leading-relaxed text-slate-300">
                        {workflowRunning ? WORKFLOWS[activeWorkflow].result : "Press “Run the example” to see the connected process."}
                      </p>
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <section id="results" className="relative border-t border-white/5 px-5 py-24 md:px-8 md:py-28">
          <div className="mx-auto max-w-7xl">
            <SectionIntro
              eyebrow="The point of automation"
              title="Technology should make the working day feel lighter."
              text="The outcome is not a complicated system. It is a business that responds consistently and relies less on repetitive manual effort."
            />

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={stagger}
              className="mt-14 grid gap-4 md:grid-cols-3"
            >
              {OUTCOMES.map((outcome) => (
                <OutcomeCard key={outcome.title} {...outcome} />
              ))}
            </motion.div>

            <div className="mt-16 grid gap-8 rounded-[32px] border border-white/10 bg-white/[0.025] p-6 sm:p-9 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
              <div>
                <span className="text-xs font-bold uppercase tracking-[0.18em] text-blue-400">A sensible first step</span>
                <h3 className="mt-4 text-3xl font-semibold tracking-tight">Start with one frustrating process.</h3>
                <p className="mt-4 max-w-lg leading-relaxed text-slate-400">
                  You do not need to automate the whole company. The best starting point is usually one repeated task with a clear beginning, end and owner.
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                {PROCESS.map((step) => (
                  <div key={step.number} className="rounded-3xl border border-white/[0.08] bg-black/30 p-5">
                    <span className="font-mono text-xs text-blue-400">{step.number}</span>
                    <h4 className="mt-8 font-semibold">{step.title}</h4>
                    <p className="mt-2 text-sm leading-relaxed text-slate-500">{step.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="relative border-t border-white/5 px-5 py-24 md:px-8 md:py-28">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
              <div>
                <span className="text-xs font-bold uppercase tracking-[0.18em] text-blue-400">Built responsibly</span>
                <h2 className="mt-4 text-4xl font-semibold tracking-[-0.035em] md:text-5xl">Clear enough to trust.</h2>
                <p className="mt-5 max-w-xl leading-relaxed text-slate-400">
                  We explain what the workflow is doing, where information goes and when a person needs to step in.
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <TrustItem icon={ShieldCheck} title="Human oversight" text="Important decisions stay with the right person." />
                <TrustItem icon={LockKeyhole} title="Data considered" text="Workflows are planned with UK privacy obligations in mind." />
                <TrustItem icon={Route} title="Clear handover" text="Your team can understand how the process works." />
              </div>
            </div>
          </div>
        </section>

        <section id="review" className="relative border-t border-white/5 px-5 py-24 md:px-8 md:py-32">
          <div className="mx-auto max-w-5xl overflow-hidden rounded-[36px] border border-blue-500/20 bg-blue-600 px-6 py-12 text-center shadow-[0_30px_100px_rgba(37,99,235,.2)] sm:px-10 md:py-16">
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-blue-100/70">Free workflow review</span>
            <h2 className="mx-auto mt-4 max-w-3xl text-4xl font-semibold tracking-[-0.04em] md:text-5xl">
              Show us the task your team is tired of repeating.
            </h2>
            <p className="mx-auto mt-5 max-w-2xl leading-relaxed text-blue-100/80">
              We will identify what could be improved and explain the practical next step—without jargon or obligation.
            </p>
            <button
              id="final-review-btn"
              type="button"
              onClick={openReview}
              className="group mx-auto mt-8 flex min-h-14 items-center justify-center gap-3 rounded-full bg-white px-8 font-bold text-blue-700 shadow-xl transition hover:bg-blue-50"
            >
              Book my free workflow review
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/5 px-5 py-10 text-sm text-slate-600 md:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <span className="font-bold tracking-[0.16em] text-slate-400">MOTUS</span>
          <span>Business automation for UK small businesses.</span>
          <span>© 2026 Motus</span>
        </div>
      </footer>

      <FloatingReviewControl onClick={openReview} />

      <AnimatePresence>
        {reviewOpen && (
          <ReviewPanel
            formStatus={formStatus}
            onClose={closeReview}
            onSubmit={handleSubmit}
            onReset={() => setFormStatus("idle")}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function ActivityPreview() {
  const events = [
    { time: "09:41", title: "New customer enquiry", detail: "Website form received", icon: Inbox, tone: "blue" },
    { time: "09:41", title: "Helpful reply sent", detail: "Customer knows what happens next", icon: Mail, tone: "emerald" },
    { time: "09:42", title: "Follow-up assigned", detail: "Team member notified", icon: BellRing, tone: "violet" },
  ] as const;

  return (
    <div className="relative">
      <div className="absolute inset-8 rounded-full bg-blue-600/20 blur-[100px]" />
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 42, repeat: Infinity, ease: "linear" }}
        className="absolute -inset-8 rounded-full border border-dashed border-blue-500/10"
      />
      <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[#080a0f]/95 p-4 shadow-[0_40px_100px_rgba(0,0,0,.55)] backdrop-blur-xl sm:p-6">
        <div className="engine-grid absolute inset-0 opacity-20" />
        <motion.div
          animate={{ y: ["-10%", "620%"] }}
          transition={{ duration: 4.8, repeat: Infinity, ease: "linear", repeatDelay: 1.2 }}
          className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-400/70 to-transparent shadow-[0_0_24px_rgba(96,165,250,.7)]"
        />
        <div className="relative z-10">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-5">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.16em] text-slate-600">Today</span>
              <h2 className="mt-1 text-lg font-semibold">Routine work, moving</h2>
            </div>
            <span className="flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-400">
              <span className="relative h-2 w-2 rounded-full bg-emerald-400">
                <span className="motion-status-ping absolute inset-0 rounded-full bg-emerald-400" />
              </span>
              Connected
            </span>
          </div>

          <div className="mt-5 space-y-3">
            {events.map((event, index) => (
              <motion.div
                key={event.title}
                initial={{ opacity: 0, x: 18 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.65, delay: 0.65 + index * 0.24, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-center gap-3 rounded-2xl border border-white/[0.08] bg-black/30 p-3.5 sm:p-4"
              >
                <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${
                  event.tone === "blue"
                    ? "bg-blue-500/10 text-blue-400"
                    : event.tone === "emerald"
                      ? "bg-emerald-500/10 text-emerald-400"
                      : "bg-violet-500/10 text-violet-400"
                }`}>
                  <event.icon className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <strong className="block truncate text-sm font-semibold text-slate-200">{event.title}</strong>
                  <span className="mt-1 block truncate text-xs text-slate-600">{event.detail}</span>
                </div>
                <span className="font-mono text-[10px] text-slate-700">{event.time}</span>
              </motion.div>
            ))}
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-4">
              <span className="text-xs text-slate-600">Handled today</span>
              <strong className="mt-2 block text-3xl font-semibold">17</strong>
            </div>
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-4">
              <span className="text-xs text-slate-600">Waiting unnoticed</span>
              <strong className="mt-2 block text-3xl font-semibold text-emerald-400">0</strong>
            </div>
          </div>
        </div>
      </div>

      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -bottom-6 -left-2 hidden items-center gap-3 rounded-2xl border border-white/10 bg-black/90 p-3 pr-5 shadow-2xl sm:flex"
      >
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-500/10 text-emerald-400">
          <CheckCircle2 className="h-4 w-4" />
        </span>
        <div>
          <strong className="block text-xs">Next step created</strong>
          <span className="mt-0.5 block text-[10px] text-slate-600">No chasing required</span>
        </div>
      </motion.div>

      <motion.div
        animate={{ y: [0, 7, 0], rotate: [-2, 1, -2] }}
        transition={{ duration: 5.4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -right-3 top-24 hidden w-40 rounded-2xl border border-white/10 bg-black/90 p-3 shadow-2xl md:block"
      >
        <span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-blue-400">
          <Zap className="h-3 w-3" />
          Response time
        </span>
        <strong className="mt-3 block text-2xl font-semibold">12 sec</strong>
        <span className="mt-1 block text-[10px] text-slate-600">Previously: 3 hours</span>
      </motion.div>
    </div>
  );
}

function MotionRibbon() {
  const items = ["Missed calls", "New enquiries", "Bookings", "Follow-ups", "Customer records", "Team alerts"];
  return (
    <div className="relative overflow-hidden border-y border-white/[0.06] bg-blue-500/[0.025] py-4" aria-hidden="true">
      <motion.div
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
        className="flex w-max items-center"
      >
        {[...items, ...items].map((item, index) => (
          <div key={`${item}-${index}`} className="flex items-center">
            <span className="mx-6 whitespace-nowrap text-xs font-bold uppercase tracking-[0.22em] text-slate-600 sm:mx-10">{item}</span>
            <Sparkles className="h-3.5 w-3.5 text-blue-500/50" />
          </div>
        ))}
      </motion.div>
    </div>
  );
}

function ChaosToClarityScene() {
  const sceneRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sceneRef,
    offset: ["start start", "end end"],
  });
  const introOpacity = useTransform(scrollYProgress, [0, 0.15, 0.32], [1, 1, 0.25]);
  const sourceOpacity = useTransform(scrollYProgress, [0.05, 0.25, 0.55], [0, 1, 0.15]);
  const coreScale = useTransform(scrollYProgress, [0.2, 0.48, 0.68], [0.75, 1, 1.08]);
  const coreGlow = useTransform(scrollYProgress, [0.25, 0.58], [0.15, 0.65]);
  const resultOpacity = useTransform(scrollYProgress, [0.48, 0.7, 0.92], [0, 1, 1]);
  const progressWidth = useTransform(scrollYProgress, [0.08, 0.88], ["0%", "100%"]);
  const clutter = [
    { icon: PhoneMissed, label: "Missed call", left: "5%", top: "29%", rotate: -8 },
    { icon: Mail, label: "Unread enquiry", left: "13%", top: "59%", rotate: 5 },
    { icon: FileCheck2, label: "Update the sheet", left: "3%", top: "76%", rotate: -3 },
  ];
  const results = [
    { icon: MessageSquareText, label: "Reply sent", right: "5%", top: "29%" },
    { icon: CalendarCheck2, label: "Next step booked", right: "12%", top: "57%" },
    { icon: BellRing, label: "Team notified", right: "4%", top: "75%" },
  ];

  return (
    <section ref={sceneRef} id="problems" className="relative h-[220vh] border-b border-white/5">
      <div className="sticky top-0 flex h-screen items-center overflow-hidden px-5 py-20 md:px-8">
        <div className="engine-grid absolute inset-0 opacity-[0.12] [mask-image:radial-gradient(circle_at_center,black,transparent_75%)]" />
        <motion.div
          style={{ opacity: coreGlow }}
          className="absolute left-1/2 top-1/2 h-[50vw] max-h-[700px] w-[50vw] max-w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-600/20 blur-[130px]"
        />

        <div className="relative mx-auto h-[78vh] w-full max-w-7xl">
          <motion.div style={{ opacity: introOpacity }} className="absolute left-0 top-0 max-w-xl">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-blue-400">What Motus changes</span>
            <h2 className="mt-4 text-4xl font-semibold tracking-[-0.045em] md:text-6xl">
              From scattered admin
              <span className="block text-slate-600">to one clear flow.</span>
            </h2>
            <p className="mt-5 max-w-lg leading-relaxed text-slate-400">
              Scroll to see routine work move from separate messages and reminders into a process your team can follow.
            </p>
          </motion.div>

          <motion.div style={{ opacity: sourceOpacity }}>
            {clutter.map((item, index) => (
              <motion.div
                key={item.label}
                animate={{ y: [0, index % 2 ? 7 : -7, 0], rotate: [item.rotate, item.rotate + 2, item.rotate] }}
                transition={{ duration: 5 + index, repeat: Infinity, ease: "easeInOut" }}
                style={{ left: item.left, top: item.top }}
                className="absolute flex items-center gap-3 rounded-2xl border border-rose-400/15 bg-[#0b090c]/90 p-3 pr-5 shadow-2xl"
              >
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-rose-500/10 text-rose-300">
                  <item.icon className="h-4 w-4" />
                </span>
                <div>
                  <strong className="block text-xs">{item.label}</strong>
                  <span className="mt-1 block text-[10px] text-slate-700">Waiting for somebody</span>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            style={{ scale: coreScale }}
            className="absolute left-1/2 top-[58%] z-20 -translate-x-1/2 -translate-y-1/2"
          >
            <motion.div
              animate={{ boxShadow: ["0 0 20px rgba(59,130,246,.15)", "0 0 70px rgba(59,130,246,.4)", "0 0 20px rgba(59,130,246,.15)"] }}
              transition={{ duration: 3.5, repeat: Infinity }}
              className="relative grid h-32 w-32 place-items-center rounded-full border border-blue-400/35 bg-black/90 sm:h-44 sm:w-44"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
                className="absolute -inset-4 rounded-full border border-dashed border-blue-400/20"
              />
              <div className="text-center">
                <Workflow className="mx-auto h-7 w-7 text-blue-400 sm:h-9 sm:w-9" />
                <strong className="mt-2 block text-xs tracking-[0.2em] sm:text-sm">MOTUS</strong>
                <span className="mt-1 hidden text-[9px] uppercase tracking-widest text-slate-600 sm:block">Connected process</span>
              </div>
            </motion.div>
          </motion.div>

          <motion.div style={{ opacity: resultOpacity }}>
            {results.map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ x: 16 }}
                whileInView={{ x: 0 }}
                style={{ right: item.right, top: item.top }}
                className="absolute flex items-center gap-3 rounded-2xl border border-emerald-400/20 bg-[#07100d]/90 p-3 pr-5 shadow-2xl"
              >
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-500/10 text-emerald-400">
                  <item.icon className="h-4 w-4" />
                </span>
                <div>
                  <strong className="block text-xs">{item.label}</strong>
                  <span className="mt-1 block text-[10px] text-slate-600">Completed and recorded</span>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <div className="absolute bottom-0 left-0 right-0">
            <div className="mb-3 flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.18em] text-slate-700">
              <span>Scattered</span>
              <span>Connected</span>
            </div>
            <div className="h-px overflow-hidden bg-white/10">
              <motion.div style={{ width: progressWidth }} className="h-full bg-gradient-to-r from-blue-600 to-emerald-400 shadow-[0_0_14px_#60a5fa]" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SectionIntro({ eyebrow, title, text }: { eyebrow: string; title: string; text: string }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={stagger}
      className="mx-auto max-w-3xl text-center"
    >
      <motion.span variants={reveal} className="text-xs font-bold uppercase tracking-[0.2em] text-blue-400">{eyebrow}</motion.span>
      <motion.h2 variants={reveal} className="mt-4 text-4xl font-semibold tracking-[-0.04em] md:text-5xl">{title}</motion.h2>
      <motion.p variants={reveal} className="mx-auto mt-5 max-w-2xl leading-relaxed text-slate-400">{text}</motion.p>
    </motion.div>
  );
}

function WorkflowStep({
  step,
  index,
  active,
}: {
  step: { readonly title: string; readonly detail: string; readonly icon: LucideIcon };
  index: number;
  active: boolean;
}) {
  const Icon = step.icon;
  return (
    <motion.div
      animate={{
        opacity: active ? 1 : 0.35,
        y: active ? 0 : 8,
        borderColor: active ? "rgba(96,165,250,.22)" : "rgba(255,255,255,.07)",
      }}
      transition={{ duration: 0.5, delay: active ? index * 0.18 : 0 }}
      className="relative rounded-2xl border bg-black/35 p-4"
    >
      <div className="flex items-start gap-3">
        <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${active ? "bg-blue-500/10 text-blue-400" : "bg-white/5 text-slate-600"}`}>
          <Icon className="h-4 w-4" />
        </span>
        <div>
          <strong className="block text-sm font-semibold text-slate-200">{step.title}</strong>
          <span className="mt-1 block text-xs leading-relaxed text-slate-600">{step.detail}</span>
        </div>
      </div>
      {active && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: index * 0.18 + 0.25 }}
          className="absolute right-3 top-3 h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,.7)]"
        />
      )}
    </motion.div>
  );
}

function OutcomeCard({ icon: Icon, title, text }: { icon: LucideIcon; title: string; text: string }) {
  return (
    <motion.div variants={reveal} className="rounded-[28px] border border-white/[0.08] bg-white/[0.025] p-6">
      <span className="grid h-11 w-11 place-items-center rounded-2xl bg-blue-500/10 text-blue-400">
        <Icon className="h-5 w-5" />
      </span>
      <h3 className="mt-7 text-xl font-semibold">{title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-slate-500">{text}</p>
    </motion.div>
  );
}

function TrustItem({ icon: Icon, title, text }: { icon: LucideIcon; title: string; text: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="rounded-3xl border border-white/[0.08] bg-white/[0.025] p-5"
    >
      <Icon className="h-5 w-5 text-blue-400" />
      <h3 className="mt-5 font-semibold">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-slate-500">{text}</p>
    </motion.div>
  );
}

function FloatingReviewControl({ onClick }: { onClick: () => void }) {
  return (
    <motion.button
      id="floating-review-btn"
      type="button"
      onClick={onClick}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.2, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      className="group fixed bottom-4 right-4 z-40 flex h-14 items-center gap-3 rounded-full border border-white/10 bg-black/85 p-2 pr-4 shadow-[0_18px_55px_rgba(0,0,0,.5)] backdrop-blur-xl sm:bottom-6 sm:right-6"
      aria-label="Open free workflow review"
    >
      <span className="relative grid h-10 w-10 place-items-center rounded-full bg-blue-600 text-white shadow-lg shadow-blue-600/30">
        <Sparkles className="h-4 w-4" />
        <span className="motion-status-ping absolute inset-0 rounded-full bg-blue-500/40" />
      </span>
      <span className="text-left">
        <strong className="block text-xs font-semibold text-white">Free workflow review</strong>
        <span className="mt-0.5 hidden text-[10px] text-slate-600 sm:block">Show us what slows you down</span>
      </span>
      <ArrowRight className="h-3.5 w-3.5 text-slate-600 transition-transform group-hover:translate-x-1 group-hover:text-blue-400" />
    </motion.button>
  );
}

function ReviewPanel({
  formStatus,
  onClose,
  onSubmit,
  onReset,
}: {
  formStatus: "idle" | "sending" | "success";
  onClose: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onReset: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-end justify-center bg-black/75 p-0 backdrop-blur-sm sm:items-center sm:p-5"
      role="dialog"
      aria-modal="true"
      aria-labelledby="review-panel-title"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 30, scale: 0.98 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-t-[32px] border border-white/10 bg-[#080a0e] shadow-2xl sm:rounded-[32px]"
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/[0.08] bg-[#080a0e]/95 px-5 py-4 backdrop-blur sm:px-7">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-blue-500/10 text-blue-400">
              <Sparkles className="h-4 w-4" />
            </span>
            <span className="text-sm font-bold tracking-[0.12em]">MOTUS</span>
          </div>
          <button
            id="review-close-btn"
            type="button"
            onClick={onClose}
            className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/5 text-slate-400 transition hover:text-white"
            aria-label="Close workflow review form"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="grid md:grid-cols-[0.85fr_1.15fr]">
          <div className="border-b border-white/[0.08] bg-blue-600 p-6 sm:p-8 md:border-b-0 md:border-r">
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-blue-100/70">Free workflow review</span>
            <h2 id="review-panel-title" className="mt-4 text-3xl font-semibold tracking-tight">
              Tell us what keeps getting repeated.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-blue-100/80">
              We will look at the process and explain where automation could genuinely help.
            </p>
            <div className="mt-8 space-y-4">
              <PanelPromise icon={CheckCircle2} text="A practical first opinion" />
              <PanelPromise icon={MessageSquareText} text="Plain-English explanation" />
              <PanelPromise icon={LockKeyhole} text="No obligation or hard sell" />
            </div>
          </div>

          <div className="p-6 sm:p-8">
            {formStatus === "success" ? (
              <div className="flex min-h-96 flex-col items-center justify-center text-center">
                <span className="grid h-16 w-16 place-items-center rounded-full bg-emerald-500/10 text-emerald-400">
                  <CheckCircle2 className="h-8 w-8" />
                </span>
                <h3 className="mt-6 text-2xl font-semibold">Your request is in.</h3>
                <p className="mt-3 max-w-sm text-sm leading-relaxed text-slate-500">
                  We will review what you shared and contact you about the most useful next step.
                </p>
                <button
                  id="review-finish-btn"
                  type="button"
                  onClick={() => {
                    onReset();
                    onClose();
                  }}
                  className="mt-7 rounded-full border border-white/10 px-6 py-3 text-sm font-semibold text-slate-300"
                >
                  Done
                </button>
              </div>
            ) : (
              <form id="workflow-review-form" onSubmit={onSubmit} className="space-y-5">
                <FormField
                  id="review-name"
                  name="full_name"
                  label="Your name"
                  placeholder="Jane Doe"
                  icon={User}
                  required
                />
                <FormField
                  id="review-email"
                  name="email"
                  type="email"
                  label="Work email"
                  placeholder="jane@yourbusiness.co.uk"
                  icon={Mail}
                  required
                />
                <label>
                  <span className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-300">
                    <Workflow className="h-4 w-4" />
                    Which task causes the most frustration?
                  </span>
                  <textarea
                    id="review-frustration"
                    name="admin_headache"
                    required
                    rows={5}
                    placeholder="For example: We miss calls while on jobs and often reply too late..."
                    className="w-full resize-none rounded-2xl border border-white/10 bg-black/40 px-5 py-4 text-white outline-none transition placeholder:text-slate-700 focus:border-blue-500/60 focus:bg-blue-950/20"
                  />
                </label>

                <input type="hidden" name="source" value="motus-workflow-review" />

                <button
                  id="review-submit-btn"
                  type="submit"
                  disabled={formStatus === "sending"}
                  className="group flex min-h-14 w-full items-center justify-center gap-3 rounded-full bg-blue-600 px-6 font-semibold transition hover:bg-blue-500 disabled:cursor-wait disabled:opacity-70"
                >
                  {formStatus === "sending" ? "Sending your request..." : "Request my free review"}
                  {formStatus === "idle" && <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />}
                </button>
                <p className="text-center text-xs leading-relaxed text-slate-700">
                  We only use these details to respond to your request.
                </p>
              </form>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function PanelPromise({ icon: Icon, text }: { icon: LucideIcon; text: string }) {
  return (
    <div className="flex items-center gap-3 text-sm font-medium text-blue-50">
      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white/10">
        <Icon className="h-4 w-4" />
      </span>
      {text}
    </div>
  );
}

function FormField({
  id,
  name,
  label,
  placeholder,
  icon: Icon,
  type = "text",
  required = false,
}: {
  id: string;
  name: string;
  label: string;
  placeholder: string;
  icon: LucideIcon;
  type?: string;
  required?: boolean;
}) {
  return (
    <label>
      <span className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-300">
        <Icon className="h-4 w-4" />
        {label}
      </span>
      <input
        id={id}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-white/10 bg-black/40 px-5 py-4 text-white outline-none transition placeholder:text-slate-700 focus:border-blue-500/60 focus:bg-blue-950/20"
      />
    </label>
  );
}

function BackgroundField() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      <div className="absolute left-1/2 top-[-20%] h-[700px] w-[900px] -translate-x-1/2 rounded-full bg-blue-600/[0.08] blur-[160px]" />
      <div className="absolute bottom-[5%] right-[-15%] h-[500px] w-[500px] rounded-full bg-indigo-600/[0.04] blur-[140px]" />
      <div className="noise-layer absolute inset-0 opacity-[0.018]" />
    </div>
  );
}
