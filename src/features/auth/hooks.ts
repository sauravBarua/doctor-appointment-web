'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { loginRequest, logoutRequest } from '@/lib/api/session-client';
import { useSessionStore } from '@/stores/session';

export function useLogin() {
  return useMutation({
    mutationFn: loginRequest,
    onSuccess: (payload) => useSessionStore.getState().setSession(payload),
  });
}

export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: logoutRequest,
    onSettled: () => {
      useSessionStore.getState().clear();
      queryClient.clear();
      router.replace('/login');
    },
  });
}
