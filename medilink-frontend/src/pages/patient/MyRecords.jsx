import { useContext, useState } from 'react';
import Spinner from '../../components/common/Spinner.jsx';
import RecordUpload from '../../components/patient/RecordUpload.jsx';
import { NotificationContext } from '../../context/NotificationContext.jsx';
import { useAuth } from '../../hooks/useAuth';
import { useMyRecords, useUploadRecord } from '../../hooks/useRecords';
import { formatDate } from '../../utils/formatters';
import HealthJourney from '../../components/patient/HealthJourney.jsx';

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
    <div className="space-y-12">
      <RecordUpload
        onUpload={handleUpload}
        isUploading={uploadMutation.isPending}
      />

      <div className="space-y-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <h3 className="text-3xl font-display font-black text-medilink-ink tracking-tight uppercase">Health Narrative</h3>
            <p className="text-medilink-muted text-sm font-bold opacity-60 mt-1 uppercase tracking-widest">
              A chronological history of your medical data
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            <div className="relative">
              <input
                className="field-input !pl-10 !h-12 w-64"
                placeholder="Search history..."
                value={filters.search}
                onChange={(event) =>
                  setFilters((current) => ({
                    ...current,
                    search: event.target.value,
                  }))
                }
              />
              <div className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-medilink-muted opacity-40">
                {/* Search Icon Placeholder */}
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </div>
            </div>
            <select
              className="field-input !h-12 !pr-10"
              value={filters.recordType}
              onChange={(event) =>
                setFilters((current) => ({
                  ...current,
                  recordType: event.target.value,
                }))
              }
            >
              <option value="">All Categories</option>
              <option value="LAB_REPORT">Diagnostics</option>
              <option value="PRESCRIPTION">Prescriptions</option>
              <option value="IMAGING">Radiology</option>
              <option value="DISCHARGE_SUMMARY">Summaries</option>
            </select>
          </div>
        </div>

        {recordsQuery.isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Spinner label="Sequencing your medical timeline..." />
          </div>
        ) : (
          <HealthJourney records={recordsQuery.data || []} />
        )}
      </div>
    </div>
  );
}

export default MyRecords;
