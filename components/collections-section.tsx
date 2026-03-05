"use client"


import Link from "next/link"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import { getImageUrl } from "@/lib/utils"
import { useEffect, useState } from "react"
import { db } from "@/lib/firebaseClient"
import { collection, getDocs } from "firebase/firestore"


export function CollectionsSection() {
  const { ref, isVisible } = useScrollAnimation();
  const [categories, setCategories] = useState<Array<{ name: string; image: string }>>([]);

  // Default image mapping for categories
  const categoryImages: Record<string, string> = {
    Shoes: "/shoes.png",
    Clothes: "/clothes.png",
    "Clothes ": "/clothes.png",
    clothes: "/clothes.png",
    Accessories: "/accessories.png",
    Bags: "/luxury-brown-leather-handbag-designer-bag.jpg",
  };

  useEffect(() => {
    async function fetchCategories() {
      const catSnap = await getDocs(collection(db, "categories"));
      const cats = catSnap.docs.map(doc => {
        const name = doc.data().name;
        // Always use curated image for each category
        const image = name && categoryImages[name] ? categoryImages[name] : "/placeholder.svg";
        return {
          name,
          image
        };
      }).filter(cat => cat.name);
      setCategories(cats);
    }
    fetchCategories();
  }, []);

  return (
    <section ref={ref} className="py-20 bg-gradient-to-br from-secondary/40 to-background">
      <div className="container px-4">
        <h2
          className={`text-4xl md:text-5xl font-serif font-light text-center mb-12 tracking-tight transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          Categories
        </h2>
        <div className="grid md:grid-cols-4 gap-8">
          {categories.map((cat, index) => (
            <Link
              key={cat.name}
              href={`/catalog?category=${encodeURIComponent(cat.name)}`}
              className={`group relative aspect-[3/4] overflow-hidden rounded-2xl shadow-lg cursor-pointer transition-all duration-700 hover:scale-105 hover:shadow-2xl ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
              style={{ transitionDelay: `${index * 120}ms` }}
            >
              <img
                src={cat.image || "/placeholder.svg"}
                alt={cat.name}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent transition-opacity duration-300 group-hover:from-black/80" />
              <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col items-center transition-transform duration-300 group-hover:translate-y-[-8px]">
                <h3 className="text-2xl md:text-3xl font-serif text-white font-semibold drop-shadow-lg mb-2 text-center">{cat.name}</h3>
                <span className="inline-block px-4 py-1 rounded-full bg-white/80 text-black text-xs font-bold tracking-widest uppercase shadow-md">Shop Now</span>
              </div>
              <div className="absolute top-4 right-4 bg-white/80 rounded-full px-3 py-1 text-xs font-bold text-black shadow">Premium</div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
