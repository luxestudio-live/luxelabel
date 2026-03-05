"use client"

import { useState, useEffect } from "react"
import { db } from "@/lib/firebaseClient"
import { collection, getDocs } from "firebase/firestore"
import { ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ProductFilters({
  selectedCategory,
  setSelectedCategory,
  selectedSort,
  setSelectedSort
}: {
  selectedCategory: string,
  setSelectedCategory: (cat: string) => void,
  selectedSort: string,
  setSelectedSort: (sort: string) => void
}) {
  const [categories, setCategories] = useState<string[]>(["All Categories"]);
  const sortOptions = ["New Arrivals", "Price: Low to High", "Price: High to Low"];
  const [catOpen, setCatOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);

  useEffect(() => {
    async function fetchCategories() {
      const catSnap = await getDocs(collection(db, "categories"));
      const cats = catSnap.docs.map(doc => doc.data().name).filter(Boolean);
      setCategories(["All Categories", ...cats]);
    }
    fetchCategories();
  }, []);

  // Close dropdowns on outside click (mobile)
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      setCatOpen(false);
      setSortOpen(false);
    }
    if (catOpen || sortOpen) {
      document.addEventListener("click", handleClick);
      return () => document.removeEventListener("click", handleClick);
    }
  }, [catOpen, sortOpen]);

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
              onClick={e => { e.stopPropagation(); setCatOpen(v => !v); }}
            >
              {selectedCategory}
              <ChevronDown className={`ml-2 h-4 w-4 transition-transform duration-300 ${catOpen ? 'rotate-180' : ''}`} />
            </Button>
            <div className={`absolute top-full left-0 mt-2 w-full sm:w-48 bg-background border border-border/40 rounded-lg shadow-lg z-10 transition-all duration-300 ${catOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`} onClick={e => e.stopPropagation()}>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => { setSelectedCategory(category); setCatOpen(false); }}
                  className={`block w-full text-left px-4 py-2 hover:bg-secondary/50 transition-colors duration-200 first:rounded-t-lg last:rounded-b-lg ${selectedCategory === category ? 'bg-secondary/30 font-bold' : ''}`}
                >
                  {category}
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
              onClick={e => { e.stopPropagation(); setSortOpen(v => !v); }}
            >
            {selectedSort}
            <ChevronDown className={`ml-2 h-4 w-4 transition-transform duration-300 ${sortOpen ? 'rotate-180' : ''}`} />
          </Button>
          <div className={`absolute top-full right-0 mt-2 w-full md:w-48 bg-background border border-border/40 rounded-lg shadow-lg z-10 transition-all duration-300 ${sortOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`} onClick={e => e.stopPropagation()}>
            {sortOptions.map((option) => (
              <button
                key={option}
                onClick={() => { setSelectedSort(option); setSortOpen(false); }}
                className={`block w-full text-left px-4 py-2 hover:bg-secondary/50 transition-colors duration-200 first:rounded-t-lg last:rounded-b-lg ${selectedSort === option ? 'bg-secondary/30 font-bold' : ''}`}
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