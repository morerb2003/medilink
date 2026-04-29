import { useContext, useState } from 'react';
import ConsentManager from '../../components/patient/ConsentManager.jsx';
import { NotificationContext } from '../../context/NotificationContext.jsx';
import { useAuth } from '../../hooks/useAuth';
import {
  useApproveConsent,
  useConsentRequests,
  useRejectConsent,
  useRevokeConsent,
} from '../../hooks/useConsent';

function ConsentRequests() {
  const { userId } = useAuth();
  const notifications = useContext(NotificationContext);
  const consentQuery = useConsentRequests(userId, 'PATIENT');
  const approveMutation = useApproveConsent();
  const rejectMutation = useRejectConsent();
  const revokeMutation = useRevokeConsent();
  const [busyId, setBusyId] = useState(null);

  async function runAction(action, consentId, successMessage) {
    setBusyId(consentId);
    try {
      await action(consentId);
      notifications?.notifySuccess(successMessage);
      consentQuery.refetch();
    } catch (error) {
      notifications?.notifyError(
        error.response?.data?.message || 'Consent action failed or is waiting on backend support.',
      );
    } finally {
      setBusyId(null);
    }
  }

  return (
    <ConsentManager
      requests={consentQuery.data || []}
      busyId={busyId}
      onApprove={(consentId) => runAction(approveMutation.mutateAsync, consentId, 'Consent approved.')}
      onReject={(consentId) => runAction(rejectMutation.mutateAsync, consentId, 'Consent rejected.')}
      onRevoke={(consentId) => runAction(revokeMutation.mutateAsync, consentId, 'Consent revoked.')}
    />
  );
}

export default ConsentRequests;
