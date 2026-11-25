import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Linkedin, Youtube, MapPin, Phone, Mail, ShieldCheck, Truck } from "lucide-react";
import { categories } from "@/data/categories";
import { Logo } from "./Logo";

// export function Footer() {
//   return (
//     <footer className="mt-16 border-t bg-secondary pb-20 lg:pb-0">
//       <div className="mx-auto grid max-w-[1536px] gap-10 px-4 py-12 sm:px-6 md:grid-cols-2 lg:grid-cols-5">
//         <div className="lg:col-span-2">
//           <Logo />
//           <p className="mt-4 max-w-sm text-sm text-muted-foreground">
//             Garments for every team — from a single piece to 10,000. Custom logo embroidery, GST invoices and pan-India
//             shipping from Bhubaneswar.
//           </p>
//           <div className="mt-6 space-y-2 text-sm">
//             <p className="flex gap-2"><MapPin className="h-4 w-4 shrink-0 text-primary" /> Plot 42, Chandaka Industrial Estate, Patia, Bhubaneswar, Odisha 751024</p>
//             <p className="flex gap-2"><Phone className="h-4 w-4 text-primary" /> +91 98610 00000</p>
//             <p className="flex gap-2"><Mail className="h-4 w-4 text-primary" /> hello@incartion.in</p>
//           </div>
//           <div className="mt-5 flex gap-3">
//             {[Facebook, Instagram, Linkedin, Youtube].map((I, i) => (
//               <a key={i} href="#" aria-label="Social link" className="grid h-10 w-10 place-items-center rounded-full bg-background hover:text-primary">
//                 <I className="h-4 w-4" />
//               </a>
//             ))}
//           </div>
//         </div>
//         <div>
//           <p className="eyebrow mb-4">Shop</p>
//           <ul className="space-y-2 text-sm text-muted-foreground">
//             {categories.map((c) => (
//               <li key={c.slug}><Link to="/products" search={{ category: c.slug }} className="hover:text-foreground">{c.name}</Link></li>
//             ))}
//           </ul>
//         </div>
//         <div>
//           <p className="eyebrow mb-4">Company</p>
//           <ul className="space-y-2 text-sm text-muted-foreground">
//             <li><Link to="/about" className="hover:text-foreground">About Us</Link></li>
//             <li><Link to="/contact" className="hover:text-foreground">Contact Us</Link></li>
//             <li><Link to="/orders" className="hover:text-foreground">Track Orders</Link></li>
//             <li><Link to="/wishlist" className="hover:text-foreground">Wishlist</Link></li>
//           </ul>
//         </div>
//         <div>
//           <p className="eyebrow mb-4">Policies</p>
//           <ul className="space-y-2 text-sm text-muted-foreground">
//             <li><Link to="/policies/$page" params={{ page: "terms" }} className="hover:text-foreground">Terms of Use</Link></li>
//             <li><Link to="/policies/$page" params={{ page: "privacy" }} className="hover:text-foreground">Privacy Policy</Link></li>
//             <li><Link to="/policies/$page" params={{ page: "shipping" }} className="hover:text-foreground">Shipping Policy</Link></li>
//             <li><Link to="/policies/$page" params={{ page: "returns" }} className="hover:text-foreground">Returns & Refunds</Link></li>
//           </ul>
//         </div>
//       </div>
//       <div className="border-t">
//         <div className="mx-auto flex max-w-[1536px] flex-col items-center justify-between gap-4 px-4 py-5 text-xs text-muted-foreground sm:px-6 md:flex-row">
//           <div className="flex flex-wrap justify-center gap-5">
//             <span className="flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-success" /> 100% Secure payments</span>
//             <span className="flex items-center gap-1.5"><Truck className="h-4 w-4 text-success" /> Pan-India delivery</span>
//           </div>
//           <div className="flex flex-wrap justify-center gap-2">
//             {["UPI", "VISA", "MasterCard", "RuPay", "NetBanking", "COD"].map((p) => (
//               <span key={p} className="rounded-sm border bg-background px-2 py-1 font-bold text-foreground">{p}</span>
//             ))}
//           </div>
//           <p>© {new Date().getFullYear()} Incartion. Made in Odisha.</p>
//         </div>
//       </div>
//     </footer>
//   );
// }

