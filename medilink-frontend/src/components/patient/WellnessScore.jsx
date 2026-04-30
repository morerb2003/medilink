import { motion } from 'framer-motion';
import { 
  Zap, 
  Heart, 
  Target, 
  ShieldCheck,
  TrendingUp,
  Info
} from 'lucide-react';
import GlassBox from '../common/GlassBox';

function WellnessScore({ profile }) {
  // Simulate a score based on profile completion and record count
  const score = 84; 
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <GlassBox className="!p-10 border-medilink-mint/20 flex flex-col items-center text-center relative overflow-hidden group">
      {/* Decorative Gradients */}
      <div className="absolute -top-20 -left-20 w-64 h-64 bg-medilink-mint/5 blur-[100px] rounded-full group-hover:bg-medilink-mint/10 transition-colors" />
      <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-teal-500/5 blur-[100px] rounded-full group-hover:bg-teal-500/10 transition-colors" />

      <div className="relative z-10 w-full">
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-3">
            <Zap className="w-5 h-5 text-medilink-mint fill-medilink-mint" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-medilink-muted">Health Velocity</span>
          </div>
          <button className="w-8 h-8 rounded-full bg-medilink-canvas flex items-center justify-center text-medilink-muted/40 hover:text-medilink-mint transition-colors">
            <Info className="w-4 h-4" />
          </button>
        </div>

        <div className="relative w-56 h-56 mx-auto mb-10">
          {/* Progress Ring */}
          <svg className="w-full h-full transform -rotate-90 filter drop-shadow-2xl">
            <defs>
              <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#2dd4bf" />
              </linearGradient>
            </defs>
            <circle 
              cx="112" cy="112" r={radius} 
              fill="transparent" 
              stroke="currentColor" 
              strokeWidth="12" 
              className="text-medilink-border/20" 
            />
            <motion.circle 
              cx="112" cy="112" r={radius} 
              fill="transparent" 
              stroke="url(#scoreGradient)" 
              strokeWidth="12" 
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: offset }}
              transition={{ duration: 2, ease: "easeOut" }}
              strokeLinecap="round"
            />
          </svg>
          
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.span 
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-6xl font-display font-black text-medilink-ink"
            >
              {score}
            </motion.span>
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-medilink-muted/50 -mt-2">Readiness</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 w-full">
          {[
            { label: 'VITALS', value: 'Optimal', icon: Heart, color: 'text-medilink-coral' },
            { label: 'RECORDS', value: '98%', icon: Target, color: 'text-medilink-mint' },
            { label: 'RISK', value: 'Low', icon: ShieldCheck, color: 'text-indigo-500' }
          ].map((item) => (
            <div key={item.label} className="p-4 bg-medilink-canvas/50 rounded-[2rem] border border-medilink-border/30 group/item hover:bg-white hover:shadow-xl transition-all duration-500">
              <item.icon className={`w-4 h-4 ${item.color} mb-3 mx-auto group-hover/item:scale-125 transition-transform`} />
              <p className="text-[8px] font-black text-medilink-muted/40 uppercase tracking-widest mb-1">{item.label}</p>
              <p className="text-[10px] font-black text-medilink-ink">{item.value}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 flex items-center justify-center gap-2 text-xs font-bold text-medilink-mint">
          <TrendingUp className="w-4 h-4" />
          <span>+4% improvement this month</span>
        </div>
      </div>
    </GlassBox>
  );
}

export default WellnessScore;
