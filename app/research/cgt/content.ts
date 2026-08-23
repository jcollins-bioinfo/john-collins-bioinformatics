import figureTwoCopy from "./figure-02-copy.json";
import figureThreeCopy from "./figure-03-copy.json";
import figureFourCopy from "./figure-04-copy.json";
import type { ResponsiveResearchFigurePanel } from "../responsive-research-figure";

export type FigureRole = "core" | "synthesis" | "supporting" | "supplementary";

export type FigureReleaseAsset = {
  label: string;
  role?: string;
  linkText: string;
  href: string;
  filename: string;
  bytes: number;
  mimeType: string;
  sha256: string;
  width?: number;
  height?: number;
  nominalDpi?: number;
  widthPt?: number;
  heightPt?: number;
  widthMm?: number;
  heightMm?: number;
  viewBox?: string;
};

export type FigureSpec = {
  id: string;
  label: string;
  title: string;
  role: FigureRole;
  image: string;
  pdf: string;
  svg: string;
  width: number;
  height: number;
  alt: string;
  accessibleDescription: string;
  accessibleDescriptionFormat?: "markdown";
  caption: string[] | string;
  sourceRun: string;
  sourceNotebook: string;
  notebookSha256: string;
  imageSha256: string;
  upstreamRuns: string[];
  freezeStatus: string;
  qaNote: string;
  responsiveNote?: string;
  responsivePanels?: ResponsiveResearchFigurePanel[];
  revisionScope?: string;
  sourceRelease?: {
    id: string;
    filename: string;
    bytes: number;
    sha256: string;
    manifestFilename: string;
    manifestBytes: number;
    manifestSha256: string;
  };
  releaseAssets?: FigureReleaseAsset[];
};

export type Reference = {
  key: string;
  authors: string;
  title: string;
  journal: string;
  year: string;
  details: string;
  href: string;
  doi?: string;
};

const mainRoot = "/research/cgt/figures/main";
const supplementRoot = "/research/cgt/figures/supplementary";
const figureTwoCaption = figureTwoCopy.caption_markdown_lines.join("\n");
const figureTwoAccessibleDescription = figureTwoCopy.accessible_description_markdown_lines.join("\n");
const figureThreeCaption = figureThreeCopy.caption_markdown_lines.join("\n");
const figureThreeAccessibleDescription = figureThreeCopy.accessible_description_markdown_lines.join("\n");
const figureFourCaption = figureFourCopy.caption_markdown_lines.join("\n");
const figureFourAccessibleDescription = figureFourCopy.accessible_description_markdown_lines.join("\n");

