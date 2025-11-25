# Multi-Site Autoblog Framework

This codebase is a **template** that can be deployed to 4 different niches with different personas, tones, and topic lists.

---

## The 4 Sites

| Site | Persona | Audience | Tone | Topics |
|------|---------|----------|------|--------|
| **Biohacking Health** | Alex (38, ex-engineer biohacker) | Gym bros, optimizers | Casual bro-talk | 225 supplements |
| **TKO Vitality** | Telehealth advisor | Weight loss seekers | Professional but warm | Tirzepatide, Sermorelin, NAD+, BHRT |
| **Vitality Products Online** | Wellness advisor | Health-conscious shoppers | Friendly, trustworthy | Supplements, wellness products |
| **Champion Peptides** | Research peptide expert | Researchers, biohackers | Scientific but accessible | 50+ peptides (BPC-157, TB-500, etc.) |

---

## How to Clone for a New Site

### 1. Copy the Project

```bash
cp -r biohacking-autoblog [new-site-name]-autoblog
cd [new-site-name]-autoblog
```

### 2. Update These Files

| File | What to Change |
|------|----------------|
| `.env` | WordPress URL, credentials, API keys |
| `lib/supplements-list.js` | Topic list (rename to `topics-list.js`) |
| `lib/persona.js` | Persona backstory and anecdotes |
| `lib/content-generator.js` | System prompt, title formulas, tone |
| `lib/internal-links.js` | URL patterns for internal linking |
| `package.json` | Project name |

### 3. Test

```bash
npm start
curl -X POST http://localhost:3000/generate -H "Content-Type: application/json" -d '{"dryRun": true, "skipAICheck": true}'
```

---

## Site-Specific Configurations

### 1. Biohacking Health (Current)

