"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Crown, MessageCircle, Mail, Clock, MapPin, Phone } from "lucide-react"

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-100">
        <Header />
      
      <main className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <Crown className="h-8 w-8 text-amber-600 mr-3" />
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900">Contact Us</h1>
            </div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get in touch with our support team. We're here to help with all your Ultima Online needs.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <Card className="bg-white/80 backdrop-blur-sm border border-amber-200">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-gray-900">Send us a Message</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">First Name</label>
                    <Input placeholder="Your first name" className="mt-1" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Last Name</label>
                    <Input placeholder="Your last name" className="mt-1" />
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700">Email</label>
                  <Input type="email" placeholder="your.email@example.com" className="mt-1" />
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700">Subject</label>
                  <Input placeholder="What can we help you with?" className="mt-1" />
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700">Message</label>
                  <Textarea 
                    placeholder="Tell us about your inquiry..." 
                    className="mt-1 min-h-[120px]"
                  />
                </div>
                
                <Button className="w-full bg-amber-600 hover:bg-amber-700">
                  Send Message
                </Button>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <div className="space-y-6">
              <Card className="bg-white/80 backdrop-blur-sm border border-amber-200">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-gray-900">Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <MessageCircle className="h-5 w-5 text-amber-600" />
                    <div>
                      <p className="font-medium text-gray-900">Discord</p>
                      <p className="text-sm text-gray-600">mr.brc</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-amber-600" />
                    <div>
                      <p className="font-medium text-gray-900">Email</p>
                      <p className="text-sm text-gray-600">sales@uoking.com</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Clock className="h-5 w-5 text-amber-600" />
                    <div>
                      <p className="font-medium text-gray-900">Business Hours</p>
                      <p className="text-sm text-gray-600">9AM - 1AM ET (7 days a week)</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border border-amber-200">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-gray-900">Quick Support</CardTitle>
                </CardHeader>
                <CardContent>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => window.open('https://discord.gg/jAWgunBH', '_blank')}
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Join Discord
                  </Button>
                </CardContent>
              </Card>

                             <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                 <CardHeader>
                   <CardTitle className="text-xl font-bold">Need Immediate Help?</CardTitle>
                 </CardHeader>
                 <CardContent>
                   <p className="text-green-100">
                     For urgent orders or technical support, our live chat is available 24/7. Look for the chat bubble in the bottom right corner of your screen.
                   </p>
                 </CardContent>
               </Card>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Frequently Asked Questions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-white/80 backdrop-blur-sm border border-amber-200">
                <CardHeader>
                  <CardTitle className="text-lg font-bold text-gray-900">How fast is delivery?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Most orders are delivered within 5 minutes. Gold and digital items are instant, while physical items may take 1-2 business days.</p>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border border-amber-200">
                <CardHeader>
                  <CardTitle className="text-lg font-bold text-gray-900">Which shards do you support?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">We support all official Ultima Online shards including Atlantic, Pacific, Great Lakes, and all other production shards.</p>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border border-amber-200">
                <CardHeader>
                  <CardTitle className="text-lg font-bold text-gray-900">What payment methods do you accept?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">We accept all major credit cards, PayPal, and cryptocurrency payments including Bitcoin and other digital currencies.</p>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border border-amber-200">
                <CardHeader>
                  <CardTitle className="text-lg font-bold text-gray-900">Is my information secure?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Yes, we use industry-standard encryption and never store sensitive payment information. Your privacy and security are our top priorities.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

        <Footer />
      </div>
  )
} 