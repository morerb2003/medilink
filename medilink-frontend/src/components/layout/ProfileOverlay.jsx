import { motion } from 'framer-motion';
import { 
  X, 
  Camera, 
  User, 
  ShieldCheck, 
  Globe,
  Link,
  ExternalLink,
  MapPin,
  Calendar,
  Phone
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import * as patientService from '../../services/patientService';
import Spinner from '../common/Spinner';

function ProfileOverlay({ isOpen, onClose, userId }) {
  const { data: profile, isLoading } = useQuery({
    queryKey: ['patient', 'profile', userId],
    queryFn: () => patientService.getProfile(userId),
    enabled: isOpen && Boolean(userId),
  });

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-medilink-ink/60 backdrop-blur-xl"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="w-full max-w-lg bg-white rounded-[3rem] shadow-2xl overflow-hidden relative ring-1 ring-white/20"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cover Gradient */}
        <div className="h-40 bg-gradient-to-tr from-medilink-mint to-teal-400 relative">
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/40 transition-all shadow-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Profile Content */}
        <div className="px-10 pb-12 -mt-16 relative">
          <div className="flex flex-col items-center">
            <div className="w-32 h-32 rounded-[2.5rem] bg-white p-2 shadow-2xl shadow-medilink-mint/20">
              <div className="w-full h-full rounded-[2rem] bg-medilink-mint/10 flex items-center justify-center border border-medilink-mint/20">
                <User className="w-12 h-12 text-medilink-mint" />
              </div>
            </div>
            
            <div className="mt-6 text-center space-y-2">
              <h2 className="text-3xl font-display font-black text-medilink-ink tracking-tight">
                {isLoading ? 'Loading...' : (profile?.fullName || 'Health Identity')}
              </h2>
              <div className="flex items-center justify-center gap-2 px-4 py-1.5 bg-medilink-mint/10 rounded-full">
                <ShieldCheck className="w-3.5 h-3.5 text-medilink-mint" />
                <span className="text-[10px] font-black uppercase tracking-widest text-medilink-mint">Verified Network Member</span>
              </div>
            </div>

            {isLoading ? (
              <div className="py-10">
                <Spinner size="sm" />
              </div>
            ) : (
              <>
                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-4 w-full mt-10">
                  <div className="p-5 bg-medilink-canvas/50 rounded-3xl border border-medilink-border/30 space-y-2">
                    <p className="text-[9px] font-black uppercase tracking-widest text-medilink-muted/60">ABHA Number</p>
                    <p className="font-bold text-medilink-ink truncate">{profile?.healthId || 'Not Linked'}</p>
                  </div>
                  <div className="p-5 bg-medilink-canvas/50 rounded-3xl border border-medilink-border/30 space-y-2 text-right">
                    <p className="text-[9px] font-black uppercase tracking-widest text-medilink-muted/60">Blood Group</p>
                    <p className="font-black text-medilink-ink text-xl">{profile?.bloodGroup || 'N/A'}</p>
                  </div>
                </div>

                <div className="w-full mt-8 space-y-4">
                  <div className="flex items-center gap-4 text-sm font-medium text-medilink-muted">
                    <Phone className="w-4 h-4 text-medilink-mint" />
                    <span>{profile?.phone || 'No phone linked'}</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm font-medium text-medilink-muted">
                    <Calendar className="w-4 h-4 text-medilink-mint" />
                    <span>Born {profile?.dob || 'Unknown'}</span>
                  </div>
                </div>

                {/* Social Section */}
                <div className="w-full mt-10 pt-10 border-t border-medilink-border/50">
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] text-medilink-muted mb-6 text-center">Social Connectivity</p>
                  <div className="flex items-center justify-center gap-6">
                    {[
                      { icon: Camera, url: profile?.socialLinks?.instagram, label: 'Instagram', color: 'hover:text-[#E4405F]' },
                      { icon: Globe, url: profile?.socialLinks?.facebook, label: 'Facebook', color: 'hover:text-[#1877F2]' },
                      { icon: Link, url: profile?.socialLinks?.linkedin, label: 'LinkedIn', color: 'hover:text-[#0A66C2]' }
                    ].map((s) => (
                      <a
                        key={s.label}
                        href={s.url ? (s.url.startsWith('http') ? s.url : `https://${s.url}`) : '#'}
                        target={s.url ? "_blank" : "_self"}
                        rel="noopener noreferrer"
                        className={`group relative p-4 bg-medilink-canvas rounded-2xl transition-all duration-300 ${s.url ? s.color + ' hover:bg-white hover:shadow-xl' : 'opacity-20 cursor-not-allowed'}`}
                      >
                        <s.icon className="w-6 h-6 transition-transform group-hover:scale-110" />
                        {s.url && <ExternalLink className="absolute top-1 right-1 w-2.5 h-2.5 opacity-0 group-hover:opacity-100 transition-opacity" />}
                      </a>
                    ))}
                  </div>
                  {!profile?.socialLinks?.instagram && !profile?.socialLinks?.facebook && !profile?.socialLinks?.linkedin && (
                    <p className="text-[9px] font-bold text-center mt-6 text-medilink-muted/40 uppercase tracking-widest">Update profile to link socials</p>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default ProfileOverlay;
