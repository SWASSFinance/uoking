import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function UOLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
      <Header />
      <main>
        {children}
      </main>
      <Footer />
    </div>
  )
} 