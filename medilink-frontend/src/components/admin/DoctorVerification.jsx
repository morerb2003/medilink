import Button from '../common/Button.jsx';

function DoctorVerification({ doctors, onApprove, onReject, disabled }) {
  return (
    <div className="surface-card p-6">
      <div>
        <h3 className="section-title">Doctor verification queue</h3>
        <p className="section-copy mt-1">
          Review pending doctors and route them to the next admin action once the backend
          approval endpoints land.
        </p>
      </div>

      <div className="mt-5 space-y-4">
        {doctors.length ? (
          doctors.map((doctor) => (
            <div
              key={doctor.id}
              className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-medilink-border bg-white/80 p-4"
            >
              <div>
                <p className="font-semibold text-medilink-ink">
                  {doctor.fullName || doctor.user?.fullName || 'Doctor pending profile sync'}
                </p>
                <p className="text-sm text-medilink-muted">
                  {doctor.specialization || 'Specialization not provided'}
                </p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={() => onApprove?.(doctor)} disabled={disabled}>
                  Approve
                </Button>
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => onReject?.(doctor)}
                  disabled={disabled}
                >
                  Reject
                </Button>
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-3xl border border-dashed border-medilink-border px-4 py-10 text-sm text-medilink-muted">
            No pending doctor approvals at the moment.
          </div>
        )}
      </div>
    </div>
  );
}

export default DoctorVerification;
