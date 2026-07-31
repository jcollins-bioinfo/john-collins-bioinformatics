export type PublicationType = "peer-reviewed" | "conference-abstract";

export interface Publication {
  id: string;
  type: PublicationType;
  year: number;
  title: string;
  authors: string[];
  venue: string;
  citation: string;
  doi: string;
  publisherUrl: string;
}

export const publications: readonly Publication[] = [
  {
    id: "matsui-2026-dna-engineering",
    type: "peer-reviewed",
    year: 2026,
    title: "High-throughput DNA engineering by mating bacteria",
    authors: ["Matsui T", "Hung P-H", "Mei H", "Liu X", "Li F", "Collins J", "et al."],
    venue: "Cell Systems",
    citation: "Cell Systems. 2026;101656.",
    doi: "10.1016/j.cels.2026.101656",
    publisherUrl: "https://doi.org/10.1016/j.cels.2026.101656",
  },
  {
    id: "dalmas-2020-neoe-hla",
    type: "conference-abstract",
    year: 2020,
    title: "A high-throughput platform to produce neoE-HLA libraries for capturing neoE-specific T cells from the peripheral blood of patients with solid tumors",
    authors: ["Dalmas O", "Pan Z", "Shieh C", "et al.", "including Collins J"],
    venue: "Cancer Research / AACR Annual Meeting",
    citation: "Cancer Res. 2020;80(16 Suppl):Abstract 3253.",
    doi: "10.1158/1538-7445.AM2020-3253",
    publisherUrl: "https://doi.org/10.1158/1538-7445.AM2020-3253",
  },
  {
    id: "crespo-leiro-2017-dd-cfdna",
    type: "conference-abstract",
    year: 2017,
    title: "Analysis of Donor-Derived Cell-Free DNA with 3-Year Outcomes in Heart Transplant Recipients",
    authors: ["Crespo-Leiro M", "Hiller D", "Woodward R", "Grskovic M", "Marchis C", "Song M", "Collins J", "Zuckermann A"],
    venue: "The Journal of Heart and Lung Transplantation",
    citation: "J Heart Lung Transplant. 2017;36(4):S69–S70.",
    doi: "10.1016/j.healun.2017.01.172",
    publisherUrl: "https://doi.org/10.1016/j.healun.2017.01.172",
  },
  {
    id: "grskovic-2016-clinical-grade-assay",
    type: "peer-reviewed",
    year: 2016,
    title: "Validation of a Clinical-Grade Assay to Measure Donor-Derived Cell-Free DNA in Solid Organ Transplant Recipients",
    authors: ["Grskovic M", "Hiller DJ", "Eubank LA", "Sninsky JJ", "Christopherson C", "Collins JP", "et al."],
    venue: "The Journal of Molecular Diagnostics",
    citation: "J Mol Diagn. 2016;18(6):890–902.",
    doi: "10.1016/j.jmoldx.2016.07.003",
    publisherUrl: "https://doi.org/10.1016/j.jmoldx.2016.07.003",
  },
  {
    id: "khush-2016-cfdna",
    type: "conference-abstract",
    year: 2016,
    title: "Circulating Cell-Free DNA as a Non-Invasive Marker of Pediatric Heart Transplant Rejection and Immunosuppressive Treatment",
    authors: ["Khush KK", "Grskovic M", "Luikart H", "et al.", "including Collins J"],
    venue: "The Journal of Heart and Lung Transplantation",
    citation: "J Heart Lung Transplant. 2016;35(4):S75.",
    doi: "10.1016/j.healun.2016.01.205",
    publisherUrl: "https://doi.org/10.1016/j.healun.2016.01.205",
  },
];

export const publicationGroups = [
  { type: "peer-reviewed" as const, label: "Peer-reviewed articles" },
  { type: "conference-abstract" as const, label: "Published conference abstracts" },
];
