/**
 * SEO Verification Script
 *
 * This script verifies that all SEO fixes are working correctly.
 * Run this after deployment to ensure everything is set up properly.
 *
 * Usage:
 *   node scripts/verify-seo-fixes.js
 */

const https = require('https')
const http = require('http')

const DOMAIN = process.env.NEXT_PUBLIC_BASE_URL || 'https://uoking.com'
const USE_HTTPS = DOMAIN.startsWith('https')

// Helper to make HTTP requests
function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    const client = USE_HTTPS ? https : http

    client.get(url, (res) => {
      let data = ''

      res.on('data', (chunk) => {
        data += chunk
      })

      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          body: data,
          headers: res.headers
        })
      })
    }).on('error', (err) => {
      reject(err)
    })
  })
}

// Test functions
async function testRobotsTxt() {
  console.log('\n🤖 Testing robots.txt...')

  try {
    const response = await fetchUrl(`${DOMAIN}/robots.txt`)

    if (response.statusCode === 200) {
      console.log('✅ robots.txt exists')

      if (response.body.includes('Sitemap:')) {
        console.log('✅ Sitemap reference found')
      } else {
        console.log('❌ Missing sitemap reference')
      }

      if (response.body.includes('Allow: /')) {
        console.log('✅ Allowing crawling')
      } else {
        console.log('⚠️  No explicit allow directive')
      }

      if (response.body.includes('Disallow: /api/')) {
        console.log('✅ API routes protected')
      }

      if (response.body.includes('Disallow: /admin/')) {
        console.log('✅ Admin routes protected')
      }

      return true
    } else {
      console.log(`❌ robots.txt returned ${response.statusCode}`)
      return false
    }
  } catch (error) {
    console.log(`❌ Error fetching robots.txt: ${error.message}`)
    return false
  }
}

async function testSitemap() {
  console.log('\n🗺️  Testing sitemap.xml...')

  try {
    const response = await fetchUrl(`${DOMAIN}/sitemap.xml`)

    if (response.statusCode === 200) {
      console.log('✅ sitemap.xml exists')

      if (response.headers['content-type']?.includes('xml')) {
        console.log('✅ Correct content type (XML)')
      } else {
        console.log('⚠️  Content type might be wrong:', response.headers['content-type'])
      }

      if (response.body.includes('<urlset')) {
        console.log('✅ Valid XML sitemap structure')
      } else {
        console.log('❌ Invalid sitemap structure')
      }

      if (response.body.includes('/product/')) {
        console.log('✅ Contains product URLs')
      } else {
        console.log('⚠️  No product URLs found')
      }

      const urlCount = (response.body.match(/<url>/g) || []).length
      console.log(`📊 Found ${urlCount} URLs in sitemap`)

      return true
    } else {
      console.log(`❌ sitemap.xml returned ${response.statusCode}`)
      return false
    }
  } catch (error) {
    console.log(`❌ Error fetching sitemap.xml: ${error.message}`)
    return false
  }
}

async function testProductPage() {
  console.log('\n📦 Testing product page metadata...')

  // Test with a sample product slug
  const testSlug = 'corrupted-paladin-vambraces'

  try {
    const response = await fetchUrl(`${DOMAIN}/product/${testSlug}`)

    if (response.statusCode === 200) {
      console.log('✅ Product page loads')

      // Check for robots meta tag
      if (response.body.includes('name="robots"')) {
        if (response.body.includes('content="index') || response.body.includes('content="all')) {
          console.log('✅ Indexing is ENABLED')
        } else if (response.body.includes('content="noindex')) {
          console.log('❌ WARNING: Indexing is BLOCKED!')
          console.log('   This means Google won\'t index this page.')
        }
      } else {
        console.log('⚠️  No robots meta tag found (will default to index)')
      }

      // Check for structured data
      if (response.body.includes('application/ld+json')) {
        console.log('✅ Structured data (JSON-LD) present')

        if (response.body.includes('"@type":"Product"')) {
          console.log('✅ Product schema found')
        }

        if (response.body.includes('"@type":"BreadcrumbList"')) {
          console.log('✅ Breadcrumb schema found')
        }
      } else {
        console.log('❌ No structured data found')
      }

      // Check for Open Graph tags
      if (response.body.includes('property="og:')) {
        console.log('✅ Open Graph tags present')
      } else {
        console.log('❌ Missing Open Graph tags')
      }

      // Check for canonical URL
      if (response.body.includes('rel="canonical"')) {
        console.log('✅ Canonical URL set')
      } else {
        console.log('⚠️  No canonical URL')
      }

      return true
    } else {
      console.log(`❌ Product page returned ${response.statusCode}`)
      return false
    }
  } catch (error) {
    console.log(`❌ Error fetching product page: ${error.message}`)
    return false
  }
}

async function testMetadataBase() {
  console.log('\n🌐 Testing base URL configuration...')

  console.log(`Current NEXT_PUBLIC_BASE_URL: ${DOMAIN}`)

  if (DOMAIN === 'http://localhost:3000') {
    console.log('⚠️  WARNING: Using localhost URL')
    console.log('   Make sure to set NEXT_PUBLIC_BASE_URL=https://uoking.com in production!')
    return false
  } else if (DOMAIN.startsWith('https://')) {
    console.log('✅ Using production HTTPS URL')
    return true
  } else {
    console.log('⚠️  Using non-standard URL:', DOMAIN)
    return false
  }
}

// Main verification function
async function runVerification() {
  console.log('🔍 SEO Verification Tool')
  console.log('========================\n')
  console.log(`Testing domain: ${DOMAIN}\n`)

  const results = {
    robotsTxt: await testRobotsTxt(),
    sitemap: await testSitemap(),
    productPage: await testProductPage(),
    metadataBase: await testMetadataBase()
  }

  console.log('\n========================')
  console.log('📊 Verification Summary')
  console.log('========================\n')

  const passed = Object.values(results).filter(r => r === true).length
  const total = Object.keys(results).length

  console.log(`robots.txt: ${results.robotsTxt ? '✅' : '❌'}`)
  console.log(`sitemap.xml: ${results.sitemap ? '✅' : '❌'}`)
  console.log(`Product Pages: ${results.productPage ? '✅' : '❌'}`)
  console.log(`Base URL Config: ${results.metadataBase ? '✅' : '❌'}`)

  console.log(`\nScore: ${passed}/${total} passed`)

  if (passed === total) {
    console.log('\n🎉 All SEO checks passed!')
    console.log('\nNext steps:')
    console.log('1. Submit sitemap to Google Search Console')
    console.log('2. Request indexing for key product pages')
    console.log('3. Monitor coverage in GSC over the next few days')
  } else {
    console.log('\n⚠️  Some checks failed. Review the output above.')
    console.log('\nCommon fixes:')
    console.log('- Ensure you\'ve deployed the latest changes')
    console.log('- Set NEXT_PUBLIC_BASE_URL in Vercel environment variables')
    console.log('- Rebuild the application after changing env vars')
  }

  console.log('\n')
}

// Run the verification
runVerification().catch(console.error)
