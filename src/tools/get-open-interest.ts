import { z } from 'zod';
import { POLYMARKET_ENDPOINTS } from '../constants.js';

export const getOpenInterestSchema = z.object({
  market: z.array(z.string()).optional().describe('Condition IDs'),
  eventId: z.number().optional().describe('Event ID'),
});

export type GetOpenInterestInput = z.infer<typeof getOpenInterestSchema>;

export async function getOpenInterest(input: GetOpenInterestInput) {
  if (!input.market && !input.eventId) {
    throw new Error('Either market condition IDs or event ID is required');
  }

  const params = new URLSearchParams();
  if (input.market && input.market.length > 0) {
    params.append('market', input.market.join(','));
  }
  if (input.eventId) {
    params.append('id', input.eventId.toString());
  }

  const response = await fetch(`${POLYMARKET_ENDPOINTS.dataApi}/open-interest?${params.toString()}`, {
    headers: { 'Content-Type': 'application/json' },
    method: 'GET',
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to fetch open interest: ${response.status} ${response.statusText} - ${errorText}`);
  }

  const openInterest = await response.json();

  return {
    status: 'success',
    openInterest,
  };
}
