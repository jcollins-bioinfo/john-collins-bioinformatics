import type { ReactNode } from "react";
import { Citation, MathExpression } from "./publication-components";
import styles from "./publication.module.css";

function MethodSection({
  children,
  headingId,
  ordinal,
  title,
}: {
  children: ReactNode;
  headingId: string;
  ordinal: string;
  title: string;
}) {
  return (
    <section aria-labelledby={headingId} className={styles.methodRow}>
      <div className={styles.methodRail}>
        <span className={styles.methodOrdinal}>{ordinal}</span>
        <h3 className={styles.methodTitle} id={headingId}>{title}</h3>
      </div>
      <div className={styles.methodBody}>{children}</div>
    </section>
  );
}

export function CgtMethods() {
  return (
    <>
      <div className={styles.methodsIntro}>
        <p>
          These Methods describe the analyses represented in the frozen, figure-specific
          releases for Figures 1–5. The governing sources are the audited source tables,
          workbooks, manifests, claim ledgers, and notebook digests associated with each
          release. Where the historical execution record is incomplete or two artifacts
          cannot be reconciled, the limitation is stated rather than reconstructed
          inferentially. Unless an estimand is explicitly labelled predictive, all
          summaries are descriptive or associative; no analysis identifies a causal
          mechanism or a universal response law.
        </p>
      </div>

      <div className={styles.methodsRecord}>
        <MethodSection
          headingId="methods-analysis-universes"
          ordinal="04.1"
          title="Analysis universes, source hierarchy, and observational units"
        >
          <p>
            The analyses use several upstream universes that are not interchangeable.
            META-003 contains 248 dataset-specific perturbation-response modes from 43
            datasets and nine annotated contexts, grouped into 16 unsupervised parent
            families. PREDICT-003B contains 2,720 unique dataset–perturbation observations
            from 39 datasets and eight contexts and supplies the residual-transfer
            analyses. The shared-endpoint fitness benchmark contains 1,229 genes with
            measured CGT features and a DepMap 26Q1 CRISPR GeneEffect endpoint.
            <Citation references={["dempster2021", "depmap26q1"]} /> The Figure 1 lineage
            also records 1,630 matched gene–dataset records, but the frozen release does
            not document a complete row-level map from the 2,720 upstream profiles to
            those records. Figure 5 uses a separate TCGA bulk-expression cohort: 9,359
            input tumor-derived samples and 9,302 retained samples from 33 corrected
            cancer-type categories after expression QC.
            <Citation references={["tcga2013", "vivian2017", "goldman2020"]} /> Counts,
            sampling units, preprocessing, and inferential units are therefore reported
            separately for each analysis.
          </p>
          <p>
            The captured <code>CGT_CACHE_002</code> manifest records candidate filenames,
            source URLs, checksums, assigned contexts, inclusion flags, and
            perturbation/control parsing fields. It is an audit artifact, not a complete
            publication registry: DOI or accession, licence, verified study identity,
            and analysis-specific inclusion still require harmonization for some
            datasets. The “same-study” exclusion used below is consequently a
            dataset-name-prefix proxy, not verified study identity.
          </p>
        </MethodSection>

        <MethodSection
          headingId="methods-family-mass-recurrence"
          ordinal="04.2"
          title="Local SVD modes, family-mass coordinates, and recurrence summaries"
        >
          <p>
            A local mode is a dataset-specific latent direction obtained from an
            SVD-based representation and assigned to one of the parent families F1–F16.
            <Citation references={["norman2019", "replogle2022"]} /> For perturbation{" "}
            <MathExpression expression="i" /> and family <MathExpression expression="f" />,
            normalized absolute family mass is
          </p>
          <MathExpression
            display
            expression={String.raw`A_{if}=\frac{\sum_{m\in f}\lvert U_{im}S_m\rvert}{\sum_g\sum_{m\in g}\lvert U_{im}S_m\rvert}.`}
          />
          <p>
            Thus <MathExpression expression={String.raw`A_{if}\ge 0`} /> and{" "}
            <MathExpression expression={String.raw`\sum_f A_{if}=1`} /> before
            residualization. Absolute mode scores remove arbitrary SVD-vector polarity.
            The context-residualized coordinate is
          </p>
          <MathExpression
            display
            expression={String.raw`R_{if}=A_{if}-\overline{A}_{c(i)f},`}
          />
          <p>
            where <MathExpression expression={String.raw`\overline{A}_{c(i)f}`} /> is the
            mean family mass for the context assigned to perturbation{" "}
            <MathExpression expression="i" />. “Lower” and “upper” therefore mean below
            and above the assigned-context mean; they do not imply intrinsically negative
            or positive biology. Gene-level coordinates are averages across occurrences
            carrying the same exact gene label. Because the family-mass representation
            is closed, individual coordinates and regression coefficients are contrast-
            and coding-dependent.
          </p>
          <p>
            Figure 2&apos;s source <code>universality_index</code> is a hand-constructed,
            family-level recurrence composite. To distinguish it from the perturbation-
            level residual <MathExpression expression={String.raw`R_{if}`} />, denote it
            here by <MathExpression expression={String.raw`R_f^{\mathrm{rec}}`} />:
          </p>
          <MathExpression
            display
            expression={String.raw`R_f^{\mathrm{rec}}=z(C_f/9)+z(D_f/43)+z(e^{H_f})+z(H_f^{\mathrm{norm}})+\tfrac12 z\{\log(1+E_f)\}+\tfrac12 z\{\log(1+G_f)\}.`}
          />
          <p>
            Here <MathExpression expression="C_f" /> and <MathExpression expression="D_f" />
            are represented-context and represented-dataset counts;{" "}
            <MathExpression expression={String.raw`H_f=-\sum_c p_{fc}\log p_{fc}`} />;{" "}
            <MathExpression expression={String.raw`e^{H_f}`} /> is the effective number of
            contexts; <MathExpression expression={String.raw`H_f^{\mathrm{norm}}=H_f/\log C_f`} />{" "}
            for <MathExpression expression={String.raw`C_f>1`} /> and zero otherwise;{" "}
            <MathExpression expression="E_f" /> is summed mode <code>energy_fraction</code>;
            {" "}and <MathExpression expression="G_f" /> is the number of graph edges incident
            to at least one mode in family <MathExpression expression="f" />. Each
            {" "}<MathExpression expression={String.raw`z(\cdot)`} /> is population-standardized
            across the 16 families after median imputation if required.
          </p>
          <p>
            The source <code>B</code>/<code>I</code>/<code>C</code> classes were assigned
            from <MathExpression expression={String.raw`R_f^{\mathrm{rec}}-S_f`} />, where
          </p>
          <MathExpression
            display
            expression={String.raw`S_f=z(q_f)-z(e^{H_f})-z(H_f^{\mathrm{norm}})+0.25z\{\log(1+E_f)\},`}
          />
          <p>
            and <MathExpression expression="q_f" /> is the dominant-context fraction:{" "}
            <code>C</code> if{" "}
            <MathExpression expression={String.raw`R_f^{\mathrm{rec}}-S_f\le -1`} />,
            {" "}<code>I</code> if{" "}
            <MathExpression expression={String.raw`-1<R_f^{\mathrm{rec}}-S_f\le 1`} />, and
            {" "}<code>B</code> if{" "}
            <MathExpression expression={String.raw`R_f^{\mathrm{rec}}-S_f>1`} />.{" "}
            <code>B</code> is reported cautiously as “broad candidate,” <code>I</code> as
            intermediate, and <code>C</code> as context-specific. The recurrence score and
            classes are dimensionless, run-relative descriptions without uncertainty or
            external calibration; they are not probabilities, effect sizes,
            transportability estimates, or validated biological types.
          </p>
        </MethodSection>

        <MethodSection
          headingId="methods-transfer-controls-uncertainty"
          ordinal="04.3"
          title="Residual baselines, transfer estimands, controls, and uncertainty"
        >
          <p>
            PREDICT-003B evaluates three baselines for each 16-coordinate observation{" "}
            <MathExpression expression="y_i" />: the assigned-context mean, the
            assigned-dataset mean, and the shrinkage baseline
          </p>
          <MathExpression
            display
            expression={String.raw`b_i^{\mathrm{shrink}}=0.75\,\mathbb{E}[y\mid\mathrm{dataset}(i)]+0.25\,\mathbb{E}[y\mid\mathrm{context}(i)].`}
          />
          <p>
            Residuals are <MathExpression expression={String.raw`r_i=y_i-b_i`} />.
            Baseline and residual fractions use one denominator, the sum of the 16
            population variances in the raw coordinates. The two fractions are reported
            separately and need not sum to one when baseline and residual are
            nonorthogonal, as under the shrinkage scheme. Baselines were estimated once
            from the full PREDICT-003B table before holdout splitting. Transfer is
            therefore conditional on transductive preprocessing rather than a fully
            nested inductive pipeline, and residuals are not assumed to be nuisance-free.
          </p>
          <p>For an eligible held-out observation, the same-label predictor is</p>
          <MathExpression
            display
            expression={String.raw`\widehat r_i=\frac{n}{n+2}\,\overline r_{\ell(i),\mathrm{train}},`}
          />
          <p>
            where <MathExpression expression="n" /> is the number of training rows with
            the same exact perturbation label <MathExpression expression={String.raw`\ell(i)`} />.
            The response is the cosine between <MathExpression expression="r_i" /> and{" "}
            <MathExpression expression={String.raw`\widehat r_i`} />; the positive scalar
            shrinkage does not change cosine. Cosine is undefined when either vector has
            zero norm, so finite denominators are reported for every scheme and design
            rather than treating undefined values as zero.
          </p>
          <p>
            The primary design leaves one dataset out. A stricter study-proxy design
            excludes training datasets whose names share the held-out dataset&apos;s prefix
            before the first underscore. The leave-context-out design excludes the
            complete held-out context. Training-label permutation and unrelated-random-
            label controls each use 100 repetitions under upstream random seed 619; they
            retain the residual-coordinate table and split structure while destroying
            perturbation identity and are null diagnostics rather than independent
            biological replications.
          </p>
          <p>
            Means are calculated over finite observation-level cosines. Percentile 95%
            cluster-bootstrap intervals use 4,000 NumPy-generator resamples with seed
            1201. Held-out datasets are resampled for leave-dataset-out and study-proxy
            exclusion, and held-out contexts for leave-context-out. Each replicate
            combines sampled cluster sums and counts before division, preserving row
            weighting while treating the held-out grouping variable as the resampling
            unit.<Citation references={["efron1979"]} /> The displayed context-residual
            results use 34, 22, and seven eligible held-out clusters for the three designs,
            respectively; across all schemes and designs only 4–34 clusters are
            available. These intervals quantify resampling variability under the chosen
            clustering and preprocessing, not context-general transport or mechanism.
          </p>
        </MethodSection>

        <MethodSection
          headingId="methods-gene-fitness-benchmark"
          ordinal="04.4"
          title="External gene-fitness benchmark"
        >
          <p>
            The external endpoint is DepMap 26Q1 CRISPR GeneEffect, sign-transformed as
            <code>essentiality_strength = −mean GeneEffect</code> so that larger values
            indicate stronger mean knockout-associated fitness loss.
            <Citation references={["dempster2021", "depmap26q1"]} /> For each exact gene
            label, the primary 16-feature vector is the mean across matched records of
            <code>F1_abs__resid</code> through <code>F16_abs__resid</code> under the
            context-residual scheme. Prespecified sensitivity vectors append the 16
            feature-wise medians and then the 16 population standard deviations
            (<code>ddof=0</code>), producing 16-, 32-, and 48-feature variants. The
            documented Figure 1 lineage contains 1,630 matched gene–dataset records and
            1,229 shared-endpoint genes; the complete upstream 2,720-to-1,630 row-selection
            rule is not available.
          </p>
          <p>
            Five-fold <code>GroupKFold</code> splitting groups by gene symbol. The primary
            supervised mappings are a <code>RandomForestRegressor</code> and a
            <code>RandomForestClassifier</code>, each fixed at 400 trees, maximum depth 8,
            minimum leaf size 3, and random seed 811; the classifier additionally uses
            balanced class weights. No random-forest hyperparameter search is documented.
            <Citation references={["breiman2001"]} /> Regression is summarized by pooled
            out-of-fold Spearman correlation and predictive{" "}
            <MathExpression expression={String.raw`R^2_{\mathrm{pred}}`} />. The pooled
            out-of-fold Spearman correlation across 1,229 genes is 0.613, whereas the mean
            of the five fold correlations is 0.622; they are different summaries.
            Classification uses inclusive bottom- and top-quintile endpoint labels,
            excludes the middle three quintiles, and is summarized by ROC AUC.
          </p>
          <p>
            “Held out” applies only to fitting the supervised mapping from measured CGT
            features to the GeneEffect endpoint. The frozen record does not establish that
            family discovery, baseline estimation, residualization, feature selection, or
            every upstream choice was recomputed inside each fold. The benchmark is
            therefore not a fully nested end-to-end test and does not apply to genes
            without measured CGT coordinates.
          </p>
          <p>
            Endpoint labels were shuffled independently 100 times. Fold metrics were
            averaged within each whole shuffle, and one-sided upper-tail Monte Carlo
            permutation values used
          </p>
          <MathExpression
            display
            expression={String.raw`p_{\mathrm{perm}}=\frac{b+1}{B+1},\qquad B=100,`}
          />
          <p>
            giving a minimum possible value of{" "}
            <MathExpression expression={String.raw`1/101`} />.
            <Citation references={["phipson2010"]} /> The full 16-feature standardized
            RidgeCV fit is descriptive; Figure 1 displays the eight largest absolute
            coefficients, an explicitly post-fit display selection.
            <Citation references={["hoerl1970"]} /> Individual coefficients are
            conditional, coding- and penalty-dependent quantities rather than causal
            effects or stability estimates.
          </p>
        </MethodSection>

        <MethodSection
          headingId="methods-functional-annotation"
          ordinal="04.5"
          title="Candidate functional annotation and curation"
        >
          <p>
            Four legacy query views—lower, upper, largest absolute residual, and
            high-confidence largest absolute residual—were attempted for each of 14
            nonempty parent families, yielding 56 original views. Corrected sign filtering
            requires <MathExpression expression="R<0" /> for lower and{" "}
            <MathExpression expression="R>0" /> for upper queries and removes the invalid
            F1, F3, and F15 upper views, leaving 53 valid views. Lower and upper views
            target 30 genes and absolute-residual views target 40, but every boundary tie
            is retained; realized query sizes therefore range from 20 to 362.
          </p>
          <p>
            Each view is tested against 3,807 de-duplicated MSigDB v2026.1.Hs sets from
            Hallmark, Reactome, Gene Ontology biological process, cellular component and
            molecular function, and KEGG.
            <Citation references={["subramanian2005", "tamayo2016", "liberzon2015", "gillespie2022", "go2021", "kanehisa2000"]} />
            One-sided Fisher over-representation analysis uses the selected tail. The
            one-sided Mann–Whitney analysis uses every eligible gene score:{" "}
            <MathExpression expression="R" /> for upper,
            {" "}<MathExpression expression="-R" /> for lower, and{" "}
            <MathExpression expression={String.raw`\lvert R\rvert`} /> for absolute-
            residual views. The pooled universe contains 1,229 genes; high-confidence
            absolute views use their 255 eligible genes for both ORA and rank analysis.
          </p>
          <p>
            Benjamini–Hochberg adjustment is performed separately for ORA and rank across
            all <MathExpression expression={String.raw`53\times3{,}807=201{,}771`} />
            corrected view–term tests per method.
            <Citation references={["benjamini1995"]} /> Analytic term candidates require
            either ORA <MathExpression expression={String.raw`q\le 0.05`} />, overlap at
            least three, and odds ratio at least two, or rank{" "}
            <MathExpression expression={String.raw`q\le 0.05`} /> and mean-score difference
            at least 0.05. Terms are consolidated at Jaccard similarity 0.70 before manual,
            post hoc naming, representative-term selection, tiering, and failure-mode
            review. The resulting registry contains 15 collapsed groups: three headline,
            six supporting, four exploratory, and two excluded or unresolved. Displayed
            terms are representative, not exhaustive.
          </p>
          <p>
            ORA and rank reuse the same coordinates and overlapping gene-set memberships.
            RidgeCV and high-confidence Spearman summaries reuse the same
            essentiality-strength endpoint. The 1,229 × 16 residual-feature matrix has
            rank 12; <MathExpression expression={String.raw`\mathrm{F15}=0.19354839\times\mathrm{F3}`} />,{" "}
            <MathExpression expression={String.raw`\mathrm{F6}=-\mathrm{F5}`} />, and F4
            and F13 are zero. These quantities are therefore dependent evidence summaries
            rather than independent replications, and family-specific ridge coefficients
            are not independently identifiable. Dominant-study-proxy shares and explicit
            failure-mode review are retained because several headline and supporting
            annotations are concentrated within one source-study proxy.
          </p>
        </MethodSection>

        <MethodSection
          headingId="methods-dependency-aware-synthesis"
          ordinal="04.6"
          title="Dependency-aware synthesis"
        >
          <p>
            Figure 4 reorganizes frozen results from revised Figures 1–3. It does not fit
            a new model, rerun enrichment or residualization, or add an independent
            validation dataset. Family recurrence, same-label transfer, corrected ORA and
            rank summaries, conditional RidgeCV coefficients, high-confidence Spearman
            associations, and dominant-study-proxy shares remain separate quantities with
            different units, denominators, dependencies, and inferential scope.
          </p>
          <p>
            Candidate-table values are maxima over constituent family or query views. Cell
            shading is normalized within columns solely for display. The raw-metric atlas
            retains exact coordinates and does not jitter coincident observations. The
            transfer and fitness boundary tracks have different estimands, scales,
            replicate units, and uncertainty procedures and are not pooled. No combined
            evidence score, fitness-relevance score, calibrated probability, validation
            ladder, or causal model is defined. The final schematic is a claim-scope
            diagram; its arrows organize a descriptive sequence and do not represent a
            fitted structural or causal model.
          </p>
        </MethodSection>

        <MethodSection
          headingId="methods-tcga-structure"
          ordinal="04.7"
          title="TCGA bulk-expression scoring and descriptive cancer-type structure"
        >
          <p>
            Uniformly processed TCGA/Toil bulk-expression data and corrected cancer-type
            labels were obtained from the Xena-prepared cohort.
            <Citation references={["tcga2013", "vivian2017", "goldman2020"]} /> The frozen
            metadata contain 9,359 tumor-derived bulk-expression samples entering
            expression QC. The expression-QC rule
            <code>sample_median_axis_gene_expression</code>{" "}
            <MathExpression expression={String.raw`\ge 2.5`} /> retains 9,302 samples from
            9,302 unique patients and 33 corrected cancer-type categories. The retained
            cohort comprises 9,128 primary-tumor samples, 173 primary blood-derived cancer
            samples, and one recurrent-tumor sample.
          </p>
          <p>
            Fifteen candidate score definitions were imported from the frozen upstream
            registry. Their recovered gene lists contain 1,876 memberships across 970
            unique genes; 595 genes occur in at least two score sets. Twelve source labels
            are named, one is exploratory, and two are unresolved. Gene membership was
            defined in prior perturbational analyses rather than from TCGA cancer-type
            labels, which establishes dataset separation but not statistical independence,
            orthogonality, external validation, or causal identifiability. The revised
            release starts from frozen raw-score matrices; it does not document the upstream formula mapping TCGA expression
            plus registry membership to those raw scores.
            The absent expression-plus-registry formula prevents independent raw-score
            reconstruction and remains a provenance limitation.
          </p>
          <p>
            For each raw score <MathExpression expression="s_{ij}" />, define{" "}
            <MathExpression expression="g_{i,-j}" /> as the mean of the other 14 raw scores
            for sample <MathExpression expression="i" />, and{" "}
            <MathExpression expression="m_i" /> as that sample&apos;s median expression across
            retained score genes. The pooled leave-one-axis-out model is fitted once across
            all 9,302 samples:
          </p>
          <MathExpression
            display
            expression={String.raw`s_{ij}=\beta_{0j}+\beta_{1j}z(g_{i,-j})+\beta_{2j}z(m_i)+\varepsilon_{ij}.`}
          />
          <p>
            The residual score is <MathExpression expression="\varepsilon_{ij}" />. This
            is pooled leave-one-axis-out residualization: leave-one-axis-out covariate
            construction, not leave-one-sample-out validation, leave-one-cancer-type-out,
            cross-validation, external validation, or proof of deconfounding. No
            cancer-type label enters the regression, but fitting and evaluation occur in
            the same cohort. The 15 models account for 31.4%–98.6% of their respective
            raw-score variance, and large residual correlations remain.
          </p>
          <p>
            Raw, sample-centered, and pooled residual matrices are standardized column-wise
            separately before PCA. The displayed PCA is fitted to all 9,302 samples and all
            15 standardized pooled residual scores; cancer-type centroids are arithmetic
            means in the fitted PC1–PC2 coordinates, and samples rather than cancer types
            receive equal weight. The heat map uses the 12 named scores: pooled residuals
            are averaged within each cancer type, and each 12-value cancer-type row is
            centered and divided by its sample standard deviation (<code>ddof=1</code>).
            Heat-map color is therefore comparable only within a row.
          </p>
          <p>
            For score <MathExpression expression="j" />, the sample-weighted in-sample
            between-cancer-type variance fraction is
          </p>
          <MathExpression
            display
            expression={String.raw`\eta^2_{\mathrm{in},j}=\frac{\sum_c n_c(\bar s_{cj}-\bar s_j)^2}{\sum_i(s_{ij}-\bar s_j)^2}.`}
          />
          <p>
            It is calculated for all 15 raw and pooled residual scores in the same cohort
            without confidence intervals, permutation calibration, cancer-type balancing,
            or cross-validation. Spearman correlations are likewise computed across all
            9,302 samples for every score pair. These summaries measure same-cohort
            cancer-type-associated heterogeneity and residual dependence; they do not
            identify a cancer-type effect, lineage mechanism, tumor-cell-intrinsic program,
            transportability, or clinical validity. Bulk expression mixes malignant,
            immune, and stromal contributions and remains confounded with tissue of origin,
            purity, RNA content, sex, batch, and cohort structure.
            <Citation references={["hoadley2018", "aran2015"]} />
          </p>
        </MethodSection>

        <MethodSection
          headingId="methods-statistical-provenance"
          ordinal="04.8"
          title="Statistical reporting, provenance, and reproducibility"
        >
          <p>
            The unit of analysis, eligible denominator, missing-value rule, resampling
            unit, and multiplicity family are reported with each result. Undefined cosines
            from zero-norm vectors are excluded and finite denominators are shown.
            Population and sample standard deviations are distinguished where they differ.
            ORA and rank multiplicity are controlled separately; no multiplicity correction
            combines unlike analysis families. Uncertainty intervals are shown only for
            the prespecified cluster bootstrap. Ridge coefficients, family-level Spearman
            associations, recurrence scores, TCGA PCA summaries, row-standardized heat-map
            values, and <MathExpression expression={String.raw`\eta^2_{\mathrm{in}}`} />{" "}
            have no inferential interval in the frozen releases.
          </p>
          <p>
            The 18 July 2026 recovery audit located all 838 files listed in the historical
            output manifests and hashed 51 discoverable notebooks without read errors.
            This verifies a captured artifact snapshot, not the original execution
            environment, every run-to-notebook relationship, or end-to-end reproducibility.
            Revised Figures 1–5 additionally have figure-specific immutable releases with
            source tables, captions, manifests, checksums, and automated or rendered QA
            records. The historical analysis freeze remains 15 July 2026; editorial
            corrections and website releases update the Web report date and report version
            without changing that freeze.
          </p>
          <p>
            Remaining provenance gaps are material: META-003 and PREDICT-003B lack a
            complete row-level inclusion map; Figure 1 does not document the full
            2,720-to-1,630 filtering pathway; and study identity is approximated by
            dataset-name prefixes. The public Figure 1 record gives source-notebook digest
            <code>b9082d525c9f6aa58bf3cffa9ce56abf8e5f9bf2cf121c018a07497470fd1825</code>,
            whereas a historical provenance archive reviewed for this release contains a
            same-named notebook with digest
            <code>6d50bf02c73a06cf1433b890c1e81731d717f21e2fcd3160dcf8eac3f3fd3137</code>;
            the supplied artifacts do not reconcile that discrepancy. Figure 5&apos;s raw-score
            construction formula is absent, and its archived notebook digest
            <code>51dee19a0791dfada00fc021649eb19b87789edab728b7afec5be576c25c84f5</code>
            differs from a later same-named Drive inventory entry
            <code>72d1efabe3dd8c0447817dedae3d6004b47374065eb90f83f9179ad8d525fb81</code>
            that could not be recovered. These gaps limit independent reconstruction and
            are not resolved by publication graphics or checksums.
          </p>
        </MethodSection>
      </div>

      <aside aria-labelledby="historical-recovery-heading" className={styles.reproducibilityNote}>
        <div>
          <span>PROVENANCE / 18 JULY 2026</span>
          <h3 id="historical-recovery-heading">Historical recovery snapshot</h3>
        </div>
        <p>
          The recovery audit located all 838 historical output-manifest files and hashed
          51 discoverable notebooks without read errors. Its 838-of-838 result covers file
          recovery only; it does not verify the original execution environment, resolve
          notebook lineage, or establish end-to-end reproducibility.
        </p>
        <ul>
          <li>Figures 1–5 have separate audited, immutable release packages.</li>
          <li>Displayed assets expose local file and source-notebook hashes.</li>
          <li><a href="/research/cgt/data/cgt-cache-002-dataset-manifest.csv">Download the captured dataset manifest</a></li>
          <li><a href="/research/cgt/figures/manifest.json">Download the machine-readable figure manifest</a></li>
        </ul>
      </aside>
    </>
  );
}
