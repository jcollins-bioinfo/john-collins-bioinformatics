import assert from 'node:assert/strict';
import test from 'node:test';
import { mkdtempSync, cpSync, rmSync, readFileSync, writeFileSync, symlinkSync, unlinkSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { binding, check, evidenceDir, verifySource } from '../scripts/giab-evidence.mjs';

function altered(fn) {
  const dir = mkdtempSync(join(tmpdir(), 'giab-web-'));
  try { cpSync(evidenceDir, dir, { recursive: true }); fn(dir); } finally { rmSync(dir, { recursive: true }); }
}
test('source-bound evidence retains synthetic and canonical separation', () => {
  const d = check();
  assert.equal(d.pipeline.sha, binding.repository_sha);
  assert.equal(d.canonical.status, 'unavailable');
  for (const k of ['metrics', 'resources', 'coverage', 'result', 'manifest_sha256']) assert.equal(d.canonical[k], null);
  assert.equal(d.synthetic.metrics.gatk.SNP.tp_query, 4);
  assert.equal(d.synthetic.metrics.gatk.OTHER.f1, null);
  assert.equal(d.synthetic.nextflow_modes.resume.statuses.CACHED, 4);
  assert.equal(d.synthetic.historical_failure.status, 'failed');
});
test('source corruption fails before rendering', () => altered((dir) => {
  writeFileSync(join(dir, 'm5.json'), '{}\n');
  assert.throws(() => check(dir), /mismatch/);
}));
test('derived metric or canonical-label tampering is rejected', () => altered((dir) => {
  const p = join(dir, 'showcase.json'); const d = JSON.parse(readFileSync(p));
  d.canonical.status = 'complete'; d.synthetic.metrics.gatk.SNP.f1 = 1;
  writeFileSync(p, JSON.stringify(d, null, 2) + '\n');
  assert.throws(() => check(dir));
}));
test('public inventory rejects extra files and symlinks', () => altered((dir) => {
  writeFileSync(join(dir, 'unexpected.json'), '{}'); assert.throws(() => check(dir), /inventory/);
  unlinkSync(join(dir, 'unexpected.json')); unlinkSync(join(dir, 'm5.json'));
  symlinkSync(new URL('m5.json', evidenceDir), join(dir, 'm5.json')); assert.throws(() => check(dir));
}));
test('unapproved source names and changed trust pin are rejected', () => {
  assert.throws(() => verifySource('human.vcf', Buffer.from('x')), /Unapproved/);
  altered((dir) => { writeFileSync(join(dir, 'manifest.json'), '{}'); assert.throws(() => check(dir)); });
});
