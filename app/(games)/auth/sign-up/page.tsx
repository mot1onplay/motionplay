'use client'

import { useActionState, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Activity, ArrowLeft, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { signUpAction, type SignUpState } from './actions'

export default function SignUpPage() {
  const [state, formAction, isPending] = useActionState<SignUpState, FormData>(
    signUpAction,
    null,
  )
  const router = useRouter()

  // Live client hints — purely UX, server is source of truth
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const passwordTooShort = password.length > 0 && password.length < 8
  const mismatch =
    confirmPassword.length > 0 && confirmPassword !== password

  useEffect(() => {
    if (state?.ok) router.push(state.redirect)
  }, [state, router])

  return (
    <div className="min-h-screen flex">
      {/* Left side — visual */}
      <div className="hidden lg:flex flex-1 bg-secondary/30 relative overflow-hidden items-center justify-center">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-foreground/[0.04] rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-foreground/[0.04] rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 text-center px-12">
          <div className="w-32 h-32 mx-auto mb-8 rounded-full bg-foreground/[0.06] border border-foreground/15 flex items-center justify-center">
            <Activity className="w-16 h-16 text-foreground" />
          </div>
          <h2 className="font-serif text-3xl font-semibold tracking-[-0.02em] mb-4">
            Get active.
          </h2>
          <p className="text-muted-foreground max-w-sm">
            Join the players who treat their living room like a controller.
          </p>
        </div>
      </div>

      {/* Right side — form */}
      <div className="flex-1 flex flex-col justify-center px-8 lg:px-16 bg-background">
        <div className="w-full max-w-md mx-auto">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </Link>

          <div className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 rounded-lg bg-foreground flex items-center justify-center">
              <Activity className="w-5 h-5 text-background" />
            </div>
            <span className="font-serif text-2xl font-semibold tracking-[-0.02em]">
              MotionPlay
            </span>
          </div>

          <h1 className="font-serif text-3xl font-semibold tracking-[-0.025em] mb-2">
            Create an account
          </h1>
          <p className="text-muted-foreground mb-8 text-sm">
            Sign up to start playing motion-controlled games.
          </p>

          <form action={formAction} className="space-y-5" noValidate>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder="you@example.com"
                required
                maxLength={254}
                className="h-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                placeholder="Create a password"
                required
                minLength={8}
                maxLength={128}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12"
              />
              <p
                className={`text-xs transition-colors ${
                  passwordTooShort ? 'text-destructive' : 'text-muted-foreground'
                }`}
              >
                At least 8 characters. Must include a letter and a number.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm password</Label>
              <Input
                id="confirm-password"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                placeholder="Confirm your password"
                required
                minLength={8}
                maxLength={128}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="h-12"
                aria-invalid={mismatch || undefined}
              />
              {mismatch && (
                <p className="text-xs text-destructive">Passwords do not match.</p>
              )}
            </div>

            {state && !state.ok && (
              <div
                className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm"
                role="alert"
                aria-live="polite"
              >
                {state.error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-12 text-base"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating account…
                </>
              ) : (
                'Create account'
              )}
            </Button>
          </form>

          <p className="text-center text-xs text-muted-foreground mt-6">
            By signing up, you agree to our Terms of Service and Privacy Policy.
          </p>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Already have an account?{' '}
            <Link
              href="/auth/login"
              className="text-foreground hover:underline font-medium"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
