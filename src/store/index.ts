import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { SizeQty, Bill } from "@/lib/pricing";
import type { Review } from "@/data/reviews";

const storage = createJSONStorage(() => localStorage);
const opts = (name: string) => ({ name, storage, skipHydration: true });
const uid = () => Math.random().toString(36).slice(2, 10);

export type User = { id: string; name: string; email: string; mobile?: string; password: string };
export type SessionUser = Omit<User, "password">;

export const useUsers = create<{ users: User[]; add: (u: User) => void }>()(
  persist((set) => ({ users: [], add: (u) => set((s) => ({ users: [...s.users, u] })) }), opts("incartion_users")),
);

export const useSession = create<{ user: SessionUser | null; login: (u: SessionUser) => void; logout: () => void }>()(
  persist(
    (set) => ({ user: null, login: (user) => set({ user }), logout: () => set({ user: null }) }),
    opts("incartion_session"),
  ),
);

export type ArtworkFile = { name: string; type: string; dataUrl: string };
export type CartItem = { key: string; productId: string; sizes: SizeQty; note: string; printOptions?: string[]; artwork?: ArtworkFile | null };
type CartState = {
  items: CartItem[];
  coupon: string | null;
  add: (productId: string, sizes: SizeQty, note: string, printOptions?: string[], artwork?: ArtworkFile | null) => void;
  update: (key: string, patch: Partial<CartItem>) => void;
  remove: (key: string) => void;
  clear: () => void;
  setCoupon: (c: string | null) => void;
};
export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      coupon: null,
      add: (productId, sizes, note, printOptions = ["none"], artwork = null) =>
        set((s) => {
          const normalizedOptions = [...new Set(printOptions)].sort();
          const ex = s.items.find((i) =>
            i.productId === productId &&
            JSON.stringify([...(i.printOptions ?? ["none"])].sort()) === JSON.stringify(normalizedOptions) &&
            (i.artwork?.name ?? "") === (artwork?.name ?? "") &&
            (i.artwork?.dataUrl ?? "") === (artwork?.dataUrl ?? ""),
          );
          if (ex) {
            const merged: SizeQty = { ...ex.sizes };
            for (const [k, v] of Object.entries(sizes)) merged[k as keyof SizeQty] = (merged[k as keyof SizeQty] || 0) + (v || 0);
            return { items: s.items.map((i) => (i.key === ex.key ? { ...i, sizes: merged, note: note || i.note } : i)) };
          }
          return { items: [...s.items, { key: uid(), productId, sizes, note, printOptions: normalizedOptions, artwork }] };
        }),
      update: (key, patch) => set((s) => ({ items: s.items.map((i) => (i.key === key ? { ...i, ...patch } : i)) })),
      remove: (key) => set((s) => ({ items: s.items.filter((i) => i.key !== key) })),
      clear: () => set({ items: [], coupon: null }),
      setCoupon: (coupon) => set({ coupon }),
    }),
    opts("incartion_cart"),
  ),
);

export const useWishlist = create<{ ids: string[]; toggle: (id: string) => boolean; remove: (id: string) => void }>()(
  persist(
    (set, get) => ({
      ids: [],
      toggle: (id) => {
        const has = get().ids.includes(id);
        set({ ids: has ? get().ids.filter((x) => x !== id) : [id, ...get().ids] });
        return !has;
      },
      remove: (id) => set((s) => ({ ids: s.ids.filter((x) => x !== id) })),
    }),
    opts("incartion_wishlist"),
  ),
);

export type Address = {
  id: string;
  name: string;
  mobile: string;
  pincode: string;
  address: string;
  locality: string;
  city: string;
  state: string;
  type: "Home" | "Work";
  isDefault: boolean;
};
type AddrState = {
  byUser: Record<string, Address[]>;
  save: (userId: string, a: Omit<Address, "id"> & { id?: string }) => Address;
  remove: (userId: string, id: string) => void;
  setDefault: (userId: string, id: string) => void;
};
export const useAddresses = create<AddrState>()(
  persist(
    (set, get) => ({
      byUser: {},
      save: (userId, a) => {
        let list = get().byUser[userId] ?? [];
        const addr: Address = { ...a, id: a.id ?? uid() };
        if (addr.isDefault || list.length === 0) {
          addr.isDefault = true;
          list = list.map((x) => ({ ...x, isDefault: false }));
        }
        list = list.some((x) => x.id === addr.id) ? list.map((x) => (x.id === addr.id ? addr : x)) : [...list, addr];
        set((s) => ({ byUser: { ...s.byUser, [userId]: list } }));
        return addr;
      },
      remove: (userId, id) =>
        set((s) => {
          let list = (s.byUser[userId] ?? []).filter((x) => x.id !== id);
          if (list.length && !list.some((x) => x.isDefault)) list = list.map((x, i) => ({ ...x, isDefault: i === 0 }));
          return { byUser: { ...s.byUser, [userId]: list } };
        }),
      setDefault: (userId, id) =>
        set((s) => ({
          byUser: { ...s.byUser, [userId]: (s.byUser[userId] ?? []).map((x) => ({ ...x, isDefault: x.id === id })) },
        })),
    }),
    opts("incartion_addresses"),
  ),
);

