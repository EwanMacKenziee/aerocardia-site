#!/usr/bin/env node
// AeroCardia — i18n coverage check.
//
// Heuristic, not a parser: flags "leaf" elements (an opening tag, some
// plain text with no nested tags, then the matching closing tag) that have
// no data-fr attribute. It catches the common case — a heading, paragraph,
// list item or link whose translation was forgotten — but it can't see
// text mixed with nested markup (data-fr covering innerHTML, handled by
// hand already) and it has no idea whether a translation is any good, only
// whether one exists. Run it before publishing a new page or section:
//
//   node scripts/check-i18n.mjs
//
// Exits non-zero if anything is flagged, so it can gate a commit if wanted.
import { readFileSync, readdirSync } from "node:fs";

const LEAF_TAGS = ["h1", "h2", "h3", "h4", "h5", "p", "li", "span", "a", "button", "label", "th", "td", "figcaption", "dt", "dd", "title"];
const TAG_RE = new RegExp(`<(${LEAF_TAGS.join("|")})\\b([^>]*)>([^<]*)</\\1>`, "g");

const SKIP_IF_ATTRS_MATCH = /data-fr\b|data-fr=|data-lang-toggle|data-year|data-uci-label|data-uci-cw/;

function isTranslatable(text) {
  const trimmed = text.replace(/&nbsp;/g, " ").trim();
  if (!trimmed) return false;
  // Pure numbers, units, symbols, or a single word that is also a brand/
  // proper noun won't be meaningfully "untranslated" — still flagged, but
  // worth eyeballing rather than treating as broken.
  return true;
}

const files = readdirSync(".").filter((f) => f.endsWith(".html"));
let flagged = 0;

for (const file of files) {
  const html = readFileSync(file, "utf8");
  let match;
  TAG_RE.lastIndex = 0;
  while ((match = TAG_RE.exec(html))) {
    const [, tag, attrs, text] = match;
    if (SKIP_IF_ATTRS_MATCH.test(attrs)) continue;
    if (!isTranslatable(text)) continue;
    const line = html.slice(0, match.index).split("\n").length;
    console.log(`${file}:${line}  <${tag}> missing data-fr — "${text.trim().slice(0, 70)}"`);
    flagged++;
  }
}

if (flagged) {
  console.log(`\n${flagged} element(s) with text but no data-fr. Not all are real misses (see script header) — review each.`);
  process.exit(1);
} else {
  console.log("No obviously untranslated leaf elements found.");
}
