# John Patrick Collins — Personal Site

Source for [johnpatrickcollins.info](https://johnpatrickcollins.info), a personal domain spanning bioinformatics, independent research, music, writing, and ongoing projects.

## Site structure

- `/` — concise personal homepage and orientation
- `/about` — personal and professional narrative
- `/bioinformatics` — career-facing bioinformatics portfolio
- `/research` — research overview
- `/research/giab-wes-nextflow` — source-bound caller comparison showcase; canonical results unavailable
- `/research/cgt` — publication-style CGT evidence report with 5 main figures, 6 supplements, methods, provenance, references, and the transition to CORD
- `/projects` — living project index
- `/writing` — research notes, essays, and long-form work
- `/music` — piano, composition, arrangement, and musical cognition
- `/now` — dated current-focus page
- `/cv` — experience, capabilities, and education
- `/contact` — professional contact routes
- `/publications` — peer-reviewed articles and published conference abstracts

The root is intentionally broad. Each practice has a canonical section so the domain can expand without turning the homepage into an undifferentiated portfolio.

The About page includes a dependency-free Canvas 2D heteroscedastic field with a deterministic static composition for reduced-motion preferences. Its configurable source anchor is reserved for later portrait-video composition; the portrait hand midpoint should align to `(sourceXRatio * width, 50% * height)`.

## Technology

- React 19 and TypeScript
- Next-compatible Vinext runtime
- Tailwind CSS 4 plus a custom responsive design system
- Cloudflare Workers deployment with custom-domain routing

## Local development

Requires Node.js 22.13 or newer.

```bash
npm ci
npm run dev
```

Useful checks:

```bash
npm run typecheck
npm run lint
npm test
npm run preview:cloudflare
```

## Cloudflare deployment

The production Worker is configured in `wrangler.jsonc` for both
`johnpatrickcollins.info` and `www.johnpatrickcollins.info`. The `www` hostname
redirects permanently to the apex domain.

For Cloudflare Workers Builds, use:

- Production branch: `main`
- Build command: `npm run build`
- Deploy command: `npx wrangler deploy`
- Non-production deploy command: `npx wrangler versions upload`

Cloudflare creates the Worker custom-domain DNS records and certificates during
deployment. Email DNS records remain independent of the website deployment.

## Repository map

```text
app/
  components/      Shared site header, footer, and identity mark
  bioinformatics/  Professional portfolio
  research/        Research overview and CGT
  music/           Musical practice
  writing/         Editorial index
  ...              About, Projects, Now, CV, and Contact
  page.tsx         Personal homepage
  globals.css      Shared design system and responsive styling
public/
  robots.txt       Crawler policy
  sitemap.xml      Public route index
  research/cgt/    Frozen CGT figures and machine-readable provenance
tests/             Rendered-route checks
scripts/           Build and artifact validation
```

## Repository name

The existing repository name is retained until the reorganized deployment is
stable. A later rename to `johnpatrickcollins.info` or `johnpatrickcollins-site`
would better match the expanded scope; the Cloudflare Git integration should be
checked immediately after any rename.

## GIAB evidence import

`app/research/giab-wes-nextflow/pipeline-binding.json` pins the reviewed pipeline
commit, package version and each small public metadata source by SHA-256.
To reproduce the public snapshot from a local pipeline checkout:

```bash
npm run import:giab -- /absolute/path/to/giab-wes-nextflow
npm run validate:giab
```

The importer reads exact Git objects at the pinned commit, validates source
bytes and metric arithmetic, and writes deterministic public JSON. Every build
checks the exact inventory, source digests, version and derived snapshot. It
never downloads biological data or infers canonical results from synthetic
metrics. Updating the pin is an explicit reviewed source change. A returned
canonical bundle must first pass the pipeline's `load_canonical_bundle` with an
externally reviewed manifest SHA; canonical import/rendering is not yet
qualified in this website consumer. Current canonical fields stay null.

This change does not deploy the website or an Explorer, publish a release, or
modify any CGT publication artifact.

GIAB validation adds five fail-closed data tests and three rendered/source
checks. Current visual browser, responsive and accessibility qualification is
pending. The comprehensive site run retains two pre-existing failures in
`tests/rendered-html.test.mjs`: unchanged global CSS uses an 18-second
cubic-bezier marquee and an 8-second bioMatrix animation while those tests
expect 15-second linear and 24-second motion respectively. This showcase does
not change those unrelated animations or expectations.
