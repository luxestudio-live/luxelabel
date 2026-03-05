
"use client";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { useState } from "react";

const faqData = [
  {
    category: "Orders",
    questions: [
      { q: "How do I place an order?", a: "Browse products, add to cart, and complete checkout with your details." },
      { q: "Can I cancel my order?", a: "Orders can be cancelled before shipping. Contact support for assistance." },
    ],
  },
  {
    category: "Shipping",
    questions: [
      { q: "What are the shipping charges?", a: "Shipping charges depend on your region and order value. See our Shipping Policy for details." },
      { q: "How can I track my shipment?", a: "You will receive a tracking link once your order is shipped." },
    ],
  },
  {
    category: "Payments",
    questions: [
      { q: "Which payment methods are accepted?", a: "We accept credit/debit cards, UPI, net banking, and cash on delivery." },
      { q: "Is my payment information secure?", a: "Yes, we use secure payment gateways and do not store card details." },
    ],
  },
  {
    category: "Returns",
    questions: [
      { q: "How do I request a return?", a: "To request a return, please contact our support team via the Help page or email suppot@luxelabels.co.in." },
      { q: "What is the return window?", a: "Returns are accepted within 7 days of delivery for eligible products." },
    ],
  },
  {
    category: "Account",
    questions: [
      { q: "How do I reset my password?", a: "Use the 'Forgot password' link on the login page." },
      { q: "How do I update my address?", a: "Go to your profile and edit your saved addresses." },
    ],
  },
];

export default function FAQPage() {
  const [expanded, setExpanded] = useState<{[key:string]:number|null}>({});
  const [search, setSearch] = useState("");
  const filteredFaq = faqData.map(cat => ({
    ...cat,
    questions: cat.questions.filter(q =>
      q.q.toLowerCase().includes(search.toLowerCase()) ||
      q.a.toLowerCase().includes(search.toLowerCase())
    ),
  })).filter(cat => cat.questions.length > 0);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-16 md:py-20 max-w-2xl">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-primary">Frequently Asked Questions</h1>
        <input
          type="text"
          placeholder="Search FAQs..."
          className="border p-3 rounded w-full mb-6"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <div className="space-y-8">
          {filteredFaq.length === 0 ? (
            <div className="text-muted-foreground">No FAQs found.</div>
          ) : (
            filteredFaq.map(cat => (
              <div key={cat.category}>
                <h2 className="font-bold text-xl mb-3 text-primary tracking-wide">{cat.category}</h2>
                <div className="space-y-3">
                  {cat.questions.map((q, idx) => {
                    const isExpanded = expanded[cat.category] === idx;
                    const handleToggle = () => {
                      setExpanded(exp => ({ ...exp, [cat.category]: isExpanded ? null : idx }));
                    };
                    return (
                      <div key={q.q} className="border rounded-xl p-4 bg-white dark:bg-card">
                        <button
                          className="w-full text-left font-medium text-primary flex justify-between items-center"
                          onClick={handleToggle}
                          aria-expanded={isExpanded}
                        >
                          {q.q}
                          <span className="ml-2 text-xs">{isExpanded ? "−" : "+"}</span>
                        </button>
                        {isExpanded && (
                          <div className="mt-3 text-muted-foreground text-sm">{q.a}</div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>
        <div className="mt-10 text-center">
          <span className="text-muted-foreground">Didn’t find your answer?</span>
          <a href="/help" className="ml-2 text-primary underline">Contact us</a>
        </div>
      </main>
      <Footer />
    </div>
  );
}
