import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { lstat, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { inflateSync } from "node:zlib";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const mainRoot = path.join(projectRoot, "public", "research", "cgt", "figures", "main");
const manifestPath = path.join(projectRoot, "public", "research", "cgt", "figures", "manifest.json");
const contentPath = path.join(projectRoot, "app", "research", "cgt", "content.ts");
const copyPath = path.join(projectRoot, "app", "research", "cgt", "figure-03-copy.json");

const title = "Study-conditioned candidate annotations of context-residualized family-mass directions";
const archiveRoot = "CGT_FIGURE_003_signed_axes_revised_v1";
const manifestRelativePath = "CGT_FIGURE_003_release_manifest.json";
const manifestArchivePath = `${archiveRoot}/${manifestRelativePath}`;
const iccSha256 = "2a92d4bae450b76d8b0aa42193df974d75f62738ecebf74f01c5e75b12a95796";

const assets = {
  png_web: {
    filename: "CGT_FIGURE_003_signed_axes_revised_web.png",
    bytes: 1770635,
    sha256: "f7bee8ebf1bcb491c239fd3cf63908521327c6055af24d50e383acdd139d8ad3",
    mime_type: "image/png",
  },
  png_600dpi: {
    filename: "CGT_FIGURE_003_signed_axes_revised_600dpi.png",
    bytes: 1871881,
    sha256: "30095053cb861bd7be782001fdd7e0fb5f3a988dd3a1d9c204e689b5e0e96398",
    mime_type: "image/png",
  },
  pdf: {
    filename: "CGT_FIGURE_003_signed_axes_revised.pdf",
    bytes: 1600555,
    sha256: "3dab4de28f38762de434eecb6b2a9bf9cde3cd469548231e189abb2627973383",
    mime_type: "application/pdf",
  },
  svg: {
    filename: "CGT_FIGURE_003_signed_axes_revised.svg",
    bytes: 357204,
    sha256: "40634f9fe70e9c002a13a1cc6318d84c96ad602a27f2faa027531b5cea3787a3",
    mime_type: "image/svg+xml",
  },
  reproducibility_zip: {
    filename: "CGT_FIGURE_003_signed_axes_revised_v1.zip",
    bytes: 72565683,
    sha256: "c54503486663c217ddd6348ccef22642255c04112ff936ab615c9e104449987d",
    mime_type: "application/zip",
  },
  audit_json: {
    filename: "CGT_FIGURE_003_signed_axes_revised_audit.json",
    bytes: 104289,
    sha256: "c8ff32a557e9a817d3e71019fd29e5b5001c869c2924ec7f95bfe03f496e6359",
    mime_type: "application/json",
  },
};

const manifestFile = {
  bytes: 183663,
  sha256: "ce03595e96571afb3ea8d58afb2532b40ad3110738ac7c93133fc086ed6f7ef3",
  mime_type: "application/json",
};

const websiteCopyFile = {
  bytes: 17774,
  sha256: "4b149884b48171ab0aacf280f8fcdd532226d3142e656cc9b17d0dc781fc39d4",
  mime_type: "text/markdown",
};

const aliases = {
  png: ["figure-03-signed-axes.png", "png_600dpi"],
  pdf: ["figure-03-signed-axes.pdf", "pdf"],
  svg: ["figure-03-signed-axes.svg", "svg"],
};

const nonFigureThreeObjectHashes = {
  "fig-1": "93040dc55eba2f972330c270cc0cc2990f8b4537e417d10034f1a2c4aded9ba1",
  "fig-2": "f6aa7544927e8281573910c585585fb3c337e64d6e83ffd1e30f9fa0ee218b1b",
  "fig-4": "de9d87b2e27c518793d200388bbb1d2cd5c364ad8b8847ba315cbafa25e43a17",
  "fig-5": "43c81ac5a6ed09b772f9efe2d563aa8ad547dd817e05efb44f0bfab89463c266",
  "fig-s1": "6701ecaf5cf4b9d13a7c317e8d802aa8d4346d292dd83554f93dbddc193a0950",
  "fig-s2": "f5d035097f48a7cb6d3194640cc28b3d4fe0e77dc0f61187f3aaed1427838fca",
  "fig-s3": "dec1ff88a1254a836288e686ae2fa24fe07c0ea180b201ead382923ca32dc3b3",
  "fig-s4": "924b79abed01c2459681cffc89081c417f3c82606b11d12b0c19fa6b679862f4",
  "fig-s5": "eb86f532f4911af0f1db4d6c5401081bc8fe21621487a9ab03df27837c59b95f",
  "fig-s6": "984b0ae016873b2889ccb393a42ab53deec3c6a36ebaa210cf4a25f03cee51df",
};

function sha256(buffer) {
  return createHash("sha256").update(buffer).digest("hex");
}

function stableValue(value) {
  if (Array.isArray(value)) return value.map(stableValue);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.keys(value).sort().map((key) => [key, stableValue(value[key])]),
    );
  }
  return value;
}

function stableSha256(value) {
  return sha256(Buffer.from(JSON.stringify(stableValue(value))));
}

async function verifyFile(filePath, expected) {
  const fileStat = await lstat(filePath);
  assert.ok(fileStat.isFile(), `${expected.filename ?? filePath} is a regular file`);
  assert.ok(!fileStat.isSymbolicLink(), `${expected.filename ?? filePath} is not a symbolic link`);
  assert.equal(fileStat.size, expected.bytes, `${expected.filename ?? filePath} byte count`);
  const buffer = await readFile(filePath);
  assert.equal(sha256(buffer), expected.sha256, `${expected.filename ?? filePath} SHA-256`);
  assert.equal(sniffMime(buffer), expected.mime_type, `${expected.filename ?? filePath} MIME type`);
  return buffer;
}

function decodeUtf8(buffer, label) {
  try {
    return new TextDecoder("utf-8", { fatal: true }).decode(buffer);
  } catch (error) {
    assert.fail(`${label} is not valid UTF-8: ${error}`);
  }
}

