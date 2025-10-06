"use client"

import { Button } from "@/components/ui/button"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import { getImageUrl } from "@/lib/utils"

export function HeritageSection() {
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
              src={getImageUrl("/hands-crafting-luxury-leather-handbag-artisan-work.jpg")}
              alt="Craftsmanship"
              className="h-full w-full object-cover hover:scale-105 transition-transform duration-700"
            />
          </div>

          {/* Content */}
          <div
            className={`space-y-6 transition-all duration-700 delay-200 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"}`}
          >
            <h2 className="text-4xl md:text-5xl font-serif font-light tracking-tight text-balance">
              Crafted with Heritage, Designed for Tomorrow
            </h2>
            <p className="text-muted-foreground leading-relaxed text-balance">
              LuxeLabel marries timeless artistry with modern innovation, creating pieces that transcend seasons. Our
              commitment to sustainability and ethical craftsmanship ensures that every item is both luxurious and
              conscious.
            </p>
            <Button
              variant="outline"
              className="rounded-full px-6 bg-transparent transition-all duration-300 hover:scale-105 hover:bg-foreground hover:text-background"
            >
              Discover Our Story
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
