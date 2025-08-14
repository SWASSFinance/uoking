"use client"

import { useState, useEffect } from "react"
import { AdminHeader } from "@/components/admin-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { 
  Settings, 
  Mail, 
  Phone, 
  CreditCard, 
  Globe, 
  Save,
  CheckCircle,
  Tag,
  Users
} from "lucide-react"

interface SiteSettings {
  // Contact Information
  site_email: string
  support_phone: string
  contact_address: string
  
  // Payment Settings
  paypal_email: string
  stripe_public_key: string
  stripe_secret_key: string
  
  // Site Information
  site_title: string
  site_description: string
  site_keywords: string
  
  // Social Media
  facebook_url: string
  twitter_url: string
  discord_url: string
  
  // Business Information
  business_name: string
  business_hours: string
  timezone: string
  
  // Features
  enable_reviews: boolean
  enable_newsletter: boolean
  maintenance_mode: boolean
  
  // Deal of the Day
  enable_deal_of_the_day: boolean
  deal_of_the_day_discount: number
  
  // Referral System
  enable_referral_system: boolean
  customer_cashback_percentage: number
  referrer_bonus_percentage: number
  cashback_expiry_days: number
}

export default function SettingsAdminPage() {
  const [settings, setSettings] = useState<SiteSettings>({
    site_email: '',
    support_phone: '',
    contact_address: '',
    paypal_email: '',
    stripe_public_key: '',
    stripe_secret_key: '',
    site_title: '',
    site_description: '',
    site_keywords: '',
    facebook_url: '',
    twitter_url: '',
    discord_url: '',
    business_name: '',
    business_hours: '',
    timezone: 'UTC',
    enable_reviews: true,
    enable_newsletter: true,
    maintenance_mode: false,
    enable_deal_of_the_day: true,
    deal_of_the_day_discount: 15,
    enable_referral_system: true,
    customer_cashback_percentage: 5,
    referrer_bonus_percentage: 2.5,
    cashback_expiry_days: 365
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/admin/settings')
      if (response.ok) {
        const data = await response.json()
        setSettings(data)
      }
    } catch (error) {
      console.error('Error fetching settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      })

      if (response.ok) {
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
      }
    } catch (error) {
      console.error('Error saving settings:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleInputChange = (field: keyof SiteSettings, value: string | boolean | number) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white text-black">
        <AdminHeader />
        <main className="py-16 px-4">
          <div className="container mx-auto">
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading settings...</p>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white text-black">
      <AdminHeader />
      <main className="py-16 px-4">
        <div className="container mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold text-black mb-2">Site Settings</h1>
              <p className="text-gray-700">Configure your site's contact information, payment settings, and general preferences</p>
            </div>
            <Button 
              onClick={handleSave}
              disabled={saving}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : saved ? (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Saved!
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Settings
                </>
              )}
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Contact Information */}
            <Card className="border border-gray-200 bg-white">
              <CardHeader>
                <CardTitle className="text-black flex items-center">
                  <Mail className="h-5 w-5 mr-2" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="site_email" className="text-black font-semibold">Site Email</Label>
                  <Input
                    id="site_email"
                    type="email"
                    value={settings.site_email}
                    onChange={(e) => handleInputChange('site_email', e.target.value)}
                    placeholder="admin@uoking.com"
                    className="border-gray-300 bg-white text-black"
                  />
                </div>
                
                <div>
                  <Label htmlFor="support_phone" className="text-black font-semibold">Support Phone</Label>
                  <Input
                    id="support_phone"
                    type="tel"
                    value={settings.support_phone}
                    onChange={(e) => handleInputChange('support_phone', e.target.value)}
                    placeholder="+1 (555) 123-4567"
                    className="border-gray-300 bg-white text-black"
                  />
                </div>
                
                <div>
                  <Label htmlFor="contact_address" className="text-black font-semibold">Contact Address</Label>
                  <Textarea
                    id="contact_address"
                    value={settings.contact_address}
                    onChange={(e) => handleInputChange('contact_address', e.target.value)}
                    placeholder="Enter your business address"
                    rows={3}
                    className="border-gray-300 bg-white text-black"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Payment Settings */}
            <Card className="border border-gray-200 bg-white">
              <CardHeader>
                <CardTitle className="text-black flex items-center">
                  <CreditCard className="h-5 w-5 mr-2" />
                  Payment Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="paypal_email" className="text-black font-semibold">PayPal Email</Label>
                  <Input
                    id="paypal_email"
                    type="email"
                    value={settings.paypal_email}
                    onChange={(e) => handleInputChange('paypal_email', e.target.value)}
                    placeholder="payments@uoking.com"
                    className="border-gray-300 bg-white text-black"
                  />
                </div>
                
                <div>
                  <Label htmlFor="stripe_public_key" className="text-black font-semibold">Stripe Public Key</Label>
                  <Input
                    id="stripe_public_key"
                    value={settings.stripe_public_key}
                    onChange={(e) => handleInputChange('stripe_public_key', e.target.value)}
                    placeholder="pk_test_..."
                    className="border-gray-300 bg-white text-black"
                  />
                </div>
                
                <div>
                  <Label htmlFor="stripe_secret_key" className="text-black font-semibold">Stripe Secret Key</Label>
                  <Input
                    id="stripe_secret_key"
                    type="password"
                    value={settings.stripe_secret_key}
                    onChange={(e) => handleInputChange('stripe_secret_key', e.target.value)}
                    placeholder="sk_test_..."
                    className="border-gray-300 bg-white text-black"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Site Information */}
            <Card className="border border-gray-200 bg-white">
              <CardHeader>
                <CardTitle className="text-black flex items-center">
                  <Globe className="h-5 w-5 mr-2" />
                  Site Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="site_title" className="text-black font-semibold">Site Title</Label>
                  <Input
                    id="site_title"
                    value={settings.site_title}
                    onChange={(e) => handleInputChange('site_title', e.target.value)}
                    placeholder="UOKing - Premium Ultima Online Items"
                    className="border-gray-300 bg-white text-black"
                  />
                </div>
                
                <div>
                  <Label htmlFor="site_description" className="text-black font-semibold">Site Description</Label>
                  <Textarea
                    id="site_description"
                    value={settings.site_description}
                    onChange={(e) => handleInputChange('site_description', e.target.value)}
                    placeholder="Your trusted source for premium Ultima Online items, gold, and services."
                    rows={3}
                    className="border-gray-300 bg-white text-black"
                  />
                </div>
                
                <div>
                  <Label htmlFor="site_keywords" className="text-black font-semibold">Site Keywords</Label>
                  <Input
                    id="site_keywords"
                    value={settings.site_keywords}
                    onChange={(e) => handleInputChange('site_keywords', e.target.value)}
                    placeholder="Ultima Online, UO, gold, items, equipment, scrolls"
                    className="border-gray-300 bg-white text-black"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Social Media */}
            <Card className="border border-gray-200 bg-white">
              <CardHeader>
                <CardTitle className="text-black flex items-center">
                  <Globe className="h-5 w-5 mr-2" />
                  Social Media
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="facebook_url" className="text-black font-semibold">Facebook URL</Label>
                  <Input
                    id="facebook_url"
                    type="url"
                    value={settings.facebook_url}
                    onChange={(e) => handleInputChange('facebook_url', e.target.value)}
                    placeholder="https://facebook.com/uoking"
                    className="border-gray-300 bg-white text-black"
                  />
                </div>
                
                <div>
                  <Label htmlFor="twitter_url" className="text-black font-semibold">Twitter URL</Label>
                  <Input
                    id="twitter_url"
                    type="url"
                    value={settings.twitter_url}
                    onChange={(e) => handleInputChange('twitter_url', e.target.value)}
                    placeholder="https://twitter.com/uoking"
                    className="border-gray-300 bg-white text-black"
                  />
                </div>
                
                <div>
                  <Label htmlFor="discord_url" className="text-black font-semibold">Discord URL</Label>
                  <Input
                    id="discord_url"
                    type="url"
                    value={settings.discord_url}
                    onChange={(e) => handleInputChange('discord_url', e.target.value)}
                    placeholder="https://discord.gg/uoking"
                    className="border-gray-300 bg-white text-black"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Business Information */}
            <Card className="border border-gray-200 bg-white">
              <CardHeader>
                <CardTitle className="text-black flex items-center">
                  <Settings className="h-5 w-5 mr-2" />
                  Business Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="business_name" className="text-black font-semibold">Business Name</Label>
                  <Input
                    id="business_name"
                    value={settings.business_name}
                    onChange={(e) => handleInputChange('business_name', e.target.value)}
                    placeholder="UOKing"
                    className="border-gray-300 bg-white text-black"
                  />
                </div>
                
                <div>
                  <Label htmlFor="business_hours" className="text-black font-semibold">Business Hours</Label>
                  <Input
                    id="business_hours"
                    value={settings.business_hours}
                    onChange={(e) => handleInputChange('business_hours', e.target.value)}
                    placeholder="24/7"
                    className="border-gray-300 bg-white text-black"
                  />
                </div>
                
                <div>
                  <Label htmlFor="timezone" className="text-black font-semibold">Timezone</Label>
                  <Input
                    id="timezone"
                    value={settings.timezone}
                    onChange={(e) => handleInputChange('timezone', e.target.value)}
                    placeholder="UTC"
                    className="border-gray-300 bg-white text-black"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Features */}
            <Card className="border border-gray-200 bg-white">
              <CardHeader>
                <CardTitle className="text-black flex items-center">
                  <Settings className="h-5 w-5 mr-2" />
                  Features & Options
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="enable_reviews" className="text-black font-semibold">Enable Reviews</Label>
                    <p className="text-sm text-gray-600">Allow customers to leave product reviews</p>
                  </div>
                  <Switch
                    id="enable_reviews"
                    checked={settings.enable_reviews}
                    onCheckedChange={(checked) => handleInputChange('enable_reviews', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="enable_newsletter" className="text-black font-semibold">Enable Newsletter</Label>
                    <p className="text-sm text-gray-600">Allow customers to subscribe to newsletters</p>
                  </div>
                  <Switch
                    id="enable_newsletter"
                    checked={settings.enable_newsletter}
                    onCheckedChange={(checked) => handleInputChange('enable_newsletter', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="maintenance_mode" className="text-black font-semibold">Maintenance Mode</Label>
                    <p className="text-sm text-gray-600">Put the site in maintenance mode</p>
                  </div>
                  <Switch
                    id="maintenance_mode"
                    checked={settings.maintenance_mode}
                    onCheckedChange={(checked) => handleInputChange('maintenance_mode', checked)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Deal of the Day */}
            <Card className="border border-gray-200 bg-white">
              <CardHeader>
                <CardTitle className="text-black flex items-center">
                  <Tag className="h-5 w-5 mr-2" />
                  Deal of the Day
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="enable_deal_of_the_day" className="text-black font-semibold">Enable Deal of the Day</Label>
                    <p className="text-sm text-gray-600">Show daily deals on the homepage</p>
                  </div>
                  <Switch
                    id="enable_deal_of_the_day"
                    checked={settings.enable_deal_of_the_day}
                    onCheckedChange={(checked) => handleInputChange('enable_deal_of_the_day', checked)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="deal_of_the_day_discount" className="text-black font-semibold">Default Discount Percentage</Label>
                  <Input
                    id="deal_of_the_day_discount"
                    type="number"
                    min="1"
                    max="100"
                    value={settings.deal_of_the_day_discount}
                    onChange={(e) => handleInputChange('deal_of_the_day_discount', parseFloat(e.target.value) || 15)}
                    placeholder="15"
                    className="border-gray-300 bg-white text-black"
                  />
                  <p className="text-sm text-gray-600">Default discount percentage for deals</p>
                </div>
              </CardContent>
            </Card>

            {/* Referral System */}
            <Card className="border border-gray-200 bg-white">
              <CardHeader>
                <CardTitle className="text-black flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Referral System
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="enable_referral_system" className="text-black font-semibold">Enable Referral System</Label>
                    <p className="text-sm text-gray-600">Allow users to refer friends and earn rewards</p>
                  </div>
                  <Switch
                    id="enable_referral_system"
                    checked={settings.enable_referral_system}
                    onCheckedChange={(checked) => handleInputChange('enable_referral_system', checked)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="customer_cashback_percentage" className="text-black font-semibold">Customer Cashback Percentage</Label>
                  <Input
                    id="customer_cashback_percentage"
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={settings.customer_cashback_percentage}
                    onChange={(e) => handleInputChange('customer_cashback_percentage', parseFloat(e.target.value) || 5)}
                    placeholder="5"
                    className="border-gray-300 bg-white text-black"
                  />
                  <p className="text-sm text-gray-600">Percentage of order value given as cashback</p>
                </div>
                
                <div>
                  <Label htmlFor="referrer_bonus_percentage" className="text-black font-semibold">Referrer Bonus Percentage</Label>
                  <Input
                    id="referrer_bonus_percentage"
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={settings.referrer_bonus_percentage}
                    onChange={(e) => handleInputChange('referrer_bonus_percentage', parseFloat(e.target.value) || 2.5)}
                    placeholder="2.5"
                    className="border-gray-300 bg-white text-black"
                  />
                  <p className="text-sm text-gray-600">Percentage bonus given to referrers</p>
                </div>
                
                <div>
                  <Label htmlFor="cashback_expiry_days" className="text-black font-semibold">Cashback Expiry (Days)</Label>
                  <Input
                    id="cashback_expiry_days"
                    type="number"
                    min="1"
                    max="3650"
                    value={settings.cashback_expiry_days}
                    onChange={(e) => handleInputChange('cashback_expiry_days', parseInt(e.target.value) || 365)}
                    placeholder="365"
                    className="border-gray-300 bg-white text-black"
                  />
                  <p className="text-sm text-gray-600">Days until cashback expires</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
} 