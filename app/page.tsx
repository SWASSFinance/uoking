import { Header } from "@/components/header"
import { ImageBanner } from "@/components/image-banner"
import { DragonAnimation } from "@/components/dragon-animation"
import { ClassSection } from "@/components/class-section"
import { FeaturedProducts } from "@/components/featured-products"
import { HelpSection } from "@/components/help-section"
import { DealOfTheDay } from "@/components/deal-of-the-day"
import { NewsSection } from "@/components/news-section"
import { Footer } from "@/components/footer"
import { getActiveBanners } from "@/lib/db"
import { BannerSection } from "@/components/banner-section"

export default async function HomePage() {
  // Fetch active homepage banners
  const banners = await getActiveBanners('homepage')

  return (
    <div className="min-h-screen relative">
      {/* Fixed Image Background - Reduced Height */}
      <div className="fixed inset-0 w-full h-[calc(100vh-800px)] z-0">
        <ImageBanner 
          imagePath="/uo/banner.png" 
          alt="UO King Banner" 
        />
        {/* Semi-transparent overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-50 z-10"></div>
        
        {/* Dragon Animation */}
        <DragonAnimation />
        
        {/* Deal of the Day Overlay - positioned at bottom of banner */}
        <div className="absolute bottom-0 left-0 right-0 z-30 p-8">
          <div className="container mx-auto">
            <DealOfTheDay />
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="relative z-20">
        <Header />
        
        {/* Dedicated Banner Section */}
        <BannerSection banners={banners} />

        <main>

          {/* Class Section */}
          <section className="py-16 bg-white/80 backdrop-blur-sm">
            <ClassSection />
          </section>

          {/* Featured Products */}
          <section className="py-16 bg-white/80 backdrop-blur-sm">
            <FeaturedProducts />
          </section>

          {/* News Section */}
          <NewsSection />

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
