"use client";
import { Header } from "@/components/header"
import { CatalogHero } from "@/components/catalog-hero"
import { useEffect, useState } from "react"
import { ProductFilters } from "@/components/product-filters"
import { ProductGridFirestore } from "@/components/ProductGridFirestore"
import { Footer } from "@/components/footer"
import { usePathname, useRouter } from "next/navigation"

function CatalogPage() {
  const router = useRouter();
  const pathname = usePathname();

  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedSort, setSelectedSort] = useState("New Arrivals");
  const [currentPage, setCurrentPage] = useState(1);
  const [queryReady, setQueryReady] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const categoryFromQuery = params.get("category") || "All Categories";
    const pageFromQuery = Number(params.get("page") || "1");
    const normalizedPage = Number.isFinite(pageFromQuery) && pageFromQuery > 0 ? pageFromQuery : 1;

    setSelectedCategory(categoryFromQuery);
    setCurrentPage(normalizedPage);
    setQueryReady(true);
  }, []);

  useEffect(() => {
    if (!queryReady || typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);

    if (selectedCategory && selectedCategory !== "All Categories") {
      params.set("category", selectedCategory);
    } else {
      params.delete("category");
    }

    if (currentPage > 1) {
      params.set("page", String(currentPage));
    } else {
      params.delete("page");
    }

    const nextQuery = params.toString();
    const currentQuery = window.location.search.replace(/^\?/, "");
    if (nextQuery !== currentQuery) {
      router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname, { scroll: false });
    }
  }, [selectedCategory, currentPage, pathname, queryReady, router]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handleSortChange = (sort: string) => {
    setSelectedSort(sort);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <CatalogHero />
      <div className="container mx-auto px-4 py-8">
        <ProductFilters
          selectedCategory={selectedCategory}
          setSelectedCategory={handleCategoryChange}
          selectedSort={selectedSort}
          setSelectedSort={handleSortChange}
        />
        <ProductGridFirestore
          selectedCategory={selectedCategory}
          selectedSort={selectedSort}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      </div>
      <Footer />
    </div>
  );
}

export default CatalogPage;