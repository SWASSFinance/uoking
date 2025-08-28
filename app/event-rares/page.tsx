import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Breadcrumb } from "@/components/ui/breadcrumb"
import { getEventItems } from "@/lib/db"
import EventRaresClient from "./event-rares-client"

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

interface EventRaresPageProps {
  searchParams: {
    page?: string
    limit?: string
    season?: string
    shard?: string
    itemType?: string
    status?: string
    search?: string
  }
}

export default async function EventRaresPage({ searchParams }: EventRaresPageProps) {
  const page = parseInt(searchParams.page || '1')
  const limit = parseInt(searchParams.limit || '20')
  const season = searchParams.season
  const shard = searchParams.shard
  const itemType = searchParams.itemType
  const status = searchParams.status
  const search = searchParams.search

  try {
    // Fetch event items from the database
    const eventItemsData = await getEventItems({
      page,
      limit,
      season: season ? parseInt(season) : undefined,
      shard,
      itemType,
      status,
      search
    })

    const { items, pagination, filters } = eventItemsData

    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
        <Header />
        <div className="py-16 px-4">
          <div className="container mx-auto">
            {/* Breadcrumb */}
            <div className="mb-8">
              <Breadcrumb 
                items={[
                  { label: "Tools", href: "/tools" },
                  { label: "EM Rares", current: true }
                ]} 
              />
            </div>
          </div>
        </div>
        
        <EventRaresClient 
          initialItems={items || []}
          initialPagination={pagination || { page: 1, limit: 20, total: 0, totalPages: 0 }}
          initialFilters={filters || { seasons: [], shards: [], itemTypes: [] }}
        />
        <Footer />
      </div>
    )
  } catch (error) {
    console.error('Error loading event rares page:', error)
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
        <Header />
        <div className="py-16 px-4">
          <div className="container mx-auto">
            {/* Breadcrumb */}
            <div className="mb-8">
              <Breadcrumb 
                items={[
                  { label: "Tools", href: "/tools" },
                  { label: "EM Rares", current: true }
                ]} 
              />
            </div>
            
            {/* Error State */}
            <div className="text-center py-12">
              <div className="text-red-500 text-lg font-medium mb-4">
                Error Loading Event Items
              </div>
              <p className="text-gray-600 mb-4">
                There was an error loading the event items. Please try again later.
              </p>
              <button 
                onClick={() => window.location.reload()} 
                className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }
}
