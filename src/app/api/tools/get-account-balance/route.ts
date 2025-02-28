import { fetchNearView, formatUsdcAmount, formatVexAmount } from '@/app/utils';
import { USDC_CONTRACT, VEX_TOKEN_CONTRACT, ACCOUNT_ID } from '@/app/config';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    if (!ACCOUNT_ID) {
      return NextResponse.json({ error: 'No account ID found' }, { status: 400 });
    }

    // Fetch both balances in parallel
    const [usdcBalance, vexBalance] = await Promise.all([
      fetchNearView(
        USDC_CONTRACT,
        'ft_balance_of',
        { account_id: ACCOUNT_ID }
      ),
      fetchNearView(
        VEX_TOKEN_CONTRACT,
        'ft_balance_of',
        { account_id: ACCOUNT_ID }
      )
    ]);

    return NextResponse.json({
      usdc: formatUsdcAmount(usdcBalance, 2),
      vex: formatVexAmount(vexBalance, 2),
      raw: {
        usdc: usdcBalance,
        vex: vexBalance
      }
    });
  } catch (error) {
    console.error('Error fetching account balances:', error);
    return NextResponse.json({ error: 'Failed to fetch account balances' }, { status: 500 });
  }
} 