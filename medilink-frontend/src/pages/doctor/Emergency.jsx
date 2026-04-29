import { useContext, useState } from 'react';
import EmergencyAccess from '../../components/doctor/EmergencyAccess.jsx';
import SnapshotCard from '../../components/doctor/SnapshotCard.jsx';
import { NotificationContext } from '../../context/NotificationContext.jsx';
import { useAuth } from '../../hooks/useAuth';
import { useAccessByHealthId, useAccessByQR } from '../../hooks/useEmergency';

function Emergency() {
  const { userId } = useAuth();
  const notifications = useContext(NotificationContext);
  const [snapshot, setSnapshot] = useState(null);
  const accessByHealthId = useAccessByHealthId();
  const accessByQR = useAccessByQR();

  async function openByHealthId(healthId) {
    try {
      const data = await accessByHealthId.mutateAsync({
        healthId,
        doctorId: userId,
      });
      setSnapshot(data);
      notifications?.notifySuccess('Emergency profile opened.');
    } catch (error) {
      notifications?.notifyError(error.response?.data?.message || 'Emergency lookup failed.');
    }
  }

  async function openByQr(token) {
    try {
      const data = await accessByQR.mutateAsync({
        token,
        doctorId: userId,
      });
      setSnapshot(data);
      notifications?.notifySuccess('QR emergency profile opened.');
    } catch (error) {
      notifications?.notifyError(error.response?.data?.message || 'QR access failed.');
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
      <EmergencyAccess
        onAccessByHealthId={openByHealthId}
        onAccessByQr={openByQr}
        isSubmitting={accessByHealthId.isPending || accessByQR.isPending}
      />
      <SnapshotCard snapshot={snapshot} />
    </div>
  );
}

export default Emergency;
