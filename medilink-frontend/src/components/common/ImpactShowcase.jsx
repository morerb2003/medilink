import { motion } from 'framer-motion';
import { 
  HeartPulse, 
  ShieldAlert, 
  Navigation, 
  MapPin, 
  ShieldCheck, 
  Clock,
  ArrowRight,
  Stethoscope,
  Activity,
  DollarSign,
  RotateCcw
} from 'lucide-react';
import GlassBox from './GlassBox';

const journeys = [
  {
    id: 'ramesh',
    title: 'Ramesh, 58 (Nagpur)',
    subtitle: 'Chronic Care Continuity',
    icon: HeartPulse,
    color: 'mint',
    description: "Dr. Mehta at Fortis Nagpur avoids prescribing duplicate Metformin after seeing Ramesh's MediLink records from his local GP.",
    impact: ['Duplicate test avoided', 'Drug interaction prevented'],
    stats: { label: 'Savings', value: '₹3,500+' }
  },
  {
    id: 'priya',
    title: 'Priya, 34 (Mumbai)',
    subtitle: 'Life-Saving Emergency Override',
    icon: ShieldAlert,
    color: 'coral',
    description: "Unconscious after a road accident, Priya's life is saved when Dr. James scans her QR and sees her Penicillin allergy and B+ blood group.",
    impact: ['Life-critical data in <10s', 'Family notified instantly'],
    stats: { label: 'Speed', value: '< 10 Sec' }
  },
  {
    id: 'suresh',
    title: 'Suresh, 45 (Bihar)',
    subtitle: 'Remote Referral Efficiency',
    icon: Navigation,
    color: 'gold',
    description: "AIIMS Patna doctor views Suresh's PHC X-rays via MediLink before he travels 200km, ensuring he arrives only when necessary.",
    impact: ['₹1,200 test cost saved', 'Same-day diagnosis'],
    stats: { label: 'Travel Reduced', value: '200 KM' }
  }
];

function ImpactShowcase() {
  return (
    <div className="py-20 space-y-12">
      <div className="text-center space-y-4">
        <span className="inline-block px-3 py-1 text-[10px] font-black uppercase tracking-[0.4em] text-medilink-mint bg-medilink-mint/10 rounded-full">
          Real-World Impact
        </span>
        <h2 className="text-3xl font-display font-black text-medilink-ink">
          The <span className="text-gradient">MediLink</span> Network in Action
        </h2>
        <div className="flex flex-col items-center gap-4">
          <p className="max-w-2xl mx-auto text-medilink-muted font-medium opacity-70">
            From busy metropolitan hospitals to rural PHCs, MediLink bridges the gap in Indian healthcare.
          </p>
          <a 
            href="/demo" 
            className="inline-flex items-center gap-3 px-6 py-3 bg-white border-2 border-medilink-mint/20 text-medilink-mint rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-medilink-mint hover:text-white transition-all duration-300 shadow-lg shadow-medilink-mint/5"
          >
            <RotateCcw className="w-4 h-4" />
            Watch Live Simulation
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {journeys.map((journey, index) => (
          <motion.div
            key={journey.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
          >
            <GlassBox className="!p-8 h-full flex flex-col group hover:border-medilink-mint/30 transition-all duration-500">
              <div className="flex items-start justify-between mb-6">
                <div className={`w-14 h-14 rounded-2xl bg-medilink-${journey.color}/10 flex items-center justify-center border border-medilink-${journey.color}/20 group-hover:scale-110 transition-transform duration-500`}>
                  <journey.icon className={`w-7 h-7 text-medilink-${journey.color}`} />
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black uppercase tracking-widest text-medilink-muted/50">{journey.stats.label}</p>
                  <p className={`text-xl font-black text-medilink-${journey.color}`}>{journey.stats.value}</p>
                </div>
              </div>

              <div className="space-y-3 flex-1">
                <h3 className="text-xl font-black text-medilink-ink tracking-tight">{journey.title}</h3>
                <p className={`text-[10px] font-black uppercase tracking-widest text-medilink-${journey.color}`}>{journey.subtitle}</p>
                <p className="text-sm text-medilink-muted font-medium leading-relaxed pt-2">
                  {journey.description}
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-medilink-border/50 space-y-3">
                {journey.impact.map((point) => (
                  <div key={point} className="flex items-center gap-3">
                    <div className={`w-1.5 h-1.5 rounded-full bg-medilink-${journey.color}`} />
                    <span className="text-[11px] font-bold text-medilink-ink uppercase tracking-wider">{point}</span>
                  </div>
                ))}
              </div>
            </GlassBox>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default ImpactShowcase;
