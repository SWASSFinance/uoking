"use client"

import { useState, useEffect } from "react"
import { AdminHeader } from "@/components/admin-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/hooks/use-toast"
import { Plus, Edit, Trash2, Calendar, User } from "lucide-react"

interface NewsPost {
  id: string
  title: string
  message: string
  posted_by: string
  date_posted: string
  is_active: boolean
  created_at: string
  updated_at: string
}

interface NewsResponse {
  news: NewsPost[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

export default function AdminNewsPage() {
  const [news, setNews] = useState<NewsPost[]>([])
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 0 })
  const [loading, setLoading] = useState(true)
  const [editingNews, setEditingNews] = useState<NewsPost | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    date_posted: new Date().toISOString().split('T')[0],
    is_active: true
  })

  // Fetch news posts
  const fetchNews = async (page = 1) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/admin/news?page=${page}&limit=10`)
      if (!response.ok) throw new Error('Failed to fetch news')
      
      const data: NewsResponse = await response.json()
      setNews(data.news)
      setPagination(data.pagination)
    } catch (error) {
      console.error('Error fetching news:', error)
      toast({
        title: "Error",
        description: "Failed to fetch news posts",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNews()
  }, [])

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const url = editingNews 
        ? `/api/admin/news/${editingNews.id}`
        : '/api/admin/news'
      
      const method = editingNews ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (!response.ok) throw new Error('Failed to save news post')

      const savedNews = await response.json()
      
      toast({
        title: "Success",
        description: `News post ${editingNews ? 'updated' : 'created'} successfully`
      })

      // Reset form and close dialog
      setFormData({
        title: "",
        message: "",
        date_posted: new Date().toISOString().split('T')[0],
        is_active: true
      })
      setEditingNews(null)
      setIsDialogOpen(false)
      
      // Refresh the list
      fetchNews(pagination.page)
      
    } catch (error) {
      console.error('Error saving news:', error)
      toast({
        title: "Error",
        description: "Failed to save news post",
        variant: "destructive"
      })
    }
  }

  // Handle delete
  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/news/${id}`, {
        method: 'DELETE'
      })

      if (!response.ok) throw new Error('Failed to delete news post')

      toast({
        title: "Success",
        description: "News post deleted successfully"
      })

      // Refresh the list
      fetchNews(pagination.page)
      
    } catch (error) {
      console.error('Error deleting news:', error)
      toast({
        title: "Error",
        description: "Failed to delete news post",
        variant: "destructive"
      })
    }
  }

  // Handle edit
  const handleEdit = (newsPost: NewsPost) => {
    setEditingNews(newsPost)
    setFormData({
      title: newsPost.title,
      message: newsPost.message,
      date_posted: newsPost.date_posted,
      is_active: newsPost.is_active
    })
    setIsDialogOpen(true)
  }

  // Handle new post
  const handleNew = () => {
    setEditingNews(null)
    setFormData({
      title: "",
      message: "",
      date_posted: new Date().toISOString().split('T')[0],
      is_active: true
    })
    setIsDialogOpen(true)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">News Management</h1>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleNew}>
                <Plus className="h-4 w-4 mr-2" />
                Add News Post
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingNews ? 'Edit News Post' : 'Add News Post'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Enter news title"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Enter news message (supports HTML)"
                    rows={8}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="date_posted">Date Posted</Label>
                  <Input
                    id="date_posted"
                    type="date"
                    value={formData.date_posted}
                    onChange={(e) => setFormData({ ...formData, date_posted: e.target.value })}
                    required
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                  />
                  <Label htmlFor="is_active">Active</Label>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingNews ? 'Update' : 'Create'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        ) : (
          <div className="grid gap-4">
            {news.map((newsPost) => (
              <Card key={newsPost.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="flex items-center gap-2">
                        {newsPost.title}
                        <Badge variant={newsPost.is_active ? "default" : "secondary"}>
                          {newsPost.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </CardTitle>
                      <div className="flex items-center gap-4 text-sm text-gray-500 mt-2">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(newsPost.date_posted).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          {newsPost.posted_by}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(newsPost)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete News Post</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{newsPost.title}"? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(newsPost.id)}>
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div 
                    className="prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: newsPost.message }}
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="flex justify-center mt-8">
            <div className="flex gap-2">
              {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={page === pagination.page ? "default" : "outline"}
                  size="sm"
                  onClick={() => fetchNews(page)}
                >
                  {page}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
