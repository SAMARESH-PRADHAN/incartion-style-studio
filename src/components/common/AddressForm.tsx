import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import type { Address } from "@/store";
import { cn } from "@/lib/utils";
import { Briefcase, Home, Phone } from "lucide-react";

const empty: Omit<Address, "id"> = { name: "", mobile: "", pincode: "", address: "", locality: "", city: "Bhubaneswar", state: "Odisha", type: "Home", isDefault: false };

export function AddressForm({ initial, onSave, onCancel }: { initial?: Address; onSave: (a: Omit<Address, "id"> & { id?: string }) => void; onCancel?: () => void }) {
  const [f, setF] = useState<Omit<Address, "id"> & { id?: string }>(initial ?? empty);
  const [err, setErr] = useState<Record<string, string>>({});
  const set = (k: keyof Address) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setF({ ...f, [k]: e.target.value });
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const er: Record<string, string> = {};
    if (f.name.trim().length < 2) er.name = "Enter name";
    if (!/^[6-9]\d{9}$/.test(f.mobile)) er.mobile = "Enter valid 10-digit mobile";
    if (!/^\d{6}$/.test(f.pincode)) er.pincode = "Enter 6-digit pincode";
    if (f.address.trim().length < 5) er.address = "Enter full address";
    if (!f.locality.trim()) er.locality = "Enter locality";
    if (!f.city.trim()) er.city = "Enter city";
    if (!f.state.trim()) er.state = "Enter state";
    setErr(er);
    if (!Object.keys(er).length) onSave(f);
  };
  const field = (k: keyof Address, label: string, extra?: React.InputHTMLAttributes<HTMLInputElement>) => (
    <div>
      <Input placeholder={label} aria-label={label} value={String(f[k] ?? "")} onChange={set(k)} className={cn("h-11", err[k] && "border-destructive")} {...extra} />
      {err[k] && <p className="mt-1 text-xs text-destructive">{err[k]}</p>}
    </div>
  );
  return (
    <form onSubmit={submit} className="grid gap-3 sm:grid-cols-2" noValidate>
      <p className="eyebrow sm:col-span-2">Contact details</p>
      {field("name", "Name *")}
      {field("mobile", "Mobile no *", { inputMode: "numeric", maxLength: 10 })}
      <p className="eyebrow mt-2 sm:col-span-2">Address</p>
      {field("pincode", "Pincode *", { inputMode: "numeric", maxLength: 6 })}
      {field("locality", "Locality / Town *")}
      <div className="sm:col-span-2">
        <Textarea placeholder="Address (House no, building, street, area) *" aria-label="Address" value={f.address} onChange={set("address")} className={cn(err.address && "border-destructive")} />
        {err.address && <p className="mt-1 text-xs text-destructive">{err.address}</p>}
      </div>
      {field("city", "City *")}
      {field("state", "State *")}
      <div className="flex gap-2 sm:col-span-2">
        {(["Home", "Work"] as const).map((t) => (
          <button type="button" key={t} onClick={() => setF({ ...f, type: t })} className={cn("h-10 rounded-full border px-5 text-sm font-bold", f.type === t && "border-premium text-premium bg-premium/10")}>{t}</button>
        ))}
      </div>
      <label className="flex items-center gap-2 text-sm sm:col-span-2">
        <Checkbox checked={f.isDefault} onCheckedChange={(v) => setF({ ...f, isDefault: !!v })} /> Make this my default address
      </label>
      <div className="flex gap-2 sm:col-span-2">
        {onCancel && <Button type="button" variant="outline" className="flex-1" onClick={onCancel}>Cancel</Button>}
        <Button type="submit" className="flex-1">Save address</Button>
      </div>
    </form>
  );
}

export function AddressCard({ a, selected, onSelect, actions }: { a: Address; selected?: boolean; onSelect?: () => void; actions?: React.ReactNode }) {
  const TypeIcon = a.type === "Home" ? Home : Briefcase;
  return (
    <div
      onClick={onSelect}
      className={cn(
        "group relative h-full overflow-hidden rounded-xl border bg-card p-5 transition-all duration-300",
        onSelect && "cursor-pointer",
        selected ? "border-premium shadow-pop ring-1 ring-premium" : "hover:-translate-y-1 hover:border-premium/60 hover:shadow-pop",
      )}
    >
      <span className={cn("absolute inset-y-0 left-0 w-1 bg-gold transition-opacity", selected || a.isDefault ? "opacity-100" : "opacity-0 group-hover:opacity-100")} />
      <div className="flex items-start gap-3">
        {onSelect && (
          <span className={cn("mt-1 grid h-4 w-4 shrink-0 place-items-center rounded-full border-2", selected ? "border-premium" : "border-input")}>
            {selected && <span className="h-2 w-2 rounded-full bg-premium" />}
          </span>
        )}
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-neutral-950 text-premium ring-1 ring-premium/40">
          <TypeIcon className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="flex flex-wrap items-center gap-2 text-sm font-black">
            {a.name}
            <span className="rounded-full border border-premium/50 bg-premium/10 px-2 py-0.5 text-[10px] font-bold uppercase text-premium">{a.type}</span>
            {a.isDefault && <span className="rounded-full bg-gold px-2 py-0.5 text-[10px] font-black uppercase text-white">Default</span>}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{a.address}, {a.locality}, {a.city}, {a.state} - {a.pincode}</p>
          <p className="mt-2 flex items-center gap-1.5 text-sm"><Phone className="h-3.5 w-3.5 text-premium" /> <b>{a.mobile}</b></p>
          {actions}
        </div>
      </div>
    </div>
  );
}