'use client';

import { useMutation } from '@tanstack/react-query';
import { useSessionStore } from '@/stores/session';
import { updateProfile, type ProfileChanges } from './api';

export function useUpdateProfile() {
  return useMutation({
    mutationFn: ({ changes, image }: { changes: ProfileChanges; image: File | null }) =>
      updateProfile(changes, image),
    // The header and sidebar read the user from the store, so they update immediately.
    onSuccess: (user) => useSessionStore.getState().setUser(user),
  });
}
