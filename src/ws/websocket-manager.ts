import WebSocket from 'ws';
import { POLYMARKET_WS_ENDPOINTS } from '../constants.js';

export type WSEndpoint = keyof typeof POLYMARKET_WS_ENDPOINTS;

export interface WSMessage {
  type: string;
  data: unknown;
  timestamp: number;
}

export interface SubscriptionOptions {
  endpoint: WSEndpoint;
  channels: string[];
  assets?: string[];  // Token IDs for market subscriptions
  duration?: number;  // How long to collect messages (ms), default 5000
}

/**
 * Connect to Polymarket WebSocket and collect messages for a duration
 */
export async function collectWSMessages(options: SubscriptionOptions): Promise<WSMessage[]> {
  const { endpoint, channels, assets = [], duration = 5000 } = options;
  const wsUrl = POLYMARKET_WS_ENDPOINTS[endpoint];
  const messages: WSMessage[] = [];

  return new Promise((resolve, reject) => {
    const ws = new WebSocket(wsUrl);
    let timeoutId: NodeJS.Timeout;
    let isResolved = false;

    const cleanup = () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };

    const finish = () => {
      if (isResolved) return;
      isResolved = true;
      cleanup();
      resolve(messages);
    };

    ws.on('open', () => {
      // Subscribe to channels
      for (const channel of channels) {
        const subscribeMsg: Record<string, unknown> = {
          type: 'subscribe',
          channel,
        };

        // Add assets_ids for market-specific subscriptions
        if (assets.length > 0) {
          subscribeMsg.assets_ids = assets;
        }

        ws.send(JSON.stringify(subscribeMsg));
      }

      // Set timeout to collect messages
      timeoutId = setTimeout(finish, duration);
    });

    ws.on('message', (data) => {
      try {
        const parsed = JSON.parse(data.toString());
        messages.push({
          type: parsed.event_type || parsed.type || 'unknown',
          data: parsed,
          timestamp: Date.now(),
        });
      } catch {
        // Ignore parse errors
      }
    });

    ws.on('error', (error) => {
      if (!isResolved) {
        isResolved = true;
        cleanup();
        reject(new Error(`WebSocket error: ${error.message}`));
      }
    });

    ws.on('close', () => {
      finish();
    });
  });
}

/**
 * Get a single snapshot from WebSocket (connect, get first meaningful message, disconnect)
 */
export async function getWSSnapshot(options: Omit<SubscriptionOptions, 'duration'>): Promise<WSMessage | null> {
  const messages = await collectWSMessages({ ...options, duration: 3000 });
  // Return first non-subscription-confirmation message
  return messages.find(m => m.type !== 'subscribed' && m.type !== 'connected') || null;
}

/**
 * Subscribe to price channel and collect price updates
 */
export async function subscribeToPrices(
  assetIds: string[],
  durationMs: number = 5000
): Promise<WSMessage[]> {
  return collectWSMessages({
    endpoint: 'market',
    channels: ['price'],
    assets: assetIds,
    duration: durationMs,
  });
}

/**
 * Subscribe to orderbook channel and collect book updates
 */
export async function subscribeToOrderbook(
  assetIds: string[],
  durationMs: number = 5000
): Promise<WSMessage[]> {
  return collectWSMessages({
    endpoint: 'market',
    channels: ['book'],
    assets: assetIds,
    duration: durationMs,
  });
}

/**
 * Subscribe to trades channel and collect trade updates
 */
export async function subscribeToTrades(
  assetIds: string[],
  durationMs: number = 10000
): Promise<WSMessage[]> {
  return collectWSMessages({
    endpoint: 'market',
    channels: ['trades'],
    assets: assetIds,
    duration: durationMs,
  });
}
