import assert from "node:assert/strict";
import { createHash } from "node:crypto";

const baseUrlArgument = process.argv[2];

if (!baseUrlArgument) {
  throw new Error(
    "Usage: node scripts/verify-cgt-figure-003-http.mjs <base-url>",
  );
}

const baseUrl = new URL(baseUrlArgument);
assert.ok(
  baseUrl.protocol === "http:" || baseUrl.protocol === "https:",
  "base URL must use http: or https:",
);

const assetRoot = "/research/cgt/figures/main";
const canonicalAssets = [
  {
    key: "png_web",
    filename: "CGT_FIGURE_003_signed_axes_revised_web.png",
    mediaType: "image/png",
    bytes: 1_770_635,
    sha256: "f7bee8ebf1bcb491c239fd3cf63908521327c6055af24d50e383acdd139d8ad3",
  },
  {
    key: "png_600dpi",
    filename: "CGT_FIGURE_003_signed_axes_revised_600dpi.png",
    mediaType: "image/png",
    bytes: 1_871_881,
    sha256: "30095053cb861bd7be782001fdd7e0fb5f3a988dd3a1d9c204e689b5e0e96398",
  },
  {
    key: "pdf",
    filename: "CGT_FIGURE_003_signed_axes_revised.pdf",
    mediaType: "application/pdf",
    bytes: 1_600_555,
    sha256: "3dab4de28f38762de434eecb6b2a9bf9cde3cd469548231e189abb2627973383",
  },
  {
    key: "svg",
    filename: "CGT_FIGURE_003_signed_axes_revised.svg",
    mediaType: "image/svg+xml",
    bytes: 357_204,
    sha256: "40634f9fe70e9c002a13a1cc6318d84c96ad602a27f2faa027531b5cea3787a3",
  },
  {
    key: "audit_json",
    filename: "CGT_FIGURE_003_signed_axes_revised_audit.json",
    mediaType: "application/json",
    bytes: 104_289,
    sha256: "c8ff32a557e9a817d3e71019fd29e5b5001c869c2924ec7f95bfe03f496e6359",
  },
  {
    key: "release_zip",
    filename: "CGT_FIGURE_003_signed_axes_revised_v1.zip",
    mediaType: "application/zip",
    bytes: 72_565_683,
    sha256: "c54503486663c217ddd6348ccef22642255c04112ff936ab615c9e104449987d",
  },
];

const canonicalByKey = new Map(
  canonicalAssets.map((asset) => [asset.key, asset]),
);

const compatibilityAliases = [
  {
    filename: "figure-03-signed-axes.png",
    mirrors: "png_600dpi",
  },
  {
    filename: "figure-03-signed-axes.pdf",
    mirrors: "pdf",
  },
  {
    filename: "figure-03-signed-axes.svg",
    mirrors: "svg",
  },
].map((alias) => {
  const canonical = canonicalByKey.get(alias.mirrors);
  assert.ok(canonical, `${alias.filename} has a known canonical source`);
  return {
    ...alias,
    mediaType: canonical.mediaType,
    bytes: canonical.bytes,
    sha256: canonical.sha256,
  };
});

function sha256(buffer) {
  return createHash("sha256").update(buffer).digest("hex");
}

async function fetchAndVerify(asset) {
  const pathname = `${assetRoot}/${asset.filename}`;
  const url = new URL(pathname, baseUrl);
  const response = await fetch(url, {
    headers: { "accept-encoding": "identity" },
    redirect: "manual",
  });

  assert.equal(response.status, 200, `${pathname} HTTP status`);

  const contentType = response.headers.get("content-type");
  assert.ok(contentType, `${pathname} has a Content-Type header`);
  const mediaType = contentType.split(";", 1)[0].trim().toLowerCase();
  assert.equal(mediaType, asset.mediaType, `${pathname} media type`);

  let contentLength = response.headers.get("content-length");
  let contentLengthSource = "GET";
  if (contentLength === null) {
    const headResponse = await fetch(url, { method: "HEAD", redirect: "manual" });
    assert.equal(headResponse.status, 200, `${pathname} HEAD status`);
    const headMediaType = (headResponse.headers.get("content-type") ?? "")
      .split(";", 1)[0]
      .trim()
      .toLowerCase();
    assert.equal(headMediaType, asset.mediaType, `${pathname} HEAD media type`);
    contentLength = headResponse.headers.get("content-length");
    contentLengthSource = "HEAD";
  }
  assert.ok(contentLength, `${pathname} has a Content-Length on GET or HEAD`);
  assert.match(contentLength, /^\d+$/, `${pathname} Content-Length syntax`);
  assert.equal(
    Number(contentLength),
    asset.bytes,
    `${pathname} Content-Length`,
  );

  const body = Buffer.from(await response.arrayBuffer());
  assert.equal(body.length, asset.bytes, `${pathname} response byte count`);
  const digest = sha256(body);
  assert.equal(digest, asset.sha256, `${pathname} response SHA-256`);

  return {
    pathname,
    status: response.status,
    media_type: mediaType,
    content_length: Number(contentLength),
    content_length_source: contentLengthSource,
    body_bytes: body.length,
    sha256: digest,
    body,
  };
}

const results = [];
const aliasSourceBodies = new Map();
const aliasSourceKeys = new Set(
  compatibilityAliases.map((alias) => alias.mirrors),
);

for (const asset of canonicalAssets) {
  const result = await fetchAndVerify(asset);
  results.push(result);
  if (aliasSourceKeys.has(asset.key)) {
    aliasSourceBodies.set(asset.key, result.body);
  }
}

for (const alias of compatibilityAliases) {
  const result = await fetchAndVerify(alias);
  const sourceBody = aliasSourceBodies.get(alias.mirrors);
  assert.ok(sourceBody, `${alias.filename} canonical source was fetched`);
  assert.ok(
    result.body.equals(sourceBody),
    `${result.pathname} is byte-identical to ${alias.mirrors}`,
  );
  results.push({ ...result, mirrors: alias.mirrors });
}

console.log(
  JSON.stringify(
    {
      status: "pass",
      base_url: baseUrl.origin,
      canonical_routes: canonicalAssets.length,
      compatibility_alias_routes: compatibilityAliases.length,
      routes: results.map((result) => ({
        pathname: result.pathname,
        status: result.status,
        media_type: result.media_type,
        content_length: result.content_length,
        content_length_source: result.content_length_source,
        body_bytes: result.body_bytes,
        sha256: result.sha256,
        ...(result.mirrors ? { mirrors: result.mirrors } : {}),
      })),
    },
    null,
    2,
  ),
);
