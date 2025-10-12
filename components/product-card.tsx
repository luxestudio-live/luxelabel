"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { getImageUrl } from "@/lib/utils"

interface Product {
  id: number
  name: string
  price: number
  image: string
  category: string
  collection: string
}

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="group cursor-pointer">
      <Link href="/demo-product">
        <div className="relative overflow-hidden rounded-lg bg-secondary/10 aspect-[3/4] mb-4">
          <Image
            src={getImageUrl(product.image)}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
          
          {/* Quick View Button */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button
              variant="secondary"
              className="bg-background/90 backdrop-blur-sm hover:bg-background transition-all duration-300 transform translate-y-4 group-hover:translate-y-0"
            >
              View Details
            </Button>
          </div>
        </div>
      </Link>
      
      <div className="space-y-2">
        <Link href="/demo-product">
          <h3 className="font-medium text-lg hover:text-muted-foreground transition-colors duration-300 line-clamp-2">
            {product.name}
          </h3>
        </Link>
        <p className="text-sm text-muted-foreground">{product.collection}</p>
        <p className="text-lg font-semibold">Rs. {product.price.toFixed(2)}</p>
        
        <div className="pt-2">
          <Button 
            variant="outline" 
            size="sm"
            className="w-full hover:bg-foreground hover:text-background transition-all duration-300"
          >
            View Details
          </Button>
        </div>
      </div>
    </div>
  )
}