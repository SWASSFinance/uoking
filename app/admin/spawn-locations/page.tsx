"use client"

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { 
  MapPin, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Eye,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { Label } from '@/components/ui/label'

interface Submission {
  id: string
  product_name: string
  product_slug: string
  user_username: string
  user_email: string
  spawn_location: string
  description?: string
  coordinates?: string
  shard?: string
  status: 'pending' | 'approved' | 'rejected'
  review_notes?: string
  created_at: string
  points_awarded?: number
}

export default function SpawnLocationsAdminPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [currentStatus, setCurrentStatus] = useState<'pending' | 'approved' | 'rejected'>('pending')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [reviewNotes, setReviewNotes] = useState('')
  const [isReviewing, setIsReviewing] = useState(false)

  // Redirect if not admin
  useEffect(() => {
    if (status === 'loading') return
    if (!session?.user?.isAdmin) {
      router.push('/')
    }
  }, [session, status, router])

  // Load submissions
  useEffect(() => {
    if (session?.user?.isAdmin) {
      loadSubmissions()
    }
  }, [session, currentStatus, currentPage])

  const loadSubmissions = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(
        `/api/admin/spawn-locations?status=${currentStatus}&page=${currentPage}`
      )
      
      if (response.ok) {
        const data = await response.json()
        setSubmissions(data.submissions)
        setTotalPages(data.pagination.totalPages)
      } else {
        toast({
          title: "Error",
          description: "Failed to load submissions.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error loading submissions:', error)
      toast({
        title: "Error",
        description: "Failed to load submissions.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleReview = async (submissionId: string, status: 'approved' | 'rejected') => {
    setIsReviewing(true)
    
    try {
      const response = await fetch(`/api/admin/spawn-locations/${submissionId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status,
          reviewNotes: reviewNotes.trim() || null,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Success",
          description: data.message,
        })
        
        // Refresh submissions
        await loadSubmissions()
        setSelectedSubmission(null)
        setReviewNotes('')
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to review submission.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error reviewing submission:', error)
      toast({
        title: "Error",
        description: "An error occurred while reviewing the submission.",
        variant: "destructive",
      })
    } finally {
      setIsReviewing(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-500" />
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />
      default:
        return <MapPin className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800">Unknown</Badge>
    }
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!session?.user?.isAdmin) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Spawn Location Submissions</h1>
          <p className="text-gray-600">Review and manage user-submitted spawn locations</p>
        </div>

        {/* Status Filter */}
        <div className="mb-6">
          <div className="flex space-x-2">
            {(['pending', 'approved', 'rejected'] as const).map((status) => (
              <Button
                key={status}
                variant={currentStatus === status ? 'default' : 'outline'}
                onClick={() => {
                  setCurrentStatus(status)
                  setCurrentPage(1)
                }}
                className="capitalize"
              >
                {getStatusIcon(status)}
                <span className="ml-2">{status}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Submissions List */}
        <div className="grid gap-4">
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading submissions...</p>
            </div>
          ) : submissions.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No {currentStatus} submissions found.</p>
              </CardContent>
            </Card>
          ) : (
            submissions.map((submission) => (
              <Card key={submission.id} className="bg-white/90 backdrop-blur-sm border-amber-200">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {submission.product_name}
                        </h3>
                        {getStatusBadge(submission.status)}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-gray-600">Submitted by:</span>
                          <p className="text-gray-900">{submission.user_username}</p>
                          <p className="text-gray-500">{submission.user_email}</p>
                        </div>
                        
                        <div>
                          <span className="font-medium text-gray-600">Spawn Location:</span>
                          <p className="text-gray-900">{submission.spawn_location}</p>
                        </div>
                        
                        {submission.description && (
                          <div>
                            <span className="font-medium text-gray-600">Description:</span>
                            <p className="text-gray-900">{submission.description}</p>
                          </div>
                        )}
                        
                        <div>
                          <span className="font-medium text-gray-600">Submitted:</span>
                          <p className="text-gray-900">
                            {new Date(submission.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        
                        {submission.coordinates && (
                          <div>
                            <span className="font-medium text-gray-600">Coordinates:</span>
                            <p className="text-gray-900">{submission.coordinates}</p>
                          </div>
                        )}
                        
                        {submission.shard && (
                          <div>
                            <span className="font-medium text-gray-600">Shard:</span>
                            <p className="text-gray-900">{submission.shard}</p>
                          </div>
                        )}
                      </div>
                      
                      {submission.points_awarded && (
                        <div className="mt-2">
                          <Badge className="bg-green-100 text-green-800">
                            {submission.points_awarded} points awarded
                          </Badge>
                        </div>
                      )}
                    </div>
                    
                    <div className="ml-4">
                      {submission.status === 'pending' && (
                        <Button
                          size="sm"
                          onClick={() => setSelectedSubmission(submission)}
                          className="bg-amber-600 hover:bg-amber-700"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Review
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center space-x-2 mt-6">
            <Button
              variant="outline"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <span className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </span>
            
            <Button
              variant="outline"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Review Modal */}
        {selectedSubmission && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <CardTitle>Review Submission</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h3 className="font-semibold">{selectedSubmission.product_name}</h3>
                  <p className="text-sm text-gray-600">
                    Submitted by {selectedSubmission.user_username} on{' '}
                    {new Date(selectedSubmission.created_at).toLocaleDateString()}
                  </p>
                </div>
                
                <div className="space-y-2">
                  <span className="font-medium text-gray-600">Spawn Location:</span>
                  <p className="text-gray-900">{selectedSubmission.spawn_location}</p>
                </div>
                
                {selectedSubmission.description && (
                  <div className="space-y-2">
                    <span className="font-medium text-gray-600">Description:</span>
                    <p className="text-gray-900">{selectedSubmission.description}</p>
                  </div>
                )}
                
                {selectedSubmission.coordinates && (
                  <div className="space-y-2">
                    <span className="font-medium text-gray-600">Coordinates:</span>
                    <p className="text-gray-900">{selectedSubmission.coordinates}</p>
                  </div>
                )}
                
                {selectedSubmission.shard && (
                  <div className="space-y-2">
                    <span className="font-medium text-gray-600">Shard:</span>
                    <p className="text-gray-900">{selectedSubmission.shard}</p>
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="reviewNotes" className="text-gray-700 font-medium">
                    Review Notes (Optional)
                  </Label>
                  <Textarea
                    id="reviewNotes"
                    value={reviewNotes}
                    onChange={(e) => setReviewNotes(e.target.value)}
                    placeholder="Add any notes about your decision..."
                    rows={3}
                  />
                </div>
                
                <div className="flex space-x-2">
                  <Button
                    onClick={() => handleReview(selectedSubmission.id, 'approved')}
                    disabled={isReviewing}
                    className="bg-green-600 hover:bg-green-700 flex-1"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve (+20 points)
                  </Button>
                  <Button
                    onClick={() => handleReview(selectedSubmission.id, 'rejected')}
                    disabled={isReviewing}
                    variant="outline"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 flex-1"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                  <Button
                    onClick={() => {
                      setSelectedSubmission(null)
                      setReviewNotes('')
                    }}
                    variant="outline"
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
