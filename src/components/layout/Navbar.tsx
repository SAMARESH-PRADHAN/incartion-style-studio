import { useState } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  Heart,
  Menu,
  Search,
  ShoppingBag,
  User,
  Package,
  MapPin,
  LogOut,
  ChevronDown,
  X,
  Sparkles,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { categories } from "@/data/categories";
import { useCart, useSession, useUI, useWishlist, useRequireAuth } from "@/store";
import { totalQty } from "@/lib/pricing";
import { Logo } from "./Logo";
import { SearchBox } from "./SearchBox";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

function Badge({ n }: { n: number }) {
  if (!n) return null;
  return (
    <span className="absolute -right-2 -top-1.5 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-premium px-1 text-[10px] font-bold text-neutral-950">
      {n > 99 ? "99+" : n}
    </span>
  );
}

export const initials = (name: string) =>
  name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

function ProfileMenu() {
  const user = useSession((s) => s.user);
  const logout = useSession((s) => s.logout);
  const openLogin = useUI((s) => s.openLogin);
  const [open, setOpen] = useState(false);
  if (!user)
    return (
      <Button
        variant="outlinePink"
        size="sm"
        className="h-9 rounded-full"
        onClick={() => openLogin()}
      >
        <User /> Login / Signup
      </Button>
    );
  const item =
    "group/item flex items-center gap-3 px-3 py-2.5 text-sm font-semibold transition-colors hover:bg-secondary";
  const tile =
    "grid h-8 w-8 place-items-center rounded-lg bg-secondary text-foreground transition-colors group-hover/item:bg-premium/15 group-hover/item:text-premium";
  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-full border border-premium/40 py-1 pl-1 pr-3 transition hover:border-premium hover:shadow-card"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <span className="grid h-9 w-9 place-items-center rounded-full bg-brand text-xs font-black text-primary-foreground ring-2 ring-premium ring-offset-2 ring-offset-background">
          {initials(user.name)}
        </span>
        <span className="hidden max-w-24 truncate text-sm font-bold 2xl:inline">
          {user.name.split(" ")[0]}
        </span>
        <ChevronDown
          className={cn("h-4 w-4 text-muted-foreground transition-transform", open && "rotate-180")}
        />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.16 }}
            role="menu"
            className="absolute right-0 top-full z-50 w-72 pt-3"
          >
            <div className="overflow-hidden rounded-xl border border-premium/30 bg-popover shadow-pop">
              <div className="flex items-center gap-3 bg-brand px-4 py-4 text-primary-foreground">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-background text-base font-black text-foreground ring-2 ring-premium">
                  {initials(user.name)}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-black">Hello, {user.name}</p>
                  <p className="truncate text-xs opacity-80">{user.email}</p>
                </div>
              </div>
              <div className="p-1.5">
                <Link to="/orders" role="menuitem" className={cn(item, "rounded-lg")}>
                  <span className={tile}>
                    <Package className="h-4 w-4" />
                  </span>{" "}
                  My Orders
                </Link>
                <Link to="/addresses" role="menuitem" className={cn(item, "rounded-lg")}>
                  <span className={tile}>
                    <MapPin className="h-4 w-4" />
                  </span>{" "}
                  My Addresses
                </Link>
              </div>
              <div className="border-t p-1.5">
                <button
                  role="menuitem"
                  onClick={() => {
                    logout();
                    toast("Logged out");
                  }}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-bold text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40"
                >
                  <span className="grid h-8 w-8 place-items-center rounded-lg bg-red-100 text-red-600 dark:bg-red-950/50 dark:text-red-400">
                    <LogOut className="h-4 w-4" />
                  </span>
                  Logout
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Navbar() {
  const [hover, setHover] = useState<string | null>(null);
  const [mSearch, setMSearch] = useState(false);
  const hydrated = useUI((s) => s.hydrated);
  const setUI = useUI((s) => s.set);
  const wish = useWishlist((s) => s.ids.length);
  const bag = useCart((s) => s.items.reduce((a, i) => a + totalQty(i.sizes), 0));
  const requireAuth = useRequireAuth();
  const navigate = useNavigate();
  const goBag = () => requireAuth(() => navigate({ to: "/cart" }));

  const path = useRouterState({ select: (s) => s.location.pathname });
  const sp = useRouterState({ select: (s) => s.location.search }) as { category?: string; exclusive?: boolean | string };
  const onProducts = path === "/products";
  const exclusiveActive = onProducts && (sp.exclusive === true || sp.exclusive === "true");
  const activeCats = onProducts && !exclusiveActive ? (sp.category ?? "").split(",").filter(Boolean) : [];

  const iconBtn = "relative grid h-12 w-12 place-items-center rounded-xl transition-colors hover:bg-secondary lg:h-auto lg:w-16 lg:gap-0.5 lg:py-1.5";

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/90 shadow-sm backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-[1536px] items-center gap-3 px-3 sm:px-6 lg:h-[72px] lg:gap-6">
        <button className="-ml-1 grid h-11 w-11 place-items-center xl:hidden" aria-label="Open menu" onClick={() => setUI({ drawerOpen: true })}>
          <Menu className="h-5 w-5" />
        </button>
        <Logo />
        <nav className="hidden h-full items-stretch xl:flex" aria-label="Categories">
          {categories.map((c) => {
            const active = activeCats.includes(c.slug);
            const showing = hover === c.slug;
            return (
              <div
                key={c.slug}
                className="relative flex items-stretch"
                onMouseEnter={() => setHover(c.slug)}
                onMouseLeave={() => setHover(null)}
              >
                <Link
                  to="/products"
                  search={{ category: c.slug }}
                  className={cn(
                    "flex items-center whitespace-nowrap border-b-4 px-2 text-[12px] font-bold uppercase tracking-wide transition-colors xl:px-2.5 2xl:px-4",
                    active ? "border-premium text-premium" : showing ? "border-premium/60" : "border-transparent",
                  )}
                >
                  {c.name.replace(" Uniform", "")}
                </Link>
                <AnimatePresence>
                  {showing && (
                    <motion.div
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.15 }}
                      className="absolute left-0 top-full z-50 w-60"
                    >
                      <div className="overflow-hidden rounded-b-xl border border-t-2 border-border border-t-premium bg-popover shadow-pop">
                        <Link
                          to="/products"
                          search={{ category: c.slug }}
                          onClick={() => setHover(null)}
                          className="flex items-center justify-between bg-secondary px-4 py-3 text-xs font-black uppercase tracking-wider text-premium"
                        >
                          View all {c.name.replace(" Uniform", "")} <ChevronDown className="-rotate-90 h-3.5 w-3.5" />
                        </Link>
                        <ul className="p-1.5">
                          {c.subs.map((s) => (
                            <li key={s.slug}>
                              <Link
                                to="/products"
                                search={{ category: c.slug, sub: s.slug }}
                                onClick={() => setHover(null)}
                                className="block rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-premium/10 hover:font-bold hover:text-foreground"
                              >
                                {s.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
          <Link
            to="/products"
            search={{ exclusive: true }}
            className={cn(
              "premium-sheen my-auto ml-2 flex h-10 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border border-premium/60 bg-linear-to-r from-neutral-950 via-neutral-800 to-neutral-950 px-4 text-[11px] font-black uppercase tracking-wider text-premium shadow-md transition-all hover:shadow-lg hover:brightness-110",
              exclusiveActive && "ring-2 ring-premium ring-offset-2 ring-offset-background",
            )}
          >
            <Sparkles className="h-4 w-4" /> Incartion Exclusive Product
          </Link>
        </nav>
        <div className="ml-auto hidden min-w-0 max-w-md flex-1 md:block xl:max-w-[200px] 2xl:max-w-md">
          <SearchBox />
        </div>
        <div className="ml-auto flex shrink-0 items-center gap-1 sm:gap-2 md:ml-0">
          <button className="grid h-11 w-11 place-items-center md:hidden" aria-label="Search" onClick={() => setMSearch((v) => !v)}>
            {mSearch ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
          </button>
          <div className="hidden lg:block">
            <ProfileMenu />
          </div>
          <Link
            to="/wishlist"
            aria-label="Wishlist"
            className={cn(iconBtn, "lg:flex lg:flex-col lg:items-center", path === "/wishlist" ? "text-premium" : "")}
          >
            <span className="relative">
              <Heart className={cn("h-6 w-6", path === "/wishlist" && "fill-premium/20")} />
              {hydrated && <Badge n={wish} />}
            </span>
            <span className="hidden text-xs font-bold lg:block">Wishlist</span>
            {path === "/wishlist" && <span className="absolute inset-x-3 bottom-0 hidden h-0.5 rounded-full bg-premium lg:block" />}
          </Link>
          <button
            onClick={goBag}
            aria-label="Bag"
            className={cn(iconBtn, "lg:flex lg:flex-col lg:items-center", path === "/cart" ? "text-premium" : "")}
          >
            <span className="relative">
              <ShoppingBag className={cn("h-6 w-6", path === "/cart" && "fill-premium/20")} />
              {hydrated && <Badge n={bag} />}
            </span>
            <span className="hidden text-xs font-bold lg:block">Bag</span>
            {path === "/cart" && <span className="absolute inset-x-3 bottom-0 hidden h-0.5 rounded-full bg-premium lg:block" />}
          </button>
        </div>
      </div>
      {mSearch && (
        <div className="border-t px-3 py-2 md:hidden">
          <SearchBox autoFocus onDone={() => setMSearch(false)} />
        </div>
      )}
    </header>
  );
}