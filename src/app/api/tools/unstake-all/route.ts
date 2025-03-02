import { BETVEX_CONTRACT } from '@/app/config';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const transactionPayload = {
      receiverId: BETVEX_CONTRACT,
      actions: [
        {
          type: 'FunctionCall',
          params: {
            method_name: 'unstake_all',
            args: {},
            gas: 300000000000000, // 300 TGas
            deposit: 0,
          },
        },
      ],
    };

    return NextResponse.json({ transactionPayload });
  } catch (error) {
    console.error('Error generating unstake all payload:', error);
    return NextResponse.json({ error: 'Failed to generate unstake all payload' }, { status: 500 });
  }
}
