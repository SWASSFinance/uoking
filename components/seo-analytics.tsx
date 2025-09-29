"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  TrendingUp, 
  Eye, 
  FileText, 
  Image as ImageIcon,
  Link as LinkIcon,
  Target,
  Clock,
  BarChart3,
  Lightbulb
} from "lucide-react"

interface SEOAnalyticsProps {
  type: 'product' | 'category'
  data: {
    name: string
    slug: string
    description: string
    short_description?: string
    meta_title?: string
    meta_description?: string
    image_url?: string
    price?: string
    category_name?: string
  }
}

interface SEOScore {
  factor: string
  score: number
  maxScore: number
  status: 'excellent' | 'good' | 'warning' | 'error'
  message: string
  recommendation?: string
}

export function SEOAnalytics({ type, data }: SEOAnalyticsProps) {
  const [scores, setScores] = useState<SEOScore[]>([])
  const [overallScore, setOverallScore] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    calculateSEOScores()
  }, [data])

  const calculateSEOScores = () => {
    setIsLoading(true)
    const newScores: SEOScore[] = []

    // 1. Title Optimization (Meta Title)
    const titleScore = calculateTitleScore(data.meta_title || data.name)
    newScores.push({
      factor: "Title Optimization",
      score: titleScore.score,
      maxScore: titleScore.maxScore,
      status: titleScore.status,
      message: titleScore.message,
      recommendation: titleScore.recommendation
    })

    // 2. Content Quality & Length
    const contentScore = calculateContentScore(data.description, data.short_description)
    newScores.push({
      factor: "Content Quality",
      score: contentScore.score,
      maxScore: contentScore.maxScore,
      status: contentScore.status,
      message: contentScore.message,
      recommendation: contentScore.recommendation
    })

    // 3. Keyword Optimization
    const keywordScore = calculateKeywordScore(data.name, data.description, data.short_description)
    newScores.push({
      factor: "Keyword Optimization",
      score: keywordScore.score,
      maxScore: keywordScore.maxScore,
      status: keywordScore.status,
      message: keywordScore.message,
      recommendation: keywordScore.recommendation
    })

    // 4. URL Structure (Slug)
    const urlScore = calculateURLScore(data.slug)
    newScores.push({
      factor: "URL Structure",
      score: urlScore.score,
      maxScore: urlScore.maxScore,
      status: urlScore.status,
      message: urlScore.message,
      recommendation: urlScore.recommendation
    })

    // 5. Image Optimization
    const imageScore = calculateImageScore(data.image_url)
    newScores.push({
      factor: "Image Optimization",
      score: imageScore.score,
      maxScore: imageScore.maxScore,
      status: imageScore.status,
      message: imageScore.message,
      recommendation: imageScore.recommendation
    })

    // 6. Readability Score
    const readabilityScore = calculateReadabilityScore(data.description)
    newScores.push({
      factor: "Readability",
      score: readabilityScore.score,
      maxScore: readabilityScore.maxScore,
      status: readabilityScore.status,
      message: readabilityScore.message,
      recommendation: readabilityScore.recommendation
    })

    // 7. Content Uniqueness
    const uniquenessScore = calculateUniquenessScore(data.description, data.name)
    newScores.push({
      factor: "Content Uniqueness",
      score: uniquenessScore.score,
      maxScore: uniquenessScore.maxScore,
      status: uniquenessScore.status,
      message: uniquenessScore.message,
      recommendation: uniquenessScore.recommendation
    })

    // 8. Internal Linking Potential
    const linkingScore = calculateLinkingScore(data.description, data.category_name)
    newScores.push({
      factor: "Internal Linking",
      score: linkingScore.score,
      maxScore: linkingScore.maxScore,
      status: linkingScore.status,
      message: linkingScore.message,
      recommendation: linkingScore.recommendation
    })

    // 9. Mobile & User Experience
    const uxScore = calculateUXScore(data.description, data.short_description)
    newScores.push({
      factor: "User Experience",
      score: uxScore.score,
      maxScore: uxScore.maxScore,
      status: uxScore.status,
      message: uxScore.message,
      recommendation: uxScore.recommendation
    })

    setScores(newScores)
    
    // Calculate overall score
    const totalScore = newScores.reduce((sum, score) => sum + score.score, 0)
    const maxTotalScore = newScores.reduce((sum, score) => sum + score.maxScore, 0)
    setOverallScore(Math.round((totalScore / maxTotalScore) * 100))
    
    setIsLoading(false)
  }

  // Scoring Functions
  const calculateTitleScore = (title: string) => {
    if (!title) return { score: 0, maxScore: 10, status: 'error' as const, message: 'No title provided', recommendation: 'Add a descriptive title' }
    
    const length = title.length
    let score = 0
    let status: 'excellent' | 'good' | 'warning' | 'error' = 'error'
    let message = ''
    let recommendation = ''

    if (length >= 30 && length <= 60) {
      score += 4
      message += 'Optimal length (30-60 chars). '
    } else if (length < 30) {
      score += 2
      message += 'Too short. '
      recommendation += 'Add more descriptive words. '
    } else if (length > 60) {
      score += 1
      message += 'Too long, may be truncated. '
      recommendation += 'Shorten the title. '
    }

    if (title.includes('Ultima Online') || title.includes('UO')) {
      score += 2
      message += 'Contains brand keywords. '
    } else {
      recommendation += 'Include "Ultima Online" or "UO" in title. '
    }

    if (title.includes(data.name)) {
      score += 2
      message += 'Contains product/category name. '
    } else {
      recommendation += 'Include the main keyword in title. '
    }

    if (title.match(/[A-Z]/) && title.match(/[a-z]/)) {
      score += 1
      message += 'Good capitalization. '
    }

    if (score >= 8) status = 'excellent'
    else if (score >= 6) status = 'good'
    else if (score >= 4) status = 'warning'

    return { score, maxScore: 10, status, message: message || 'Title needs improvement', recommendation }
  }


  const calculateContentScore = (description: string, shortDescription?: string) => {
    const content = description || ''
    const shortContent = shortDescription || ''
    const totalLength = content.length + shortContent.length
    
    let score = 0
    let status: 'excellent' | 'good' | 'warning' | 'error' = 'error'
    let message = ''
    let recommendation = ''

    if (totalLength >= 300) {
      score += 3
      message += 'Good content length. '
    } else if (totalLength >= 150) {
      score += 2
      message += 'Adequate content length. '
    } else {
      score += 1
      message += 'Content too short. '
      recommendation += 'Add more detailed descriptions. '
    }

    if (content.includes('Ultima Online') || content.includes('UO')) {
      score += 2
      message += 'Contains brand mentions. '
    } else {
      recommendation += 'Mention "Ultima Online" or "UO" in content. '
    }

    if (content.split('.').length >= 3) {
      score += 2
      message += 'Well-structured sentences. '
    } else {
      recommendation += 'Add more detailed sentences. '
    }

    if (content.includes('quality') || content.includes('premium') || content.includes('fast')) {
      score += 2
      message += 'Contains value propositions. '
    } else {
      recommendation += 'Include value propositions like "premium quality" or "fast delivery". '
    }

    if (content.length > 0 && shortContent.length > 0) {
      score += 1
      message += 'Has both short and long descriptions. '
    } else {
      recommendation += 'Add both short and detailed descriptions. '
    }

    if (score >= 8) status = 'excellent'
    else if (score >= 6) status = 'good'
    else if (score >= 4) status = 'warning'

    return { score, maxScore: 10, status, message: message || 'Content needs improvement', recommendation }
  }

  const calculateKeywordScore = (name: string, description: string, shortDescription?: string) => {
    const content = `${name} ${description} ${shortDescription || ''}`.toLowerCase()
    const mainKeyword = name.toLowerCase()
    
    let score = 0
    let status: 'excellent' | 'good' | 'warning' | 'error' = 'error'
    let message = ''
    let recommendation = ''

    // Check keyword density (should be 1-3%)
    const keywordCount = (content.match(new RegExp(mainKeyword, 'g')) || []).length
    const wordCount = content.split(' ').length
    const density = (keywordCount / wordCount) * 100

    if (density >= 1 && density <= 3) {
      score += 4
      message += 'Good keyword density. '
    } else if (density < 1) {
      score += 2
      message += 'Low keyword density. '
      recommendation += 'Use the main keyword more frequently. '
    } else {
      score += 1
      message += 'High keyword density. '
      recommendation += 'Reduce keyword usage to avoid spam. '
    }

    // Check for related keywords
    const relatedKeywords = ['ultima online', 'uo', 'buy', 'purchase', 'premium', 'quality']
    const foundKeywords = relatedKeywords.filter(keyword => content.includes(keyword))
    
    if (foundKeywords.length >= 3) {
      score += 3
      message += 'Good use of related keywords. '
    } else if (foundKeywords.length >= 1) {
      score += 2
      message += 'Some related keywords found. '
    } else {
      recommendation += 'Include related keywords like "buy", "premium", "quality". '
    }

    // Check for keyword in title/heading
    if (description.toLowerCase().includes(mainKeyword)) {
      score += 2
      message += 'Keyword appears in content. '
    } else {
      recommendation += 'Include the main keyword in the description. '
    }

    // Check for keyword variations
    const variations = mainKeyword.split(' ').filter(word => word.length > 3)
    const foundVariations = variations.filter(variation => content.includes(variation))
    
    if (foundVariations.length > 0) {
      score += 1
      message += 'Uses keyword variations. '
    }

    if (score >= 8) status = 'excellent'
    else if (score >= 6) status = 'good'
    else if (score >= 4) status = 'warning'

    return { score, maxScore: 10, status, message: message || 'Keyword optimization needs improvement', recommendation }
  }

  const calculateURLScore = (slug: string) => {
    if (!slug) return { score: 0, maxScore: 10, status: 'error' as const, message: 'No URL slug', recommendation: 'Create a descriptive URL slug' }
    
    let score = 0
    let status: 'excellent' | 'good' | 'warning' | 'error' = 'error'
    let message = ''
    let recommendation = ''

    if (slug.length >= 3 && slug.length <= 50) {
      score += 3
      message += 'Good URL length. '
    } else if (slug.length < 3) {
      score += 1
      message += 'URL too short. '
      recommendation += 'Make URL more descriptive. '
    } else {
      score += 2
      message += 'URL may be too long. '
      recommendation += 'Shorten the URL. '
    }

    if (!slug.includes('_') && !slug.includes(' ')) {
      score += 2
      message += 'Clean URL format. '
    } else {
      recommendation += 'Use hyphens instead of underscores or spaces. '
    }

    if (slug.includes(data.name.toLowerCase().replace(/\s+/g, '-'))) {
      score += 3
      message += 'URL contains main keyword. '
    } else {
      recommendation += 'Include the main keyword in the URL. '
    }

    if (!slug.match(/[A-Z]/)) {
      score += 1
      message += 'Lowercase URL. '
    } else {
      recommendation += 'Use lowercase letters in URL. '
    }

    if (!slug.match(/[0-9]/)) {
      score += 1
      message += 'No numbers in URL. '
    } else {
      recommendation += 'Avoid numbers in URL when possible. '
    }

    if (score >= 8) status = 'excellent'
    else if (score >= 6) status = 'good'
    else if (score >= 4) status = 'warning'

    return { score, maxScore: 10, status, message: message || 'URL structure needs improvement', recommendation }
  }

  const calculateImageScore = (imageUrl?: string) => {
    if (!imageUrl) return { score: 0, maxScore: 10, status: 'error' as const, message: 'No image provided', recommendation: 'Add a high-quality product image' }
    
    let score = 0
    let status: 'excellent' | 'good' | 'warning' | 'error' = 'error'
    let message = ''
    let recommendation = ''

    score += 3
    message += 'Image provided. '

    // Check if image URL suggests good naming
    if (imageUrl.includes(data.name.toLowerCase().replace(/\s+/g, '-'))) {
      score += 2
      message += 'Image filename contains keyword. '
    } else {
      recommendation += 'Use descriptive image filenames with keywords. '
    }

    // Check file extension
    if (imageUrl.match(/\.(jpg|jpeg|png|webp)$/i)) {
      score += 2
      message += 'Good image format. '
    } else {
      recommendation += 'Use JPG, PNG, or WebP format. '
    }

    // Check if image is from a CDN or optimized source
    if (imageUrl.includes('cdn') || imageUrl.includes('optimized') || imageUrl.includes('resized')) {
      score += 2
      message += 'Image appears optimized. '
    } else {
      recommendation += 'Use optimized images for better performance. '
    }

    // Check for alt text potential (we can't check actual alt text here, but we can suggest it)
    score += 1
    message += 'Consider adding descriptive alt text. '
    recommendation += 'Add descriptive alt text to images. '

    if (score >= 8) status = 'excellent'
    else if (score >= 6) status = 'good'
    else if (score >= 4) status = 'warning'

    return { score, maxScore: 10, status, message: message || 'Image optimization needs improvement', recommendation }
  }

  const calculateReadabilityScore = (content: string) => {
    if (!content) return { score: 0, maxScore: 10, status: 'error' as const, message: 'No content to analyze', recommendation: 'Add readable content' }
    
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0)
    const words = content.split(/\s+/).filter(w => w.length > 0)
    const avgWordsPerSentence = words.length / sentences.length
    
    // Gaming-specific terms that are commonly used and shouldn't penalize readability
    const gamingTerms = [
      'ultima', 'online', 'spellbook', 'talisman', 'armor', 'weapon', 'equipment', 'character',
      'shard', 'guild', 'pvp', 'pve', 'quest', 'dungeon', 'loot', 'gold', 'silver', 'copper',
      'magic', 'spell', 'scroll', 'potion', 'reagent', 'component', 'ingredient', 'crafting',
      'smithing', 'tailoring', 'carpentry', 'alchemy', 'tinkering', 'mining', 'lumberjacking',
      'fishing', 'cooking', 'healing', 'resurrection', 'blessed', 'cursed', 'enchanted',
      'legendary', 'epic', 'rare', 'unique', 'artifact', 'relic', 'tome', 'grimoire',
      'amulet', 'ring', 'bracelet', 'necklace', 'cloak', 'robe', 'tunic', 'leather',
      'plate', 'chain', 'mail', 'helmet', 'gauntlet', 'boots', 'shield', 'sword',
      'dagger', 'mace', 'bow', 'crossbow', 'staff', 'wand', 'orb', 'crystal'
    ]
    
    // Count syllables but be more lenient with gaming terms
    const avgSyllablesPerWord = words.reduce((sum, word) => {
      const cleanWord = word.toLowerCase().replace(/[^a-z]/g, '')
      // If it's a gaming term, count it as having fewer syllables for scoring
      if (gamingTerms.some(term => cleanWord.includes(term) || term.includes(cleanWord))) {
        return sum + Math.max(1, Math.floor(countSyllables(word) * 0.7)) // 30% reduction for gaming terms
      }
      return sum + countSyllables(word)
    }, 0) / words.length
    
    let score = 0
    let status: 'excellent' | 'good' | 'warning' | 'error' = 'error'
    let message = ''
    let recommendation = ''

    // More lenient Flesch Reading Ease calculation for gaming content
    const fleschScore = 206.835 - (1.015 * avgWordsPerSentence) - (84.6 * avgSyllablesPerWord)
    
    // Adjusted thresholds for gaming content
    if (fleschScore >= 50) { // Lowered from 60
      score += 4
      message += 'Good readability for gaming content. '
    } else if (fleschScore >= 20) { // Lowered from 30
      score += 3
      message += 'Moderate readability. '
    } else if (fleschScore >= 0) {
      score += 2
      message += 'Acceptable readability for technical gaming content. '
    } else {
      score += 1
      message += 'Complex content, but may be appropriate for gaming. '
      recommendation += 'Consider breaking up very long sentences. '
    }

    // More lenient sentence length for gaming content
    if (avgWordsPerSentence <= 25) { // Increased from 20
      score += 2
      message += 'Good sentence length. '
    } else if (avgWordsPerSentence <= 35) { // New threshold
      score += 1
      message += 'Acceptable sentence length for detailed content. '
    } else {
      recommendation += 'Consider breaking up very long sentences. '
    }

    if (sentences.length >= 2) { // Lowered from 3
      score += 2
      message += 'Well-structured content. '
    } else {
      recommendation += 'Add more sentences for better structure. '
    }

    // Check for transition words
    const transitionWords = ['however', 'therefore', 'moreover', 'furthermore', 'additionally', 'also', 'but', 'and', 'or', 'while', 'when', 'if', 'because']
    const hasTransitions = transitionWords.some(word => content.toLowerCase().includes(word))
    
    if (hasTransitions) {
      score += 1
      message += 'Uses transition words. '
    } else {
      recommendation += 'Add transition words for better flow. '
    }

    // Check for bullet points or lists
    if (content.includes('•') || content.includes('-') || content.includes('*') || content.includes('1.') || content.includes('•')) {
      score += 1
      message += 'Uses lists for clarity. '
    } else {
      recommendation += 'Consider using bullet points or lists. '
    }

    if (score >= 8) status = 'excellent'
    else if (score >= 6) status = 'good'
    else if (score >= 4) status = 'warning'

    return { score, maxScore: 10, status, message: message || 'Readability needs improvement', recommendation }
  }

  const calculateUniquenessScore = (content: string, name: string) => {
    if (!content) return { score: 0, maxScore: 10, status: 'error' as const, message: 'No content to analyze', recommendation: 'Add unique content' }
    
    let score = 0
    let status: 'excellent' | 'good' | 'warning' | 'error' = 'error'
    let message = ''
    let recommendation = ''

    // Check for unique phrases (basic implementation)
    const words = content.toLowerCase().split(/\s+/)
    const uniqueWords = new Set(words)
    const uniquenessRatio = uniqueWords.size / words.length

    if (uniquenessRatio >= 0.7) {
      score += 3
      message += 'High content uniqueness. '
    } else if (uniquenessRatio >= 0.5) {
      score += 2
      message += 'Moderate content uniqueness. '
    } else {
      score += 1
      message += 'Low content uniqueness. '
      recommendation += 'Add more unique and specific content. '
    }

    // Check for specific product details
    if (content.includes('specific') || content.includes('unique') || content.includes('exclusive')) {
      score += 2
      message += 'Contains unique selling points. '
    } else {
      recommendation += 'Highlight unique features or benefits. '
    }

    // Check for brand-specific content
    if (content.includes('UO King') || content.includes('premium') || content.includes('quality')) {
      score += 2
      message += 'Contains brand-specific content. '
    } else {
      recommendation += 'Include brand-specific value propositions. '
    }

    // Check content length for uniqueness
    if (content.length >= 200) {
      score += 2
      message += 'Sufficient content for uniqueness. '
    } else {
      recommendation += 'Add more detailed content. '
    }

    // Check for repetitive phrases
    const phrases = content.toLowerCase().split(/[.!?]+/)
    const repeatedPhrases = phrases.filter((phrase, index) => phrases.indexOf(phrase) !== index)
    
    if (repeatedPhrases.length === 0) {
      score += 1
      message += 'No repetitive phrases detected. '
    } else {
      recommendation += 'Remove repetitive phrases. '
    }

    if (score >= 8) status = 'excellent'
    else if (score >= 6) status = 'good'
    else if (score >= 4) status = 'warning'

    return { score, maxScore: 10, status, message: message || 'Content uniqueness needs improvement', recommendation }
  }

  const calculateLinkingScore = (content: string, categoryName?: string) => {
    if (!content) return { score: 0, maxScore: 10, status: 'error' as const, message: 'No content to analyze', recommendation: 'Add content for internal linking' }
    
    let score = 0
    let status: 'excellent' | 'good' | 'warning' | 'error' = 'error'
    let message = ''
    let recommendation = ''

    // Check for potential internal link opportunities
    const linkableTerms = ['guide', 'tutorial', 'tips', 'strategy', 'build', 'class', 'skill', 'item', 'equipment']
    const foundTerms = linkableTerms.filter(term => content.toLowerCase().includes(term))
    
    if (foundTerms.length >= 3) {
      score += 3
      message += 'Good internal linking potential. '
    } else if (foundTerms.length >= 1) {
      score += 2
      message += 'Some internal linking opportunities. '
    } else {
      recommendation += 'Add terms that could link to related content. '
    }

    // Check for category mentions
    if (categoryName && content.toLowerCase().includes(categoryName.toLowerCase())) {
      score += 2
      message += 'Mentions category for linking. '
    } else {
      recommendation += 'Mention the category for internal linking. '
    }

    // Check for related product mentions
    if (content.includes('similar') || content.includes('related') || content.includes('also')) {
      score += 2
      message += 'Mentions related products. '
    } else {
      recommendation += 'Mention related or similar products. '
    }

    // Check for guide/tutorial mentions
    if (content.includes('how to') || content.includes('guide') || content.includes('tutorial')) {
      score += 2
      message += 'Mentions guides/tutorials. '
    } else {
      recommendation += 'Link to relevant guides or tutorials. '
    }

    // Check for brand mentions
    if (content.includes('UO King') || content.includes('our store') || content.includes('our products')) {
      score += 1
      message += 'Mentions brand for linking. '
    } else {
      recommendation += 'Include brand mentions for internal linking. '
    }

    if (score >= 8) status = 'excellent'
    else if (score >= 6) status = 'good'
    else if (score >= 4) status = 'warning'

    return { score, maxScore: 10, status, message: message || 'Internal linking needs improvement', recommendation }
  }

  const calculateUXScore = (description: string, shortDescription?: string) => {
    const content = description || ''
    const shortContent = shortDescription || ''
    
    let score = 0
    let status: 'excellent' | 'good' | 'warning' | 'error' = 'error'
    let message = ''
    let recommendation = ''

    // Check for structured content
    if (content.includes('\n') || content.includes('•') || content.includes('-')) {
      score += 2
      message += 'Well-structured content. '
    } else {
      recommendation += 'Use line breaks and lists for better readability. '
    }

    // Check for both short and long descriptions
    if (shortContent && content) {
      score += 3
      message += 'Has both short and detailed descriptions. '
    } else if (shortContent || content) {
      score += 2
      message += 'Has description content. '
    } else {
      recommendation += 'Add both short and detailed descriptions. '
    }

    // Check for action-oriented language
    if (content.includes('buy') || content.includes('purchase') || content.includes('order') || content.includes('get')) {
      score += 2
      message += 'Contains action-oriented language. '
    } else {
      recommendation += 'Include action words like "buy" or "purchase". '
    }

    // Check for benefit-focused content
    if (content.includes('benefit') || content.includes('advantage') || content.includes('feature') || content.includes('quality')) {
      score += 2
      message += 'Focuses on benefits and features. '
    } else {
      recommendation += 'Highlight benefits and key features. '
    }

    // Check for trust signals
    if (content.includes('guarantee') || content.includes('secure') || content.includes('trusted') || content.includes('reliable')) {
      score += 1
      message += 'Contains trust signals. '
    } else {
      recommendation += 'Add trust signals like "secure" or "guaranteed". '
    }

    if (score >= 8) status = 'excellent'
    else if (score >= 6) status = 'good'
    else if (score >= 4) status = 'warning'

    return { score, maxScore: 10, status, message: message || 'User experience needs improvement', recommendation }
  }

  const countSyllables = (word: string) => {
    word = word.toLowerCase()
    if (word.length <= 3) return 1
    return word.replace(/[^aeiouy]/g, '').length
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'excellent':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'good':
        return <CheckCircle className="h-4 w-4 text-blue-500" />
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'good':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'error':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="h-5 w-5 mr-2" />
            SEO Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mx-auto"></div>
            <p className="text-sm text-gray-500 mt-2">Analyzing SEO factors...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <BarChart3 className="h-5 w-5 mr-2" />
            SEO Analytics
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-lg font-semibold">
              {overallScore}/100
            </Badge>
            <div className="w-20">
              <Progress value={overallScore} className="h-2" />
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {scores.map((score, index) => (
          <div key={index} className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                {getStatusIcon(score.status)}
                <h4 className="font-medium">{score.factor}</h4>
              </div>
              <div className="flex items-center space-x-2">
                <Badge className={getStatusColor(score.status)}>
                  {score.score}/{score.maxScore}
                </Badge>
                <div className="w-16">
                  <Progress value={(score.score / score.maxScore) * 100} className="h-1" />
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-2">{score.message}</p>
            {score.factor === "Title Optimization" && (
              <div className="mt-2 p-2 bg-gray-50 rounded border border-gray-200">
                <p className="text-xs text-gray-500 mb-1">Analyzing title:</p>
                <p className="text-sm font-mono text-gray-800">"{data.meta_title || data.name}"</p>
              </div>
            )}
            {score.recommendation && (
              <div className="flex items-start space-x-2 p-2 bg-amber-50 rounded border border-amber-200">
                <Lightbulb className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-amber-800">{score.recommendation}</p>
              </div>
            )}
          </div>
        ))}
        
        <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
          <h4 className="font-semibold text-blue-900 mb-2 flex items-center">
            <TrendingUp className="h-4 w-4 mr-2" />
            Overall SEO Score: {overallScore}/100
          </h4>
          <p className="text-sm text-blue-800">
            {overallScore >= 80 ? 'Excellent! Your content is well-optimized for SEO.' :
             overallScore >= 60 ? 'Good! Your content has solid SEO foundations with room for improvement.' :
             overallScore >= 40 ? 'Fair. Focus on the recommendations above to improve your SEO score.' :
             'Needs significant improvement. Address the critical issues highlighted above.'}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
