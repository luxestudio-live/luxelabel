"use client"


import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import { getImageUrl } from "@/lib/utils"
import { useEffect, useState } from "react"
import { db } from "@/lib/firebaseClient"
import { collection, getDocs } from "firebase/firestore"



export function TopPicks() {
  const { ref, isVisible } = useScrollAnimation();
  const [products, setProducts] = useState<Array<{ id: string; name: string; price: number; image: string; category: string }>>([]);

  useEffect(() => {
    async function fetchTopPicks() {
      const catSnap = await getDocs(collection(db, "categories"));
      const cats = catSnap.docs.map(doc => doc.data().name).filter(Boolean);
      const prodSnap = await getDocs(collection(db, "products"));
      const allProducts = prodSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      // Pick 3 products, each from a different category
      const selected: Array<{ id: string; name: string; price: number; image: string; category: string }> = [];
      const usedCategories: Set<string> = new Set();
      // Shuffle products
      for (let i = allProducts.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [allProducts[i], allProducts[j]] = [allProducts[j], allProducts[i]];
      }
      for (const p of allProducts) {
        const cat = (p.category || "").trim();
        if (cat && !usedCategories.has(cat)) {
          selected.push({
            id: p.id,
            name: p.name,
            price: Number(p.salePrice || p.regularPrice || 0),
            image: p.mainImage || (Array.isArray(p.gallery) && p.gallery.length > 0 && p.gallery[0]) || p.image || "/placeholder.svg",
            category: cat
          });
          usedCategories.add(cat);
        }
        if (selected.length === 3) break;
      }
      setProducts(selected);
    }
    fetchTopPicks();
  }, []);

  return (
    <section ref={ref} className="py-20 bg-gradient-to-br from-secondary/40 to-background">
      <div className="container px-4">
        <h2
          className={`text-4xl md:text-5xl font-serif font-light text-center mb-12 tracking-tight transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          Our Top Picks
        </h2>
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {products.map((product, index) => (
            <div
              key={product.id}
              className={`group transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
              style={{ transitionDelay: `${index * 120}ms` }}
            >
              <Link href={`/product/${product.id}`}>
                <div className="relative aspect-[3/4] overflow-hidden rounded-2xl mb-4 cursor-pointer shadow-lg">
                  <img
                    src={getImageUrl(product.image)}
                    alt={product.name}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
              </Link>
              <div className="text-center space-y-3">
                <h4 className="text-xl font-serif font-semibold">{product.name}</h4>
                <p className="text-lg font-medium">Rs. {product.price.toFixed(2)}</p>
                <Link href={`/product/${product.id}`}>
                  <Button className="w-full rounded-full bg-foreground text-background hover:bg-foreground/90 transition-all duration-300 hover:scale-105">
                    View Product
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center">
          <Link href="/catalog">
            <Button 
              variant="outline" 
              size="lg"
              className="rounded-full px-8 border-2 hover:bg-foreground hover:text-background transition-all duration-300 hover:scale-105"
            >
              View All Products
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
