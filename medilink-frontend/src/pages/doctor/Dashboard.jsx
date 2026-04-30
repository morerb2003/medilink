import { useContext } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Activity, Clock, PlusCircle, AlertTriangle, User } from 'lucide-react';
import AccessRequestForm from '../../components/doctor/AccessRequestForm.jsx';
import PatientSearch from '../../components/doctor/PatientSearch.jsx';
import Spinner from '../../components/common/Spinner.jsx';
import DashboardStat from '../../components/common/DashboardStat.jsx';
import DashboardLayout from '../../components/layout/DashboardLayout.jsx';
import AnimatedPage from '../../components/common/AnimatedPage.jsx';
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
      const response = await api.get(`practitioners/${userId}/history`);
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
    <DashboardLayout role="doctor">
      <AnimatedPage>
        <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-display font-bold text-medilink-ink">Clinical Panel</h1>
            <p className="text-medilink-muted mt-2">Manage patient discovery and secure record requests from one central hub.</p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/doctor/emergency')}
            className="flex items-center gap-3 rounded-2xl bg-medilink-coral px-6 py-4 text-base font-bold text-white shadow-lg shadow-medilink-coral/20 transition hover:scale-105 active:scale-95"
          >
            <AlertTriangle className="w-5 h-5" />
            <span>Emergency Access</span>
          </button>
        </div>

        <div className="grid gap-6 md:grid-cols-3 mb-10">
          <DashboardStat 
            label="Active Sessions" 
            value={historyQuery.data?.length || 0} 
            icon={Activity} 
            color="mint"
          />
          <DashboardStat 
            label="Last Access" 
            value={historyQuery.data?.[0] ? formatDate(historyQuery.data[0].accessedAt) : 'None'} 
            icon={Clock} 
            color="gold"
          />
          <DashboardStat 
            label="Pending Requests" 
            value={0} 
            icon={PlusCircle} 
            color="coral"
          />
        </div>

        <div className="grid gap-10 xl:grid-cols-[1.1fr_0.9fr] mb-10">
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

        <div className="surface-card p-10">
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-medilink-ink">Access Audit Trail</h3>
            <p className="text-medilink-muted mt-2">
              Chronological log of patient data entries accessed under your credentials.
            </p>
          </div>

          {historyQuery.isLoading ? (
            <div className="flex flex-col items-center py-12">
              <Spinner label="Decrypting audit logs..." />
            </div>
          ) : (
            <div className="space-y-4">
              {(historyQuery.data || []).slice(0, 5).map((event) => (
                <div
                  key={event.id}
                  className="flex items-center justify-between p-5 rounded-2xl border border-medilink-border/50 bg-medilink-canvas/20 hover:bg-white hover:shadow-xl hover:border-medilink-mint/20 transition-all duration-300"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-medilink-mintSoft flex items-center justify-center">
                      <User className="text-medilink-mint w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-medilink-ink">Patient ID: {event.patientId.slice(0, 8)}...</p>
                      <p className="text-xs text-medilink-muted uppercase tracking-widest font-bold mt-1">Method: {event.accessMethod || 'EMERGENCY'}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-medilink-ink">{formatDate(event.accessedAt, { includeTime: true })}</p>
                    <p className="text-xs text-medilink-mint font-bold mt-1">Verified Access</p>
                  </div>
                </div>
              ))}
              {(!historyQuery.data || historyQuery.data.length === 0) && (
                <div className="text-center py-12 border-2 border-dashed border-medilink-border/50 rounded-3xl">
                  <p className="text-medilink-muted">No recent access history found.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </AnimatedPage>
    </DashboardLayout>
  );
}

export default Dashboard;
