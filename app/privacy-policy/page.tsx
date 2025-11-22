
"use client";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

const sections = [
  {
    title: "What Data We Collect",
    content: "We collect personal information such as name, email, phone, address, and payment details when you place an order or register."
  },
  {
    title: "How We Use Your Data",
    content: "Your data is used to process orders, provide support, improve our services, and send updates/offers."
  },
  {
    title: "Cookies",
    content: "We use cookies to enhance your browsing experience and for analytics. You can manage cookie preferences in your browser."
  },
  {
    title: "Third-Party Services",
    content: "We may use third-party services like Firebase, analytics, and payment gateways. These providers may collect data as per their policies."
  },
  {
    title: "User Rights",
    content: "You can request access, correction, or deletion of your personal data. Contact us via the Help page."
  },
  {
    title: "Contact Information",
    content: "For privacy concerns, email support@luxelabel.in or use the Help page."
  },
];

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-16 md:py-20 max-w-2xl">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-primary">Privacy Policy</h1>
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
