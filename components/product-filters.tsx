"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ProductFilters() {
  const [selectedCategory, setSelectedCategory] = useState("All Categories")
  const [selectedCollection, setSelectedCollection] = useState("All Collections")
  const [selectedSort, setSelectedSort] = useState("New Arrivals")

  const categories = ["All Categories", "Dresses", "Blazers", "Accessories", "Bags", "Jewelry"]
  const collections = ["All Collections", "Midnight", "Classic Aura", "Elegance", "Executive"]
  const sortOptions = ["New Arrivals", "Price: Low to High", "Price: High to Low", "Most Popular"]

  return (
    <div className="mb-8 border-b border-border/40 pb-6">
      <div className="flex flex-col md:flex-row gap-4 md:gap-8 items-start md:items-center justify-between">
        {/* Filter Dropdowns */}
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          {/* Categories */}
          <div className="relative group">
            <Button
              variant="outline"
              className="w-full sm:w-auto justify-between min-w-[160px] bg-background hover:bg-secondary/50 transition-all duration-300"
            >
              {selectedCategory}
              <ChevronDown className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:rotate-180" />
            </Button>
            <div className="absolute top-full left-0 mt-2 w-full sm:w-48 bg-background border border-border/40 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-10">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className="block w-full text-left px-4 py-2 hover:bg-secondary/50 transition-colors duration-200 first:rounded-t-lg last:rounded-b-lg"
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Collections */}
          <div className="relative group">
            <Button
              variant="outline"
              className="w-full sm:w-auto justify-between min-w-[160px] bg-background hover:bg-secondary/50 transition-all duration-300"
            >
              {selectedCollection}
              <ChevronDown className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:rotate-180" />
            </Button>
            <div className="absolute top-full left-0 mt-2 w-full sm:w-48 bg-background border border-border/40 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-10">
              {collections.map((collection) => (
                <button
                  key={collection}
                  onClick={() => setSelectedCollection(collection)}
                  className="block w-full text-left px-4 py-2 hover:bg-secondary/50 transition-colors duration-200 first:rounded-t-lg last:rounded-b-lg"
                >
                  {collection}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Sort */}
        <div className="relative group w-full md:w-auto">
          <Button
            variant="outline"
            className="w-full md:w-auto justify-between min-w-[160px] bg-background hover:bg-secondary/50 transition-all duration-300"
          >
            {selectedSort}
            <ChevronDown className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:rotate-180" />
          </Button>
          <div className="absolute top-full right-0 mt-2 w-full md:w-48 bg-background border border-border/40 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-10">
            {sortOptions.map((option) => (
              <button
                key={option}
                onClick={() => setSelectedSort(option)}
                className="block w-full text-left px-4 py-2 hover:bg-secondary/50 transition-colors duration-200 first:rounded-t-lg last:rounded-b-lg"
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}