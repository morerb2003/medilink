import { useQuery } from '@tanstack/react-query';
import { 
  Users, 
  Search, 
  Filter, 
  MoreVertical, 
  UserPlus,
  Shield,
  Stethoscope,
  Activity
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout.jsx';
import GlassBox from '../../components/common/GlassBox.jsx';
import AnimatedPage from '../../components/common/AnimatedPage.jsx';
import api from '../../services/api';

function ManageUsers() {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');

  // For this demo, we'll fetch doctors and patients separately or a unified list
  // Assuming the backend has a general user list endpoint for admins
  const { data: users, isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: () => api.get('admin/stats').then(() => [
      // Mocking some users since we don't have a dedicated "all users" endpoint yet
      // In a real app, you'd call api.get('admin/users')
      { id: 1, fullName: 'Dr. Sarah Connor', email: 'sarah.c@medilink.com', role: 'DOCTOR', verified: true, hospital: 'City General' },
      { id: 2, fullName: 'John Doe', email: 'john.doe@gmail.com', role: 'PATIENT', verified: true, healthId: 'JD-12345' },
      { id: 3, fullName: 'Dr. James Smith', email: 'james.s@medilink.com', role: 'DOCTOR', verified: false, hospital: 'St. Marys' },
    ])
  });

  const filteredUsers = users?.filter(user => {
    const matchesSearch = user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'ALL' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <DashboardLayout role="admin">
      <AnimatedPage>
        <div className="space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <span className="inline-block px-3 py-1 text-[10px] font-black uppercase tracking-[0.4em] text-medilink-mint bg-medilink-mint/10 rounded-full mb-4">
                User Governance
              </span>
              <h1 className="text-4xl font-display font-black text-medilink-ink tracking-tight">
                User <span className="text-gradient">Directory</span>
              </h1>
              <p className="text-medilink-muted mt-2 font-medium opacity-70">
                Audit, manage, and verify all participants within the MediLink network.
              </p>
            </div>

            <div className="flex gap-3">
              <button className="premium-button bg-medilink-ink text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-3 shadow-xl">
                <UserPlus className="w-5 h-5" />
                <span>Invite User</span>
              </button>
            </div>
          </div>

          {/* Filters */}
          <GlassBox className="!p-4 flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-medilink-muted w-5 h-5" />
              <input 
                type="text" 
                placeholder="Search by name, email, or ID..."
                className="w-full bg-medilink-canvas/50 border border-medilink-border rounded-xl py-3 pl-12 pr-4 font-bold text-sm focus:outline-none focus:border-medilink-mint transition-colors"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-4">
              <select 
                className="bg-medilink-canvas/50 border border-medilink-border rounded-xl px-4 py-3 font-bold text-sm focus:outline-none focus:border-medilink-mint transition-colors"
                value={roleFilter}
                onChange={e => setRoleFilter(e.target.value)}
              >
                <option value="ALL">All Roles</option>
                <option value="DOCTOR">Practitioners</option>
                <option value="PATIENT">Patients</option>
                <option value="ADMIN">Administrators</option>
              </select>
              <button className="p-3 bg-medilink-canvas border border-medilink-border rounded-xl hover:bg-medilink-border transition-colors">
                <Filter className="w-5 h-5 text-medilink-muted" />
              </button>
            </div>
          </GlassBox>

          {/* User Table */}
          <GlassBox className="overflow-hidden !p-0">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-medilink-canvas/50 border-b border-medilink-border">
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-medilink-muted opacity-60">User Identity</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-medilink-muted opacity-60">Access Role</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-medilink-muted opacity-60">Status</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-medilink-muted opacity-60">Organization</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-medilink-muted opacity-60"></th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers?.map((user) => (
                  <motion.tr 
                    key={user.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border-b border-medilink-border/50 hover:bg-medilink-mint/5 transition-colors group"
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-medilink-canvas border border-medilink-border flex items-center justify-center font-bold text-medilink-muted group-hover:bg-white transition-colors">
                          {user.fullName.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-medilink-ink">{user.fullName}</p>
                          <p className="text-xs text-medilink-muted font-medium">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        {user.role === 'DOCTOR' ? (
                          <Stethoscope className="w-4 h-4 text-medilink-gold" />
                        ) : (
                          <Activity className="w-4 h-4 text-medilink-mint" />
                        )}
                        <span className="text-xs font-bold text-medilink-ink uppercase tracking-wider">{user.role}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        user.verified 
                        ? 'bg-emerald-100 text-emerald-600' 
                        : 'bg-amber-100 text-amber-600'
                      }`}>
                        {user.verified ? 'Verified' : 'Pending'}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-xs font-bold text-medilink-muted">{user.hospital || user.healthId || 'System'}</p>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button className="p-2 hover:bg-medilink-canvas rounded-lg transition-colors text-medilink-muted">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
            
            {filteredUsers?.length === 0 && (
              <div className="py-20 text-center">
                <Users className="w-12 h-12 text-medilink-muted/20 mx-auto mb-4" />
                <p className="text-medilink-muted font-bold text-sm uppercase tracking-widest">No matching users found</p>
              </div>
            )}
          </GlassBox>
        </div>
      </AnimatedPage>
    </DashboardLayout>
  );
}

export default ManageUsers;
