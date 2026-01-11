import { z } from 'zod';
import { POLYMARKET_ENDPOINTS } from '../constants.js';

export const getTopHoldersSchema = z.object({
  market: z.array(z.string()).describe('Condition IDs (required)'),
  limit: z.number().optional().describe('Max number of holders to return'),
  minBalance: z.number().optional().describe('Minimum balance threshold'),
});

export type GetTopHoldersInput = z.infer<typeof getTopHoldersSchema>;

export async function getTopHolders(input: GetTopHoldersInput) {
  if (!input.market || input.market.length === 0) {
    throw new Error('Market condition IDs are required');
  }

  const params = new URLSearchParams();
  params.append('market', input.market.join(','));
  if (input.limit !== undefined) params.append('limit', input.limit.toString());
  if (input.minBalance !== undefined) params.append('minBalance', input.minBalance.toString());

  const response = await fetch(`${POLYMARKET_ENDPOINTS.dataApi}/holders?${params.toString()}`, {
    headers: { 'Content-Type': 'application/json' },
    method: 'GET',
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to fetch top holders: ${response.status} ${response.statusText} - ${errorText}`);
  }

  const holders = await response.json();
  const holdersArray = Array.isArray(holders) ? holders : [];

  return {
    status: 'success',
    holders: holdersArray,
    count: holdersArray.length,
  };
}
