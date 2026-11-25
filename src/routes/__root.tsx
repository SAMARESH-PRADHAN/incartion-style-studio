import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { Toaster } from "@/components/ui/sonner";
import { OfferTicker } from "@/components/layout/OfferTicker";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MobileBottomNav, MobileDrawer } from "@/components/layout/MobileNav";
import { FloatingButtons, LoginModal, MiniCart, QuickView, QuoteModal } from "@/components/layout/Overlays";
import { rehydrateAll } from "@/store";
import { Button } from "@/components/ui/button";

function NotFoundComponent() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4 py-16">
      <div className="max-w-md text-center">
        <p className="text-brand text-8xl font-black">404</p>
        <h1 className="mt-4 text-2xl font-black">This page went out of stock</h1>
        <p className="mt-2 text-sm text-muted-foreground">The page you're looking for doesn't exist or has been moved.</p>
        <div className="mt-6 flex justify-center gap-3">
          <Button asChild><Link to="/">Go home</Link></Button>
          <Button asChild variant="outline"><Link to="/products">Shop all</Link></Button>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">This page didn't load</h1>
        <p className="mt-2 text-sm text-muted-foreground">Something went wrong on our end. You can try refreshing or head back home.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <Button onClick={() => { router.invalidate(); reset(); }}>Try again</Button>
          <Button asChild variant="outline"><a href="/">Go home</a></Button>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Incartion — Uniforms & Garments from 1 piece to bulk" },
      { name: "description", content: "Incartion, Bhubaneswar: medical, corporate, hotel, industrial and security guard uniforms, plus T-shirts. Order from 1 piece to bulk." },
      { name: "author", content: "Incartion" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "theme-color", content: "#111111" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Assistant:wght@400;500;600;700;800&display=swap" },
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const path = useRouterState({ select: (s) => s.location.pathname });
  const previousPath = useRef(path);
  const [routeLoading, setRouteLoading] = useState(false);
  useEffect(() => {
    rehydrateAll();
  }, []);
  useEffect(() => {
    if (previousPath.current === path) return;
    previousPath.current = path;
    setRouteLoading(true);
    const timer = window.setTimeout(() => setRouteLoading(false), 360);
    return () => window.clearTimeout(timer);
  }, [path]);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [path]);
  const onProduct = path.startsWith("/product/");
  return (
    <QueryClientProvider client={queryClient}>
      <MotionConfig reducedMotion="user">
        <AnimatePresence>
          {routeLoading && (
            <motion.div
              key={path}
              aria-hidden="true"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 0.82 }}
              exit={{ scaleX: 1, opacity: 0 }}
              transition={{ duration: 0.32, ease: "easeInOut" }}
              className="fixed inset-x-0 top-0 z-[100] h-0.5 origin-left bg-primary shadow-sm"
            />
          )}
        </AnimatePresence>
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-2 focus:top-2 focus:z-50 focus:bg-background focus:p-2">Skip to content</a>
        <OfferTicker thin={onProduct} />
        <Navbar />
        <AnimatePresence mode="wait">
          <motion.main
            id="main"
            key={path}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="min-h-[60vh]"
          >
            <Outlet />
          </motion.main>
        </AnimatePresence>
        <Footer />
        <MobileBottomNav />
        <MobileDrawer />
        <LoginModal />
        <MiniCart />
        <QuickView />
        <QuoteModal />
        <FloatingButtons />
        <Toaster position="top-center" />
      </MotionConfig>
    </QueryClientProvider>
  );
}
