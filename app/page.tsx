import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { ClassSection } from "@/components/class-section"
import { SlotSection } from "@/components/slot-section"
import { FeaturedProducts } from "@/components/featured-products"
import { HelpSection } from "@/components/help-section"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-100">
      <Header />
      <Hero />
      <ClassSection />
      <SlotSection />
      <FeaturedProducts />
      <HelpSection />
      <Footer />
    </div>
  )
}