**Persona:** Alex, 38, burned-out software engineer turned biohacker
**Tone:** Casual bro-to-bro, "dude", "real talk", gym references
**Topics:** 225 supplements (Creatine, Ashwagandha, Lion's Mane, etc.)
**WordPress:** https://biohackinghealth.org

**Title Formulas:**
1. "I Wasted $X on [Supplement] Before Learning This"
2. "What Nobody Tells You About [Supplement]"
3. "[Supplement]: The Mistake 90% of People Make"
4. "Why Your [Supplement] Isn't Working"

**Key Phrases:**
- "dude", "man", "real talk", "not gonna lie"
- "I'm not a doctor", "talk to your doctor"
- "stacking", "protocol", "dialing in"

---

### 2. TKO Vitality (Telehealth)

**Persona:** Knowledgeable telehealth advisor focused on transformation
**Tone:** Professional but approachable, empowering, results-focused
**Topics:** Tirzepatide, Semaglutide, Sermorelin, NAD+, BHRT, Testosterone
**WordPress:** https://tkovitality.co

**Title Formulas:**
1. "[Treatment]: Medical Weight Loss That Actually Works"
2. "What [Treatment] Does (And What to Expect)"
3. "[Treatment] Through Telehealth: Is It Right for You?"
4. "Real Results: How [Treatment] Changed Everything"

**Key Phrases:**
- "from the comfort of home", "licensed providers"
- "medical-grade therapy", "personalized treatment"
- "transformation", "feel like yourself again"
- "video consultation", "delivered to your door"

**Structure:**
- What it does (simple science)
- Why telehealth
- How treatment works
- Real patient results
- What your doctor considers
- Side effects
- FAQ
- Bottom line

---

### 3. Vitality Products Online (E-commerce)

**Persona:** Helpful wellness advisor
**Tone:** Friendly, informative, trustworthy (not salesy)
**Topics:** Supplements, wellness products, vitamins, health tools
**WordPress:** https://vitalityproductsonline.com (TBD)

**Title Formulas:**
1. "[Product]: A Natural Way to Support [Benefit]"
2. "Why [Product] Might Be What You're Missing"
3. "[Product] Benefits: What the Research Says"
4. "Choosing the Right [Product]: Your Complete Guide"

**Key Phrases:**
- "support your wellness", "feel your best"
- "quality ingredients", "third-party tested"
- "part of a healthy lifestyle"
- "natural support", "holistic health"

---

### 4. Champion Peptides (Research)

**Persona:** Research peptide expert (scientific but accessible)
**Tone:** Educational, scientific credibility, RPO/RUO positioning
**Topics:** BPC-157, TB-500, Ipamorelin, CJC-1295, Sermorelin, GHK-Cu, etc.
**WordPress:** https://championpeptides.com

**Title Formulas:**
1. "[Peptide]: What the Research Actually Shows"
2. "Understanding [Peptide]: Mechanism and Studies"
3. "[Peptide] Research: Complete Scientific Review"
4. "[Peptide] vs [Other]: What Studies Tell Us"

**Key Phrases:**
- "research shows", "studies indicate"
- "for research purposes only"
- "mechanism of action", "bioavailability"
- "clinical trials", "PMID references"

**Disclaimer Required:**
- "For research purposes only"
- "Not for human consumption"
- "Consult research literature"

---

## Creating a New Site Config

Create `lib/site-config.js`:

```javascript
export const SITE_CONFIGS = {
  biohacking: {
    name: 'Biohacking Health',
    persona: 'Alex, 38, biohacker',
    wordpress_url: process.env.WORDPRESS_BIOHACKING_URL,
    topics_file: './topics/biohacking-supplements.js',
    tone: 'casual-bro',
    word_count: { min: 1500, max: 1800 },
    title_formulas: [
      "I Wasted $X on {topic} Before Learning This",
      "What Nobody Tells You About {topic}",
      "{topic}: The Mistake 90% of People Make",
    ]
  },
  tko: {
    name: 'TKO Vitality',
    persona: 'Telehealth advisor',
    wordpress_url: process.env.WORDPRESS_TKO_URL,
    topics_file: './topics/tko-treatments.js',
    tone: 'professional-warm',
    word_count: { min: 1400, max: 1700 },
    title_formulas: [
      "{topic}: Medical Treatment That Works",
      "What {topic} Does (And What to Expect)",
      "{topic} Through Telehealth: Is It Right for You?",
    ]
  },
  // ... more sites
};
```

---

## Environment Variables (Multi-Site)

```env
# OpenRouter (shared)
OPENROUTER_API_KEY=sk-or-v1-xxx

# ZeroGPT (shared)
ZEROGPT_API_KEY=xxx

# DataForSEO (shared)
DATAFORSEO_USERNAME=xxx
DATAFORSEO_PASSWORD=xxx

# WordPress - Biohacking Health
WORDPRESS_BIOHACKING_URL=https://biohackinghealth.org
WORDPRESS_BIOHACKING_USERNAME=xxx
WORDPRESS_BIOHACKING_APP_PASSWORD=xxx

# WordPress - TKO Vitality
WORDPRESS_TKO_URL=https://tkovitality.co
WORDPRESS_TKO_USERNAME=xxx
WORDPRESS_TKO_APP_PASSWORD=xxx

# WordPress - Vitality Products
WORDPRESS_VITALITY_URL=https://vitalityproductsonline.com
WORDPRESS_VITALITY_USERNAME=xxx
WORDPRESS_VITALITY_APP_PASSWORD=xxx

# WordPress - Champion Peptides
WORDPRESS_CHAMPION_URL=https://championpeptides.com
WORDPRESS_CHAMPION_USERNAME=xxx
WORDPRESS_CHAMPION_APP_PASSWORD=xxx
```

---

## Quick Deploy Checklist

For each new site:

- [ ] Copy project folder
- [ ] Update `.env` with new WordPress credentials
- [ ] Create topic list in `lib/supplements-list.js`
- [ ] Update persona in `lib/persona.js`
- [ ] Update system prompt in `lib/content-generator.js`
- [ ] Update title formulas
- [ ] Update internal links patterns
- [ ] Test with dry run
- [ ] Deploy to Railway
- [ ] Set up cron jobs

---

## Cost Per Site

| Item | Cost |
|------|------|
| OpenRouter (Claude) | ~$0.15-0.25/post |
| ZeroGPT | ~$0.01/post |
| DataForSEO | ~$0.002/post |
| Railway hosting | ~$5-10/month |
| **Total (2 posts/day)** | **~$15-25/month** |

**4 sites = ~$60-100/month total**

---

## Architecture Decision

**Option A: Separate deployments (Current)**
- Each site is its own Node.js app
- Independent progress tracking
- Can scale/adjust individually
- Simpler to manage

**Option B: Single multi-site deployment**
- One codebase, site selector in API
- Shared infrastructure
- More complex routing
- Better for large scale

**Recommendation:** Start with Option A (separate deployments), migrate to Option B when managing 5+ sites.
