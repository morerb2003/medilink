import { useContext } from 'react';
import { useQuery } from '@tanstack/react-query';
import DoctorVerification from '../../components/admin/DoctorVerification.jsx';
import { NotificationContext } from '../../context/NotificationContext.jsx';
import api from '../../services/api';

function ManageUsers() {
  const notifications = useContext(NotificationContext);
  const doctorsQuery = useQuery({
    queryKey: ['admin', 'pending-doctors'],
    queryFn: async () => {
      const response = await api.get('admin/doctors/pending');
      return response.data;
    },
  });

  function handlePendingAction() {
    notifications?.notifyInfo(
      'The review queue is visible. Approve and reject endpoints can be connected next.',
    );
  }

  return (
    <DoctorVerification
      doctors={doctorsQuery.data || []}
      onApprove={handlePendingAction}
      onReject={handlePendingAction}
    />
  );
}

export default ManageUsers;
