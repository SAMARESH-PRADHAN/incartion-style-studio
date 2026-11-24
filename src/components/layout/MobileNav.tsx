import { Link, useRouterState } from "@tanstack/react-router";
import { Home, LayoutGrid, User, Package, MapPin, LogOut, Info, Phone, Sparkles } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { categories } from "@/data/categories";
import { useSession, useUI } from "@/store";
import { Logo } from "./Logo";
import { initials } from "./Navbar";
import { cn } from "@/lib/utils";

export function MobileDrawer() {
  const open = useUI((s) => s.drawerOpen);
  const setUI = useUI((s) => s.set);
  const openLogin = useUI((s) => s.openLogin);
  const user = useSession((s) => s.user);
  const logout = useSession((s) => s.logout);
  const close = () => setUI({ drawerOpen: false });
  return (
    <Sheet open={open} onOpenChange={(o) => setUI({ drawerOpen: o })}>
      <SheetContent side="left" className="w-[86vw] max-w-sm overflow-y-auto p-0">
        <SheetHeader className="bg-brand p-5 text-left">
          <SheetTitle className="sr-only">Menu</SheetTitle>
          {user ? (
            <div className="flex items-center gap-3 text-primary-foreground">
              <span className="grid h-12 w-12 place-items-center rounded-full bg-background text-base font-black text-primary">
                {initials(user.name)}
              </span>
              <div className="min-w-0">
                <p className="truncate font-bold">{user.name}</p>
                <p className="truncate text-xs opacity-90">{user.email}</p>
              </div>
            </div>
          ) : (
            <button
              onClick={() => {
                close();
                openLogin();
              }}
              className="text-left font-bold text-primary-foreground"
            >
              Welcome! <span className="underline">Login / Signup</span>
            </button>
          )}
        </SheetHeader>
        <div className="p-2">
          <Link to="/products" search={{ exclusive: true }} onClick={close} className="premium-sheen mx-2 mb-3 flex min-h-12 items-center gap-3 rounded-full border border-foreground/15 bg-secondary px-4 text-sm font-black text-foreground shadow-sm">
            <Sparkles className="h-4 w-4" /> Incartion Exclusive
          </Link>
          <p className="eyebrow px-3 pb-1 pt-3 text-muted-foreground">Shop by category</p>
          <Accordion type="single" collapsible>
            {categories.map((c) => (
              <AccordionItem key={c.slug} value={c.slug} className="border-b-0">
                <AccordionTrigger className="px-3 py-3 text-sm font-bold uppercase hover:no-underline">{c.name}</AccordionTrigger>
                <AccordionContent>
                  <div className="flex flex-col pl-5">
                    <Link to="/products" search={{ category: c.slug }} onClick={close} className="py-2.5 text-sm font-bold text-primary">
                      View all
                    </Link>
                    {c.subs.map((s) => (
                      <Link key={s.slug} to="/products" search={{ category: c.slug, sub: s.slug }} onClick={close} className="py-2.5 text-sm text-muted-foreground">
                        {s.name}
                      </Link>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          <div className="my-2 border-t" />
          {user && (
            <>
              <Link to="/orders" onClick={close} className="flex items-center gap-3 px-3 py-3 text-sm"><Package className="h-4 w-4" /> My Orders</Link>
              <Link to="/addresses" onClick={close} className="flex items-center gap-3 px-3 py-3 text-sm"><MapPin className="h-4 w-4" /> My Addresses</Link>
            </>
          )}
          <Link to="/about" onClick={close} className="flex items-center gap-3 px-3 py-3 text-sm"><Info className="h-4 w-4" /> About Us</Link>
          <Link to="/contact" onClick={close} className="flex items-center gap-3 px-3 py-3 text-sm"><Phone className="h-4 w-4" /> Contact Us</Link>
          {user && (
            <button onClick={() => { logout(); close(); }} className="flex w-full items-center gap-3 px-3 py-3 text-sm text-primary">
              <LogOut className="h-4 w-4" /> Logout
            </button>
          )}
          <div className="p-3"><Logo /></div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export function MobileBottomNav() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const setUI = useUI((s) => s.set);
  const user = useSession((s) => s.user);
  const openLogin = useUI((s) => s.openLogin);
  if (path.startsWith("/product/") || path === "/checkout") return null;
  const item = "relative flex min-h-14 flex-1 flex-col items-center justify-center gap-0.5 text-[10px] font-bold";
  const active = (p: string) => (path === p ? "text-primary" : "text-foreground");
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex border-t bg-background pb-[env(safe-area-inset-bottom)] lg:hidden" aria-label="Bottom navigation">
      <Link to="/" className={cn(item, active("/"))}><Home className="h-5 w-5" />Home</Link>
      <button onClick={() => setUI({ drawerOpen: true })} className={cn(item, active("/products"))}><LayoutGrid className="h-5 w-5" />Categories</button>
      <Link to="/orders" className={cn(item, active("/orders"))}><Package className="h-5 w-5" />My Orders</Link>
      <Link to="/addresses" className={cn(item, active("/addresses"))}><MapPin className="h-5 w-5" />My Addresses</Link>
      <button onClick={() => (user ? setUI({ drawerOpen: true }) : openLogin())} className={cn(item, active("/login"))} aria-label={user ? "Profile" : "Login"}><User className="h-5 w-5" />{user ? "Profile" : "Login"}</button>
    </nav>
  );
}
