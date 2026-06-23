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
  PoundSterling,
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
  useSpring,
  useTransform,
  type Variants,
} from "framer-motion";
import { useMemo, useRef, useState, type FormEvent } from "react";

const NAV_ITEMS = [
  { label: "The problem", id: "friction" },
  { label: "See it move", id: "journey" },
  { label: "Examples", id: "examples" },
  { label: "Calculator", id: "calculator" },
  { label: "90-day plan", id: "experience" },
];

const JOURNEY_STAGES = [
  {
    id: "receive",
    label: "Receive",
    title: "The request arrives.",
    text: "A call, enquiry or booking enters one visible route instead of disappearing into a busy inbox.",
    icon: Inbox,
    artefact: "New website enquiry",
    meta: "Today · 09:41",
  },
  {
    id: "respond",
    label: "Respond",
    title: "The routine next step happens.",
    text: "The customer receives a useful reply and your records are updated without somebody copying details around.",
    icon: MessageSquareText,
    artefact: "Reply sent in 12 seconds",
    meta: "Customer knows what happens next",
  },
  {
    id: "handover",
    label: "Handover",
    title: "A person takes over where they matter.",
    text: "The right team member receives the context, the next action and a clear record of what already happened.",
    icon: BellRing,
    artefact: "Follow-up assigned",
    meta: "Owner · Seun · Due 10:00",
  },
] as const;

const EXAMPLES = {
  "Missed call": {
    trigger: "A customer calls while the team is busy.",
    steps: [
      ["Call recognised", PhoneMissed],
      ["Helpful text sent", MessageSquareText],
      ["Lead recorded", FileCheck2],
      ["Team alerted", BellRing],
    ] as const,
    result: "The opportunity remains warm without somebody watching the phone.",
  },
  Enquiry: {
    trigger: "A customer submits a question through the website.",
    steps: [
      ["Enquiry received", Inbox],
      ["Details checked", FileCheck2],
      ["Reply prepared", Mail],
      ["Next step created", Route],
    ] as const,
    result: "Every enquiry receives a consistent first response and a clear owner.",
  },
  Booking: {
    trigger: "A customer wants to arrange an appointment or site visit.",
    steps: [
      ["Request received", Inbox],
      ["Time confirmed", CalendarCheck2],
      ["Record updated", FileCheck2],
      ["Reminder scheduled", BellRing],
    ] as const,
    result: "The booking moves forward with fewer messages and fewer no-shows.",
  },
} as const;

const EXPERIENCE_STAGES = [
  {
    month: "Month 1",
    title: "Find the bottleneck.",
    text: "We map one repeated process, agree what should stay human and choose the first route worth fixing.",
    result: "Clear workflow map",
    icon: Route,
  },
  {
    month: "Month 2",
    title: "Build the live route.",
    text: "Calls, enquiries, bookings or records start moving through a simple system your team can understand.",
    result: "Working operations route",
    icon: Workflow,
  },
  {
    month: "Month 3",
    title: "Run it properly.",
    text: "We tighten the handover, check what is working and leave you with a calmer way to manage the task.",
    result: "Handover and improvement plan",
    icon: ShieldCheck,
  },
] as const;

const reveal: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] },
  },
};

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.11, delayChildren: 0.06 } },
};

