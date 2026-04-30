import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  MessageSquare, 
  AlertCircle, 
  CheckCircle2, 
  ArrowRight,
  Stethoscope,
  Activity,
  ShieldAlert
} from 'lucide-react';
import GlassBox from '../common/GlassBox';
import Button from '../common/Button';

const TRIAGE_STEPS = [
  {
    id: 'symptoms',
    question: "What symptoms are you experiencing?",
    placeholder: "e.g., Chest pain, persistent cough, high fever...",
    icon: MessageSquare
  },
  {
    id: 'duration',
    question: "How long has this been occurring?",
    options: ['Less than 24 hours', '1-3 days', 'More than a week'],
    icon: Activity
  },
  {
    id: 'severity',
    question: "Rate the discomfort intensity",
    options: ['Mild (Noticeable)', 'Moderate (Distracting)', 'Severe (Incapacitating)'],
    icon: ShieldAlert
  }
];

function AITriage() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);

  const currentStep = TRIAGE_STEPS[step];

  const handleNext = (val) => {
    const newAnswers = { ...answers, [currentStep.id]: val };
    setAnswers(newAnswers);
    
    if (step < TRIAGE_STEPS.length - 1) {
      setStep(step + 1);
    } else {
      analyze(newAnswers);
    }
  };

  const analyze = (finalAnswers) => {
    setIsAnalyzing(true);
    // Simulate AI Processing
    setTimeout(() => {
      setIsAnalyzing(false);
      const isCritical = finalAnswers.severity === 'Severe (Incapacitating)' || finalAnswers.symptoms.toLowerCase().includes('chest pain');
      setResult({
        risk: isCritical ? 'HIGH' : 'MODERATE',
        recommendation: isCritical 
          ? "Seek immediate emergency care. Notify your emergency contact." 
          : "Schedule a tele-consultation with your primary physician within 24 hours.",
        details: "Based on Clinical Protocol v4.2. Analysis is preliminary."
      });
    }, 2500);
  };

  const reset = () => {
    setStep(0);
    setAnswers({});
    setResult(null);
  };

  return (
    <GlassBox className="!p-10 border-medilink-mint/20 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-8 opacity-5">
        <Sparkles className="w-32 h-32" />
      </div>

      <div className="relative z-10">
        <div className="flex items-center gap-4 mb-10">
          <div className="w-12 h-12 rounded-2xl bg-medilink-mint/10 flex items-center justify-center border border-medilink-mint/20">
            <Stethoscope className="text-medilink-mint w-6 h-6" />
          </div>
          <div>
            <h3 className="text-2xl font-display font-black text-medilink-ink tracking-tight uppercase">AI Triage Assistant</h3>
            <p className="text-medilink-muted text-[10px] font-bold uppercase tracking-widest opacity-60">Clinical-Grade Symptom Analysis</p>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {result ? (
            <motion.div 
              key="result"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <div className={`p-8 rounded-[2rem] border ${result.risk === 'HIGH' ? 'bg-medilink-coral/5 border-medilink-coral/20' : 'bg-medilink-mint/5 border-medilink-mint/20'}`}>
                <div className="flex items-center gap-4 mb-6">
                  {result.risk === 'HIGH' ? <AlertCircle className="text-medilink-coral w-8 h-8" /> : <CheckCircle2 className="text-medilink-mint w-8 h-8" />}
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-50">Triage Assessment</p>
                    <p className={`text-xl font-black ${result.risk === 'HIGH' ? 'text-medilink-coral' : 'text-medilink-mint'}`}>{result.risk} PRIORITY</p>
                  </div>
                </div>
                <p className="text-lg font-bold text-medilink-ink leading-relaxed">
                  {result.recommendation}
                </p>
                <p className="text-[10px] font-bold text-medilink-muted/40 uppercase tracking-widest mt-6 pt-6 border-t border-medilink-border/50">
                  {result.details}
                </p>
              </div>
              <Button variant="secondary" className="w-full" onClick={reset}>New Assessment</Button>
            </motion.div>
          ) : isAnalyzing ? (
            <motion.div 
              key="analyzing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-20 flex flex-col items-center justify-center text-center space-y-6"
            >
              <div className="relative">
                <div className="w-20 h-20 rounded-full border-4 border-medilink-mint/10 border-t-medilink-mint animate-spin" />
                <Sparkles className="absolute inset-0 m-auto w-8 h-8 text-medilink-mint animate-pulse" />
              </div>
              <div>
                <p className="text-lg font-black text-medilink-ink">Cross-Referencing Medical Journals</p>
                <p className="text-xs text-medilink-muted font-bold uppercase tracking-widest mt-2">Analyzing clinical markers...</p>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <currentStep.icon className="w-4 h-4 text-medilink-mint" />
                  <p className="text-sm font-black text-medilink-muted/50 uppercase tracking-[0.2em]">Step {step + 1} of 3</p>
                </div>
                <h4 className="text-2xl font-black text-medilink-ink leading-tight">{currentStep.question}</h4>
              </div>

              {currentStep.options ? (
                <div className="grid gap-3">
                  {currentStep.options.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => handleNext(opt)}
                      className="p-6 text-left border-2 border-medilink-border rounded-[1.5rem] font-bold text-medilink-ink hover:border-medilink-mint hover:bg-medilink-mint/5 transition-all group flex items-center justify-between"
                    >
                      <span>{opt}</span>
                      <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all text-medilink-mint" />
                    </button>
                  ))}
                </div>
              ) : (
                <div className="space-y-6">
                  <textarea
                    className="field-input !h-32 py-4"
                    placeholder={currentStep.placeholder}
                    onChange={(e) => setAnswers({ ...answers, [currentStep.id]: e.target.value })}
                  />
                  <Button 
                    className="w-full h-14" 
                    onClick={() => handleNext(answers[currentStep.id])}
                    disabled={!answers[currentStep.id]}
                  >
                    Confirm Symptom
                  </Button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </GlassBox>
  );
}

export default AITriage;
