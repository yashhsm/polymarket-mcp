import { z } from 'zod';
import { POLYMARKET_ENDPOINTS } from '../constants.js';

export const getTradesByWalletSchema = z.object({
  walletAddress: z.string().describe('Polymarket wallet address (required)'),
  market: z.string().optional().describe('Market ID to filter by'),
  eventId: z.string().optional().describe('Event ID to filter by'),
  side: z.enum(['BUY', 'SELL']).optional().describe('Trade side to filter by'),
  limit: z.number().optional().default(100).describe('Maximum number of trades to return'),
  offset: z.number().optional().describe('Offset for pagination'),
  takerOnly: z.boolean().optional().describe('Only return trades where user was taker'),
});

export type GetTradesByWalletInput = z.infer<typeof getTradesByWalletSchema>;

export async function getTradesByWallet(input: GetTradesByWalletInput) {
  if (!input.walletAddress) {
    throw new Error('walletAddress is required');
  }

  const params = new URLSearchParams();
  params.append('user', input.walletAddress);

  if (input.market) params.append('market', input.market);
  if (input.eventId) params.append('eventId', input.eventId);
  if (input.side) params.append('side', input.side);
  if (input.limit !== undefined) params.append('limit', input.limit.toString());
  if (input.offset !== undefined) params.append('offset', input.offset.toString());
  if (input.takerOnly !== undefined) params.append('takerOnly', input.takerOnly.toString());

  const response = await fetch(`${POLYMARKET_ENDPOINTS.dataApi}/trades?${params.toString()}`, {
    headers: { 'Content-Type': 'application/json' },
    method: 'GET',
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to fetch trades: ${response.status} ${response.statusText} - ${errorText}`);
  }

  const trades = await response.json();
  const tradesArray = Array.isArray(trades) ? trades : [];

  return {
    status: 'success',
    trades: tradesArray,
    totalTrades: tradesArray.length,
    walletAddress: input.walletAddress,
  };
}
