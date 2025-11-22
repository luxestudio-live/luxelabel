
"use client";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

const sections = [
  {
    title: "Shipping Methods & Regions",
    content: "We ship across India via trusted courier partners. International shipping is available for select products."
  },
  {
    title: "Estimated Delivery Timelines",
    content: "Metro cities: 2-4 days. Other regions: 4-7 days. International: 7-15 days. Delays may occur during peak periods."
  },
  {
    title: "Handling & Cut-Off Times",
    content: "Orders placed before 2pm are processed same day. Orders after 2pm are processed next business day."
  },
  {
    title: "Shipping Charges & Free Shipping",
    content: "Shipping charges vary by region and order value. Free shipping for orders above ₹2,000."
  },
  {
    title: "Cash on Delivery",
    content: "COD is available for select pin codes and order values."
  },
  {
    title: "Contact Information",
    content: "For shipping queries, email support@luxelabel.in or use the Help page."
  },
];

export default function ShippingPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-16 md:py-20 max-w-2xl">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-primary">Shipping Policy</h1>
        <div className="space-y-8">
          {sections.map(sec => (
            <div key={sec.title} className="bg-white dark:bg-card p-6 rounded-xl shadow border border-border/30">
              <h2 className="font-bold text-xl mb-2 text-primary tracking-wide">{sec.title}</h2>
              <div className="text-muted-foreground text-sm">{sec.content}</div>
            </div>
          ))}
        </div>
        <div className="mt-10 text-center text-muted-foreground text-sm">
          Last updated: November 22, 2025
        </div>
      </main>
      <Footer />
    </div>
  );
}