export const mainFigures: FigureSpec[] = [
  {
    id: "fig-1",
    label: "Figure 1",
    title: "Residual perturbation geometry predicts external CRISPR-derived gene fitness",
    role: "core",
    image: `${mainRoot}/CGT_FIGURE_001_residual_geometry_predicts_fitness_revised_web.png`,
    pdf: `${mainRoot}/CGT_FIGURE_001_residual_geometry_predicts_fitness_revised.pdf`,
    svg: `${mainRoot}/CGT_FIGURE_001_residual_geometry_predicts_fitness_revised.svg`,
    width: 2400,
    height: 2163,
    alt: "Six-panel CGT fitness-prediction figure; detailed description follows.",
    accessibleDescription:
      "The figure has six labeled panels. Panel a is a five-box workflow from Perturb-seq response profiles through context-mean subtraction and measured gene-level CGT features to a supervised random-forest mapping and an external DepMap −GeneEffect endpoint. Panel b is a neutral-gray scatter plot of observed essentiality strength against out-of-fold prediction for 1,229 genes. The fitted calibration line rises more shallowly than the identity line, showing regression toward the mean; pooled rank correlation is 0.613. Panels c and d show 100 shuffle-level null means near zero Spearman correlation and 0.5 ROC AUC, respectively, while all five observed folds cluster near 0.62 correlation and 0.92 AUC. Panel e is a horizontal bar plot of the top eight standardized ridge coefficients; F12 translation/RQC is the largest-magnitude coefficient and is negative. Panel f contains two three-by-three heatmaps. Performance changes little when median or standard-deviation summaries are added within a residualization scheme, but falls under dataset-mean residualization to about 0.51 correlation and 0.80 AUC.",
    caption: [
      "a, A prediction-focused set of 2,720 perturbational response profiles from 39 datasets and 8 contexts was context-mean residualized and summarized as 16 gene-level CGT features. These measured features were mapped to an external DepMap 26Q1 CRISPR endpoint in five-fold, gene-grouped supervised cross-validation. b, Out-of-fold predictions for 1,229 genes. Essentiality strength is −GeneEffect; pooled Spearman ρ = 0.613 and predictive R² = 0.353. The OLS calibration slope is 0.386, indicating shrinkage toward the mean. c–d, Regression and essential-gene classification compared with 100 endpoint label shuffles. The null distributions contain cross-validated means from whole shuffles; open circles are the five observed fold values and the diamond is their mean. One-sided plus-one empirical permutation P = 1/101 = 0.0099 for each endpoint view. e, The eight largest absolute standardized ridge coefficients among 16 mean-absolute-residual features. These full-data coefficients are descriptive conditional weights, not causal effects or coefficient-stability estimates. f, Feature-construction sensitivity across three residualization schemes and three cumulative gene-level aggregation choices. Aggregation choice has little effect within a scheme, whereas dataset-mean residualization materially attenuates performance.",
      "Regression and thresholded classification are two views of the same external GeneEffect source, not independent biological confirmations. Test-gene CGT features were measured rather than predicted. Harder program-family, dataset, context, and study-proxy holdouts remain weak, so the result supports predictive association within the represented data regime rather than universal transfer or causality.",
    ],
    sourceRun: "CGT_FIGURE_001",
    sourceNotebook: "CGT-FIGURE-001_residual_geometry_predicts_gene_fitness.ipynb",
    notebookSha256: "b9082d525c9f6aa58bf3cffa9ce56abf8e5f9bf2cf121c018a07497470fd1825",
    imageSha256: "6e4a410c90763ded6aac2eb7d95e14296c511dbbdf8b9b0d494634b583721808",
    upstreamRuns: ["CGT_PREDICT_005", "CGT_CONSTRAINT_002E"],
    freezeStatus: "Analysis-frozen Figure 1 release",
    revisionScope: "presentation and scientific-label corrections; frozen numerical inputs",
    qaNote: "Automated geometry audits at design, web-export, and 600-dpi resolution found zero out-of-canvas text objects, zero text–text overlaps, zero workflow-box containment violations, and zero protected statistics–legend overlaps. Minimum workflow-text clearance from its container stroke was 2.002 pt; panel-b statistics–legend separation was 12.762 pt; the legend occluded 0 of 1,229 observations at all three audited resolutions.",
    releaseAssets: [
      {
        label: "Web PNG",
        linkText: "Download Figure 1 web PNG (2,400 × 2,163)",
        href: `${mainRoot}/CGT_FIGURE_001_residual_geometry_predicts_fitness_revised_web.png`,
        filename: "CGT_FIGURE_001_residual_geometry_predicts_fitness_revised_web.png",
        bytes: 554317,
        mimeType: "image/png",
        sha256: "6e4a410c90763ded6aac2eb7d95e14296c511dbbdf8b9b0d494634b583721808",
        width: 2400,
        height: 2163,
      },
      {
        label: "600-dpi PNG",
        linkText: "Download Figure 1 600-dpi PNG (4,322 × 3,897)",
        href: `${mainRoot}/CGT_FIGURE_001_residual_geometry_predicts_fitness_revised_600dpi.png`,
        filename: "CGT_FIGURE_001_residual_geometry_predicts_fitness_revised_600dpi.png",
        bytes: 1095745,
        mimeType: "image/png",
        sha256: "990bce7ba1bb698295367fc374e2f392c6c55cc0517ef59abf0cff4304dd7dca",
        width: 4322,
        height: 3897,
        nominalDpi: 600,
      },
      {
        label: "Publication PDF",
        linkText: "Download Figure 1 publication PDF",
        href: `${mainRoot}/CGT_FIGURE_001_residual_geometry_predicts_fitness_revised.pdf`,
        filename: "CGT_FIGURE_001_residual_geometry_predicts_fitness_revised.pdf",
        bytes: 63527,
        mimeType: "application/pdf",
        sha256: "e850d1b4cc26209f1f365017dad32f24640c5726e75b251e80529939d5dfa1d9",
      },
      {
        label: "Vector SVG",
        linkText: "Download Figure 1 vector SVG",
        href: `${mainRoot}/CGT_FIGURE_001_residual_geometry_predicts_fitness_revised.svg`,
        filename: "CGT_FIGURE_001_residual_geometry_predicts_fitness_revised.svg",
        bytes: 349381,
        mimeType: "image/svg+xml",
        sha256: "9a5c12ce5a611eb2e51a9b2a2dc2eaeaa0f8a05eaa1094144ee3219009c4f773",
      },
      {
        label: "Reproducibility package",
        linkText: "Download Figure 1 reproducibility package (ZIP)",
        href: `${mainRoot}/CGT_FIGURE_001_revised_reproducibility_package_v2.zip`,
        filename: "CGT_FIGURE_001_revised_reproducibility_package_v2.zip",
        bytes: 1837975,
        mimeType: "application/zip",
        sha256: "edfa3a5f55666428142695a373d81c68aa8ff6e34f3775727b785a58b7e803bc",
      },
      {
        label: "Machine-readable audit",
        linkText: "Download Figure 1 machine-readable audit (JSON)",
        href: `${mainRoot}/CGT_FIGURE_001_residual_geometry_predicts_fitness_revised_audit.json`,
        filename: "CGT_FIGURE_001_residual_geometry_predicts_fitness_revised_audit.json",
        bytes: 18645,
        mimeType: "application/json",
        sha256: "f0e4a977b845adfe07cf41f1473b2bac7ec6a0d1d7a20f0f7f882b3caddb8ab1",
      },
    ],
  },
  {
    id: "fig-2",
    label: "Figure 2",
    title: "Residual family-coordinate structure recurs within the leave-dataset-out benchmark but attenuates under study-proxy and context exclusion",
    role: "core",
    image: `${mainRoot}/CGT_FIGURE_002_recurrent_geometry_revised_web.png`,
    pdf: `${mainRoot}/CGT_FIGURE_002_recurrent_geometry_revised.pdf`,
    svg: `${mainRoot}/CGT_FIGURE_002_recurrent_geometry_revised.svg`,
    width: 2400,
    height: 2500,
    alt: "Six-panel figure separates two analysis universes. In PREDICT-003B (2,720 observations, 39 datasets, 8 contexts), context and dataset-shrinkage residuals show mean same-label leave-dataset-out cosine near 0.56, with shuffled and random-label controls near zero, but the signal falls to about 0.04 after a same-study-prefix exclusion and 0.07–0.08 under leave-context-out evaluation. META-003 (248 modes, 43 datasets, 9 contexts) contains one dominant broad-recurrence family, F14, and many single-context families. Results are descriptive and preprocessing-dependent, not causal or universally transportable.",
    accessibleDescription: figureTwoAccessibleDescription,
    accessibleDescriptionFormat: "markdown",
    caption: figureTwoCaption,
    sourceRun: "CGT_FIGURE_002",
    sourceNotebook: "CGT-FIGURE-002_recurrent_residual_geometry.ipynb",
    notebookSha256: "f8046ecb45971bb4d81288af00c0bca5ac2b075e2db6ae1dcd602dbebdf017d8",
    imageSha256: "43704a92196e9681c0cd8c8c666e56c7e69461e530a1a84bbdd4d662cac9e5e6",
    upstreamRuns: ["CGT_META_003", "CGT_PREDICT_003B"],
    freezeStatus: "Scientifically audited replacement release v1; all mandatory automated and rendered visual QA passed.",
    revisionScope: "Source-level provenance and numerical audit; deterministic six-panel reconstruction; corrected analysis-universe, denominator, uncertainty, score, class, and claim wording; publication typography, layout, accessibility, and cross-format integrity. No original or upstream scientific input was modified.",
    qaNote: "Exact 182.88 × 190.50 mm canvas; 4,320 × 4,500 publication PNG at 600 dpi; 2,400 × 2,500 web PNG; 7.0 pt minimum font; no canvas/container escape, text collision, legend/data collision, clipping, invalid SVG, unembedded PDF font, numerical mismatch, or cross-format failure; complete human visual review passed. The two-column composite is uncropped at 480 px, but small publication text requires an open-original or zoom affordance on narrow screens unless a separately approved mobile derivative is supplied.",
    releaseAssets: [
      {
        label: "Web PNG",
        linkText: "Download Figure 2 web PNG (2,400 × 2,500)",
        href: `${mainRoot}/CGT_FIGURE_002_recurrent_geometry_revised_web.png`,
        filename: "CGT_FIGURE_002_recurrent_geometry_revised_web.png",
        bytes: 994659,
        mimeType: "image/png",
        sha256: "43704a92196e9681c0cd8c8c666e56c7e69461e530a1a84bbdd4d662cac9e5e6",
        width: 2400,
        height: 2500,
      },
      {
        label: "600-dpi PNG",
        linkText: "Download Figure 2 600-dpi PNG (4,320 × 4,500)",
        href: `${mainRoot}/CGT_FIGURE_002_recurrent_geometry_revised_600dpi.png`,
        filename: "CGT_FIGURE_002_recurrent_geometry_revised_600dpi.png",
        bytes: 1051585,
        mimeType: "image/png",
        sha256: "a530b276be8dd3d51a025c9a90e93f3226960102e5b30d29759123f4ae1f14bd",
        width: 4320,
        height: 4500,
        nominalDpi: 600,
      },
      {
        label: "Publication PDF",
        linkText: "Download Figure 2 publication PDF",
        href: `${mainRoot}/CGT_FIGURE_002_recurrent_geometry_revised.pdf`,
        filename: "CGT_FIGURE_002_recurrent_geometry_revised.pdf",
        bytes: 41435,
        mimeType: "application/pdf",
        sha256: "5a1d008c95ad3c214193a5aeefa6dcf053336d8f4f7a1ef74354b93f4e6e753d",
        widthPt: 518.4,
        heightPt: 540.0,
        widthMm: 182.88,
        heightMm: 190.5,
      },
      {
        label: "Vector SVG",
        linkText: "Download Figure 2 vector SVG",
        href: `${mainRoot}/CGT_FIGURE_002_recurrent_geometry_revised.svg`,
        filename: "CGT_FIGURE_002_recurrent_geometry_revised.svg",
        bytes: 265227,
        mimeType: "image/svg+xml",
        sha256: "7c418610b2beef4f112b266b1765b5007ef2ff9e1dd03ba4f17b8bcea78b3721",
        widthPt: 518.4,
        heightPt: 540.0,
        widthMm: 182.88,
        heightMm: 190.5,
        viewBox: "0 0 518.4 540.0",
      },
      {
        label: "Reproducibility package",
        linkText: "Download Figure 2 reproducibility package (ZIP)",
        href: `${mainRoot}/CGT_FIGURE_002_recurrent_geometry_revised_v1.zip`,
        filename: "CGT_FIGURE_002_recurrent_geometry_revised_v1.zip",
        bytes: 18958999,
        mimeType: "application/zip",
        sha256: "3c187c5dd4369e9cd0c4b4c91386ed37b675b446de7dde637a5f8d85642cc947",
      },
      {
        label: "Machine-readable audit",
        linkText: "Download Figure 2 machine-readable audit (JSON)",
        href: `${mainRoot}/CGT_FIGURE_002_recurrent_geometry_revised_audit.json`,
        filename: "CGT_FIGURE_002_recurrent_geometry_revised_audit.json",
        bytes: 19215,
        mimeType: "application/json",
        sha256: "6631f78a4a447b57c630ebe535e8afbdd463892f88feb7e58b701cc263ec4a58",
      },
    ],
  },
  {
    id: "fig-3",
    label: "Figure 3",
    title: figureThreeCopy.title,
    role: "core",
    image: `${mainRoot}/CGT_FIGURE_003_signed_axes_revised_web.png`,
    pdf: `${mainRoot}/CGT_FIGURE_003_signed_axes_revised.pdf`,
    svg: `${mainRoot}/CGT_FIGURE_003_signed_axes_revised.svg`,
    width: 2400,
    height: 2675,
    alt: figureThreeCopy.alt,
    accessibleDescription: figureThreeAccessibleDescription,
    accessibleDescriptionFormat: "markdown",
    caption: figureThreeCaption,
    sourceRun: "CGT_FIGURE_003",
    sourceNotebook: "CGT-FIGURE-003_signed_dimensions_candidate_axes.ipynb",
    notebookSha256: "db46164d1d6ea035b50352f358a5d6fe93c39dca967f9cb6b87279538eb81b19",
    imageSha256: "f7bee8ebf1bcb491c239fd3cf63908521327c6055af24d50e383acdd139d8ad3",
    upstreamRuns: ["CGT_CONSTRAINT_001B", "CGT_CONSTRAINT_002D", "CGT_CONSTRAINT_002E", "CGT_META_003", "CGT_PREDICT_005"],
    freezeStatus: "Audited replacement release v1; all automated, cross-format, deterministic, and hash-anchored human-review gates passed.",
    revisionScope: "Deterministic six-panel reconstruction with corrected query filtering, denominators, global multiple-testing scope, evidence dependence, study-proxy limitations, compositional non-identifiability, scientific copy, publication typography, accessibility, and cross-format integrity. Frozen upstream scientific inputs were not modified.",
    qaNote: "Exact 183 × 204 mm canvas; 4,323 × 4,819 publication PNG at 599.9988 dpi; 2,400 × 2,675 web PNG at 96.012 dpi; pinned embedded ICC profile; path-text SVG; embedded TrueType PDF; 392 files were byte-identical across two clean renders; all automated and hash-anchored human-review gates passed.",
    responsiveNote: figureThreeCopy.responsive_presentation_requirement,
    releaseAssets: [
      {
        label: "Web PNG",
        role: "In-page display and full-resolution web download",
        linkText: "Download Figure 3 web PNG (2,400 × 2,675)",
        href: `${mainRoot}/CGT_FIGURE_003_signed_axes_revised_web.png`,
        filename: "CGT_FIGURE_003_signed_axes_revised_web.png",
        bytes: 1770635,
        mimeType: "image/png",
        sha256: "f7bee8ebf1bcb491c239fd3cf63908521327c6055af24d50e383acdd139d8ad3",
        width: 2400,
        height: 2675,
        nominalDpi: 96.012,
      },
      {
        label: "600-dpi PNG",
        role: "Publication-resolution PNG download",
        linkText: "Download Figure 3 600-dpi PNG (4,323 × 4,819)",
        href: `${mainRoot}/CGT_FIGURE_003_signed_axes_revised_600dpi.png`,
        filename: "CGT_FIGURE_003_signed_axes_revised_600dpi.png",
        bytes: 1871881,
        mimeType: "image/png",
        sha256: "30095053cb861bd7be782001fdd7e0fb5f3a988dd3a1d9c204e689b5e0e96398",
        width: 4323,
        height: 4819,
        nominalDpi: 599.9988,
      },
      {
        label: "Publication PDF",
        role: "One-page publication PDF download",
        linkText: "Download Figure 3 publication PDF",
        href: `${mainRoot}/CGT_FIGURE_003_signed_axes_revised.pdf`,
        filename: "CGT_FIGURE_003_signed_axes_revised.pdf",
        bytes: 1600555,
        mimeType: "application/pdf",
        sha256: "3dab4de28f38762de434eecb6b2a9bf9cde3cd469548231e189abb2627973383",
        widthPt: 518.740157,
        heightPt: 578.267717,
        widthMm: 183,
        heightMm: 204,
      },
      {
        label: "Vector SVG",
        role: "Font-independent vector download and open-original route",
        linkText: "Download Figure 3 vector SVG",
        href: `${mainRoot}/CGT_FIGURE_003_signed_axes_revised.svg`,
        filename: "CGT_FIGURE_003_signed_axes_revised.svg",
        bytes: 357204,
        mimeType: "image/svg+xml",
        sha256: "40634f9fe70e9c002a13a1cc6318d84c96ad602a27f2faa027531b5cea3787a3",
        widthPt: 518.740157,
        heightPt: 578.267717,
        widthMm: 183,
        heightMm: 204,
        viewBox: "0 0 518.740157 578.267717",
      },
      {
        label: "Complete audited release",
        role: "Complete intact audited Figure 3 release package",
        linkText: "Download Figure 3 complete audited release (ZIP)",
        href: `${mainRoot}/CGT_FIGURE_003_signed_axes_revised_v1.zip`,
        filename: "CGT_FIGURE_003_signed_axes_revised_v1.zip",
        bytes: 72565683,
        mimeType: "application/zip",
        sha256: "c54503486663c217ddd6348ccef22642255c04112ff936ab615c9e104449987d",
      },
      {
        label: "Machine-readable audit",
        role: "Final automated audit with hash-anchored human-review gate",
        linkText: "Download Figure 3 machine-readable audit (JSON)",
        href: `${mainRoot}/CGT_FIGURE_003_signed_axes_revised_audit.json`,
        filename: "CGT_FIGURE_003_signed_axes_revised_audit.json",
        bytes: 104289,
        mimeType: "application/json",
        sha256: "c8ff32a557e9a817d3e71019fd29e5b5001c869c2924ec7f95bfe03f496e6359",
      },
    ],
  },
  {
    id: "fig-4",
    label: "Figure 4",
    title: figureFourCopy.title,
    role: "synthesis",
    image: `${mainRoot}/CGT_FIGURE_004_dependency_aware_synthesis_revised_web.png`,
    pdf: `${mainRoot}/CGT_FIGURE_004_dependency_aware_synthesis_revised.pdf`,
    svg: `${mainRoot}/CGT_FIGURE_004_dependency_aware_synthesis_revised.svg`,
    width: 2400,
    height: 2675,
    alt: figureFourCopy.alt,
    accessibleDescription: figureFourAccessibleDescription,
    accessibleDescriptionFormat: "markdown",
    caption: figureFourCaption,
    sourceRun: "CGT_FIGURE_004",
    sourceNotebook: "CGT-FIGURE-004_integrated_evidence_atlas_and_constraint_model.ipynb",
    notebookSha256: "6fe89a92fd3a7127cb5d80e7b60158e748f4ba3a2a48f552dff3c2010f09b704",
    imageSha256: "89c15cb2751ed1d6513c16d7cd45769605797def3642897ed66b08a91a15d487",
    upstreamRuns: ["CGT_FIGURE_001", "CGT_FIGURE_002", "CGT_FIGURE_003", "CGT_META_003", "CGT_PREDICT_003B", "CGT_PREDICT_005"],
    freezeStatus: "Audited replacement release v1; analysis-frozen synthesis, not independent validation.",
    revisionScope: "Deterministic five-panel redesign from frozen revised Figure 1–3 results; corrected dependency labels, raw-metric presentation, generalization boundaries, scientific copy, responsive assets, accessibility, and cross-format integrity. No model, enrichment, residualization, or bootstrap analysis was rerun.",
    qaNote: "Exact 183 × 204 mm canvas; 2,400 × 2,675 web PNG; 4,322 × 4,818 publication PNG at 599.9988 dpi; path-text SVG with explicit title and description; embedded-font PDF; zero text collisions, container escapes, or panel-boundary violations; all five panel letters occur exactly once and all eight canonical audit sections passed.",
    responsiveNote: "At 1,080 CSS px and below, the composite is replaced by the supplied panels a–e. Panels a, b, d, and e retain an 800-pixel minimum width inside keyboard- and touch-accessible horizontal scrollers; panel c uses the available content width. The full-resolution composite and every release download remain available.",
    responsivePanels: [
      {
        id: "a",
        label: "Panel a — Evidence register and permitted claim scope",
        src: `${mainRoot}/CGT_FIGURE_004_dependency_aware_synthesis_revised_mobile_panel_a.png`,
        width: 1600,
        height: 420,
        minimumDisplayWidth: 800,
      },
      {
        id: "b",
        label: "Panel b — Study-conditioned candidate summaries",
        src: `${mainRoot}/CGT_FIGURE_004_dependency_aware_synthesis_revised_mobile_panel_b.png`,
        width: 1600,
        height: 593,
        minimumDisplayWidth: 800,
      },
      {
        id: "c",
        label: "Panel c — Raw-metric atlas",
        src: `${mainRoot}/CGT_FIGURE_004_dependency_aware_synthesis_revised_mobile_panel_c.png`,
        width: 1200,
        height: 999,
      },
      {
        id: "d",
        label: "Panel d — Generalization boundaries",
        src: `${mainRoot}/CGT_FIGURE_004_dependency_aware_synthesis_revised_mobile_panel_d.png`,
        width: 1600,
        height: 758,
        minimumDisplayWidth: 800,
      },
      {
        id: "e",
        label: "Panel e — Scoped model and decisive falsifiers",
        src: `${mainRoot}/CGT_FIGURE_004_dependency_aware_synthesis_revised_mobile_panel_e.png`,
        width: 1600,
        height: 300,
        minimumDisplayWidth: 800,
      },
    ],
    sourceRelease: {
      id: "CGT_FIGURE_004_dependency_aware_synthesis_revised_v1",
      filename: "CGT_FIGURE_004_dependency_aware_synthesis_revised_v1.zip",
      bytes: 15282792,
      sha256: "8b6d475fb04f350707c8c635de40ea3ff9a5dfda66a2edf96b7c2337dbc35128",
      manifestFilename: "CGT_FIGURE_004_release_manifest.json",
      manifestBytes: 16423,
      manifestSha256: "ebc8b2e662e3b60253e32fee3cd3db6336c57e76a74bac888af787518e97ced5",
    },
    releaseAssets: [
      {
        label: "Web PNG",
        role: "Web fallback, panel overview, and full-resolution web download",
        linkText: "Download Figure 4 web PNG (2,400 × 2,675)",
        href: `${mainRoot}/CGT_FIGURE_004_dependency_aware_synthesis_revised_web.png`,
        filename: "CGT_FIGURE_004_dependency_aware_synthesis_revised_web.png",
        bytes: 1743554,
        mimeType: "image/png",
        sha256: "89c15cb2751ed1d6513c16d7cd45769605797def3642897ed66b08a91a15d487",
        width: 2400,
        height: 2675,
      },
      {
        label: "600-dpi PNG",
        role: "Publication-resolution PNG download",
        linkText: "Download Figure 4 600-dpi PNG (4,322 × 4,818)",
        href: `${mainRoot}/CGT_FIGURE_004_dependency_aware_synthesis_revised_600dpi.png`,
        filename: "CGT_FIGURE_004_dependency_aware_synthesis_revised_600dpi.png",
        bytes: 1535331,
        mimeType: "image/png",
        sha256: "ca83d2408a0788e9c9ab6bd68ac5877b61f51cf8d30932d76f66734f61c8d756",
        width: 4322,
        height: 4818,
        nominalDpi: 599.9988,
      },
      {
        label: "Publication PDF",
        role: "One-page embedded-font publication PDF",
        linkText: "Download Figure 4 publication PDF",
        href: `${mainRoot}/CGT_FIGURE_004_dependency_aware_synthesis_revised.pdf`,
        filename: "CGT_FIGURE_004_dependency_aware_synthesis_revised.pdf",
        bytes: 71123,
        mimeType: "application/pdf",
        sha256: "7cbc094b423899486f335be3ecc3005c5b9d7dedc2a9dbad7b1214d885e16b9c",
        widthPt: 518.74,
        heightPt: 578.268,
        widthMm: 183,
        heightMm: 204,
      },
      {
        label: "Vector SVG",
        role: "Font-independent vector download and desktop display source",
        linkText: "Download Figure 4 vector SVG",
        href: `${mainRoot}/CGT_FIGURE_004_dependency_aware_synthesis_revised.svg`,
        filename: "CGT_FIGURE_004_dependency_aware_synthesis_revised.svg",
        bytes: 371346,
        mimeType: "image/svg+xml",
        sha256: "267593219bf1e7ec3d7a89b9c5943c734dad6da78afee96eb047828a2764e0a6",
        widthPt: 518.740157,
        heightPt: 578.267717,
        widthMm: 183,
        heightMm: 204,
        viewBox: "0 0 518.740157 578.267717",
      },
      {
        label: "Complete reproducibility package v1",
        role: "Complete intact audited Figure 4 release package",
        linkText: "Download Figure 4 complete reproducibility package v1 (ZIP)",
        href: `${mainRoot}/CGT_FIGURE_004_dependency_aware_synthesis_revised_v1.zip`,
        filename: "CGT_FIGURE_004_dependency_aware_synthesis_revised_v1.zip",
        bytes: 15282792,
        mimeType: "application/zip",
        sha256: "8b6d475fb04f350707c8c635de40ea3ff9a5dfda66a2edf96b7c2337dbc35128",
      },
    ],
  },
  {
    id: "fig-5",
    label: "Figure 5",
    title: "TCGA tumors projected into independently defined CGT axis space",
    role: "supporting",
    image: `${mainRoot}/figure-05-tcga-projection.png`,
    pdf: `${mainRoot}/figure-05-tcga-projection.pdf`,
    svg: `${mainRoot}/figure-05-tcga-projection.svg`,
    width: 4476,
    height: 4054,
    alt: "Six-panel TCGA projection figure showing cohort metrics, attenuation of a global score component, cancer-type centroids, a cancer-type heat map, variance explained, and residual axis correlations.",
    accessibleDescription:
      "Among 9,302 tumors from 33 cancer types, 15 raw CGT scores share a strong global component: raw PC1 explains 83.0% of score variance and mean absolute inter-axis correlation is 0.753. Centering and leave-one-axis-out residualization reduce these quantities, after which cancer-type structure remains. This is a separate descriptive bulk-tumor manifestation analysis, not causal or patient-level validation.",
    caption: [
      "a, Corrected TCGA/Xena projection inputs after expression-QC filtering: 9,302 tumors, 33 cancer types, 15 CGT axes, and 970 retained CGT-axis genes. b, Raw scores contain a dominant shared component (PC1 = 83.0%; mean absolute inter-axis Spearman correlation = 0.753). Sample centering and leave-one-axis-out global residualization reduce mean absolute correlation to 0.279 and 0.265, respectively.",
      "c–d, Tumors and cancer-type centroids in residualized CGT principal-component space, with row-standardized cancer-type mean residual scores. e–f, Axis-specific cancer-type R² and the residualized inter-axis correlation matrix.",
      "The projection uses bulk tumors and remains confounded by lineage, tumor purity, stromal and immune composition, and other cohort structure. TCGA was not used to discover the axes and is not treated as causal validation.",
    ],
    sourceRun: "CGT_FIGURE_005",
    sourceNotebook: "CGT-FIGURE-005_TCGA_orthogonal_projection.ipynb",
    notebookSha256: "72d1efabe3dd8c0447817dedae3d6004b47374065eb90f83f9179ad8d525fb81",
    imageSha256: "d3db92b253699c50a8e1adcab5ea64866c9a8172b933eeb34bbe009e90a957cb",
    upstreamRuns: ["CGT_TCGA_002"],
    freezeStatus: "Analysis-frozen supporting projection",
    qaNote: "The final presentation layer has a text audit but no equivalent Nature-style compliance report.",
  },
];

