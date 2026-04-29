function SnapshotCard({ snapshot }) {
  if (!snapshot) {
    return (
      <div className="surface-card p-6">
        <h3 className="section-title">Emergency snapshot</h3>
        <p className="section-copy mt-2">
          Run an emergency lookup to render the minimum life-saving profile here.
        </p>
      </div>
    );
  }

  return (
    <div className="surface-card space-y-5 p-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-medilink-coral">
          Break-glass view
        </p>
        <h3 className="mt-2 text-2xl">{snapshot.fullName}</h3>
        <p className="mt-1 text-sm text-medilink-muted">Blood group: {snapshot.bloodGroup || 'Unknown'}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <p className="text-sm font-semibold text-medilink-ink">Allergies</p>
          <ul className="mt-2 space-y-2 text-sm text-medilink-muted">
            {(snapshot.allergies || []).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold text-medilink-ink">Current medications</p>
          <ul className="mt-2 space-y-2 text-sm text-medilink-muted">
            {(snapshot.currentMedications || []).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold text-medilink-ink">Chronic conditions</p>
          <ul className="mt-2 space-y-2 text-sm text-medilink-muted">
            {(snapshot.chronicConditions || []).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold text-medilink-ink">Emergency contact</p>
          <div className="mt-2 space-y-2 text-sm text-medilink-muted">
            <p>{snapshot.emergencyContact?.name || 'Not recorded'}</p>
            <p>{snapshot.emergencyContact?.phone || 'No phone listed'}</p>
            <p>{snapshot.emergencyContact?.relation || 'Relationship unavailable'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SnapshotCard;
