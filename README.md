# Biohacking Autoblog Generator

Automated blog post generator for biohacking/supplement content. Generates research-backed, human-like blog posts (target 75%+ human score on ZeroGPT) and publishes them to WordPress.

## Features

- 📝 **AI Content Generation** - Uses Claude Sonnet 4.5 via OpenRouter
- 🔬 **PubMed Research Integration** - Fetches real scientific papers
- 🔍 **SEO Keyword Research** - DataForSEO API (with mock fallback)
- 🤖 **AI Detection Testing** - ZeroGPT integration with retry logic
- 📰 **WordPress Publishing** - Direct API integration
- 📊 **Progress Tracking** - JSON file-based progress through 200+ supplements
- 🎯 **Human-Like Writing** - Optimized prompts for natural, conversational tone

## Quick Start

### 1. Install Dependencies

```bash
cd biohacking-autoblog
npm install
```

### 2. Configure Environment

Copy `.env.example` to `.env` and fill in your API keys:

```bash
cp .env.example .env
```

Required:
- `OPENROUTER_API_KEY` - Get from https://openrouter.ai
- `ZEROGPT_API_KEY` - Get from https://zerogpt.com
- `WORDPRESS_URL` - Your WordPress site URL
- `WORDPRESS_USERNAME` - Your WP username
- `WORDPRESS_APP_PASSWORD` - Generate in WP admin → Users → Application Passwords

Optional:
- `PUBMED_API_KEY` - Recommended to avoid rate limits
- `DATAFORSEO_USERNAME` / `DATAFORSEO_PASSWORD` - For real keyword data (uses mock data if not set)

### 3. Start the Server

```bash
npm start
```

Server runs on `http://localhost:3000`

## API Endpoints

### GET /progress
Get current progress through the supplement list

```bash
curl http://localhost:3000/progress
```

Response:
```json
{
  "success": true,
  "progress": {
    "lastIndex": 0,
    "lastSupplement": "Creatine Monohydrate",
    "lastGenerated": "2025-11-23T12:00:00.000Z",
    "totalGenerated": 1,
    "nextIndex": 1,
    "nextSupplement": "Beta-Alanine",
    "totalSupplements": 215,
    "percentComplete": "0.5"
  }
}
```

### POST /generate
Generate and publish the next supplement in rotation

```bash
# Generate and publish
curl -X POST http://localhost:3000/generate

# Dry run (skip WordPress publishing)
curl -X POST http://localhost:3000/generate \
  -H "Content-Type: application/json" \
  -d '{"dryRun": true}'

# Skip AI detection check (faster, for testing)
curl -X POST http://localhost:3000/generate \
  -H "Content-Type: application/json" \
  -d '{"skipAICheck": true}'
```

Response:
```json
{
  "success": true,
  "supplement": "Creatine Monohydrate",
  "title": "Creatine Monohydrate: Benefits, Research & What You Need to Know",
  "wordCount": 1750,
  "humanScore": 78,
  "aiScore": 22,
  "attempts": 2,
  "passedThreshold": true,
  "wordpressPostId": 123,
  "wordpressPostUrl": "https://yourblog.com/creatine-monohydrate",
  "progress": {
    "lastIndex": 0,
    "nextSupplement": "Beta-Alanine"
  }
}
```

### POST /generate/:supplement
Generate specific supplement by name

```bash
curl -X POST http://localhost:3000/generate/Ashwagandha
```

### DELETE /progress
Reset progress to start from the beginning

```bash
curl -X DELETE http://localhost:3000/progress
```

## How It Works

1. **Research Phase**
   - Fetches 20 PubMed research papers about the supplement
   - Gets keyword data from DataForSEO (or uses mock data)

2. **Generation Phase**
   - Sends research data to Claude Sonnet 4.5
   - Uses optimized prompt for human-like, conversational writing
   - Targets 1,500-1,800 words per post

3. **AI Detection Phase** (optional)
   - Tests content with ZeroGPT API
   - Retries up to 3 times if below 75% human score
   - Returns best result even if target not met

4. **Publishing Phase**
   - Publishes to WordPress via REST API
   - Sets title, content, meta description
   - Includes Yoast SEO meta fields

## Supplement List

Includes 215 biohacking supplements across categories:
- Energy & Performance
- Muscle Building & Recovery
- Cognitive Enhancement
- Hormonal Optimization
- Gut Health & Digestion
- Sleep & Relaxation
- Longevity & Anti-Aging
- Immune Support
- Metabolic Health

See `lib/supplements-list.js` for the complete list.

## Deployment

### Railway

1. Create new project in Railway
2. Add environment variables from `.env`
3. Deploy from GitHub
4. Set up cron job to hit `/generate` endpoint (e.g., twice daily)

### Other Platforms

Works on any Node.js hosting platform (Render, Fly.io, Heroku, etc.)

## Customization

### Change Writing Style

Edit the system prompt in `lib/content-generator.js` to adjust:
- Tone (casual vs professional)
- Reading level
- Structure/format
- Citation style

### Change Supplement List

Edit `lib/supplements-list.js` to add/remove supplements

### Change WordPress Fields

Edit `lib/wordpress.js` to customize post fields, categories, tags, etc.

## Cost Estimates

Per post (approximate):
- Claude Sonnet 4.5: $0.15-0.25
- DataForSEO (optional): $0.002
- ZeroGPT: $0.01
- PubMed: Free

Total: ~$0.16-0.26 per post

## Troubleshooting

### "WordPress credentials not configured"
Make sure `.env` has all three WordPress variables set

### "OPENROUTER_API_KEY not configured"
Add your OpenRouter API key to `.env`

### Low human scores (<75%)
- Check ZeroGPT API key is valid
- Retry will automatically attempt up to 3 times
- Consider adjusting prompt in `content-generator.js`

### PubMed rate limits
Add `PUBMED_API_KEY` to `.env` to increase limits

## License

MIT

## Support

For issues or questions, open a GitHub issue.
