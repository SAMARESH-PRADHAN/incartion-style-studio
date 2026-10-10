import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { toast } from "sonner";
import { Container } from "@/components/common/Reveal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useContacts } from "@/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Incartion — Bhubaneswar, Odisha" },
      { name: "description", content: "Call, email or visit Incartion in Bhubaneswar. Get help with orders, bulk quotes and customisation." },
      { property: "og:title", content: "Contact Incartion" },
      { property: "og:description", content: "Reach our Bhubaneswar team for orders and bulk quotes." },
    ],
  }),
  component: Contact,
});

const faqs = [
  ["Is there a minimum order quantity?", "No. You can order a single piece. Bulk tier prices apply automatically at 10, 50 and 100+ pieces."],
  ["Can you add our company logo?", "Yes — embroidery or printing. Add a note on the product page or request a quote for 25+ pieces."],
  ["How long does delivery take?", "Ready stock ships in 2–3 days. Customised orders take 7–14 days depending on quantity."],
  ["Do you provide GST invoices?", "Yes, every order includes a GST invoice you can download from My Orders once delivered."],
  ["What is your return policy?", "Non-customised items can be returned within 7 days of delivery in unused condition."],
];

function Contact() {
  const add = useContacts((s) => s.add);
  const [f, setF] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [err, setErr] = useState<Record<string, string>>({});
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const er: Record<string, string> = {};
    if (f.name.trim().length < 2) er.name = "Enter your name";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) er.email = "Enter a valid email";
    if (f.phone && !/^[6-9]\d{9}$/.test(f.phone)) er.phone = "Enter a valid 10-digit mobile";
    if (f.message.trim().length < 10) er.message = "Message should be at least 10 characters";
    setErr(er);
    if (Object.keys(er).length) return;
    add(f);
    toast.success("Message sent!", { description: "We'll get back to you within one working day." });
    setF({ name: "", email: "", phone: "", subject: "", message: "" });
  };
  const inp = (k: keyof typeof f, ph: string, extra?: React.InputHTMLAttributes<HTMLInputElement>) => (
    <div>
      <Input placeholder={ph} aria-label={ph} value={f[k]} onChange={(e) => setF({ ...f, [k]: e.target.value })} className={cn("h-11", err[k] && "border-destructive")} {...extra} />
      {err[k] && <p className="mt-1 text-xs text-destructive">{err[k]}</p>}
    </div>
  );
  return (
    <Container className="py-8">
      <h1 className="text-3xl font-black">Get in touch</h1>
      <p className="mt-1 text-muted-foreground">Questions about an order, a bulk quote or customisation? We're here to help.</p>
      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
        <form onSubmit={submit} className="grid gap-3 rounded-md border p-5 sm:grid-cols-2" noValidate>
          {inp("name", "Your name *")}
          {inp("email", "Email *", { type: "email" })}
          {inp("phone", "Mobile", { inputMode: "numeric", maxLength: 10 })}
          {inp("subject", "Subject")}
          <div className="sm:col-span-2">
            <Textarea rows={5} placeholder="Your message *" aria-label="Message" value={f.message} onChange={(e) => setF({ ...f, message: e.target.value })} className={cn(err.message && "border-destructive")} />
            {err.message && <p className="mt-1 text-xs text-destructive">{err.message}</p>}
          </div>
          <Button type="submit" className="sm:col-span-2">Send message</Button>
        </form>
        <div className="space-y-4">
          {[
            [MapPin, "Visit us", "Plot 42, Chandaka Industrial Estate, Patia, Bhubaneswar, Odisha 751024"],
            [Phone, "Call", "+91 98610 00000"],
            [Mail, "Email", "hello@incartion.in"],
            [Clock, "Working hours", "Mon – Sat: 9:30 AM – 7:00 PM"],
          ].map(([I, t, d]) => {
            const Icon = I as typeof MapPin;
            return (
              <div key={String(t)} className="flex gap-3 rounded-md bg-secondary p-4">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground"><Icon className="h-4 w-4" /></span>
                <div><p className="text-sm font-black">{String(t)}</p><p className="text-sm text-muted-foreground">{String(d)}</p></div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="mt-8 overflow-hidden rounded-md border">
        <iframe
          title="Incartion location in Bhubaneswar"
          src="https://www.google.com/maps?q=Bhubaneswar,Odisha&output=embed"
          className="h-80 w-full"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
      <div className="mt-10 max-w-3xl">
        <h2 className="mb-3 text-xl font-black">Frequently asked questions</h2>
        <Accordion type="single" collapsible>
          {faqs.map(([q, a], i) => (
            <AccordionItem key={q} value={String(i)}>
              <AccordionTrigger className="text-left font-bold">{q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </Container>
  );
}
