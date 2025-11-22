
"use client";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

const sections = [
  {
    title: "Use of Website",
    content: "By using this website, you agree to comply with our terms and policies."
  },
  {
    title: "Orders & Payments",
    content: "All orders are subject to acceptance and payment verification. Prices are in INR and may change without notice."
  },
  {
    title: "Pricing",
    content: "We strive for accuracy but errors may occur. In case of pricing errors, we reserve the right to cancel or adjust orders."
  },
  {
    title: "Shipping",
    content: "Shipping timelines and charges are detailed in our Shipping Policy. Delays may occur due to unforeseen circumstances."
  },
  {
    title: "Returns",
    content: "Returns are governed by our Return Policy. Eligible products can be returned within the specified window."
  },
  {
    title: "Limitations of Liability",
    content: "We are not liable for indirect or consequential damages."
  },
  {
    title: "Governing Law",
    content: "These terms are governed by the laws of India."
  },
  {
    title: "Contact Information",
    content: "For any queries, contact support@luxelabel.in or use the Help page."
  },
];

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-16 md:py-20 max-w-2xl">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-primary">Terms & Conditions</h1>
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
