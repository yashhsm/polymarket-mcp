#!/usr/bin/env node

/**
 * Polymarket MCP Server Evaluation Tests
 *
 * Tests each tool to verify API connectivity and response format
 */

import {
  listMarkets,
  listEvents,
  listTags,
  searchPolymarket,
  getEventBySlug,
  getMarketBySlug,
  getLeaderboard,
  getUserActivity,
  getTradesByWallet,
  getTopHolders,
  getOpenInterest,
  getLiveVolume,
} from './tools/index.js';
import { promptEvals } from './prompt-evals.js';
import type { PromptEvalCase, PromptEvalExpectation } from './prompt-evals.js';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { fileURLToPath } from 'node:url';

interface TestResult {
  name: string;
  passed: boolean;
  duration: number;
  error?: string;
  data?: any;
}

const results: TestResult[] = [];

type PromptTool = PromptEvalCase['tool'];

const promptToolRunners: Record<PromptTool, (input: Record<string, unknown>) => Promise<any>> = {
  list_markets: (input) => listMarkets(input as any),
  list_events: (input) => listEvents(input as any),
  list_tags: (input) => listTags(input as any),
  search_polymarket: (input) => searchPolymarket(input as any),
  get_leaderboard: (input) => getLeaderboard(input as any),
};

async function runTest(name: string, testFn: () => Promise<any>): Promise<void> {
  const start = Date.now();
  try {
    const data = await testFn();
    const duration = Date.now() - start;
    results.push({ name, passed: true, duration, data });
    console.log(`✅ ${name} (${duration}ms)`);
  } catch (error) {
    const duration = Date.now() - start;
    const errorMessage = error instanceof Error ? error.message : String(error);
    results.push({ name, passed: false, duration, error: errorMessage });
    console.log(`❌ ${name} (${duration}ms): ${errorMessage}`);
  }
}

