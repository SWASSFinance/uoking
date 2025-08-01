import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ShoppingCart, Star, Shield, CreditCard, MessageCircle, Truck, CheckCircle } from 'lucide-react'

export default async function ProductPage({ params }: { params: { 'product-name': string } }) {
  // Product data - this would typically come from a database
  const productData = {
    'hawkwinds-robe': {
      name: "Hawkwinds Robe",
      fullName: "Ultima Online Hawkwinds Robe",
      price: 3.99,
      description: "The Hawkwind's robe is an unreal new item in the Ultima Online game and offers players incredible magic bonuses when the robe is worn. Those who purchase the Ultima Online Hawkwind's robe are given extra mana regeneration, spell damage increase, lower mana cost, and lower reagent cost. Buy a UO Hawkwind's robe for the extra LRC stats. One of the best robes in the game right now. Only drops from Roof runs in Shadowguard. This item does not use up armor/jewelry/talisman slots, just the robe overlay slot.",
      image: "/medieval-robe.png",
      stats: [
        { name: "Mana Regeneration", value: "2" },
        { name: "Spell Damage Increase", value: "5%" },
        { name: "Lower Mana Cost", value: "10%" },
        { name: "Lower Reagent Cost", value: "10%" }
      ],
      availability: "In Stock",
      shards: ["Arirang"],
      spawnLocation: "Roof in Shadowguard",
      dropRate: "100%",
      reviews: 125,
      category: "Mage Items",
      features: [
        "Free Transfer To All Shards",
        "Debit Card Accepted",
        "Credit Card Accepted",
        "Live Chat (allow popups)"
      ]
    },
    'sdi-suit-140-atlantic': {
      name: "SDI Suit 140 Atlantic Shard",
      fullName: "Ultima Online SDI Suit 140 Atlantic Shard",
      price: 119.99,
      description: "A powerful Spell Damage Increase suit designed specifically for the Atlantic shard. This complete suit provides exceptional magical enhancement for mages and spellcasters, offering maximum spell damage output and magical efficiency.",
      image: "/medieval-chest-armor.png",
      stats: [
        { name: "Spell Damage Increase", value: "140%" },
        { name: "Faster Cast Recovery", value: "2" },
        { name: "Lower Mana Cost", value: "15%" },
        { name: "Mana Regeneration", value: "3" }
      ],
      availability: "In Stock",
      shards: ["Atlantic"],
      spawnLocation: "Custom Crafted",
      dropRate: "N/A",
      reviews: 24,
      category: "Mage Items",
      features: [
        "Free Transfer To All Shards",
        "Debit Card Accepted",
        "Credit Card Accepted",
        "Live Chat (allow popups)"
      ]
    },
    'shadows-fury': {
      name: "Shadow's Fury",
      fullName: "Ultima Online Shadow's Fury",
      price: 8.99,
      description: "A deadly weapon imbued with shadow magic, perfect for stealth-based characters and assassins. This weapon provides enhanced damage against vulnerable targets and grants stealth bonuses.",
      image: "/medieval-helmet.png",
      stats: [
        { name: "Damage Increase", value: "25%" },
        { name: "Hit Chance Increase", value: "15%" },
        { name: "Stealth Bonus", value: "10%" },
        { name: "Critical Strike", value: "5%" }
      ],
      availability: "In Stock",
      shards: ["All Shards"],
      spawnLocation: "Shadowguard",
      dropRate: "5%",
      reviews: 18,
      category: "Thief Items",
      features: [
        "Free Transfer To All Shards",
        "Debit Card Accepted",
        "Credit Card Accepted",
        "Live Chat (allow popups)"
      ]
    },
    'shadowbane-tabard': {
      name: "Shadowbane Tabard",
      fullName: "Ultima Online Shadowbane Tabard",
      price: 11.99,
      description: "A prestigious tabard worn by the elite Shadowbane order. This garment provides excellent protection and magical resistance while maintaining the wearer's mobility and agility.",
      image: "/medieval-cloak.png",
      stats: [
        { name: "Physical Resist", value: "15%" },
        { name: "Fire Resist", value: "20%" },
        { name: "Cold Resist", value: "20%" },
        { name: "Poison Resist", value: "15%" }
      ],
      availability: "In Stock",
      shards: ["All Shards"],
      spawnLocation: "Shadowguard",
      dropRate: "10%",
      reviews: 31,
      category: "Melee Items",
      features: [
        "Free Transfer To All Shards",
        "Debit Card Accepted",
        "Credit Card Accepted",
        "Live Chat (allow popups)"
      ]
    },
    'deathforged-claymore': {
      name: "Deathforged Claymore",
      fullName: "Ultima Online Deathforged Claymore",
      price: 9.99,
      description: "A massive two-handed sword forged in the depths of the underworld. This weapon delivers devastating blows and is particularly effective against undead and demonic creatures.",
      image: "/medieval-belt.png",
      stats: [
        { name: "Damage Increase", value: "30%" },
        { name: "Hit Chance Increase", value: "20%" },
        { name: "Undead Slayer", value: "Yes" },
        { name: "Demon Slayer", value: "Yes" }
      ],
      availability: "In Stock",
      shards: ["All Shards"],
      spawnLocation: "Underworld",
      dropRate: "3%",
      reviews: 42,
      category: "Melee Items",
      features: [
        "Free Transfer To All Shards",
        "Debit Card Accepted",
        "Credit Card Accepted",
        "Live Chat (allow popups)"
      ]
    },
    'sentinals-mempo-atlantic': {
      name: "Sentinal's Mempo Atlantic Only",
      fullName: "Ultima Online Sentinal's Mempo Atlantic Only",
      price: 21.99,
      description: "An exclusive helmet available only on the Atlantic shard. This mempo provides exceptional protection and is highly sought after by collectors and warriors alike.",
      image: "/uo/headarmor.png",
      stats: [
        { name: "Physical Resist", value: "25%" },
        { name: "Fire Resist", value: "15%" },
        { name: "Cold Resist", value: "15%" },
        { name: "Energy Resist", value: "15%" }
      ],
      availability: "In Stock",
      shards: ["Atlantic Only"],
      spawnLocation: "Atlantic Exclusive",
      dropRate: "1%",
      reviews: 15,
      category: "Melee Items",
      features: [
        "Free Transfer To All Shards",
        "Debit Card Accepted",
        "Credit Card Accepted",
        "Live Chat (allow popups)"
      ]
    },
    'azaroks-leggings': {
      name: "Azarok's Leggings",
      fullName: "Ultima Online Azarok's Leggings",
      price: 8.99,
      description: "Legendary leggings crafted by the master smith Azarok. These leggings provide excellent protection while maintaining the wearer's agility and movement speed.",
      image: "/uo/legarmor.png",
      stats: [
        { name: "Physical Resist", value: "20%" },
        { name: "Fire Resist", value: "15%" },
        { name: "Cold Resist", value: "15%" },
        { name: "Stamina Regeneration", value: "2" }
      ],
      availability: "In Stock",
      shards: ["All Shards"],
      spawnLocation: "Azarok's Forge",
      dropRate: "8%",
      reviews: 27,
      category: "Melee Items",
      features: [
        "Free Transfer To All Shards",
        "Debit Card Accepted",
        "Credit Card Accepted",
        "Live Chat (allow popups)"
      ]
    },
    'moldering-ursine': {
      name: "Moldering Ursine",
      fullName: "Ultima Online Moldering Ursine",
      price: 29.99,
      description: "A powerful pet companion that has been corrupted by dark magic. This ursine provides exceptional combat abilities and can be trained for various roles in battle.",
      image: "/medieval-chest-armor.png",
      stats: [
        { name: "Strength", value: "150" },
        { name: "Dexterity", value: "120" },
        { name: "Intelligence", value: "80" },
        { name: "Combat Rating", value: "A+" }
      ],
      availability: "In Stock",
      shards: ["All Shards"],
      spawnLocation: "Dark Forest",
      dropRate: "2%",
      reviews: 33,
      category: "Tamer Items",
      features: [
        "Free Transfer To All Shards",
        "Debit Card Accepted",
        "Credit Card Accepted",
        "Live Chat (allow popups)"
      ]
    },
    'rideable-frost-might-statuette': {
      name: "Rideable Frost Might Statuette",
      fullName: "Ultima Online Rideable Frost Might Statuette",
      price: 47.99,
      description: "A rare and beautiful statuette that transforms into a rideable frost creature. This mount provides excellent speed and can traverse difficult terrain with ease.",
      image: "/medieval-talisman.png",
      stats: [
        { name: "Speed", value: "Fast" },
        { name: "Terrain Traversal", value: "Excellent" },
        { name: "Durability", value: "High" },
        { name: "Rarity", value: "Legendary" }
      ],
      availability: "In Stock",
      shards: ["All Shards"],
      spawnLocation: "Frost Lands",
      dropRate: "0.5%",
      reviews: 19,
      category: "Tamer Items",
      features: [
        "Free Transfer To All Shards",
        "Debit Card Accepted",
        "Credit Card Accepted",
        "Live Chat (allow popups)"
      ]
    },
    'void-mare-3-slot-untrained': {
      name: "Void Mare 3 Slot Untrained",
      fullName: "Ultima Online Void Mare 3 Slot Untrained",
      price: 4.99,
      description: "A void mare with 3 control slots, perfect for taming and training. This mare can be customized to fit various roles and is an excellent starting mount for new tamers.",
      image: "/medieval-boots.png",
      stats: [
        { name: "Control Slots", value: "3" },
        { name: "Training Status", value: "Untrained" },
        { name: "Potential", value: "High" },
        { name: "Cost", value: "Budget" }
      ],
      availability: "In Stock",
      shards: ["All Shards"],
      spawnLocation: "Void Plains",
      dropRate: "15%",
      reviews: 56,
      category: "Tamer Items",
      features: [
        "Free Transfer To All Shards",
        "Debit Card Accepted",
        "Credit Card Accepted",
        "Live Chat (allow popups)"
      ]
    }
  }

  const product = productData[params['product-name'] as keyof typeof productData]

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-100">
        <Header />
        <main className="py-16 px-4">
          <div className="container mx-auto text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Product Not Found</h1>
            <p className="text-gray-700 mb-8">The product you're looking for doesn't exist.</p>
            <Button className="button-primary" onClick={() => window.history.back()}>
              Go Back
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-100">
      <Header />
      <main className="py-16 px-4">
        <div className="container mx-auto">
          {/* Breadcrumb */}
          <div className="mb-8">
            <nav className="text-sm text-gray-600">
              <a href="/" className="hover:text-amber-600">Home</a>
              <span className="mx-2">/</span>
              <a href="/class/mage" className="hover:text-amber-600">{product.category}</a>
              <span className="mx-2">/</span>
              <span className="text-gray-900">{product.name}</span>
            </nav>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Image */}
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-lg p-8">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-96 object-cover rounded-lg"
                />
              </div>
              
              {/* Features */}
              <div className="grid grid-cols-2 gap-4">
                {product.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2 text-sm text-gray-700">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Product Details */}
            <div className="space-y-8">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">{product.fullName}</h1>
                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <span className="text-gray-600">{product.reviews} Review(s)</span>
                  <Button variant="outline" size="sm">Add Your Review</Button>
                </div>
              </div>

              {/* Price and Add to Cart */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl font-bold text-gray-900">${product.price}</span>
                  <Badge className="bg-green-500 text-white">- 1</Badge>
                </div>
                <Button className="w-full button-primary text-lg py-4 mb-4">
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  ADD TO CART
                </Button>
                <div className="text-sm text-gray-600">
                  <p className="mb-2">Availability: <span className="text-green-600 font-semibold">{product.availability}</span></p>
                </div>
              </div>

              {/* Stats */}
              <Card className="bg-white/80 backdrop-blur-sm border border-amber-200">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-gray-900">Item Stats</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    {product.stats.map((stat, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-700">{stat.name}</span>
                        <span className="font-semibold text-gray-900">{stat.value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Delivery Details */}
              <Card className="bg-white/80 backdrop-blur-sm border border-amber-200">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-gray-900 flex items-center">
                    <Truck className="h-5 w-5 mr-2" />
                    QUICK DELIVERY DETAILS
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">DELIVERY</h4>
                    <p className="text-gray-700">
                      We carry a UO {product.name} Time of Legends for sale that can be picked up in Ultima Online.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Available on these shards:</h4>
                    <div className="flex flex-wrap gap-2">
                      {product.shards.map((shard, index) => (
                        <Badge key={index} variant="outline" className="bg-amber-100 text-amber-800">
                          {shard}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Options */}
              <Card className="bg-white/80 backdrop-blur-sm border border-amber-200">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-gray-900 flex items-center">
                    <CreditCard className="h-5 w-5 mr-2" />
                    PAYMENT OPTIONS
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Shield className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-gray-700">Secure Payment</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MessageCircle className="h-4 w-4 text-blue-500" />
                      <span className="text-sm text-gray-700">Live Support</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Product Description */}
          <div className="mt-12">
            <Card className="bg-white/80 backdrop-blur-sm border border-amber-200">
              <CardHeader>
                <CardTitle className="text-2xl font-semibold text-gray-900">Product Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed text-lg">{product.description}</p>
              </CardContent>
            </Card>
          </div>

          {/* FAQ Section */}
          <div className="mt-12">
            <Card className="bg-white/80 backdrop-blur-sm border border-amber-200">
              <CardHeader>
                <CardTitle className="text-2xl font-semibold text-gray-900">Frequently Asked Questions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    {product.name} spawn location?
                  </h4>
                  <p className="text-gray-700">{product.spawnLocation}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    What are the stats for {product.name}?
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {product.stats.map((stat, index) => (
                      <div key={index} className="text-gray-700">
                        {stat.name}: {stat.value}
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    What's the {product.name} drop rate in Ultima Online?
                  </h4>
                  <p className="text-gray-700">{product.dropRate}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Related Products */}
          <div className="mt-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Related Products</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* This would be populated with related products */}
              <Card className="bg-white/80 backdrop-blur-sm border border-amber-200 hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 flex-1 mr-2">SDI Spellbook 40 Plus</h3>
                    <Badge className="bg-amber-600 text-white text-xs">$6.49</Badge>
                  </div>
                  <Button className="w-full bg-amber-600 hover:bg-amber-700 text-sm">
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Cart
                  </Button>
                </CardContent>
              </Card>
              <Card className="bg-white/80 backdrop-blur-sm border border-amber-200 hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 flex-1 mr-2">Yukio's Glass Earrings</h3>
                    <Badge className="bg-amber-600 text-white text-xs">$17.99</Badge>
                  </div>
                  <Button className="w-full bg-amber-600 hover:bg-amber-700 text-sm">
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Cart
                  </Button>
                </CardContent>
              </Card>
              <Card className="bg-white/80 backdrop-blur-sm border border-amber-200 hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 flex-1 mr-2">Robe of the Dark Monk</h3>
                    <Badge className="bg-amber-600 text-white text-xs">$79.99</Badge>
                  </div>
                  <Button className="w-full bg-amber-600 hover:bg-amber-700 text-sm">
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Cart
                  </Button>
                </CardContent>
              </Card>
              <Card className="bg-white/80 backdrop-blur-sm border border-amber-200 hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 flex-1 mr-2">Mantle Of The Archlich</h3>
                    <Badge className="bg-amber-600 text-white text-xs">$59.99</Badge>
                  </div>
                  <Button className="w-full bg-amber-600 hover:bg-amber-700 text-sm">
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Cart
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
} 