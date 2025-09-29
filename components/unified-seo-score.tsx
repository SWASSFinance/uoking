"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { 
  ChevronDown, 
  ChevronRight, 
  AlertTriangle, 
  CheckCircle,
  XCircle,
  Code,
  FileText,
  Image as ImageIcon,
  Link as LinkIcon,
  Target,
  Eye,
  Lightbulb
} from "lucide-react"

interface ProductData {
  name: string
  slug: string
  description: string
  short_description?: string
  image_url?: string
  category_name?: string
}

interface SEOFactor {
  name: string
  score: number
  maxScore: number
  status: 'excellent' | 'good' | 'warning' | 'error'
  message: string
  devExplanation: string
  codeLocation?: string
  expectedValue?: string
  actualValue?: string
  recommendation: string
}

interface UnifiedSEOScoreProps {
  product: ProductData
  mode: 'compact' | 'detailed'
  showDevDetails?: boolean
}

export function UnifiedSEOScore({ product, mode = 'compact', showDevDetails = false }: UnifiedSEOScoreProps) {
  const [overallScore, setOverallScore] = useState<number | null>(null)
  const [factors, setFactors] = useState<SEOFactor[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showDetails, setShowDetails] = useState(false)
  const [imageIssues, setImageIssues] = useState<string[]>([])

  useEffect(() => {
    calculateSEOScore()
  }, [product])

  const calculateSEOScore = async () => {
    setIsLoading(true)
    
    // Wait for DOM to be ready for image analysis
    await new Promise(resolve => setTimeout(resolve, 100))
    
    const newFactors: SEOFactor[] = []

    // 1. Title Optimization
    const titleFactor = analyzeTitleOptimization()
    newFactors.push(titleFactor)

    // 2. Content Quality
    const contentFactor = analyzeContentQuality()
    newFactors.push(contentFactor)

    // 3. Keyword Optimization
    const keywordFactor = analyzeKeywordOptimization()
    newFactors.push(keywordFactor)

    // 4. URL Structure
    const urlFactor = analyzeURLStructure()
    newFactors.push(urlFactor)

    // 5. Image Optimization
    const imageFactor = await analyzeImageOptimization()
    newFactors.push(imageFactor)

    // 6. Readability
    const readabilityFactor = analyzeReadability()
    newFactors.push(readabilityFactor)

    // 7. Content Uniqueness
    const uniquenessFactor = analyzeContentUniqueness()
    newFactors.push(uniquenessFactor)

    // 8. Internal Linking Potential
    const linkingFactor = analyzeLinkingPotential()
    newFactors.push(linkingFactor)

    // 9. User Experience
    const uxFactor = analyzeUserExperience()
    newFactors.push(uxFactor)

    setFactors(newFactors)
    
    // Calculate overall score
    const totalScore = newFactors.reduce((sum, factor) => sum + factor.score, 0)
    const maxTotalScore = newFactors.reduce((sum, factor) => sum + factor.maxScore, 0)
    setOverallScore(Math.round((totalScore / maxTotalScore) * 100))
    
    setIsLoading(false)
  }

  const analyzeTitleOptimization = (): SEOFactor => {
    const title = `${product.name} - UO King | Ultima Online ${product.category_name || 'Items'}`
    const length = title.length
    let score = 0
    let status: 'excellent' | 'good' | 'warning' | 'error' = 'error'
    let message = ''
    let devExplanation = ''
    let recommendation = ''

    // Length check (30-60 chars optimal)
    if (length >= 30 && length <= 60) {
      score += 4
      message += 'Optimal length. '
      devExplanation += `✓ Title length (${length} chars) is within optimal range (30-60). `
    } else if (length < 30) {
      score += 2
      message += 'Too short. '
      devExplanation += `⚠ Title length (${length} chars) is below optimal minimum (30). `
      recommendation += 'Add more descriptive words to reach 30-60 characters. '
    } else {
      score += 1
      message += 'Too long, may be truncated. '
      devExplanation += `⚠ Title length (${length} chars) exceeds optimal maximum (60). Google may truncate at ~60 chars. `
      recommendation += 'Shorten title to 60 characters or less. '
    }

    // Brand keyword check
    if (title.includes('Ultima Online') || title.includes('UO')) {
      score += 2
      message += 'Contains brand keywords. '
      devExplanation += '✓ Contains brand keywords ("Ultima Online" or "UO"). '
    } else {
      devExplanation += '✗ Missing brand keywords. '
      recommendation += 'Include "Ultima Online" or "UO" in title. '
    }

    // Product name check
    if (title.includes(product.name)) {
      score += 2
      message += 'Contains product name. '
      devExplanation += '✓ Contains main product keyword. '
    } else {
      devExplanation += '✗ Missing main product keyword in title. '
      recommendation += 'Ensure product name appears in title. '
    }

    // Capitalization check
    if (title.match(/[A-Z]/) && title.match(/[a-z]/)) {
      score += 1
      message += 'Good capitalization. '
      devExplanation += '✓ Uses proper title case. '
    }

    // Final status
    if (score >= 8) status = 'excellent'
    else if (score >= 6) status = 'good'
    else if (score >= 4) status = 'warning'

    return {
      name: "Title Optimization",
      score,
      maxScore: 10,
      status,
      message: message || 'Title needs improvement',
      devExplanation: `Generated title: "${title}". ${devExplanation}`,
      codeLocation: 'app/product/[product-name]/page.tsx - metadata.title',
      expectedValue: '30-60 chars with brand + product keywords',
      actualValue: `${length} chars: "${title}"`,
      recommendation
    }
  }

  const analyzeContentQuality = (): SEOFactor => {
    const content = product.description || ''
    const shortContent = product.short_description || ''
    const totalLength = content.length + shortContent.length
    
    let score = 0
    let status: 'excellent' | 'good' | 'warning' | 'error' = 'error'
    let message = ''
    let devExplanation = ''
    let recommendation = ''

    // Length analysis
    if (totalLength >= 300) {
      score += 3
      message += 'Good content length. '
      devExplanation += `✓ Total content length (${totalLength} chars) meets recommended minimum (300+). `
    } else if (totalLength >= 150) {
      score += 2
      message += 'Adequate length. '
      devExplanation += `⚠ Total content length (${totalLength} chars) is adequate but could be longer for better SEO. `
      recommendation += 'Expand content to 300+ characters for better SEO performance. '
    } else {
      score += 1
      message += 'Content too short. '
      devExplanation += `✗ Total content length (${totalLength} chars) is below recommended minimum (150). `
      recommendation += 'Add detailed product descriptions. Content should be 300+ characters. '
    }

    // Brand mentions
    const allContent = `${content} ${shortContent}`.toLowerCase()
    if (allContent.includes('ultima online') || allContent.includes('uo')) {
      score += 2
      message += 'Contains brand mentions. '
      devExplanation += '✓ Content mentions brand ("Ultima Online" or "UO"). '
    } else {
      devExplanation += '✗ Content lacks brand mentions. '
      recommendation += 'Include "Ultima Online" or "UO" in product descriptions. '
    }

    // Sentence structure
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0)
    if (sentences.length >= 3) {
      score += 2
      message += 'Well-structured sentences. '
      devExplanation += `✓ Content has ${sentences.length} sentences, providing good structure. `
    } else {
      devExplanation += `⚠ Content has only ${sentences.length} sentences. `
      recommendation += 'Add more detailed sentences for better structure and readability. '
    }

    // Both descriptions check
    if (content.length > 0 && shortContent.length > 0) {
      score += 1
      message += 'Has both descriptions. '
      devExplanation += '✓ Has both short and long descriptions. '
    } else {
      devExplanation += '✗ Missing either short_description or description field. '
      recommendation += 'Provide both short and detailed descriptions. '
    }

    if (score >= 8) status = 'excellent'
    else if (score >= 6) status = 'good'
    else if (score >= 4) status = 'warning'

    return {
      name: "Content Quality",
      score,
      maxScore: 10,
      status,
      message: message || 'Content needs improvement',
      devExplanation: `Description: ${content.length} chars, Short: ${shortContent.length} chars. ${devExplanation}`,
      codeLocation: 'Database fields: description, short_description',
      expectedValue: '300+ total chars, both fields populated, 3+ sentences',
      actualValue: `${totalLength} total chars, ${sentences.length} sentences`,
      recommendation
    }
  }

  const analyzeKeywordOptimization = (): SEOFactor => {
    const allContent = `${product.name} ${product.description} ${product.short_description || ''}`.toLowerCase()
    const mainKeyword = product.name.toLowerCase()
    
    let score = 0
    let status: 'excellent' | 'good' | 'warning' | 'error' = 'error'
    let message = ''
    let devExplanation = ''
    let recommendation = ''

    // Keyword density analysis
    const keywordCount = (allContent.match(new RegExp(mainKeyword, 'g')) || []).length
    const wordCount = allContent.split(' ').length
    const density = (keywordCount / wordCount) * 100

    if (density >= 1 && density <= 3) {
      score += 4
      message += 'Good keyword density. '
      devExplanation += `✓ Keyword density (${density.toFixed(2)}%) is optimal (1-3%). `
    } else if (density < 1) {
      score += 2
      message += 'Low keyword density. '
      devExplanation += `⚠ Keyword density (${density.toFixed(2)}%) is below optimal (1%). `
      recommendation += 'Use main keyword more frequently in content. '
    } else {
      score += 1
      message += 'High keyword density. '
      devExplanation += `⚠ Keyword density (${density.toFixed(2)}%) is above optimal (3%). Risk of keyword stuffing. `
      recommendation += 'Reduce keyword usage to avoid spam penalties. '
    }

    // Related keywords
    const relatedKeywords = ['ultima online', 'uo', 'buy', 'purchase', 'premium', 'quality']
    const foundKeywords = relatedKeywords.filter(keyword => allContent.includes(keyword))
    
    if (foundKeywords.length >= 3) {
      score += 3
      message += 'Good related keywords. '
      devExplanation += `✓ Found ${foundKeywords.length} related keywords: ${foundKeywords.join(', ')}. `
    } else if (foundKeywords.length >= 1) {
      score += 2
      message += 'Some related keywords. '
      devExplanation += `⚠ Found ${foundKeywords.length} related keywords: ${foundKeywords.join(', ')}. `
    } else {
      devExplanation += '✗ No related keywords found. '
      recommendation += 'Include related keywords like "buy", "premium", "quality". '
    }

    // Main keyword in description
    if (product.description.toLowerCase().includes(mainKeyword)) {
      score += 2
      message += 'Keyword in description. '
      devExplanation += '✓ Main keyword appears in description. '
    } else {
      devExplanation += '✗ Main keyword missing from description. '
      recommendation += 'Include main keyword in product description. '
    }

    // Keyword variations
    const variations = mainKeyword.split(' ').filter(word => word.length > 3)
    const foundVariations = variations.filter(variation => allContent.includes(variation))
    
    if (foundVariations.length > 0) {
      score += 1
      message += 'Uses keyword variations. '
      devExplanation += `✓ Found keyword variations: ${foundVariations.join(', ')}. `
    }

    if (score >= 8) status = 'excellent'
    else if (score >= 6) status = 'good'
    else if (score >= 4) status = 'warning'

    return {
      name: "Keyword Optimization",
      score,
      maxScore: 10,
      status,
      message: message || 'Keyword optimization needs work',
      devExplanation: `Main keyword: "${mainKeyword}", Density: ${density.toFixed(2)}%, Count: ${keywordCount}/${wordCount} words. ${devExplanation}`,
      codeLocation: 'Product name, description, short_description fields',
      expectedValue: '1-3% keyword density, 3+ related keywords',
      actualValue: `${density.toFixed(2)}% density, ${foundKeywords.length} related keywords`,
      recommendation
    }
  }

  const analyzeURLStructure = (): SEOFactor => {
    const slug = product.slug
    let score = 0
    let status: 'excellent' | 'good' | 'warning' | 'error' = 'error'
    let message = ''
    let devExplanation = ''
    let recommendation = ''

    if (!slug) {
      return {
        name: "URL Structure",
        score: 0,
        maxScore: 10,
        status: 'error',
        message: 'No URL slug',
        devExplanation: '✗ Product slug is empty or null.',
        codeLocation: 'Database field: slug',
        expectedValue: '3-50 chars, lowercase, hyphens, contains keywords',
        actualValue: 'null/empty',
        recommendation: 'Generate SEO-friendly slug from product name'
      }
    }

    // Length check
    if (slug.length >= 3 && slug.length <= 50) {
      score += 3
      message += 'Good length. '
      devExplanation += `✓ Slug length (${slug.length} chars) is optimal (3-50). `
    } else if (slug.length < 3) {
      score += 1
      message += 'Too short. '
      devExplanation += `⚠ Slug length (${slug.length} chars) is too short. `
      recommendation += 'Make slug more descriptive (3+ characters). '
    } else {
      score += 2
      message += 'May be too long. '
      devExplanation += `⚠ Slug length (${slug.length} chars) may be too long for optimal SEO. `
      recommendation += 'Consider shortening slug to under 50 characters. '
    }

    // Format check
    if (!slug.includes('_') && !slug.includes(' ')) {
      score += 2
      message += 'Clean format. '
      devExplanation += '✓ Uses hyphens instead of underscores/spaces. '
    } else {
      devExplanation += '⚠ Contains underscores or spaces. '
      recommendation += 'Use hyphens (-) instead of underscores (_) or spaces. '
    }

    // Keyword inclusion
    const expectedSlug = product.name.toLowerCase().replace(/\s+/g, '-')
    if (slug.includes(expectedSlug) || expectedSlug.includes(slug)) {
      score += 3
      message += 'Contains keywords. '
      devExplanation += '✓ Slug contains main product keywords. '
    } else {
      devExplanation += '✗ Slug doesn\'t contain main product keywords. '
      recommendation += 'Include main product keywords in slug. '
    }

    // Case check
    if (!slug.match(/[A-Z]/)) {
      score += 1
      message += 'Lowercase. '
      devExplanation += '✓ Uses lowercase letters. '
    } else {
      devExplanation += '⚠ Contains uppercase letters. '
      recommendation += 'Use only lowercase letters in URLs. '
    }

    // Numbers check
    if (!slug.match(/[0-9]/)) {
      score += 1
      message += 'No numbers. '
      devExplanation += '✓ Avoids numbers in URL. '
    }

    if (score >= 8) status = 'excellent'
    else if (score >= 6) status = 'good'
    else if (score >= 4) status = 'warning'

    return {
      name: "URL Structure",
      score,
      maxScore: 10,
      status,
      message: message || 'URL needs improvement',
      devExplanation: `Slug: "${slug}". ${devExplanation}`,
      codeLocation: 'Database field: slug, URL: /product/[slug]',
      expectedValue: 'lowercase-with-hyphens-containing-keywords',
      actualValue: slug,
      recommendation
    }
  }

  const analyzeImageOptimization = async (): Promise<SEOFactor> => {
    let score = 0
    let status: 'excellent' | 'good' | 'warning' | 'error' = 'error'
    let message = ''
    let devExplanation = ''
    let recommendation = ''

    if (!product.image_url) {
      return {
        name: "Image Optimization",
        score: 0,
        maxScore: 10,
        status: 'error',
        message: 'No image provided',
        devExplanation: '✗ Product image_url is empty or null.',
        codeLocation: 'Database field: image_url',
        expectedValue: 'Valid image URL with descriptive filename and alt text',
        actualValue: 'null/empty',
        recommendation: 'Add high-quality product image with descriptive filename'
      }
    }

    score += 3
    message += 'Image provided. '
    devExplanation += '✓ Product has image URL. '

    // Filename analysis
    if (product.image_url.includes(product.name.toLowerCase().replace(/\s+/g, '-'))) {
      score += 2
      message += 'Descriptive filename. '
      devExplanation += '✓ Image filename contains product keywords. '
    } else {
      devExplanation += '⚠ Image filename doesn\'t contain product keywords. '
      recommendation += 'Use descriptive filenames with product keywords. '
    }

    // File format check
    if (product.image_url.match(/\.(jpg|jpeg|png|webp)$/i)) {
      score += 2
      message += 'Good format. '
      devExplanation += '✓ Uses web-optimized image format. '
    } else {
      devExplanation += '⚠ Image format may not be optimized for web. '
      recommendation += 'Use JPG, PNG, or WebP format for better performance. '
    }

    // CDN/optimization check
    if (product.image_url.includes('cdn') || product.image_url.includes('optimized')) {
      score += 2
      message += 'Appears optimized. '
      devExplanation += '✓ Image appears to be served from CDN or optimized source. '
    } else {
      devExplanation += '⚠ Image may not be optimized for performance. '
      recommendation += 'Use CDN or image optimization service. '
    }

    // Alt text analysis (check DOM)
    const imageCheck = await checkImageAltText()
    setImageIssues(imageCheck.issues)
    
    if (imageCheck.totalImages === 0) {
      score += 1
      devExplanation += '⚠ No images found in DOM for alt text analysis. '
    } else if (imageCheck.imagesWithoutAlt === 0 && imageCheck.imagesWithGenericAlt === 0) {
      score += 3
      message += 'Good alt text. '
      devExplanation += '✓ All images have descriptive alt text. '
    } else if (imageCheck.imagesWithoutAlt === 0) {
      score += 2
      message += 'Has alt text. '
      devExplanation += '⚠ All images have alt text, but some are generic. '
      recommendation += 'Improve alt text to be more descriptive. '
    } else {
      devExplanation += `✗ ${imageCheck.imagesWithoutAlt} images missing alt text. `
      recommendation += 'Add descriptive alt text to all images. '
    }

    if (score >= 8) status = 'excellent'
    else if (score >= 6) status = 'good'
    else if (score >= 4) status = 'warning'

    return {
      name: "Image Optimization",
      score,
      maxScore: 10,
      status,
      message: message || 'Image optimization needs work',
      devExplanation: `Image URL: "${product.image_url}". ${devExplanation}`,
      codeLocation: 'components/ui/product-image.tsx, Image alt attributes',
      expectedValue: 'Optimized image with descriptive filename and alt text',
      actualValue: `${imageCheck.totalImages} images, ${imageCheck.imagesWithoutAlt} without alt`,
      recommendation
    }
  }

  const checkImageAltText = async () => {
    // Wait a bit more for images to load
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const issues: string[] = []
    const images = document.querySelectorAll('img')
    const nextImages = document.querySelectorAll('[data-nimg]')
    
    let imagesWithoutAlt = 0
    let imagesWithGenericAlt = 0
    let totalImages = images.length + nextImages.length
    
    // Check regular img tags
    images.forEach((img, index) => {
      const alt = img.getAttribute('alt')
      if (!alt || alt.trim() === '') {
        imagesWithoutAlt++
        issues.push(`Image ${index + 1}: Missing alt text`)
      } else if (isGenericAltText(alt)) {
        imagesWithGenericAlt++
        issues.push(`Image ${index + 1}: Generic alt text "${alt}"`)
      }
    })
    
    // Check Next.js images
    nextImages.forEach((img, index) => {
      const alt = img.getAttribute('alt')
      if (!alt || alt.trim() === '') {
        imagesWithoutAlt++
        issues.push(`Next.js Image ${index + 1}: Missing alt text`)
      } else if (isGenericAltText(alt)) {
        imagesWithGenericAlt++
        issues.push(`Next.js Image ${index + 1}: Generic alt text "${alt}"`)
      }
    })
    
    return { issues, imagesWithoutAlt, imagesWithGenericAlt, totalImages }
  }

  const isGenericAltText = (alt: string): boolean => {
    const trimmedAlt = alt.trim()
    const genericWords = [
      'image', 'photo', 'picture', 'img', 'pic', 'graphic', 'illustration',
      'banner', 'logo', 'icon', 'thumbnail', 'preview', 'placeholder'
    ]
    
    if (genericWords.includes(trimmedAlt.toLowerCase())) return true
    if (trimmedAlt.length < 3) return true
    if (/^[\d\s\-_\.]+$/.test(trimmedAlt)) return true
    
    // Product context is good
    if (trimmedAlt.toLowerCase().includes('ultima online') || 
        trimmedAlt.toLowerCase().includes('uo') ||
        trimmedAlt.toLowerCase().includes('item') ||
        trimmedAlt.toLowerCase().includes('product')) {
      return false
    }
    
    if (trimmedAlt.length >= 10) return false
    
    return false
  }

  // Additional analysis methods would continue here...
  // For brevity, I'll add the remaining methods in the next part

  const analyzeReadability = (): SEOFactor => {
    const content = product.description || ''
    if (!content) {
      return {
        name: "Readability",
        score: 0,
        maxScore: 10,
        status: 'error',
        message: 'No content to analyze',
        devExplanation: '✗ No description content available for readability analysis.',
        codeLocation: 'Database field: description',
        expectedValue: 'Readable content with 50+ Flesch score, <25 words/sentence',
        actualValue: 'No content',
        recommendation: 'Add readable product description'
      }
    }

    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0)
    const words = content.split(/\s+/).filter(w => w.length > 0)
    const avgWordsPerSentence = words.length / sentences.length

    // Gaming-friendly syllable counting
    const gamingTerms = ['ultima', 'online', 'spellbook', 'talisman', 'armor', 'weapon', 'equipment']
    const avgSyllablesPerWord = words.reduce((sum, word) => {
      const cleanWord = word.toLowerCase().replace(/[^a-z]/g, '')
      if (gamingTerms.some(term => cleanWord.includes(term) || term.includes(cleanWord))) {
        return sum + Math.max(1, Math.floor(countSyllables(word) * 0.7))
      }
      return sum + countSyllables(word)
    }, 0) / words.length

    const fleschScore = 206.835 - (1.015 * avgWordsPerSentence) - (84.6 * avgSyllablesPerWord)

    let score = 0
    let status: 'excellent' | 'good' | 'warning' | 'error' = 'error'
    let message = ''
    let devExplanation = ''
    let recommendation = ''

    // Flesch score analysis
    if (fleschScore >= 50) {
      score += 4
      message += 'Good readability. '
      devExplanation += `✓ Flesch Reading Ease score (${fleschScore.toFixed(1)}) is good for gaming content. `
    } else if (fleschScore >= 20) {
      score += 3
      message += 'Moderate readability. '
      devExplanation += `⚠ Flesch Reading Ease score (${fleschScore.toFixed(1)}) is moderate. `
      recommendation += 'Consider shorter sentences or simpler words. '
    } else {
      score += 2
      message += 'Complex content. '
      devExplanation += `⚠ Flesch Reading Ease score (${fleschScore.toFixed(1)}) indicates complex content. `
      recommendation += 'Simplify language and shorten sentences. '
    }

    // Sentence length
    if (avgWordsPerSentence <= 25) {
      score += 2
      message += 'Good sentence length. '
      devExplanation += `✓ Average sentence length (${avgWordsPerSentence.toFixed(1)} words) is optimal. `
    } else if (avgWordsPerSentence <= 35) {
      score += 1
      message += 'Acceptable sentence length. '
      devExplanation += `⚠ Average sentence length (${avgWordsPerSentence.toFixed(1)} words) is long. `
      recommendation += 'Break up long sentences. '
    } else {
      devExplanation += `✗ Average sentence length (${avgWordsPerSentence.toFixed(1)} words) is too long. `
      recommendation += 'Significantly shorten sentences for better readability. '
    }

    // Structure
    if (sentences.length >= 2) {
      score += 2
      message += 'Well-structured. '
      devExplanation += `✓ Content has ${sentences.length} sentences providing good structure. `
    } else {
      devExplanation += `⚠ Content has only ${sentences.length} sentence(s). `
      recommendation += 'Add more sentences for better structure. '
    }

    // Transition words
    const transitionWords = ['however', 'therefore', 'moreover', 'also', 'but', 'and', 'while', 'when', 'because']
    const hasTransitions = transitionWords.some(word => content.toLowerCase().includes(word))
    if (hasTransitions) {
      score += 1
      message += 'Uses transitions. '
      devExplanation += '✓ Content uses transition words for better flow. '
    }

    // Lists/structure
    if (content.includes('•') || content.includes('-') || content.includes('*') || content.includes('1.')) {
      score += 1
      message += 'Uses lists. '
      devExplanation += '✓ Content uses lists or bullet points for clarity. '
    }

    if (score >= 8) status = 'excellent'
    else if (score >= 6) status = 'good'
    else if (score >= 4) status = 'warning'

    return {
      name: "Readability",
      score,
      maxScore: 10,
      status,
      message: message || 'Readability needs improvement',
      devExplanation: `Flesch: ${fleschScore.toFixed(1)}, Avg words/sentence: ${avgWordsPerSentence.toFixed(1)}, Sentences: ${sentences.length}. ${devExplanation}`,
      codeLocation: 'Database field: description - content readability analysis',
      expectedValue: 'Flesch score 50+, <25 words/sentence, 2+ sentences',
      actualValue: `Flesch: ${fleschScore.toFixed(1)}, ${avgWordsPerSentence.toFixed(1)} words/sentence`,
      recommendation
    }
  }

  const countSyllables = (word: string) => {
    word = word.toLowerCase()
    if (word.length <= 3) return 1
    return word.replace(/[^aeiouy]/g, '').length || 1
  }

  const analyzeContentUniqueness = (): SEOFactor => {
    const content = product.description || ''
    if (!content) {
      return {
        name: "Content Uniqueness",
        score: 0,
        maxScore: 10,
        status: 'error',
        message: 'No content to analyze',
        devExplanation: '✗ No description content available for uniqueness analysis.',
        codeLocation: 'Database field: description',
        expectedValue: '70%+ unique words, specific product details, brand mentions',
        actualValue: 'No content',
        recommendation: 'Add unique, specific product content'
      }
    }

    let score = 0
    let status: 'excellent' | 'good' | 'warning' | 'error' = 'error'
    let message = ''
    let devExplanation = ''
    let recommendation = ''

    // Word uniqueness ratio
    const words = content.toLowerCase().split(/\s+/)
    const uniqueWords = new Set(words)
    const uniquenessRatio = uniqueWords.size / words.length

    if (uniquenessRatio >= 0.7) {
      score += 3
      message += 'High uniqueness. '
      devExplanation += `✓ Word uniqueness ratio (${(uniquenessRatio * 100).toFixed(1)}%) is excellent. `
    } else if (uniquenessRatio >= 0.5) {
      score += 2
      message += 'Moderate uniqueness. '
      devExplanation += `⚠ Word uniqueness ratio (${(uniquenessRatio * 100).toFixed(1)}%) is moderate. `
      recommendation += 'Add more varied vocabulary and specific details. '
    } else {
      score += 1
      message += 'Low uniqueness. '
      devExplanation += `✗ Word uniqueness ratio (${(uniquenessRatio * 100).toFixed(1)}%) is low. `
      recommendation += 'Significantly improve content uniqueness with specific details. '
    }

    // Specific product details
    if (content.includes('specific') || content.includes('unique') || content.includes('exclusive')) {
      score += 2
      message += 'Contains unique selling points. '
      devExplanation += '✓ Content highlights unique features or selling points. '
    } else {
      devExplanation += '✗ Content lacks unique selling points. '
      recommendation += 'Highlight what makes this product unique or special. '
    }

    // Brand-specific content
    if (content.includes('UO King') || content.includes('premium') || content.includes('quality')) {
      score += 2
      message += 'Brand-specific content. '
      devExplanation += '✓ Content includes brand-specific value propositions. '
    } else {
      devExplanation += '✗ Content lacks brand-specific messaging. '
      recommendation += 'Include brand value propositions like "premium quality" or "UO King exclusive". '
    }

    // Content length for uniqueness
    if (content.length >= 200) {
      score += 2
      message += 'Sufficient length. '
      devExplanation += `✓ Content length (${content.length} chars) allows for unique details. `
    } else {
      devExplanation += `⚠ Content length (${content.length} chars) limits uniqueness potential. `
      recommendation += 'Expand content to 200+ characters for more unique details. '
    }

    // Repetitive phrases check
    const phrases = content.toLowerCase().split(/[.!?]+/)
    const repeatedPhrases = phrases.filter((phrase, index) => phrases.indexOf(phrase) !== index)
    if (repeatedPhrases.length === 0) {
      score += 1
      message += 'No repetition. '
      devExplanation += '✓ No repetitive phrases detected. '
    } else {
      devExplanation += `⚠ ${repeatedPhrases.length} repetitive phrases found. `
      recommendation += 'Remove or rephrase repetitive content. '
    }

    if (score >= 8) status = 'excellent'
    else if (score >= 6) status = 'good'
    else if (score >= 4) status = 'warning'

    return {
      name: "Content Uniqueness",
      score,
      maxScore: 10,
      status,
      message: message || 'Content uniqueness needs improvement',
      devExplanation: `${uniqueWords.size}/${words.length} unique words (${(uniquenessRatio * 100).toFixed(1)}%). ${devExplanation}`,
      codeLocation: 'Database field: description - content analysis',
      expectedValue: '70%+ unique words, specific details, brand mentions',
      actualValue: `${(uniquenessRatio * 100).toFixed(1)}% unique words, ${content.length} chars`,
      recommendation
    }
  }

  const analyzeLinkingPotential = (): SEOFactor => {
    const content = product.description || ''
    if (!content) {
      return {
        name: "Internal Linking",
        score: 0,
        maxScore: 10,
        status: 'error',
        message: 'No content to analyze',
        devExplanation: '✗ No description content available for linking analysis.',
        codeLocation: 'Database field: description',
        expectedValue: 'References to guides, categories, related products',
        actualValue: 'No content',
        recommendation: 'Add content with linkable terms and category references'
      }
    }

    let score = 0
    let status: 'excellent' | 'good' | 'warning' | 'error' = 'error'
    let message = ''
    let devExplanation = ''
    let recommendation = ''

    // Linkable terms
    const linkableTerms = ['guide', 'tutorial', 'tips', 'strategy', 'build', 'class', 'skill', 'item', 'equipment']
    const foundTerms = linkableTerms.filter(term => content.toLowerCase().includes(term))
    
    if (foundTerms.length >= 3) {
      score += 3
      message += 'Good linking potential. '
      devExplanation += `✓ Found ${foundTerms.length} linkable terms: ${foundTerms.join(', ')}. `
    } else if (foundTerms.length >= 1) {
      score += 2
      message += 'Some linking opportunities. '
      devExplanation += `⚠ Found ${foundTerms.length} linkable terms: ${foundTerms.join(', ')}. `
      recommendation += 'Add more references to guides, tutorials, or related content. '
    } else {
      devExplanation += '✗ No linkable terms found. '
      recommendation += 'Include terms like "guide", "tutorial", "tips" that can link to related content. '
    }

    // Category mentions
    if (product.category_name && content.toLowerCase().includes(product.category_name.toLowerCase())) {
      score += 2
      message += 'Mentions category. '
      devExplanation += `✓ Content mentions category "${product.category_name}" for internal linking. `
    } else {
      devExplanation += `✗ Content doesn't mention category "${product.category_name || 'N/A'}". `
      recommendation += 'Mention the product category for internal linking opportunities. '
    }

    // Related product mentions
    if (content.includes('similar') || content.includes('related') || content.includes('also')) {
      score += 2
      message += 'Mentions related items. '
      devExplanation += '✓ Content references related or similar products. '
    } else {
      devExplanation += '✗ Content lacks references to related products. '
      recommendation += 'Mention similar or related products for cross-linking. '
    }

    // Guide/tutorial mentions
    if (content.includes('how to') || content.includes('guide') || content.includes('tutorial')) {
      score += 2
      message += 'References guides. '
      devExplanation += '✓ Content references guides or tutorials. '
    } else {
      devExplanation += '✗ Content lacks guide/tutorial references. '
      recommendation += 'Reference relevant guides or how-to content. '
    }

    // Brand mentions for internal linking
    if (content.includes('UO King') || content.includes('our store') || content.includes('our products')) {
      score += 1
      message += 'Brand mentions. '
      devExplanation += '✓ Content includes brand mentions for internal linking. '
    } else {
      devExplanation += '✗ Content lacks brand mentions. '
      recommendation += 'Include brand references like "UO King" or "our store". '
    }

    if (score >= 8) status = 'excellent'
    else if (score >= 6) status = 'good'
    else if (score >= 4) status = 'warning'

    return {
      name: "Internal Linking",
      score,
      maxScore: 10,
      status,
      message: message || 'Internal linking needs improvement',
      devExplanation: `Found terms: ${foundTerms.join(', ') || 'none'}. ${devExplanation}`,
      codeLocation: 'Database field: description - content analysis for linkable terms',
      expectedValue: '3+ linkable terms, category mentions, related product references',
      actualValue: `${foundTerms.length} linkable terms found`,
      recommendation
    }
  }

  const analyzeUserExperience = (): SEOFactor => {
    const content = product.description || ''
    const shortContent = product.short_description || ''

    let score = 0
    let status: 'excellent' | 'good' | 'warning' | 'error' = 'error'
    let message = ''
    let devExplanation = ''
    let recommendation = ''

    // Content structure
    if (content.includes('\n') || content.includes('•') || content.includes('-') || content.includes('.')) {
      score += 3
      message += 'Well-structured. '
      devExplanation += '✓ Content uses structured formatting (paragraphs, lists, or sentences). '
    } else if (content.length > 0) {
      score += 2
      message += 'Has structure. '
      devExplanation += '⚠ Content has basic structure but could be improved with formatting. '
      recommendation += 'Add bullet points, paragraphs, or better formatting. '
    } else {
      score += 1
      devExplanation += '✗ Content lacks structure and formatting. '
      recommendation += 'Add structured, formatted content. '
    }

    // Description completeness
    if (shortContent && content) {
      score += 3
      message += 'Complete descriptions. '
      devExplanation += '✓ Has both short and detailed descriptions for different contexts. '
    } else if (shortContent || content) {
      score += 2
      message += 'Has description. '
      devExplanation += '⚠ Has description content but missing either short or detailed version. '
      recommendation += 'Provide both short and detailed descriptions. '
    } else {
      score += 1
      devExplanation += '✗ Missing description content. '
      recommendation += 'Add both short and detailed product descriptions. '
    }

    // Action-oriented language
    const actionWords = ['buy', 'purchase', 'order', 'get', 'find', 'use', 'equip', 'wear', 'obtain', 'acquire']
    const hasActionWords = actionWords.some(word => content.toLowerCase().includes(word))
    
    if (hasActionWords) {
      score += 2
      message += 'Action-oriented. '
      devExplanation += '✓ Content uses action-oriented language encouraging user engagement. '
    } else if (content.length > 50) {
      score += 1
      message += 'Informative content. '
      devExplanation += '⚠ Content is informative but lacks action-oriented language. '
      recommendation += 'Include action words like "buy", "use", "equip" to encourage engagement. '
    } else {
      devExplanation += '✗ Content lacks action-oriented language. '
      recommendation += 'Add action words and calls-to-action. '
    }

    // Benefit-focused content
    const benefitWords = ['benefit', 'advantage', 'feature', 'quality', 'premium', 'powerful', 'useful', 'effective', 'magical', 'rare', 'unique']
    const hasBenefitWords = benefitWords.some(word => content.toLowerCase().includes(word))
    
    if (hasBenefitWords) {
      score += 2
      message += 'Benefit-focused. '
      devExplanation += '✓ Content highlights benefits and features effectively. '
    } else if (content.length > 30) {
      score += 1
      message += 'Descriptive content. '
      devExplanation += '⚠ Content is descriptive but could better highlight benefits. '
      recommendation += 'Emphasize key features, benefits, and unique qualities. '
    } else {
      devExplanation += '✗ Content lacks benefit-focused language. '
      recommendation += 'Highlight key features, benefits, and what makes the product valuable. '
    }

    if (score >= 8) status = 'excellent'
    else if (score >= 6) status = 'good'
    else if (score >= 4) status = 'warning'

    return {
      name: "User Experience",
      score,
      maxScore: 10,
      status,
      message: message || 'User experience needs improvement',
      devExplanation: `Content: ${content.length} chars, Short: ${shortContent.length} chars. ${devExplanation}`,
      codeLocation: 'Database fields: description, short_description - UX content analysis',
      expectedValue: 'Structured content, both descriptions, action words, benefit focus',
      actualValue: `${content.length + shortContent.length} total chars, ${hasActionWords ? 'has' : 'lacks'} action words`,
      recommendation
    }
  }

  // Render methods
  if (isLoading) {
    return (
      <div className="flex items-center space-x-2">
        <div className="w-8 h-2 bg-gray-200 rounded animate-pulse"></div>
        <span className="text-xs text-gray-500">...</span>
      </div>
    )
  }

  if (mode === 'compact') {
    return (
      <div className="flex items-center space-x-2">
        <Badge className={getScoreColor(overallScore!)}>
          {overallScore}/100
        </Badge>
        <div className="w-12">
          <Progress value={overallScore!} className="h-1" />
        </div>
      </div>
    )
  }

  // Detailed mode
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>SEO Analysis</span>
          <Badge variant="outline" className="text-lg font-semibold">
            {overallScore}/100
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {factors.map((factor, index) => (
          <div key={index} className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                {getStatusIcon(factor.status)}
                <h4 className="font-medium">{factor.name}</h4>
              </div>
              <div className="flex items-center space-x-2">
                <Badge className={getFactorScoreColor(factor.status)}>
                  {factor.score}/{factor.maxScore}
                </Badge>
                <div className="w-16">
                  <Progress value={(factor.score / factor.maxScore) * 100} className="h-1" />
                </div>
              </div>
            </div>
            
            <p className="text-sm text-gray-600 mb-2">{factor.message}</p>
            
            {showDevDetails && (
              <div className="space-y-2">
                <div className="p-3 bg-gray-50 rounded border">
                  <div className="flex items-center space-x-2 mb-2">
                    <Code className="h-4 w-4 text-blue-600" />
                    <span className="font-medium text-sm">Developer Details</span>
                  </div>
                  <p className="text-xs text-gray-700 mb-2">{factor.devExplanation}</p>
                  {factor.codeLocation && (
                    <p className="text-xs text-blue-600 font-mono">📁 {factor.codeLocation}</p>
                  )}
                  {factor.expectedValue && (
                    <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="font-medium text-green-700">Expected:</span>
                        <p className="text-gray-600">{factor.expectedValue}</p>
                      </div>
                      <div>
                        <span className="font-medium text-orange-700">Actual:</span>
                        <p className="text-gray-600">{factor.actualValue}</p>
                      </div>
                    </div>
                  )}
                </div>
                
                {factor.recommendation && (
                  <div className="flex items-start space-x-2 p-2 bg-amber-50 rounded border border-amber-200">
                    <Lightbulb className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-amber-800">{factor.recommendation}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
        
        {imageIssues.length > 0 && (
          <div className="p-4 bg-red-50 rounded border border-red-200">
            <h4 className="font-medium text-red-800 mb-2">Image Issues Found:</h4>
            <ul className="space-y-1">
              {imageIssues.map((issue, index) => (
                <li key={index} className="text-sm text-red-700">• {issue}</li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  )

  function getScoreColor(score: number) {
    if (score >= 80) return 'bg-green-100 text-green-800 border-green-200'
    if (score >= 60) return 'bg-blue-100 text-blue-800 border-blue-200'
    if (score >= 40) return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    return 'bg-red-100 text-red-800 border-red-200'
  }

  function getFactorScoreColor(status: string) {
    switch (status) {
      case 'excellent': return 'bg-green-100 text-green-800 border-green-200'
      case 'good': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'warning': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'error': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  function getStatusIcon(status: string) {
    switch (status) {
      case 'excellent': return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'good': return <CheckCircle className="h-4 w-4 text-blue-500" />
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case 'error': return <XCircle className="h-4 w-4 text-red-500" />
      default: return <AlertTriangle className="h-4 w-4 text-gray-500" />
    }
  }
}
