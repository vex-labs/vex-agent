import { fetchNearView } from '@/app/utils';
import { BETVEX_CONTRACT } from '@/app/config';
import { NextResponse } from 'next/server';

interface DisplayMatch {
  match_id: string;
  game: string;
  team_1: string;
  team_2: string;
  team_1_odds: number;
  team_2_odds: number;
  team_1_real_bets: string;
  team_2_real_bets: string;
  match_state: string;
  winner: string | null;
}

interface MatchOdds {
  matchId: string;
  team1Odds: number;
  team2Odds: number;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const matchIds = searchParams.get('matchIds');

    if (!matchIds) {
      return NextResponse.json({ error: 'matchIds parameter is required' }, { status: 400 });
    }

    // Parse the comma-separated match IDs
    const matchIdArray = matchIds.split(',');

    // Create an array of promises for concurrent execution
    const matchPromises = matchIdArray.map(matchId => 
      fetchNearView(
        BETVEX_CONTRACT,
        'get_match',
        { match_id: matchId }
      )
    );

    // Wait for all promises to resolve
    const matches = await Promise.all(matchPromises);

    // Extract and format the odds data
    const oddsData: MatchOdds[] = matches.map((match: DisplayMatch) => ({
      matchId: match.match_id,
      team1Odds: match.team_1_odds,
      team2Odds: match.team_2_odds
    }));

    return NextResponse.json({ odds: oddsData });
  } catch (error) {
    console.error('Error fetching match odds:', error);
    return NextResponse.json({ error: 'Failed to fetch match odds' }, { status: 500 });
  }
} 