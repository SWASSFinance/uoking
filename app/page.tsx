import { Header } from "@/components/header"
import { ImageBanner } from "@/components/image-banner"
import { DragonAnimation } from "@/components/dragon-animation"
import { ClassSection } from "@/components/class-section"
import { FeaturedProducts } from "@/components/featured-products"
import { HelpSection } from "@/components/help-section"
import { DealOfTheDay } from "@/components/deal-of-the-day"
import { SlotSection } from "@/components/slot-section"
import { NewsSection } from "@/components/news-section"
import { Footer } from "@/components/footer"
import { PremiumBenefitsAd } from "@/components/premium-benefits-ad"
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
        {/* Semi-transparent overlay - responsive to theme */}
        <div className="absolute inset-0 bg-black/30 dark:bg-black/20 z-10"></div>
        
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
      </section>

      {/* Premium Benefits Advertisement */}
      <section className="py-8 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <PremiumBenefitsAd variant="banner" />
        </div>
      </section>

      {/* Combined Classes and Deal of the Day Section */}
      <section className="py-16 bg-gradient-to-r from-orange-50/90 to-amber-50/90 dark:from-gray-800/90 dark:to-gray-700/90 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Classes Section - Left Side */}
            <div>
              <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                  Ultima Online Classes
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300">
                  Choose your character class and find the perfect equipment
                </p>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { name: "Mage", slug: "mage", color: "purple" },
                  { name: "Tamer", slug: "tamer", color: "red" },
                  { name: "Melee", slug: "melee", color: "amber" },
                  { name: "Ranged", slug: "ranged", color: "green" },
                  { name: "Thief", slug: "thief", color: "gray" },
                  { name: "Crafter", slug: "crafter", color: "amber" }
                ].map((classData) => (
                  <a
                    key={classData.slug}
                    href={`/Class/${classData.name}`}
                    className="block p-4 bg-white/80 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg border border-gray-200 dark:border-gray-600 hover:border-amber-500 dark:hover:border-amber-400 hover:shadow-lg transition-all duration-300 text-center group"
                  >
                    <div className="text-2xl mb-2 group-hover:scale-110 transition-transform duration-300">
                      {classData.name === "Mage" && "🧙‍♂️"}
                      {classData.name === "Tamer" && "🐉"}
                      {classData.name === "Melee" && "⚔️"}
                      {classData.name === "Ranged" && "🏹"}
                      {classData.name === "Thief" && "🗡️"}
                      {classData.name === "Crafter" && "🔨"}
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors duration-300">
                      {classData.name}
                    </h3>
                  </a>
                ))}
              </div>
            </div>

            {/* Deal of the Day - Right Side */}
            <div>
              <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                  Deal of the Day
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300">
                  Don't miss out on today's special offer!
                </p>
              </div>
              <DealOfTheDay />
            </div>
          </div>
        </div>
      </section>

      {/* Slot Section */}
      <SlotSection />

      <main>

          {/* Featured Products */}
          <FeaturedProducts />

          {/* News Section */}
          <NewsSection />

          {/* Help Section */}
          <HelpSection />
        </main>
        <Footer />
      </div>
    
  )
}
