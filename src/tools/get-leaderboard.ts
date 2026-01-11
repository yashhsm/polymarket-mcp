import { z } from 'zod';
import { POLYMARKET_ENDPOINTS } from '../constants.js';

export const getLeaderboardSchema = z.object({
  category: z.enum(['OVERALL', 'POLITICS', 'SPORTS', 'CRYPTO', 'POP_CULTURE']).optional().describe('Leaderboard category'),
  timePeriod: z.enum(['DAY', 'WEEK', 'MONTH', 'ALL']).optional().describe('Time period for rankings'),
  orderBy: z.enum(['PNL', 'VOLUME']).optional().describe('Order by PNL or volume'),
  limit: z.number().optional().describe('Number of results (1-50)'),
  offset: z.number().optional().describe('Pagination offset (0-1000)'),
  user: z.string().optional().describe('Filter by user address'),
  userName: z.string().optional().describe('Filter by username'),
});

export type GetLeaderboardInput = z.infer<typeof getLeaderboardSchema>;

export async function getLeaderboard(input: GetLeaderboardInput) {
  const limit = input.limit ?? 25;
  const offset = input.offset ?? 0;

  if (limit < 1 || limit > 50) {
    throw new Error('limit must be between 1 and 50');
  }
  if (offset < 0 || offset > 1000) {
    throw new Error('offset must be between 0 and 1000');
  }

  const params = new URLSearchParams();
  params.set('category', input.category ?? 'OVERALL');
  params.set('timePeriod', input.timePeriod ?? 'DAY');
  params.set('orderBy', input.orderBy ?? 'PNL');
  params.set('limit', limit.toString());
  params.set('offset', offset.toString());
  if (input.user) params.set('user', input.user);
  if (input.userName) params.set('userName', input.userName);

  const response = await fetch(`${POLYMARKET_ENDPOINTS.dataApi}/v1/leaderboard?${params.toString()}`, {
    headers: { 'Content-Type': 'application/json' },
    method: 'GET',
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to fetch leaderboard: ${response.status} ${response.statusText} - ${errorText}`);
  }

  const data = await response.json();
  const entries = Array.isArray(data) ? data : [];

  return {
    status: 'success',
    entries,
    count: entries.length,
  };
}
