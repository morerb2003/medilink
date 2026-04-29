import { useContext } from 'react';
import { useParams } from 'react-router-dom';
import AccessRequestForm from '../../components/doctor/AccessRequestForm.jsx';
import Badge from '../../components/common/Badge.jsx';
import Spinner from '../../components/common/Spinner.jsx';
import { NotificationContext } from '../../context/NotificationContext.jsx';
import { useAuth } from '../../hooks/useAuth';
import { useConsentCheck, useRequestConsent } from '../../hooks/useConsent';
import { usePatientRecords } from '../../hooks/useRecords';
import { formatDate, formatFileSize } from '../../utils/formatters';

function PatientRecords() {
  const { patientId } = useParams();
  const { userId } = useAuth();
  const notifications = useContext(NotificationContext);
  const consentCheck = useConsentCheck(patientId, userId);
  const recordsQuery = usePatientRecords(patientId, userId);
  const requestConsent = useRequestConsent();

  async function handleRequest(payload) {
    try {
      await requestConsent.mutateAsync({
        patientId: payload.patientId,
        doctorId: userId,
        reason: payload.reason,
      });
      notifications?.notifySuccess('Consent request sent to patient.');
    } catch (error) {
      notifications?.notifyError(error.response?.data?.message || 'Unable to request access.');
    }
  }

  const canViewRecords = Boolean(consentCheck.data?.valid);

  return (
    <div className="space-y-6">
      <div className="surface-card flex flex-wrap items-center justify-between gap-4 p-6">
        <div>
          <h2 className="section-title">Patient records</h2>
          <p className="section-copy mt-1">Patient ID: {patientId}</p>
        </div>
        <Badge tone={canViewRecords ? 'success' : 'pending'}>
          {canViewRecords ? 'Consent active' : 'Consent required'}
        </Badge>
      </div>

      {!canViewRecords ? (
        <AccessRequestForm
          patientId={patientId}
          onSubmit={handleRequest}
          isSubmitting={requestConsent.isPending}
        />
      ) : null}

      <div className="surface-card p-6">
        <div className="mb-5">
          <h3 className="section-title">Clinical document timeline</h3>
          <p className="section-copy mt-1">
            Records render only when the patient has granted active consent.
          </p>
        </div>

        {recordsQuery.isLoading || consentCheck.isLoading ? (
          <Spinner label="Loading patient records..." />
        ) : !canViewRecords ? (
          <div className="rounded-3xl border border-dashed border-medilink-border px-4 py-10 text-sm text-medilink-muted">
            Submit a consent request to unlock this record list.
          </div>
        ) : (
          <div className="space-y-4">
            {(recordsQuery.data || []).map((record) => (
              <div
                key={record.id}
                className="rounded-3xl border border-medilink-border bg-white/80 p-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h4 className="font-semibold text-medilink-ink">{record.title}</h4>
                    <p className="mt-1 text-sm text-medilink-muted">
                      {record.recordType.replaceAll('_', ' ')} ·{' '}
                      {formatDate(record.recordDate || record.createdAt)}
                    </p>
                    <p className="mt-1 text-sm text-medilink-muted">
                      {record.uploadedByLabel || 'Uploader unavailable'} ·{' '}
                      {formatFileSize(record.fileSizeBytes)}
                    </p>
                  </div>
                  {record.fileUrl ? (
                    <a
                      href={record.fileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm font-semibold text-medilink-mint"
                    >
                      Open file
                    </a>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default PatientRecords;