function sniffMime(buffer) {
  if (buffer.length >= 8 && buffer.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) {
    return "image/png";
  }
  if (buffer.subarray(0, 5).toString("ascii") === "%PDF-") return "application/pdf";
  if (buffer.length >= 4 && buffer.readUInt32LE(0) === 0x04034b50) return "application/zip";
  const text = decodeUtf8(buffer, "text asset");
  const trimmed = text.trimStart();
  if (/^(?:<\?xml\b[^>]*>\s*)?(?:<!DOCTYPE\s+svg\b[\s\S]*?>\s*)?<svg\b/s.test(trimmed)) return "image/svg+xml";
  if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
    try {
      JSON.parse(text);
      return "application/json";
    } catch {
      // Continue to text classification.
    }
  }
  if (/^#{1,6}\s+\S/m.test(text)) return "text/markdown";
  return "text/plain";
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

function findAll(buffer, signature) {
  const offsets = [];
  let offset = -1;
  while ((offset = buffer.indexOf(signature, offset + 1)) !== -1) offsets.push(offset);
  return offsets;
}

function parsePng(buffer, expected) {
  assert.equal(sniffMime(buffer), "image/png", `${expected.label} PNG signature`);
  let offset = 8;
  let chunkIndex = 0;
  let ihdr;
  let phys;
  let icc;
  let iendCount = 0;
  const seen = new Map();
  while (offset < buffer.length) {
    assert.ok(offset + 12 <= buffer.length, `${expected.label} PNG chunk header is in bounds`);
    const length = buffer.readUInt32BE(offset);
    const typeOffset = offset + 4;
    const type = buffer.toString("ascii", typeOffset, typeOffset + 4);
    const payloadStart = offset + 8;
    const payloadEnd = payloadStart + length;
    const next = payloadEnd + 4;
    assert.ok(next <= buffer.length, `${expected.label} PNG ${type} chunk is in bounds`);
    assert.equal(
      crc32(buffer.subarray(typeOffset, payloadEnd)),
      buffer.readUInt32BE(payloadEnd),
      `${expected.label} PNG ${type} CRC`,
    );
    seen.set(type, (seen.get(type) ?? 0) + 1);
    if (type === "IHDR") {
      assert.equal(chunkIndex, 0, `${expected.label} IHDR is first`);
      assert.equal(length, 13, `${expected.label} IHDR length`);
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
      assert.equal(length, 9, `${expected.label} pHYs length`);
      phys = {
        x: buffer.readUInt32BE(payloadStart),
        y: buffer.readUInt32BE(payloadStart + 4),
        unit: buffer[payloadStart + 8],
      };
    } else if (type === "iCCP") {
      const payload = buffer.subarray(payloadStart, payloadEnd);
      const nameEnd = payload.indexOf(0);
      assert.ok(nameEnd > 0, `${expected.label} iCCP profile name`);
      assert.equal(payload[nameEnd + 1], 0, `${expected.label} iCCP uses zlib compression`);
      const profile = inflateSync(payload.subarray(nameEnd + 2));
      icc = { bytes: profile.length, sha256: sha256(profile) };
    } else if (type === "IEND") {
      assert.equal(length, 0, `${expected.label} IEND length`);
      assert.equal(next, buffer.length, `${expected.label} has no trailing bytes after IEND`);
      iendCount += 1;
    }
    offset = next;
    chunkIndex += 1;
  }
  assert.equal(offset, buffer.length, `${expected.label} PNG consumes the entire file`);
  assert.equal(seen.get("IHDR"), 1, `${expected.label} has one IHDR`);
  assert.equal(seen.get("pHYs"), 1, `${expected.label} has one pHYs`);
  assert.equal(seen.get("iCCP"), 1, `${expected.label} has one iCCP`);
  assert.equal(iendCount, 1, `${expected.label} has one IEND`);
  assert.deepEqual(ihdr, {
    width: expected.width,
    height: expected.height,
    bitDepth: 8,
    colorType: 2,
    compression: 0,
    filter: 0,
    interlace: 0,
  });
  assert.deepEqual(phys, { x: expected.pixelsPerMeter, y: expected.pixelsPerMeter, unit: 1 });
  assert.equal(phys.x * 0.0254, expected.dpi, `${expected.label} horizontal DPI`);
  assert.equal(phys.y * 0.0254, expected.dpi, `${expected.label} vertical DPI`);
  assert.deepEqual(icc, { bytes: 6922, sha256: iccSha256 });
}

function verifyPdf(buffer) {
  assert.equal(sniffMime(buffer), "application/pdf");
  const pdf = buffer.toString("latin1");
  assert.match(pdf, /^%PDF-1\.5(?:\r?\n|\r)/, "PDF version header");
  assert.match(pdf, /\/MediaBox\s*\[\s*0\s+0\s+518\.740157\s+578\.267717\s*\]/, "PDF page geometry");
  assert.equal((pdf.match(/\/Type\s*\/Page\b/g) ?? []).length, 1, "PDF has exactly one page object");
  assert.match(pdf, /\/Type\s*\/Pages\b[\s\S]*?\/Count\s+1\b/, "PDF page tree has one page");
  assert.equal((pdf.match(/\/Subtype\s*\/TrueType\b/g) ?? []).length, 1, "PDF has one TrueType font subset");
  assert.equal((pdf.match(/\/Subtype\s*\/Type3\b/g) ?? []).length, 0, "PDF has no Type 3 font");
  assert.equal((pdf.match(/\/FontFile2\b/g) ?? []).length, 1, "PDF embeds its TrueType font");
  assert.match(pdf, /\/BaseFont\s*\/AAAAAA\+DejaVuSans\b/, "PDF uses the audited embedded font subset");
  assert.match(pdf, /%%EOF\s*$/, "PDF has no payload after its final EOF marker");
  assert.doesNotMatch(
    pdf,
    /\/(?:Encrypt|JavaScript|JS|EmbeddedFile|Filespec|OpenAction|AA|Launch|URI|GoToR|GoToE|RichMedia|XFA|AcroForm|SubmitForm|ImportData)\b/,
    "PDF contains no active, encrypted, embedded, or external-resource features",
  );
}

function verifySvg(buffer) {
  assert.equal(sniffMime(buffer), "image/svg+xml");
  const svg = decodeUtf8(buffer, "release SVG");
  assert.match(
    svg,
    /<svg\b[^>]*\bwidth="183mm"[^>]*\bheight="204mm"[^>]*\bviewBox="0 0 518\.740157 578\.267717"[^>]*>/s,
    "SVG geometry",
  );
  assert.equal((svg.match(/<svg\b/g) ?? []).length, 1, "SVG has one root element");
  assert.equal((svg.match(/<text\b/gi) ?? []).length, 0, "SVG text is converted to paths");
  assert.equal((svg.match(/<tspan\b/gi) ?? []).length, 0, "SVG has no live text spans");
  assert.ok((svg.match(/<path\b/g) ?? []).length > 0, "SVG contains path geometry");
  const approvedDoctype = '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"\n  "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">';
  assert.equal((svg.match(/<!DOCTYPE\b/gi) ?? []).length, 1, "SVG has exactly its audited standard SVG 1.1 doctype");
  assert.ok(svg.includes(approvedDoctype), "SVG doctype is the audited standard SVG 1.1 declaration");
  assert.doesNotMatch(svg.replace(approvedDoctype, ""), /<!DOCTYPE\b|<!ENTITY\b/i, "SVG has no additional DTD or entity declarations");
  assert.doesNotMatch(
    svg,
    /<(?:script|image|foreignObject|object|iframe|embed|audio|video|font|font-face)\b/i,
    "SVG has no script, raster image, foreign content, or live font resource",
  );
  assert.doesNotMatch(svg, /\s(?:on[a-z]+|src|xml:base)\s*=/i, "SVG has no event, source, or base-URL attributes");
  assert.doesNotMatch(svg, /@import\b|@font-face\b|javascript\s*:/i, "SVG CSS has no external or executable dependency");

  const ids = new Set();
  for (const match of svg.matchAll(/\bid="([^"]+)"/g)) {
    assert.ok(!ids.has(match[1]), `SVG ID is unique: ${match[1]}`);
    ids.add(match[1]);
  }
  assert.equal(ids.size, 561, "SVG audited ID count");
  const references = [];
  for (const match of svg.matchAll(/(?:href|xlink:href)\s*=\s*"([^"]+)"/gi)) {
    assert.ok(match[1].startsWith("#"), `SVG reference remains internal: ${match[1]}`);
    references.push(match[1].slice(1));
  }
  for (const match of svg.matchAll(/url\(\s*['"]?([^)'"\s]+)['"]?\s*\)/gi)) {
    assert.ok(match[1].startsWith("#"), `SVG paint/clip reference remains internal: ${match[1]}`);
    references.push(match[1].slice(1));
  }
  assert.ok(references.length > 0, "SVG contains audited internal references");
  for (const reference of references) assert.ok(ids.has(reference), `SVG internal target exists: #${reference}`);
}

