"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

interface SEOScoreBadgeProps {
  product: {
    name: string
    slug: string
    description: string
    short_description?: string
    image_url?: string
    category_name?: string
  }
}

export function SEOScoreBadge({ product }: SEOScoreBadgeProps) {
  const [score, setScore] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    calculateScore()
  }, [product])

  const calculateScore = () => {
    setIsLoading(true)
    
    // Simplified scoring based on key factors
    let totalScore = 0
    let maxScore = 0

    // Title optimization (simplified)
    const title = `${product.name} - UO King | Ultima Online ${product.category_name || 'Items'}`
    maxScore += 10
    if (title.length >= 30 && title.length <= 60) totalScore += 4
    else if (title.length > 0) totalScore += 2
    if (title.includes('Ultima Online') || title.includes('UO')) totalScore += 3
    if (title.includes(product.name)) totalScore += 2
    if (title.match(/[A-Z]/) && title.match(/[a-z]/)) totalScore += 1

    // Content quality
    const content = product.description || ''
    const shortContent = product.short_description || ''
    const totalLength = content.length + shortContent.length
    maxScore += 10
    if (totalLength >= 300) totalScore += 3
    else if (totalLength >= 150) totalScore += 2
    else if (totalLength > 0) totalScore += 1
    if (content.includes('Ultima Online') || content.includes('UO')) totalScore += 2
    if (content.split('.').length >= 3) totalScore += 2
    if (content.includes('quality') || content.includes('premium') || content.includes('fast')) totalScore += 2
    if (content.length > 0 && shortContent.length > 0) totalScore += 1

    // Keyword optimization
    const allContent = `${product.name} ${content} ${shortContent}`.toLowerCase()
    const mainKeyword = product.name.toLowerCase()
    maxScore += 10
    const keywordCount = (allContent.match(new RegExp(mainKeyword, 'g')) || []).length
    const wordCount = allContent.split(' ').length
    const density = (keywordCount / wordCount) * 100
    if (density >= 1 && density <= 3) totalScore += 4
    else if (density < 1) totalScore += 2
    else totalScore += 1
    const relatedKeywords = ['ultima online', 'uo', 'buy', 'purchase', 'premium', 'quality']
    const foundKeywords = relatedKeywords.filter(keyword => allContent.includes(keyword))
    if (foundKeywords.length >= 3) totalScore += 3
    else if (foundKeywords.length >= 1) totalScore += 2
    if (content.toLowerCase().includes(mainKeyword)) totalScore += 2
    const variations = mainKeyword.split(' ').filter(word => word.length > 3)
    const foundVariations = variations.filter(variation => allContent.includes(variation))
    if (foundVariations.length > 0) totalScore += 1

    // URL structure
    maxScore += 10
    if (product.slug.length >= 3 && product.slug.length <= 50) totalScore += 3
    else if (product.slug.length > 0) totalScore += 1
    if (!product.slug.includes('_') && !product.slug.includes(' ')) totalScore += 2
    if (product.slug.includes(product.name.toLowerCase().replace(/\s+/g, '-'))) totalScore += 3
    if (!product.slug.match(/[A-Z]/)) totalScore += 1
    if (!product.slug.match(/[0-9]/)) totalScore += 1

    // Image optimization
    maxScore += 10
    if (product.image_url) totalScore += 3
    if (product.image_url && product.image_url.includes(product.name.toLowerCase().replace(/\s+/g, '-'))) totalScore += 2
    if (product.image_url && product.image_url.match(/\.(jpg|jpeg|png|webp)$/i)) totalScore += 2
    if (product.image_url && (product.image_url.includes('cdn') || product.image_url.includes('optimized'))) totalScore += 2
    totalScore += 1 // Consider alt text potential

    // Readability (gaming-friendly)
    maxScore += 10
    if (content) {
      const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0)
      const words = content.split(/\s+/).filter(w => w.length > 0)
      const avgWordsPerSentence = words.length / sentences.length
      
      const gamingTerms = ['ultima', 'online', 'spellbook', 'talisman', 'armor', 'weapon', 'equipment', 'character']
      const avgSyllablesPerWord = words.reduce((sum, word) => {
        const cleanWord = word.toLowerCase().replace(/[^a-z]/g, '')
        if (gamingTerms.some(term => cleanWord.includes(term) || term.includes(cleanWord))) {
          return sum + Math.max(1, Math.floor(countSyllables(word) * 0.7))
        }
        return sum + countSyllables(word)
      }, 0) / words.length
      
      const fleschScore = 206.835 - (1.015 * avgWordsPerSentence) - (84.6 * avgSyllablesPerWord)
      
      if (fleschScore >= 50) totalScore += 4
      else if (fleschScore >= 20) totalScore += 3
      else if (fleschScore >= 0) totalScore += 2
      else totalScore += 1
      
      if (avgWordsPerSentence <= 25) totalScore += 2
      else if (avgWordsPerSentence <= 35) totalScore += 1
      
      if (sentences.length >= 2) totalScore += 2
      
      const transitionWords = ['however', 'therefore', 'moreover', 'furthermore', 'additionally', 'also', 'but', 'and', 'or', 'while', 'when', 'if', 'because']
      const hasTransitions = transitionWords.some(word => content.toLowerCase().includes(word))
      if (hasTransitions) totalScore += 1
      
      if (content.includes('•') || content.includes('-') || content.includes('*') || content.includes('1.')) totalScore += 1
    }

    // Content uniqueness
    maxScore += 10
    if (content) {
      const words = content.toLowerCase().split(/\s+/)
      const uniqueWords = new Set(words)
      const uniquenessRatio = uniqueWords.size / words.length
      if (uniquenessRatio >= 0.7) totalScore += 3
      else if (uniquenessRatio >= 0.5) totalScore += 2
      else totalScore += 1
      if (content.includes('specific') || content.includes('unique') || content.includes('exclusive')) totalScore += 2
      if (content.includes('UO King') || content.includes('premium') || content.includes('quality')) totalScore += 2
      if (content.length >= 200) totalScore += 2
      const phrases = content.toLowerCase().split(/[.!?]+/)
      const repeatedPhrases = phrases.filter((phrase, index) => phrases.indexOf(phrase) !== index)
      if (repeatedPhrases.length === 0) totalScore += 1
    }

    // Internal linking
    maxScore += 10
    if (content) {
      const linkableTerms = ['guide', 'tutorial', 'tips', 'strategy', 'build', 'class', 'skill', 'item', 'equipment']
      const foundTerms = linkableTerms.filter(term => content.toLowerCase().includes(term))
      if (foundTerms.length >= 3) totalScore += 3
      else if (foundTerms.length >= 1) totalScore += 2
      if (product.category_name && content.toLowerCase().includes(product.category_name.toLowerCase())) totalScore += 2
      if (content.includes('similar') || content.includes('related') || content.includes('also')) totalScore += 2
      if (content.includes('how to') || content.includes('guide') || content.includes('tutorial')) totalScore += 2
      if (content.includes('UO King') || content.includes('our store') || content.includes('our products')) totalScore += 1
    }

    // User experience
    maxScore += 10
    if (content.includes('\n') || content.includes('•') || content.includes('-') || content.includes('.')) totalScore += 3
    else if (content.length > 0) totalScore += 2
    else totalScore += 1
    if (shortContent && content) totalScore += 3
    else if (shortContent || content) totalScore += 2
    else totalScore += 1
    const actionWords = ['buy', 'purchase', 'order', 'get', 'find', 'use', 'equip', 'wear', 'obtain', 'acquire', 'collect']
    const hasActionWords = actionWords.some(word => content.toLowerCase().includes(word))
    if (hasActionWords) totalScore += 2
    else if (content.length > 50) totalScore += 1
    const benefitWords = ['benefit', 'advantage', 'feature', 'quality', 'premium', 'powerful', 'useful', 'effective', 'strong', 'durable', 'magical', 'enchanted', 'rare', 'unique']
    const hasBenefitWords = benefitWords.some(word => content.toLowerCase().includes(word))
    if (hasBenefitWords) totalScore += 2
    else if (content.length > 30) totalScore += 1
    const trustWords = ['guarantee', 'secure', 'trusted', 'reliable', 'safe', 'quality', 'premium', 'official', 'authentic']
    const hasTrustWords = trustWords.some(word => content.toLowerCase().includes(word))
    if (hasTrustWords) totalScore += 1
    else if (content.length > 0) totalScore += 1

    const finalScore = Math.round((totalScore / maxScore) * 100)
    setScore(finalScore)
    setIsLoading(false)
  }

  const countSyllables = (word: string) => {
    word = word.toLowerCase()
    if (word.length <= 3) return 1
    return word.replace(/[^aeiouy]/g, '').length
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-100 text-green-800 border-green-200'
    if (score >= 60) return 'bg-blue-100 text-blue-800 border-blue-200'
    if (score >= 40) return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    return 'bg-red-100 text-red-800 border-red-200'
  }

  if (isLoading) {
    return (
      <div className="flex items-center space-x-2">
        <div className="w-8 h-2 bg-gray-200 rounded animate-pulse"></div>
        <span className="text-xs text-gray-500">...</span>
      </div>
    )
  }

  return (
    <div className="flex items-center space-x-2">
      <Badge className={`${getScoreColor(score!)} text-xs font-semibold`}>
        {score}/100
      </Badge>
      <div className="w-12">
        <Progress value={score!} className="h-1" />
      </div>
    </div>
  )
}
