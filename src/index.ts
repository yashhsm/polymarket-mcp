#!/usr/bin/env node

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

import {
  listMarketsSchema,
  listMarkets,
  listEventsSchema,
  listEvents,
  listTagsSchema,
  listTags,
  searchPolymarketSchema,
  searchPolymarket,
  getEventBySlugSchema,
  getEventBySlug,
  getMarketBySlugSchema,
  getMarketBySlug,
  getLeaderboardSchema,
  getLeaderboard,
  getUserActivitySchema,
  getUserActivity,
  getTradesByWalletSchema,
  getTradesByWallet,
  getTopHoldersSchema,
  getTopHolders,
  getOpenInterestSchema,
  getOpenInterest,
  getLiveVolumeSchema,
  getLiveVolume,
  // WebSocket tools
  wsSubscribePricesSchema,
  wsSubscribePrices,
  wsSubscribeTradesSchema,
  wsSubscribeTrades,
  wsGetOrderbookSchema,
  wsGetOrderbook,
} from './tools/index.js';

// Create MCP server
const server = new McpServer({
  name: 'Polymarket MCP Server',
  version: '1.0.0',
});

// Register tools - pass .shape to let MCP SDK handle JSON Schema conversion
server.tool(
  'list_markets',
  'List Polymarket markets with optional filtering by tags, pagination, and sorting',
  listMarketsSchema.shape,
  async (params) => {
    try {
      const input = listMarketsSchema.parse(params);
      const result = await listMarkets(input);
      return {
        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
      };
    } catch (error) {
      return {
        isError: true,
        content: [{ type: 'text', text: error instanceof Error ? error.message : 'Unknown error' }],
      };
    }
  }
);

server.tool(
  'list_events',
  'List Polymarket events with optional filtering by tags, pagination, and sorting',
  listEventsSchema.shape,
  async (params) => {
    try {
      const input = listEventsSchema.parse(params);
      const result = await listEvents(input);
      return {
        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
      };
    } catch (error) {
      return {
        isError: true,
        content: [{ type: 'text', text: error instanceof Error ? error.message : 'Unknown error' }],
      };
    }
  }
);

server.tool(
  'list_tags',
  'List all available Polymarket tags for filtering markets and events',
  listTagsSchema.shape,
  async (params) => {
    try {
      const input = listTagsSchema.parse(params);
      const result = await listTags(input);
      return {
        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
      };
    } catch (error) {
      return {
        isError: true,
        content: [{ type: 'text', text: error instanceof Error ? error.message : 'Unknown error' }],
      };
    }
  }
);

server.tool(
  'search_polymarket',
  'Search Polymarket markets, events, and profiles using the public search API',
  searchPolymarketSchema.shape,
  async (params) => {
    try {
      const input = searchPolymarketSchema.parse(params);
      const result = await searchPolymarket(input);
      return {
        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
      };
    } catch (error) {
      return {
        isError: true,
        content: [{ type: 'text', text: error instanceof Error ? error.message : 'Unknown error' }],
      };
    }
  }
);

server.tool(
  'get_event_by_slug',
  'Fetch a specific Polymarket event by its slug identifier',
  getEventBySlugSchema.shape,
  async (params) => {
    try {
      const input = getEventBySlugSchema.parse(params);
      const result = await getEventBySlug(input);
      return {
        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
      };
    } catch (error) {
      return {
        isError: true,
        content: [{ type: 'text', text: error instanceof Error ? error.message : 'Unknown error' }],
      };
    }
  }
);

server.tool(
  'get_market_by_slug',
  'Fetch a specific Polymarket market by its slug identifier',
  getMarketBySlugSchema.shape,
  async (params) => {
    try {
      const input = getMarketBySlugSchema.parse(params);
      const result = await getMarketBySlug(input);
      return {
        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
      };
    } catch (error) {
      return {
        isError: true,
        content: [{ type: 'text', text: error instanceof Error ? error.message : 'Unknown error' }],
      };
    }
  }
);

server.tool(
  'get_leaderboard',
  'Fetch Polymarket trader leaderboard rankings (most profitable / highest volume traders)',
  getLeaderboardSchema.shape,
  async (params) => {
    try {
      const input = getLeaderboardSchema.parse(params);
      const result = await getLeaderboard(input);
      return {
        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
      };
    } catch (error) {
      return {
        isError: true,
        content: [{ type: 'text', text: error instanceof Error ? error.message : 'Unknown error' }],
      };
    }
  }
);

