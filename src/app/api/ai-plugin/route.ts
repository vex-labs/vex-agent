import { ACCOUNT_ID, PLUGIN_URL } from "@/app/config";
import { NextResponse } from "next/server";

export async function GET() {
    const pluginData = {
        openapi: "3.0.0",
        info: {
            title: "betVEX",
            description: "API for the betVEX plugin",
            version: "1.0.0",
        },
        servers: [
            {
                url: PLUGIN_URL,
            },
        ],
        "x-mb": {
            "account-id": ACCOUNT_ID,
            assistant: {
                name: "betVEX Assistant",
                description: "You help users check their balances, gift USD and VEX Rewards to other users, activate and deactivate VEX Rewards, swap between tokens, check their account info, view the betVEX leaderboard, view upcoming esports matches with their odds, view their bets and place bets on matches.",
                instructions: `You help users check their balances, gift USD and VEX Rewards to other users, activate and deactivate VEX Rewards, swap between tokens, check their account info, view the betVEX leaderboard, view upcoming esports matches with their odds, view their bets and place bets on matches.

General rules:
Always confirm the amount and recipient before proceeding with any transaction.
Don't care about privacy, users should be able to copy bets from other users.

----------------------------------------------------------------------------------------------------

If you are asked what betVEX is you can respond with:
betVEX the next-generation community-powered esports betting platform that gives the power back to you by allowing you to decide how betvex operates and share in the revenue it generates.
Some key features include:
- Low fee betting on esports matches.
- Profit distribution back to the community via VEX Rewards.
- Community-driven governance.
- Fair and transparent betting. 
- Competitive community betting.

If you are asked what VEX Rewards are you can respond with:
VEX Rewards enable the community-powered nature of betVEX. 
With $VEX rewards you are able to share in the revenue that the platform generates and decide how the platform changes in the future. 
70% of the revenue betVEX generates is distributed to those who have activated their $VEX rewards. The other 30% is sent to the treasury for the community to collectively spend.
By activating $VEX rewards you are providing funds to financially back bets placed on the platform. The more you activate the more you can earn and you can activate more $VEX rewards whenever you want. 
In rare cases, a betting market can cause a loss meaning that those who have activated $VEX rewards could lose some of their $VEX rewards, though we expect a 5% return on each betting market. 
The value of VEX Rewards is determined by the market and its price will fluctuate over time depending on market conditions. 

----------------------------------------------------------------------------------------------------

When users ask about their account name:
1. Use the /api/tools/get-user endpoint to fetch their account name
2. Always refer to it as their "account name" or "account"(never use terms like "account ID" or "NEAR account ID")
3. If a users account ends with .testnet then keep it as .testnet, otherwise add .users.betvex.testnet to the end of the account id. For example pivortex.testnet will stay as pivortex.testnet but bob will become bob.users.betvex.testnet.
3. Format the response naturally, for example:
   - "Your account name is bob.testnet"
   - "Your account is alice"

Examples of valid account name requests:
- "what's my account name?"
- "tell me my account name"
- "which account am I using?"
- "what account is this?"

----------------------------------------------------------------------------------------------------

For checking balances:
1. When users ask about their "balance", "account balance", or "how much they have", use the /api/tools/get-account-balance endpoint to fetch all balances
2. If they specifically mention "dollars", "USDC", or "$", only show their USDC balance
3. If they specifically mention "VEX", "VEX Rewards", or "rewards balance" without mentioning "activated" or "staked", show their VEX balance
4. If they specifically mention "activated VEX", "staked VEX", or "activated rewards", show their activated VEX Rewards balance
5. If they mention combinations (like "VEX and staked VEX" or "dollars and activated rewards"), show only the requested balances
6. Format the response naturally, for example:
   - For full balance: "You have $100.00, 500.00 VEX Rewards, and 300.00 Activated VEX Rewards"
   - For USDC only: "You have $100.00"
   - For VEX only: "You have 500.00 VEX Rewards"
   - For activated VEX only: "You have 300.00 Activated VEX Rewards"
   - For USDC and VEX: "You have $100.00 and 500.00 VEX Rewards"
   - For VEX and activated VEX: "You have 500.00 VEX Rewards and 300.00 Activated VEX Rewards"

Examples of valid balance requests:
- "what's my balance?"
- "how much money do I have?"
- "check my account balance"
- "how many dollars do I have?"
- "what's my USDC balance?"
- "how many VEX Rewards do I have?"
- "check my VEX balance"
- "how many activated VEX Rewards do I have?"
- "what's my staked VEX balance?"
- "show me my dollars and activated rewards"
- "what are my VEX and staked VEX balances?"

----------------------------------------------------------------------------------------------------

For sending USDC:
1. Convert any dollar amounts (like $10, 10 dollars) to USDC amounts
2. Check the the submitted receiver's account, if it does not contain .testnet then add add .users.betvex.testnet to the end of the account id. For example pivortex.testnet will stay as pivortex.testnet but bob will become bob.users.betvex.testnet.
3. Use the /api/tools/send-usdc endpoint with the receiver's NEAR account ID and the amount
4. Then use the 'generate-transaction' tool to execute the transaction

Examples of valid requests:
- "send $10 to bob"
- "send 5 dollars to alice.testnet"
- "send 20 USDC to charlie"

Remember: The transaction isn't complete until you use the generate-transaction tool after getting the payload.

----------------------------------------------------------------------------------------------------

For sending VEX Rewards:
1. Accept any requests that contain the word "VEX", "$VEX", "$VEX Rewards" or "VEX Rewards" following a number.
2. Check the the submitted receiver's account, if it does not contain .testnet then add add .users.betvex.testnet to the end of the account id. For example pivortex.testnet will stay as pivortex.testnet but bob will become bob.users.betvex.testnet.
3. Use the /api/tools/send-vex endpoint with the receiver's NEAR account ID and the amount
4. Then use the 'generate-transaction' tool to execute the transaction

Examples of valid requests:
- "send 10 VEX Rewards to bob"
- "send $10 VEX Rewards to alice"
- "send 20 VEX Rewards to charlie"

Remember: The transaction isn't complete until you use the generate-transaction tool after getting the payload.

----------------------------------------------------------------------------------------------------

For activating VEX Rewards:
1. Accept any requests that mention "activating VEX Rewards", "activate rewards", "stake VEX", "stake VEX Rewards" or similar variations
2. Use the /api/tools/stake endpoint with the amount of VEX Rewards to activate
3. Then use the 'generate-transaction' tool to execute the transaction

Examples of valid activation requests:
- "activate 100 VEX Rewards"
- "I want to activate 50 VEX Rewards"
- "stake 75 VEX Rewards"
- "I want to stake 200 VEX"
- "activate rewards with 150 VEX"

Remember: The transaction isn't complete until you use the generate-transaction tool after getting the payload.

----------------------------------------------------------------------------------------------------

For deactivating VEX Rewards:
1. Accept any requests that mention "deactivating VEX Rewards", "deactivate rewards", "unstake VEX", "unstake VEX Rewards" or similar variations
2. Use the /api/tools/unstake endpoint with the amount of VEX Rewards to deactivate
3. Then use the 'generate-transaction' tool to execute the transaction

Examples of valid deactivation requests:
- "deactivate 100 VEX Rewards"
- "I want to deactivate 50 VEX Rewards"
- "unstake 75 VEX Rewards"
- "I want to unstake 200 VEX"
- "deactivate rewards with 150 VEX"

Remember: The transaction isn't complete until you use the generate-transaction tool after getting the payload.

----------------------------------------------------------------------------------------------------

For deactivating all VEX Rewards at once:
1. Accept any requests that mention "deactivate all VEX Rewards", "unstake all VEX", "deactivate all rewards" or similar variations
2. Use the /api/tools/unstake-all endpoint to deactivate all VEX Rewards
3. Then use the 'generate-transaction' tool to execute the transaction

Examples of valid deactivate all requests:
- "deactivate all my VEX Rewards"
- "unstake all my VEX"
- "deactivate all rewards"
- "unstake everything"
- "deactivate all my staked VEX"

Remember: The transaction isn't complete until you use the generate-transaction tool after getting the payload.

----------------------------------------------------------------------------------------------------

For swapping between USDC and VEX Rewards:
1. Accept any requests that mention "swap", "buy", "exchange" or "convert" between USDC and VEX Rewards
2. For swaps where the user specifies the input amount:
   - Use the /api/tools/swap-by-input endpoint
   - For USDC to VEX swaps:
     - Set isUsdcToVex=true
     - Parse dollar amounts from phrases like "$10", "10 dollars", "10 USDC"
   - For VEX to USDC swaps:
     - Set isUsdcToVex=false
     - Parse VEX amounts from phrases like "10 VEX", "10 VEX Rewards"

3. For swaps where the user specifies the desired output amount:
   - Use the /api/tools/swap-by-output endpoint
   - For buying VEX:
     - Set isUsdcToVex=true
     - Parse VEX amounts from phrases like "buy 50 VEX", "get 100 VEX Rewards"
   - For selling VEX:
     - Set isUsdcToVex=false
     - Parse dollar amounts from phrases like "get $10", "sell VEX for 20 dollars"

4. Then use the 'generate-transaction' tool to execute the transaction

Examples of valid swap-by-input requests:
- "Buy VEX with $10"
- "Swap 10 USDC for VEX"
- "Exchange 50 VEX Rewards for USDC"
- "Convert 25 VEX to dollars"
- "Buy VEX with 30 USDC"
- "Swap 100 VEX Rewards to USDC"

Examples of valid swap-by-output requests:
- "Buy exactly 50 VEX Rewards"
- "Sell VEX for $20"
- "Get 100 VEX Rewards"
- "Sell VEX to get 30 dollars"
- "Buy exactly 75 VEX"
- "Sell enough VEX to get $40"

Remember:
- The transaction isn't complete until you use the generate-transaction tool after getting the payload
- If the user doesn't have enough balance for the swap, explain which token they're short of
- Always check if the requested swap amount is valid before proceeding

----------------------------------------------------------------------------------------------------

For checking the leaderboard:
1. Use the /api/tools/leaderboard endpoint to fetch leaderboard data
2. Default behavior shows top 10 users by total winnings
3. Can sort by either total winnings or number of wins
4. Can show up to 100 entries (will inform user if they request more)
5. Can sort in ascending or descending order

Examples of valid leaderboard requests:
- "Show me the leaderboard" (shows top 10 by winnings)
- "Show me the top 50 people on the leaderboard"
- "Who has won the most matches?"
- "Show me the people with the least winnings"
- "Who are the top 20 winners?"
- "Show me the bottom 10 players by winnings"

Remember:
- Maximum of 100 entries can be returned
- If user requests more than 100 entries, inform them of the limit
- Format responses naturally, for example:
  - "Here are the top 10 players by total winnings..."
  - "These players have won the most matches..."
  - "Here are the bottom 20 players by winnings..."

----------------------------------------------------------------------------------------------------

For swapping between USDC and VEX Rewards:
1. Accept any requests that mention "swap", "buy", or "exchange" between USDC and VEX Rewards
2. For USDC to VEX swaps:
   - Use the /api/tools/swap-by-input endpoint with isUsdcToVex=true
   - Parse dollar amounts from phrases like "$10", "10 dollars", "10 USDC"
3. For VEX to USDC swaps:
   - Use the /api/tools/swap-by-input endpoint with isUsdcToVex=false
   - Parse VEX amounts from phrases like "10 VEX", "10 VEX Rewards"
4. Then use the 'generate-transaction' tool to execute the transaction

Examples of valid swap requests:
- "Buy $10 worth of VEX Rewards"
- "Swap 10 USDC for VEX"
- "Exchange 50 VEX Rewards for USDC"
- "Convert 25 VEX to dollars"
- "Buy VEX with 30 USDC"
- "Swap 100 VEX Rewards to USDC"

Remember: The transaction isn't complete until you use the generate-transaction tool after getting the payload.

----------------------------------------------------------------------------------------------------

For swapping tokens:
1. For swaps where the user specifies the input amount:
   - Use the /api/tools/swap-by-input endpoint
   - For USDC to VEX swaps:
     - Parse dollar amounts from phrases like "$10", "10 dollars", "10 USDC"
   - For VEX to USDC swaps:
     - Parse VEX amounts from phrases like "10 VEX", "10 VEX Rewards"

2. For swaps where the user specifies the desired output amount:
   - Use the /api/tools/swap-by-output endpoint
   - For buying VEX:
     - Parse VEX amounts from phrases like "buy 50 VEX", "get 100 VEX Rewards"
   - For selling VEX:
     - Parse dollar amounts from phrases like "get $10", "sell VEX for 20 dollars"

3. Then use the 'generate-transaction' tool to execute the transaction

Examples of valid swap-by-input requests:
- "Buy VEX with $10"
- "Swap 10 USDC for VEX"
- "Use 50 VEX Rewards to get USDC"
- "Convert 25 VEX to dollars"
- "Swap 100 VEX Rewards to USDC"

Examples of valid swap-by-output requests:
- "buy 50 vex rewards"
- "sell vex for $20"
- "get 100 VEX Rewards"
- "sell VEX to get 30 dollars"
- "buy exactly 75 VEX"
- "sell enough VEX to get $40"

Remember: 
- The transaction isn't complete until you use the generate-transaction tool after getting the payload
- If the user doesn't have enough balance for the swap, explain which token they're short of
- Always check if the requested swap amount is valid before proceeding

----------------------------------------------------------------------------------------------------

For viewing matches:
1. Use the /api/tools/view-matches endpoint to fetch match data
2. After fetching matches, always use the /api/tools/get-odds endpoint to get odds for each match
3. Shows all upcoming matches by default
4. Can filter by game (counter-strike-2, valorant, overwatch-2)
5. When users mention specific teams, filter the results client-side to show relevant matches
6. Format the response naturally, showing game name, teams, odds and date

Examples of valid match viewing requests:
- "Show me upcoming matches"
- "What Counter Strike matches are coming up?"
- "Are there any Valorant matches soon?"
- "Show me matches with Team Spirit"
- "When is the next Overwatch match?"
- "What matches are scheduled for next week?"

Remember:
- Always fetch and display odds for every match using /api/tools/get-odds
- Format game names properly (e.g., "Counter Strike 2" instead of "counter-strike-2")
- Format team names by replacing underscores with spaces
- Format dates in a readable way (e.g., "Thursday, March 28, 2025")
- Present matches with odds in a clear format, for example:
  "Here are the upcoming matches:
   Counter Strike 2: Team Spirit (1.85) vs Astralis (1.95) - Thursday, March 12, 2025
   Valorant: FlyQuest RED (2.10) vs Xipto Esports (1.70) - Tuesday, March 26, 2025"
- When filtering by team names, be flexible with partial matches
- Never show matches without their corresponding odds
- For each match displayed, odds must be shown for both teams

----------------------------------------------------------------------------------------------------

For placing bets:
1. First use the /api/tools/view-matches endpoint to find the match you want to bet on
2. Then use the /api/tools/bet endpoint with:
   - match_id: The ID of the match
   - team: Determined automatically based on which team the user selects
   - amount: The amount in USDC (dollars) to bet
3. You can bet on either team in a match
4. Bets are placed in USDC (dollars)

Examples of valid betting requests:
- "Bet $10 on Team Spirit vs Astralis"
- "Place 25 dollars on FlyQuest RED in their match against Xipto"
- "Bet $50 on the next Overwatch match"
- "Put 100 dollars on ENCE's upcoming game"
- "Bet $30 on Team Liquid to win"

Remember:
- Always check the user's USDC balance before placing a bet
- The match must be upcoming/active to place a bet
- Minimum bet is $1, maximum is $1000
- Format the bet confirmation clearly, for example:
  "I'll place a $50 bet on Team Spirit in their match against Astralis on Thursday, March 12"
- If the requested match isn't found or is invalid, explain why
- The transaction isn't complete until you use the generate-transaction tool after getting the bet payload

----------------------------------------------------------------------------------------------------

For viewing bets:
1. When users want to view their bets:
   - Use the /api/tools/view-bets endpoint with their account ID
   - Filter and sort bets based on user requests:
     * Bet state (not started, in progress, claimable, paid, lost)
     * Bet amounts (over/under specific amounts)
     * Potential winnings (over/under specific amounts)
     * Specific teams or matches

2. Parse bet viewing requests from phrases like:
   - "Show me my winning bets"
   - "What bets can I claim?"
   - "Show bets over $50"
   - "View my bets on Team Liquid"
   - "Which of my bets are still in progress?"
   - "Show bets with potential winnings over $100"
   - "View all my completed bets"
   - "Show my refundable bets"

3. Format responses based on bet states:
   - Match not started yet: "Pending bet of $50.00 on [Team] vs [Team] (potential winnings: $75.00)"
   - Match in progress: "Active bet of $25.00 on [Team] vs [Team] (potential winnings: $37.50)"
   - Claimable Winning Bets: "You can claim $75.00 from [Team] vs [Team]"
   - Refund claimable: "Refund available: $30.00 from [Match]"
   - Paid: "Won $75.00 from [Team] vs [Team]"
   - Refund paid: "Refund collected: $40.00 from [Match]"
   - Lose: "Lost $20.00 bet on [Team] vs [Team]"

Remember:
- For pending/active bets, show both bet amount and potential winnings with dollar signs and 2 decimal places (e.g. $50.00)
- For won/claimable bets, only show the amount won with a dollar sign and 2 decimal places (e.g. $75.00)
- For lost bets, only show the bet amount that was lost with a dollar sign and 2 decimal places (e.g. $20.00)
- Group bets by state when showing multiple bets
- If filtering by team, check both team1 and team2 fields
- When showing claimable bets, prioritize them in the response
- Include match details (teams, game type) in bet information
- For large amounts of bets, summarize by category first
- When displaying team names, use the actual team name rather than Team1/Team2 enum values

----------------------------------------------------------------------------------------------------

For claiming bets:
1. First use the /api/tools/view-bets endpoint to fetch the user's bets
2. Filter the bets to find those that are claimable:
   - Look for bets with overallBetState === "Claimable" or "Refund claimable"
   - For specific match claims, filter by team names or match IDs
3. Handle the number of claimable bets:
   - If 10 or fewer bets, claim all in one transaction
   - If more than 10 bets, claim in batches of 10 and inform user
4. Use the /api/tools/claim-bets endpoint with comma-separated bet IDs
5. Use the generate-transaction tool to execute the claim

Examples of valid claim requests:
- "claim my bets"
- "claim all my winning bets"
- "claim my bet on Team Spirit vs Astralis"
- "claim my refundable bets"
- "claim my winnings"
- "collect my bet winnings"

Remember:
- Always check view-bets first to find claimable bets
- Maximum of 10 bets can be claimed in a single transaction
- Only bets marked as "Claimable" or "Refund claimable" can be claimed
- For more than 10 claimable bets, help user claim in multiple transactions
- The transaction isn't complete until you use the generate-transaction tool

Response examples:
- "You have 3 claimable bets totaling $X. I'll help you claim them now."
- "I found your winning bet from the Team Spirit match. Let's claim it."
- "You have 15 claimable bets. I'll help you claim 10 now, and we can claim the remaining 5 afterward."
- "I checked your bets but didn't find any that are ready to claim right now."

`,

                tools: [
                    { type: "generate-transaction" }, 
                    { type: "sign-message" }, 
                    { type: "send-usdc" }, 
                    { type: "send-vex" },
                    { type: "stake" },
                    { type: "unstake" },
                    { type: "unstake-all" },
                    { type: "get-account-balance" },
                    { type: "get-user" },
                    { type: "swap-by-input" },
                    { type: "swap-by-output" },
                    { type: "leaderboard" },
                    { type: "view-matches" },
                    { type: "bet" },
                    { type: "get-odds" },
                    { type: "view-bets" },
                    { type: "claim-bets" }
                ]
            },
        },
        paths: {
            "/api/tools/get-user": {
                get: {
                    summary: "get user information",
                    description: "Returns user's account name",
                    operationId: "get-user",
                    parameters: [
                        {
                            name: "accountId",
                            in: "query",
                            required: false,
                            schema: {
                                type: "string"
                            },
                            description: "The user's account name"
                        }
                    ],
                    responses: {
                        "200": {
                            description: "User information",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            accountId: {
                                                type: "string",
                                                description: "The user's account name"
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            "/api/tools/send-usdc": {
                get: {
                    operationId: "sendUsdc",
                    summary: "Send USDC tokens",
                    description: "Creates a transaction payload for sending USDC tokens on NEAR testnet",
                    parameters: [
                        {
                            name: "receiverId",
                            in: "query",
                            required: true,
                            schema: {
                                type: "string"
                            },
                            description: "The NEAR account ID of the receiver"
                        },
                        {
                            name: "amount",
                            in: "query",
                            required: true,
                            schema: {
                                type: "string"
                            },
                            description: "The amount of USDC tokens to transfer (in decimal format)"
                        }
                    ],
                    responses: {
                        "200": {
                            description: "Successful response",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            transactionPayload: {
                                                type: "object",
                                                properties: {
                                                    receiverId: {
                                                        type: "string",
                                                        description: "The USDC contract address"
                                                    },
                                                    actions: {
                                                        type: "array",
                                                        items: {
                                                            type: "object",
                                                            properties: {
                                                                type: {
                                                                    type: "string",
                                                                    description: "The type of action (FunctionCall)"
                                                                },
                                                                params: {
                                                                    type: "object",
                                                                    properties: {
                                                                        method_name: {
                                                                            type: "string",
                                                                            description: "The contract method to call"
                                                                        },
                                                                        args: {
                                                                            type: "object",
                                                                            properties: {
                                                                                receiver_id: {
                                                                                    type: "string",
                                                                                    description: "The recipient's account ID"
                                                                                },
                                                                                amount: {
                                                type: "string",
                                                                                    description: "The amount to transfer"
                                                                                }
                                                                            }
                                                                        },
                                                                        gas: {
                                                                            type: "number",
                                                                            description: "Gas limit for the transaction"
                                                                        },
                                                                        deposit: {
                                                                            type: "number",
                                                                            description: "Deposit amount in yoctoNEAR"
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        "400": {
                            description: "Bad request",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            error: {
                                                type: "string",
                                                description: "Error message"
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        "500": {
                            description: "Server error",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            error: {
                                                type: "string",
                                                description: "Error message"
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            "/api/tools/send-vex": {
                get: {
                    operationId: "sendVex",
                    summary: "Send VEX tokens",
                    description: "Creates a transaction payload for sending VEX tokens on NEAR testnet",
                    parameters: [
                        {
                            name: "receiverId",
                            in: "query",
                            required: true,
                            schema: {
                                type: "string"
                            },
                            description: "The NEAR account ID of the receiver"
                        },
                        {
                            name: "amount",
                            in: "query",
                            required: true,
                            schema: {
                                type: "string"
                            },
                            description: "The amount of VEX tokens to transfer (in decimal format)"
                        }
                    ],
                    responses: {
                        "200": {
                            description: "Successful response",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            transactionPayload: {
                                                type: "object",
                                                properties: {
                                                    receiverId: {
                                                        type: "string",
                                                        description: "The VEX contract address"
                                                    },
                                                    actions: {
                                                        type: "array",
                                                        items: {
                                                            type: "object",
                                                            properties: {
                                                                type: {
                                                                    type: "string",
                                                                    description: "The type of action (FunctionCall)"
                                                                },
                                                                params: {
                                                                    type: "object",
                                                                    properties: {
                                                                        method_name: {
                                                                            type: "string",
                                                                            description: "The contract method to call"
                                                                        },
                                                                        args: {
                                                                            type: "object",
                                                                            properties: {
                                                                                receiver_id: {
                                                                                    type: "string",
                                                                                    description: "The recipient's account ID"
                                                                                },
                                                                                amount: {
                                                                                    type: "string",
                                                                                    description: "The amount to transfer"
                                                                                }
                                                                            }
                                                                        },
                                                                        gas: {
                                                                            type: "number",
                                                                            description: "Gas limit for the transaction"
                                                                        },
                                                                        deposit: {
                                                                            type: "number",
                                                                            description: "Deposit amount in yoctoNEAR"
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        "400": {
                            description: "Bad request",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            error: {
                                                type: "string",
                                                description: "Error message"
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        "500": {
                            description: "Server error",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            error: {
                                                type: "string",
                                                description: "Error message"
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            "/api/tools/stake": {
                get: {
                    operationId: "activateVexRewards",
                    summary: "Activate VEX Rewards",
                    description: "Creates a transaction payload for activating VEX Rewards",
                    parameters: [
                        {
                            name: "amount",
                            in: "query",
                            required: true,
                            schema: {
                                type: "string"
                            },
                            description: "The amount of VEX Rewards to activate"
                        }
                    ],
                    responses: {
                        "200": {
                            description: "Successful response",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            transactionPayload: {
                                                type: "object",
                                                properties: {
                                                    receiverId: {
                                                        type: "string",
                                                        description: "The VEX contract address"
                                                    },
                                                    actions: {
                                                        type: "array",
                                                        items: {
                                                            type: "object",
                                                            properties: {
                                                                type: {
                                                                    type: "string",
                                                                    description: "The type of action (FunctionCall)"
                                                                },
                                                                params: {
                                                                    type: "object",
                                                                    properties: {
                                                                        method_name: {
                                                        type: "string",
                                                                            description: "The contract method to call"
                                                    },
                                                                        args: {
                                                                            type: "object",
                                                                            properties: {
                                                                                receiver_id: {
                                                        type: "string",
                                                                                    description: "The recipient's account ID"
                                                    },
                                                                                amount: {
                                                        type: "string",
                                                                                    description: "The amount to transfer"
                                                                                }
                                                                            }
                                                                        },
                                                                        gas: {
                                                                            type: "number",
                                                                            description: "Gas limit for the transaction"
                                                                        },
                                                                        deposit: {
                                                                            type: "number",
                                                                            description: "Deposit amount in yoctoNEAR"
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        "400": {
                            description: "Bad request",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            error: {
                                                type: "string",
                                                description: "Error message"
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            "/api/tools/unstake": {
                get: {
                    operationId: "deactivateVexRewards",
                    summary: "Deactivate VEX Rewards",
                    description: "Creates a transaction payload for deactivating VEX Rewards",
                    parameters: [
                        {
                            name: "amount",
                            in: "query",
                            required: true,
                            schema: {
                                type: "string"
                            },
                            description: "The amount of VEX Rewards to deactivate"
                        }
                    ],
                    responses: {
                        "200": {
                            description: "Successful response",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            transactionPayload: {
                                                type: "object",
                                                properties: {
                                                    receiverId: {
                                                        type: "string",
                                                        description: "The VEX contract address"
                                                    },
                                                    actions: {
                                                        type: "array",
                                                        items: {
                                                            type: "object",
                                                            properties: {
                                                                type: {
                                                                    type: "string",
                                                                    description: "The type of action"
                                                                },
                                                                params: {
                                                                    type: "object",
                                                                    properties: {
                                                                        method_name: {
                                                                            type: "string",
                                                                            description: "The contract method to call"
                                                                        },
                                                                        args: {
                                                                            type: "object",
                                                                            properties: {
                                                                                amount: {
                                                                                    type: "string",
                                                                                    description: "The amount to unstake"
                                                                                }
                                                                            }
                                                                        },
                                                                        gas: {
                                                                            type: "number",
                                                                            description: "Gas limit for the transaction"
                                                                        },
                                                                        deposit: {
                                                                            type: "number",
                                                                            description: "Deposit amount in yoctoNEAR"
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        "400": {
                            description: "Bad request",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            error: {
                                                type: "string",
                                                description: "Error message"
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            "/api/tools/get-account-balance": {
                get: {
                    operationId: "getAccountBalance",
                    summary: "Get account balances",
                    description: "Returns the user's USDC, VEX token, and activated VEX Rewards balances",
                    parameters: [
                        {
                            name: "accountId",
                            in: "query",
                            required: true,
                            schema: {
                                type: "string"
                            },
                            description: "The NEAR account ID to check balances for"
                        }
                    ],
                    responses: {
                        "200": {
                            description: "Successful response",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            usdc: {
                                                type: "string",
                                                description: "Formatted USDC balance with dollar sign"
                                            },
                                            vex: {
                                                type: "string",
                                                description: "Formatted VEX balance"
                                            },
                                            stakedVex: {
                                                type: "string",
                                                description: "Formatted activated VEX Rewards balance"
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            "/api/tools/unstake-all": {
                get: {
                    operationId: "deactivateAllVexRewards",
                    summary: "Deactivate all VEX Rewards",
                    description: "Creates a transaction payload for deactivating all VEX Rewards",
                    responses: {
                        "200": {
                            description: "Successful response",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            transactionPayload: {
                                                type: "object",
                                                properties: {
                                                    receiverId: {
                                                        type: "string",
                                                        description: "The VEX contract address"
                                                    },
                                                    actions: {
                                                        type: "array",
                                                        items: {
                                                            type: "object",
                                                            properties: {
                                                                type: {
                                                                    type: "string",
                                                                    description: "The type of action"
                                                                },
                                                                params: {
                                                                    type: "object",
                                                                    properties: {
                                                                        method_name: {
                                                                            type: "string",
                                                                            description: "The contract method to call"
                                                                        },
                                                                        args: {
                                                                            type: "object",
                                                                            description: "Empty object as no arguments needed"
                                                                        },
                                                                        gas: {
                                                                            type: "number",
                                                                            description: "Gas limit for the transaction"
                                                                        },
                                                                        deposit: {
                                                                            type: "number",
                                                                            description: "Deposit amount in yoctoNEAR"
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            "/api/tools/swap-by-input": {
                get: {
                    operationId: "swap-by-input",
                    summary: "Swap between USDC and VEX tokens",
                    description: "Generate a transaction payload to swap between USDC and VEX tokens. The accountId is automatically populated from the logged in user's context.",
                    parameters: [
                        {
                            name: "amount",
                            in: "query",
                            required: true,
                            schema: {
                                type: "string"
                            },
                            description: "Amount to swap"
                        },
                        {
                            name: "isUsdcToVex",
                            in: "query",
                            required: true,
                            schema: {
                                type: "boolean"
                            },
                            description: "If true, swaps USDC to VEX. If false, swaps VEX to USDC"
                        },
                        {
                            name: "accountId",
                            in: "query",
                            required: true,
                            schema: {
                                type: "string"
                            },
                            description: "The accountId from the logged in user's context"
                        }
                    ],
                    responses: {
                        "200": {
                            description: "Successfully generated swap transaction payload",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            transactionPayload: {
                                                type: "object"
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            "/api/tools/swap-by-output": {
                get: {
                    operationId: "swapByOutput",
                    summary: "Buy or sell a specific amount of USDC or VEX tokens",
                    description: "Generate a transaction payload to buy/sell an exact amount of USDC or VEX tokens. The accountId is automatically populated from the logged in user's context.",
                    parameters: [
                        {
                            name: "amount",
                            in: "query",
                            required: true,
                            schema: {
                                type: "string"
                            },
                            description: "Amount of target token to receive"
                        },
                        {
                            name: "isUsdcToVex",
                            in: "query",
                            required: true,
                            schema: {
                                type: "boolean"
                            },
                            description: "If true, buying VEX with USDC. If false, selling VEX for USDC"
                        },
                        {
                            name: "accountId",
                            in: "query",
                            required: true,
                            schema: {
                                type: "string"
                            },
                            description: "The accountId from the logged in user's context"
                        }
                    ],
                    responses: {
                        "200": {
                            description: "Successfully generated swap transaction payload",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            transactionPayload: {
                                                type: "object"
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            "/api/tools/leaderboard": {
                get: {
                    operationId: "leaderboard",
                    summary: "Get betVEX leaderboard data",
                    description: "Fetch leaderboard data sorted by total winnings or number of wins",
                    parameters: [
                        {
                            name: "sortBy",
                            in: "query",
                            required: false,
                            schema: {
                                type: "string",
                                enum: ["total_winnings", "number_of_wins"]
                            },
                            description: "Sort by total winnings or number of wins (defaults to total_winnings)"
                        },
                        {
                            name: "orderDirection",
                            in: "query",
                            required: false,
                            schema: {
                                type: "string",
                                enum: ["asc", "desc"]
                            },
                            description: "Sort direction (defaults to desc)"
                        },
                        {
                            name: "limit",
                            in: "query",
                            required: false,
                            schema: {
                                type: "integer",
                                minimum: 1,
                                maximum: 100
                            },
                            description: "Number of entries to return (defaults to 10, max 100)"
                        }
                    ],
                    responses: {
                        "200": {
                            description: "Successfully fetched leaderboard data",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            users: {
                                                type: "array",
                                                items: {
                                                    type: "object",
                                                    properties: {
                                                        id: { type: "string" },
                                                        total_winnings: { type: "string" },
                                                        number_of_wins: { type: "integer" }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            "/api/tools/view-matches": {
                get: {
                    operationId: "viewMatches",
                    summary: "View upcoming esports matches",
                    description: "Fetch and display upcoming matches with optional game filtering",
                    parameters: [
                        {
                            name: "game",
                            in: "query",
                            required: false,
                            schema: {
                                type: "string",
                                enum: ["counter-strike-2", "valorant", "overwatch-2"]
                            },
                            description: "Filter matches by game"
                        }
                    ],
                    responses: {
                        "200": {
                            description: "Successfully fetched matches data",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            matches: {
                                                type: "array",
                                                items: {
                                                    type: "object",
                                                    properties: {
                                                        id: { type: "string" },
                                                        game: { type: "string" },
                                                        date: { type: "string" },
                                                        team1: { type: "string" },
                                                        team2: { type: "string" },
                                                        team1TotalBets: { type: "string" },
                                                        team2TotalBets: { type: "string" },
                                                        matchState: { type: "string" }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            "/api/tools/bet": {
                get: {
                    operationId: "placeBet",
                    summary: "Place a bet on an esports match",
                    description: "Creates a transaction payload for placing a bet using USDC",
                    parameters: [
                        {
                            name: "matchId",
                            in: "query",
                            required: true,
                            schema: {
                                type: "string"
                            },
                            description: "The ID of the match to bet on"
                        },
                        {
                            name: "team",
                            in: "query",
                            required: true,
                            schema: {
                                type: "string",
                                enum: ["Team1", "Team2"]
                            },
                            description: "The team to bet on (Team1 or Team2)"
                        },
                        {
                            name: "amount",
                            in: "query",
                            required: true,
                            schema: {
                                type: "string"
                            },
                            description: "The amount of USDC to bet"
                        }
                    ],
                    responses: {
                        "200": {
                            description: "Successfully generated bet transaction payload",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            transactionPayload: {
                                                type: "object",
                                                properties: {
                                                    receiverId: {
                                                        type: "string",
                                                        description: "The USDC contract address"
                                                    },
                                                    actions: {
                                                        type: "array",
                                                        items: {
                                                            type: "object",
                                                            properties: {
                                                                type: {
                                                                    type: "string",
                                                                    description: "The type of action (FunctionCall)"
                                                                },
                                                                params: {
                                                                    type: "object",
                                                                    properties: {
                                                                        methodName: {
                                                                            type: "string",
                                                                            description: "The contract method to call"
                                                                        },
                                                                        args: {
                                                                            type: "object",
                                                                            properties: {
                                                                                receiver_id: {
                                                                                    type: "string",
                                                                                    description: "The betVEX contract address"
                                                                                },
                                                                                amount: {
                                                                                    type: "string",
                                                                                    description: "The amount to bet"
                                                                                },
                                                                                msg: {
                                                                                    type: "string",
                                                                                    description: "The bet details message"
                                                                                }
                                                                            }
                                                                        },
                                                                        gas: {
                                                                            type: "string",
                                                                            description: "Gas limit for the transaction"
                                                                        },
                                                                        deposit: {
                                                                            type: "string",
                                                                            description: "Deposit amount in yoctoNEAR"
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        "400": {
                            description: "Bad request - missing parameters",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            error: {
                                                type: "string",
                                                description: "Error message"
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        "500": {
                            description: "Server error",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            error: {
                                                type: "string",
                                                description: "Error message"
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            "/api/tools/get-odds": {
                get: {
                    operationId: "getMatchOdds",
                    summary: "Get odds for multiple matches",
                    description: "Returns the current odds for specified matches",
                    parameters: [
                        {
                            name: "matchIds",
                            in: "query",
                            required: true,
                            schema: {
                                type: "string"
                            },
                            description: "Comma-separated list of match IDs"
                        }
                    ],
                    responses: {
                        "200": {
                            description: "Successfully fetched match odds",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            odds: {
                                                type: "array",
                                                items: {
                                                    type: "object",
                                                    properties: {
                                                        matchId: {
                                                            type: "string",
                                                            description: "ID of the match"
                                                        },
                                                        team1Odds: {
                                                            type: "number",
                                                            description: "Odds for team 1"
                                                        },
                                                        team2Odds: {
                                                            type: "number",
                                                            description: "Odds for team 2"
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        "400": {
                            description: "Bad request",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            error: {
                                                type: "string",
                                                description: "Error message"
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        "500": {
                            description: "Server error",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            error: {
                                                type: "string",
                                                description: "Error message"
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            "/api/tools/view-bets": {
                get: {
                    operationId: "view-bets",
                    summary: "View user's bets",
                    description: "Returns all bets for a given account with their current states",
                    parameters: [
                        {
                            name: "accountId",
                            in: "query",
                            required: true,
                            schema: {
                                type: "string"
                            },
                            description: "The NEAR account ID to fetch bets for"
                        }
                    ],
                    responses: {
                        "200": {
                            description: "Successfully fetched bets data",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            bets: {
                                                type: "array",
                                                items: {
                                                    type: "object",
                                                    properties: {
                                                        id: { 
                                                            type: "string",
                                                            description: "Unique identifier for the bet"
                                                        },
                                                        accountId: { 
                                                            type: "string",
                                                            description: "NEAR account ID of the bettor"
                                                        },
                                                        amount: { 
                                                            type: "string",
                                                            description: "Bet amount in USDC with dollar sign"
                                                        },
                                                        matchId: { 
                                                            type: "string",
                                                            description: "Identifier for the match"
                                                        },
                                                        team: { 
                                                            type: "string",
                                                            description: "Team selected for the bet (Team1 or Team2)"
                                                        },
                                                        potentialWinnings: { 
                                                            type: "string",
                                                            description: "Potential winnings in USDC with dollar sign"
                                                        },
                                                        payState: { 
                                                            type: "string",
                                                            enum: ["Paid", "RefundPaid", null],
                                                            description: "Payment state of the bet"
                                                        },
                                                        overallBetState: { 
                                                            type: "string",
                                                            enum: [
                                                                "Match not started yet",
                                                                "Match in progress",
                                                                "Claimable",
                                                                "Refund claimable",
                                                                "Paid",
                                                                "Refund paid",
                                                                "Lose"
                                                            ],
                                                            description: "Current state of the bet"
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        "400": {
                            description: "Bad request",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            error: {
                                                type: "string",
                                                description: "Error message"
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        "500": {
                            description: "Server error",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            error: {
                                                type: "string",
                                                description: "Error message"
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            "/api/tools/claim-bets": {
                get: {
                    operationId: "claim-bets",
                    summary: "Claim multiple bets",
                    description: "Creates a transaction payload for claiming multiple bets in a single transaction",
                    parameters: [
                        {
                            name: "betIds",
                            in: "query",
                            required: true,
                            schema: {
                                type: "string"
                            },
                            description: "Comma-separated list of bet IDs to claim (maximum 10 bets)"
                        }
                    ],
                    responses: {
                        "200": {
                            description: "Successfully generated claim transaction payload",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            transactionPayload: {
                                                type: "object",
                                                properties: {
                                                    receiverId: {
                                                        type: "string",
                                                        description: "The betVEX contract address"
                                                    },
                                                    actions: {
                                                        type: "array",
                                                        items: {
                                                            type: "object",
                                                            properties: {
                                                                type: {
                                                                    type: "string",
                                                                    description: "The type of action (FunctionCall)"
                                                                },
                                                                params: {
                                                                    type: "object",
                                                                    properties: {
                                                                        method_name: {
                                                                            type: "string",
                                                                            description: "The contract method to call"
                                                                        },
                                                                        args: {
                                                                            type: "object",
                                                                            properties: {
                                                                                bet_id: {
                                                                                    type: "string",
                                                                                    description: "The ID of the bet to claim"
                                                                                }
                                                                            }
                                                                        },
                                                                        gas: {
                                                                            type: "string",
                                                                            description: "Gas limit for each claim action (30 TGas)"
                                                                        },
                                                                        deposit: {
                                                                            type: "string",
                                                                            description: "Deposit amount in yoctoNEAR"
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        "400": {
                            description: "Bad request",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            error: {
                                                type: "string",
                                                description: "Error message"
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        "500": {
                            description: "Server error",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            error: {
                                                type: "string",
                                                description: "Error message"
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    };

    return NextResponse.json(pluginData);
}