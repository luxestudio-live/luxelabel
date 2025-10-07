"use client"

import { getImageUrl } from "@/lib/utils"

export function AboutHero() {
  return (
    <section className="relative h-[500px] md:h-[600px] overflow-hidden bg-gradient-to-br from-[oklch(0.98_0.02_85)] via-[oklch(0.96_0.03_75)] to-[oklch(0.99_0.01_90)]">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={getImageUrl("/elegant-woman-in-white-dress-luxury-fashion.jpg")}
          alt="Elegant woman in luxury fashion"
          className="h-full w-full object-cover object-center md:object-center animate-fade-in"
          style={{
            objectPosition: 'center 20%'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-[oklch(0.98_0.02_80)]/40 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative container h-full flex flex-col items-center justify-center text-center px-4 md:px-8">
        <h1 className="text-3xl sm:text-4xl md:text-6xl font-serif font-light tracking-tight text-balance mb-4 md:mb-6 opacity-0 animate-fade-in-up leading-tight">
          Crafting Tomorrow's Legacy, Today
        </h1>
        <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-lg md:max-w-2xl mb-6 md:mb-8 text-balance opacity-0 animate-fade-in-up animation-delay-200 leading-relaxed">
          Discover the timeless elegance and unwavering commitment to quality that defines Luxxelabels.
          We believe in fashion that transcends fleeting trends, designed with passion and
          precision.
        </p>
      </div>
    </section>
  )
}