server.tool(
  'get_user_activity',
  'Get user activity from Polymarket including trades, splits, merges, and rewards',
  getUserActivitySchema.shape,
  async (params) => {
    try {
      const input = getUserActivitySchema.parse(params);
      const result = await getUserActivity(input);
      return {
        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
      };
    } catch (error) {
      return {
        isError: true,
        content: [{ type: 'text', text: error instanceof Error ? error.message : 'Unknown error' }],
      };
    }
  }
);

server.tool(
  'get_trades_by_wallet',
  'Get all trades for a Polymarket wallet address using the public Data API',
  getTradesByWalletSchema.shape,
  async (params) => {
    try {
      const input = getTradesByWalletSchema.parse(params);
      const result = await getTradesByWallet(input);
      return {
        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
      };
    } catch (error) {
      return {
        isError: true,
        content: [{ type: 'text', text: error instanceof Error ? error.message : 'Unknown error' }],
      };
    }
  }
);

server.tool(
  'get_top_holders',
  'Get top holders for specified Polymarket markets',
  getTopHoldersSchema.shape,
  async (params) => {
    try {
      const input = getTopHoldersSchema.parse(params);
      const result = await getTopHolders(input);
      return {
        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
      };
    } catch (error) {
      return {
        isError: true,
        content: [{ type: 'text', text: error instanceof Error ? error.message : 'Unknown error' }],
      };
    }
  }
);

server.tool(
  'get_open_interest',
  'Get open interest for Polymarket markets',
  getOpenInterestSchema.shape,
  async (params) => {
    try {
      const input = getOpenInterestSchema.parse(params);
      const result = await getOpenInterest(input);
      return {
        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
      };
    } catch (error) {
      return {
        isError: true,
        content: [{ type: 'text', text: error instanceof Error ? error.message : 'Unknown error' }],
      };
    }
  }
);

server.tool(
  'get_live_volume',
  'Get live volume for a specific Polymarket event',
  getLiveVolumeSchema.shape,
  async (params) => {
    try {
      const input = getLiveVolumeSchema.parse(params);
      const result = await getLiveVolume(input);
      return {
        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
      };
    } catch (error) {
      return {
        isError: true,
        content: [{ type: 'text', text: error instanceof Error ? error.message : 'Unknown error' }],
      };
    }
  }
);

// WebSocket tools
server.tool(
  'ws_subscribe_prices',
  'Subscribe to real-time price updates for Polymarket assets via WebSocket. Collects price changes for specified duration.',
  wsSubscribePricesSchema.shape,
  async (params) => {
    try {
      const input = wsSubscribePricesSchema.parse(params);
      const result = await wsSubscribePrices(input);
      return {
        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
      };
    } catch (error) {
      return {
        isError: true,
        content: [{ type: 'text', text: error instanceof Error ? error.message : 'Unknown error' }],
      };
    }
  }
);

server.tool(
  'ws_subscribe_trades',
  'Subscribe to real-time trade updates for Polymarket assets via WebSocket. Collects trades for specified duration.',
  wsSubscribeTradesSchema.shape,
  async (params) => {
    try {
      const input = wsSubscribeTradesSchema.parse(params);
      const result = await wsSubscribeTrades(input);
      return {
        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
      };
    } catch (error) {
      return {
        isError: true,
        content: [{ type: 'text', text: error instanceof Error ? error.message : 'Unknown error' }],
      };
    }
  }
);

server.tool(
  'ws_get_orderbook',
  'Get live orderbook snapshot for a Polymarket asset via WebSocket. Returns current bids and asks.',
  wsGetOrderbookSchema.shape,
  async (params) => {
    try {
      const input = wsGetOrderbookSchema.parse(params);
      const result = await wsGetOrderbook(input);
      return {
        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
      };
    } catch (error) {
      return {
        isError: true,
        content: [{ type: 'text', text: error instanceof Error ? error.message : 'Unknown error' }],
      };
    }
  }
);

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Polymarket MCP Server running on stdio');
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
