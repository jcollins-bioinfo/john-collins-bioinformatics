import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const mainRoot = path.join(projectRoot, "public", "research", "cgt", "figures", "main");
const manifestPath = path.join(projectRoot, "public", "research", "cgt", "figures", "manifest.json");
const contentPath = path.join(projectRoot, "app", "research", "cgt", "content.ts");
const copyPath = path.join(projectRoot, "app", "research", "cgt", "figure-02-copy.json");

const title = "Residual family-coordinate structure recurs within the leave-dataset-out benchmark but attenuates under study-proxy and context exclusion";
const alt = "Six-panel figure separates two analysis universes. In PREDICT-003B (2,720 observations, 39 datasets, 8 contexts), context and dataset-shrinkage residuals show mean same-label leave-dataset-out cosine near 0.56, with shuffled and random-label controls near zero, but the signal falls to about 0.04 after a same-study-prefix exclusion and 0.07–0.08 under leave-context-out evaluation. META-003 (248 modes, 43 datasets, 9 contexts) contains one dominant broad-recurrence family, F14, and many single-context families. Results are descriptive and preprocessing-dependent, not causal or universally transportable.";

const assets = {
  png_web: {
    filename: "CGT_FIGURE_002_recurrent_geometry_revised_web.png",
    bytes: 994659,
    sha256: "43704a92196e9681c0cd8c8c666e56c7e69461e530a1a84bbdd4d662cac9e5e6",
    mime_type: "image/png",
  },
  png_600dpi: {
    filename: "CGT_FIGURE_002_recurrent_geometry_revised_600dpi.png",
    bytes: 1051585,
    sha256: "a530b276be8dd3d51a025c9a90e93f3226960102e5b30d29759123f4ae1f14bd",
    mime_type: "image/png",
  },
  pdf: {
    filename: "CGT_FIGURE_002_recurrent_geometry_revised.pdf",
    bytes: 41435,
    sha256: "5a1d008c95ad3c214193a5aeefa6dcf053336d8f4f7a1ef74354b93f4e6e753d",
    mime_type: "application/pdf",
  },
  svg: {
    filename: "CGT_FIGURE_002_recurrent_geometry_revised.svg",
    bytes: 265227,
    sha256: "7c418610b2beef4f112b266b1765b5007ef2ff9e1dd03ba4f17b8bcea78b3721",
    mime_type: "image/svg+xml",
  },
  reproducibility_zip: {
    filename: "CGT_FIGURE_002_recurrent_geometry_revised_v1.zip",
    bytes: 18958999,
    sha256: "3c187c5dd4369e9cd0c4b4c91386ed37b675b446de7dde637a5f8d85642cc947",
    mime_type: "application/zip",
  },
  audit_json: {
    filename: "CGT_FIGURE_002_recurrent_geometry_revised_audit.json",
    bytes: 19215,
    sha256: "6631f78a4a447b57c630ebe535e8afbdd463892f88feb7e58b701cc263ec4a58",
    mime_type: "application/json",
  },
};

const aliases = {
  png: ["figure-02-recurrent-geometry.png", "png_600dpi"],
  pdf: ["figure-02-recurrent-geometry.pdf", "pdf"],
  svg: ["figure-02-recurrent-geometry.svg", "svg"],
};

function sha256(buffer) {
  return createHash("sha256").update(buffer).digest("hex");
}

async function verifyFile(filePath, expected) {
  const buffer = await readFile(filePath);
  const fileStat = await stat(filePath);
  assert.equal(fileStat.size, expected.bytes, `${expected.filename} byte count`);
  assert.equal(sha256(buffer), expected.sha256, `${expected.filename} SHA-256`);
  return buffer;
}

function parsePng(buffer) {
  assert.ok(buffer.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])), "PNG signature");
  let offset = 8;
  let width;
  let height;
  let dpi;
  let ended = false;
  while (offset < buffer.length) {
    const length = buffer.readUInt32BE(offset);
    const type = buffer.toString("ascii", offset + 4, offset + 8);
    const payload = offset + 8;
    const next = payload + length + 4;
    assert.ok(next <= buffer.length, `PNG ${type} chunk is in bounds`);
    if (type === "IHDR") {
      width = buffer.readUInt32BE(payload);
      height = buffer.readUInt32BE(payload + 4);
    } else if (type === "pHYs" && buffer[payload + 8] === 1) {
      dpi = [buffer.readUInt32BE(payload) * 0.0254, buffer.readUInt32BE(payload + 4) * 0.0254];
    } else if (type === "IEND") {
      assert.equal(next, buffer.length, "PNG has no trailing bytes after IEND");
      ended = true;
      break;
    }
    offset = next;
  }
  assert.ok(ended && width && height, "PNG has IHDR and IEND");
  return { width, height, dpi };
}

