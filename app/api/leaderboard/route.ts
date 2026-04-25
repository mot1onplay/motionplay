// app/api/leaderboard/route.ts
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

const MAX_LIMIT = 100;
const DEFAULT_LIMIT = 50;
const MAX_OFFSET = 10_000;

function parseClampedInt(raw: string | null, fallback: number, min: number, max: number) {
  const n = Number(raw);
  if (!Number.isFinite(n)) return fallback;
  return Math.max(min, Math.min(max, Math.floor(n)));
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const gameId = searchParams.get('game_id');
  const limit = parseClampedInt(searchParams.get('limit'), DEFAULT_LIMIT, 1, MAX_LIMIT);
  const offset = parseClampedInt(searchParams.get('offset'), 0, 0, MAX_OFFSET);

  let query = supabase
    .from('leaderboard')
    .select(`
  id,
  user_id,
  game_id,
  score,
  duration_seconds,
  created_at
`)
    .order('score', { ascending: false })
    .limit(limit)
    .range(offset, offset + limit - 1);

  if (gameId) {
    query = query.eq('game_id', gameId);
  }

  const { data, error, count } = await query;

  if (error) {
    console.error('Leaderboard fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to load leaderboard', details: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
    data: data || [],
    count: count ?? data?.length ?? 0,
    total: count,
  });
}

export const revalidate = 30;