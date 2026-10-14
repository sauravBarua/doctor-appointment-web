import { describe, expect, it } from 'vitest';
import { API_BASE_URL } from './env';

describe('env', () => {
  it('derives the versioned API base URL', () => {
    expect(API_BASE_URL).toBe('http://localhost:3000/api/v1');
  });
});
