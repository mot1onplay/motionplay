// app/game1a1/[slug]/page.tsx
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import GameOverClient from './GameOverClient'

type Game = {
  id: number
  game_id: string
  title: string
  slug: string
}

// Slugs are user-supplied URL segments. Lock them down before they hit the DB —
// only lowercase alphanumerics + hyphens, max 80 chars. Anything else is a 404.
const SLUG_RE = /^[a-z0-9](?:[a-z0-9-]{0,78}[a-z0-9])?$/

async function fetchGameBySlug(slug: string): Promise<Game | null> {
  if (!SLUG_RE.test(slug)) return null

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('gameslist')
    .select('id, game_id, title, slug')
    .eq('slug', slug)
    .maybeSingle()

  if (error) {
    // Real error logging would go to a proper sink; surface as not-found so
    // we don't leak DB details to the user.
    console.error('[gamePage] fetchGameBySlug failed:', error.message)
    return null
  }
  return (data as Game | null) ?? null
}

export default async function GamePage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ score?: string; duration?: string }>
}) {
  const { slug } = await params
  const search = await searchParams

  const game = await fetchGameBySlug(slug)
  if (!game) notFound()

  const finalScore = search.score ? Number(search.score) : 0
  const durationSeconds = search.duration ? Number(search.duration) : 0

  if (
    !Number.isFinite(finalScore) ||
    !Number.isFinite(durationSeconds) ||
    finalScore <= 0 ||
    durationSeconds <= 0
  ) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <div className="text-center px-6">
          <div className="text-[10px] font-mono uppercase tracking-[0.32em] text-foreground/55 mb-4">
            Now playing
          </div>
          <h1 className="font-serif text-4xl lg:text-5xl font-semibold tracking-[-0.025em] mb-4">
            {game.title}
          </h1>
          <p className="text-foreground/65">Play to submit a score.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <GameOverClient
        gameId={game.game_id}
        finalScore={finalScore}
        durationSeconds={durationSeconds}
        slug={slug}
        gameTitle={game.title}
      />
    </div>
  )
}
