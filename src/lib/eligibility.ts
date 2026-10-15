/**
 * Deterministic eligibility engine. Compares explicit, structured criteria
 * against a student profile. AI may explain results but never overrides them.
 */
export type Criteria = {
  education_levels?: string[];
  fields?: string[];
  min_score?: number | null;
  regions?: string[];
  max_income?: number | null;
  academic_years?: number[];
  social_categories?: string[];
  other?: string[];
};

export type CriterionStatus = "meets" | "fails" | "missing" | "manual";
export type CriterionResult = {
  key: string;
  label: string;
  requirement: string;
  status: CriterionStatus;
  detail: string;
};
export type Overall = "eligible" | "potentially" | "ineligible" | "needs_verification";

export type ProfileLike = {
  education_level?: string | null;
  course?: string | null;
  field_of_study?: string | null;
  academic_year?: number | null;
  region?: string | null;
  country?: string | null;
  academic_score?: number | null;
  annual_family_income?: number | null;
  social_category?: string | null;
  interests?: string[] | null;
  preferred_opportunity_types?: string[] | null;
};

const norm = (s: string) => s.toLowerCase().trim();
const OPEN_REGIONS = ["online", "global", "worldwide", "any", "international", "all"];

export const STATUS_LABEL: Record<CriterionStatus, string> = {
  meets: "Meets requirement",
  fails: "Does not meet requirement",
  missing: "Information missing",
  manual: "Needs manual verification",
};

export const OVERALL_LABEL: Record<Overall, string> = {
  eligible: "Eligible based on available criteria",
  potentially: "Potentially eligible",
  ineligible: "Ineligible based on a confirmed unmet requirement",
  needs_verification: "Needs verification",
};

export function parseCriteria(raw: unknown): Criteria {
  if (!raw || typeof raw !== "object") return {};
  return raw as Criteria;
}

export function checkEligibility(profile: ProfileLike | null, rawCriteria: unknown) {
  const c = parseCriteria(rawCriteria);
  const p = profile ?? {};
  const results: CriterionResult[] = [];

  if (c.education_levels?.length) {
    const req = c.education_levels.join(" or ");
    if (!p.education_level)
      results.push({ key: "education", label: "Education level", requirement: req, status: "missing", detail: "Add your education level to your profile." });
    else {
      const ok = c.education_levels.map(norm).includes(norm(p.education_level));
      results.push({ key: "education", label: "Education level", requirement: req, status: ok ? "meets" : "fails", detail: `Your profile: ${p.education_level}` });
    }
  }

  if (c.fields?.length) {
    const req = c.fields.join(", ");
    const hay = [p.course, p.field_of_study, ...(p.interests ?? [])].filter(Boolean).map((x) => norm(x as string));
    if (!hay.length)
      results.push({ key: "field", label: "Course / field of study", requirement: req, status: "missing", detail: "Add your course or field of study." });
    else {
      const ok = c.fields.some((f) => hay.some((h) => h.includes(norm(f)) || norm(f).includes(h)));
      results.push({
        key: "field",
        label: "Course / field of study",
        requirement: req,
        status: ok ? "meets" : "manual",
        detail: ok ? `Your course: ${p.course ?? p.field_of_study}` : "Your course wording doesn't clearly match — check the official definition.",
      });
    }
  }

  if (c.academic_years?.length) {
    const req = `Year ${c.academic_years.join(" or ")}`;
    if (p.academic_year == null)
      results.push({ key: "year", label: "Academic year", requirement: req, status: "missing", detail: "Add your current academic year." });
    else
      results.push({ key: "year", label: "Academic year", requirement: req, status: c.academic_years.includes(p.academic_year) ? "meets" : "fails", detail: `Your profile: year ${p.academic_year}` });
  }

  if (c.min_score != null) {
    const req = `Minimum ${c.min_score}%`;
    if (p.academic_score == null)
      results.push({ key: "score", label: "Academic score", requirement: req, status: "missing", detail: "Add your latest percentage / CGPA equivalent." });
    else
      results.push({ key: "score", label: "Academic score", requirement: req, status: Number(p.academic_score) >= c.min_score ? "meets" : "fails", detail: `Your profile: ${p.academic_score}%` });
  }

  if (c.regions?.length) {
    const req = c.regions.join(", ");
    const open = c.regions.some((r) => OPEN_REGIONS.includes(norm(r)));
    const mine = [p.region, p.country].filter(Boolean).map((x) => norm(x as string));
    if (open) results.push({ key: "region", label: "Location", requirement: req, status: "meets", detail: "Open to all locations." });
    else if (!mine.length)
      results.push({ key: "region", label: "Location", requirement: req, status: "missing", detail: "Add your state / region." });
    else {
      const ok = c.regions.some((r) => mine.some((m) => m.includes(norm(r)) || norm(r).includes(m)));
      results.push({ key: "region", label: "Location", requirement: req, status: ok ? "meets" : "manual", detail: `Your profile: ${[p.region, p.country].filter(Boolean).join(", ")}` });
    }
  }

  if (c.max_income != null) {
    const req = `Family income up to ₹${c.max_income.toLocaleString("en-IN")} / year`;
    if (p.annual_family_income == null)
      results.push({ key: "income", label: "Family income", requirement: req, status: "missing", detail: "Optional: add annual family income to check this." });
    else
      results.push({ key: "income", label: "Family income", requirement: req, status: Number(p.annual_family_income) <= c.max_income ? "meets" : "fails", detail: "Compared with your saved income." });
  }

  if (c.social_categories?.length) {
    const req = c.social_categories.join(", ");
    if (!p.social_category)
      results.push({ key: "category", label: "Category", requirement: req, status: "missing", detail: "Optional: add your category to check this." });
    else {
      const ok = c.social_categories.map(norm).includes(norm(p.social_category));
      results.push({ key: "category", label: "Category", requirement: req, status: ok ? "meets" : "fails", detail: `Your profile: ${p.social_category}` });
    }
  }

  for (const [i, o] of (c.other ?? []).entries())
    results.push({ key: `other-${i}`, label: "Other condition", requirement: o, status: "manual", detail: "Check this condition on the official page." });

  let overall: Overall;
  if (results.some((r) => r.status === "fails")) overall = "ineligible";
  else if (results.length === 0 || results.some((r) => r.status === "missing")) overall = "needs_verification";
  else if (results.some((r) => r.status === "manual")) overall = "potentially";
  else overall = "eligible";

  return {
    results,
    overall,
    satisfied: results.filter((r) => r.status === "meets"),
    unsatisfied: results.filter((r) => r.status === "fails"),
    missing: results.filter((r) => r.status === "missing"),
    manual: results.filter((r) => r.status === "manual"),
  };
}

/** Relevance score (0–100) for ranking only. Not an eligibility guarantee. */
export function relevanceScore(profile: ProfileLike | null, opp: { category: string; eligibility_criteria: unknown; deadline: string | null }) {
  if (!profile) return 0;
  const e = checkEligibility(profile, opp.eligibility_criteria);
  let s = 40;
  if (profile.preferred_opportunity_types?.includes(opp.category)) s += 20;
  s += e.satisfied.length * 8;
  s -= e.unsatisfied.length * 30;
  s -= e.missing.length * 3;
  if (opp.deadline) {
    const d = (new Date(opp.deadline).getTime() - Date.now()) / 86400000;
    if (d < 0) s -= 40;
    else if (d < 30) s += 5;
  }
  return Math.max(0, Math.min(100, Math.round(s)));
}
