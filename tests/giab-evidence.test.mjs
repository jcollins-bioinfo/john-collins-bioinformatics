import assert from 'node:assert/strict';
import test from 'node:test';
import { mkdtempSync, cpSync, rmSync, readFileSync, writeFileSync, symlinkSync, unlinkSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { binding, check, evidenceDir, verifySource, validateManaged } from '../scripts/giab-evidence.mjs';

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

test('managed qualification retains its own source and nonhuman scope', () => {
  const d = check();
  const run = d.managed.full_dag_qualification;
  assert.equal(d.managed.observed_date, '2026-09-15');
  assert.equal(run.completed_tasks, 28);
  assert.equal(run.distinct_processes, 21);
  assert.equal(run.managed_cache_qualified, false);
  assert.notEqual(run.repository_sha, d.pipeline.sha);
  assert.equal(d.managed.canonical_hg001_comparison.accepted, false);
  assert.equal(d.canonical.metrics, null);
});

test('managed source corruption is rejected before rendering', () => altered((dir) => {
  writeFileSync(join(dir, 'managed-qualification.json'), '{}\n');
  assert.throws(() => check(dir), /mismatch/);
}));

test('managed validation rejects scientific relabeling and broken lineage', () => {
  const mutations = [
    (d) => { d.full_dag_qualification.canonical = true; },
    (d) => { d.canonical_hg001_comparison.accepted = true; },
    (d) => { d.full_dag_qualification.managed_cache_qualified = true; },
    (d) => { d.full_dag_qualification.tasks.pop(); },
    (d) => { d.full_dag_qualification.tasks[0].image_digest = 'latest'; },
    (d) => { d.reference_index.completion_marker_written_last = false; },
    (d) => { d.known_sites.reference_id = 'a'.repeat(64); },
    (d) => { d.known_sites.benchmark_truth_used = true; },
  ];
  for (const mutate of mutations) {
    const record = structuredClone(check().managed);
    mutate(record);
    assert.throws(() => validateManaged(record));
  }
});
