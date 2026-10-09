import { categories } from "./categories";
import { SIZES, type Tier } from "@/lib/pricing";
import fabric from "@/assets/p-fabric.jpg";
import scrub from "@/assets/p-scrub.jpg";
import chef from "@/assets/p-chef.jpg";
import blazer from "@/assets/p-blazer.jpg";
import safety from "@/assets/p-safety.jpg";
import bulk from "@/assets/hero-bulk.jpg";

export type Product = {
  id: string;
  name: string;
  slug: string;
  category: string;
  subCategory: string;
  material: string;
  price: number;
  mrp: number;
  discountPercent: number;
  rating: number;
  ratingCount: number;
  images: string[];
  description: string;
  sizes: string[];
  colors: string[];
  overview: Record<string, string>;
  washCare: string[];
  designGuideline: string[];
  bulkPricing: Tier[];
  tags: string[];
  isNew: boolean;
  isBestSeller: boolean;
  stock: number;
  createdAt: number;
};

export const MATERIALS = ["Cotton", "Polyester", "Poly-Cotton", "Denim", "Linen", "Blend", "Nylon"];

function rng(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const r = rng(2026);
const pick = <T,>(a: T[]) => a[Math.floor(r() * a.length)];

const adjectives: Record<string, string[]> = {
  medical: ["ProCare", "FlexFit", "AeroMed", "Classic"],
  corporate: ["Executive", "Oxford", "Slim-Fit", "Premium"],
  hotel: ["Grand", "Royal", "Heritage", "Signature"],
  industrial: ["HeavyDuty", "ToughGuard", "WorkPro", "Rugged"],
  school: ["Smart", "Classic", "Everyday", "Premium"],
  tshirt: ["Essential", "Bio-Wash", "Dri-Fit", "Premium"],
};
const basePrice: Record<string, number> = {
  "scrub-suit": 899, aprons: 349, shirt: 649, trouser: 799, blazer: 2499, "chef-coat": 1199,
  waistcoat: 899, dungaree: 1299, "safety-jacket": 599, skirt: 549, "tie-belt": 249, "round-neck": 299, polo: 449,
};
const subMaterials: Record<string, string[]> = {
  "scrub-suit": ["Poly-Cotton", "Blend", "Cotton"], aprons: ["Cotton", "Poly-Cotton", "Denim"],
  shirt: ["Cotton", "Poly-Cotton", "Linen"], trouser: ["Poly-Cotton", "Blend", "Polyester"],
  blazer: ["Blend", "Polyester", "Linen"], "chef-coat": ["Cotton", "Poly-Cotton"], waistcoat: ["Polyester", "Blend"],
  dungaree: ["Denim", "Cotton", "Poly-Cotton"], "safety-jacket": ["Nylon", "Polyester"], skirt: ["Poly-Cotton", "Blend"],
  "tie-belt": ["Polyester", "Nylon"], "round-neck": ["Cotton", "Blend"], polo: ["Cotton", "Polyester", "Blend"],
};
const colorsAll = ["Navy", "White", "Black", "Teal", "Grey", "Maroon", "Sky Blue", "Olive", "Royal Blue", "Bottle Green", "Orange", "Beige"];

const catImage = Object.fromEntries(categories.map((c) => [c.slug, c.image]));
function primaryImage(cat: string, sub: string) {
  if (sub === "scrub-suit") return scrub;
  if (sub === "safety-jacket") return safety;
  if (sub === "chef-coat" || sub === "waistcoat" || sub === "aprons") return chef;
  if (sub === "blazer" || (cat === "corporate" && sub !== "trouser")) return blazer;
  if (cat === "tshirt") return catImage.tshirt;
  return catImage[cat];
}

const slugify = (s: string) => s.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export const products: Product[] = [];
let n = 1;
const baseTime = new Date("2026-06-01").getTime();
categories.forEach((cat) =>
  cat.subs.forEach((sub, si) => {
    const count = 3 + ((si + cat.slug.length) % 2);
    for (let i = 0; i < count; i++) {
      const adj = adjectives[cat.slug][i % 4];
      const material = pick(subMaterials[sub.slug] ?? MATERIALS);
      const name = `${adj} ${material} ${sub.name}`;
      const price = Math.round((basePrice[sub.slug] * (0.85 + r() * 0.5)) / 10) * 10 - 1;
      const disc = 20 + Math.floor(r() * 36);
      const mrp = Math.round(price / (1 - disc / 100) / 10) * 10 - 1;
      const primary = primaryImage(cat.slug, sub.slug);
      const imgs = [primary, catImage[cat.slug], fabric, bulk];
      const images = i % 2 ? [imgs[1], imgs[0], imgs[2], imgs[3]] : imgs;
      const id = `INC${String(n).padStart(3, "0")}`;
      const gsm = 140 + Math.floor(r() * 160);
      const colors = [pick(colorsAll), pick(colorsAll), pick(colorsAll)].filter((c, k, a) => a.indexOf(c) === k);
      products.push({
        id,
        name,
        slug: `${slugify(name)}-${cat.slug}-${id.toLowerCase()}`,
        category: cat.slug,
        subCategory: sub.slug,
        material,
        price,
        mrp,
        discountPercent: Math.round((1 - price / mrp) * 100),
        rating: Math.round((3.6 + r() * 1.3) * 10) / 10,
        ratingCount: 40 + Math.floor(r() * 4200),
        images,
        description: `The ${name} from Incartion is crafted for ${cat.name.toLowerCase()} teams who need all-day comfort and a sharp, consistent look. Made from durable ${material.toLowerCase()} with reinforced stitching, it holds its shape wash after wash and is ready for your logo or embroidery.`,
        sizes: [...SIZES],
        colors,
        overview: {
          Fabric: material,
          Fit: pick(["Regular Fit", "Slim Fit", "Relaxed Fit", "Tailored Fit"]),
          GSM: `${gsm} GSM`,
          Pattern: pick(["Solid", "Self-Textured", "Twill Weave", "Pique"]),
          Closure: pick(["Button", "Zip", "Pull-on", "Drawstring", "Hook & Bar"]),
          Occasion: cat.name,
          Origin: "Made in Bhubaneswar, India",
        },
        washCare: [
          "Machine wash cold (30°C) with like colours",
          "Do not bleach",
          "Tumble dry low or line dry in shade",
          "Warm iron on reverse side",
          "Do not dry clean embroidered areas",
        ],
        designGuideline: [
          "Logo placement: left chest (3.5\"), right chest, back yoke or sleeve",
          "Embroidery up to 10,000 stitches included on orders of 25+ pcs",
          "Screen / DTF printing available in up to 6 colours",
          "Share artwork in AI, PDF, or 300 DPI PNG",
          "Custom colours & fabric dyeing from 100 pcs",
          "Single piece orders welcome – customisation from 10 pcs",
        ],
        bulkPricing: [
          { minQty: 1, price },
          { minQty: 10, price: Math.round(price * 0.92) },
          { minQty: 50, price: Math.round(price * 0.85) },
          { minQty: 100, price: Math.round(price * 0.78) },
        ],
        tags: [cat.name, sub.name, material],
        isNew: r() < 0.25,
        isBestSeller: r() < 0.3,
        stock: 50 + Math.floor(r() * 2000),
        createdAt: baseTime + n * 86400000,
      });
      n++;
    }
  }),
);

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);
export const getProductById = (id: string) => products.find((p) => p.id === id);
export const formatCount = (n: number) => (n >= 1000 ? (n / 1000).toFixed(1) + "k" : String(n));
export const bestSellers = products.filter((p) => p.isBestSeller).slice(0, 14);
export const newArrivals = [...products].sort((a, b) => b.createdAt - a.createdAt).slice(0, 14);
