import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import {
  mkdir,
  open,
  readFile,
  readdir,
  stat,
  writeFile,
} from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const projectRoot = path.resolve(fileURLToPath(new URL("..", import.meta.url)));
const clientRoot = path.join(projectRoot, "dist", "client");
const releaseRelativePath = path.join(
  "research",
  "cgt",
  "figures",
  "main",
  "CGT_FIGURE_003_signed_axes_revised_v1.zip",
);
const releasePath = path.join(clientRoot, releaseRelativePath);
const releaseBytes = 72_565_683;
const releaseSha256 = "c54503486663c217ddd6348ccef22642255c04112ff936ab615c9e104449987d";
const maximumCloudflareAssetBytes = 25 * 1024 * 1024;
const transportChunkBytes = 24 * 1024 * 1024;
const transportRelativeDirectory = path.join(
  "_cgt",
  "f3",
  releaseSha256.slice(0, 16),
);
const transportDirectory = path.join(clientRoot, transportRelativeDirectory);
const partSizes = [
  transportChunkBytes,
  transportChunkBytes,
  releaseBytes - (2 * transportChunkBytes),
];
const partFilenames = partSizes.map((_, index) => `p${index + 1}`);

assert.equal(partSizes.reduce((total, bytes) => total + bytes, 0), releaseBytes);
assert.ok(
  partSizes.every((bytes) => bytes > 0 && bytes < maximumCloudflareAssetBytes),
  "every transport part must remain below Cloudflare's 25 MiB static-asset limit",
);

const sourceStatBefore = await stat(releasePath);
assert.equal(sourceStatBefore.size, releaseBytes, "built Figure 3 ZIP byte count");

await mkdir(transportDirectory, { recursive: true });

const sourceHandle = await open(releasePath, "r");
const sourceHash = createHash("sha256");
let sourceOffset = 0;

try {
  for (let index = 0; index < partSizes.length; index += 1) {
    const expectedPartBytes = partSizes[index];
    const partBuffer = Buffer.allocUnsafe(expectedPartBytes);
    let partOffset = 0;

    while (partOffset < expectedPartBytes) {
      const { bytesRead } = await sourceHandle.read(
        partBuffer,
        partOffset,
        expectedPartBytes - partOffset,
        sourceOffset,
      );
      assert.ok(bytesRead > 0, "Figure 3 ZIP ended before all transport parts were written");
      partOffset += bytesRead;
      sourceOffset += bytesRead;
    }

    sourceHash.update(partBuffer);
    await writeFile(path.join(transportDirectory, partFilenames[index]), partBuffer);
  }
} finally {
  await sourceHandle.close();
}

assert.equal(sourceOffset, releaseBytes, "transport parts consume the complete Figure 3 ZIP");
assert.equal(sourceHash.digest("hex"), releaseSha256, "built Figure 3 ZIP SHA-256");

const reconstructedHash = createHash("sha256");
let reconstructedBytes = 0;
const parts = [];

for (let index = 0; index < partFilenames.length; index += 1) {
  const filename = partFilenames[index];
  const partPath = path.join(transportDirectory, filename);
  const partStat = await stat(partPath);
  const partBuffer = await readFile(partPath);

  assert.equal(partStat.size, partSizes[index], `${filename} byte count`);
  reconstructedBytes += partBuffer.length;
  reconstructedHash.update(partBuffer);
  parts.push({
    pathname: `/${path.posix.join(transportRelativeDirectory, filename)}`,
    bytes: partBuffer.length,
    sha256: createHash("sha256").update(partBuffer).digest("hex"),
  });
}

assert.deepEqual(
  (await readdir(transportDirectory)).sort(),
  [...partFilenames].sort(),
  "the Figure 3 transport directory contains only the three expected parts",
);

assert.equal(reconstructedBytes, releaseBytes, "reconstructed Figure 3 ZIP byte count");
assert.equal(
  reconstructedHash.digest("hex"),
  releaseSha256,
  "reconstructed Figure 3 ZIP SHA-256",
);

const sourceStatAfter = await stat(releasePath);
assert.equal(sourceStatAfter.size, sourceStatBefore.size, "canonical built ZIP remains unchanged");
assert.equal(sourceStatAfter.mtimeMs, sourceStatBefore.mtimeMs, "canonical built ZIP is not rewritten");

const assetsIgnorePath = path.join(clientRoot, ".assetsignore");
let existingAssetsIgnore = "";
try {
  existingAssetsIgnore = await readFile(assetsIgnorePath, "utf8");
} catch (error) {
  if (error?.code !== "ENOENT") throw error;
}

const ignoredReleasePath = releaseRelativePath.split(path.sep).join("/");
const ignoreLines = existingAssetsIgnore.split(/\r?\n/).filter(Boolean);
if (!ignoreLines.includes(ignoredReleasePath)) ignoreLines.push(ignoredReleasePath);
await writeFile(assetsIgnorePath, `${ignoreLines.join("\n")}\n`, "utf8");

console.log(JSON.stringify({
  status: "pass",
  canonical_zip: {
    path: releaseRelativePath.split(path.sep).join("/"),
    bytes: releaseBytes,
    sha256: releaseSha256,
    modified: false,
    excluded_from_static_asset_upload: true,
  },
  transport: {
    maximum_cloudflare_asset_bytes: maximumCloudflareAssetBytes,
    part_count: parts.length,
    reconstructed_bytes: reconstructedBytes,
    reconstructed_sha256: releaseSha256,
    parts,
  },
}, null, 2));
