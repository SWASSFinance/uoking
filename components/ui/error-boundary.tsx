"use client"

import React from "react"
import { AlertTriangle, RefreshCw } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<{ error: Error; resetError: () => void }>
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo)
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback
        return <FallbackComponent error={this.state.error!} resetError={this.resetError} />
      }

      return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 flex items-center justify-center p-4">
          <Card className="max-w-md w-full bg-white/95 backdrop-blur-sm border border-amber-200 shadow-xl">
            <CardHeader className="text-center">
              {/* Logo */}
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
              
              <div className="flex justify-center mb-4">
                <AlertTriangle className="h-12 w-12 text-red-500" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">Something went wrong</CardTitle>
              <p className="text-gray-600 mt-2">
                We encountered an unexpected error. Please try refreshing the page.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-700 font-mono">
                  {this.state.error?.message || "Unknown error occurred"}
                </p>
              </div>
              <div className="flex space-x-3">
                <Button 
                  onClick={this.resetError} 
                  className="flex-1 bg-amber-600 hover:bg-amber-700"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Try Again
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => window.location.reload()}
                  className="flex-1"
                >
                  Refresh Page
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
} 