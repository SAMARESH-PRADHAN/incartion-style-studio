import type { Order, SessionUser } from "@/store";
import { format } from "date-fns";

const rs = (n: number) => "Rs. " + Math.round(n).toLocaleString("en-IN");

export async function downloadInvoice(o: Order, user: SessionUser) {
  const { jsPDF } = await import("jspdf");
  const autoTable = (await import("jspdf-autotable")).default;
  const doc = new jsPDF();
  const pink: [number, number, number] = [255, 63, 108];
  doc.setFillColor(...pink);
  doc.rect(0, 0, 210, 30, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22).setFont("helvetica", "bold").text("INCARTION", 14, 18);
  doc.setFontSize(9).setFont("helvetica", "normal").text("Uniforms & Garments · from 1 pc to bulk", 14, 24);
  doc.setFontSize(16).setFont("helvetica", "bold").text("TAX INVOICE", 196, 18, { align: "right" });

  doc.setTextColor(40, 44, 63).setFontSize(9).setFont("helvetica", "normal");
  doc.text(["Incartion Garments Pvt. Ltd.", "Plot 42, Chandaka Industrial Estate, Patia", "Bhubaneswar, Odisha 751024", "GSTIN: 21AABCI1234F1Z5", "hello@incartion.in | +91 98610 00000"], 14, 40);
  doc.text([`Invoice No: INV-${o.id}`, `Order ID: ${o.id}`, `Date: ${format(new Date(o.createdAt), "dd MMM yyyy")}`, `Payment: ${o.payment.method}`], 196, 40, { align: "right" });

  const a = o.address;
  doc.setFont("helvetica", "bold").text("Bill To", 14, 70).text("Ship To", 110, 70);
  doc.setFont("helvetica", "normal");
  doc.text([user.name, user.email, a.mobile], 14, 76);
  doc.text(doc.splitTextToSize(`${a.name}, ${a.address}, ${a.locality}, ${a.city}, ${a.state} - ${a.pincode}`, 85), 110, 76);

  autoTable(doc, {
    startY: 95,
    head: [["#", "Item", "Sizes", "Qty", "Rate", "GST", "Amount"]],
    body: o.items.map((it, i) => [
      i + 1,
      it.name,
      Object.entries(it.sizes).filter(([, v]) => v).map(([k, v]) => `${k}x${v}`).join(", "),
      it.qty,
      rs(it.unit),
      `${it.gstRate}%`,
      rs(it.subtotal),
    ]),
    headStyles: { fillColor: [40, 44, 63] },
    styles: { fontSize: 8 },
  });
  const b = o.bill;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let y = (doc as any).lastAutoTable.finalY + 8;
  const rows: [string, string][] = [
    ["Total MRP", rs(b.mrpTotal)],
    ["Discount", "- " + rs(b.productDiscount)],
    ...(b.couponDiscount ? [[`Coupon (${o.coupon})`, "- " + rs(b.couponDiscount)] as [string, string]] : []),
    ["Taxable value", rs(b.subtotal - b.couponDiscount)],
    ["Print & customization", rs(b.printCharges)],
    ["CGST", rs(b.gst / 2)],
    ["SGST", rs(b.gst / 2)],
    ["Delivery", b.delivery ? rs(b.delivery) : "FREE"],
  ];
  rows.forEach(([k, v]) => { doc.text(k, 130, y); doc.text(v, 196, y, { align: "right" }); y += 6; });
  doc.setFont("helvetica", "bold").setFontSize(11).text("Grand Total", 130, y + 2).text(rs(b.total), 196, y + 2, { align: "right" });
  doc.setFont("helvetica", "normal").setFontSize(8).setTextColor(126, 129, 140);
  doc.text(["Terms: Goods once customised are non-returnable. Disputes subject to Bhubaneswar jurisdiction.", "This is a computer-generated invoice and does not require a signature."], 14, 280);
  doc.save(`Incartion-Invoice-${o.id}.pdf`);
}
