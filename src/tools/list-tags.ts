import { z } from 'zod';
import { POLYMARKET_ENDPOINTS } from '../constants.js';

export const listTagsSchema = z.object({});

export type ListTagsInput = z.infer<typeof listTagsSchema>;

export async function listTags(_input: ListTagsInput) {
  const response = await fetch(`${POLYMARKET_ENDPOINTS.gammaApi}/tags`, {
    headers: { 'Content-Type': 'application/json' },
    method: 'GET',
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to fetch tags: ${response.status} ${response.statusText} - ${errorText}`);
  }

  const tags = await response.json();
  const tagsArray = Array.isArray(tags)
    ? tags
    : Array.isArray((tags as { tags?: unknown }).tags)
      ? (tags as { tags: unknown[] }).tags
      : [];

  return {
    status: 'success',
    tags: tagsArray,
    count: tagsArray.length,
  };
}
