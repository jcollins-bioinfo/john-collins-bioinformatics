import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { access, lstat, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { inflateRawSync, inflateSync } from "node:zlib";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const mainRoot = path.join(projectRoot, "public", "research", "cgt", "figures", "main");
const publicManifestPath = path.join(projectRoot, "public", "research", "cgt", "figures", "manifest.json");
const releaseId = "CGT_FIGURE_004_dependency_aware_synthesis_revised_v1";
const base = "CGT_FIGURE_004_dependency_aware_synthesis_revised";
const releaseManifestName = "CGT_FIGURE_004_release_manifest.json";
const releaseManifestArchivePath = `${releaseId}/${releaseManifestName}`;
const iccSha256 = "2a92d4bae450b76d8b0aa42193df974d75f62738ecebf74f01c5e75b12a95796";

const assets = {
  png_web: {
    filename: `${base}_web.png`,
    releasePath: `assets/${base}_web.png`,
    role: "web_png",
    bytes: 1743554,
    sha256: "89c15cb2751ed1d6513c16d7cd45769605797def3642897ed66b08a91a15d487",
    mime_type: "image/png",
    width: 2400,
    height: 2675,
    dpi: null,
  },
  png_600dpi: {
    filename: `${base}_600dpi.png`,
    releasePath: `assets/${base}_600dpi.png`,
    role: "publication_png",
    bytes: 1535331,
    sha256: "ca83d2408a0788e9c9ab6bd68ac5877b61f51cf8d30932d76f66734f61c8d756",
    mime_type: "image/png",
    width: 4322,
    height: 4818,
    dpi: 599.9988,
  },
  pdf: {
    filename: `${base}.pdf`,
    releasePath: `assets/${base}.pdf`,
    role: "publication_pdf",
    bytes: 71123,
    sha256: "7cbc094b423899486f335be3ecc3005c5b9d7dedc2a9dbad7b1214d885e16b9c",
    mime_type: "application/pdf",
  },
  svg: {
    filename: `${base}.svg`,
    releasePath: `assets/${base}.svg`,
    role: "release_svg",
    bytes: 371346,
    sha256: "267593219bf1e7ec3d7a89b9c5943c734dad6da78afee96eb047828a2764e0a6",
    mime_type: "image/svg+xml",
  },
  mobile_panel_a: panel("a", 360085, "344176f0b42fedc622b81232c08b2ccb34d30e37b97b81dda9c9776ce514e642", 1600, 420),
  mobile_panel_b: panel("b", 338925, "2cb1887f0a3639dc9ad349b4a42a5e0679773ed445ec0ea506f100297c3610a4", 1600, 593),
  mobile_panel_c: panel("c", 229738, "f59fd2148c8b9e556e457a9606a2ca972dd83c96aecdaa616d193c6d73c1cea7", 1200, 999),
  mobile_panel_d: panel("d", 271983, "f620f504a1fd0eefa49bd46248028fc016fe5c594760a2fd965b91c909ede46d", 1600, 758),
  mobile_panel_e: panel("e", 200662, "54315306d77350faeab90b17d1d9defb8797553db94bf22e676392857cf627a6", 1600, 300),
  reproducibility_zip: {
    filename: `${base}_v1.zip`,
    bytes: 15282792,
    sha256: "8b6d475fb04f350707c8c635de40ea3ff9a5dfda66a2edf96b7c2337dbc35128",
    mime_type: "application/zip",
  },
};

const nonFigureFourObjectHashes = {
  "figure-01": "495b137e01f42caf5aecd42f91fcffa78f3241ad64dd07731158a51a9158ea54",
  "figure-02": "7ec68d07d9659f3f08e9c8a1082a50127b0a9ec684b1a52061efe3b0aa7ee7cc",
  "figure-03": "b2851cc4110dd51a72e8f1adf0e50dd675d7f1f6d41a10c6c1b36775e20830ff",
  "figure-05": "5e65b21bcaf638d1e5cf01115dfc5bff6323bb1750072919624addd8b6949e26",
  "figure-s01": "50cde84759423136717dd4c1bffad06921f1b01003266d73058fc35a89b8c723",
  "figure-s02": "3308c27bb22ded897a0eadf1cf1cbbf76e41f9073176853973046717ae885b8a",
  "figure-s03": "a655ec0b3ff9e87b514494f7485c2a43b4699b268938dd96adbf2fd02a2ac73d",
  "figure-s04": "e4bc1fa104924ec72a2b77b54866b793098f5e6787a69a69f1454ca55e7cf3de",
  "figure-s05": "809d736d2f94fd23ae4ea81fa1a98b3217ceb5efca93273053a417cf505ad307",
  "figure-s06": "a1e28174937a41324abf3968f994ed3fd21deecbc43a81e5ae9946b66ca69628",
};

function panel(letter, bytes, digest, width, height) {
  const filename = `${base}_mobile_panel_${letter}.png`;
  return {
    filename,
    releasePath: `assets/${filename}`,
    role: `mobile_panel_${letter}`,
    bytes,
    sha256: digest,
    mime_type: "image/png",
    width,
    height,
    dpi: null,
  };
}

function sha256(value) {
  return createHash("sha256").update(value).digest("hex");
}

function stableValue(value) {
  if (Array.isArray(value)) return value.map(stableValue);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.keys(value).sort().map((key) => [key, stableValue(value[key])]));
  }
  return value;
}

