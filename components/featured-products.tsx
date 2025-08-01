import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, ShoppingCart, Crown } from "lucide-react"
import Link from "next/link"

const products = [
  {
    id: 1,
    name: "SDI Suit 140 Atlantic Shard",
    price: 119.99,
    originalPrice: 149.99,
    rating: 4.8,
    reviews: 24,
    image: "/medieval-chest-armor.png",
    badge: "Best Seller",
    badgeColor: "bg-green-500",
    shard: "Atlantic",
    href: "/product/sdi-suit-140-atlantic",
  },
  {
    id: 2,
    name: "Shadow's Fury",
    price: 8.99,
    rating: 4.6,
    reviews: 18,
    image: "/medieval-helmet.png",
    badge: "New",
    badgeColor: "bg-blue-500",
    shard: "All Shards",
    href: "/product/shadows-fury",
  },
  {
    id: 3,
    name: "Shadowbane Tabard",
    price: 11.99,
    rating: 4.7,
    reviews: 31,
    image: "/medieval-cloak.png",
    badge: "Popular",
    badgeColor: "bg-purple-500",
    shard: "All Shards",
    href: "/product/shadowbane-tabard",
  },
  {
    id: 4,
    name: "Deathforged Claymore",
    price: 9.99,
    rating: 4.9,
    reviews: 42,
    image: "/medieval-belt.png",
    badge: "Top Rated",
    badgeColor: "bg-yellow-500",
    shard: "All Shards",
    href: "/product/deathforged-claymore",
  },
  {
    id: 5,
    name: "Sentinal's Mempo Atlantic Only",
    price: 21.99,
    rating: 4.5,
    reviews: 15,
    image: "/uo/headarmor.png",
    badge: "Rare",
    badgeColor: "bg-red-500",
    shard: "Atlantic Only",
    href: "/product/sentinals-mempo-atlantic",
  },
  {
    id: 6,
    name: "Azarok's Leggings",
    price: 8.99,
    rating: 4.4,
    reviews: 27,
    image: "/uo/legarmor.png",
    badge: "Sale",
    badgeColor: "bg-orange-500",
    shard: "All Shards",
    href: "/product/azaroks-leggings",
  },
  {
    id: 7,
    name: "Moldering Ursine",
    price: 29.99,
    rating: 4.6,
    reviews: 33,
    image: "/medieval-chest-armor.png",
    badge: "Limited",
    badgeColor: "bg-indigo-500",
    shard: "All Shards",
    href: "/product/moldering-ursine",
  },
  {
    id: 8,
    name: "Rideable Frost Might Statuette",
    price: 47.99,
    rating: 4.8,
    reviews: 19,
    image: "/medieval-talisman.png",
    badge: "Premium",
    badgeColor: "bg-pink-500",
    shard: "All Shards",
    href: "/product/rideable-frost-might-statuette",
  },
  {
    id: 9,
    name: "Void Mare 3 Slot Untrained",
    price: 4.99,
    rating: 4.3,
    reviews: 56,
    image: "/medieval-boots.png",
    badge: "Budget",
    badgeColor: "bg-gray-500",
    shard: "All Shards",
    href: "/product/void-mare-3-slot-untrained",
  },
]

export function FeaturedProducts() {
  return (
    <section className="py-16 px-4 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Crown className="h-8 w-8 text-amber-600 mr-3" />
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Latest Products</h2>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">Discover our most popular and highest-rated Ultima Online items</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Link key={product.id} href={product.href}>
              <Card className="group hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 cursor-pointer">
                <div className="relative">
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <Badge className={`absolute top-3 left-3 ${product.badgeColor} text-white`}>{product.badge}</Badge>
                  <Badge className="absolute top-3 right-3 bg-gray-800 text-white text-xs">{product.shard}</Badge>
                </div>

                <CardContent className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-amber-600 transition-colors line-clamp-2">
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
            </Link>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button variant="outline" size="lg" className="px-8 bg-white border-2 border-amber-600 text-amber-600 hover:bg-amber-600 hover:text-white">
            View All Products
          </Button>
        </div>
      </div>
    </section>
  )
}
