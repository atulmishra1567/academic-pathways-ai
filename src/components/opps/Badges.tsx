import { BadgeCheck, Clock, FlaskConical, ShieldAlert, ShieldQuestion, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { VERIFICATION_LABELS, daysUntil } from "@/lib/opportunity";
import type { CriterionStatus, Overall } from "@/lib/eligibility";
import { OVERALL_LABEL, STATUS_LABEL } from "@/lib/eligibility";

const pill = "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium";

export function VerificationBadge({ status }: { status: string }) {
  const map: Record<string, [string, React.ComponentType<{ className?: string }>]> = {
    verified: ["bg-success-soft text-success", BadgeCheck],
    demo: ["bg-lavender text-lavender-foreground", FlaskConical],
    pending: ["bg-sky text-sky-foreground", ShieldQuestion],
    needs_review: ["bg-warning-soft text-warning", ShieldAlert],
    rejected: ["bg-danger-soft text-destructive", XCircle],
    expired: ["bg-muted text-muted-foreground", Clock],
  };
  const [cls, Icon] = (map[status] ?? map["pending"])!;
  return (
    <span className={cn(pill, cls)}>
      <Icon className="h-3.5 w-3.5" />
      {VERIFICATION_LABELS[status] ?? status}
    </span>
  );
}

export function DeadlineBadge({ deadline }: { deadline: string | null }) {
  const d = daysUntil(deadline);
  if (d == null) return <span className={cn(pill, "bg-muted text-muted-foreground")}>Deadline not stated</span>;
  if (d < 0) return <span className={cn(pill, "bg-muted text-muted-foreground")}>Closed</span>;
  return <span className={cn(pill, d <= 7 ? "bg-danger-soft text-destructive" : d <= 21 ? "bg-warning-soft text-warning" : "bg-sky text-sky-foreground")}><Clock className="h-3.5 w-3.5" />{d === 0 ? "Due today" : `${d} days left`}</span>;
}

export function OverallBadge({ overall }: { overall: Overall }) {
  const cls: Record<Overall, string> = {
    eligible: "bg-success-soft text-success",
    potentially: "bg-sky text-sky-foreground",
    ineligible: "bg-danger-soft text-destructive",
    needs_verification: "bg-warning-soft text-warning",
  };
  return <span className={cn(pill, cls[overall])}>{OVERALL_LABEL[overall]}</span>;
}

export function CriterionBadge({ status }: { status: CriterionStatus }) {
  const cls: Record<CriterionStatus, string> = {
    meets: "bg-success-soft text-success",
    fails: "bg-danger-soft text-destructive",
    missing: "bg-warning-soft text-warning",
    manual: "bg-lavender text-lavender-foreground",
  };
  return <span className={cn(pill, "whitespace-nowrap", cls[status])}>{STATUS_LABEL[status]}</span>;
}
