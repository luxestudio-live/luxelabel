
"use client";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

const sections = [
  {
    title: "Eligibility for Returns",
    content: "Products must be unused, in original packaging, and returned within 7 days of delivery. Some items (e.g., custom, final sale) are not eligible."
  },
  {
    title: "How to Request a Return",
    content: "To request a return, please contact our support team via the Help page or email suppot@luxelabels.co.in."
  },
  {
    title: "Refunds & Timelines",
    content: "Refunds are processed within 5-7 business days after receiving the returned item. Refunds are issued to the original payment method."
  },
  {
    title: "Replacement vs Refund",
    content: "You may choose a replacement or refund for eligible returns, subject to product availability."
  },
  {
    title: "Contact Information",
    content: "For return queries, email suppot@luxelabels.co.in or use the Help page."
  },
];

export default function ReturnPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-16 md:py-20 max-w-2xl">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-primary">Return & Refund Policy</h1>
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
