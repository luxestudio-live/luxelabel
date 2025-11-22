import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export default function OrderConfirmationPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-16 md:py-20">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-primary">Thank You for Your Order!</h1>
        <div className="bg-white dark:bg-card p-6 rounded-xl shadow-lg border border-border/30">
          <p className="text-lg text-muted-foreground">Your order has been placed. Order details will be shown here.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
