/** Import approved, small pipeline metadata from one Git commit; validate offline at every build. */
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync, lstatSync, readdirSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

export const root = new URL('../', import.meta.url);
export const evidenceDir = new URL('../public/research/giab-wes-nextflow/evidence/', import.meta.url);
export const binding = JSON.parse(readFileSync(new URL('../app/research/giab-wes-nextflow/pipeline-binding.json', import.meta.url)));
export const digest = (bytes) => createHash('sha256').update(bytes).digest('hex');
const encode = (value) => `${JSON.stringify(value, null, 2)}\n`;

export function verifySource(name, bytes) {
  const pin = binding.sources[name];
  assert.ok(pin && bytes.length <= 100_000, 'Unapproved or oversized source');
  assert.equal(bytes.length, pin.bytes, `Size mismatch: ${name}`);
  assert.equal(digest(bytes), pin.sha256, `Digest mismatch: ${name}`);
}

export function validateManaged(record) {
  assert.equal(record.schema_version, '1.0.0');
  assert.equal(record.kind, 'managed_qualification_milestone_summary');
  assert.match(record.observed_date, /^\d{4}-\d{2}-\d{2}$/);
  const run = record.full_dag_qualification;
  assert.equal(run.scope, 'frozen invented nonhuman fixture');
  assert.equal(run.canonical, false);
  assert.equal(run.full_nonhuman_dag_qualified, true);
  assert.equal(run.normalization_benchmark_qualified, true);
  assert.equal(run.managed_cache_qualified, false, 'Managed reuse needs a separate reviewed evidence import');
  assert.deepEqual(record.canonical_hg001_comparison, { executed: false, accepted: false, metrics_available: false });
  assert.equal(run.engine, 'Nextflow 26.04.0');
  assert.equal(run.parser, 'v2');
  assert.match(run.repository_sha, /^[a-f0-9]{40}$/);
  for (const key of ['workflow_package_sha256', 'independent_validation_receipt_sha256', 'collector_evidence_sha256']) assert.match(run[key], /^[a-f0-9]{64}$/);
  for (const key of ['completed_tasks', 'distinct_processes', 'provider_image_joins', 'native_observation_joins', 'original_quality_records_verified', 'returned_objects_rehashed']) {
    assert.ok(Number.isSafeInteger(run[key]) && run[key] > 0, `Invalid managed count: ${key}`);
  }
  assert.equal(run.tasks.length, run.completed_tasks);
  assert.equal(new Set(run.tasks.map((task) => task.process)).size, run.distinct_processes);
  assert.equal(run.provider_image_joins, run.completed_tasks);
  assert.ok(run.native_observation_joins <= run.completed_tasks);
  for (const task of run.tasks) {
    assert.equal(task.status, 'COMPLETED');
    assert.match(task.image_digest, /^sha256:[a-f0-9]{64}$/);
  }
  for (const asset of [record.reference_index, record.known_sites]) {
    for (const key of ['publication_complete', 'current_versions_verified', 'historical_whole_payload_hash_proofs_validated', 'completion_marker_written_last']) assert.equal(asset[key], true);
    for (const key of ['asset_id', 'completion_marker_sha256', 'reference_id', 'registry_sha256']) assert.match(asset[key], /^[a-f0-9]{64}$/);
    assert.ok(Number.isSafeInteger(asset.payload_files) && asset.payload_files > 0);
  }
  assert.equal(record.reference_index.contigs, 195);
  assert.equal(record.reference_index.aligner, 'BWA 0.7.17-r1188');
  assert.equal(record.reference_index.construction_algorithm, 'bwtsw');
  assert.equal(record.known_sites.reference_id, record.reference_index.reference_id);
  assert.equal(record.known_sites.independent_Broad_sources, 3);
  assert.equal(record.known_sites.benchmark_truth_used, false);
  assert.equal(record.known_sites.retained_REF_and_index_readback_verified, true);
  return record;
}

