import { useContext } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import Spinner from '../../components/common/Spinner.jsx';
import EmergencyProfile from '../../components/patient/EmergencyProfile.jsx';
import { NotificationContext } from '../../context/NotificationContext.jsx';
import { useAuth } from '../../hooks/useAuth';
import { useConsentRequests } from '../../hooks/useConsent';
import { useMyRecords } from '../../hooks/useRecords';
import * as patientService from '../../services/patientService';
import { formatDate } from '../../utils/formatters';

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
    return <Spinner label="Loading patient workspace..." />;
  }

  const records = recordsQuery.data || [];
  const pendingConsents = (consentQuery.data || []).filter((item) => item.status === 'PENDING');

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="surface-card p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-medilink-muted">
            Records
          </p>
          <p className="mt-4 text-3xl font-semibold">{records.length}</p>
        </div>
        <div className="surface-card p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-medilink-muted">
            Pending consents
          </p>
          <p className="mt-4 text-3xl font-semibold">{pendingConsents.length}</p>
        </div>
        <div className="surface-card p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-medilink-muted">
            Latest record
          </p>
          <p className="mt-4 text-lg font-semibold">
            {records[0] ? formatDate(records[0].recordDate || records[0].createdAt) : 'No uploads yet'}
          </p>
        </div>
      </div>

      <EmergencyProfile
        profile={profileQuery.data}
        onSave={(payload) => updateProfile.mutateAsync(payload)}
        isSaving={updateProfile.isPending}
      />
    </div>
  );
}

export default Dashboard;
