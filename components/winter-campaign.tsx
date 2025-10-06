"use client"

import { Button } from "@/components/ui/button"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import { getImageUrl } from "@/lib/utils"

export function WinterCampaign() {
  const { ref, isVisible } = useScrollAnimation()

  return (
    <section ref={ref} className="py-20 md:py-32">
      <div className="container px-4">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
          {/* Content */}
          <div
            className={`space-y-6 transition-all duration-700 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"}`}
          >
            <h2 className="text-4xl md:text-5xl font-serif font-light tracking-tight text-balance">
              The Essence of Luxe: A Winter's Tale
            </h2>
            <p className="text-muted-foreground leading-relaxed text-balance">
              Inspired by the serene beauty of frosted landscapes, our latest collection blends natural textures with
              sophisticated silhouettes. Each piece captures the crisp elegance of tailored wool, designed for the
              modern connoisseur.
            </p>
            <Button
              variant="outline"
              className="rounded-full px-6 bg-transparent transition-all duration-300 hover:scale-105 hover:bg-foreground hover:text-background"
            >
              Explore The Campaign
            </Button>
          </div>

          {/* Image */}
          <div
            className={`relative aspect-[3/4] overflow-hidden rounded-lg transition-all duration-700 delay-200 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"}`}
          >
            <img
              src={getImageUrl("/woman-in-brown-winter-coat-snowy-landscape-luxury-.jpg")}
              alt="Winter Collection"
              className="h-full w-full object-cover hover:scale-105 transition-transform duration-700"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
