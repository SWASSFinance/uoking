"use client"

import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Breadcrumb } from "@/components/ui/breadcrumb"
import { 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  Shield, 
  Crown, 
  User, 
  CheckCircle,
  AlertCircle,
  Gift,
  Sword
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { signIn } from "next-auth/react"

export default function SignUpPage() {
  const { toast } = useToast()
  const searchParams = useSearchParams()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    characterName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
    agreeToMarketing: false,
    referralCode: ""
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [referralValid, setReferralValid] = useState<boolean | null>(null)

  // Load referral code from URL params
  useEffect(() => {
    const ref = searchParams.get('ref')
    if (ref) {
      setFormData(prev => ({ ...prev, referralCode: ref }))
      validateReferralCode(ref)
    }
  }, [searchParams])

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }))
    }
  }

  const validateReferralCode = async (code: string) => {
    if (!code) {
      setReferralValid(null)
      return
    }

    try {
      const response = await fetch(`/api/auth/validate-referral?code=${code}`)
      if (response.ok) {
        setReferralValid(true)
      } else {
        setReferralValid(false)
      }
    } catch (error) {
      setReferralValid(false)
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.characterName.trim()) {
      newErrors.characterName = "Character name is required"
    } else if (formData.characterName.trim().length < 2) {
      newErrors.characterName = "Character name must be at least 2 characters"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long"
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password"
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = "You must agree to the terms and conditions"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          characterName: formData.characterName,
          email: formData.email,
          password: formData.password,
          agreeToTerms: formData.agreeToTerms,
          agreeToMarketing: formData.agreeToMarketing,
          referralCode: formData.referralCode || undefined
        }),
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Account Created Successfully!",
          description: "Welcome to UOKing! You can now log in and start your Ultima Online journey.",
          variant: "default",
        })
        
        // Redirect to login page
        setTimeout(() => {
          window.location.href = '/login'
        }, 2000)
      } else {
        toast({
          title: "Registration Failed",
          description: data.error || "Failed to create account. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: "Network error. Please check your connection and try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
      <Header />
      <main className="py-16 px-4">
        <div className="container mx-auto max-w-2xl">
          <div className="mb-8">
            <Breadcrumb 
              items={[
                { label: "Account", href: "/account" },
                { label: "Sign Up", current: true }
              ]} 
            />
          </div>
          <Card className="bg-white/95 backdrop-blur-sm border border-amber-200 shadow-2xl">
            <CardHeader className="text-center pb-6">
              <div className="flex justify-center mb-6">
                <div className="relative w-32 h-12">
                  <Image
                    src="/logof.png"
                    alt="UO KING"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
              <CardTitle className="text-3xl font-bold text-gray-900">Join UOKing</CardTitle>
              <p className="text-gray-600 mt-2">Create your account and start your Ultima Online journey</p>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Character Name Field */}
                <div className="space-y-2">
                  <Label htmlFor="characterName" className="text-gray-700 font-medium">
                    Character Name *
                  </Label>
                  <div className="relative">
                    <Sword className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="characterName"
                      type="text"
                      placeholder="Enter your Ultima Online character name"
                      value={formData.characterName}
                      onChange={(e) => handleInputChange("characterName", e.target.value)}
                      className={`pl-10 bg-white border-gray-300 focus:border-amber-500 focus:ring-amber-500 ${
                        errors.characterName ? "border-red-500" : ""
                      }`}
                    />
                  </div>
                  {errors.characterName && (
                    <p className="text-red-500 text-sm flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.characterName}
                    </p>
                  )}
                </div>

                {/* Email Field */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700 font-medium">
                    Email Address *
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className={`pl-10 bg-white border-gray-300 focus:border-amber-500 focus:ring-amber-500 ${
                        errors.email ? "border-red-500" : ""
                      }`}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-sm flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Password Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-gray-700 font-medium">
                      Password *
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a password"
                        value={formData.password}
                        onChange={(e) => handleInputChange("password", e.target.value)}
                        className={`pl-10 pr-10 bg-white border-gray-300 focus:border-amber-500 focus:ring-amber-500 ${
                          errors.password ? "border-red-500" : ""
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-red-500 text-sm flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.password}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-gray-700 font-medium">
                      Confirm Password *
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                        className={`pl-10 pr-10 bg-white border-gray-300 focus:border-amber-500 focus:ring-amber-500 ${
                          errors.confirmPassword ? "border-red-500" : ""
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-red-500 text-sm flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.confirmPassword}
                      </p>
                    )}
                  </div>
                </div>

                {/* Referral Code */}
                <div className="space-y-2">
                  <Label htmlFor="referralCode" className="text-gray-700 font-medium">
                    Referral Code (Optional)
                  </Label>
                  <div className="relative">
                    <Gift className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="referralCode"
                      type="text"
                      placeholder="Enter referral code if you have one"
                      value={formData.referralCode}
                      onChange={(e) => {
                        handleInputChange("referralCode", e.target.value)
                        validateReferralCode(e.target.value)
                      }}
                      className={`pl-10 bg-white border-gray-300 focus:border-amber-500 focus:ring-amber-500 ${
                        formData.referralCode && referralValid === false ? "border-red-500" : ""
                      } ${
                        formData.referralCode && referralValid === true ? "border-green-500" : ""
                      }`}
                    />
                  </div>
                  {formData.referralCode && referralValid === false && (
                    <p className="text-red-500 text-sm flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      Invalid referral code
                    </p>
                  )}
                  {formData.referralCode && referralValid === true && (
                    <p className="text-green-500 text-sm flex items-center">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Valid referral code! You'll earn bonus rewards.
                    </p>
                  )}
                </div>

                {/* Terms and Marketing */}
                <div className="space-y-4">
                  <div className="flex items-start space-x-2">
                    <Checkbox 
                      id="agreeToTerms" 
                      checked={formData.agreeToTerms}
                      onCheckedChange={(checked) => handleInputChange("agreeToTerms", checked as boolean)}
                    />
                    <div className="space-y-1">
                      <Label htmlFor="agreeToTerms" className="text-sm text-gray-700">
                        I agree to the{" "}
                        <Link href="/terms" className="text-amber-600 hover:text-amber-700 font-medium">
                          Terms and Conditions
                        </Link>{" "}
                        and{" "}
                        <Link href="/privacy" className="text-amber-600 hover:text-amber-700 font-medium">
                          Privacy Policy
                        </Link> *
                      </Label>
                      {errors.agreeToTerms && (
                        <p className="text-red-500 text-sm flex items-center">
                          <AlertCircle className="h-4 w-4 mr-1" />
                          {errors.agreeToTerms}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-start space-x-2">
                    <Checkbox 
                      id="agreeToMarketing" 
                      checked={formData.agreeToMarketing}
                      onCheckedChange={(checked) => handleInputChange("agreeToMarketing", checked as boolean)}
                    />
                    <Label htmlFor="agreeToMarketing" className="text-sm text-gray-700">
                      I would like to receive updates about new products, special offers, and gaming news
                    </Label>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3 text-lg font-semibold"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <LoadingSpinner size="sm" text="Creating Account..." />
                    </div>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </form>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-500">Or continue with</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button 
                  variant="outline" 
                  className="border-gray-300 hover:bg-gray-50"
                  onClick={() => {
                    const ref = searchParams.get('ref')
                    const callbackUrl = ref ? `/login/callback?ref=${ref}` : '/login/callback'
                    signIn('google', { callbackUrl })
                  }}
                >
                  <Shield className="h-4 w-4 mr-2" />
                  Google
                </Button>
                <Button 
                  variant="outline" 
                  className="border-gray-300 hover:bg-gray-50"
                  onClick={() => {
                    const ref = searchParams.get('ref')
                    const callbackUrl = ref ? `/login/callback?ref=${ref}` : '/login/callback'
                    signIn('discord', { callbackUrl })
                  }}
                >
                  <Crown className="h-4 w-4 mr-2" />
                  Discord
                </Button>
              </div>

              <div className="text-center">
                <p className="text-gray-600">
                  Already have an account?{" "}
                  <Link href="/login" className="text-amber-600 hover:text-amber-700 font-medium">
                    Sign in
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Trust Indicators */}
          <div className="mt-8 text-center">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-500">
              <div className="flex items-center justify-center space-x-2">
                <Shield className="h-4 w-4 text-green-500" />
                <span>Secure Registration</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <Crown className="h-4 w-4 text-amber-500" />
                <span>Trusted Platform</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <CheckCircle className="h-4 w-4 text-blue-500" />
                <span>Instant Access</span>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
} 