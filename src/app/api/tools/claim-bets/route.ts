import { BETVEX_CONTRACT } from '@/app/config';
import { NextResponse } from 'next/server';

const MAX_CLAIMS = 10;
const GAS_PER_CLAIM = '30000000000000'; // 30 TGas per claim action

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const betIds = searchParams.get('betIds')?.split(',');

    if (!betIds || betIds.length === 0) {
      return NextResponse.json(
        { error: 'betIds parameter is required' },
        { status: 400 }
      );
    }

    // Limit the number of claims to MAX_CLAIMS
    if (betIds.length > MAX_CLAIMS) {
      return NextResponse.json(
        { error: `Cannot claim more than ${MAX_CLAIMS} bets at once` },
        { status: 400 }
      );
    }

    // Create an action for each bet claim
    const actions = betIds.map(betId => ({
      type: 'FunctionCall',
      params: {
        method_name: 'claim',
        args: {
          bet_id: betId,
        },
        gas: GAS_PER_CLAIM,
        deposit: '0',
      },
    }));

    const transactionPayload = {
      receiverId: BETVEX_CONTRACT,
      actions,
    };

    return NextResponse.json({ transactionPayload });
  } catch (error) {
    console.error('Error generating claim bets payload:', error);
    return NextResponse.json(
      { error: 'Failed to generate claim bets payload' },
      { status: 500 }
    );
  }
}
