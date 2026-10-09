import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUI } from "@/store";
import corporate from "@/assets/hero-corporate.jpg";
import medical from "@/assets/hero-medical.jpg";
import hotel from "@/assets/hero-hotel.jpg";
import bulk from "@/assets/hero-bulk.jpg";
import industrial from "@/assets/cat-industrial.jpg";

type Slide = { img: string; eyebrow: string; title: string; sub: string; cta: string; category?: string; quote?: boolean };
const slides: Slide[] = [
  { img: corporate, eyebrow: "Corporate Wear", title: "Dress your team for the boardroom", sub: "Shirts, trousers & blazers tailored for every role. Logo embroidery included.", cta: "Shop Corporate", category: "corporate" },
  { img: medical, eyebrow: "Medical Uniforms", title: "Scrubs that care as much as you do", sub: "Breathable, anti-microbial scrub suits & aprons. Flat 40% OFF.", cta: "Shop Medical", category: "medical" },
  { img: hotel, eyebrow: "Hotel Uniforms", title: "Hospitality, perfectly tailored", sub: "Chef coats, waistcoats & aprons for kitchens and front desks.", cta: "Shop Hotel", category: "hotel" },
  { img: industrial, eyebrow: "Industrial", title: "Tough gear for tougher shifts", sub: "Dungarees & hi-vis safety jackets built for the shop floor.", cta: "Shop Industrial", category: "industrial" },
  { img: bulk, eyebrow: "From 1 pc to 10,000", title: "Bulk orders, custom pricing", sub: "Order a single sample or outfit your whole company. Prices drop as you scale.", cta: "Request a Quote", quote: true },
];

function Hanger3D() {
  return (
    <div className="pointer-events-none absolute right-[8%] top-1/2 hidden -translate-y-1/2 [perspective:800px] xl:block" aria-hidden>
      <div className="float-y preserve-3d relative h-56 w-44">
        <div className="absolute inset-0 rounded-[40%_40%_12px_12px] bg-brand opacity-90 shadow-pop" style={{ clipPath: "polygon(20% 0,80% 0,100% 18%,88% 30%,82% 24%,82% 100%,18% 100%,18% 24%,12% 30%,0 18%)" }} />
        <div className="absolute left-1/2 top-[-34px] h-10 w-10 -translate-x-1/2 rounded-full border-4 border-background border-b-transparent" />
        <span className="absolute inset-x-0 top-1/2 text-center text-xs font-black tracking-[0.3em] text-primary-foreground">INCARTION</span>
      </div>
    </div>
  );
}

export function HeroSlider() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const setUI = useUI((s) => s.set);
  const ref = useRef<HTMLDivElement>(null);
  const go = (d: number) => setI((v) => (v + d + slides.length) % slides.length);
  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => go(1), 5000);
    return () => clearInterval(t);
  }, [paused]);
  const s = slides[i];
  return (
    <section
      ref={ref}
      className="relative h-[62vh] min-h-[420px] overflow-hidden bg-overlay sm:h-[70vh] lg:h-[78vh] lg:max-h-[720px]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => { setPaused(false); setTilt({ x: 0, y: 0 }); }}
      onMouseMove={(e) => {
        const r = ref.current!.getBoundingClientRect();
        setTilt({ x: (e.clientX - r.left) / r.width - 0.5, y: (e.clientY - r.top) / r.height - 0.5 });
      }}
      aria-roledescription="carousel"
      aria-label="Featured collections"
    >
      <AnimatePresence initial={false} mode="popLayout">
        <motion.div
          key={i}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          onDragEnd={(_, info) => { if (info.offset.x < -60) go(1); else if (info.offset.x > 60) go(-1); }}
        >
          <img
            src={s.img}
            alt={s.title}
            width={1600}
            height={800}
            draggable={false}
            className="absolute inset-[-3%] h-[106%] w-[106%] object-cover transition-transform duration-300 ease-out"
            style={{ transform: `translate3d(${tilt.x * -24}px, ${tilt.y * -16}px, 0)` }}
          />
          <div className="absolute inset-0 bg-hero-shade" />
          <div className="absolute inset-0 bg-shade sm:hidden" />
        </motion.div>
      </AnimatePresence>
      <Hanger3D />
      <div className="pointer-events-none relative mx-auto flex h-full max-w-[1536px] items-end px-5 pb-16 sm:items-center sm:px-10 sm:pb-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="pointer-events-auto max-w-xl text-primary-foreground"
            style={{ transform: `perspective(900px) rotateY(${tilt.x * 6}deg) rotateX(${-tilt.y * 6}deg)` }}
          >
            <p className="eyebrow mb-3 inline-block rounded-full bg-primary px-3 py-1">{s.eyebrow}</p>
            <h1 className="text-3xl font-black leading-[1.05] sm:text-5xl lg:text-6xl">{s.title}</h1>
            <p className="mt-3 max-w-md text-sm opacity-90 sm:mt-4 sm:text-lg">{s.sub}</p>
            <div className="mt-5 sm:mt-8">
              {s.quote ? (
                <Button variant="pill" size="lg" onClick={() => setUI({ quoteOpen: true })}>{s.cta}</Button>
              ) : (
                <Button asChild variant="pill" size="lg">
                  <Link to="/products" search={{ category: s.category }}>{s.cta}</Link>
                </Button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
      <button aria-label="Previous slide" onClick={() => go(-1)} className="absolute left-3 top-1/2 hidden h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-background/20 text-primary-foreground backdrop-blur hover:bg-background/40 md:grid">
        <ChevronLeft />
      </button>
      <button aria-label="Next slide" onClick={() => go(1)} className="absolute right-3 top-1/2 hidden h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-background/20 text-primary-foreground backdrop-blur hover:bg-background/40 md:grid">
        <ChevronRight />
      </button>
      <div className="absolute inset-x-0 bottom-5 flex justify-center gap-2">
        {slides.map((_, k) => (
          <button key={k} aria-label={`Go to slide ${k + 1}`} onClick={() => setI(k)} className="grid h-6 place-items-center">
            <span className={`block h-1.5 rounded-full transition-all ${k === i ? "w-8 bg-primary" : "w-2 bg-background/70"}`} />
          </button>
        ))}
      </div>
    </section>
  );
}
