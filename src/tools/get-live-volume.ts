import { z } from 'zod';
import { POLYMARKET_ENDPOINTS } from '../constants.js';

export const getLiveVolumeSchema = z.object({
  eventId: z.number().describe('Event ID (required)'),
});

export type GetLiveVolumeInput = z.infer<typeof getLiveVolumeSchema>;

export async function getLiveVolume(input: GetLiveVolumeInput) {
  if (!input.eventId) {
    throw new Error('Event ID is required');
  }

  const response = await fetch(`${POLYMARKET_ENDPOINTS.dataApi}/live-volume?id=${input.eventId}`, {
    headers: { 'Content-Type': 'application/json' },
    method: 'GET',
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to fetch live volume: ${response.status} ${response.statusText} - ${errorText}`);
  }

  const volume = await response.json();

  return {
    status: 'success',
    volume,
  };
}
