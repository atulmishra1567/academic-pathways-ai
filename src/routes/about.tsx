import { createFileRoute } from "@tanstack/react-router";
import { PublicPage, PageHeading } from "@/components/site/PublicPage";

export const Route = createFileRoute("/about")({
  head: () => ({ meta: [{ title: "About & Trust — ScholarScout" }, { name: "description", content: "About & Trust — ScholarScout" }, { property: "og:title", content: "About & Trust — ScholarScout" }, { property: "og:description", content: "About & Trust — ScholarScout" }] }),
  component: () => (
    <PublicPage>
      <PageHeading title="About & Trust" />
      <p className="mx-auto max-w-3xl px-4 py-12 leading-7 text-foreground/85">ScholarScout helps students discover and assess opportunities using TinyFish live-web Search and Fetch plus AI summaries grounded in official source text. Newly discovered records stay unverified until an admin reviews them. We do not guarantee eligibility, awards or selection — always confirm on the official source. Report incorrect or expired information from any opportunity page.</p>
    </PublicPage>
  ),
});
