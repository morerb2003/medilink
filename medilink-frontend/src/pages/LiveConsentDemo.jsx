import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Stethoscope, 
  User, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Bell, 
  ShieldCheck, 
  ArrowRight, 
  AlertCircle,
  FileText,
  RotateCcw,
  ShieldAlert,
  QrCode,
  Activity,
  HeartPulse,
  Zap,
  Phone,
  Droplets,
  Microscope,
  Search
} from 'lucide-react';
import GlassBox from '../components/common/GlassBox';
import Button from '../components/common/Button';

const SCENARIOS = {
  RAMESH: 'RAMESH',
  PRIYA: 'PRIYA'
};

const STEPS = {
  START: 0,
  ACTION: 1,
  RESULT: 2,
  IMPACT: 3
};

function LiveConsentDemo() {
  const [scenario, setScenario] = useState(SCENARIOS.RAMESH);
  const [step, setStep] = useState(STEPS.START);
  const [selectedDuration, setSelectedDuration] = useState(24);
  const [accessMethod, setAccessMethod] = useState('ABHA'); // For Priya

  const reset = () => {
    setStep(STEPS.START);
    setSelectedDuration(24);
  };

  const switchScenario = (s) => {
    setScenario(s);
    reset();
  };

  return (
    <div className="min-h-screen bg-medilink-canvas py-20 px-8">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Scenario Switcher */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-medilink-border/30 pb-10">
          <div className="space-y-2">
            <h1 className="text-4xl font-display font-black text-medilink-ink tracking-tight">
              Clinical <span className="text-gradient">Simulations</span>
            </h1>
            <p className="text-medilink-muted font-medium opacity-70 uppercase tracking-[0.2em] text-[10px]">
              Select a real-world journey to explore the logic
            </p>
          </div>
          
          <div className="inline-flex rounded-2xl border border-medilink-border bg-white p-1.5 shadow-sm">
            {[
              { id: SCENARIOS.RAMESH, label: 'Standard Consent (Ramesh)', icon: User },
              { id: SCENARIOS.PRIYA, label: 'Emergency Override (Priya)', icon: ShieldAlert }
            ].map((s) => (
              <button
                key={s.id}
                onClick={() => switchScenario(s.id)}
                className={`flex items-center gap-3 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                  scenario === s.id 
                    ? 'bg-medilink-mint text-white shadow-lg shadow-medilink-mint/20' 
                    : 'text-medilink-muted hover:text-medilink-ink'
                }`}
              >
                <s.icon className="w-4 h-4" />
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Demo Stage */}
        <div className="relative min-h-[700px]">
          <AnimatePresence mode="wait">
            {/* STEP 0: THE REQUEST / SETUP */}
            {step === STEPS.START && (
              <motion.div
                key={`${scenario}-start`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid lg:grid-cols-[1fr_400px] gap-10 items-start"
              >
                <div className="space-y-8">
                  <div className="flex items-center gap-5">
                    <div className={`w-16 h-16 rounded-[2rem] flex items-center justify-center ${scenario === SCENARIOS.RAMESH ? 'bg-medilink-mint/10' : 'bg-medilink-coral/10'}`}>
                      <Stethoscope className={`w-8 h-8 ${scenario === SCENARIOS.RAMESH ? 'text-medilink-mint' : 'text-medilink-coral'}`} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-medilink-ink tracking-tight">
                        {scenario === SCENARIOS.RAMESH ? 'Dr. Anjali Mehta' : 'Dr. Rajesh James'}
                      </h3>
                      <p className="text-[10px] font-black text-medilink-muted uppercase tracking-[0.2em]">
                        {scenario === SCENARIOS.RAMESH ? 'Cardiologist · Fortis Nagpur' : 'Emergency Medicine · Kokilaben Hospital Mumbai'}
                      </p>
                    </div>
                  </div>

                  <GlassBox className={`!p-10 space-y-8 border-opacity-20 ${scenario === SCENARIOS.RAMESH ? 'border-medilink-mint' : 'border-medilink-coral'}`}>
                    <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase tracking-widest text-medilink-muted opacity-60">Clinical Justification (Mandatory)</label>
                      <div className={`p-6 rounded-3xl text-sm font-medium leading-relaxed italic ${scenario === SCENARIOS.RAMESH ? 'bg-medilink-mint/5 text-medilink-mint' : 'bg-medilink-coral/5 text-medilink-coral'}`}>
                        {scenario === SCENARIOS.RAMESH 
                          ? '"Patient presenting with chest pain. Need to review existing diabetes medications and any prior cardiac history before prescribing."'
                          : '"Patient unconscious after road accident on Western Express Highway. Checking allergies and blood group before emergency surgery."'
                        }
                      </div>
                    </div>

                    {scenario === SCENARIOS.PRIYA && (
                      <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-widest text-medilink-muted opacity-60">Access Mode</label>
                        <div className="grid grid-cols-2 gap-4">
                          {[
                            { id: 'ABHA', label: 'ABHA Health ID', icon: Search },
                            { id: 'QR', label: 'Optical QR Scan', icon: QrCode }
                          ].map(m => (
                            <button 
                              key={m.id}
                              onClick={() => setAccessMethod(m.id)}
                              className={`flex items-center justify-center gap-3 p-4 rounded-2xl border-2 transition-all ${
                                accessMethod === m.id 
                                  ? 'border-medilink-coral bg-medilink-coral/5 text-medilink-coral shadow-lg' 
                                  : 'border-medilink-border text-medilink-muted'
                              }`}
                            >
                              {m.id === 'ABHA' ? <User className="w-4 h-4" /> : <QrCode className="w-4 h-4" />}
                              <span className="text-[10px] font-black uppercase tracking-widest">{m.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    <Button 
                      className={`w-full h-16 premium-button !rounded-2xl shadow-xl ${scenario === SCENARIOS.RAMESH ? 'shadow-medilink-mint/20' : 'shadow-medilink-coral/20 !bg-medilink-coral hover:!bg-medilink-coral/90'}`}
                      onClick={() => setStep(STEPS.ACTION)}
                    >
                      <span>{scenario === SCENARIOS.RAMESH ? 'Send Access Request' : 'Inject Critical Override'}</span>
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </GlassBox>
                </div>

                <div className="space-y-6">
                  <div className="p-8 bg-white border border-medilink-border rounded-[2.5rem] space-y-6">
                    <p className="text-[10px] font-black uppercase tracking-widest text-medilink-muted">Simulation Logic</p>
                    <div className="space-y-4">
                      <div className="flex gap-4">
                        <div className="w-8 h-8 rounded-full bg-medilink-canvas flex items-center justify-center text-[10px] font-black">1</div>
                        <p className="text-xs text-medilink-ink font-medium leading-relaxed">
                          {scenario === SCENARIOS.RAMESH 
                            ? 'Request is sent to patient device and listed in their "Consent Inbox".'
                            : 'System verifies Doctor License and Hospital verification status before bypass.'
                          }
                        </p>
                      </div>
                      <div className="flex gap-4">
                        <div className="w-8 h-8 rounded-full bg-medilink-canvas flex items-center justify-center text-[10px] font-black">2</div>
                        <p className="text-xs text-medilink-ink font-medium leading-relaxed">
                          {scenario === SCENARIOS.RAMESH 
                            ? 'Patient chooses duration. Backend signs a temporary access token.'
                            : 'IP address, location, and reason are logged for immediate patient family alert.'
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 1: THE ACTION (PHONE NOTIF / QR SCAN) */}
            {step === STEPS.ACTION && (
              <motion.div
                key={`${scenario}-action`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                className="flex flex-col items-center justify-center gap-10"
              >
                {scenario === SCENARIOS.RAMESH ? (
                  /* RAMESH PHONE VIEW */
                  <div className="w-full max-w-sm bg-medilink-ink rounded-[3.5rem] p-8 shadow-2xl border-[10px] border-medilink-border relative overflow-hidden ring-1 ring-white/10">
                    <div className="absolute top-2 left-1/2 -translate-x-1/2 w-20 h-6 bg-medilink-border rounded-full" />
                    <div className="mt-12 space-y-8">
                      <div className="bg-white/10 backdrop-blur-xl p-5 rounded-[2rem] border border-white/20 animate-bounce">
                        <div className="flex gap-3">
                          <Bell className="text-medilink-mint w-5 h-5 flex-shrink-0" />
                          <div>
                            <p className="text-white text-[10px] font-black uppercase tracking-[0.2em]">Consent Request</p>
                            <p className="text-white/60 text-[9px]">Dr. Mehta · Fortis Nagpur</p>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <h2 className="text-white text-2xl font-black tracking-tight">Ramesh's Device</h2>
                        <p className="text-white/70 text-sm leading-relaxed">
                          Grant access to <span className="text-white font-bold tracking-tight">Dr. Anjali Mehta</span>?
                        </p>
                        <div className="p-4 bg-white/5 rounded-2xl border border-white/10 text-white/50 text-[11px] italic">
                          "Need to review existing diabetes medications..."
                        </div>
                      </div>
                      <div className="space-y-3">
                        <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.3em]">Validity Window</p>
                        <div className="grid grid-cols-2 gap-2">
                          {[{l:'2 Hours',v:2}, {l:'1 Day',v:24}, {l:'7 Days',v:168}, {l:'Forever',v:0}].map(d => (
                            <button 
                              key={d.v}
                              onClick={() => setSelectedDuration(d.v)}
                              className={`py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${selectedDuration === d.v ? 'bg-medilink-mint text-white border-medilink-mint shadow-lg shadow-medilink-mint/20' : 'text-white/60 border-white/10 hover:border-white/30'}`}
                            >
                              {d.l}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-3 pt-6 pb-4">
                        <button 
                          onClick={() => setStep(STEPS.RESULT)}
                          className="flex-1 bg-medilink-mint text-white py-5 rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-medilink-mint/30 active:scale-95 transition-transform"
                        >
                          ✓ Authorize
                        </button>
                        <button className="px-6 bg-white/5 text-white/30 rounded-[1.5rem] border border-white/5">
                          <XCircle className="w-6 h-6" />
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* PRIYA ACTION VIEW (SCAN / INJECT) */
                  <div className="w-full max-w-2xl space-y-10">
                    <div className="text-center space-y-4">
                      <Zap className="w-12 h-12 text-medilink-coral mx-auto animate-pulse" />
                      <h2 className="text-3xl font-display font-black text-medilink-ink">
                        {accessMethod === 'ABHA' ? 'Validating Health Identity' : 'Verifying Signed Token'}
                      </h2>
                      <p className="text-medilink-muted font-medium">Bypassing standard consent for life-critical surgery.</p>
                    </div>

                    <div className="p-10 bg-medilink-ink rounded-[3rem] shadow-2xl relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-tr from-medilink-coral/10 via-transparent to-transparent" />
                      
                      {accessMethod === 'ABHA' ? (
                        <div className="space-y-8 relative z-10">
                          <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">Patient ABHA Number</label>
                            <div className="text-white text-4xl font-mono font-black tracking-[0.2em] flex justify-center py-6 border-b border-white/10">
                              23 4567 8901 2345
                            </div>
                          </div>
                          <div className="flex flex-col items-center gap-6">
                            <div className="flex items-center gap-3 text-emerald-400 font-bold text-xs">
                              <CheckCircle2 className="w-5 h-5" />
                              <span>Patient "Priya Sharma" Identified</span>
                            </div>
                            <Button 
                              onClick={() => setStep(STEPS.RESULT)}
                              className="w-full h-16 !bg-medilink-coral text-white premium-button shadow-xl shadow-medilink-coral/30"
                            >
                              ⚡ Grant Emergency Access
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-8 relative z-10">
                          <div className="p-6 bg-white/5 border border-white/10 rounded-2xl font-mono text-[9px] text-white/40 break-all leading-relaxed">
                            eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyMzQ1Njc4OTAxMjM0NSIsInR5cGUiOiJFTUVSR0VOQ1lfUVIifQ.xK9uN8...
                          </div>
                          <div className="flex flex-col items-center gap-6">
                            <div className="flex items-center gap-3 text-emerald-400 font-bold text-xs uppercase tracking-widest">
                              <CheckCircle2 className="w-5 h-5" />
                              <span>JWT Signature Verified (HMAC-SHA256)</span>
                            </div>
                            <Button 
                              onClick={() => setStep(STEPS.RESULT)}
                              className="w-full h-16 !bg-medilink-coral text-white premium-button shadow-xl shadow-medilink-coral/30"
                            >
                              ⚡ Inject Emergency Token
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* STEP 2: THE RESULT (UNLOCKED SNAPSHOT) */}
            {step === STEPS.RESULT && (
              <motion.div
                key={`${scenario}-result`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-10"
              >
                <div className={`flex flex-col md:flex-row items-center justify-between p-8 rounded-[2.5rem] border ${scenario === SCENARIOS.RAMESH ? 'bg-emerald-50 border-emerald-200' : 'bg-medilink-coral/5 border-medilink-coral/20'}`}>
                  <div className="flex items-center gap-6">
                    <div className={`w-16 h-16 rounded-[2rem] flex items-center justify-center ${scenario === SCENARIOS.RAMESH ? 'bg-emerald-500 shadow-lg shadow-emerald-500/20' : 'bg-medilink-coral shadow-lg shadow-medilink-coral/20'}`}>
                      <ShieldCheck className="text-white w-8 h-8" />
                    </div>
                    <div>
                      <h3 className={`text-xl font-black uppercase tracking-tight ${scenario === SCENARIOS.RAMESH ? 'text-emerald-900' : 'text-medilink-coral'}`}>
                        {scenario === SCENARIOS.RAMESH ? 'Consultation Authorized' : 'Emergency Snapshot Active'}
                      </h3>
                      <p className={`${scenario === SCENARIOS.RAMESH ? 'text-emerald-600' : 'text-medilink-coral/70'} text-[10px] font-black uppercase tracking-widest`}>
                        {scenario === SCENARIOS.RAMESH ? 'Patient Approved Digital Key' : 'Break-Glass Bypass Successful'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right mt-6 md:mt-0">
                    <p className={`text-[10px] font-black uppercase tracking-widest ${scenario === SCENARIOS.RAMESH ? 'text-emerald-600' : 'text-medilink-coral/60'}`}>Session Expiry</p>
                    <p className={`text-2xl font-black ${scenario === SCENARIOS.RAMESH ? 'text-emerald-900' : 'text-medilink-coral'}`}>
                      {scenario === SCENARIOS.RAMESH ? (selectedDuration === 0 ? 'FOREVER' : `${selectedDuration}h`) : '30 MIN'}
                    </p>
                  </div>
                </div>

                <div className="grid lg:grid-cols-[350px_1fr] gap-10">
                  <div className="space-y-6">
                    <GlassBox className="!p-10 text-center space-y-6">
                      <div className={`w-28 h-28 rounded-[2.5rem] border-4 mx-auto flex items-center justify-center text-4xl font-black ${scenario === SCENARIOS.RAMESH ? 'border-medilink-mint text-medilink-ink' : 'border-medilink-coral text-medilink-coral'}`}>
                        {scenario === SCENARIOS.RAMESH ? 'RK' : 'PS'}
                      </div>
                      <div>
                        <h4 className="text-2xl font-black text-medilink-ink tracking-tight">{scenario === SCENARIOS.RAMESH ? 'Ramesh Kumar' : 'Priya Sharma'}</h4>
                        <p className="text-[10px] font-black uppercase tracking-widest text-medilink-muted">Health ID: {scenario === SCENARIOS.RAMESH ? 'ramesh.k' : '2345...2345'}</p>
                      </div>
                      
                      <div className="pt-6 border-t border-medilink-border/50 grid grid-cols-2 gap-4">
                        <div className="text-left">
                          <p className="text-[9px] font-black text-medilink-muted uppercase">Blood</p>
                          <p className="font-black text-medilink-ink">B+</p>
                        </div>
                        <div className="text-left">
                          <p className="text-[9px] font-black text-medilink-muted uppercase">Age</p>
                          <p className="font-black text-medilink-ink">{scenario === SCENARIOS.RAMESH ? '58' : '34'}</p>
                        </div>
                      </div>
                    </GlassBox>

                    {scenario === SCENARIOS.PRIYA && (
                      <div className="p-8 bg-amber-50 border border-amber-200 rounded-[2.5rem] space-y-4">
                        <div className="flex items-center gap-3">
                          <Phone className="w-5 h-5 text-amber-600" />
                          <p className="text-[10px] font-black text-amber-700 uppercase tracking-widest">Emergency Contact</p>
                        </div>
                        <div>
                          <p className="font-black text-amber-900">Vikram Sharma (Husband)</p>
                          <p className="text-xs font-bold text-amber-700">+91 98765 43210</p>
                        </div>
                        <div className="pt-2">
                          <span className="inline-block px-2 py-1 bg-emerald-100 text-emerald-700 text-[9px] font-black uppercase rounded-lg">SMS NOTIFIED</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-8">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.4em] text-medilink-muted mb-6">Encrypted Clinical View</p>
                      <div className="grid gap-4">
                        {scenario === SCENARIOS.RAMESH ? [
                          { type: 'LAB REPORT', title: 'HbA1c Test Result', source: 'Dr. Patil Clinic', date: '3m ago', icon: Microscope, col: 'mint' },
                          { type: 'PRESCRIPTION', title: 'Metformin 500mg', source: 'Nagpur GP', date: '3m ago', icon: Activity, col: 'mint' },
                          { type: 'DIAGNOSIS', title: 'Type 2 Diabetes', source: 'PHC Nagpur', date: '4m ago', icon: FileText, col: 'mint' }
                        ].map((rec, i) => (
                          <div key={i} className="p-6 bg-white border border-medilink-border rounded-3xl flex items-center gap-6 hover:shadow-xl transition-all">
                            <div className={`w-12 h-12 rounded-2xl bg-medilink-${rec.col}/10 flex items-center justify-center`}>
                              <rec.icon className={`w-6 h-6 text-medilink-${rec.col}`} />
                            </div>
                            <div className="flex-1">
                              <p className={`text-[9px] font-black text-medilink-${rec.col} uppercase tracking-widest`}>{rec.type}</p>
                              <h5 className="font-black text-medilink-ink">{rec.title}</h5>
                              <p className="text-xs text-medilink-muted font-medium">{rec.source}</p>
                            </div>
                            <p className="text-[10px] font-black text-medilink-muted opacity-40">{rec.date}</p>
                          </div>
                        )) : [
                          { type: 'ALLERGY', title: 'Penicillin & Sulfa', source: 'Known Allergy', date: 'Critical', icon: AlertCircle, col: 'coral' },
                          { type: 'MEDICATION', title: 'Warfarin 5mg Daily', source: 'Anticoagulant', date: 'Active', icon: Droplets, col: 'coral' },
                          { type: 'CONDITION', title: 'Hypothyroidism', source: 'Chronic Care', date: 'Current', icon: HeartPulse, col: 'coral' }
                        ].map((rec, i) => (
                          <div key={i} className="p-6 bg-white border border-medilink-border rounded-3xl flex items-center gap-6 border-l-8 border-l-medilink-coral">
                            <div className={`w-12 h-12 rounded-2xl bg-medilink-${rec.col}/10 flex items-center justify-center`}>
                              <rec.icon className={`w-6 h-6 text-medilink-${rec.col}`} />
                            </div>
                            <div className="flex-1">
                              <p className={`text-[9px] font-black text-medilink-${rec.col} uppercase tracking-widest`}>{rec.type}</p>
                              <h5 className="font-black text-medilink-ink">{rec.title}</h5>
                              <p className="text-xs text-medilink-muted font-medium">{rec.source}</p>
                            </div>
                            <div className="px-3 py-1 bg-medilink-coral/10 rounded-lg">
                              <p className="text-[9px] font-black text-medilink-coral uppercase">{rec.date}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Button 
                      className="w-full h-14" 
                      variant="secondary"
                      onClick={() => setStep(STEPS.IMPACT)}
                    >
                      View Clinical Impact
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 3: THE IMPACT (SUMMARY) */}
            {step === STEPS.IMPACT && (
              <motion.div
                key={`${scenario}-impact`}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-12 py-10"
              >
                <div className="text-center space-y-4">
                  <div className={`w-20 h-20 rounded-[2rem] mx-auto flex items-center justify-center ${scenario === SCENARIOS.RAMESH ? 'bg-medilink-mint/20' : 'bg-medilink-coral/20'}`}>
                    <Activity className={`w-10 h-10 ${scenario === SCENARIOS.RAMESH ? 'text-medilink-mint' : 'text-medilink-coral'}`} />
                  </div>
                  <h2 className="text-4xl font-display font-black text-medilink-ink tracking-tight">Outcome Summary</h2>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <GlassBox className="!p-10 space-y-6">
                    <h4 className="text-lg font-black text-medilink-ink flex items-center gap-3">
                      <Zap className="w-5 h-5 text-medilink-gold" />
                      Actions Taken
                    </h4>
                    <div className="space-y-4">
                      {(scenario === SCENARIOS.RAMESH 
                        ? [
                          'Metformin dosage adjusted based on current HbA1c (8.1%)',
                          'Duplicate blood tests cancelled, saving ₹3,500',
                          'Tele-consultation scheduled for 3 months'
                        ]
                        : [
                          'Switched from Amoxicillin to Cefazolin (Penicillin Allergy)',
                          'Ordered B+ blood for immediate transfusion',
                          'Administered Vitamin K to reverse Warfarin before surgery'
                        ]
                      ).map((point, i) => (
                        <div key={i} className="flex gap-4">
                          <div className={`w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-black ${scenario === SCENARIOS.RAMESH ? 'bg-medilink-mint text-white' : 'bg-medilink-coral text-white'}`}>✓</div>
                          <p className="text-sm text-medilink-ink font-medium leading-relaxed">{point}</p>
                        </div>
                      ))}
                    </div>
                  </GlassBox>

                  <GlassBox className="!p-10 space-y-6">
                    <h4 className="text-lg font-black text-medilink-ink flex items-center gap-3">
                      <ShieldCheck className="w-5 h-5 text-medilink-mint" />
                      Security Audit
                    </h4>
                    <div className="space-y-4 font-mono text-[11px] text-medilink-muted">
                      <p>EVENT_ID: {Math.random().toString(36).substring(7).toUpperCase()}</p>
                      <p>TIMESTAMP: {new Date().toISOString()}</p>
                      <p>DOCTOR: {scenario === SCENARIOS.RAMESH ? 'DR_MEHTA_ME_102' : 'DR_JAMES_ER_992'}</p>
                      <p>HOSPITAL: {scenario === SCENARIOS.RAMESH ? 'FORTIS_NAGPUR' : 'KOKILABEN_MUMBAI'}</p>
                      <p>REASON: {scenario === SCENARIOS.RAMESH ? 'DIABETES_RECONCILIATION' : 'HIGHWAY_TRAUMA_OVERRIDE'}</p>
                      <p className={`font-black ${scenario === SCENARIOS.RAMESH ? 'text-medilink-mint' : 'text-medilink-coral'}`}>STATUS: LOGGED_AND_NOTIFIED</p>
                    </div>
                  </GlassBox>
                </div>

                <div className="text-center">
                  <Button onClick={reset} className="premium-button !px-12">
                    <RotateCcw className="w-5 h-5 mr-3" />
                    Restart Simulation
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default LiveConsentDemo;