export function Footer() {
  const head = "eyebrow mb-5 flex items-center gap-2 text-premium";
  const link = "inline-block text-sm text-white/60 transition-all hover:translate-x-1 hover:text-premium";
  return (
    <footer className="relative mt-16 overflow-hidden bg-neutral-950 pb-20 text-white lg:pb-0">
      <div className="h-1 bg-gold" />
      <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-premium/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-10 h-72 w-72 rounded-full bg-premium/10 blur-3xl" />
      <div className="relative mx-auto grid max-w-[1536px] gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <div className="[&>a>span:first-child]:bg-gold [&>a>span:first-child]:text-neutral-950">
            <Logo />
          </div>
          <p className="mt-4 max-w-sm text-sm text-white/60">
            Garments for every team — from a single piece to 10,000. Custom logo embroidery, GST invoices and pan-India shipping from Bhubaneswar.
          </p>
          <div className="mt-6 space-y-3 text-sm text-white/80">
            <p className="flex gap-3"><MapPin className="h-4 w-4 shrink-0 text-premium" /> Plot 42, Chandaka Industrial Estate, Patia, Bhubaneswar, Odisha 751024</p>
            <p className="flex gap-3"><Phone className="h-4 w-4 shrink-0 text-premium" /> +91 98610 00000</p>
            <p className="flex gap-3"><Mail className="h-4 w-4 shrink-0 text-premium" /> hello@incartion.in</p>
          </div>
          <div className="mt-6 flex gap-3">
            {[Facebook, Instagram, Linkedin, Youtube].map((I, i) => (
              <a key={i} href="#" aria-label="Social link" className="grid h-10 w-10 place-items-center rounded-full border border-white/15 text-white/80 transition-all hover:-translate-y-1 hover:border-premium hover:bg-premium hover:text-neutral-950">
                <I className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
        <div>
          <p className={head}><span className="h-px w-5 bg-premium" /> Shop</p>
          <ul className="space-y-2.5">
            {categories.map((c) => (
              <li key={c.slug}><Link to="/products" search={{ category: c.slug }} className={link}>{c.name}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <p className={head}><span className="h-px w-5 bg-premium" /> Company</p>
          <ul className="space-y-2.5">
            <li><Link to="/about" className={link}>About Us</Link></li>
            <li><Link to="/contact" className={link}>Contact Us</Link></li>
            <li><Link to="/orders" className={link}>Track Orders</Link></li>
            <li><Link to="/wishlist" className={link}>Wishlist</Link></li>
          </ul>
        </div>
        <div>
          <p className={head}><span className="h-px w-5 bg-premium" /> Policies</p>
          <ul className="space-y-2.5">
            <li><Link to="/policies/$page" params={{ page: "terms" }} className={link}>Terms of Use</Link></li>
            <li><Link to="/policies/$page" params={{ page: "privacy" }} className={link}>Privacy Policy</Link></li>
            <li><Link to="/policies/$page" params={{ page: "shipping" }} className={link}>Shipping Policy</Link></li>
            <li><Link to="/policies/$page" params={{ page: "returns" }} className={link}>Returns & Refunds</Link></li>
          </ul>
        </div>
      </div>
      <div className="relative border-t border-white/10">
        <div className="mx-auto flex max-w-[1536px] flex-col items-center justify-between gap-4 px-4 py-5 text-xs text-white/60 sm:px-6 md:flex-row">
          <div className="flex flex-wrap justify-center gap-5">
            <span className="flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-premium" /> 100% Secure payments</span>
            <span className="flex items-center gap-1.5"><Truck className="h-4 w-4 text-premium" /> Pan-India delivery</span>
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {["UPI", "VISA", "MasterCard", "RuPay", "NetBanking", "COD"].map((p) => (
              <span key={p} className="rounded-sm border border-white/15 bg-white/5 px-2 py-1 font-bold text-white/80">{p}</span>
            ))}
          </div>
          <p>© {new Date().getFullYear()} Incartion. Made in Odisha.</p>
        </div>
      </div>
    </footer>
  );
}