function parseStoredZip(buffer) {
  const localSignature = Buffer.from([0x50, 0x4b, 0x03, 0x04]);
  const centralSignature = Buffer.from([0x50, 0x4b, 0x01, 0x02]);
  const eocdSignature = Buffer.from([0x50, 0x4b, 0x05, 0x06]);
  const zip64EocdSignature = Buffer.from([0x50, 0x4b, 0x06, 0x06]);
  const zip64LocatorSignature = Buffer.from([0x50, 0x4b, 0x06, 0x07]);
  const descriptorSignature = Buffer.from([0x50, 0x4b, 0x07, 0x08]);

  assert.equal(buffer.length, 72565683, "ZIP byte count");
  assert.equal(sha256(buffer), assets.reproducibility_zip.sha256, "ZIP SHA-256");
  assert.equal(sniffMime(buffer), "application/zip", "ZIP MIME type");

  const rawEocdOffsets = findAll(buffer, eocdSignature);
  const terminalEocdOffsets = rawEocdOffsets.filter((offset) => {
    if (offset + 22 > buffer.length) return false;
    return offset + 22 + buffer.readUInt16LE(offset + 20) === buffer.length;
  });
  assert.equal(terminalEocdOffsets.length, 1, "ZIP has exactly one structurally valid outer EOCD");
  const eocdOffset = terminalEocdOffsets[0];
  assert.equal(eocdOffset, buffer.length - 22, "ZIP EOCD is terminal with no archive comment or trailing payload");
  assert.equal(buffer.readUInt32LE(eocdOffset), 0x06054b50, "ZIP EOCD signature");
  assert.equal(buffer.readUInt16LE(eocdOffset + 4), 0, "ZIP is on disk zero");
  assert.equal(buffer.readUInt16LE(eocdOffset + 6), 0, "ZIP central directory is on disk zero");
  const entriesOnDisk = buffer.readUInt16LE(eocdOffset + 8);
  const entryCount = buffer.readUInt16LE(eocdOffset + 10);
  const centralSize = buffer.readUInt32LE(eocdOffset + 12);
  const centralOffset = buffer.readUInt32LE(eocdOffset + 16);
  assert.equal(entriesOnDisk, entryCount, "ZIP is not split across disks");
  assert.equal(entryCount, 576, "ZIP member count");
  assert.notEqual(entryCount, 0xffff, "ZIP entry count is not a ZIP64 sentinel");
  assert.notEqual(centralSize, 0xffffffff, "ZIP central size is not a ZIP64 sentinel");
  assert.notEqual(centralOffset, 0xffffffff, "ZIP central offset is not a ZIP64 sentinel");
  assert.equal(buffer.readUInt16LE(eocdOffset + 20), 0, "ZIP archive comment is empty");
  assert.equal(centralOffset + centralSize, eocdOffset, "ZIP central directory ends at EOCD");

  const names = new Set();
  const rawNames = new Set();
  const foldedNames = new Set();
  const normalizedNames = Object.fromEntries(["NFC", "NFD", "NFKC", "NFKD"].map((form) => [form, new Set()]));
  const localOffsets = new Set();
  const entries = [];
  let cursor = centralOffset;
  for (let index = 0; index < entryCount; index += 1) {
    assert.ok(cursor + 46 <= eocdOffset, `ZIP central header ${index} is in bounds`);
    assert.equal(buffer.readUInt32LE(cursor), 0x02014b50, `ZIP central header ${index} signature`);
    const versionMade = buffer.readUInt16LE(cursor + 4);
    const versionNeeded = buffer.readUInt16LE(cursor + 6);
    const flags = buffer.readUInt16LE(cursor + 8);
    const method = buffer.readUInt16LE(cursor + 10);
    const modifiedTime = buffer.readUInt16LE(cursor + 12);
    const modifiedDate = buffer.readUInt16LE(cursor + 14);
    const expectedCrc = buffer.readUInt32LE(cursor + 16);
    const compressedSize = buffer.readUInt32LE(cursor + 20);
    const uncompressedSize = buffer.readUInt32LE(cursor + 24);
    const nameLength = buffer.readUInt16LE(cursor + 28);
    const extraLength = buffer.readUInt16LE(cursor + 30);
    const commentLength = buffer.readUInt16LE(cursor + 32);
    const startDisk = buffer.readUInt16LE(cursor + 34);
    const internalAttributes = buffer.readUInt16LE(cursor + 36);
    const externalAttributes = buffer.readUInt32LE(cursor + 38);
    const localOffset = buffer.readUInt32LE(cursor + 42);
    const recordEnd = cursor + 46 + nameLength + extraLength + commentLength;
    assert.ok(recordEnd <= eocdOffset, `ZIP central header ${index} variable data is in bounds`);
    const rawName = buffer.subarray(cursor + 46, cursor + 46 + nameLength);
    assert.ok(rawName.length > 0, `ZIP member ${index} has a filename`);
    assert.ok(!rawName.includes(0), `ZIP member ${index} filename has no NUL`);
    assert.ok([...rawName].every((byte) => byte < 0x80), `ZIP member ${index} filename is unambiguous ASCII`);
    const name = rawName.toString("ascii");

    assert.equal(versionMade, 0x0314, `${name} creator system/version`);
    assert.equal(versionNeeded, 20, `${name} required ZIP version`);
    assert.equal(flags, 0, `${name} has no encryption, descriptor, or unsupported flags`);
    assert.equal(method, 0, `${name} uses ZIP stored mode`);
    assert.equal(compressedSize, uncompressedSize, `${name} stored sizes agree`);
    assert.notEqual(compressedSize, 0xffffffff, `${name} compressed size is not ZIP64`);
    assert.notEqual(uncompressedSize, 0xffffffff, `${name} uncompressed size is not ZIP64`);
    assert.equal(extraLength, 0, `${name} has no central extra field`);
    assert.equal(commentLength, 0, `${name} has no member comment`);
    assert.equal(startDisk, 0, `${name} starts on disk zero`);
    assert.notEqual(localOffset, 0xffffffff, `${name} local offset is not ZIP64`);
    assert.equal(externalAttributes >>> 16, 0o100644, `${name} is a non-executable regular file`);
    assert.equal(externalAttributes & 0x10, 0, `${name} has no DOS directory bit`);
    assert.ok(!localOffsets.has(localOffset), `${name} has a unique local offset and is not a hard-link alias`);
    localOffsets.add(localOffset);

    const components = name.split("/");
    assert.ok(!name.startsWith("/") && !/^[A-Za-z]:/.test(name), `${name} is not absolute`);
    assert.ok(!name.includes("\\") && !/[\u0000-\u001f\u007f]/.test(name), `${name} has no backslash or control character`);
    assert.ok(components.every((component) => component !== "" && component !== "." && component !== ".."), `${name} has no empty, dot, or traversal component`);
    assert.equal(components[0], archiveRoot, `${name} has the approved top-level directory`);
    assert.ok(components.length >= 2, `${name} names a file below the release root`);
    assert.ok(!name.endsWith("/"), `${name} is not an explicit directory member`);
    assert.equal(name.normalize("NFC"), name, `${name} is NFC-normalized`);
    assert.ok(!names.has(name), `${name} decoded path is unique`);
    assert.ok(!rawNames.has(rawName.toString("hex")), `${name} raw path is unique`);
    names.add(name);
    rawNames.add(rawName.toString("hex"));
    const folded = name.toLocaleLowerCase("en-US");
    assert.ok(!foldedNames.has(folded), `${name} has no case-fold collision`);
    foldedNames.add(folded);
    for (const [form, set] of Object.entries(normalizedNames)) {
      const normalized = name.normalize(form);
      assert.ok(!set.has(normalized), `${name} has no ${form} collision`);
      set.add(normalized);
    }

    entries.push({
      index,
      name,
      rawName,
      versionNeeded,
      flags,
      method,
      modifiedTime,
      modifiedDate,
      expectedCrc,
      compressedSize,
      uncompressedSize,
      internalAttributes,
      localOffset,
      centralHeaderOffset: cursor,
    });
    cursor = recordEnd;
  }
  assert.equal(cursor, centralOffset + centralSize, "ZIP central directory is consumed exactly");

  for (const entry of entries) {
    const offset = entry.localOffset;
    assert.ok(offset + 30 <= centralOffset, `${entry.name} local header is in bounds`);
    assert.equal(buffer.readUInt32LE(offset), 0x04034b50, `${entry.name} local signature`);
    const localVersion = buffer.readUInt16LE(offset + 4);
    const localFlags = buffer.readUInt16LE(offset + 6);
    const localMethod = buffer.readUInt16LE(offset + 8);
    const localTime = buffer.readUInt16LE(offset + 10);
    const localDate = buffer.readUInt16LE(offset + 12);
    const localCrc = buffer.readUInt32LE(offset + 14);
    const localCompressed = buffer.readUInt32LE(offset + 18);
    const localUncompressed = buffer.readUInt32LE(offset + 22);
    const localNameLength = buffer.readUInt16LE(offset + 26);
    const localExtraLength = buffer.readUInt16LE(offset + 28);
    const dataStart = offset + 30 + localNameLength + localExtraLength;
    const dataEnd = dataStart + localCompressed;
    assert.ok(dataEnd <= centralOffset, `${entry.name} payload is in bounds`);
    const localName = buffer.subarray(offset + 30, offset + 30 + localNameLength);
    assert.equal(localVersion, entry.versionNeeded, `${entry.name} local/central version`);
    assert.equal(localFlags, entry.flags, `${entry.name} local/central flags`);
    assert.equal(localMethod, entry.method, `${entry.name} local/central method`);
    assert.equal(localTime, entry.modifiedTime, `${entry.name} local/central time`);
    assert.equal(localDate, entry.modifiedDate, `${entry.name} local/central date`);
    assert.equal(localCrc, entry.expectedCrc, `${entry.name} local/central CRC`);
    assert.equal(localCompressed, entry.compressedSize, `${entry.name} local/central compressed bytes`);
    assert.equal(localUncompressed, entry.uncompressedSize, `${entry.name} local/central uncompressed bytes`);
    assert.ok(localName.equals(entry.rawName), `${entry.name} local/central filename bytes`);
    assert.equal(localExtraLength, 0, `${entry.name} has no local extra field`);
    entry.dataStart = dataStart;
    entry.dataEnd = dataEnd;
    entry.payload = buffer.subarray(dataStart, dataEnd);
    assert.equal(crc32(entry.payload), entry.expectedCrc, `${entry.name} payload CRC`);
  }

  const ordered = [...entries].sort((left, right) => left.localOffset - right.localOffset);
  let previousEnd = 0;
  for (const entry of ordered) {
    assert.equal(entry.localOffset, previousEnd, `${entry.name} does not overlap and has no unparsed gap before it`);
    assert.ok(entry.dataEnd > entry.localOffset, `${entry.name} local record is non-empty`);
    previousEnd = entry.dataEnd;
  }
  assert.equal(previousEnd, centralOffset, "ZIP has no gap or descriptor before the central directory");

  const compressedTotal = entries.reduce((total, entry) => total + entry.compressedSize, 0);
  const uncompressedTotal = entries.reduce((total, entry) => total + entry.uncompressedSize, 0);
  assert.equal(compressedTotal, 72423425, "ZIP compressed-member bytes");
  assert.equal(uncompressedTotal, 72423425, "ZIP uncompressed-member bytes");
  assert.equal(uncompressedTotal / compressedTotal, 1, "ZIP expansion ratio");
  assert.equal(buffer.length - compressedTotal, 142258, "ZIP archive overhead bytes");
  assert.equal(entries.length, 576, "ZIP regular-file count");

  const byName = new Map(entries.map((entry) => [entry.name, entry]));
  assert.equal(byName.size, 576, "ZIP member map is unique");
  const xlsxPath = `${archiveRoot}/originals/canonical_run/source_data/CGT_FIGURE_003_SourceData.xlsx`;
  const xlsx = byName.get(xlsxPath);
  assert.ok(xlsx, "nested source-data XLSX is present");
  const containingPayload = (offset) => entries.find((entry) => offset >= entry.dataStart && offset + 4 <= entry.dataEnd);

  const rawLocalOffsets = findAll(buffer, localSignature);
  const outerLocalOffsets = new Set(entries.map((entry) => entry.localOffset));
  const nestedLocalOffsets = rawLocalOffsets.filter((offset) => !outerLocalOffsets.has(offset));
  assert.equal(nestedLocalOffsets.length, 20, "raw local signatures beyond the 576 outer records belong to the nested XLSX");
  for (const offset of nestedLocalOffsets) assert.equal(containingPayload(offset)?.name, xlsxPath, `nested local signature ${offset} is inside the XLSX payload`);

  const rawCentralOffsets = findAll(buffer, centralSignature);
  const outerCentralOffsets = new Set(entries.map((entry) => entry.centralHeaderOffset));
  const nestedCentralOffsets = rawCentralOffsets.filter((offset) => !outerCentralOffsets.has(offset));
  assert.equal(nestedCentralOffsets.length, 20, "raw central signatures beyond the 576 outer records belong to the nested XLSX");
  for (const offset of nestedCentralOffsets) assert.equal(containingPayload(offset)?.name, xlsxPath, `nested central signature ${offset} is inside the XLSX payload`);

  const nestedEocdOffsets = rawEocdOffsets.filter((offset) => offset !== eocdOffset);
  assert.equal(nestedEocdOffsets.length, 1, "the only additional EOCD signature is the nested XLSX EOCD");
  const nestedEocdOffset = nestedEocdOffsets[0];
  assert.equal(containingPayload(nestedEocdOffset)?.name, xlsxPath, "additional EOCD signature is inside the XLSX payload");
  assert.ok(nestedEocdOffset + 22 <= xlsx.dataEnd, "nested XLSX EOCD is complete");
  const nestedCommentLength = buffer.readUInt16LE(nestedEocdOffset + 20);
  assert.equal(nestedEocdOffset + 22 + nestedCommentLength, xlsx.dataEnd, "nested XLSX EOCD terminates its member payload");
  assert.equal(buffer.readUInt16LE(nestedEocdOffset + 4), 0, "nested XLSX is on disk zero");
  assert.equal(buffer.readUInt16LE(nestedEocdOffset + 6), 0, "nested XLSX central directory is on disk zero");
  const nestedCentralSize = buffer.readUInt32LE(nestedEocdOffset + 12);
  const nestedCentralOffset = buffer.readUInt32LE(nestedEocdOffset + 16);
  assert.equal(xlsx.dataStart + nestedCentralOffset + nestedCentralSize, nestedEocdOffset, "nested XLSX central directory ends at its EOCD");

  assert.deepEqual(findAll(buffer, zip64EocdSignature), [], "ZIP contains no ZIP64 EOCD record");
  assert.deepEqual(findAll(buffer, zip64LocatorSignature), [], "ZIP contains no ZIP64 locator");
  assert.deepEqual(findAll(buffer, descriptorSignature), [], "ZIP contains no data descriptor record");

  return { entries, byName, rawEocdOffsets, nestedEocdOffset };
}

