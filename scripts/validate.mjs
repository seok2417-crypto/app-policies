import assert from 'node:assert/strict';
import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const base = new URL('https://seok2417-crypto.github.io/app-policies/');
const allowedFiles = new Set(['.gitignore', '.nojekyll', 'README.md', 'index.html', '404.html', 'policy-status.json', 'assets/icon.svg', 'assets/styles.css', 'docs/review-checklist.md', 'docs/validation.md', 'scripts/validate.mjs']);
const status = JSON.parse(await readFile(path.join(root, 'policy-status.json'), 'utf8'));
for (const app of status.apps) allowedFiles.add(`${app.slug}/index.html`);
const externalUrls = new Set();
let assertions = 0;
const check = (condition, message) => { assert.ok(condition, message); assertions++; };
const decode = (text) => text.replaceAll('&amp;', '&').replaceAll('&quot;', '"');
const attrs = (tag) => Object.fromEntries([...tag.matchAll(/([\w:-]+)\s*=\s*(["'])(.*?)\2/gs)].map(m => [m[1], decode(m[3])]));

async function walk(directory, prefix = '') {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if (entry.name === '.git') continue;
    check(!entry.isSymbolicLink(), `Symlink is not allowed: ${prefix}${entry.name}`);
    const relative = `${prefix}${entry.name}`;
    if (entry.isDirectory()) files.push(...await walk(path.join(directory, entry.name), `${relative}/`));
    else files.push(relative);
  }
  return files;
}
const files = await walk(root);
for (const file of files) {
  check(allowedFiles.has(file), `File not in reviewed publication allowlist: ${file}`);
  check(!/\.(?:kt|java|apk|aab|jks|keystore|p12|pem|zip|tar|png|log|properties)$/i.test(file), `Unexpected app/sensitive artifact: ${file}`);
  const data = await readFile(path.join(root, file), 'utf8');
  check(!data.includes('\uFFFD'), `Invalid UTF-8 in ${file}`);
  check(!/-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/.test(data), `Private key in ${file}`);
  check(!/\b(?:ghp_|github_pat_)[A-Za-z0-9_]{30,}/.test(data), `Credential pattern in ${file}`);
  const privateMarkers = [['com', 'sbs24', 'arrivalalarm'].join('.'), ['class', 'ArrivalTrackingService'].join(' '), ['app', 'state', 'json'].join('_')];
  check(!privateMarkers.some(marker => data.includes(marker)), `Private app source/data leaked into ${file}`);
}
check(status.site_base_path === base.pathname, 'Wrong project base path');

const htmlFiles = files.filter(file => file.endsWith('.html'));
const htmlByUrl = new Map();
for (const file of htmlFiles) {
  const html = await readFile(path.join(root, file), 'utf8');
  htmlByUrl.set(new URL(file, base).href, html);
  check(/^<!doctype html>/i.test(html), `${file}: missing HTML doctype`);
  check(/<html lang="ko">/.test(html), `${file}: missing Korean language`);
  check(/<meta charset="utf-8">/.test(html), `${file}: missing UTF-8`);
  check(/name="viewport"/.test(html), `${file}: missing responsive viewport`);
  check((html.match(/<h1(?:\s|>)/g) || []).length === 1, `${file}: need exactly one h1`);
  check((html.match(/<main(?:\s|>)/g) || []).length === 1, `${file}: need one main landmark`);
  check(/class="skip-link" href="#main"/.test(html), `${file}: missing keyboard skip link`);
  check(/id="main" tabindex="-1"/.test(html), `${file}: skip target must be focusable`);
  check(/<title>[^<]+<\/title>/.test(html), `${file}: title missing`);
  check(/name="description"/.test(html), `${file}: description missing`);
  check(!/<(?:script|iframe|form|object|embed)\b/i.test(html), `${file}: executable/tracking/embed content not permitted`);
  check(!/\son[a-z]+\s*=/i.test(html), `${file}: inline event handler not permitted`);
  check(!/https?:\/\//.test([...html.matchAll(/<(?:link|img)\b[^>]*>/g)].map(m => m[0]).join('')), `${file}: external resource request`);
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]);
  check(new Set(ids).size === ids.length, `${file}: duplicate id`);
  const stack = [];
  const voidTags = new Set(['meta', 'link', 'img', 'br', 'hr', 'input', 'source', 'area', 'base', 'col', 'embed', 'param', 'track', 'wbr']);
  for (const m of html.matchAll(/<\/?([a-z][a-z0-9-]*)\b[^>]*>/gi)) {
    const tag = m[1].toLowerCase();
    if (voidTags.has(tag)) continue;
    if (m[0].startsWith('</')) check(stack.pop() === tag, `${file}: unbalanced HTML near ${m[0]}`);
    else stack.push(tag);
  }
  check(stack.length === 0, `${file}: unclosed HTML elements`);
  for (const m of html.matchAll(/<(?:a|link|img)\b[^>]*>/g)) {
    const a = attrs(m[0]);
    if (m[0].startsWith('<img')) check('alt' in a, `${file}: img missing alt`);
    const raw = a.href ?? a.src;
    if (!raw) continue;
    if (raw.startsWith('mailto:')) { check(raw === 'mailto:seok247@gmail.com', `${file}: unreviewed contact address`); continue; }
    const url = new URL(raw, new URL(file, base));
    if (url.origin !== base.origin) {
      check(url.protocol === 'https:', `${file}: unsafe external URL`);
      externalUrls.add(url.href);
      continue;
    }
    check(url.pathname.startsWith(base.pathname), `${file}: internal link escapes /app-policies/: ${raw}`);
    let relative = decodeURIComponent(url.pathname.slice(base.pathname.length));
    if (!relative || relative.endsWith('/')) relative += 'index.html';
    const target = path.resolve(root, relative);
    check(target.startsWith(root + path.sep), `${file}: path traversal`);
    check((await stat(target)).isFile(), `${file}: broken internal target: ${raw}`);
    if (url.hash) {
      const targetHtml = await readFile(target, 'utf8');
      check(targetHtml.includes(`id="${url.hash.slice(1)}"`), `${file}: broken fragment ${raw}`);
    }
  }
}
const home = await readFile(path.join(root, 'index.html'), 'utf8');
check((home.match(/class="app-card"/g) || []).length === status.apps.length, 'App count does not match status metadata');
for (const app of status.apps) {
  check(home.includes(`href="${app.slug}/"`), `App missing on home: ${app.slug}`);
  const html = await readFile(path.join(root, app.slug, 'index.html'), 'utf8');
  if (!app.approved) {
    check(app.status === 'pending-review' && app.effective_date === null, 'Unapproved app has active effective date');
    check(html.includes('정식 방침은 아직 게시되지 않았습니다'), 'Unapproved policy lacks publication warning');
    check(html.includes('현재 페이지를 Google Play'), 'Missing app-store submission warning');
    check(!html.includes('개인정보의 처리 목적') && !html.includes('처리하는 개인정보 항목'), 'Draft policy body must not be published');
  } else {
    check(app.status === 'published' && /^\d{4}-\d{2}-\d{2}$/.test(app.effective_date), 'Approved policy needs publication status and date');
  }
}
const css = await readFile(path.join(root, 'assets/styles.css'), 'utf8');
check(css.includes(':focus-visible'), 'Visible keyboard focus missing');
check(css.includes('@media (max-width: 700px)'), 'Mobile breakpoint missing');
check(!/@import|url\(\s*["']?https?:/i.test(css), 'External CSS import/font request');

const markdownFiles = files.filter(file => file.endsWith('.md'));
for (const file of markdownFiles) {
  const markdown = await readFile(path.join(root, file), 'utf8');
  for (const m of markdown.matchAll(/\]\((https:\/\/[^)]+)\)/g)) externalUrls.add(decode(m[1]));
}
const externalBlocked = [];
if (process.argv.includes('--external')) {
  for (const url of externalUrls) {
    let response;
    for (let attempt = 0; attempt < 2; attempt++) {
      response = await fetch(url, { signal: AbortSignal.timeout(25000), redirect: 'follow', headers: { 'User-Agent': 'app-policies-link-check' } });
      if (response.status !== 429 && response.status < 500) break;
    }
    if (response.status === 403 || response.status === 429) {
      externalBlocked.push({url, status: response.status, needsBrowserCheck: true});
    } else check(response.ok, `External link returned ${response.status}: ${url}`);
    console.log(`LINK ${response.status} ${url}`);
    await response.body?.cancel();
  }
}
console.log(JSON.stringify({ result: externalBlocked.length ? 'PASS_WITH_EXTERNAL_BROWSER_REVIEW' : 'PASS', files: files.length, htmlPages: htmlFiles.length, assertions, externalLinks: externalUrls.size, externalChecked: process.argv.includes('--external'), externalBlocked }, null, 2));
