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
import WellnessScore from '../../components/patient/WellnessScore.jsx';
import MedicineTracker from '../../components/patient/MedicineTracker.jsx';

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
        <div className="mb-12">
          <h1 className="text-5xl font-display font-black text-medilink-ink tracking-tight leading-none mb-3">
            Health Intelligence
          </h1>
          <p className="text-medilink-muted font-bold uppercase tracking-[0.4em] text-[10px] opacity-60">
            MediLink Neural Grid • Session Active
          </p>
        </div>

        {/* Row 1: Analytics & Triage */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-10">
          <WellnessScore profile={profileQuery.data} />
          <div className="lg:col-span-2">
            <AITriage />
          </div>
        </div>

        {/* Row 2: Operations & Care */}
        <div className="mb-10">
          <h2 className="text-xl font-black text-medilink-ink uppercase tracking-[0.3em] mb-8 flex items-center gap-4">
            Operations Center <div className="h-0.5 flex-1 bg-medilink-border/50" />
          </h2>
          <div className="grid gap-10 lg:grid-cols-2 items-start">
            <MedicineTracker />
            <EmergencyProfile
              profile={profileQuery.data}
              onSave={(payload) => updateProfile.mutateAsync(payload)}
              isSaving={updateProfile.isPending}
            />
          </div>
        </div>
      </AnimatedPage>
    </DashboardLayout>
  );
}

export default Dashboard;
