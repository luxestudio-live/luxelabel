import { Header } from "@/components/header"
import { CatalogHero } from "@/components/catalog-hero"
import { ProductFilters } from "@/components/product-filters"
import { ProductGridFirestore } from "@/components/ProductGridFirestore"
import { Footer } from "@/components/footer"

export default function CatalogPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <CatalogHero />
      <div className="container mx-auto px-4 py-8">
        <ProductFilters />
        <ProductGridFirestore />
      </div>
      <Footer />
    </div>
  )
}