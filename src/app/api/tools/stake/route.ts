import { parseVexAmount } from '@/app/utils';
import { VEX_TOKEN_CONTRACT, VEX_CONTRACT } from '@/app/config';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
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
            method_name: 'ft_transfer_call',
            args: {
              receiver_id: VEX_CONTRACT,
              amount: parsedAmount,
              msg: JSON.stringify("Stake"),
            },
            gas: 300000000000000, // 300 TGas
            deposit: 1,
          },
        },
      ],
    };

    return NextResponse.json({ transactionPayload });
  } catch (error) {
    console.error('Error generating stake payload:', error);
    return NextResponse.json({ error: 'Failed to generate stake payload' }, { status: 500 });
  }
}
