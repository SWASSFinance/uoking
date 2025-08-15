import { Header } from "@/components/header"
import { VideoBanner } from "@/components/video-banner"
import { ClassSection } from "@/components/class-section"
import { SlotSection } from "@/components/slot-section"
import { FeaturedProducts } from "@/components/featured-products"
import { HelpSection } from "@/components/help-section"
import { DealOfTheDay } from "@/components/deal-of-the-day"
import { Footer } from "@/components/footer"
import { getActiveBanners } from "@/lib/db"
import { BannerSection } from "@/components/banner-section"

export default async function HomePage() {
  // Fetch active homepage banners
  const banners = await getActiveBanners('homepage')

  return (
    <div className="min-h-screen relative">
      {/* Fixed Video Background */}
      <div className="fixed inset-0 w-full h-full z-0">
        {banners.length > 0 ? (
          <VideoBanner banners={banners} />
        ) : (
          <div className="h-full bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center">
            <div className="text-center text-white">
              <h1 className="text-5xl md:text-7xl font-bold mb-4">Welcome to UO KING</h1>
           
            </div>
          </div>
        )}
        {/* Semi-transparent overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-50 z-10"></div>
      </div>

      {/* Scrollable Content */}
      <div className="relative z-20">
        <Header />
        
        {/* Dedicated Banner Section */}
        <BannerSection banners={banners} />

        <main>
          {/* Deal of the Day */}
          <section className="py-16 bg-gradient-to-r from-orange-50/90 to-amber-50/90 backdrop-blur-sm">
            <div className="container mx-auto px-4">
              <DealOfTheDay />
            </div>
          </section>

          {/* Class Section */}
          <section className="py-16 bg-white/80 backdrop-blur-sm">
            <ClassSection />
          </section>

          {/* Slot Section */}
          <section className="py-16 bg-gradient-to-r from-amber-50/90 to-orange-50/90 backdrop-blur-sm">
            <SlotSection />
          </section>

          {/* Featured Products */}
          <section className="py-16 bg-white/80 backdrop-blur-sm">
            <FeaturedProducts />
          </section>

          {/* Help Section */}
          <section className="py-16 bg-gradient-to-r from-orange-50/90 to-amber-50/90 backdrop-blur-sm">
            <HelpSection />
          </section>
        </main>
        <Footer />
      </div>
    </div>
  )
}
