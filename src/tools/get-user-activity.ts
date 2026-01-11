import { z } from 'zod';
import { POLYMARKET_ENDPOINTS } from '../constants.js';

export const getUserActivitySchema = z.object({
  user: z.string().describe('User wallet address (required)'),
  limit: z.number().optional().describe('Max number of activities (default: 100, max: 500)'),
  offset: z.number().optional().describe('Pagination offset (default: 0, max: 10000)'),
  types: z.array(z.string()).optional().describe('Filter by activity types (e.g., TRADE, SPLIT, MERGE, REWARD)'),
  market: z.array(z.string()).optional().describe('Filter by condition IDs'),
  eventId: z.array(z.number()).optional().describe('Filter by event IDs'),
});

export type GetUserActivityInput = z.infer<typeof getUserActivitySchema>;

export async function getUserActivity(input: GetUserActivityInput) {
  if (!input.user) {
    throw new Error('User wallet address is required');
  }

  const params = new URLSearchParams();
  params.append('user', input.user);
  params.append('limit', Math.min(input.limit ?? 100, 500).toString());
  params.append('offset', Math.min(input.offset ?? 0, 10000).toString());

  if (input.types && input.types.length > 0) {
    input.types.forEach((type) => params.append('types', type));
  }
  if (input.market && input.market.length > 0) {
    params.append('market', input.market.join(','));
  }
  if (input.eventId && input.eventId.length > 0) {
    params.append('eventId', input.eventId.join(','));
  }

  const response = await fetch(`${POLYMARKET_ENDPOINTS.dataApi}/activity?${params.toString()}`, {
    headers: { 'Content-Type': 'application/json' },
    method: 'GET',
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to fetch user activity: ${response.status} ${response.statusText} - ${errorText}`);
  }

  const activities = await response.json();
  const activitiesArray = Array.isArray(activities) ? activities : [];

  return {
    status: 'success',
    activities: activitiesArray,
    count: activitiesArray.length,
  };
}
