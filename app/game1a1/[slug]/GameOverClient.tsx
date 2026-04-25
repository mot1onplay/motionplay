// app/game/[slug]/GameOverClient.tsx
'use client'

import { useActionState } from 'react'
import { submitGameScore } from './actions'

type Props = {
  gameId: string
  finalScore: number
  durationSeconds: number
  slug: string
  gameTitle: string
}

export default function GameOverClient({
  gameId,
  finalScore,
  durationSeconds,
  slug,
  gameTitle,
}: Props) {
  const [state, formAction, isPending] = useActionState(submitGameScore, null)

  return (
    <div className="text-center p-8 lg:p-10 bg-card rounded-3xl border border-border max-w-md w-full">
      <div className="text-[10px] font-mono uppercase tracking-[0.32em] text-foreground/55 mb-4">
        Run complete
      </div>
      <h2 className="font-serif text-3xl lg:text-4xl font-semibold tracking-[-0.025em] text-foreground mb-8">
        {gameTitle}
      </h2>

      <div className="mb-8 grid grid-cols-2 gap-px bg-border rounded-2xl overflow-hidden border border-border">
        <div className="bg-card p-5">
          <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-foreground/45 mb-1.5">
            Score
          </div>
          <div className="font-serif text-3xl font-semibold tabular-nums tracking-[-0.02em] text-foreground">
            {finalScore.toLocaleString()}
          </div>
        </div>
        <div className="bg-card p-5">
          <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-foreground/45 mb-1.5">
            Duration
          </div>
          <div className="font-serif text-3xl font-semibold tabular-nums tracking-[-0.02em] text-foreground">
            {durationSeconds}
            <span className="text-foreground/40 text-xl">s</span>
          </div>
        </div>
      </div>

      {state?.success ? (
        <div className="mb-6 p-4 bg-foreground/[0.04] border border-foreground/15 rounded-xl">
          <p className="text-foreground/85 text-sm">{state.message}</p>
          <a
            href={`/leaderboard/${slug}`}
            className="mt-3 inline-flex items-center gap-1.5 text-sm text-foreground hover:text-foreground/80 transition-colors"
          >
            <span className="relative">
              View leaderboard
              <span className="absolute -bottom-0.5 left-0 right-0 h-px bg-foreground/30 group-hover:bg-foreground transition-colors" />
            </span>
            →
          </a>
        </div>
      ) : state?.error ? (
        <p className="mb-6 p-4 bg-destructive/10 border border-destructive/30 text-destructive-foreground/90 rounded-xl text-sm">
          {state.error}
        </p>
      ) : null}

      {!state?.success && (
        <form action={formAction} className="space-y-3">
          <input type="hidden" name="game_id" value={gameId} />
          <input type="hidden" name="score" value={finalScore} />
          <input type="hidden" name="duration_seconds" value={durationSeconds} />

          <button
            type="submit"
            disabled={isPending}
            className={`w-full py-3.5 px-6 rounded-full font-semibold text-sm tracking-wide transition-transform duration-200 ${
              isPending
                ? 'bg-muted text-muted-foreground cursor-not-allowed'
                : 'bg-foreground text-background hover:scale-[1.02] active:scale-[0.98]'
            }`}
          >
            {isPending ? 'Submitting…' : 'Submit score'}
          </button>
        </form>
      )}
    </div>
  )
}
