import { useQuery } from '@tanstack/react-query';
import Spinner from '../../components/common/Spinner.jsx';
import { useAuth } from '../../hooks/useAuth';
import api from '../../services/api';
import { formatDate } from '../../utils/formatters';

function AccessHistory() {
  const { userId } = useAuth();
  const historyQuery = useQuery({
    queryKey: ['doctor', 'history', userId],
    queryFn: async () => {
      const response = await api.get(`doctor/${userId}/history`);
      return response.data;
    },
    enabled: Boolean(userId),
  });

  return (
    <div className="surface-card p-6">
      <div className="mb-5">
        <h2 className="section-title">Doctor emergency access history</h2>
        <p className="section-copy mt-1">
          Review your own break-glass events with timestamps and patient references.
        </p>
      </div>

      {historyQuery.isLoading ? (
        <Spinner label="Loading access history..." />
      ) : (
        <div className="space-y-3">
          {(historyQuery.data || []).map((event) => (
            <div
              key={event.id}
              className="rounded-3xl border border-medilink-border bg-white/80 p-4"
            >
              <p className="font-semibold text-medilink-ink">{event.accessType || 'Emergency access'}</p>
              <p className="mt-1 text-sm text-medilink-muted">Patient: {event.patientId}</p>
              <p className="mt-1 text-sm text-medilink-muted">
                {formatDate(event.createdAt, { includeTime: true })}
              </p>
            </div>
          ))}

          {!historyQuery.data?.length ? (
            <div className="rounded-3xl border border-dashed border-medilink-border px-4 py-10 text-sm text-medilink-muted">
              No doctor access history found yet.
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}

export default AccessHistory;
