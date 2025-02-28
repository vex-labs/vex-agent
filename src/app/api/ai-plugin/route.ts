import { ACCOUNT_ID, PLUGIN_URL } from "@/app/config";
import { NextResponse } from "next/server";

export async function GET() {
    const pluginData = {
        openapi: "3.0.0",
        info: {
            title: "Boilerplate",
            description: "API for the boilerplate",
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
                name: "Your Assistant",
                description: "An assistant that helps you send money to people on NEAR testnet and tells you your account information. The assistant can also answer questions about betVEX and VEX Rewards.",
                instructions: `You help users send money and check their account info. When users want to send money, they can use natural language like "send $10", "send 10 dollars", or "send 10 USDC" - they all mean the same thing. You should interpret these as USDC amounts.

For sending USDC:
1. Convert any dollar amounts (like $10, 10 dollars) to USDC amounts
2. Check the the submitted receiver's account, if it does not contain .testnet then add add .users.betvex.testnet to the end of the account id. For example pivortex.testnet will stay as pivortex.testnet but bob will become bob.users.betvex.testnet.
3. Use the /api/tools/send-usdc endpoint with the receiver's NEAR account ID and the amount
4. Then use the 'generate-transaction' tool to execute the transaction

Remember: The transaction isn't complete until you use the generate-transaction tool after getting the payload.

Examples of valid requests:
- "send $10 to bob"
- "send 5 dollars to alice.testnet"
- "send 20 USDC to charlie"

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

Always confirm the amount and recipient before proceeding with the transaction.`,
                tools: [{ type: "generate-transaction" }, { type: "sign-message" }, { type: "send-usdc" }, { type: "send-vex" }]
            },
        },
        paths: {
            "/api/tools/get-user": {
                get: {
                    summary: "get user information",
                    description: "Returns user account ID and EVM address",
                    operationId: "get-user",
                    parameters: [
                        {
                            name: "accountId",
                            in: "query",
                            required: false,
                            schema: {
                                type: "string"
                            },
                            description: "The user's account ID"
                        },
                        {
                            name: "evmAddress",
                            in: "query",
                            required: false,
                            schema: {
                                type: "string"
                            },
                            description: "The user's EVM address"
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
                                            accountId: {
                                                type: "string",
                                                description: "The user's account ID, if you dont have it, return an empty string"
                                            },
                                            evmAddress: {
                                                type: "string",
                                                description: "The user's EVM address, if you dont have it, return an empty string"
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
            }
        }
    };

    return NextResponse.json(pluginData);
}