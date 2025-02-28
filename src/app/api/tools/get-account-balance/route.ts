import { fetchNearView, formatUsdcWithDollarSign, formatVexAmount } from '@/app/utils';
import { USDC_CONTRACT, VEX_TOKEN_CONTRACT } from '@/app/config';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const accountId = searchParams.get('accountId');

    if (!accountId) {
      return NextResponse.json({ error: 'No account ID found' }, { status: 400 });
    }

    // Fetch both balances in parallel
    const [usdcBalance, vexBalance] = await Promise.all([
      fetchNearView(
        USDC_CONTRACT,
        'ft_balance_of',
        { account_id: accountId }
      ),
      fetchNearView(
        VEX_TOKEN_CONTRACT,
        'ft_balance_of',
        { account_id: accountId }
      )
    ]);

    return NextResponse.json({
      usdc: formatUsdcWithDollarSign(usdcBalance, 2),
      vex: formatVexAmount(vexBalance, 2)
    });
  } catch (error) {
    console.error('Error fetching account balances:', error);
    return NextResponse.json({ error: 'Failed to fetch account balances' }, { status: 500 });
  }
} 