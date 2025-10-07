"use client"

import { Button } from "@/components/ui/button"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import { getImageUrl } from "@/lib/utils"

export function Craftsmanship() {
  const { ref, isVisible } = useScrollAnimation()

  return (
    <section ref={ref} className="py-20 md:py-32">
      <div className="container px-4">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
          {/* Image */}
          <div
            className={`relative aspect-[4/3] overflow-hidden rounded-lg transition-all duration-700 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"}`}
          >
            <img
              src={getImageUrl("/luxury-fashion-accessories-hand-jewelry.jpg")}
              alt="Luxury fashion craftsmanship"
              className="h-full w-full object-cover hover:scale-105 transition-transform duration-700"
            />
          </div>

          {/* Content */}
          <div
            className={`space-y-8 transition-all duration-700 delay-200 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"}`}
          >
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-serif font-light tracking-tight text-balance">
                The Art of Craftsmanship: Where Tradition Meets Innovation
              </h2>
              <p className="text-muted-foreground leading-relaxed text-balance">
                At Aura Moda, craftsmanship is not just a process; it's a living tradition passed down through generations. Our
                ateliers are sanctuaries where skilled artisans transform the finest materials into wearable art.
              </p>
              <p className="text-muted-foreground leading-relaxed text-balance">
                We blend time-honored techniques with innovative approaches, ensuring that each garment is a masterpiece of precision,
                comfort, and enduring beauty. Every seam, every embellishment, every silhouette is a testament to our
                relentless pursuit of perfection.
              </p>
            </div>
            <Button
              variant="outline"
              className="rounded-full px-8 bg-transparent transition-all duration-300 hover:scale-105 hover:bg-foreground hover:text-background"
            >
              Explore Collections
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}