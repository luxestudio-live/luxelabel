"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { getImageUrl } from "@/lib/utils"

export function HeroSection() {
  return (
    <section className="relative h-[600px] md:h-[700px] overflow-hidden bg-gradient-to-br from-[oklch(0.98_0.02_85)] via-[oklch(0.96_0.03_75)] to-[oklch(0.99_0.01_90)]">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={getImageUrl("/elegant-woman-in-flowing-beige-dress-minimal-backg.jpg")}
          alt="Elegant fashion"
          className="h-full w-full object-cover object-center md:object-center animate-fade-in"
          style={{
            objectPosition: 'center 30%'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-[oklch(0.98_0.02_80)]/40 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative container h-full flex flex-col items-center justify-center text-center px-4 md:px-8">
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-serif font-light tracking-tight text-balance mb-4 md:mb-6 opacity-0 animate-fade-in-up leading-tight">
          <span className="block sm:inline">The New Era of</span>
          <br className="hidden sm:block" />
          <span className="block sm:inline">Luxe Elegance</span>
        </h1>
        <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-lg md:max-w-2xl mb-6 md:mb-8 text-balance opacity-0 animate-fade-in-up animation-delay-200 leading-relaxed">
          Discover where timeless sophistication meets modern craftsmanship in our handpicked luxury exclusive
          collection.
        </p>
        <Link href="/catalog">
          <Button
            size="lg"
            className="rounded-full px-6 md:px-8 bg-gradient-to-r from-foreground to-[oklch(0.25_0_0)] text-background hover:from-[oklch(0.25_0_0)] hover:to-foreground transition-all duration-500 hover:scale-105 hover:shadow-xl opacity-0 animate-fade-in-up animation-delay-400"
          >
            Shop Latest Collection
          </Button>
        </Link>
      </div>
    </section>
  )
}
