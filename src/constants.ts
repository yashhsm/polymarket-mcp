export const POLYMARKET_ENDPOINTS = {
  gammaApi: 'https://gamma-api.polymarket.com',
  dataApi: 'https://data-api.polymarket.com',
  clob: 'https://clob.polymarket.com',
} as const;

export const POLYMARKET_WS_ENDPOINTS = {
  // Market data WebSocket (orderbook, prices, trades)
  market: 'wss://ws-subscriptions-clob.polymarket.com/ws/market',
  // User-specific WebSocket (user trades, positions)
  user: 'wss://ws-subscriptions-clob.polymarket.com/ws/user',
} as const;

// WebSocket channel types
export const WS_CHANNELS = {
  PRICE: 'price',
  BOOK: 'book',
  TRADES: 'trades',
  TICKER: 'ticker',
  USER: 'user',
} as const;

export const POLYMARKET_CHAIN_ID = 137; // Polygon
