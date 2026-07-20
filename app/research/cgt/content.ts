export type FigureRole = "core" | "synthesis" | "supporting" | "supplementary";

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
  caption: string[];
  sourceRun: string;
  sourceNotebook: string;
  notebookSha256: string;
  imageSha256: string;
  upstreamRuns: string[];
  freezeStatus: string;
  qaNote: string;
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

export const mainFigures: FigureSpec[] = [
  {
    id: "fig-1",
    label: "Figure 1",
    title: "Residual perturbation geometry predicts external CRISPR-derived gene fitness",
    role: "core",
    image: `${mainRoot}/figure-01-fitness.png`,
    pdf: `${mainRoot}/figure-01-fitness.pdf`,
    svg: `${mainRoot}/figure-01-fitness.svg`,
    width: 4322,
    height: 3897,
    alt: "Six-panel validation figure showing the CGT workflow, supervised-stage test-gene predictions, permutation controls, conditional ridge weights, and robustness across feature constructions.",
    accessibleDescription:
      "The main relationship is predictive rather than causal: gene-level CGT coordinates are associated with an external CRISPR fitness endpoint under supervised-stage held-out-gene cross-validation. The test-gene CGT features were measured rather than predicted. Performance exceeds 100 endpoint-shuffle controls, while harder grouping schemes in Supplementary Figure 1 sharply reduce generalization.",
    caption: [
      "a, Perturbational responses from 39 datasets across 8 contexts were residualized against context, represented in 16 CGT family coordinates, aggregated by gene, and compared with the external DepMap CRISPR GeneEffect endpoint using grouped supervised-stage held-out-gene cross-validation.",
      "b, Out-of-fold predictions for 1,229 genes. Higher essentiality strength denotes greater knockout-associated fitness loss; pooled Spearman ρ = 0.613 and R² = 0.353.",
      "c–d, Five-fold random-forest regression and essential-gene classification compared with 100 independent endpoint shuffles. Shuffle-level one-sided Monte Carlo permutation P = 1/101 = 0.0099 for both endpoint views; folds nested within a shuffle were averaged before testing.",
      "e, Standardized coefficients from a multivariable ridge model. Signs are conditional predictive weights and do not identify causal effects. f, Performance across three residualization schemes and three gene-level aggregation choices.",
    ],
    sourceRun: "CGT_FIGURE_001",
    sourceNotebook: "CGT-FIGURE-001_residual_geometry_predicts_gene_fitness.ipynb",
    notebookSha256: "b9082d525c9f6aa58bf3cffa9ce56abf8e5f9bf2cf121c018a07497470fd1825",
    imageSha256: "4ef9856a05c2e3cce9f3547a2164cd8875b0190509748262bb1b69fae0f0c146",
    upstreamRuns: ["CGT_PREDICT_005", "CGT_CONSTRAINT_002E"],
    freezeStatus: "Analysis-frozen; minor publication polish recorded",
    qaNote: "All listed publication-style compliance checks passed.",
  },
  {
    id: "fig-2",
    label: "Figure 2",
    title: "Residual perturbation geometry recurs in related datasets but attenuates under context transfer",
    role: "core",
    image: `${mainRoot}/figure-02-recurrent-geometry.png`,
    pdf: `${mainRoot}/figure-02-recurrent-geometry.pdf`,
    svg: `${mainRoot}/figure-02-recurrent-geometry.svg`,
    width: 4322,
    height: 4015,
    alt: "Six-panel atlas of dataset composition, residual variance, family recurrence, perturbation-label transfer, controls, and increasingly strict generalization tests.",
    accessibleDescription:
      "Same-label residual prediction gives mean cosine similarity near 0.56 under leave-dataset-out evaluation, while shuffled and random-label controls are near zero. The apparent recurrence is not invariant: mean cosine falls to about 0.035 after exclusion of same-study proxies and to about 0.079 under leave-context-out evaluation.",
    caption: [
      "a, The residual-prediction atlas contains 2,720 perturbation observations from 39 datasets and 8 contexts. b, Residual and baseline fractions under context, dataset-shrinkage, and dataset residualization.",
      "c–d, Distribution and recurrence of 248 perturbation modes from 43 datasets and 9 contexts across 16 unsupervised families. The family classes are descriptive summaries of recurrence, not universal biological laws.",
      "e, Held-out same-label residual predictions achieve mean cosine 0.563 for context residuals and 0.558 for dataset-shrinkage residuals; label-shuffled and random-label controls give −0.020 and −0.012, respectively.",
      "f, Transfer attenuates under stricter exclusions. For context residuals, mean cosine is 0.563 for leave-dataset-out, 0.035 after same-study-proxy exclusion, and 0.079 for leave-context-out. Error bars are 95% cluster-bootstrap intervals from 4,000 resamples.",
    ],
    sourceRun: "CGT_FIGURE_002",
    sourceNotebook: "CGT-FIGURE-002_recurrent_residual_geometry.ipynb",
    notebookSha256: "f8046ecb45971bb4d81288af00c0bca5ac2b075e2db6ae1dcd602dbebdf017d8",
    imageSha256: "39683bf1c8d03438d24585a155cfb212804a4aa2045f137b2835ed5cef376477",
    upstreamRuns: ["CGT_META_003", "CGT_PREDICT_003B"],
    freezeStatus: "Analysis-frozen; minor publication polish recorded",
    qaNote: "Minimum embedded text is 4.35 pt, below the project’s 5–7 pt target; full-resolution formats are provided.",
  },
  {
    id: "fig-3",
    label: "Figure 3",
    title: "Signed dimensions map to candidate biological axes",
    role: "core",
    image: `${mainRoot}/figure-03-signed-axes.png`,
    pdf: `${mainRoot}/figure-03-signed-axes.pdf`,
    svg: `${mainRoot}/figure-03-signed-axes.svg`,
    width: 4322,
    height: 4015,
    alt: "Six-panel signed-axis annotation figure combining pathway enrichment, predictive weights, essentiality associations, and representative cytokine, chromatin, and translation terms.",
    accessibleDescription:
      "Nine curated candidate axes receive varying degrees of support from signed gene-set enrichment and fitness-related associations. Three headline interpretations—cytokine/JAK–STAT, chromatin/epigenetic regulation, and translation/ribosome-associated quality control—are highlighted. These are annotations of latent directions, not proven regulatory modules.",
    caption: [
      "a, Signed coordinate tails were evaluated with top-tail over-representation analysis (ORA) and continuous rank enrichment, de-duplicated, consolidated across sibling directions, and manually reviewed for evidence and failure modes.",
      "b–c, Multi-evidence profiles for three headline and six supporting candidate axes, and the relationship between parent-family predictive weight and essentiality association. Color is normalized within each evidence dimension; printed values remain the quantitative basis.",
      "d–f, Representative external gene-set enrichments for cytokine/interleukin/JAK–STAT signalling, chromatin and epigenetic regulation, and translation/ribosome-associated quality control. ORA and rank enrichment are related tests on overlapping inputs and are not independent replications.",
    ],
    sourceRun: "CGT_FIGURE_003",
    sourceNotebook: "CGT-FIGURE-003_signed_dimensions_candidate_axes.ipynb",
    notebookSha256: "db46164d1d6ea035b50352f358a5d6fe93c39dca967f9cb6b87279538eb81b19",
    imageSha256: "129e69cdae2a9866fcb83073e30e4d48b3c90592931eb6cd8907d315cccc73fa",
    upstreamRuns: ["CGT_CONSTRAINT_001B", "CGT_CONSTRAINT_002D", "CGT_CONSTRAINT_002E", "CGT_META_003", "CGT_PREDICT_005"],
    freezeStatus: "Analysis-frozen; minor publication polish recorded",
    qaNote: "Minimum embedded text is 4.20 pt; the page provides full-resolution PNG, SVG, and PDF versions.",
  },
  {
    id: "fig-4",
    label: "Figure 4",
    title: "Integrated evidence atlas and hierarchical CGT interpretation",
    role: "synthesis",
    image: `${mainRoot}/figure-04-evidence-atlas.png`,
    pdf: `${mainRoot}/figure-04-evidence-atlas.pdf`,
    svg: `${mainRoot}/figure-04-evidence-atlas.svg`,
    width: 4322,
    height: 4015,
    alt: "Five-panel synthesis showing the CGT evidence hierarchy, integrated candidate-axis matrix, atlas, generalization boundary, and hierarchical conceptual interpretation.",
    accessibleDescription:
      "This figure combines previously reported recurrence, transfer, fitness prediction, and biological annotation into one evidence hierarchy. It adds no independent validation. Its most important distinction is between supported data-derived observations and the still-hypothetical claim of a universal causal constraint law.",
    caption: [
      "a, Evidence hierarchy distinguishing empirical observations, conclusions, speculation, and predictions. b–c, Integrated evidence matrix and atlas for three headline and six supporting candidate axes.",
      "d, Separate boundary audits for residual transfer and fitness prediction. The tracks use different sample units and quantitative scales and should not be compared as if they were one benchmark.",
      "e, Hierarchical conceptual interpretation suggested by the evidence: recurrent residual axes are realized with context-dependent weighting and deformation before association with fitness consequences or target liabilities. Context-general causal universality remains hypothetical.",
    ],
    sourceRun: "CGT_FIGURE_004",
    sourceNotebook: "CGT-FIGURE-004_integrated_evidence_atlas_and_constraint_model.ipynb",
    notebookSha256: "6fe89a92fd3a7127cb5d80e7b60158e748f4ba3a2a48f552dff3c2010f09b704",
    imageSha256: "d1d9150df2cb99759e21b1987dfba25f51b48bb867415c027e963f1bc2524fcc",
    upstreamRuns: ["CGT_META_003", "CGT_PREDICT_003B", "CGT_PREDICT_005", "CGT_CONSTRAINT_001B", "CGT_CONSTRAINT_002", "CGT_CONSTRAINT_002E"],
    freezeStatus: "Analysis-frozen synthesis; not independent validation",
    qaNote: "Minimum embedded text is 4.50 pt and the source audit records three clipping diagnostics; full-resolution downloads are provided.",
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
