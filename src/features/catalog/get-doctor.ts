import 'server-only';
import { cache } from 'react';
import { toApiError } from '@/lib/api/errors';
import { fetchDoctor } from './api';

// One fetch per request, shared by generateMetadata and the page.
export const getDoctor = cache(async (id: string) => {
  try {
    return await fetchDoctor(id);
  } catch (error) {
    const apiError = toApiError(error);
    if (apiError.status === 404 || apiError.status === 400) return null; // unknown or malformed id
    throw apiError;
  }
});
