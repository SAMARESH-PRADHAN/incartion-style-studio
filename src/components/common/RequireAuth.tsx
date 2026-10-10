import { useEffect, type ReactNode } from "react";
import { Lock } from "lucide-react";
import { useSession, useUI } from "@/store";
import { Button } from "@/components/ui/button";

export function RequireAuth({ children }: { children: ReactNode }) {
  const hydrated = useUI((s) => s.hydrated);
  const user = useSession((s) => s.user);
  const openLogin = useUI((s) => s.openLogin);
  useEffect(() => {
    if (hydrated && !user) openLogin();
  }, [hydrated, user]);
  if (!hydrated)
    return (
      <div className="mx-auto max-w-5xl space-y-4 p-6">
        <div className="skeleton h-8 w-1/3 rounded-sm" />
        <div className="skeleton h-40 rounded-sm" />
        <div className="skeleton h-40 rounded-sm" />
      </div>
    );
  if (!user)
    return (
      <div className="flex flex-col items-center px-4 py-24 text-center">
        <Lock className="h-14 w-14 text-primary" />
        <p className="mt-4 text-xl font-black">Please login to continue</p>
        <p className="mt-1 text-sm text-muted-foreground">Your bag, orders and addresses are saved to your account.</p>
        <Button className="mt-6" onClick={() => openLogin()}>Login / Signup</Button>
      </div>
    );
  return <>{children}</>;
}
