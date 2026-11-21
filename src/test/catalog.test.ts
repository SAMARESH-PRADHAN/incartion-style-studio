import { describe, expect, it } from "vitest";
import { categories } from "@/data/categories";
import { products } from "@/data/products";

describe("uniform catalog", () => {
  it("replaces school uniforms with security guard shirts and pants using existing images", () => {
    const category = categories.find((item) => item.slug === "security-guard");

    expect(category?.name).toBe("Security Guard Uniform");
    expect(category?.subs.map((sub) => [sub.slug, sub.name])).toEqual([
      ["shirt", "Shirt"],
      ["pant", "Pant"],
    ]);
    expect(categories.some((item) => item.slug === "school")).toBe(false);
    expect(products.filter((product) => product.category === "security-guard").length).toBeGreaterThan(0);
    expect(products.filter((product) => product.category === "security-guard").every((product) => ["shirt", "pant"].includes(product.subCategory))).toBe(true);
  });

  it("marks stocked products for the readymade exclusive collection", () => {
    expect(products.filter((product) => product.isExclusive).length).toBeGreaterThan(0);
    expect(products.filter((product) => product.isExclusive).every((product) => product.stock > 0)).toBe(true);
  });
});