function parseWebsiteCopy(markdown) {
  const match = markdown.match(
    /^# Figure 3 website copy\n\n## Approved title\n\n([\s\S]*?)\n\n## Full caption\n\n([\s\S]*?)\n\n## Concise alt text\n\n([\s\S]*?)\n\n## Detailed accessible description\n\n([\s\S]*?)\n\n## Responsive presentation requirement\n\n([\s\S]*?)\n$/,
  );
  assert.ok(match, "website_copy.md has the exact approved five-section structure and terminal newline");
  return {
    title: match[1],
    caption: match[2],
    alt: match[3],
    accessibleDescription: match[4],
    responsiveRequirement: match[5],
  };
}

function extractFigureSpecBlocks(content) {
  const blocks = new Map();
  const pattern = /^  \{\n    id: "(fig-[^"]+)",[\s\S]*?^  \}(?=,\n|\n\];)/gm;
  for (const match of content.matchAll(pattern)) {
    assert.ok(!blocks.has(match[1]), `FigureSpec ${match[1]} appears once`);
    blocks.set(match[1], match[0]);
  }
  return blocks;
}

function verifyReleaseAssetBlocks(figureBlock) {
  const marker = "    releaseAssets: [";
  const start = figureBlock.indexOf(marker);
  assert.notEqual(start, -1, "Figure 3 includes releaseAssets");
  const end = figureBlock.indexOf("\n    ],", start);
  assert.notEqual(end, -1, "Figure 3 releaseAssets array is closed");
  const arrayText = figureBlock.slice(start, end);
  const blocks = [...arrayText.matchAll(/^      \{\n[\s\S]*?^      \}(?=,?$)/gm)].map((match) => match[0]);
  assert.equal(blocks.length, 6, "Figure 3 has exactly six releaseAssets entries");

  const expected = {
    [assets.png_web.filename]: {
      label: "Web PNG",
      role: "In-page display and full-resolution web download",
      linkText: "Download Figure 3 web PNG (2,400 × 2,675)",
      bytes: assets.png_web.bytes,
      mimeType: assets.png_web.mime_type,
      sha256: assets.png_web.sha256,
      width: 2400,
      height: 2675,
      nominalDpi: 96.012,
    },
    [assets.png_600dpi.filename]: {
      label: "600-dpi PNG",
      role: "Publication-resolution PNG download",
      linkText: "Download Figure 3 600-dpi PNG (4,323 × 4,819)",
      bytes: assets.png_600dpi.bytes,
      mimeType: assets.png_600dpi.mime_type,
      sha256: assets.png_600dpi.sha256,
      width: 4323,
      height: 4819,
      nominalDpi: 599.9988,
    },
    [assets.pdf.filename]: {
      label: "Publication PDF",
      role: "One-page publication PDF download",
      linkText: "Download Figure 3 publication PDF",
      bytes: assets.pdf.bytes,
      mimeType: assets.pdf.mime_type,
      sha256: assets.pdf.sha256,
      widthPt: 518.740157,
      heightPt: 578.267717,
      widthMm: 183,
      heightMm: 204,
    },
    [assets.svg.filename]: {
      label: "Vector SVG",
      role: "Font-independent vector download and open-original route",
      linkText: "Download Figure 3 vector SVG",
      bytes: assets.svg.bytes,
      mimeType: assets.svg.mime_type,
      sha256: assets.svg.sha256,
      widthPt: 518.740157,
      heightPt: 578.267717,
      widthMm: 183,
      heightMm: 204,
      viewBox: "0 0 518.740157 578.267717",
    },
    [assets.reproducibility_zip.filename]: {
      label: "Complete audited release",
      role: "Complete intact audited Figure 3 release package",
      linkText: "Download Figure 3 complete audited release (ZIP)",
      bytes: assets.reproducibility_zip.bytes,
      mimeType: assets.reproducibility_zip.mime_type,
      sha256: assets.reproducibility_zip.sha256,
    },
    [assets.audit_json.filename]: {
      label: "Machine-readable audit",
      role: "Final automated audit with hash-anchored human-review gate",
      linkText: "Download Figure 3 machine-readable audit (JSON)",
      bytes: assets.audit_json.bytes,
      mimeType: assets.audit_json.mime_type,
      sha256: assets.audit_json.sha256,
    },
  };

  for (const [filename, fields] of Object.entries(expected)) {
    const block = blocks.find((candidate) => candidate.includes(`filename: ${JSON.stringify(filename)}`));
    assert.ok(block, `releaseAssets includes ${filename}`);
    assert.ok(block.includes(`href: \`${"${mainRoot}"}/${filename}\``), `${filename} has its canonical URL`);
    for (const [field, value] of Object.entries(fields)) {
      assert.ok(block.includes(`${field}: ${JSON.stringify(value)}`), `${filename} ${field}`);
    }
  }
}

