import assert from "node:assert/strict";
import { access, readFile, readdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import test from "node:test";

const projectRoot = fileURLToPath(new URL("../", import.meta.url));
const productionOrigin = "https://johnpatrickcollins.info";

async function loadWorker() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker;
}

const env = {
  ASSETS: {
    fetch: async (request) => {
      const pathname = new URL(request.url).pathname;
      try {
        const body = await readFile(
          path.join(projectRoot, "public", decodeURIComponent(pathname.slice(1))),
        );
        const contentType = pathname.endsWith(".png")
          ? "image/png"
          : "application/octet-stream";
        return new Response(body, { headers: { "content-type": contentType } });
      } catch {
        return new Response("Not found", { status: 404 });
      }
    },
  },
};

const ctx = {
  waitUntil() {},
  passThroughOnException() {},
};

function elements(html, selector, attribute, value) {
  const tags = html.match(new RegExp(`<${selector}\\b[^>]*>`, "gi")) ?? [];
  return tags.filter((tag) =>
    new RegExp(`\\b${attribute}=["']${value}["']`, "i").test(tag),
  );
}

function attribute(tag, name) {
  return tag.match(new RegExp(`\\b${name}=["']([^"']*)["']`, "i"))?.[1] ?? "";
}

function oneMeta(html, key, value) {
  const matches = elements(html, "meta", key, value);
  assert.equal(matches.length, 1, `expected one ${key}=${value}`);
  const content = attribute(matches[0], "content");
  assert.ok(content, `${key}=${value} must not be empty`);
  return content;
}

async function discoverPageRoutes(directory = path.join(projectRoot, "app"), prefix = "") {
  const routes = [];
  const entries = await readdir(directory, { withFileTypes: true });
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const segment = entry.name.startsWith("(") ? "" : `/${entry.name}`;
    routes.push(...await discoverPageRoutes(path.join(directory, entry.name), `${prefix}${segment}`));
  }
  if (entries.some((entry) => entry.isFile() && entry.name === "page.tsx")) {
    routes.push(prefix || "/");
  }
  return routes.sort();
}

function pngDimensions(buffer) {
  assert.equal(buffer.toString("ascii", 1, 4), "PNG", "expected a PNG signature");
  return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
}

