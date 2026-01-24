"use client"

import { useState, useEffect } from "react"
import { AdminHeader } from "@/components/admin-header"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import { 
  Mail, 
  Search, 
  Plus, 
  RefreshCw, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Users,
  BarChart3,
  Settings,
  Loader2
} from "lucide-react"
import { Textarea } from "@/components/ui/textarea"

interface MailchimpStats {
  listStats: {
    listName: string
    totalSubscribers: number
    unsubscribeCount: number
    cleanedCount: number
    openRate: number
    clickRate: number
  }
  apiStats: {
    totalApiCalls: number
    rateLimitedCalls: number
    activeRateLimits: number
  }
  config: {
    hasApiKey: boolean
    hasServerPrefix: boolean
    hasListId: boolean
    serverPrefix: string
    listId: string
    apiKeyPrefix: string
  }
}

interface Subscriber {
  id: string
  email: string
  status: string
  mergeFields: any
  tags: string[]
}

interface RecentUser {
  id: string
  email: string
  first_name: string
  last_name: string
  created_at: string
  inMailchimp: boolean
  mailchimpStatus?: string
  mailchimpTags?: string[]
  mailchimpError?: string
}

export default function MailchimpAdminPage() {
  const { toast } = useToast()
  const [stats, setStats] = useState<MailchimpStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [testing, setTesting] = useState(false)
  const [lookingUp, setLookingUp] = useState(false)
  const [subscriber, setSubscriber] = useState<Subscriber | null>(null)
  const [recentUsers, setRecentUsers] = useState<RecentUser[]>([])
  const [loadingUsers, setLoadingUsers] = useState(false)

  // Test form state
  const [testForm, setTestForm] = useState({
    email: '',
    firstName: '',
    lastName: '',
    characterName: '',
    mainShard: '',
    source: 'admin-test',
    tags: ''
  })

  // Lookup form state
  const [lookupEmail, setLookupEmail] = useState('')

  useEffect(() => {
    loadStats()
    loadRecentUsers()
  }, [])

  const loadStats = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/mailchimp/stats', {
        cache: 'no-store'
      })
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      } else {
        const error = await response.json()
        toast({
          title: "Error",
          description: error.error || "Failed to load Mailchimp statistics",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error loading stats:', error)
      toast({
        title: "Error",
        description: "Failed to load Mailchimp statistics",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const loadRecentUsers = async () => {
    try {
      setLoadingUsers(true)
      const response = await fetch('/api/admin/mailchimp/recent-users?limit=20', {
        cache: 'no-store'
      })
      if (response.ok) {
        const data = await response.json()
        setRecentUsers(data.users || [])
      }
    } catch (error) {
      console.error('Error loading recent users:', error)
    } finally {
      setLoadingUsers(false)
    }
  }

  const handleTestAdd = async () => {
    if (!testForm.email) {
      toast({
        title: "Error",
        description: "Email is required",
        variant: "destructive",
      })
      return
    }

    try {
      setTesting(true)
      const response = await fetch('/api/admin/mailchimp/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testForm),
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Success",
          description: data.message || "Email added to Mailchimp successfully",
        })
        setTestForm({
          email: '',
          firstName: '',
          lastName: '',
          characterName: '',
          mainShard: '',
          source: 'admin-test',
          tags: ''
        })
        loadStats()
        loadRecentUsers()
      } else {
        toast({
          title: "Error",
          description: data.error || data.details || "Failed to add email to Mailchimp",
          variant: "destructive",
        })
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add email to Mailchimp",
        variant: "destructive",
      })
    } finally {
      setTesting(false)
    }
  }

  const handleLookup = async () => {
    if (!lookupEmail) {
      toast({
        title: "Error",
        description: "Email is required",
        variant: "destructive",
      })
      return
    }

    try {
      setLookingUp(true)
      const response = await fetch(`/api/admin/mailchimp/lookup?email=${encodeURIComponent(lookupEmail)}`, {
        cache: 'no-store'
      })

      const data = await response.json()

      if (response.ok) {
        if (data.found) {
          setSubscriber(data.subscriber)
          toast({
            title: "Found",
            description: "Subscriber found in Mailchimp",
          })
        } else {
          setSubscriber(null)
          toast({
            title: "Not Found",
            description: "Subscriber not found in Mailchimp",
            variant: "destructive",
          })
        }
      } else {
        toast({
          title: "Error",
          description: data.error || data.details || "Failed to lookup subscriber",
          variant: "destructive",
        })
        setSubscriber(null)
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to lookup subscriber",
        variant: "destructive",
      })
      setSubscriber(null)
    } finally {
      setLookingUp(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Mailchimp Integration</h1>
          <p className="text-gray-600">Test and debug Mailchimp email integration</p>
        </div>

        {/* Configuration Status */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Configuration Status
            </CardTitle>
            <CardDescription>Current Mailchimp API configuration</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
              </div>
            ) : stats ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2">
                    {stats.config.hasApiKey ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                    <span className="text-sm">API Key: {stats.config.apiKeyPrefix}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {stats.config.hasServerPrefix ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                    <span className="text-sm">Server: {stats.config.serverPrefix}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {stats.config.hasListId ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                    <span className="text-sm">List ID: {stats.config.listId}</span>
                  </div>
                </div>

                {!stats.config.hasApiKey || !stats.config.hasServerPrefix || !stats.config.hasListId ? (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Configuration Incomplete</AlertTitle>
                    <AlertDescription>
                      Some Mailchimp environment variables are missing. Please check your .env.local file.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertTitle>Configuration Complete</AlertTitle>
                    <AlertDescription>
                      All Mailchimp environment variables are configured.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            ) : (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Failed to Load</AlertTitle>
                <AlertDescription>
                  Could not load Mailchimp configuration. Check your API credentials.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* List Statistics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                List Statistics
              </CardTitle>
              <CardDescription>Current Mailchimp audience statistics</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                </div>
              ) : stats?.listStats ? (
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">List Name:</span>
                    <span className="font-semibold">{stats.listStats.listName}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total Subscribers:</span>
                    <Badge variant="default">{stats.listStats.totalSubscribers.toLocaleString()}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Unsubscribed:</span>
                    <span>{stats.listStats.unsubscribeCount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Cleaned:</span>
                    <span>{stats.listStats.cleanedCount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Open Rate:</span>
                    <span>{(stats.listStats.openRate * 100).toFixed(2)}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Click Rate:</span>
                    <span>{(stats.listStats.clickRate * 100).toFixed(2)}%</span>
                  </div>
                  <Button onClick={loadStats} variant="outline" size="sm" className="w-full mt-4">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh Stats
                  </Button>
                </div>
              ) : (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>Failed to load statistics</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* API Statistics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                API Statistics
              </CardTitle>
              <CardDescription>Rate limiting and API call statistics</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                </div>
              ) : stats?.apiStats ? (
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total API Calls:</span>
                    <Badge>{stats.apiStats.totalApiCalls}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Rate Limited Calls:</span>
                    <span>{stats.apiStats.rateLimitedCalls}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Active Rate Limits:</span>
                    <span>{stats.apiStats.activeRateLimits}</span>
                  </div>
                </div>
              ) : (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>Failed to load API statistics</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Test Add Email */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Test Add Email
              </CardTitle>
              <CardDescription>Add a test email to Mailchimp</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="test-email">Email *</Label>
                <Input
                  id="test-email"
                  type="email"
                  placeholder="test@example.com"
                  value={testForm.email}
                  onChange={(e) => setTestForm({ ...testForm, email: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="test-firstname">First Name</Label>
                  <Input
                    id="test-firstname"
                    placeholder="John"
                    value={testForm.firstName}
                    onChange={(e) => setTestForm({ ...testForm, firstName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="test-lastname">Last Name</Label>
                  <Input
                    id="test-lastname"
                    placeholder="Doe"
                    value={testForm.lastName}
                    onChange={(e) => setTestForm({ ...testForm, lastName: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="test-charactername">Character Name</Label>
                  <Input
                    id="test-charactername"
                    placeholder="Character"
                    value={testForm.characterName}
                    onChange={(e) => setTestForm({ ...testForm, characterName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="test-shard">Main Shard</Label>
                  <Input
                    id="test-shard"
                    placeholder="UO Forever"
                    value={testForm.mainShard}
                    onChange={(e) => setTestForm({ ...testForm, mainShard: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="test-source">Source</Label>
                <Input
                  id="test-source"
                  placeholder="admin-test"
                  value={testForm.source}
                  onChange={(e) => setTestForm({ ...testForm, source: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="test-tags">Tags (comma-separated)</Label>
                <Input
                  id="test-tags"
                  placeholder="test, admin, debug"
                  value={testForm.tags}
                  onChange={(e) => setTestForm({ ...testForm, tags: e.target.value })}
                />
              </div>
              <Button 
                onClick={handleTestAdd} 
                disabled={testing || !testForm.email}
                className="w-full"
              >
                {testing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Adding...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Add to Mailchimp
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Lookup Subscriber */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Lookup Subscriber
              </CardTitle>
              <CardDescription>Check if an email exists in Mailchimp</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="lookup-email">Email</Label>
                <div className="flex gap-2">
                  <Input
                    id="lookup-email"
                    type="email"
                    placeholder="user@example.com"
                    value={lookupEmail}
                    onChange={(e) => setLookupEmail(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleLookup()
                      }
                    }}
                  />
                  <Button 
                    onClick={handleLookup} 
                    disabled={lookingUp || !lookupEmail}
                  >
                    {lookingUp ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Search className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              {subscriber && (
                <div className="space-y-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2 text-green-700">
                    <CheckCircle className="h-5 w-5" />
                    <span className="font-semibold">Subscriber Found</span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium">Email:</span> {subscriber.email}
                    </div>
                    <div>
                      <span className="font-medium">Status:</span>{" "}
                      <Badge variant={subscriber.status === 'subscribed' ? 'default' : 'secondary'}>
                        {subscriber.status}
                      </Badge>
                    </div>
                    {subscriber.tags && subscriber.tags.length > 0 && (
                      <div>
                        <span className="font-medium">Tags:</span>{" "}
                        <div className="flex flex-wrap gap-1 mt-1">
                          {subscriber.tags.map((tag, idx) => (
                            <Badge key={idx} variant="outline">{tag}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    {subscriber.mergeFields && Object.keys(subscriber.mergeFields).length > 0 && (
                      <div>
                        <span className="font-medium">Merge Fields:</span>
                        <pre className="mt-1 p-2 bg-white rounded text-xs overflow-auto">
                          {JSON.stringify(subscriber.mergeFields, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {subscriber === null && lookupEmail && !lookingUp && (
                <Alert variant="destructive">
                  <XCircle className="h-4 w-4" />
                  <AlertDescription>Subscriber not found in Mailchimp</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Users with Mailchimp Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Recent Users & Mailchimp Status
            </CardTitle>
            <CardDescription>Check if recent user registrations made it to Mailchimp</CardDescription>
          </CardHeader>
          <CardContent>
            {loadingUsers ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
              </div>
            ) : (
              <div className="space-y-2">
                {recentUsers.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No users found</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-2">Email</th>
                          <th className="text-left p-2">Name</th>
                          <th className="text-left p-2">Created</th>
                          <th className="text-left p-2">Mailchimp Status</th>
                          <th className="text-left p-2">Tags</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentUsers.map((user) => (
                          <tr key={user.id} className="border-b">
                            <td className="p-2">{user.email}</td>
                            <td className="p-2">
                              {user.first_name} {user.last_name}
                            </td>
                            <td className="p-2">
                              {new Date(user.created_at).toLocaleDateString()}
                            </td>
                            <td className="p-2">
                              {user.inMailchimp ? (
                                <Badge variant="default" className="bg-green-500">
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  {user.mailchimpStatus || 'Subscribed'}
                                </Badge>
                              ) : (
                                <Badge variant="destructive">
                                  <XCircle className="h-3 w-3 mr-1" />
                                  Not Found
                                  {user.mailchimpError && (
                                    <span className="ml-1 text-xs">({user.mailchimpError})</span>
                                  )}
                                </Badge>
                              )}
                            </td>
                            <td className="p-2">
                              {user.mailchimpTags && user.mailchimpTags.length > 0 ? (
                                <div className="flex flex-wrap gap-1">
                                  {user.mailchimpTags.slice(0, 3).map((tag, idx) => (
                                    <Badge key={idx} variant="outline" className="text-xs">
                                      {tag}
                                    </Badge>
                                  ))}
                                  {user.mailchimpTags.length > 3 && (
                                    <Badge variant="outline" className="text-xs">
                                      +{user.mailchimpTags.length - 3}
                                    </Badge>
                                  )}
                                </div>
                              ) : (
                                <span className="text-gray-400">-</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                <Button 
                  onClick={loadRecentUsers} 
                  variant="outline" 
                  size="sm" 
                  className="w-full mt-4"
                  disabled={loadingUsers}
                >
                  {loadingUsers ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Refresh List
                    </>
                  )}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
