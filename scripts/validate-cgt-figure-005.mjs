import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { lstat, readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { inflateRawSync, inflateSync } from "node:zlib";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const mainRoot = path.join(projectRoot, "public", "research", "cgt", "figures", "main");
const figureRoot = path.join(projectRoot, "public", "research", "cgt", "figures");
const base = "CGT_FIGURE_005_tcga_cancer_type_structure_revised";
const releaseFilename = "CGT_FIGURE_005_revised_reproducibility_package_v1.zip";
const releaseRoot = "CGT_FIGURE_005_revised_reproducibility_package_v1";
const releaseId = "CGT_FIGURE_005_REVISED_V1";
const iccSha256 = "2a92d4bae450b76d8b0aa42193df974d75f62738ecebf74f01c5e75b12a95796";

function panel(letter, bytes, digest, width, height, minimumDisplayWidth) {
  return {
    filename: `${base}_mobile_panel_${letter}.png`,
    releasePath: `deliverables/${base}_mobile_panel_${letter}.png`,
    bytes,
    sha256: digest,
    mimeType: "image/png",
    width,
    height,
    minimumDisplayWidth,
  };
}

const assets = {
  png_web: {
    filename: `${base}_web.png`,
    releasePath: `deliverables/${base}_web.png`,
    bytes: 1_632_051,
    sha256: "6e18d06bdd16b82700dc6b5db3c2221738cd73d7ba7202c5e0cdb4e873324f5a",
    mimeType: "image/png",
    width: 2400,
    height: 3121,
  },
  png_600dpi: {
    filename: `${base}_600dpi.png`,
    releasePath: `deliverables/${base}_600dpi.png`,
    bytes: 1_868_956,
    sha256: "3ebada953dc391e560413c8bc8807cc43cc038c51e0bd6e9f606e80775c7e37b",
    mimeType: "image/png",
    width: 4322,
    height: 5622,
    dpi: 599.9988,
  },
  pdf: {
    filename: `${base}.pdf`,
    releasePath: `deliverables/${base}.pdf`,
    bytes: 395_816,
    sha256: "1ef34f29cfe72b62394bb8ff85ff1c3f3985596fe1f9ba9e76b23ec08dc199de",
    mimeType: "application/pdf",
  },
  svg: {
    filename: `${base}.svg`,
    releasePath: `deliverables/${base}.svg`,
    bytes: 1_037_566,
    sha256: "9299db57bedea47657136eed0b6e5998eab8703b1bdb39ec8cb9eeaf57fdc3d8",
    mimeType: "image/svg+xml",
  },
  mobile_panel_a: panel("a", 148_435, "255a966954efd97ef67f9c3e8ddf1fe4b56cd4bd84fd20215f3fccd8a935c961", 1200, 735, null),
  mobile_panel_b: panel("b", 179_072, "e05250400e4e4c25c73f3974dcb5166a91eedbfc776f0ce6875f9f683f7b6366", 1800, 557, 640),
  mobile_panel_c: panel("c", 466_714, "c3fb6af6b1586eb4aaf8961211e793ec5b3e4918eef02163a53b2cae91add93a", 1800, 585, 680),
  mobile_panel_d: panel("d", 300_945, "013a1d608c70219e77864640252c5d2efef1720533b8b9fa9917d0b03c2a8d97", 2000, 893, 820),
  mobile_panel_e: panel("e", 328_198, "a67cafc6e01f59ec24718eba08ecf7de129298872829bda0f05a6615df10c47a", 1400, 904, 620),
  mobile_panel_f: panel("f", 178_089, "749294bc51ce138cd761c775e4c21d19f23a2983e97536a72da1afa7676e5416", 1400, 865, 680),
  reproducibility_zip: {
    filename: releaseFilename,
    bytes: 10_859_631,
    sha256: "72e049f26049311ab0cb94ca6430dfbfee781d3fb20d271f3e043da941498d12",
    mimeType: "application/zip",
  },
  audit_json: {
    filename: `${base}_audit.json`,
    releasePath: `deliverables/${base}_audit.json`,
    bytes: 6_838,
    sha256: "4c300ea83a0870450a367d0dc0daa1080f752d97f4dee271751dcbd054e404f1",
    mimeType: "application/json",
  },
};

const panelLabels = [
  "Panel a — Bulk TCGA cohort after expression QC",
  "Panel b — Within-cohort transforms reduce shared score dependence",
  "Panel c — TCGA-fitted PCA of pooled residual scores",
  "Panel d — Within-cancer-type relative mean score profiles",
  "Panel e — In-sample between-cancer-type variance fraction",
  "Panel f — Residual score dependence remains",
];

function sha256(value) {
  return createHash("sha256").update(value).digest("hex");
}

function strictUtf8(buffer, label) {
  try {
    return new TextDecoder("utf-8", { fatal: true }).decode(buffer);
  } catch (error) {
    assert.fail(`${label} is not strict UTF-8: ${error}`);
  }
}

async function verifyFile(filePath, expected) {
  const fileStat = await lstat(filePath);
  assert.equal(fileStat.isFile(), true, `${expected.filename} is a regular file`);
  assert.equal(fileStat.isSymbolicLink(), false, `${expected.filename} is not a symlink`);
  assert.equal(fileStat.size, expected.bytes, `${expected.filename} byte count`);
  const buffer = await readFile(filePath);
  assert.equal(sha256(buffer), expected.sha256, `${expected.filename} SHA-256`);
  return buffer;
}

function parsePng(buffer, expected) {
  assert.equal(buffer.subarray(0, 8).toString("hex"), "89504e470d0a1a0a", `${expected.filename} PNG signature`);
  let offset = 8;
  let width;
  let height;
  let colorType;
  let iccDigest;
  let embeddedDpi;
  while (offset + 12 <= buffer.length) {
    const length = buffer.readUInt32BE(offset);
    const type = buffer.subarray(offset + 4, offset + 8).toString("ascii");
    const data = buffer.subarray(offset + 8, offset + 8 + length);
    assert.ok(offset + 12 + length <= buffer.length, `${expected.filename} PNG chunk bounds`);
    if (type === "IHDR") {
      width = data.readUInt32BE(0);
      height = data.readUInt32BE(4);
      colorType = data[9];
    } else if (type === "iCCP") {
      const terminator = data.indexOf(0);
      assert.ok(terminator > 0, `${expected.filename} iCCP name`);
      assert.equal(data[terminator + 1], 0, `${expected.filename} iCCP compression method`);
      iccDigest = sha256(inflateSync(data.subarray(terminator + 2)));
    } else if (type === "pHYs" && data[8] === 1) {
      embeddedDpi = [data.readUInt32BE(0) * 0.0254, data.readUInt32BE(4) * 0.0254];
    }
    offset += 12 + length;
    if (type === "IEND") break;
  }
  assert.equal(width, expected.width, `${expected.filename} width`);
  assert.equal(height, expected.height, `${expected.filename} height`);
  assert.equal(colorType, 2, `${expected.filename} RGB color type`);
  assert.equal(iccDigest, iccSha256, `${expected.filename} embedded ICC profile`);
  if (expected.dpi !== undefined) {
    assert.ok(embeddedDpi, `${expected.filename} contains pHYs DPI metadata`);
    for (const value of embeddedDpi) assert.ok(Math.abs(value - expected.dpi) < 0.001, `${expected.filename} nominal 600 dpi`);
  }
}

function crc32(buffer) {
  let crc = 0xffffffff;
  for (const byte of buffer) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit += 1) {
      crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function findEocd(buffer) {
  const minimum = Math.max(0, buffer.length - 65_557);
  for (let offset = buffer.length - 22; offset >= minimum; offset -= 1) {
    if (buffer.readUInt32LE(offset) !== 0x06054b50) continue;
    const commentLength = buffer.readUInt16LE(offset + 20);
    if (offset + 22 + commentLength === buffer.length) return offset;
  }
  assert.fail("release ZIP has no structurally valid terminal EOCD");
}

function validateZipPath(name) {
  assert.ok(name && !name.includes("\0") && !name.includes("\\"), `safe ZIP path ${JSON.stringify(name)}`);
  assert.ok(!name.startsWith("/") && !/^[A-Za-z]:/.test(name), `relative ZIP path ${JSON.stringify(name)}`);
  const parts = name.split("/");
  assert.ok(parts.length >= 2 && parts.every((part) => part && part !== "." && part !== ".."), `canonical ZIP path ${JSON.stringify(name)}`);
  assert.equal(parts[0], releaseRoot, `single release root for ${name}`);
  assert.doesNotMatch(name, /\.(?:app|bat|cmd|com|dll|dylib|exe|jar|msi|ps1|scr|sh|so|zsh)$/i);
}

function parseZip(buffer) {
  const eocd = findEocd(buffer);
  assert.equal(buffer.readUInt16LE(eocd + 4), 0, "single-disk ZIP");
  assert.equal(buffer.readUInt16LE(eocd + 6), 0, "central directory on disk zero");
  const entriesOnDisk = buffer.readUInt16LE(eocd + 8);
  const entryCount = buffer.readUInt16LE(eocd + 10);
  const centralSize = buffer.readUInt32LE(eocd + 12);
  const centralOffset = buffer.readUInt32LE(eocd + 16);
  assert.equal(entriesOnDisk, entryCount, "single-disk entry count");
  assert.equal(entryCount, 52, "release ZIP member count");
  assert.equal(centralOffset + centralSize, eocd, "central directory ends at EOCD");

  const members = new Map();
  let cursor = centralOffset;
  for (let index = 0; index < entryCount; index += 1) {
    assert.equal(buffer.readUInt32LE(cursor), 0x02014b50, `central header ${index}`);
    const flags = buffer.readUInt16LE(cursor + 8);
    const method = buffer.readUInt16LE(cursor + 10);
    const expectedCrc = buffer.readUInt32LE(cursor + 16);
    const compressedSize = buffer.readUInt32LE(cursor + 20);
    const uncompressedSize = buffer.readUInt32LE(cursor + 24);
    const nameLength = buffer.readUInt16LE(cursor + 28);
    const extraLength = buffer.readUInt16LE(cursor + 30);
    const commentLength = buffer.readUInt16LE(cursor + 32);
    const startDisk = buffer.readUInt16LE(cursor + 34);
    const externalAttributes = buffer.readUInt32LE(cursor + 38);
    const localOffset = buffer.readUInt32LE(cursor + 42);
    const name = strictUtf8(buffer.subarray(cursor + 46, cursor + 46 + nameLength), `ZIP filename ${index}`);
    validateZipPath(name);
    assert.equal(members.has(name), false, `unique ZIP member ${name}`);
    assert.equal(flags & (0x0001 | 0x0008 | 0x0040), 0, `unencrypted descriptor-free ZIP member ${name}`);
    assert.ok(method === 0 || method === 8, `supported ZIP compression for ${name}`);
    assert.equal(startDisk, 0, `ZIP member ${name} starts on disk zero`);
    const mode = externalAttributes >>> 16;
    assert.ok((mode & 0o170000) === 0 || (mode & 0o170000) === 0o100000, `regular ZIP member mode for ${name}`);
    assert.equal(mode & (0o111 | 0o6000), 0, `non-executable ZIP member ${name}`);

    assert.equal(buffer.readUInt32LE(localOffset), 0x04034b50, `local header ${name}`);
    const localNameLength = buffer.readUInt16LE(localOffset + 26);
    const localExtraLength = buffer.readUInt16LE(localOffset + 28);
    const dataOffset = localOffset + 30 + localNameLength + localExtraLength;
    const compressed = buffer.subarray(dataOffset, dataOffset + compressedSize);
    const data = method === 0 ? compressed : inflateRawSync(compressed);
    assert.equal(data.length, uncompressedSize, `${name} uncompressed bytes`);
    assert.equal(crc32(data), expectedCrc, `${name} CRC-32`);
    members.set(name, data);
    cursor += 46 + nameLength + extraLength + commentLength;
  }
  assert.equal(cursor, eocd, "parsed central directory length");
  return members;
}

function verifyReleaseRecords(members) {
  const prefix = `${releaseRoot}/`;
  const sumsName = `${prefix}SHA256SUMS.txt`;
  const manifestName = `${prefix}release_manifest.json`;
  const copyName = `${prefix}website_copy.md`;
  assert.equal(members.size, 52);
  const hashes = new Map([...members].map(([name, data]) => [name, sha256(data)]));

  const sumsText = strictUtf8(members.get(sumsName), "SHA256SUMS.txt");
  assert.ok(sumsText.endsWith("\n"), "SHA256SUMS.txt final newline");
  const sums = new Map();
  for (const [index, line] of sumsText.trimEnd().split("\n").entries()) {
    const match = line.match(/^([0-9a-f]{64})  ([^\r\n]+)$/);
    assert.ok(match, `SHA256SUMS line ${index + 1}`);
    const [, digest, relative] = match;
    assert.equal(sums.has(relative), false, `unique checksum path ${relative}`);
    assert.equal(hashes.get(`${prefix}${relative}`), digest, `checksum line ${relative}`);
    sums.set(relative, digest);
  }
  assert.equal(sums.size, 51, "all SHA256SUMS lines verified");
  assert.deepEqual(
    new Set(sums.keys()),
    new Set([...members.keys()].filter((name) => name !== sumsName).map((name) => name.slice(prefix.length))),
    "SHA256SUMS exact coverage",
  );

  assert.equal(members.get(manifestName).length, 11_620, "release_manifest.json bytes");
  assert.equal(hashes.get(manifestName), "49fa61da60eb6be13465904fbbd7f0b3425d61295704f584087d01f3ca1db91c");
  assert.equal(members.get(copyName).length, 9_189, "website_copy.md bytes");
  assert.equal(hashes.get(copyName), "87552cc7fcea10ced8245dfbc9ed0669a68279c31ce1a4ef6f2a8c4778403a19");

  const manifest = JSON.parse(strictUtf8(members.get(manifestName), "release_manifest.json"));
  assert.equal(manifest.package, releaseRoot);
  assert.equal(manifest.files.length, 50, "release manifest record count");
  const manifestPaths = new Set();
  for (const record of manifest.files) {
    assert.equal(manifestPaths.has(record.path), false, `unique release manifest path ${record.path}`);
    const fullName = `${prefix}${record.path}`;
    assert.ok(members.has(fullName), `manifest member exists: ${record.path}`);
    assert.equal(members.get(fullName).length, record.size_bytes, `manifest bytes ${record.path}`);
    assert.equal(hashes.get(fullName), record.sha256, `manifest SHA-256 ${record.path}`);
    assert.equal(sums.get(record.path), record.sha256, `manifest/checksum agreement ${record.path}`);
    manifestPaths.add(record.path);
  }
  assert.deepEqual(
    manifestPaths,
    new Set([...members.keys()]
      .filter((name) => name !== manifestName && name !== sumsName)
      .map((name) => name.slice(prefix.length))),
    "release manifest exact coverage",
  );
  return { manifest, copyText: strictUtf8(members.get(copyName), "website_copy.md") };
}

function copySection(source, heading, nextHeading) {
  const start = `## ${heading}\n\n`;
  const tail = source.split(start, 2)[1];
  assert.ok(tail !== undefined, `website copy section ${heading}`);
  return nextHeading ? tail.split(`\n\n## ${nextHeading}`, 1)[0] : tail.trimEnd();
}

async function walkFiles(directory) {
  const results = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) results.push(...await walkFiles(entryPath));
    else if (entry.isFile()) results.push(entryPath);
  }
  return results;
}

