import { useMemo, useState } from 'react';
import Badge from '../common/Badge.jsx';
import Button from '../common/Button.jsx';
import Modal from '../common/Modal.jsx';
import { formatDate } from '../../utils/formatters';

function ConsentManager({ requests, onApprove, onReject, onRevoke, busyId }) {
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [approvingRequest, setApprovingRequest] = useState(null);
  const [selectedDuration, setSelectedDuration] = useState(24);

  const sortedRequests = useMemo(
    () =>
      [...requests].sort(
        (left, right) =>
          new Date(right.requestedAt || 0).getTime() - new Date(left.requestedAt || 0).getTime(),
      ),
    [requests],
  );

  return (
    <div className="surface-card p-6">
      <div className="mb-5">
        <h3 className="section-title">Consent inbox</h3>
        <p className="section-copy mt-1">
          Review incoming doctor requests, then approve, reject, or revoke access when the
          clinical window closes.
        </p>
      </div>

      <div className="space-y-4">
        {sortedRequests.length ? (
          sortedRequests.map((request) => (
            <div
              key={request.id}
              className="rounded-3xl border border-medilink-border bg-white/80 p-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-medilink-ink">
                      {request.reason || 'Consultation access'}
                    </h4>
                    <Badge tone={request.status === 'APPROVED' ? 'success' : 'pending'}>
                      {request.status || 'PENDING'}
                    </Badge>
                  </div>
                  <p className="text-sm text-medilink-muted">
                    Doctor: {request.doctorName || request.doctorId || 'Pending backend inbox mapping'}
                  </p>
                  <p className="text-sm text-medilink-muted">
                    Requested {formatDate(request.requestedAt, { includeTime: true })}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    onClick={() => setApprovingRequest(request)}
                    disabled={busyId === request.id}
                  >
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => onReject?.(request.id)}
                    disabled={busyId === request.id}
                  >
                    Reject
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => setSelectedRequest(request)}
                    disabled={busyId === request.id}
                  >
                    Revoke
                  </Button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-3xl border border-dashed border-medilink-border px-5 py-10 text-sm text-medilink-muted">
            No live consent inbox items yet. The scaffold is ready for the backend listing
            endpoint.
          </div>
        )}
      </div>

      <Modal
        open={Boolean(approvingRequest)}
        title="Approve Access Request"
        description="Select how long this clinical team can view your records. Access will auto-expire."
        confirmLabel="Confirm Approval"
        onConfirm={() => {
          if (approvingRequest) {
            onApprove?.(approvingRequest.id, selectedDuration);
          }
          setApprovingRequest(null);
        }}
        onClose={() => setApprovingRequest(null)}
      >
        <div className="space-y-4">
          <p className="text-sm font-bold text-medilink-ink">Duration of Access:</p>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: '2 Hours', value: 2 },
              { label: '24 Hours', value: 24 },
              { label: '1 Week', value: 168 },
            ].map((d) => (
              <button
                key={d.value}
                type="button"
                onClick={() => setSelectedDuration(d.value)}
                className={`py-3 rounded-xl text-xs font-black uppercase tracking-widest border-2 transition-all ${
                  selectedDuration === d.value
                    ? 'border-medilink-mint bg-medilink-mint/10 text-medilink-mint'
                    : 'border-medilink-border text-medilink-muted hover:border-medilink-muted'
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>
      </Modal>

      <Modal
        open={Boolean(selectedRequest)}
        title="Revoke this consent?"
        description="Use revoke when the treatment window is over or the patient wants to close access immediately."
        confirmLabel="Revoke access"
        onConfirm={() => {
          if (selectedRequest) {
            onRevoke?.(selectedRequest.id);
          }
          setSelectedRequest(null);
        }}
        onClose={() => setSelectedRequest(null)}
      >
        <p className="section-copy">
          {selectedRequest?.reason || 'This access request'} will be marked as no longer valid
          for doctor review.
        </p>
      </Modal>
    </div>
  );
}

export default ConsentManager;