export const ORDER_STEPS = ["Order Placed", "Confirmed", "Packed", "Shipped", "Out for Delivery", "Delivered"] as const;
export type OrderItem = {
  productId: string;
  name: string;
  image: string;
  slug: string;
  sizes: SizeQty;
  qty: number;
  unit: number;
  subtotal: number;
  gstRate: number;
  note: string;
  printOptions?: string[];
  artwork?: ArtworkFile | null;
  printCharges?: number;
};
export type Order = {
  id: string;
  createdAt: string;
  items: OrderItem[];
  address: Address;
  payment: { method: string; detail: string };
  bill: Bill;
  coupon: string | null;
  status: number;
  history: string[];
  cancelled: boolean;
  reviewed: string[];
};
type OrderState = {
  byUser: Record<string, Order[]>;
  place: (userId: string, o: Order) => void;
  update: (userId: string, id: string, fn: (o: Order) => Order) => void;
};
export const useOrders = create<OrderState>()(
  persist(
    (set) => ({
      byUser: {},
      place: (userId, o) => set((s) => ({ byUser: { ...s.byUser, [userId]: [o, ...(s.byUser[userId] ?? [])] } })),
      update: (userId, id, fn) =>
        set((s) => ({ byUser: { ...s.byUser, [userId]: (s.byUser[userId] ?? []).map((o) => (o.id === id ? fn(o) : o)) } })),
    }),
    opts("incartion_orders"),
  ),
);

export const useReviews = create<{ list: Review[]; add: (r: Review) => void }>()(
  persist((set) => ({ list: [], add: (r) => set((s) => ({ list: [r, ...s.list] })) }), opts("incartion_reviews")),
);

type Rec = Record<string, string | number> & { id: string; createdAt: string };
export const useQuotes = create<{ list: Rec[]; add: (r: Omit<Rec, "id" | "createdAt">) => void }>()(
  persist(
    (set) => ({ list: [], add: (r) => set((s) => ({ list: [{ ...r, id: uid(), createdAt: new Date().toISOString() } as Rec, ...s.list] })) }),
    opts("incartion_quotes"),
  ),
);
export const useContacts = create<{ list: Rec[]; add: (r: Omit<Rec, "id" | "createdAt">) => void }>()(
  persist(
    (set) => ({ list: [], add: (r) => set((s) => ({ list: [{ ...r, id: uid(), createdAt: new Date().toISOString() } as Rec, ...s.list] })) }),
    opts("incartion_contacts"),
  ),
);

export const useRecent = create<{ ids: string[]; push: (id: string) => void }>()(
  persist(
    (set) => ({ ids: [], push: (id) => set((s) => ({ ids: [id, ...s.ids.filter((x) => x !== id)].slice(0, 12) })) }),
    opts("incartion_recent"),
  ),
);

type UIState = {
  hydrated: boolean;
  loginOpen: boolean;
  pending: (() => void) | null;
  miniCartOpen: boolean;
  quoteOpen: boolean;
  quickViewId: string | null;
  drawerOpen: boolean;
  openLogin: (pending?: () => void) => void;
  closeLogin: () => void;
  set: (p: Partial<UIState>) => void;
};
export const useUI = create<UIState>()((set) => ({
  hydrated: false,
  loginOpen: false,
  pending: null,
  miniCartOpen: false,
  quoteOpen: false,
  quickViewId: null,
  drawerOpen: false,
  openLogin: (pending) => set({ loginOpen: true, pending: pending ?? null }),
  closeLogin: () => set({ loginOpen: false, pending: null }),
  set: (p) => set(p),
}));

export function rehydrateAll() {
  [useUsers, useSession, useCart, useWishlist, useAddresses, useOrders, useReviews, useQuotes, useContacts, useRecent].forEach(
    (s) => s.persist.rehydrate(),
  );
  useUI.setState({ hydrated: true });
}

export function useRequireAuth() {
  const user = useSession((s) => s.user);
  const openLogin = useUI((s) => s.openLogin);
  return (fn: () => void) => (user ? fn() : openLogin(fn));
}

export const newId = uid;
