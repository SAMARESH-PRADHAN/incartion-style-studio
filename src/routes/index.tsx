import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  Award,
  Truck,
  Layers,
  Receipt,
  Globe2,
  MousePointerClick,
  Palette,
  ShoppingCart,
  PackageCheck,
  Quote,
  ArrowRight,
} from "lucide-react";
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
      {
        name: "description",
        content:
          "Shop medical, corporate, hotel, industrial and security guard uniforms and T-shirts. Custom logo printing, bulk pricing, GST invoice, pan-India delivery.",
      },
      { property: "og:title", content: "Incartion — Uniforms from 1 piece to bulk" },
      {
        property: "og:description",
        content: "Custom uniforms and garments from Bhubaneswar, Odisha. Order 1 piece or 10,000.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

// const deals = [
//   { label: "Medical", off: "UP TO 50% OFF", cat: "medical", tone: "bg-primary" },
//   { label: "Corporate", off: "MIN. 30% OFF", cat: "corporate", tone: "bg-accent" },
//   { label: "T-Shirts", off: "FROM ₹249", cat: "tshirt", tone: "bg-success" },
//   { label: "Industrial", off: "FLAT 40% OFF", cat: "industrial", tone: "bg-foreground" },
// ];
const deals = [
  { label: "Medical", off: "UP TO 50% OFF", cat: "medical" },
  { label: "Corporate", off: "MIN. 30% OFF", cat: "corporate" },
  { label: "T-Shirts", off: "FROM ₹249", cat: "tshirt" },
  { label: "Industrial", off: "FLAT 40% OFF", cat: "industrial" },
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
  {
    n: "Dr. Sasmita Rath",
    r: "Admin, KIMS Partner Clinic",
    t: "We outfitted 240 nurses in two weeks. The scrubs are soft, and the embroidery is flawless.",
    s: 5,
  },
  {
    n: "Rohit Agarwal",
    r: "HR Head, TechNova Bhubaneswar",
    t: "Ordered 1 sample, loved it, then 500 polos with our logo. Seamless GST billing.",
    s: 5,
  },
  {
    n: "Chef Manoj Behera",
    r: "Executive Chef, Mayfair-style Resort",
    t: "Chef coats survive our kitchen heat. Fit is great across all sizes.",
    s: 4,
  },
];
const clients = [
  "TechNova",
  "Utkal Hospitals",
  "Kalinga Steel",
  "Puri Grand Hotels",
  "DAV Schools",
  "Odisha Metro",
  "SunPharma Labs",
  "Konark Resorts",
];



function Home() {
  const setUI = useUI((s) => s.set);
  return (
    <div>
      <HeroSlider />

      <Container className="py-12 sm:py-16">
        <Reveal>
          <SectionTitle eyebrow="Explore" title="Shop by category" />
        </Reveal>
        <CategoryGrid />
      </Container>

     

      <section className="relative overflow-hidden bg-neutral-950 py-12 sm:py-16">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-premium/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-premium/10 blur-3xl" />
        <Container className="relative">
          <Reveal>
            <SectionTitle light eyebrow="Save more" title="Offers & coupons" />
          </Reveal>
          <div className="no-scrollbar -mx-3 flex snap-x gap-4 overflow-x-auto px-3 py-2">
            {activeCoupons().map((c) => (
              <CouponCard key={c.code} c={c} />
            ))}
          </div>
        </Container>
      </section>

      <Container className="py-12 sm:py-16">
        <Reveal>
          <SectionTitle eyebrow="Today only" title="Deals of the day" />
        </Reveal>
        <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
          {deals.map((d, k) => (
            <Reveal key={d.cat} delay={k * 0.06}>
              <Link
                to="/products"
                search={{ category: d.cat, sort: "discount" }}
                className="group relative block aspect-[4/5] overflow-hidden rounded-xl border border-border/70 shadow-card transition hover:border-premium hover:shadow-pop"
              >
                <img
                  src={categories.find((c) => c.slug === d.cat)!.image}
                  alt={d.label}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-linear-to-t from-neutral-950 via-neutral-950/40 to-transparent" />
                <span className="absolute left-3 top-3 rounded-full bg-gold px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-neutral-950">
                  Today only
                </span>
                <div className="absolute inset-x-0 bottom-0 p-3 text-white sm:p-4">
                  <p className="text-xs font-bold uppercase tracking-widest text-premium">
                    {d.label}
                  </p>
                  <p className="mt-0.5 text-lg font-black sm:text-2xl">{d.off}</p>
                  <p className="mt-2 inline-flex items-center gap-1 text-xs font-bold">
                    Shop now{" "}
                    <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" />
                  </p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </Container>

      <Container>
        <Reveal>
          <div className="relative overflow-hidden rounded-md">
            <img
              src={bulk}
              alt="Bulk uniform order"
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-hero-shade" />
            <div className="relative max-w-xl p-6 text-primary-foreground sm:p-12">
              <p className="eyebrow text-accent">Corporate & bulk</p>
              <h2 className="mt-2 text-2xl font-black sm:text-4xl">
                Ordering 50+ pieces? Get custom pricing.
              </h2>
              <p className="mt-3 text-sm opacity-90 sm:text-base">
                Dedicated account manager, free logo mock-ups, samples before production and credit
                terms for businesses.
              </p>
              <Button
                variant="pill"
                size="lg"
                className="mt-6"
                onClick={() => setUI({ quoteOpen: true })}
              >
                Request a quote
              </Button>
            </div>
          </div>
        </Reveal>
      </Container>

      <Container className="py-12 sm:py-16">
        <Reveal>
          <SectionTitle
            eyebrow="Most loved"
            title="Trending best sellers"
            action={
              <Link
                to="/products"
                search={{ sort: "rating" }}
                className="shrink-0 text-sm font-bold text-primary"
              >
                View all
              </Link>
            }
          />
        </Reveal>
        <ProductRail items={bestSellers} />
      </Container>

      <Container className="pb-12 sm:pb-16">
        <Reveal>
          <SectionTitle
            eyebrow="Just in"
            title="New arrivals"
            action={
              <Link
                to="/products"
                search={{ sort: "newest" }}
                className="shrink-0 text-sm font-bold text-primary"
              >
                View all
              </Link>
            }
          />
        </Reveal>
        <ProductRail items={newArrivals} />
      </Container>

      <section className="bg-secondary py-12 sm:py-16">
        <Container>
          <Reveal>
            <SectionTitle eyebrow="Our promise" title="Why choose Incartion" />
          </Reveal>
          <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-6">
            {why.map((w, k) => (
              <Reveal key={w.t} delay={k * 0.05}>
                <div className="h-full rounded-xl border border-transparent bg-card p-5 text-center transition hover:-translate-y-1 hover:border-premium/60 hover:shadow-pop">
                  <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-linear-to-br from-neutral-900 to-neutral-700 text-premium ring-1 ring-premium/40">
                    <w.i className="h-6 w-6" />
                  </span>
                  <p className="mt-3 text-sm font-black">{w.t}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{w.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

     
      <section className="relative overflow-hidden bg-neutral-950 py-16 sm:py-20 lg:py-24">
  {/* Ambient premium glow */}
  <div className="pointer-events-none absolute -left-40 top-1/4 h-80 w-80 rounded-full bg-premium/10 blur-[120px]" />
  <div className="pointer-events-none absolute -right-40 bottom-1/4 h-96 w-96 rounded-full bg-premium/10 blur-[140px]" />

  {/* Decorative grid */}
  <div
    className="pointer-events-none absolute inset-0 opacity-[0.035]"
    style={{
      backgroundImage:
        "linear-gradient(rgba(255,255,255,.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.8) 1px, transparent 1px)",
      backgroundSize: "48px 48px",
    }}
  />

  <Container className="relative">
    {/* Header */}
    <Reveal>
      <div className="mx-auto max-w-3xl text-center">
        <div className="inline-flex items-center gap-3">
          <span className="h-px w-8 bg-premium" />
          <p className="eyebrow text-premium">How it works</p>
          <span className="h-px w-8 bg-premium" />
        </div>

        <h2 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl">
          From selection to delivery.
        </h2>

        <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-white/50 sm:text-base">
          A simple four-step experience designed to make ordering uniforms,
          apparel and custom products effortless.
        </p>
      </div>
    </Reveal>

    {/* Journey */}
    <div className="relative mx-auto mt-16 max-w-6xl">
      {/* Connecting journey line */}
      <div className="pointer-events-none absolute left-[12.5%] right-[12.5%] top-[42px] hidden h-px bg-white/10 lg:block" />

      <motion.div
        className="pointer-events-none absolute left-[12.5%] top-[42px] hidden h-px bg-gradient-to-r from-premium/20 via-premium to-premium/20 lg:block"
        initial={{ width: 0 }}
        whileInView={{ width: "75%" }}
        viewport={{ once: true }}
        transition={{ duration: 1.8, ease: "easeInOut" }}
      />

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((s, k) => (
          <Reveal key={s.t} delay={k * 0.12}>
            <motion.div
              whileHover={{ y: -8 }}
              transition={{ duration: 0.3 }}
              className="group relative"
            >
              {/* Step node */}
              <div className="relative z-20 mx-auto mb-7 grid h-[84px] w-[84px] place-items-center rounded-full border border-premium/40 bg-neutral-950 shadow-[0_0_0_8px_rgba(255,255,255,0.02),0_0_35px_rgba(212,175,55,0.08)] transition-all duration-500 group-hover:border-premium group-hover:shadow-[0_0_0_10px_rgba(212,175,55,0.06),0_0_45px_rgba(212,175,55,0.2)]">
                <span className="absolute inset-2 rounded-full border border-white/10" />

                <s.i className="relative z-10 h-7 w-7 text-premium transition-transform duration-500 group-hover:scale-110" />

                <span className="absolute -right-1 -top-1 grid h-6 w-6 place-items-center rounded-full bg-premium text-[9px] font-black text-neutral-950">
                  {k + 1}
                </span>
              </div>

              {/* Main card */}
              <div className="journey-card min-h-[250px] rounded-2xl border border-white/10 bg-white/[0.035] p-6 backdrop-blur-xl transition-all duration-500 group-hover:border-premium/30 group-hover:bg-white/[0.06]">
                
                {/* Large background number */}
                <span className="pointer-events-none absolute -right-3 -top-7 text-[120px] font-black leading-none text-white/[0.025] transition-all duration-500 group-hover:text-premium/[0.07]">
                  {String(k + 1).padStart(2, "0")}
                </span>

                {/* Gold corner */}
                <div className="absolute right-0 top-0 h-20 w-20 overflow-hidden">
                  <div className="absolute right-[-28px] top-[14px] h-px w-24 rotate-45 bg-premium/50" />
                </div>

                <div className="relative">
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-premium">
                    Step {String(k + 1).padStart(2, "0")}
                  </p>

                  <h3 className="mt-3 text-2xl font-black tracking-tight text-white">
                    {s.t}
                  </h3>

                  <p className="mt-3 max-w-[230px] text-sm leading-6 text-white/45">
                    {s.d}
                  </p>

                  {/* Bottom progress */}
                  <div className="absolute bottom-0 left-0 right-0">
                    <div className="h-px w-full bg-white/10">
                      <div className="h-px w-0 bg-premium transition-all duration-700 group-hover:w-full" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </Reveal>
        ))}
      </div>
    </div>

    {/* Bottom reassurance */}
    <Reveal delay={0.5}>
      <div className="mx-auto mt-12 flex max-w-4xl flex-wrap items-center justify-center gap-x-8 gap-y-4 border-t border-white/10 pt-7">
        <span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-white/35">
          <span className="h-1.5 w-1.5 rounded-full bg-premium" />
          Secure checkout
        </span>

        <span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-white/35">
          <span className="h-1.5 w-1.5 rounded-full bg-premium" />
          Custom branding
        </span>

        <span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-white/35">
          <span className="h-1.5 w-1.5 rounded-full bg-premium" />
          Quality checked
        </span>

        <span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-white/35">
          <span className="h-1.5 w-1.5 rounded-full bg-premium" />
          Pan-India delivery
        </span>
      </div>
    </Reveal>
  </Container>
</section>

      <section className="bg-secondary py-12 sm:py-16">
        <Container>
          <Reveal>
            <SectionTitle eyebrow="Loved by teams" title="What our clients say" />
          </Reveal>
          <div className="grid gap-4 md:grid-cols-3">
            {testimonials.map((t, k) => (
              <Reveal key={t.n} delay={k * 0.1}>
                <figure className="h-full rounded-xl border border-border border-t-2 border-t-premium bg-card p-6 shadow-card transition hover:-translate-y-1 hover:shadow-pop">
                  <Quote className="h-8 w-8 text-premium/50" />
                  <Stars value={t.s} />
                  <blockquote className="mt-3 text-sm">"{t.t}"</blockquote>
                  <figcaption className="mt-4 text-sm font-black">
                    {t.n}
                    <span className="block text-xs font-normal text-muted-foreground">{t.r}</span>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </Container>
        <div
          className="marquee mt-10 border-y border-premium/30 bg-neutral-950 py-5"
          aria-label="Our clients"
        >
          <div className="marquee-track items-center gap-0">
            {[...clients, ...clients].map((c, k) => (
              <span key={k} className="flex items-center">
                <span className="px-8 text-base font-black uppercase tracking-[0.2em] text-white/70 sm:text-lg">
                  {c}
                </span>
                <span className="text-premium">◆</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      <Container className="py-12 sm:py-16">
        <Reveal>
          <SectionTitle eyebrow="@incartion" title="Shop the look" />
        </Reveal>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
          {[products[0], products[10], products[22], products[38], products[56], products[70]]
            .filter(Boolean)
            .map((p, k) => (
              <Link
                key={p.id}
                to="/product/$slug"
                params={{ slug: p.slug }}
                className={`group relative overflow-hidden rounded-sm ${k === 0 ? "row-span-2" : ""}`}
              >
                <img
                  src={k === 3 ? fabric : p.images[0]}
                  alt={p.name}
                  loading="lazy"
                  className="h-full min-h-40 w-full object-cover transition duration-700 group-hover:scale-110"
                />
                <span className="absolute inset-0 flex items-end bg-shade p-3 text-xs font-bold text-primary-foreground opacity-0 transition group-hover:opacity-100">
                  {p.name} <ArrowRight className="ml-1 h-3 w-3" />
                </span>
              </Link>
            ))}
        </div>
      </Container>

      {/* <Container>
        <div className="rounded-md bg-brand px-6 py-12 text-center text-primary-foreground">
          <p className="eyebrow">Stay in the loop</p>
          <h2 className="mt-2 text-2xl font-black sm:text-3xl">Get ₹100 OFF your first order</h2>
          <p className="mt-2 text-sm opacity-90">New collections, bulk deals and corporate offers — straight to your inbox.</p>
          <Newsletter />
        </div>
      </Container> */}
    </div>
  );
}
