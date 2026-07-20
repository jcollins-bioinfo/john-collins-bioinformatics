import type { Metadata } from "next";
import {
  ArticleSection,
  Citation,
  ReferencesList,
  ScientificFigure,
} from "./publication-components";
import { mainFigures, references, supplementaryFigures } from "./content";
import styles from "./publication.module.css";

const title = "Context-conditioned perturbation geometry links recurrent transcriptional responses to gene fitness";
const description =
  "A provenance-tracked CGT project report integrating perturbational transcriptomics, CRISPR fitness screens, signed biological axes, and TCGA tumor-state projections.";

export const metadata: Metadata = {
  title: "CGT project report: context-conditioned perturbation geometry",
  description,
  alternates: { canonical: "/research/cgt" },
  openGraph: {
    type: "article",
    url: "https://johnpatrickcollins.info/research/cgt",
    title,
    description,
    publishedTime: "2026-07-20T00:00:00Z",
    modifiedTime: "2026-07-20T00:00:00Z",
    authors: ["John Patrick Collins"],
    images: [
      {
        url: "/research/cgt/figures/main/figure-04-evidence-atlas.png",
        width: 4322,
        height: 4015,
        alt: "Integrated CGT evidence atlas and hierarchical conceptual interpretation",
      },
    ],
  },
};

const articleJsonLd = {
  "@context": "https://schema.org",
  "@type": "ScholarlyArticle",
  headline: title,
  description,
  author: {
    "@type": "Person",
    name: "John Patrick Collins",
    url: "https://johnpatrickcollins.info",
  },
  datePublished: "2026-07-20",
  dateModified: "2026-07-20",
  version: "0.1",
  creativeWorkStatus: "Preprint-style independent research report; not peer reviewed",
  isAccessibleForFree: true,
  inLanguage: "en",
  url: "https://johnpatrickcollins.info/research/cgt",
  image: "https://johnpatrickcollins.info/research/cgt/figures/main/figure-04-evidence-atlas.png",
  about: [
    "perturbational transcriptomics",
    "single-cell genomics",
    "gene fitness",
    "context-dependent biological response",
  ],
  keywords: [
    "Constraint Geometry Theory",
    "CGT",
    "Contextual Operator Response Dynamics",
    "CORD",
    "Perturb-seq",
    "DepMap",
    "TCGA",
  ],
  citation: references.map((reference) => reference.href),
};

const contents = [
  ["Abstract", "abstract"],
  ["Introduction", "introduction"],
  ["Results", "results"],
  ["Methods", "methods"],
  ["Discussion", "discussion"],
  ["CGT → CORD", "cord"],
  ["Supplementary figures", "supplementary"],
  ["References", "references"],
] as const;