export const supplementaryFigures: FigureSpec[] = [
  {
    id: "fig-s1",
    label: "Supplementary Figure 1",
    title: "Current generalization boundary of the CGT fitness predictor",
    role: "supplementary",
    image: `${supplementRoot}/figure-s01-generalization-boundary.png`,
    pdf: `${supplementRoot}/figure-s01-generalization-boundary.pdf`,
    svg: `${supplementRoot}/figure-s01-generalization-boundary.svg`,
    width: 4322,
    height: 1842,
    alt: "Regression and classification performance under gene, program-family, dataset, context, and study-proxy holdouts.",
    accessibleDescription:
      "Strong five-fold held-out-gene performance does not transport uniformly to harder exclusion structures. Program-family, dataset, context, and study-proxy results are heterogeneous and often weak or below chance, establishing a boundary on the main predictive claim.",
    caption: [
      "Random-forest regression and essential-gene classification across progressively harder holdout structures. Points denote held-out folds or program families and horizontal bars denote medians. Because the analyses use different sample units, this is a boundary audit rather than a single matched benchmark.",
      "Mean regression Spearman ρ falls to 0.1268 under held-out program families, 0.0919 under held-out datasets, −0.0548 under held-out contexts, and −0.1422 under held-out study proxies. Regression and thresholded classification are complementary views of the same GeneEffect source, not independent confirmations.",
    ],
    sourceRun: "CGT_FIGURE_001",
    sourceNotebook: "CGT-FIGURE-001_residual_geometry_predicts_gene_fitness.ipynb",
    notebookSha256: "b9082d525c9f6aa58bf3cffa9ce56abf8e5f9bf2cf121c018a07497470fd1825",
    imageSha256: "e19de338ffeff33b7c9230e09fb31cd714650cc1ba4c942a7a8d6e46e86746f4",
    upstreamRuns: ["CGT_PREDICT_005", "CGT_CONSTRAINT_002E"],
    freezeStatus: "Analysis-frozen; minor publication polish recorded",
    qaNote: "Listed compliance checks pass.",
  },
  {
    id: "fig-s2",
    label: "Supplementary Figure 2",
    title: "Repeated-label residual reliability depends on context breadth",
    role: "supplementary",
    image: `${supplementRoot}/figure-s02-residual-reliability.png`,
    pdf: `${supplementRoot}/figure-s02-residual-reliability.pdf`,
    svg: `${supplementRoot}/figure-s02-residual-reliability.svg`,
    width: 4322,
    height: 1842,
    alt: "Violin plots comparing residual-vector reliability for perturbation labels repeated within one context versus across multiple contexts.",
    accessibleDescription:
      "The distribution of pairwise residual-vector cosine similarity is broader and generally less stable for labels spanning multiple biological contexts. Within-context recurrence therefore cannot be read as context-general transportability.",
    caption: [
      "Median pairwise residual-vector cosine for labels represented in at least two datasets within one context, compared with labels represented across at least two contexts. Violins show label-level distributions; horizontal lines show medians and points show individual labels.",
    ],
    sourceRun: "CGT_FIGURE_002",
    sourceNotebook: "CGT-FIGURE-002_recurrent_residual_geometry.ipynb",
    notebookSha256: "f8046ecb45971bb4d81288af00c0bca5ac2b075e2db6ae1dcd602dbebdf017d8",
    imageSha256: "1bb0b0c62b358492d8c10babf1810f34d01d996bde9598b023ad0319fcff44af",
    upstreamRuns: ["CGT_META_003", "CGT_PREDICT_003B"],
    freezeStatus: "Analysis-frozen; minor publication polish recorded",
    qaNote: "Minimum embedded text is 4.35 pt; full-resolution formats are provided.",
  },
  {
    id: "fig-s3",
    label: "Supplementary Figure 3",
    title: "External pathway support for six supporting CGT axes",
    role: "supplementary",
    image: `${supplementRoot}/figure-s03-supporting-axes.png`,
    pdf: `${supplementRoot}/figure-s03-supporting-axes.pdf`,
    svg: `${supplementRoot}/figure-s03-supporting-axes.svg`,
    width: 4322,
    height: 3188,
    alt: "Six enrichment panels for chromatin-cytokine, oxidative phosphorylation, lysosome-ECM, rRNA biogenesis, sterol-SREBP, and T-cell receptor candidate axes.",
    accessibleDescription:
      "Six non-headline axes show representative pathway enrichments, but the evidence varies by axis and depends on overlapping gene-set resources. The figure extends annotation coverage without converting the axes into established mechanistic units.",
    caption: [
      "Representative nonredundant terms for F10 chromatin–cytokine, F7 oxidative phosphorylation/TCA respiration, F10-negative lysosome/ECM, F11 rRNA biogenesis, the F5/F6 sterol/SREBP pair, and F1 antigen-receptor/T-cell signalling. Circles denote ORA and triangles denote continuous rank enrichment.",
    ],
    sourceRun: "CGT_FIGURE_003",
    sourceNotebook: "CGT-FIGURE-003_signed_dimensions_candidate_axes.ipynb",
    notebookSha256: "db46164d1d6ea035b50352f358a5d6fe93c39dca967f9cb6b87279538eb81b19",
    imageSha256: "5d63e2588a3e083f8b14903e162ce785e59e9c19c47cfc6da19d630f14b4ebde",
    upstreamRuns: ["CGT_CONSTRAINT_001B", "CGT_CONSTRAINT_002D", "CGT_CONSTRAINT_002E", "CGT_META_003", "CGT_PREDICT_005"],
    freezeStatus: "Analysis-frozen; minor publication polish recorded",
    qaNote: "Minimum embedded text is 4.20 pt; full-resolution formats are provided.",
  },
  {
    id: "fig-s4",
    label: "Supplementary Figure 4",
    title: "Full collapsed-axis evidence atlas and curation outcome",
    role: "supplementary",
    image: `${supplementRoot}/figure-s04-full-evidence-atlas.png`,
    pdf: `${supplementRoot}/figure-s04-full-evidence-atlas.pdf`,
    svg: `${supplementRoot}/figure-s04-full-evidence-atlas.svg`,
    width: 4322,
    height: 3425,
    alt: "Evidence matrix for all collapsed candidate axes alongside counts assigned to headline, supporting, exploratory, and excluded tiers.",
    accessibleDescription:
      "The complete atlas makes the curation boundary visible: not all latent directions were promoted to interpretable axes, and excluded or unresolved groups remain in the record. Evidence dimensions are scaled separately and should not be treated as commensurate measurements.",
    caption: [
      "a, Integrated evidence matrix for all collapsed biological-axis groups, including headline, supporting, exploratory, and excluded groups. Colors are normalized within evidence dimension and cells retain raw values. b, Number of groups assigned to each curation tier.",
    ],
    sourceRun: "CGT_FIGURE_004",
    sourceNotebook: "CGT-FIGURE-004_integrated_evidence_atlas_and_constraint_model.ipynb",
    notebookSha256: "6fe89a92fd3a7127cb5d80e7b60158e748f4ba3a2a48f552dff3c2010f09b704",
    imageSha256: "871b87a15992f8d0268e9cfe7c0cfbb031e1642c2effaf7ccbd9e6fac960dbc7",
    upstreamRuns: ["CGT_META_003", "CGT_PREDICT_003B", "CGT_PREDICT_005", "CGT_CONSTRAINT_001B", "CGT_CONSTRAINT_002", "CGT_CONSTRAINT_002E"],
    freezeStatus: "Analysis-frozen synthesis supplement",
    qaNote: "The source run records small-text and clipping diagnostics; full-resolution formats are provided.",
  },
  {
    id: "fig-s5",
    label: "Supplementary Figure 5",
    title: "TCGA expression-quality filter",
    role: "supplementary",
    image: `${supplementRoot}/figure-s05-tcga-expression-qc.png`,
    pdf: `${supplementRoot}/figure-s05-tcga-expression-qc.pdf`,
    svg: `${supplementRoot}/figure-s05-tcga-expression-qc.svg`,
    width: 2005,
    height: 1487,
    alt: "Histogram of tumor-sample median expression across retained CGT-axis genes with the low-expression exclusion threshold marked.",
    accessibleDescription:
      "Most tumors lie well above the predefined sample-median expression threshold; a small low-expression tail is excluded before projection. This is a sample-level input-quality filter, not an outcome-based exclusion.",
    caption: [
      "Distribution of sample median expression across retained CGT-axis genes. The vertical line marks the expression-QC threshold applied before the corrected TCGA projection.",
    ],
    sourceRun: "CGT_FIGURE_005",
    sourceNotebook: "CGT-FIGURE-005_TCGA_orthogonal_projection.ipynb",
    notebookSha256: "72d1efabe3dd8c0447817dedae3d6004b47374065eb90f83f9179ad8d525fb81",
    imageSha256: "851a35dd9452fce79a5ced8e4dbd97fbe4a33ca31bd2b993636fe96572645018",
    upstreamRuns: ["CGT_TCGA_002"],
    freezeStatus: "Analysis-frozen supporting QC",
    qaNote: "Text audit available; no equivalent Nature-style compliance report.",
  },
  {
    id: "fig-s6",
    label: "Supplementary Figure 6",
    title: "CGT-axis principal-component variance spectrum",
    role: "supplementary",
    image: `${supplementRoot}/figure-s06-tcga-pc-variance.png`,
    pdf: `${supplementRoot}/figure-s06-tcga-pc-variance.pdf`,
    svg: `${supplementRoot}/figure-s06-tcga-pc-variance.svg`,
    width: 1966,
    height: 1578,
    alt: "Line plot of variance explained by the first five principal components for raw, centered, and leave-one-axis-out residualized TCGA CGT scores.",
    accessibleDescription:
      "Raw scores are dominated by PC1 at 83.0% explained variance. After centering or leave-one-axis-out residualization, PC1 falls to 33.2% and 32.2%, respectively, distributing variation more broadly across components.",
    caption: [
      "Explained-variance spectra for raw, sample-centered, and leave-one-axis-out global-residualized TCGA CGT-axis matrices. The reduction of raw PC1 from 83.0% to approximately 32–33% is a quality-control result, not proof that all confounding was removed.",
    ],
    sourceRun: "CGT_FIGURE_005",
    sourceNotebook: "CGT-FIGURE-005_TCGA_orthogonal_projection.ipynb",
    notebookSha256: "72d1efabe3dd8c0447817dedae3d6004b47374065eb90f83f9179ad8d525fb81",
    imageSha256: "0e14d13450285cd38917a7250f32b9ec6e965c6404dadd83a2907078499abb85",
    upstreamRuns: ["CGT_TCGA_002"],
    freezeStatus: "Analysis-frozen supporting QC",
    qaNote: "Text audit available; no equivalent Nature-style compliance report.",
  },
];

