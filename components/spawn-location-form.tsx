"use client"

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { MapPin, CheckCircle, Clock, XCircle } from 'lucide-react'

interface SpawnLocationFormProps {
  productId: string
  productName: string
  currentSpawnLocation?: string
}

interface Submission {
  id: string
  status: 'pending' | 'approved' | 'rejected'
  spawn_location: string
  description?: string
  coordinates?: string
  review_notes?: string
  created_at: string
  points_awarded?: number
}

export function SpawnLocationForm({ productId, productName, currentSpawnLocation }: SpawnLocationFormProps) {
  const { data: session } = useSession()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submission, setSubmission] = useState<Submission | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    spawnLocation: '',
    description: '',
    coordinates: ''
  })

  // Check for existing submission
  useEffect(() => {
    if (session?.user?.id) {
      checkExistingSubmission()
    }
  }, [session, productId])

  const checkExistingSubmission = async () => {
    try {
      const response = await fetch(`/api/spawn-locations?productId=${productId}`)
      if (response.ok) {
        const data = await response.json()
        setSubmission(data.submission)
      }
    } catch (error) {
      console.error('Error checking existing submission:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!session?.user?.id) {
      toast({
        title: "Authentication Required",
        description: "Please log in to submit spawn locations.",
        variant: "destructive",
      })
      return
    }

    if (!formData.spawnLocation.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide a spawn location.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/spawn-locations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId,
          spawnLocation: formData.spawnLocation.trim(),
          description: formData.description.trim() || null,
          coordinates: formData.coordinates.trim() || null,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Success!",
          description: data.message,
        })
        
        // Refresh submission data
        await checkExistingSubmission()
        
        // Reset form
        setFormData({
          spawnLocation: '',
          description: '',
          coordinates: ''
        })
        setShowForm(false)
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to submit spawn location.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error submitting spawn location:', error)
      toast({
        title: "Error",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-500" />
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />
      default:
        return <MapPin className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved':
        return 'Approved'
      case 'rejected':
        return 'Rejected'
      case 'pending':
        return 'Under Review'
      default:
        return 'Unknown'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'text-green-600 bg-green-50 border-green-200'
      case 'rejected':
        return 'text-red-600 bg-red-50 border-red-200'
      case 'pending':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  // If there's already a spawn location for this product, don't show the form
  // Handle NULL values from database (they come as "NULL" string)
  if (currentSpawnLocation && currentSpawnLocation !== "NULL" && currentSpawnLocation.trim() !== "") {
    return null
  }

  // If user has an existing submission, show status
  if (submission) {
    return (
      <Card className="bg-white/90 backdrop-blur-sm border-amber-200">
        <CardHeader>
          <CardTitle className="text-lg flex items-center space-x-2">
            <MapPin className="h-5 w-5" />
            <span>Your Spawn Location Submission</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`p-4 rounded-lg border ${getStatusColor(submission.status)}`}>
            <div className="flex items-center space-x-2 mb-3">
              {getStatusIcon(submission.status)}
              <span className="font-medium">{getStatusText(submission.status)}</span>
            </div>
            
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-medium">Location:</span> {submission.spawn_location}
              </div>
              {submission.description && (
                <div>
                  <span className="font-medium">Description:</span> {submission.description}
                </div>
              )}
                             {submission.coordinates && (
                 <div>
                   <span className="font-medium">Coordinates:</span> {submission.coordinates}
                 </div>
               )}
              {submission.points_awarded && (
                <div className="text-green-600 font-medium">
                  <span>Points Awarded:</span> {submission.points_awarded}
                </div>
              )}
              {submission.review_notes && (
                <div>
                  <span className="font-medium">Review Notes:</span> {submission.review_notes}
                </div>
              )}
              <div className="text-gray-500">
                Submitted: {new Date(submission.created_at).toLocaleDateString()}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Show submission form or add button
  return (
    <Card className="bg-white/90 backdrop-blur-sm border-amber-200">
      <CardHeader>
        <CardTitle className="text-lg flex items-center space-x-2">
          <MapPin className="h-5 w-5" />
          <span>Spawn Location</span>
        </CardTitle>
        <p className="text-sm text-gray-600">
          Help other players by submitting spawn location information for {productName}. 
          If approved, you'll earn 20 points!
        </p>
      </CardHeader>
      <CardContent>
        {!showForm ? (
          session ? (
            <Button 
              onClick={() => setShowForm(true)}
              className="w-full bg-amber-600 hover:bg-amber-700"
            >
              <MapPin className="h-4 w-4 mr-2" />
              Add Spawn Location
            </Button>
          ) : (
            <div className="text-center space-y-3">
              <p className="text-sm text-gray-500">Please log in to submit spawn locations.</p>
              <Button asChild className="w-full bg-amber-600 hover:bg-amber-700">
                <Link href="/login">Log In to Submit</Link>
              </Button>
            </div>
          )
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="spawnLocation" className="text-gray-700 font-medium">
                Spawn Location *
              </Label>
              <Input
                id="spawnLocation"
                value={formData.spawnLocation}
                onChange={(e) => setFormData({ ...formData, spawnLocation: e.target.value })}
                placeholder="e.g., Britannia, Yew, or specific coordinates"
                className="mt-1"
                required
              />
            </div>

            <div>
              <Label htmlFor="description" className="text-gray-700 font-medium">
                Description
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Additional details about the spawn location, conditions, or tips"
                className="mt-1"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="coordinates" className="text-gray-700 font-medium">
                Coordinates (Optional)
              </Label>
              <Input
                id="coordinates"
                value={formData.coordinates}
                onChange={(e) => setFormData({ ...formData, coordinates: e.target.value })}
                placeholder="e.g., 123, 456"
                className="mt-1"
              />
            </div>

            <div className="flex space-x-2">
              <Button 
                type="submit" 
                disabled={isSubmitting || !formData.spawnLocation.trim()}
                className="flex-1 bg-amber-600 hover:bg-amber-700"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Spawn Location'}
              </Button>
              <Button 
                type="button"
                variant="outline"
                onClick={() => {
                  setShowForm(false)
                  setFormData({
                    spawnLocation: '',
                    description: '',
                    coordinates: ''
                  })
                }}
              >
                Cancel
              </Button>
            </div>

            <div className="text-xs text-gray-500 text-center">
              Your submission will be reviewed by our team. If approved, you'll receive 20 points!
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  )
}
