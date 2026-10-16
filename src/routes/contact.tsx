import { createFileRoute } from "@tanstack/react-router";
import { PublicPage, PageHeading } from "@/components/site/PublicPage";

export const Route = createFileRoute("/contact")({
  head: () => ({ meta: [{ title: "Contact — ScholarScout" }, { name: "description", content: "Contact — ScholarScout" }, { property: "og:title", content: "Contact — ScholarScout" }, { property: "og:description", content: "Contact — ScholarScout" }] }),
  component: () => (
    <PublicPage>
      <PageHeading title="Contact" />
      <p className="mx-auto max-w-3xl px-4 py-12 leading-7 text-foreground/85">Use the Report an issue box on any opportunity page, or reach the team through the project owner.</p>
    </PublicPage>
  ),
});
