import { queryOptions, useMutation, QueryClient } from '@tanstack/react-query';
import { api } from './config';

export const valueQueries = {
  healthCheck: () =>
    queryOptions({
      queryKey: ['indices', 'hi'],
      queryFn: () => api.getHealthCheck().then((res) => res.data),
    }),
  allIndices: () =>
    queryOptions({
      queryKey: ['indices', 'current'],
      queryFn: () => api.getAllIndices().then((res) => res.data),
    }),
  availableIndexvalues: () =>
    queryOptions({
      queryKey: ['indices', 'all'],
      queryFn: () => api.getAvailableIndexValues().then((res) => res.data),
    }),
  calculateValue: () => {
    const queryClient = new QueryClient();
    return useMutation({
      mutationFn: (enteredIndex: string) =>
        api.calculateIndexValue({ index: enteredIndex }),
      onSuccess: () =>
        queryClient.invalidateQueries({ queryKey: ['current', 'all'] }),
    });
  },
};
