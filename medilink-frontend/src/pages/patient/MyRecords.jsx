import { useContext, useState } from 'react';
import Spinner from '../../components/common/Spinner.jsx';
import RecordUpload from '../../components/patient/RecordUpload.jsx';
import { NotificationContext } from '../../context/NotificationContext.jsx';
import { useAuth } from '../../hooks/useAuth';
import { useMyRecords, useUploadRecord } from '../../hooks/useRecords';
import { formatDate, formatFileSize } from '../../utils/formatters';

function MyRecords() {
  const { userId } = useAuth();
  const notifications = useContext(NotificationContext);
  const [filters, setFilters] = useState({
    search: '',
    recordType: '',
  });
  const recordsQuery = useMyRecords(userId, filters);
  const uploadMutation = useUploadRecord();

  async function handleUpload(payload) {
    try {
      await uploadMutation.mutateAsync({
        ...payload,
        patientId: userId,
      });
      notifications?.notifySuccess('Record upload submitted.');
    } catch (error) {
      notifications?.notifyError(
        error.response?.data?.message ||
          'Upload endpoint is not active yet, but the frontend form is ready.',
      );
    }
  }

  return (
    <div className="space-y-6">
      <RecordUpload
        onUpload={handleUpload}
        isUploading={uploadMutation.isPending}
      />

      <div className="surface-card p-6">
        <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h3 className="section-title">Record timeline</h3>
            <p className="section-copy mt-1">
              Filter the patient archive by title or structured record type.
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <input
              className="field-input"
              placeholder="Search title"
              value={filters.search}
              onChange={(event) =>
                setFilters((current) => ({
                  ...current,
                  search: event.target.value,
                }))
              }
            />
            <select
              className="field-input"
              value={filters.recordType}
              onChange={(event) =>
                setFilters((current) => ({
                  ...current,
                  recordType: event.target.value,
                }))
              }
            >
              <option value="">All types</option>
              <option value="LAB_REPORT">Lab report</option>
              <option value="PRESCRIPTION">Prescription</option>
              <option value="IMAGING">Imaging</option>
              <option value="DISCHARGE_SUMMARY">Discharge summary</option>
            </select>
          </div>
        </div>

        {recordsQuery.isLoading ? (
          <Spinner label="Loading records..." />
        ) : (
          <div className="space-y-4">
            {(recordsQuery.data || []).map((record) => (
              <div
                key={record.id}
                className="rounded-3xl border border-medilink-border bg-white/80 p-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h4 className="font-semibold text-medilink-ink">{record.title}</h4>
                    <p className="mt-1 text-sm text-medilink-muted">
                      {record.recordType.replaceAll('_', ' ')} ·{' '}
                      {formatDate(record.recordDate || record.createdAt)}
                    </p>
                    <p className="mt-1 text-sm text-medilink-muted">
                      {record.hospitalName || 'Independent upload'} ·{' '}
                      {formatFileSize(record.fileSizeBytes)}
                    </p>
                  </div>
                  {record.fileUrl ? (
                    <a
                      className="text-sm font-semibold text-medilink-mint"
                      href={record.fileUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      View file
                    </a>
                  ) : null}
                </div>
              </div>
            ))}

            {!recordsQuery.data?.length ? (
              <div className="rounded-3xl border border-dashed border-medilink-border px-4 py-10 text-sm text-medilink-muted">
                No records available yet.
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyRecords;
