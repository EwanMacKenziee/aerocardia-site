---
description: Draft, check and stage this week's AeroCardia blog post as a Vercel preview (never merges)
argument-hint: [post date, e.g. 2026-11-11] [optional target keyword]
---

# /weekly-post — AeroCardia weekly blog workflow

Arguments: $ARGUMENTS

Run the full workflow below in order. Follow CLAUDE.md throughout; it overrides anything here if they conflict. Keep me informed with short status lines, not long narration. Do one review loop only: don't chase a higher analyzer score.

## 1. Pick the post
- Read calendar.md. Use the post matching the date in the arguments; if no date is given, use the next unpublished post.
- Show me the title, brief and ICP pain in 3 lines.

## 2. Lock the target keyword
- If a keyword is in the arguments, use it. Otherwise propose 3 candidates (searchable phrasing, not the headline) and ask me to pick one. Wait for my answer.
- Check the keyword doesn't overlap the target keyword of any existing post or the next calendar post. Flag overlap.
- Record target_keyword and seo_title in the post frontmatter.

## 3. Sources before writing
- Read everything in sources/, plus all earlier source logs in sources/*-sources.md. Reuse those sources where they fit.
- List the claims the brief will need and which source supports each. For gaps only, find peer-reviewed or institutional sources and note how deeply you read each one (full text / abstract / press report).
- Repeat any funding or conflict disclosures already recorded (e.g. Huawei for Molina-Garcia et al. 2022).
- Save the log as sources/<slug>-sources.md.

## 4. Draft
- Use the claude-blog blog-write skill with the template that fits the brief (default: how-to with a short FAQ section of question-style H2s).
- Prose of 1,800–2,000 words. Label opinion only where it could be mistaken for a finding (about 4–6 labels). Use direct-statement headings.
- Include the standard disclaimer unchanged. Make no ARO2 product claims.

## 5. Self-check and resolve
- Run the banned-term scan per CLAUDE.md (claims, not negations).
- For every [VERIFY] flag: check the source and keep, soften or cut it yourself. Escalate to me only those you can't resolve, each with the sentence, source, what the source says and your recommendation.
- Verify every number against its source. Cut figures you can't confirm; never use figures from memory.
- Run the independent reviewer once and apply its fixes. Re-check that edits didn't reintroduce errors.

## 6. SEO checks
Confirm and fix:
- SEO title 50–60 characters containing the keyword (keep the H1 as the calendar headline)
- Meta description 140–160 characters containing the keyword
- Keyword in the first 100 words and at least one H2
- Image alt text under 100 characters
- BlogPosting schema with Person author (Ewan MacKenzie, linked to his existing bio page) and date
- 2–3 contextual internal links, only to posts that comply with CLAUDE.md
- Canonical in the final www, no-.html format
Run /claude-blog:blog analyze and /claude-blog:blog geo once and fix anything simple.

## 7. Stage a preview (never merge)
- In the website repo used for previous posts, create branch blog/<slug> from master.
- Match the existing post structure, add the post to the blog index and sitemap, and run tools/apply_site_paths.py after the final render.
- Don't modify any other post or page.
- Commit, push, and get the Vercel preview URL. Do NOT merge to master.

## 8. Report back (keep it short)
- Preview URL
- Target keyword and SEO title
- Prose word count and analyzer score
- Unresolved items needing my decision (numbered; ideally none)
- Sources read only at abstract level that support key claims
- My review checklist: author link, disclaimer, no [VERIFY] tags, no ARO2 claims, disclosures present, images and chart render, mobile view
- The exact merge command to send when I approve
