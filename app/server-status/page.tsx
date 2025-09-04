import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ServerStatusGrid } from "@/components/server-status-grid"
import { ServerStatusHeader } from "@/components/server-status-header"

export default function ServerStatusPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <ServerStatusHeader />
        <ServerStatusGrid />
      </main>
      
      <Footer />
    </div>
  )
}
