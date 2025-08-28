'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Gift, Search, Filter, Calendar, MapPin, Eye } from "lucide-react"
import { ProductImage } from "@/components/ui/product-image"

interface EventItem {
  id: string
  name: string
  slug: string
  description: string
  season_number: number
  season_name: string
  event_year: number
  event_type: string
  shard: string
  original_image_url: string
  cloudinary_url: string
  item_type: string
  hue_number: number
  graphic_number: number
  status: string
  rarity_level: string
  created_at: string
  updated_at: string
}

interface EventRaresClientProps {
  initialItems: EventItem[]
  initialPagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
  initialFilters: {
    seasons: any[]
    shards: string[]
    itemTypes: string[]
  }
}

export default function EventRaresClient({ 
  initialItems, 
  initialPagination, 
  initialFilters 
}: EventRaresClientProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [items, setItems] = useState<EventItem[]>(initialItems)
  const [pagination, setPagination] = useState(initialPagination)
  const [filters, setFilters] = useState(initialFilters)
  const [loading, setLoading] = useState(false)
  
  // Form state
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '')
  const [selectedSeason, setSelectedSeason] = useState(searchParams.get('season') || '')
  const [selectedShard, setSelectedShard] = useState(searchParams.get('shard') || '')
  const [selectedItemType, setSelectedItemType] = useState(searchParams.get('itemType') || '')

  const applyFilters = () => {
    setLoading(true)
    
    const params = new URLSearchParams()
    if (searchTerm) params.set('search', searchTerm)
    if (selectedSeason) params.set('season', selectedSeason)
    if (selectedShard) params.set('shard', selectedShard)
    if (selectedItemType) params.set('itemType', selectedItemType)
    
    // Reset to page 1 when applying filters
    params.set('page', '1')
    
    router.push(`/event-rares?${params.toString()}`)
  }

  const clearFilters = () => {
    setSearchTerm('')
    setSelectedSeason('')
    setSelectedShard('')
    setSelectedItemType('')
    router.push('/event-rares')
  }

  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', page.toString())
    router.push(`/event-rares?${params.toString()}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
      <main className="py-16 px-4">
        <div className="container mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <Gift className="h-16 w-16 text-amber-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              EM Event Rares
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover rare and collectible items from Ultima Online Event Master events. 
              Browse through seasons of exclusive items and limited editions.
            </p>
          </div>

          {/* Filters Section */}
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 mb-8 shadow-sm border border-amber-200">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Search */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Search Items</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search by name or description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                    onKeyPress={(e) => e.key === 'Enter' && applyFilters()}
                  />
                </div>
              </div>

              {/* Season Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Season</label>
                <Select value={selectedSeason} onValueChange={setSelectedSeason}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Seasons" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Seasons</SelectItem>
                    {filters.seasons.map((season: any) => (
                      <SelectItem key={season.season_number} value={season.season_number.toString()}>
                        Season {season.season_number}: {season.season_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Shard Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Shard</label>
                <Select value={selectedShard} onValueChange={setSelectedShard}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Shards" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Shards</SelectItem>
                    {filters.shards.map((shard: string) => (
                      <SelectItem key={shard} value={shard}>
                        {shard}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Item Type Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Item Type</label>
                <Select value={selectedItemType} onValueChange={setSelectedItemType}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Types</SelectItem>
                    {filters.itemTypes.map((type: string) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Filter Buttons */}
            <div className="mt-4 flex justify-center gap-4">
              <Button 
                className="bg-amber-600 hover:bg-amber-700"
                onClick={applyFilters}
                disabled={loading}
              >
                <Filter className="h-4 w-4 mr-2" />
                {loading ? 'Loading...' : 'Apply Filters'}
              </Button>
              <Button 
                variant="outline"
                onClick={clearFilters}
                disabled={loading}
              >
                Clear Filters
              </Button>
            </div>
          </div>

          {/* Results Summary */}
          <div className="mb-6">
            <p className="text-gray-600">
              Showing {items.length} of {pagination.total} items
              {searchTerm && ` for "${searchTerm}"`}
            </p>
          </div>

          {/* Event Items Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map((item: EventItem) => (
              <Card key={item.id} className="group hover:shadow-lg transition-all duration-300 hover:scale-105 border-amber-200 bg-white/90 backdrop-blur-sm">
                <CardContent className="p-4">
                  {/* Item Image */}
                  <div className="aspect-square relative mb-4 bg-gray-50 rounded-lg overflow-hidden group">
                    <ProductImage
                      src={item.cloudinary_url || item.original_image_url || '/placeholder.png'}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                    
                    {/* Hover overlay with item details */}
                    <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4">
                      <div className="text-white text-center">
                        <p className="text-sm font-medium mb-2">{item.name}</p>
                        <p className="text-xs opacity-90 line-clamp-3">
                          {item.description}
                        </p>
                      </div>
                    </div>
                    
                    {/* Rarity Badge */}
                    <Badge className={`absolute top-2 left-2 ${
                      item.rarity_level === 'legendary' ? 'bg-purple-500' :
                      item.rarity_level === 'epic' ? 'bg-blue-500' :
                      item.rarity_level === 'rare' ? 'bg-green-500' :
                      'bg-gray-500'
                    } text-white text-xs capitalize`}>
                      {item.rarity_level}
                    </Badge>

                    {/* Status Badge */}
                    <Badge className={`absolute top-2 right-2 ${
                      item.status === 'active' ? 'bg-green-500' : 'bg-red-500'
                    } text-white text-xs`}>
                      {item.status}
                    </Badge>
                  </div>
                  
                  {/* Item Info */}
                  <div className="space-y-2">
                    <h3 className="font-semibold text-gray-800 group-hover:text-amber-600 transition-colors line-clamp-2">
                      {item.name}
                    </h3>
                    
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {item.description}
                    </p>

                    {/* Item Details */}
                    <div className="space-y-1 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>Season {item.season_number}: {item.season_name}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        <span>{item.shard}</span>
                      </div>
                      {item.item_type && (
                        <div className="flex items-center gap-1">
                          <Gift className="h-3 w-3" />
                          <span>{item.item_type}</span>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 pt-2">
                      <Button 
                        size="sm"
                        variant="outline"
                        className="flex-1 border-amber-300 text-amber-700 hover:bg-amber-50"
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="mt-8 flex justify-center">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  disabled={pagination.page <= 1}
                  onClick={() => goToPage(pagination.page - 1)}
                  className="border-amber-300 text-amber-700 hover:bg-amber-50"
                >
                  Previous
                </Button>
                
                <span className="px-4 py-2 text-sm text-gray-600">
                  Page {pagination.page} of {pagination.totalPages}
                </span>
                
                <Button
                  variant="outline"
                  disabled={pagination.page >= pagination.totalPages}
                  onClick={() => goToPage(pagination.page + 1)}
                  className="border-amber-300 text-amber-700 hover:bg-amber-50"
                >
                  Next
                </Button>
              </div>
            </div>
          )}

          {/* CTA Section */}
          <div className="text-center bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-8 text-white mt-12">
            <h2 className="text-3xl font-bold mb-4">
              Looking for Specific Event Items?
            </h2>
            <p className="text-xl mb-6 opacity-90">
              Can't find what you're looking for? Contact us for custom event item requests.
            </p>
            <Button size="lg" variant="secondary" asChild>
              <a href="/contact">
                Contact Us
              </a>
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
