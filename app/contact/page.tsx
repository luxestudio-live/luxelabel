import { Header } from "@/components/header"
import { ContactHero } from "@/components/contact-hero"
import { ContactForm } from "@/components/contact-form"
import { ContactInfo } from "@/components/contact-info"
import { FlagshipStore } from "@/components/flagship-store"
import { Footer } from "@/components/footer"

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <ContactHero />
      <div className="container mx-auto px-4 py-16 md:py-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 mb-20">
          <ContactForm />
          <ContactInfo />
        </div>
        <FlagshipStore />
      </div>
      <Footer />
    </div>
  )
}