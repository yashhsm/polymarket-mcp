# Polymarket MCP Server

<div align="center">

**A Model Context Protocol (MCP) server for seamless Polymarket integration**

[![MIT License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white)](https://nodejs.org/)

</div>

## 🚀 Overview

Polymarket MCP Server provides a comprehensive toolkit for accessing Polymarket data through the Model Context Protocol. This server enables seamless integration with Claude and other MCP clients, allowing you to search markets, fetch events, analyze leaderboards, query user activity, and much more.

## ✨ Features

- **📊 Market Search & Browsing** - List and search Polymarket markets with advanced filtering, pagination, and sorting
- **📅 Event Management** - Discover and retrieve detailed information about Polymarket events
- **🏷️ Tag System** - Browse available tags for categorizing and filtering markets and events
- **🏆 Leaderboard Data** - Access trader rankings based on profitability and volume
- **👤 User Analytics** - Get detailed user activity including trades, splits, and merges
- **💼 Wallet Analysis** - Query trades and holdings for specific wallet addresses
- **📈 Market Insights** - View top holders, open interest, and live volume data
- **🔍 Full Search** - Comprehensive search across markets, events, and profiles

## 🛠️ Available Tools

### Market Tools

- **`list_markets`** - List Polymarket markets with optional filtering by tags, pagination, and sorting
- **`search_polymarket`** - Search Polymarket markets, events, and profiles using the public search API
- **`get_market_by_slug`** - Fetch a specific Polymarket market by its slug identifier

### Event Tools

- **`list_events`** - List Polymarket events with optional filtering by tags, pagination, and sorting
- **`get_event_by_slug`** - Fetch a specific Polymarket event by its slug identifier
- **`get_live_volume`** - Get live volume data for a specific Polymarket event

### Analytics Tools

- **`get_open_interest`** - Get open interest data for Polymarket markets
- **`get_top_holders`** - Get top holders for specified Polymarket markets
- **`get_leaderboard`** - Fetch Polymarket trader leaderboard rankings (most profitable / highest volume traders)

### User & Wallet Tools

- **`get_user_activity`** - Get user activity from Polymarket including trades, splits, merges, and rewards
- **`get_trades_by_wallet`** - Get all trades for a Polymarket wallet address using the public Data API

### Category Tools

- **`list_tags`** - List all available Polymarket tags for filtering markets and events

## 📦 Installation

### Prerequisites

- Node.js (v18 or higher)
- pnpm (or npm/yarn)

### Setup

1. **Clone the repository**

```bash
git clone https://github.com/yashhsm/polymarket-mcp.git
cd polymarket-mcp
```

2. **Install dependencies**

```bash
pnpm install
```

3. **Build the project**

```bash
pnpm build
```

4. **Start the server**

```bash
pnpm start
```

## 🔧 Usage

This MCP server can be used with any MCP-compatible client. Configure your client to connect to this server's stdio transport, and you'll have access to all available Polymarket tools.

### Example: Using with Claude Desktop

Add this configuration to your Claude Desktop config file (typically located at `~/Library/Application Support/Claude/claude_desktop_config.json` on macOS):

```json
{
  "mcpServers": {
    "polymarket": {
      "command": "node",
      "args": ["/absolute/path/to/polymarket-mcp/dist/index.js"]
    }
  }
}
```

**Note:** Replace `/absolute/path/to/polymarket-mcp` with the actual absolute path to your cloned repository.

### Example Queries

Once configured, you can ask Claude:

- "Show me the top 10 trending Polymarket markets"
- "What are the current odds for the 2024 election markets?"
- "Who are the top traders on Polymarket this month?"
- "Search for markets related to cryptocurrency"
- "Show me live volume data for a specific event"

## 🏗️ Development

### Building

```bash
pnpm build
```

### Development Mode

Run with hot reload:

```bash
pnpm dev
```

### Running Tests

```bash
pnpm test
```

### Evaluation Mode

```bash
pnpm eval
```

## 📁 Project Structure

```
src/
├── index.ts              # Main MCP server setup and tool registration
├── constants.ts          # Configuration constants and API endpoints
├── eval.ts               # Evaluation utilities
├── prompt-evals.ts       # Prompt evaluation functions
└── tools/                # Tool implementations
    ├── index.ts          # Tool exports
    ├── markets.ts        # Market-related tools
    ├── events.ts         # Event-related tools
    ├── leaderboard.ts    # Leaderboard tools
    ├── user.ts           # User activity tools
    └── ...               # Additional tool implementations
```

## 🔌 API Integration

This server integrates with the following Polymarket public APIs:

- **Markets API** - For market data and search functionality
- **Events API** - For event information and details
- **User API** - For user activity and wallet data
- **Leaderboard API** - For trader rankings and statistics
- **Data API** - For trades, holders, and volume data

## 🛠️ Technology Stack

- **[Node.js](https://nodejs.org/)** - JavaScript runtime environment
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript development
- **[MCP SDK](https://modelcontextprotocol.io/)** - Model Context Protocol SDK
- **[Zod](https://zod.dev/)** - Schema validation and type safety

## 🤝 Contributing

Contributions are welcome! If you'd like to contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 💬 Support

For issues, feature requests, or questions:

- **Issues:** Use the [GitHub Issues](https://github.com/yashhsm/polymarket-mcp/issues) page
- **Discussions:** Join the [GitHub Discussions](https://github.com/yashhsm/polymarket-mcp/discussions)

## 🙏 Acknowledgments

- Built with the [Model Context Protocol](https://modelcontextprotocol.io/)
- Data provided by [Polymarket](https://polymarket.com/)

---

<div align="center">

Made with ❤️ by the Polymarket MCP community

</div>
