import { formatDate } from '../../utils/formatters';

function AuditLogTable({ rows }) {
  return (
    <div className="surface-card overflow-hidden">
      <div className="border-b border-medilink-border px-6 py-5">
        <h3 className="section-title">Audit events</h3>
        <p className="section-copy mt-1">
          The table shell is ready for filters, pagination, and CSV export once the API lands.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-medilink-border text-left text-sm">
          <thead className="bg-medilink-goldSoft/45 text-medilink-muted">
            <tr>
              <th className="px-6 py-3 font-semibold">Type</th>
              <th className="px-6 py-3 font-semibold">User</th>
              <th className="px-6 py-3 font-semibold">Patient</th>
              <th className="px-6 py-3 font-semibold">Timestamp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-medilink-border bg-white">
            {rows.length ? (
              rows.map((row) => (
                <tr key={row.id}>
                  <td className="px-6 py-4 font-medium text-medilink-ink">{row.type}</td>
                  <td className="px-6 py-4 text-medilink-muted">{row.user}</td>
                  <td className="px-6 py-4 text-medilink-muted">{row.patient}</td>
                  <td className="px-6 py-4 text-medilink-muted">
                    {formatDate(row.timestamp, { includeTime: true })}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="px-6 py-8 text-medilink-muted" colSpan="4">
                  No audit events are wired to the frontend yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AuditLogTable;
