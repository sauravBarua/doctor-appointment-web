'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api/client';
import { changePasswordRequest, loginRequest, logoutRequest } from '@/lib/api/session-client';
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

// Public endpoints: called straight from the browser. Errors arrive as ApiError.
export function useRegister() {
  return useMutation({
    mutationFn: (input: { name: string; email: string; password: string }) =>
      api.post('/auth/register', input),
  });
}

export function useVerifyEmail() {
  return useMutation({
    mutationFn: (input: { email: string; otp: string }) => api.post('/auth/verify-email', input),
  });
}

export function useResendOtp() {
  return useMutation({
    mutationFn: (input: { email: string }) => api.post('/auth/resend-otp', input),
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: changePasswordRequest,
    onSuccess: (payload) => useSessionStore.getState().setSession(payload),
  });
}
