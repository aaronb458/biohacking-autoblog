# Deployment Guide - Biohacking Autoblog

## Railway vs Vercel - Recommendation

**Use Railway** for this project because:

1. ✅ **Long-Running Requests** - Content generation takes 2-4 minutes (PubMed → Keywords → AI Generation → ZeroGPT → WordPress). Railway handles this perfectly with 500s timeout.
2. ✅ **Background Processing** - Can run scheduled cron jobs easily
3. ✅ **Persistent Storage** - progress.json and published-posts.json persist across deployments
4. ✅ **No Serverless Limits** - Vercel has 10s timeout on Hobby, 300s on Pro (not enough)
5. ✅ **Simple** - Deploy from GitHub, set env vars, done

**Why NOT Vercel:**
- ❌ Serverless functions timeout too quickly (10s Hobby, 300s Pro)
- ❌ No persistent file storage (would need external database)
- ❌ More complex for long-running processes

## Railway Deployment Steps

### 1. Push to GitHub

```bash
cd /Users/aaronbeadles/projects/biohacking-autoblog
git init
git add .
git commit -m "Initial commit - Viral biohacking autoblog with PIMP framework"
git branch -M main
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

### 2. Deploy to Railway

1. Go to https://railway.app
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your `biohacking-autoblog` repository
4. Railway will auto-detect Node.js and use `npm start`

### 3. Add Environment Variables

In Railway project settings → Variables, add:

```
OPENROUTER_API_KEY=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
ZEROGPT_API_KEY=a7d3d9bb-2aed-4078-b538-a368c8f14e81
WORDPRESS_URL=https://biohackinghealth.org
WORDPRESS_USERNAME=aaron@tkovitality.co
WORDPRESS_APP_PASSWORD=2204 WYe6 2ff5 ESd7 SbVZ lEaB
DATAFORSEO_USERNAME=aaron@activesolutions.ai
DATAFORSEO_PASSWORD=eac662504d4e37dc
PORT=3000
NODE_ENV=production
```

### 4. Get Your Railway URL

After deployment, Railway will give you a URL like:
`https://biohacking-autoblog-production.up.railway.app`

### 5. Set Up Cron Jobs

Use cron-job.org or EasyCron to hit your endpoints:

**Morning Post (9 AM PST):**
- URL: `https://your-railway-url.up.railway.app/generate`
- Method: POST
- Schedule: `0 9 * * *` (9 AM daily)
- Headers: `Content-Type: application/json`
- Body: `{}`

**Afternoon Post (4 PM PST):**
- URL: `https://your-railway-url.up.railway.app/generate`
- Method: POST
- Schedule: `0 16 * * *` (4 PM daily)
- Headers: `Content-Type: application/json`
- Body: `{}`

## Alternative: cron-job.org Setup

1. Go to https://cron-job.org
2. Create account
3. Create new cron job:
   - Title: "Biohacking Morning Post"
   - URL: `https://your-railway-url/generate`
   - Schedule: Every day at 9:00 AM PST
   - Request method: POST
   - Request body: `{}`
   - Headers: Add `Content-Type: application/json`
4. Repeat for afternoon post at 4:00 PM

## Testing Your Deployment

### Test Progress Endpoint
```bash
curl https://your-railway-url.up.railway.app/progress
```

### Test Generation (Dry Run)
```bash
curl -X POST https://your-railway-url.up.railway.app/generate \
  -H "Content-Type: application/json" \
  -d '{"dryRun": true, "skipAICheck": true}'
```

This will test the full workflow without actually publishing to WordPress.

### Test Specific Supplement
```bash
curl -X POST https://your-railway-url.up.railway.app/generate/Ashwagandha \
  -H "Content-Type: application/json" \
  -d '{"dryRun": true}'
```

## Monitoring

Railway provides:
- **Logs** - Real-time logs of all requests and generations
- **Metrics** - CPU, memory, network usage
- **Deployments** - Track all deployments and rollback if needed

Check logs to see:
- Each API call
- PubMed research fetching
- Keyword research
- Content generation
- ZeroGPT scores
- WordPress publishing

## Cost Estimate (Railway)

- **Railway Hobby Plan**: $5/month
  - Includes $5 of usage credits
  - Additional usage: $0.000463/GB-hour RAM, $0.000231/vCPU-hour

- **Expected Usage** (2 posts/day):
  - ~$5-10/month on Railway
  - ~$10-20/month on AI APIs (OpenRouter + ZeroGPT)
  - **Total: ~$15-30/month**

## Scaling

**To increase posting frequency:**

1. Add more cron jobs (e.g., 3x daily = 90 posts/month)
2. No code changes needed
3. Just hit `/generate` endpoint more often

**To post to multiple WordPress sites:**

1. Duplicate the workflow in `workflow.js`
2. Add additional WordPress credentials
3. Call both workflows in sequence

## Troubleshooting

### "Connection timeout" on cron job
- Generation takes 2-4 minutes, set cron job timeout to 300s minimum
- Check Railway logs to see if generation succeeded (cron might timeout but Railway continues)

### Low human scores (<75%)
- Check Railway logs for ZeroGPT scores
- Retry logic already built in (3 attempts)
- If consistently low, adjust prompt in `content-generator.js`

### WordPress publishing fails
- Verify WordPress credentials in Railway env vars
- Check WordPress Application Password hasn't expired
- Ensure WordPress user has publishing permissions

## Next Steps

1. ✅ Deploy to Railway
2. ✅ Set up cron jobs
3. ✅ Test with one supplement
4. ✅ Monitor first few posts
5. ✅ Adjust persona/framework if needed
6. 🚀 Scale to 2-3 posts/day
