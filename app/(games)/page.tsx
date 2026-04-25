import { LandingPage } from '@/components/landing/page'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { createClient } from '@/lib/supabase/server'

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar user={user} />
      <main className="relative">
        <LandingPage />
      </main>
      <Footer />
    </div>
  )
}