function assertScientificCopySentinels(caption, accessibleDescription) {
  const combined = `${caption}\n${accessibleDescription}`;
  for (const sentinel of [
    String.raw`Thus \(A_{if}\geq 0\), and family masses sum to one before residualization.`,
    "“Lower” and “upper” denote below- and above-context-mean residual mass, respectively; they do not denote intrinsic negative or positive biology.",
    "Explicit sign filtering removed the invalid F1, F3, and F15 upper views, leaving 53 corrected valid views.",
    "all genes tied at a boundary were retained; corrected realized query sizes therefore range from 20 to 362.",
    "The pooled background contains 1,229 genes; high-confidence absolute views instead use their eligible 255-gene universe for both ORA and rank analysis.",
    "across all 201,771 corrected view–term tests per method.",
    "manual, post hoc axis naming, representative-term choice, and failure-mode review.",
    "cell shade is normalized within each column only and neither makes unlike metrics commensurate nor defines a combined evidence score.",
    "ORA and rank reuse the same coordinates and overlapping gene-set memberships.",
    String.raw`Ridge and Spearman summaries reuse the same endpoint, \(\mathtt{essentiality\_strength}=-\operatorname{mean}(\text{DepMap GeneEffect})\)`,
    String.raw`The 16 residual features are closed and have matrix rank 12; F15 is \(0.19354839\times\mathrm{F3}\), F6 is \(-\mathrm{F5}\), and F4 and F13 are zero.`,
    "All 41 query genes have the CuiHacohen2023 study proxy.",
    "Thirty-five of the 40 genes (87.5%) have a LaraAstiasoHuntly2023 study proxy.",
    "entirely concentrated in ReplogleWeissman2022 K562.",
    "Overall, the figure supports study-conditioned pathway coherence in manually curated, pipeline-dependent summaries. It does not identify validated biological programs, universal axes, mechanisms, or causal constraint laws.",
    "The figure supports descriptive, study-conditioned pathway coherence only; it does not demonstrate a validated pathway, general biological program, mechanism, universal constraint, or causal law.",
  ]) {
    assert.ok(combined.includes(sentinel), `approved scientific copy preserves: ${sentinel}`);
  }
}

function collectNamedArrays(value, keyName, pathName = "$", result = []) {
  if (Array.isArray(value)) {
    value.forEach((child, index) => collectNamedArrays(child, keyName, `${pathName}[${index}]`, result));
  } else if (value && typeof value === "object") {
    for (const [key, child] of Object.entries(value)) {
      const childPath = `${pathName}.${key}`;
      if (key === keyName && Array.isArray(child)) result.push([childPath, child]);
      collectNamedArrays(child, keyName, childPath, result);
    }
  }
  return result;
}

const verified = {};
for (const [key, expected] of Object.entries(assets)) {
  verified[key] = await verifyFile(path.join(mainRoot, expected.filename), expected);
}

parsePng(verified.png_web, {
  label: "web PNG",
  width: 2400,
  height: 2675,
  pixelsPerMeter: 3780,
  dpi: 96.012,
});
parsePng(verified.png_600dpi, {
  label: "publication PNG",
  width: 4323,
  height: 4819,
  pixelsPerMeter: 23622,
  dpi: 599.9988,
});
verifyPdf(verified.pdf);
verifySvg(verified.svg);

