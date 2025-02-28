import { parseUsdcAmount } from '@/app/utils';
import { USDC_CONTRACT } from '@/app/config';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const receiverId = searchParams.get('receiverId');
    const amount = searchParams.get('amount');

    if (!amount) {
      return NextResponse.json({ error: 'amount is required' }, { status: 400 });
    }

    // Parse amount to proper decimal places
    const parsedAmount = parseUsdcAmount(amount);
    if (!parsedAmount) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
    }

    const transactionPayload = {
      receiverId: USDC_CONTRACT,
      actions: [
        {
          type: 'FunctionCall',
          params: {
            method_name: 'ft_transfer',
            args: {
              receiver_id: receiverId,
              amount: parsedAmount,
            },
            gas: 100000000000000,
            deposit: 1,
          },
        },
      ],
    };

    console.log("Hello world");

    return NextResponse.json({ transactionPayload });
  } catch (error) {
    console.error('Error generating unstake payload:', error);
    return NextResponse.json({ error: 'Failed to generate unstake payload' }, { status: 500 });
  }
} 