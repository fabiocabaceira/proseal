#!/usr/bin/env node
/* One HTML file per page from the SSR bundle, with that page's own <head> (title, description, og:*, preloads)
   and its body class. Scrapers (WhatsApp, Facebook, Google) read this HTML without running JavaScript.
   Exit 0 = all pages written. 1 = a page rendered empty. 2 = the client build or the SSR bundle is missing. */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DIST = process.env.OUT_DIR ? resolve(ROOT, process.env.OUT_DIR) : join(ROOT, 'dist');
const SSR = join(process.env.SSR_DIR ? resolve(ROOT, process.env.SSR_DIR) : join(ROOT, 'dist-ssr'), 'entry-server.js');
const die = (code, msg) => { console.error(`error: ${msg}`); process.exit(code); };

if (!existsSync(join(DIST, 'index.html'))) die(2, 'dist/index.html is missing: run vite build first');
if (!existsSync(SSR)) die(2, 'dist-ssr/entry-server.js is missing: run vite build --ssr first');

const { render, PAGE_FILES, PAGE_HEAD } = await import(pathToFileURL(SSR).href);
const template = readFileSync(join(DIST, 'index.html'), 'utf8');
/* SITE_URL moves the absolute links (og:url, og:image) to the address a copy of the site is published at */
const HOME = PAGE_HEAD.index.head.find((t) => t.attrs.property === 'og:url')?.attrs.content;
const SITE = process.env.SITE_URL;
const moveSite = (s) => (SITE && HOME ? s.split(HOME).join(SITE) : s);
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const attrs = (o) => Object.entries(o).map(([k, v]) => (v === '' ? k : `${k}="${esc(v)}"`)).join(' ');
const keep = (t) => !(t.tag === 'meta' && (t.attrs.charset !== undefined || t.attrs.name === 'viewport')) && !(t.tag === 'link' && t.attrs.rel === 'stylesheet');

for (const [page, file] of Object.entries(PAGE_FILES)) {
  const head = PAGE_HEAD[page];
  const app = render(page);
  if (!app || app.length < 500) die(1, `${file} rendered empty`);
  const tags = moveSite(head.head.filter(keep).map((t) => `<${t.tag} ${attrs(t.attrs)}>`).join('\n'));
  const html = template
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(head.title)}</title>`)
    .replace('<!--page-head-->', tags)
    .replace('<body>', `<body class="${head.bodyClass}">`)
    .replace('<!--app-->', app);
  writeFileSync(join(DIST, file), html);
  console.log(`${file}  ${(html.length / 1024).toFixed(0)} KB`);
}
