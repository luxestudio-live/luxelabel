"use client";
import { useEffect, useState } from "react";
import { ProductCard } from "@/components/product-card";
import { db } from "@/lib/firebaseClient";
import { collection, getDocs } from "firebase/firestore";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const PRODUCTS_PER_PAGE = 20;

function getPaginationPages(currentPage: number, totalPages: number): number[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages = new Set<number>([1, totalPages, currentPage - 1, currentPage, currentPage + 1]);
  return Array.from(pages)
    .filter((page) => page >= 1 && page <= totalPages)
    .sort((a, b) => a - b);
}

export function ProductGridFirestore({
  selectedCategory,
  selectedSort,
  currentPage,
  onPageChange,
}: {
  selectedCategory: string;
  selectedSort: string;
  currentPage: number;
  onPageChange: (page: number) => void;
}) {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const snap = await getDocs(collection(db, "products"));
        setProducts(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch {
        setProducts([]);
      }
    }
    fetchProducts();
  }, []);

  // Filter by category
  let filtered = products;
  if (selectedCategory && selectedCategory !== "All Categories") {
    filtered = filtered.filter(p => (p.category || "").trim().toLowerCase() === selectedCategory.trim().toLowerCase());
  }

  // Sort
  if (selectedSort === "Price: Low to High") {
    filtered = [...filtered].sort((a, b) => Number(a.salePrice || a.regularPrice || 0) - Number(b.salePrice || b.regularPrice || 0));
  } else if (selectedSort === "Price: High to Low") {
    filtered = [...filtered].sort((a, b) => Number(b.salePrice || b.regularPrice || 0) - Number(a.salePrice || a.regularPrice || 0));
  } else if (selectedSort === "New Arrivals") {
    filtered = [...filtered].sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
  }

  const totalProducts = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalProducts / PRODUCTS_PER_PAGE));
  const safeCurrentPage = Math.min(Math.max(currentPage, 1), totalPages);
  const pageStart = (safeCurrentPage - 1) * PRODUCTS_PER_PAGE;
  const paginatedProducts = filtered.slice(pageStart, pageStart + PRODUCTS_PER_PAGE);
  const pageLinks = getPaginationPages(safeCurrentPage, totalPages);

  useEffect(() => {
    if (safeCurrentPage !== currentPage) {
      onPageChange(safeCurrentPage);
    }
  }, [currentPage, onPageChange, safeCurrentPage]);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages || page === safeCurrentPage) return;
    onPageChange(page);
  };

  const startItem = totalProducts === 0 ? 0 : pageStart + 1;
  const endItem = totalProducts === 0 ? 0 : Math.min(pageStart + PRODUCTS_PER_PAGE, totalProducts);

  return (
    <div>
      {totalProducts === 0 && (
        <div className="rounded-xl border border-border/50 bg-card p-8 text-center text-muted-foreground">
          No products found for the selected filters.
        </div>
      )}

      {totalProducts > 0 && (
        <>
          <div className="mb-4 text-sm text-muted-foreground">
            Showing {startItem}-{endItem} of {totalProducts} products
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {paginatedProducts.map((product, index) => (
              <div
                key={product.id || index}
                className="opacity-0 animate-fade-in-up"
                style={{
                  animationDelay: `${index * 75}ms`,
                  animationFillMode: "forwards",
                }}
              >
                <ProductCard
                  product={{
                    id: product.id,
                    name: product.name,
                    price: Number(product.salePrice || product.regularPrice || 0),
                    image:
                      product.mainImage && product.mainImage.trim()
                        ? product.mainImage
                        : Array.isArray(product.gallery) && product.gallery.length > 0 && product.gallery[0]
                        ? product.gallery[0]
                        : product.image || "",
                    category: product.category,
                    shortDesc: product.shortDesc || "",
                  }}
                />
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <Pagination className="mt-10">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageChange(safeCurrentPage - 1);
                    }}
                    aria-disabled={safeCurrentPage === 1}
                    className={safeCurrentPage === 1 ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>

                {pageLinks.map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      href="#"
                      isActive={safeCurrentPage === page}
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(page);
                      }}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}

                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageChange(safeCurrentPage + 1);
                    }}
                    aria-disabled={safeCurrentPage === totalPages}
                    className={safeCurrentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </>
      )}
    </div>
  );
}
