import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { toast } from "sonner";
import { AlertTriangle, ArrowLeft, Bookmark, BookmarkCheck, ExternalLink, FileText, Flag, Gift, Loader2, MapPin, Sparkles } from "lucide-react";
import { PublicPage } from "@/components/site/PublicPage";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CriterionBadge, DeadlineBadge, OverallBadge, VerificationBadge } from "@/components/opps/Badges";
import { supabase } from "@/integrations/supabase/client";
import { categoryLabel, formatDate, hostOf, safeUrl } from "@/lib/opportunity";
import { checkEligibility } from "@/lib/eligibility";
import { useAuth } from "@/lib/auth";
import { useSaved } from "@/lib/useSaved";
import { explainEligibility } from "@/lib/assistant.functions";

export const Route = createFileRoute("/opportunities/$id")({
  head: () => ({
    meta: [
      { title: "Opportunity details — ScholarScout" },
      { name: "description", content: "Eligibility, benefits, deadlines, documents and official links for this opportunity." },
      { property: "og:title", content: "Opportunity details — ScholarScout" },
      { property: "og:description", content: "Check eligibility and official links before you apply." },
    ],
  }),
  component: Detail,
});

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</dt>
      <dd className="mt-1 text-sm">{children}</dd>
    </div>
  );
}

const NS = <span className="text-muted-foreground italic">Not stated</span>;

