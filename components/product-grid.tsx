"use client"

import { ProductCard } from "@/components/product-card"
import { products } from "@/lib/products"

export function ProductGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
      {products.map((product, index) => (
        <div
          key={product.id}
          className="opacity-0 animate-fade-in-up"
          style={{
            animationDelay: `${index * 100}ms`,
            animationFillMode: 'forwards'
          }}
        >
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  )
}