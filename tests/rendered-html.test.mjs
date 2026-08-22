import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { access, readFile } from "node:fs/promises";
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

test("serves audited Figure 2 PDF and ZIP downloads with exact MIME types", async () => {
  const worker = await loadWorker();
  const body = new Uint8Array([0x43, 0x47, 0x54]);
  const assetEnv = {
    ASSETS: {
      fetch: async () => new Response(body, {
        headers: { "content-type": "application/octet-stream" },
      }),
    },
  };
  const expected = new Map([
    ["/research/cgt/figures/main/CGT_FIGURE_002_recurrent_geometry_revised.pdf", "application/pdf"],
    ["/research/cgt/figures/main/CGT_FIGURE_002_recurrent_geometry_revised_v1.zip", "application/zip"],
    ["/research/cgt/figures/main/figure-02-recurrent-geometry.pdf", "application/pdf"],
  ]);

  for (const [route, contentType] of expected) {
    const response = await worker.fetch(new Request(`http://localhost${route}`), assetEnv, ctx);
    assert.equal(response.status, 200);
    assert.equal(response.headers.get("content-type"), contentType);
    assert.deepEqual(new Uint8Array(await response.arrayBuffer()), body);
  }

  const wranglerConfig = await readFile(path.join(projectRoot, "wrangler.jsonc"), "utf8");
  for (const route of expected.keys()) {
    assert.match(wranglerConfig, new RegExp(route.replaceAll(".", "\\.")));
  }
  assert.match(wranglerConfig, /"run_worker_first"\s*:/);
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
    /class="mercury-name-container fade-in-char"><span class="nano-mercury-char fade-in-char" style="animation-delay:-16\.6066s;top:-2px;--char-index:4">John Patrick Collins<\/span><\/span>/,
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
  assert.match(html, /3 August 2026/);
  assert.match(html, /version 0\.2/i);
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

test("ships every canonical CGT figure and the audited Figure 1 and Figure 2 releases", async () => {
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
  assert.equal(manifest.report.active_physical_asset_count, 39);
  assert.equal(manifest.report.compatibility_alias_count, 6);
  assert.equal(manifest.report.physical_asset_count, 45);
  assert.ok(manifest.figures.slice(2).every((figure) =>
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
