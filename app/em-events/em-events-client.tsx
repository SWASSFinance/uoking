'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, MapPin, Calendar, RefreshCw, Globe, AlertCircle } from "lucide-react"

interface Event {
  title: string
  time: string
  summary: string
  desc: string
  localTime?: string
  timezone?: string
}

export default function EMEventsClient() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [userTimezone, setUserTimezone] = useState<string>('UTC')
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  // Get user's timezone on component mount
  useEffect(() => {
    const getUserTimezone = async () => {
      try {
        const response = await fetch('https://ipapi.co/json/')
        const data = await response.json()
        setUserTimezone(data.timezone || 'UTC')
      } catch (error) {
        console.log('Could not detect timezone, using UTC')
        setUserTimezone('UTC')
      }
    }

    getUserTimezone()
  }, [])

  const fetchEvents = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/em-events')
      if (!response.ok) {
        throw new Error('Failed to fetch events')
      }
      
      const data = await response.json()
      setEvents(data.events || [])
      setLastUpdated(new Date())
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch events')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEvents()
  }, [])

  const formatLocalTime = (utcTime: string) => {
    try {
      const date = new Date(utcTime)
      return date.toLocaleString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        timeZoneName: 'short'
      })
    } catch (error) {
      return utcTime
    }
  }

  const getTimeUntilEvent = (eventTime: string) => {
    try {
      const eventDate = new Date(eventTime)
      const now = new Date()
      const diff = eventDate.getTime() - now.getTime()
      
      if (diff < 0) {
        return 'Event has passed'
      }
      
      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      
      if (days > 0) {
        return `${days}d ${hours}h ${minutes}m`
      } else if (hours > 0) {
        return `${hours}h ${minutes}m`
      } else {
        return `${minutes}m`
      }
    } catch (error) {
      return 'Time unavailable'
    }
  }

  const isEventUpcoming = (eventTime: string) => {
    try {
      const eventDate = new Date(eventTime)
      const now = new Date()
      return eventDate.getTime() > now.getTime()
    } catch (error) {
      return false
    }
  }

  const isEventToday = (eventTime: string) => {
    try {
      const eventDate = new Date(eventTime)
      const now = new Date()
      return eventDate.toDateString() === now.toDateString()
    } catch (error) {
      return false
    }
  }

  const isEventThisWeek = (eventTime: string) => {
    try {
      const eventDate = new Date(eventTime)
      const now = new Date()
      const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
      return eventDate.getTime() <= weekFromNow.getTime() && eventDate.getTime() > now.getTime()
    } catch (error) {
      return false
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
      <main className="py-16 px-4">
        <div className="container mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <Calendar className="h-16 w-16 text-amber-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              EM Event Schedule
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Stay updated with the latest Event Master events and schedules. 
              All times are converted to your local timezone.
            </p>
          </div>

          {/* Timezone Info */}
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 mb-8 shadow-sm border border-amber-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-amber-600" />
                <span className="text-sm text-gray-600">
                  Your timezone: <span className="font-medium">{userTimezone}</span>
                </span>
              </div>
              <div className="flex items-center gap-4">
                {lastUpdated && (
                  <span className="text-xs text-gray-500">
                    Last updated: {lastUpdated.toLocaleTimeString()}
                  </span>
                )}
                <Button 
                  size="sm"
                  onClick={fetchEvents}
                  disabled={loading}
                  className="bg-amber-600 hover:bg-amber-700"
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
              </div>
            </div>
          </div>

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-red-500" />
                <span className="text-red-700">{error}</span>
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="text-center py-12">
              <RefreshCw className="h-8 w-8 text-amber-600 animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Loading events...</p>
            </div>
          )}

          {/* Events Grid */}
          {!loading && !error && (
            <div className="space-y-6">
              {events.length > 0 ? (
                events.map((event, index) => {
                  const localTime = formatLocalTime(event.time)
                  const timeUntil = getTimeUntilEvent(event.time)
                  const isUpcoming = isEventUpcoming(event.time)
                  const isToday = isEventToday(event.time)
                  const isThisWeek = isEventThisWeek(event.time)

                  return (
                    <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-amber-200 bg-white/90 backdrop-blur-sm">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-xl font-semibold text-gray-800 group-hover:text-amber-600 transition-colors">
                              {event.title}
                            </CardTitle>
                            <div className="flex items-center gap-4 mt-2">
                              <div className="flex items-center gap-1 text-sm text-gray-600">
                                <Clock className="h-4 w-4" />
                                <span>{localTime}</span>
                              </div>
                              {event.summary && event.summary !== 'No Location' && (
                                <div className="flex items-center gap-1 text-sm text-gray-600">
                                  <MapPin className="h-4 w-4" />
                                  <span>{event.summary}</span>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            {isUpcoming && (
                              <Badge className={
                                isToday 
                                  ? 'bg-red-500 text-white' 
                                  : isThisWeek 
                                    ? 'bg-orange-500 text-white' 
                                    : 'bg-green-500 text-white'
                              }>
                                {isToday ? 'Today' : isThisWeek ? 'This Week' : timeUntil}
                              </Badge>
                            )}
                            {!isUpcoming && (
                              <Badge variant="secondary" className="bg-gray-500 text-white">
                                Past Event
                              </Badge>
                            )}
                          </div>
                        </div>
                      </CardHeader>
                      {event.desc && event.desc !== 'No Description' && (
                        <CardContent>
                          <p className="text-gray-600 leading-relaxed">
                            {event.desc}
                          </p>
                        </CardContent>
                      )}
                    </Card>
                  )
                })
              ) : (
                <div className="text-center py-12">
                  <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Events Found</h3>
                  <p className="text-gray-600">There are currently no scheduled events.</p>
                </div>
              )}
            </div>
          )}

          {/* CTA Section */}
          <div className="text-center bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-8 text-white mt-12">
            <h2 className="text-3xl font-bold mb-4">
              Want to Stay Updated?
            </h2>
            <p className="text-xl mb-6 opacity-90">
              Check back regularly for new events or contact us for custom event notifications.
            </p>
            <Button size="lg" variant="secondary" asChild>
              <a href="/contact">
                Contact Us
              </a>
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
