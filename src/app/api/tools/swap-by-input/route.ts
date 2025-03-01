import { parseUsdcAmount, parseVexAmount, registerUserIfNeeded } from '@/app/utils';
import { USDC_CONTRACT, VEX_TOKEN_CONTRACT, REF_FINANCE_CONTRACT, VEX_USDC_POOL_ID } from '@/app/config';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const amount = searchParams.get('amount');
    const isUsdcToVex = searchParams.get('isUsdcToVex') === 'true';
    const accountId = searchParams.get('accountId');

    if (!amount || !accountId) {
      return NextResponse.json({ error: 'amount and accountId are required' }, { status: 400 });
    }

    // Parse amount based on token type
    const parsedAmount = isUsdcToVex ? parseUsdcAmount(amount) : parseVexAmount(amount);
    if (!parsedAmount) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
    }

    // Register user with the token they're receiving if needed
    const tokenToRegister = isUsdcToVex ? VEX_TOKEN_CONTRACT : USDC_CONTRACT;
    const registrationSuccess = await registerUserIfNeeded(tokenToRegister, accountId);
    if (!registrationSuccess) {
      return NextResponse.json({ error: 'Failed to register with token contract' }, { status: 500 });
    }

    // Prepare the swap message
    const msg = JSON.stringify({
      force: 0,
      actions: [
        {
          pool_id: VEX_USDC_POOL_ID,
          token_in: isUsdcToVex ? USDC_CONTRACT : VEX_TOKEN_CONTRACT,
          token_out: isUsdcToVex ? VEX_TOKEN_CONTRACT : USDC_CONTRACT,
          amount_in: parsedAmount,
          amount_out: '0',
          min_amount_out: '0',
        }
      ]
    });

    const transactionPayload = {
      receiverId: isUsdcToVex ? USDC_CONTRACT : VEX_TOKEN_CONTRACT,
      actions: [
        {
          type: 'FunctionCall',
          params: {
            method_name: 'ft_transfer_call',
            args: {
              receiver_id: REF_FINANCE_CONTRACT,
              amount: parsedAmount,
              msg: msg,
            },
            gas: 100000000000000,
            deposit: 1,
          },
        },
      ],
    };

    return NextResponse.json({ transactionPayload });
  } catch (error) {
    console.error('Error generating swap payload:', error);
    return NextResponse.json({ error: 'Failed to generate swap payload' }, { status: 500 });
  }
}
