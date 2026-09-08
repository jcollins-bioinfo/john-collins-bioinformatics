import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import test from 'node:test';
const { default: worker } = await import('../dist/server/index.js');
const env = { ASSETS: { fetch: async () => new Response('Not found', { status: 404 }) } };
const ctx = { waitUntil() {}, passThroughOnException() {} };
async function render(route) {
  const r = await worker.fetch(new Request(`http://localhost${route}`, { headers: { accept: 'text/html' } }), env, ctx);
  assert.equal(r.status, 200); return r.text();
}
test('showcase route exposes canonical unavailability and scoped synthetic observations', async () => {
  const html = await render('/research/giab-wes-nextflow');
  assert.match(html, /Canonical results unavailable/);
  assert.match(html, /Invented fixtures only/);
  assert.match(html, /same-individual locus-held-out/);
  assert.match(html, /Release candidate: unavailable/);
  assert.match(html, /No published v1.0 release/);
  assert.match(html, /1,905,809/);
  assert.match(html, /scope="col"/); assert.match(html, /<caption>/);
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]);
  for (const id of ['scope', 'architecture', 'methods', 'results', 'reproducibility', 'limitations']) {
    assert.equal(ids.filter((v) => v === id).length, 1); assert.ok(html.includes(`href="#${id}"`));
  }
  for (const m of html.matchAll(/href="(\/research\/giab-wes-nextflow\/evidence\/[^"?]+)"/g)) await access(new URL(`../public${m[1]}`, import.meta.url));
  assert.doesNotMatch(html, /href="\/research\/giab-wes-nextflow\/explorer/);
});
test('showcase is discoverable from research and sitemap', async () => {
  assert.match(await render('/research'), /href="\/research\/giab-wes-nextflow"/);
  assert.match(await readFile(new URL('../public/sitemap.xml', import.meta.url), 'utf8'), /johnpatrickcollins.info\/research\/giab-wes-nextflow/);
});
test('scoped layout includes mobile reflow, keyboard focus, and contained table scrolling', async () => {
  const css = await readFile(new URL('../app/research/giab-wes-nextflow/showcase.module.css', import.meta.url), 'utf8');
  assert.match(css, /max-width: 540px/); assert.match(css, /grid-template-columns: 1fr/);
  assert.match(css, /focus-visible/); assert.match(css, /overflow-x: auto/);
});
