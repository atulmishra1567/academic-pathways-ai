import { createFileRoute } from "@tanstack/react-router";
import { PublicPage, PageHeading } from "@/components/site/PublicPage";

export const Route = createFileRoute("/privacy")({
  head: () => ({ meta: [{ title: "Privacy Policy — ScholarScout" }, { name: "description", content: "Privacy Policy — ScholarScout" }, { property: "og:title", content: "Privacy Policy — ScholarScout" }, { property: "og:description", content: "Privacy Policy — ScholarScout" }] }),
  component: () => (
    <PublicPage>
      <PageHeading title="Privacy Policy" />
      <p className="mx-auto max-w-3xl px-4 py-12 leading-7 text-foreground/85">Prototype policy: we store your account email and the optional profile fields you choose to share, used only for matching. Search queries sent to TinyFish never include income or category data. AI explanations use the Lovable AI Gateway.</p>
    </PublicPage>
  ),
});
