import { motion } from 'framer-motion';
import { 
  Microscope, 
  FileText, 
  Image as ImageIcon, 
  Stethoscope, 
  ChevronRight,
  Calendar,
  Building,
  ExternalLink
} from 'lucide-react';
import { formatDate } from '../../utils/formatters';

const iconMap = {
  LAB_REPORT: Microscope,
  PRESCRIPTION: FileText,
  IMAGING: ImageIcon,
  DISCHARGE_SUMMARY: Stethoscope,
  DEFAULT: FileText
};

const colorMap = {
  LAB_REPORT: 'medilink-mint',
  PRESCRIPTION: 'blue-500',
  IMAGING: 'purple-500',
  DISCHARGE_SUMMARY: 'medilink-coral',
  DEFAULT: 'medilink-muted'
};

function HealthJourney({ records }) {
  if (!records || records.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-6 glass-card !bg-white/40 border-dashed border-2">
        <Calendar className="w-12 h-12 text-medilink-muted/30 mb-4" />
        <p className="text-medilink-muted font-bold uppercase tracking-widest text-[10px]">Your Health Narrative Begins Here</p>
        <p className="text-xs text-medilink-muted/60 mt-2">Upload your first record to generate your timeline.</p>
      </div>
    );
  }

  // Sort records by date descending
  const sortedRecords = [...records].sort((a, b) => 
    new Date(b.recordDate || b.createdAt) - new Date(a.recordDate || a.createdAt)
  );

  return (
    <div className="relative pl-8 space-y-12 before:absolute before:left-0 before:top-2 before:bottom-2 before:w-0.5 before:bg-gradient-to-b before:from-medilink-mint before:via-medilink-border before:to-transparent">
      {sortedRecords.map((record, index) => {
        const Icon = iconMap[record.recordType] || iconMap.DEFAULT;
        const colorClass = colorMap[record.recordType] || colorMap.DEFAULT;
        
        return (
          <motion.div 
            key={record.id}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="relative"
          >
            {/* Timeline Node */}
            <div className={`absolute -left-10 top-0 w-4 h-4 rounded-full bg-white border-4 border-${colorClass} shadow-lg shadow-${colorClass}/20 z-10`} />
            
            <div className="group relative glass-card !p-8 hover:border-medilink-mint/40 transition-all duration-500 hover:shadow-2xl hover:shadow-medilink-mint/5">
              <div className="flex flex-wrap items-start justify-between gap-6">
                <div className="flex gap-6">
                  <div className={`w-14 h-14 rounded-2xl bg-${colorClass}/10 flex items-center justify-center border border-${colorClass}/20 group-hover:scale-110 transition-transform duration-500`}>
                    <Icon className={`w-7 h-7 text-${colorClass}`} />
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-black uppercase tracking-widest text-medilink-mint bg-medilink-mint/10 px-2 py-0.5 rounded-full">
                        {record.recordType.replaceAll('_', ' ')}
                      </span>
                      <span className="text-[10px] font-bold text-medilink-muted/50 uppercase tracking-widest">
                        {formatDate(record.recordDate || record.createdAt)}
                      </span>
                    </div>
                    <h4 className="text-xl font-display font-black text-medilink-ink leading-tight group-hover:text-medilink-mint transition-colors">
                      {record.title}
                    </h4>
                    <div className="flex items-center gap-3 text-xs text-medilink-muted font-medium pt-2">
                      <Building className="w-3.5 h-3.5 opacity-40" />
                      <span>{record.hospitalName || 'Independent Provider'}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {record.fileUrl && (
                    <a 
                      href={record.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-5 py-2.5 bg-white border border-medilink-border rounded-xl text-xs font-bold text-medilink-ink hover:bg-medilink-canvas transition-colors shadow-sm"
                    >
                      <span>Review Details</span>
                      <ExternalLink className="w-3.5 h-3.5 opacity-40" />
                    </a>
                  )}
                  <button className="w-10 h-10 rounded-xl border border-medilink-border flex items-center justify-center hover:bg-medilink-mint hover:text-white transition-all group/btn shadow-sm">
                    <ChevronRight className="w-5 h-5 group-hover/btn:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>

              {/* Decorative Blur */}
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-medilink-mint/5 blur-3xl rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

export default HealthJourney;
