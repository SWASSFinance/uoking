import { Header } from "@/components/header"
import { VideoBanner } from "@/components/video-banner"
import { ClassSection } from "@/components/class-section"
import { SlotSection } from "@/components/slot-section"
import { FeaturedProducts } from "@/components/featured-products"
import { HelpSection } from "@/components/help-section"
import { DealOfTheDay } from "@/components/deal-of-the-day"
import { Footer } from "@/components/footer"
import { getActiveBanners } from "@/lib/db"

export default async function HomePage() {
  // Fetch active homepage banners
  const banners = await getActiveBanners('homepage')

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
      <Header />
      <main className="relative">
        {/* Banner Section */}
        <section className="relative">
          {banners.length > 0 ? (
            <VideoBanner banners={banners} />
          ) : (
            <div className="h-[600px] bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center">
              <div className="text-center text-white">
                <h1 className="text-5xl md:text-7xl font-bold mb-4">Welcome to UO KING</h1>
                <p className="text-xl md:text-2xl">Your Ultimate Ultima Online Resource</p>
              </div>
            </div>
          )}
        </section>

        {/* Main Content */}
        <div className="relative z-10">
          {/* Deal of the Day */}
          <section className="py-16 bg-gradient-to-r from-orange-50 to-amber-50">
            <div className="container mx-auto px-4">
              <DealOfTheDay />
            </div>
          </section>

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
