"use client"

import { useScrollAnimation } from "@/hooks/use-scroll-animation"

export function CollectionsSection() {
  const { ref, isVisible } = useScrollAnimation()

  const collections = [
    {
      title: "Women's Collection",
      image: "/elegant-woman-in-white-dress-luxury-fashion.jpg",
    },
    {
      title: "Men's Essentials",
      image: "/man-in-tailored-grey-suit-luxury-menswear.jpg",
    },
    {
      title: "New Arrivals",
      image: "/luxury-fashion-accessories-hand-jewelry.jpg",
    },
  ]

  return (
    <section ref={ref} className="py-20 bg-secondary/30">
      <div className="container px-4">
        <h2
          className={`text-4xl md:text-5xl font-serif font-light text-center mb-12 tracking-tight transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          Explore Our Collections
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {collections.map((collection, index) => (
            <div
              key={collection.title}
              className={`group relative aspect-[3/4] overflow-hidden rounded-lg cursor-pointer transition-all duration-700 hover:shadow-2xl ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <img
                src={collection.image || "/placeholder.svg"}
                alt={collection.title}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent transition-opacity duration-300 group-hover:from-black/70" />
              <div className="absolute bottom-0 left-0 right-0 p-6 transition-transform duration-300 group-hover:translate-y-[-8px]">
                <h3 className="text-2xl font-serif text-white text-balance">{collection.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