export const references: Reference[] = [
  { key: "dixit2016", authors: "Dixit, A. et al.", title: "Perturb-Seq: dissecting molecular circuits with scalable single-cell RNA profiling of pooled genetic screens", journal: "Cell", year: "2016", details: "167, 1853–1866.e17", doi: "10.1016/j.cell.2016.11.038", href: "https://doi.org/10.1016/j.cell.2016.11.038" },
  { key: "adamson2016", authors: "Adamson, B. et al.", title: "A multiplexed single-cell CRISPR screening platform enables systematic dissection of the unfolded protein response", journal: "Cell", year: "2016", details: "167, 1867–1882.e21", doi: "10.1016/j.cell.2016.11.048", href: "https://doi.org/10.1016/j.cell.2016.11.048" },
  { key: "datlinger2017", authors: "Datlinger, P. et al.", title: "Pooled CRISPR screening with single-cell transcriptome readout", journal: "Nature Methods", year: "2017", details: "14, 297–301", doi: "10.1038/nmeth.4177", href: "https://doi.org/10.1038/nmeth.4177" },
  { key: "norman2019", authors: "Norman, T. M. et al.", title: "Exploring genetic interaction manifolds constructed from rich single-cell phenotypes", journal: "Science", year: "2019", details: "365, 786–793", doi: "10.1126/science.aax4438", href: "https://doi.org/10.1126/science.aax4438" },
  { key: "replogle2022", authors: "Replogle, J. M. et al.", title: "Mapping information-rich genotype–phenotype landscapes with genome-scale Perturb-seq", journal: "Cell", year: "2022", details: "185, 2559–2575.e28", doi: "10.1016/j.cell.2022.05.013", href: "https://doi.org/10.1016/j.cell.2022.05.013" },
  { key: "srivatsan2020", authors: "Srivatsan, S. R. et al.", title: "Massively multiplex chemical transcriptomics at single-cell resolution", journal: "Science", year: "2020", details: "367, 45–51", doi: "10.1126/science.aax6234", href: "https://doi.org/10.1126/science.aax6234" },
  { key: "lotfollahi2023", authors: "Lotfollahi, M. et al.", title: "Predicting cellular responses to complex perturbations in high-throughput screens", journal: "Molecular Systems Biology", year: "2023", details: "19, e11517", doi: "10.15252/msb.202211517", href: "https://doi.org/10.15252/msb.202211517" },
  { key: "ahlmanneltze2025", authors: "Ahlmann-Eltze, C. et al.", title: "Deep-learning-based gene perturbation effect prediction does not yet outperform simple linear baselines", journal: "Nature Methods", year: "2025", details: "22, 1657–1661", doi: "10.1038/s41592-025-02772-6", href: "https://doi.org/10.1038/s41592-025-02772-6" },
  { key: "tsherniak2017", authors: "Tsherniak, A. et al.", title: "Defining a Cancer Dependency Map", journal: "Cell", year: "2017", details: "170, 564–576.e16", doi: "10.1016/j.cell.2017.06.010", href: "https://doi.org/10.1016/j.cell.2017.06.010" },
  { key: "meyers2017", authors: "Meyers, R. M. et al.", title: "Computational correction of copy-number effect improves specificity of CRISPR–Cas9 essentiality screens in cancer cells", journal: "Nature Genetics", year: "2017", details: "49, 1779–1784", doi: "10.1038/ng.3984", href: "https://doi.org/10.1038/ng.3984" },
  { key: "dempster2021", authors: "Dempster, J. M. et al.", title: "Chronos: a cell population dynamics model of CRISPR experiments that improves inference of gene fitness effects", journal: "Genome Biology", year: "2021", details: "22, 343", doi: "10.1186/s13059-021-02540-7", href: "https://doi.org/10.1186/s13059-021-02540-7" },
  { key: "depmap26q1", authors: "DepMap, Broad Institute", title: "DepMap 26Q1 public release", journal: "DepMap Community Forum", year: "2026", details: "Quarterly data-release announcement", href: "https://forum.depmap.org/t/announcing-the-26q1-release/4606" },
  { key: "tcga2013", authors: "The Cancer Genome Atlas Research Network et al.", title: "The Cancer Genome Atlas Pan-Cancer analysis project", journal: "Nature Genetics", year: "2013", details: "45, 1113–1120", doi: "10.1038/ng.2764", href: "https://doi.org/10.1038/ng.2764" },
  { key: "vivian2017", authors: "Vivian, J. et al.", title: "Toil enables reproducible, open source, big biomedical data analyses", journal: "Nature Biotechnology", year: "2017", details: "35, 314–316", doi: "10.1038/nbt.3772", href: "https://doi.org/10.1038/nbt.3772" },
  { key: "goldman2020", authors: "Goldman, M. J. et al.", title: "Visualizing and interpreting cancer genomics data via the Xena platform", journal: "Nature Biotechnology", year: "2020", details: "38, 675–678", doi: "10.1038/s41587-020-0546-8", href: "https://doi.org/10.1038/s41587-020-0546-8" },
  { key: "hoadley2018", authors: "Hoadley, K. A. et al.", title: "Cell-of-Origin Patterns Dominate the Molecular Classification of 10,000 Tumors from 33 Types of Cancer", journal: "Cell", year: "2018", details: "173, 291–304.e6", doi: "10.1016/j.cell.2018.03.022", href: "https://doi.org/10.1016/j.cell.2018.03.022" },
  { key: "aran2015", authors: "Aran, D., Sirota, M. & Butte, A. J.", title: "Systematic pan-cancer analysis of tumour purity", journal: "Nature Communications", year: "2015", details: "6, 8971", doi: "10.1038/ncomms9971", href: "https://doi.org/10.1038/ncomms9971" },
  { key: "subramanian2005", authors: "Subramanian, A. et al.", title: "Gene set enrichment analysis: a knowledge-based approach for interpreting genome-wide expression profiles", journal: "Proceedings of the National Academy of Sciences USA", year: "2005", details: "102, 15545–15550", doi: "10.1073/pnas.0506580102", href: "https://doi.org/10.1073/pnas.0506580102" },
  { key: "tamayo2016", authors: "Tamayo, P. et al.", title: "The limitations of simple gene set enrichment analysis assuming gene independence", journal: "Statistical Methods in Medical Research", year: "2016", details: "25, 472–487", doi: "10.1177/0962280212460441", href: "https://doi.org/10.1177/0962280212460441" },
  { key: "liberzon2015", authors: "Liberzon, A. et al.", title: "The Molecular Signatures Database Hallmark Gene Set Collection", journal: "Cell Systems", year: "2015", details: "1, 417–425", doi: "10.1016/j.cels.2015.12.004", href: "https://doi.org/10.1016/j.cels.2015.12.004" },
  { key: "gillespie2022", authors: "Gillespie, M. et al.", title: "The Reactome pathway knowledgebase 2022", journal: "Nucleic Acids Research", year: "2022", details: "50, D687–D692", doi: "10.1093/nar/gkab1028", href: "https://doi.org/10.1093/nar/gkab1028" },
  { key: "go2021", authors: "The Gene Ontology Consortium", title: "The Gene Ontology resource: enriching a GOld mine", journal: "Nucleic Acids Research", year: "2021", details: "49, D325–D334", doi: "10.1093/nar/gkaa1113", href: "https://doi.org/10.1093/nar/gkaa1113" },
  { key: "kanehisa2000", authors: "Kanehisa, M. & Goto, S.", title: "KEGG: Kyoto Encyclopedia of Genes and Genomes", journal: "Nucleic Acids Research", year: "2000", details: "28, 27–30", doi: "10.1093/nar/28.1.27", href: "https://doi.org/10.1093/nar/28.1.27" },
  { key: "benjamini1995", authors: "Benjamini, Y. & Hochberg, Y.", title: "Controlling the false discovery rate: a practical and powerful approach to multiple testing", journal: "Journal of the Royal Statistical Society: Series B", year: "1995", details: "57, 289–300", doi: "10.1111/j.2517-6161.1995.tb02031.x", href: "https://doi.org/10.1111/j.2517-6161.1995.tb02031.x" },
  { key: "breiman2001", authors: "Breiman, L.", title: "Random forests", journal: "Machine Learning", year: "2001", details: "45, 5–32", doi: "10.1023/A:1010933404324", href: "https://doi.org/10.1023/A:1010933404324" },
  { key: "hoerl1970", authors: "Hoerl, A. E. & Kennard, R. W.", title: "Ridge regression: biased estimation for nonorthogonal problems", journal: "Technometrics", year: "1970", details: "12, 55–67", doi: "10.1080/00401706.1970.10488634", href: "https://doi.org/10.1080/00401706.1970.10488634" },
  { key: "phipson2010", authors: "Phipson, B. & Smyth, G. K.", title: "Permutation P-values should never be zero: calculating exact P-values when permutations are randomly drawn", journal: "Statistical Applications in Genetics and Molecular Biology", year: "2010", details: "9, Article 39", doi: "10.2202/1544-6115.1585", href: "https://doi.org/10.2202/1544-6115.1585" },
  { key: "efron1979", authors: "Efron, B.", title: "Bootstrap methods: another look at the jackknife", journal: "The Annals of Statistics", year: "1979", details: "7, 1–26", doi: "10.1214/aos/1176344552", href: "https://doi.org/10.1214/aos/1176344552" },
  { key: "huang2005", authors: "Huang, S., Eichler, G., Bar-Yam, Y. & Ingber, D. E.", title: "Cell fates as high-dimensional attractor states of a complex gene regulatory network", journal: "Physical Review Letters", year: "2005", details: "94, 128701", doi: "10.1103/PhysRevLett.94.128701", href: "https://doi.org/10.1103/PhysRevLett.94.128701" },
];

export const referenceIndex = new Map(references.map((reference, index) => [reference.key, index + 1]));