const zip = parseStoredZip(verified.reproducibility_zip);
const criticalMembers = {
  [`${archiveRoot}/assets/${assets.png_web.filename}`]: { ...assets.png_web, role: "web_png" },
  [`${archiveRoot}/assets/${assets.png_600dpi.filename}`]: { ...assets.png_600dpi, role: "publication_png" },
  [`${archiveRoot}/assets/${assets.pdf.filename}`]: { ...assets.pdf, role: "publication_pdf" },
  [`${archiveRoot}/assets/${assets.svg.filename}`]: { ...assets.svg, role: "release_svg" },
  [`${archiveRoot}/audit/${assets.audit_json.filename}`]: { ...assets.audit_json, role: "final_audit" },
  [`${archiveRoot}/documentation/website_copy.md`]: { ...websiteCopyFile, role: "caption_accessibility" },
};

const manifestEntry = zip.byName.get(manifestArchivePath);
assert.ok(manifestEntry, "release manifest is present in the ZIP");
assert.equal(manifestEntry.uncompressedSize, manifestFile.bytes, "release manifest byte count");
assert.equal(sha256(manifestEntry.payload), manifestFile.sha256, "release manifest SHA-256");
assert.equal(sniffMime(manifestEntry.payload), manifestFile.mime_type, "release manifest MIME type");
const releaseManifestText = decodeUtf8(manifestEntry.payload, "release manifest");
const releaseManifest = JSON.parse(releaseManifestText);
assert.equal(releaseManifest.schema_version, "1.0.0", "release manifest schema version");
assert.equal(releaseManifest.release_id, archiveRoot, "release manifest release ID");
assert.equal(releaseManifest.title, title, "release manifest approved title");
assert.deepEqual(releaseManifest.manifest_policy, {
  listed_scope: "Every other regular file below the release root; the manifest itself is the sole exclusion.",
  manifest_path: manifestRelativePath,
  self_excluding: true,
});
assert.equal(releaseManifest.entries.length, 575, "release manifest listed entry count");

const listedPaths = releaseManifest.entries.map((entry) => entry.path);
assert.equal(new Set(listedPaths).size, 575, "release manifest paths are unique");
assert.ok(!listedPaths.includes(manifestRelativePath), "release manifest excludes itself");
const expectedListedPaths = zip.entries
  .map((entry) => entry.name.slice(archiveRoot.length + 1))
  .filter((relativePath) => relativePath !== manifestRelativePath);
assert.deepEqual(new Set(listedPaths), new Set(expectedListedPaths), "release manifest lists every other regular file and only those files");
const byteSortedPaths = [...listedPaths].sort((left, right) => Buffer.compare(Buffer.from(left), Buffer.from(right)));
assert.deepEqual(listedPaths, byteSortedPaths, "release manifest entries use ascending UTF-8 path-byte order");

const releaseRecords = new Map();
for (const record of releaseManifest.entries) {
  assert.equal(record.file_kind, "regular", `${record.path} manifest file kind`);
  assert.equal(record.path.normalize("NFC"), record.path, `${record.path} manifest path normalization`);
  assert.match(record.sha256, /^[0-9a-f]{64}$/, `${record.path} manifest SHA-256 syntax`);
  assert.ok(typeof record.mime_type === "string" && record.mime_type.length > 0, `${record.path} manifest MIME type`);
  const archiveEntry = zip.byName.get(`${archiveRoot}/${record.path}`);
  assert.ok(archiveEntry, `${record.path} manifest target exists`);
  assert.equal(record.bytes, archiveEntry.uncompressedSize, `${record.path} manifest byte count`);
  assert.equal(record.sha256, sha256(archiveEntry.payload), `${record.path} manifest SHA-256`);
  releaseRecords.set(`${archiveRoot}/${record.path}`, record);
}

for (const [archivePath, expected] of Object.entries(criticalMembers)) {
  const entry = zip.byName.get(archivePath);
  const record = releaseRecords.get(archivePath);
  assert.ok(entry, `${archivePath} is present in the release`);
  assert.ok(record, `${archivePath} is listed in the release manifest`);
  assert.equal(entry.uncompressedSize, expected.bytes, `${archivePath} byte count`);
  assert.equal(sha256(entry.payload), expected.sha256, `${archivePath} SHA-256`);
  assert.equal(sniffMime(entry.payload), expected.mime_type, `${archivePath} detected MIME type`);
  assert.equal(record.mime_type, expected.mime_type, `${archivePath} manifest MIME type`);
  assert.equal(record.role, expected.role, `${archivePath} manifest role`);
}

assert.deepEqual(releaseRecords.get(`${archiveRoot}/assets/${assets.png_web.filename}`).dimensions, {
  color_mode: "RGB",
  dpi_x: 96.012,
  dpi_y: 96.012,
  height_px: 2675,
  icc_profile_sha256: iccSha256,
  kind: "raster",
  width_px: 2400,
});
assert.deepEqual(releaseRecords.get(`${archiveRoot}/assets/${assets.png_600dpi.filename}`).dimensions, {
  color_mode: "RGB",
  dpi_x: 599.9988,
  dpi_y: 599.9988,
  height_px: 4819,
  icc_profile_sha256: iccSha256,
  kind: "raster",
  width_px: 4323,
});
assert.deepEqual(releaseRecords.get(`${archiveRoot}/assets/${assets.pdf.filename}`).dimensions, {
  height_mm: 204.00000016388884,
  height_pt: 578.267717,
  kind: "pdf",
  page_count: 1,
  width_mm: 182.99999983055554,
  width_pt: 518.740157,
});
assert.deepEqual(releaseRecords.get(`${archiveRoot}/assets/${assets.svg.filename}`).dimensions, {
  height: "204mm",
  kind: "svg",
  text_mode: "paths",
  view_box: [0, 0, 518.740157, 578.267717],
  width: "183mm",
});

assert.ok(verified.png_web.equals(zip.byName.get(`${archiveRoot}/assets/${assets.png_web.filename}`).payload), "installed web PNG is byte-identical to the release member");
assert.ok(verified.png_600dpi.equals(zip.byName.get(`${archiveRoot}/assets/${assets.png_600dpi.filename}`).payload), "installed publication PNG is byte-identical to the release member");
assert.ok(verified.pdf.equals(zip.byName.get(`${archiveRoot}/assets/${assets.pdf.filename}`).payload), "installed PDF is byte-identical to the release member");
assert.ok(verified.svg.equals(zip.byName.get(`${archiveRoot}/assets/${assets.svg.filename}`).payload), "installed SVG is byte-identical to the release member");
assert.ok(verified.audit_json.equals(zip.byName.get(`${archiveRoot}/audit/${assets.audit_json.filename}`).payload), "installed final audit is byte-identical to the release member");

