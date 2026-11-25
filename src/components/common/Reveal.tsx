import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Reveal({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}



export function SectionTitle({ eyebrow, title, action, light = false }: { eyebrow?: string; title: string; action?: ReactNode; light?: boolean }) {
  return (
    <div className="mb-6 flex items-end justify-between gap-4 sm:mb-10">
      <div className="min-w-0">
        {eyebrow && (
          <p className="eyebrow mb-2 flex items-center gap-2 text-premium">
            <span className="h-px w-8 bg-premium" /> {eyebrow}
          </p>
        )}
        <h2 className={cn("text-xl font-black uppercase tracking-wide sm:text-2xl lg:text-3xl", light && "text-white")}>{title}</h2>
        <span className="mt-3 block h-1 w-14 rounded-full bg-gold" />
      </div>
      {action}
    </div>
  );
}

export function Stars({ value, size = 16 }: { value: number; size?: number }) {
  return (
    <span className="inline-flex" aria-label={`${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <svg key={i} width={size} height={size} viewBox="0 0 24 24" className={i <= Math.round(value) ? "fill-premium" : "fill-border"}>
          <path d="M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z" />
        </svg>
      ))}
    </span>
  );
}

export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-[1536px] px-3 sm:px-6 ${className}`}>{children}</div>;
}
