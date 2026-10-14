import { z } from 'zod';

const schema = z.object({
  NEXT_PUBLIC_API_URL: z.url(),
});

// Next only inlines NEXT_PUBLIC_* when accessed literally, so list them explicitly.
const parsed = schema.safeParse({
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
});

if (!parsed.success) {
  const lines = parsed.error.issues.map((i) => `  ${i.path.map(String).join('.')}: ${i.message}`);
  throw new Error(`Invalid environment variables:\n${lines.join('\n')}`);
}

export const env = parsed.data;
export const API_ORIGIN = env.NEXT_PUBLIC_API_URL.replace(/\/$/, '');
export const API_BASE_URL = `${API_ORIGIN}/api/v1`;
