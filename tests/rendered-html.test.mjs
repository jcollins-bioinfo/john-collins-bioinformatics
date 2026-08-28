import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { access, readFile, stat } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import test from "node:test";

const projectRoot = fileURLToPath(new URL("../", import.meta.url));

async function sha256(filePath) {
  return createHash("sha256").update(await readFile(filePath)).digest("hex");
}

async function loadWorker() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker;
}

const env = {
  ASSETS: {
    fetch: async () => new Response("Not found", { status: 404 }),
  },
};

const ctx = {
  waitUntil() {},
  passThroughOnException() {},
};

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

test("renders the mercury name without shared delays or conflicting filter animations", async () => {
  const worker = await loadWorker();
  const response = await worker.fetch(
    new Request("http://localhost/about", { headers: { accept: "text/html" } }),
    env,
    ctx,
  );
  const html = await response.text();
  assert.match(html, /class=["']mercury-name-container fade-in-char["']/i);
  assert.match(html, /class=["']nano-mercury-char["'][^>]*data-text=["']John Patrick Collins["']/i);
  assert.doesNotMatch(html, /nano-mercury-char fade-in-char/i);
  assert.doesNotMatch(html, /-16\.6066s|animation-delay:\s*-/i);

  const css = await readFile(path.join(projectRoot, "app", "globals.css"), "utf8");
  assert.match(css, /\.nano-mercury-char\s*\{[^}]*animation:[^}]*microMercuryFlow[^}]*nanoIridescence[^}]*filamentBreeze/s);
  assert.match(css, /\.nano-mercury-char::after\s*\{[^}]*animation:\s*mercuryGlint/s);
  assert.doesNotMatch(css, /granularSparkle|step-end|brightness\(3\.5\)/);
  assert.match(css, /prefers-reduced-motion:[^)]+\)[\s\S]*\.nano-mercury-char::after\s*\{[^}]*animation:\s*none !important/s);
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
  assert.match(component, /const AMBIENT_LOOP_DURATION_MS = 20_000/);
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
  assert.match(html, /data-brand-continuous=["']true["']/i);
  assert.match(component, /Math\.sin\(fundamental \* 2\) \* 0\.045/);

  const css = await readFile(path.join(projectRoot, "app", "globals.css"), "utf8");
  assert.match(css, /\.brand-mark-motion\s*{[^}]*opacity:\s*0/s);
  assert.match(
    css,
    /\.brand-mark-shell\[data-animating="true"\]\s+\.brand-mark-motion\s*{[^}]*opacity:\s*1/s,
  );
});

test("renders every public HTML route", async () => {
  const worker = await loadWorker();
  const routes = [
    "/",
    "/about",
    "/bioinformatics",
    "/research",
    "/research/cgt",
    "/projects",
    "/writing",
    "/music",
    "/now",
    "/cv",
    "/contact",
    "/publications",
  ];

  for (const route of routes) {
    const response = await worker.fetch(
      new Request(`http://localhost${route}`, {
        headers: { accept: "text/html" },
      }),
      env,
      ctx,
    );

    assert.equal(response.status, 200, `${route} should render`);
    assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
    assert.match(await response.text(), /John Patrick Collins/i);
  }
});

test("serves audited Figure 2–5 downloads with exact MIME types and unmodified bodies", async () => {
  const worker = await loadWorker();
  const body = new Uint8Array([0x43, 0x47, 0x54]);
  const figureThreeTransportBodies = new Map([
    ["/_cgt/f3/c54503486663c217/p1", { body: new Uint8Array([0x43]), bytes: 25165824 }],
    ["/_cgt/f3/c54503486663c217/p2", { body: new Uint8Array([0x47]), bytes: 25165824 }],
    ["/_cgt/f3/c54503486663c217/p3", { body: new Uint8Array([0x54]), bytes: 22234035 }],
  ]);
  const assetRequests = [];
  const assetEnv = {
    ASSETS: {
      fetch: async (request) => {
        const pathname = new URL(request.url).pathname;
        assetRequests.push({ pathname, method: request.method });
        const transportPart = figureThreeTransportBodies.get(pathname);
        return new Response(transportPart?.body ?? body, {
          headers: {
            "content-length": String(transportPart?.bytes ?? body.length),
            "content-type": "application/octet-stream",
          },
        });
      },
    },
  };
  const expected = new Map([
    ["/research/cgt/figures/main/CGT_FIGURE_002_recurrent_geometry_revised.pdf", "application/pdf"],
    ["/research/cgt/figures/main/CGT_FIGURE_002_recurrent_geometry_revised_v1.zip", "application/zip"],
    ["/research/cgt/figures/main/figure-02-recurrent-geometry.pdf", "application/pdf"],
    ["/research/cgt/figures/main/CGT_FIGURE_003_signed_axes_revised.pdf", "application/pdf"],
    ["/research/cgt/figures/main/CGT_FIGURE_003_signed_axes_revised_v1.zip", "application/zip"],
    ["/research/cgt/figures/main/figure-03-signed-axes.pdf", "application/pdf"],
    ["/research/cgt/figures/main/CGT_FIGURE_004_dependency_aware_synthesis_revised_web.png", "image/png"],
    ["/research/cgt/figures/main/CGT_FIGURE_004_dependency_aware_synthesis_revised_600dpi.png", "image/png"],
    ["/research/cgt/figures/main/CGT_FIGURE_004_dependency_aware_synthesis_revised.pdf", "application/pdf"],
    ["/research/cgt/figures/main/CGT_FIGURE_004_dependency_aware_synthesis_revised.svg", "image/svg+xml"],
    ["/research/cgt/figures/main/CGT_FIGURE_004_dependency_aware_synthesis_revised_v1.zip", "application/zip"],
    ["/research/cgt/figures/main/CGT_FIGURE_005_tcga_cancer_type_structure_revised_web.png", "image/png"],
    ["/research/cgt/figures/main/CGT_FIGURE_005_tcga_cancer_type_structure_revised_600dpi.png", "image/png"],
    ["/research/cgt/figures/main/CGT_FIGURE_005_tcga_cancer_type_structure_revised.pdf", "application/pdf"],
    ["/research/cgt/figures/main/CGT_FIGURE_005_tcga_cancer_type_structure_revised.svg", "image/svg+xml"],
    ["/research/cgt/figures/main/CGT_FIGURE_005_tcga_cancer_type_structure_revised_mobile_panel_a.png", "image/png"],
    ["/research/cgt/figures/main/CGT_FIGURE_005_tcga_cancer_type_structure_revised_mobile_panel_b.png", "image/png"],
    ["/research/cgt/figures/main/CGT_FIGURE_005_tcga_cancer_type_structure_revised_mobile_panel_c.png", "image/png"],
    ["/research/cgt/figures/main/CGT_FIGURE_005_tcga_cancer_type_structure_revised_mobile_panel_d.png", "image/png"],
    ["/research/cgt/figures/main/CGT_FIGURE_005_tcga_cancer_type_structure_revised_mobile_panel_e.png", "image/png"],
    ["/research/cgt/figures/main/CGT_FIGURE_005_tcga_cancer_type_structure_revised_mobile_panel_f.png", "image/png"],
    ["/research/cgt/figures/main/CGT_FIGURE_005_revised_reproducibility_package_v1.zip", "application/zip"],
    ["/research/cgt/figures/main/CGT_FIGURE_005_tcga_cancer_type_structure_revised_audit.json", "application/json"],
  ]);

  for (const [route, contentType] of expected) {
    const response = await worker.fetch(new Request(`http://localhost${route}`), assetEnv, ctx);
    assert.equal(response.status, 200);
    assert.equal(response.headers.get("content-type"), contentType);
    assert.deepEqual(new Uint8Array(await response.arrayBuffer()), body);
  }

  const figureThreeZipPath = "/research/cgt/figures/main/CGT_FIGURE_003_signed_axes_revised_v1.zip";
  const figureThreeZipResponse = await worker.fetch(
    new Request(`http://localhost${figureThreeZipPath}`, { method: "HEAD" }),
    assetEnv,
    ctx,
  );
  assert.equal(figureThreeZipResponse.status, 200);
  assert.equal(figureThreeZipResponse.headers.get("content-type"), "application/zip");
  assert.equal(figureThreeZipResponse.headers.get("content-length"), "72565683");
  assert.equal(
    figureThreeZipResponse.headers.get("x-content-sha256"),
    "c54503486663c217ddd6348ccef22642255c04112ff936ab615c9e104449987d",
  );
  assert.equal(
    figureThreeZipResponse.headers.get("content-disposition"),
    "attachment; filename=\"CGT_FIGURE_003_signed_axes_revised_v1.zip\"",
  );
  assert.deepEqual(
    assetRequests.filter(({ pathname }) => figureThreeTransportBodies.has(pathname)),
    [
      ...[...figureThreeTransportBodies.keys()].map((pathname) => ({ pathname, method: "GET" })),
      ...[...figureThreeTransportBodies.keys()].map((pathname) => ({ pathname, method: "HEAD" })),
    ],
  );

  const methodNotAllowed = await worker.fetch(
    new Request(`http://localhost${figureThreeZipPath}`, { method: "POST" }),
    assetEnv,
    ctx,
  );
  assert.equal(methodNotAllowed.status, 405);
  assert.equal(methodNotAllowed.headers.get("allow"), "GET, HEAD");

  const firstTransportPath = [...figureThreeTransportBodies.keys()][0];
  const missingPartEnv = {
    ASSETS: {
      fetch: async (request) => {
        const pathname = new URL(request.url).pathname;
        if (pathname === firstTransportPath) return new Response(null, { status: 404 });
        const part = figureThreeTransportBodies.get(pathname);
        return new Response(part.body, { headers: { "content-length": String(part.bytes) } });
      },
    },
  };
  const missingPart = await worker.fetch(
    new Request(`http://localhost${figureThreeZipPath}`),
    missingPartEnv,
    ctx,
  );
  assert.equal(missingPart.status, 502);

  const wrongSizePartEnv = {
    ASSETS: {
      fetch: async (request) => {
        const pathname = new URL(request.url).pathname;
        const part = figureThreeTransportBodies.get(pathname);
        return new Response(part.body, {
          headers: { "content-length": String(part.bytes - (pathname === firstTransportPath ? 1 : 0)) },
        });
      },
    },
  };
  const wrongSizePart = await worker.fetch(
    new Request(`http://localhost${figureThreeZipPath}`),
    wrongSizePartEnv,
    ctx,
  );
  assert.equal(wrongSizePart.status, 502);

  for (const transportPath of figureThreeTransportBodies.keys()) {
    const response = await worker.fetch(new Request(`http://localhost${transportPath}`), assetEnv, ctx);
    assert.equal(response.status, 404, `${transportPath} is not a public download route`);
  }

  const wranglerConfig = await readFile(path.join(projectRoot, "wrangler.jsonc"), "utf8");
  for (const route of expected.keys()) {
    assert.match(wranglerConfig, new RegExp(route.replaceAll(".", "\\.")));
  }
  assert.match(wranglerConfig, /"run_worker_first"\s*:/);
  for (const transportPath of figureThreeTransportBodies.keys()) {
    assert.match(wranglerConfig, new RegExp(transportPath.replaceAll(".", "\\.")));
  }
});

test("prepares an exact, deployable Figure 3 ZIP transport without rewriting the canonical ZIP", async () => {
  const clientRoot = path.join(projectRoot, "dist", "client");
  const releaseRelativePath = "research/cgt/figures/main/CGT_FIGURE_003_signed_axes_revised_v1.zip";
  const releasePath = path.join(clientRoot, releaseRelativePath);
  const expectedSha256 = "c54503486663c217ddd6348ccef22642255c04112ff936ab615c9e104449987d";
  const parts = [
    ["p1", 25165824],
    ["p2", 25165824],
    ["p3", 22234035],
  ];
  const transportRoot = path.join(
    clientRoot,
    "_cgt",
    "f3",
    "c54503486663c217",
  );

  assert.equal((await stat(releasePath)).size, 72565683);
  assert.equal(await sha256(releasePath), expectedSha256);

  const reconstructedHash = createHash("sha256");
  let reconstructedBytes = 0;
  for (const [filename, expectedBytes] of parts) {
    const part = await readFile(path.join(transportRoot, filename));
    assert.equal(part.length, expectedBytes);
    assert.ok(part.length < 25 * 1024 * 1024);
    reconstructedBytes += part.length;
    reconstructedHash.update(part);
  }
  assert.equal(reconstructedBytes, 72565683);
  assert.equal(reconstructedHash.digest("hex"), expectedSha256);

  const assetsIgnore = await readFile(path.join(clientRoot, ".assetsignore"), "utf8");
  assert.ok(assetsIgnore.split(/\r?\n/).includes(releaseRelativePath));
  const packageJson = JSON.parse(await readFile(path.join(projectRoot, "package.json"), "utf8"));
  assert.match(packageJson.scripts.build, /prepare:cgt-figure-003-transport/);
  assert.equal(
    packageJson.scripts["prepare:cgt-figure-003-transport"],
    "node scripts/prepare-cgt-figure-003-transport.mjs",
  );
});

test("integrates the existing Cloudflare Turnstile widget on the contact page", async () => {
  const worker = await loadWorker();
  const response = await worker.fetch(
    new Request("http://localhost/contact", { headers: { accept: "text/html" } }),
    env,
    ctx,
  );
  const html = await response.text();

  assert.equal(response.status, 200);
  assert.match(html, /https:\/\/challenges\.cloudflare\.com\/turnstile\/v0\/api\.js/);
  assert.match(html, /class=["'][^"']*cf-turnstile[^"']*["']/);
  assert.match(html, /data-sitekey=["']0x4AAAAAAERzVqx-2DEjWWLa["']/);
  assert.match(html, /data-size=["']flexible["']/);
});

test("renders the About lede as one accessible 225-step animation", async () => {
  const worker = await loadWorker();
  const expectedLede =
    "I’m John Patrick Collins: a bioinformatics data scientist and software engineer, an independent researcher, and a composer and pianist. My work is united by an interest in how complex systems are structured, regulated, interpreted, and changed.";
  const response = await worker.fetch(
    new Request("http://localhost/about", { headers: { accept: "text/html" } }),
    env,
    ctx,
  );
  const html = await response.text();
  const ledeMatch = html.match(/<p class="page-lede">([\s\S]*?)<\/p>/);
  assert.ok(ledeMatch, "the About lede should render");
  const ledeHtml = ledeMatch[1];
  const ledeText = ledeHtml
    .replace(/<[^>]+>/g, "")
    .replaceAll("&amp;", "&")
    .replaceAll("&#x27;", "'")
    .replaceAll("&quot;", '"');

  assert.equal(ledeText, expectedLede);
  assert.equal(html.split(expectedLede).length - 1, 0, "the lede is represented once, not duplicated");
  assert.match(ledeHtml, /class="fade-in-char" style="--char-index:0"[^>]*>I<\/span>/);
  assert.match(
    ledeHtml,
    /class="mercury-name-container fade-in-char" style="--char-index:4"><span class="nano-mercury-char" data-text="John Patrick Collins">John Patrick Collins<\/span><\/span>/,
  );
  assert.match(ledeHtml, /style="--char-index:5"[^>]*>:<\/span>/);
  assert.match(ledeHtml, /style="--char-index:224"[^>]*>\.<\/span><\/span>$/);

  const indices = [...ledeHtml.matchAll(/--char-index:(\d+)/g)].map((match) => Number(match[1]));
  assert.deepEqual(indices, Array.from({ length: 225 }, (_, index) => index));
  assert.equal((ledeHtml.match(/--char-index:4(?:\D|$)/g) ?? []).length, 1);
  assert.doesNotMatch(ledeHtml, /John<\/span>|>J<\/span><span/);

  for (const route of ["/", "/bioinformatics", "/research"]) {
    const unrelatedResponse = await worker.fetch(
      new Request(`http://localhost${route}`, { headers: { accept: "text/html" } }),
      env,
      ctx,
    );
    const unrelatedHtml = await unrelatedResponse.text();
    assert.doesNotMatch(unrelatedHtml, /fade-in-char|mercury-name-container|nano-mercury-char/);
  }

  for (const element of ["header", "footer"]) {
    const chromeMatch = html.match(new RegExp(`<${element}\\b[\\s\\S]*?<\\/${element}>`));
    assert.ok(chromeMatch?.[0].includes("John Patrick Collins"), `${element} should retain its identity text`);
    assert.doesNotMatch(chromeMatch[0], /fade-in-char|mercury-name-container|nano-mercury-char/);
  }
});

test("renders the accessible full-bleed heteroscedastic field with a safe animation lifecycle", async () => {
  const worker = await loadWorker();
  const response = await worker.fetch(
    new Request("http://localhost/about", { headers: { accept: "text/html" } }),
    env,
    ctx,
  );
  const html = await response.text();
  assert.equal(response.status, 200);
  assert.match(html, /data-heteroscedastic-field/);
  assert.match(html, /A generative field representing heteroscedasticity/);
  assert.match(html, /<canvas[^>]*aria-hidden=["']true["']/i);
  assert.doesNotMatch(html, /class=["']shell[^"']*["'][^>]*data-heteroscedastic-field/i);

  const component = await readFile(
    path.join(projectRoot, "app", "components", "heteroscedastic-field.tsx"),
    "utf8",
  );
  assert.match(component, /requestAnimationFrame/);
  assert.match(component, /ResizeObserver/);
  assert.match(component, /IntersectionObserver/);
  assert.match(component, /prefers-reduced-motion: reduce/);
  assert.match(component, /visibilitychange/);
  assert.doesNotMatch(component, /setInterval/);

  const aboutPage = await readFile(path.join(projectRoot, "app", "about", "page.tsx"), "utf8");
  assert.match(aboutPage, /<\/section>\s*<HeteroscedasticField \/>\s*<section className="shell page-section about-story">/s);
});

test("presents selected piano recordings as a lightweight accessible carousel", async () => {
  const worker = await loadWorker();
  const response = await worker.fetch(
    new Request("http://localhost/music", { headers: { accept: "text/html" } }),
    env,
    ctx,
  );
  const html = await response.text();

  assert.match(html, /Piano Music/);
  assert.match(html, /\/media\/forever-prelude-poster\.svg/);
  assert.doesNotMatch(html, /i\.ytimg\.com\/vi\/ogi3rv9Rd8g/);
  assert.match(html, /Selected piano compositions/);
  assert.match(html, /Play Forever/);
  assert.match(html, /Previous composition/);
  assert.match(html, /Next composition/);
  assert.match(html, /Op\. 1, No\. 15[^<]*Prelude in D-flat Major/);
  assert.doesNotMatch(html, /youtube-nocookie\.com\/embed\/ogi3rv9Rd8g/);
  assert.match(html, /href="https:\/\/www\.youtube\.com\/@johncollinspianomusic"[^>]*target="_blank"[^>]*rel="noopener noreferrer"/);
  await access(path.join(projectRoot, "public", "media", "forever-prelude-poster.svg"));

  const component = await readFile(
    path.join(projectRoot, "app", "music", "youtube-facade.tsx"),
    "utf8",
  );
  for (const id of ["ogi3rv9Rd8g", "hx-z3kTaafg", "om2Fnk_LJwI", "-CT8sgU6lDo"]) {
    assert.match(component, new RegExp(id.replaceAll("-", "\\-")));
  }
  assert.match(component, /current \+ direction \+ pianoVideos\.length\) % pianoVideos\.length/);
  assert.match(component, /setIsPlaying\(false\)/);
  assert.match(component, /naturalWidth < 640/);
  assert.match(component, /"hqdefault" : "none"/);
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
  assert.match(html, /<dt>Analysis freeze<\/dt><dd>15 July 2026<\/dd>/);
  assert.match(html, /<dt>Web report<\/dt><dd>23 August 2026<\/dd>/);
  assert.match(html, /<dt>Version<\/dt><dd>0\.5\.0<\/dd>/);
  assert.match(html, /version (?:<!-- -->)?0\.5\.0/i);
  assert.match(html, /CGT_FIGURE_001_residual_geometry_predicts_fitness_revised_web\.png/);
  assert.match(html, /width=["']2400["'][^>]*height=["']2163["']/i);
  assert.match(html, /aria-describedby=["']fig-1-accessible-description["']/i);
  for (const downloadName of [
    "Figure 1 web PNG",
    "Figure 1 600-dpi PNG",
    "Figure 1 publication PDF",
    "Figure 1 vector SVG",
    "Figure 1 reproducibility package",
    "Figure 1 machine-readable audit",
  ]) assert.match(html, new RegExp(downloadName));
  assert.match(html, /presentation and scientific-label corrections; frozen numerical inputs/);
  assert.match(html, /Minimum workflow-text clearance[^<]*2\.002 pt/i);
  assert.match(html, /statistics–legend separation[^<]*12\.762 pt/i);
  assert.match(html, /legend occluded 0 of 1,229 observations/i);
  assert.doesNotMatch(html, /\/research\/cgt\/figures\/main\/figure-01-fitness\.(?:png|pdf|svg)/);

  const figureTwoMatch = html.match(/<figure\b[^>]*id=["']fig-2["'][\s\S]*?<\/figure>/i);
  assert.ok(figureTwoMatch, "Figure 2 should render as a complete figure block");
  const figureTwoHtml = figureTwoMatch[0];
  assert.match(figureTwoHtml, /CGT_FIGURE_002_recurrent_geometry_revised_web\.png/);
  assert.match(figureTwoHtml, /width=["']2400["'][^>]*height=["']2500["']/i);
  assert.match(figureTwoHtml, /aria-describedby=["']fig-2-accessible-description["']/i);
  assert.match(figureTwoHtml, /href=["']\/research\/cgt\/figures\/main\/CGT_FIGURE_002_recurrent_geometry_revised\.svg["']/i);
  assert.match(figureTwoHtml, /Open Figure 2 as a full-resolution SVG in a new tab/);
  assert.match(figureTwoHtml, /Residual family-coordinate structure recurs within the leave-dataset-out benchmark but attenuates under study-proxy and context exclusion/);
  assert.match(figureTwoHtml, /Two upstream analysis universes are shown and are not interchangeable/);
  assert.match(figureTwoHtml, /transductive preprocessing, not a fully nested inductive pipeline/);
  assert.equal((figureTwoHtml.match(/class=["'][^"']*katex-display/g) ?? []).length, 2);
  assert.ok((figureTwoHtml.match(/<math\b/g) ?? []).length >= 20, "inline and display expressions should include semantic MathML");
  assert.match(figureTwoHtml, /<annotation encoding=["']application\/x-tex["']>R_f=z\(C_f\/9\)/);
  assert.match(figureTwoHtml, /<annotation encoding=["']application\/x-tex["']>S_f=z\(q_f\)/);
  assert.match(figureTwoHtml, /H_f=-\\sum_c p_\{fc\}\\log p_\{fc\}/);
  assert.match(figureTwoHtml, /0\.75\\,\\mathbb\{E\}\[y\\mid\\mathrm\{dataset\}\]/);
  assert.match(figureTwoHtml, /\\alpha=n\/\(n\+2\)/);
  assert.match(figureTwoHtml, /R_f-S_f\\leq-1/);
  assert.match(figureTwoHtml, /-1&lt;R_f-S_f\\leq1/);
  assert.match(figureTwoHtml, /R_f-S_f&gt;1/);
  for (const identifier of ["B", "I", "C", "universal_candidate", "universality_index", "energy_fraction"]) {
    assert.match(figureTwoHtml, new RegExp(`<code>${identifier}</code>`));
  }
  assert.doesNotMatch(figureTwoHtml.replace(/<annotation[\s\S]*?<\/annotation>/g, ""), /\\[()[\]]|\\(?:mathbb|mathrm|mid|sum|log|tfrac|left|right|leq|alpha)/);
  assert.match(figureTwoHtml, /Overall organization and encodings/);
  assert.match(figureTwoHtml, /Accessibility-level interpretation boundary/);
  for (const downloadName of [
    "Figure 2 web PNG",
    "Figure 2 600-dpi PNG",
    "Figure 2 publication PDF",
    "Figure 2 vector SVG",
    "Figure 2 reproducibility package",
    "Figure 2 machine-readable audit",
  ]) assert.match(figureTwoHtml, new RegExp(downloadName));
  assert.doesNotMatch(figureTwoHtml, /\/research\/cgt\/figures\/main\/figure-02-recurrent-geometry\.(?:png|pdf|svg)/);
  assert.doesNotMatch(figureTwoHtml, />Download PDF<|>Open vector SVG<|>Open 600-dpi PNG</);

  const publicationCss = await readFile(
    path.join(projectRoot, "app", "research", "cgt", "publication.module.css"),
    "utf8",
  );
  assert.match(publicationCss, /\.contents\s*{[^}]*position:\s*sticky;[^}]*top:\s*88px;[^}]*z-index:\s*40;/s);
  assert.match(publicationCss, /\.contents\s*{[^}]*top:\s*76px;/s);
});

test("renders the publication-level CGT Methods record with semantic math and calibrated claim boundaries", async () => {
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
  const methodsMatch = /<section\b[^>]*\bid=["']methods["'][^>]*>/i.exec(html);
  assert.ok(methodsMatch, "the Methods article section should render");
  const discussionOffset = html.slice(methodsMatch.index).search(
    /<section\b[^>]*\bid=["']discussion["'][^>]*>/i,
  );
  assert.ok(discussionOffset > 0, "the Discussion section should follow Methods");
  const methodsHtml = html.slice(methodsMatch.index, methodsMatch.index + discussionOffset);

  const headings = [
    ["methods-analysis-universes", "Analysis universes, source hierarchy, and observational units"],
    ["methods-family-mass-recurrence", "Local SVD modes, family-mass coordinates, and recurrence summaries"],
    ["methods-transfer-controls-uncertainty", "Residual baselines, transfer estimands, controls, and uncertainty"],
    ["methods-gene-fitness-benchmark", "External gene-fitness benchmark"],
    ["methods-functional-annotation", "Candidate functional annotation and curation"],
    ["methods-dependency-aware-synthesis", "Dependency-aware synthesis"],
    ["methods-tcga-structure", "TCGA bulk-expression scoring and descriptive cancer-type structure"],
    ["methods-statistical-provenance", "Statistical reporting, provenance, and reproducibility"],
  ];
  let precedingIndex = -1;
  for (const [id, heading] of headings) {
    const escapedHeading = heading.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const headingPattern = new RegExp(
      `<h3(?=[^>]*\\bid=["']${id}["'])[^>]*>${escapedHeading}<\\/h3>`,
    );
    const occurrences = methodsHtml.match(new RegExp(`>${escapedHeading}<`, "g")) ?? [];
    assert.equal(occurrences.length, 1, `${heading} should render exactly once`);
    assert.match(methodsHtml, headingPattern, `${heading} should use its stable heading ID`);
    const currentIndex = methodsHtml.indexOf(`id="${id}"`);
    assert.ok(currentIndex > precedingIndex, `${heading} should appear in methodological order`);
    precedingIndex = currentIndex;
  }
  assert.equal(
    headings.filter(([id]) => methodsHtml.includes(`aria-labelledby="${id}"`)).length,
    8,
    "Methods should contain eight labelled semantic method rows",
  );

  for (const expression of [
    String.raw`A_{if}=\frac`,
    String.raw`R_{if}=A_{if}-\overline`,
    String.raw`R_f^{\mathrm{rec}}=z`,
    String.raw`b_i^{\mathrm{shrink}}=0.75`,
    String.raw`\widehat r_i=\frac{n}{n+2}`,
    String.raw`p_{\mathrm{perm}}=\frac{b+1}{B+1}`,
    String.raw`s_{ij}=\beta_{0j}`,
    String.raw`\eta^2_{\mathrm{in},j}=\frac`,
  ]) {
    assert.ok(
      methodsHtml.includes(`<annotation encoding="application/x-tex">${expression}`),
      `Methods should expose semantic TeX for ${expression}`,
    );
  }
  assert.ok(
    (methodsHtml.match(/<math\b/g) ?? []).length >= 30,
    "display and inline equations should include semantic MathML",
  );
  const visibleMethodsHtml = methodsHtml.replace(/<annotation[\s\S]*?<\/annotation>/g, "");
  assert.doesNotMatch(visibleMethodsHtml, /\\[()[\]]/);
  assert.doesNotMatch(
    visibleMethodsHtml,
    /\\(?:mathbb|mathrm|sum|log|frac|widehat|overline|eta|beta|varepsilon|lvert|rvert|leq|geq|times)/,
  );

  for (const phrase of [
    "transductive preprocessing",
    "dataset-name-prefix proxy",
    "201,771",
    "rank 12",
    "No combined evidence score",
    "pooled leave-one-axis-out",
    "in-sample",
    "does not document the upstream formula mapping TCGA expression",
    "prevents independent raw-score reconstruction",
    "Historical recovery snapshot",
    "b9082d525c9f6aa58bf3cffa9ce56abf8e5f9bf2cf121c018a07497470fd1825",
    "6d50bf02c73a06cf1433b890c1e81731d717f21e2fcd3160dcf8eac3f3fd3137",
  ]) assert.ok(methodsHtml.includes(phrase), `Methods should include ${phrase}`);

  assert.doesNotMatch(methodsHtml, /fitness relevance\s*=\s*0\.5/i);
  assert.doesNotMatch(
    methodsHtml,
    /orthogonal projection|tumor-state projection|independently defined axes|lineage manifestation/i,
  );
  assert.doesNotMatch(
    html,
    /<template[^>]+data-dgst=|There was an error while hydrating|Minified React error|Application error/i,
  );
  assert.doesNotMatch(html, /0\.4\.0/);

  const citationTargets = new Set(
    [...methodsHtml.matchAll(/href=["']#(ref-[^"']+)["']/g)].map((match) => match[1]),
  );
  assert.ok(citationTargets.size >= 10, "Methods should cite the governing literature inline");
  for (const target of citationTargets) {
    assert.match(html, new RegExp(`id=["']${target}["']`), `${target} should resolve`);
  }
});

test("renders the audited Figure 3 release with canonical assets, accessible copy, and responsive open-original access", async () => {
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
  const figureThreeMatch = html.match(/<figure\b[^>]*id=["']fig-3["'][\s\S]*?<\/figure>/i);
  assert.ok(figureThreeMatch, "Figure 3 should render as a complete figure block");
  const figureThreeHtml = figureThreeMatch[0];
  const figureThreeCopy = JSON.parse(await readFile(
    path.join(projectRoot, "app", "research", "cgt", "figure-03-copy.json"),
    "utf8",
  ));

  assert.ok(
    figureThreeHtml.includes(`<h3>${figureThreeCopy.title}</h3>`),
    "Figure 3 should use the approved title verbatim",
  );
  assert.doesNotMatch(figureThreeHtml, /Signed dimensions map to candidate biological axes/);
  assert.doesNotMatch(figureThreeHtml, /Signed dimensions of residual perturbation geometry map to candidate biological axes/);

  const figureImageMatch = figureThreeHtml.match(
    /<img\b[^>]*CGT_FIGURE_003_signed_axes_revised_web\.png[^>]*>/i,
  );
  assert.ok(figureImageMatch, "Figure 3 should render the cache-invalidating canonical web PNG");
  const figureImageHtml = figureImageMatch[0];
  assert.match(figureImageHtml, /src=["']\/research\/cgt\/figures\/main\/CGT_FIGURE_003_signed_axes_revised_web\.png["']/i);
  assert.match(figureImageHtml, /width=["']2400["']/i);
  assert.match(figureImageHtml, /height=["']2675["']/i);
  assert.ok(figureImageHtml.includes(`alt="${figureThreeCopy.alt}"`));
  assert.match(figureImageHtml, /aria-describedby=["']fig-3-accessible-description["']/i);
  assert.match(figureImageHtml, /aria-details=["']fig-3-details["']/i);

  const openOriginalMatch = figureThreeHtml.match(
    /<a\b(?=[^>]*href=["']\/research\/cgt\/figures\/main\/CGT_FIGURE_003_signed_axes_revised\.svg["'])(?=[^>]*target=["']_blank["'])(?=[^>]*rel=["']noreferrer["'])(?=[^>]*aria-label=["']Open Figure 3 as a full-resolution SVG in a new tab["'])[^>]*>/i,
  );
  assert.ok(openOriginalMatch, "Figure 3 should expose a named keyboard- and touch-native open-original link");
  assert.match(figureThreeHtml, /<details\b[^>]*id=["']fig-3-details["']/i);
  assert.match(figureThreeHtml, /id=["']fig-3-accessible-description["']/i);
  assert.match(figureThreeHtml, /Panel a (?:—|&mdash;) Operational definition and audit workflow/i);
  assert.match(figureThreeHtml, /Panel f (?:—|&mdash;) Why the candidates are not general biological axes/i);

  for (const approvedCopy of [
    /201,771 corrected view(?:–|&ndash;)term tests per method/,
    /cell shade is normalized within each column only/,
    /ORA and rank reuse the same coordinates and overlapping gene-set memberships/,
    /study-conditioned pathway coherence in manually curated, pipeline-dependent summaries/,
    /does not identify validated biological programs, universal axes, mechanisms, or causal constraint laws/,
  ]) assert.match(figureThreeHtml, approvedCopy);

  assert.ok((figureThreeHtml.match(/<math\b/g) ?? []).length >= 29, "Figure 3 inline expressions should include semantic MathML");
  for (const expression of [
    String.raw`A_{if}=\frac{\sum_{m\in f}\lvert U_{im}S_m\rvert}{\sum_g\sum_{m\in g}\lvert U_{im}S_m\rvert}`,
    String.raw`R_{if}=A_{if}-\operatorname{mean}_{c(i)}(A_f)`,
    String.raw`A_{if}\geq 0`, String.raw`q\leq 0.05`, String.raw`-\log_{10}(q)`,
    String.raw`\mathtt{essentiality\_strength}=-\operatorname{mean}(\text{DepMap GeneEffect})`,
    String.raw`0.19354839\times\mathrm{F3}`, String.raw`-\mathrm{F5}`,
    String.raw`q=1.98\times10^{-55}`, String.raw`q=3.52\times10^{-15}`,
  ]) assert.ok(figureThreeHtml.includes(`<annotation encoding="application/x-tex">${expression}</annotation>`), expression);
  assert.ok((figureThreeHtml.match(/<code>NR<\/code>/g) ?? []).length >= 1);
  assert.match(figureThreeHtml, /perturbation <em>i<\/em> and family <em>f<\/em>/);
  assert.doesNotMatch(
    figureThreeHtml.replace(/<annotation[\s\S]*?<\/annotation>/g, ""),
    /\\[()]|\\(?:frac|sum|lvert|rvert|times|leq|operatorname|mathtt|text)/,
  );

  const downloadsMatch = figureThreeHtml.match(
    /<nav\b[^>]*aria-label=["']Figure 3 downloads["'][^>]*>[\s\S]*?<\/nav>/i,
  );
  assert.ok(downloadsMatch, "Figure 3 should render a labelled download group");
  const downloadsHtml = downloadsMatch[0];
  assert.equal((downloadsHtml.match(/<a\b/gi) ?? []).length, 6);
  for (const [filename, linkText] of [
    ["CGT_FIGURE_003_signed_axes_revised_web.png", "Download Figure 3 web PNG (2,400 × 2,675)"],
    ["CGT_FIGURE_003_signed_axes_revised_600dpi.png", "Download Figure 3 600-dpi PNG (4,323 × 4,819)"],
    ["CGT_FIGURE_003_signed_axes_revised.pdf", "Download Figure 3 publication PDF"],
    ["CGT_FIGURE_003_signed_axes_revised.svg", "Download Figure 3 vector SVG"],
    ["CGT_FIGURE_003_signed_axes_revised_v1.zip", "Download Figure 3 complete audited release (ZIP)"],
    ["CGT_FIGURE_003_signed_axes_revised_audit.json", "Download Figure 3 machine-readable audit (JSON)"],
  ]) {
    assert.ok(downloadsHtml.includes(`href="/research/cgt/figures/main/${filename}"`));
    assert.ok(downloadsHtml.includes(`download="${filename}"`));
    assert.ok(downloadsHtml.includes(`>${linkText}</a>`));
  }
  assert.doesNotMatch(figureThreeHtml, /\/research\/cgt\/figures\/main\/figure-03-signed-axes\.(?:png|pdf|svg)/);
  assert.ok(
    figureThreeHtml.includes(figureThreeCopy.responsive_presentation_requirement),
    "Figure 3 should render the approved narrow-screen readability boundary",
  );

  assert.match(html, /Context-residualized family-mass queries yielded 3 headline and 6[\s\S]*?study-conditioned rather than evidence of general biological axes/);
  assert.match(html, /Explicit sign filtering removed the invalid F1, F3, and F15 upper views from 56[\s\S]*?leaving 53 corrected valid views/);
  assert.match(html, /all 201,771 corrected view(?:–|&ndash;)term tests per method/);
  assert.match(html, /Study-proxy concentration and a closed, rank-deficient family coding[\s\S]*?causal constraint laws/);
  assert.match(html, /Candidate functional annotation and curation/);
  assert.doesNotMatch(html, /Signed directions support candidate biological interpretations/);
  assert.doesNotMatch(html, /Positive and negative coordinate tails defined direction-specific gene sets/);
  assert.doesNotMatch(html, /compatible CORUM-like resources when available/);
  assert.doesNotMatch(html, /makes these directions plausible candidate axes/);

  const publicationCss = await readFile(
    path.join(projectRoot, "app", "research", "cgt", "publication.module.css"),
    "utf8",
  );
  assert.match(publicationCss, /\.page\s*\{[^}]*overflow-x:\s*clip;/s);
  assert.match(publicationCss, /\.figureImage\s*\{[^}]*width:\s*100%;[^}]*height:\s*auto;/s);
  assert.match(publicationCss, /\.figureImageLink:focus-visible,[\s\S]*?outline:\s*3px solid #087c6b;/);
  assert.match(publicationCss, /\.figureDownloads\s*\{[^}]*display:\s*flex;[^}]*flex-wrap:\s*wrap;/s);
  assert.match(publicationCss, /@media \(max-width:\s*620px\)[\s\S]*?\.figureDownloads\s*\{[^}]*display:\s*grid;/s);
});

test("renders the audited Figure 4 release with exact copy, five direct downloads, semantic math, and ordered responsive panels", async () => {
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
  const figureMatch = html.match(/<figure\b[^>]*id=["']fig-4["'][\s\S]*?<\/figure>/i);
  assert.ok(figureMatch, "Figure 4 should render as a complete figure block");
  const figureHtml = figureMatch[0];
  const copy = JSON.parse(await readFile(
    path.join(projectRoot, "app", "research", "cgt", "figure-04-copy.json"),
    "utf8",
  ));

  assert.ok(figureHtml.includes(`<h3>${copy.title}</h3>`));
  assert.match(figureHtml, /data-responsive-research-figure=["']true["']/i);
  assert.match(
    figureHtml,
    /<source\b[^>]*srcset=["']\/research\/cgt\/figures\/main\/CGT_FIGURE_004_dependency_aware_synthesis_revised\.svg["'][^>]*type=["']image\/svg\+xml["']/i,
  );
  const fallbackImage = figureHtml.match(
    /<img\b[^>]*src=["']\/research\/cgt\/figures\/main\/CGT_FIGURE_004_dependency_aware_synthesis_revised_web\.png["'][^>]*>/i,
  );
  assert.ok(fallbackImage, "Figure 4 should use the canonical web PNG as the SVG fallback");
  assert.match(fallbackImage[0], /width=["']2400["']/i);
  assert.match(fallbackImage[0], /height=["']2675["']/i);
  assert.ok(fallbackImage[0].includes(`alt="${copy.alt}"`));
  assert.match(fallbackImage[0], /aria-describedby=["']fig-4-accessible-description["']/i);
  assert.match(fallbackImage[0], /aria-details=["']fig-4-details["']/i);
  assert.doesNotMatch(figureHtml, /\/_vinext\/image|\/_next\/image/);

  const panelIds = [...figureHtml.matchAll(/data-responsive-research-panel=["']([a-e])["']/gi)].map((match) => match[1]);
  assert.deepEqual(panelIds, ["a", "b", "c", "d", "e"]);
  for (const [letter, width, height] of [
    ["a", 1600, 420],
    ["b", 1600, 593],
    ["c", 1200, 999],
    ["d", 1600, 758],
    ["e", 1600, 300],
  ]) {
    assert.match(
      figureHtml,
      new RegExp(`<img\\b[^>]*CGT_FIGURE_004_dependency_aware_synthesis_revised_mobile_panel_${letter}\\.png[^>]*width=["']${width}["'][^>]*height=["']${height}["'][^>]*alt=["']["'][^>]*>`, "i"),
    );
  }
  assert.equal((figureHtml.match(/style=["']--research-panel-min-width:800px["']/g) ?? []).length, 4);
  assert.equal((figureHtml.match(/<div\b[^>]*role=["']region["'][^>]*tabindex=["']0["'][^>]*>/gi) ?? []).length, 4);
  assert.equal((figureHtml.match(/>Swipe or scroll horizontally<\/p>/g) ?? []).length, 4);
  assert.match(figureHtml, /Open full-resolution composite/);
  assert.equal((figureHtml.match(/Open panel at full resolution/g) ?? []).length, 5);

  const downloadsMatch = figureHtml.match(
    /<nav\b[^>]*aria-label=["']Figure 4 downloads["'][^>]*>[\s\S]*?<\/nav>/i,
  );
  assert.ok(downloadsMatch, "Figure 4 should render a labelled download group");
  const downloadsHtml = downloadsMatch[0];
  assert.equal((downloadsHtml.match(/<a\b/gi) ?? []).length, 5);
  for (const [filename, linkText] of [
    ["CGT_FIGURE_004_dependency_aware_synthesis_revised_web.png", "Download Figure 4 web PNG (2,400 × 2,675)"],
    ["CGT_FIGURE_004_dependency_aware_synthesis_revised_600dpi.png", "Download Figure 4 600-dpi PNG (4,322 × 4,818)"],
    ["CGT_FIGURE_004_dependency_aware_synthesis_revised.pdf", "Download Figure 4 publication PDF"],
    ["CGT_FIGURE_004_dependency_aware_synthesis_revised.svg", "Download Figure 4 vector SVG"],
    ["CGT_FIGURE_004_dependency_aware_synthesis_revised_v1.zip", "Download Figure 4 complete reproducibility package v1 (ZIP)"],
  ]) {
    assert.ok(downloadsHtml.includes(`href="/research/cgt/figures/main/${filename}"`));
    assert.ok(downloadsHtml.includes(`download="${filename}"`));
    assert.ok(downloadsHtml.includes(`>${linkText}</a>`));
  }

  assert.match(figureHtml, /CGT_FIGURE_004_dependency_aware_synthesis_revised_v1/);
  assert.match(figureHtml, /SHA-256 (?:<!-- -->)?8b6d475fb04f350707c8c635de40ea3ff9a5dfda66a2edf96b7c2337dbc35128/);
  assert.match(figureHtml, /CGT_FIGURE_004_release_manifest\.json/);
  assert.match(figureHtml, /SHA-256 (?:<!-- -->)?ebc8b2e662e3b60253e32fee3cd3db6336c57e76a74bac888af787518e97ced5/);
  assert.match(figureHtml, /Panel a is a four-column register with five rows/);
  assert.match(figureHtml, /Panel e is a four-card schematic/);
  for (const approvedCopy of [
    /it is not an independent replication, validation experiment, or new fitted model/,
    /Cell shade is normalized separately within each column and does not define a combined evidence score/,
    /Groups 4 and 6 are both F10-linked summaries and have exactly the same plotted values/,
    /Residual baselines were estimated from the full PREDICT-003B table before splitting/,
    /A <code>STOP<\/code> barrier separates shared-endpoint prediction from a causal-law claim/,
    /does not establish independent biological replication, context-general transport, universal axes, mechanism, or a causal constraint law/,
  ]) assert.match(figureHtml, approvedCopy);

  assert.ok((figureHtml.match(/<math\b/g) ?? []).length >= 20, "Figure 4 math should include semantic MathML");
  for (const expression of [
    String.raw`\bar{\rho}=0.622315`,
    String.raw`R_f`,
    String.raw`-\log_{10}(q)`,
    String.raw`|\beta|`,
    String.raw`|\rho|`,
    String.raw`R_f=2.92019`,
    String.raw`n=5`,
    String.raw`n=7`,
    String.raw`n=4`,
  ]) assert.ok(figureHtml.includes(`<annotation encoding="application/x-tex">${expression}</annotation>`), expression);
  for (const codeValue of ["H", "S", "NR", "4/6", "STOP"]) {
    assert.match(figureHtml, new RegExp(`<code>${codeValue.replace("/", "\\/")}<\\/code>`));
  }
  assert.match(figureHtml, /0\.56320 \[0\.36897, 0\.79476; 34 held-out datasets, 1,092 finite rows\]/);
  assert.match(figureHtml, /0\.03500 \[−0\.03730, 0\.09316; 22 held-out datasets, 507 finite rows\]/);
  assert.match(figureHtml, /0\.07937 \[0\.04801, 0\.12778; 7 held-out contexts, 496 finite rows\]/);
  assert.doesNotMatch(
    figureHtml.replace(/<annotation[\s\S]*?<\/annotation>/g, ""),
    /\\[()]|\\(?:bar|rho|beta|log)/,
  );
  assert.doesNotMatch(figureHtml, /\bAUC\b|composite fitness-relevance score|one half normalized absolute ridge coefficient/);
  assert.doesNotMatch(figureHtml, /figure-04-evidence-atlas\.(?:png|pdf|svg)/);

  assert.equal(createHash("sha256").update(copy.caption_markdown_lines.join("\n")).digest("hex"), "2701ff2ffccbc5a1af0f3c96439193558e24eeffe8e08bc786b953192e5ae45c");
  assert.equal(createHash("sha256").update(copy.alt).digest("hex"), "88e39460d52d3e3b37b23cd3c08778932bde8633018e0eb61020b1acec372ad2");
  assert.equal(createHash("sha256").update(copy.accessible_description_markdown_lines.join("\n")).digest("hex"), "75f417d390193e73c3dc1566e947bfa61bd587b74410d5933598f1d69b0e4cb4");

  const responsiveSource = await readFile(path.join(projectRoot, "app", "research", "responsive-research-figure.tsx"), "utf8");
  const responsiveCss = await readFile(path.join(projectRoot, "app", "research", "responsive-research-figure.module.css"), "utf8");
  assert.match(responsiveSource, /export type ResponsiveResearchFigurePanel/);
  assert.doesNotMatch(responsiveSource, /CGT_FIGURE|fig-4|Figure 4/);
  assert.match(responsiveSource, /onKeyDown=\{scrollable \? scrollPanelWithKeyboard : undefined\}/);
  assert.match(responsiveSource, /aria-keyshortcuts=\{scrollable \? "ArrowLeft ArrowRight" : undefined\}/);
  assert.match(responsiveSource, /behavior: "auto"/);
  assert.match(responsiveCss, /@media \(max-width: 1080px\)[\s\S]*?\.compositeLink\s*\{[^}]*display: none;[\s\S]*?\.panelSequence\s*\{[^}]*display: block;/s);
  assert.match(responsiveCss, /\.panelScroller\s*\{[^}]*overflow-x: auto;[^}]*touch-action: pan-x pan-y;/s);
  assert.match(responsiveCss, /\.panelScroller img\s*\{[^}]*min-width: var\(--research-panel-min-width\);/s);
  assert.match(responsiveCss, /prefers-reduced-motion: reduce/);
  assert.match(responsiveCss, /forced-colors: active/);
  assert.doesNotMatch(responsiveCss, /transform:/);
});

test("renders the audited Figure 5 release with exact copy, twelve direct downloads, semantic math, and ordered responsive panels", async () => {
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
  const figureMatch = html.match(/<figure\b[^>]*id=["']fig-5["'][\s\S]*?<\/figure>/i);
  assert.ok(figureMatch, "Figure 5 should render as a complete figure block");
  const figureHtml = figureMatch[0];
  const copy = JSON.parse(await readFile(
    path.join(projectRoot, "app", "research", "cgt", "figure-05-copy.json"),
    "utf8",
  ));

  assert.ok(figureHtml.includes(`<h3>${copy.title}</h3>`));
  assert.match(figureHtml, /data-responsive-research-figure=["']true["']/i);
  assert.match(
    figureHtml,
    /<source\b[^>]*srcset=["']\/research\/cgt\/figures\/main\/CGT_FIGURE_005_tcga_cancer_type_structure_revised\.svg["'][^>]*type=["']image\/svg\+xml["']/i,
  );
  const fallbackImage = figureHtml.match(
    /<img\b[^>]*src=["']\/research\/cgt\/figures\/main\/CGT_FIGURE_005_tcga_cancer_type_structure_revised_web\.png["'][^>]*>/i,
  );
  assert.ok(fallbackImage, "Figure 5 should use the checksum-pinned web PNG as the SVG fallback");
  assert.match(fallbackImage[0], /width=["']2400["']/i);
  assert.match(fallbackImage[0], /height=["']3121["']/i);
  assert.ok(fallbackImage[0].includes(`alt="${copy.alt}"`));
  assert.match(fallbackImage[0], /aria-describedby=["']fig-5-accessible-description["']/i);
  assert.match(fallbackImage[0], /aria-details=["']fig-5-details["']/i);
  assert.doesNotMatch(figureHtml, /\/_vinext\/image|\/_next\/image/);

  const panelIds = [...figureHtml.matchAll(/data-responsive-research-panel=["']([a-f])["']/gi)].map((match) => match[1]);
  assert.deepEqual(panelIds, ["a", "b", "c", "d", "e", "f"]);
  for (const [letter, width, height] of [
    ["a", 1200, 735],
    ["b", 1800, 557],
    ["c", 1800, 585],
    ["d", 2000, 893],
    ["e", 1400, 904],
    ["f", 1400, 865],
  ]) {
    assert.match(
      figureHtml,
      new RegExp(`<img\\b[^>]*CGT_FIGURE_005_tcga_cancer_type_structure_revised_mobile_panel_${letter}\\.png[^>]*width=["']${width}["'][^>]*height=["']${height}["'][^>]*alt=["']["'][^>]*>`, "i"),
    );
  }
  for (const [minimum, count] of [[620, 1], [640, 1], [680, 2], [820, 1]]) {
    assert.equal(
      (figureHtml.match(new RegExp(`style=["']--research-panel-min-width:${minimum}px["']`, "g")) ?? []).length,
      count,
    );
  }
  assert.equal((figureHtml.match(/aria-keyshortcuts=["']ArrowLeft ArrowRight["']/gi) ?? []).length, 5);
  assert.equal((figureHtml.match(/>Swipe or scroll horizontally<\/p>/g) ?? []).length, 5);
  assert.match(figureHtml, /Open full-resolution composite/);
  assert.equal((figureHtml.match(/Open panel at full resolution/g) ?? []).length, 6);

  const downloadsMatch = figureHtml.match(
    /<nav\b[^>]*aria-label=["']Figure 5 downloads["'][^>]*>[\s\S]*?<\/nav>/i,
  );
  assert.ok(downloadsMatch, "Figure 5 should render a labelled download group");
  const downloadsHtml = downloadsMatch[0];
  const expectedDownloads = [
    ["CGT_FIGURE_005_tcga_cancer_type_structure_revised_web.png", "Download Figure 5 web PNG (2,400 × 3,121)"],
    ["CGT_FIGURE_005_tcga_cancer_type_structure_revised_600dpi.png", "Download Figure 5 600-dpi PNG (4,322 × 5,622)"],
    ["CGT_FIGURE_005_tcga_cancer_type_structure_revised.pdf", "Download Figure 5 publication PDF"],
    ["CGT_FIGURE_005_tcga_cancer_type_structure_revised.svg", "Download Figure 5 vector SVG"],
    ["CGT_FIGURE_005_tcga_cancer_type_structure_revised_mobile_panel_a.png", "Download Figure 5 responsive panel a (1,200 × 735)"],
    ["CGT_FIGURE_005_tcga_cancer_type_structure_revised_mobile_panel_b.png", "Download Figure 5 responsive panel b (1,800 × 557)"],
    ["CGT_FIGURE_005_tcga_cancer_type_structure_revised_mobile_panel_c.png", "Download Figure 5 responsive panel c (1,800 × 585)"],
    ["CGT_FIGURE_005_tcga_cancer_type_structure_revised_mobile_panel_d.png", "Download Figure 5 responsive panel d (2,000 × 893)"],
    ["CGT_FIGURE_005_tcga_cancer_type_structure_revised_mobile_panel_e.png", "Download Figure 5 responsive panel e (1,400 × 904)"],
    ["CGT_FIGURE_005_tcga_cancer_type_structure_revised_mobile_panel_f.png", "Download Figure 5 responsive panel f (1,400 × 865)"],
    ["CGT_FIGURE_005_revised_reproducibility_package_v1.zip", "Download Figure 5 complete reproducibility package v1 (ZIP)"],
    ["CGT_FIGURE_005_tcga_cancer_type_structure_revised_audit.json", "Download Figure 5 machine-readable audit (JSON)"],
  ];
  assert.equal((downloadsHtml.match(/<a\b/gi) ?? []).length, expectedDownloads.length);
  for (const [filename, linkText] of expectedDownloads) {
    assert.ok(downloadsHtml.includes(`href="/research/cgt/figures/main/${filename}"`));
    assert.ok(downloadsHtml.includes(`download="${filename}"`));
    assert.ok(downloadsHtml.includes(`>${linkText}</a>`));
  }

  assert.match(figureHtml, /CGT_FIGURE_005_REVISED_V1/);
  assert.match(figureHtml, /SHA-256 (?:<!-- -->)?72e049f26049311ab0cb94ca6430dfbfee781d3fb20d271f3e043da941498d12/);
  assert.match(figureHtml, /release_manifest\.json/);
  assert.match(figureHtml, /SHA-256 (?:<!-- -->)?49fa61da60eb6be13465904fbbd7f0b3425d61295704f584087d01f3ca1db91c/);
  assert.match(figureHtml, /id=["']fig-5-accessible-description["']/i);
  assert.match(figureHtml, /Panel a reports that 57 of 9,359 input samples failed an expression threshold/);
  assert.match(figureHtml, /all 33 cancer-type centroids are labelled in collision-free side gutters/);
  for (const approvedCopy of [
    /dataset separation, not statistical independence, orthogonality, external validation, or causal identifiability/,
    /expected properties of the transformations, not evidence of biological independence, successful deconfounding, or out-of-sample validation/,
    /Samples, rather than cancer types, were equally weighted when fitting PCA/,
    /Color therefore indicates only relative prominence within one row/,
    /they do not identify a cancer-type effect or a lineage mechanism/,
    /Residualization therefore does not make the candidate scores orthogonal or independent/,
    /does not establish CGT specificity, tumor-cell-intrinsic programs, transportability, mechanisms, or universal constraints/,
  ]) assert.match(figureHtml, approvedCopy);

  assert.equal((figureHtml.match(/class=["'][^"']*katex-display/g) ?? []).length, 1);
  assert.match(figureHtml, /<math\b[^>]*display=["']block["']/);
  assert.ok((figureHtml.match(/<math\b/g) ?? []).length >= 2, "Figure 5 display and inline expressions should include semantic MathML");
  assert.ok(figureHtml.includes(`<annotation encoding="application/x-tex">${String.raw`\eta^2_{\mathrm{in},j}=
\frac{\sum_c n_c\left(\bar{s}_{cj}-\bar{s}_j\right)^2}
{\sum_i\left(s_{ij}-\bar{s}_j\right)^2}.`}</annotation>`));
  assert.ok(figureHtml.includes(`<annotation encoding="application/x-tex">${String.raw`\eta^2_{\mathrm{in}}`}</annotation>`));
  assert.doesNotMatch(
    figureHtml.replace(/<annotation[\s\S]*?<\/annotation>/g, ""),
    /\\[()[\]]|\\(?:eta|frac|sum|left|right|bar|mathrm)/,
  );
  assert.doesNotMatch(figureHtml, /figure-05-tcga-projection\.(?:png|pdf|svg)/);

  assert.equal(createHash("sha256").update(copy.caption_markdown_lines.join("\n")).digest("hex"), "6dfa735f54513f61511f706a1f76cc72943ba889df7869dfb6befad9350b2124");
  assert.equal(createHash("sha256").update(copy.alt).digest("hex"), "dbb5f5753c69dfb2f52ff4aa3954b38789db63de76033301ab276616b421caf2");
  assert.equal(createHash("sha256").update(copy.accessible_description_markdown_lines.join("\n")).digest("hex"), "bfbbffc6b06764f4a3a4edc1178e66c8b1380ff1468ec83f260e89faf4393706");
  assert.ok(figureHtml.includes(copy.responsive_presentation_requirement));

  assert.match(html, /9,359 tumor-derived bulk-expression samples entering expression QC/);
  assert.match(html, /pooled leave-one-axis-out residualization/);
  assert.match(html, /not leave-one-sample-out validation/);
  assert.match(html, /Residual correlations remain as\s+high as 0\.871/);
  assert.match(html, /does not document the upstream formula mapping TCGA expression/);
  assert.doesNotMatch(html, /tumor-state projection|TCGA projection|orthogonal projection|independently defined axes|lineage manifestation|leave-one-axis-out global residualization|cancer-type R²/i);
});

test("ships every canonical CGT figure and the audited Figure 1–5 releases", async () => {
  const stems = [
    ["main", "figure-01-fitness"],
    ["main", "figure-02-recurrent-geometry"],
    ["main", "figure-03-signed-axes"],
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
  assert.equal(manifest.report.active_physical_asset_count, 58);
  assert.equal(manifest.report.compatibility_alias_count, 12);
  assert.equal(manifest.report.physical_asset_count, 70);
  assert.ok(manifest.figures.slice(5).every((figure) =>
    ["png", "pdf", "svg"].every((format) => figure.assets[format]?.sha256),
  ));

  const figureOne = manifest.figures[0];
  const releaseAssets = {
    png_web: [
      "CGT_FIGURE_001_residual_geometry_predicts_fitness_revised_web.png",
      554317,
      "6e4a410c90763ded6aac2eb7d95e14296c511dbbdf8b9b0d494634b583721808",
      "image/png",
    ],
    png_600dpi: [
      "CGT_FIGURE_001_residual_geometry_predicts_fitness_revised_600dpi.png",
      1095745,
      "990bce7ba1bb698295367fc374e2f392c6c55cc0517ef59abf0cff4304dd7dca",
      "image/png",
    ],
    pdf: [
      "CGT_FIGURE_001_residual_geometry_predicts_fitness_revised.pdf",
      63527,
      "e850d1b4cc26209f1f365017dad32f24640c5726e75b251e80529939d5dfa1d9",
      "application/pdf",
    ],
    svg: [
      "CGT_FIGURE_001_residual_geometry_predicts_fitness_revised.svg",
      349381,
      "9a5c12ce5a611eb2e51a9b2a2dc2eaeaa0f8a05eaa1094144ee3219009c4f773",
      "image/svg+xml",
    ],
    reproducibility_zip: [
      "CGT_FIGURE_001_revised_reproducibility_package_v2.zip",
      1837975,
      "edfa3a5f55666428142695a373d81c68aa8ff6e34f3775727b785a58b7e803bc",
      "application/zip",
    ],
    audit_json: [
      "CGT_FIGURE_001_residual_geometry_predicts_fitness_revised_audit.json",
      18645,
      "f0e4a977b845adfe07cf41f1473b2bac7ec6a0d1d7a20f0f7f882b3caddb8ab1",
      "application/json",
    ],
  };

  assert.equal(figureOne.revision_scope, "presentation and scientific-label corrections; frozen numerical inputs");
  for (const [key, [filename, bytes, digest, mimeType]] of Object.entries(releaseAssets)) {
    const asset = figureOne.assets[key];
    const assetPath = path.join(projectRoot, asset.repository_path);
    assert.equal(asset.filename, filename);
    assert.equal(asset.bytes, bytes);
    assert.equal(asset.sha256, digest);
    assert.equal(asset.mime_type, mimeType);
    assert.equal(await sha256(assetPath), digest);
  }

  for (const [key, asset] of Object.entries(figureOne.compatibility_aliases)) {
    const source = figureOne.assets[asset.mirrors_asset];
    const aliasPath = path.join(projectRoot, asset.repository_path);
    assert.equal(asset.active_page_reference, false);
    assert.equal(asset.sha256, source.sha256, `${key} compatibility alias should contain corrected bytes`);
    assert.equal(await sha256(aliasPath), source.sha256);
  }

  const figureTwo = manifest.figures[1];
  const figureTwoTitle = "Residual family-coordinate structure recurs within the leave-dataset-out benchmark but attenuates under study-proxy and context exclusion";
  const figureTwoAssets = {
    png_web: [
      "CGT_FIGURE_002_recurrent_geometry_revised_web.png",
      994659,
      "43704a92196e9681c0cd8c8c666e56c7e69461e530a1a84bbdd4d662cac9e5e6",
      "image/png",
    ],
    png_600dpi: [
      "CGT_FIGURE_002_recurrent_geometry_revised_600dpi.png",
      1051585,
      "a530b276be8dd3d51a025c9a90e93f3226960102e5b30d29759123f4ae1f14bd",
      "image/png",
    ],
    pdf: [
      "CGT_FIGURE_002_recurrent_geometry_revised.pdf",
      41435,
      "5a1d008c95ad3c214193a5aeefa6dcf053336d8f4f7a1ef74354b93f4e6e753d",
      "application/pdf",
    ],
    svg: [
      "CGT_FIGURE_002_recurrent_geometry_revised.svg",
      265227,
      "7c418610b2beef4f112b266b1765b5007ef2ff9e1dd03ba4f17b8bcea78b3721",
      "image/svg+xml",
    ],
    reproducibility_zip: [
      "CGT_FIGURE_002_recurrent_geometry_revised_v1.zip",
      18958999,
      "3c187c5dd4369e9cd0c4b4c91386ed37b675b446de7dde637a5f8d85642cc947",
      "application/zip",
    ],
    audit_json: [
      "CGT_FIGURE_002_recurrent_geometry_revised_audit.json",
      19215,
      "6631f78a4a447b57c630ebe535e8afbdd463892f88feb7e58b701cc263ec4a58",
      "application/json",
    ],
  };

  assert.equal(figureTwo.title, figureTwoTitle);
  assert.equal(figureTwo.dimensions.png_web.width_px, 2400);
  assert.equal(figureTwo.dimensions.png_web.height_px, 2500);
  assert.equal(figureTwo.dimensions.png_600dpi.width_px, 4320);
  assert.equal(figureTwo.dimensions.png_600dpi.height_px, 4500);
  assert.equal(figureTwo.dimensions.png_600dpi.nominal_dpi, 600);
  assert.deepEqual(figureTwo.dimensions.svg.view_box, [0, 0, 518.4, 540]);
  assert.match(figureTwo.release_status, /all mandatory automated and rendered visual QA passed/);
  assert.match(figureTwo.revision_scope, /No original or upstream scientific input was modified/);
  for (const [key, [filename, bytes, digest, mimeType]] of Object.entries(figureTwoAssets)) {
    const asset = figureTwo.assets[key];
    const assetPath = path.join(projectRoot, asset.repository_path);
    assert.equal(asset.filename, filename);
    assert.equal(asset.bytes, bytes);
    assert.equal(asset.sha256, digest);
    assert.equal(asset.mime_type, mimeType);
    assert.equal(await sha256(assetPath), digest);
  }

  for (const [key, asset] of Object.entries(figureTwo.compatibility_aliases)) {
    const source = figureTwo.assets[asset.mirrors_asset];
    const aliasPath = path.join(projectRoot, asset.repository_path);
    assert.equal(asset.active_page_reference, false);
    assert.equal(asset.sha256, source.sha256, `${key} Figure 2 compatibility alias should contain corrected bytes`);
    assert.equal(await sha256(aliasPath), source.sha256);
  }

  const figureTwoCopy = JSON.parse(await readFile(
    path.join(projectRoot, "app", "research", "cgt", "figure-02-copy.json"),
    "utf8",
  ));
  assert.equal(
    createHash("sha256").update(figureTwoCopy.caption_markdown_lines.join("\n")).digest("hex"),
    "eb29bcbec3c30174ba7e3fbaff025b2391620c819662d9c88f40c17963eb0ff1",
  );
  assert.equal(
    createHash("sha256").update(figureTwoCopy.accessible_description_markdown_lines.join("\n")).digest("hex"),
    "a8c4d4dad575411a2edf2944627a0f5bdaabba1fb805f3bbc19cbc1026dd723f",
  );

  const figureThree = manifest.figures[2];
  const figureThreeTitle = "Study-conditioned candidate annotations of context-residualized family-mass directions";
  const figureThreeAssets = {
    png_web: [
      "CGT_FIGURE_003_signed_axes_revised_web.png",
      1770635,
      "f7bee8ebf1bcb491c239fd3cf63908521327c6055af24d50e383acdd139d8ad3",
      "image/png",
    ],
    png_600dpi: [
      "CGT_FIGURE_003_signed_axes_revised_600dpi.png",
      1871881,
      "30095053cb861bd7be782001fdd7e0fb5f3a988dd3a1d9c204e689b5e0e96398",
      "image/png",
    ],
    pdf: [
      "CGT_FIGURE_003_signed_axes_revised.pdf",
      1600555,
      "3dab4de28f38762de434eecb6b2a9bf9cde3cd469548231e189abb2627973383",
      "application/pdf",
    ],
    svg: [
      "CGT_FIGURE_003_signed_axes_revised.svg",
      357204,
      "40634f9fe70e9c002a13a1cc6318d84c96ad602a27f2faa027531b5cea3787a3",
      "image/svg+xml",
    ],
    reproducibility_zip: [
      "CGT_FIGURE_003_signed_axes_revised_v1.zip",
      72565683,
      "c54503486663c217ddd6348ccef22642255c04112ff936ab615c9e104449987d",
      "application/zip",
    ],
    audit_json: [
      "CGT_FIGURE_003_signed_axes_revised_audit.json",
      104289,
      "c8ff32a557e9a817d3e71019fd29e5b5001c869c2924ec7f95bfe03f496e6359",
      "application/json",
    ],
  };

  assert.equal(figureThree.id, "figure-03");
  assert.equal(figureThree.title, figureThreeTitle);
  assert.deepEqual(manifest.schema.figure_03_release_asset_formats, Object.keys(figureThreeAssets));
  assert.equal(figureThree.dimensions.png_web.width_px, 2400);
  assert.equal(figureThree.dimensions.png_web.height_px, 2675);
  assert.deepEqual(figureThree.dimensions.png_web.embedded_dpi, [96.012, 96.012]);
  assert.equal(figureThree.dimensions.png_web.icc_profile_sha256, "2a92d4bae450b76d8b0aa42193df974d75f62738ecebf74f01c5e75b12a95796");
  assert.equal(figureThree.dimensions.png_600dpi.width_px, 4323);
  assert.equal(figureThree.dimensions.png_600dpi.height_px, 4819);
  assert.deepEqual(figureThree.dimensions.png_600dpi.embedded_dpi, [599.9988, 599.9988]);
  assert.equal(figureThree.dimensions.png_600dpi.icc_profile_sha256, "2a92d4bae450b76d8b0aa42193df974d75f62738ecebf74f01c5e75b12a95796");
  assert.deepEqual(
    [figureThree.dimensions.pdf.width_pt, figureThree.dimensions.pdf.height_pt],
    [518.740157, 578.267717],
  );
  assert.equal(figureThree.dimensions.pdf.pages, 1);
  assert.equal(figureThree.dimensions.pdf.font_subtype, "TrueType");
  assert.equal(figureThree.dimensions.pdf.embedded_font, true);
  assert.equal(figureThree.dimensions.pdf.type_3_font_count, 0);
  assert.deepEqual(figureThree.dimensions.svg.view_box, [0, 0, 518.740157, 578.267717]);
  assert.equal(figureThree.dimensions.svg.text_mode, "paths");
  assert.equal(figureThree.dimensions.svg.external_dependency_count, 0);
  assert.equal(figureThree.dimensions.svg.raster_image_count, 0);
  assert.match(figureThree.release_status, /hash-anchored human-review gates passed/);
  assert.match(figureThree.revision_scope, /Frozen upstream scientific inputs were not modified/);
  assert.equal(figureThree.qa.status, "pass");
  assert.equal(figureThree.qa.local_release_asset_count, 6);
  assert.equal(figureThree.qa.local_byte_size_matches, 6);
  assert.equal(figureThree.qa.local_sha256_matches, 6);
  assert.equal(figureThree.qa.legacy_aliases_contain_approved_bytes, true);
  assert.match(figureThree.qa.responsive_note, /fine text is zoom-dependent and is not comfortably readable/);
  assert.match(figureThree.qa.open_original_route, /keyboard- and touch-activated link to the checksum-pinned canonical SVG/);
  assert.match(figureThree.caveats.at(-1), /manually curated, associative, pipeline-dependent summaries/);

  for (const [key, [filename, bytes, digest, mimeType]] of Object.entries(figureThreeAssets)) {
    const asset = figureThree.assets[key];
    const repositoryPath = `public/research/cgt/figures/main/${filename}`;
    const assetPath = path.join(projectRoot, repositoryPath);
    assert.equal(asset.filename, filename);
    assert.equal(asset.local_path, `/research/cgt/figures/main/${filename}`);
    assert.equal(asset.repository_path, repositoryPath);
    assert.equal(asset.bytes, bytes);
    assert.equal(asset.sha256, digest);
    assert.equal(asset.mime_type, mimeType);
    assert.equal((await stat(assetPath)).size, bytes);
    assert.equal(await sha256(assetPath), digest);
  }

  assert.deepEqual(
    Object.fromEntries(Object.entries(figureThree.compatibility_aliases).map(([key, asset]) => [key, asset.mirrors_asset])),
    { png: "png_600dpi", pdf: "pdf", svg: "svg" },
  );
  for (const [key, asset] of Object.entries(figureThree.compatibility_aliases)) {
    const source = figureThree.assets[asset.mirrors_asset];
    const aliasPath = path.join(projectRoot, asset.repository_path);
    assert.equal(asset.active_page_reference, false);
    assert.equal(asset.bytes, source.bytes);
    assert.equal(asset.sha256, source.sha256, `${key} Figure 3 compatibility alias should contain approved bytes`);
    assert.equal((await stat(aliasPath)).size, source.bytes);
    assert.equal(await sha256(aliasPath), source.sha256);
  }

  assert.equal(figureThree.provenance.release_package.bytes, 72565683);
  assert.equal(figureThree.provenance.release_package.sha256, "c54503486663c217ddd6348ccef22642255c04112ff936ab615c9e104449987d");
  assert.equal(figureThree.provenance.release_package.archive_member_count, 576);
  assert.equal(figureThree.provenance.release_package.two_independent_builds_byte_identical, true);
  assert.equal(figureThree.provenance.release_manifest.listed_entries, 575);
  assert.equal(figureThree.provenance.release_manifest.self_excluding, true);
  assert.equal(figureThree.provenance.approved_copy.sha256, "4b149884b48171ab0aacf280f8fcdd532226d3142e656cc9b17d0dc781fc39d4");
  assert.equal(figureThree.provenance.final_audit.status, "pass");
  assert.equal(figureThree.provenance.final_audit.hash_anchored_human_review, "pass");

  const figureThreeCopy = JSON.parse(await readFile(
    path.join(projectRoot, "app", "research", "cgt", "figure-03-copy.json"),
    "utf8",
  ));
  assert.equal(figureThreeCopy.source_document_bytes, 17774);
  assert.equal(figureThreeCopy.source_document_sha256, "4b149884b48171ab0aacf280f8fcdd532226d3142e656cc9b17d0dc781fc39d4");
  assert.equal(figureThreeCopy.title, figureThreeTitle);
  assert.equal(
    createHash("sha256").update(figureThreeCopy.caption_markdown_lines.join("\n")).digest("hex"),
    "60b3911317ac2ea89c35b7fa07de3a27c0decb51c89cb7acb5289fec124471c6",
  );
  assert.equal(
    createHash("sha256").update(figureThreeCopy.alt).digest("hex"),
    "b89a100c1f6e81e9d8d3ee8c71e6aa773df0dd614f66caf8667e006819032e82",
  );
  assert.equal(
    createHash("sha256").update(figureThreeCopy.accessible_description_markdown_lines.join("\n")).digest("hex"),
    "81e421494f6b8e9ef21126c2c6efa98f14de4d46ceed61ce82c745f76aff3500",
  );
  assert.equal(
    createHash("sha256").update(figureThreeCopy.responsive_presentation_requirement).digest("hex"),
    "5ffa5dc8025d279becd74f8ec228772a2d2446d8f4080c42e01ad02b1bf6ee73",
  );

  const figureThreeAudit = JSON.parse(await readFile(
    path.join(projectRoot, figureThree.assets.audit_json.repository_path),
    "utf8",
  ));
  assert.equal(figureThreeAudit.status, "pass");
  assert.deepEqual(figureThreeAudit.gate_statuses, Array.from({ length: 11 }, () => "pass"));
  assert.equal(figureThreeAudit.human_visual_audit.status, "pass");
  assert.equal(figureThreeAudit.human_visual_audit.reviewed_hash_count, 11);
  assert.deepEqual(figureThreeAudit.human_visual_audit.failures, []);
  assert.equal(figureThreeAudit.determinism.status, "pass");
  assert.equal(figureThreeAudit.determinism.byte_identical_file_count, 392);

  await access(path.join(projectRoot, "public", "research", "cgt", "data", "cgt-cache-002-dataset-manifest.csv"));
});


test("publishes the résumé and categorized scholarly record", async () => {
  const worker = await loadWorker();
  const response = await worker.fetch(
    new Request("http://localhost/publications", { headers: { accept: "text/html" } }),
    env,
    ctx,
  );

  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /Peer-reviewed articles/i);
  assert.match(html, /Published conference abstracts/i);
  for (const doi of [
    "10.1016/j.cels.2026.101656",
    "10.1158/1538-7445.AM2020-3253",
    "10.1016/j.healun.2017.01.172",
    "10.1016/j.jmoldx.2016.07.003",
    "10.1016/j.healun.2016.01.205",
  ]) assert.match(html, new RegExp(doi.replaceAll(".", "\\."), "i"));
  assert.ok(html.indexOf("2020") < html.indexOf("2017"), "abstracts should be reverse chronological");
  assert.match(html, /<strong>Collins J(?:P)?<\/strong>/i);
  await access(path.join(projectRoot, "public", "John-Patrick-Collins_MSc_Senior Bioinformatics_Resume.pdf"));
});


test("redirects the www hostname without changing the path or query", async () => {
  const worker = await loadWorker();
  const response = await worker.fetch(
    new Request("https://www.johnpatrickcollins.info/research/cgt?source=test"),
    env,
    ctx,
  );
  assert.equal(response.status, 308);
  assert.equal(response.headers.get("location"), "https://johnpatrickcollins.info/research/cgt?source=test");
});

test("CGT opts into the reusable contextual Results navigation", async () => {
  const worker = await loadWorker();
  const response = await worker.fetch(
    new Request("http://localhost/research/cgt", { headers: { accept: "text/html" } }), env, ctx,
  );
  const html = await response.text();
  const items = [
    ["results-fitness-endpoint", "Gene-level coordinates predict an external CRISPR fitness endpoint"],
    ["results-recurrent-coordinates", "Residual response coordinates recur—primarily within related settings"],
    ["results-candidate-annotations", "Study-conditioned candidate annotations of context-residualized family-mass directions"],
    ["results-evidence-atlas", "Dependency-aware synthesis separates current evidence from broader claims"],
    ["results-tumor-cohorts", "Previously defined CGT-derived candidate score sets show descriptive cancer-type-associated variation in TCGA"],
  ];
  assert.match(html, /<nav[^>]+aria-label=["']Results sections["']/i);
  for (const [id, label] of items) {
    assert.match(html, new RegExp(`id=["']${id}["']`));
    assert.match(html, new RegExp(`href=["']#${id}["']`));
    assert.match(html, new RegExp(label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
  assert.match(html, /<dt>Analysis freeze<\/dt><dd>15 July 2026<\/dd>/);
  assert.match(html, /<dt>Web report<\/dt><dd>23 August 2026<\/dd>/);
  assert.match(html, /<dt>Version<\/dt><dd>0\.5\.0<\/dd>/);

  const source = await readFile(path.join(projectRoot, "app", "research", "results-navigation.ts"), "utf8");
  assert.match(source, /new Set\(ids\)\.size !== ids\.length/);
  assert.match(source, /urlSafeId\.test\(id\)/);
  assert.match(source, /heading\.top > activationLine/);

  const navigatorSource = await readFile(path.join(projectRoot, "app", "research", "research-results-navigator.tsx"), "utf8");
  const navigatorCss = await readFile(path.join(projectRoot, "app", "research", "research-results-navigator.module.css"), "utf8");
  const publicationCss = await readFile(path.join(projectRoot, "app", "research", "cgt", "publication.module.css"), "utf8");
  assert.match(navigatorSource, /fragmentTarget && region\?\.contains\(fragmentTarget\)/);
  assert.match(navigatorCss, /@media \(max-width: 1540px\) and \(min-width: 901px\) \{ \.rail \{ left: 2px; width: 28px;/);
  assert.match(publicationCss, /\.figure\s*\{[^}]*scroll-margin-top: calc\(var\(--research-sticky-offset, 216px\) \+ 16px\);/s);
  assert.match(publicationCss, /\.resultBlock,\s*\.figure\s*\{[^}]*scroll-margin-top: calc\(var\(--research-sticky-offset, 170px\) \+ 64px\);/s);
});

test("research pages without Results configuration do not render a tertiary navigator", async () => {
  const worker = await loadWorker();
  const response = await worker.fetch(
    new Request("http://localhost/research", { headers: { accept: "text/html" } }), env, ctx,
  );
  assert.doesNotMatch(await response.text(), /aria-label=["']Results sections["']/i);
});
