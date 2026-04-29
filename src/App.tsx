import React, { useState, useMemo, FormEvent } from 'react';
import { motion } from 'motion/react';
import { 
  PhoneIncoming, PhoneMissed, Voicemail, FileEdit, AlertTriangle, PenTool, 
  Clock, Zap, MessageSquare, FileText, Database, FileSignature, 
  Send, CheckCircle, ShieldCheck, Lock, CheckCircle2, ChevronRight, Shield, Check,
  Calculator, User, Briefcase, Mail, Phone, Calendar,
  PoundSterling, Play, TrendingUp, Search, Code2, Plug, Settings, Activity, CheckSquare,
  Cpu, Loader2
} from 'lucide-react';

const SECTOR_WORKFLOWS = [
  {
    name: 'Trades',
    manual: [
      { title: 'Missed Call', icon: PhoneMissed },
      { title: 'Manual Sheet', icon: Database },
      { title: 'Paper Quote', icon: FileEdit },
      { title: 'Follow Up', icon: Clock }
    ],
    auto: [
      { title: 'Incoming Call → Auto SMS', icon: PhoneIncoming },
      { title: 'Instant Lead Log', icon: Database },
      { title: 'Smart Scheduling', icon: Calendar },
      { title: 'Auto-Draft Quote', icon: FileSignature },
      { title: 'SUCCESS: Job Won', icon: CheckCircle }
    ]
  },
  {
    name: 'Property',
    manual: [
      { title: 'Tenant Email', icon: Mail },
      { title: 'Reading Emails', icon: Search },
      { title: 'Check Rules', icon: FileText },
      { title: 'Breach Risk', icon: AlertTriangle }
    ],
    auto: [
      { title: 'Tenant Request', icon: FileText },
      { title: 'Auto-Filter Urgent', icon: Zap },
      { title: 'SMS Contractor', icon: MessageSquare },
      { title: 'Digital Work Order', icon: Settings },
      { title: 'Log Job in System', icon: CheckSquare },
      { title: 'SUCCESS: Issue Solved', icon: CheckCircle }
    ]
  },
  {
    name: 'Accountants',
    manual: [
      { title: 'Deadlines', icon: Clock },
      { title: 'Manual Reminders', icon: Mail },
      { title: 'Data Entry', icon: Database },
      { title: 'Burnout', icon: AlertTriangle }
    ],
    auto: [
      { title: 'Deadline Monitor', icon: Clock },
      { title: 'Auto-Nudge Client', icon: MessageSquare },
      { title: 'Digital Folder Setup', icon: CheckSquare },
      { title: 'Sync Data to Xero', icon: Database },
      { title: 'Prepare Tax Draft', icon: FileEdit },
      { title: 'SUCCESS: Filing Ready', icon: CheckCircle }
    ]
  },
  {
    name: 'Recruitment',
    manual: [
      { title: 'CV Received', icon: Mail },
      { title: 'Read Manually', icon: Search },
      { title: 'Wait for Reply', icon: Clock },
      { title: 'Attrition', icon: AlertTriangle }
    ],
    auto: [
      { title: 'CV Upload', icon: FileText },
      { title: 'Extract Skills', icon: Search },
      { title: 'Update Database', icon: Database },
      { title: 'Auto-Invite Interview', icon: Send },
      { title: 'Sync Calendar', icon: Calendar },
      { title: 'SUCCESS: Interview Booked', icon: CheckCircle }
    ]
  },
  {
    name: 'E-commerce',
    manual: [
      { title: 'Find Order', icon: Search },
      { title: 'Label Generation', icon: FileSignature },
      { title: 'Update Sheet', icon: Database },
      { title: 'Bad Reviews', icon: AlertTriangle }
    ],
    auto: [
      { title: 'Return Request', icon: FileText },
      { title: 'Policy Check', icon: ShieldCheck },
      { title: 'Approve Return', icon: CheckCircle2 },
      { title: 'Print Shipping Label', icon: FileSignature },
      { title: 'Update Inventory', icon: Database },
      { title: 'SUCCESS: Return Handled', icon: CheckCircle }
    ]
  },
  {
    name: 'Legal',
    manual: [
      { title: 'Initial Enquiry', icon: Mail },
      { title: 'Client Prints', icon: FileText },
      { title: 'Manual ID Check', icon: Search },
      { title: 'Billable Leakage', icon: AlertTriangle }
    ],
    auto: [
      { title: 'New Enquiry', icon: Mail },
      { title: 'Secure Client Portal', icon: Lock },
      { title: 'Digital ID Check', icon: ShieldCheck },
      { title: 'AML Verification', icon: Shield },
      { title: 'Auto-Draft Contract', icon: FileEdit },
      { title: 'SUCCESS: File Opened', icon: CheckCircle }
    ]
  }
];

