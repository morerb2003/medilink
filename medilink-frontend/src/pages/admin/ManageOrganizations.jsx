import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Building2, 
  Plus, 
  MapPin, 
  Mail, 
  Phone, 
  Globe,
  MoreVertical,
  Search,
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout.jsx';
import GlassBox from '../../components/common/GlassBox.jsx';
import AnimatedPage from '../../components/common/AnimatedPage.jsx';
import Button from '../../components/common/Button.jsx';
import api from '../../services/api';

function ManageOrganizations() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newOrg, setNewOrg] = useState({
    name: '',
    type: 'PRIVATE_HOSPITAL',
    registrationNumber: '',
    address: '',
    contactEmail: '',
    contactPhone: ''
  });

  const { data: organizations, isLoading } = useQuery({
    queryKey: ['admin-organizations'],
    queryFn: () => api.get('admin/organizations').then(res => res.data)
  });

  const createOrgMutation = useMutation({
    mutationFn: (org) => api.post('admin/organizations', org),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-organizations']);
      setIsModalOpen(false);
      setNewOrg({
        name: '',
        type: 'PRIVATE_HOSPITAL',
        registrationNumber: '',
        address: '',
        contactEmail: '',
        contactPhone: ''
      });
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createOrgMutation.mutate(newOrg);
  };

  return (
    <DashboardLayout role="admin">
      <AnimatedPage>
        <div className="space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <span className="inline-block px-3 py-1 text-[10px] font-black uppercase tracking-[0.4em] text-medilink-mint bg-medilink-mint/10 rounded-full mb-4">
                Network Infrastructure
              </span>
              <h1 className="text-4xl font-display font-black text-medilink-ink tracking-tight">
                Health <span className="text-gradient">Organizations</span>
              </h1>
              <p className="text-medilink-muted mt-2 font-medium opacity-70">
                Manage hospitals, clinics, and government health departments within the ecosystem.
              </p>
            </div>

            <Button onClick={() => setIsModalOpen(true)} className="premium-button !rounded-2xl h-14 px-8 shadow-xl shadow-medilink-mint/20">
              <Plus className="w-5 h-5 mr-2" />
              Add Organization
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence>
              {organizations?.map((org) => (
                <motion.div
                  key={org.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                >
                  <GlassBox className="!p-8 group hover:border-medilink-mint/30 transition-all duration-500 relative overflow-hidden h-full flex flex-col">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-medilink-mint/5 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-700" />
                    
                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-14 h-14 rounded-2xl bg-medilink-canvas flex items-center justify-center border border-medilink-border group-hover:bg-medilink-mint/10 transition-colors">
                        <Building2 className="text-medilink-mint w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-bold text-medilink-ink text-lg leading-tight">{org.name}</h4>
                        <span className="text-[10px] font-black uppercase tracking-widest text-medilink-muted/50 mt-1 block">
                          {org.type.replace('_', ' ')}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-4 flex-1">
                      <div className="flex items-start gap-3">
                        <MapPin className="w-4 h-4 text-medilink-muted/40 mt-1" />
                        <p className="text-xs font-bold text-medilink-muted/80">{org.address || 'Address not registered'}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Mail className="w-4 h-4 text-medilink-muted/40" />
                        <p className="text-xs font-bold text-medilink-muted/80">{org.contactEmail}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone className="w-4 h-4 text-medilink-muted/40" />
                        <p className="text-xs font-bold text-medilink-muted/80">{org.contactPhone}</p>
                      </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-medilink-border/50 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Active Node</span>
                      </div>
                      <button className="p-2 hover:bg-medilink-canvas rounded-lg transition-colors text-medilink-muted">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </div>
                  </GlassBox>
                </motion.div>
              ))}
            </AnimatePresence>

            {!isLoading && organizations?.length === 0 && (
              <div className="col-span-full py-32 text-center bg-medilink-canvas/30 rounded-[3rem] border-2 border-dashed border-medilink-border">
                <Globe className="w-16 h-16 text-medilink-muted/20 mx-auto mb-6" />
                <h3 className="text-xl font-bold text-medilink-ink">No Organizations Mapped</h3>
                <p className="text-medilink-muted font-bold text-xs uppercase tracking-widest mt-2">Initialize your network by adding nodes</p>
              </div>
            )}
          </div>
        </div>

        {/* Create Modal (Simple Overlay) */}
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-medilink-ink/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full max-w-lg bg-white rounded-[3rem] p-12 shadow-2xl overflow-y-auto max-h-[90vh]"
            >
              <h2 className="text-3xl font-display font-black text-medilink-ink mb-8">Register Node</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="field-shell">
                  <span className="field-label">Organization Name</span>
                  <input
                    className="field-input"
                    required
                    value={newOrg.name}
                    onChange={e => setNewOrg({...newOrg, name: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="field-shell">
                    <span className="field-label">Type</span>
                    <select
                      className="field-input"
                      value={newOrg.type}
                      onChange={e => setNewOrg({...newOrg, type: e.target.value})}
                    >
                      <option value="GOVERNMENT_HOSPITAL">Government Hospital</option>
                      <option value="PRIVATE_HOSPITAL">Private Hospital</option>
                      <option value="CLINIC">Clinic</option>
                      <option value="RESEARCH_INSTITUTE">Research Institute</option>
                    </select>
                  </div>
                  <div className="field-shell">
                    <span className="field-label">Reg Number</span>
                    <input
                      className="field-input"
                      value={newOrg.registrationNumber}
                      onChange={e => setNewOrg({...newOrg, registrationNumber: e.target.value})}
                    />
                  </div>
                </div>
                <div className="field-shell">
                  <span className="field-label">Address</span>
                  <input
                    className="field-input"
                    value={newOrg.address}
                    onChange={e => setNewOrg({...newOrg, address: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="field-shell">
                    <span className="field-label">Contact Email</span>
                    <input
                      className="field-input"
                      type="email"
                      value={newOrg.contactEmail}
                      onChange={e => setNewOrg({...newOrg, contactEmail: e.target.value})}
                    />
                  </div>
                  <div className="field-shell">
                    <span className="field-label">Contact Phone</span>
                    <input
                      className="field-input"
                      value={newOrg.contactPhone}
                      onChange={e => setNewOrg({...newOrg, contactPhone: e.target.value})}
                    />
                  </div>
                </div>
                <div className="flex gap-4 pt-6">
                  <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)} className="flex-1">Cancel</Button>
                  <Button type="submit" className="flex-1 premium-button" disabled={createOrgMutation.isPending}>
                    {createOrgMutation.isPending ? 'Registering...' : 'Register Organization'}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatedPage>
    </DashboardLayout>
  );
}

export default ManageOrganizations;