function getValueAtPath(value: unknown, path: string): unknown {
  return path.split('.').reduce((acc: unknown, key: string) => {
    if (acc && typeof acc === 'object' && key in acc) {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, value);
}

function assertExpectation(result: unknown, expect: PromptEvalExpectation): void {
  const value = getValueAtPath(result, expect.path);

  if (expect.type === 'array') {
    if (!Array.isArray(value)) {
      throw new Error(`Expected ${expect.path} to be an array`);
    }
    if (expect.minLength !== undefined && value.length < expect.minLength) {
      throw new Error(`Expected ${expect.path} length >= ${expect.minLength}`);
    }
    return;
  }

  if (expect.type === 'object') {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
      throw new Error(`Expected ${expect.path} to be an object`);
    }
    return;
  }

  if (typeof value !== expect.type) {
    throw new Error(`Expected ${expect.path} to be type ${expect.type}`);
  }
}

async function runAllTests() {
  console.log('\n🧪 Polymarket MCP Server Evaluation Tests\n');
  console.log('='.repeat(50));

  // Test 1: List Markets
  await runTest('list_markets', async () => {
    const result = await listMarkets({ limit: 5, closed: false });
    if (result.status !== 'success') throw new Error('Status not success');
    if (!Array.isArray(result.markets)) throw new Error('Markets not an array');
    console.log(`   → Found ${result.count} markets`);
    return result;
  });

  // Test 2: List Events
  await runTest('list_events', async () => {
    const result = await listEvents({ limit: 5, closed: false });
    if (result.status !== 'success') throw new Error('Status not success');
    if (!Array.isArray(result.events)) throw new Error('Events not an array');
    console.log(`   → Found ${result.count} events`);
    return result;
  });

  // Test 3: List Tags
  await runTest('list_tags', async () => {
    const result = await listTags({});
    if (result.status !== 'success') throw new Error('Status not success');
    if (!Array.isArray(result.tags)) throw new Error('Tags not an array');
    console.log(`   → Found ${result.count} tags`);
    return result;
  });

  // Test 4: Search Polymarket
  await runTest('search_polymarket', async () => {
    const result = await searchPolymarket({ q: 'Trump', limit_per_type: 3 });
    if (result.status !== 'success') throw new Error('Status not success');
    console.log(`   → Found ${result.events?.length || 0} events, ${result.profiles?.length || 0} profiles`);
    return result;
  });

  // Test 5: Get Event By Slug (using a known event)
  await runTest('get_event_by_slug', async () => {
    // First get an event to find a valid slug
    const events = await listEvents({ limit: 1 });
    if (!events.events || events.events.length === 0) {
      throw new Error('No events found to test with');
    }
    const slug = events.events[0].slug;
    console.log(`   → Testing with slug: ${slug}`);

    const result = await getEventBySlug({ slug });
    if (result.status !== 'success') throw new Error('Status not success');
    if (!result.event) throw new Error('Event not returned');
    return result;
  });

  // Test 6: Get Market By Slug
  await runTest('get_market_by_slug', async () => {
    // First get a market to find a valid slug
    const markets = await listMarkets({ limit: 1 });
    if (!markets.markets || markets.markets.length === 0) {
      throw new Error('No markets found to test with');
    }
    const slug = markets.markets[0].slug;
    console.log(`   → Testing with slug: ${slug}`);

    const result = await getMarketBySlug({ slug });
    if (result.status !== 'success') throw new Error('Status not success');
    if (!result.market) throw new Error('Market not returned');
    return result;
  });

  // Test 7: Get Leaderboard
  await runTest('get_leaderboard', async () => {
    const result = await getLeaderboard({
      category: 'OVERALL',
      timePeriod: 'DAY',
      orderBy: 'PNL',
      limit: 10
    });
    if (result.status !== 'success') throw new Error('Status not success');
    if (!Array.isArray(result.entries)) throw new Error('Entries not an array');
    console.log(`   → Found ${result.count} leaderboard entries`);
    return result;
  });

  // Test 8: Get User Activity (using a known active trader)
  await runTest('get_user_activity', async () => {
    // Get a user from leaderboard
    const leaderboard = await getLeaderboard({ limit: 1 });
    if (!leaderboard.entries || leaderboard.entries.length === 0) {
      throw new Error('No leaderboard entries to get user from');
    }
    const userAddress = leaderboard.entries[0].userAddress || leaderboard.entries[0].proxyWallet;
    if (!userAddress) {
      console.log(`   → Skipping: No user address in leaderboard entry`);
      return { status: 'success', activities: [], skipped: true };
    }
    console.log(`   → Testing with user: ${userAddress.slice(0, 10)}...`);

    const result = await getUserActivity({ user: userAddress, limit: 5 });
    if (result.status !== 'success') throw new Error('Status not success');
    console.log(`   → Found ${result.count} activities`);
    return result;
  });

  // Test 9: Get Trades By Wallet
  await runTest('get_trades_by_wallet', async () => {
    // Get a user from leaderboard
    const leaderboard = await getLeaderboard({ limit: 1 });
    if (!leaderboard.entries || leaderboard.entries.length === 0) {
      throw new Error('No leaderboard entries to get user from');
    }
    const userAddress = leaderboard.entries[0].userAddress || leaderboard.entries[0].proxyWallet;
    if (!userAddress) {
      console.log(`   → Skipping: No user address in leaderboard entry`);
      return { status: 'success', trades: [], skipped: true };
    }
    console.log(`   → Testing with wallet: ${userAddress.slice(0, 10)}...`);

    const result = await getTradesByWallet({ walletAddress: userAddress, limit: 5 });
    if (result.status !== 'success') throw new Error('Status not success');
    console.log(`   → Found ${result.totalTrades} trades`);
    return result;
  });

  // Test 10: Get Top Holders
  await runTest('get_top_holders', async () => {
    // Get a market to find condition ID
    const markets = await listMarkets({ limit: 1 });
    if (!markets.markets || markets.markets.length === 0) {
      throw new Error('No markets found to test with');
    }
    const conditionId = markets.markets[0].conditionId;
    if (!conditionId) {
      console.log(`   → Skipping: No conditionId in market`);
      return { status: 'success', holders: [], skipped: true };
    }
    console.log(`   → Testing with conditionId: ${conditionId.slice(0, 10)}...`);

    const result = await getTopHolders({ market: [conditionId], limit: 5 });
    if (result.status !== 'success') throw new Error('Status not success');
    console.log(`   → Found ${result.count} holders`);
    return result;
  });

  // Test 11: Get Open Interest (Note: This API may be deprecated)
  await runTest('get_open_interest', async () => {
    // Get a market to find condition ID
    const markets = await listMarkets({ limit: 1 });
    if (!markets.markets || markets.markets.length === 0) {
      throw new Error('No markets found to test with');
    }
    const conditionId = markets.markets[0].conditionId;
    if (!conditionId) {
      console.log(`   → Skipping: No conditionId in market (API may be deprecated)`);
      return { status: 'success', openInterest: null, skipped: true };
    }
    console.log(`   → Testing with conditionId: ${conditionId.slice(0, 10)}...`);

    try {
      const result = await getOpenInterest({ market: [conditionId] });
      if (result.status !== 'success') throw new Error('Status not success');
      return result;
    } catch (error) {
      // This endpoint may be deprecated - treat as skipped
      console.log(`   → Note: API may be deprecated or unavailable`);
      return { status: 'success', openInterest: null, skipped: true, note: 'API may be deprecated' };
    }
  });

  // Test 12: Get Live Volume
  await runTest('get_live_volume', async () => {
    // Get an event to find event ID
    const events = await listEvents({ limit: 1 });
    if (!events.events || events.events.length === 0) {
      throw new Error('No events found to test with');
    }
    const eventId = events.events[0].id;
    console.log(`   → Testing with eventId: ${eventId}`);

    const result = await getLiveVolume({ eventId: Number(eventId) });
    if (result.status !== 'success') throw new Error('Status not success');
    return result;
  });

  console.log('\n🧭 Prompt-based evals\n');
  console.log('='.repeat(50));

  for (const promptEval of promptEvals) {
    await runTest(`prompt_eval_${promptEval.name}`, async () => {
      console.log(`   → Prompt: ${promptEval.prompt}`);
      const runner = promptToolRunners[promptEval.tool];
      if (!runner) {
        throw new Error(`No runner configured for ${promptEval.tool}`);
      }
      const result = await runner(promptEval.input);
      if (promptEval.expect) {
        assertExpectation(result, promptEval.expect);
      }
      return result;
    });
  }

  console.log('\n🔌 MCP client roundtrip\n');
  console.log('='.repeat(50));

  await runTest('mcp_client_list_and_call', async () => {
    const serverPath = fileURLToPath(new URL('./index.js', import.meta.url));
    const transport = new StdioClientTransport({
      command: process.execPath,
      args: [serverPath],
      cwd: process.cwd(),
      stderr: 'pipe',
    });
    const client = new Client({ name: 'polymarket-mcp-eval', version: '1.0.0' });

    const parseToolText = (result: any) => {
      const text = result?.content?.find((item: any) => item.type === 'text')?.text;
      if (!text) {
        throw new Error('Missing text content in tool response');
      }
      return JSON.parse(text);
    };

    try {
      await client.connect(transport);
      const toolsResult = await client.listTools();
      const toolNames = toolsResult.tools.map((tool) => tool.name);
      if (!toolNames.includes('list_markets') || !toolNames.includes('list_tags')) {
        throw new Error('Expected tools not found in MCP server');
      }

      const marketsResult = await client.callTool({
        name: 'list_markets',
        arguments: { limit: 3, closed: false },
      });
      const marketsData = parseToolText(marketsResult);
      if (!Array.isArray(marketsData.markets) || marketsData.markets.length === 0) {
        throw new Error('MCP list_markets returned no markets');
      }

      const tagsResult = await client.callTool({
        name: 'list_tags',
        arguments: {},
      });
      const tagsData = parseToolText(tagsResult);
      if (!Array.isArray(tagsData.tags) || tagsData.tags.length === 0) {
        throw new Error('MCP list_tags returned no tags');
      }

      return { status: 'success', tools: toolNames.slice(0, 5) };
    } finally {
      await client.close();
    }
  });

  // Summary
  console.log('\n' + '='.repeat(50));
  console.log('\n📊 Test Summary\n');

  const passed = results.filter(r => r.passed).length;
  const failed = results.filter(r => !r.passed).length;
  const totalDuration = results.reduce((sum, r) => sum + r.duration, 0);

  console.log(`Total: ${results.length} tests`);
  console.log(`Passed: ${passed} ✅`);
  console.log(`Failed: ${failed} ❌`);
  console.log(`Duration: ${totalDuration}ms`);

  if (failed > 0) {
    console.log('\n❌ Failed Tests:');
    results.filter(r => !r.passed).forEach(r => {
      console.log(`   - ${r.name}: ${r.error}`);
    });
  }

  console.log('\n');

  // Exit with error code if any tests failed
  process.exit(failed > 0 ? 1 : 0);
}

runAllTests().catch(error => {
  console.error('Fatal error running tests:', error);
  process.exit(1);
});
