import { z } from 'zod';
import { POLYMARKET_ENDPOINTS } from '../constants.js';

export const listEventsSchema = z.object({
  tag_id: z.number().optional().describe('Filter by tag ID'),
  exclude_tag_id: z.array(z.number()).optional().describe('Exclude specific tag IDs'),
  closed: z.boolean().optional().describe('Include closed events'),
  limit: z.number().optional().describe('Number of results to return (max 100)'),
  offset: z.number().optional().describe('Pagination offset'),
  order: z.string().optional().describe('Field to order by'),
  ascending: z.boolean().optional().describe('Sort in ascending order'),
  related_tags: z.boolean().optional().describe('Include related tags'),
});

export type ListEventsInput = z.infer<typeof listEventsSchema>;

export async function listEvents(input: ListEventsInput) {
  const params = new URLSearchParams();

  if (input.tag_id !== undefined) params.append('tag_id', input.tag_id.toString());
  if (input.exclude_tag_id && input.exclude_tag_id.length > 0) {
    input.exclude_tag_id.forEach((id) => params.append('exclude_tag_id', id.toString()));
  }
  params.append('closed', (input.closed ?? false).toString());
  params.append('limit', (input.limit ?? 50).toString());
  params.append('offset', (input.offset ?? 0).toString());
  params.append('order', input.order ?? 'volume');
  params.append('ascending', (input.ascending ?? false).toString());
  if (input.related_tags !== undefined) params.append('related_tags', input.related_tags.toString());

  const response = await fetch(`${POLYMARKET_ENDPOINTS.gammaApi}/events?${params.toString()}`, {
    headers: { 'Content-Type': 'application/json' },
    method: 'GET',
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to fetch events: ${response.status} ${response.statusText} - ${errorText}`);
  }

  const data = await response.json();
  const events = Array.isArray(data) ? data : (data as any).events || [];

  return {
    status: 'success',
    events,
    count: events.length,
  };
}
