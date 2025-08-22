"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Calendar, User, ChevronDown } from "lucide-react"

interface NewsPost {
  id: string
  title: string
  message: string
  posted_by: string
  date_posted: string
  created_at: string
}

export function NewsSection() {
  const [news, setNews] = useState<NewsPost[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedItem, setExpandedItem] = useState<string>('item-0')

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch('/api/news?limit=100')
        if (!response.ok) throw new Error('Failed to fetch news')
        
        const data = await response.json()
        setNews(data.news)
      } catch (error) {
        console.error('Error fetching news:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchNews()
  }, [])

  if (loading) {
    return (
      <section className="py-16 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        </div>
      </section>
    )
  }

  if (news.length === 0) {
    return null
  }

  return (
    <section className="py-16 bg-gradient-to-r from-orange-50/90 to-amber-50/90 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Latest News</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Stay updated with the latest announcements, events, and updates from UO King
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Accordion type="single" collapsible value={expandedItem} onValueChange={setExpandedItem} className="space-y-4">
            {news.map((newsPost, index) => (
              <AccordionItem 
                key={newsPost.id} 
                value={`item-${index}`}
                className="border border-orange-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-white/70"
              >
                <AccordionTrigger className="px-4 py-3 hover:no-underline bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:from-orange-600 hover:to-amber-600">
                  <div className="flex items-center justify-between w-full text-left">
                                         <div className="flex-1">
                       <h3 className="text-lg font-semibold text-white">
                         {newsPost.title}
                       </h3>
                     </div>
                    <div className="flex items-center gap-3 text-sm text-orange-100">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(newsPost.date_posted).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </div>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pt-4 pb-4">
                  <div 
                    className="prose prose-sm max-w-none text-gray-700"
                    dangerouslySetInnerHTML={{ __html: newsPost.message }}
                  />
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>


      </div>
    </section>
  )
}
