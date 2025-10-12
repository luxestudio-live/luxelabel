"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, Star, Truck, Shield, RotateCcw, Plus, Minus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { getImageUrl } from "@/lib/utils"

const productImages = [
  "luxury-brown-leather-handbag-designer-bag.jpg",
  "elegant-woman-in-white-dress-luxury-fashion.jpg",
  "elegant-woman-in-flowing-beige-dress-minimal-backg.jpg",
  "woman-in-brown-winter-coat-snowy-landscape-luxury-.jpg",
  "cream-beige-cashmere-scarf-luxury-accessory.jpg"
]

const testimonials = [
  {
    id: 1,
    name: "Isabella V.",
    rating: 5,
    comment: "Absolutely stunning. The quality is beyond exceptional and it's truly a masterpiece along the Éclat collection aesthetic.",
    verified: true
  },
  {
    id: 2,
    name: "Marcus T.",
    rating: 5,
    comment: "The Éclat Nocturne is a beautiful bag - very chic and elegant. I wish there were more colour options, but overall a perfect ten.",
    verified: true
  },
  {
    id: 3,
    name: "Sophia R.",
    rating: 5,
    comment: "This bag is everything I dreamed of and more. It's sophisticated, versatile, and the perfect size. I've complimented every outfit I've worn it.",
    verified: true
  },
  {
    id: 4,
    name: "Liam K.",
    rating: 5,
    comment: "Exceptional quality and exquisite design. Aura Moda never disappoints. This bag is a statement piece that elevates my favorite.",
    verified: true
  },
  {
    id: 5,
    name: "Olivia H.",
    rating: 5,
    comment: "Gorgeous bag, though the price point is definitely high. It feels very premium and the craftsmanship shows it worth the investment. It's a beautiful statement.",
    verified: true
  },
  {
    id: 6,
    name: "Noah D.",
    rating: 5,
    comment: "A true masterpiece! The attention to detail is remarkable. It's spacious enough for my essentials and stylish beyond what you expect.",
    verified: true
  }
]

const completeTheLookProducts = [
  {
    id: 2,
    name: "The 'Midnight Suede' Heels",
    price: 189.00,
    image: "woman-in-brown-winter-coat-snowy-landscape-luxury-.jpg"
  },
  {
    id: 3,
    name: "The 'Golden Whisper' Necklace", 
    price: 150.00,
    image: "luxury-fashion-accessories-hand-jewelry.jpg"
  },
  {
    id: 4,
    name: "The 'Artisan Silk' Scarf",
    price: 450.00,
    image: "cream-beige-cashmere-scarf-luxury-accessory.jpg"
  }
]

