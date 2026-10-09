import medical from "@/assets/hero-medical.jpg";
import corporate from "@/assets/hero-corporate.jpg";
import hotel from "@/assets/hero-hotel.jpg";
import industrial from "@/assets/cat-industrial.jpg";
import school from "@/assets/cat-school.jpg";
import tshirt from "@/assets/cat-tshirt.jpg";

export type SubCategory = { slug: string; name: string };
export type Category = {
  slug: string;
  name: string;
  tagline: string;
  image: string;
  subs: SubCategory[];
};

// Source of truth for categories. Edit sub-categories here.
export const categories: Category[] = [
  {
    slug: "medical",
    name: "Medical Uniform",
    tagline: "Comfort that cares, shift after shift",
    image: medical,
    subs: [
      { slug: "scrub-suit", name: "Scrub Suit" },
      { slug: "aprons", name: "Aprons" },
    ],
  },
  {
    slug: "corporate",
    name: "Corporate",
    tagline: "Sharp tailoring for teams that lead",
    image: corporate,
    subs: [
      { slug: "shirt", name: "Shirt" },
      { slug: "trouser", name: "Trouser" },
      { slug: "blazer", name: "Blazer" },
    ],
  },
  {
    slug: "hotel",
    name: "Hotel Uniform",
    tagline: "Hospitality, dressed to impress",
    image: hotel,
    subs: [
      { slug: "aprons", name: "Aprons" },
      { slug: "shirt", name: "Shirt" },
      { slug: "trouser", name: "Trouser" },
      { slug: "blazer", name: "Blazer" },
      { slug: "chef-coat", name: "Chef Coat" },
      { slug: "waistcoat", name: "Waistcoat" },
    ],
  },
  {
    slug: "industrial",
    name: "Industrial",
    tagline: "Built tough for the shop floor",
    image: industrial,
    subs: [
      { slug: "dungaree", name: "Dungaree" },
      { slug: "shirt", name: "Shirt" },
      { slug: "trouser", name: "Trouser" },
      { slug: "safety-jacket", name: "Safety Jacket" },
    ],
  },
  {
    slug: "school",
    name: "School Uniform",
    tagline: "Smart, durable, ready for class",
    image: school,
    subs: [
      { slug: "shirt", name: "Shirt" },
      { slug: "trouser", name: "Trouser" },
      { slug: "skirt", name: "Skirt" },
      { slug: "tie-belt", name: "Tie & Belt" },
      { slug: "blazer", name: "Blazer" },
    ],
  },
  {
    slug: "tshirt",
    name: "T-Shirt",
    tagline: "Everyday tees, branded your way",
    image: tshirt,
    subs: [
      { slug: "round-neck", name: "Round Neck" },
      { slug: "polo", name: "Polo" },
    ],
  },
];

export const getCategory = (slug?: string) => categories.find((c) => c.slug === slug);
export const getSubName = (cat: string, sub: string) =>
  getCategory(cat)?.subs.find((s) => s.slug === sub)?.name ?? sub;
