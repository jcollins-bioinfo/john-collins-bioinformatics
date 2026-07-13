# John Collins — Bioinformatics

Personal portfolio for [John Collins](https://github.com/jcollins-bioinfo), a bioinformatics data scientist and software engineer working across NGS, scientific computing, research infrastructure, and predictive biology.

[View the live portfolio](https://john-collins-bioinformatics.johnpatrickcollins.chatgpt.site)

## Focus

The site presents four dimensions of my work:

- **Selected projects** — Constraint Geometry Theory, reproducible NGS workflows, and scientific data products
- **Technical capabilities** — computational biology, scientific software engineering, cloud/HPC execution, and research infrastructure
- **Experience** — biotechnology R&D, translational genomics, data platforms, and scientific operations
- **Research interests** — gene-regulatory networks, aging mechanisms, causal inference, representation learning, and AI for biology

The visual system combines an editorial portfolio layout with a compact gene-network motif. Content is intentionally data-driven and organized for straightforward expansion as new projects mature.

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

## Adding a project

Project content lives in the `projects` array near the top of `app/page.tsx`. Add a new object with the same shape:

```ts
{
  index: "04",
  label: "Project category",
  title: "Project title",
  description: "A concise account of the question, system, and result.",
  tags: ["Method", "Technology", "Domain"],
}
```

The project list, tag treatment, and responsive layout render automatically. Longer case studies can later be promoted into dedicated routes without restructuring the home page.

## Repository map

```text
app/
  page.tsx       Portfolio content and semantic structure
  globals.css    Design system and responsive styling
  layout.tsx     Metadata and document shell
public/          Static assets
tests/           Rendered-output checks
scripts/         Build and artifact validation
```

## Status

The initial portfolio is complete. Current iteration priorities are project-specific case studies, a downloadable résumé, and publication-quality CGT figures as the research matures.
