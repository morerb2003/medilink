import { useMemo, useState } from 'react';
import Badge from '../common/Badge.jsx';
import Button from '../common/Button.jsx';
import Modal from '../common/Modal.jsx';
import { formatDate } from '../../utils/formatters';

function ConsentManager({ requests, onApprove, onReject, onRevoke, busyId }) {
  const [selectedRequest, setSelectedRequest] = useState(null);

  const sortedRequests = useMemo(
    () =>
      [...requests].sort(
        (left, right) => new Date(right.createdAt || 0).getTime() - new Date(left.createdAt || 0).getTime(),
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
                    Doctor ID: {request.doctorId || 'Pending backend inbox mapping'}
                  </p>
                  <p className="text-sm text-medilink-muted">
                    Requested {formatDate(request.createdAt, { includeTime: true })}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    onClick={() => onApprove?.(request.id)}
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