function parseZipInventory(buffer) {
  const minimum = Math.max(0, buffer.length - 65557);
  let eocd = -1;
  for (let offset = buffer.length - 22; offset >= minimum; offset -= 1) {
    if (buffer.readUInt32LE(offset) === 0x06054b50) {
      eocd = offset;
      break;
    }
  }
  assert.notEqual(eocd, -1, "ZIP end-of-central-directory record exists");
  const entries = buffer.readUInt16LE(eocd + 10);
  const centralSize = buffer.readUInt32LE(eocd + 12);
  const centralOffset = buffer.readUInt32LE(eocd + 16);
  let offset = centralOffset;
  let directories = 0;
  let regularFiles = 0;
  let uncompressedBytes = 0;
  const names = new Set();
  const foldedNames = new Set();
  const normalizedNames = new Set();
  for (let index = 0; index < entries; index += 1) {
    assert.equal(buffer.readUInt32LE(offset), 0x02014b50, `ZIP central record ${index}`);
    const flags = buffer.readUInt16LE(offset + 8);
    const uncompressed = buffer.readUInt32LE(offset + 24);
    const nameLength = buffer.readUInt16LE(offset + 28);
    const extraLength = buffer.readUInt16LE(offset + 30);
    const commentLength = buffer.readUInt16LE(offset + 32);
    const name = buffer.toString("utf8", offset + 46, offset + 46 + nameLength);
    assert.equal(flags & 1, 0, `${name} is not encrypted`);
    assert.ok(name.startsWith("CGT_FIGURE_002_recurrent_geometry_revised_v1/"), `${name} has the approved top level`);
    assert.ok(!name.startsWith("/") && !name.includes("\\") && !name.split("/").includes(".."), `${name} has a safe path`);
    assert.ok(!names.has(name), `${name} is unique`);
    names.add(name);
    const folded = name.toLocaleLowerCase("en-US");
    const normalized = name.normalize("NFC");
    assert.ok(!foldedNames.has(folded), `${name} has no case-fold collision`);
    assert.ok(!normalizedNames.has(normalized), `${name} has no Unicode-normalization collision`);
    foldedNames.add(folded);
    normalizedNames.add(normalized);
    if (name.endsWith("/")) directories += 1;
    else regularFiles += 1;
    uncompressedBytes += uncompressed;
    offset += 46 + nameLength + extraLength + commentLength;
  }
  assert.equal(offset, centralOffset + centralSize, "ZIP central-directory length");
  return { entries, directories, regularFiles, uncompressedBytes };
}

const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
const figureTwo = manifest.figures.find((figure) => figure.id === "figure-02");
assert.ok(figureTwo, "Figure 2 manifest entry exists");
assert.equal(figureTwo.title, title);
const activeAssetPaths = manifest.figures.flatMap((figure) =>
  Object.values(figure.assets ?? {}).map((asset) => asset.repository_path));
const compatibilityAliasPaths = manifest.figures.flatMap((figure) =>
  Object.values(figure.compatibility_aliases ?? {}).map((asset) => asset.repository_path));
assert.equal(new Set(activeAssetPaths).size, activeAssetPaths.length, "active asset repository paths are unique");
assert.equal(new Set(compatibilityAliasPaths).size, compatibilityAliasPaths.length, "compatibility alias repository paths are unique");
assert.equal(activeAssetPaths.length, 58);
assert.equal(compatibilityAliasPaths.length, 12);
assert.equal(manifest.report.active_physical_asset_count, activeAssetPaths.length);
assert.equal(manifest.report.compatibility_alias_count, compatibilityAliasPaths.length);
assert.equal(manifest.report.physical_asset_count, activeAssetPaths.length + compatibilityAliasPaths.length);
assert.equal(manifest.audit.integrity.expected_physical_assets, 70);
assert.equal(manifest.audit.integrity.sha256_matches, 70);
assert.deepEqual(manifest.schema.figure_02_release_asset_formats, Object.keys(assets));

const verified = {};
for (const [key, expected] of Object.entries(assets)) {
  const manifestAsset = figureTwo.assets[key];
  assert.ok(manifestAsset, `manifest includes ${key}`);
  assert.equal(manifestAsset.filename, expected.filename);
  assert.equal(manifestAsset.bytes, expected.bytes);
  assert.equal(manifestAsset.sha256, expected.sha256);
  assert.equal(manifestAsset.mime_type, expected.mime_type);
  verified[key] = await verifyFile(path.join(mainRoot, expected.filename), expected);
}

