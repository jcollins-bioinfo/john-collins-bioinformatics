# John Patrick Collins — Personal Site

Source for [johnpatrickcollins.info](https://johnpatrickcollins.info), a personal domain spanning bioinformatics, independent research, music, writing, and ongoing projects.

## Site structure

- `/` — concise personal homepage and orientation
- `/about` — personal and professional narrative
- `/bioinformatics` — career-facing bioinformatics portfolio
- `/research` — research overview
- `/research/cgt` — publication-style CGT evidence report with 5 main figures, 6 supplements, methods, provenance, references, and the transition to CORD
- `/projects` — living project index
- `/writing` — research notes, essays, and long-form work
- `/music` — piano, composition, arrangement, and musical cognition
- `/now` — dated current-focus page
- `/cv` — experience, capabilities, and education
- `/contact` — professional contact routes

The root is intentionally broad. Each practice has a canonical section so the domain can expand without turning the homepage into an undifferentiated portfolio.

## Technology

- React 19 and TypeScript
- Next-compatible Vinext runtime
- Tailwind CSS 4 plus a custom responsive design system
- Cloudflare Workers deployment with custom-domain routing
- OpenAI Sites checkpoint deployments

## Local development

Requires Node.js 22.13 or newer.

```bash
npm ci
npm run dev
```

Useful checks:

```bash
npm run lint
npm test
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
