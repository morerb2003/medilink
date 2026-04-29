import { useContext } from 'react';
import { useQuery } from '@tanstack/react-query';
import Spinner from '../../components/common/Spinner.jsx';
import QRCodeDisplay from '../../components/patient/QRCodeDisplay.jsx';
import { NotificationContext } from '../../context/NotificationContext.jsx';
import { useAuth } from '../../hooks/useAuth';
import * as patientService from '../../services/patientService';

function GenerateQR() {
  const { userId } = useAuth();
  const notifications = useContext(NotificationContext);
  const qrQuery = useQuery({
    queryKey: ['patient', 'qr', userId],
    queryFn: () => patientService.generateQR(userId),
    enabled: false,
  });

  async function generateQr() {
    try {
      await qrQuery.refetch();
      notifications?.notifySuccess('Emergency QR generated.');
    } catch {
      notifications?.notifyError('Unable to generate QR code.');
    }
  }

  return (
    <div className="space-y-6">
      <div className="surface-card flex items-center justify-between gap-4 p-6">
        <div>
          <h2 className="section-title">Patient QR access card</h2>
          <p className="section-copy mt-1">
            Generate a signed QR token that emergency staff can use to open the break-glass
            profile.
          </p>
        </div>
        <button
          type="button"
          onClick={generateQr}
          className="rounded-2xl bg-medilink-mint px-5 py-3 text-sm font-semibold text-white transition hover:bg-medilink-mint/90"
        >
          Generate now
        </button>
      </div>

      {qrQuery.isFetching ? <Spinner label="Generating QR..." /> : null}

      <QRCodeDisplay qrToken={qrQuery.data?.qrToken} qrImage={qrQuery.data?.qrImage} />
    </div>
  );
}

export default GenerateQR;
