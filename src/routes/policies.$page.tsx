import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Container } from "@/components/common/Reveal";

const pages: Record<string, { title: string; body: [string, string][] }> = {
  terms: { title: "Terms of Use", body: [["Acceptance", "By using incartion.in you agree to these terms. Prices and availability may change without notice."], ["Orders", "Orders are confirmed once payment or a purchase order is received. Customised orders cannot be cancelled after production starts."], ["Jurisdiction", "All disputes are subject to the courts of Bhubaneswar, Odisha."]] },
  privacy: { title: "Privacy Policy", body: [["What we collect", "Name, contact details, addresses and order history needed to fulfil your orders."], ["How we use it", "To process orders, provide support and — with your consent — send offers. We never sell your data."], ["Your rights", "Write to hello@incartion.in to access or delete your data."]] },
  shipping: { title: "Shipping Policy", body: [["Coverage", "We ship to 19,000+ pincodes across India via trusted courier partners."], ["Timelines", "Ready stock: 2–5 days. Customised orders: 7–14 days. Bulk orders: as agreed in your quote."], ["Charges", "Free delivery on orders above ₹999; ₹79 otherwise."]] },
  returns: { title: "Returns & Refunds", body: [["Final Sale / No Returns", "Final Sale / No Returns: As garments are manufactured and customized to order, Incartion does not accept returns or exchanges except for proven transit damage or manufacturing defects reported within 48 hours."]] },
};

export const Route = createFileRoute("/policies/$page")({
  loader: ({ params }) => {
    if (!pages[params.page]) throw notFound();
    return { page: params.page };
  },
  head: ({ loaderData }) => {
    const p = loaderData ? pages[loaderData.page] : undefined;
    const t = p ? `${p.title} — Incartion` : "Policy — Incartion";
    const description = `${p?.title ?? "Policies"} for shopping at Incartion.`;
    return { meta: [{ title: t }, { name: "description", content: description }, { property: "og:title", content: t }, { property: "og:description", content: description }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] };
  },
  component: PolicyPage,
});

function PolicyPage() {
  const { page } = Route.useLoaderData();
  const p = pages[page];
  return (
    <Container className="max-w-3xl py-10">
      <div className="mb-6 flex flex-wrap gap-2">
        {Object.entries(pages).map(([k, v]) => (
          <Link key={k} to="/policies/$page" params={{ page: k }} className={`rounded-full border px-4 py-1.5 text-xs font-bold ${k === page ? "border-primary text-primary" : ""}`}>{v.title}</Link>
        ))}
      </div>
      <h1 className="text-3xl font-black">{p.title}</h1>
      <p className="mt-1 text-xs text-muted-foreground">Last updated: October 2026</p>
      <div className="mt-6 space-y-6">
        {p.body.map(([h, t]) => (
          <section key={h}><h2 className="text-lg font-black">{h}</h2><p className="mt-1 text-muted-foreground">{t}</p></section>
        ))}
      </div>
    </Container>
  );
}
