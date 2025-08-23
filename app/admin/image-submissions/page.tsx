"use client"

import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import { AdminHeader } from "@/components/admin-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Image as ImageIcon, 
  CheckCircle, 
  XCircle, 
  Package,
  User,
  Calendar,
  Eye,
  Check,
  X,
  Trash2
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface ImageSubmission {
  id: string
  product_id: string
  user_id: string
  image_url: string
  cloudinary_public_id?: string
  status: string
  created_at: string
  product_name: string
  product_image?: string
  user_username: string
  user_email: string
}

export default function AdminImageSubmissionsPage() {
  const { toast } = useToast()
  const [submissions, setSubmissions] = useState<ImageSubmission[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("pending")

  useEffect(() => {
    loadSubmissions()
  }, [])

  const loadSubmissions = async () => {
    try {
      const response = await fetch('/api/admin/image-submissions')
      if (response.ok) {
        const data = await response.json()
        setSubmissions(data.submissions || [])
      } else {
        toast({
          title: "Error",
          description: "Failed to load image submissions",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error loading image submissions:', error)
      toast({
        title: "Error",
        description: "Failed to load image submissions",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmissionAction = async (submissionId: string, action: 'approve' | 'reject') => {
    try {
      const response = await fetch(`/api/admin/image-submissions/${submissionId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action }),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: `Image submission ${action === 'approve' ? 'approved' : 'rejected'} successfully`,
        })
        loadSubmissions() // Reload the list
      } else {
        const error = await response.json()
        toast({
          title: "Error",
          description: error.error || `Failed to ${action} image submission`,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error(`Error ${action}ing image submission:`, error)
      toast({
        title: "Error",
        description: `Failed to ${action} image submission`,
        variant: "destructive",
      })
    }
  }

  const handleDeleteSubmission = async (submissionId: string) => {
    if (!confirm('Are you sure you want to delete this image submission? This action cannot be undone.')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/image-submissions/${submissionId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Image submission deleted successfully",
        })
        loadSubmissions() // Reload the list
      } else {
        const error = await response.json()
        toast({
          title: "Error",
          description: error.error || "Failed to delete image submission",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error deleting image submission:', error)
      toast({
        title: "Error",
        description: "Failed to delete image submission",
        variant: "destructive",
      })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredSubmissions = submissions.filter(submission => {
    if (activeTab === 'pending') return submission.status === 'pending'
    if (activeTab === 'approved') return submission.status === 'approved'
    if (activeTab === 'rejected') return submission.status === 'rejected'
    return true
  })

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminHeader />
        <main className="py-8 px-4">
          <div className="container mx-auto max-w-7xl">
            <div className="text-center py-12">
              <LoadingSpinner size="lg" text="Loading image submissions..." />
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      <main className="py-8 px-4">
        <div className="container mx-auto max-w-7xl">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-2">
              <ImageIcon className="h-8 w-8 text-blue-600" />
              <h1 className="text-3xl font-bold text-gray-900">Product Image Submissions</h1>
            </div>
            <p className="text-gray-600">Manage and approve customer product image submissions</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                    <ImageIcon className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Pending Submissions</p>
                    <p className="text-2xl font-bold text-yellow-600">
                      {submissions.filter(s => s.status === 'pending').length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Approved Submissions</p>
                    <p className="text-2xl font-bold text-green-600">
                      {submissions.filter(s => s.status === 'approved').length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <XCircle className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Rejected Submissions</p>
                    <p className="text-2xl font-bold text-red-600">
                      {submissions.filter(s => s.status === 'rejected').length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <ImageIcon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Submissions</p>
                    <p className="text-2xl font-bold text-blue-600">{submissions.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Submissions List */}
          <Card>
            <CardHeader>
              <CardTitle>Image Submission Management</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="pending" className="flex items-center space-x-2">
                    <ImageIcon className="h-4 w-4" />
                    <span>Pending ({submissions.filter(s => s.status === 'pending').length})</span>
                  </TabsTrigger>
                  <TabsTrigger value="approved" className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4" />
                    <span>Approved ({submissions.filter(s => s.status === 'approved').length})</span>
                  </TabsTrigger>
                  <TabsTrigger value="rejected" className="flex items-center space-x-2">
                    <XCircle className="h-4 w-4" />
                    <span>Rejected ({submissions.filter(s => s.status === 'rejected').length})</span>
                  </TabsTrigger>
                  <TabsTrigger value="all" className="flex items-center space-x-2">
                    <Eye className="h-4 w-4" />
                    <span>All ({submissions.length})</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value={activeTab} className="mt-6">
                  {filteredSubmissions.length === 0 ? (
                    <div className="text-center py-12">
                      <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No Image Submissions</h3>
                      <p className="text-gray-600">
                        {activeTab === 'pending' && "No pending image submissions to approve"}
                        {activeTab === 'approved' && "No approved image submissions yet"}
                        {activeTab === 'rejected' && "No rejected image submissions"}
                        {activeTab === 'all' && "No image submissions found"}
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredSubmissions.map((submission) => (
                        <div key={submission.id} className="border border-gray-200 rounded-lg p-4 bg-white">
                          <div className="space-y-4">
                            {/* Submitted Image */}
                            <div className="relative">
                              <img
                                src={submission.image_url}
                                alt="User submitted product image"
                                className="w-full h-48 object-cover rounded-lg"
                              />
                              <Badge className={`absolute top-2 right-2 ${getStatusColor(submission.status)}`}>
                                {submission.status}
                              </Badge>
                            </div>

                            {/* Product Info */}
                            <div className="flex items-center space-x-3">
                              <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                {submission.product_image ? (
                                  <Image
                                    src={submission.product_image}
                                    alt={submission.product_name}
                                    width={48}
                                    height={48}
                                    className="object-cover w-full h-full"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center">
                                    <Package className="h-6 w-6 text-gray-400" />
                                  </div>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-gray-900 text-sm truncate">
                                  <Link href={`/product/${submission.product_id}`} className="hover:text-blue-600">
                                    {submission.product_name}
                                  </Link>
                                </h3>
                                <p className="text-xs text-gray-500">
                                  Submitted by {submission.user_username || submission.user_email}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {new Date(submission.created_at).toLocaleDateString()}
                                </p>
                              </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex space-x-2">
                              {submission.status === 'pending' && (
                                <>
                                  <Button
                                    onClick={() => handleSubmissionAction(submission.id, 'approve')}
                                    size="sm"
                                    className="bg-green-600 hover:bg-green-700 flex-1"
                                  >
                                    <Check className="h-4 w-4 mr-2" />
                                    Approve
                                  </Button>
                                  <Button
                                    onClick={() => handleSubmissionAction(submission.id, 'reject')}
                                    size="sm"
                                    variant="destructive"
                                    className="flex-1"
                                  >
                                    <X className="h-4 w-4 mr-2" />
                                    Reject
                                  </Button>
                                </>
                              )}
                              <Button
                                onClick={() => handleDeleteSubmission(submission.id)}
                                size="sm"
                                variant="outline"
                                className="border-red-200 text-red-600 hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
