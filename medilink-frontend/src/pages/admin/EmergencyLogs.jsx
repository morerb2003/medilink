import AuditLogTable from '../../components/admin/AuditLogTable.jsx';

function EmergencyLogs() {
  return (
    <div className="space-y-6">
      <div className="surface-card p-6">
        <h2 className="section-title">Emergency event review</h2>
        <p className="section-copy mt-1">
          Break-glass events will land here once the admin emergency log endpoint is exposed.
        </p>
      </div>
      <AuditLogTable rows={[]} />
    </div>
  );
}

export default EmergencyLogs;