const verified = {};
for (const [key, expected] of Object.entries(assets)) {
  const buffer = await verifyFile(path.join(mainRoot, expected.filename), expected);
  verified[key] = buffer;
  if (expected.mimeType === "image/png") parsePng(buffer, expected);
}

assert.equal(verified.pdf.subarray(0, 5).toString("ascii"), "%PDF-", "publication PDF signature");
const svgText = strictUtf8(verified.svg, "Figure 5 SVG");
assert.match(svgText, /<svg\b[^>]*\bwidth="518\.740157pt"[^>]*\bheight="674\.645669pt"[^>]*\bviewBox="0 0 518\.740157 674\.645669"/s);
assert.match(svgText, /<svg\b[^>]*\brole="img"/);
assert.match(svgText, /<title\b[^>]*id="cgt-fig5-title"/);
assert.match(svgText, /<desc\b[^>]*id="cgt-fig5-desc"/);
assert.equal((svgText.match(/<image\b/g) ?? []).length, 1, "exactly one SVG raster layer");
assert.equal((svgText.match(/<text\b/g) ?? []).length, 0, "SVG text is converted to paths");
assert.doesNotMatch(svgText, /(?:href|xlink:href)="(?:https?:|file:)/i);

const audit = JSON.parse(strictUtf8(verified.audit_json, "Figure 5 audit JSON"));
assert.equal(audit.status, "pass");
assert.deepEqual(audit.failures, []);
assert.deepEqual(audit.formats.pdf_page_pt, [518.7401574803, 674.6456692913]);
assert.equal(audit.formats.svg_embedded_image_count, 1);
assert.equal(audit.geometry.minimum_font_size_pt, 6);
assert.equal(audit.geometry.boundary_violation_count, 0);
assert.equal(audit.geometry.text_overlap_count, 0);
assert.equal(audit.geometry.centroid_label_count, 33);
assert.ok(audit.formats.pdf_fonts.every((font) => !/Type\s*3/i.test(font)), "audit records no Type 3 font");
assert.equal(audit.scientific.samples_input, 9359);
assert.equal(audit.scientific.samples_excluded, 57);
assert.equal(audit.scientific.samples_retained, 9302);
assert.equal(audit.scientific.cancer_types, 33);
assert.equal(audit.scientific.score_sets, 15);
assert.equal(audit.scientific.unique_recovered_genes, 970);
assert.ok(Math.abs(audit.scientific.all15_max_abs_residual_spearman - 0.8714980965371082) < 1e-15);
assert.equal(audit.provenance.status, "disclosed_unreconciled_notebook_version_mismatch");

const members = parseZip(verified.reproducibility_zip);
const releaseRecords = verifyReleaseRecords(members);
for (const [key, expected] of Object.entries(assets)) {
  if (!expected.releasePath) continue;
  assert.ok(
    verified[key].equals(members.get(`${releaseRoot}/${expected.releasePath}`)),
    `${expected.filename} public bytes equal the release member`,
  );
}

const copyPath = path.join(projectRoot, "app", "research", "cgt", "figure-05-copy.json");
const copy = JSON.parse(await readFile(copyPath, "utf8"));
const sourceTitle = copySection(releaseRecords.copyText, "Title", "Concise alt text");
const sourceAlt = copySection(releaseRecords.copyText, "Concise alt text", "Caption");
const sourceCaption = copySection(releaseRecords.copyText, "Caption", "Accessible description");
const sourceAccessible = copySection(releaseRecords.copyText, "Accessible description");
assert.equal(copy.source_document_bytes, 9189);
assert.equal(copy.source_document_sha256, "87552cc7fcea10ced8245dfbc9ed0669a68279c31ce1a4ef6f2a8c4778403a19");
assert.equal(copy.title, sourceTitle);
assert.equal(copy.alt, sourceAlt);
assert.equal(copy.caption_markdown_lines.join("\n"), sourceCaption);
assert.equal(copy.accessible_description_markdown_lines.join("\n"), sourceAccessible);
assert.equal(sha256(Buffer.from(copy.title)), "dcc71c72c56bb28b117c3aeb2b045004ecdb9373087a314f20b933df4f3bde32");
assert.equal(sha256(Buffer.from(copy.alt)), "dbb5f5753c69dfb2f52ff4aa3954b38789db63de76033301ab276616b421caf2");
assert.equal(sha256(Buffer.from(copy.caption_markdown_lines.join("\n"))), "6dfa735f54513f61511f706a1f76cc72943ba889df7869dfb6befad9350b2124");
assert.equal(sha256(Buffer.from(copy.accessible_description_markdown_lines.join("\n"))), "bfbbffc6b06764f4a3a4edc1178e66c8b1380ff1468ec83f260e89faf4393706");
assert.deepEqual(
  copy.caption_markdown_lines.slice(12, 19),
  [
    "\\[",
    "\\eta^2_{\\mathrm{in},j}=",
    "\\frac{\\sum_c n_c\\left(\\bar{s}_{cj}-\\bar{s}_j\\right)^2}",
    "{\\sum_i\\left(s_{ij}-\\bar{s}_j\\right)^2}.",
    "\\]",
    "",
    "Open circles show raw scores and filled diamonds show pooled leave-one-axis-out residual scores for all 15 score sets, ordered by raw \\(\\eta^2_{\\mathrm{in}}\\). The raw values range from 0.249 to 0.453 and the residual values from 0.256 to 0.570. Residualization increases the statistic for seven scores and decreases it for eight; the unresolved source label has the largest residual value (0.570). These estimates are unadjusted, sample-weighted, and calculated and evaluated in the same cohort, without confidence intervals, permutation calibration, cancer-type balancing, or cross-validation. They measure cancer-type-associated between-group heterogeneity; they do not identify a cancer-type effect or a lineage mechanism.",
  ],
  "display equation delimiters and paragraph order",
);
for (const marker of [
  "**a, Bulk TCGA cohort after expression QC.**",
  "**b, Within-cohort transforms reduce shared score dependence.**",
  "**c, TCGA-fitted PCA of pooled residual scores.**",
  "**d, Within-cancer-type relative mean score profiles.**",
  "**e, In-sample between-cancer-type variance fraction.**",
  "**f, Residual score dependence remains.**",
  "**Interpretive and provenance limitations.**",
]) assert.ok(sourceCaption.includes(marker), `caption marker ${marker}`);

const contentSource = await readFile(path.join(projectRoot, "app", "research", "cgt", "content.ts"), "utf8");
assert.match(contentSource, /import figureFiveCopy from "\.\/figure-05-copy\.json";/);
assert.match(contentSource, /title: figureFiveCopy\.title/);
assert.match(contentSource, /accessibleDescriptionFormat: "markdown"/);
assert.match(contentSource, /responsiveNote: figureFiveCopy\.responsive_presentation_requirement/);
for (const expected of Object.values(assets)) assert.ok(contentSource.includes(expected.filename), `${expected.filename} is referenced by Figure 5 content`);
for (const label of panelLabels) assert.ok(contentSource.includes(label), `${label} is retained`);
for (const minimum of [640, 680, 820, 620, 680]) {
  assert.match(contentSource, new RegExp(`minimumDisplayWidth: ${minimum}`));
}
const figureFiveContent = contentSource.slice(contentSource.indexOf('id: "fig-5"'), contentSource.indexOf("\n  },\n];", contentSource.indexOf('id: "fig-5"')));
assert.doesNotMatch(figureFiveContent, /figure-05-tcga-projection\.(?:png|pdf|svg)/);
assert.match(sourceCaption, /not statistical independence, orthogonality/);
assert.match(figureFiveContent, /unreconciled SHA-256 72d1efabe3dd8c0447817dedae3d6004b47374065eb90f83f9179ad8d525fb81/);
assert.match(figureFiveContent, /does not document the upstream expression-plus-registry formula/);

const publicManifestPath = path.join(figureRoot, "manifest.json");
const publicManifest = JSON.parse(await readFile(publicManifestPath, "utf8"));
assert.equal(publicManifest.schema.version, "1.4.0");
assert.deepEqual(publicManifest.schema.figure_05_release_asset_formats, Object.keys(assets));
const figureFive = publicManifest.figures.find((figure) => figure.id === "figure-05");
assert.ok(figureFive);
assert.equal(figureFive.logical_asset, base);
assert.equal(figureFive.title, copy.title);
assert.equal(figureFive.provenance.source_release.release_id, releaseId);
assert.equal(figureFive.provenance.source_release.sha256, assets.reproducibility_zip.sha256);
assert.equal(figureFive.provenance.release_manifest.sha256, "49fa61da60eb6be13465904fbbd7f0b3425d61295704f584087d01f3ca1db91c");
assert.equal(figureFive.provenance.upstream_notebook.archived_notebook_sha256, "51dee19a0791dfada00fc021649eb19b87789edab728b7afec5be576c25c84f5");
assert.equal(figureFive.provenance.upstream_notebook.later_drive_inventory_sha256, "72d1efabe3dd8c0447817dedae3d6004b47374065eb90f83f9179ad8d525fb81");
assert.equal(figureFive.provenance.upstream_notebook.hashes_reconciled, false);
assert.equal(figureFive.provenance.raw_score_construction_formula_documented, false);
assert.equal(figureFive.freeze.analysis_freeze_date, "2026-07-15");
assert.equal(figureFive.qa.status, "pass");
assert.equal(figureFive.qa.local_release_asset_count, 12);
assert.deepEqual(figureFive.qa.responsive_presentation.panel_order, ["a", "b", "c", "d", "e", "f"]);
assert.deepEqual(figureFive.qa.responsive_presentation.horizontally_scrollable_panels, ["b", "c", "d", "e", "f"]);
assert.deepEqual(figureFive.qa.responsive_presentation.minimum_display_width_css_px, { a: null, b: 640, c: 680, d: 820, e: 620, f: 680 });
for (const [key, expected] of Object.entries(assets)) {
  const record = figureFive.assets[key];
  assert.ok(record, `manifest Figure 5 asset ${key}`);
  assert.equal(record.filename, expected.filename);
  assert.equal(record.local_path, `/research/cgt/figures/main/${expected.filename}`);
  assert.equal(record.repository_path, `public/research/cgt/figures/main/${expected.filename}`);
  assert.equal(record.bytes, expected.bytes);
  assert.equal(record.sha256, expected.sha256);
  assert.equal(record.mime_type, expected.mimeType);
}
for (const [key, alias] of Object.entries(figureFive.compatibility_aliases)) {
  assert.equal(alias.active_page_reference, false, `${key} legacy alias is inactive`);
  assert.equal(alias.compatibility_status, "inactive_legacy_artifact");
  await verifyFile(path.join(projectRoot, alias.repository_path), {
    filename: alias.filename,
    bytes: alias.bytes,
    sha256: alias.sha256,
  });
}

let activeCount = 0;
let aliasCount = 0;
const physicalPaths = new Set();
for (const figure of publicManifest.figures) {
  for (const record of Object.values(figure.assets)) {
    activeCount += 1;
    assert.equal(physicalPaths.has(record.repository_path), false, `unique manifest path ${record.repository_path}`);
    physicalPaths.add(record.repository_path);
    await verifyFile(path.join(projectRoot, record.repository_path), {
      filename: record.filename ?? path.basename(record.repository_path),
      bytes: record.bytes,
      sha256: record.sha256,
    });
  }
  for (const record of Object.values(figure.compatibility_aliases ?? {})) {
    aliasCount += 1;
    assert.equal(physicalPaths.has(record.repository_path), false, `unique alias path ${record.repository_path}`);
    physicalPaths.add(record.repository_path);
    await verifyFile(path.join(projectRoot, record.repository_path), {
      filename: record.filename ?? path.basename(record.repository_path),
      bytes: record.bytes,
      sha256: record.sha256,
    });
  }
}
assert.equal(activeCount, 58, "recomputed active asset count");
assert.equal(aliasCount, 12, "recomputed compatibility alias count");
assert.equal(physicalPaths.size, 70, "recomputed physical asset count");
assert.equal(publicManifest.report.active_physical_asset_count, activeCount);
assert.equal(publicManifest.report.compatibility_alias_count, aliasCount);
assert.equal(publicManifest.report.physical_asset_count, physicalPaths.size);
assert.equal(publicManifest.audit.integrity.expected_physical_assets, physicalPaths.size);
assert.equal(publicManifest.audit.integrity.present_physical_assets, physicalPaths.size);
assert.equal(publicManifest.audit.integrity.sha256_matches, physicalPaths.size);
assert.equal(publicManifest.audit.integrity.byte_size_matches, physicalPaths.size);
const actualPhysicalFiles = [
  ...await walkFiles(path.join(figureRoot, "main")),
  ...await walkFiles(path.join(figureRoot, "supplementary")),
];
assert.equal(actualPhysicalFiles.length, physicalPaths.size, "manifest count equals figure asset tree");
assert.deepEqual(
  new Set(actualPhysicalFiles.map((filePath) => path.relative(projectRoot, filePath))),
  physicalPaths,
  "manifest records every main and supplementary physical asset",
);

const pageSource = await readFile(path.join(projectRoot, "app", "research", "cgt", "page.tsx"), "utf8");
assert.match(pageSource, /analysisFreeze: "15 July 2026"/);
assert.match(pageSource, /dateModified: "2026-08-23"/);
assert.match(pageSource, /dateModifiedIso: "2026-08-23T\d{2}:\d{2}:\d{2}Z"/);
assert.match(pageSource, /webReportDate: "23 August 2026"/);
assert.match(pageSource, /version: "0\.4\.0"/);
assert.match(pageSource, /modifiedTime: reportMetadata\.dateModifiedIso/);
assert.match(pageSource, /dateModified: reportMetadata\.dateModified/);
assert.match(pageSource, /version: reportMetadata\.version/);
assert.match(pageSource, /<dt>Web report<\/dt><dd>\{reportMetadata\.webReportDate\}<\/dd>/);
assert.match(pageSource, /<dt>Version<\/dt><dd>\{reportMetadata\.version\}<\/dd>/);
assert.match(pageSource, /version \{reportMetadata\.version\}/);
assert.doesNotMatch(pageSource, /tumor-state projection|TCGA projection|orthogonal projection|independently defined axes|lineage manifestation|leave-one-axis-out global residualization|cancer-type R²/i);
for (const required of [
  "9,359 tumor-derived bulk-expression samples entering expression QC",
  "pooled leave-one-axis-out residualization",
  "not leave-one-sample-out validation",
  "expected properties of the transforms",
  "does not establish CGT specificity",
  "does not document the upstream formula mapping TCGA expression",
]) assert.ok(pageSource.includes(required), `page includes ${required}`);
assert.match(pageSource, /Residual correlations remain as\s+high as 0\.871/);

const sitemapSource = await readFile(path.join(projectRoot, "public", "sitemap.xml"), "utf8");
assert.match(sitemapSource, /<loc>https:\/\/johnpatrickcollins\.info\/research\/cgt<\/loc><lastmod>2026-08-23<\/lastmod>/);
const responsiveSource = await readFile(path.join(projectRoot, "app", "research", "responsive-research-figure.tsx"), "utf8");
const responsiveCss = await readFile(path.join(projectRoot, "app", "research", "responsive-research-figure.module.css"), "utf8");
assert.match(responsiveSource, /alt=""/);
assert.match(responsiveSource, /tabIndex=\{scrollable \? 0 : undefined\}/);
assert.match(responsiveSource, /aria-keyshortcuts=\{scrollable \? "ArrowLeft ArrowRight" : undefined\}/);
assert.match(responsiveCss, /@media \(max-width: 1080px\)/);
assert.match(responsiveCss, /\.panelScroller\s*\{[^}]*overflow-x: auto;[^}]*overscroll-behavior-inline: contain;/s);
assert.match(responsiveCss, /\.panelScroller img\s*\{[^}]*min-width: var\(--research-panel-min-width\);/s);

console.log(JSON.stringify({
  status: "pass",
  release_id: releaseId,
  public_asset_count: Object.keys(assets).length,
  byte_exact_public_assets: Object.keys(assets).length,
  archive_members: members.size,
  checksum_lines: 51,
  manifest_entries: releaseRecords.manifest.files.length,
  active_assets: activeCount,
  compatibility_aliases: aliasCount,
  physical_assets: physicalPaths.size,
  responsive_panel_order: ["a", "b", "c", "d", "e", "f"],
}, null, 2));
