"use client"

import { useState, useEffect } from "react"
import { useSession, signOut } from "next-auth/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  RefreshCw, 
  AlertTriangle, 
  CheckCircle,
  User,
  Mail,
  Database
} from "lucide-react"

interface DebugData {
  session: {
    email: string
    id: string
    username: string
    firstName: string
    lastName: string
    isAdmin: boolean
    status: string
  }
  allUsersWithEmail: Array<{
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
  sessionCallbackResult: any
  validateSessionResult: any
  timestamp: string
}

export default function DebugSessionPage() {
  const { data: session, status } = useSession()
  const [debugData, setDebugData] = useState<DebugData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadDebugData = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const response = await fetch('/api/debug-session')
      const data = await response.json()
      
      if (data.error) {
        setError(data.error)
      } else {
        setDebugData(data)
      }
    } catch (error) {
      setError('Failed to load debug data')
    } finally {
      setIsLoading(false)
    }
  }

  const forceSessionRefresh = async () => {
    try {
      const response = await fetch('/api/force-session-refresh', {
        method: 'POST'
      })
      const data = await response.json()
      
      if (data.success) {
        // Sign out and redirect to login
        await signOut({ callbackUrl: '/login' })
      } else {
        setError(data.error || 'Failed to refresh session')
      }
    } catch (error) {
      setError('Failed to refresh session')
    }
  }

  useEffect(() => {
    if (status === 'authenticated') {
      loadDebugData()
    }
  }, [status])

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">Loading session debug...</div>
      </div>
    )
  }

  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Not Authenticated</h3>
            <p className="text-gray-600 mb-4">Please log in to debug your session.</p>
            <Button onClick={() => window.location.href = '/login'}>
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Session Debug</h1>
          <p className="text-gray-600">
            Debug information about your current session and user data.
          </p>
        </div>

        {error && (
          <Alert className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid gap-6">
          {/* Current Session */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Current Session (Client-side)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div><strong>Email:</strong> {session?.user?.email}</div>
                <div><strong>ID:</strong> {session?.user?.id}</div>
                <div><strong>Username:</strong> {session?.user?.username}</div>
                <div><strong>Name:</strong> {session?.user?.firstName} {session?.user?.lastName}</div>
                <div><strong>Admin:</strong> {session?.user?.isAdmin ? 'Yes' : 'No'}</div>
                <div><strong>Status:</strong> {session?.user?.status}</div>
              </div>
            </CardContent>
          </Card>

          {/* Debug Data */}
          {debugData && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    Database Users with This Email
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {debugData.allUsersWithEmail.map((user, index) => (
                      <div 
                        key={user.id} 
                        className={`p-4 border rounded-lg ${
                          index === 0 
                            ? 'border-green-500 bg-green-50' 
                            : 'border-gray-200 bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="font-semibold">
                            {user.first_name} {user.last_name}
                          </div>
                          <Badge variant={index === 0 ? "default" : "secondary"}>
                            {index === 0 ? "Most Recent" : "Older"}
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-600 space-y-1">
                          <div><strong>ID:</strong> {user.id}</div>
                          <div><strong>Username:</strong> {user.username}</div>
                          <div><strong>Created:</strong> {new Date(user.created_at).toLocaleString()}</div>
                          <div><strong>Status:</strong> {user.status}</div>
                          <div><strong>Admin:</strong> {user.is_admin ? 'Yes' : 'No'}</div>
                          {user.discord_username && (
                            <div><strong>Discord:</strong> {user.discord_username}</div>
                          )}
                          {user.main_shard && (
                            <div><strong>Shard:</strong> {user.main_shard}</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Session Callback Result</CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
                    {JSON.stringify(debugData.sessionCallbackResult, null, 2)}
                  </pre>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>ValidateSession Result</CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
                    {JSON.stringify(debugData.validateSessionResult, null, 2)}
                  </pre>
                </CardContent>
              </Card>
            </>
          )}

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                onClick={loadDebugData} 
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Loading Debug Data...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh Debug Data
                  </>
                )}
              </Button>
              
              <Button 
                onClick={forceSessionRefresh}
                variant="outline"
                className="w-full"
              >
                Force Session Refresh
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
