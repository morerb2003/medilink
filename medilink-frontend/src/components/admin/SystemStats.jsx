import { formatFileSize } from '../../utils/formatters';

function SystemStats({ stats }) {
  const cards = [
    { label: 'Users', value: stats?.totalUsers ?? 0 },
    { label: 'Doctors', value: stats?.totalDoctors ?? 0 },
    { label: 'Patients', value: stats?.totalPatients ?? 0 },
    { label: 'Records', value: stats?.totalRecords ?? 0 },
    { label: 'Emergency events', value: stats?.totalEmergencyAccess ?? 0 },
    { label: 'Storage', value: formatFileSize(stats?.storageUsedBytes ?? 0) },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {cards.map((card) => (
        <div key={card.label} className="surface-card p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-medilink-muted">
            {card.label}
          </p>
          <p className="mt-4 text-3xl font-semibold text-medilink-ink">{card.value}</p>
        </div>
      ))}
    </div>
  );
}

export default SystemStats;