function stableSha256(value) {
  return sha256(Buffer.from(JSON.stringify(stableValue(value))));
}

function decodeUtf8(buffer, label) {
  try {
    return new TextDecoder("utf-8", { fatal: true }).decode(buffer);
  } catch (error) {
    assert.fail(`${label} is not valid UTF-8: ${error}`);
  }
}

function sniffMime(buffer) {
  if (buffer.length >= 8 && buffer.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) return "image/png";
  if (buffer.subarray(0, 5).toString("ascii") === "%PDF-") return "application/pdf";
  if (buffer.length >= 4 && buffer.readUInt32LE(0) === 0x04034b50) return "application/zip";
  const text = decodeUtf8(buffer, "text asset");
  if (/^(?:<\?xml\b[^>]*>\s*)?(?:<!DOCTYPE\s+svg\b[\s\S]*?>\s*)?<svg\b/s.test(text.trimStart())) return "image/svg+xml";
  if (/^#{1,6}\s+\S/m.test(text)) return "text/markdown";
  if (text.trimStart().startsWith("{")) {
    JSON.parse(text);
    return "application/json";
  }
  return "text/plain";
}

async function verifyFile(filePath, expected) {
  const fileStat = await lstat(filePath);
  assert.ok(fileStat.isFile(), `${expected.filename} is a regular file`);
  assert.ok(!fileStat.isSymbolicLink(), `${expected.filename} is not a symbolic link`);
  assert.equal(fileStat.size, expected.bytes, `${expected.filename} byte count`);
  const buffer = await readFile(filePath);
  assert.equal(sha256(buffer), expected.sha256, `${expected.filename} SHA-256`);
  assert.equal(sniffMime(buffer), expected.mime_type, `${expected.filename} MIME type`);
  return buffer;
}

const crcTable = new Uint32Array(256);
for (let index = 0; index < 256; index += 1) {
  let value = index;
  for (let bit = 0; bit < 8; bit += 1) value = (value & 1) ? (0xedb88320 ^ (value >>> 1)) : (value >>> 1);
  crcTable[index] = value >>> 0;
}

function crc32(buffer) {
  let value = 0xffffffff;
  for (const byte of buffer) value = crcTable[(value ^ byte) & 0xff] ^ (value >>> 8);
  return (value ^ 0xffffffff) >>> 0;
}

function parsePng(buffer, expected) {
  let offset = 8;
  let chunkIndex = 0;
  let ihdr;
  let phys;
  let icc;
  const counts = new Map();
  while (offset < buffer.length) {
    assert.ok(offset + 12 <= buffer.length, `${expected.filename} PNG chunk header is in bounds`);
    const length = buffer.readUInt32BE(offset);
    const typeOffset = offset + 4;
    const type = buffer.toString("ascii", typeOffset, typeOffset + 4);
    const payloadStart = offset + 8;
    const payloadEnd = payloadStart + length;
    const next = payloadEnd + 4;
    assert.ok(next <= buffer.length, `${expected.filename} PNG ${type} chunk is in bounds`);
    assert.equal(crc32(buffer.subarray(typeOffset, payloadEnd)), buffer.readUInt32BE(payloadEnd), `${expected.filename} PNG ${type} CRC`);
    counts.set(type, (counts.get(type) ?? 0) + 1);
    if (type === "IHDR") {
      assert.equal(chunkIndex, 0, `${expected.filename} IHDR is first`);
      ihdr = {
        width: buffer.readUInt32BE(payloadStart),
        height: buffer.readUInt32BE(payloadStart + 4),
        bitDepth: buffer[payloadStart + 8],
        colorType: buffer[payloadStart + 9],
        compression: buffer[payloadStart + 10],
        filter: buffer[payloadStart + 11],
        interlace: buffer[payloadStart + 12],
      };
    } else if (type === "pHYs") {
      phys = {
        x: buffer.readUInt32BE(payloadStart),
        y: buffer.readUInt32BE(payloadStart + 4),
        unit: buffer[payloadStart + 8],
      };
    } else if (type === "iCCP") {
      const payload = buffer.subarray(payloadStart, payloadEnd);
      const nameEnd = payload.indexOf(0);
      assert.ok(nameEnd > 0, `${expected.filename} iCCP profile name`);
      assert.equal(payload[nameEnd + 1], 0, `${expected.filename} iCCP zlib method`);
      const profile = inflateSync(payload.subarray(nameEnd + 2));
      icc = { bytes: profile.length, sha256: sha256(profile) };
    } else if (type === "IEND") {
      assert.equal(length, 0, `${expected.filename} IEND length`);
      assert.equal(next, buffer.length, `${expected.filename} has no trailing bytes`);
    }
    offset = next;
    chunkIndex += 1;
  }
  assert.deepEqual(ihdr, {
    width: expected.width,
    height: expected.height,
    bitDepth: 8,
    colorType: 2,
    compression: 0,
    filter: 0,
    interlace: 0,
  });
  assert.deepEqual(icc, { bytes: 6922, sha256: iccSha256 });
  assert.equal(counts.get("IHDR"), 1);
  assert.equal(counts.get("iCCP"), 1);
  assert.equal(counts.get("IEND"), 1);
  if (expected.dpi === null) {
    assert.equal(phys, undefined, `${expected.filename} has no embedded DPI claim`);
  } else {
    assert.deepEqual(phys, { x: 23622, y: 23622, unit: 1 });
    assert.equal(phys.x * 0.0254, expected.dpi);
  }
}

function verifyPdf(buffer) {
  const pdf = buffer.toString("latin1");
  assert.match(pdf, /^%PDF-1\.4(?:\r?\n|\r)/);
  assert.match(pdf, /\/MediaBox\s*\[\s*0\s+0\s+518\.7401574803\s+578\.2677165354\s*\]/);
  assert.equal((pdf.match(/\/Type\s*\/Page\b/g) ?? []).length, 1);
  assert.match(pdf, /\/Type\s*\/Pages\b[\s\S]*?\/Count\s+1\b/);
  assert.equal((pdf.match(/\/FontFile2\b/g) ?? []).length, 5);
  assert.equal((pdf.match(/\/Subtype\s*\/Type3\b/g) ?? []).length, 0);
  assert.doesNotMatch(pdf, /\/(?:Encrypt|JavaScript|JS|EmbeddedFile|Filespec|OpenAction|AA|Launch|URI|GoToR|RichMedia|XFA|AcroForm)\b/);
  assert.match(pdf, /%%EOF\s*$/);
}

function verifySvg(buffer) {
  const svg = decodeUtf8(buffer, "public Figure 4 SVG");
  assert.match(svg, /<svg\b[^>]*width="518\.740157pt"[^>]*height="578\.267717pt"[^>]*viewBox="0 0 518\.740157 578\.267717"/s);
  assert.match(svg, /<title\b[^>]*>Figure 4: Dependency-aware synthesis of current CGT analyses and their generalization boundaries<\/title>/);
  assert.match(svg, /<title>CGT Figure 4 \| Dependency-aware synthesis and generalization boundaries<\/title>/);
  assert.match(svg, /<desc\b[^>]*>Five-panel synthesis of claim scope/);
  assert.equal((svg.match(/<title\b/g) ?? []).length, 2);
  assert.equal((svg.match(/<desc\b/g) ?? []).length, 1);
  assert.doesNotMatch(svg, /<(?:text|image|script)\b/i);
  assert.doesNotMatch(svg, /\b(?:href|xlink:href)="(?!#)/i);
}

function findEndOfCentralDirectory(buffer) {
  for (let offset = buffer.length - 22; offset >= Math.max(0, buffer.length - 65557); offset -= 1) {
    if (buffer.readUInt32LE(offset) === 0x06054b50) return offset;
  }
  assert.fail("ZIP end-of-central-directory record not found");
}

function parseZip(buffer) {
  const eocd = findEndOfCentralDirectory(buffer);
  assert.equal(buffer.readUInt16LE(eocd + 4), 0, "ZIP EOCD disk number");
  assert.equal(buffer.readUInt16LE(eocd + 6), 0, "ZIP central directory disk");
  const entryCount = buffer.readUInt16LE(eocd + 10);
  assert.equal(buffer.readUInt16LE(eocd + 8), entryCount, "ZIP entry counts agree");
  assert.equal(buffer.readUInt16LE(eocd + 20), 0, "ZIP comment is empty");
  const centralSize = buffer.readUInt32LE(eocd + 12);
  const centralOffset = buffer.readUInt32LE(eocd + 16);
  assert.equal(centralOffset + centralSize, eocd, "ZIP central directory ends at EOCD");

  const entries = [];
  let cursor = centralOffset;
  while (cursor < eocd) {
    assert.equal(buffer.readUInt32LE(cursor), 0x02014b50, "ZIP central header signature");
    const versionMade = buffer.readUInt16LE(cursor + 4);
    const versionNeeded = buffer.readUInt16LE(cursor + 6);
    const flags = buffer.readUInt16LE(cursor + 8);
    const method = buffer.readUInt16LE(cursor + 10);
    const dosTime = buffer.readUInt16LE(cursor + 12);
    const dosDate = buffer.readUInt16LE(cursor + 14);
    const crc = buffer.readUInt32LE(cursor + 16);
    const compressedSize = buffer.readUInt32LE(cursor + 20);
    const uncompressedSize = buffer.readUInt32LE(cursor + 24);
    const nameLength = buffer.readUInt16LE(cursor + 28);
    const extraLength = buffer.readUInt16LE(cursor + 30);
    const commentLength = buffer.readUInt16LE(cursor + 32);
    const diskStart = buffer.readUInt16LE(cursor + 34);
    const externalAttributes = buffer.readUInt32LE(cursor + 38);
    const localOffset = buffer.readUInt32LE(cursor + 42);
    const nameBytes = buffer.subarray(cursor + 46, cursor + 46 + nameLength);
    const name = decodeUtf8(nameBytes, "ZIP member name");
    assert.ok(Buffer.from(name, "utf8").equals(nameBytes), `${name} has canonical UTF-8 name bytes`);
    assert.equal(versionMade, 0x0314, `${name} ZIP creator/version`);
    assert.equal(versionNeeded, 20, `${name} ZIP required version`);
    assert.ok(flags === 0 || flags === 0x800, `${name} ZIP flags`);
    assert.equal(method, 8, `${name} uses DEFLATE`);
    assert.equal(dosTime, 0, `${name} canonical DOS time`);
    assert.equal(dosDate, 0x5d17, `${name} canonical DOS date 2026-08-23`);
    assert.equal(extraLength, 0, `${name} has no ZIP extra field`);
    assert.equal(commentLength, 0, `${name} has no ZIP comment`);
    assert.equal(diskStart, 0, `${name} starts on disk zero`);
    const mode = externalAttributes >>> 16;
    assert.equal(mode, 0o100644, `${name} is a canonical regular 0644 file`);

    assert.equal(buffer.readUInt32LE(localOffset), 0x04034b50, `${name} local header signature`);
    assert.equal(buffer.readUInt16LE(localOffset + 6), flags, `${name} local/central flags`);
    assert.equal(buffer.readUInt16LE(localOffset + 8), method, `${name} local/central method`);
    assert.equal(buffer.readUInt32LE(localOffset + 14), crc, `${name} local/central CRC`);
    assert.equal(buffer.readUInt32LE(localOffset + 18), compressedSize, `${name} local/central compressed size`);
    assert.equal(buffer.readUInt32LE(localOffset + 22), uncompressedSize, `${name} local/central uncompressed size`);
    const localNameLength = buffer.readUInt16LE(localOffset + 26);
    const localExtraLength = buffer.readUInt16LE(localOffset + 28);
    assert.equal(localExtraLength, 0, `${name} has no local extra field`);
    const localName = buffer.subarray(localOffset + 30, localOffset + 30 + localNameLength);
    assert.ok(localName.equals(nameBytes), `${name} local/central name bytes agree`);
    const dataStart = localOffset + 30 + localNameLength;
    const compressed = buffer.subarray(dataStart, dataStart + compressedSize);
    const data = inflateRawSync(compressed);
    assert.equal(data.length, uncompressedSize, `${name} inflated byte count`);
    assert.equal(crc32(data), crc, `${name} CRC-32`);
    assert.ok(uncompressedSize / Math.max(1, compressedSize) <= 200, `${name} expansion ratio`);
    entries.push({ name, data, compressedSize, uncompressedSize });
    cursor += 46 + nameLength + extraLength + commentLength;
  }
  assert.equal(cursor, eocd);
  assert.equal(entries.length, entryCount);
  return entries;
}

function validateZipInventory(zipBuffer) {
  const entries = parseZip(zipBuffer);
  assert.equal(entries.length, 43);
  const names = entries.map((entry) => entry.name);
  assert.deepEqual(names, names.toSorted((left, right) => Buffer.compare(Buffer.from(left), Buffer.from(right))), "ZIP members are bytewise sorted");
  assert.equal(new Set(names).size, names.length, "ZIP paths are unique");
  assert.equal(new Set(names.map((name) => name.normalize("NFC").toLocaleLowerCase("en-US"))).size, names.length, "ZIP paths do not case-fold collide");
  for (const name of names) {
    assert.ok(name.startsWith(`${releaseId}/`), `${name} uses the expected top-level directory`);
    assert.ok(!name.startsWith("/") && !name.includes("\\"), `${name} is a portable relative path`);
    assert.ok(!name.split("/").some((part) => part === "" || part === "." || part === ".."), `${name} has no traversal component`);
    assert.doesNotMatch(name, /[\u0000-\u001f\u007f-\u009f\u202a-\u202e\u2066-\u2069]/u);
    assert.doesNotMatch(name.toLowerCase(), /\.(?:zip|tar|tgz|tbz2?|txz|7z|rar|gz|bz2|xz|zst|dmg)$/);
  }
  const compressedTotal = entries.reduce((sum, entry) => sum + entry.compressedSize, 0);
  const uncompressedTotal = entries.reduce((sum, entry) => sum + entry.uncompressedSize, 0);
  assert.equal(compressedTotal, 15270974);
  assert.equal(uncompressedTotal, 16457905);
  assert.ok(uncompressedTotal / compressedTotal <= 100);

  const members = new Map(entries.map((entry) => [entry.name, entry.data]));
  const manifestBuffer = members.get(releaseManifestArchivePath);
  assert.ok(manifestBuffer, "release manifest is present in ZIP");
  assert.equal(manifestBuffer.length, 16423);
  assert.equal(sha256(manifestBuffer), "ebc8b2e662e3b60253e32fee3cd3db6336c57e76a74bac888af787518e97ced5");
  const manifest = JSON.parse(decodeUtf8(manifestBuffer, "release manifest"));
  assert.equal(manifest.release_id, releaseId);
  assert.equal(manifest.schema_version, "1.0.0");
  assert.equal(manifest.manifest_policy.self_excluding, true);
  assert.equal(manifest.entries.length, 42);
  const expectedNames = manifest.entries.map((entry) => `${releaseId}/${entry.path}`);
  assert.deepEqual(names, [...expectedNames, releaseManifestArchivePath].toSorted((left, right) => Buffer.compare(Buffer.from(left), Buffer.from(right))));
  for (const record of manifest.entries) {
    const data = members.get(`${releaseId}/${record.path}`);
    assert.ok(data, `${record.path} is present`);
    assert.equal(data.length, record.bytes, `${record.path} manifest byte count`);
    assert.equal(sha256(data), record.sha256, `${record.path} manifest SHA-256`);
  }
  for (const expected of Object.values(assets).filter((asset) => asset.releasePath)) {
    const record = manifest.entries.find((entry) => entry.path === expected.releasePath);
    assert.ok(record, `${expected.releasePath} is listed in release manifest`);
    assert.equal(record.role, expected.role);
    assert.equal(record.mime_type, expected.mime_type);
    assert.equal(record.bytes, expected.bytes);
    assert.equal(record.sha256, expected.sha256);
  }
  const audit = JSON.parse(decodeUtf8(
    members.get(`${releaseId}/audit/${base}_audit.json`),
    "packaged Figure 4 audit",
  ));
  assert.equal(audit.status, "pass");
  assert.deepEqual(Object.keys(audit.sections).sort(), ["accessibility", "cross_format", "geometry", "pdf", "png", "responsive", "scientific", "svg"]);
  assert.ok(Object.values(audit.sections).every((section) => section.status === "pass"));
  assert.equal(audit.sections.scientific.checks.f10_recurrence_not_jittered, true);
  assert.equal(audit.sections.scientific.checks.all_residual_values_intervals_and_denominators_exact, true);
  assert.deepEqual(audit.sections.scientific.prohibited_constructs_removed, [
    "50:50 composite fitness relevance",
    "bubble area pathway support",
    "coessentiality lift without q",
    "unreported recurrence jitter",
    "within-context duplicate row",
    "fitted-looking causal equations",
  ]);
  return { manifest, members };
}

const verifiedBuffers = {};
for (const [key, expected] of Object.entries(assets)) {
  const buffer = await verifyFile(path.join(mainRoot, expected.filename), expected);
  verifiedBuffers[key] = buffer;
  if (expected.mime_type === "image/png") parsePng(buffer, expected);
}
verifyPdf(verifiedBuffers.pdf);
verifySvg(verifiedBuffers.svg);
const { members } = validateZipInventory(verifiedBuffers.reproducibility_zip);

for (const expected of Object.values(assets).filter((asset) => asset.releasePath)) {
  assert.ok(
    verifiedBuffers[Object.entries(assets).find(([, value]) => value === expected)[0]].equals(members.get(`${releaseId}/${expected.releasePath}`)),
    `${expected.filename} public bytes equal the archive member`,
  );
}

const publicManifest = JSON.parse(await readFile(publicManifestPath, "utf8"));
assert.equal(publicManifest.schema.version, "1.3.0");
assert.deepEqual(publicManifest.schema.figure_04_release_asset_formats, Object.keys(assets));
assert.equal(publicManifest.report.manifest_generated_date_utc, "2026-08-23");
assert.equal(publicManifest.report.active_physical_asset_count, 49);
assert.equal(publicManifest.report.compatibility_alias_count, 9);
assert.equal(publicManifest.report.physical_asset_count, 58);
assert.equal(publicManifest.audit.integrity.result, "pass");
assert.equal(publicManifest.audit.integrity.sha256_matches, 58);
const figureFour = publicManifest.figures.find((figure) => figure.id === "figure-04");
assert.ok(figureFour);
assert.equal(figureFour.title, "Dependency-aware synthesis of current CGT analyses and their generalization boundaries");
assert.equal(figureFour.run_id, "CGT_FIGURE_004");
assert.equal(figureFour.logical_asset, base);
assert.equal(figureFour.provenance.source_release.release_id, releaseId);
assert.equal(figureFour.provenance.source_release.sha256, assets.reproducibility_zip.sha256);
assert.equal(figureFour.provenance.release_manifest.sha256, "ebc8b2e662e3b60253e32fee3cd3db6336c57e76a74bac888af787518e97ced5");
assert.equal(figureFour.provenance.approved_copy.sha256, "9ca245a2de219fe5bb1eaec9c352fe31d52cd9e9cab02f63d739ae5cf8531aa2");
assert.equal(figureFour.qa.status, "pass");
assert.equal(figureFour.qa.local_release_asset_count, 10);
assert.equal(figureFour.qa.immutable_assets_bypass_image_optimizer, true);
assert.deepEqual(figureFour.qa.responsive_presentation.panel_order, ["a", "b", "c", "d", "e"]);
assert.deepEqual(figureFour.qa.responsive_presentation.horizontally_scrollable_panels, ["a", "b", "d", "e"]);
for (const [key, expected] of Object.entries(assets)) {
  const record = figureFour.assets[key];
  assert.ok(record, `public manifest has Figure 4 asset ${key}`);
  assert.equal(record.filename, expected.filename);
  assert.equal(record.local_path, `/research/cgt/figures/main/${expected.filename}`);
  assert.equal(record.repository_path, `public/research/cgt/figures/main/${expected.filename}`);
  assert.equal(record.bytes, expected.bytes);
  assert.equal(record.sha256, expected.sha256);
  assert.equal(record.mime_type, expected.mime_type);
}
assert.equal(figureFour.compatibility_aliases, undefined);
for (const extension of ["png", "pdf", "svg"]) {
  await assert.rejects(
    access(path.join(mainRoot, `figure-04-evidence-atlas.${extension}`)),
    (error) => error?.code === "ENOENT",
    `obsolete Figure 4 ${extension} alias is absent`,
  );
}
for (const figure of publicManifest.figures) {
  if (figure.id !== "figure-04") {
    assert.equal(stableSha256(figure), nonFigureFourObjectHashes[figure.id], `${figure.id} manifest record is unchanged`);
  }
}

const copyPath = path.join(projectRoot, "app", "research", "cgt", "figure-04-copy.json");
const copy = JSON.parse(await readFile(copyPath, "utf8"));
const approvedCopy = decodeUtf8(members.get(`${releaseId}/documentation/website_copy.md`), "approved website copy");
const caption = approvedCopy.split("## Display title and caption\n\n", 2)[1].split("\n\n## Concise alt text", 1)[0];
const alt = approvedCopy.split("## Concise alt text\n\n", 2)[1].split("\n\n## Detailed accessible description", 1)[0];
const accessibleDescription = approvedCopy.split("## Detailed accessible description\n\n", 2)[1].trimEnd();
assert.equal(copy.source_document_bytes, 11046);
assert.equal(copy.source_document_sha256, "9ca245a2de219fe5bb1eaec9c352fe31d52cd9e9cab02f63d739ae5cf8531aa2");
assert.equal(copy.caption_markdown_lines.join("\n"), caption);
assert.equal(copy.alt, alt);
assert.equal(copy.accessible_description_markdown_lines.join("\n"), accessibleDescription);
assert.equal(sha256(Buffer.from(caption)), copy.caption_sha256);
assert.equal(sha256(Buffer.from(alt)), copy.alt_sha256);
assert.equal(sha256(Buffer.from(accessibleDescription)), copy.accessible_description_sha256);
assert.doesNotMatch(`${caption}\n${accessibleDescription}`, /\bAUC\b/);

const contentSource = await readFile(path.join(projectRoot, "app", "research", "cgt", "content.ts"), "utf8");
for (const expected of Object.values(assets)) assert.ok(contentSource.includes(expected.filename), `${expected.filename} is referenced in Figure 4 content`);
assert.doesNotMatch(contentSource, /figure-04-evidence-atlas\.(?:png|pdf|svg)/);
const pageSource = await readFile(path.join(projectRoot, "app", "research", "cgt", "page.tsx"), "utf8");
assert.match(pageSource, /dateModified: "2026-08-23"/);
assert.match(pageSource, /webReportDate: "23 August 2026"/);
assert.match(pageSource, /version: "0\.3\.1"/);
assert.match(pageSource, /analysisFreeze: "15 July 2026"/);
assert.doesNotMatch(pageSource, /composite fitness-relevance score|one half normalized absolute ridge coefficient/);
assert.doesNotMatch(pageSource, /figure-04-evidence-atlas\.(?:png|pdf|svg)/);
const sitemapSource = await readFile(path.join(projectRoot, "public", "sitemap.xml"), "utf8");
assert.match(
  sitemapSource,
  /<loc>https:\/\/johnpatrickcollins\.info\/research\/cgt<\/loc><lastmod>2026-08-23<\/lastmod>/,
);
assert.doesNotMatch(
  sitemapSource,
  /<loc>https:\/\/johnpatrickcollins\.info\/research\/cgt<\/loc><lastmod>(?!2026-08-23)[^<]+<\/lastmod>/,
);

const responsiveSource = await readFile(path.join(projectRoot, "app", "research", "responsive-research-figure.tsx"), "utf8");
const responsiveCss = await readFile(path.join(projectRoot, "app", "research", "responsive-research-figure.module.css"), "utf8");
assert.doesNotMatch(responsiveSource, /from "next\/image"/);
assert.match(responsiveSource, /<source srcSet=\{vectorSrc\} type="image\/svg\+xml"/);
assert.match(responsiveSource, /src=\{fallbackRasterSrc\}/);
assert.match(responsiveSource, /Swipe or scroll horizontally/);
assert.match(responsiveSource, /minimumDisplayWidth/);
assert.match(responsiveSource, /onKeyDown=\{scrollable \? scrollPanelWithKeyboard : undefined\}/);
assert.match(responsiveSource, /event\.key === "ArrowLeft" \|\| event\.key === "ArrowRight"/);
assert.match(responsiveSource, /behavior: "auto"/);
assert.match(responsiveCss, /@media \(max-width: 1080px\)/);
assert.match(responsiveCss, /overflow-x: auto/);
assert.match(responsiveCss, /min-width: var\(--research-panel-min-width\)/);
assert.match(responsiveCss, /touch-action: pan-x pan-y/);
assert.match(responsiveCss, /prefers-reduced-motion: reduce/);
assert.match(responsiveCss, /forced-colors: active/);
assert.doesNotMatch(responsiveCss, /transform:/);

console.log(JSON.stringify({
  status: "pass",
  release_id: releaseId,
  public_asset_count: Object.keys(assets).length,
  byte_exact_public_assets: Object.keys(assets).length,
  archive_members: 43,
  manifest_entries: 42,
  audit_sections: 8,
  responsive_panel_order: ["a", "b", "c", "d", "e"],
}, null, 2));
