import { z } from 'zod';
import { subscribeToOrderbook } from '../ws/index.js';

export const wsGetOrderbookSchema = z.object({
  assetId: z
    .string()
    .min(1)
    .describe('Token/asset ID to get orderbook for (required). Get this from market clobTokenIds field.'),
  durationSeconds: z
    .number()
    .optional()
    .default(3)
    .describe('How long to wait for orderbook snapshot in seconds (default: 3, max: 10)'),
});

export type WsGetOrderbookInput = z.infer<typeof wsGetOrderbookSchema>;

export async function wsGetOrderbook(input: WsGetOrderbookInput) {
  const { assetId, durationSeconds = 3 } = input;

  if (!assetId) {
    throw new Error('assetId is required');
  }

  // Cap duration at 10 seconds
  const duration = Math.min(durationSeconds, 10) * 1000;

  const messages = await subscribeToOrderbook([assetId], duration);

  // Find the book snapshot message
  const bookMessages = messages.filter(
    (m) => m.type === 'book' || m.type === 'book_snapshot' || m.type === 'book_update'
  );

  // Extract orderbook data
  let orderbook: { bids: unknown[]; asks: unknown[] } | null = null;

  for (const msg of bookMessages) {
    const data = msg.data as Record<string, unknown>;
    if (data.bids || data.asks) {
      orderbook = {
        bids: (data.bids as unknown[]) || [],
        asks: (data.asks as unknown[]) || [],
      };
      break;
    }
  }

  return {
    status: 'success',
    assetId,
    durationMs: duration,
    totalMessages: messages.length,
    orderbook,
    rawMessages: bookMessages.length > 0 ? bookMessages : messages,
  };
}
