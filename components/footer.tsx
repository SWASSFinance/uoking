"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Crown, Mail, MessageCircle, Clock, Shield, CreditCard, Facebook, Twitter, Instagram, MessageSquare } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-amber-900 to-gray-900 text-white border-t border-amber-700">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Company Info */}
          <div className="space-y-3">
            <Link href="/" className="flex items-center space-x-2">
              <div className="relative w-32 h-12">
                <Image
                  src="/logof.png"
                  alt="UO KING"
                  fill
                  className="object-contain"
                />
              </div>
            </Link>
            <p className="text-gray-300 text-sm">
              Your trusted source for premium Ultima Online items, gold, and services. 
              Fast delivery, competitive prices, and 24/7 support.
            </p>
            <div className="flex space-x-4">
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-gray-400 hover:text-white"
                onClick={() => window.open('https://discord.gg/jAWgunBH', '_blank')}
              >
                <MessageSquare className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                <Facebook className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                <Twitter className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                <Instagram className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-amber-600">Quick Links</h3>
            <ul className="space-y-2 text-sm">
               <li><Link href="/UO/Gold" className="text-gray-300 hover:text-white transition-colors">Gold</Link></li>
               <li><Link href="/UO/Suits" className="text-gray-300 hover:text-white transition-colors">Suits</Link></li>
              <li><Link href="/tools" className="text-gray-300 hover:text-white transition-colors">Tools</Link></li>
              <li><Link href="/contact" className="text-gray-300 hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-amber-600">Categories</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/class" className="text-gray-300 hover:text-white transition-colors">By Class</Link></li>
              <li><Link href="/slot" className="text-gray-300 hover:text-white transition-colors">By Slot</Link></li>
              <li><Link href="/prop" className="text-gray-300 hover:text-white transition-colors">By Property</Link></li>
              <li><Link href="/store" className="text-gray-300 hover:text-white transition-colors">Store Items</Link></li>
              <li><Link href="/special-deals" className="text-gray-300 hover:text-white transition-colors">Special Deals</Link></li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-amber-600">Contact & Support</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-2">
                <MessageCircle className="h-4 w-4 text-amber-600" />
                <span className="text-gray-300">Discord: mr.brc</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-amber-600" />
                <span className="text-gray-300">sales@uoking.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-amber-600" />
                <span className="text-gray-300">9AM - 1AM ET</span>
              </div>
            </div>
            
            <div className="pt-4">
              <h4 className="font-semibold text-amber-600 mb-2">We Accept</h4>
              <div className="flex items-center space-x-2">
                <CreditCard className="h-6 w-6 text-green-500" />
                <span className="text-sm text-gray-300">Bank And Credit Cards Accepted</span>
              </div>
            </div>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="border-t border-amber-800 mt-6 pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center justify-center space-x-2">
              <Shield className="h-5 w-5 text-amber-500" />
              <span className="text-sm text-gray-300">Trusted Ultima Online Gold Seller</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <Crown className="h-5 w-5 text-amber-600" />
              <span className="text-sm text-gray-300">Premium Quality Items</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <Clock className="h-5 w-5 text-amber-500" />
              <span className="text-sm text-gray-300">24/7 Customer Support</span>
            </div>
          </div>
        </div>

                 {/* Bottom Bar */}
         <div className="border-t border-amber-800 mt-6 pt-6">
           <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
             <div className="text-sm text-gray-400 text-center lg:text-left max-w-md">
               <p className="whitespace-normal">Game content © Electronic Arts Inc. All rights reserved | Ultima Online is trademark EA Games, All rights reserved</p>
             </div>
             <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 text-sm">
               <Link href="/delivery-returns" className="text-gray-400 hover:text-white transition-colors whitespace-nowrap">Delivery / Returns</Link>
               <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors whitespace-nowrap">Privacy Policy</Link>
               <Link href="/terms" className="text-gray-400 hover:text-white transition-colors whitespace-nowrap">Terms & Conditions</Link>
             </div>
             <div className="text-sm text-gray-400 text-center lg:text-right whitespace-nowrap">
               © 2025 | UOKing
             </div>
           </div>
         </div>
      </div>
    </footer>
  )
}
