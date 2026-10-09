import { useState } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSession, useUsers, newId } from "@/store";
import { cn } from "@/lib/utils";

type Tab = "login" | "signup" | "otp";
const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const mobileRe = /^[6-9]\d{9}$/;

function Field({ label, error, ...p }: React.InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-bold text-muted-foreground">{label}</span>
      <Input {...p} className={cn("h-11 rounded-sm", error && "border-destructive")} aria-invalid={!!error} />
      {error && <span className="mt-1 block text-xs text-destructive">{error}</span>}
    </label>
  );
}

export function AuthForm({ onSuccess }: { onSuccess: () => void }) {
  const [tab, setTab] = useState<Tab>("login");
  const [f, setF] = useState({ name: "", id: "", password: "", otp: "" });
  const [err, setErr] = useState<Record<string, string>>({});
  const [otpSent, setOtpSent] = useState(false);
  const users = useUsers((s) => s.users);
  const addUser = useUsers((s) => s.add);
  const login = useSession((s) => s.login);
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement>) => setF({ ...f, [k]: e.target.value });

  const done = (u: { id: string; name: string; email: string; mobile?: string }) => {
    login(u);
    toast.success(`Welcome, ${u.name.split(" ")[0]}!`);
    onSuccess();
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const er: Record<string, string> = {};
    const id = f.id.trim().toLowerCase();
    const validId = emailRe.test(id) || mobileRe.test(id);
    if (tab === "signup") {
      if (f.name.trim().length < 2) er.name = "Please enter your full name";
      if (!validId) er.id = "Enter a valid email or 10-digit mobile";
      if (f.password.length < 6) er.password = "Password must be at least 6 characters";
      if (validId && users.some((u) => u.email === id || u.mobile === id)) er.id = "Account already exists, please login";
      setErr(er);
      if (Object.keys(er).length) return;
      const isMobile = mobileRe.test(id);
      const u = { id: newId(), name: f.name.trim(), email: isMobile ? `${id}@mobile.incartion` : id, mobile: isMobile ? id : undefined, password: f.password };
      addUser(u);
      const { password: _p, ...rest } = u;
      done(rest);
    } else if (tab === "login") {
      if (!validId) er.id = "Enter a valid email or 10-digit mobile";
      if (!f.password) er.password = "Enter your password";
      setErr(er);
      if (Object.keys(er).length) return;
      const u = users.find((x) => (x.email === id || x.mobile === id) && x.password === f.password);
      if (!u) return setErr({ password: "Incorrect email/mobile or password" });
      const { password: _p, ...rest } = u;
      done(rest);
    } else {
      if (!mobileRe.test(id)) return setErr({ id: "Enter a valid 10-digit mobile number" });
      if (!otpSent) {
        setOtpSent(true);
        setErr({});
        toast("OTP sent (demo): enter any 6 digits");
        return;
      }
      if (!/^\d{6}$/.test(f.otp)) return setErr({ otp: "Enter the 6-digit OTP" });
      const existing = users.find((x) => x.mobile === id);
      if (existing) {
        const { password: _p, ...rest } = existing;
        return done(rest);
      }
      const u = { id: newId(), name: `User ${id.slice(-4)}`, email: `${id}@mobile.incartion`, mobile: id, password: "" };
      addUser(u);
      const { password: _p, ...rest } = u;
      done(rest);
    }
  };

  return (
    <div>
      <div className="mb-5 grid grid-cols-3 rounded-sm bg-secondary p-1 text-xs font-bold uppercase" role="tablist">
        {(["login", "signup", "otp"] as Tab[]).map((t) => (
          <button
            key={t}
            role="tab"
            aria-selected={tab === t}
            onClick={() => { setTab(t); setErr({}); }}
            className={cn("h-10 rounded-sm transition", tab === t ? "bg-background text-primary shadow-card" : "text-muted-foreground")}
          >
            {t === "otp" ? "OTP Login" : t}
          </button>
        ))}
      </div>
      <form onSubmit={submit} className="space-y-4" noValidate>
        {tab === "signup" && <Field label="Full name" value={f.name} onChange={set("name")} error={err.name} autoComplete="name" />}
        <Field
          label={tab === "otp" ? "Mobile number" : "Email or mobile"}
          value={f.id}
          onChange={set("id")}
          error={err.id}
          inputMode={tab === "otp" ? "numeric" : "email"}
          autoComplete="username"
        />
        {tab !== "otp" && <Field label="Password" type="password" value={f.password} onChange={set("password")} error={err.password} autoComplete={tab === "login" ? "current-password" : "new-password"} />}
        {tab === "otp" && otpSent && <Field label="6-digit OTP" value={f.otp} onChange={set("otp")} error={err.otp} inputMode="numeric" maxLength={6} />}
        <Button type="submit" className="w-full">
          {tab === "login" ? "Login" : tab === "signup" ? "Create account" : otpSent ? "Verify & Login" : "Send OTP"}
        </Button>
        <p className="text-center text-xs text-muted-foreground">
          By continuing, you agree to Incartion's Terms of Use and Privacy Policy.
        </p>
      </form>
    </div>
  );
}
