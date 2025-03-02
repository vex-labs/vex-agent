import { NextResponse } from 'next/server';
import { gql, request as graphqlRequest } from 'graphql-request';

const GRAPH_INDEXER_URL = process.env.GRAPH_INDEXER_URL!;

interface Match {
  id: string;
  game: string;
  date_timestamp: string;
  date_string: string;
  team_1: string;
  team_2: string;
  team_1_total_bets: string;
  team_2_total_bets: string;
  match_state: string;
  created_at: string;
}

interface MatchesResponse {
  matches: Match[];
}

function formatGameName(game: string): string {
  return game
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function formatTeamName(team: string): string {
  return team.replace(/_/g, ' ');
}

function formatDate(dateString: string): string {
  const [day, month, year] = dateString.split('/');
  const date = new Date(`${year}-${month}-${day}`);
  return date.toLocaleDateString('en-US', { 
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const game = searchParams.get('game');
    const matchState = searchParams.get('matchState') || 'Future';

    const query = gql`
      {
        matches(
          where: { match_state: ${matchState} ${game ? `, game: "${game}"` : ''} }
          orderBy: date_timestamp
          orderDirection: asc
        ) {
          id
          game
          date_timestamp
          date_string
          team_1
          team_2
          team_1_total_bets
          team_2_total_bets
          match_state
          created_at
        }
      }
    `;

    const data = await graphqlRequest<MatchesResponse>(GRAPH_INDEXER_URL, query);
    
    // Format the response data
    const formattedMatches = data.matches.map(match => ({
      id: match.id,
      game: formatGameName(match.game),
      date: formatDate(match.date_string),
      team1: formatTeamName(match.team_1),
      team2: formatTeamName(match.team_2),
      team1TotalBets: match.team_1_total_bets,
      team2TotalBets: match.team_2_total_bets,
      matchState: match.match_state
    }));

    return NextResponse.json({ matches: formattedMatches });
  } catch (error) {
    console.error('Error fetching matches:', error);
    return NextResponse.json({ error: 'Failed to fetch matches data' }, { status: 500 });
  }
}
