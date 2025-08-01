import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Lock, Mail, Eye, EyeOff, Shield, Crown } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-100">
      <Header />
      <main className="py-16 px-4">
        <div className="container mx-auto max-w-md">
          <Card className="bg-white/90 backdrop-blur-sm border border-amber-200 shadow-xl">
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
              <CardTitle className="text-3xl font-bold text-gray-900">Welcome Back</CardTitle>
              <p className="text-gray-600 mt-2">Sign in to your UOKing account</p>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700 font-medium">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    className="pl-10 bg-white border-gray-300 focus:border-amber-500 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700 font-medium">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    className="pl-10 bg-white border-gray-300 focus:border-amber-500 focus:ring-amber-500"
                  />
                  <Eye className="absolute right-3 top-3 h-4 w-4 text-gray-400 cursor-pointer hover:text-gray-600" />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox id="remember" />
                  <Label htmlFor="remember" className="text-sm text-gray-600">Remember me</Label>
                </div>
                <Link href="/forgot-password" className="text-sm text-amber-600 hover:text-amber-700 font-medium">
                  Forgot password?
                </Link>
              </div>

              <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3 text-lg font-semibold">
                Sign In
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-500">Or continue with</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="border-gray-300 hover:bg-gray-50">
                  <Shield className="h-4 w-4 mr-2" />
                  Google
                </Button>
                <Button variant="outline" className="border-gray-300 hover:bg-gray-50">
                  <Crown className="h-4 w-4 mr-2" />
                  Discord
                </Button>
              </div>

              <div className="text-center">
                <p className="text-gray-600">
                  Don't have an account?{" "}
                  <Link href="/register" className="text-amber-600 hover:text-amber-700 font-medium">
                    Sign up
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="mt-8 text-center">
            <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4 text-green-500" />
                <span>Secure Login</span>
              </div>
              <div className="flex items-center space-x-2">
                <Crown className="h-4 w-4 text-amber-500" />
                <span>Trusted Seller</span>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
} 