"use client"

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { Mail, Send, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'

export default function TestEmailPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  
  const [isLoading, setIsLoading] = useState(false)
  const [testResults, setTestResults] = useState<any[]>([])
  const [envInfo, setEnvInfo] = useState<any>(null)
  const [formData, setFormData] = useState({
    email: '',
    template: 'registration',
    customSubject: '',
    customMessage: ''
  })

  // Fetch environment information
  useEffect(() => {
    const fetchEnvInfo = async () => {
      try {
        const response = await fetch('/api/admin/email-status')
        if (response.ok) {
          const data = await response.json()
          setEnvInfo(data)
        }
      } catch (error) {
        console.error('Error fetching environment info:', error)
      }
    }

    if (session?.user?.isAdmin) {
      fetchEnvInfo()
    }
  }, [session])

  // Redirect if not admin
  if (status === 'loading') {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (!session?.user?.isAdmin) {
    router.push('/login')
    return null
  }

  const emailTemplates = [
    { value: 'registration', label: 'Welcome Email (Registration)', description: 'Sent to new users when they sign up' },
    { value: 'orderConfirmation', label: 'Order Confirmation', description: 'Sent when an order is placed' },
    { value: 'orderCompleted', label: 'Order Completed', description: 'Sent when order is ready for delivery' }
  ]

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const sendTestEmail = async () => {
    if (!formData.email) {
      toast({
        title: "Error",
        description: "Please enter an email address",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    setTestResults([])

    try {
      const response = await fetch('/api/admin/test-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          template: formData.template,
          customSubject: formData.customSubject,
          customMessage: formData.customMessage
        }),
      })

      const result = await response.json()

      if (response.ok) {
        setTestResults(prev => [...prev, {
          id: Date.now(),
          success: true,
          message: `Email sent successfully to ${formData.email}`,
          details: result,
          timestamp: new Date().toLocaleTimeString()
        }])
        
        toast({
          title: "Success",
          description: `Test email sent to ${formData.email}`,
          variant: "default",
        })
      } else {
        setTestResults(prev => [...prev, {
          id: Date.now(),
          success: false,
          message: `Failed to send email: ${result.error}`,
          details: result,
          timestamp: new Date().toLocaleTimeString()
        }])
        
        toast({
          title: "Error",
          description: result.error || "Failed to send test email",
          variant: "destructive",
        })
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      setTestResults(prev => [...prev, {
        id: Date.now(),
        success: false,
        message: `Network error: ${errorMessage}`,
        details: { error: errorMessage },
        timestamp: new Date().toLocaleTimeString()
      }])
      
      toast({
        title: "Error",
        description: "Network error occurred",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const sendAllTemplates = async () => {
    if (!formData.email) {
      toast({
        title: "Error",
        description: "Please enter an email address",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    setTestResults([])

    for (const template of emailTemplates) {
      try {
        const response = await fetch('/api/admin/test-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: formData.email,
            template: template.value,
            customSubject: '',
            customMessage: ''
          }),
        })

        const result = await response.json()

        setTestResults(prev => [...prev, {
          id: Date.now() + Math.random(),
          success: response.ok,
          message: `${template.label}: ${response.ok ? 'Sent' : 'Failed'}`,
          details: result,
          timestamp: new Date().toLocaleTimeString()
        }])

        // Small delay between emails
        await new Promise(resolve => setTimeout(resolve, 1000))
      } catch (error) {
        setTestResults(prev => [...prev, {
          id: Date.now() + Math.random(),
          success: false,
          message: `${template.label}: Network error`,
          details: { error: error instanceof Error ? error.message : 'Unknown error' },
          timestamp: new Date().toLocaleTimeString()
        }])
      }
    }

    setIsLoading(false)
    toast({
      title: "Complete",
      description: "All test emails sent",
      variant: "default",
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-100 p-6">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Resend Email Testing</h1>
          <p className="text-gray-600">Test your Resend email configuration and templates</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Test Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Test Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="email">Test Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="test@example.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="template">Email Template</Label>
                <Select value={formData.template} onValueChange={(value) => handleInputChange('template', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {emailTemplates.map((template) => (
                      <SelectItem key={template.value} value={template.value}>
                        <div>
                          <div className="font-medium">{template.label}</div>
                          <div className="text-sm text-gray-500">{template.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="customSubject">Custom Subject (Optional)</Label>
                <Input
                  id="customSubject"
                  placeholder="Leave empty to use template default"
                  value={formData.customSubject}
                  onChange={(e) => handleInputChange('customSubject', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="customMessage">Custom Message (Optional)</Label>
                <Textarea
                  id="customMessage"
                  placeholder="Leave empty to use template default"
                  value={formData.customMessage}
                  onChange={(e) => handleInputChange('customMessage', e.target.value)}
                  rows={3}
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button 
                  onClick={sendTestEmail} 
                  disabled={isLoading}
                  className="flex-1"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4 mr-2" />
                  )}
                  Send Test Email
                </Button>
                
                <Button 
                  onClick={sendAllTemplates} 
                  disabled={isLoading}
                  variant="outline"
                >
                  Test All Templates
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Test Results */}
          <Card>
            <CardHeader>
              <CardTitle>Test Results</CardTitle>
            </CardHeader>
            <CardContent>
              {testResults.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  <Mail className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No test results yet</p>
                  <p className="text-sm">Send a test email to see results here</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {testResults.map((result) => (
                    <div
                      key={result.id}
                      className={`p-3 rounded-lg border ${
                        result.success 
                          ? 'bg-green-50 border-green-200' 
                          : 'bg-red-50 border-red-200'
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        {result.success ? (
                          <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                        ) : (
                          <AlertCircle className="h-4 w-4 text-red-600 mt-0.5" />
                        )}
                        <div className="flex-1">
                          <p className={`text-sm font-medium ${
                            result.success ? 'text-green-800' : 'text-red-800'
                          }`}>
                            {result.message}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {result.timestamp}
                          </p>
                          {result.details && (
                            <details className="mt-2">
                              <summary className="text-xs text-gray-600 cursor-pointer">
                                View Details
                              </summary>
                              <pre className="text-xs bg-gray-100 p-2 rounded mt-1 overflow-x-auto">
                                {JSON.stringify(result.details, null, 2)}
                              </pre>
                            </details>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Environment Info */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Environment Information</CardTitle>
          </CardHeader>
                     <CardContent>
             {envInfo ? (
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                 <div>
                   <strong>Resend API Key:</strong> 
                   <span className={`ml-2 ${envInfo.resendConfigured ? 'text-green-600' : 'text-red-600'}`}>
                     {envInfo.resendConfigured ? `Configured (${envInfo.resendApiKeyLength} chars)` : 'Not configured'}
                   </span>
                 </div>
                 <div>
                   <strong>From Email:</strong> 
                   <span className="ml-2 text-gray-600">{envInfo.fromEmail}</span>
                 </div>
                 <div>
                   <strong>Environment:</strong> 
                   <span className="ml-2 text-gray-600">{envInfo.environment}</span>
                 </div>
                 <div>
                   <strong>Base URL:</strong> 
                   <span className="ml-2 text-gray-600">{envInfo.baseUrl}</span>
                 </div>
               </div>
             ) : (
               <div className="text-center text-gray-500 py-4">
                 <Loader2 className="h-4 w-4 mx-auto animate-spin" />
                 <p className="mt-2">Loading environment info...</p>
               </div>
             )}
           </CardContent>
        </Card>
      </div>
    </div>
  )
}