const audit = JSON.parse(decodeUtf8(verified.audit_json, "final audit JSON"));
assert.equal(audit.schema_version, "1.0", "final audit schema version");
assert.equal(audit.status, "pass", "final audit top-level status");
assert.equal(audit.gate_statuses.length, 11, "final audit mandatory gate count");
assert.ok(audit.gate_statuses.every((status) => status === "pass"), "all final-audit gates pass");
for (const [statusPath, status] of (() => {
  const statuses = [];
  const walk = (value, valuePath = "$") => {
    if (Array.isArray(value)) value.forEach((child, index) => walk(child, `${valuePath}[${index}]`));
    else if (value && typeof value === "object") {
      for (const [key, child] of Object.entries(value)) {
        const childPath = `${valuePath}.${key}`;
        if (key === "status") statuses.push([childPath, child]);
        walk(child, childPath);
      }
    }
  };
  walk(audit);
  return statuses;
})()) assert.equal(status, "pass", `${statusPath} is pass`);
for (const [failurePath, failures] of collectNamedArrays(audit, "failures")) {
  assert.deepEqual(failures, [], `${failurePath} is empty`);
}
assert.deepEqual(audit.formats.web_png.size_px, [2400, 2675]);
assert.deepEqual(audit.formats.web_png.dpi, [96.012, 96.012]);
assert.equal(audit.formats.web_png.icc_profile_sha256, iccSha256);
assert.deepEqual(audit.formats.publication_png.size_px, [4323, 4819]);
assert.deepEqual(audit.formats.publication_png.dpi, [599.9988, 599.9988]);
assert.equal(audit.formats.publication_png.icc_profile_sha256, iccSha256);
assert.deepEqual(audit.formats.pdf.page_size_pt, [518.740157, 578.267717]);
assert.equal(audit.formats.pdf.page_count, 1);
assert.deepEqual(audit.formats.pdf.font_rows, [{
  embedded: "yes",
  encoding: "WinAnsi",
  name: "AAAAAA+DejaVuSans",
  subset: "yes",
  type: "TrueType",
  unicode: "yes",
}]);
assert.equal(audit.formats.pdf.metadata["/Title"], title);
assert.equal(audit.formats.release_svg.text_node_count, 0);
assert.deepEqual(audit.formats.release_svg.external_references, []);
assert.deepEqual(audit.formats.release_svg.forbidden_elements, []);
assert.equal(audit.human_visual_audit.status, "pass");
assert.equal(audit.human_visual_audit.reviewed_hash_count, 11);
assert.equal(Object.keys(audit.human_visual_audit.expected_reviewed_hashes).length, 11);
assert.equal(audit.human_visual_audit.expected_reviewed_hashes.web_png, assets.png_web.sha256);
assert.equal(audit.human_visual_audit.expected_reviewed_hashes.publication_png, assets.png_600dpi.sha256);
assert.equal(audit.human_visual_audit.expected_reviewed_hashes.pdf, assets.pdf.sha256);
assert.equal(audit.human_visual_audit.expected_reviewed_hashes.release_svg, assets.svg.sha256);
assert.equal(audit.determinism.status, "pass");
assert.equal(audit.determinism.first_file_count, 392);
assert.equal(audit.determinism.second_file_count, 392);
assert.equal(audit.determinism.byte_identical_file_count, 392);
assert.equal(audit.determinism.comparisons.length, 392);
assert.equal(new Set(audit.determinism.comparisons.map((item) => item.path)).size, 392, "determinism comparison paths are unique");
assert.ok(audit.determinism.comparisons.every((item) => item.equal === true && /^[0-9a-f]{64}$/.test(item.sha256)), "all deterministic comparisons are byte-identical and hash-pinned");
for (const [filename, expectedHash] of [
  [assets.png_web.filename, assets.png_web.sha256],
  [assets.png_600dpi.filename, assets.png_600dpi.sha256],
  [assets.pdf.filename, assets.pdf.sha256],
  [assets.svg.filename, assets.svg.sha256],
]) {
  assert.equal(audit.determinism.comparisons.find((item) => item.path === filename)?.sha256, expectedHash, `${filename} deterministic comparison hash`);
}

const websiteCopyEntry = zip.byName.get(`${archiveRoot}/documentation/website_copy.md`);
const websiteCopy = parseWebsiteCopy(decodeUtf8(websiteCopyEntry.payload, "website_copy.md"));
const copy = JSON.parse(await readFile(copyPath, "utf8"));
const caption = copy.caption_markdown_lines.join("\n");
const accessibleDescription = copy.accessible_description_markdown_lines.join("\n");
assert.equal(copy.source_document, "documentation/website_copy.md");
assert.equal(copy.source_document_bytes, websiteCopyFile.bytes);
assert.equal(copy.source_document_sha256, websiteCopyFile.sha256);
assert.equal(copy.title, title);
assert.equal(copy.title, websiteCopy.title, "installed title is verbatim from website_copy.md");
assert.equal(copy.alt, websiteCopy.alt, "installed alt text is verbatim from website_copy.md");
assert.equal(accessibleDescription, websiteCopy.accessibleDescription, "installed accessible description is verbatim from website_copy.md");
assert.equal(copy.responsive_presentation_requirement, websiteCopy.responsiveRequirement, "installed responsive qualification is verbatim from website_copy.md");
assert.equal(sha256(Buffer.from(caption)), "60b3911317ac2ea89c35b7fa07de3a27c0decb51c89cb7acb5289fec124471c6");
assert.equal(copy.caption_sha256, "60b3911317ac2ea89c35b7fa07de3a27c0decb51c89cb7acb5289fec124471c6");
assert.equal(sha256(Buffer.from(copy.alt)), "b89a100c1f6e81e9d8d3ee8c71e6aa773df0dd614f66caf8667e006819032e82");
assert.equal(copy.alt_sha256, "b89a100c1f6e81e9d8d3ee8c71e6aa773df0dd614f66caf8667e006819032e82");
assert.equal(sha256(Buffer.from(accessibleDescription)), "81e421494f6b8e9ef21126c2c6efa98f14de4d46ceed61ce82c745f76aff3500");
assert.equal(copy.accessible_description_sha256, "81e421494f6b8e9ef21126c2c6efa98f14de4d46ceed61ce82c745f76aff3500");
assert.equal(sha256(Buffer.from(copy.responsive_presentation_requirement)), "5ffa5dc8025d279becd74f8ec228772a2d2446d8f4080c42e01ad02b1bf6ee73");
assert.equal(copy.responsive_presentation_requirement_sha256, "5ffa5dc8025d279becd74f8ec228772a2d2446d8f4080c42e01ad02b1bf6ee73");
assertScientificCopySentinels(caption, accessibleDescription);

const siteManifestText = await readFile(manifestPath, "utf8");
const siteManifest = JSON.parse(siteManifestText);
const figureThree = siteManifest.figures.find((figure) => figure.id === "figure-03");
assert.ok(figureThree, "Figure 3 site-manifest entry exists");
assert.equal(figureThree.title, title);
assert.deepEqual(siteManifest.schema.figure_03_release_asset_formats, Object.keys(assets));
assert.equal(siteManifest.report.active_physical_asset_count, 49);
assert.equal(siteManifest.report.compatibility_alias_count, 9);
assert.equal(siteManifest.report.physical_asset_count, 58);
assert.equal(siteManifest.audit.integrity.expected_physical_assets, 58);
assert.equal(siteManifest.audit.integrity.present_physical_assets, 58);
assert.equal(siteManifest.audit.integrity.sha256_matches, 58);
assert.equal(siteManifest.audit.integrity.byte_size_matches, 58);
assert.equal(siteManifest.audit.integrity.result, "pass");
assert.equal(
  stableSha256(siteManifest.figures.filter((figure) => figure.id !== "figure-03")),
  "6fc3547263a3f4d4afea434ad02342df268a5cc346675a14f85bc15c31d88db3",
  "all non-Figure-3 manifest entries are byte-semantically unchanged",
);

