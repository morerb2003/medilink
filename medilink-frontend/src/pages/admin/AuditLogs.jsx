import AuditLogTable from '../../components/admin/AuditLogTable.jsx';

function AuditLogs() {
  return (
    <div className="space-y-6">
      <div className="surface-card p-6">
        <h2 className="section-title">Audit log explorer</h2>
        <p className="section-copy mt-1">
          The filters, export area, and table shell are ready for the backend audit endpoint.
        </p>
      </div>
      <AuditLogTable rows={[]} />
    </div>
  );
}

export default AuditLogs;
