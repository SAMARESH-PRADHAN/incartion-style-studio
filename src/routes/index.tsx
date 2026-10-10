import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Award, Truck, Layers, Receipt, Globe2, MousePointerClick, Palette, ShoppingCart, PackageCheck, Quote, ArrowRight } from "lucide-react";
import { HeroSlider } from "@/components/home/HeroSlider";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { CouponCard } from "@/components/common/CouponCard";
import { ProductRail } from "@/components/product/ProductRail";
import { Container, Reveal, SectionTitle, Stars } from "@/components/common/Reveal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { activeCoupons } from "@/data/coupons";
import { bestSellers, newArrivals, products } from "@/data/products";
import { categories } from "@/data/categories";
import { useUI } from "@/store";
import bulk from "@/assets/hero-bulk.jpg";
import fabric from "@/assets/p-fabric.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Incartion — Uniforms from 1 piece to bulk | Bhubaneswar" },
      { name: "description", content: "Shop medical, corporate, hotel, industrial and school uniforms and T-shirts. Custom logo embroidery, bulk pricing, GST invoice, pan-India delivery." },
      { property: "og:title", content: "Incartion — Uniforms from 1 piece to bulk" },
      { property: "og:description", content: "Custom uniforms and garments from Bhubaneswar, Odisha. Order 1 piece or 10,000." },
    ],
  }),
  component: Home,
});

const deals = [
  { label: "Medical", off: "UP TO 50% OFF", cat: "medical", tone: "bg-primary" },
  { label: "Corporate", off: "MIN. 30% OFF", cat: "corporate", tone: "bg-accent" },
  { label: "T-Shirts", off: "FROM ₹249", cat: "tshirt", tone: "bg-success" },
  { label: "Industrial", off: "FLAT 40% OFF", cat: "industrial", tone: "bg-foreground" },
];
const why = [
  { i: Palette, t: "Custom logo embroidery", d: "Free digitising on 25+ pcs" },
  { i: Layers, t: "From 1 pc to bulk", d: "No minimum order quantity" },
  { i: Truck, t: "Fast delivery", d: "Dispatch in 3–7 days" },
  { i: Award, t: "Quality fabric", d: "Tested GSM & colourfast dyes" },
  { i: Receipt, t: "GST invoice", d: "Claim input tax credit" },
  { i: Globe2, t: "Pan-India shipping", d: "19,000+ pincodes served" },
];
const steps = [
  { i: MousePointerClick, t: "Choose", d: "Pick styles, fabric and sizes" },
  { i: Palette, t: "Customize", d: "Share your logo & notes" },
  { i: ShoppingCart, t: "Order", d: "Pay securely or request invoice" },
  { i: PackageCheck, t: "Delivered", d: "Track it to your doorstep" },
];
const testimonials = [
  { n: "Dr. Sasmita Rath", r: "Admin, KIMS Partner Clinic", t: "We outfitted 240 nurses in two weeks. The scrubs are soft, and the embroidery is flawless.", s: 5 },
  { n: "Rohit Agarwal", r: "HR Head, TechNova Bhubaneswar", t: "Ordered 1 sample, loved it, then 500 polos with our logo. Seamless GST billing.", s: 5 },
  { n: "Chef Manoj Behera", r: "Executive Chef, Mayfair-style Resort", t: "Chef coats survive our kitchen heat. Fit is great across all sizes.", s: 4 },
];
const clients = ["TechNova", "Utkal Hospitals", "Kalinga Steel", "Puri Grand Hotels", "DAV Schools", "Odisha Metro", "SunPharma Labs", "Konark Resorts"];

function Newsletter() {
  const [email, setEmail] = useState("");
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return toast.error("Please enter a valid email");
        toast.success("Subscribed! Watch your inbox for exclusive offers.");
        setEmail("");
      }}
      className="mx-auto mt-6 flex max-w-md flex-col gap-2 sm:flex-row"
    >
      <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Your email address" aria-label="Email" className="h-12 rounded-full bg-background px-5" />
      <Button type="submit" variant="pill" size="lg">Subscribe</Button>
    </form>
  );
}

