
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import {
  ArrowRight,
  BellRing,
  Globe2,
  Search,
  ShieldCheck,
  Sparkles,
  UserRound,
  ListChecks,
  Radar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PublicPage } from "@/components/site/PublicPage";
import { OpportunityCard, CardSkeleton } from "@/components/opps/OpportunityCard";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { useSaved } from "@/lib/useSaved";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ScholarScout — Find scholarships, grants & competitions" },
      {
        name: "description",
        content:
          "Discover scholarships, grants, internships and hackathons from official sources, check eligibility and track deadlines.",
      },
      {
        property: "og:title",
        content: "ScholarScout — Find the Right Opportunities",
      },
      {
        property: "og:description",
        content:
          "AI + live-web discovery of student opportunities with eligibility checks and deadline tracking.",
      },
    ],
  }),
  component: Home,
});

const STEPS = [
  {
    icon: UserRound,
    title: "Create your student profile",
    text: "Share only what's needed for matching — skip anything optional.",
  },
  {
    icon: Radar,
    title: "Discover with live-web research",
    text: "TinyFish searches the web and reads official pages for you.",
  },
  {
    icon: ListChecks,
    title: "Check eligibility",
    text: "Rule-based checks show what you meet, miss, or need to confirm.",
  },
  {
    icon: BellRing,
    title: "Track applications & deadlines",
    text: "Save, follow your status and tick off required documents.",
  },
];

const FEATURES = [
  {
    icon: Sparkles,
    title: "AI matching",
    text: "Plain-language explanations grounded in the official source text.",
  },
  {
    icon: Globe2,
    title: "TinyFish live discovery",
    text: "Real search and page retrieval — never simulated results.",
  },
  {
    icon: BellRing,
    title: "Deadline tracking",
    text: "Upcoming deadlines surface on your dashboard first.",
  },
  {
    icon: ShieldCheck,
    title: "Source verification",
    text: "Every listing shows its source, review status and last check.",
  },
];

function Home() {
  const [q, setQ] = useState("");
  const navigate = useNavigate();
  const { profile, user } = useAuth();
  const { saved, toggle } = useSaved();

  const featured = useQuery({
    queryKey: ["featured"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("opportunities")
        .select("*")
        .in("verification_status", ["verified", "demo"])
        .order("deadline", { ascending: true, nullsFirst: false })
        .limit(3);

      if (error) throw error;
      return data;
    },
  });

  const search = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({
      to: "/explore",
      search: { q: q || undefined },
    });
  };

  return (
    <PublicPage>
      <section className="hero-wash">
        <div className="mx-auto max-w-5xl px-4 py-20 text-center sm:px-6 sm:py-28">
          <span className="inline-flex items-center gap-2 rounded-full bg-lavender px-3 py-1 text-xs font-semibold text-lavender-foreground">
            <Sparkles className="h-3.5 w-3.5" />
            Discover Opportunities. Unlock Your Future.
          </span>

          <h1 className="mt-6 text-4xl font-extrabold leading-tight text-primary sm:text-6xl">
            Find the Right Opportunities.
            <br />
            Build Your Future.
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground">
            ScholarScout finds scholarships, grants, internships and
            competitions from official sources, explains who can apply, and
            keeps your deadlines in one place.
          </p>

          <form
            onSubmit={search}
            className="mx-auto mt-8 flex max-w-2xl flex-col gap-2 rounded-2xl border bg-card p-2 shadow-lift sm:flex-row"
          >
            <div className="flex flex-1 items-center gap-2 px-3">
              <Search className="h-5 w-5 text-muted-foreground" />
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search scholarships, grants, internships, or competitions..."
                className="border-0 shadow-none focus-visible:ring-0"
                maxLength={200}
              />
            </div>
            <Button type="submit" size="lg">
              Search
            </Button>
          </form>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button size="lg" asChild>
              {user ? (
                <Link to="/explore">
                  Find My Opportunities <ArrowRight />
                </Link>
              ) : (
                <Link to="/auth" search={{ mode: "signup" }}>
                  Find My Opportunities <ArrowRight />
                </Link>
              )}
            </Button>

            <Button size="lg" variant="secondary" asChild>
              <Link to="/explore">Explore Opportunities</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-primary sm:text-3xl">
              Featured opportunities
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Closest deadlines first. Records marked “Demo data” are samples
              for testing.
            </p>
          </div>

          <Link
            to="/explore"
            className="hidden text-sm font-semibold text-primary hover:underline sm:block"
          >
            View all →
          </Link>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {featured.isLoading &&
            [0, 1, 2].map((i) => <CardSkeleton key={i} />)}

          {featured.data?.map((o) => (
            <OpportunityCard
              key={o.id}
              opp={o}
              profile={profile}
              saved={saved.has(o.id)}
              onToggleSave={() => toggle(o.id)}
            />
          ))}

          {featured.data?.length === 0 && (
            <p className="text-muted-foreground">No opportunities yet.</p>
          )}
        </div>
      </section>

      <section className="border-y bg-muted">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <h2 className="text-center text-2xl font-bold text-primary sm:text-3xl">
            How it works
          </h2>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s, i) => (
              <div key={s.title} className="card-surface p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <s.icon className="h-5 w-5" />
                </div>
                <p className="mt-4 text-xs font-semibold text-muted-foreground">
                  STEP {i + 1}
                </p>
                <h3 className="mt-1 font-semibold text-primary">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f) => (
            <div key={f.title} className="rounded-xl border p-6">
              <f.icon className="h-6 w-6 text-lavender-foreground" />
              <h3 className="mt-3 font-semibold text-primary">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6">
        <div className="rounded-2xl bg-primary p-8 text-primary-foreground sm:p-12">
          <ShieldCheck className="h-8 w-8" />
          <h2 className="mt-4 text-2xl font-bold sm:text-3xl">
            Transparent by design
          </h2>
          <p className="mt-3 max-w-3xl opacity-90">
            Every opportunity links to its original source and its application
            page separately. Newly discovered records stay unverified until
            reviewed. Anything we can't confirm is shown as “Not stated” — we
            never fill gaps with guesses.
          </p>
          <Button variant="secondary" className="mt-6" asChild>
            <Link to="/about">How we verify sources</Link>
          </Button>
        </div>
      </section>
    </PublicPage>
  );
}
