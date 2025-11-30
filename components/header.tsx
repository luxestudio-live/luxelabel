"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { auth } from "@/lib/firebaseClient"
import Link from "next/link"
import { Search, User, ShoppingCart, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/app/cart/CartContext";
import { Input } from "@/components/ui/input"
import { Logo } from "@/components/logo"

export function Header() {
    const { cart } = useCart();
    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const router = useRouter()

  // Handler for profile icon click
  const handleProfileClick = () => {
    const user = auth.currentUser
    if (user) {
      router.push("/profile")
    } else {
      router.push("/login")
    }
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  // Search state and logic
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  // Search handler
  const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (value.length < 2) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }
    setSearchLoading(true);
    try {
      // Call API route for search
      const res = await fetch(`/api/search-products?q=${encodeURIComponent(value)}`);
      const data = await res.json();
      setSearchResults(data);
      setShowDropdown(true);
    } catch {
      setSearchResults([]);
      setShowDropdown(false);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleResultClick = (id: string) => {
    setSearchTerm("");
    setShowDropdown(false);
    router.push(`/product/${id}`);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur-md supports-backdrop-filter:bg-background/60 transition-all duration-300">
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
            href="/catalog"
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
                value={searchTerm}
                onChange={handleSearchChange}
                onFocus={() => searchResults.length > 0 && setShowDropdown(true)}
                onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
              />
              {/* Search Results Dropdown */}
              {showDropdown && (
                <div className="absolute left-0 top-full mt-2 w-full bg-white border border-border/30 rounded-xl shadow-lg z-50 max-h-80 overflow-y-auto">
                  {(() => {
                    if (searchLoading) {
                      return <div className="p-4 text-center text-muted-foreground">Searching...</div>;
                    }
                    if (searchResults.length === 0) {
                      return <div className="p-4 text-center text-muted-foreground">No products found.</div>;
                    }
                    return searchResults.map((product: any) => (
                      <button
                        key={product.id}
                        className="w-full text-left p-4 cursor-pointer hover:bg-secondary/30 transition-all"
                        type="button"
                        onMouseDown={() => handleResultClick(product.id)}
                        aria-label={`View product ${product.name}`}
                      >
                        <div className="font-semibold">{product.name}</div>
                        <div className="text-xs text-muted-foreground">{product.category || ""} {product.collection ? `| ${product.collection}` : ""}</div>
                        <div className="text-xs text-muted-foreground">Rs. {product.price}</div>
                      </button>
                    ));
                  })()}
                </div>
              )}
            </div>
          </div>
          <Button variant="ghost" size="icon" className="transition-all duration-300 hover:scale-110" onClick={handleProfileClick}>
            <User className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="relative transition-all duration-300 hover:scale-110">
            <Link href="/cart">
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-white rounded-full px-2 py-0.5 text-xs font-bold animate-bounce">{cartCount}</span>
              )}
            </Link>
          </Button>
        </div>

        {/* Mobile Actions */}
        <div className="flex md:hidden items-center gap-2">
          <Button variant="ghost" size="icon" className="relative transition-all duration-300 hover:scale-110">
            <Link href="/cart">
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-white rounded-full px-2 py-0.5 text-xs font-bold animate-bounce">{cartCount}</span>
              )}
            </Link>
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
              href="/catalog"
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
              <Button variant="ghost" size="icon" className="transition-all duration-300 hover:scale-110" onClick={handleProfileClick}>
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
