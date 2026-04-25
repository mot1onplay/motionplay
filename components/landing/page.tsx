'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { games } from '@/lib/game-data1'
import type { Game } from '@/lib/game-data1'
import { Robot } from './robot'

const APPLE = 'cubic-bezier(0.16, 1, 0.3, 1)'

/* ------------------------------ Hooks -------------------------------- */

function useInView<T extends HTMLElement>(ref: React.RefObject<T | null>, margin = '-80px 0px') {
  const [shown, setShown] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setShown(true)
          obs.disconnect()
        }
      },
      { rootMargin: margin },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [ref, margin])
  return shown
}

function useScrollY() {
  const [y, setY] = useState(0)
  useEffect(() => {
    const update = () => setY(window.scrollY)
    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])
  return y
}

function CountUp({ end, duration = 1800 }: { end: number; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, '-40px 0px')
  const [v, setV] = useState(0)
  useEffect(() => {
    if (!inView) return
    const start = performance.now()
    let raf = 0
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - t, 3)
      setV(Math.round(end * eased))
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, end, duration])
  return <span ref={ref}>{v}</span>
}

function Eyebrow({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className ?? ''}`}>
      <span className="block w-10 h-px bg-foreground/25" />
      <span className="text-[10px] font-mono uppercase tracking-[0.36em] text-foreground/55">
        {children}
      </span>
    </div>
  )
}

/* =================================================================== */
/*                              HERO                                    */
/*  Robot anchored center-right, monumental headline anchored left      */
/* =================================================================== */

function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const scrollY = useScrollY()
  const t = Math.min(1, scrollY / 800)

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[100vh] overflow-hidden"
      aria-label="Hero"
    >
      {/* Subtle ambient — single soft glow far behind */}
      <div
        aria-hidden
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1400px] h-[1400px] pointer-events-none"
        style={{
          background:
            'radial-gradient(circle, oklch(0.96 0.005 240 / 0.04), transparent 60%)',
          filter: 'blur(60px)',
        }}
      />

      {/* Grain */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-[0.06]"
        style={{
          backgroundImage: 'url(/grain.svg)',
          backgroundSize: '240px 240px',
        }}
      />

      <div className="relative container mx-auto px-6 lg:px-12 pt-32 lg:pt-40 pb-16">
        {/* Eyebrow */}
        <div
          className="mp-fade-up mb-12 lg:mb-16"
          style={{
            animationDelay: '120ms',
            opacity: 1 - t * 0.8,
            transform: `translateY(${-t * 30}px)`,
          }}
        >
          <Eyebrow>MotionPlay · Body-tracked play, in your browser</Eyebrow>
        </div>

        <div className="grid lg:grid-cols-[1fr_500px] xl:grid-cols-[1fr_580px] gap-12 lg:gap-16 items-end">
          {/* LEFT — monumental headline */}
          <div
            className="will-change-transform"
            style={{
              opacity: 1 - t * 0.7,
              transform: `translateY(${-t * 50}px)`,
              filter: `blur(${t * 6}px)`,
              transition: 'transform 100ms linear',
            }}
          >
            <h1
              className="mp-fade-up font-serif font-semibold tracking-[-0.05em] leading-[0.86] text-balance"
              style={{
                animationDelay: '200ms',
                fontSize: 'clamp(64px, 12vw, 200px)',
              }}
            >
              <span className="block text-foreground">The body</span>
              <span className="block text-foreground/30">is the</span>
              <span className="block text-foreground">controller.</span>
            </h1>

            <div
              className="mp-fade-up mt-12 max-w-md"
              style={{ animationDelay: '480ms' }}
            >
              <p className="text-base md:text-lg text-foreground/65 leading-relaxed">
                MotionPlay is a body-tracked game engine. Your webcam reads
                seventeen joints, thirty times a second. Stand up. Move. Play.
              </p>
            </div>

            <div
              className="mp-fade-up mt-10 flex flex-col sm:flex-row gap-3 items-start sm:items-center"
              style={{ animationDelay: '640ms' }}
            >
              <Link
                href="/auth/sign-up"
                className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-foreground text-background font-semibold text-sm tracking-wide transition-transform duration-300 hover:scale-[1.04] active:scale-[0.97] shadow-[0_8px_50px_oklch(1_0_0_/_0.1)]"
                style={{ transitionTimingFunction: APPLE }}
              >
                <span>Open the camera</span>
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
                href="#how"
                className="group inline-flex items-center gap-2 px-5 py-3.5 text-sm text-foreground/75 hover:text-foreground transition-colors"
              >
                <span className="relative">
                  See how it works
                  <span className="absolute -bottom-0.5 left-0 right-0 h-px bg-foreground/30 group-hover:bg-foreground transition-colors" />
                </span>
              </Link>
            </div>
          </div>

          {/* RIGHT — robot */}
          <div
            className="mp-fade-in-right relative -mt-8 lg:-mt-24"
            style={{
              animationDelay: '300ms',
              transform: `translateY(${t * 30}px) scale(${1 - t * 0.04})`,
              transition: 'transform 100ms linear',
              willChange: 'transform',
            }}
          >
            <Robot scrollT={t} />
          </div>
        </div>
      </div>

      {/* Hairline */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-foreground/10" />
    </section>
  )
}

/* =================================================================== */
/*                              MARQUEE                                 */
/* =================================================================== */

function Marquee() {
  const items = [
    'Real-time pose detection',
    '17 keypoints',
    '30 fps inference',
    'Browser-native',
    'No installation',
    'WebGL accelerated',
    'TensorFlow.js',
    'Local-only video',
  ]
  const doubled = [...items, ...items]
  return (
    <section
      className="relative py-10 border-y border-border overflow-hidden bg-card/40"
      aria-label="Capabilities"
    >
      <div className="flex gap-12 whitespace-nowrap will-change-transform mp-marquee">
        {doubled.map((item, i) => (
          <div key={i} className="flex items-center gap-3 shrink-0">
            <span className="block w-1 h-1 rounded-full bg-foreground/45" />
            <span className="text-sm font-mono uppercase tracking-[0.2em] text-foreground/55">
              {item}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}

/* =================================================================== */
/*                           HOW IT WORKS                               */
/* =================================================================== */

function HowStep({
  n,
  label,
  title,
  body,
  index,
}: {
  n: string
  label: string
  title: string
  body: string
  index: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref)
  return (
    <div
      ref={ref}
      className="relative bg-card p-10 lg:p-12 flex flex-col gap-7 group min-h-[420px]"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(40px)',
        transition: `opacity 1100ms ${APPLE} ${index * 120}ms, transform 1100ms ${APPLE} ${
          index * 120
        }ms`,
      }}
    >
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700"
        style={{
          background:
            'radial-gradient(circle at 50% 0%, oklch(0.96 0.005 240 / 0.05), transparent 60%)',
        }}
      />

      <div
        className="font-serif font-semibold tabular-nums tracking-[-0.03em] text-foreground/12"
        style={{ fontSize: 'clamp(80px, 9vw, 144px)', lineHeight: 0.85 }}
      >
        {n}
      </div>

      <Eyebrow>{label}</Eyebrow>

      <h3
        className="font-serif font-semibold tracking-[-0.025em] text-foreground leading-[1.05] -mt-2"
        style={{ fontSize: 'clamp(28px, 2.6vw, 40px)' }}
      >
        {title}
      </h3>

      <p className="text-foreground/60 leading-relaxed text-[15px] max-w-md">{body}</p>
    </div>
  )
}

function HowItWorks() {
  const headRef = useRef<HTMLDivElement>(null)
  const inView = useInView(headRef)

  const steps = [
    {
      n: '01',
      label: 'Permit',
      title: 'Open your camera.',
      body:
        'A one-time browser prompt. Your video stays on your machine — pose detection runs locally in the page.',
    },
    {
      n: '02',
      label: 'Detect',
      title: 'Find the joints.',
      body:
        'MoveNet identifies seventeen body keypoints, thirty times a second. No cloud round-trip.',
    },
    {
      n: '03',
      label: 'Play',
      title: 'Become input.',
      body:
        'Lift a wrist, the paddle moves. Squat, the player ducks. Punch, the target breaks.',
    },
  ]

  return (
    <section id="how" className="relative py-32 lg:py-44" aria-label="How it works">
      <div className="container mx-auto px-6 lg:px-12">
        <div
          ref={headRef}
          className="max-w-4xl mb-20 lg:mb-28"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? 'translateY(0)' : 'translateY(28px)',
            transition: `opacity 1100ms ${APPLE}, transform 1100ms ${APPLE}`,
          }}
        >
          <Eyebrow>How it works</Eyebrow>
          <h2
            className="mt-7 font-serif font-semibold tracking-[-0.035em] leading-[0.95] text-balance"
            style={{ fontSize: 'clamp(40px, 6.5vw, 104px)' }}
          >
            <span className="text-foreground">Three steps. </span>
            <span className="text-foreground/35">No setup.</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-px bg-border rounded-[2rem] overflow-hidden border border-border">
          {steps.map((s, i) => (
            <HowStep key={s.n} {...s} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

/* =================================================================== */
/*                          BIG NUMBERS                                 */
/* =================================================================== */

function NumberRow({
  end,
  suffix,
  caption,
  detail,
  index,
  align = 'left',
}: {
  end: number
  suffix?: string
  caption: string
  detail: string
  index: number
  align?: 'left' | 'right'
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref)
  return (
    <div
      ref={ref}
      className={`grid lg:grid-cols-2 gap-12 lg:gap-20 items-center ${
        align === 'right' ? 'lg:[&>*:first-child]:order-2' : ''
      }`}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(40px)',
        transition: `opacity 1100ms ${APPLE} ${index * 100}ms, transform 1100ms ${APPLE} ${
          index * 100
        }ms`,
      }}
    >
      <div
        className="font-serif font-semibold tabular-nums tracking-[-0.06em] leading-[0.85] text-foreground"
        style={{ fontSize: 'clamp(112px, 18vw, 320px)' }}
      >
        <CountUp end={end} />
        {suffix && <span className="text-foreground/40">{suffix}</span>}
      </div>
      <div>
        <Eyebrow>{caption}</Eyebrow>
        <p
          className="mt-7 font-serif font-semibold tracking-[-0.02em] leading-[1.1] text-foreground/85"
          style={{ fontSize: 'clamp(22px, 2vw, 30px)' }}
        >
          {detail}
        </p>
      </div>
    </div>
  )
}

function BigNumbers() {
  return (
    <section className="relative py-32 lg:py-44 border-t border-border" aria-label="The numbers">
      <div className="relative container mx-auto px-6 lg:px-12 max-w-[1280px]">
        <div className="space-y-32 lg:space-y-44">
          <NumberRow
            end={17}
            caption="Body keypoints"
            detail="Wrists, elbows, shoulders, hips, knees, ankles. Every joint, every frame."
            index={0}
          />
          <NumberRow
            end={30}
            suffix=" fps"
            caption="Real-time inference"
            detail="On-device. Your video never leaves the page."
            index={1}
            align="right"
          />
          <NumberRow
            end={0}
            caption="Apps to install"
            detail="Open the page. Allow your camera. Move."
            index={2}
          />
        </div>
      </div>
    </section>
  )
}

/* =================================================================== */
/*                              GAMES                                   */
/* =================================================================== */

function GameTile({ game, span, index }: { game: Game; span?: 'tall'; index: number }) {
  const linkRef = useRef<HTMLAnchorElement>(null)
  const inView = useInView(linkRef)
  const [pos, setPos] = useState({ x: -200, y: -200, hovering: false })

  useEffect(() => {
    const el = linkRef.current
    if (!el) return
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect()
      setPos({ x: e.clientX - r.left, y: e.clientY - r.top, hovering: true })
    }
    const onLeave = () => setPos((p) => ({ ...p, hovering: false }))
    el.addEventListener('mousemove', onMove)
    el.addEventListener('mouseleave', onLeave)
    return () => {
      el.removeEventListener('mousemove', onMove)
      el.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  const Icon = game.icon
  const isPlayable = !game.comingSoon && !game.isLocked
  const tall = span === 'tall'

  return (
    <Link
      ref={linkRef}
      href={isPlayable ? game.link : '#'}
      className={[
        'group relative isolate overflow-hidden rounded-[2rem] bg-card border border-border h-full',
        tall ? 'lg:row-span-2' : '',
      ].join(' ')}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView
          ? pos.hovering
            ? 'translateY(-6px)'
            : 'translateY(0)'
          : 'translateY(40px)',
        transition: `opacity 1100ms ${APPLE} ${index * 70}ms, transform 700ms ${APPLE} ${
          inView ? 0 : index * 70
        }ms`,
      }}
      aria-disabled={!isPlayable}
    >
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none transition-opacity duration-700"
        style={{
          opacity: pos.hovering ? 1 : 0,
          background: `radial-gradient(500px circle at ${pos.x}px ${pos.y}px, oklch(0.96 0.005 240 / 0.10), transparent 60%)`,
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none rounded-[2rem] transition-opacity duration-500"
        style={{
          opacity: pos.hovering ? 1 : 0,
          boxShadow: 'inset 0 0 0 1px oklch(0.96 0.005 240 / 0.35)',
        }}
      />

      <div className={`relative h-full flex flex-col p-8 lg:p-10 ${tall ? 'lg:p-12' : ''}`}>
        <div className="flex items-start justify-between gap-4 mb-12">
          <div
            className="flex items-center justify-center rounded-2xl"
            style={{
              width: 56,
              height: 56,
              backgroundColor: 'oklch(0.18 0 0)',
              border: '1px solid oklch(0.30 0 0)',
            }}
          >
            <Icon style={{ color: 'oklch(0.96 0.005 240)', width: 24, height: 24 }} aria-hidden />
          </div>
          {!isPlayable && (
            <span
              className="px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-[0.2em] backdrop-blur-md border"
              style={{
                backgroundColor: 'oklch(0.13 0 0 / 0.7)',
                color: 'oklch(0.65 0 0)',
                borderColor: 'oklch(0.30 0 0)',
              }}
            >
              {game.comingSoon ? 'Coming soon' : 'Locked'}
            </span>
          )}
        </div>

        <div className="flex-1">
          <h3
            className="font-serif font-semibold tracking-[-0.025em] text-foreground leading-[1.05] mb-4"
            style={{ fontSize: tall ? 'clamp(32px, 3vw, 48px)' : 'clamp(22px, 1.9vw, 28px)' }}
          >
            {game.title}
          </h3>
          <p
            className={`text-foreground/55 leading-relaxed ${
              tall ? 'text-[16px] max-w-md' : 'text-[14px]'
            }`}
          >
            {game.description}
          </p>
        </div>

        {isPlayable && (
          <div
            className="mt-10 inline-flex items-center gap-2 text-sm transition-all duration-500"
            style={{
              color: pos.hovering ? 'oklch(0.96 0.005 240)' : 'oklch(0.85 0 0 / 0.7)',
              transform: pos.hovering ? 'translateX(4px)' : 'translateX(0)',
              transitionTimingFunction: APPLE,
            }}
          >
            <span>Play {game.title.split(' ')[0]}</span>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path
                d="M4 8H12M12 8L8 4M12 8L8 12"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        )}
      </div>
    </Link>
  )
}

function Games() {
  const headRef = useRef<HTMLDivElement>(null)
  const inView = useInView(headRef)
  const [featured, ...rest] = games

  return (
    <section
      id="games"
      className="relative py-32 lg:py-44 border-t border-border"
      aria-label="Games"
    >
      <div className="container mx-auto px-6 lg:px-12">
        <div
          ref={headRef}
          className="max-w-4xl mb-20 lg:mb-28"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? 'translateY(0)' : 'translateY(28px)',
            transition: `opacity 1100ms ${APPLE}, transform 1100ms ${APPLE}`,
          }}
        >
          <Eyebrow>The library</Eyebrow>
          <h2
            className="mt-7 font-serif font-semibold tracking-[-0.035em] leading-[0.95] text-balance"
            style={{ fontSize: 'clamp(40px, 6.5vw, 112px)' }}
          >
            <span className="text-foreground">Six ways </span>
            <span className="text-foreground/35">to use it.</span>
          </h2>
          <p className="mt-8 text-lg text-foreground/55 max-w-xl leading-relaxed">
            Each game built around a different movement pattern. Reflex,
            coordination, agility, rhythm, endurance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 lg:grid-rows-2 gap-5 lg:[grid-auto-flow:dense]">
          <GameTile game={featured} span="tall" index={0} />
          {rest.map((g, i) => (
            <GameTile key={g.id} game={g} index={i + 1} />
          ))}
        </div>
      </div>
    </section>
  )
}

/* =================================================================== */
/*                              FINALE                                  */
/* =================================================================== */

function Finale() {
  const lineARef = useRef<HTMLSpanElement>(null)
  const lineBRef = useRef<HTMLSpanElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)
  const aIn = useInView(lineARef)
  const bIn = useInView(lineBRef)
  const ctaIn = useInView(ctaRef)

  return (
    <section
      id="cta"
      className="relative py-32 lg:py-56 border-t border-border"
      aria-label="Get started"
    >
      <div
        aria-hidden
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[1500px] h-[800px] pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse, oklch(0.96 0.005 240 / 0.06), transparent 60%)',
          filter: 'blur(80px)',
        }}
      />

      <div className="relative container mx-auto px-6 lg:px-12 text-center max-w-5xl">
        <h2
          className="font-serif font-semibold tracking-[-0.05em] leading-[0.86] text-balance"
          style={{ fontSize: 'clamp(72px, 14vw, 240px)' }}
        >
          <span
            ref={lineARef}
            className="block"
            style={{
              opacity: aIn ? 1 : 0,
              transform: aIn ? 'translateY(0)' : 'translateY(28px)',
              filter: aIn ? 'blur(0px)' : 'blur(14px)',
              transition: `opacity 1100ms ${APPLE}, transform 1100ms ${APPLE}, filter 1100ms ${APPLE}`,
              color: 'oklch(0.98 0 0)',
            }}
          >
            Stand up.
          </span>
          <span
            ref={lineBRef}
            className="block text-foreground/35"
            style={{
              opacity: bIn ? 1 : 0,
              transform: bIn ? 'translateY(0)' : 'translateY(28px)',
              filter: bIn ? 'blur(0px)' : 'blur(14px)',
              transition: `opacity 1100ms ${APPLE} 200ms, transform 1100ms ${APPLE} 200ms, filter 1100ms ${APPLE} 200ms`,
            }}
          >
            Play.
          </span>
        </h2>

        <div
          ref={ctaRef}
          className="mt-14 flex flex-col sm:flex-row gap-4 items-center justify-center"
          style={{
            opacity: ctaIn ? 1 : 0,
            transform: ctaIn ? 'translateY(0)' : 'translateY(20px)',
            transition: `opacity 1100ms ${APPLE} 500ms, transform 1100ms ${APPLE} 500ms`,
          }}
        >
          <Link
            href="/auth/sign-up"
            className="group inline-flex items-center gap-2 px-8 py-4 rounded-full bg-foreground text-background font-semibold text-base transition-transform duration-300 hover:scale-[1.04] active:scale-[0.97] shadow-[0_8px_60px_oklch(1_0_0_/_0.12)]"
            style={{ transitionTimingFunction: APPLE }}
          >
            <span>Open the camera</span>
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              className="transition-transform duration-300 group-hover:translate-x-1"
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
            className="text-sm text-foreground/65 hover:text-foreground transition-colors"
          >
            Browse games first
          </Link>
        </div>
      </div>
    </section>
  )
}

/* =================================================================== */

export function LandingPage() {
  return (
    <>
      <Hero />
      <Marquee />
      <HowItWorks />
      <BigNumbers />
      <Games />
      <Finale />
    </>
  )
}
