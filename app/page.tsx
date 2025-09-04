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

export default async function HomePage() {
  // Fetch active homepage banners
  const banners = await getActiveBanners('homepage')

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Banner Section - Takes up actual space */}
      <section className="relative h-[400px] w-full overflow-hidden">
        <ImageBanner 
          imagePath="/uo/banner.png" 
          alt="UO King Banner" 
        />
        {/* Semi-transparent overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-50 z-10"></div>
        
        {/* Dragon Animation */}
        <DragonAnimation />
        
        {/* Welcome Text - Centered in banner */}
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <div className="text-center text-white">
            <h1 className="text-5xl md:text-7xl font-bold mb-4 drop-shadow-2xl">
              Welcome to UO KING
            </h1>
            {banners.length > 0 && banners[0]?.button_text && (
              <a
                href={banners[0].button_url || '#'}
                className="inline-block bg-red-600 hover:bg-red-700 text-white px-8 py-4 text-lg font-semibold rounded-lg transition-colors drop-shadow-lg"
              >
                {banners[0].button_text}
              </a>
            )}
          </div>
        </div>
        
        {/* Deal of the Day - positioned at bottom of banner */}
        <div className="absolute bottom-0 left-0 right-0 z-30 p-8">
          <div className="container mx-auto">
            <DealOfTheDay />
          </div>
        </div>
      </section>

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
    
  )
}
