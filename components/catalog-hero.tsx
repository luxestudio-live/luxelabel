"use client"

export function CatalogHero() {
  return (
    <section className="relative py-16 md:py-20 bg-gradient-to-b from-background to-secondary/30">
      <div className="container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-light tracking-tight mb-6 leading-tight">
            Our Exquisite Collection
          </h1>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Discover timeless pieces crafted with passion and precision, designed to elevate your personal style.
          </p>
        </div>
      </div>
    </section>
  )
}