export default function App() {
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 70, damping: 25, restDelta: 0.001 });
  const navTop = useTransform(scrollYProgress, [0, 0.06], [18, 9]);
  const navScale = useTransform(scrollYProgress, [0, 0.06], [1, 0.96]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [activeExample, setActiveExample] = useState<keyof typeof EXAMPLES>("Missed call");
  const [exampleRunning, setExampleRunning] = useState(false);
  const [calculatorMode, setCalculatorMode] = useState<"cost" | "capacity">("cost");
  const [teamSize, setTeamSize] = useState(10);
  const [adminTime, setAdminTime] = useState(20);
  const [hourlyCost, setHourlyCost] = useState(15);
  const [includeOverheads, setIncludeOverheads] = useState(true);
  const [formStatus, setFormStatus] = useState<"idle" | "sending" | "success">("idle");

  const calculator = useMemo(() => {
    const hoursPerWeek = teamSize * 40 * (adminTime / 100);
    const hoursPerYear = hoursPerWeek * 52;
    const baseCost = hoursPerYear * hourlyCost;
    const overheadRate = includeOverheads ? 0.3106 : 0;
    return {
      hoursPerWeek: Math.round(hoursPerWeek),
      hoursPerYear: Math.round(hoursPerYear),
      baseCost: Math.round(baseCost),
      annualCost: Math.round(baseCost * (1 + overheadRate)),
      headcount: (hoursPerWeek / 40).toFixed(1),
    };
  }, [teamSize, adminTime, hourlyCost, includeOverheads]);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setMenuOpen(false);
  };

  const chooseExample = (example: keyof typeof EXAMPLES) => {
    setActiveExample(example);
    setExampleRunning(false);
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
    <div className="motus-site min-h-screen overflow-x-hidden">
      <BackgroundField />
      <SignalRail progress={smoothProgress} reducedMotion={Boolean(reduceMotion)} />

      <motion.header
        style={{ top: reduceMotion ? 14 : navTop }}
        className="fixed left-1/2 z-50 w-[calc(100%-24px)] max-w-5xl -translate-x-1/2"
      >
        <motion.div
          style={{ scale: reduceMotion ? 1 : navScale }}
          className="nav-shell flex origin-top items-center justify-between rounded-full border border-white/10 bg-[#080b10]/90 px-2.5 py-2 backdrop-blur-xl sm:px-4"
        >
          <button id="nav-home-btn" type="button" onClick={() => scrollTo("top")} className="flex items-center gap-3 rounded-full px-2 py-1.5" aria-label="Back to top">
            <MotusMark />
            <span className="hidden font-display text-lg font-semibold uppercase tracking-[0.13em] sm:block">Motus</span>
          </button>

          <nav className="hidden items-center gap-1 md:flex" aria-label="Main navigation">
            {NAV_ITEMS.map((item) => (
              <button
                id={`nav-${item.id}`}
                key={item.id}
                type="button"
                onClick={() => scrollTo(item.id)}
                className="rounded-full px-4 py-2 text-sm font-medium text-[#8d99aa] transition hover:bg-white/5 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6f95ff]"
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button id="nav-review-btn" type="button" onClick={openReview} className="rounded-full bg-[#2864ff] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-[#477cff] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:px-5 sm:text-sm">
              Free review
            </button>
            <button id="mobile-menu-btn" type="button" onClick={() => setMenuOpen((open) => !open)} className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/5 md:hidden" aria-label="Toggle navigation" aria-expanded={menuOpen}>
              {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </motion.div>

        <AnimatePresence>
          {menuOpen && (
            <motion.nav
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              className="mt-2 rounded-[28px] border border-white/10 bg-[#080b10]/95 p-3 shadow-2xl backdrop-blur-xl md:hidden"
            >
              {NAV_ITEMS.map((item) => (
                <button id={`mobile-nav-${item.id}`} key={item.id} type="button" onClick={() => scrollTo(item.id)} className="flex min-h-12 w-full items-center justify-between rounded-2xl px-4 text-left text-sm font-semibold text-[#b9c2cf] hover:bg-white/5">
                  {item.label}
                  <ChevronRight className="h-4 w-4 text-[#596576]" />
                </button>
              ))}
            </motion.nav>
          )}
        </AnimatePresence>
      </motion.header>

      <main>
        <section id="top" className="relative flex min-h-screen items-center px-5 pb-16 pt-32 md:px-8 md:pt-36">
          <div className="mx-auto grid w-full max-w-7xl items-center gap-14 lg:grid-cols-[1.02fr_0.98fr] lg:gap-20">
            <motion.div initial="hidden" animate="visible" variants={stagger} className="relative z-10">
              <motion.div variants={reveal} className="mb-7 flex items-center gap-3">
                <span className="h-px w-10 bg-[#2864ff]" />
                <span className="font-utility text-[10px] font-semibold uppercase tracking-[0.22em] text-[#a9c1ff]">The invisible operations layer</span>
              </motion.div>

              <motion.h1 variants={reveal} className="font-display text-[4.1rem] font-semibold uppercase leading-[0.82] tracking-[-0.045em] text-[#f2f0ea] sm:text-[5.6rem] md:text-[7.4rem]">
                Work keeps
                <span className="relative mt-2 block pl-[0.72em] text-[#556171]">
                  moving.
                  <motion.span
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.7, duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute bottom-[0.05em] left-0 h-[0.055em] w-[1.25em] origin-left bg-[#2864ff]"
                  />
                </span>
              </motion.h1>

              <motion.p variants={reveal} className="mt-8 max-w-xl text-base font-medium leading-8 text-[#909cab] sm:text-lg">
                Motus connects the routine steps between your calls, enquiries, bookings and team—so customers move forward without the admin constantly pulling people back.
              </motion.p>

              <motion.div variants={reveal} className="mt-9 flex flex-col gap-3 sm:flex-row">
                <button id="hero-review-btn" type="button" onClick={openReview} className="signal-button group flex min-h-14 items-center justify-center gap-4 rounded-full bg-[#2864ff] px-7 font-bold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">
                  Book a free workflow review
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
                <button id="hero-journey-btn" type="button" onClick={() => scrollTo("journey")} className="flex min-h-14 items-center justify-center gap-3 px-5 font-semibold text-[#aeb8c5] transition hover:text-white">
                  Follow the signal
                  <ArrowDown className="h-4 w-4" />
                </button>
              </motion.div>

              <motion.div variants={reveal} className="mt-10 flex flex-wrap gap-x-6 gap-y-3 font-utility text-[10px] uppercase tracking-[0.14em] text-[#5d6877]">
                <span className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-[#77d7a8]" />No obligation</span>
                <span className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-[#77d7a8]" />Plain English</span>
                <span className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-[#77d7a8]" />UK business focused</span>
              </motion.div>
            </motion.div>

            <OperationsConsole />
          </div>
        </section>

        <ProofTicker />

        <section id="friction" className="relative min-h-[85vh] overflow-hidden border-b border-white/[0.06] px-5 pb-16 pt-20 md:px-8 md:py-32">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={stagger}>
                <motion.span variants={reveal} className="font-utility text-[10px] font-bold uppercase tracking-[0.22em] text-[#6f95ff]">Where time disappears</motion.span>
                <motion.h2 variants={reveal} className="mt-5 max-w-2xl font-display text-5xl font-semibold uppercase leading-[0.9] tracking-[-0.035em] text-[#f2f0ea] md:text-7xl">
                  Not one big problem.
                  <span className="block text-[#4f5a69]">A hundred small waits.</span>
                </motion.h2>
                <motion.p variants={reveal} className="mt-7 max-w-lg leading-8 text-[#8c98a8]">
                  The cost hides between systems: waiting to reply, copying details, checking whether something happened and remembering who should follow up.
                </motion.p>
              </motion.div>

              <FrictionField />
            </div>
          </div>
        </section>

        <SignalJourney />

        <ExampleConsole
          activeExample={activeExample}
          running={exampleRunning}
          onChoose={chooseExample}
          onRun={() => setExampleRunning(true)}
        />

        <OperationsCalculator
          mode={calculatorMode}
          onModeChange={setCalculatorMode}
          teamSize={teamSize}
          onTeamSizeChange={setTeamSize}
          adminTime={adminTime}
          onAdminTimeChange={setAdminTime}
          hourlyCost={hourlyCost}
          onHourlyCostChange={setHourlyCost}
          includeOverheads={includeOverheads}
          onIncludeOverheadsChange={setIncludeOverheads}
          values={calculator}
        />

        <NinetyDayExperience />

        <section id="outcomes" className="relative overflow-hidden border-b border-white/[0.06] px-5 pb-16 pt-20 md:px-8 md:py-36">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-12 lg:grid-cols-[0.72fr_1.28fr] lg:items-end">
              <div>
                <span className="font-utility text-[10px] font-bold uppercase tracking-[0.22em] text-[#6f95ff]">What changes</span>
                <h2 className="mt-5 font-display text-5xl font-semibold uppercase leading-[0.9] tracking-[-0.035em] md:text-7xl">
                  The day feels
                  <span className="block text-[#77d7a8]">lighter.</span>
                </h2>
              </div>
              <p className="max-w-2xl text-lg leading-8 text-[#8e9aaa]">
                The outcome is not “more technology.” It is fewer interruptions, faster first responses and less work depending on somebody remembering the next step.
              </p>
            </div>

            <div className="mt-16 border-y border-white/[0.08]">
              <OutcomeLine label="Reply speed" title="Customers wait less" text="Routine acknowledgements and next steps happen while your team is occupied." icon={Clock3} />
              <OutcomeLine label="Clean records" title="Information stays in motion" text="Details reach the right record and the right person without repeated copying." icon={Route} />
              <OutcomeLine label="Clear owner" title="Nothing important stays invisible" text="Completed work is recorded; failed steps are surfaced instead of quietly disappearing." icon={CheckCircle2} />
            </div>
          </div>
        </section>

        <section id="review" className="relative overflow-hidden px-5 py-20 md:px-8 md:py-36">
          <div className="mx-auto max-w-7xl">
            <div className="relative min-h-[560px] overflow-hidden rounded-[38px] bg-[#f2f0ea] px-6 py-12 text-[#101318] sm:px-10 md:px-16 md:py-16">
              <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1200 600" preserveAspectRatio="none" aria-hidden="true">
                <path d="M-20 480 C250 480 260 120 530 120 C820 120 760 430 1220 430" fill="none" stroke="#cbd5e1" strokeWidth="2" />
                <motion.path
                  d="M-20 480 C250 480 260 120 530 120 C820 120 760 430 1220 430"
                  fill="none"
                  stroke="#2864ff"
                  strokeWidth="4"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
                />
              </svg>

              <div className="relative z-10 grid min-h-[430px] gap-12 lg:grid-cols-[1fr_0.65fr] lg:items-center">
                <div>
                  <span className="font-utility text-[10px] font-bold uppercase tracking-[0.22em] text-[#2864ff]">Free workflow review</span>
                  <h2 className="mt-5 max-w-3xl font-display text-5xl font-semibold uppercase leading-[0.87] tracking-[-0.04em] md:text-7xl">
                    Show us where
                    <span className="block pl-[0.5em] text-[#647184]">work gets stuck.</span>
                  </h2>
                  <p className="mt-7 max-w-xl text-base font-medium leading-8 text-[#536070]">
                    We will look at one repetitive process and explain what can be improved, what should stay human and what a practical next step looks like.
                  </p>
                </div>

                <div className="flex flex-col items-start lg:items-end">
                  <button id="final-review-btn" type="button" onClick={openReview} className="group grid h-44 w-44 place-items-center rounded-full bg-[#101318] p-5 text-center text-white shadow-2xl transition hover:scale-[1.03] focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[#2864ff] sm:h-52 sm:w-52">
                    <span>
                      <Sparkles className="mx-auto h-6 w-6 text-[#6f95ff]" />
                      <strong className="mt-4 block font-display text-xl uppercase leading-tight">Book my free review</strong>
                      <ArrowRight className="mx-auto mt-4 h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </span>
                  </button>
                  <span className="mt-5 max-w-52 text-left font-utility text-[10px] uppercase leading-5 tracking-[0.14em] text-[#7a8695] lg:text-right">
                    Three questions. No obligation. A clear first opinion.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/[0.06] px-5 py-10 md:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 font-utility text-[10px] uppercase tracking-[0.16em] text-[#596576] sm:flex-row sm:items-center sm:justify-between">
          <span className="font-display text-base font-semibold tracking-[0.14em] text-[#aeb8c5]">Motus</span>
          <span>Business automation for UK small businesses</span>
          <span>© 2026</span>
        </div>
      </footer>

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

function MotusMark() {
  return (
    <span className="relative grid h-9 w-9 place-items-center rounded-full bg-[#2864ff]">
      <span className="absolute h-px w-5 bg-white" />
      <span className="absolute h-5 w-px bg-white" />
      <span className="h-2 w-2 rounded-full border-2 border-white bg-[#2864ff]" />
    </span>
  );
}

function SignalRail({ progress, reducedMotion }: { progress: ReturnType<typeof useSpring>; reducedMotion: boolean }) {
  const height = useTransform(progress, [0, 1], ["0%", "100%"]);
  return (
    <div className="pointer-events-none fixed bottom-0 right-3 top-0 z-30 hidden w-px bg-white/[0.06] lg:block" aria-hidden="true">
      <motion.div style={{ height: reducedMotion ? "100%" : height }} className="w-full origin-top bg-[#2864ff] shadow-[0_0_16px_rgba(40,100,255,.8)]" />
      <motion.span
        style={{ top: reducedMotion ? "100%" : height }}
        className="absolute -left-[5px] h-[11px] w-[11px] -translate-y-1/2 rounded-full border-2 border-[#a9c1ff] bg-[#2864ff] shadow-[0_0_18px_rgba(40,100,255,.9)]"
      />
    </div>
  );
}

function OperationsConsole() {
  const events = [
    { icon: PhoneMissed, title: "Missed call", detail: "Callback text prepared", state: "Received", owner: "Phone", delay: 0.55 },
    { icon: MessageSquareText, title: "Helpful reply", detail: "Customer told what happens next", state: "Sent", owner: "SMS", delay: 0.82 },
    { icon: FileCheck2, title: "Customer record", detail: "Name, reason and source logged", state: "Updated", owner: "CRM", delay: 1.09 },
    { icon: BellRing, title: "Team follow-up", detail: "Owner receives the context", state: "Assigned", owner: "Seun", delay: 1.36 },
  ];

  return (
    <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1, delay: 0.25, ease: [0.16, 1, 0.3, 1] }} className="relative mx-auto w-full max-w-[650px]">
      <div className="absolute -inset-8 rounded-full bg-[#2864ff]/20 blur-[110px]" />
      <div className="absolute -right-7 top-10 hidden h-28 w-28 rounded-full border border-[#6f95ff]/20 bg-[#101826]/80 backdrop-blur sm:block" />

      <div className="relative overflow-hidden rounded-[30px] border border-white/[0.1] bg-[#090d13] shadow-[0_40px_120px_rgba(0,0,0,.58)]">
        <div className="signal-grid absolute inset-0 opacity-35" />
        <motion.div animate={{ y: ["-10%", "900%"] }} transition={{ duration: 5.2, repeat: Infinity, repeatDelay: 1.1, ease: "linear" }} className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-[#6f95ff] to-transparent shadow-[0_0_22px_rgba(111,149,255,.9)]" />

        <div className="relative z-10 flex items-center justify-between border-b border-white/[0.08] bg-white/[0.025] px-4 py-3 sm:px-5">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#e77387]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#d7b96b]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#77d7a8]" />
          </div>
          <span className="font-utility text-[8px] uppercase tracking-[0.18em] text-[#687485]">Motus operations console</span>
          <span className="flex items-center gap-2 font-utility text-[8px] uppercase tracking-[0.14em] text-[#77d7a8]">
            <span className="relative h-2 w-2 rounded-full bg-[#77d7a8]">
              <span className="motion-status-ping absolute inset-0 rounded-full bg-[#77d7a8]" />
            </span>
            Live
          </span>
        </div>

        <div className="relative z-10 grid border-b border-white/[0.08] sm:grid-cols-3">
          <ConsoleMetric label="First reply" value="12 sec" />
          <ConsoleMetric label="Manual copying" value="0" />
          <ConsoleMetric label="Next steps set" value="3" />
        </div>

        <div className="relative z-10 grid lg:grid-cols-[0.72fr_1.28fr]">
          <div className="border-b border-white/[0.08] p-5 lg:border-b-0 lg:border-r">
            <span className="font-utility text-[9px] uppercase tracking-[0.18em] text-[#596576]">Incoming today</span>
            <div className="mt-5 space-y-3">
              {[
                ["09:41", "New enquiry", "Waiting for reply"],
                ["10:02", "Missed call", "Auto text ready"],
                ["10:18", "Booking request", "Needs owner"],
              ].map(([time, title, note], index) => (
                <motion.div
                  key={title}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.55 + index * 0.14 }}
                  className={`border border-white/[0.07] p-3 ${index === 1 ? "bg-[#2864ff]/10" : "bg-[#0d1219]"}`}
                >
                  <div className="flex items-center justify-between">
                    <strong className="text-xs text-[#dce1e8]">{title}</strong>
                    <span className="font-utility text-[8px] text-[#687485]">{time}</span>
                  </div>
                  <span className="mt-2 block font-utility text-[8px] uppercase tracking-[0.12em] text-[#596576]">{note}</span>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="relative p-5 sm:p-7">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <span className="font-utility text-[9px] uppercase tracking-[0.2em] text-[#566171]">Live route - 001</span>
                <h2 className="mt-2 font-display text-2xl font-semibold uppercase tracking-tight">Customer enquiry</h2>
              </div>
              <span className="rounded-full border border-[#77d7a8]/20 bg-[#77d7a8]/10 px-3 py-1.5 font-utility text-[8px] font-bold uppercase tracking-[0.12em] text-[#77d7a8]">Moving</span>
            </div>

            <div className="relative">
              <div className="absolute bottom-7 left-[19px] top-7 w-px bg-white/[0.08]" />
              <motion.div initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ duration: 1.6, delay: 0.5, ease: [0.16, 1, 0.3, 1] }} className="absolute bottom-7 left-[19px] top-7 w-px origin-top bg-[#2864ff] shadow-[0_0_12px_rgba(40,100,255,.7)]" />
              <motion.span
                animate={{ top: ["8%", "88%"], opacity: [0, 1, 1, 0] }}
                transition={{ duration: 3.8, delay: 1.2, repeat: Infinity, repeatDelay: 0.7, ease: "easeInOut" }}
                className="absolute left-[14px] z-20 h-3 w-3 rounded-full border-2 border-[#a9c1ff] bg-[#2864ff] shadow-[0_0_18px_rgba(40,100,255,.95)]"
              />
              <div className="space-y-3">
                {events.map((event, index) => {
                  const Icon = event.icon;
                  return (
                    <motion.div
                      key={event.title}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{
                        opacity: 1,
                        x: 0,
                        backgroundColor: ["#0e131b", "#101a2c", "#0e131b"],
                      }}
                      transition={{
                        opacity: { duration: 0.65, delay: event.delay, ease: [0.16, 1, 0.3, 1] },
                        x: { duration: 0.65, delay: event.delay, ease: [0.16, 1, 0.3, 1] },
                        backgroundColor: { duration: 1.1, delay: 1.4 + index * 0.75, repeat: Infinity, repeatDelay: 2.7 },
                      }}
                      className="relative ml-8 grid gap-3 border border-white/[0.06] bg-[#0e131b] p-3 sm:grid-cols-[1fr_auto]"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <span className="relative z-10 grid h-10 w-10 shrink-0 place-items-center rounded-full border border-[#2864ff]/30 bg-[#0a1020] text-[#7da0ff]">
                          <Icon className="h-4 w-4" />
                        </span>
                        <div className="min-w-0">
                          <strong className="block truncate text-sm font-semibold text-[#e5e8ed]">{event.title}</strong>
                          <span className="mt-1 block truncate text-xs text-[#7f8b9a]">{event.detail}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between gap-4 pl-[52px] sm:block sm:pl-0 sm:text-right">
                        <span className="block font-utility text-[8px] uppercase tracking-[0.12em] text-[#596576]">{event.owner}</span>
                        <span className="mt-1 block font-utility text-[9px] font-bold uppercase tracking-[0.12em] text-[#77d7a8]">{event.state}</span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 grid border-t border-white/[0.08] bg-[#070a0f]/70 sm:grid-cols-[1fr_auto]">
          <div className="flex items-end gap-1 px-5 py-5" aria-hidden="true">
            {[32, 44, 28, 58, 42, 72, 54, 83, 62, 78, 90, 68].map((height, index) => (
              <motion.span
                key={index}
                initial={{ height: 8, opacity: 0.35 }}
                animate={{ height, opacity: index > 7 ? 0.95 : 0.55 }}
                transition={{ duration: 0.7, delay: 0.8 + index * 0.04, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-7 rounded-t bg-[#2864ff]/70"
              />
            ))}
          </div>
          <div className="border-t border-white/[0.08] p-5 sm:border-l sm:border-t-0">
            <span className="font-utility text-[8px] uppercase tracking-[0.16em] text-[#596576]">Today</span>
            <strong className="mt-2 block font-display text-3xl font-semibold uppercase">14 handled</strong>
            <span className="mt-1 block text-xs text-[#7f8b9a]">without a manual chase</span>
          </div>
        </div>
      </div>

      <motion.div animate={{ y: [0, -7, 0] }} transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }} className="absolute -bottom-7 -left-3 hidden items-center gap-3 bg-[#f2f0ea] p-3 pr-5 text-[#11151b] shadow-2xl sm:flex">
        <CheckCircle2 className="h-5 w-5 text-[#16885b]" />
        <div>
          <strong className="block text-xs">Nothing waiting unnoticed</strong>
          <span className="mt-0.5 block font-utility text-[9px] uppercase tracking-wider text-[#7b8592]">Route complete</span>
        </div>
      </motion.div>
    </motion.div>
  );
}

function ConsoleMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-b border-white/[0.08] px-5 py-4 last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0">
      <span className="block font-utility text-[8px] uppercase tracking-[0.16em] text-[#596576]">{label}</span>
      <strong className="mt-2 block font-display text-3xl font-semibold uppercase leading-none">{value}</strong>
    </div>
  );
}

function ProofTicker() {
  const items = ["Calls", "Enquiries", "Bookings", "Records", "Reminders", "Handover"];
  const proof = [
    { icon: Clock3, label: "Speed", title: "First replies happen while your team is busy.", stat: "12 sec" },
    { icon: FileCheck2, label: "Records", title: "Customer details reach the right place.", stat: "0 copy" },
    { icon: ShieldCheck, label: "Control", title: "People stay in charge of the important calls.", stat: "human" },
  ];

  return (
    <section className="relative overflow-hidden border-y border-white/[0.06] bg-[#070a0f]">
      <div className="mx-auto grid max-w-7xl border-x border-white/[0.04] md:grid-cols-3">
        {proof.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="group relative overflow-hidden border-b border-white/[0.06] p-5 md:border-b-0 md:border-r md:last:border-r-0">
              <div className="absolute inset-0 bg-[#2864ff]/[0.03] opacity-0 transition group-hover:opacity-100" />
              <div className="relative flex items-start justify-between gap-4">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-[#2864ff]/25 bg-[#101826] text-[#7da0ff]">
                  <Icon className="h-5 w-5" />
                </span>
                <strong className="font-display text-3xl font-semibold uppercase text-[#4f5a69]">{item.stat}</strong>
              </div>
              <span className="relative mt-6 block font-utility text-[9px] uppercase tracking-[0.18em] text-[#6f95ff]">{item.label}</span>
              <p className="relative mt-2 max-w-sm text-sm font-medium leading-6 text-[#b4becb]">{item.title}</p>
            </div>
          );
        })}
      </div>
      <div className="relative overflow-hidden border-t border-white/[0.06] py-4" aria-hidden="true">
        <motion.div animate={{ x: ["0%", "-50%"] }} transition={{ duration: 22, repeat: Infinity, ease: "linear" }} className="flex w-max items-center">
          {[...items, ...items].map((item, index) => (
            <div key={`${item}-${index}`} className="flex items-center">
              <span className="mx-7 whitespace-nowrap font-display text-lg font-semibold uppercase tracking-[0.12em] text-[#505b69] sm:mx-12">{item}</span>
              <span className="h-1.5 w-1.5 rounded-full bg-[#2864ff]" />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function SignalSwitchboard() {
  const events = [
    { icon: PhoneMissed, title: "Missed call", state: "Received", delay: 0.55 },
    { icon: MessageSquareText, title: "Helpful reply", state: "Sent", delay: 0.82 },
    { icon: FileCheck2, title: "Customer record", state: "Updated", delay: 1.09 },
    { icon: BellRing, title: "Team follow-up", state: "Assigned", delay: 1.36 },
  ];

  return (
    <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1, delay: 0.25, ease: [0.16, 1, 0.3, 1] }} className="relative mx-auto w-full max-w-[570px]">
      <div className="absolute inset-10 rounded-full bg-[#2864ff]/20 blur-[100px]" />
      <div className="relative overflow-hidden border border-white/[0.09] bg-[#090d13] shadow-[0_40px_120px_rgba(0,0,0,.5)]">
        <div className="signal-grid absolute inset-0 opacity-40" />
        <motion.div animate={{ y: ["-10%", "750%"] }} transition={{ duration: 5, repeat: Infinity, repeatDelay: 1.2, ease: "linear" }} className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-[#6f95ff] to-transparent shadow-[0_0_22px_rgba(111,149,255,.9)]" />

        <div className="relative z-10 border-b border-white/[0.08] p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-utility text-[9px] uppercase tracking-[0.2em] text-[#566171]">Live route · 001</span>
              <h2 className="mt-2 font-display text-2xl font-semibold uppercase tracking-tight">Customer enquiry</h2>
            </div>
            <span className="flex items-center gap-2 font-utility text-[9px] uppercase tracking-[0.14em] text-[#77d7a8]">
              <span className="relative h-2 w-2 rounded-full bg-[#77d7a8]">
                <span className="motion-status-ping absolute inset-0 rounded-full bg-[#77d7a8]" />
              </span>
              Moving
            </span>
          </div>
        </div>

        <div className="relative p-5 sm:p-7">
          <div className="absolute bottom-10 left-[42px] top-10 w-px bg-white/[0.08] sm:left-[50px]" />
          <motion.div initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ duration: 1.6, delay: 0.5, ease: [0.16, 1, 0.3, 1] }} className="absolute bottom-10 left-[42px] top-10 w-px origin-top bg-[#2864ff] shadow-[0_0_12px_rgba(40,100,255,.7)] sm:left-[50px]" />
          <motion.span
            animate={{ top: ["8%", "88%"], opacity: [0, 1, 1, 0] }}
            transition={{ duration: 3.8, delay: 1.2, repeat: Infinity, repeatDelay: 0.7, ease: "easeInOut" }}
            className="absolute left-[37px] z-20 h-3 w-3 rounded-full border-2 border-[#a9c1ff] bg-[#2864ff] shadow-[0_0_18px_rgba(40,100,255,.95)] sm:left-[45px]"
          />
          <div className="space-y-3">
            {events.map((event, index) => (
              <motion.div
                key={event.title}
                initial={{ opacity: 0, x: 20 }}
                animate={{
                  opacity: 1,
                  x: 0,
                  backgroundColor: ["#0e131b", "#101a2c", "#0e131b"],
                }}
                transition={{
                  opacity: { duration: 0.65, delay: event.delay, ease: [0.16, 1, 0.3, 1] },
                  x: { duration: 0.65, delay: event.delay, ease: [0.16, 1, 0.3, 1] },
                  backgroundColor: { duration: 1.1, delay: 1.4 + index * 0.75, repeat: Infinity, repeatDelay: 2.7 },
                }}
                className="relative flex items-center gap-4 bg-[#0e131b] p-4"
              >
                <span className="relative z-10 grid h-10 w-10 shrink-0 place-items-center rounded-full border border-[#2864ff]/30 bg-[#0a1020] text-[#7da0ff]">
                  <event.icon className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <strong className="block truncate text-sm font-semibold text-[#e5e8ed]">{event.title}</strong>
                  <span className="mt-1 block font-utility text-[9px] uppercase tracking-[0.14em] text-[#596576]">Step {String(index + 1).padStart(2, "0")}</span>
                </div>
                <span className="font-utility text-[9px] font-bold uppercase tracking-[0.12em] text-[#77d7a8]">{event.state}</span>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-white/[0.08] p-5 font-utility text-[9px] uppercase tracking-[0.14em] text-[#596576] sm:px-7">
          <span>Elapsed · 12 sec</span>
          <span className="text-[#a9c1ff]">No manual copying</span>
        </div>
      </div>

      <motion.div animate={{ y: [0, -7, 0] }} transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }} className="absolute -bottom-7 -left-3 hidden items-center gap-3 bg-[#f2f0ea] p-3 pr-5 text-[#11151b] shadow-2xl sm:flex">
        <CheckCircle2 className="h-5 w-5 text-[#16885b]" />
        <div>
          <strong className="block text-xs">Nothing waiting unnoticed</strong>
          <span className="mt-0.5 block font-utility text-[9px] uppercase tracking-wider text-[#7b8592]">Route complete</span>
        </div>
      </motion.div>
    </motion.div>
  );
}

function Ticker() {
  const items = ["Calls", "Enquiries", "Bookings", "Records", "Reminders", "Handover"];
  return (
    <div className="relative overflow-hidden border-y border-white/[0.06] py-4" aria-hidden="true">
      <motion.div animate={{ x: ["0%", "-50%"] }} transition={{ duration: 22, repeat: Infinity, ease: "linear" }} className="flex w-max items-center">
        {[...items, ...items].map((item, index) => (
          <div key={`${item}-${index}`} className="flex items-center">
            <span className="mx-7 whitespace-nowrap font-display text-lg font-semibold uppercase tracking-[0.12em] text-[#505b69] sm:mx-12">{item}</span>
            <span className="h-1.5 w-1.5 rounded-full bg-[#2864ff]" />
          </div>
        ))}
      </motion.div>
    </div>
  );
}

function FrictionField() {
  const items = [
    { icon: PhoneMissed, label: "Missed call", note: "Waiting 2h 14m", x: "2%", y: "6%", rotate: -5 },
    { icon: Mail, label: "Unread enquiry", note: "No owner", x: "45%", y: "0%", rotate: 4 },
    { icon: FileCheck2, label: "Copy to spreadsheet", note: "Still manual", x: "17%", y: "39%", rotate: 3 },
    { icon: BellRing, label: "Remember to follow up", note: "Due yesterday", x: "53%", y: "48%", rotate: -4 },
    { icon: CalendarCheck2, label: "Confirm booking", note: "3 messages", x: "7%", y: "75%", rotate: -2 },
  ];
  return (
    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={stagger} className="relative min-h-[520px]">
      <div className="signal-grid absolute inset-0 opacity-25 [mask-image:radial-gradient(circle,black,transparent_75%)]" />
      <svg className="absolute inset-0 h-full w-full opacity-40" viewBox="0 0 700 520" aria-hidden="true">
        <path d="M80 80 C220 40 230 220 350 180 S470 380 610 280" fill="none" stroke="#384353" strokeWidth="1" strokeDasharray="5 8" />
        <path d="M110 390 C230 290 360 450 570 390" fill="none" stroke="#384353" strokeWidth="1" strokeDasharray="5 8" />
      </svg>
      {items.map((item, index) => (
        <motion.div
          key={item.label}
          variants={reveal}
          animate={{ y: [0, index % 2 ? 7 : -7, 0], rotate: [item.rotate, item.rotate + 1.5, item.rotate] }}
          transition={{ duration: 5 + index * 0.5, repeat: Infinity, ease: "easeInOut" }}
          style={{ left: item.x, top: item.y }}
          className="absolute w-[190px] border border-[#ff7890]/15 bg-[#100d12] p-4 shadow-2xl sm:w-[220px]"
        >
          <div className="flex items-start justify-between">
            <item.icon className="h-5 w-5 text-[#d57889]" />
            <span className="h-2 w-2 rounded-full bg-[#e77387] shadow-[0_0_12px_rgba(231,115,135,.65)]" />
          </div>
          <strong className="mt-8 block text-sm">{item.label}</strong>
          <span className="mt-2 block font-utility text-[9px] uppercase tracking-[0.14em] text-[#6c5961]">{item.note}</span>
        </motion.div>
      ))}
    </motion.div>
  );
}

function SignalJourney() {
  const sceneRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sceneRef, offset: ["start start", "end end"] });
  const lineLength = useTransform(scrollYProgress, [0.05, 0.92], [0, 1]);

  return (
    <section ref={sceneRef} id="journey" className="relative border-b border-white/[0.06]">
      <div className="relative px-5 py-20 md:hidden">
        <div className="signal-grid absolute inset-0 opacity-[0.1]" />
        <div className="relative mx-auto max-w-md">
          <span className="font-utility text-[10px] font-bold uppercase tracking-[0.22em] text-[#6f95ff]">One connected route</span>
          <h2 className="mt-4 font-display text-5xl font-semibold uppercase leading-[0.9] tracking-[-0.035em]">
            Follow the work,
            <span className="block text-[#4f5a69]">not the software.</span>
          </h2>
          <div className="relative mt-16 space-y-14 pl-9">
            <div className="absolute bottom-0 left-[11px] top-0 w-px bg-[#2864ff]/40" />
            {JOURNEY_STAGES.map((stage, index) => (
              <motion.div
                key={stage.id}
                initial={{ opacity: 0.2, x: 22 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.55 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="relative"
              >
                <span className="absolute -left-[34px] top-1 grid h-6 w-6 place-items-center rounded-full border border-[#6f95ff] bg-[#090d13]">
                  <span className="h-2 w-2 rounded-full bg-[#2864ff] shadow-[0_0_10px_rgba(40,100,255,.8)]" />
                </span>
                <span className="font-utility text-[9px] font-bold uppercase tracking-[0.18em] text-[#6f95ff]">{stage.label} · 0{index + 1}</span>
                <stage.icon className="mt-5 h-6 w-6 text-[#a9c1ff]" />
                <h3 className="mt-5 font-display text-3xl font-semibold uppercase leading-none">{stage.title}</h3>
                <p className="mt-4 text-sm leading-7 text-[#7f8b9a]">{stage.text}</p>
                <div className="mt-6 border-l-2 border-[#2864ff] bg-[#0b0f15] p-4">
                  <strong className="block text-xs text-[#dce1e8]">{stage.artefact}</strong>
                  <span className="mt-2 block font-utility text-[8px] uppercase tracking-[0.12em] text-[#526071]">{stage.meta}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <div className="relative hidden h-[300vh] md:block">
        <div className="sticky top-0 flex h-screen items-center overflow-hidden px-8 py-20">
        <div className="signal-grid absolute inset-0 opacity-[0.12] [mask-image:radial-gradient(circle_at_center,black,transparent_80%)]" />
        <div className="relative mx-auto h-[78vh] w-full max-w-7xl">
          <div className="absolute left-0 top-0 max-w-xl">
            <span className="font-utility text-[10px] font-bold uppercase tracking-[0.22em] text-[#6f95ff]">One connected route</span>
            <h2 className="mt-4 font-display text-5xl font-semibold uppercase leading-[0.9] tracking-[-0.035em] md:text-7xl">
              Follow the work,
              <span className="block text-[#4f5a69]">not the software.</span>
            </h2>
          </div>

          <svg className="absolute inset-x-0 bottom-12 h-[62%] w-full" viewBox="0 0 1200 470" preserveAspectRatio="none" aria-hidden="true">
            <path d="M30 350 C220 350 180 105 410 105 C625 105 565 350 790 350 C1010 350 960 120 1170 120" fill="none" stroke="#28313d" strokeWidth="2" />
            <motion.path
              d="M30 350 C220 350 180 105 410 105 C625 105 565 350 790 350 C1010 350 960 120 1170 120"
              fill="none"
              stroke="#2864ff"
              strokeWidth="4"
              strokeLinecap="round"
              style={{ pathLength: lineLength }}
            />
          </svg>

          <div className="absolute inset-x-0 bottom-10 top-[36%]">
            {JOURNEY_STAGES.map((stage, index) => (
              <JourneyStage key={stage.id} stage={stage} index={index} progress={scrollYProgress} />
            ))}
          </div>
        </div>
      </div>
      </div>
    </section>
  );
}

function JourneyStage({
  stage,
  index,
  progress,
}: {
  stage: (typeof JOURNEY_STAGES)[number];
  index: number;
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
}) {
  const start = 0.12 + index * 0.27;
  const opacity = useTransform(progress, [start - 0.08, start, start + 0.22, start + 0.34], [0.12, 1, 1, 0.35]);
  const y = useTransform(progress, [start - 0.08, start], [34, 0]);
  const positions = [
    "left-[1%] top-[52%]",
    "left-1/2 top-[2%] -translate-x-1/2",
    "right-[1%] top-[55%]",
  ];
  return (
    <motion.div style={{ opacity, y }} className={`absolute w-[44%] max-w-[330px] ${positions[index]} sm:w-[31%]`}>
      <div className="relative border-l-2 border-[#2864ff] bg-[#0b0f15] p-4 shadow-2xl sm:p-6">
        <span className="font-utility text-[9px] font-bold uppercase tracking-[0.18em] text-[#6f95ff]">{stage.label}</span>
        <stage.icon className="mt-5 h-6 w-6 text-[#a9c1ff]" />
        <h3 className="mt-5 font-display text-2xl font-semibold uppercase leading-none sm:text-3xl">{stage.title}</h3>
        <p className="mt-4 hidden text-sm leading-6 text-[#7f8b9a] sm:block">{stage.text}</p>
        <div className="mt-6 border-t border-white/[0.08] pt-4">
          <strong className="block text-xs text-[#dce1e8]">{stage.artefact}</strong>
          <span className="mt-1 block font-utility text-[8px] uppercase tracking-[0.12em] text-[#526071]">{stage.meta}</span>
        </div>
      </div>
    </motion.div>
  );
}

function ExampleConsole({
  activeExample,
  running,
  onChoose,
  onRun,
}: {
  activeExample: keyof typeof EXAMPLES;
  running: boolean;
  onChoose: (example: keyof typeof EXAMPLES) => void;
  onRun: () => void;
}) {
  const example = EXAMPLES[activeExample];
  return (
    <section id="examples" className="relative border-b border-white/[0.06] px-5 pb-16 pt-20 md:px-8 md:py-36">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-[0.72fr_1.28fr]">
          <div>
            <span className="font-utility text-[10px] font-bold uppercase tracking-[0.22em] text-[#6f95ff]">Try a real example</span>
            <h2 className="mt-5 font-display text-5xl font-semibold uppercase leading-[0.9] tracking-[-0.035em] md:text-7xl">
              Pick the
              <span className="block text-[#4f5a69]">starting point.</span>
            </h2>
            <div className="mt-10 border-t border-white/[0.08]">
              {(Object.keys(EXAMPLES) as Array<keyof typeof EXAMPLES>).map((name) => (
                <button
                  id={`example-${name.toLowerCase().replace(" ", "-")}`}
                  key={name}
                  type="button"
                  onClick={() => onChoose(name)}
                  className={`group flex min-h-16 w-full items-center justify-between border-b border-white/[0.08] text-left font-display text-xl font-semibold uppercase transition ${
                    activeExample === name ? "text-white" : "text-[#596576] hover:text-[#aeb8c5]"
                  }`}
                >
                  <span className="flex items-center gap-4">
                    <span className={`h-2 w-2 rounded-full transition ${activeExample === name ? "bg-[#2864ff] shadow-[0_0_12px_rgba(40,100,255,.8)]" : "bg-[#384353]"}`} />
                    {name}
                  </span>
                  <ChevronRight className={`h-5 w-5 transition ${activeExample === name ? "translate-x-0 text-[#6f95ff]" : "-translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"}`} />
                </button>
              ))}
            </div>
          </div>

          <motion.div layout className="relative min-h-[590px] overflow-hidden border border-white/[0.09] bg-[#090d13] p-5 sm:p-8">
            <div className="signal-grid absolute inset-0 opacity-30" />
            <div className="relative z-10 flex h-full flex-col">
              <div className="flex flex-col gap-5 border-b border-white/[0.08] pb-6 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <span className="font-utility text-[9px] uppercase tracking-[0.18em] text-[#596576]">Trigger</span>
                  <p className="mt-2 max-w-lg text-lg font-semibold text-[#dce1e8]">{example.trigger}</p>
                </div>
                <button id="run-example-btn" type="button" onClick={onRun} className="group flex min-h-12 shrink-0 items-center justify-center gap-3 rounded-full bg-[#f2f0ea] px-5 text-sm font-bold text-[#101318] transition hover:bg-white">
                  {running ? "Route running" : "Run this route"}
                  {running ? <CheckCircle2 className="h-4 w-4 text-[#16885b]" /> : <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />}
                </button>
              </div>

              <div className="relative mt-10 flex-1">
                <div className="absolute bottom-7 left-[23px] top-7 w-px bg-white/[0.08]" />
                <motion.div animate={{ scaleY: running ? 1 : 0 }} transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }} className="absolute bottom-7 left-[23px] top-7 w-px origin-top bg-[#2864ff] shadow-[0_0_12px_rgba(40,100,255,.7)]" />
                <div className="space-y-4">
                  {example.steps.map(([label, Icon], index) => (
                    <motion.div
                      key={label}
                      animate={{ opacity: running ? 1 : 0.28, x: running ? 0 : 12 }}
                      transition={{ duration: 0.5, delay: running ? index * 0.18 : 0 }}
                      className="relative flex items-center gap-5"
                    >
                      <span className={`relative z-10 grid h-12 w-12 shrink-0 place-items-center rounded-full border ${running ? "border-[#2864ff]/40 bg-[#0b1327] text-[#7da0ff]" : "border-white/10 bg-[#11151b] text-[#526071]"}`}>
                        <Icon className="h-5 w-5" />
                      </span>
                      <div className="flex-1 border-b border-white/[0.07] py-4">
                        <strong className="font-display text-lg font-semibold uppercase">{label}</strong>
                        <span className="ml-3 font-utility text-[8px] uppercase tracking-[0.14em] text-[#526071]">0{index + 1}</span>
                      </div>
                      {running && <Check className="h-4 w-4 text-[#77d7a8]" />}
                    </motion.div>
                  ))}
                </div>
              </div>

              <motion.div animate={{ opacity: running ? 1 : 0.35, borderColor: running ? "rgba(119,215,168,.32)" : "rgba(255,255,255,.08)" }} className="mt-7 flex items-start gap-3 border border-white/[0.08] bg-[#77d7a8]/[0.04] p-4">
                <CheckCircle2 className={`mt-0.5 h-5 w-5 shrink-0 ${running ? "text-[#77d7a8]" : "text-[#526071]"}`} />
                <p className="text-sm font-medium leading-6 text-[#b9c2cf]">{running ? example.result : "Run the route to see how the work moves."}</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function NinetyDayExperience() {
  return (
    <section id="experience" className="relative overflow-hidden border-b border-white/[0.06] px-5 py-20 md:px-8 md:py-32">
      <div className="signal-grid absolute inset-0 opacity-[0.08]" />
      <div className="absolute left-1/2 top-0 h-px w-[82vw] max-w-6xl -translate-x-1/2 bg-gradient-to-r from-transparent via-[#2864ff]/70 to-transparent" />

      <div className="relative mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={stagger} className="lg:sticky lg:top-28">
            <motion.span variants={reveal} className="font-utility text-[10px] font-bold uppercase tracking-[0.22em] text-[#6f95ff]">Three-month product experience</motion.span>
            <motion.h2 variants={reveal} className="mt-5 max-w-2xl font-display text-5xl font-semibold uppercase leading-[0.88] tracking-[-0.035em] md:text-7xl">
              From stuck admin
              <span className="block text-[#4f5a69]">to live routes.</span>
            </motion.h2>
            <motion.p variants={reveal} className="mt-7 max-w-lg leading-8 text-[#8c98a8]">
              Instead of selling a vague automation project, Motus works like a focused 90-day product sprint around one process that actually slows the business down.
            </motion.p>
            <motion.div variants={reveal} className="mt-9 rounded-[28px] border border-white/[0.08] bg-[#090d13] p-5">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-[#2864ff]/15 text-[#7da0ff]">
                  <CalendarCheck2 className="h-5 w-5" />
                </span>
                <div>
                  <strong className="block text-sm text-[#e5e8ed]">One process. Ninety days. Clear handover.</strong>
                  <span className="mt-1 block text-xs leading-5 text-[#7f8b9a]">Enough structure to feel real, not so much that it scares people away.</span>
                </div>
              </div>
            </motion.div>
          </motion.div>

          <div className="relative">
            <div className="absolute bottom-10 left-5 top-10 hidden w-px bg-white/[0.08] md:block" />
            <motion.div
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 1.3, ease: [0.16, 1, 0.3, 1] }}
              className="absolute bottom-10 left-5 top-10 hidden w-px origin-top bg-[#2864ff] shadow-[0_0_12px_rgba(40,100,255,.75)] md:block"
            />

            <div className="space-y-5">
              {EXPERIENCE_STAGES.map((stage, index) => {
                const Icon = stage.icon;
                return (
                  <motion.div
                    key={stage.month}
                    initial={{ opacity: 0, y: 28 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.75, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
                    className="group relative overflow-hidden rounded-[30px] border border-white/[0.08] bg-[#090d13] p-5 shadow-[0_30px_90px_rgba(0,0,0,.25)] md:ml-14 md:p-7"
                  >
                    <span className="absolute left-[-3.25rem] top-7 hidden h-4 w-4 rounded-full border-2 border-[#a9c1ff] bg-[#2864ff] shadow-[0_0_18px_rgba(40,100,255,.95)] md:block" />
                    <div className="signal-grid absolute inset-0 opacity-[0.12]" />
                    <div className="relative grid gap-8 lg:grid-cols-[1fr_0.72fr] lg:items-center">
                      <div>
                        <span className="font-utility text-[9px] font-bold uppercase tracking-[0.18em] text-[#6f95ff]">{stage.month}</span>
                        <div className="mt-5 flex items-start gap-4">
                          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-[#2864ff]/30 bg-[#0a1020] text-[#7da0ff]">
                            <Icon className="h-5 w-5" />
                          </span>
                          <div>
                            <h3 className="font-display text-3xl font-semibold uppercase leading-none">{stage.title}</h3>
                            <p className="mt-4 max-w-xl text-sm leading-7 text-[#8d99aa]">{stage.text}</p>
                          </div>
                        </div>
                      </div>

                      <div className="rounded-[24px] border border-white/[0.08] bg-[#0e131b] p-5">
                        <span className="font-utility text-[8px] uppercase tracking-[0.16em] text-[#596576]">Output</span>
                        <strong className="mt-3 block text-lg text-[#f2f0ea]">{stage.result}</strong>
                        <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/[0.08]">
                          <motion.span
                            initial={{ width: "0%" }}
                            whileInView={{ width: `${(index + 1) * 33.333}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
                            className="block h-full rounded-full bg-[#2864ff]"
                          />
                        </div>
                        <span className="mt-3 block font-utility text-[8px] uppercase tracking-[0.14em] text-[#687485]">Route confidence {index + 1}/3</span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function OperationsCalculator({
  mode,
  onModeChange,
  teamSize,
  onTeamSizeChange,
  adminTime,
  onAdminTimeChange,
  hourlyCost,
  onHourlyCostChange,
  includeOverheads,
  onIncludeOverheadsChange,
  values,
}: {
  mode: "cost" | "capacity";
  onModeChange: (mode: "cost" | "capacity") => void;
  teamSize: number;
  onTeamSizeChange: (value: number) => void;
  adminTime: number;
  onAdminTimeChange: (value: number) => void;
  hourlyCost: number;
  onHourlyCostChange: (value: number) => void;
  includeOverheads: boolean;
  onIncludeOverheadsChange: (value: boolean) => void;
  values: {
    hoursPerWeek: number;
    hoursPerYear: number;
    baseCost: number;
    annualCost: number;
    headcount: string;
  };
}) {
  return (
    <section id="calculator" className="relative overflow-hidden bg-[#f2f0ea] px-5 py-20 text-[#101318] md:px-8 md:py-32">
      <div className="absolute inset-0 calculator-grid opacity-60" />
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.3, ease: [0.16, 1, 0.3, 1] }}
        className="absolute left-0 right-0 top-0 h-1 origin-left bg-[#2864ff]"
      />

      <div className="relative mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-[0.72fr_1.28fr]">
          <div>
            <span className="font-utility text-[10px] font-bold uppercase tracking-[0.22em] text-[#2864ff]">Put a number on the friction</span>
            <h2 className="mt-5 font-display text-5xl font-semibold uppercase leading-[0.87] tracking-[-0.035em] md:text-7xl">
              What is routine
              <span className="block text-[#748092]">admin costing?</span>
            </h2>
            <p className="mt-7 max-w-lg text-base font-medium leading-8 text-[#5d6877]">
              Use your own team figures. Switch between the annual cost of manual admin and the operational capacity that could be redirected.
            </p>

            <div className="mt-9 inline-flex rounded-full border border-[#b8c0cb] bg-white/60 p-1">
              <button
                id="calculator-cost-mode"
                type="button"
                onClick={() => onModeChange("cost")}
                className={`rounded-full px-5 py-3 text-sm font-bold transition ${
                  mode === "cost" ? "bg-[#101318] text-white shadow-lg" : "text-[#657181] hover:text-[#101318]"
                }`}
              >
                Admin cost
              </button>
              <button
                id="calculator-capacity-mode"
                type="button"
                onClick={() => onModeChange("capacity")}
                className={`rounded-full px-5 py-3 text-sm font-bold transition ${
                  mode === "capacity" ? "bg-[#2864ff] text-white shadow-lg" : "text-[#657181] hover:text-[#101318]"
                }`}
              >
                Capacity unlocked
              </button>
            </div>
          </div>

          <div className="grid overflow-hidden border border-[#c7cdd5] bg-[#ebe9e3] lg:grid-cols-[0.82fr_1.18fr]">
            <div className="border-b border-[#c7cdd5] p-6 sm:p-8 lg:border-b-0 lg:border-r">
              <span className="font-utility text-[9px] font-bold uppercase tracking-[0.18em] text-[#687485]">Your working estimate</span>
              <div className="mt-8 space-y-8">
                <CalculatorRange
                  id="calculator-team-size"
                  label="Number of staff"
                  value={teamSize}
                  min={1}
                  max={50}
                  suffix=""
                  onChange={onTeamSizeChange}
                />
                <CalculatorRange
                  id="calculator-admin-time"
                  label="Time spent on routine admin"
                  value={adminTime}
                  min={5}
                  max={80}
                  suffix="%"
                  onChange={onAdminTimeChange}
                />
                <CalculatorRange
                  id="calculator-hourly-cost"
                  label="Average hourly employment cost"
                  value={hourlyCost}
                  min={10}
                  max={60}
                  prefix="£"
                  suffix=""
                  onChange={onHourlyCostChange}
                />
              </div>

              <button
                id="calculator-overheads-toggle"
                type="button"
                onClick={() => onIncludeOverheadsChange(!includeOverheads)}
                className="mt-9 flex min-h-12 w-full items-center justify-between border-t border-[#c7cdd5] pt-6 text-left"
                aria-pressed={includeOverheads}
              >
                <span>
                  <strong className="block text-sm">Include typical UK overheads</strong>
                  <span className="mt-1 block text-xs leading-5 text-[#748092]">Employer NI, pension, holiday and estimated sick leave.</span>
                </span>
                <span className={`relative ml-4 h-7 w-12 shrink-0 rounded-full transition ${includeOverheads ? "bg-[#2864ff]" : "bg-[#aeb6c1]"}`}>
                  <span className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-transform ${includeOverheads ? "translate-x-6" : "translate-x-1"}`} />
                </span>
              </button>
            </div>

            <div className="relative min-h-[520px] overflow-hidden bg-[#101318] p-6 text-white sm:p-9">
              <div className="signal-grid absolute inset-0 opacity-25" />
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 34, repeat: Infinity, ease: "linear" }}
                className="absolute -right-32 -top-32 h-80 w-80 rounded-full border border-dashed border-[#6f95ff]/20"
              />
              <div className="relative z-10 flex h-full flex-col">
                <div className="flex items-center justify-between">
                  <span className="font-utility text-[9px] uppercase tracking-[0.18em] text-[#7f8b9a]">
                    {mode === "cost" ? "Admin drain · annual" : "Capacity unlock · annual"}
                  </span>
                  <span className={`grid h-10 w-10 place-items-center rounded-full ${mode === "cost" ? "bg-[#e77387]/10 text-[#e995a4]" : "bg-[#2864ff]/15 text-[#7da0ff]"}`}>
                    {mode === "cost" ? <PoundSterling className="h-5 w-5" /> : <Zap className="h-5 w-5" />}
                  </span>
                </div>

                <AnimatePresence mode="wait">
                  {mode === "cost" ? (
                    <motion.div
                      key="cost"
                      initial={{ opacity: 0, x: 30, filter: "blur(8px)" }}
                      animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                      exit={{ opacity: 0, x: -30, filter: "blur(8px)" }}
                      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                      className="flex flex-1 flex-col"
                    >
                      <div className="mt-14">
                        <span className="font-utility text-[9px] uppercase tracking-[0.18em] text-[#e995a4]">Estimated annual admin cost</span>
                        <AnimatedValue prefix="£" value={values.annualCost.toLocaleString()} />
                        <p className="mt-5 max-w-sm text-sm leading-7 text-[#8d99aa]">
                          Estimated employment cost tied to routine admin, using the figures you selected.
                        </p>
                      </div>
                      <div className="mt-auto grid grid-cols-2 border-t border-white/10 pt-7">
                        <CalculatorMiniMetric label="Base wages" value={`£${values.baseCost.toLocaleString()}`} />
                        <CalculatorMiniMetric label="Hours each year" value={values.hoursPerYear.toLocaleString()} />
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="capacity"
                      initial={{ opacity: 0, x: 30, filter: "blur(8px)" }}
                      animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                      exit={{ opacity: 0, x: -30, filter: "blur(8px)" }}
                      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                      className="flex flex-1 flex-col"
                    >
                      <div className="mt-14">
                        <span className="font-utility text-[9px] uppercase tracking-[0.18em] text-[#77d7a8]">Equivalent capacity identified</span>
                        <AnimatedValue value={values.headcount} suffix=" people" />
                        <p className="mt-5 max-w-sm text-sm leading-7 text-[#8d99aa]">
                          The equivalent full-time capacity currently absorbed by the selected percentage of routine admin.
                        </p>
                      </div>
                      <div className="mt-auto grid grid-cols-2 border-t border-white/10 pt-7">
                        <CalculatorMiniMetric label="Hours each week" value={values.hoursPerWeek.toLocaleString()} />
                        <CalculatorMiniMetric label="Hours each year" value={values.hoursPerYear.toLocaleString()} />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <span className="mt-8 font-utility text-[8px] uppercase leading-5 tracking-[0.12em] text-[#526071]">
                  Planning estimate only. Actual automation potential depends on the process reviewed.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CalculatorRange({
  id,
  label,
  value,
  min,
  max,
  prefix = "",
  suffix,
  onChange,
}: {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  prefix?: string;
  suffix: string;
  onChange: (value: number) => void;
}) {
  const percentage = ((value - min) / (max - min)) * 100;
  return (
    <label htmlFor={id} className="block">
      <span className="flex items-end justify-between gap-4">
        <span className="text-sm font-semibold text-[#46515f]">{label}</span>
        <strong className="font-display text-3xl font-semibold">
          {prefix}{value}{suffix}
        </strong>
      </span>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        style={{ background: `linear-gradient(90deg, #2864ff ${percentage}%, #c1c7cf ${percentage}%)` }}
        className="calculator-range mt-4 w-full"
      />
    </label>
  );
}

function AnimatedValue({ value, prefix = "", suffix = "" }: { value: string; prefix?: string; suffix?: string }) {
  return (
    <div className="mt-4 min-h-[86px] overflow-hidden">
      <AnimatePresence mode="popLayout">
        <motion.strong
          key={`${prefix}-${value}-${suffix}`}
          initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -20, filter: "blur(6px)" }}
          transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
          className="block font-display text-6xl font-semibold uppercase leading-none tracking-[-0.035em] sm:text-7xl"
        >
          {prefix}{value}<span className="text-3xl text-[#6f7b8b]">{suffix}</span>
        </motion.strong>
      </AnimatePresence>
    </div>
  );
}

function CalculatorMiniMetric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="block font-utility text-[8px] uppercase tracking-[0.14em] text-[#596576]">{label}</span>
      <strong className="mt-2 block font-display text-2xl font-semibold">{value}</strong>
    </div>
  );
}

function OutcomeLine({ label, title, text, icon: Icon }: { label: string; title: string; text: string; icon: LucideIcon }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }} className="group grid gap-5 border-b border-white/[0.08] py-8 last:border-b-0 md:grid-cols-[80px_1fr_1fr_60px] md:items-center">
      <span className="font-utility text-[10px] font-bold uppercase leading-5 tracking-[0.14em] text-[#6f95ff]">{label}</span>
      <h3 className="font-display text-2xl font-semibold uppercase md:text-3xl">{title}</h3>
      <p className="max-w-lg text-sm leading-7 text-[#7f8b9a]">{text}</p>
      <span className="grid h-11 w-11 place-items-center rounded-full border border-white/[0.08] text-[#6f95ff] transition group-hover:border-[#2864ff]/40 group-hover:bg-[#2864ff]/10">
        <Icon className="h-5 w-5" />
      </span>
    </motion.div>
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
      className="fixed inset-0 z-[100] flex items-end justify-center bg-[#020407]/80 p-0 backdrop-blur-sm sm:items-center sm:p-5"
      role="dialog"
      aria-modal="true"
      aria-labelledby="review-panel-title"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 60, scale: 0.985 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 35, scale: 0.985 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-t-[32px] border border-white/10 bg-[#090d13] shadow-2xl sm:rounded-[32px]"
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/[0.08] bg-[#090d13]/95 px-5 py-4 backdrop-blur sm:px-7">
          <div className="flex items-center gap-3"><MotusMark /><span className="font-display text-lg font-semibold uppercase tracking-[0.13em]">Motus</span></div>
          <button id="review-close-btn" type="button" onClick={onClose} className="grid h-11 w-11 place-items-center rounded-full border border-white/10 text-[#8d99aa] transition hover:bg-white/5 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6f95ff]" aria-label="Close workflow review form">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="grid md:grid-cols-[0.88fr_1.12fr]">
          <div className="relative overflow-hidden border-b border-white/[0.08] bg-[#2864ff] p-7 sm:p-10 md:border-b-0 md:border-r">
            <div className="signal-grid absolute inset-0 opacity-20" />
            <div className="relative z-10">
              <span className="font-utility text-[9px] font-bold uppercase tracking-[0.2em] text-[#d5e0ff]">Free workflow review</span>
              <h2 id="review-panel-title" className="mt-5 font-display text-4xl font-semibold uppercase leading-[0.9] tracking-tight">Where does work slow down?</h2>
              <p className="mt-5 text-sm leading-7 text-[#d9e3ff]">Give us one repeated task. We will explain where automation could genuinely help and where a person should remain in control.</p>
              <div className="mt-9 space-y-4">
                <PanelPromise icon={CheckCircle2} text="A practical first opinion" />
                <PanelPromise icon={MessageSquareText} text="A plain-English explanation" />
                <PanelPromise icon={LockKeyhole} text="No obligation or hard sell" />
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-9">
            {formStatus === "success" ? (
              <div className="flex min-h-96 flex-col items-center justify-center text-center">
                <span className="grid h-16 w-16 place-items-center rounded-full bg-[#77d7a8]/10 text-[#77d7a8]"><CheckCircle2 className="h-8 w-8" /></span>
                <h3 className="mt-6 font-display text-3xl font-semibold uppercase">Your request is moving.</h3>
                <p className="mt-3 max-w-sm text-sm leading-7 text-[#7f8b9a]">We will review what you shared and contact you about the most useful next step.</p>
                <button id="review-finish-btn" type="button" onClick={() => { onReset(); onClose(); }} className="mt-7 rounded-full border border-white/10 px-6 py-3 text-sm font-semibold text-[#c4ccd6]">Done</button>
              </div>
            ) : (
              <form id="workflow-review-form" onSubmit={onSubmit} className="space-y-5">
                <FormField id="review-name" name="full_name" label="Your name" placeholder="Jane Doe" icon={User} required />
                <FormField id="review-email" name="email" type="email" label="Work email" placeholder="jane@yourbusiness.co.uk" icon={Mail} required />
                <label>
                  <span className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#cbd2dc]"><Workflow className="h-4 w-4" />Which task causes the most frustration?</span>
                  <textarea id="review-frustration" name="admin_headache" required rows={5} placeholder="For example: We miss calls while on jobs and often reply too late…" className="w-full resize-none border border-white/10 bg-[#070a0f] px-5 py-4 text-white outline-none transition placeholder:text-[#46515f] focus:border-[#6f95ff]" />
                </label>
                <input type="hidden" name="source" value="motus-workflow-review" />
                <button id="review-submit-btn" type="submit" disabled={formStatus === "sending"} className="group flex min-h-14 w-full items-center justify-center gap-3 rounded-full bg-[#2864ff] px-6 font-bold transition hover:bg-[#477cff] disabled:cursor-wait disabled:opacity-70">
                  {formStatus === "sending" ? "Sending your request…" : "Request my free review"}
                  {formStatus === "idle" && <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />}
                </button>
                <p className="text-center font-utility text-[9px] uppercase leading-5 tracking-[0.1em] text-[#526071]">We only use these details to respond to your request.</p>
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
    <div className="flex items-center gap-3 text-sm font-semibold text-white">
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/10"><Icon className="h-4 w-4" /></span>
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
      <span className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#cbd2dc]"><Icon className="h-4 w-4" />{label}</span>
      <input id={id} name={name} type={type} required={required} placeholder={placeholder} className="w-full border border-white/10 bg-[#070a0f] px-5 py-4 text-white outline-none transition placeholder:text-[#46515f] focus:border-[#6f95ff]" />
    </label>
  );
}

function BackgroundField() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      <div className="absolute left-[14%] top-[-22%] h-[700px] w-[700px] rounded-full bg-[#2864ff]/[0.08] blur-[170px]" />
      <div className="absolute bottom-[-18%] right-[-12%] h-[620px] w-[620px] rounded-full bg-[#455f9c]/[0.05] blur-[160px]" />
      <div className="noise-layer absolute inset-0 opacity-[0.022]" />
    </div>
  );
}
