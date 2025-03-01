import { parseUsdcAmount, registerUserIfNeeded } from '@/app/utils';
import { USDC_CONTRACT } from '@/app/config';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const receiverId = searchParams.get('receiverId');
    const amount = searchParams.get('amount');

    if (!amount || !receiverId) {
      return NextResponse.json({ error: 'amount and receiverId are required' }, { status: 400 });
    }

    // Parse amount to proper decimal places
    const parsedAmount = parseUsdcAmount(amount);
    if (!parsedAmount) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
    }

    // First checks and waits for registration
    const registrationSuccess = await registerUserIfNeeded(USDC_CONTRACT, receiverId);
    if (!registrationSuccess) {
      return NextResponse.json({ error: 'Failed to register receiver' }, { status: 500 });
    }

    // Only proceeds to create transfer payload if registration was successful
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

    return NextResponse.json({ transactionPayload });
  } catch (error) {
    console.error('Error generating USDC transfer payload:', error);
    return NextResponse.json({ error: 'Failed to generate USDC transfer payload' }, { status: 500 });
  }
} 