export type ResearchResultNavItem = {
  id: string;
  label: string;
  ordinal?: string;
  shortLabel?: string;
};

export type ResearchResultsNavigation = {
  regionId: string;
  label?: string;
  items: readonly ResearchResultNavItem[];
};

const urlSafeId = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** Validate an article's explicit Results navigation at module load or in tests. */
export function defineResearchResultsNavigation<T extends ResearchResultsNavigation>(config: T): T {
  const ids = [config.regionId, ...config.items.map(({ id }) => id)];
  if (!config.items.length) throw new Error("Results navigation requires at least one subsection");
  if (ids.some((id) => !urlSafeId.test(id))) throw new Error("Results navigation IDs must be URL-safe");
  if (new Set(ids).size !== ids.length) throw new Error("Results navigation IDs must be unique");
  if (config.items.some(({ label }) => !label.trim())) throw new Error("Results navigation labels must not be empty");
  return config;
}

/** Deterministically choose the last heading above the activation line, or the first upcoming heading. */
export function selectActiveResultId(
  headings: readonly { id: string; top: number }[],
  activationLine: number,
): string | null {
  if (!headings.length) return null;
  let active = headings[0].id;
  for (const heading of headings) {
    if (heading.top > activationLine) break;
    active = heading.id;
  }
  return active;
}
