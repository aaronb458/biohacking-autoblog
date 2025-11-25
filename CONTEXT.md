# Project Context: Biohacking Autoblog

> **Last Updated:** 2025-11-24
>
> This file contains the essential knowledge about this project.

---

## Overview

**Project Name:** Biohacking Autoblog Generator
**Purpose:** Automated blog post generator for biohacking/supplement content. Generates research-backed, human-like blog posts (target 75%+ human score on ZeroGPT) and publishes to WordPress.
**Tech Stack:** Node.js, Express.js, ES Modules
**Target Site:** https://biohackinghealth.org

---

## Project Structure

```
biohacking-autoblog/
├── server.js           # Express API server (main entry)
├── lib/
│   ├── content-generator.js  # Claude Sonnet 4.5 content generation
│   ├── workflow.js           # Main workflow: Research → Generate → Publish
│   ├── pubmed.js             # PubMed research paper fetching
│   ├── dataforseo.js         # Keyword research API
│   ├── zerogpt.js            # AI detection checking
│   ├── wordpress.js          # WordPress REST API publishing
│   ├── humanizer.js          # Post-processing to reduce AI detection
│   ├── persona.js            # "Alex" persona context & anecdotes
│   ├── internal-links.js     # Cross-linking between posts
│   ├── supplements-list.js   # 225 supplements to generate
│   ├── progress.js           # Track position in supplement list
│   └── logger.js             # Pino logger
├── progress.json       # Current progress state
├── published-posts.json # Published posts for internal linking
└── .env                # API keys (gitignored)
```

---

## Key Patterns & Conventions

### Content Generation
- **Persona:** Alex, 38, burned-out software engineer turned biohacker
- **Tone:** Casual, bro-to-dude conversation, NOT medical advice
- **Word Count:** 1,500-1,800 words per post
- **AI Detection Target:** 75%+ human score on ZeroGPT
- **Retry Logic:** Up to 3 attempts with increasing temperature (0.78 → 0.88)

### Title Formulas (Rotate for variety)
1. "I [Screwed Up/Wasted $$] on [Supplement] Before Learning This"
2. "What Nobody Tells You About [Supplement]"
3. "[Supplement]: The Mistake 90% of People Make"
4. "Why Your [Supplement] Isn't Working"
5. "The [Supplement] Protocol Nobody Talks About"

### Output Format
- **HTML only** - No markdown in final output
- Posts auto-convert markdown → HTML if Claude outputs markdown
- Saved as **drafts** in WordPress (not auto-published)

---

## Current State

### ✅ Completed
- Full content generation pipeline
- PubMed research integration (20 papers per supplement)
- DataForSEO keyword research
- ZeroGPT AI detection with retry logic
- WordPress draft publishing
- 225 supplement list organized by category
- GitHub Actions cron jobs (9am & 4pm PST)

### 🚧 Recent Work (Nov 24-25)
- Fixed OpenRouter API key
- Changed from publish → draft status
- Added 8 title formula variations
- Added aggressive markdown → HTML conversion
- Created multi-site framework (4 sites total)
- Added railway.json for Railway deployment
- Added .gitignore to protect API keys

### 📋 Related Projects
This is part of a 4-site autoblog framework:
1. **biohacking-autoblog** - biohackinghealth.org (Alex persona)
2. **tko-autoblog** - tkovitality.co (Friendly doc persona)
3. **champion-peptides-autoblog** - championpeptides.com (Dr. Logan scientific)
4. **vitality-products-autoblog** - vitalityproductsonline.com (Wellness advisor)

### 📋 Known Issues
- Some posts still have markdown formatting (generated before fix)
- Title variety not fully working (still using same pattern)
- biohackinghealth.org site currently down

---

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | API info |
| `/progress` | GET | Current progress through supplement list |
| `/generate` | POST | Generate next supplement (options: dryRun, skipAICheck) |
| `/generate/:supplement` | POST | Generate specific supplement |
| `/progress` | DELETE | Reset progress to start |

---

## Environment Variables

```
OPENROUTER_API_KEY     # Claude Sonnet 4.5 via OpenRouter
ZEROGPT_API_KEY        # AI detection API
WORDPRESS_URL          # Target WordPress site
WORDPRESS_USERNAME     # WP username
WORDPRESS_APP_PASSWORD # WP application password
DATAFORSEO_USERNAME    # Keyword research (optional)
DATAFORSEO_PASSWORD    # Keyword research (optional)
```

---

## Notes for Claude

### When Working on This Project:
1. All paths should use `/Users/aaronbeadles/projects/biohacking-autoblog`
2. Server runs on port 3000 - check if already running before starting
3. Never commit API keys - they're in .env (gitignored)
4. Posts save as **drafts** - user reviews before publishing
5. Content must output clean HTML, not markdown

### Common Tasks:
- Start server: `cd /Users/aaronbeadles/projects/biohacking-autoblog && npm start`
- Generate post: `curl -X POST http://localhost:3000/generate -H "Content-Type: application/json" -d '{"skipAICheck": true}'`
- Check progress: `curl http://localhost:3000/progress`

---

*This context file is maintained automatically.*
*Last auto-update: 2025-11-24*
