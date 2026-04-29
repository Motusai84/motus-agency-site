import React, { useState, useMemo, FormEvent } from 'react';
import { motion } from 'framer-motion';
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
    
    // SAFETY GUARD: Prevents double-submissions
    if (formStatus !== 'idle') return;

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
        // SUCCESS: Immediately switch UI to success mode
        setFormStatus('success');
        e.currentTarget.reset();
      } else {
        setFormStatus('idle');
        alert("Server Error. Please check n8n status.");
      }
    } catch (error) {
      setFormStatus('idle');
      alert("Connection Error. Please check your internet.");
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
    const weeklyHoursPerStaff = 40; 
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

    let strategicValue = baseWagesYear;
    if (includeRedirectBonus) strategicValue *= 1.5; 
    if (includeErrorSavings) strategicValue += (baseWagesYear * 0.05); 

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
      
      {/* HERO SECTION */}
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

      {/* THE BARRIER */}
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

      {/* KEY BENEFITS */}
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

      {/* INTERACTIVE VISUALIZER */}
      <motion.section 
        initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer}
        className="relative px-4 py-8 md:py-12 border-t border-white/[0.05] overflow-hidden bg-[#000000] flex flex-col justify-center min-h-screen" id="how-it-works"
      >
        <div className="absolute inset-0 pointer-events-none opacity-[0.2]" style={{ backgroundImage: `radial-gradient(circle at center, rgba(255,255,255,0.8) 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />

        {isAutomated && (
          <motion.div 
            className="absolute inset-0 bg-emerald-500/10 mix-blend-screen pointer-events-none z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.5, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 5, ease: "easeOut" }}
          />
        )}

        <div className="max-w-[1600px] w-full mx-auto text-center relative z-20 flex flex-col flex-1 h-full items-center justify-center pb-4">
          <motion.h2 variants={fadeInUp} className="text-2xl md:text-4xl font-semibold tracking-tight text-white mb-6">Watch The System Connect</motion.h2>
          
          <motion.div variants={fadeInUp} className="flex flex-wrap justify-center gap-2 mb-8">
            {SECTOR_WORKFLOWS.map((sector, i) => (
              <button
                key={sector.name}
                onClick={() => { setActiveSector(i); setIsAutomated(false); }}
                className={`px-4 py-1.5 md:py-2 md:px-5 rounded-full text-xs md:text-sm font-medium transition-all border ${
                  activeSector === i 
                  ? 'bg-blue-600 border-blue-500 text-white shadow-lg' 
                  : 'bg-[#0A0A0A] border-white/10 text-slate-400 hover:text-white'
                }`}
              >
                {sector.name}
              </button>
            ))}
          </motion.div>

          {/* Visualization Logic continues... */}
          <motion.div 
             variants={fadeInUp} 
             animate={isAutomated ? { x: [-1, 1, 0] } : {}}
             className="w-full max-w-[1228px] mx-auto bg-black border border-white/5 rounded-3xl relative flex flex-col overflow-hidden min-h-[600px]"
          >
             <div className="flex flex-col relative z-10 flex-grow p-4 md:px-8 items-center justify-center w-full">
                {/* Visual steps mapped from activeSector */}
                <div className="w-full max-w-4xl mx-auto flex flex-col justify-center space-y-4">
                   {SECTOR_WORKFLOWS[activeSector].auto.map((node, idx) => (
                     <div key={idx} className="flex items-center justify-between bg-white/[0.02] p-4 rounded-xl border border-white/[0.05]">
                        <div className="flex items-center gap-4">
                           <div className={`p-2 rounded-lg ${isAutomated ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/5 text-slate-500'}`}>
                              <node.icon className="w-5 h-5" />
                           </div>
                           <span className={isAutomated ? 'text-white' : 'text-slate-500'}>{node.title}</span>
                        </div>
                        {isAutomated && <CheckCircle className="w-5 h-5 text-emerald-500" />}
                     </div>
                   ))}
                </div>
             </div>
             <div className="p-6 border-t border-white/5">
                <button 
                  onClick={() => setIsAutomated(!isAutomated)}
                  className={`px-10 py-3 rounded-full font-bold uppercase tracking-widest transition-all ${!isAutomated ? 'bg-[#D4AF37] text-black' : 'bg-emerald-500 text-white'}`}
                >
                  {!isAutomated ? "Initialize Engine" : "System Operational"}
                </button>
             </div>
          </motion.div>
        </div>
      </motion.section>

      {/* OUR PROCESS */}
      <motion.section 
        initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer}
        className="px-6 py-32 border-t border-white/[0.05] relative"
      >
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <span className="px-4 py-1.5 rounded-full border border-white/[0.05] bg-[#0A0A0A] text-slate-300 text-xs font-bold uppercase tracking-widest mb-6">Our Process</span>
            <h2 className="text-3xl md:text-5xl font-semibold text-white mb-6 tracking-tight">Our Process</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             {/* Process cards logic remains same */}
             <div className="p-8 bg-white/[0.02] border border-white/[0.05] rounded-3xl">
                <span className="text-emerald-500 font-bold">Step 01</span>
                <h3 className="text-xl font-bold mt-2">Architectural Analysis</h3>
                <p className="text-slate-400 mt-4">We map your manual blocks and identify high-leverage AI deployment points.</p>
             </div>
             <div className="p-8 bg-white/[0.02] border border-white/[0.05] rounded-3xl">
                <span className="text-blue-500 font-bold">Step 02</span>
                <h3 className="text-xl font-bold mt-2">AI Configuration</h3>
                <p className="text-slate-400 mt-4">We build the autonomous logic and stress-test the agents.</p>
             </div>
          </div>
        </div>
      </motion.section>

      {/* CALCULATORS */}
      <motion.section 
        initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer}
        className="px-6 py-32 border-t border-white/[0.05]" id="cost-analysis"
      >
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16">
           <div className="bg-white/[0.02] p-10 rounded-3xl border border-white/[0.05]">
              <h3 className="text-2xl font-bold mb-6">Annual Cost Bleed</h3>
              <span className="text-6xl font-black text-white">£{stats.annualBleed.toLocaleString()}</span>
              <p className="text-slate-500 mt-4">Wasted on manual administration overheads.</p>
              <div className="mt-8 space-y-4">
                 <input type="range" min="1" max="50" value={teamSize} onChange={(e) => setTeamSize(Number(e.target.value))} className="w-full" />
                 <div className="flex justify-between text-sm text-slate-400">
                    <span>Staff: {teamSize}</span>
                    <span>Rate: £{hourlyRate}/hr</span>
                 </div>
              </div>
           </div>
           <div className="bg-indigo-900/10 p-10 rounded-3xl border border-indigo-500/20">
              <h3 className="text-2xl font-bold mb-6">Capacity Gained</h3>
              <span className="text-6xl font-black text-indigo-400">{stats.headcountGained} FTE</span>
              <p className="text-slate-400 mt-4">Equivalent headcount unlocked via automation.</p>
           </div>
        </div>
      </motion.section>

      {/* BOOKING FORM */}
      <motion.section 
        initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer}
        className="px-6 py-32 border-t border-white/[0.05]" id="audit-form"
      >
        <div className="max-w-3xl mx-auto">
          <motion.div variants={fadeInUp} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-white mb-4">It's time to fix the leaks.</h2>
          </motion.div>

          <motion.div variants={fadeInUp} className="bg-white/[0.02] backdrop-blur-md border border-white/[0.05] p-8 md:p-10 rounded-3xl shadow-xl relative overflow-hidden">
            {formStatus === 'success' ? (
              <div className="py-12 text-center">
                <CheckCircle className="w-16 h-16 text-emerald-400 mx-auto mb-6" />
                <h3 className="text-2xl font-semibold text-white mb-3">Audit Requested</h3>
                <p className="text-slate-400 mb-8">We've received your details. Our engineers will be in touch within 24 hours.</p>
                <button onClick={() => setFormStatus('idle')} className="text-blue-400 font-semibold">Send another?</button>
              </div>
            ) : (
              <form name="audit_form" className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleFormSubmit}>
                <input required name="full_name" type="text" className="w-full bg-black/40 border border-white/[0.05] rounded-2xl px-5 py-4 text-white" placeholder="Full Name" />
                <input required name="company_name" type="text" className="w-full bg-black/40 border border-white/[0.05] rounded-2xl px-5 py-4 text-white" placeholder="Company Name" />
                <input required name="email" type="email" className="w-full bg-black/40 border border-white/[0.05] rounded-2xl px-5 py-4 text-white" placeholder="Email Address" />
                <input required name="phone" type="tel" className="w-full bg-black/40 border border-white/[0.05] rounded-2xl px-5 py-4 text-white" placeholder="Phone Number" />
                <textarea name="headache" rows={4} className="md:col-span-2 w-full bg-black/40 border border-white/[0.05] rounded-2xl px-5 py-4 text-white" placeholder="What's the one process that drains your team's time?" />
                <button 
                  disabled={formStatus === 'sending'}
                  className="md:col-span-2 w-full py-4 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white rounded-full font-semibold transition-all flex justify-center items-center gap-2"
                >
                  {formStatus === 'sending' ? <Loader2 className="animate-spin" /> : <Calendar className="w-5 h-5" />}
                  {formStatus === 'sending' ? "Sending..." : "Request Free Tech Audit"}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </motion.section>

      {/* FOOTER */}
      <footer className="border-t border-white/[0.05] py-12 text-center text-slate-500 text-sm">
        <div className="max-w-7xl mx-auto px-6">
          <span className="font-bold text-white uppercase tracking-widest text-lg">MOTUS AI</span>
          <p className="mt-4">© {new Date().getFullYear()} Motus AI Systems. Self-hosted in the UK.</p>
        </div>
      </footer>
    </div>
  );
}
