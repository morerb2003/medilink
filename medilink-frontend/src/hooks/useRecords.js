import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as recordService from '../services/recordService';

function applyRecordFilters(records, filters) {
  return records.filter((record) => {
    if (filters.recordType && record.recordType !== filters.recordType) {
      return false;
    }

    if (filters.search && !record.title.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }

    return true;
  });
}

export function useMyRecords(patientId, filters = {}) {
  return useQuery({
    queryKey: ['records', 'mine', patientId, filters],
    queryFn: async () => {
      const records = await recordService.listMine(patientId);
      return applyRecordFilters(records, filters);
    },
    enabled: Boolean(patientId),
  });
}

export function usePatientRecords(patientId, doctorId, filters = {}) {
  return useQuery({
    queryKey: ['records', 'patient', patientId, doctorId, filters],
    queryFn: async () => {
      const records = await recordService.listForPatient(patientId, doctorId);
      return applyRecordFilters(records, filters);
    },
    enabled: Boolean(patientId && doctorId),
  });
}

export function useUploadRecord() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: recordService.upload,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['records'] });
    },
  });
}
