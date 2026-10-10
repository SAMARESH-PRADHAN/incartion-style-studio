import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/about")({
  head: () => ({ meta: [{ title: "About Us — Incartion" }, { name: "description", content: "About Us at Incartion." }, { property: "og:title", content: "About Us — Incartion" }, { property: "og:description", content: "About Us at Incartion." }] }),
  component: Page,
});

function Page() {
  return (
    <div className="px-4 py-24 text-center">
      <h1 className="text-2xl font-black">About Us</h1>
      <p className="mt-2 text-sm text-muted-foreground">This page is coming next.</p>
      <Button asChild className="mt-6"><Link to="/products">Continue shopping</Link></Button>
    </div>
  );
}
