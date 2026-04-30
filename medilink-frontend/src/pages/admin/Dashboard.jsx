import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Users, 
  Building2, 
  UserCheck, 
  Clock, 
  ChevronRight,
  ShieldAlert,
  Search,
  Plus
} from 'lucide-react';
import { motion } from 'framer-motion';
import DashboardLayout from '../../components/layout/DashboardLayout.jsx';
import DashboardStat from '../../components/common/DashboardStat.jsx';
import GlassBox from '../../components/common/GlassBox.jsx';
import AnimatedPage from '../../components/common/AnimatedPage.jsx';
import api from '../../services/api';

function AdminDashboard() {
  const queryClient = useQueryClient();

  // Fetch Stats
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: () => api.get('admin/stats').then(res => res.data)
  });

  // Fetch Pending Doctors
  const { data: pendingDoctors, isLoading: doctorsLoading } = useQuery({
    queryKey: ['pending-doctors'],
    queryFn: () => api.get('admin/pending-doctors').then(res => res.data)
  });

  // Verify Doctor Mutation
  const verifyMutation = useMutation({
    mutationFn: (doctorId) => api.post(`admin/verify-doctor/${doctorId}`, null, { params: { verifiedBy: 'System Admin' } }),
    onSuccess: () => {
      queryClient.invalidateQueries(['pending-doctors']);
      queryClient.invalidateQueries(['admin-stats']);
    }
  });

  return (
    <DashboardLayout role="admin">
      <AnimatedPage>
        <div className="space-y-10">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <span className="inline-block px-3 py-1 text-[10px] font-black uppercase tracking-[0.4em] text-medilink-mint bg-medilink-mint/10 rounded-full mb-4">
                Operations Center
              </span>
              <h1 className="text-4xl font-display font-black text-medilink-ink tracking-tight">
                System <span className="text-gradient">Intelligence</span>
              </h1>
              <p className="text-medilink-muted mt-2 font-medium opacity-70">
                Global oversight across all organizations, practitioners, and patient protocols.
              </p>
            </div>

            <div className="flex gap-3">
              <button className="premium-button bg-medilink-mint text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-3 shadow-xl shadow-medilink-mint/20 hover:scale-105 transition-transform">
                <Building2 className="w-5 h-5" />
                <span>Register Organization</span>
              </button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <DashboardStat 
              label="Total Network Users" 
              value={stats?.totalUsers || 0} 
              icon={Users} 
              color="mint"
            />
            <DashboardStat 
              label="Verified Practitioners" 
              value={stats?.totalDoctors || 0} 
              icon={UserCheck} 
              color="gold"
            />
            <DashboardStat 
              label="Linked Organizations" 
              value={stats?.totalOrganizations || 0} 
              icon={Building2} 
              color="mint"
            />
            <DashboardStat 
              label="Pending Approvals" 
              value={stats?.pendingDoctorVerifications || 0} 
              icon={Clock} 
              color="coral"
            />
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
            {/* Pending Verifications */}
            <div className="xl:col-span-2 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-medilink-ink flex items-center gap-3">
                  <ShieldAlert className="text-medilink-coral w-6 h-6" />
                  Credential Verification Queue
                </h3>
                <span className="text-xs font-bold text-medilink-muted opacity-50 uppercase tracking-widest">
                  {pendingDoctors?.length || 0} requests awaiting
                </span>
              </div>

              <div className="space-y-4">
                {pendingDoctors?.map((doctor) => (
                  <motion.div
                    key={doctor.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <GlassBox className="!p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-medilink-mint/30 transition-colors group">
                      <div className="flex items-center gap-5">
                        <div className="w-14 h-14 rounded-2xl bg-medilink-canvas flex items-center justify-center border border-medilink-border group-hover:bg-medilink-mint/5 transition-colors">
                          <Users className="text-medilink-muted w-6 h-6 group-hover:text-medilink-mint transition-colors" />
                        </div>
                        <div>
                          <h4 className="font-bold text-medilink-ink text-lg">{doctor.fullName}</h4>
                          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-xs font-bold text-medilink-muted/70 uppercase tracking-wider">
                            <span>{doctor.specialization}</span>
                            <span className="w-1 h-1 rounded-full bg-medilink-border mt-1.5" />
                            <span>License: {doctor.licenseNo}</span>
                            <span className="w-1 h-1 rounded-full bg-medilink-border mt-1.5" />
                            <span>{doctor.hospital}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => verifyMutation.mutate(doctor.id)}
                          disabled={verifyMutation.isPending}
                          className="px-6 py-3 bg-medilink-mint text-white rounded-xl text-sm font-bold shadow-lg shadow-medilink-mint/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                        >
                          {verifyMutation.isPending ? 'Verifying...' : 'Approve Credentials'}
                        </button>
                      </div>
                    </GlassBox>
                  </motion.div>
                ))}

                {!doctorsLoading && pendingDoctors?.length === 0 && (
                  <div className="text-center py-20 bg-medilink-canvas/30 rounded-[2rem] border border-dashed border-medilink-border">
                    <UserCheck className="w-12 h-12 text-medilink-muted/20 mx-auto mb-4" />
                    <p className="text-medilink-muted font-bold text-sm uppercase tracking-widest">No pending verifications</p>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions / Organization View */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-medilink-ink">Organization Map</h3>
              <GlassBox className="!p-8 bg-gradient-to-br from-medilink-mint/10 to-teal-400/5 border-medilink-mint/20">
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center">
                      <Building2 className="text-medilink-mint w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-medilink-mint">Active Hubs</p>
                      <p className="text-2xl font-black text-medilink-ink">{stats?.totalOrganizations || 0}</p>
                    </div>
                  </div>
                  
                  <p className="text-sm text-medilink-muted leading-relaxed font-medium">
                    Organizations group doctors and patients under centralized management protocols.
                  </p>

                  <div className="pt-4 space-y-3">
                    <button className="w-full flex items-center justify-between p-4 bg-white/60 hover:bg-white rounded-2xl transition-all group">
                      <span className="font-bold text-sm text-medilink-ink">View Directory</span>
                      <ChevronRight className="w-5 h-5 text-medilink-muted group-hover:translate-x-1 transition-transform" />
                    </button>
                    <button className="w-full flex items-center justify-between p-4 bg-white/60 hover:bg-white rounded-2xl transition-all group">
                      <span className="font-bold text-sm text-medilink-ink">System Audit Logs</span>
                      <ChevronRight className="w-5 h-5 text-medilink-muted group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </GlassBox>
            </div>
          </div>
        </div>
      </AnimatedPage>
    </DashboardLayout>
  );
}

export default AdminDashboard;
