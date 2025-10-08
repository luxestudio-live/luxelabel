"use client"

import { useState } from "react"
import Link from "next/link"
import { Search, User, ShoppingCart, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Logo } from "@/components/logo"

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/60 transition-all duration-300">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <Logo variant="header" />

        {/* Desktop Navigation */}
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
            href="/contact"
            className="text-sm font-medium hover:text-muted-foreground transition-all duration-300 hover:scale-105"
          >
            Contact Us
          </Link>
        </nav>

        {/* Desktop Search and Actions */}
        <div className="hidden md:flex items-center gap-4">
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
          <Button variant="ghost" size="icon" className="transition-all duration-300 hover:scale-110">
            <User className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="relative transition-all duration-300 hover:scale-110">
            <ShoppingCart className="h-5 w-5" />
          </Button>
        </div>

        {/* Mobile Actions */}
        <div className="flex md:hidden items-center gap-2">
          <Button variant="ghost" size="icon" className="relative transition-all duration-300 hover:scale-110">
            <ShoppingCart className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMobileMenu}
            className="transition-all duration-300 hover:scale-110"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <div 
        className={`md:hidden border-t border-border/40 bg-background/95 backdrop-blur-md overflow-hidden transition-all duration-300 ease-in-out ${
          isMobileMenuOpen 
            ? 'max-h-96 opacity-100' 
            : 'max-h-0 opacity-0'
        }`}
      >
        <nav className="container px-4">
          <div className={`flex flex-col space-y-4 transition-all duration-300 ease-in-out ${
            isMobileMenuOpen 
              ? 'py-4 translate-y-0' 
              : 'py-0 -translate-y-4'
          }`}>
            <Link
              href="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-sm font-medium hover:text-muted-foreground transition-colors duration-300 py-2"
            >
              Homepage
            </Link>
            <Link
              href="#"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-sm font-medium hover:text-muted-foreground transition-colors duration-300 py-2"
            >
              Catalog
            </Link>
            <Link
              href="/about"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-sm font-medium hover:text-muted-foreground transition-colors duration-300 py-2"
            >
              About Us
            </Link>
            <Link
              href="/contact"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-sm font-medium hover:text-muted-foreground transition-colors duration-300 py-2"
            >
              Contact Us
            </Link>
            <div className="pt-4 border-t border-border/40">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search products..."
                  className="pl-9 bg-secondary/50 border-border/50"
                />
              </div>
            </div>
            <div className="flex items-center gap-4 pt-2">
              <Button variant="ghost" size="icon" className="transition-all duration-300 hover:scale-110">
                <User className="h-5 w-5" />
              </Button>
              <span className="text-sm text-muted-foreground">Account</span>
            </div>
          </div>
        </nav>
      </div>
    </header>
  )
}
