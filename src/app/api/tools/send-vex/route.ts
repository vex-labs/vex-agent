import { parseVexAmount } from '@/app/utils';
import { VEX_TOKEN_CONTRACT } from '@/app/config';
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
    const parsedAmount = parseVexAmount(amount);
    if (!parsedAmount) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
    }

    const transactionPayload = {
      receiverId: VEX_TOKEN_CONTRACT,
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

    return NextResponse.json({ transactionPayload });
  } catch (error) {
    console.error('Error generating VEX transfer payload:', error);
    return NextResponse.json({ error: 'Failed to generate VEX transfer payload' }, { status: 500 });
  }
}
