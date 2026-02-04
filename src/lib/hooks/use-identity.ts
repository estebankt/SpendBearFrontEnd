import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { identityApi } from '@/lib/api/endpoints';
import type { RegisterUserInput } from '@/lib/api/schemas';

export function useCurrentUser() {
  return useQuery({
    queryKey: ['identity', 'me'],
    queryFn: identityApi.me,
    retry: false,
  });
}

export function useRegister() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: RegisterUserInput) => identityApi.register(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['identity', 'me'] });
    },
  });
}
