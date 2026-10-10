import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/orders")({
  head: () => ({ meta: [{ title: "My Orders — Incartion" }, { name: "description", content: "My Orders at Incartion." }, { property: "og:title", content: "My Orders — Incartion" }, { property: "og:description", content: "My Orders at Incartion." }] }),
  component: Page,
});

function Page() {
  return (
    <div className="px-4 py-24 text-center">
      <h1 className="text-2xl font-black">My Orders</h1>
      <p className="mt-2 text-sm text-muted-foreground">This page is coming next.</p>
      <Button asChild className="mt-6"><Link to="/products">Continue shopping</Link></Button>
    </div>
  );
}
