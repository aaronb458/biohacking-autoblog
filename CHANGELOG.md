# Changelog: Biohacking Autoblog

All notable changes to this project will be documented in this file.

---

## [Unreleased]

### In Progress
- Title variety improvements (8 formulas added, needs testing)
- Markdown → HTML conversion strengthening

---

## 2025-11-24

### Fixed
- **OpenRouter API Key** - Updated to new valid key
- **Markdown Output** - Added aggressive markdown-to-HTML conversion
  - Strips code block markers
  - Converts ## headings to `<h2>`
  - Converts **bold** to `<strong>`
  - Wraps plain text in `<p>` tags

### Changed
- **WordPress Publishing** - Changed from `publish` to `draft` status
  - Posts now save as drafts for review
  - File: `lib/wordpress.js:27`

- **Title Formulas** - Added 8 variations for variety
  - No longer using same "I did X wrong" pattern for all posts
  - File: `lib/content-generator.js:58-66`

### Generated Posts
- L-Carnitine (ID: 5445)
- Acetyl-L-Carnitine ALCAR (ID: 5446)
- Cordyceps Mushroom (ID: 5447)
- Ashwagandha (ID: 5448)
- Rhodiola Rosea (ID: 5449)

---

## 2025-11-23

### Added
- **Retry Variation** - Increase temperature on retries (0.78 → 0.83 → 0.88)
  - Commit: `5524651`

- **GitHub Actions** - Cron jobs for automated posting
  - 9am PST and 4pm PST daily
  - Commit: `932bfca`

### Security
- **Removed Exposed API Keys** - Added to .gitignore
  - Commit: `1dea9a0`

### Initial Release
- **Full Pipeline** - PubMed → Keywords → Generate → ZeroGPT → WordPress
  - Commit: `fdc3209`

---

## Project Milestones

| Date | Milestone |
|------|-----------|
| 2025-11-23 | Initial commit with full pipeline |
| 2025-11-23 | First successful test (Creatine, 75% human) |
| 2025-11-24 | Fixed API key, switched to drafts |
| 2025-11-24 | Generated 5 posts to WordPress |

---

*This changelog is maintained automatically.*
*Last auto-update: 2025-11-24*
