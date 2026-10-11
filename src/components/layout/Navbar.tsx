import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Heart, Menu, Search, ShoppingBag, User, Package, MapPin, LogOut, ChevronDown, X } from "lucide-react";
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
    <span className="absolute -right-2 -top-1.5 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
      {n > 99 ? "99+" : n}
    </span>
  );
}

export const initials = (name: string) =>
  name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();

function ProfileMenu() {
  const user = useSession((s) => s.user);
  const logout = useSession((s) => s.logout);
  const openLogin = useUI((s) => s.openLogin);
  const [open, setOpen] = useState(false);
  if (!user)
    return (
      <Button variant="outlinePink" size="sm" className="h-9 rounded-full" onClick={() => openLogin()}>
        <User /> Login / Signup
      </Button>
    );
  return (
    <div className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-full border py-1 pl-1 pr-3 transition hover:shadow-card"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <span className="grid h-8 w-8 place-items-center rounded-full bg-brand text-xs font-black text-primary-foreground">
          {initials(user.name)}
        </span>
        <span className="max-w-24 truncate text-sm font-bold">{user.name.split(" ")[0]}</span>
        <ChevronDown className="h-4 w-4 text-muted-foreground" />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            role="menu"
            className="absolute right-0 top-full z-50 w-60 pt-2"
          >
            <div className="overflow-hidden rounded-md border bg-popover shadow-pop">
              <div className="bg-secondary px-4 py-3">
                <p className="text-sm font-bold">Hello, {user.name}</p>
                <p className="truncate text-xs text-muted-foreground">{user.email}</p>
              </div>
              <Link to="/orders" role="menuitem" className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-secondary">
                <Package className="h-4 w-4" /> My Orders
              </Link>
              <Link to="/addresses" role="menuitem" className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-secondary">
                <MapPin className="h-4 w-4" /> My Addresses
              </Link>
              <button
                role="menuitem"
                onClick={() => {
                  logout();
                  toast("Logged out");
                }}
                className="flex w-full items-center gap-3 border-t px-4 py-3 text-sm text-primary hover:bg-secondary"
              >
                <LogOut className="h-4 w-4" /> Logout
              </button>
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

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur" onMouseLeave={() => setHover(null)}>
      <div className="mx-auto flex h-14 max-w-[1536px] items-center gap-3 px-3 sm:px-6 lg:h-16 lg:gap-6">
        <button className="-ml-1 grid h-11 w-11 place-items-center lg:hidden" aria-label="Open menu" onClick={() => setUI({ drawerOpen: true })}>
          <Menu className="h-5 w-5" />
        </button>
        <Logo />
        <nav className="hidden h-full items-stretch xl:flex" aria-label="Categories">
          {categories.map((c) => (
            <Link
              key={c.slug}
              to="/products"
              search={{ category: c.slug }}
              onMouseEnter={() => setHover(c.slug)}
              className={cn(
                "flex items-center whitespace-nowrap border-b-4 border-transparent px-2.5 text-[12px] font-bold uppercase tracking-wide transition-colors xl:px-4",
                hover === c.slug && "border-primary",
              )}
            >
              {c.name}
            </Link>
          ))}
        </nav>
        <div className="ml-auto hidden max-w-md flex-1 md:block">
          <SearchBox />
        </div>
        <div className="ml-auto flex items-center gap-1 sm:gap-3 md:ml-0">
          <button className="grid h-11 w-11 place-items-center md:hidden" aria-label="Search" onClick={() => setMSearch((v) => !v)}>
            {mSearch ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
          </button>
          <div className="hidden lg:block">
            <ProfileMenu />
          </div>
          <Link to="/wishlist" className="relative grid h-11 w-11 place-items-center lg:w-auto lg:flex-col lg:gap-0.5" aria-label="Wishlist">
            <span className="relative">
              <Heart className="h-5 w-5" />
              {hydrated && <Badge n={wish} />}
            </span>
            <span className="hidden text-[11px] font-bold lg:block">Wishlist</span>
          </Link>
          <button onClick={goBag} className="relative grid h-11 w-11 place-items-center lg:w-auto lg:flex-col lg:gap-0.5" aria-label="Bag">
            <span className="relative">
              <ShoppingBag className="h-5 w-5" />
              {hydrated && <Badge n={bag} />}
            </span>
            <span className="hidden text-[11px] font-bold lg:block">Bag</span>
          </button>
        </div>
      </div>
      {mSearch && (
        <div className="border-t px-3 py-2 md:hidden">
          <SearchBox autoFocus onDone={() => setMSearch(false)} />
        </div>
      )}
      <AnimatePresence>
        {hover && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="absolute inset-x-0 top-full hidden border-b bg-popover shadow-pop lg:block"
          >
            <div className="mx-auto grid max-w-[1536px] grid-cols-6 gap-6 px-6 py-8">
              {categories.map((c) => (
                <div key={c.slug} className={cn("rounded-md p-3 transition", hover === c.slug && "bg-secondary")}>
                  <Link
                    to="/products"
                    search={{ category: c.slug }}
                    onClick={() => setHover(null)}
                    className={cn("eyebrow block pb-3", hover === c.slug ? "text-primary" : "text-accent")}
                  >
                    {c.name}
                  </Link>
                  <ul className="space-y-2">
                    {c.subs.map((s) => (
                      <li key={s.slug}>
                        <Link
                          to="/products"
                          search={{ category: c.slug, sub: s.slug }}
                          onClick={() => setHover(null)}
                          className="text-sm text-muted-foreground hover:font-bold hover:text-foreground"
                        >
                          {s.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
