import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ProductImage } from "@/components/ui/product-image"
import { 
  Crown, 
  ShoppingBag, 
  Coins, 
  Scroll, 
  Sword, 
  Shield, 
  ArrowUp,
  Star,
  Gem,
  Home,
  BookOpen,
  Zap,
  Heart,
  Target,
  Hammer,
  Ship,
  ScrollText,
  Trophy,
  Clock,
  Gift
} from "lucide-react"
import Link from "next/link"
import { getCategories, getProducts } from "@/lib/db"

const categoryIcons: { [key: string]: any } = {
  'weapons': Sword,
  'armor': Shield,
  'jewelry': Gem,
  'scrolls': Scroll,
  'gold': Coins,
  'accounts': Crown,
  'houses': Home,
  'rares': Trophy,
  'services': Clock,
}

export default async function StorePage() {
  // Fetch categories and get product counts for each
  const categories = await getCategories(); // Get top-level categories only
  
  // Get product count for each category
  const categoriesWithCounts = await Promise.all(
    categories.map(async (category: any) => {
      const products = await getProducts({ categoryId: category.id, limit: 1 });
      // This is a quick way to get total count - in production you'd want a proper count query
      const allProducts = await getProducts({ categoryId: category.id });
      return {
        ...category,
        itemCount: allProducts.length
      };
    })
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
      <Header />
      <main className="py-16 px-4">
        <div className="container mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-6">
              <ShoppingBag className="h-12 w-12 text-amber-600 mr-4" />
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900">UO King Store</h1>
            </div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Discover the ultimate collection of Ultima Online items, gold, accounts, and services. 
              Your journey to UO dominance starts here.
            </p>
            <div className="flex items-center justify-center space-x-8 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4 text-green-500" />
                <span>Secure Transactions</span>
              </div>
              <div className="flex items-center space-x-2">
                <Zap className="h-4 w-4 text-blue-500" />
                <span>Instant Delivery</span>
              </div>
              <div className="flex items-center space-x-2">
                <Heart className="h-4 w-4 text-red-500" />
                <span>24/7 Support</span>
              </div>
            </div>
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {categoriesWithCounts.map((category: any) => {
              const IconComponent = categoryIcons[category.slug] || ShoppingBag;
              
              return (
                <Link key={category.id} href={`/UO/${category.slug}`}>
                  <Card className="group hover:shadow-2xl transition-all duration-300 border border-gray-200 hover:border-amber-300 cursor-pointer overflow-hidden">
                    <CardHeader className="text-center bg-gradient-to-r from-amber-50 to-orange-50 group-hover:from-amber-100 group-hover:to-orange-100 transition-all duration-300 p-0">
                      {/* Category Image */}
                      <div className="relative h-48 overflow-hidden">
                        {category.image_url ? (
                          <ProductImage
                            src={category.image_url}
                            alt={category.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center">
                            <IconComponent className="h-16 w-16 text-amber-600 opacity-50" />
                          </div>
                        )}
                        {/* Overlay for better text readability */}
                        <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-10 transition-all duration-300" />
                        
                        {/* Hot badge */}
                        {category.itemCount > 50 && (
                          <Badge className="absolute top-4 right-4 bg-amber-500 text-white text-xs z-10">
                            Hot
                          </Badge>
                        )}
                      </div>
                      
                      {/* Category Title */}
                      <div className="p-6">
                        <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-amber-600 transition-colors">
                          {category.name}
                        </CardTitle>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="p-6">
                      <div 
                        className="text-gray-600 text-center mb-4 line-clamp-2"
                        dangerouslySetInnerHTML={{ __html: category.description }}
                      />
                      
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                          <Star className="h-4 w-4 text-amber-500" />
                          <span className="text-sm font-medium text-gray-700">
                            {category.itemCount} item{category.itemCount !== 1 ? 's' : ''}
                          </span>
                        </div>
                        <Badge variant="outline" className="text-amber-600 border-amber-600">
                          Browse
                        </Badge>
                      </div>
                      
                      <div className="text-center">
                        <Button 
                          className="w-full bg-amber-600 hover:bg-amber-700 text-white group-hover:bg-amber-700 transition-colors"
                          size="sm"
                        >
                          <ArrowUp className="h-4 w-4 mr-2 group-hover:translate-y-[-2px] transition-transform" />
                          Shop Now
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>

          {/* No categories fallback */}
          {categoriesWithCounts.length === 0 && (
            <div className="text-center py-16">
              <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No Categories Available</h3>
              <p className="text-gray-500">Please check back later for our product categories.</p>
            </div>
          )}

          {/* Call to Action */}
          <div className="mt-16 text-center bg-gradient-to-r from-amber-600 to-orange-600 rounded-2xl p-8 text-white">
            <h2 className="text-3xl font-bold mb-4">Need Something Specific?</h2>
            <p className="text-xl mb-6 text-amber-100">
              Can't find what you're looking for? Our team can help you find the perfect UO items.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="outline" className="bg-white text-amber-600 border-white hover:bg-amber-50">
                <Gift className="h-5 w-5 mr-2" />
                Contact Support
              </Button>
              <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-amber-600">
                <BookOpen className="h-5 w-5 mr-2" />
                View All Products
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
} 