for (const [key, expected] of Object.entries(assets)) {
  const manifestAsset = figureThree.assets[key];
  assert.ok(manifestAsset, `Figure 3 site manifest includes ${key}`);
  assert.equal(manifestAsset.filename, expected.filename);
  assert.equal(manifestAsset.local_path, `/research/cgt/figures/main/${expected.filename}`);
  assert.equal(manifestAsset.repository_path, `public/research/cgt/figures/main/${expected.filename}`);
  assert.equal(manifestAsset.mime_type, expected.mime_type);
  assert.equal(manifestAsset.bytes, expected.bytes);
  assert.equal(manifestAsset.sha256, expected.sha256);
}
assert.deepEqual(figureThree.dimensions, {
  png_web: {
    width_px: 2400,
    height_px: 2675,
    color_mode: "RGB",
    embedded_dpi: [96.012, 96.012],
    icc_profile_bytes: 6922,
    icc_profile_sha256: iccSha256,
  },
  png_600dpi: {
    width_px: 4323,
    height_px: 4819,
    color_mode: "RGB",
    nominal_dpi: 600,
    embedded_dpi: [599.9988, 599.9988],
    icc_profile_bytes: 6922,
    icc_profile_sha256: iccSha256,
  },
  pdf: {
    width_pt: 518.740157,
    height_pt: 578.267717,
    width_mm: 183,
    height_mm: 204,
    pages: 1,
    font_subtype: "TrueType",
    embedded_font: true,
    type_3_font_count: 0,
  },
  svg: {
    width: "183mm",
    height: "204mm",
    view_box: [0, 0, 518.740157, 578.267717],
    text_mode: "paths",
    external_dependency_count: 0,
    raster_image_count: 0,
  },
  physical: { width_mm: 183, height_mm: 204, basis: "approved PDF and SVG canvas" },
});
assert.equal(figureThree.qa.status, "pass");
assert.ok(Object.values(figureThree.qa.mandatory_rules).every(Boolean), "all site-manifest Figure 3 mandatory QA rules pass");
assert.equal(figureThree.qa.local_release_asset_count, 6);
assert.equal(figureThree.qa.local_byte_size_matches, 6);
assert.equal(figureThree.qa.local_sha256_matches, 6);
assert.equal(figureThree.qa.legacy_aliases_contain_approved_bytes, true);
assert.equal(figureThree.qa.responsive_note, copy.responsive_presentation_requirement);
assert.match(figureThree.qa.open_original_route, /keyboard- and touch-activated link/);
assert.equal(figureThree.provenance.release_package.sha256, assets.reproducibility_zip.sha256);
assert.equal(figureThree.provenance.release_manifest.sha256, manifestFile.sha256);
assert.equal(figureThree.provenance.approved_copy.sha256, websiteCopyFile.sha256);
assert.equal(figureThree.provenance.final_audit.sha256, assets.audit_json.sha256);
assert.equal(figureThree.provenance.final_audit.hash_anchored_human_review, "pass");
assert.equal(figureThree.provenance.renderer_determinism.byte_identical_file_count, 392);
assert.equal(figureThree.caveats.length, 12, "Figure 3 site manifest includes all scientific caveats");
assert.equal(stableSha256(figureThree.caveats), "78b9ca2791a9e8da734e3b83049a2b010f9a08b569b3f5051f8b9c25a571c7f5", "Figure 3 caveats are exact");
assert.equal(stableSha256(figureThree.evidence_dependence), "91bc38a9897a9a17803f9e37fa2f94037bcb6afe580ab109a4908199e9441a45", "Figure 3 evidence-dependence qualifications are exact");

for (const [key, [filename, sourceKey]] of Object.entries(aliases)) {
  const source = assets[sourceKey];
  assert.deepEqual(figureThree.compatibility_aliases[key], {
    local_path: `/research/cgt/figures/main/${filename}`,
    repository_path: `public/research/cgt/figures/main/${filename}`,
    mime_type: source.mime_type,
    bytes: source.bytes,
    sha256: source.sha256,
    mirrors_asset: sourceKey,
    active_page_reference: false,
  });
  const aliasBuffer = await readFile(path.join(mainRoot, filename));
  assert.equal(aliasBuffer.length, source.bytes, `${filename} alias byte count`);
  assert.equal(sniffMime(aliasBuffer), source.mime_type, `${filename} alias MIME type`);
  assert.equal(sha256(aliasBuffer), source.sha256, `${filename} alias SHA-256`);
  assert.ok(aliasBuffer.equals(verified[sourceKey]), `${filename} is byte-identical to ${sourceKey}`);
}

const content = await readFile(contentPath, "utf8");
const figureBlocks = extractFigureSpecBlocks(content);
assert.equal(figureBlocks.size, 11, "content.ts contains exactly eleven FigureSpec objects");
assert.deepEqual([...figureBlocks.keys()], ["fig-1", "fig-2", "fig-3", "fig-4", "fig-5", "fig-s1", "fig-s2", "fig-s3", "fig-s4", "fig-s5", "fig-s6"]);
for (const [id, expectedHash] of Object.entries(nonFigureThreeObjectHashes)) {
  assert.equal(sha256(Buffer.from(figureBlocks.get(id))), expectedHash, `${id} FigureSpec text is unchanged`);
}
const figureThreeBlock = figureBlocks.get("fig-3");
assert.ok(figureThreeBlock, "Figure 3 content object exists");
for (const required of [
  "title: figureThreeCopy.title",
  `image: \`${"${mainRoot}"}/${assets.png_web.filename}\``,
  `pdf: \`${"${mainRoot}"}/${assets.pdf.filename}\``,
  `svg: \`${"${mainRoot}"}/${assets.svg.filename}\``,
  "width: 2400",
  "height: 2675",
  "alt: figureThreeCopy.alt",
  "accessibleDescription: figureThreeAccessibleDescription",
  "accessibleDescriptionFormat: \"markdown\"",
  "caption: figureThreeCaption",
  "responsiveNote: figureThreeCopy.responsive_presentation_requirement",
  `imageSha256: "${assets.png_web.sha256}"`,
]) assert.ok(figureThreeBlock.includes(required), `Figure 3 content includes ${required}`);
assert.ok(content.includes('import figureThreeCopy from "./figure-03-copy.json";'), "content.ts imports the approved Figure 3 copy");
assert.ok(content.includes("const figureThreeCaption = figureThreeCopy.caption_markdown_lines.join(\"\\n\");"), "content.ts installs the full approved caption");
assert.ok(content.includes("const figureThreeAccessibleDescription = figureThreeCopy.accessible_description_markdown_lines.join(\"\\n\");"), "content.ts installs the full accessible description");
assert.ok(!figureThreeBlock.includes("figure-03-signed-axes."), "legacy aliases are not active Figure 3 page references");
assert.ok(!figureThreeBlock.includes("Signed dimensions map to candidate biological axes"), "stale short Figure 3 title is absent");
assert.ok(!figureThreeBlock.includes("Signed dimensions of residual perturbation geometry map to candidate biological axes"), "stale manifest Figure 3 title is absent");
verifyReleaseAssetBlocks(figureThreeBlock);

console.log(JSON.stringify({
  status: "pass",
  canonical_assets: Object.keys(assets).length,
  compatibility_aliases: Object.keys(aliases).length,
  archive: {
    bytes: verified.reproducibility_zip.length,
    sha256: sha256(verified.reproducibility_zip),
    members: zip.entries.length,
    manifest_entries: releaseManifest.entries.length,
    stored_member_bytes: zip.entries.reduce((total, entry) => total + entry.compressedSize, 0),
    nested_xlsx_eocd_classified: true,
  },
  png_dimensions_dpi_rgb_and_icc: "pass",
  pdf_page_geometry_fonts_and_security: "pass",
  svg_geometry_path_text_references_and_security: "pass",
  final_audit_gates_human_review_and_determinism: "pass",
  copy_verbatim_and_scientific_sentinels: "pass",
  site_manifest_release_assets_and_aliases: "pass",
  non_figure_3_manifest_and_content_non_regression: "pass",
}, null, 2));
