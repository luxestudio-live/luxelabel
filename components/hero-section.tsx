"use client"

import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="relative h-[600px] md:h-[700px] overflow-hidden bg-gradient-to-br from-[oklch(0.98_0.02_85)] via-[oklch(0.96_0.03_75)] to-[oklch(0.99_0.01_90)]">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="/elegant-woman-in-flowing-beige-dress-minimal-backg.jpg"
          alt="Elegant fashion"
          className="h-full w-full object-cover animate-fade-in"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-[oklch(0.98_0.02_80)]/40 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative container h-full flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-5xl md:text-7xl font-serif font-light tracking-tight text-balance mb-6 opacity-0 animate-fade-in-up">
          The New Era of
          <br />
          Luxe Elegance
        </h1>
        <p className="text-base md:text-lg text-muted-foreground max-w-2xl mb-8 text-balance opacity-0 animate-fade-in-up animation-delay-200">
          Discover where timeless sophistication meets modern craftsmanship in our handpicked luxury exclusive
          collection.
        </p>
        <Button
          size="lg"
          className="rounded-full px-8 bg-gradient-to-r from-foreground to-[oklch(0.25_0_0)] text-background hover:from-[oklch(0.25_0_0)] hover:to-foreground transition-all duration-500 hover:scale-105 hover:shadow-xl opacity-0 animate-fade-in-up animation-delay-400"
        >
          Shop Latest Collection
        </Button>
      </div>
    </section>
  )
}
