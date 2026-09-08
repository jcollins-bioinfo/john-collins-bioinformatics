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

export function derive(files) {
  for (const [name, bytes] of Object.entries(files)) verifySource(name, bytes);
  assert.deepEqual(Object.keys(files).sort(), Object.keys(binding.sources).sort());
  assert.match(binding.repository_sha, /^[a-f0-9]{40}$/);
  assert.equal(binding.repository, 'https://github.com/jcollins-bioinfo/giab-wes-nextflow');
  assert.equal(binding.canonical_manifest_sha256, null, 'This release admits synthetic evidence only; canonical import requires separate qualification');
  assert.ok(files['package-version.txt'].toString().includes(`__version__ = "${binding.package_version}"`));
  const m5 = JSON.parse(files['m5.json']);
  const domains = JSON.parse(files['domains.json']);
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
    schema_version: 1,
    pipeline: { repository: binding.repository, sha: binding.repository_sha, version: binding.package_version },
    evidence_manifest_sha256: digest(encode(binding)),
    canonical: { status: 'unavailable', result: null, metrics: null, resources: null, coverage: null, manifest_sha256: null, reason: 'No reviewed canonical execution bundle has been imported.' },
    synthetic: { status: m5.status, run_url: m5.run_url, installed_package: m5.installed_package, scope: m5.scope, artifact: m5.artifact, metrics: m5.actual_tool_metrics, nextflow_modes: m5.nextflow_modes, historical_failure: m5.historical_failure, qualification: m5.qualification_envelope },
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
