"use client"

import { Button } from "@/components/ui/button"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import { getImageUrl } from "@/lib/utils"

export function TopPicks() {
  const { ref, isVisible } = useScrollAnimation()

  const products = [
    {
      name: "The Lumina Dress",
      price: "Rs. 1,299",
      image: getImageUrl("/elegant-burgundy-evening-dress-luxury-fashion.jpg"),
    },
    {
      name: "Elegance Handbag",
      price: "Rs. 899",
      image: getImageUrl("/luxury-brown-leather-handbag-designer-bag.jpg"),
    },
    {
      name: "Timeless Scarf",
      price: "Rs. 349",
      image: getImageUrl("/cream-beige-cashmere-scarf-luxury-accessory.jpg"),
    },
  ]

  return (
    <section ref={ref} className="py-20 bg-secondary/30">
      <div className="container px-4">
        <h2
          className={`text-4xl md:text-5xl font-serif font-light text-center mb-12 tracking-tight transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          Our Top Picks
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <div
              key={product.name}
              className={`group transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <div className="relative aspect-[3/4] overflow-hidden rounded-lg mb-4">
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              <div className="text-center space-y-3">
                <h3 className="text-xl font-serif">{product.name}</h3>
                <p className="text-lg font-medium">{product.price}</p>
                <Button className="w-full rounded-full bg-foreground text-background hover:bg-foreground/90 transition-all duration-300 hover:scale-105">
                  View Product
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
