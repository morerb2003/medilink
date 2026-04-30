import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Pill, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Plus,
  Coffee,
  Sun,
  Moon
} from 'lucide-react';
import GlassBox from '../common/GlassBox';

const INITIAL_MEDS = [
  { id: 1, name: 'Metformin', dosage: '500mg', time: 'Morning', icon: Coffee, status: 'pending', color: 'blue' },
  { id: 2, name: 'Atorvastatin', dosage: '10mg', time: 'Evening', icon: Moon, status: 'pending', color: 'indigo' },
  { id: 3, name: 'Vitamin D3', dosage: '2000IU', time: 'Afternoon', icon: Sun, status: 'completed', color: 'amber' }
];

function MedicineTracker() {
  const [meds, setMeds] = useState(INITIAL_MEDS);

  const toggleStatus = (id) => {
    setMeds(meds.map(m => 
      m.id === id ? { ...m, status: m.status === 'completed' ? 'pending' : 'completed' } : m
    ));
  };

  const completedCount = meds.filter(m => m.status === 'completed').length;
  const progress = (completedCount / meds.length) * 100;

  return (
    <GlassBox className="!p-8 border-indigo-500/10">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
            <Pill className="text-indigo-500 w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-display font-black text-medilink-ink tracking-tight uppercase">Daily Regimen</h3>
            <p className="text-[10px] font-bold text-medilink-muted/50 uppercase tracking-widest">{completedCount} of {meds.length} doses taken</p>
          </div>
        </div>
        <div className="relative w-16 h-16">
          <svg className="w-full h-full transform -rotate-90">
            <circle cx="32" cy="32" r="28" fill="transparent" stroke="currentColor" strokeWidth="4" className="text-medilink-border/30" />
            <circle cx="32" cy="32" r="28" fill="transparent" stroke="currentColor" strokeWidth="4" strokeDasharray={176} strokeDashoffset={176 - (176 * progress) / 100} className="text-indigo-500 transition-all duration-1000 ease-out" />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-indigo-500">
            {Math.round(progress)}%
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {meds.map((med) => {
          const TimeIcon = med.icon;
          const isDone = med.status === 'completed';
          
          return (
            <motion.div 
              key={med.id}
              layout
              className={`p-5 rounded-3xl border transition-all duration-300 flex items-center justify-between ${isDone ? 'bg-indigo-500/5 border-indigo-500/20 opacity-60' : 'bg-white border-medilink-border hover:border-indigo-500/40'}`}
            >
              <div className="flex items-center gap-5">
                <div className={`p-3 rounded-2xl ${isDone ? 'bg-indigo-500/10 text-indigo-500' : 'bg-medilink-canvas text-medilink-muted'}`}>
                  <TimeIcon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className={`font-bold ${isDone ? 'text-medilink-muted line-through' : 'text-medilink-ink'}`}>{med.name}</h4>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-medilink-muted/60">{med.dosage}</span>
                    <span className="w-1 h-1 rounded-full bg-medilink-border" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-indigo-500/70">{med.time}</span>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => toggleStatus(med.id)}
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${isDone ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20' : 'bg-medilink-canvas text-medilink-muted/30 hover:text-indigo-500 hover:bg-indigo-500/10'}`}
              >
                {isDone ? <CheckCircle2 className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
              </button>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-8 pt-6 border-t border-medilink-border/50">
        <div className="flex items-center gap-3 text-xs font-bold text-medilink-muted/50">
          <Clock className="w-3.5 h-3.5" />
          <span>Next dose in 4 hours (Evening)</span>
        </div>
      </div>
    </GlassBox>
  );
}

export default MedicineTracker;
