"use client"

import { useState, useEffect } from "react"
import { AdminHeader } from "@/components/admin-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Settings, 
  Mail, 
  Phone, 
  CreditCard, 
  Globe, 
  Save,
  CheckCircle,
  Tag,
  Users,
  Plus,
  Edit,
  Trash2,
  Search,
  Eye,
  EyeOff,
  X
} from "lucide-react"
import { ImageUpload } from "@/components/ui/image-upload"


interface Banner {
  id: string
  title: string
  subtitle: string
  description: string
  video_url: string
  image_url: string
  button_text: string
  button_url: string
  position: string
  is_active: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

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
  maintenance_message: string
  
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
    maintenance_message: '',
    enable_deal_of_the_day: true,
    deal_of_the_day_discount: 15,
    enable_referral_system: true,
    customer_cashback_percentage: 5,
    referrer_bonus_percentage: 2.5,
    cashback_expiry_days: 365
  })
  const [banners, setBanners] = useState<Banner[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null)
  const [showBannerForm, setShowBannerForm] = useState(false)

  useEffect(() => {
    fetchSettings()
    fetchBanners()
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

  const fetchBanners = async () => {
    try {
      const response = await fetch('/api/admin/banners')
      if (response.ok) {
        const data = await response.json()
        setBanners(data || [])
      }
    } catch (error) {
      console.error('Error fetching banners:', error)
      setBanners([])
    }
  }

  const handleBannerSave = async (bannerData: Partial<Banner>) => {
    try {
      const url = editingBanner ? `/api/admin/banners/${editingBanner.id}` : '/api/admin/banners'
      const method = editingBanner ? 'PUT' : 'POST'
      
      // Clean up the data before sending
      const cleanData = {
        ...bannerData,
        sort_order: parseInt(bannerData.sort_order?.toString() || '0'),
        is_active: Boolean(bannerData.is_active)
      }
      
      console.log('Saving banner data:', cleanData)
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cleanData),
      })

      if (response.ok) {
        const result = await response.json()
        console.log('Banner saved successfully:', result)
        alert(editingBanner ? 'Banner updated successfully!' : 'Banner created successfully!')
        fetchBanners()
        setEditingBanner(null)
        setShowBannerForm(false)
      } else {
        const errorData = await response.json()
        console.error('Error saving banner:', errorData)
        alert(`Error saving banner: ${errorData.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Error saving banner:', error)
      alert('Error saving banner. Please try again.')
    }
  }

  const handleBannerDelete = async (bannerId: string) => {
    if (confirm('Are you sure you want to delete this banner? This action cannot be undone.')) {
      try {
        const response = await fetch(`/api/admin/banners/${bannerId}`, {
          method: 'DELETE',
        })

        if (response.ok) {
          fetchBanners()
        } else {
          const errorData = await response.json()
          alert(`Error deleting banner: ${errorData.error}`)
        }
      } catch (error) {
        console.error('Error deleting banner:', error)
      }
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

  const BannerForm = ({ banner, onSave, onCancel }: { 
    banner?: Banner | null, 
    onSave: (data: Partial<Banner>) => void, 
    onCancel: () => void 
  }) => {
    const [isSaving, setIsSaving] = useState(false)
    const [formData, setFormData] = useState<{
      title: string
      subtitle: string
      description: string
      video_url: string
      image_url: string
      button_text: string
      button_url: string
      position: string
      sort_order: number
      is_active: boolean
    }>({
      title: banner?.title || '',
      subtitle: banner?.subtitle || '',
      description: banner?.description || '',
      video_url: banner?.video_url || '',
      image_url: banner?.image_url || '',
      button_text: banner?.button_text || '',
      button_url: banner?.button_url || '',
      position: banner?.position || 'homepage',
      sort_order: banner?.sort_order || 0,
      is_active: banner?.is_active !== false
    })

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()
      setIsSaving(true)
      try {
        await onSave(formData)
      } finally {
        setIsSaving(false)
      }
    }

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto light">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-black">
                {banner ? 'Edit Banner' : 'Add New Banner'}
              </h2>
              <Button variant="ghost" size="sm" onClick={onCancel} className="text-black hover:bg-gray-100">
                <X className="h-5 w-5" />
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="title" className="text-black font-semibold">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="border-gray-300 bg-white text-black"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="subtitle" className="text-black font-semibold">Subtitle</Label>
                  <Input
                    id="subtitle"
                    value={formData.subtitle}
                    onChange={(e) => setFormData({...formData, subtitle: e.target.value})}
                    className="border-gray-300 bg-white text-black"
                  />
                </div>

                <div>
                  <Label htmlFor="position" className="text-black font-semibold">Position</Label>
                  <Select value={formData.position} onValueChange={(value) => setFormData({...formData, position: value})}>
                    <SelectTrigger className="border-gray-300 bg-white text-black">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="homepage" className="text-black">Homepage</SelectItem>
                      <SelectItem value="category" className="text-black">Category Page</SelectItem>
                      <SelectItem value="product" className="text-black">Product Page</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="sort_order" className="text-black font-semibold">Sort Order</Label>
                  <Input
                    id="sort_order"
                    type="number"
                    value={formData.sort_order}
                    onChange={(e) => setFormData({...formData, sort_order: parseInt(e.target.value) || 0})}
                    className="border-gray-300 bg-white text-black"
                  />
                </div>

                <div>
                  <Label htmlFor="button_text" className="text-black font-semibold">Button Text</Label>
                  <Input
                    id="button_text"
                    value={formData.button_text}
                    onChange={(e) => setFormData({...formData, button_text: e.target.value})}
                    placeholder="e.g., Shop Now, Learn More"
                    className="border-gray-300 bg-white text-black"
                  />
                </div>

                <div>
                  <Label htmlFor="button_url" className="text-black font-semibold">Button URL</Label>
                  <Input
                    id="button_url"
                    value={formData.button_url}
                    onChange={(e) => setFormData({...formData, button_url: e.target.value})}
                    placeholder="e.g., /store, /about"
                    className="border-gray-300 bg-white text-black"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description" className="text-black font-semibold">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={3}
                  className="border-gray-300 bg-white text-black"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                  <div>
                  <Label htmlFor="video_url" className="text-black font-semibold">YouTube Video URL</Label>
                  <Input
                    id="video_url"
                    type="url"
                    placeholder="https://youtu.be/XxdCFGYId_4"
                    value={formData.video_url}
                    onChange={(e) => setFormData({...formData, video_url: e.target.value})}
                    className="border-gray-300 bg-white text-black"
                  />
                  <p className="text-xs text-gray-600 mt-1">
                    Paste a YouTube video URL (e.g., https://youtu.be/XxdCFGYId_4)
                  </p>
                  {formData.video_url && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-600 mb-2">Video preview:</p>
                      <div className="w-full max-w-md">
                        <iframe
                          src={`${formData.video_url.replace('youtu.be/', 'youtube.com/embed/').replace('watch?v=', 'embed/')}?autoplay=0&mute=1&controls=1&modestbranding=1`}
                          title="Video preview"
                          className="w-full h-48 rounded-lg border border-gray-300"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <Label className="text-black font-semibold">Fallback Image</Label>
                  <div className="mt-2">
                    <ImageUpload
                      value={formData.image_url}
                      onChange={(url) => setFormData({...formData, image_url: url})}
                      label=""
                      className="w-full"
                    />
                    <p className="text-xs text-gray-600 mt-1">
                      This image will be shown if the video fails to load
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData({...formData, is_active: checked})}
                  />
                  <Label htmlFor="is_active" className="text-black font-semibold">Active</Label>
                </div>
                <p className="text-sm text-gray-600 mt-1">Inactive banners won't be displayed on the site</p>
              </div>

              <div className="flex justify-end space-x-4 pt-6 border-t">
                <Button type="button" variant="outline" onClick={onCancel} className="border-gray-300 text-black hover:bg-gray-100">
                  Cancel
                </Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white" disabled={isSaving}>
                  <Save className="h-4 w-4 mr-2" />
                  {isSaving ? 'Saving...' : (banner ? 'Update Banner' : 'Create Banner')}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
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
                    {settings.maintenance_mode && (
                      <Badge variant="destructive" className="mt-1">
                        ⚠️ Site is currently in maintenance mode
                      </Badge>
                    )}
                  </div>
                  <Switch
                    id="maintenance_mode"
                    checked={settings.maintenance_mode}
                    onCheckedChange={(checked) => handleInputChange('maintenance_mode', checked)}
                  />
                </div>
                
                {settings.maintenance_mode && (
                  <div>
                    <Label htmlFor="maintenance_message" className="text-black font-semibold">Maintenance Message</Label>
                    <Textarea
                      id="maintenance_message"
                      value={settings.maintenance_message}
                      onChange={(e) => handleInputChange('maintenance_message', e.target.value)}
                      placeholder="Enter a custom maintenance message (optional)"
                      className="border-gray-300 bg-white text-black mt-2"
                      rows={3}
                    />
                    <p className="text-sm text-gray-600 mt-1">Custom message to display during maintenance (leave empty for default message)</p>
                    
                    <div className="mt-3">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => window.open('/', '_blank')}
                        className="text-orange-600 border-orange-300 hover:bg-orange-50"
                      >
                        🔍 Test Maintenance Page
                      </Button>
                      <p className="text-xs text-gray-500 mt-1">Opens the homepage in a new tab to test the maintenance overlay</p>
                    </div>
                  </div>
                )}
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

          {/* Banner Management Section */}
          <div className="mt-12">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-3xl font-bold text-black mb-2">Banner Management</h2>
                <p className="text-gray-700">Manage homepage banners, videos, and promotional content</p>
              </div>
              <Button onClick={() => setShowBannerForm(true)} className="bg-blue-600 hover:bg-blue-700 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Add Banner
              </Button>
            </div>

            <Card className="border border-gray-200 bg-white">
              <CardHeader>
                <CardTitle className="text-black flex items-center">
                  <div className="h-5 w-5 bg-red-100 rounded flex items-center justify-center mr-2">
                    <div className="text-red-600 font-bold text-xs">YT</div>
                  </div>
                  Banners ({banners.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                                 {banners.length === 0 ? (
                   <div className="text-center py-12">
                     <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                       <div className="text-red-600 font-bold text-xl">YT</div>
                     </div>
                     <h3 className="text-xl font-semibold text-black mb-2">No banners found</h3>
                     <p className="text-gray-700 mb-6">Create your first banner to display on the homepage</p>
                    <Button onClick={() => setShowBannerForm(true)} className="bg-blue-600 hover:bg-blue-700 text-white">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Your First Banner
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {banners.map((banner) => (
                      <div key={banner.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center space-x-4">
                                                   <div className="relative w-16 h-12 border border-gray-300 rounded-lg overflow-hidden">
                           {banner.video_url ? (
                             <div className="w-full h-full bg-red-100 flex items-center justify-center">
                               <div className="text-red-600 font-bold text-xs">YT</div>
                             </div>
                           ) : banner.image_url ? (
                              <img
                                src={banner.image_url}
                                alt={banner.title}
                                className="w-full h-full object-cover"
                              />
                                                         ) : (
                               <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                 <div className="text-gray-400 text-xs">No Media</div>
                               </div>
                             )}
                          </div>
                          <div>
                            <div className="font-semibold text-black">{banner.title}</div>
                            <div className="text-sm text-gray-600">{banner.subtitle}</div>
                            <div className="text-xs text-gray-500">Position: {banner.position} | Order: {banner.sort_order}</div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge 
                            className={`${
                              banner.is_active 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {banner.is_active ? (
                              <>
                                <Eye className="h-3 w-3 mr-1" />
                                Active
                              </>
                            ) : (
                              <>
                                <EyeOff className="h-3 w-3 mr-1" />
                                Inactive
                              </>
                            )}
                          </Badge>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setEditingBanner(banner)
                              setShowBannerForm(true)
                            }}
                            className="border-gray-300 text-black hover:bg-gray-100"
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleBannerDelete(banner.id)}
                            className="border-red-300 text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Banner Form Modal */}
      {showBannerForm && (
        <BannerForm
          banner={editingBanner}
          onSave={handleBannerSave}
          onCancel={() => {
            setShowBannerForm(false)
            setEditingBanner(null)
          }}
        />
      )}
    </div>
  )
} 