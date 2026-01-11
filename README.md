# Polymarket MCP Server

A Model Context Protocol (MCP) server that provides tools for accessing Polymarket data. This server enables seamless integration with Claude and other MCP clients to search markets, fetch events, analyze leaderboards, and more.

## Features

- **Market Search & Browsing**: List and search Polymarket markets with filtering, pagination, and sorting capabilities
- - **Event Management**: Discover and retrieve detailed information about Polymarket events
  - - **Tag System**: Browse available tags for categorizing and filtering markets and events
    - - **Leaderboard Data**: Access trader rankings based on profitability and volume
      - - **User Analytics**: Get detailed user activity including trades, splits, and merges
        - - **Wallet Analysis**: Query trades and holdings for specific wallet addresses
          - - **Market Insights**: View top holders, open interest, and live volume data
            - - **Full Search**: Comprehensive search across markets, events, and profiles
             
              - ## Available Tools
             
              - ### Market Tools
             
              - - **`list_markets`** - List Polymarket markets with optional filtering by tags, pagination, and sorting
                - - **`search_polymarket`** - Search Polymarket markets, events, and profiles using the public search API
                 
                  - ### Event Tools
                 
                  - - **`list_events`** - List Polymarket events with optional filtering by tags, pagination, and sorting
                    - - **`get_event_by_slug`** - Fetch a specific Polymarket event by its slug identifier
                      - - **`get_live_volume`** - Get live volume data for a specific Polymarket event
                       
                        - ### Category Tools
                       
                        - - **`list_tags`** - List all available Polymarket tags for filtering markets and events
                         
                          - ### Market Analytics
                         
                          - - **`get_market_by_slug`** - Fetch a specific Polymarket market by its slug identifier
                            - - **`get_open_interest`** - Get open interest data for Polymarket markets
                              - - **`get_top_holders`** - Get top holders for specified Polymarket markets
                               
                                - ### User & Leaderboard Tools
                               
                                - - **`get_leaderboard`** - Fetch Polymarket trader leaderboard rankings (most profitable / highest volume traders)
                                  - - **`get_user_activity`** - Get user activity from Polymarket including trades, splits, merges, and rewards
                                    - - **`get_trades_by_wallet`** - Get all trades for a Polymarket wallet address using the public Data API
                                     
                                      - ## Installation
                                     
                                      - 1. Clone this repository:
                                        2. ```bash
                                           git clone https://github.com/yashhsm/polymarket-mcp.git
                                           cd polymarket-mcp
                                           ```

                                           2. Install dependencies:
                                           3. ```bash
                                              pnpm install
                                              ```

                                              3. Build the project:
                                              4. ```bash
                                                 pnpm build
                                                 ```

                                                 4. Start the server:
                                                 5. ```bash
                                                    pnpm start
                                                    ```

                                                    ## Usage

                                                    This MCP server can be used with any MCP-compatible client. Configure your client to connect to this server's stdio transport, and you'll have access to all available Polymarket tools.

                                                    ### Example: Using with Claude

                                                    Add this to your Claude client configuration to use this server:
                                                    ```json
                                                    {
                                                      "tools": {
                                                        "polymarket": {
                                                          "command": "node",
                                                          "args": ["dist/index.js"],
                                                          "env": {}
                                                        }
                                                      }
                                                    }
                                                    ```

                                                    ## Development

                                                    ### Building
                                                    ```bash
                                                    pnpm build
                                                    ```

                                                    ### Development Mode
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

                                                    ## Project Structure

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
                                                        └── [other tools]     # Additional tool implementations
                                                    ```

                                                    ## API Integration

                                                    This server integrates with the Polymarket public APIs:
                                                    - Markets API - for market data and search
                                                    - - Events API - for event information
                                                      - - User API - for user activity and wallet data
                                                        - - Leaderboard API - for trader rankings
                                                          - - Data API - for trades, holders, and volume data
                                                           
                                                            - ## Technology Stack
                                                           
                                                            - - **Node.js** - JavaScript runtime
                                                              - - **TypeScript** - Type-safe JavaScript
                                                                - - **MCP SDK** - Model Context Protocol SDK
                                                                  - - **Zod** - Schema validation
                                                                   
                                                                    - ## Contributing
                                                                   
                                                                    - Contributions are welcome! Please feel free to submit a Pull Request.
                                                                   
                                                                    - ## License
                                                                   
                                                                    - This project is licensed under the MIT License - see the LICENSE file for details.
                                                                   
                                                                    - ## Support
                                                                   
                                                                    - For issues and feature requests, please use the GitHub Issues page.