test("publishes the complete branded favicon family", async () => {
  const worker = await loadWorker();
  const response = await worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    env,
    ctx,
  );

  const html = await response.text();
  for (const href of [
    "/favicon.svg",
    "/favicon-32x32.png",
    "/favicon-16x16.png",
    "/favicon.ico",
    "/apple-touch-icon.png",
    "/safari-pinned-tab.svg",
    "/site.webmanifest",
  ]) {
    assert.match(html, new RegExp(href.replaceAll(".", "\\.")));
    await access(path.join(projectRoot, "public", href.slice(1)));
  }

  await access(path.join(projectRoot, "public", "favicon-192x192.png"));
  await access(path.join(projectRoot, "public", "favicon-512x512.png"));
  assert.match(html, /rel=["']mask-icon["'][^>]*color=["']#0a1717["']/i);
  assert.match(html, /name=["']theme-color["'][^>]*content=["']#0a1717["']/i);
  assert.match(html, /favicon\.svg\?v=2/i);
});

test("presents the authored DNA replication film without eager-loading it", async () => {
  const worker = await loadWorker();
  const response = await worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    env,
    ctx,
  );

  const html = await response.text();
  assert.match(html, /DNA replication, refracted\./i);
  assert.match(html, /<video(?=[^>]*\bcontrols)(?=[^>]*\bplaysInline)(?=[^>]*\bpreload=["']metadata["'])[^>]*>/i);
  assert.match(html, /\/media\/dna-replication-kaleidoscope\.mp4/i);
  assert.match(html, /\/media\/dna-replication-kaleidoscope-poster\.webp/i);
  await access(path.join(projectRoot, "public", "media", "dna-replication-kaleidoscope.mp4"));
  await access(path.join(projectRoot, "public", "media", "dna-replication-kaleidoscope-poster.webp"));
});

test("only animates the domain strip when its content overflows", async () => {
  const worker = await loadWorker();
  const response = await worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html" } }),
    env,
    ctx,
  );
  const html = await response.text();
  assert.match(html, /class=["'][^"']*domain-strip[^"']*marquee-container[^"']*["']/i);
  assert.match(html, /class=["']marquee-content["']/i);

  const component = await readFile(
    path.join(projectRoot, "app", "components", "domain-strip.tsx"),
    "utf8",
  );
  assert.match(component, /content\.scrollWidth > container\.clientWidth/);
  assert.match(component, /new ResizeObserver\(checkFit\)/);
  assert.match(component, /resizeObserver\.disconnect\(\)/);

  const css = await readFile(path.join(projectRoot, "app", "globals.css"), "utf8");
  assert.match(css, /domain-strip\[data-overflowing="true"\][^{]*\.marquee-content\s*{[^}]*animation:\s*marquee-scroll-single 15s linear infinite/s);
  assert.match(css, /@keyframes marquee-scroll-single/);
  assert.match(css, /prefers-reduced-motion:[^)]+\)[\s\S]*domain-strip\[data-overflowing="true"\][^{]*\.marquee-content\s*{[^}]*animation:\s*none/s);
});

test("renders the source-faithful DNA identity with phase-projected helix motion", async () => {
  const worker = await loadWorker();
  const response = await worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    env,
    ctx,
  );

  const html = await response.text();
  assert.match(html, /data-brand-mark=["']dna-helix["']/i);
  assert.match(html, /data-brand-intro=["']true["']/i);
  assert.match(html, /viewBox=["']280 120 694 965["']/i);
  assert.match(html, /M 678\.671875 188\.234375/);
  assert.doesNotMatch(html, /M13 20 20 11/);

  const component = await readFile(
    path.join(projectRoot, "app", "components", "brand-mark.tsx"),
    "utf8",
  );
  assert.match(component, /const INITIAL_DELAY_MS = 1800/);
  assert.match(component, /const AUTOMATIC_REPLAY_DELAY_MS = 30_000/);
  assert.match(component, /const HOVER_INTENT_DELAY_MS = 260/);
  assert.match(component, /const HELIX_SLICE_COUNT = 32/);
  assert.match(component, /phase-projected-double-helix/);
  assert.match(component, /Math\.sin\(spatialPhase \+ angle\)/);
  assert.match(component, /data-dna-strand="primary"/);
  assert.match(component, /requestAnimationFrame/);
  assert.doesNotMatch(component, /rotateY\(/);
  assert.match(component, /IntersectionObserver/);
  assert.match(component, /prefers-reduced-motion: reduce/);
  assert.doesNotMatch(component, /sessionStorage|INTRO_STORAGE_KEY/);
  assert.doesNotMatch(component, /setInterval/);
  assert.match(component, /if \(kind === "intro"\) introHasCompleted = true/);
  assert.match(component, /if \(kind === "intro" \|\| kind === "automatic"\) \{\s*scheduleAutomatic\(\)/s);
  assert.match(component, /document\.visibilityState !== "visible"/);
  assert.match(component, /!logoIsVisible/);
  assert.match(component, /automaticRemaining = Math\.max/);
  assert.match(component, /window\.clearTimeout\(automaticTimer\)/);
  assert.match(component, /observer\?\.disconnect\(\)/);

  const css = await readFile(path.join(projectRoot, "app", "globals.css"), "utf8");
  assert.match(css, /\.brand-mark-motion\s*{[^}]*opacity:\s*0/s);
  assert.match(
    css,
    /\.brand-mark-shell\[data-animating="true"\]\s+\.brand-mark-motion\s*{[^}]*opacity:\s*1/s,
  );
});

test("publishes complete crawler metadata for every routed and sitemap URL", async () => {
  const worker = await loadWorker();
  const routes = await discoverPageRoutes();
  const sitemapResponse = await worker.fetch(
    new Request(`${productionOrigin}/sitemap.xml`),
    env,
    ctx,
  );
  assert.equal(sitemapResponse.status, 200);
  assert.match(sitemapResponse.headers.get("content-type") ?? "", /xml/i);
  const sitemapXml = await sitemapResponse.text();
  const sitemapRoutes = [...sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)]
    .map((match) => new URL(match[1]).pathname)
    .sort();
  assert.deepEqual(sitemapRoutes, routes, "the sitemap and App Router pages must match");

  for (const route of routes) {
    const expectedUrl = `${productionOrigin}${route === "/" ? "/" : route}`;
    const response = await worker.fetch(
      new Request(`${productionOrigin}${route}`, {
        headers: {
          accept: "text/html",
          "user-agent": "LinkedInBot/1.0",
        },
      }),
      env,
      ctx,
    );

    assert.equal(response.status, 200, `${route} should render`);
    assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
    const html = await response.text();
    assert.match(html, /<html[^>]*\blang=["']en["']/i);
    assert.equal(elements(html, "meta", "charset", "utf-8").length, 1);
    assert.equal(elements(html, "meta", "name", "viewport").length, 1);

    const titles = [...html.matchAll(/<title>([^<]+)<\/title>/gi)];
    assert.equal(titles.length, 1, `${route} must have exactly one title`);
    assert.ok(titles[0][1].trim(), `${route} title must not be empty`);

    const description = oneMeta(html, "name", "description");
    const canonicalTags = elements(html, "link", "rel", "canonical");
    assert.equal(canonicalTags.length, 1, `${route} must have one canonical URL`);
    assert.equal(attribute(canonicalTags[0], "href"), expectedUrl);

    const ogTitle = oneMeta(html, "property", "og:title");
    const ogDescription = oneMeta(html, "property", "og:description");
    assert.equal(ogTitle, titles[0][1]);
    assert.equal(oneMeta(html, "property", "og:url"), expectedUrl);
    assert.equal(oneMeta(html, "property", "og:site_name"), "John Patrick Collins");
    assert.match(oneMeta(html, "property", "og:type"), /^(website|article)$/);
    const ogImage = oneMeta(html, "property", "og:image");
    assert.match(ogImage, /^https:\/\/johnpatrickcollins\.info\/social\/.+\.png$/);
    assert.equal(oneMeta(html, "property", "og:image:type"), "image/png");
    assert.equal(oneMeta(html, "property", "og:image:width"), "1200");
    assert.equal(oneMeta(html, "property", "og:image:height"), "627");
    const ogImageAlt = oneMeta(html, "property", "og:image:alt");

    assert.equal(oneMeta(html, "name", "twitter:card"), "summary_large_image");
    assert.equal(oneMeta(html, "name", "twitter:title"), ogTitle);
    assert.equal(oneMeta(html, "name", "twitter:description"), ogDescription);
    assert.equal(oneMeta(html, "name", "twitter:image"), ogImage);
    assert.equal(oneMeta(html, "name", "twitter:image:alt"), ogImageAlt);
    assert.equal(description, ogDescription);

    const robots = oneMeta(html, "name", "robots");
    assert.match(robots, /index/i);
    assert.match(robots, /follow/i);
    assert.doesNotMatch(html, /codex-preview|localhost|terminal\.local|\.openai/i);

    const imagePath = new URL(ogImage).pathname;
    const imageResponse = await worker.fetch(new Request(ogImage), env, ctx);
    assert.equal(imageResponse.status, 200, `${imagePath} must be publicly served`);
    assert.match(imageResponse.headers.get("content-type") ?? "", /^image\/png\b/i);
    const image = await readFile(path.join(projectRoot, "public", imagePath.slice(1)));
    assert.deepEqual(pngDimensions(image), { width: 1200, height: 627 });
    assert.ok(image.byteLength < 5_000_000, `${imagePath} must be under 5 MB`);
  }
});

test("publishes crawler policy and returns a real 404 for unknown pages", async () => {
  const worker = await loadWorker();
  const robotsResponse = await worker.fetch(
    new Request(`${productionOrigin}/robots.txt`, {
      headers: { "user-agent": "LinkedInBot/1.0" },
    }),
    env,
    ctx,
  );
  assert.equal(robotsResponse.status, 200);
  const robots = await robotsResponse.text();
  assert.match(robots, /User-Agent:\s*\*/i);
  assert.match(robots, /Allow:\s*\//i);
  assert.match(robots, /Host:\s*https:\/\/johnpatrickcollins\.info/i);
  assert.match(robots, /Sitemap:\s*https:\/\/johnpatrickcollins\.info\/sitemap\.xml/i);

  const missingResponse = await worker.fetch(
    new Request(`${productionOrigin}/definitely-not-a-public-page`, {
      headers: { accept: "text/html" },
    }),
    env,
    ctx,
  );
  assert.equal(missingResponse.status, 404);
});

test("links to the Stack Overflow profile from the footer", async () => {
  const worker = await loadWorker();
  const response = await worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html" } }),
    env,
    ctx,
  );

  const html = await response.text();
  assert.match(
    html,
    /href=["']https:\/\/stackoverflow\.com\/users\/6714627\/john-collins\?tab=profile["'][^>]*>\s*Stack Overflow/i,
  );
});

test("renders accessible animated research-axis cards", async () => {
  const worker = await loadWorker();
  const response = await worker.fetch(
    new Request("http://localhost/research", {
      headers: { accept: "text/html" },
    }),
    env,
    ctx,
  );

  const html = await response.text();
  assert.match(html, /class=["'][^"']*modern-hover-card[^"']*["']/i);
  assert.match(html, /class=["']research-card-link["'][^>]*href=["']\/research\/cgt["']/i);

  const css = await readFile(path.join(projectRoot, "app", "globals.css"), "utf8");
  assert.match(css, /@keyframes\s+seamless-flow/);
  assert.match(css, /prefers-reduced-motion:[^)]+\)[\s\S]*article\.modern-hover-card/);
});

test("renders the complete CGT scientific report", async () => {
  const worker = await loadWorker();
  const response = await worker.fetch(
    new Request("http://localhost/research/cgt", {
      headers: { accept: "text/html" },
    }),
    env,
    ctx,
  );

  assert.equal(response.status, 200);
  const html = await response.text();
  for (const heading of [
    "Abstract",
    "Introduction",
    "Results",
    "Methods",
    "Discussion",
    "Supplementary figures",
    "References",
  ]) {
    assert.match(html, new RegExp(`>${heading}<`, "i"), `${heading} should be present`);
  }
  assert.match(html, /Figure 1/i);
  assert.match(html, /Supplementary Figure 1/i);
  assert.match(html, /Contextual Operator Response Dynamics/i);
  assert.match(html, /has not been peer reviewed/i);

  const publicationCss = await readFile(
    path.join(projectRoot, "app", "research", "cgt", "publication.module.css"),
    "utf8",
  );
  assert.match(publicationCss, /\.contents\s*{[^}]*position:\s*sticky;[^}]*top:\s*88px;[^}]*z-index:\s*40;/s);
  assert.match(publicationCss, /\.contents\s*{[^}]*top:\s*76px;/s);
});

test("ships every canonical CGT figure in PNG, PDF, and SVG formats", async () => {
  const stems = [
    ["main", "figure-01-fitness"],
    ["main", "figure-02-recurrent-geometry"],
    ["main", "figure-03-signed-axes"],
    ["main", "figure-04-evidence-atlas"],
    ["main", "figure-05-tcga-projection"],
    ["supplementary", "figure-s01-generalization-boundary"],
    ["supplementary", "figure-s02-residual-reliability"],
    ["supplementary", "figure-s03-supporting-axes"],
    ["supplementary", "figure-s04-full-evidence-atlas"],
    ["supplementary", "figure-s05-tcga-expression-qc"],
    ["supplementary", "figure-s06-tcga-pc-variance"],
  ];

  for (const [folder, stem] of stems) {
    for (const extension of ["png", "pdf", "svg"]) {
      await access(path.join(projectRoot, "public", "research", "cgt", "figures", folder, `${stem}.${extension}`));
    }
  }

  const manifestPath = path.join(projectRoot, "public", "research", "cgt", "figures", "manifest.json");
  const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
  assert.equal(manifest.figures.length, 11);
  assert.equal(manifest.report.main_figure_count, 5);
  assert.equal(manifest.report.supplementary_figure_count, 6);
  assert.equal(manifest.report.physical_asset_count, 33);
  assert.ok(manifest.figures.every((figure) =>
    ["png", "pdf", "svg"].every((format) => figure.assets[format]?.sha256),
  ));

  await access(path.join(projectRoot, "public", "research", "cgt", "data", "cgt-cache-002-dataset-manifest.csv"));
});
