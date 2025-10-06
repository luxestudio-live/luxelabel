import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { HeritageSection } from "@/components/heritage-section"
import { CollectionsSection } from "@/components/collections-section"
import { WinterCampaign } from "@/components/winter-campaign"
import { TopPicks } from "@/components/top-picks"
import { Newsletter } from "@/components/newsletter"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <HeroSection />
      <HeritageSection />
      <CollectionsSection />
      <WinterCampaign />
      <TopPicks />
      <Newsletter />
      <Footer />
    </main>
  )
}
