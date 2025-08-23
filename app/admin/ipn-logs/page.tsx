'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Eye, RotateCcw, AlertCircle, CheckCircle, XCircle } from 'lucide-react'

interface IPNLog {
  id: string
  payment_status: string
  txn_id: string
  receiver_email: string
  custom: string
  mc_gross: string
  mc_currency: string
  verification_status: string
  processing_status: string
  error_message: string
  order_id: string
  order_status: string
  received_at: string
  processed_at: string
  raw_body: string
  headers: any
  user_agent: string
  ip_address: string
}

export default function IPNLogsPage() {
  const [logs, setLogs] = useState<IPNLog[]>([])
  const [loading, setLoading] = useState(true)
  const [replaying, setReplaying] = useState<string | null>(null)
  const [selectedLog, setSelectedLog] = useState<IPNLog | null>(null)
  const [filters, setFilters] = useState({
    status: '',
    txnId: '',
    orderId: '',
    limit: '50'
  })
  const [pagination, setPagination] = useState({
    total: 0,
    limit: 50,
    offset: 0
  })

  const fetchLogs = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        limit: filters.limit,
        offset: pagination.offset.toString(),
        ...(filters.status && { status: filters.status }),
        ...(filters.txnId && { txn_id: filters.txnId }),
        ...(filters.orderId && { order_id: filters.orderId })
      })

      const response = await fetch(`/api/admin/ipn-logs?${params}`)
      const data = await response.json()

      if (response.ok) {
        setLogs(data.logs)
        setPagination(data.pagination)
      } else {
        console.error('Failed to fetch logs:', data.error)
      }
    } catch (error) {
      console.error('Error fetching logs:', error)
    } finally {
      setLoading(false)
    }
  }

  const replayIPN = async (ipnLogId: string) => {
    setReplaying(ipnLogId)
    try {
      const response = await fetch('/api/admin/ipn-logs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ipnLogId })
      })

      const result = await response.json()
      
      if (response.ok) {
        alert('IPN replayed successfully! Check the logs for the new entry.')
        fetchLogs() // Refresh the logs
      } else {
        alert(`Failed to replay IPN: ${result.error}`)
      }
    } catch (error) {
      console.error('Error replaying IPN:', error)
      alert('Failed to replay IPN')
    } finally {
      setReplaying(null)
    }
  }

  useEffect(() => {
    fetchLogs()
  }, [filters, pagination.offset])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />
      case 'pending':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      success: 'default',
      error: 'destructive',
      pending: 'secondary',
      verified: 'default',
      failed: 'destructive'
    }

    return (
      <Badge variant={variants[status] || 'outline'}>
        {status}
      </Badge>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">PayPal IPN Logs</h1>
        <Button onClick={fetchLogs} disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Refresh'}
        </Button>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="status">Processing Status</Label>
              <Select value={filters.status} onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="success">Success</SelectItem>
                  <SelectItem value="error">Error</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="txnId">Transaction ID</Label>
              <Input
                id="txnId"
                placeholder="PayPal transaction ID"
                value={filters.txnId}
                onChange={(e) => setFilters(prev => ({ ...prev, txnId: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="orderId">Order ID</Label>
              <Input
                id="orderId"
                placeholder="Order ID"
                value={filters.orderId}
                onChange={(e) => setFilters(prev => ({ ...prev, orderId: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="limit">Limit</Label>
              <Select value={filters.limit} onValueChange={(value) => setFilters(prev => ({ ...prev, limit: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Logs Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            IPN Logs ({pagination.total} total)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : logs.length === 0 ? (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>No IPN logs found.</AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-4">
              {logs.map((log) => (
                <Card key={log.id} className="p-4">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(log.processing_status)}
                      <span className="font-mono text-sm">{log.id.substring(0, 8)}...</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(log.verification_status)}
                      {getStatusBadge(log.processing_status)}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <Label className="text-xs text-gray-500">Transaction ID</Label>
                      <p className="font-mono text-sm">{log.txn_id || 'N/A'}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500">Order ID</Label>
                      <p className="font-mono text-sm">{log.custom || 'N/A'}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500">Amount</Label>
                      <p className="font-mono text-sm">{log.mc_gross} {log.mc_currency}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <Label className="text-xs text-gray-500">Payment Status</Label>
                      <p className="text-sm">{log.payment_status}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500">Received At</Label>
                      <p className="text-sm">{new Date(log.received_at).toLocaleString()}</p>
                    </div>
                  </div>

                  {log.error_message && (
                    <Alert className="mb-4">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription className="font-mono text-sm">
                        {log.error_message}
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>IPN Log Details</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label>Raw IPN Body</Label>
                            <Textarea
                              value={log.raw_body}
                              readOnly
                              className="font-mono text-xs h-32"
                            />
                          </div>
                          <div>
                            <Label>Headers</Label>
                            <Textarea
                              value={JSON.stringify(log.headers, null, 2)}
                              readOnly
                              className="font-mono text-xs h-32"
                            />
                          </div>
                          <div>
                            <Label>User Agent</Label>
                            <p className="text-sm font-mono">{log.user_agent}</p>
                          </div>
                          <div>
                            <Label>IP Address</Label>
                            <p className="text-sm font-mono">{log.ip_address}</p>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => replayIPN(log.id)}
                      disabled={replaying === log.id}
                    >
                      {replaying === log.id ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <RotateCcw className="h-4 w-4 mr-2" />
                      )}
                      Replay IPN
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Pagination */}
          {pagination.total > pagination.limit && (
            <div className="flex justify-between items-center mt-6">
              <Button
                variant="outline"
                onClick={() => setPagination(prev => ({ ...prev, offset: Math.max(0, prev.offset - prev.limit) }))}
                disabled={pagination.offset === 0}
              >
                Previous
              </Button>
              <span className="text-sm text-gray-500">
                {pagination.offset + 1} - {Math.min(pagination.offset + pagination.limit, pagination.total)} of {pagination.total}
              </span>
              <Button
                variant="outline"
                onClick={() => setPagination(prev => ({ ...prev, offset: prev.offset + prev.limit }))}
                disabled={pagination.offset + pagination.limit >= pagination.total}
              >
                Next
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
