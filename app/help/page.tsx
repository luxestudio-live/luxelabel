
"use client";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { useState } from "react";

export default function HelpPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    // Simulate submission
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-16 md:py-20 max-w-2xl">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-primary">Help & Support</h1>
        <div className="bg-white dark:bg-card p-6 rounded-xl shadow border border-border/30 mb-8">
          <h2 className="font-semibold text-lg mb-4 text-secondary">Contact Form</h2>
          {submitted ? (
            <div className="text-green-600 font-semibold">Thank you! Your message has been submitted.</div>
          ) : (
            <form className="space-y-4" onSubmit={handleSubmit}>
              <input name="name" type="text" required placeholder="Name" className="border p-3 rounded w-full" value={form.name} onChange={handleChange} />
              <input name="email" type="email" required placeholder="Email" className="border p-3 rounded w-full" value={form.email} onChange={handleChange} />
              <input name="phone" type="tel" placeholder="Phone" className="border p-3 rounded w-full" value={form.phone} onChange={handleChange} />
              <input name="subject" type="text" required placeholder="Subject" className="border p-3 rounded w-full" value={form.subject} onChange={handleChange} />
              <textarea name="message" required placeholder="Message" className="border p-3 rounded w-full min-h-[100px]" value={form.message} onChange={handleChange} />
              <button type="submit" className="bg-primary text-white px-6 py-2 rounded font-semibold">Submit</button>
            </form>
          )}
        </div>
        <div className="mb-8">
          <h2 className="font-semibold text-lg mb-2 text-secondary">Other Contact Options</h2>
          <div className="space-y-2 text-muted-foreground text-sm">
            <div>Email: <a href="mailto:support@luxelabel.in" className="text-primary underline">support@luxelabel.in</a></div>
            <div>Phone/WhatsApp: <a href="tel:+919876543210" className="text-primary underline">+91 98765 43210</a></div>
            <div>Working hours: Mon-Sat, 10am-7pm</div>
          </div>
        </div>
        <div className="mb-8">
          <h2 className="font-semibold text-lg mb-2 text-secondary">Quick Links</h2>
          <div className="flex flex-wrap gap-4">
            <a href="/faq" className="text-primary underline">FAQ</a>
            <a href="/return-policy" className="text-primary underline">Return Policy</a>
            <a href="/shipping-policy" className="text-primary underline">Shipping Policy</a>
            <a href="/orders" className="text-primary underline">Orders</a>
          </div>
        </div>
        {/* Optional: Chat widget or ticket ID */}
      </main>
      <Footer />
    </div>
  );
}
