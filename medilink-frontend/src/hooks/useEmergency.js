import { useMutation } from '@tanstack/react-query';
import * as emergencyService from '../services/emergencyService';

export function useAccessByHealthId() {
  return useMutation({
    mutationFn: emergencyService.accessByHealthId,
  });
}

export function useAccessByQR() {
  return useMutation({
    mutationFn: emergencyService.accessByQR,
  });
}
