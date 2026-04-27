import type { NextConfig } from 'next'

/**
 * Standard security headers — applied to every route.
 *
 * Notes:
 * - X-Frame-Options: SAMEORIGIN prevents external clickjacking but still allows
 *   our own pages to embed each other (game pages live in iframes today).
 * - Permissions-Policy explicitly enables `camera=(self)` because the whole
 *   product depends on getUserMedia. Everything else is locked down.
 * - We don't ship a strict CSP yet — TensorFlow.js / MediaPipe / Three.js need
 *   eval/inline-styles in places, and a wrong CSP silently breaks games. Add
 *   one with `report-only` after a proper audit.
 */
const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  {
    key: 'Permissions-Policy',
    value: 'camera=(self), microphone=(), geolocation=(), payment=(), usb=()',
  },
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
]

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ]
  },
}

export default nextConfig
