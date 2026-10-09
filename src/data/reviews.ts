export type Review = {
  id: string;
  productId: string;
  userName: string;
  rating: number;
  title: string;
  text: string;
  date: string;
  photo?: string;
  verified: boolean;
};

const names = ["Ananya Mohanty", "Rakesh Patnaik", "Sneha Das", "Arjun Mishra", "Priya Sahoo", "Vikram Nayak", "Kavya Rao", "Sourav Panda"];
const pool: [number, string, string][] = [
  [5, "Excellent quality", "Fabric is thick and comfortable. Ordered 40 pieces for our clinic and the embroidery came out perfect."],
  [4, "Good value for bulk", "Nice stitching and the fit is true to size. Delivery to Cuttack took 3 days."],
  [5, "Our staff loves it", "Very breathable even in Odisha summers. Will reorder for the new batch."],
  [4, "Looks premium", "Colour matched our brand exactly. Slight delay in dispatch but support was helpful."],
  [3, "Decent", "Quality is fine for the price. Sizing runs slightly large, order one size down."],
];

export function seedReviews(productId: string): Review[] {
  const h = [...productId].reduce((a, c) => a + c.charCodeAt(0), 0);
  const count = 2 + (h % 3);
  return Array.from({ length: count }, (_, i) => {
    const [rating, title, text] = pool[(h + i) % pool.length];
    return {
      id: `seed-${productId}-${i}`,
      productId,
      userName: names[(h + i * 3) % names.length],
      rating,
      title,
      text,
      date: new Date(2026, (h + i) % 9, 1 + ((h * (i + 1)) % 27)).toISOString(),
      verified: true,
    };
  });
}