assert.deepEqual(parsePng(verified.png_web), { width: 2400, height: 2500, dpi: [333.32419999999996, 333.32419999999996] });
const publicationPng = parsePng(verified.png_600dpi);
assert.deepEqual(publicationPng, { width: 4320, height: 4500, dpi: [599.9988, 599.9988] });

const pdf = verified.pdf.toString("latin1");
assert.match(pdf, /^%PDF-1\.4/);
assert.match(pdf, /\/MediaBox \[ 0 0 518\.4 540 \]/);
assert.equal((pdf.match(/\/FontFile2\b/g) ?? []).length, 2, "PDF embeds two TrueType subsets");
assert.match(pdf, /DejaVuSans-Bold/);
assert.match(pdf, /DejaVuSans/);
assert.doesNotMatch(pdf, /\/JavaScript\b|\/JS\b|\/EmbeddedFile\b|\/Encrypt\b/);

const svg = verified.svg.toString("utf8");
assert.match(svg, /<svg\b[^>]*width="182\.88mm"[^>]*height="190\.50mm"[^>]*viewBox="0 0 518\.4 540"/s);
assert.doesNotMatch(svg, /<(?:script|image|text|foreignObject|object|iframe)\b/i);
for (const match of svg.matchAll(/(?:href|xlink:href)="([^"]+)"/g)) {
  assert.ok(match[1].startsWith("#"), `SVG reference remains internal: ${match[1]}`);
}

assert.deepEqual(parseZipInventory(verified.reproducibility_zip), {
  entries: 193,
  directories: 35,
  regularFiles: 158,
  uncompressedBytes: 33327973,
});

const audit = JSON.parse(verified.audit_json.toString("utf8"));
assert.equal(audit.status, "pass");
assert.ok(Object.values(audit.mandatory_rules).every(Boolean), "all mandatory audit rules pass");
assert.equal(audit.human_visual_review.status, "pass");
assert.equal(audit.geometry.minimum_font_size_pt, 7);
assert.equal(audit.svg.release_text_elements, 0);
assert.deepEqual(audit.svg.external_references, []);
for (const [key, auditKey] of [["png_web", "web_png"], ["png_600dpi", "publication_png"], ["pdf", "pdf"], ["svg", "svg"]]) {
  assert.equal(audit.core_artifacts[auditKey].sha256, assets[key].sha256, `${auditKey} audit hash`);
}

for (const [key, [filename, sourceKey]] of Object.entries(aliases)) {
  const alias = figureTwo.compatibility_aliases[key];
  assert.equal(alias.active_page_reference, false);
  assert.equal(alias.mirrors_asset, sourceKey);
  assert.equal(alias.repository_path, path.posix.join("public/research/cgt/figures/main", filename));
  const aliasBuffer = await readFile(path.join(mainRoot, filename));
  assert.equal(sha256(aliasBuffer), assets[sourceKey].sha256, `${filename} mirrors ${sourceKey}`);
  assert.ok(aliasBuffer.equals(verified[sourceKey]), `${filename} is byte-identical to ${sourceKey}`);
}

const copy = JSON.parse(await readFile(copyPath, "utf8"));
const caption = copy.caption_markdown_lines.join("\n");
const accessibleDescription = copy.accessible_description_markdown_lines.join("\n");
assert.equal(copy.source_document_sha256, "6a476f9fdd64a38c6c96fdb5b695b4ca9dbaff84ea1de2bc4868f093d41a95f1");
assert.equal(sha256(Buffer.from(caption)), "eb29bcbec3c30174ba7e3fbaff025b2391620c819662d9c88f40c17963eb0ff1");
assert.equal(sha256(Buffer.from(accessibleDescription)), "a8c4d4dad575411a2edf2944627a0f5bdaabba1fb805f3bbc19cbc1026dd723f");
assert.match(caption, new RegExp(title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
assert.match(accessibleDescription, /### Accessibility-level interpretation boundary/);

const content = await readFile(contentPath, "utf8");
for (const required of [title, alt, assets.png_web.filename, assets.pdf.filename, assets.svg.filename, ...Object.values(assets).map((asset) => asset.sha256)]) {
  assert.ok(content.includes(required), `content.ts includes ${required}`);
}
for (const [filename] of Object.values(aliases)) {
  assert.ok(!content.includes(`\`${"${mainRoot}"}/${filename}\``), `${filename} is not an active content.ts reference`);
}

console.log(JSON.stringify({
  status: "pass",
  canonical_assets: Object.keys(assets).length,
  compatibility_aliases: Object.keys(aliases).length,
  copy_hashes: "pass",
  png_dimensions_and_dpi: "pass",
  pdf_page_and_fonts: "pass",
  svg_dimensions_and_dependencies: "pass",
  zip_inventory: "pass",
  manifest_and_content_consistency: "pass",
}, null, 2));
