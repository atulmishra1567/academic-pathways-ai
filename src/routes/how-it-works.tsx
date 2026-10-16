import { createFileRoute } from "@tanstack/react-router";
import { PublicPage, PageHeading } from "@/components/site/PublicPage";

export const Route = createFileRoute("/how-it-works")({
  head: () => ({ meta: [{ title: "How It Works — ScholarScout" }, { name: "description", content: "How It Works — ScholarScout" }, { property: "og:title", content: "How It Works — ScholarScout" }, { property: "og:description", content: "How It Works — ScholarScout" }] }),
  component: () => (
    <PublicPage>
      <PageHeading title="How It Works" />
      <p className="mx-auto max-w-3xl px-4 py-12 leading-7 text-foreground/85">Create a profile, run a live TinyFish search, review rule-based eligibility, then save and track applications.</p>
    </PublicPage>
  ),
});
