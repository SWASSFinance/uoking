# AI Analysis Feature Setup

## Overview
The AI Analysis feature allows you to get market insights, pricing recommendations, and competitive analysis for your Ultima Online products using OpenAI's GPT-4.

## Setup Instructions

### 1. Environment Configuration
Add your OpenAI API key to your environment file:

```bash
# Add to .env.local or your environment configuration
```

### 2. How to Use

1. **Navigate to Admin Products**: Go to `/admin/products` in your admin panel
2. **Edit a Product**: Click the "Edit" button on any product
3. **Click "Ask AI"**: In the edit modal, click the purple "Ask AI" button in the header
4. **Wait for Analysis**: The AI will research Ultima Online market data and competitors
5. **Review Results**: Get comprehensive analysis including:
   - Market research and competitor pricing
   - Price analysis and recommendations
   - Content analysis and improvements
   - Competitive insights
   - Actionable recommendations

### 3. Features

- **Market Research**: Finds similar products on other UO websites (excludes uoking.com)
- **Price Analysis**: Compares your pricing with competitors
- **Content Analysis**: Evaluates product descriptions and suggests improvements
- **Competitive Insights**: Identifies what competitors do well
- **Recommendations**: Provides specific actionable advice

### 4. API Endpoint

The feature uses the endpoint: `/api/admin/products/ai-analysis`

**Request Body:**
```json
{
  "productName": "Product Name",
  "productPrice": "10.00",
  "productDescription": "Product description...",
  "productType": "item"
}
```

**Response:**
```json
{
  "success": true,
  "analysis": "Detailed AI analysis...",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "productName": "Product Name",
  "productPrice": "10.00"
}
```

### 5. Components

- **AIAnalysisModal**: Main component for displaying analysis results
- **API Route**: `/app/api/admin/products/ai-analysis/route.ts`
- **Integration**: Added to products admin page with "Ask AI" button

### 6. Error Handling

The feature includes comprehensive error handling for:
- Missing OpenAI API key
- API rate limits
- Network errors
- Invalid responses

### 7. Security

- API key is stored securely in environment variables
- No sensitive data is logged
- Requests are validated before processing

## Troubleshooting

### Common Issues

1. **"OpenAI API key not configured"**
   - Ensure OPENAI environment variable is set
   - Restart your development server after adding the key

2. **"Failed to get AI analysis"**
   - Check your OpenAI API key is valid
   - Verify you have sufficient API credits
   - Check network connectivity

3. **"No analysis received from AI"**
   - The AI response was empty
   - Try again or check OpenAI service status

### Support

If you encounter issues, check:
1. Environment variables are properly set
2. OpenAI API key is valid and has credits
3. Network connectivity to OpenAI API
4. Console logs for detailed error messages
