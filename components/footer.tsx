import { Instagram, Facebook, Twitter, Youtube } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border/40 py-12">
      <div className="container px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Links */}
          <div className="flex gap-8 text-sm">
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              Shop
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              About
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              Support
            </a>
          </div>

          {/* Social Icons */}
          <div className="flex gap-4">
            <a
              href="#"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Instagram"
            >
              <Instagram className="h-5 w-5" />
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Facebook">
              <Facebook className="h-5 w-5" />
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Twitter">
              <Twitter className="h-5 w-5" />
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="YouTube">
              <Youtube className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
