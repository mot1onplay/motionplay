'use server'

import { createClient } from '@/lib/supabase/server'
import { headers } from 'next/headers'

/**
 * Server-side sign-up action.
 *
 * Re-validates everything regardless of what the client checked. The client
 * still does live validation for UX, but the server is the source of truth —
 * a hand-crafted POST or a tampered client cannot bypass these rules.
 */

const PW_MIN = 8
const PW_MAX = 128 // upper bound to keep bcrypt costs sane
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export type SignUpState =
  | { ok: true; redirect: string }
  | { ok: false; error: string }
  | null

export async function signUpAction(
  _prev: SignUpState,
  formData: FormData,
): Promise<SignUpState> {
  const email = String(formData.get('email') ?? '').trim().toLowerCase()
  const password = String(formData.get('password') ?? '')
  const confirmPassword = String(formData.get('confirmPassword') ?? '')

  // --- Validate ---
  if (!email) return { ok: false, error: 'Email is required.' }
  if (email.length > 254) return { ok: false, error: 'That email address is too long.' }
  if (!EMAIL_RE.test(email)) return { ok: false, error: 'Enter a valid email address.' }

  if (!password) return { ok: false, error: 'Password is required.' }
  if (password.length < PW_MIN) {
    return { ok: false, error: `Password must be at least ${PW_MIN} characters.` }
  }
  if (password.length > PW_MAX) {
    return { ok: false, error: `Password must be ${PW_MAX} characters or fewer.` }
  }
  if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
    return {
      ok: false,
      error: 'Password must contain at least one letter and one number.',
    }
  }
  if (password !== confirmPassword) {
    return { ok: false, error: 'Passwords do not match.' }
  }

  // --- Sign up via Supabase ---
  const supabase = await createClient()

  // Use the request's own origin for the email redirect rather than trusting
  // a client-supplied value. Falls back to a public env var so this works in
  // local dev where headers() may be a relative origin behind a proxy.
  const reqHeaders = await headers()
  const host = reqHeaders.get('x-forwarded-host') ?? reqHeaders.get('host')
  const proto =
    reqHeaders.get('x-forwarded-proto') ??
    (process.env.NODE_ENV === 'development' ? 'http' : 'https')
  const origin =
    process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ??
    (host ? `${proto}://${host}` : '')

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: origin ? `${origin}/games` : undefined,
    },
  })

  if (error) {
    // Don't echo Supabase's raw error to the user — could leak whether an
    // account exists ("user already registered"). Map to neutral copy.
    const msg = error.message.toLowerCase()
    if (msg.includes('already') || msg.includes('registered')) {
      return {
        ok: false,
        error: 'If that email is available, we sent a confirmation link. Check your inbox.',
      }
    }
    return { ok: false, error: 'Sign-up failed. Please try again.' }
  }

  return { ok: true, redirect: '/auth/sign-up-success' }
}
