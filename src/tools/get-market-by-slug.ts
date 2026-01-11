import { z } from 'zod';
import { POLYMARKET_ENDPOINTS } from '../constants.js';

export const getMarketBySlugSchema = z.object({
  slug: z.string().describe('Market slug identifier (required)'),
});

export type GetMarketBySlugInput = z.infer<typeof getMarketBySlugSchema>;

export async function getMarketBySlug(input: GetMarketBySlugInput) {
  if (!input.slug) {
    throw new Error('Market slug is required');
  }

  const response = await fetch(`${POLYMARKET_ENDPOINTS.gammaApi}/markets/slug/${encodeURIComponent(input.slug)}`, {
    headers: { 'Content-Type': 'application/json' },
    method: 'GET',
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to fetch market: ${response.status} ${response.statusText} - ${errorText}`);
  }

  const market = await response.json();

  return {
    status: 'success',
    market,
  };
}
