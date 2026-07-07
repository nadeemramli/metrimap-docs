#!/usr/bin/env node
// Content quality gate for docs.canvasm.app.
// Fails (exit 1) if any page is missing required frontmatter or links to a
// /docs path that doesn't exist. Run with `npm run check`.
import { readFileSync, readdirSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = 'content/docs';
const REQUIRED = ['title', 'description', 'owner', 'status', 'lastReviewed'];
const STATUSES = ['draft', 'review', 'stable'];

function walk(dir) {
  const out = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else if (entry.name.endsWith('.mdx')) out.push(full);
  }
  return out;
}

const files = walk(ROOT);
const errors = [];

// Parse the leading --- frontmatter --- block into a flat key→value map.
function parseFrontmatter(text) {
  if (!text.startsWith('---')) return null;
  const end = text.indexOf('\n---', 3);
  if (end === -1) return null;
  const body = text.slice(3, end).trim();
  const data = {};
  for (const line of body.split('\n')) {
    const m = line.match(/^([A-Za-z0-9_]+):\s*(.*)$/);
    if (m) data[m[1]] = m[2].replace(/^["']|["']$/g, '').trim();
  }
  return data;
}

// Build the set of valid /docs URLs from the file tree.
function urlFor(file) {
  let rel = relative(ROOT, file).replace(/\.mdx$/, '');
  if (rel.endsWith('/index')) rel = rel.slice(0, -'/index'.length);
  if (rel === 'index') return '/docs';
  return `/docs/${rel}`;
}
const validUrls = new Set(['/docs', ...files.map(urlFor)]);

for (const file of files) {
  const text = readFileSync(file, 'utf8');
  const fm = parseFrontmatter(text);
  if (!fm) {
    errors.push(`${file}: missing or malformed frontmatter`);
    continue;
  }
  for (const key of REQUIRED) {
    if (!fm[key]) errors.push(`${file}: missing frontmatter "${key}"`);
  }
  if (fm.status && !STATUSES.includes(fm.status)) {
    errors.push(`${file}: status "${fm.status}" not one of ${STATUSES.join('|')}`);
  }
  if (fm.lastReviewed && !/^\d{4}-\d{2}-\d{2}$/.test(fm.lastReviewed)) {
    errors.push(`${file}: lastReviewed "${fm.lastReviewed}" is not YYYY-MM-DD`);
  }
  // Internal /docs links must resolve (ignore anchors and query strings).
  for (const m of text.matchAll(/href="(\/docs[^"]*)"/g)) {
    const target = m[1].split(/[#?]/)[0].replace(/\/$/, '') || '/docs';
    if (!validUrls.has(target)) {
      errors.push(`${file}: broken internal link ${m[1]}`);
    }
  }
}

if (errors.length) {
  console.error(`✗ Content check failed (${errors.length}):`);
  for (const e of errors) console.error('  - ' + e);
  process.exit(1);
}
console.log(`✓ Content check passed: ${files.length} pages, frontmatter + links OK.`);
