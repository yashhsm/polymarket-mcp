import { z } from 'zod';
import { subscribeToTrades } from '../ws/index.js';

export const wsSubscribeTradesSchema = z.object({
  assetIds: z
    .array(z.string())
    .min(1)
    .describe('Array of token/asset IDs to subscribe to (required). Get these from market clobTokenIds field.'),
  durationSeconds: z
    .number()
    .optional()
    .default(10)
    .describe('How long to collect trade updates in seconds (default: 10, max: 60)'),
});

export type WsSubscribeTradesInput = z.infer<typeof wsSubscribeTradesSchema>;

export async function wsSubscribeTrades(input: WsSubscribeTradesInput) {
  const { assetIds, durationSeconds = 10 } = input;

  if (!assetIds || assetIds.length === 0) {
    throw new Error('assetIds array is required and must not be empty');
  }

  // Cap duration at 60 seconds
  const duration = Math.min(durationSeconds, 60) * 1000;

  const messages = await subscribeToTrades(assetIds, duration);

  // Extract trade data from messages
  const tradeUpdates = messages
    .filter((m) => m.type === 'trade' || m.type === 'last_trade_price')
    .map((m) => {
      const data = m.data as Record<string, unknown>;
      return {
        assetId: data.asset_id || data.market,
        price: data.price,
        size: data.size,
        side: data.side,
        timestamp: m.timestamp,
        raw: data,
      };
    });

  return {
    status: 'success',
    assetIds,
    durationMs: duration,
    totalMessages: messages.length,
    tradeUpdates,
    rawMessages: messages,
  };
}
