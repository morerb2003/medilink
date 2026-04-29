import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as consentService from '../services/consentService';

export function useConsentRequests(userId, role) {
  return useQuery({
    queryKey: ['consent', 'requests', role, userId],
    queryFn: () => consentService.listRequests({ userId, role }),
    enabled: Boolean(userId && role),
    initialData: [],
  });
}

export function useConsentCheck(patientId, doctorId) {
  return useQuery({
    queryKey: ['consent', 'check', patientId, doctorId],
    queryFn: () => consentService.checkConsent(patientId, doctorId),
    enabled: Boolean(patientId && doctorId),
  });
}

function useConsentMutation(mutationFn) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['consent'] });
    },
  });
}

export function useRequestConsent() {
  return useConsentMutation(consentService.request);
}

export function useApproveConsent() {
  return useConsentMutation(consentService.approve);
}

export function useRejectConsent() {
  return useConsentMutation(consentService.reject);
}

export function useRevokeConsent() {
  return useConsentMutation(consentService.revoke);
}
