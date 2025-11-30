"use client";
import { useEffect, useState } from "react";
import { ProductCard } from "@/components/product-card";
import { db } from "@/lib/firebaseClient";
import { collection, getDocs } from "firebase/firestore";

export function ProductGridFirestore() {
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

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
      {products.map((product, index) => (
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
            image: product.mainImage || product.image,
            category: product.category,
            shortDesc: product.shortDesc || "",
          }} />
        </div>
      ))}
    </div>
  );
}
