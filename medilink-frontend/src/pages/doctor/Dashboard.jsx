import { useContext } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import AccessRequestForm from '../../components/doctor/AccessRequestForm.jsx';
import PatientSearch from '../../components/doctor/PatientSearch.jsx';
import Spinner from '../../components/common/Spinner.jsx';
import { NotificationContext } from '../../context/NotificationContext.jsx';
import { useAuth } from '../../hooks/useAuth';
import { usePatientSearch } from '../../hooks/usePatientSearch';
import { useRequestConsent } from '../../hooks/useConsent';
import api from '../../services/api';
import { formatDate } from '../../utils/formatters';

function Dashboard() {
  const { userId } = useAuth();
  const notifications = useContext(NotificationContext);
  const navigate = useNavigate();
  const historyQuery = useQuery({
    queryKey: ['doctor', 'history', userId],
    queryFn: async () => {
      const response = await api.get(`doctor/${userId}/history`);
      return response.data;
    },
    enabled: Boolean(userId),
  });
  const patientSearch = usePatientSearch();
  const requestConsent = useRequestConsent();

  async function handleConsentRequest(payload) {
    try {
      await requestConsent.mutateAsync({
        patientId: payload.patientId,
        doctorId: userId,
        reason: payload.reason,
      });
      notifications?.notifySuccess('Consent request sent.');
    } catch (error) {
      notifications?.notifyError(error.response?.data?.message || 'Unable to request access.');
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="surface-card p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-medilink-muted">
            Emergency sessions
          </p>
          <p className="mt-4 text-3xl font-semibold">{historyQuery.data?.length || 0}</p>
        </div>
        <div className="surface-card p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-medilink-muted">
            Most recent access
          </p>
          <p className="mt-4 text-lg font-semibold">
            {historyQuery.data?.[0]
              ? formatDate(historyQuery.data[0].createdAt, { includeTime: true })
              : 'No emergency access yet'}
          </p>
        </div>
        <div className="surface-card p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-medilink-muted">
            Quick route
          </p>
          <button
            type="button"
            onClick={() => navigate('/doctor/emergency')}
            className="mt-4 rounded-2xl bg-medilink-coral px-4 py-3 text-sm font-semibold text-white transition hover:bg-medilink-coral/90"
          >
            Open emergency mode
          </button>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <PatientSearch
          query={patientSearch.query}
          onQueryChange={patientSearch.setQuery}
          results={patientSearch.results}
          isLoading={patientSearch.isLoading}
          onSelectPatient={(patient) => navigate(`/doctor/patients/${patient.id}`)}
        />
        <AccessRequestForm
          onSubmit={handleConsentRequest}
          isSubmitting={requestConsent.isPending}
        />
      </div>

      <div className="surface-card p-6">
        <h3 className="section-title">Recent access summary</h3>
        <p className="section-copy mt-1">
          Review the latest emergency entries from your own history log.
        </p>

        {historyQuery.isLoading ? (
          <div className="mt-5">
            <Spinner label="Loading doctor summary..." />
          </div>
        ) : (
          <div className="mt-5 space-y-3">
            {(historyQuery.data || []).slice(0, 5).map((event) => (
              <div
                key={event.id}
                className="rounded-2xl border border-medilink-border bg-white/80 px-4 py-3 text-sm text-medilink-muted"
              >
                Patient {event.patientId} accessed via {event.accessType || 'EMERGENCY'} on{' '}
                {formatDate(event.createdAt, { includeTime: true })}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
