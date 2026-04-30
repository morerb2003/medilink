import { useContext } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { FileText, ShieldCheck, Clock } from 'lucide-react';
import Spinner from '../../components/common/Spinner.jsx';
import DashboardStat from '../../components/common/DashboardStat.jsx';
import DashboardLayout from '../../components/layout/DashboardLayout.jsx';
import AnimatedPage from '../../components/common/AnimatedPage.jsx';
import EmergencyProfile from '../../components/patient/EmergencyProfile.jsx';
import { NotificationContext } from '../../context/NotificationContext.jsx';
import { useAuth } from '../../hooks/useAuth';
import { useConsentRequests } from '../../hooks/useConsent';
import { useMyRecords } from '../../hooks/useRecords';
import * as patientService from '../../services/patientService';
import { formatDate } from '../../utils/formatters';
import AITriage from '../../components/patient/AITriage.jsx';

function Dashboard() {
  const { userId } = useAuth();
  const notifications = useContext(NotificationContext);
  const recordsQuery = useMyRecords(userId);
  const consentQuery = useConsentRequests(userId, 'PATIENT');
  const profileQuery = useQuery({
    queryKey: ['patient', 'profile', userId],
    queryFn: () => patientService.getProfile(userId),
    enabled: Boolean(userId),
  });
  
  const updateProfile = useMutation({
    mutationFn: (payload) => patientService.updateProfile(userId, payload),
    onSuccess: () => {
      notifications?.notifySuccess('Emergency profile updated.');
      profileQuery.refetch();
    },
    onError: () => {
      notifications?.notifyError('Profile update failed.');
    },
  });

  if (recordsQuery.isLoading || profileQuery.isLoading) {
    return (
      <DashboardLayout role="patient">
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <Spinner label="Assembling your health workspace..." />
        </div>
      </DashboardLayout>
    );
  }

  const records = recordsQuery.data || [];
  const pendingConsents = (consentQuery.data || []).filter((item) => item.status === 'PENDING');

  return (
    <DashboardLayout role="patient">
      <AnimatedPage>
        <div className="mb-10">
          <h1 className="text-4xl font-display font-bold text-medilink-ink">Health Command</h1>
          <p className="text-medilink-muted mt-2">Welcome back. Everything in your medical profile is encrypted and secure.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3 mb-10">
          <DashboardStat 
            label="Medical Records" 
            value={records.length} 
            icon={FileText} 
            color="mint"
          />
          <DashboardStat 
            label="Pending Consents" 
            value={pendingConsents.length} 
            icon={ShieldCheck} 
            color="gold"
          />
          <DashboardStat 
            label="Last Activity" 
            value={records[0] ? formatDate(records[0].recordDate || records[0].createdAt) : 'None'} 
            icon={Clock} 
            color="coral"
          />
        </div>

        <div className="mb-10">
          <h2 className="text-xl font-black text-medilink-ink uppercase tracking-[0.3em] mb-6 flex items-center gap-4">
            Operations Center <div className="h-0.5 flex-1 bg-medilink-border/50" />
          </h2>
          <div className="grid gap-10 lg:grid-cols-2 items-start">
            <EmergencyProfile
              profile={profileQuery.data}
              onSave={(payload) => updateProfile.mutateAsync(payload)}
              isSaving={updateProfile.isPending}
            />
            <div className="space-y-10">
              <AITriage />
              
              <div className="glass-card !p-8 bg-gradient-to-br from-medilink-mint/5 to-transparent border-medilink-mint/10">
                <p className="text-[10px] font-black uppercase tracking-widest text-medilink-mint mb-4">Network Notice</p>
                <p className="text-sm font-medium text-medilink-ink leading-relaxed">
                  Your profile is currently synchronized with **{profileQuery.data?.hospitalName || 'ABDM Gateway'}**. All emergency access events are logged to the immutable audit trail.
                </p>
              </div>
            </div>
          </div>
        </div>
      </AnimatedPage>
    </DashboardLayout>
  );
}

export default Dashboard;
