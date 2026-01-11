import { z } from 'zod';
import { POLYMARKET_ENDPOINTS } from '../constants.js';

export const getEventBySlugSchema = z.object({
  slug: z.string().describe('Event slug identifier (required)'),
});

export type GetEventBySlugInput = z.infer<typeof getEventBySlugSchema>;

export async function getEventBySlug(input: GetEventBySlugInput) {
  if (!input.slug) {
    throw new Error('Event slug is required');
  }

  const response = await fetch(`${POLYMARKET_ENDPOINTS.gammaApi}/events/slug/${encodeURIComponent(input.slug)}`, {
    headers: { 'Content-Type': 'application/json' },
    method: 'GET',
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to fetch event: ${response.status} ${response.statusText} - ${errorText}`);
  }

  const event = await response.json();

  return {
    status: 'success',
    event,
  };
}
