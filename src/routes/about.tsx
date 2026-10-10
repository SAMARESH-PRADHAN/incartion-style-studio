import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { Target, Eye, Scissors, Ruler, Shirt, PackageCheck, Users } from "lucide-react";
import { Container, Reveal, SectionTitle } from "@/components/common/Reveal";
import { Button } from "@/components/ui/button";
import { useUI } from "@/store";
import bulk from "@/assets/hero-bulk.jpg";
import fabric from "@/assets/p-fabric.jpg";
import corporate from "@/assets/hero-corporate.jpg";
import industrial from "@/assets/cat-industrial.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Incartion — Uniform makers from Bhubaneswar" },
      { name: "description", content: "Our story, mission and manufacturing process. Incartion makes uniforms in Bhubaneswar, Odisha for clients across India." },
      { property: "og:title", content: "About Incartion" },
      { property: "og:description", content: "Uniforms crafted in Bhubaneswar, from 1 piece to bulk." },
    ],
  }),
  component: About,
});

function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const k = Math.min(1, (t - start) / 1500);
      setN(Math.round(to * (1 - Math.pow(1 - k, 3))));
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to]);
  return <span ref={ref}>{n.toLocaleString("en-IN")}{suffix}</span>;
}

const process = [
  { i: Ruler, t: "Design & sampling", d: "Tech packs, fabric swatches and a free first sample." },
  { i: Scissors, t: "Precision cutting", d: "Computerised cutting for consistent sizing." },
  { i: Shirt, t: "Stitching & branding", d: "In-house embroidery and screen printing." },
  { i: PackageCheck, t: "QC & dispatch", d: "3-step quality checks, size-wise packing." },
];
const timeline = [
  ["2016", "Started as a 6-machine tailoring unit in Patia, Bhubaneswar"],
  ["2018", "First hospital contract — 1,200 scrub suits"],
  ["2020", "Moved to Chandaka Industrial Estate, 60+ machines"],
  ["2023", "Launched in-house embroidery & pan-India shipping"],
  ["2026", "Online store: order from 1 piece to 10,000"],
];
const team = [
  ["Subhashree Mohapatra", "Founder & CEO"],
  ["Amitav Senapati", "Head of Production"],
  ["Lipsa Pradhan", "Design Lead"],
  ["Debasis Jena", "Corporate Accounts"],
];

function About() {
  const setUI = useUI((s) => s.set);
  return (
    <div>
      <section className="relative overflow-hidden">
        <img src={bulk} alt="Incartion warehouse" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-hero-shade" />
        <Container className="relative py-24 text-primary-foreground sm:py-32">
          <p className="eyebrow text-accent">Our story</p>
          <h1 className="mt-2 max-w-2xl text-4xl font-black sm:text-5xl">Stitching India's workforce together — from Odisha.</h1>
          <p className="mt-4 max-w-xl opacity-90">Incartion began with one belief: every team, whether 1 person or 10,000, deserves uniforms that fit well, last long and carry their brand with pride.</p>
        </Container>
      </section>

      <Container className="grid gap-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
        {[[1200, "+", "Businesses served"], [850000, "+", "Garments delivered"], [19000, "+", "Pincodes reached"], [98, "%", "On-time delivery"]].map(([n, s, l]) => (
          <div key={String(l)} className="rounded-md border p-6 text-center">
            <p className="text-brand text-4xl font-black"><Counter to={Number(n)} suffix={String(s)} /></p>
            <p className="mt-1 text-sm text-muted-foreground">{l}</p>
          </div>
        ))}
      </Container>

      <Container className="grid gap-6 pb-12 md:grid-cols-2">
        <Reveal><div className="h-full rounded-md bg-secondary p-8"><Target className="h-8 w-8 text-primary" /><h2 className="mt-3 text-xl font-black">Our mission</h2><p className="mt-2 text-muted-foreground">To make great uniforms accessible to every organisation in India — with no minimum orders, honest pricing and dependable delivery.</p></div></Reveal>
        <Reveal delay={0.1}><div className="h-full rounded-md bg-secondary p-8"><Eye className="h-8 w-8 text-accent" /><h2 className="mt-3 text-xl font-black">Our vision</h2><p className="mt-2 text-muted-foreground">To be India's most trusted uniform partner, built on Odisha's craft and powered by modern manufacturing.</p></div></Reveal>
      </Container>

      <Container className="pb-12">
        <SectionTitle eyebrow="How we make it" title="Manufacturing process" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {process.map((p, k) => (
            <Reveal key={p.t} delay={k * 0.08}>
              <div className="h-full rounded-md border p-6"><span className="grid h-12 w-12 place-items-center rounded-full bg-primary/10 text-primary"><p.i className="h-5 w-5" /></span><p className="mt-3 font-black">{k + 1}. {p.t}</p><p className="mt-1 text-sm text-muted-foreground">{p.d}</p></div>
            </Reveal>
          ))}
        </div>
      </Container>

      <Container className="grid gap-10 pb-12 lg:grid-cols-2">
        <div>
          <SectionTitle eyebrow="Since 2016" title="Our journey" />
          <ol className="relative space-y-6 border-l-2 border-primary/30 pl-6">
            {timeline.map(([y, t]) => (
              <Reveal key={y}><li className="relative"><span className="absolute -left-[33px] top-1 h-4 w-4 rounded-full bg-primary shadow-glow" /><p className="font-black text-primary">{y}</p><p className="text-sm">{t}</p></li></Reveal>
            ))}
          </ol>
        </div>
        <div>
          <SectionTitle eyebrow="Bhubaneswar" title="Our factory" />
          <div className="grid grid-cols-2 gap-2">
            {[fabric, industrial, corporate, bulk].map((src, i) => <img key={i} src={src} alt="Incartion facility" loading="lazy" className="aspect-square w-full rounded-sm object-cover" />)}
          </div>
        </div>
      </Container>

      <Container className="pb-12">
        <SectionTitle eyebrow="The people" title="Meet the team" />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {team.map(([n, r]) => (
            <div key={n} className="rounded-md border p-6 text-center">
              <span className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-brand text-2xl font-black text-primary-foreground">{n.split(" ").map((w) => w[0]).join("")}</span>
              <p className="mt-3 font-black">{n}</p><p className="text-xs text-muted-foreground">{r}</p>
            </div>
          ))}
        </div>
      </Container>

      <Container>
        <div className="flex flex-col items-center gap-4 rounded-md bg-foreground p-10 text-center text-background">
          <Users className="h-10 w-10 text-primary" />
          <h2 className="text-2xl font-black">Let's outfit your team</h2>
          <p className="max-w-md text-sm opacity-80">Free samples, logo mock-ups and a dedicated account manager for orders of 50+ pieces.</p>
          <Button variant="pill" size="lg" onClick={() => setUI({ quoteOpen: true })}>Request a quote</Button>
        </div>
      </Container>
    </div>
  );
}
