import type { Metadata } from "next";

export const SITE_NAME = "John Patrick Collins";
export const SITE_ORIGIN = "https://johnpatrickcollins.info";

const DEFAULT_IMAGE = "/social/default-card.png";
const BIOINFORMATICS_IMAGE = "/social/bioinformatics-card.png";
const RESEARCH_IMAGE = "/social/research-card.png";

export type PublicRoute =
  | "/"
  | "/about"
  | "/bioinformatics"
  | "/contact"
  | "/cv"
  | "/music"
  | "/now"
  | "/projects"
  | "/publications"
  | "/research"
  | "/research/cgt"
  | "/writing";

type PageSeo = {
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  type?: "article" | "website";
  publishedTime?: string;
  modifiedTime?: string;
};

export const pageSeo = {
  "/": {
    title: "Science, Software, Music & Research | John Patrick Collins",
    description:
      "The personal domain of John Patrick Collins, spanning bioinformatics, scientific software, independent research, music, and writing.",
    image: DEFAULT_IMAGE,
    imageAlt: "John Patrick Collins — Science, software, music, and research",
  },
  "/about": {
    title: "About | John Patrick Collins",
    description:
      "About John Patrick Collins: a bioinformatics data scientist, software engineer, independent researcher, composer, pianist, and writer.",
    image: DEFAULT_IMAGE,
    imageAlt: "John Patrick Collins — About",
  },
  "/bioinformatics": {
    title: "Bioinformatics | John Patrick Collins",
    description:
      "NGS pipelines, scientific software, computational biology, and reproducible research infrastructure.",
    image: BIOINFORMATICS_IMAGE,
    imageAlt: "John Patrick Collins — Bioinformatics",
  },
  "/contact": {
    title: "Contact | John Patrick Collins",
    description:
      "Contact John Patrick Collins about bioinformatics, scientific software, independent research, technical collaboration, writing, or music.",
    image: DEFAULT_IMAGE,
    imageAlt: "John Patrick Collins — Contact",
  },
  "/cv": {
    title: "Curriculum Vitae | John Patrick Collins",
    description:
      "Professional experience, education, and capabilities across bioinformatics, scientific software, biotechnology, and research infrastructure.",
    image: BIOINFORMATICS_IMAGE,
    imageAlt: "John Patrick Collins — Curriculum vitae",
  },
  "/music": {
    title: "Music | John Patrick Collins",
    description:
      "Piano, composition, arrangement, transcription, and an inquiry into musical cognition, expectation, form, and performance.",
    image: DEFAULT_IMAGE,
    imageAlt: "John Patrick Collins — Music",
  },
  "/now": {
    title: "Now | John Patrick Collins",
    description:
      "A dated view of John Patrick Collins’s current work in independent research, bioinformatics, the personal site, and music.",
    image: DEFAULT_IMAGE,
    imageAlt: "John Patrick Collins — Now",
  },
  "/projects": {
    title: "Projects | John Patrick Collins",
    description:
      "A living index of bioinformatics systems, independent research, scientific software, music, writing, and other work in progress.",
    image: DEFAULT_IMAGE,
    imageAlt: "John Patrick Collins — Projects",
  },
  "/publications": {
    title: "Publications & Abstracts | John Patrick Collins",
    description:
      "Peer-reviewed articles and published conference abstracts spanning DNA engineering, clinical diagnostics, immuno-oncology, and genomics.",
    image: BIOINFORMATICS_IMAGE,
    imageAlt: "John Patrick Collins — Publications and abstracts",
  },
  "/research": {
    title: "Independent Research | John Patrick Collins",
    description:
      "Research on constraint geometry, causal gene regulation, biological aging, perturbational biology, and interpretable AI for biology.",
    image: RESEARCH_IMAGE,
    imageAlt: "John Patrick Collins — Independent research",
  },
  "/research/cgt": {
    title: "CGT Perturbation Geometry Report | John Patrick Collins",
    description:
      "A provenance-tracked report linking recurrent transcriptional responses, CRISPR fitness screens, signed biological axes, and tumor states.",
    image: RESEARCH_IMAGE,
    imageAlt: "John Patrick Collins — CGT perturbation geometry report",
    type: "article",
    publishedTime: "2026-07-20T00:00:00Z",
    modifiedTime: "2026-07-20T00:00:00Z",
  },
  "/writing": {
    title: "Writing | John Patrick Collins",
    description:
      "A developing index of research notes, technical essays, music and cognition, and long-form interdisciplinary projects.",
    image: DEFAULT_IMAGE,
    imageAlt: "John Patrick Collins — Writing",
  },
} as const satisfies Record<PublicRoute, PageSeo>;

export const publicRoutes = Object.keys(pageSeo) as PublicRoute[];

export function canonicalUrl(route: PublicRoute): string {
  return route === "/" ? `${SITE_ORIGIN}/` : `${SITE_ORIGIN}${route}`;
}

export function createPageMetadata(route: PublicRoute): Metadata {
  const page: PageSeo = pageSeo[route];
  const url = canonicalUrl(route);
  const imageUrl = `${SITE_ORIGIN}${page.image}`;
  const image = {
    url: imageUrl,
    type: "image/png",
    width: 1200,
    height: 627,
    alt: page.imageAlt,
  };

  return {
    title: { absolute: page.title },
    description: page.description,
    alternates: { canonical: url },
    robots: { index: true, follow: true },
    openGraph: {
      type: page.type ?? "website",
      siteName: SITE_NAME,
      url,
      title: page.title,
      description: page.description,
      images: [image],
      ...(page.type === "article"
        ? {
            publishedTime: page.publishedTime,
            modifiedTime: page.modifiedTime,
            authors: [SITE_NAME],
          }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: page.title,
      description: page.description,
      images: [{ url: imageUrl, alt: page.imageAlt }],
    },
  };
}
