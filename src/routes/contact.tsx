import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/contact")({
  head: () => ({ meta: [{ title: "Contact Us — Incartion" }, { name: "description", content: "Contact Us at Incartion." }, { property: "og:title", content: "Contact Us — Incartion" }, { property: "og:description", content: "Contact Us at Incartion." }] }),
  component: Page,
});

function Page() {
  return (
    <div className="px-4 py-24 text-center">
      <h1 className="text-2xl font-black">Contact Us</h1>
      <p className="mt-2 text-sm text-muted-foreground">This page is coming next.</p>
      <Button asChild className="mt-6"><Link to="/products">Continue shopping</Link></Button>
    </div>
  );
}
