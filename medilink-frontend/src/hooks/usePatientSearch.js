import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';

export function usePatientSearch(initialQuery = '') {
  const [query, setQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedQuery(query);
    }, 350);

    return () => {
      window.clearTimeout(timer);
    };
  }, [query]);

  const searchQuery = useQuery({
    queryKey: ['patients', 'search', debouncedQuery],
    queryFn: async () => [],
    enabled: debouncedQuery.trim().length >= 2,
    initialData: [],
  });

  return {
    query,
    setQuery,
    debouncedQuery,
    results: searchQuery.data,
    isLoading: searchQuery.isLoading,
  };
}