export function derive(files) {
  for (const [name, bytes] of Object.entries(files)) verifySource(name, bytes);
  assert.deepEqual(Object.keys(files).sort(), Object.keys(binding.sources).sort());
  assert.match(binding.repository_sha, /^[a-f0-9]{40}$/);
  assert.equal(binding.repository, 'https://github.com/jcollins-bioinfo/giab-wes-nextflow');
  assert.equal(binding.canonical_manifest_sha256, null, 'This release admits nonhuman evidence only; canonical import requires separate qualification');
  assert.ok(files['package-version.txt'].toString().includes(`__version__ = "${binding.package_version}"`));
  const m5 = JSON.parse(files['m5.json']);
  const domains = JSON.parse(files['domains.json']);
  const managed = validateManaged(JSON.parse(files['managed-qualification.json']));
  assert.equal(m5.status, 'synthetically_verified');
  assert.equal(m5.synthetic, true);
  assert.equal(m5.canonical, false);
  assert.equal(m5.canonical_metrics, null);
  assert.equal(m5.comparative_cost, null);
  assert.equal(m5.historical_failure.preserved, true);
  assert.equal(domains.status, 'approved_domain_reproduced');
  assert.equal(domains.canonical_execution_ready, false);
  for (const caller of ['gatk', 'deepvariant']) {
    for (const type of ['SNP', 'INDEL', 'OTHER']) {
      const m = m5.actual_tool_metrics[caller][type];
      for (const k of ['tp_query', 'tp_truth', 'fp', 'fn']) assert.ok(Number.isSafeInteger(m[k]) && m[k] >= 0);
      const precision = m.tp_query + m.fp ? m.tp_query / (m.tp_query + m.fp) : null;
      const recall = m.tp_truth + m.fn ? m.tp_truth / (m.tp_truth + m.fn) : null;
      const f1 = precision === null || recall === null ? null : precision + recall ? 2 * precision * recall / (precision + recall) : 0;
      assert.equal(m.precision, precision); assert.equal(m.recall, recall); assert.equal(m.f1, f1);
    }
  }
  return {
    schema_version: 2,
    pipeline: { repository: binding.repository, sha: binding.repository_sha, version: binding.package_version },
    evidence_manifest_sha256: digest(encode(binding)),
    canonical: { status: 'unavailable', result: null, metrics: null, resources: null, coverage: null, manifest_sha256: null, reason: 'No reviewed canonical execution bundle has been imported.' },
    synthetic: { status: m5.status, run_url: m5.run_url, installed_package: m5.installed_package, scope: m5.scope, artifact: m5.artifact, metrics: m5.actual_tool_metrics, nextflow_modes: m5.nextflow_modes, historical_failure: m5.historical_failure, qualification: m5.qualification_envelope },
    managed,
    domains,
  };
}

export function check(dir = evidenceDir) {
  dir = typeof dir === 'string' ? dir : fileURLToPath(dir);
  const expected = [...Object.keys(binding.sources), 'manifest.json', 'showcase.json'].sort();
  assert.deepEqual(readdirSync(dir).sort(), expected, 'Public evidence inventory must be exact');
  const files = {};
  for (const name of expected) {
    const file = join(dir, name);
    assert.ok(lstatSync(file).isFile() && !lstatSync(file).isSymbolicLink());
    if (name in binding.sources) files[name] = readFileSync(file);
  }
  assert.equal(readFileSync(join(dir, 'manifest.json'), 'utf8'), encode(binding));
  const data = derive(files);
  assert.equal(readFileSync(join(dir, 'showcase.json'), 'utf8'), encode(data));
  return data;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  if (process.argv[2] === '--import') {
    assert.ok(process.argv[3], 'Usage: node scripts/giab-evidence.mjs --import PIPELINE_CHECKOUT');
    const files = {};
    for (const [name, pin] of Object.entries(binding.sources)) {
      files[name] = execFileSync('git', ['-C', resolve(process.argv[3]), 'show', `${binding.repository_sha}:${pin.path}`], { maxBuffer: 100_000 });
      verifySource(name, files[name]);
    }
    const data = derive(files);
    for (const [name, bytes] of Object.entries(files)) writeFileSync(new URL(name, evidenceDir), bytes);
    writeFileSync(new URL('manifest.json', evidenceDir), encode(binding));
    writeFileSync(new URL('showcase.json', evidenceDir), encode(data));
  } else assert.ok(process.argv.length === 2 || process.argv[2] === '--check', 'Unknown argument');
  check();
  console.log(`GIAB evidence verified: ${binding.repository_sha}, ${binding.package_version}; canonical unavailable.`);
}
