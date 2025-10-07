"use client"

import Link from "next/link"
import { Search, User, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/60 transition-all duration-300">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <div className="h-5 w-1 bg-foreground transition-all duration-300 hover:h-6" />
            <div className="h-5 w-1 bg-foreground transition-all duration-300 hover:h-6" />
          </div>
          <span className="text-lg font-semibold tracking-tight">Luxxelabels</span>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="/"
            className="text-sm font-medium hover:text-muted-foreground transition-all duration-300 hover:scale-105"
          >
            Homepage
          </Link>
          <Link
            href="#"
            className="text-sm font-medium hover:text-muted-foreground transition-all duration-300 hover:scale-105"
          >
            Catalog
          </Link>
          <Link
            href="/about"
            className="text-sm font-medium hover:text-muted-foreground transition-all duration-300 hover:scale-105"
          >
            About Us
          </Link>
          <Link
            href="#"
            className="text-sm font-medium hover:text-muted-foreground transition-all duration-300 hover:scale-105"
          >
            Contact Us
          </Link>
        </nav>

        {/* Search and Actions */}
        <div className="flex items-center gap-4">
          <div className="hidden lg:flex items-center gap-2 max-w-xs">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors duration-300" />
              <Input
                type="search"
                placeholder="Search products..."
                className="pl-9 bg-secondary/50 border-border/50 transition-all duration-300 focus:scale-105"
              />
            </div>
          </div>
          <Button variant="ghost" size="icon" className="hidden md:flex transition-all duration-300 hover:scale-110">
            <User className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="relative transition-all duration-300 hover:scale-110">
            <ShoppingCart className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  )
}