const Toggle = ({ label, value, onChange }: { label: string, value: boolean, onChange: (v: boolean) => void }) => (
  <div className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
    <span className="text-sm font-medium text-slate-300">{label}</span>
    <button
      onClick={() => onChange(!value)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${value ? 'bg-blue-600' : 'bg-slate-700'}`}
    >
      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${value ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>
  </div>
);

const Starfield = () => {
  const createLayer = (count: number, size: number) => {
    let shadow = '';
    for (let i = 0; i < count; i++) {
      shadow += `${Math.floor(Math.random() * 2000)}px ${Math.floor(Math.random() * 2000)}px rgba(255, 255, 255, ${Math.random() * 0.5 + 0.2})${i === count - 1 ? '' : ', '}`;
    }
    return {
      width: `${size}px`,
      height: `${size}px`,
      background: 'transparent',
      boxShadow: shadow,
      borderRadius: '50%'
    };
  };

  const layer1 = useMemo(() => createLayer(300, 1), []);
  const layer2 = useMemo(() => createLayer(100, 2), []);
  const layer3 = useMemo(() => createLayer(50, 3), []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true">
      <style>{`
        @keyframes animStar {
          from { transform: translateY(0px) }
          to { transform: translateY(-2000px) }
        }
      `}</style>
      
      <div style={{...layer1, animation: 'animStar 100s linear infinite'}}>
        <div style={{...layer1, position: 'absolute', top: '2000px'}} />
      </div>
      <div style={{...layer2, animation: 'animStar 150s linear infinite'}}>
        <div style={{...layer2, position: 'absolute', top: '2000px'}} />
      </div>
      <div style={{...layer3, animation: 'animStar 200s linear infinite'}}>
        <div style={{...layer3, position: 'absolute', top: '2000px'}} />
      </div>
    </div>
  );
};

export default function App() {
  const [activeSector, setActiveSector] = useState(0);
  const [isAutomated, setIsAutomated] = useState(false);
  const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'success'>('idle');

  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormStatus('sending');
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch('https://seunayomide.app.n8n.cloud/webhook/lead-capture', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        alert("Audit Initialized. The Motus engine is analyzing your headache now.");
        e.currentTarget.reset();
        setFormStatus('success');
      } else {
        alert("Connection Error. Please try again.");
        setFormStatus('idle');
      }
    } catch (error) {
      alert("Connection Error. Please try again.");
      setFormStatus('idle');
    }
  };

  // Motion variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  // Calculator State
  const handleScroll = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const [teamSize, setTeamSize] = useState(10);
  const [manualTimePct, setManualTimePct] = useState(20);
  const [hourlyRate, setHourlyRate] = useState(15);
  
  const [includeNI, setIncludeNI] = useState(true);
  const [includePension, setIncludePension] = useState(true);
  const [includeHoliday, setIncludeHoliday] = useState(true);
  const [includeSickPay, setIncludeSickPay] = useState(true);
  const [includeRedirectBonus, setIncludeRedirectBonus] = useState(false);
  const [includeErrorSavings, setIncludeErrorSavings] = useState(false);

  const stats = useMemo(() => {
    const weeklyHoursPerStaff = 40; // Standard UK work week
    const baseHoursYear = teamSize * (weeklyHoursPerStaff * (manualTimePct / 100)) * 52;
    const baseWagesYear = baseHoursYear * hourlyRate;
    
    let overheadMultiplier = 0;
    if (includeNI) overheadMultiplier += 0.138;
    if (includePension) overheadMultiplier += 0.03;
    if (includeHoliday) overheadMultiplier += 0.1207;
    if (includeSickPay) overheadMultiplier += 0.0219;
    
    const totalAnnualBleed = baseWagesYear * (1 + overheadMultiplier);
    
    const hoursFreedWeek = teamSize * weeklyHoursPerStaff * (manualTimePct / 100);
    const hoursFreedYear = hoursFreedWeek * 52;
    const headcountGained = hoursFreedWeek / weeklyHoursPerStaff;

    // Capacity Unlock Specific Logic
    let strategicValue = baseWagesYear;
    if (includeRedirectBonus) strategicValue *= 1.5; // High value work multiplier
    if (includeErrorSavings) strategicValue += (baseWagesYear * 0.05); // 5% error reduction bonus

    return {
      hoursFreedWeek: Math.round(hoursFreedWeek),
      hoursFreedYear: Math.round(hoursFreedYear),
      annualValue: Math.round(baseWagesYear),
      strategicValue: Math.round(strategicValue),
      annualBleed: Math.round(totalAnnualBleed),
      headcountGained: headcountGained.toFixed(1)
    };
  }, [teamSize, manualTimePct, hourlyRate, includeNI, includePension, includeHoliday, includeSickPay, includeRedirectBonus, includeErrorSavings]);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans selection:bg-blue-500/30 relative">
      <Starfield />
      
      {/* ----------------- HERO SECTION ----------------- */}
      <motion.section 
        initial="hidden" animate="visible" variants={staggerContainer}
        className="relative px-6 pt-32 pb-20 max-w-7xl mx-auto flex flex-col items-center text-center"
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-blue-500/10 blur-[150px] rounded-full pointer-events-none" />
        <motion.span variants={fadeInUp} className="px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-sm font-medium mb-8 flex items-center gap-2 shadow-[0_0_200px_rgba(59,130,246,0.15)]">
          <Zap className="w-4 h-4" /> Safe AI Infrastructure. Built for UK Business.
        </motion.span>
        <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl font-semibold tracking-tight text-white mb-8 max-w-4xl leading-tight">
          Scale Your Business, Not Your Headcount.
        </motion.h1>
        <motion.p variants={fadeInUp} className="text-xl font-medium text-slate-300 max-w-2xl mb-12">
          Motus deploys Our Proprietary Framework—an industrial-grade, AI-driven architecture powered by Strategic AI Agents designed to eliminate repetitive administration. Reclaim staff focus and accelerate growth without the overhead, pensions, or NI of new hires.
        </motion.p>
        <motion.div variants={fadeInUp} className="flex flex-wrap gap-4 justify-center">
          <button 
            onClick={() => handleScroll('audit-form')}
            className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-full font-semibold transition-all shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_30px_rgba(37,99,235,0.6)]"
          >
            Request Free Tech Audit
          </button>
          <button 
            onClick={() => handleScroll('how-it-works')}
            className="px-8 py-4 bg-white/[0.03] backdrop-blur-md hover:bg-white/[0.08] text-white rounded-full font-semibold transition-all border border-white/[0.05]"
          >
            See How It Works
          </button>
        </motion.div>
      </motion.section>

      {/* ----------------- NEW SECTION 1: THE BARRIER ----------------- */}
      <motion.section 
        initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer}
        className="px-6 py-32 border-t border-white/[0.05]"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-white mb-6">
              Why UK businesses haven't automated yet.
            </h2>
            <p className="text-lg font-medium text-slate-300 max-w-3xl mx-auto">
              Operational friction is an architectural vulnerability. Motus deploys AI-Driven Infrastructure to resolve these structural flaws natively.
            </p>
          </motion.div>

          <motion.div variants={staggerContainer} className="grid md:grid-cols-3 gap-8 mb-12">
            {[
              {
                title: "Your data stays on UK soil. Ours doesn't leave the country.",
                text: "UK Data Residency is a core pillar of the framework's architecture. Operations are executed strictly within self-hosted UK infrastructure, ensuring absolute structural integrity for our AI Agents.",
                icon: ShieldCheck
              },
              {
                title: "We don’t change how you work. You don’t have to set anything up.",
                text: "The Motus Standard adapts to your existing structure. We map your current protocols and deploy autonomous logic seamlessly—establishing an AI operational backbone with zero internal friction.",
                icon: Clock
              },
              {
                title: "Apps that actually talk to each other.",
                text: "Fragmented tools compromise your structural integrity. The framework bridges your systems using standardized protocols so AI agents can move data automatically with absolute precision and system redundancy.",
                icon: Database
              }
            ].map((card, i) => (
              <motion.div variants={fadeInUp} key={i}>
                <motion.div 
                  className="relative p-8 rounded-3xl flex flex-col items-start transition-all border border-white/[0.05] bg-[#0A0A0A] backdrop-blur-md overflow-hidden h-full group"
                  animate={{ y: [0, -6 + i * 2, 0] }}
                  transition={{ duration: 5 + i, repeat: Infinity, ease: "easeInOut", delay: i * 0.4 }}
                  style={{ backgroundImage: 'radial-gradient(circle at 50% 0%, rgba(255,255,255,0.03) 0%, transparent 70%)' }}
                >
                  <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6 text-blue-400 group-hover:scale-110 transition-transform">
                    <card.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-semibold tracking-tight text-white mb-4 leading-tight">{card.title}</h3>
                  <p className="text-slate-400 font-medium leading-relaxed text-sm">
                    {card.text}
                  </p>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div variants={fadeInUp} className="bg-[#0A0A0A] backdrop-blur-md border border-white/[0.05] p-8 md:p-10 rounded-3xl text-center max-w-4xl mx-auto relative overflow-hidden shadow-[0_0_40px_rgba(37,99,235,0.05)]">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-blue-500 to-transparent" />
            <p className="text-lg md:text-xl font-medium text-slate-200">
              Every moment spent on manual administration compromises operational integrity. A recruiter chasing placements over WhatsApp. A letting agent manually sending reminders. This is a structural bottleneck—and Our Proprietary Framework is deployed to resolve it end-to-end.
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* ----------------- NEW SECTION: KEY BENEFITS ----------------- */}
      <motion.section 
        initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer}
        className="px-6 py-32 border-t border-white/[0.05] relative"
      >
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 blur-[150px] rounded-full pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div variants={fadeInUp} className="text-center mb-16 flex flex-col items-center">
            <span className="px-4 py-1.5 rounded-full border border-white/[0.05] bg-[#0A0A0A] backdrop-blur-md text-slate-300 text-xs font-bold uppercase tracking-widest mb-6">
              Benefits
            </span>
            <h2 className="text-3xl md:text-5xl font-semibold text-white mb-6 max-w-4xl tracking-tight">
              The Key Benefits of Automation for Your Business Growth
            </h2>
            <p className="text-lg font-medium text-slate-400 max-w-3xl mx-auto">
              Discover how business automation enhances efficiency, reduces costs, and drives growth with smarter, faster processes that work around the clock.
            </p>
          </motion.div>

          <motion.div variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Clock,
                title: "Reclaim Operational Capacity",
                desc: "Staff stop burning hours on repetitive tasks and start focusing on high-leverage outcomes while Autonomous AI Agents handle the structural workload."
              },
              {
                icon: MessageSquare,
                title: "Strategic AI Agent Responses",
                desc: "Enquiries and follow-ups trigger through The Framework instantly. Clients receive sophisticated, autonomous communication before competitors even register the lead."
              },
              {
                icon: Activity,
                title: "24/7 System Redundancy",
                desc: "The operational backbone functions continuously, ensuring AI-driven processes execute with absolute precision without human supervision."
              },
              {
                icon: PoundSterling,
                title: "Overhead Elimination",
                desc: "The Proprietary Framework handles the manual load that traditionally requires capacity expansion, leveraging AI agents to protect profit margins."
              },
              {
                icon: TrendingUp,
                title: "Frictionless Capacity Unlock",
                desc: "Expand output and client intake confidently without the liabilities of recruitment, training, or management overhead, scaling via AI-Driven Infrastructure."
              },
              {
                icon: CheckCircle2,
                title: "Absolute Structural Integrity",
                desc: "Unlike manual processing, Autonomous Logic operates with zero variance, requires no downtime, and executes every standard flawlessly."
              }
            ].map((benefit, i) => (
              <motion.div variants={fadeInUp} key={i}>
                <motion.div 
                  className="p-8 rounded-3xl flex flex-col items-start transition-all border border-white/[0.05] bg-[#0A0A0A] backdrop-blur-md overflow-hidden h-full group"
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: i * 0.3 }}
                  style={{ backgroundImage: 'radial-gradient(circle at 0% 0%, rgba(255,255,255,0.03) 0%, transparent 60%)' }}
                >
                  <div className="w-12 h-12 bg-white/[0.04] border border-white/[0.05] rounded-2xl flex items-center justify-center mb-6 text-white group-hover:scale-110 transition-transform">
                    <benefit.icon className="w-6 h-6 text-slate-200" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3 tracking-tight leading-tight">{benefit.title}</h3>
                  <p className="text-slate-400 font-medium text-sm leading-relaxed">
                    {benefit.desc}
                  </p>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* ----------------- INTERACTIVE VISUALIZER ----------------- */}
      <motion.section 
        initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer}
        className="relative px-4 py-8 md:py-12 border-t border-white/[0.05] overflow-hidden bg-[#000000] flex flex-col justify-center min-h-screen" id="how-it-works"
      >
        {/* Starfield Background */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.2]" style={{ backgroundImage: `radial-gradient(circle at center, rgba(255,255,255,0.8) 1px, transparent 1px)`, backgroundSize: '40px 40px', backgroundPosition: '0 0, 20px 20px' }} />

        {/* Dynamic Glow when Automated */}
        {isAutomated && (
          <motion.div 
            className="absolute inset-0 bg-emerald-500/10 mix-blend-screen pointer-events-none z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.5, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 5, ease: "easeOut" }}
          />
        )}

        <div className="max-w-[1600px] w-full mx-auto text-center relative z-20 flex flex-col flex-1 h-full items-center justify-center pb-4">
          <motion.h2 variants={fadeInUp} className="text-2xl md:text-4xl font-semibold tracking-tight text-white mb-6 shrink-0 mt-8 md:mt-2">Watch The System Connect</motion.h2>
          
          <motion.div variants={fadeInUp} className="flex flex-wrap justify-center gap-2 mb-8 shrink-0">
            {SECTOR_WORKFLOWS.map((sector, i) => (
              <button
                key={sector.name}
                onClick={() => { setActiveSector(i); setIsAutomated(false); }}
                className={`px-4 py-1.5 md:py-2 md:px-5 rounded-full text-xs md:text-sm font-medium transition-all border ${
                  activeSector === i 
                  ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20' 
                  : 'bg-[#0A0A0A] border-white/10 text-slate-400 hover:text-white hover:bg-white/10'
                }`}
              >
                {sector.name}
              </button>
            ))}
          </motion.div>

          {/* Circuit Board Layout - Space-HUD Telemetry Command Center */}
          <motion.div 
             variants={fadeInUp} 
             animate={isAutomated ? { x: [-2, 2, -1, 1, 0, -1, 1, 0], y: [-1, 1, -2, 2, 0, 1, -1, 0] } : {}}
             transition={{ duration: 0.5 }}
             className="w-full max-w-[1228px] mx-auto bg-black border border-white/5 rounded-3xl relative flex flex-col overflow-hidden max-h-[85vh] flex-1 min-h-[720px]"
          >
             {/* Void effect inside panel */}
             <div className="absolute inset-0 pointer-events-none opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(ellipse at center, rgba(212,175,55,0.3) 0%, transparent 70%)' }} />

             {/* MAIN CONTENT AREA */}
             <div className="flex flex-col relative z-10 flex-grow p-4 md:px-8 overflow-hidden items-center justify-center w-full min-h-0">
                {/* Scanner Effect */}
                {isAutomated && (
                  <motion.div 
                    className="absolute top-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-[#D4AF37] to-transparent shadow-[0_0_20px_rgba(212,175,55,1)] z-30 pointer-events-none"
                    initial={{ left: "0%", opacity: 0 }}
                    animate={{ left: "100%", opacity: [0, 1, 1, 0] }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                  />
                )}

                {/* Alignment Wrapper for Vertical Centering */}
                <div className="flex flex-col flex-1 w-full items-center justify-center h-full min-h-0 relative">
                  {/* Stage for Horizontal Centering */}
                  <div className="w-full max-w-4xl lg:max-w-5xl mx-auto flex flex-col justify-center px-4 md:px-0">
                    {/* Column Headers */}
                    <div className="flex w-full justify-center mb-6 relative shrink-0">
                       <div className="flex-1 flex flex-col items-end justify-center">
                         <h3 className="text-sm uppercase tracking-[0.2em] text-slate-400 font-bold">Old Way</h3>
                       </div>
                       <div className="w-[100px] md:w-[140px] flex justify-center items-center mx-3 md:mx-6">
                         <h3 className="text-[11px] md:text-sm uppercase tracking-widest text-[#D4AF37]/50 font-bold bg-[#0A0A0A] px-3 py-1 rounded-full border border-white/5 shadow-[0_0_10px_rgba(212,175,55,0.1)]">Bridge</h3>
                       </div>
                       <div className="flex-1 flex flex-col items-start justify-center">
                         <h3 className="text-sm uppercase tracking-[0.2em] text-emerald-400 font-bold">New Way</h3>
                       </div>
                    </div>

                    {/* Rows */}
                    <div className="flex flex-col w-full space-y-2.5 sm:space-y-3 md:space-y-4 relative justify-center">
                      {/* Vertical Bridge Line spanning across all rows */}
                      <div className="absolute top-0 bottom-0 left-1/2 -ml-px w-[2px] bg-gradient-to-b from-transparent via-white/10 to-transparent" />
                   
                   {Array.from({ length: Math.max(SECTOR_WORKFLOWS[activeSector].auto.length, SECTOR_WORKFLOWS[activeSector].manual.length) }).map((_, i) => {
                      const autoNode = SECTOR_WORKFLOWS[activeSector].auto[i];
                      const manualNode = SECTOR_WORKFLOWS[activeSector].manual[i]; 
                      const isLastAuto = i === SECTOR_WORKFLOWS[activeSector].auto.length - 1;
                      const isLastManual = i === SECTOR_WORKFLOWS[activeSector].manual.length - 1;
                      const stepDelay = i * 0.4;
                      const isSuccessNode = isLastAuto;
                      const accentColor = isSuccessNode ? 'emerald-500' : '[#D4AF37]';
                      const textAccent = isSuccessNode ? 'text-emerald-400' : 'text-[#D4AF37]';
                      const glowAccent = isSuccessNode ? 'shadow-[0_0_35px_rgba(16,185,129,0.7)]' : (isAutomated ? 'shadow-[0_0_15px_rgba(16,185,129,0.1)]' : 'shadow-[0_0_15px_rgba(212,175,55,0.05)]');
                      const borderAccent = isSuccessNode ? 'border-emerald-400' : (isAutomated ? 'border-emerald-500/30' : 'border-white/10');

                      return (
                         <div key={`row-${i}`} className="flex w-full justify-center items-center min-h-0">
                            {/* LEFT: Manual */}
                            <div className="flex-1 flex flex-col items-end justify-center w-full text-right">
                              <motion.div 
                                initial={{ opacity: 1 }}
                                animate={isAutomated ? { opacity: 0.15 } : { opacity: 1 }}
                                transition={{ delay: isAutomated ? stepDelay + 0.3 : 0, duration: 0.5 }}
                                className={`flex items-center justify-end gap-3 md:gap-4 transition-opacity duration-300 ${!manualNode ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
                              >
                                 {manualNode && (
                                  <>
                                    <span className={`block text-xs md:text-base font-medium tracking-wide leading-[1.1] ${isLastManual ? 'text-rose-400 border border-rose-500/20 bg-rose-500/10 px-3 py-1.5 rounded-md' : 'text-slate-300'}`}>
                                      {manualNode.title}
                                    </span>
                                    <motion.div 
                                      animate={isAutomated ? { scale: [1, 1.1, 1], boxShadow: ['0 0 0px #D4AF37', '0 0 15px #D4AF37', '0 0 0px #D4AF37'] } : {}}
                                      transition={{ delay: isAutomated ? stepDelay : 0, duration: 0.4 }}
                                      className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center shrink-0 relative z-10 bg-black border border-white/10`}
                                    >
                                      {isLastManual && !isAutomated && <div className="absolute inset-0 rounded-full bg-rose-500/20 blur-md opacity-80 animate-pulse" />}
                                      <manualNode.icon className={`w-4 h-4 md:w-5 md:h-5 ${isLastManual && !isAutomated ? 'text-rose-400' : 'text-slate-400'}`} strokeWidth={1.5} />
                                    </motion.div>
                                  </>
                                 )}
                              </motion.div>
                            </div>

                            {/* CENTER: Bridge */}
                            <div className="w-[100px] md:w-[140px] flex items-center justify-center relative h-full mx-3 md:mx-6 shrink-0">
                               {/* Center Node on the line */}
                               {(autoNode || manualNode) && (
                                 <div className={`w-2 h-2 rounded-full absolute top-1/2 left-1/2 -ml-[4px] -mt-[4px] z-20 transition-all duration-700 ${isAutomated ? 'bg-emerald-400 shadow-[0_0_12px_#10b981]' : 'bg-white/10'}`} />
                               )}
                               {/* Horizontal Path connecting left to right */}
                               {(autoNode || manualNode) && (
                                  <>
                                    <div className={`w-1/2 h-[1.5px] bg-gradient-to-r from-transparent to-white/10 absolute top-1/2 right-1/2 z-10 ${!manualNode ? 'hidden' : ''}`} />
                                    <div className={`w-1/2 h-[1.5px] bg-gradient-to-r from-white/10 to-transparent absolute top-1/2 left-1/2 z-10 ${!autoNode ? 'hidden' : ''}`} />
                                  </>
                               )}

                               {/* Animated Data Packet */}
                               {isAutomated && autoNode && manualNode && (
                                  <motion.div
                                    className="absolute top-1/2 w-[40px] h-[3px] bg-gradient-to-r from-transparent via-emerald-400 to-transparent z-30 transform -translate-y-1/2"
                                    initial={{ left: "0%", opacity: 0, scaleX: 0.5 }}
                                    animate={{ left: "100%", opacity: [0, 1, 0], scaleX: 1 }}
                                    transition={{ delay: stepDelay + 0.1, duration: 0.5, ease: "linear" }}
                                  />
                               )}
                            </div>

                            {/* RIGHT: Engineered */}
                            <div className="flex-1 flex flex-col items-start justify-center relative w-full group py-0 lg:py-0.5 min-h-[52px] md:min-h-[64px] text-left">
                              {/* Active State */}
                              <motion.div 
                                 className={`flex items-center justify-between p-2 md:p-3 md:pr-4 bg-[#050505] rounded-xl md:rounded-lg relative overflow-hidden w-full h-full border ${isAutomated ? borderAccent : 'border-white/5'} ${isAutomated ? glowAccent : 'shadow-none'} ${!autoNode ? 'opacity-0 pointer-events-none' : ''}`}
                                 initial={{ opacity: 0.3, x: -10 }}
                                 animate={isAutomated ? { opacity: 1, x: 0 } : { opacity: 0.3, x: 0 }}
                                 transition={{ delay: isAutomated ? stepDelay + 0.3 : 0, duration: 0.3, ease: "easeOut" }}
                              >
                                {autoNode && (
                                 <>
                                   <div className="flex items-center gap-3 md:gap-4 z-10 relative">
                                      <div className={`w-8 h-8 md:w-10 md:h-10 rounded-md shrink-0 flex items-center justify-center bg-black border ${isAutomated ? (isSuccessNode ? 'border-emerald-500/30' : 'border-emerald-500/20') : 'border-white/10'}`}>
                                         <autoNode.icon className={`w-4 h-4 md:w-5 md:h-5 ${isAutomated ? textAccent : 'text-slate-500'}`} strokeWidth={1.5} />
                                      </div>
                                      <span className={`text-xs md:text-base font-semibold tracking-wide leading-tight flex items-center ${isAutomated ? (isSuccessNode ? 'text-emerald-400' : 'text-white/90') : 'text-slate-400'}`}>{autoNode.title}</span>
                                   </div>
                                   <span className={`text-[10px] md:text-xs font-mono tracking-widest hidden md:flex z-10 relative pr-2 items-center ${isAutomated ? 'text-[#D4AF37]/50' : 'text-white/30'}`}>[SYS_{String(i+1).padStart(2, '0')}]</span>

                                   {/* Progress Line */}
                                   {isAutomated && (
                                     <motion.div 
                                        className={`absolute inset-0 opacity-10 ${isSuccessNode ? 'bg-emerald-500' : 'bg-[#D4AF37]'}`} 
                                        initial={{ width: "0%" }}
                                        animate={{ width: "100%" }}
                                        transition={{ duration: 1.0, delay: stepDelay + 0.4 }}
                                     />
                                   )}
                                 </>
                                )}
                              </motion.div>
                            </div>
                         </div>
                      );
                   })}
                  </div>
                  </div>
                </div>
              </div>

              {/* FOOTER BUTTON ZONE */}
             <div className="flex justify-center pb-2 md:pb-4 pt-3 w-full shrink-0 z-20 border-t border-white/5 bg-[#030303] flex-none">
                 <button 
                  onClick={() => setIsAutomated(!isAutomated)}
                  className={`relative px-8 py-3 md:px-10 md:py-3.5 rounded-full overflow-hidden transition-all duration-300 active:scale-95 hover:scale-[1.02] border-2 ${
                    !isAutomated 
                      ? 'bg-black border-[#D4AF37]/60 text-[#D4AF37] hover:bg-[#D4AF37]/10 hover:border-[#D4AF37] shadow-[0_0_20px_rgba(212,175,55,0.2)]' 
                      : 'bg-black border-emerald-500 text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.2)]'
                  }`}
                 >
                   <div className="relative flex items-center gap-3 md:gap-4">
                     {!isAutomated ? (
                       <>
                         <Zap className="w-5 h-5 md:w-6 md:h-6 text-[#D4AF37] animate-pulse" />
                         <span className="tracking-[0.2em] uppercase text-sm md:text-base font-mono font-bold whitespace-nowrap">
                           INITIALIZE ENGINE
                         </span>
                       </>
                     ) : (
                       <>
                         <Activity className="w-5 h-5 md:w-6 md:h-6 text-emerald-400 animate-pulse" />
                         <span className="tracking-[0.2em] uppercase text-sm md:text-base font-mono font-bold whitespace-nowrap">
                           SYSTEM OPERATIONAL
                         </span>
                       </>
                     )}
                   </div>

                 </button>
             </div>
          </motion.div>
        </div>
      </motion.section>

      {/* ----------------- NEW SECTION: OUR PROCESS ----------------- */}
      <motion.section 
        initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer}
        className="px-6 py-32 border-t border-white/[0.05] relative"
      >
        <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-emerald-600/5 blur-[150px] rounded-full pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div variants={fadeInUp} className="text-center mb-16 flex flex-col items-center">
            <span className="px-4 py-1.5 rounded-full border border-white/[0.05] bg-[#0A0A0A] backdrop-blur-md text-slate-300 text-xs font-bold uppercase tracking-widest mb-6">
              Our Process
            </span>
            <h2 className="text-3xl md:text-5xl font-semibold text-white mb-6 max-w-4xl tracking-tight">
              Our Process
            </h2>
            <p className="text-lg font-medium text-slate-400 max-w-3xl mx-auto">
              We design, build, and deploy custom automation workflows tailored to your operational needs.
            </p>
          </motion.div>

          <motion.div variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Card 1 */}
            <motion.div variants={fadeInUp}>
              <motion.div 
                className="bg-white/[0.02] backdrop-blur-md border border-white/[0.05] rounded-3xl overflow-hidden flex flex-col shadow-lg h-full"
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.1 }}
                style={{ backgroundImage: 'radial-gradient(circle at 100% 0%, rgba(255,255,255,0.03) 0%, transparent 50%)' }}
              >
              <div className="p-8 md:p-10 pb-0">
                <span className="text-xs font-bold text-emerald-500 uppercase tracking-widest mb-2 block">Step 01</span>
                <h3 className="text-2xl font-semibold tracking-tight text-white mb-3">Architectural Analysis</h3>
                <p className="text-slate-400 font-medium leading-relaxed mb-8">
                  Motus assesses your current infrastructure to identify critical implementation points where Strategic AI Agents can be deployed within our proprietary framework. (System check, Process check, Speed check, Manual work block).
                </p>
              </div>
              <div className="mt-auto p-8 pt-0 flex justify-center">
                <div className="w-full bg-black/40 border border-white/[0.05] rounded-2xl p-6 shadow-inner relative overflow-hidden backdrop-blur-md">
                  <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500/50 to-emerald-500/50" />
                  <div className="space-y-4">
                    {['System check', 'Process check', 'Speed check', 'Manual work block'].map((item, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <CheckSquare className="w-4 h-4 text-emerald-500" />
                        <div className="h-2 w-1/3 bg-slate-800 rounded"></div>
                        <span className="text-xs font-medium text-slate-500 font-mono tracking-tight">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
            </motion.div>

            {/* Card 2 */}
            <motion.div variants={fadeInUp}>
              <motion.div 
                className="bg-white/[0.02] backdrop-blur-md border border-white/[0.05] rounded-3xl overflow-hidden flex flex-col shadow-lg h-full"
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
                style={{ backgroundImage: 'radial-gradient(circle at 100% 0%, rgba(255,255,255,0.03) 0%, transparent 50%)' }}
              >
              <div className="p-8 md:p-10 pb-0">
                <span className="text-xs font-bold text-blue-500 uppercase tracking-widest mb-2 block">Step 02</span>
                <h3 className="text-2xl font-semibold tracking-tight text-white mb-3">AI Framework Configuration</h3>
                <p className="text-slate-400 font-medium leading-relaxed mb-8">
                  Motus engineers configure the autonomous logic to your specifications, ensuring structural integrity through rigorous pre-deployment stress-testing of the AI agents.
                </p>
              </div>
              <div className="mt-auto p-8 pt-0 flex justify-center">
                <div className="w-full bg-black/40 border border-white/[0.05] rounded-2xl p-6 shadow-inner font-mono text-sm backdrop-blur-md">
                  <div className="flex items-center gap-2 mb-4 border-b border-white/5 pb-3">
                    <div className="w-3 h-3 rounded-full bg-rose-500" />
                    <div className="w-3 h-3 rounded-full bg-amber-500" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  </div>
                  <div className="space-y-2 text-slate-400">
                    <div><span className="text-purple-400">import</span> <span className="text-blue-300">automation</span> <span className="text-purple-400">from</span> <span className="text-emerald-300">'@core'</span>;</div>
                    <div><span className="text-purple-400">const</span> workflow <span className="text-rose-400">=</span> <span className="text-purple-400">new</span> <span className="text-amber-200">automation</span>.build();</div>
                    <div className="pt-2">workflow.init().then(<span className="text-rose-400">()</span> <span className="text-rose-400">{`=>`}</span> {'{'}</div>
                    <div className="pl-4">console.log(<span className="text-emerald-300">"Systems running optimized"</span>);</div>
                    <div>{'}'});</div>
                  </div>
                </div>
              </div>
            </motion.div>
            </motion.div>

            {/* Card 3 */}
            <motion.div variants={fadeInUp}>
              <motion.div 
                className="bg-white/[0.02] backdrop-blur-md border border-white/[0.05] rounded-3xl overflow-hidden flex flex-col shadow-lg h-full"
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                style={{ backgroundImage: 'radial-gradient(circle at 100% 0%, rgba(255,255,255,0.03) 0%, transparent 50%)' }}
              >
              <div className="p-8 md:p-10 pb-0">
                <span className="text-xs font-bold text-purple-500 uppercase tracking-widest mb-2 block">Step 03</span>
                <h3 className="text-2xl font-semibold tracking-tight text-white mb-3">Deployment & Integration</h3>
                <p className="text-slate-400 font-medium leading-relaxed mb-8">
                  The standardized protocols are installed into your existing systems, establishing the AI-driven operational backbone with minimal disruption and built-in redundancy.
                </p>
              </div>
              <div className="mt-auto p-8 pt-0 flex justify-center">
                <div className="w-full bg-black/40 border border-white/[0.05] rounded-2xl p-8 shadow-inner flex items-center justify-center gap-6 backdrop-blur-md">
                  <div className="w-16 h-16 bg-white/[0.02] border border-white/[0.05] rounded-2xl flex items-center justify-center shadow-lg relative z-20">
                    <Database className="w-8 h-8 text-blue-400" />
                  </div>
                  <div className="flex-1 h-px bg-gradient-to-r from-blue-500/0 via-purple-500 to-emerald-500/0 relative">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-[0_0_15px_rgba(255,255,255,1)]" />
                  </div>
                  <div className="w-16 h-16 bg-white/[0.02] border border-emerald-500/30 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.15)] relative z-20">
                    <div className="w-8 h-8 bg-black rounded flex items-center justify-center text-emerald-400 font-bold text-xl italic">M</div>
                  </div>
                </div>
              </div>
            </motion.div>
            </motion.div>

            {/* Card 4 */}
            <motion.div variants={fadeInUp}>
              <motion.div 
                className="bg-white/[0.02] backdrop-blur-md border border-white/[0.05] rounded-3xl overflow-hidden flex flex-col shadow-lg h-full"
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.7 }}
                style={{ backgroundImage: 'radial-gradient(circle at 100% 0%, rgba(255,255,255,0.03) 0%, transparent 50%)' }}
              >
              <div className="p-8 md:p-10 pb-0">
                <span className="text-xs font-bold text-amber-500 uppercase tracking-widest mb-2 block">Step 04</span>
                <h3 className="text-2xl font-semibold tracking-tight text-white mb-3">Continuous Optimization</h3>
                <p className="text-slate-400 font-medium leading-relaxed mb-8">
                  Motus monitors the AI architecture post-deployment, utilizing system insights to optimize agent performance and guarantee long-term operational capacity.
                </p>
              </div>
              <div className="mt-auto p-8 pt-0 flex justify-center">
                <div className="w-full bg-black/40 border border-white/[0.05] rounded-2xl p-6 shadow-inner backdrop-blur-md">
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Live Status</span>
                    <div className="flex items-center gap-2">
                       <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                      </span>
                      <span className="text-xs text-emerald-500 font-bold">100% Online</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="bg-white/[0.03] border border-white/[0.05] rounded-xl p-3 flex justify-between items-center">
                      <span className="text-sm font-medium text-slate-300">Appointment reminders</span>
                      <span className="text-xs text-emerald-400 font-mono bg-emerald-500/10 px-2 py-1 rounded">Active</span>
                    </div>
                    <div className="bg-white/[0.03] border border-white/[0.05] rounded-xl p-3 flex justify-between items-center">
                      <span className="text-sm font-medium text-slate-300">Workflow system</span>
                      <span className="text-xs text-blue-400 font-mono bg-blue-500/10 px-2 py-1 rounded">Updated</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
            </motion.div>

          </motion.div>
        </div>
      </motion.section>

      {/* ----------------- NEW SECTION 2: COMPLIANCE GUARANTEE ----------------- */}
      <motion.section 
        initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer}
        className="px-6 py-32 border-t border-white/[0.05]"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-white mb-6">
              Engineered for UK Governance. Built on Safe AI Standards.
            </h2>
            <p className="text-lg font-medium text-slate-300 max-w-3xl mx-auto">
              Motus designs and deploys the framework aligning perfectly with strict data residency and UK privacy guidance for AI.
            </p>
          </motion.div>

          <motion.div variants={staggerContainer} className="grid md:grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
            {[
              {
                title: "UK Data Residency",
                desc: "Your business data stays in UK-based infrastructure."
              },
              {
                title: "ICO-Aware Builds",
                desc: "We design automations that align with UK privacy guidance."
              },
              {
                title: "Audit-Ready",
                desc: "Every workflow includes a plain-English map of how your data moves."
              }
            ].map((feature, i) => (
              <motion.div variants={fadeInUp} key={i}>
                <motion.div 
                  className="bg-white/[0.02] backdrop-blur-md border border-white/[0.05] p-8 rounded-3xl flex flex-col shadow-lg transition-all hover:bg-white/[0.04] h-full"
                  style={{ backgroundImage: 'radial-gradient(circle at 0% 100%, rgba(16,185,129,0.03) 0%, transparent 70%)' }}
                >
                  <CheckCircle2 className="w-8 h-8 text-emerald-500 mb-4" />
                  <h3 className="text-lg font-semibold tracking-tight text-white mb-3 leading-tight">{feature.title}</h3>
                  <p className="text-slate-400 font-medium text-sm leading-relaxed">{feature.desc}</p>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div variants={fadeInUp} className="relative bg-emerald-950/20 backdrop-blur-md border border-emerald-500/30 p-8 md:p-10 rounded-3xl text-center max-w-4xl mx-auto overflow-hidden shadow-[0_0_30px_rgba(16,185,129,0.05)]">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-emerald-500 to-transparent" />
            <div className="flex flex-col md:flex-row items-center justify-center gap-6">
              <Shield className="w-12 h-12 text-emerald-500 shrink-0" />
              <p className="text-lg md:text-xl font-medium text-white text-left">
                <strong className="block text-emerald-400 mb-1">Compliance Guarantee:</strong>
                All Motus AI deployments operate under strict UK Data Residency and GDPR compliance as core components of The Framework. Your Safe AI compliance obligations — clearly mapped.
              </p>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* ----------------- ADMIN DRAIN CALCULATOR ----------------- */}
      <motion.section 
        initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer}
        className="px-6 py-32 border-t border-white/[0.05]" id="cost-analysis"
      >
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-start">
          <motion.div variants={fadeInUp}>
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-orange-400 mb-6">
              <Calculator className="w-6 h-6" />
            </div>
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-white mb-6">Admin Drain Calculator</h2>
            <p className="text-lg font-medium text-slate-300 mb-8">
              Admin isn't free. Calculate exactly how much manual tasks are costing your business every year, including hidden overheads.
            </p>
            
            <div className="space-y-8 bg-white/[0.02] backdrop-blur-md border border-white/[0.05] p-8 rounded-3xl shadow-lg">
              <div>
                <div className="flex justify-between mb-3 text-xs font-bold uppercase tracking-widest text-slate-400">
                  <label>Number of staff</label>
                  <span className="text-white font-mono text-lg">{teamSize}</span>
                </div>
                <input 
                  type="range" 
                  min="1" max="50" 
                  value={teamSize} 
                  onChange={(e) => setTeamSize(Number(e.target.value))}
                  className="w-full accent-orange-500"
                />
              </div>

              <div>
                <div className="flex justify-between mb-3 text-xs font-bold uppercase tracking-widest text-slate-400">
                  <label>% of time spent on manual tasks</label>
                  <span className="text-white font-mono text-lg">{manualTimePct}%</span>
                </div>
                <input 
                  type="range" 
                  min="5" max="80" 
                  value={manualTimePct} 
                  onChange={(e) => setManualTimePct(Number(e.target.value))}
                  className="w-full accent-orange-500"
                />
              </div>

              <div>
                <div className="flex justify-between mb-3 text-xs font-bold uppercase tracking-widest text-slate-400">
                  <label>Average hourly cost (£)</label>
                  <span className="text-white font-mono text-lg">£{hourlyRate}</span>
                </div>
                <input 
                  type="range" 
                  min="10" max="60" 
                  value={hourlyRate} 
                  onChange={(e) => setHourlyRate(Number(e.target.value))}
                  className="w-full accent-orange-500"
                />
              </div>

              <div className="mt-8 pt-6 border-t border-white/[0.05] space-y-1">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-4">Include UK Overheads</p>
                <Toggle label="Employer NI (13.8%)" value={includeNI} onChange={setIncludeNI} />
                <Toggle label="Pension (3%)" value={includePension} onChange={setIncludePension} />
                <Toggle label="Statutory Holiday (12.07%)" value={includeHoliday} onChange={setIncludeHoliday} />
                <Toggle label="Average Sick Pay (5.7 days/yr)" value={includeSickPay} onChange={setIncludeSickPay} />
              </div>
            </div>
          </motion.div>

          <motion.div variants={fadeInUp} className="bg-white/[0.02] backdrop-blur-md border border-white/[0.05] p-10 md:p-12 rounded-3xl shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-orange-600/10 blur-[120px] rounded-full pointer-events-none" />
            
            <div className="grid gap-6 relative z-10">
              <div className="bg-black/40 p-8 rounded-3xl border border-orange-500/20 shadow-[0_0_30px_rgba(249,115,22,0.05)] text-center backdrop-blur-md">
                <span className="block text-xs font-bold tracking-widest uppercase text-orange-400 mb-2">Total Annual Cost Bleed</span>
                <span className="text-5xl md:text-6xl font-black text-white tracking-tight">£{stats.annualBleed.toLocaleString()}</span>
                <span className="block text-xs text-slate-500 mt-2 font-medium">True Cost Including Overheads</span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-black/40 border border-white/[0.05] p-6 rounded-3xl backdrop-blur-md">
                  <span className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Base Wages / Yr</span>
                  <span className="text-2xl font-bold tracking-tight text-white">£{stats.annualValue.toLocaleString()}</span>
                </div>
                <div className="bg-black/40 border border-white/[0.05] p-6 rounded-3xl backdrop-blur-md">
                  <span className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Wasted Hours / Yr</span>
                  <span className="text-2xl font-bold tracking-tight text-white">{stats.hoursFreedYear.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* ----------------- CAPACITY UNLOCK CALCULATOR ----------------- */}
      <motion.section 
        initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer}
        className="px-6 py-32 border-t border-white/[0.05]" id="capacity-unlock"
      >
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-start">
          <motion.div variants={fadeInUp}>
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 mb-6">
              <Zap className="w-6 h-6" />
            </div>
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-white mb-6">Capacity Unlock Calculator</h2>
            <p className="text-lg font-medium text-slate-300 mb-8">
              Calculate the potential impact of automation on your workforce efficiency.
            </p>
            
            <div className="space-y-8 bg-white/[0.02] backdrop-blur-md border border-white/[0.05] p-8 rounded-3xl shadow-lg" style={{ backgroundImage: 'radial-gradient(circle at 100% 100%, rgba(139, 92, 246, 0.05) 0%, transparent 60%)' }}>
              <div>
                <div className="flex justify-between mb-3 text-xs font-bold uppercase tracking-widest text-slate-400">
                  <label>Number of staff</label>
                  <span className="text-cyan-400 font-mono text-lg">{teamSize}</span>
                </div>
                <input 
                  type="range" 
                  min="1" max="50" 
                  value={teamSize} 
                  onChange={(e) => setTeamSize(Number(e.target.value))}
                  className="w-full accent-indigo-500"
                />
              </div>

              <div>
                <div className="flex justify-between mb-3 text-xs font-bold uppercase tracking-widest text-slate-400">
                  <label>% of time spent on manual tasks</label>
                  <span className="text-cyan-400 font-mono text-lg">{manualTimePct}%</span>
                </div>
                <input 
                  type="range" 
                  min="5" max="80" 
                  value={manualTimePct} 
                  onChange={(e) => setManualTimePct(Number(e.target.value))}
                  className="w-full accent-indigo-500"
                />
              </div>

              <div>
                <div className="flex justify-between mb-3 text-xs font-bold uppercase tracking-widest text-slate-400">
                  <label>Average hourly cost (£)</label>
                  <span className="text-cyan-400 font-mono text-lg">£{hourlyRate}</span>
                </div>
                <input 
                  type="range" 
                  min="10" max="60" 
                  value={hourlyRate} 
                  onChange={(e) => setHourlyRate(Number(e.target.value))}
                  className="w-full accent-indigo-500"
                />
              </div>

              <div className="mt-8 pt-6 border-t border-white/[0.05] space-y-1">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-4">Reallocation Impact</p>
                <Toggle 
                  label="High-Value Redirect (1.5x)" 
                  value={includeRedirectBonus} 
                  onChange={setIncludeRedirectBonus} 
                />
                <Toggle 
                  label="Error Reduction Savings (+5%)" 
                  value={includeErrorSavings} 
                  onChange={setIncludeErrorSavings} 
                />
                
                <div className="mt-4 p-4 bg-indigo-500/5 rounded-xl border border-indigo-500/10 space-y-2">
                  <p className="text-sm text-slate-400 leading-relaxed">
                    <strong className="text-indigo-400">High-Value Redirect:</strong> Assumes freed staff focus on specialized, high-margin client work instead of basic data entry (estimated 1.5x multiplier).
                  </p>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    <strong className="text-indigo-400">Error Reduction:</strong> Accounts for the elimination of human data-entry errors and the associated rework costs (estimated 5% savings).
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div variants={fadeInUp} className="bg-[#0A0A0B] backdrop-blur-md border border-white/[0.05] p-10 md:p-12 rounded-3xl shadow-xl relative overflow-hidden" style={{ backgroundImage: 'radial-gradient(circle at 100% 0%, rgba(139, 92, 246, 0.08) 0%, transparent 60%)' }}>
            <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none" />
            
            <div className="grid gap-6 relative z-10">
              
              <div className="bg-black/40 p-8 rounded-3xl border border-indigo-500/20 shadow-[0_0_30px_rgba(139,92,246,0.05)] text-center backdrop-blur-md">
                <span className="block text-xs font-bold tracking-widest uppercase text-indigo-400 mb-2">Annual Strategic Value</span>
                <span className="text-5xl md:text-6xl font-black bg-gradient-to-r from-white to-cyan-400 bg-clip-text text-transparent tracking-tight">£{stats.strategicValue.toLocaleString()}</span>
                <span className="block text-xs text-slate-500 mt-2 font-medium">Unlocked Resource Value</span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-black/40 border border-white/[0.05] p-6 rounded-3xl backdrop-blur-md">
                  <span className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Hours Freed / Wk</span>
                  <span className="text-3xl font-bold tracking-tight text-white">{stats.hoursFreedWeek.toLocaleString()}</span>
                </div>
                <div className="bg-black/40 border border-white/[0.05] p-6 rounded-3xl backdrop-blur-md">
                  <span className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Annual Hours Freed</span>
                  <span className="text-3xl font-bold tracking-tight text-white">{stats.hoursFreedYear.toLocaleString()}</span>
                </div>
              </div>

              <div className="bg-indigo-950/20 backdrop-blur-md border border-indigo-500/20 p-8 rounded-3xl text-center">
                  <span className="block text-xs font-bold uppercase tracking-wider text-indigo-400 mb-2">Equivalent Headcount Gained</span>
                  <span className="text-5xl font-black text-white tracking-tight">{stats.headcountGained}</span>
                  <span className="block text-xs text-indigo-500/60 mt-2">New Operational Capacity</span>
              </div>

              <div className="text-center pt-4 border-t border-white/5">
                <p className="text-sm text-slate-500 italic">
                  Without hiring anyone. Without NI, pension, or desk costs.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* ----------------- BOOKING FORM ----------------- */}
      <motion.section 
        initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer}
        className="px-6 py-32 border-t border-white/[0.05]" id="audit-form"
      >
        <div className="max-w-3xl mx-auto">
          <motion.div variants={fadeInUp} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-white mb-4">It's time to fix the leaks.</h2>
            <p className="text-lg font-medium text-slate-300">
              Book a free 15-minute tech audit to see if your processes can be automated.
            </p>
          </motion.div>

          <motion.div variants={fadeInUp} className="bg-white/[0.02] backdrop-blur-md border border-white/[0.05] p-8 md:p-10 rounded-3xl shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/5 blur-[120px] rounded-full pointer-events-none" />
            
            {formStatus === 'success' ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-12 text-center relative z-10"
              >
                <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-400">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-semibold text-white mb-3">Audit Requested</h3>
                <p className="text-slate-400 font-medium mb-8 max-w-sm mx-auto">
                  We've received your details. One of our engineers will be in touch within 24 hours to schedule your tech audit.
                </p>
                <button 
                  onClick={() => setFormStatus('idle')}
                  className="text-blue-400 font-semibold hover:text-blue-300 transition-colors"
                >
                  Need to send another?
                </button>
              </motion.div>
            ) : (
              <form name="audit_form" className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10" onSubmit={handleFormSubmit}>
                <div className="space-y-2 relative z-10">
                  <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                    <User className="w-4 h-4" /> Full Name
                  </label>
                  <input required name="full_name" type="text" className="w-full bg-black/40 backdrop-blur-md border border-white/[0.05] rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-blue-500 focus:bg-blue-950/20 transition-all font-medium" placeholder="Jane Doe" />
                </div>
                <div className="space-y-2 relative z-10">
                  <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                    <Briefcase className="w-4 h-4" /> Company Name
                  </label>
                  <input required name="company_name" type="text" className="w-full bg-black/40 backdrop-blur-md border border-white/[0.05] rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-blue-500 focus:bg-blue-950/20 transition-all font-medium" placeholder="Your Business Ltd" />
                </div>
                <div className="space-y-2 relative z-10">
                  <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                    <Mail className="w-4 h-4" /> Email Address
                  </label>
                  <input required name="email" type="email" className="w-full bg-black/40 backdrop-blur-md border border-white/[0.05] rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-blue-500 focus:bg-blue-950/20 transition-all font-medium" placeholder="jane@example.co.uk" />
                </div>
                <div className="space-y-2 relative z-10">
                  <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                    <Phone className="w-4 h-4" /> Phone Number
                  </label>
                  <input required name="phone" type="tel" className="w-full bg-black/40 backdrop-blur-md border border-white/[0.05] rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-blue-500 focus:bg-blue-950/20 transition-all font-medium" placeholder="07123 456 789" />
                </div>
                <div className="space-y-2 md:col-span-2 relative z-10">
                  <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" /> Headache?
                  </label>
                  <textarea name="headache" rows={4} className="w-full bg-black/40 backdrop-blur-md border border-white/[0.05] rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-blue-500 focus:bg-blue-950/20 transition-all resize-none font-medium" placeholder="What's the one process that drains your team's time?" />
                </div>
                <div className="md:col-span-2 pt-4 border-t border-white/5 flex flex-col items-center gap-4">
                  <button 
                    disabled={formStatus === 'sending'}
                    className="relative z-10 w-full py-4 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 disabled:cursor-not-allowed text-white rounded-full font-semibold tracking-wide flex justify-center items-center gap-2 transition-transform shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_30px_rgba(37,99,235,0.6)]"
                  >
                    {formStatus === 'sending' ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" /> Sending...
                      </>
                    ) : (
                      <>
                        <Calendar className="w-5 h-5" /> Request Free Tech Audit
                      </>
                    )}
                  </button>
                  <p className="text-xs text-slate-500 font-medium tracking-wide">
                    Prefer to book directly? <a href="#" onClick={(e) => {e.preventDefault(); alert('Please add your Calendly link here');}} className="text-blue-400 hover:underline">Schedule via Calendly</a>
                  </p>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      </motion.section>

      {/* ----------------- FOOTER ----------------- */}
      <footer className="border-t border-white/[0.05] py-12 text-center text-slate-500 text-sm">
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center">
          <div className="flex items-center gap-2 mb-6">
            <span className="font-bold text-white uppercase tracking-widest text-lg">MOTUS AI</span>
          </div>
          <div className="flex items-center justify-center gap-4 mb-6 font-medium">
            <span className="flex items-center gap-1.5"><Shield className="w-4 h-4 text-emerald-500" /> ICO Registered</span>
            <span className="w-1 h-1 rounded-full bg-white/20"></span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> GDPR Compliant</span>
          </div>
          <div className="flex items-center justify-center gap-6 mb-8 mt-2">
            <button className="hover:text-white transition-colors cursor-pointer font-medium">Privacy Policy</button>
            <button className="hover:text-white transition-colors cursor-pointer font-medium">Terms of Service</button>
            <button onClick={() => handleScroll('audit-form')} className="hover:text-white transition-colors cursor-pointer font-medium">Contact</button>
          </div>
          <p className="font-medium text-slate-600">© {new Date().getFullYear()} Motus AI Systems. All rights reserved. Self-hosted in the UK.</p>
        </div>
      </footer>
    </div>
  );
}