function Home() {
  const setUI = useUI((s) => s.set);
  return (
    <div>
      <HeroSlider />

      <Container className="py-12 sm:py-16">
        <Reveal><SectionTitle eyebrow="Explore" title="Shop by category" /></Reveal>
        <CategoryGrid />
      </Container>

      <section className="bg-secondary py-12 sm:py-16">
        <Container>
          <Reveal><SectionTitle eyebrow="Save more" title="Offers & coupons" /></Reveal>
          <div className="no-scrollbar -mx-3 flex snap-x gap-4 overflow-x-auto px-3 py-2">
            {activeCoupons().map((c) => <CouponCard key={c.code} c={c} />)}
          </div>
        </Container>
      </section>

      <Container className="py-12 sm:py-16">
        <Reveal><SectionTitle eyebrow="Today only" title="Deals of the day" /></Reveal>
        <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
          {deals.map((d, k) => (
            <Reveal key={d.cat} delay={k * 0.06}>
              <Link to="/products" search={{ category: d.cat, sort: "discount" }} className="group block overflow-hidden rounded-md border bg-card transition hover:shadow-pop">
                <div className="relative aspect-square overflow-hidden">
                  <img src={categories.find((c) => c.slug === d.cat)!.image} alt={d.label} loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-110" />
                </div>
                <div className={`${d.tone} p-3 text-center text-primary-foreground`}>
                  <p className="text-xs font-bold uppercase">{d.label}</p>
                  <p className="text-lg font-black sm:text-xl">{d.off}</p>
                  <p className="text-xs font-bold opacity-90">Shop now →</p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </Container>

      <Container>
        <Reveal>
          <div className="relative overflow-hidden rounded-md">
            <img src={bulk} alt="Bulk uniform order" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-hero-shade" />
            <div className="relative max-w-xl p-6 text-primary-foreground sm:p-12">
              <p className="eyebrow text-accent">Corporate & bulk</p>
              <h2 className="mt-2 text-2xl font-black sm:text-4xl">Ordering 50+ pieces? Get custom pricing.</h2>
              <p className="mt-3 text-sm opacity-90 sm:text-base">Dedicated account manager, free logo mock-ups, samples before production and credit terms for businesses.</p>
              <Button variant="pill" size="lg" className="mt-6" onClick={() => setUI({ quoteOpen: true })}>Request a quote</Button>
            </div>
          </div>
        </Reveal>
      </Container>

      <Container className="py-12 sm:py-16">
        <Reveal><SectionTitle eyebrow="Most loved" title="Trending best sellers" action={<Link to="/products" search={{ sort: "rating" }} className="shrink-0 text-sm font-bold text-primary">View all</Link>} /></Reveal>
        <ProductRail items={bestSellers} />
      </Container>

      <Container className="pb-12 sm:pb-16">
        <Reveal><SectionTitle eyebrow="Just in" title="New arrivals" action={<Link to="/products" search={{ sort: "newest" }} className="shrink-0 text-sm font-bold text-primary">View all</Link>} /></Reveal>
        <ProductRail items={newArrivals} />
      </Container>

      <section className="bg-secondary py-12 sm:py-16">
        <Container>
          <Reveal><SectionTitle eyebrow="Our promise" title="Why choose Incartion" /></Reveal>
          <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-6">
            {why.map((w, k) => (
              <Reveal key={w.t} delay={k * 0.05}>
                <div className="h-full rounded-md bg-card p-5 text-center transition hover:-translate-y-1 hover:shadow-card">
                  <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-primary/10 text-primary"><w.i className="h-6 w-6" /></span>
                  <p className="mt-3 text-sm font-black">{w.t}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{w.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <Container className="py-12 sm:py-16">
        <Reveal><SectionTitle eyebrow="How it works" title="Our process" /></Reveal>
        <div className="relative grid gap-6 md:grid-cols-4">
          <div className="absolute left-7 top-0 h-full w-0.5 bg-border md:left-0 md:top-7 md:h-0.5 md:w-full" />
          <motion.div
            className="absolute left-7 top-0 w-0.5 bg-brand md:left-0 md:top-7 md:h-0.5"
            initial={{ height: 0, width: 2 }}
            whileInView={{ height: "100%", width: "100%" }}
            viewport={{ once: true }}
            transition={{ duration: 1.6, ease: "easeInOut" }}
          />
          {steps.map((s, k) => (
            <Reveal key={s.t} delay={k * 0.3}>
              <div className="relative flex items-start gap-4 md:flex-col md:items-center md:text-center">
                <span className="relative z-10 grid h-14 w-14 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground shadow-glow"><s.i className="h-6 w-6" /></span>
                <div>
                  <p className="eyebrow text-muted-foreground">Step {k + 1}</p>
                  <p className="text-lg font-black">{s.t}</p>
                  <p className="text-sm text-muted-foreground">{s.d}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>

      <section className="bg-secondary py-12 sm:py-16">
        <Container>
          <Reveal><SectionTitle eyebrow="Loved by teams" title="What our clients say" /></Reveal>
          <div className="grid gap-4 md:grid-cols-3">
            {testimonials.map((t, k) => (
              <Reveal key={t.n} delay={k * 0.1}>
                <figure className="h-full rounded-md bg-card p-6 shadow-card">
                  <Quote className="h-8 w-8 text-primary/30" />
                  <Stars value={t.s} />
                  <blockquote className="mt-3 text-sm">"{t.t}"</blockquote>
                  <figcaption className="mt-4 text-sm font-black">{t.n}<span className="block text-xs font-normal text-muted-foreground">{t.r}</span></figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </Container>
        <div className="marquee mt-10 border-y bg-background py-5" aria-label="Our clients">
          <div className="marquee-track gap-0">
            {[...clients, ...clients].map((c, k) => (
              <span key={k} className="px-10 text-xl font-black uppercase tracking-wider text-muted-foreground/60">{c}</span>
            ))}
          </div>
        </div>
      </section>

      <Container className="py-12 sm:py-16">
        <Reveal><SectionTitle eyebrow="@incartion" title="Shop the look" /></Reveal>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
          {[products[0], products[10], products[22], products[38], products[56], products[70]].filter(Boolean).map((p, k) => (
            <Link key={p.id} to="/product/$slug" params={{ slug: p.slug }} className={`group relative overflow-hidden rounded-sm ${k === 0 ? "row-span-2" : ""}`}>
              <img src={k === 3 ? fabric : p.images[0]} alt={p.name} loading="lazy" className="h-full min-h-40 w-full object-cover transition duration-700 group-hover:scale-110" />
              <span className="absolute inset-0 flex items-end bg-shade p-3 text-xs font-bold text-primary-foreground opacity-0 transition group-hover:opacity-100">
                {p.name} <ArrowRight className="ml-1 h-3 w-3" />
              </span>
            </Link>
          ))}
        </div>
      </Container>

      <Container>
        <div className="rounded-md bg-brand px-6 py-12 text-center text-primary-foreground">
          <p className="eyebrow">Stay in the loop</p>
          <h2 className="mt-2 text-2xl font-black sm:text-3xl">Get ₹100 OFF your first order</h2>
          <p className="mt-2 text-sm opacity-90">New collections, bulk deals and corporate offers — straight to your inbox.</p>
          <Newsletter />
        </div>
      </Container>
    </div>
  );
}

