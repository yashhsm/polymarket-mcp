export type PromptEvalExpectation = {
  path: string;
  type: 'array' | 'object' | 'number' | 'string';
  minLength?: number;
};

export type PromptEvalCase = {
  name: string;
  prompt: string;
  tool:
    | 'list_markets'
    | 'list_events'
    | 'list_tags'
    | 'search_polymarket'
    | 'get_leaderboard';
  input: Record<string, unknown>;
  expect?: PromptEvalExpectation;
};

export const promptEvals: PromptEvalCase[] = [
  {
    name: 'list_open_markets',
    prompt: 'List 3 open markets and include basic market info.',
    tool: 'list_markets',
    input: { limit: 3, closed: false },
    expect: { path: 'markets', type: 'array', minLength: 1 },
  },
  {
    name: 'list_recent_events',
    prompt: 'List 3 open events and return their titles.',
    tool: 'list_events',
    input: { limit: 3, closed: false },
    expect: { path: 'events', type: 'array', minLength: 1 },
  },
  {
    name: 'list_tags',
    prompt: 'Show all available tags for Polymarket.',
    tool: 'list_tags',
    input: {},
    expect: { path: 'tags', type: 'array', minLength: 1 },
  },
  {
    name: 'search_trump',
    prompt: 'Search Polymarket for Trump-related markets and events.',
    tool: 'search_polymarket',
    input: { q: 'Trump', limit_per_type: 3 },
    expect: { path: 'events', type: 'array' },
  },
  {
    name: 'leaderboard_daily_overall',
    prompt: 'Show the top 5 traders by daily PNL in the overall leaderboard.',
    tool: 'get_leaderboard',
    input: { category: 'OVERALL', timePeriod: 'DAY', orderBy: 'PNL', limit: 5 },
    expect: { path: 'entries', type: 'array', minLength: 1 },
  },
];
