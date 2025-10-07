import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { AboutHero } from "@/components/about-hero"
import { AboutHeritage } from "@/components/about-heritage" 
import { GuidingPrinciples } from "@/components/guiding-principles"
import { Craftsmanship } from "@/components/craftsmanship"

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <AboutHero />
        <AboutHeritage />
        <GuidingPrinciples />
        <Craftsmanship />
      </main>
      <Footer />
    </div>
  )
}