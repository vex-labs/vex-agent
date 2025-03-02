import { NextResponse } from "next/server";
import { USDC_CONTRACT, BETVEX_CONTRACT } from "@/app/config";
import { parseUsdcAmount } from '@/app/utils';

const GAS_300_TGAS = "300000000000000";

type TeamSelection = "Team1" | "Team2";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const matchId = searchParams.get("matchId");
    const team = searchParams.get("team") as TeamSelection;
    const amount = searchParams.get("amount");

    if (!matchId || !team || !amount || (team !== "Team1" && team !== "Team2")) {
        return NextResponse.json(
            { error: "Missing required parameters or invalid team selection" },
            { status: 400 }
        );
    }

    // Parse amount to proper USDC decimal places
    const parsedAmount = parseUsdcAmount(amount);
    if (!parsedAmount) {
        return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
    }

    try {
        const msg = JSON.stringify({
            Bet: {
                match_id: matchId,
                team: team,
            },
        });

        const transactionPayload = {
            receiverId: USDC_CONTRACT,
            actions: [
                {
                    type: "FunctionCall",
                    params: {
                        methodName: "ft_transfer_call",
                        args: {
                            receiver_id: BETVEX_CONTRACT,
                            amount: parsedAmount,
                            msg: msg,
                        },
                        gas: GAS_300_TGAS,
                        deposit: "1",
                    },
                },
            ],
        };

        return NextResponse.json({ transactionPayload });
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to create bet transaction" },
            { status: 500 }
        );
    }
}
