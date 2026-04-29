import { useQuery } from '@tanstack/react-query';
import Spinner from '../../components/common/Spinner.jsx';
import SystemStats from '../../components/admin/SystemStats.jsx';
import api from '../../services/api';

function Dashboard() {
  const statsQuery = useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: async () => {
      const response = await api.get('admin/stats');
      return response.data;
    },
  });

  return (
    <div className="space-y-6">
      <div className="surface-card p-6">
        <h2 className="section-title">System command view</h2>
        <p className="section-copy mt-1">
          The admin workspace is wired to live system totals from the backend stats endpoint.
        </p>
      </div>

      {statsQuery.isLoading ? <Spinner label="Loading system stats..." /> : <SystemStats stats={statsQuery.data} />}
    </div>
  );
}

export default Dashboard;
