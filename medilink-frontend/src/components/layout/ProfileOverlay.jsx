import { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  X, 
  Camera, 
  User, 
  ShieldCheck, 
  Globe,
  Link as LinkIcon,
  ExternalLink,
  Calendar,
  Phone,
  Edit3,
  ChevronLeft,
  MapPin,
  Briefcase,
  Languages
} from 'lucide-react';
import * as patientService from '../../services/patientService';
import Spinner from '../common/Spinner';
import Button from '../common/Button';

function ProfileOverlay({ isOpen, onClose, userId }) {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  
  const { data: profile, isLoading } = useQuery({
    queryKey: ['patient', 'profile', userId],
    queryFn: () => patientService.getProfile(userId),
    enabled: isOpen && Boolean(userId),
  });

  const updateMutation = useMutation({
    mutationFn: (payload) => patientService.updateProfile(userId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries(['patient', 'profile', userId]);
      setIsEditing(false);
    }
  });

  if (!isOpen) return null;

  const handleSave = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const payload = {
      ...profile,
      fullName: formData.get('fullName'),
      phone: formData.get('phone'),
      occupation: formData.get('occupation'),
      languagePreference: formData.get('languagePreference'),
      address: formData.get('address'),
      socialLinks: {
        instagram: formData.get('instagram'),
        facebook: formData.get('facebook'),
        linkedin: formData.get('linkedin'),
      }
    };
    await updateMutation.mutateAsync(payload);
  };

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
        className="w-full max-w-lg bg-white rounded-[3.5rem] shadow-2xl overflow-hidden relative ring-1 ring-white/20"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cover Gradient */}
        <div className="h-32 bg-gradient-to-tr from-medilink-mint to-teal-400 relative">
          <div className="absolute top-6 left-6 right-6 flex justify-between items-center">
            <button 
              onClick={() => isEditing ? setIsEditing(false) : onClose()}
              className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/40 transition-all shadow-lg"
            >
              {isEditing ? <ChevronLeft className="w-5 h-5" /> : <X className="w-5 h-5" />}
            </button>
            {!isEditing && (
              <button 
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-white/20 backdrop-blur-md rounded-full flex items-center gap-2 text-white hover:bg-white/40 transition-all shadow-lg text-xs font-black uppercase tracking-widest"
              >
                <Edit3 className="w-3.5 h-3.5" />
                Edit Profile
              </button>
            )}
          </div>
        </div>

        {/* Profile Content */}
        <div className="px-10 pb-12 -mt-12 relative">
          <div className="flex flex-col items-center">
            <div className="w-28 h-28 rounded-[2.5rem] bg-white p-2 shadow-2xl shadow-medilink-mint/20">
              <div className="w-full h-full rounded-[2rem] bg-medilink-mint/10 flex items-center justify-center border border-medilink-mint/20">
                <User className="w-10 h-10 text-medilink-mint" />
              </div>
            </div>
            
            {isLoading ? (
              <div className="py-20"><Spinner size="sm" /></div>
            ) : isEditing ? (
              <form onSubmit={handleSave} className="w-full mt-10 space-y-6">
                <div className="max-h-[60vh] overflow-y-auto pr-2 space-y-4 custom-scrollbar">
                  <label className="field-shell">
                    <span className="field-label">Full Name</span>
                    <input name="fullName" defaultValue={profile?.fullName} className="field-input !h-12" required />
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <label className="field-shell">
                      <span className="field-label">Phone</span>
                      <input name="phone" defaultValue={profile?.phone} className="field-input !h-12" />
                    </label>
                    <label className="field-shell">
                      <span className="field-label">Language</span>
                      <input name="languagePreference" defaultValue={profile?.languagePreference} className="field-input !h-12" />
                    </label>
                  </div>
                  <label className="field-shell">
                    <span className="field-label">Occupation</span>
                    <input name="occupation" defaultValue={profile?.occupation} className="field-input !h-12" />
                  </label>
                  <label className="field-shell">
                    <span className="field-label">Residential Address</span>
                    <textarea name="address" defaultValue={profile?.address} className="field-input !h-20 py-3 text-sm" />
                  </label>
                  
                  <div className="pt-4 border-t border-medilink-border/50">
                    <p className="text-[10px] font-black uppercase tracking-widest text-medilink-muted mb-4">Social Links</p>
                    <div className="grid grid-cols-3 gap-3">
                      <input name="instagram" defaultValue={profile?.socialLinks?.instagram} className="field-input !h-10 text-[10px]" placeholder="Instagram" />
                      <input name="facebook" defaultValue={profile?.socialLinks?.facebook} className="field-input !h-10 text-[10px]" placeholder="Facebook" />
                      <input name="linkedin" defaultValue={profile?.socialLinks?.linkedin} className="field-input !h-10 text-[10px]" placeholder="LinkedIn" />
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-4 bg-white">
                  <Button type="button" variant="secondary" className="flex-1" onClick={() => setIsEditing(false)}>Cancel</Button>
                  <Button type="submit" className="flex-1" disabled={updateMutation.isPending}>
                    {updateMutation.isPending ? 'Syncing...' : 'Save Changes'}
                  </Button>
                </div>
              </form>
            ) : (
              <div className="w-full text-center">
                <div className="mt-6 space-y-2">
                  <h2 className="text-3xl font-display font-black text-medilink-ink tracking-tight leading-none">
                    {profile?.fullName || 'Health Identity'}
                  </h2>
                  <div className="flex items-center justify-center gap-2 px-4 py-1.5 bg-medilink-mint/10 rounded-full w-fit mx-auto">
                    <ShieldCheck className="w-3.5 h-3.5 text-medilink-mint" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-medilink-mint">Verified Network Member</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 w-full mt-10 text-left">
                  <div className="p-5 bg-medilink-canvas/50 rounded-3xl border border-medilink-border/30 space-y-2">
                    <p className="text-[9px] font-black uppercase tracking-widest text-medilink-muted/60">ABHA Number</p>
                    <p className="font-bold text-medilink-ink truncate text-xs">{profile?.healthId || 'Not Linked'}</p>
                  </div>
                  <div className="p-5 bg-medilink-canvas/50 rounded-3xl border border-medilink-border/30 space-y-2 text-right">
                    <p className="text-[9px] font-black uppercase tracking-widest text-medilink-muted/60">Blood Group</p>
                    <p className="font-black text-medilink-ink text-xl">{profile?.bloodGroup || 'N/A'}</p>
                  </div>
                </div>

                <div className="w-full mt-8 space-y-4 text-left px-2">
                  <div className="flex items-center gap-4 text-sm font-medium text-medilink-muted">
                    <Phone className="w-4 h-4 text-medilink-mint" />
                    <span>{profile?.phone || 'No phone linked'}</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm font-medium text-medilink-muted">
                    <Briefcase className="w-4 h-4 text-medilink-mint" />
                    <span>{profile?.occupation || 'Occupation not set'}</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm font-medium text-medilink-muted">
                    <Languages className="w-4 h-4 text-medilink-mint" />
                    <span>Prefers {profile?.languagePreference || 'Any Language'}</span>
                  </div>
                </div>

                <div className="w-full mt-10 pt-10 border-t border-medilink-border/50">
                  <div className="flex items-center justify-center gap-6">
                    {[
                      { icon: Camera, url: profile?.socialLinks?.instagram, label: 'Instagram', color: 'hover:text-[#E4405F]' },
                      { icon: Globe, url: profile?.socialLinks?.facebook, label: 'Facebook', color: 'hover:text-[#1877F2]' },
                      { icon: LinkIcon, url: profile?.socialLinks?.linkedin, label: 'LinkedIn', color: 'hover:text-[#0A66C2]' }
                    ].map((s) => (
                      <a
                        key={s.label}
                        href={s.url ? (s.url.startsWith('http') ? s.url : `https://${s.url}`) : '#'}
                        target={s.url ? "_blank" : "_self"}
                        rel="noopener noreferrer"
                        className={`group relative p-4 bg-medilink-canvas rounded-2xl transition-all duration-300 ${s.url ? s.color + ' hover:bg-white hover:shadow-xl' : 'opacity-20 cursor-not-allowed'}`}
                      >
                        <s.icon className="w-5 h-5 transition-transform group-hover:scale-110" />
                        {s.url && <ExternalLink className="absolute top-1 right-1 w-2.5 h-2.5 opacity-0 group-hover:opacity-100 transition-opacity" />}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default ProfileOverlay;
