import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { z } from "zod";
import { RotateCcw, SearchX } from "lucide-react";
import { PublicPage, PageHeading } from "@/components/site/PublicPage";
import { OpportunityCard, CardSkeleton } from "@/components/opps/OpportunityCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { CATEGORIES, daysUntil } from "@/lib/opportunity";
import { checkEligibility, relevanceScore } from "@/lib/eligibility";
import { useAuth } from "@/lib/auth";
import { useSaved } from "@/lib/useSaved";

const searchSchema = z.object({
  q: z.string().optional(),
  category: z.string().optional(),
});

export const Route = createFileRoute("/explore")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Explore Opportunities — ScholarScout" },
      { name: "description", content: "Search and filter scholarships, grants, internships, hackathons and competitions." },
      { property: "og:title", content: "Explore Opportunities — ScholarScout" },
      { property: "og:description", content: "Browse verified student opportunities with deadlines and eligibility." },
    ],
  }),
  component: Explore,
});

const PAGE = 9;

function Explore() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/explore" });
  const { profile } = useAuth();
  const { saved, toggle } = useSaved();
  const [q, setQ] = useState(search.q ?? "");
  const [location, setLocation] = useState("");
  const [deadline, setDeadline] = useState("any");
  const [elig, setElig] = useState("any");
  const [benefits, setBenefits] = useState("any");
  const [sort, setSort] = useState(profile ? "relevance" : "deadline");
  const [limit, setLimit] = useState(PAGE);
  const category = search.category ?? "all";

  const query = useQuery({
    queryKey: ["opps", "public"],
    queryFn: async () => {
      const { data, error } = await supabase.from("opportunities").select("*").in("verification_status", ["verified", "demo"]).limit(500);
      if (error) throw error;
      return data;
    },
  });

  const list = useMemo(() => {
    const term = q.trim().toLowerCase();
    let r = (query.data ?? []).filter((o) => {
      if (category !== "all" && o.category !== category) return false;
      if (term && ![o.title, o.provider, o.description, ...(o.eligibility_text ?? [])].join(" ").toLowerCase().includes(term)) return false;
      if (location && !(o.location_or_region ?? "").toLowerCase().includes(location.toLowerCase())) return false;
      const d = daysUntil(o.deadline);
      if (deadline === "open" && d != null && d < 0) return false;
      if (deadline === "7" && (d == null || d < 0 || d > 7)) return false;
      if (deadline === "30" && (d == null || d < 0 || d > 30)) return false;
      if (benefits === "stated" && !o.benefits) return false;
      if (elig !== "any" && profile) {
        const e = checkEligibility(profile, o.eligibility_criteria).overall;
        if (elig === "match" && e === "ineligible") return false;
        if (elig === "eligible" && e !== "eligible") return false;
      }
      return true;
    });
    r = [...r].sort((a, b) => {
      if (sort === "relevance") return relevanceScore(profile, b) - relevanceScore(profile, a);
      if (sort === "verified") return (b.last_checked_at ?? "").localeCompare(a.last_checked_at ?? "");
      return (a.deadline ?? "9999").localeCompare(b.deadline ?? "9999");
    });
    return r;
  }, [query.data, q, category, location, deadline, benefits, elig, sort, profile]);

  const reset = () => {
    setQ(""); setLocation(""); setDeadline("any"); setElig("any"); setBenefits("any");
    navigate({ search: {} });
  };

  return (
    <PublicPage>
      <PageHeading title="Explore Opportunities" subtitle="Search verified listings. Signed-in students see eligibility status on every card." />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="flex flex-wrap gap-2">
          {[{ value: "all", label: "All" }, ...CATEGORIES].map((c) => (
            <button key={c.value} onClick={() => navigate({ search: (s) => ({ ...s, category: c.value === "all" ? undefined : c.value }) })} className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${category === c.value ? "border-primary bg-primary text-primary-foreground" : "bg-card hover:bg-secondary"}`}>
              {c.label}
            </button>
          ))}
        </div>
        <div className="card-surface mt-5 grid gap-3 p-4 md:grid-cols-6">
          <Input className="md:col-span-2" placeholder="Title, provider, keyword or field…" value={q} onChange={(e) => setQ(e.target.value)} maxLength={100} />
          <Input placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} maxLength={60} />
          <Select value={deadline} onValueChange={setDeadline}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any deadline</SelectItem>
              <SelectItem value="open">Not closed</SelectItem>
              <SelectItem value="7">Within 7 days</SelectItem>
              <SelectItem value="30">Within 30 days</SelectItem>
            </SelectContent>
          </Select>
          <Select value={profile ? elig : "any"} onValueChange={setElig} disabled={!profile}>
            <SelectTrigger><SelectValue placeholder="Eligibility" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="any">{profile ? "Any eligibility" : "Sign in for eligibility"}</SelectItem>
              <SelectItem value="match">Hide ineligible</SelectItem>
              <SelectItem value="eligible">Eligible only</SelectItem>
            </SelectContent>
          </Select>
          <Select value={benefits} onValueChange={setBenefits}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any benefits</SelectItem>
              <SelectItem value="stated">Benefits stated</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">{list.length} opportunities</p>
          <div className="flex items-center gap-2">
            <Select value={sort} onValueChange={setSort}>
              <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="relevance" disabled={!profile}>Sort: Relevance</SelectItem>
                <SelectItem value="deadline">Sort: Deadline</SelectItem>
                <SelectItem value="verified">Sort: Recently verified</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="ghost" onClick={reset}><RotateCcw />Reset</Button>
          </div>
        </div>
        {query.isError && <p className="mt-8 rounded-lg bg-danger-soft p-4 text-sm text-destructive">Couldn't load opportunities. <button className="underline" onClick={() => query.refetch()}>Retry</button></p>}
        <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {query.isLoading && Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
          {list.slice(0, limit).map((o) => <OpportunityCard key={o.id} opp={o} profile={profile} saved={saved.has(o.id)} onToggleSave={() => toggle(o.id)} />)}
        </div>
        {!query.isLoading && list.length === 0 && (
          <div className="mt-10 flex flex-col items-center text-center">
            <SearchX className="h-10 w-10 text-muted-foreground" />
            <p className="mt-3 font-semibold text-primary">No opportunities match your filters</p>
            <p className="text-sm text-muted-foreground">Try clearing filters, or run a live web discovery.</p>
            <Button className="mt-4" variant="secondary" onClick={reset}>Clear filters</Button>
          </div>
        )}
        {list.length > limit && <div className="mt-8 text-center"><Button variant="secondary" onClick={() => setLimit(limit + PAGE)}>Load more</Button></div>}
      </div>
    </PublicPage>
  );
}
