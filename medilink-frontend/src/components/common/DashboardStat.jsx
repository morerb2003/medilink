import { motion } from 'framer-motion';

const DashboardStat = ({ label, value, icon: Icon, trend, color = 'mint' }) => {
  const colors = {
    mint: 'from-emerald-400 to-medilink-mint text-white shadow-emerald-500/20',
    coral: 'from-orange-400 to-medilink-coral text-white shadow-orange-500/20',
    gold: 'from-amber-400 to-medilink-gold text-white shadow-amber-500/20',
  };

  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="surface-card p-8 flex items-start justify-between relative overflow-hidden group"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br opacity-5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />
      
      <div className="relative z-10">
        <p className="text-[12px] font-bold uppercase tracking-[0.25em] text-medilink-muted/70 mb-4">
          {label}
        </p>
        <h3 className="text-5xl font-display font-bold text-medilink-ink tracking-tight">
          {value}
        </h3>
        {trend && (
          <div className="mt-4 flex items-center gap-2">
            <span className={`flex items-center justify-center w-5 h-5 rounded-full text-[10px] ${trend.isPositive ? 'bg-emerald-500/10 text-emerald-600' : 'bg-rose-500/10 text-rose-600'}`}>
              {trend.isPositive ? '↑' : '↓'}
            </span>
            <span className={`text-sm font-bold ${trend.isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
              {trend.value}%
            </span>
            <span className="text-xs text-medilink-muted/50 font-medium">vs prev cycle</span>
          </div>
        )}
      </div>
      
      {Icon && (
        <div className={`relative z-10 w-16 h-16 rounded-[2rem] flex items-center justify-center bg-gradient-to-br shadow-xl group-hover:rotate-6 transition-transform duration-300 ${colors[color]}`}>
          <Icon className="w-8 h-8" />
        </div>
      )}
    </motion.div>
  );
};

export default DashboardStat;
