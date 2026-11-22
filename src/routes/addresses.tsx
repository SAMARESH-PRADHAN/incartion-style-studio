const EMPTY: never[] = [];
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { MapPin, Plus } from "lucide-react";
import { toast } from "sonner";
import { RequireAuth } from "@/components/common/RequireAuth";
import { Container } from "@/components/common/Reveal";
import { AddressCard, AddressForm } from "@/components/common/AddressForm";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAddresses, useSession, type Address } from "@/store";

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
    <Container className="max-w-5xl py-6">
      <div className="mb-6 flex items-center justify-between gap-3">
        <h1 className="text-2xl font-black">My Addresses</h1>
        <Button onClick={() => setEditing("new")}><Plus /> Add new address</Button>
      </div>
      {list.length === 0 ? (
        <div className="flex flex-col items-center rounded-md border border-dashed py-20 text-center">
          <MapPin className="h-14 w-14 text-primary/40" />
          <p className="mt-3 font-black">No saved addresses</p>
          <p className="text-sm text-muted-foreground">Add one to speed up checkout.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {list.map((a) => (
            <AddressCard
              key={a.id}
              a={a}
              actions={
                <div className="mt-3 flex flex-wrap gap-2 border-t pt-3 text-xs font-bold uppercase">
                  <button className="h-9 px-2 text-primary" onClick={() => setEditing(a)}>Edit</button>
                  <button className="h-9 px-2" onClick={() => { remove(user.id, a.id); toast("Address deleted"); }}>Delete</button>
                  {!a.isDefault && <button className="h-9 px-2" onClick={() => setDefault(user.id, a.id)}>Set as default</button>}
                </div>
              }
            />
          ))}
        </div>
      )}
      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="max-h-[90vh] max-w-xl overflow-y-auto">
          <DialogHeader><DialogTitle>{editing === "new" ? "Add new address" : "Edit address"}</DialogTitle></DialogHeader>
          {editing && (
            <AddressForm
              initial={editing === "new" ? undefined : editing}
              onCancel={() => setEditing(null)}
              onSave={(a) => { save(user.id, a); setEditing(null); toast.success("Address saved"); }}
            />
          )}
        </DialogContent>
      </Dialog>
    </Container>
  );
}
