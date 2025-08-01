import { Header } from "@/components/header"
import { Banner } from "@/components/banner"
import { ClassSection } from "@/components/class-section"
import { SlotSection } from "@/components/slot-section"
import { FeaturedProducts } from "@/components/featured-products"
import { HelpSection } from "@/components/help-section"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
      <Header />
      <main className="relative">
        {/* Banner Section */}
        <section className="relative">
          <Banner />
        </section>

        {/* Main Content */}
        <div className="relative z-10">
          {/* Class Section */}
          <section className="py-16 bg-white/50 backdrop-blur-sm">
            <ClassSection />
          </section>

          {/* Slot Section */}
          <section className="py-16 bg-gradient-to-r from-amber-50 to-orange-50">
            <SlotSection />
          </section>

          {/* Featured Products */}
          <section className="py-16 bg-white/50 backdrop-blur-sm">
            <FeaturedProducts />
          </section>

          {/* Help Section */}
          <section className="py-16 bg-gradient-to-r from-orange-50 to-amber-50">
            <HelpSection />
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}
