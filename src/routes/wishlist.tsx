import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/wishlist")({
  head: () => ({ meta: [{ title: "Wishlist — Incartion" }, { name: "description", content: "Wishlist at Incartion." }, { property: "og:title", content: "Wishlist — Incartion" }, { property: "og:description", content: "Wishlist at Incartion." }] }),
  component: Page,
});

function Page() {
  return (
    <div className="px-4 py-24 text-center">
      <h1 className="text-2xl font-black">Wishlist</h1>
      <p className="mt-2 text-sm text-muted-foreground">This page is coming next.</p>
      <Button asChild className="mt-6"><Link to="/products">Continue shopping</Link></Button>
    </div>
  );
}
