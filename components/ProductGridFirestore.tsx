"use client";
import { useEffect, useState } from "react";
import { ProductCard } from "@/components/product-card";
import { db } from "@/lib/firebaseClient";
import { collection, getDocs } from "firebase/firestore";

export function ProductGridFirestore({
  selectedCategory,
  selectedSort
}: {
  selectedCategory: string,
  selectedSort: string
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

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
      {filtered.map((product, index) => (
        <div
          key={product.id || index}
          className="opacity-0 animate-fade-in-up"
          style={{
            animationDelay: `${index * 100}ms`,
            animationFillMode: 'forwards'
          }}
        >
          <ProductCard product={{
            id: product.id,
            name: product.name,
            price: Number(product.salePrice || product.regularPrice || 0),
            image:
              (product.mainImage && product.mainImage.trim())
                ? product.mainImage
                : (Array.isArray(product.gallery) && product.gallery.length > 0 && product.gallery[0])
                  ? product.gallery[0]
                  : product.image || "",
            category: product.category,
            shortDesc: product.shortDesc || "",
          }} />
        </div>
      ))}
    </div>
  );
}
