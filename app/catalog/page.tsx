"use client";
import { Header } from "@/components/header"
import { CatalogHero } from "@/components/catalog-hero"
import { useState } from "react"
import { ProductFilters } from "@/components/product-filters"
import { ProductGridFirestore } from "@/components/ProductGridFirestore"
import { Footer } from "@/components/footer"

function CatalogPage() {
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedSort, setSelectedSort] = useState("New Arrivals");

  // Read category from query string
  if (typeof window !== "undefined") {
    const params = new URLSearchParams(window.location.search);
    const categoryParam = params.get("category");
    if (categoryParam && categoryParam !== selectedCategory) {
      setSelectedCategory(categoryParam);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <CatalogHero />
      <div className="container mx-auto px-4 py-8">
        <ProductFilters
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedSort={selectedSort}
          setSelectedSort={setSelectedSort}
        />
        <ProductGridFirestore
          selectedCategory={selectedCategory}
          selectedSort={selectedSort}
        />
      </div>
      <Footer />
    </div>
  );
}

export default CatalogPage;