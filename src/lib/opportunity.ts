import type { Database } from "@/integrations/supabase/types";

export type Opportunity = Database["public"]["Tables"]["opportunities"]["Row"];
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];

export const CATEGORIES = [
  { value: "scholarship", label: "Scholarships" },
  { value: "grant", label: "Grants & fellowships" },
  { value: "internship", label: "Internships" },
  { value: "hackathon", label: "Hackathons" },
  { value: "competition", label: "Competitions" },
  { value: "other", label: "Other opportunities" },
] as const;

export const categoryLabel = (c: string | null | undefined) =>
  CATEGORIES.find((x) => x.value === c)?.label.replace(/s$/, "") ?? "Opportunity";

export const EDUCATION_LEVELS = [
  { value: "school", label: "School (Class 9–12)" },
  { value: "diploma", label: "Diploma" },
  { value: "undergraduate", label: "Undergraduate" },
  { value: "postgraduate", label: "Postgraduate" },
  { value: "doctoral", label: "PhD / Doctoral" },
] as const;

export const APP_STATUSES = [
  { value: "not_started", label: "Not started" },
  { value: "in_progress", label: "In progress" },
  { value: "applied", label: "Applied" },
  { value: "completed", label: "Completed" },
  { value: "closed", label: "Closed / not pursuing" },
] as const;

export const appStatusLabel = (s: string) => APP_STATUSES.find((x) => x.value === s)?.label ?? s;

export const VERIFICATION_LABELS: Record<string, string> = {
  verified: "Verified source",
  demo: "Demo data",
  pending: "Awaiting review",
  needs_review: "Needs verification",
  rejected: "Rejected",
  expired: "Expired",
};

export function daysUntil(date: string | null): number | null {
  if (!date) return null;
  const d = new Date(date + "T23:59:59");
  return Math.ceil((d.getTime() - Date.now()) / 86400000);
}

export function formatDate(date: string | null | undefined): string {
  if (!date) return "Not stated";
  const d = new Date(date.length === 10 ? date + "T00:00:00" : date);
  if (Number.isNaN(d.getTime())) return "Not stated";
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

/** Only allow http(s) links to be rendered as clickable. */
export function safeUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  try {
    const u = new URL(url);
    return u.protocol === "https:" || u.protocol === "http:" ? u.toString() : null;
  } catch {
    return null;
  }
}

export function hostOf(url: string | null | undefined) {
  try {
    return url ? new URL(url).hostname.replace(/^www\./, "") : "";
  } catch {
    return "";
  }
}
