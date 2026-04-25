import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="relative min-h-screen bg-background text-foreground flex flex-col items-center justify-center overflow-hidden px-6">
      {/* Ambient depth */}
      <div
        aria-hidden
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[800px] pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse, oklch(0.96 0.005 240 / 0.05), transparent 60%)',
          filter: 'blur(80px)',
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-[0.06]"
        style={{
          backgroundImage: 'url(/grain.svg)',
          backgroundSize: '240px 240px',
        }}
      />

      <div className="relative text-center max-w-xl">
        <div className="flex items-center justify-center gap-3 mb-8">
          <span className="block w-10 h-px bg-foreground/30" />
          <span className="text-[10px] font-mono uppercase tracking-[0.36em] text-foreground/55">
            Error · 404
          </span>
          <span className="block w-10 h-px bg-foreground/30" />
        </div>

        <h1
          className="font-serif font-semibold tracking-[-0.05em] leading-[0.86] text-balance"
          style={{ fontSize: 'clamp(72px, 14vw, 200px)' }}
        >
          <span className="block text-foreground">Page</span>
          <span className="block text-foreground/35">not found.</span>
        </h1>

        <p className="mt-10 text-base md:text-lg text-foreground/65 leading-relaxed max-w-md mx-auto">
          The route you tried doesn&apos;t exist. It may have been moved or never
          existed in the first place.
        </p>

        <div className="mt-12 flex flex-col sm:flex-row gap-3 items-center justify-center">
          <Link
            href="/"
            className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-foreground text-background font-semibold text-sm tracking-wide transition-transform duration-300 hover:scale-[1.04] active:scale-[0.97]"
          >
            <span>Back to home</span>
            <svg
              width="14"
              height="14"
              viewBox="0 0 16 16"
              fill="none"
              className="transition-transform duration-300 group-hover:translate-x-0.5"
            >
              <path
                d="M4 8H12M12 8L8 4M12 8L8 12"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
          <Link
            href="/games"
            className="text-sm text-foreground/70 hover:text-foreground transition-colors"
          >
            Browse games
          </Link>
        </div>
      </div>
    </div>
  )
}

export const metadata = {
  title: '404 — Page not found · MotionPlay',
  description: "The route you tried doesn't exist.",
}
