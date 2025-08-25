"use client"

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useToast } from '@/hooks/use-toast'
import { 
  ShoppingBag, 
  Plus, 
  Search, 
  Filter,
  DollarSign,
  MapPin,
  User,
  Calendar,
  Crown,
  Eye,
  Edit,
  Trash2,
  AlertCircle,
  CheckCircle,
  XCircle
} from 'lucide-react'

interface TradingPost {
  id: string
  title: string
  description: string
  item_name: string
  price: number
  currency: string
  shard?: string
  character_name?: string
  contact_info?: string
  status: string
  is_plot_owner_verified: boolean
  author_name: string
  created_at: string
}

export default function TradingBoardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  
  const [posts, setPosts] = useState<TradingPost[]>([])
  const [loading, setLoading] = useState(true)
  const [isPlotOwner, setIsPlotOwner] = useState(false)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterShard, setFilterShard] = useState('')
  const [filterMinPrice, setFilterMinPrice] = useState('')
  const [filterMaxPrice, setFilterMaxPrice] = useState('')
  
  const [createForm, setCreateForm] = useState({
    title: '',
    description: '',
    item_name: '',
    price: '',
    currency: 'USD',
    shard: '',
    character_name: '',
    contact_info: ''
  })

  useEffect(() => {
    fetchPosts()
    if (session?.user?.id) {
      checkPlotOwnerStatus()
    }
  }, [session])

  const fetchPosts = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (searchTerm) params.append('item_name', searchTerm)
      if (filterShard) params.append('shard', filterShard)
      if (filterMinPrice) params.append('min_price', filterMinPrice)
      if (filterMaxPrice) params.append('max_price', filterMaxPrice)
      
      const response = await fetch(`/api/trading?${params.toString()}`)
      if (response.ok) {
        const data = await response.json()
        setPosts(data.posts || [])
      }
    } catch (error) {
      console.error('Error fetching posts:', error)
      toast({
        title: "Error",
        description: "Failed to load trading posts",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const checkPlotOwnerStatus = async () => {
    try {
      const response = await fetch('/api/user/plot-owner-status')
      if (response.ok) {
        const data = await response.json()
        setIsPlotOwner(data.isPlotOwner)
      }
    } catch (error) {
      console.error('Error checking plot owner status:', error)
    }
  }

  const handleCreatePost = async () => {
    try {
      const response = await fetch('/api/trading', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(createForm),
      })

      if (response.ok) {
        const data = await response.json()
        toast({
          title: "Success",
          description: "Trading post created successfully!",
        })
        setShowCreateDialog(false)
        setCreateForm({
          title: '',
          description: '',
          item_name: '',
          price: '',
          currency: 'USD',
          shard: '',
          character_name: '',
          contact_info: ''
        })
        fetchPosts()
      } else {
        const error = await response.json()
        toast({
          title: "Error",
          description: error.error || "Failed to create trading post",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error creating post:', error)
      toast({
        title: "Error",
        description: "Failed to create trading post",
        variant: "destructive",
      })
    }
  }

  const handleDeletePost = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this trading post?')) {
      return
    }

    try {
      const response = await fetch(`/api/trading/${postId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Trading post deleted successfully!",
        })
        fetchPosts()
      } else {
        const error = await response.json()
        toast({
          title: "Error",
          description: error.error || "Failed to delete trading post",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error deleting post:', error)
      toast({
        title: "Error",
        description: "Failed to delete trading post",
        variant: "destructive",
      })
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Active</Badge>
      case 'sold':
        return <Badge className="bg-blue-100 text-blue-800"><DollarSign className="h-3 w-3 mr-1" />Sold</Badge>
      case 'expired':
        return <Badge className="bg-gray-100 text-gray-800"><Calendar className="h-3 w-3 mr-1" />Expired</Badge>
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800"><XCircle className="h-3 w-3 mr-1" />Cancelled</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>
    }
  }

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.item_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesShard = !filterShard || post.shard?.toLowerCase().includes(filterShard.toLowerCase())
    const matchesMinPrice = !filterMinPrice || post.price >= parseFloat(filterMinPrice)
    const matchesMaxPrice = !filterMaxPrice || post.price <= parseFloat(filterMaxPrice)
    
    return matchesSearch && matchesShard && matchesMinPrice && matchesMaxPrice
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
      <Header />
      <main className="py-16 px-4">
        <div className="container mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
                         <h1 className="text-4xl font-bold text-gray-900 mb-4">
               WTS Trading Board
             </h1>
             <p className="text-xl text-gray-600 mb-6">
               Buy and sell Ultima Online items for gold from verified plot owners
             </p>
            <div className="flex items-center justify-center space-x-2 mb-6">
              <Crown className="h-5 w-5 text-amber-600" />
              <span className="text-sm text-gray-600">
                Only plot owners can create trading posts
              </span>
            </div>
            
            {session?.user?.id && (
              <div className="flex justify-center">
                {isPlotOwner ? (
                  <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                    <DialogTrigger asChild>
                      <Button className="bg-amber-600 hover:bg-amber-700 text-white">
                        <Plus className="h-4 w-4 mr-2" />
                        Create Trading Post
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Create New Trading Post</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium text-gray-700">Title *</label>
                          <Input
                            value={createForm.title}
                            onChange={(e) => setCreateForm({...createForm, title: e.target.value})}
                            placeholder="Enter post title..."
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700">Item Name *</label>
                          <Input
                            value={createForm.item_name}
                            onChange={(e) => setCreateForm({...createForm, item_name: e.target.value})}
                            placeholder="Enter item name..."
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700">Description *</label>
                          <Textarea
                            value={createForm.description}
                            onChange={(e) => setCreateForm({...createForm, description: e.target.value})}
                            placeholder="Describe the item, condition, etc..."
                            rows={3}
                            className="mt-1"
                          />
                        </div>
                                                 <div>
                           <label className="text-sm font-medium text-gray-700">Price (Gold) *</label>
                           <Input
                             type="number"
                             value={createForm.price}
                             onChange={(e) => setCreateForm({...createForm, price: e.target.value})}
                             placeholder="e.g., 50000000"
                             className="mt-1"
                           />
                           <p className="text-xs text-gray-500 mt-1">Enter the amount in gold (e.g., 50,000,000 for 50 million gold)</p>
                         </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium text-gray-700">Shard</label>
                            <Input
                              value={createForm.shard}
                              onChange={(e) => setCreateForm({...createForm, shard: e.target.value})}
                              placeholder="e.g., Atlantic, Pacific..."
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-700">Character Name</label>
                            <Input
                              value={createForm.character_name}
                              onChange={(e) => setCreateForm({...createForm, character_name: e.target.value})}
                              placeholder="Your character name"
                              className="mt-1"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700">Contact Information</label>
                          <Textarea
                            value={createForm.contact_info}
                            onChange={(e) => setCreateForm({...createForm, contact_info: e.target.value})}
                            placeholder="How buyers can contact you..."
                            rows={2}
                            className="mt-1"
                          />
                        </div>
                        <div className="flex justify-end space-x-2">
                          <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                            Cancel
                          </Button>
                          <Button onClick={handleCreatePost} className="bg-amber-600 hover:bg-amber-700">
                            Create Post
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                ) : (
                  <div className="flex items-center space-x-2 text-amber-700 bg-amber-50 px-4 py-2 rounded-lg">
                    <AlertCircle className="h-4 w-4" />
                    <span className="text-sm">You need to own at least one plot to create trading posts</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Filters */}
          <Card className="mb-8 border border-gray-200 bg-white">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search posts..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">Shard</label>
                  <Input
                    placeholder="Filter by shard..."
                    value={filterShard}
                    onChange={(e) => setFilterShard(e.target.value)}
                  />
                </div>
                                 <div>
                   <label className="text-sm font-medium text-gray-700 block mb-2">Min Gold</label>
                   <Input
                     type="number"
                     placeholder="Min gold..."
                     value={filterMinPrice}
                     onChange={(e) => setFilterMinPrice(e.target.value)}
                   />
                 </div>
                 <div>
                   <label className="text-sm font-medium text-gray-700 block mb-2">Max Gold</label>
                   <Input
                     type="number"
                     placeholder="Max gold..."
                     value={filterMaxPrice}
                     onChange={(e) => setFilterMaxPrice(e.target.value)}
                   />
                 </div>
              </div>
            </CardContent>
          </Card>

          {/* Posts */}
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading trading posts...</p>
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No trading posts found</h3>
              <p className="text-gray-600">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map((post) => (
                <Card key={post.id} className="bg-white border border-gray-200 hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                          {post.title}
                        </CardTitle>
                        <div className="flex items-center space-x-2 mb-2">
                          {getStatusBadge(post.status)}
                          {post.is_plot_owner_verified && (
                            <Badge className="bg-amber-100 text-amber-800">
                              <Crown className="h-3 w-3 mr-1" />
                              Plot Owner
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Item:</p>
                      <p className="font-medium text-gray-900">{post.item_name}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Description:</p>
                      <p className="text-gray-700 line-clamp-3">{post.description}</p>
                    </div>
                    
                                         <div className="flex items-center justify-between">
                       <div className="text-2xl font-bold text-yellow-600">
                         {post.price.toLocaleString()} Gold
                       </div>
                     </div>
                    
                    <div className="space-y-2 text-sm">
                      {post.shard && (
                        <div className="flex items-center text-gray-600">
                          <MapPin className="h-4 w-4 mr-2" />
                          {post.shard}
                        </div>
                      )}
                      {post.character_name && (
                        <div className="flex items-center text-gray-600">
                          <User className="h-4 w-4 mr-2" />
                          {post.character_name}
                        </div>
                      )}
                      <div className="flex items-center text-gray-600">
                        <Calendar className="h-4 w-4 mr-2" />
                        {new Date(post.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-2 border-t">
                      <span className="text-sm text-gray-500">by {post.author_name}</span>
                      {session?.user?.id && post.author_name === session.user.name && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeletePost(post.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
