import { z } from 'zod';

export const PAGE_SIZE = 12;
export const OPTIONS_PAGE_SIZE = 100; // all specialties/clinics for the filter dropdowns

// Anything invalid in the URL falls back to a default instead of breaking the page.
const filtersSchema = z.object({
  page: z.coerce.number().int().min(1).max(10_000).catch(1),
  q: z
    .string()
    .trim()
    .max(100)
    .optional()
    .catch(undefined)
    .transform((value) => value || undefined),
  specialtyId: z.uuid().optional().catch(undefined),
  clinicId: z.uuid().optional().catch(undefined),
});
export type CatalogFilters = z.infer<typeof filtersSchema>;

type RawParams = Record<string, string | string[] | undefined> | URLSearchParams;

export function parseFilters(input: RawParams): CatalogFilters {
  const get = (key: string) => {
    const value = input instanceof URLSearchParams ? (input.get(key) ?? undefined) : input[key];
    return Array.isArray(value) ? value[0] : value;
  };
  return filtersSchema.parse({
    page: get('page'),
    q: get('q'),
    specialtyId: get('specialtyId'),
    clinicId: get('clinicId'),
  });
}