function Detail() {
  const { id } = Route.useParams();
  const { user, profile } = useAuth();
  const { saved, toggle } = useSaved();
  const qc = useQueryClient();
  const explain = useServerFn(explainEligibility);
  const [aiText, setAiText] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [report, setReport] = useState("");

  const q = useQuery({
    queryKey: ["opp", id, user?.id],
    queryFn: async () => {
      const { data, error } = await supabase.from("opportunities").select("*").eq("id", id).maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  if (q.isLoading) return <PublicPage><div className="mx-auto max-w-5xl animate-pulse px-4 py-12"><div className="h-8 w-2/3 rounded bg-muted" /><div className="mt-4 h-40 rounded bg-muted" /></div></PublicPage>;
  const o = q.data;
  if (!o) return <PublicPage><div className="mx-auto max-w-xl px-4 py-20 text-center"><h1 className="text-2xl font-bold text-primary">Opportunity not found</h1><p className="mt-2 text-muted-foreground">It may have been removed or is awaiting review.</p><Button className="mt-6" asChild><Link to="/explore">Back to explore</Link></Button></div></PublicPage>;

  const elig = checkEligibility(profile, o.eligibility_criteria);
  const src = safeUrl(o.official_source_url);
  const app = safeUrl(o.official_application_url);

  const track = async () => {
    if (!user) return toast("Sign in to track applications");
    if (!saved.has(o.id)) await toggle(o.id);
    const { error } = await supabase.from("applications").upsert({ user_id: user.id, opportunity_id: o.id }, { onConflict: "user_id,opportunity_id", ignoreDuplicates: true });
    if (o.required_documents?.length)
      await supabase.from("document_checklist").upsert(o.required_documents.map((d) => ({ user_id: user.id, opportunity_id: o.id, document_name: d.slice(0, 200) })), { onConflict: "user_id,opportunity_id,document_name", ignoreDuplicates: true });
    if (error) return toast.error("Couldn't start tracking");
    qc.invalidateQueries({ queryKey: ["tracker"] });
    toast.success("Added to your application tracker");
  };

  const runExplain = async () => {
    setAiLoading(true);
    const r = await explain({ data: { opportunityId: o.id } });
    setAiLoading(false);
    if (r.ok) setAiText(r.answer);
    else toast.error(r.error);
  };

  const sendReport = async () => {
    if (!user) return toast("Sign in to report an issue");
    const msg = report.trim();
    if (msg.length < 3) return;
    const { error } = await supabase.from("issue_reports").insert({ user_id: user.id, opportunity_id: o.id, message: msg.slice(0, 1000) });
    if (error) return toast.error("Couldn't send report");
    setReport("");
    toast.success("Thanks — an admin will review this.");
  };

  return (
    <PublicPage>
      <div className="hero-wash border-b">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
          <Link to="/explore" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary"><ArrowLeft className="h-4 w-4" />All opportunities</Link>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-semibold text-secondary-foreground">{categoryLabel(o.category)}</span>
            <VerificationBadge status={o.verification_status} />
            <DeadlineBadge deadline={o.deadline} />
          </div>
          <h1 className="mt-3 text-3xl font-bold text-primary sm:text-4xl">{o.title}</h1>
          <p className="mt-2 text-muted-foreground">{o.provider ?? "Provider not stated"}</p>
          {o.is_demo && <p className="mt-3 inline-flex items-center gap-2 rounded-lg bg-lavender px-3 py-2 text-sm text-lavender-foreground"><AlertTriangle className="h-4 w-4" />Demo data for testing — not a real opportunity. Links point to example.org.</p>}
          {["pending", "needs_review"].includes(o.verification_status) && <p className="mt-3 inline-flex items-center gap-2 rounded-lg bg-warning-soft px-3 py-2 text-sm text-warning"><AlertTriangle className="h-4 w-4" />Discovered automatically and not yet reviewed. Confirm everything on the official source.</p>}
          <div className="mt-6 flex flex-wrap gap-2">
            <Button variant="secondary" onClick={() => toggle(o.id)}>{saved.has(o.id) ? <BookmarkCheck /> : <Bookmark />}{saved.has(o.id) ? "Saved" : "Save"}</Button>
            <Button onClick={track}>Track application</Button>
            {app && <Button variant="outline" asChild><a href={app} target="_blank" rel="noopener noreferrer nofollow">Apply on official site <ExternalLink /></a></Button>}
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-10 sm:px-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <section className="card-surface p-6">
            <h2 className="font-semibold text-primary">About this opportunity</h2>
            <p className="prose-safe mt-3 text-sm text-foreground/85">{o.description ?? "No description available."}</p>
            <dl className="mt-6 grid gap-5 sm:grid-cols-2">
              <Field label="Benefits / funding"><span className="inline-flex gap-1.5"><Gift className="h-4 w-4 text-lavender-foreground" />{o.benefits ?? NS}</span></Field>
              <Field label="Location / eligible regions"><span className="inline-flex gap-1.5"><MapPin className="h-4 w-4 text-muted-foreground" />{o.location_or_region ?? NS}</span></Field>
              <Field label="Applications open">{o.application_open_date ? formatDate(o.application_open_date) : NS}</Field>
              <Field label="Deadline">{o.deadline ? formatDate(o.deadline) : <span className="italic text-warning">Needs verification</span>}</Field>
            </dl>
          </section>

          <section className="card-surface p-6">
            <h2 className="font-semibold text-primary">Eligibility requirements</h2>
            {o.eligibility_text?.length ? <ul className="mt-3 list-disc space-y-1 pl-5 text-sm">{o.eligibility_text.map((e, i) => <li key={i}>{e}</li>)}</ul> : <p className="mt-3 text-sm italic text-muted-foreground">Not stated — check the official source.</p>}
          </section>

          <section className="rounded-xl border border-lavender-foreground/20 bg-lavender/40 p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="flex items-center gap-2 font-semibold text-primary"><Sparkles className="h-5 w-5 text-lavender-foreground" />Eligibility checker</h2>
              {user && <OverallBadge overall={elig.overall} />}
            </div>
            {!user ? (
              <p className="mt-3 text-sm">
                <Link to="/auth" className="font-semibold text-primary underline">Sign in</Link> and complete your profile to check your eligibility.
              </p>
            ) : (
              <>
                <p className="mt-2 text-xs text-muted-foreground">Rule-based comparison of explicit requirements with your profile. Not a guarantee — the provider makes the final decision.</p>
                {elig.results.length === 0 ? (
                  <p className="mt-4 text-sm">No structured criteria were extracted for this opportunity. Read the requirements above and confirm on the official page.</p>
                ) : (
                  <div className="mt-4 divide-y rounded-lg border bg-card">
                    {elig.results.map((r) => (
                      <div key={r.key} className="flex flex-col gap-2 p-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="text-sm font-medium">{r.label}: <span className="font-normal text-muted-foreground">{r.requirement}</span></p>
                          <p className="text-xs text-muted-foreground">{r.detail}</p>
                        </div>
                        <CriterionBadge status={r.status} />
                      </div>
                    ))}
                  </div>
                )}
                {elig.missing.length > 0 && <p className="mt-3 text-sm">Missing information: {elig.missing.map((m) => m.label).join(", ")}. <Link to="/onboarding" className="font-semibold text-primary underline">Update profile</Link></p>}
                <div className="mt-4">
                  <Button variant="secondary" onClick={runExplain} disabled={aiLoading}>{aiLoading ? <Loader2 className="animate-spin" /> : <Sparkles />}Explain in simple language</Button>
                  {aiText && <div className="prose-safe mt-4 rounded-lg bg-card p-4 text-sm">{aiText}</div>}
                </div>
              </>
            )}
            {o.source_excerpt && <blockquote className="mt-4 border-l-4 border-lavender-foreground/40 pl-3 text-sm italic text-foreground/80">“{o.source_excerpt}”<span className="mt-1 block text-xs not-italic text-muted-foreground">— excerpt from {hostOf(o.official_source_url)}</span></blockquote>}
          </section>

          <section className="grid gap-6 sm:grid-cols-2">
            <div className="card-surface p-6">
              <h2 className="flex items-center gap-2 font-semibold text-primary"><FileText className="h-5 w-5" />Required documents</h2>
              {o.required_documents?.length ? <ul className="mt-3 list-disc space-y-1 pl-5 text-sm">{o.required_documents.map((d) => <li key={d}>{d}</li>)}</ul> : <p className="mt-3 text-sm italic text-muted-foreground">Not stated</p>}
            </div>
            <div className="card-surface p-6">
              <h2 className="font-semibold text-primary">Application steps</h2>
              {o.application_steps?.length ? <ol className="mt-3 list-decimal space-y-1 pl-5 text-sm">{o.application_steps.map((s, i) => <li key={i}>{s}</li>)}</ol> : <p className="mt-3 text-sm italic text-muted-foreground">Not stated</p>}
            </div>
          </section>
        </div>

        <aside className="space-y-6">
          <div className="card-surface p-6">
            <h2 className="font-semibold text-primary">Official links</h2>
            <dl className="mt-4 space-y-4">
              <Field label="Original source page">{src ? <a href={src} target="_blank" rel="noopener noreferrer nofollow" className="inline-flex items-center gap-1 break-all text-primary underline">{hostOf(src)}<ExternalLink className="h-3 w-3" /></a> : NS}</Field>
              <Field label="Application page">{app ? <a href={app} target="_blank" rel="noopener noreferrer nofollow" className="inline-flex items-center gap-1 break-all text-primary underline">{hostOf(app)}<ExternalLink className="h-3 w-3" /></a> : <span className="italic text-muted-foreground">Not stated — use the source page</span>}</Field>
              <Field label="Last verified">{o.last_checked_at ? new Date(o.last_checked_at).toLocaleString("en-IN") : "Never"}</Field>
              <Field label="Verification status"><VerificationBadge status={o.verification_status} /></Field>
            </dl>
          </div>
          <div className="card-surface p-6">
            <h2 className="flex items-center gap-2 font-semibold text-primary"><Flag className="h-4 w-4" />Report an issue</h2>
            <p className="mt-1 text-xs text-muted-foreground">Incorrect, expired or broken? Let us know.</p>
            <Textarea className="mt-3" rows={3} value={report} onChange={(e) => setReport(e.target.value)} maxLength={1000} placeholder="What's wrong?" />
            <Button className="mt-2 w-full" variant="secondary" onClick={sendReport}>Send report</Button>
          </div>
        </aside>
      </div>
    </PublicPage>
  );
}
