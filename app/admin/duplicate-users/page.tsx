"use client"

import { useState, useEffect } from "react"
import { AdminHeader } from "@/components/admin-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Users, 
  AlertTriangle, 
  Trash2, 
  CheckCircle,
  Clock,
  Mail
} from "lucide-react"

interface DuplicateUser {
  email: string
  userCount: number
  users: Array<{
    id: string
    email: string
    username: string
    first_name: string
    last_name: string
    created_at: string
    status: string
    is_admin: boolean
    last_login_at?: string
    discord_username?: string
    main_shard?: string
    character_names?: string[]
  }>
}

export default function DuplicateUsersPage() {
  const [duplicates, setDuplicates] = useState<DuplicateUser[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCleaning, setIsCleaning] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadDuplicates()
  }, [])

  const loadDuplicates = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/admin/check-duplicate-emails')
      const data = await response.json()
      
      if (data.success) {
        setDuplicates(data.duplicates)
      } else {
        setError(data.error || 'Failed to load duplicates')
      }
    } catch (error) {
      setError('Failed to load duplicate users')
    } finally {
      setIsLoading(false)
    }
  }

  const cleanupDuplicates = async (email: string, keepUserId: string) => {
    try {
      setIsCleaning(email)
      const response = await fetch('/api/admin/cleanup-duplicate-users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, keepUserId })
      })
      
      const data = await response.json()
      
      if (data.success) {
        // Reload duplicates
        await loadDuplicates()
      } else {
        setError(data.error || 'Failed to cleanup duplicates')
      }
    } catch (error) {
      setError('Failed to cleanup duplicate users')
    } finally {
      setIsCleaning(null)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminHeader />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Loading duplicate users...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Duplicate Users</h1>
          <p className="text-gray-600">
            Users with duplicate email addresses. Keep the most recent user and remove older duplicates.
          </p>
        </div>

        {error && (
          <Alert className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {duplicates.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Duplicate Users Found</h3>
              <p className="text-gray-600">All user emails are unique.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {duplicates.map((duplicate) => (
              <Card key={duplicate.email}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="h-5 w-5" />
                    {duplicate.email}
                    <Badge variant="destructive">{duplicate.userCount} users</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {duplicate.users.map((user, index) => (
                      <div 
                        key={user.id} 
                        className={`p-4 border rounded-lg ${
                          index === 0 
                            ? 'border-green-500 bg-green-50' 
                            : 'border-red-200 bg-red-50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-semibold">
                                {user.first_name} {user.last_name}
                              </span>
                              <Badge variant={index === 0 ? "default" : "destructive"}>
                                {index === 0 ? "KEEP (Most Recent)" : "REMOVE"}
                              </Badge>
                              {user.is_admin && (
                                <Badge variant="outline">Admin</Badge>
                              )}
                            </div>
                            <div className="text-sm text-gray-600 space-y-1">
                              <div>Username: {user.username}</div>
                              <div>Created: {formatDate(user.created_at)}</div>
                              <div>Status: {user.status}</div>
                              {user.discord_username && (
                                <div>Discord: {user.discord_username}</div>
                              )}
                              {user.main_shard && (
                                <div>Shard: {user.main_shard}</div>
                              )}
                              {user.character_names && user.character_names.length > 0 && (
                                <div>Characters: {user.character_names.join(', ')}</div>
                              )}
                            </div>
                          </div>
                          {index === 0 && (
                            <Button
                              onClick={() => cleanupDuplicates(duplicate.email, user.id)}
                              disabled={isCleaning === duplicate.email}
                              className="ml-4"
                            >
                              {isCleaning === duplicate.email ? (
                                <>
                                  <Clock className="h-4 w-4 mr-2 animate-spin" />
                                  Cleaning...
                                </>
                              ) : (
                                <>
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Cleanup Duplicates
                                </>
                              )}
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
