export type Coupon = {
  code: string;
  type: "flat" | "percent";
  value: number;
  maxDiscount?: number;
  minOrder: number;
  minQty?: number;
  firstOrderOnly?: boolean;
  desc: string;
  expiry: string; // ISO date
  active: boolean;
};

export const coupons: Coupon[] = [
  {
    code: "WELCOME100",
    type: "flat",
    value: 100,
    minOrder: 499,
    firstOrderOnly: true,
    desc: "Flat ₹100 OFF on your first order",
    expiry: "2027-12-31",
    active: true,
  },
  {
    code: "INCART10",
    type: "percent",
    value: 10,
    maxDiscount: 500,
    minOrder: 999,
    desc: "Get 10% OFF up to ₹500",
    expiry: "2027-12-31",
    active: true,
  },
  {
    code: "BULK20",
    type: "percent",
    value: 20,
    maxDiscount: 5000,
    minOrder: 5000,
    minQty: 50,
    desc: "20% OFF on 50+ pieces, up to ₹5,000",
    expiry: "2027-12-31",
    active: true,
  },
  {
    code: "CORP15",
    type: "percent",
    value: 15,
    maxDiscount: 3000,
    minOrder: 3000,
    desc: "15% OFF for corporate orders, up to ₹3,000",
    expiry: "2027-06-30",
    active: true,
  },
  {
    code: "FESTIVE25",
    type: "percent",
    value: 25,
    maxDiscount: 1000,
    minOrder: 1999,
    desc: "Festive 25% OFF",
    expiry: "2025-11-30",
    active: false,
  },
];

export const activeCoupons = (now = new Date()) =>
  coupons.filter((c) => c.active && new Date(c.expiry + "T23:59:59") >= now);
