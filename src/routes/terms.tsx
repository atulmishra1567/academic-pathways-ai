import { createFileRoute } from "@tanstack/react-router";
import { PublicPage, PageHeading } from "@/components/site/PublicPage";

export const Route = createFileRoute("/terms")({
  head: () => ({ meta: [{ title: "Terms — ScholarScout" }, { name: "description", content: "Terms — ScholarScout" }, { property: "og:title", content: "Terms — ScholarScout" }, { property: "og:description", content: "Terms — ScholarScout" }] }),
  component: () => (
    <PublicPage>
      <PageHeading title="Terms" />
      <p className="mx-auto max-w-3xl px-4 py-12 leading-7 text-foreground/85">ScholarScout is a prototype. Information may be incomplete or out of date; verify with official providers before applying.</p>
    </PublicPage>
  ),
});