export default function CgtPage() {
  return (
    <main id="top" className={`interior-page cgt-page ${styles.page}`}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />

      <article>
        <header className={styles.hero}>
          <div className={`shell ${styles.heroGrid}`}>
            <div className={styles.heroCopy}>
              <p className={styles.kicker}><span /> CGT / independent research report</p>
              <h1>{title}</h1>
              <p className={styles.heroLede}>
                A frozen evidence synthesis across perturbational transcriptomics,
                CRISPR-derived gene fitness, signed biological annotation, and
                supporting tumor-state projection.
              </p>
            </div>
            <aside className={styles.statusCard} aria-label="Publication status">
              <div><span>STATUS</span><b>PREPRINT-STYLE REPORT</b></div>
              <p>
                The analyses are frozen; the report is independently authored,
                has not been peer reviewed, and does not establish a universal
                causal theory.
              </p>
              <dl>
                <div><dt>Analysis freeze</dt><dd>15 July 2026</dd></div>
                <div><dt>Web report</dt><dd>20 July 2026</dd></div>
                <div><dt>Author</dt><dd>John Patrick Collins</dd></div>
                <div><dt>Version</dt><dd>0.1</dd></div>
              </dl>
            </aside>
          </div>
        </header>

        <section className={`shell ${styles.metricStrip}`} aria-label="Study scale">
          <div><strong>43</strong><span>datasets in recurrence atlas</span></div>
          <div><strong>9</strong><span>annotated contexts</span></div>
          <div><strong>16</strong><span>unsupervised families</span></div>
          <div><strong>1,229</strong><span>genes in fitness benchmark</span></div>
        </section>

        <nav className={styles.contents} aria-label="Article contents">
          <div className="shell">
            <p>CONTENTS</p>
            <ol>
              {contents.map(([label, href], index) => (
                <li key={href}>
                  <a href={`#${href}`}><span>{String(index + 1).padStart(2, "0")}</span>{label}</a>
                </li>
              ))}
            </ol>
          </div>
        </nav>

        <div className={`shell ${styles.articleShell}`}>
          <ArticleSection id="abstract" index="01 / ABSTRACT" title="Abstract">
            <div className={styles.abstract}>
              <p>
                Single-cell perturbation assays measure transcriptome-wide responses
                to controlled interventions, but differences among cell types, studies,
                and experimental platforms complicate the identification of portable
                response structure. Here, Constraint Geometry Theory (CGT) evaluated
                whether perturbational responses could be represented in a recurrent
                coordinate system after accounting for context-associated baselines,
                and whether those coordinates related to an external measure of gene
                fitness.
              </p>
              <p>
                Across 43 datasets and 9 contexts, CGT organized 248 perturbation modes
                into 16 families; a prediction-focused subset contained 2,720
                perturbation observations from 39 datasets and 8 contexts. Residual
                responses from repeated perturbations showed directional agreement in
                related settings (mean cosine similarity 0.56, with shuffled and
                random-label controls near zero). Gene-aggregated coordinates predicted
                an external DepMap CRISPR GeneEffect endpoint for 1,229 genes held out
                from the supervised mapping (pooled out-of-fold
                Spearman ρ = 0.61, R² = 0.35; mean five-fold classification ROC AUC =
                0.92; one-sided Monte Carlo permutation P = 0.0099 from 100 endpoint
                shuffles).
              </p>
              <p>
                Signed-coordinate enrichment supported 3 headline and 6 supporting
                candidate biological axes. However, transfer attenuated markedly when
                same-study proxies or entire contexts were excluded, and fitness
                prediction weakened under harder grouped holdouts. CGT therefore
                supports a context-conditioned descriptive and predictive geometry,
                not a universal causal law. This boundary motivated CORD—Contextual
                Operator Response Dynamics—a prospective framework in which response
                is conditioned on both perturbational load and cellular context.
              </p>
            </div>
          </ArticleSection>

          <ArticleSection id="introduction" index="02 / INTRODUCTION" title="Introduction">
            <div className={styles.prose}>
              <p className={styles.lead}>
                Pooled single-cell perturbation assays connect controlled genetic or
                chemical interventions to high-dimensional molecular phenotypes,
                enabling systematic studies of regulatory response at cellular
                resolution.<Citation references={["dixit2016", "adamson2016", "datlinger2017", "srivatsan2020"]} />
              </p>
              <p>
                Perturb-seq and related designs have made it possible to read out many
                perturbations in one experiment, and subsequent studies have shown that
                information-rich response phenotypes can be arranged into lower-dimensional
                interaction landscapes.<Citation references={["norman2019", "replogle2022"]} />
                Yet a compact representation is not automatically a mechanistic one:
                latent axes depend on normalization, coordinate choice, cell state,
                perturbation modality, and the experimental contexts represented in the
                training data.
              </p>
              <p>
                The unresolved question is therefore not merely whether recurrent
                structure can be found, but what survives stringent changes in study and
                context. Models of cellular perturbation often interpolate effectively
                within represented settings, whereas transport to unseen perturbations or
                cellular backgrounds remains a distinct empirical problem.<Citation references={["lotfollahi2023", "ahlmanneltze2025"]} />
                In parallel, large-scale cancer dependency projects provide an external
                cell-line fitness phenotype against which transcriptomic representations
                can be tested.<Citation references={["tsherniak2017", "meyers2017", "dempster2021"]} />
              </p>
              <p>
                CGT was developed as an attempt to recover low-dimensional directions
                associated with viable and non-viable response structure. In this report,
                the term <em>constraint</em> is interpretive rather than established. The
                analysis asks three operational questions: whether residual response
                coordinates recur across datasets; whether gene-level coordinates predict
                an externally sourced CRISPR fitness endpoint; and whether signed
                directions admit coherent biological annotation. A fourth supporting
                analysis asks whether the independently defined axes can be projected into
                bulk human tumors. None of these tests, alone or together, identifies a
                causal constraint law.
              </p>
            </div>
            <aside className={styles.claimBox}>
              <span>PRIMARY CLAIM</span>
              <p>
                CGT identifies perturbation coordinates that recur in related settings
                and whose gene-level summaries predict an external CRISPR fitness
                readout at the supervised-mapping stage.
              </p>
              <small>
                Strict holdouts reject the stronger claim that the geometry is invariant
                across studies and biological contexts.
              </small>
            </aside>
          </ArticleSection>

          <ArticleSection id="results" index="03 / RESULTS" title="Results">
            <div className={styles.resultBlock}>
              <p className={styles.resultNumber}>RESULT / 01</p>
              <div className={styles.prose}>
                <h3>Gene-level coordinates predict an external CRISPR fitness endpoint</h3>
                <p>
                  Context-residualized family-coordinate means were aggregated for 1,229
                  genes and evaluated against DepMap 26Q1 CRISPR GeneEffect, a model-based
                  cell-line fitness measure derived from pooled knockout screens.<Citation references={["tsherniak2017", "meyers2017", "dempster2021", "depmap26q1"]} />
                  With genes excluded from their own supervised-model training folds,
                  pooled out-of-fold prediction reached Spearman ρ = 0.613 and R² =
                  0.353. CGT features were nevertheless measured perturbational responses
                  for every test gene; this is not prediction for genes lacking CGT
                  features. Mean five-fold
                  regression ρ was 0.622 and mean essential-gene classification ROC AUC
                  was 0.919.
                </p>
                <p>
                  Regression and thresholded essential-gene classification are two views
                  of the same GeneEffect source, not independent biological confirmations.
                  Both views exceeded 100 independent endpoint shuffles at the
                  minimum attainable one-sided Monte Carlo permutation P of 1/101 =
                  0.0099. The unit
                  of the null comparison was the whole shuffle: metrics were averaged
                  across folds before calculating P, preventing nested folds from being
                  treated as independent permutations. The association is retrospective
                  and predictive; it does not show that CGT coordinates cause fitness.
                  Supplementary Figure 1 is equally important: performance becomes
                  heterogeneous and frequently weak under program-family, dataset,
                  context, and study-proxy holdouts.
                </p>
              </div>
              <ScientificFigure figure={mainFigures[0]} />
            </div>

            <div className={styles.resultBlock}>
              <p className={styles.resultNumber}>RESULT / 02</p>
              <div className={styles.prose}>
                <h3>Residual response coordinates recur—primarily within related settings</h3>
                <p>
                  The recurrence atlas comprised 248 perturbation modes from 43 datasets
                  and 9 contexts, consolidated into 16 unsupervised families. The
                  prediction-focused residual atlas retained 2,720 observations from 39
                  datasets and 8 contexts. These denominators describe different analysis
                  sets and are not interchangeable.
                </p>
                <p>
                  Held-out responses aligned with same-label residual predictions under
                  leave-dataset-out evaluation: mean cosine was 0.563 for context
                  residuals and 0.558 for dataset-shrinkage residuals, compared with
                  approximately zero for label-shuffled and random-label controls. That
                  result establishes directional signal in related settings—not accurate
                  full-vector reconstruction or context invariance.
                </p>
                <p>
                  The strict exclusions provide the decisive boundary. For context
                  residuals, mean cosine fell from 0.563 (95% cluster-bootstrap CI
                  0.369–0.795) to 0.035 (−0.037–0.093) when same-study proxies were
                  excluded, and to 0.079 (0.048–0.128) when entire contexts were held out.
                  Thus the data support recurrent response directions with substantial
                  context and study dependence.
                </p>
              </div>
              <ScientificFigure figure={mainFigures[1]} />
            </div>

            <div className={styles.resultBlock}>
              <p className={styles.resultNumber}>RESULT / 03</p>
              <div className={styles.prose}>
                <h3>Signed directions support candidate biological interpretations</h3>
                <p>
                  Positive and negative coordinate tails were annotated using top-tail
                  over-representation analysis and continuous rank enrichment against
                  curated pathway collections. Gene-set enrichment tests coordinated
                  association with existing annotations; they do not directly measure
                  pathway activity or establish mechanism.<Citation references={["subramanian2005", "tamayo2016", "liberzon2015", "gillespie2022", "go2021", "kanehisa2000"]} />
                </p>
                <p>
                  After de-duplication, sibling-direction consolidation, and manual
                  evidence review, the project retained 3 headline and 6 supporting
                  candidate axes. The headline interpretations were cytokine/JAK–STAT,
                  chromatin/epigenetic regulation, and translation/ribosome-associated
                  quality control. Supporting interpretations included chromatin–cytokine,
                  oxidative phosphorylation/TCA, lysosome/ECM, rRNA biogenesis,
                  sterol/SREBP, and antigen-receptor/T-cell signalling.
                </p>
                <p>
                  ORA and rank enrichment interrogate overlapping gene information and
                  cannot be counted as independent replication. The labels are therefore
                  candidate annotations of signed latent directions, not autonomous
                  causal programs.
                </p>
              </div>
              <ScientificFigure figure={mainFigures[2]} />
            </div>

            <div className={styles.resultBlock}>
              <p className={styles.resultNumber}>RESULT / 04</p>
              <div className={styles.prose}>
                <h3>The integrated atlas separates observations from theory</h3>
                <p>
                  Figure 4 combines recurrence, transfer, conditional ridge weights,
                  essentiality associations, pathway support, and optional coessentiality
                  lift. It is a synthesis of earlier evidence, not another validation
                  experiment. Its composite fitness-relevance score—one half normalized
                  absolute ridge coefficient plus one half normalized absolute
                  essentiality correlation—was used only for visualization.
                </p>
                <p>
                  The evidence hierarchy places recurrent geometry, local same-label
                  transfer, and supervised-stage held-out-gene prediction among the
                  best-supported findings within this analysis;
                  signed pathway coherence at a curated interpretive tier; and a universal
                  causal constraint law at the hypothesis tier. This separation is the
                  most scientifically important function of the synthesis.
                </p>
              </div>
              <ScientificFigure figure={mainFigures[3]} />
            </div>

            <div className={styles.resultBlock}>
              <p className={styles.resultNumber}>RESULT / 05</p>
              <div className={styles.prose}>
                <h3>Predefined CGT scores vary across bulk tumor cohorts</h3>
                <p>
                  The final supporting analysis projected CGT axes into uniformly
                  processed TCGA/Toil expression distributed through the UCSC Xena
                  platform.<Citation references={["tcga2013", "vivian2017", "goldman2020"]} />
                  After sample-level expression QC, 9,302 of 9,359 tumors were retained,
                  spanning 33 cancer types, 15 scored axes, and 970 retained axis genes.
                </p>
                <p>
                  Raw bulk-tumor scores contained a dominant shared component: PC1
                  explained 83.0% of score variance and mean absolute inter-axis Spearman
                  correlation was 0.753. Sample centering and leave-one-axis-out global
                  residualization reduced mean absolute correlation to 0.279 and 0.265;
                  residualized PC1 explained 32.2%. Cancer-type structure remained visible
                  in the corrected score space.
                </p>
                <p>
                  This is a separate descriptive manifestation analysis, not patient validation.
                  Bulk tumor profiles mix lineage, malignant-cell state, purity, immune
                  and stromal composition, RNA content, and technical structure. The
                  residualization procedure may also remove coordinated biology. No
                  causal or clinical claim follows from the observed cancer-type pattern.<Citation references={["hoadley2018", "aran2015"]} />
                </p>
              </div>
              <ScientificFigure figure={mainFigures[4]} />
            </div>
          </ArticleSection>

          <ArticleSection id="methods" index="04 / METHODS" title="Methods">
            <div className={styles.methodsIntro}>
              <p>
                Methods below reconstruct the analysis from the frozen figure legends,
                panel-method files, source-data workbooks, run ledgers, and canonical
                metrics. They define what the displayed figures establish. A complete
                accession-level dataset registry, extracted code package, and executable
                environment remain required before journal submission.
              </p>
            </div>
            <div className={styles.methodsGrid}>
              <section>
                <span>04.1</span>
                <h3>Analysis sets and coordinate construction</h3>
                <p>
                  The recurrence analysis (META-003) contained 248 low-dimensional modes
                  from 43 perturbational datasets across 9 annotated contexts. Modes were
                  consolidated into 16 unsupervised families. The transfer and fitness
                  analyses used a stricter residual-prediction subset with 2,720
                  observations from 39 datasets and 8 contexts. Counts are reported
                  separately to avoid implying that every dataset contributed to every
                  endpoint.
                </p>
                <p>
                  The frozen <a href="/research/cgt/data/cgt-cache-002-dataset-manifest.csv">CGT_CACHE_002 dataset manifest</a>
                  records candidate filenames, source URLs, checksums, contexts,
                  inclusion flags, and perturbation/control parsing fields. It is exposed
                  here as an audit artifact, but it is not a complete publication registry:
                  publication DOI, accession, licence, and analysis-specific contribution
                  fields still require harmonization.
                </p>
                <p>
                  CGT family coordinates summarize candidate recurrent covariance in
                  perturbation-associated expression. Such latent coordinates are
                  representation-dependent; their sign, scale, and orientation do not by
                  themselves confer biological identity.<Citation references={["norman2019", "replogle2022"]} />
                </p>
              </section>
              <section>
                <span>04.2</span>
                <h3>Residualization and transfer</h3>
                <p>
                  Family-coordinate baselines were estimated under context, dataset, and
                  dataset-shrinkage schemes; residual coordinates were evaluated with
                  exact perturbation labels. Shrinkage baselines and residuals were not
                  constrained to be orthogonal, so their variance fractions need not sum
                  to one. Residuals are not described as nuisance-free: they may retain
                  unmodeled study effects or remove coordinated biological signal.
                </p>
                <p>
                  Transfer was summarized by cosine similarity between a held-out
                  residual and the same-label residual-shrink prediction. Label-shuffle
                  controls preserved residual geometry while breaking perturbation
                  identity; random-label controls substituted unrelated labels. Strict
                  regimes left out datasets, excluded same-study proxies, or left out
                  contexts. Confidence intervals used 4,000 cluster-bootstrap resamples
                  of held-out datasets or contexts while retaining row weighting.<Citation references={["efron1979"]} />
                  The leave-context estimand is based on only 8 annotated contexts and is
                  therefore interpreted as a small-cluster sensitivity analysis.
                </p>
              </section>
              <section>
                <span>04.3</span>
                <h3>Gene-fitness benchmark</h3>
                <p>
                  The external endpoint was DepMap 26Q1 CRISPR GeneEffect, sign-transformed
                  so that larger values indicate stronger knockout-associated fitness
                  loss. Context-residualized family-coordinate means were aggregated by
                  gene. Five-fold GroupKFold splitting was performed by gene symbol; the
                  primary regression and classification model was a random forest.<Citation references={["dempster2021", "depmap26q1", "breiman2001"]} />
                </p>
                <p>
                  “Held out” applies to the supervised mapping from measured CGT features
                  to GeneEffect. The frozen record does not establish that family
                  construction, residualization, feature selection, or every tuning choice
                  was recomputed inside each fold. The evaluation is therefore not claimed
                  as fully end-to-end out-of-sample prediction, and it does not cover genes
                  without measured perturbation coordinates.
                </p>
                <p>
                  Endpoint labels were shuffled independently 100 times. Fold metrics
                  were averaged within each shuffle, and one-sided upper-tail Monte Carlo
                  permutation P values
                  used <span className={styles.inlineEquation}>p = (b + 1)/(B + 1)</span>,
                  yielding a minimum possible P of 1/101.<Citation references={["phipson2010"]} />
                  Standardized multivariable ridge coefficients were displayed for signed
                  conditional interpretation, not causal attribution.<Citation references={["hoerl1970"]} />
                </p>
              </section>
              <section>
                <span>04.4</span>
                <h3>Signed-axis annotation</h3>
                <p>
                  Positive and negative coordinate tails defined direction-specific gene
                  sets. Symbol-only Hallmark, Reactome, Gene Ontology, and KEGG
                  collections—plus compatible CORUM-like resources when available—were
                  searched with top-tail ORA and continuous rank enrichment.<Citation references={["subramanian2005", "tamayo2016", "liberzon2015", "gillespie2022", "go2021", "kanehisa2000"]} />
                  Results were corrected for multiple testing, de-duplicated, and reviewed
                  across sibling directions.<Citation references={["benjamini1995"]} />
                </p>
                <p>
                  Candidate names followed a declared manual curation layer. Related
                  directions such as F3/F15 and F5/F6 were collapsed before axis-level
                  interpretation. Enrichment magnitude, predictive weight, essentiality
                  association, recurrence, and coessentiality were retained as distinct
                  evidence dimensions rather than pooled into a single inferential test.
                </p>
              </section>
              <section>
                <span>04.5</span>
                <h3>Integrated evidence atlas</h3>
                <p>
                  For each collapsed axis, recurrence was the maximum parent-family
                  universality index; predictive relevance was the maximum absolute
                  standardized ridge coefficient; and essentiality relevance was the
                  maximum absolute high-confidence family-level Spearman association.
                  Pathway support used the best collapsed annotation −log10(q), with
                  compatible DepMap coessentiality lift included where available.
                </p>
                <p className={styles.equation}>
                  fitness relevance = 0.5 × norm(|β|) + 0.5 × norm(|ρ|)
                </p>
                <p>
                  This composite determines visual placement only. It is not a fitted
                  prediction, a calibrated probability, or independent validation.
                </p>
              </section>
              <section>
                <span>04.6</span>
                <h3>TCGA projection</h3>
                <p>
                  Corrected TCGA/Toil expression and cancer type
                  (<code>detailed_category</code>) were loaded from the Xena-prepared
                  cohort. Low-expression outliers were removed using the sample-level QC
                  flag generated in CGT_TCGA_002. For axis <em>j</em>, the raw score was
                  regressed on an intercept, the mean of all other axes in that sample,
                  and sample median expression across retained axis genes. Residuals were
                  used for PCA, the cancer-type heat map, and inter-axis correlations.
                </p>
                <p>
                  Cancer-type R² is the one-way between-group sum-of-squares fraction for
                  each axis and score matrix. It is descriptive and was not estimated by
                  cross-validated prediction.
                </p>
              </section>
            </div>
            <aside className={styles.reproducibilityNote}>
              <div><span>PROVENANCE / FREEZE</span><strong>838 / 838</strong></div>
              <p>
                The July 18 recovery audit found all 838 output-manifest files, recorded
                new SHA-256 digests, and hashed 51 discoverable notebooks without read
                errors. This verifies the captured artifact snapshot—not the historical
                execution environment or every run-to-notebook relationship.
              </p>
              <ul>
                <li>Every displayed figure is shipped as 600-dpi PNG, editable SVG, and PDF.</li>
                <li>Local file hashes and source-notebook hashes are exposed with each figure.</li>
                <li><a href="/research/cgt/data/cgt-cache-002-dataset-manifest.csv">Download the captured dataset manifest</a></li>
                <li><a href="/research/cgt/figures/manifest.json">Download the machine-readable figure manifest</a></li>
              </ul>
            </aside>
          </ArticleSection>

          <ArticleSection id="discussion" index="05 / DISCUSSION" title="Discussion">
            <div className={styles.prose}>
              <p className={styles.lead}>
                CGT recovered a low-dimensional representation that was informative in
                two distinct senses: repeated perturbations showed directional residual
                similarity in related experimental settings, and gene-aggregated
                coordinates predicted an externally sourced CRISPR fitness phenotype
                for genes excluded from the supervised mapping’s model fitting.
              </p>
              <p>
                The convergence of recurrence, prediction, and pathway annotation is
                consistent with biological signal beyond a shuffled
                endpoint or arbitrary perturbation label. It does not establish that the
                recovered families are unique, that their orientation is identifiable,
                or that the annotated axes are causal control variables.
              </p>
              <p>
                The strict holdouts define the theory’s present boundary. Same-label
                transfer was substantially weaker after related studies or entire
                contexts were excluded, and fitness prediction deteriorated when splits
                were organized around program families, datasets, contexts, or study
                proxies. The data therefore do not support a single response vector that
                is invariant to cellular and experimental context. A more conservative
                interpretation is that CGT identifies shared response directions whose
                weights, deformation, and fitness consequences depend on the state in
                which a perturbation is realized.
              </p>
              <p>
                Biological annotations should be read at the same level of restraint.
                Enrichment of cytokine/JAK–STAT, chromatin, and translation-associated
                gene sets makes these directions plausible candidate axes, but enrichment
                and manual consolidation do not establish direct regulatory mechanisms.
                Likewise, the TCGA projection shows that predefined CGT scores vary across
                bulk tumor cohorts; it does not show that the axes cause tumor phenotypes,
                predict treatment response, or operate uniformly within malignant cells.<Citation references={["hoadley2018", "aran2015"]} />
              </p>
            </div>

            <div className={styles.limitations} aria-labelledby="limitations-heading">
              <h3 id="limitations-heading">Principal limitations</h3>
              <ol>
                <li><span>01</span><p><strong>Retrospective discovery.</strong> The 43 datasets used to construct CGT are discovery evidence and cannot independently confirm CORD.</p></li>
                <li><span>02</span><p><strong>Context–study entanglement.</strong> Biological context, laboratory, assay, and sampling structure are incompletely separable in heterogeneous public data.</p></li>
                <li><span>03</span><p><strong>Restricted transport.</strong> The strongest transfer and prediction results attenuate under the hardest grouped exclusions.</p></li>
                <li><span>04</span><p><strong>Correlated annotation evidence.</strong> ORA, rank enrichment, and overlapping databases cannot be counted as independent mechanism tests.</p></li>
                <li><span>05</span><p><strong>Finite null resolution.</strong> One hundred endpoint shuffles bound the primary empirical P value at 0.0099.</p></li>
                <li><span>06</span><p><strong>Bulk-tumor confounding.</strong> Lineage, purity, microenvironment, RNA content, and cohort structure remain plausible explanations for TCGA patterns.</p></li>
                <li><span>07</span><p><strong>Selection versus response.</strong> Population selection and survival effects are not fully separated from within-cell transcriptional response.</p></li>
                <li><span>08</span><p><strong>Reproducibility gap.</strong> The frozen outputs are hashed, but the historical code and executable environment are not yet a complete public reproduction package.</p></li>
              </ol>
            </div>

            <div className={styles.reportingGrid}>
              <section>
                <h3>DATA & CODE AVAILABILITY</h3>
                <p>
                  Processed figure assets, captions, provenance identifiers, and content
                  hashes are available directly from this report, together with the
                  captured dataset manifest. A complete DOI/accession registry and public
                  executable code-and-environment release remain in preparation; this page
                  does not claim that all historical analyses are presently reproducible
                  from source.
                </p>
              </section>
              <section>
                <h3>ETHICS & DATA GOVERNANCE</h3>
                <p>
                  No new human participants were recruited. The tumor projection reuses
                  publicly distributed, de-identified TCGA-derived expression and
                  phenotype resources. Dataset-specific terms and licenses remain
                  controlling.
                </p>
              </section>
              <section>
                <h3>DISCLOSURES</h3>
                <p>
                  This independent report was developed with AI assistance for software,
                  synthesis, and editorial work. Quantitative statements were checked
                  against frozen project artifacts. Funding and competing-interest
                  declarations must be completed before formal journal submission.
                </p>
              </section>
              <section>
                <h3>EXPLORATORY OUTPUTS</h3>
                <p>
                  Seven CGT_TOPOGRAPHY_001C atlas plates remain hypothesis-generating
                  prototypes. The project freeze does not classify them as main or
                  supplementary evidence, and no target-actionability or therapeutic-window
                  claim is made from them here.
                </p>
              </section>
            </div>
          </ArticleSection>
        </div>

        <section className={styles.cordSection} id="cord" aria-labelledby="cord-heading">
          <div className={`shell ${styles.cordGrid}`}>
            <div>
              <p className={styles.cordKicker}>06 / FROM CGT TO CORD</p>
              <h2 id="cord-heading">The boundary became the next framework.</h2>
            </div>
            <div className={styles.cordBody}>
              <p>
                CGT established a useful descriptive and predictive coordinate system,
                while its hardest negative controls exposed a central limitation: the
                same perturbation does not instantiate one portable vector independently
                of cellular and experimental context.
              </p>
              <p>
                That pattern encouraged the development of <strong>CORD—Contextual
                Operator Response Dynamics</strong>. CORD treats a perturbational response
                as the output of a context-conditioned transformation acting on cellular
                state, rather than as a fixed, context-free displacement. Recurrence may
                then arise from shared response structure even when realized vectors
                differ across contexts. This state-dependent framing has conceptual
                antecedents in dynamical views of cellular phenotypes.<Citation references={["huang2005"]} />
              </p>
              <div className={styles.cordEquation}>
                <span>WORKING HYPOTHESIS</span>
                <p>response<sub>p,c</sub> ≈ Φ(load<sub>p</sub>, susceptibility/slack<sub>c</sub>, starting state<sub>c</sub>)</p>
              </div>
              <p>
                A leading hypothesis within CORD—Active-Constraint Susceptibility
                (CORD-ACS)—reinterprets recurrent CGT modes as candidate compensatory
                directions that appear when perturbational load meets context-specific
                limits in capacity or slack. This is a prospective hypothesis, not a
                result of the analyses above. CGT modes have not been shown to be causal
                units, and an unrestricted response operator or full stochastic dynamics
                model is not yet warranted.
              </p>
              <p>
                Decisive tests will require preregistered prediction in unseen studies
                and cell states, replicate- or donor-level inference, time-resolved
                trajectories, explicit separation of technical from biological context,
                and intervention-linked phenotypes that distinguish descriptive recurrence
                from causal transportability.
              </p>
            </div>
          </div>
        </section>

        <div className={`shell ${styles.articleShell}`}>
          <ArticleSection id="supplementary" index="07 / SUPPLEMENT" title="Supplementary figures">
            <div className={styles.supplementIntro}>
              <p>
                The six canonical supplements expose generalization boundaries,
                reliability structure, the full annotation catalogue, and TCGA input QC.
                They are displayed in full rather than hidden behind a carousel.
              </p>
            </div>
            <div className={styles.supplementaryFigures}>
              {supplementaryFigures.map((figure) => (
                <ScientificFigure figure={figure} key={figure.id} />
              ))}
            </div>
          </ArticleSection>

          <ArticleSection id="references" index="08 / REFERENCES" title="References">
            <ReferencesList />
          </ArticleSection>

          <footer className={styles.articleFooter}>
            <div>
              <p>CITE THIS REPORT</p>
              <span>
                Collins, J. P. (2026). <em>{title}.</em> CGT independent research report,
                version 0.1. https://johnpatrickcollins.info/research/cgt
              </span>
            </div>
            <nav aria-label="Research report links">
              <a href="/research">Research index <span aria-hidden="true">↗</span></a>
              <a href="/contact">Contact the author <span aria-hidden="true">↗</span></a>
              <a href="#top">Back to top <span aria-hidden="true">↑</span></a>
            </nav>
          </footer>
        </div>
      </article>
    </main>
  );
}
