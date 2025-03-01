import { NextResponse } from 'next/server';
import { gql, request as graphqlRequest } from 'graphql-request';

const GRAPH_INDEXER_URL = process.env.GRAPH_INDEXER_URL!;
const MAX_ENTRIES = 100;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sortBy = searchParams.get('sortBy') || 'total_winnings'; // 'total_winnings' or 'number_of_wins'
    const orderDirection = searchParams.get('orderDirection') || 'desc'; // 'asc' or 'desc'
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), MAX_ENTRIES);

    const query = gql`
      {
        users(
          where: { ${sortBy === 'total_winnings' ? 'total_winnings_gt: "0"' : 'number_of_wins_gt: 0'} }
          orderBy: ${sortBy}
          orderDirection: ${orderDirection}
          first: ${limit}
        ) {
          id
          total_winnings
          number_of_wins
        }
      }
    `;

    const data = await graphqlRequest(GRAPH_INDEXER_URL, query);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return NextResponse.json({ error: 'Failed to fetch leaderboard data' }, { status: 500 });
  }
} 