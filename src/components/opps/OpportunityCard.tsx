import { Link } from "@tanstack/react-router";
import { Bookmark, BookmarkCheck, Building2, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import { categoryLabel, formatDate, type Opportunity, type Profile } from "@/lib/opportunity";
import { checkEligibility } from "@/lib/eligibility";
import { DeadlineBadge, OverallBadge, VerificationBadge } from "./Badges";

export function OpportunityCard({ opp, profile, saved, onToggleSave }: { opp: Opportunity; profile?: Profile | null; saved?: boolean; onToggleSave?: () => void }) {
  const elig = profile ? checkEligibility(profile, opp.eligibility_criteria) : null;
  return (
    <article className="card-surface flex flex-col p-5 transition-shadow hover:shadow-lift">
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-semibold text-secondary-foreground">{categoryLabel(opp.category)}</span>
        <VerificationBadge status={opp.verification_status} />
      </div>
      <h3 className="mt-3 line-clamp-2 text-lg font-semibold text-primary">{opp.title}</h3>
      <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground"><Building2 className="h-4 w-4" />{opp.provider ?? "Provider not stated"}</p>
      <p className="mt-3 line-clamp-2 text-sm text-foreground/80">{opp.description ?? "No description available."}</p>
      <p className="mt-3 flex items-start gap-1.5 text-sm"><Gift className="mt-0.5 h-4 w-4 shrink-0 text-lavender-foreground" /><span className="line-clamp-1">{opp.benefits ?? "Benefits not stated"}</span></p>
      <div className="mt-3 flex flex-wrap gap-2">
        <DeadlineBadge deadline={opp.deadline} />
        {elig && <OverallBadge overall={elig.overall} />}
      </div>
      <p className="mt-3 text-xs text-muted-foreground">Deadline: {formatDate(opp.deadline)} · Last checked {formatDate(opp.last_checked_at)}</p>
      <div className="mt-4 flex gap-2 pt-1">
        <Button asChild className="flex-1"><Link to="/opportunities/$id" params={{ id: opp.id }}>View Details</Link></Button>
        {onToggleSave && (
          <Button variant="secondary" onClick={onToggleSave} aria-label={saved ? "Unsave" : "Save"}>
            {saved ? <BookmarkCheck /> : <Bookmark />}
            {saved ? "Saved" : "Save"}
          </Button>
        )}
      </div>
    </article>
  );
}

export function CardSkeleton() {
  return (
    <div className="card-surface animate-pulse p-5">
      <div className="h-4 w-24 rounded bg-muted" />
      <div className="mt-4 h-5 w-3/4 rounded bg-muted" />
      <div className="mt-2 h-4 w-1/2 rounded bg-muted" />
      <div className="mt-4 h-12 rounded bg-muted" />
      <div className="mt-6 h-9 rounded bg-muted" />
    </div>
  );
}
