import { z } from 'zod';
import { subscribeToPrices } from '../ws/index.js';

export const wsSubscribePricesSchema = z.object({
  assetIds: z
    .array(z.string())
    .min(1)
    .describe('Array of token/asset IDs to subscribe to (required). Get these from market clobTokenIds field.'),
  durationSeconds: z
    .number()
    .optional()
    .default(5)
    .describe('How long to collect price updates in seconds (default: 5, max: 30)'),
});

export type WsSubscribePricesInput = z.infer<typeof wsSubscribePricesSchema>;

export async function wsSubscribePrices(input: WsSubscribePricesInput) {
  const { assetIds, durationSeconds = 5 } = input;

  if (!assetIds || assetIds.length === 0) {
    throw new Error('assetIds array is required and must not be empty');
  }

  // Cap duration at 30 seconds
  const duration = Math.min(durationSeconds, 30) * 1000;

  const messages = await subscribeToPrices(assetIds, duration);

  // Extract price data from messages
  const priceUpdates = messages
    .filter((m) => m.type === 'price_change' || m.type === 'price')
    .map((m) => {
      const data = m.data as Record<string, unknown>;
      return {
        assetId: data.asset_id || data.market,
        price: data.price,
        timestamp: m.timestamp,
        raw: data,
      };
    });

  return {
    status: 'success',
    assetIds,
    durationMs: duration,
    totalMessages: messages.length,
    priceUpdates,
    rawMessages: messages,
  };
}
