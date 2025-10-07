"use client"

import { Button } from "@/components/ui/button"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import { getImageUrl } from "@/lib/utils"

export function AboutHeritage() {
  const { ref, isVisible } = useScrollAnimation()

  return (
    <section ref={ref} className="py-20 md:py-32">
      <div className="container px-4">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
          {/* Content */}
          <div
            className={`space-y-8 transition-all duration-700 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"}`}
          >
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-serif font-light tracking-tight text-balance">
                Our Heritage: A Symphony of Style and Substance
              </h2>
              <p className="text-muted-foreground leading-relaxed text-balance">
                Born from a passion for exquisite design and enduring quality, Aura Moda began its journey in the heart of
                fashion's most inspiring cities. Our founders envisioned a brand that would not only dress individuals but also tell a
                story of unparalleled artistry and dedication.
              </p>
              <p className="text-muted-foreground leading-relaxed text-balance">
                From humble beginnings, we've grown into a symbol of refined luxury, cherished by those who appreciate the finer
                details.
              </p>
            </div>
            <Button
              variant="outline"
              className="rounded-full px-8 bg-transparent transition-all duration-300 hover:scale-105 hover:bg-foreground hover:text-background"
            >
              Explore Collections
            </Button>
          </div>

          {/* Image */}
          <div
            className={`relative aspect-[4/3] overflow-hidden rounded-lg transition-all duration-700 delay-200 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"}`}
          >
            <img
              src={getImageUrl("/hands-crafting-luxury-leather-handbag-artisan-work.jpg")}
              alt="Artisan crafting luxury handbag"
              className="h-full w-full object-cover hover:scale-105 transition-transform duration-700"
            />
          </div>
        </div>
      </div>
    </section>
  )
}