import {
  Activity,
  AlertTriangle,
  ArrowDown,
  ArrowRight,
  BellRing,
  BookOpenCheck,
  BriefcaseBusiness,
  Calendar,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Database,
  FileCheck2,
  Gauge,
  Inbox,
  LockKeyhole,
  Mail,
  Menu,
  MessageSquareText,
  Phone,
  PhoneMissed,
  PoundSterling,
  RefreshCw,
  Route,
  Send,
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
import { useMemo, useState, type FormEvent } from "react";

const NAV_ITEMS = [
  { label: "What we fix", id: "problems" },
  { label: "How it works", id: "framework" },
  { label: "Results", id: "results" },
  { label: "Industries", id: "industries" },
];

const ENGINE_STAGES = [
  {
    number: "01",
    short: "Receive",
    title: "A request arrives",
    text: "A customer enquiry, missed call, booking or internal request enters the system.",
    icon: Inbox,
  },
  {
    number: "02",
    short: "Check",
    title: "The details are checked",
    text: "Motus makes sure the information needed to continue is present and usable.",
    icon: FileCheck2,
  },
  {
    number: "03",
    short: "Route",
    title: "It goes to the right process",
    text: "The request is sent to the correct workflow, system or member of staff.",
    icon: Route,
  },
  {
    number: "04",
    short: "Act",
    title: "The routine work gets done",
    text: "Motus can reply, update records, create tasks, send reminders or arrange bookings.",
    icon: Zap,
  },
  {
    number: "05",
    short: "Watch",
    title: "The result is monitored",
    text: "The system checks that each important step completed instead of assuming it worked.",
    icon: Activity,
  },
  {
    number: "06",
    short: "Alert",
    title: "Problems do not stay hidden",
    text: "If something fails, Motus records it and alerts the right person to take over.",
    icon: BellRing,
  },
];

const SECTORS = {
  Trades: {
    before: ["Missed customer call", "Handwritten note", "Reply sent hours later", "Job goes cold"],
    after: ["Automatic text sent", "Lead recorded", "Booking link shared", "Staff notified"],
    outcome: "A missed call becomes a live opportunity.",
  },
  Property: {
    before: ["Tenant email arrives", "Inbox checked manually", "Contractor searched for", "Updates chased"],
    after: ["Request categorised", "Urgent cases flagged", "Contractor contacted", "Progress recorded"],
    outcome: "Maintenance requests move without constant chasing.",
  },
  Accountants: {
    before: ["Deadline approaches", "Client chased manually", "Documents renamed", "Data copied"],
    after: ["Deadline monitored", "Reminder sent", "Folder prepared", "Status updated"],
    outcome: "Routine client chasing happens consistently.",
  },
  Recruitment: {
    before: ["CV received", "Skills read manually", "Database updated", "Interview chased"],
    after: ["CV details extracted", "Candidate categorised", "Records updated", "Invite sent"],
    outcome: "Candidates move faster while recruiters focus on people.",
  },
} as const;

const PROCESS_STEPS = [
  ["01", "Review", "We look at how work currently moves through your business."],
  ["02", "Choose", "We identify the repetitive tasks worth automating first."],
  ["03", "Build", "We create and test the workflow around your existing tools."],
  ["04", "Connect", "We install it with minimal disruption to your team."],
  ["05", "Improve", "We monitor performance and make useful adjustments."],
];

const reveal: Variants = {
  hidden: { opacity: 0, y: 28, scale: 0.99 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
  },
};

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

export default function App() {
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const navScale = useTransform(scrollYProgress, [0, 0.08], [1, 0.94]);
  const navTop = useTransform(scrollYProgress, [0, 0.08], [20, 10]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeStage, setActiveStage] = useState(0);
  const [activeSector, setActiveSector] = useState<keyof typeof SECTORS>("Trades");
  const [engineRunning, setEngineRunning] = useState(false);
  const [formStatus, setFormStatus] = useState<"idle" | "sending" | "success">("idle");
  const [teamSize, setTeamSize] = useState(10);
  const [manualTime, setManualTime] = useState(20);
  const [hourlyCost, setHourlyCost] = useState(15);

  const impact = useMemo(() => {
    const hours = teamSize * 40 * (manualTime / 100);
    const annualHours = hours * 52;
    const annualValue = annualHours * hourlyCost;
    return {
      weeklyHours: Math.round(hours),
      annualHours: Math.round(annualHours),
      annualValue: Math.round(annualValue),
      capacity: (hours / 40).toFixed(1),
    };
  }, [teamSize, manualTime, hourlyCost]);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setMenuOpen(false);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (formStatus !== "idle") return;
    const form = event.currentTarget;
    setFormStatus("sending");
    const data = Object.fromEntries(new FormData(form).entries());
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
        className="fixed left-1/2 z-50 w-[calc(100%-24px)] max-w-5xl -translate-x-1/2 origin-top"
      >
        <motion.div
          style={{ scale: reduceMotion ? 1 : navScale }}
          className="nav-shell flex origin-top items-center justify-between rounded-full border border-white/10 bg-black/70 px-3 py-2 shadow-2xl shadow-black/40 backdrop-blur-xl md:px-4"
        >
          <button
            type="button"
            onClick={() => scrollTo("top")}
            className="flex items-center gap-2 rounded-full px-2 py-2"
            aria-label="Back to top"
          >
            <span className="grid h-8 w-8 place-items-center rounded-full border border-blue-400/30 bg-blue-500/10">
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
                className="rounded-full px-4 py-2 text-sm font-medium text-slate-400 transition-colors hover:bg-white/5 hover:text-white"
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              id="nav-audit-btn"
              type="button"
              onClick={() => scrollTo("audit")}
              className="rounded-full bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-500 sm:text-sm"
            >
              Free audit
            </button>
            <button
              id="mobile-menu-btn"
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/5 md:hidden"
              aria-label="Toggle navigation"
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
              className="mt-2 rounded-3xl border border-white/10 bg-black/90 p-3 shadow-2xl backdrop-blur-xl md:hidden"
            >
              {NAV_ITEMS.map((item) => (
                <button
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
          <div className="mx-auto grid w-full max-w-7xl items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
            <motion.div initial="hidden" animate="visible" variants={stagger} className="relative z-10">
              <motion.div variants={reveal} className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-500/25 bg-blue-500/10 px-3 py-1.5 text-xs font-semibold text-blue-300">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-50" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-400" />
                </span>
                Business automation, explained clearly
              </motion.div>
              <motion.h1 variants={reveal} className="max-w-3xl text-5xl font-semibold leading-[0.98] tracking-[-0.055em] sm:text-6xl lg:text-7xl">
                Scale Your Business,
                <span className="block bg-gradient-to-r from-white via-blue-100 to-blue-400 bg-clip-text text-transparent">
                  Not Your Headcount.
                </span>
              </motion.h1>
              <motion.p variants={reveal} className="mt-6 max-w-xl text-base font-medium leading-relaxed text-slate-300 sm:text-lg">
                Motus connects your business tools and handles repetitive admin automatically—so enquiries move faster,
                records stay updated and your team gets more time for valuable work.
              </motion.p>
              <motion.div variants={reveal} className="mt-8 flex flex-col gap-3 sm:flex-row">
                <button
                  id="hero-audit-btn"
                  type="button"
                  onClick={() => scrollTo("audit")}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-blue-600 px-7 py-4 font-semibold shadow-xl shadow-blue-600/25 transition hover:bg-blue-500"
                >
                  Request Free Tech Audit
                  <ArrowRight className="h-4 w-4" />
                </button>
                <button
                  id="hero-how-btn"
                  type="button"
                  onClick={() => scrollTo("framework")}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-7 py-4 font-semibold text-slate-200 backdrop-blur transition hover:bg-white/[0.08]"
                >
                  See how it works
                  <ArrowDown className="h-4 w-4" />
                </button>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1.3, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="relative min-h-[500px]"
            >
              <OperationalEngine running />
            </motion.div>
          </div>
          <div className="pointer-events-none absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-[10px] font-bold uppercase tracking-[0.25em] text-slate-600 md:flex">
            Explore the system
            <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }} className="h-10 w-px bg-gradient-to-b from-blue-400 to-transparent" />
          </div>
        </section>

        <section id="problems" className="relative border-t border-white/5 px-5 py-24 md:px-8 md:py-32">
          <div className="mx-auto max-w-7xl">
            <SectionIntro
              eyebrow="What we fix"
              title="Your tools work. They just don’t work together."
              text="Most businesses do not need another app. They need the tools they already use to share information and move routine work forward."
            />

            <div className="mt-14 grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={stagger}
                className="relative min-h-[560px] overflow-hidden rounded-[32px] border border-white/10 bg-[#07090d] p-5 sm:p-8"
              >
                <div className="absolute inset-0 opacity-30 engine-grid" />
                <div className="relative z-10 flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Before Motus</span>
                  <span className="flex items-center gap-2 text-xs font-medium text-rose-400">
                    <AlertTriangle className="h-4 w-4" />
                    Work is disconnected
                  </span>
                </div>
                <div className="relative z-10 mt-10 grid grid-cols-2 gap-5 sm:grid-cols-3">
                  <ChaosNode icon={PhoneMissed} label="Missed enquiry" delay={0} />
                  <ChaosNode icon={Mail} label="Inbox backlog" delay={0.15} />
                  <ChaosNode icon={Database} label="Manual spreadsheet" delay={0.3} />
                  <ChaosNode icon={Clock3} label="Delayed follow-up" delay={0.45} />
                  <ChaosNode icon={RefreshCw} label="Repeated data entry" delay={0.6} />
                  <ChaosNode icon={AlertTriangle} label="Silent failures" delay={0.75} />
                </div>
                <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-30" viewBox="0 0 700 560" fill="none">
                  <path d="M80 180 C220 80 310 300 460 160" stroke="#334155" strokeWidth="1.5" strokeDasharray="8 10" />
                  <path d="M150 400 C260 250 430 500 610 340" stroke="#334155" strokeWidth="1.5" strokeDasharray="8 10" />
                  <path d="M400 100 C330 240 510 300 530 470" stroke="#334155" strokeWidth="1.5" strokeDasharray="8 10" />
                </svg>
              </motion.div>

              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={stagger}
                className="flex flex-col justify-center"
              >
                {[
                  ["Enquiries wait too long", "Customers move quickly. Slow replies quietly cost opportunities."],
                  ["Information is copied by hand", "Staff spend valuable time moving the same details between tools."],
                  ["Follow-ups depend on memory", "Important reminders happen inconsistently when people get busy."],
                  ["Failures stay hidden", "A broken process can go unnoticed until a customer complains."],
                ].map(([title, text], index) => (
                  <motion.div key={title} variants={reveal} className="group border-b border-white/10 py-6 first:pt-0">
                    <div className="flex gap-4">
                      <span className="mt-1 font-mono text-xs text-blue-400">0{index + 1}</span>
                      <div>
                        <h3 className="text-xl font-semibold">{title}</h3>
                        <p className="mt-2 max-w-lg text-sm leading-relaxed text-slate-400">{text}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        <section id="framework" className="relative border-t border-white/5 px-5 py-24 md:px-8 md:py-32">
          <div className="mx-auto max-w-7xl">
            <SectionIntro
              eyebrow="How it works"
              title="One clear system, from request to result."
              text="Motus quietly moves routine work through six understandable stages. Your team stays in control and steps in when judgement is needed."
            />

            <div className="mt-16 grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
              <div className="lg:sticky lg:top-28 lg:h-[620px]">
                <FrameworkVisual active={activeStage} />
              </div>
              <div className="space-y-4">
                {ENGINE_STAGES.map((stage, index) => (
                  <motion.button
                    id={`framework-stage-${index + 1}`}
                    key={stage.short}
                    type="button"
                    onViewportEnter={() => setActiveStage(index)}
                    onClick={() => setActiveStage(index)}
                    viewport={{ margin: "-40% 0px -40% 0px" }}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                    className={`w-full rounded-3xl border p-5 text-left transition-all sm:p-7 ${
                      activeStage === index
                        ? "border-blue-500/40 bg-blue-500/[0.08] shadow-xl shadow-blue-950/20"
                        : "border-white/[0.07] bg-white/[0.02] hover:bg-white/[0.04]"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <span className={`font-mono text-xs ${activeStage === index ? "text-blue-400" : "text-slate-600"}`}>
                        {stage.number}
                      </span>
                      <div className="flex-1">
                        <div className="flex items-center justify-between gap-4">
                          <h3 className="text-xl font-semibold">{stage.title}</h3>
                          <stage.icon className={`h-5 w-5 shrink-0 ${activeStage === index ? "text-blue-400" : "text-slate-600"}`} />
                        </div>
                        <p className="mt-2 text-sm leading-relaxed text-slate-400">{stage.text}</p>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="results" className="relative border-t border-white/5 px-5 py-24 md:px-8 md:py-32">
          <div className="mx-auto max-w-7xl">
            <SectionIntro
              eyebrow="What changes"
              title="The technology disappears. The results stay visible."
              text="The point is not to add complexity. It is to remove repeated work and make everyday service more dependable."
            />
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={stagger}
              className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-4"
            >
              <OutcomeCard icon={MessageSquareText} title="Faster replies" text="Customers receive useful responses while interest is still high." />
              <OutcomeCard icon={CheckCircle2} title="Fewer missed steps" text="Important follow-ups happen consistently, even on busy days." />
              <OutcomeCard icon={Clock3} title="More staff time" text="Routine admin stops consuming time meant for customers and growth." />
              <OutcomeCard icon={ShieldCheck} title="Clearer oversight" text="Activity, outcomes and failures are easier to see and understand." />
            </motion.div>

            <div className="mt-6 grid gap-6 overflow-hidden rounded-[32px] border border-white/10 bg-[#07090d] p-6 md:grid-cols-[0.9fr_1.1fr] md:p-10">
              <div className="flex flex-col justify-center">
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-blue-400">Live capacity estimate</span>
                <h3 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">See what repetitive work costs your team.</h3>
                <p className="mt-4 text-sm leading-relaxed text-slate-400">
                  Adjust the figures. The estimate updates immediately without sending or storing your information.
                </p>
                <div className="mt-8 space-y-6">
                  <RangeControl label="Number of staff" value={teamSize} min={1} max={50} onChange={setTeamSize} />
                  <RangeControl label="Time spent on routine admin" value={manualTime} suffix="%" min={5} max={80} onChange={setManualTime} />
                  <RangeControl label="Average hourly cost" value={hourlyCost} prefix="£" min={10} max={60} onChange={setHourlyCost} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 md:gap-4">
                <ImpactMetric label="Hours each week" value={impact.weeklyHours.toLocaleString()} icon={Clock3} featured />
                <ImpactMetric label="Annual hours" value={impact.annualHours.toLocaleString()} icon={Gauge} />
                <ImpactMetric label="Estimated yearly value" value={`£${impact.annualValue.toLocaleString()}`} icon={PoundSterling} />
                <ImpactMetric label="Staff-equivalent capacity" value={impact.capacity} icon={BriefcaseBusiness} featured />
              </div>
            </div>
          </div>
        </section>

        <section id="industries" className="relative border-t border-white/5 px-5 py-24 md:px-8 md:py-32">
          <div className="mx-auto max-w-7xl">
            <SectionIntro
              eyebrow="See it in practice"
              title="The same engine, shaped around your business."
              text="Choose an industry to see a simple example of how Motus can replace a fragile manual process."
            />

            <div className="mt-12 flex flex-wrap justify-center gap-2">
              {(Object.keys(SECTORS) as Array<keyof typeof SECTORS>).map((sector) => (
                <button
                  id={`sector-${sector.toLowerCase()}`}
                  key={sector}
                  type="button"
                  onClick={() => {
                    setActiveSector(sector);
                    setEngineRunning(false);
                  }}
                  className={`rounded-full border px-5 py-2.5 text-sm font-semibold transition ${
                    activeSector === sector
                      ? "border-blue-500 bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                      : "border-white/10 bg-white/[0.03] text-slate-400 hover:text-white"
                  }`}
                >
                  {sector}
                </button>
              ))}
            </div>

            <div className="mt-8 overflow-hidden rounded-[32px] border border-white/10 bg-[#05070a]">
              <div className="grid lg:grid-cols-[1fr_180px_1fr]">
                <WorkflowColumn title="Before Motus" items={SECTORS[activeSector].before} faded={engineRunning} />
                <div className="relative flex min-h-40 items-center justify-center border-y border-white/10 bg-black/40 lg:min-h-[520px] lg:border-x lg:border-y-0">
                  <div className="absolute inset-0 engine-grid opacity-30" />
                  <div className="relative z-10 flex flex-col items-center gap-4">
                    <motion.div
                      animate={engineRunning ? { scale: [1, 1.12, 1], rotate: [0, 3, 0] } : { scale: 1 }}
                      transition={{ duration: 0.7 }}
                      className={`grid h-20 w-20 place-items-center rounded-full border ${
                        engineRunning
                          ? "border-emerald-400 bg-emerald-400/10 shadow-[0_0_50px_rgba(52,211,153,0.25)]"
                          : "border-blue-400/40 bg-blue-500/10 shadow-[0_0_50px_rgba(59,130,246,0.18)]"
                      }`}
                    >
                      <Workflow className={`h-8 w-8 ${engineRunning ? "text-emerald-400" : "text-blue-400"}`} />
                    </motion.div>
                    <span className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Motus Engine</span>
                    <button
                      id="run-engine-btn"
                      type="button"
                      onClick={() => setEngineRunning((running) => !running)}
                      className={`rounded-full border px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition ${
                        engineRunning
                          ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400"
                          : "border-blue-500/40 bg-blue-500/10 text-blue-300 hover:bg-blue-500/20"
                      }`}
                    >
                      {engineRunning ? "System running" : "Run the engine"}
                    </button>
                  </div>
                </div>
                <WorkflowColumn title="With Motus" items={SECTORS[activeSector].after} active={engineRunning} />
              </div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${activeSector}-${engineRunning}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border-t border-white/10 bg-white/[0.02] px-6 py-5 text-center text-sm font-medium text-slate-300"
                >
                  {engineRunning ? SECTORS[activeSector].outcome : "Run the engine to see the routine process change."}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </section>

        <section className="relative border-t border-white/5 px-5 py-24 md:px-8 md:py-32">
          <div className="mx-auto max-w-7xl">
            <SectionIntro
              eyebrow="Working with Motus"
              title="A clear route from problem to working system."
              text="We keep the process understandable, test carefully and work around the tools your team already knows."
            />
            <div className="relative mt-16">
              <div className="absolute left-6 top-0 hidden h-full w-px bg-gradient-to-b from-blue-500 via-blue-500/40 to-transparent md:left-0 md:top-8 md:block md:h-px md:w-full" />
              <div className="grid gap-5 md:grid-cols-5">
                {PROCESS_STEPS.map(([number, title, text]) => (
                  <motion.div
                    key={number}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="relative rounded-3xl border border-white/[0.08] bg-[#080a0e] p-5 md:pt-12"
                  >
                    <span className="absolute left-5 top-5 grid h-7 w-7 place-items-center rounded-full border border-blue-400/40 bg-blue-500/10 font-mono text-[10px] text-blue-300 md:left-0 md:top-4 md:-translate-x-1/2">
                      {number}
                    </span>
                    <h3 className="mt-10 text-lg font-semibold md:mt-0">{title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-400">{text}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="relative border-t border-white/5 px-5 py-24 md:px-8 md:py-32">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-blue-400">Built to stay understandable</span>
              <h2 className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl">
                Safe automation should never feel like a black box.
              </h2>
              <p className="mt-5 max-w-xl leading-relaxed text-slate-400">
                You should know what the system does, where information moves and what happens when something goes wrong.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <TrustItem icon={LockKeyhole} title="GDPR-aware handling" text="Customer information is only used where the process requires it." />
              <TrustItem icon={BookOpenCheck} title="Plain-English handover" text="Your team receives a clear explanation of how the automation works." />
              <TrustItem icon={BellRing} title="Error alerts" text="Important failures are surfaced instead of disappearing silently." />
              <TrustItem icon={ShieldCheck} title="Visible audit trail" text="Key actions and outcomes can be recorded for review." />
            </div>
          </div>
        </section>

        <section id="audit" className="relative border-t border-white/5 px-5 py-24 md:px-8 md:py-32">
          <div className="mx-auto max-w-4xl overflow-hidden rounded-[36px] border border-blue-500/20 bg-gradient-to-br from-blue-950/30 via-[#080a0e] to-black p-5 shadow-2xl shadow-blue-950/20 sm:p-8 md:p-12">
            <div className="mx-auto max-w-2xl text-center">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-blue-400">Free 15-minute tech audit</span>
              <h2 className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl">Let’s find the work your team should not be doing by hand.</h2>
              <p className="mt-5 text-sm leading-relaxed text-slate-400 md:text-base">
                Tell us where time is being lost. We will identify whether automation can help and explain the next step clearly.
              </p>
            </div>

            <AnimatePresence mode="wait">
              {formStatus === "success" ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mx-auto mt-10 max-w-xl rounded-3xl border border-emerald-500/20 bg-emerald-500/[0.06] p-8 text-center"
                >
                  <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-400" />
                  <h3 className="mt-4 text-2xl font-semibold">Your request has been received.</h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-400">We will review your details and contact you to arrange the audit.</p>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  onSubmit={handleSubmit}
                  className="mt-10 grid gap-4 md:grid-cols-2"
                >
                  <FormField id="audit-name" name="full_name" label="Full name" placeholder="Jane Doe" icon={User} required />
                  <FormField id="audit-company" name="company_name" label="Company" placeholder="Your Business Ltd" icon={BriefcaseBusiness} required />
                  <FormField id="audit-email" name="email" type="email" label="Email" placeholder="jane@example.co.uk" icon={Mail} required />
                  <FormField id="audit-phone" name="phone" type="tel" label="Phone" placeholder="07123 456 789" icon={Phone} required />
                  <label className="md:col-span-2">
                    <span className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-300">
                      <MessageSquareText className="h-4 w-4" />
                      What is taking too much time?
                    </span>
                    <textarea
                      id="audit-headache"
                      name="headache"
                      rows={4}
                      className="w-full resize-none rounded-2xl border border-white/10 bg-black/40 px-5 py-4 text-white outline-none transition focus:border-blue-500/60 focus:bg-blue-950/20"
                      placeholder="Tell us about the repetitive process, missed enquiries or admin problem."
                    />
                  </label>
                  <button
                    id="audit-submit-btn"
                    type="submit"
                    disabled={formStatus === "sending"}
                    className="md:col-span-2 mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-blue-600 px-7 py-4 font-semibold shadow-xl shadow-blue-600/20 transition hover:bg-blue-500 disabled:cursor-wait disabled:opacity-70"
                  >
                    {formStatus === "sending" ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        Sending…
                      </>
                    ) : (
                      <>
                        <Calendar className="h-4 w-4" />
                        Request Free Tech Audit
                      </>
                    )}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/5 px-5 py-10 text-sm text-slate-500 md:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 sm:flex-row">
          <div className="flex items-center gap-2 font-bold tracking-[0.18em] text-white">
            <Sparkles className="h-4 w-4 text-blue-400" />
            MOTUS
          </div>
          <p>© {new Date().getFullYear()} Motus AI Systems. Built for UK businesses.</p>
        </div>
      </footer>
    </div>
  );
}

function OperationalEngine({ running }: { running: boolean }) {
  const inputs = [
    { label: "Missed call", icon: PhoneMissed, position: "left-[1%] top-[12%]" },
    { label: "New enquiry", icon: Mail, position: "left-[0%] top-[42%]" },
    { label: "Booking", icon: Calendar, position: "left-[5%] top-[72%]" },
  ];
  const outputs = [
    { label: "Reply sent", icon: Send, position: "right-[1%] top-[12%]" },
    { label: "Records updated", icon: Database, position: "right-[0%] top-[42%]" },
    { label: "Staff notified", icon: BellRing, position: "right-[5%] top-[72%]" },
  ];

  return (
    <div className="relative mx-auto h-[520px] w-full max-w-[680px]">
      <div className="absolute inset-[8%] rounded-full border border-blue-500/10" />
      <div className="absolute inset-[20%] rounded-full border border-blue-500/15" />
      <div className="absolute inset-[31%] rounded-full border border-blue-500/20" />
      <div className="absolute inset-0 engine-grid opacity-40 [mask-image:radial-gradient(circle,black,transparent_72%)]" />

      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        className="absolute inset-[14%] rounded-full border border-dashed border-blue-400/20"
      />
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 55, repeat: Infinity, ease: "linear" }}
        className="absolute inset-[25%] rounded-full border border-dashed border-white/10"
      />

      {inputs.map((item, index) => (
        <EngineNode key={item.label} {...item} side="input" delay={index * 0.35} />
      ))}
      {outputs.map((item, index) => (
        <EngineNode key={item.label} {...item} side="output" delay={0.5 + index * 0.35} />
      ))}

      <div className="absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2">
        <motion.div
          animate={running ? { boxShadow: ["0 0 25px rgba(59,130,246,.2)", "0 0 70px rgba(59,130,246,.45)", "0 0 25px rgba(59,130,246,.2)"] } : {}}
          transition={{ duration: 3.2, repeat: Infinity }}
          className="grid h-40 w-40 place-items-center rounded-full border border-blue-400/40 bg-black/90 shadow-2xl sm:h-48 sm:w-48"
        >
          <div className="absolute inset-3 rounded-full border border-white/5" />
          <div className="text-center">
            <Workflow className="mx-auto h-10 w-10 text-blue-400" />
            <span className="mt-3 block text-sm font-bold tracking-[0.2em]">MOTUS</span>
            <span className="mt-1 block text-[9px] uppercase tracking-[0.18em] text-slate-500">Operational Engine</span>
          </div>
        </motion.div>
      </div>

      {[0, 1, 2].map((index) => (
        <motion.div
          key={index}
          animate={{ offsetDistance: ["0%", "100%"] }}
          transition={{ duration: 3.2, delay: index * 0.9, repeat: Infinity, ease: "linear" }}
          className="engine-particle absolute h-2 w-2 rounded-full bg-blue-400 shadow-[0_0_14px_#60a5fa]"
          style={{ offsetPath: `path("M ${60 + index * 8} ${120 + index * 120} C 180 ${110 + index * 110}, 210 260, 335 260 C 450 260, 490 ${110 + index * 110}, ${610 - index * 8} ${120 + index * 120}")` }}
        />
      ))}
    </div>
  );
}

function EngineNode({
  label,
  icon: Icon,
  position,
  side,
  delay,
}: {
  label: string;
  icon: LucideIcon;
  position: string;
  side: "input" | "output";
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: side === "input" ? -20 : 20 }}
      animate={{ opacity: 1, x: 0, y: [0, -5, 0] }}
      transition={{
        opacity: { duration: 0.8, delay },
        x: { duration: 0.8, delay },
        y: { duration: 4 + delay, delay, repeat: Infinity, ease: "easeInOut" },
      }}
      className={`absolute z-20 ${position}`}
    >
      <div className={`flex items-center gap-2 rounded-2xl border border-white/10 bg-black/75 p-2.5 shadow-xl backdrop-blur ${side === "output" ? "flex-row-reverse" : ""}`}>
        <span className={`grid h-9 w-9 place-items-center rounded-xl ${side === "output" ? "bg-emerald-500/10 text-emerald-400" : "bg-white/5 text-slate-400"}`}>
          <Icon className="h-4 w-4" />
        </span>
        <span className="hidden whitespace-nowrap pr-1 text-xs font-medium text-slate-300 sm:block">{label}</span>
      </div>
    </motion.div>
  );
}

function ChaosNode({ icon: Icon, label, delay }: { icon: LucideIcon; label: string; delay: number }) {
  return (
    <motion.div
      variants={reveal}
      animate={{ y: [0, -5, 0], rotate: [0, delay % 0.3 === 0 ? 1 : -1, 0] }}
      transition={{ duration: 5 + delay, repeat: Infinity, ease: "easeInOut" }}
      className="relative flex min-h-32 flex-col justify-between rounded-2xl border border-white/[0.08] bg-black/50 p-4 backdrop-blur"
    >
      <Icon className="h-5 w-5 text-slate-500" />
      <span className="text-sm font-medium text-slate-300">{label}</span>
      <span className="absolute right-3 top-3 h-2 w-2 rounded-full bg-rose-400/70 shadow-[0_0_12px_rgba(251,113,133,.5)]" />
    </motion.div>
  );
}

function FrameworkVisual({ active }: { active: number }) {
  const stage = ENGINE_STAGES[active];
  return (
    <div className="relative flex h-full min-h-[500px] items-center justify-center overflow-hidden rounded-[32px] border border-white/10 bg-[#06080c]">
      <div className="absolute inset-0 engine-grid opacity-30" />
      <div className="absolute h-[70%] w-px bg-gradient-to-b from-transparent via-blue-500/40 to-transparent" />
      <div className="relative z-10 w-full max-w-md px-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: -15 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="text-center"
          >
            <motion.div
              animate={{ boxShadow: ["0 0 25px rgba(59,130,246,.15)", "0 0 60px rgba(59,130,246,.35)", "0 0 25px rgba(59,130,246,.15)"] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="mx-auto grid h-28 w-28 place-items-center rounded-full border border-blue-400/40 bg-blue-500/10"
            >
              <stage.icon className="h-10 w-10 text-blue-400" />
            </motion.div>
            <span className="mt-6 block font-mono text-xs text-blue-400">{stage.number} / 06</span>
            <h3 className="mt-3 text-3xl font-semibold">{stage.short}</h3>
            <p className="mt-3 text-sm leading-relaxed text-slate-400">{stage.text}</p>
          </motion.div>
        </AnimatePresence>
        <div className="mt-10 flex justify-center gap-2">
          {ENGINE_STAGES.map((item, index) => (
            <span
              key={item.short}
              aria-hidden="true"
              className={`h-1.5 rounded-full transition-all ${active === index ? "w-10 bg-blue-400" : index < active ? "w-4 bg-blue-500/40" : "w-4 bg-white/10"}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function SectionIntro({ eyebrow, title, text }: { eyebrow: string; title: string; text: string }) {
  return (
    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={stagger} className="mx-auto max-w-3xl text-center">
      <motion.span variants={reveal} className="text-xs font-bold uppercase tracking-[0.2em] text-blue-400">
        {eyebrow}
      </motion.span>
      <motion.h2 variants={reveal} className="mt-4 text-4xl font-semibold tracking-[-0.035em] md:text-5xl">
        {title}
      </motion.h2>
      <motion.p variants={reveal} className="mx-auto mt-5 max-w-2xl leading-relaxed text-slate-400">
        {text}
      </motion.p>
    </motion.div>
  );
}

function OutcomeCard({ icon: Icon, title, text }: { icon: LucideIcon; title: string; text: string }) {
  return (
    <motion.div variants={reveal} className="rounded-3xl border border-white/[0.08] bg-white/[0.025] p-6">
      <span className="grid h-11 w-11 place-items-center rounded-2xl bg-blue-500/10 text-blue-400">
        <Icon className="h-5 w-5" />
      </span>
      <h3 className="mt-5 text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-slate-400">{text}</p>
    </motion.div>
  );
}

function RangeControl({
  label,
  value,
  min,
  max,
  onChange,
  prefix = "",
  suffix = "",
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
  prefix?: string;
  suffix?: string;
}) {
  return (
    <label className="block">
      <span className="mb-3 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-500">
        {label}
        <strong className="font-mono text-base text-white">
          {prefix}
          {value}
          {suffix}
        </strong>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="w-full accent-blue-500"
      />
    </label>
  );
}

function ImpactMetric({
  label,
  value,
  icon: Icon,
  featured = false,
}: {
  label: string;
  value: string;
  icon: LucideIcon;
  featured?: boolean;
}) {
  return (
    <div className={`flex min-h-40 flex-col justify-between rounded-3xl border p-5 md:min-h-52 md:p-6 ${featured ? "border-blue-500/30 bg-blue-500/[0.07]" : "border-white/[0.08] bg-black/30"}`}>
      <Icon className={`h-5 w-5 ${featured ? "text-blue-400" : "text-slate-500"}`} />
      <div>
        <strong className="block text-3xl font-semibold tracking-tight md:text-4xl">{value}</strong>
        <span className="mt-2 block text-xs font-bold uppercase tracking-wider text-slate-500">{label}</span>
      </div>
    </div>
  );
}

function WorkflowColumn({
  title,
  items,
  faded = false,
  active = false,
}: {
  title: string;
  items: readonly string[];
  faded?: boolean;
  active?: boolean;
}) {
  return (
    <div className="p-5 sm:p-8">
      <h3 className={`text-sm font-bold uppercase tracking-[0.18em] ${active ? "text-emerald-400" : "text-slate-500"}`}>{title}</h3>
      <div className="mt-6 space-y-3">
        {items.map((item, index) => (
          <motion.div
            key={item}
            animate={{
              opacity: faded ? 0.25 : active ? 1 : 0.5,
              x: active ? [10, 0] : 0,
              borderColor: active ? "rgba(52,211,153,.25)" : "rgba(255,255,255,.07)",
            }}
            transition={{ duration: 0.5, delay: active ? index * 0.12 : 0 }}
            className="flex items-center gap-3 rounded-2xl border bg-white/[0.025] p-4"
          >
            <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-full ${active ? "bg-emerald-500/10 text-emerald-400" : "bg-white/5 text-slate-600"}`}>
              {active ? <Check className="h-3.5 w-3.5" /> : <span className="h-1.5 w-1.5 rounded-full bg-current" />}
            </span>
            <span className="text-sm font-medium text-slate-300">{item}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function TrustItem({ icon: Icon, title, text }: { icon: LucideIcon; title: string; text: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
      className="rounded-3xl border border-white/[0.08] bg-white/[0.025] p-6"
    >
      <Icon className="h-5 w-5 text-blue-400" />
      <h3 className="mt-4 font-semibold">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-slate-400">{text}</p>
    </motion.div>
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
        className="w-full rounded-2xl border border-white/10 bg-black/40 px-5 py-4 text-white outline-none transition focus:border-blue-500/60 focus:bg-blue-950/20"
      />
    </label>
  );
}

function BackgroundField() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      <div className="absolute left-1/2 top-[-20%] h-[700px] w-[900px] -translate-x-1/2 rounded-full bg-blue-600/[0.08] blur-[160px]" />
      <div className="absolute bottom-[5%] right-[-15%] h-[500px] w-[500px] rounded-full bg-indigo-600/[0.04] blur-[140px]" />
      <div className="absolute inset-0 opacity-[0.018] noise-layer" />
    </div>
  );
}
