import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Crown, Mail, MessageCircle, Clock, Shield, CreditCard, Facebook, Twitter, Instagram } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white border-t border-gray-700">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
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
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-amber-600">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/UO/Gold" className="text-gray-300 hover:text-white transition-colors">Gold</a></li>
              <li><a href="/suits" className="text-gray-300 hover:text-white transition-colors">Suits</a></li>
              <li><a href="/scrolls" className="text-gray-300 hover:text-white transition-colors">Scrolls</a></li>
              <li><a href="/tools" className="text-gray-300 hover:text-white transition-colors">Tools</a></li>
              <li><a href="/contact" className="text-gray-300 hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-amber-600">Categories</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/class" className="text-gray-300 hover:text-white transition-colors">By Class</a></li>
              <li><a href="/slot" className="text-gray-300 hover:text-white transition-colors">By Slot</a></li>
              <li><a href="/prop" className="text-gray-300 hover:text-white transition-colors">By Property</a></li>
              <li><a href="/store" className="text-gray-300 hover:text-white transition-colors">Store Items</a></li>
              <li><a href="/special-deals" className="text-gray-300 hover:text-white transition-colors">Special Deals</a></li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div className="space-y-4">
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
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center justify-center space-x-2">
              <Shield className="h-6 w-6 text-green-500" />
              <span className="text-sm text-gray-300">Trusted Ultima Online Gold Seller</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <Crown className="h-6 w-6 text-amber-600" />
              <span className="text-sm text-gray-300">Premium Quality Items</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <Clock className="h-6 w-6 text-blue-500" />
              <span className="text-sm text-gray-300">24/7 Customer Support</span>
            </div>
          </div>
        </div>

        {/* Newsletter */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-amber-600 mb-2">Stay Connected</h3>
            <p className="text-gray-300 text-sm mb-4">
              Ultima Online updates, special offers, and coupons.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 rounded-md bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-amber-600"
              />
              <Button className="bg-amber-600 hover:bg-amber-700">
                Join Newsletter
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-gray-400">
              <p>Game content © Electronic Arts Inc. All rights reserved | Ultima Online is trademark EA Games, All rights reserved</p>
            </div>
            <div className="flex space-x-6 text-sm">
              <a href="/delivery-returns" className="text-gray-400 hover:text-white transition-colors">Delivery / Returns</a>
              <a href="/privacy" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a>
              <a href="/terms" className="text-gray-400 hover:text-white transition-colors">Terms & Conditions</a>
            </div>
            <div className="text-sm text-gray-400">
              © 2025 | UOKing
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