export default function DemoProductPage() {
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedSize, setSelectedSize] = useState("One Size")
  const [selectedColor, setSelectedColor] = useState("black")
  const [quantity, setQuantity] = useState(1)

  const product = {
    name: "The 'Éclat Nocturne' Handbag",
    price: 3450.00,
    description: "Experience the timeless allure of the Éclat Nocturne, exquisitely crafted from the finest Italian full-grain leather. Its sleek silhouette and signature gold hardware make it the perfect companion for elevated elegance. Designed for the discerning woman who values both style and functionality, this bag brings together a statement of sophisticated luxury."
  }

  const sizes = ["One Size"]
  const colors = [
    { name: "black", value: "#000000" },
    { name: "cognac", value: "#8B4513" }
  ]

  const handleQuantityChange = (change: number) => {
    setQuantity(Math.max(1, quantity + change))
  }

  const handleAddToCart = () => {
    alert("Added to cart!")
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Navigation */}
      <div className="border-b">
        <div className="container mx-auto px-4 py-4">
          <Link 
            href="/catalog" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Catalog
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square overflow-hidden rounded-lg bg-secondary/10">
              <Image
                src={getImageUrl(productImages[selectedImage])}
                alt="Product Image"
                fill
                className="object-cover"
                priority
              />
            </div>
            
            {/* Thumbnail Images */}
            <div className="flex gap-3 justify-start">
              {productImages.slice(0, 5).map((image, index) => (
                <button
                  key={image}
                  onClick={() => setSelectedImage(index)}
                  className={`relative w-16 h-16 overflow-hidden rounded-md border-2 transition-colors ${
                    selectedImage === index ? "border-foreground" : "border-gray-200"
                  }`}
                >
                  <Image
                    src={getImageUrl(image)}
                    alt={`Product Image ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-light mb-4">{product.name}</h1>
              <div className="text-2xl font-light mb-6">Rs. {product.price.toLocaleString()}</div>
              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Size Selection */}
            <div>
              <label className="text-sm font-medium mb-3 block">Size</label>
              <div className="flex gap-2">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 border rounded-md transition-colors ${
                      selectedSize === size 
                        ? "border-foreground bg-foreground text-background" 
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Selection */}
            <div>
              <label className="text-sm font-medium mb-3 block">Color: {selectedColor}</label>
              <div className="flex gap-3">
                {colors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color.name)}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${
                      selectedColor === color.name 
                        ? "border-foreground scale-110" 
                        : "border-gray-300"
                    }`}
                    style={{ backgroundColor: color.value }}
                    aria-label={color.name}
                  />
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <label className="text-sm font-medium mb-3 block">Quantity</label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  className="w-8 h-8 border border-gray-300 rounded-md flex items-center justify-center hover:border-gray-400 transition-colors"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-8 text-center">{quantity}</span>
                <button
                  onClick={() => handleQuantityChange(1)}
                  className="w-8 h-8 border border-gray-300 rounded-md flex items-center justify-center hover:border-gray-400 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <Button 
              onClick={handleAddToCart}
              className="w-full bg-black text-white hover:bg-gray-800 h-12 text-base font-normal"
            >
              Add to Bag
            </Button>

            {/* Product Features */}
            <div className="space-y-3 pt-6 border-t text-sm text-muted-foreground">
              <div className="flex items-center gap-3">
                <Truck className="h-4 w-4" />
                <span>Free shipping on orders over Rs. 5,000</span>
              </div>
              <div className="flex items-center gap-3">
                <Shield className="h-4 w-4" />
                <span>Authentic luxury guarantee</span>
              </div>
              <div className="flex items-center gap-3">
                <RotateCcw className="h-4 w-4" />
                <span>30-day return policy</span>
              </div>
            </div>
          </div>
        </div>

        {/* Heritage Section */}
        <div className="mt-20 py-16 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 px-8">
            <div className="space-y-6">
              <h2 className="text-4xl font-light">A Legacy Woven in Leather</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  At Aura Moda, every stitch tells a story, and every creation is a testament to our unwavering 
                  commitment to precision and artistry. Hand-assembled by our master craftsmen, each piece carries 
                  the soul of generations of leather artisans, ensuring a lifetime of enduring elegance.
                </p>
                <p>
                  I invest the right details in the final polish, as Aura Moda has enabled a new journey of precision and dedication. 
                  We blend ancestral techniques with contemporary style, resulting in pieces that transcend fleeting trends. 
                  Each handbag is destined to be cherished for a lifetime.
                </p>
              </div>
            </div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
              <Image
                src={getImageUrl("hands-crafting-luxury-leather-handbag-artisan-work.jpg")}
                alt="Artisan crafting leather handbag"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>

        {/* Customer Testimonials */}
        <div className="mt-20">
          <h2 className="text-3xl font-light text-center mb-12">Customer Testimonials</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="space-y-4">
                <div className="flex items-center gap-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={`testimonial-${testimonial.id}-star-${i}`} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-muted-foreground italic">"{testimonial.comment}"</p>
                <div className="flex items-center justify-between">
                  <span className="font-medium">{testimonial.name}</span>
                  {testimonial.verified && (
                    <Badge variant="secondary" className="text-xs">Verified</Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Complete The Look */}
        <div className="mt-20">
          <h2 className="text-3xl font-light text-center mb-12">Complete The Look</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {completeTheLookProducts.map((item) => (
              <Link key={item.id} href="/demo-product" className="group cursor-pointer">
                <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100 mb-4">
                  <Image
                    src={getImageUrl(item.image)}
                    alt={item.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <h3 className="font-medium mb-2 group-hover:text-muted-foreground transition-colors">
                  {item.name}
                </h3>
                <p className="font-light">Rs. {item.price.toLocaleString()}</p>
                <Button variant="outline" size="sm" className="mt-3 w-full">
                  View Details
                </Button>
              </Link>
            ))}
          </div>
        </div>

        {/* Personalization Section */}
        <div className="mt-20 py-16 bg-gray-50 rounded-2xl px-8">
          <div className="max-w-2xl mx-auto text-center space-y-8">
            <h2 className="text-3xl font-light">Personalize Your Item</h2>
            <p className="text-muted-foreground">Elevate your Aura Moda pieces with bespoke customization.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
              <div>
                <h3 className="font-medium mb-3">Engrave Initial (Max 3 Characters)</h3>
                <input 
                  type="text" 
                  placeholder="e.g. AMR"
                  maxLength={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
                />
              </div>
              
              <div>
                <h3 className="font-medium mb-3">Lining Material</h3>
                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input type="radio" name="lining" value="silk" defaultChecked />
                    <span>Silk</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" name="lining" value="lambskin" />
                    <span>Lambskin Sugan</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" name="lining" value="alcantara" />
                    <span>Alcantara</span>
                  </label>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium mb-3">Hardware Finish</h3>
              <div className="flex justify-center gap-4">
                <div className="w-8 h-8 bg-yellow-400 rounded-full border-2 border-gray-300 cursor-pointer hover:border-gray-400" title="Gold"></div>
                <div className="w-8 h-8 bg-gray-400 rounded-full border-2 border-gray-300 cursor-pointer hover:border-gray-400" title="Silver"></div>
                <div className="w-8 h-8 bg-gray-800 rounded-full border-2 border-gray-300 cursor-pointer hover:border-gray-400" title="Black"></div>
              </div>
            </div>
            
            <Button className="bg-black text-white hover:bg-gray-800 px-8">
              Apply Customization
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}