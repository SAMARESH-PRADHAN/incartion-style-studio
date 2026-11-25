const EMPTY: never[] = [];
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { MapPin, Plus, Pencil, Trash2, Star } from "lucide-react";
import { toast } from "sonner";
import { RequireAuth } from "@/components/common/RequireAuth";
import { Container } from "@/components/common/Reveal";
import { AddressCard, AddressForm } from "@/components/common/AddressForm";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAddresses, useSession, type Address } from "@/store";
import { motion } from "framer-motion";

export const Route = createFileRoute("/addresses")({
  head: () => ({
    meta: [
      { title: "My Addresses — Incartion" },
      { name: "description", content: "Manage your saved delivery addresses." },
      { property: "og:title", content: "My Addresses — Incartion" },
      { property: "og:description", content: "Add, edit and set default delivery addresses." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <RequireAuth><AddressesPage /></RequireAuth>,
});

function AddressesPage() {
  const user = useSession((s) => s.user)!;
  const list = useAddresses((s) => s.byUser[user.id] ?? EMPTY);
  const { save, remove, setDefault } = useAddresses();
  const [editing, setEditing] = useState<Address | "new" | null>(null);
  
  return (
  <div>
    <section className="relative overflow-hidden bg-neutral-950 text-white">
      <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-premium/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 left-10 h-60 w-60 rounded-full bg-premium/15 blur-3xl" />
      <Container className="relative py-8 sm:py-12">
        <div className="mx-auto flex max-w-5xl flex-wrap items-end justify-between gap-4">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
            <p className="eyebrow flex items-center gap-2 text-premium"><span className="h-px w-8 bg-premium" /> My account</p>
            <h1 className="mt-2 text-2xl font-black uppercase tracking-wide sm:text-4xl">My Addresses</h1>
            <p className="mt-2 text-sm text-white/70">{list.length} saved {list.length === 1 ? "address" : "addresses"} · used at checkout</p>
          </motion.div>
          <Button variant="pill" size="lg" className="bg-gold text-white" onClick={() => setEditing("new")}><Plus /> Add new address</Button>
        </div>
      </Container>
      <span className="absolute inset-x-0 bottom-0 h-0.5 bg-gold" />
    </section>

    <Container className="py-8">
      <div className="mx-auto max-w-5xl">
        {list.length === 0 ? (
          <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center rounded-2xl border border-dashed border-premium/40 bg-secondary/40 px-4 py-20 text-center">
            <span className="grid h-20 w-20 place-items-center rounded-full bg-neutral-950 text-premium ring-2 ring-premium/40"><MapPin className="h-9 w-9" /></span>
            <p className="mt-5 text-lg font-black">No saved addresses</p>
            <p className="mt-1 text-sm text-muted-foreground">Add one to speed up checkout.</p>
            <Button className="mt-6" onClick={() => setEditing("new")}><Plus /> Add address</Button>
          </motion.div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {list.map((a, i) => (
              <motion.div key={a.id} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: i * 0.07 }}>
                <AddressCard
                  a={a}
                  actions={
                    <div className="mt-4 flex flex-wrap gap-2 border-t pt-3 text-xs font-bold uppercase">
                      <button className="flex h-9 items-center gap-1.5 rounded-full border px-3 transition hover:border-premium hover:text-premium" onClick={() => setEditing(a)}><Pencil className="h-3.5 w-3.5" /> Edit</button>
                      {!a.isDefault && <button className="flex h-9 items-center gap-1.5 rounded-full border px-3 transition hover:border-premium hover:text-premium" onClick={() => setDefault(user.id, a.id)}><Star className="h-3.5 w-3.5" /> Set default</button>}
                      <button className="flex h-9 items-center gap-1.5 rounded-full border border-red-200 px-3 text-red-600 transition hover:bg-red-50" onClick={() => { remove(user.id, a.id); toast("Address deleted"); }}><Trash2 className="h-3.5 w-3.5" /> Delete</button>
                    </div>
                  }
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </Container>

    <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
      <DialogContent className="max-h-[90vh] max-w-xl overflow-y-auto border-t-4 border-t-premium">
        <DialogHeader><DialogTitle className="font-black uppercase tracking-wide">{editing === "new" ? "Add new address" : "Edit address"}</DialogTitle></DialogHeader>
        {editing && (
          <AddressForm
            initial={editing === "new" ? undefined : editing}
            onCancel={() => setEditing(null)}
            onSave={(a) => { save(user.id, a); setEditing(null); toast.success("Address saved"); }}
          />
        )}
      </DialogContent>
    </Dialog>
  </div>
);
}
