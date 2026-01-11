import { z } from 'zod';
import { POLYMARKET_ENDPOINTS } from '../constants.js';

export const searchPolymarketSchema = z.object({
  q: z.string().describe('Search query (required)'),
  cache: z.boolean().optional().describe('Use cached results'),
  events_status: z.string().optional().describe('Filter by event status'),
  limit_per_type: z.number().optional().describe('Limit results per type'),
  page: z.number().optional().describe('Page number'),
  events_tag: z.array(z.string()).optional().describe('Filter by event tags'),
  keep_closed_markets: z.number().optional().describe('Include closed markets (0 or 1)'),
  sort: z.string().optional().describe('Sort field'),
  ascending: z.boolean().optional().describe('Sort ascending'),
  search_tags: z.boolean().optional().describe('Include tags in search'),
  search_profiles: z.boolean().optional().describe('Include profiles in search'),
  recurrence: z.string().optional().describe('Filter by recurrence'),
  exclude_tag_id: z.array(z.number()).optional().describe('Exclude specific tag IDs'),
  optimized: z.boolean().optional().describe('Use optimized search'),
});

export type SearchPolymarketInput = z.infer<typeof searchPolymarketSchema>;

export async function searchPolymarket(input: SearchPolymarketInput) {
  if (!input.q) {
    throw new Error('Search query (q) is required');
  }

  const params = new URLSearchParams();
  params.append('q', input.q);

  if (input.cache !== undefined) params.append('cache', input.cache.toString());
  if (input.events_status) params.append('events_status', input.events_status);
  if (input.limit_per_type !== undefined) params.append('limit_per_type', input.limit_per_type.toString());
  if (input.page !== undefined) params.append('page', input.page.toString());
  if (input.events_tag && input.events_tag.length > 0) {
    input.events_tag.forEach((tag) => params.append('events_tag', tag));
  }
  if (input.keep_closed_markets !== undefined) params.append('keep_closed_markets', input.keep_closed_markets.toString());
  if (input.sort) params.append('sort', input.sort);
  if (input.ascending !== undefined) params.append('ascending', input.ascending.toString());
  if (input.search_tags !== undefined) params.append('search_tags', input.search_tags.toString());
  if (input.search_profiles !== undefined) params.append('search_profiles', input.search_profiles.toString());
  if (input.recurrence) params.append('recurrence', input.recurrence);
  if (input.exclude_tag_id && input.exclude_tag_id.length > 0) {
    input.exclude_tag_id.forEach((id) => params.append('exclude_tag_id', id.toString()));
  }
  if (input.optimized !== undefined) params.append('optimized', input.optimized.toString());

  const response = await fetch(`${POLYMARKET_ENDPOINTS.gammaApi}/public-search?${params.toString()}`, {
    headers: { 'Content-Type': 'application/json' },
    method: 'GET',
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to search: ${response.status} ${response.statusText} - ${errorText}`);
  }

  const data = await response.json() as { events?: any[]; tags?: any[]; profiles?: any[]; pagination?: any };

  return {
    status: 'success',
    events: data.events || [],
    tags: data.tags || [],
    profiles: data.profiles || [],
    pagination: data.pagination,
  };
}
