import { NextResponse } from 'next/server';
import { gql, request as graphqlRequest } from 'graphql-request';
import { formatUsdcWithDollarSign, fetchNearView } from '@/app/utils';
import { BETVEX_CONTRACT } from '@/app/config';

const GRAPH_INDEXER_URL = process.env.GRAPH_INDEXER_URL!;

interface Bet {
  id: string;
  account_id: string;
  amount: string;
  match_id: string;
  team: string;
  potential_winnings: string;
  pay_state: 'Paid' | 'RefundPaid' | null;
  created_at: string;
}

interface BetsResponse {
  bets: Bet[];
}

interface Match {
  match_id: string;
  match_state: 'Future' | 'Current' | 'Finished' | 'Error';
  winner: 'Team1' | 'Team2' | null;
}

type OverallBetState = 
  | 'Match not started yet'
  | 'Match in progress'
  | 'Claimable'
  | 'Refund claimable'
  | 'Paid'
  | 'Refund paid'
  | 'Lose';

function determineOverallBetState(bet: Bet, match: Match): OverallBetState {
  if (bet.pay_state === 'Paid') return 'Paid';
  if (bet.pay_state === 'RefundPaid') return 'Refund paid';
  
  switch (match.match_state) {
    case 'Future':
      return 'Match not started yet';
    case 'Current':
      return 'Match in progress';
    case 'Finished':
      if (bet.pay_state === null) {
        // Check if the bet was placed on the winning team
        return bet.team === match.winner ? 'Claimable' : 'Lose';
      }
      return 'Paid';
    case 'Error':
      return bet.pay_state === null ? 'Refund claimable' : 'Refund paid';
    default:
      return 'Match not started yet';
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const accountId = searchParams.get('accountId');

    if (!accountId) {
      return NextResponse.json({ error: 'accountId is required' }, { status: 400 });
    }

    const query = gql`
      {
        bets(where: { account_id: "${accountId}" }) {
          id
          account_id
          amount
          match_id
          team
          potential_winnings
          pay_state
          created_at
        }
      }
    `;

    const data = await graphqlRequest<BetsResponse>(GRAPH_INDEXER_URL, query);

    // Fetch match states in parallel
    const matchPromises = data.bets.map(bet => 
      fetchNearView(
        BETVEX_CONTRACT,
        'get_match',
        { match_id: bet.match_id }
      )
    );

    const matches = await Promise.all(matchPromises);
    const matchStateMap = new Map(matches.map(match => [match.match_id, match]));

    // Format the amounts with dollar signs and proper decimal places
    const formattedBets = data.bets.map(bet => {
      const match = matchStateMap.get(bet.match_id);
      return {
        id: bet.id,
        accountId: bet.account_id,
        amount: formatUsdcWithDollarSign(bet.amount),
        matchId: bet.match_id,
        team: bet.team,
        potentialWinnings: formatUsdcWithDollarSign(bet.potential_winnings),
        payState: bet.pay_state,
        overallBetState: determineOverallBetState(bet, match)
      };
    });

    return NextResponse.json({ bets: formattedBets });
  } catch (error) {
    console.error('Error fetching bets:', error);
    return NextResponse.json({ error: 'Failed to fetch bets data' }, { status: 500 });
  }
}
