import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, ShoppingCart } from "lucide-react"

const products = [
  {
    id: 1,
    name: "SDI Suit 140 Atlantic Shard",
    price: 119.99,
    originalPrice: 149.99,
    rating: 4.8,
    reviews: 24,
    image: "/placeholder.svg?height=200&width=200",
    badge: "Best Seller",
    badgeColor: "bg-green-500",
  },
  {
    id: 2,
    name: "Shadow's Fury Weapon",
    price: 8.99,
    rating: 4.6,
    reviews: 18,
    image: "/placeholder.svg?height=200&width=200",
    badge: "New",
    badgeColor: "bg-blue-500",
  },
  {
    id: 3,
    name: "Shadowbane Tabard",
    price: 11.99,
    rating: 4.7,
    reviews: 31,
    image: "/placeholder.svg?height=200&width=200",
    badge: "Popular",
    badgeColor: "bg-purple-500",
  },
  {
    id: 4,
    name: "Deathforged Claymore",
    price: 9.99,
    rating: 4.9,
    reviews: 42,
    image: "/placeholder.svg?height=200&width=200",
    badge: "Top Rated",
    badgeColor: "bg-yellow-500",
  },
  {
    id: 5,
    name: "Sentinal's Mempo Atlantic Only",
    price: 21.99,
    rating: 4.5,
    reviews: 15,
    image: "/placeholder.svg?height=200&width=200",
    badge: "Rare",
    badgeColor: "bg-red-500",
  },
  {
    id: 6,
    name: "Azarok's Leggings",
    price: 8.99,
    rating: 4.4,
    reviews: 27,
    image: "/placeholder.svg?height=200&width=200",
    badge: "Sale",
    badgeColor: "bg-orange-500",
  },
]

export function FeaturedProducts() {
  return (
    <section className="py-16 px-4 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Featured Products</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">Discover our most popular and highest-rated items</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
              <div className="relative">
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <Badge className={`absolute top-3 left-3 ${product.badgeColor} text-white`}>{product.badge}</Badge>
              </div>

              <CardContent className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-amber-600 transition-colors">
                  {product.name}
                </h3>

                <div className="flex items-center space-x-2 mb-3">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${i < Math.floor(product.rating) ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">({product.reviews})</span>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-2xl font-bold text-gray-900">${product.price}</span>
                  {product.originalPrice && (
                    <span className="text-lg text-gray-500 line-through">${product.originalPrice}</span>
                  )}
                </div>
              </CardContent>

              <CardFooter className="p-4 pt-0">
                <Button className="w-full bg-amber-600 hover:bg-amber-700">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button variant="outline" size="lg" className="px-8 bg-transparent">
            View All Products
          </Button>
        </div>
      </div>
    </section>
  )
}
