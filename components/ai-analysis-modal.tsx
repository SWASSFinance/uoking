"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, Brain, TrendingUp, DollarSign, FileText, Target, CheckCircle } from "lucide-react"

interface AIAnalysisModalProps {
  isOpen: boolean
  onClose: () => void
  productName: string
  productPrice?: string
  productDescription?: string
  productType?: string
}

interface AIAnalysisResult {
  success: boolean
  analysis: string
  timestamp: string
  productName: string
  productPrice?: string
}

export function AIAnalysisModal({ 
  isOpen, 
  onClose, 
  productName, 
  productPrice, 
  productDescription, 
  productType 
}: AIAnalysisModalProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<AIAnalysisResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleAnalyze = async () => {
    setIsAnalyzing(true)
    setError(null)
    setAnalysisResult(null)

    try {
      const response = await fetch('/api/admin/products/ai-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productName,
          productPrice,
          productDescription,
          productType
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get AI analysis')
      }

      setAnalysisResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const formatAnalysis = (analysis: string) => {
    // Split the analysis into sections based on common headers
    const sections = analysis.split(/(?=\*\*[^*]+\*\*)/)
    
    return sections.map((section, index) => {
      const trimmedSection = section.trim()
      if (!trimmedSection) return null

      // Check if it's a header
      const isHeader = trimmedSection.startsWith('**') && trimmedSection.includes('**')
      
      if (isHeader) {
        const headerText = trimmedSection.replace(/\*\*/g, '').trim()
        return (
          <div key={index} className="mt-6 first:mt-0">
            <h3 className="text-lg font-semibold text-black mb-3 flex items-center">
              {headerText.includes('Market Research') && <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />}
              {headerText.includes('Price Analysis') && <DollarSign className="h-5 w-5 mr-2 text-green-600" />}
              {headerText.includes('Content Analysis') && <FileText className="h-5 w-5 mr-2 text-purple-600" />}
              {headerText.includes('Competitive Insights') && <Target className="h-5 w-5 mr-2 text-orange-600" />}
              {headerText.includes('Recommendations') && <CheckCircle className="h-5 w-5 mr-2 text-emerald-600" />}
              {headerText}
            </h3>
            <div className="text-gray-700 leading-relaxed">
              {trimmedSection.split('\n').slice(1).join('\n').trim()}
            </div>
          </div>
        )
      } else {
        return (
          <div key={index} className="text-gray-700 leading-relaxed mb-4">
            {trimmedSection}
          </div>
        )
      }
    }).filter(Boolean)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-black flex items-center">
            <Brain className="h-6 w-6 mr-2 text-blue-600" />
            AI Market Analysis: {productName}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Product Info Card */}
          <Card className="border border-gray-200 bg-gray-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-black">Product Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center space-x-4">
                <Badge variant="outline" className="text-black">
                  {productType || 'Not specified'}
                </Badge>
                {productPrice && (
                  <Badge className="bg-green-100 text-green-800">
                    ${parseFloat(productPrice).toFixed(2)}
                  </Badge>
                )}
              </div>
              {productDescription && (
                <p className="text-sm text-gray-600 mt-2">
                  {productDescription.length > 200 
                    ? `${productDescription.substring(0, 200)}...` 
                    : productDescription}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Analysis Button */}
          {!analysisResult && !isAnalyzing && (
            <div className="text-center py-8">
              <Button 
                onClick={handleAnalyze}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
                size="lg"
              >
                <Brain className="h-5 w-5 mr-2" />
                Analyze with AI
              </Button>
              <p className="text-sm text-gray-600 mt-3">
                Get market insights, pricing recommendations, and competitive analysis
              </p>
            </div>
          )}

          {/* Loading State */}
          {isAnalyzing && (
            <div className="text-center py-12">
              <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-black mb-2">Analyzing Product</h3>
              <p className="text-gray-600">
                AI is researching Ultima Online market data and competitors...
              </p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <Card className="border border-red-200 bg-red-50">
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-red-600 font-semibold mb-2">Analysis Failed</div>
                  <p className="text-red-700 text-sm">{error}</p>
                  <Button 
                    onClick={handleAnalyze}
                    variant="outline"
                    className="mt-4 border-red-300 text-red-600 hover:bg-red-50"
                  >
                    Try Again
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Analysis Results */}
          {analysisResult && (
            <Card className="border border-gray-200 bg-white">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg text-black">AI Analysis Results</CardTitle>
                  <Badge className="bg-green-100 text-green-800">
                    {new Date(analysisResult.timestamp).toLocaleString()}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none">
                  {formatAnalysis(analysisResult.analysis)}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pt-4 border-t">
            {analysisResult && (
              <Button 
                onClick={handleAnalyze}
                variant="outline"
                className="border-gray-300 text-gray-700"
              >
                <Brain className="h-4 w-4 mr-2" />
                Re-analyze
              </Button>
            )}
            <Button 
              onClick={onClose}
              className="bg-gray-600 hover:bg-gray-700 text-white"
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
