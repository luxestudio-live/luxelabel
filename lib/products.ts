export const products = [
  {
    id: 1,
    name: "Midnight Serenade Gown",
    price: 1450.00,
    image: "/elegant-burgundy-evening-dress-luxury-fashion.jpg",
    category: "Dresses",
    collection: "Midnight",
    description: "An elegant burgundy evening dress crafted from premium silk, perfect for formal occasions.",
    details: {
      material: "100% Silk",
      fit: "Regular fit",
      length: "Floor-length",
      care: "Dry clean only"
    }
  },
  {
    id: 2,
    name: "Classic Aura Trench Coat",
    price: 580.00,
    image: "/woman-in-brown-winter-coat-snowy-landscape-luxury-.jpg",
    category: "Coats",
    collection: "Classic Aura",
    description: "A timeless trench coat in rich brown, combining classic elegance with modern sophistication.",
    details: {
      material: "Cotton Blend",
      fit: "Regular fit", 
      length: "Midi",
      care: "Machine wash cold"
    }
  },
  {
    id: 3,
    name: "Elegance Leather Tote",
    price: 200.00,
    image: "/luxury-brown-leather-handbag-designer-bag.jpg",
    category: "Bags",
    collection: "Elegance",
    description: "A sophisticated leather tote bag crafted from premium materials for the modern professional.",
    details: {
      material: "Genuine Leather",
      dimensions: "15\" x 12\" x 6\"",
      features: "Multiple compartments",
      care: "Leather conditioner recommended"
    }
  },
  {
    id: 4,
    name: "Verdant Silk Blouse",
    price: 190.00,
    image: "/elegant-woman-in-white-dress-luxury-fashion.jpg",
    category: "Blouses",
    collection: "Executive",
    description: "A refined silk blouse that epitomizes professional elegance and versatile style.",
    details: {
      material: "100% Silk",
      fit: "Tailored fit",
      length: "Hip-length",
      care: "Dry clean only"
    }
  },
  {
    id: 5,
    name: "Opulence Wide-Leg Trousers",
    price: 890.00,
    image: "/man-in-tailored-grey-suit-luxury-menswear.jpg",
    category: "Trousers",
    collection: "Opulence",
    description: "Luxurious wide-leg trousers that blend comfort with sophisticated tailoring.",
    details: {
      material: "Wool Blend",
      fit: "Wide-leg fit",
      length: "Full length",
      care: "Dry clean only"
    }
  },
  {
    id: 6,
    name: "Starlight Diamond Necklace",
    price: 750.00,
    image: "/luxury-fashion-accessories-hand-jewelry.jpg",
    category: "Jewelry",
    collection: "Starlight",
    description: "An exquisite diamond necklace that captures light beautifully, perfect for special occasions.",
    details: {
      material: "Sterling Silver, Diamonds",
      length: "18 inches",
      features: "Adjustable clasp",
      care: "Professional cleaning recommended"
    }
  },
  {
    id: 7,
    name: "Executive Aura Blazer",
    price: 1100.00,
    image: "/elegant-woman-in-flowing-beige-dress-minimal-backg.jpg",
    category: "Blazers",
    collection: "Executive",
    description: "A power blazer designed for the confident professional, combining structure with feminine elegance.",
    details: {
      material: "Premium Wool",
      fit: "Tailored fit",
      length: "Hip-length",
      care: "Dry clean only"
    }
  },
  {
    id: 8,
    name: "Whisper Silk Midi Skirt",
    price: 570.00,
    image: "/cream-beige-cashmere-scarf-luxury-accessory.jpg",
    category: "Skirts",
    collection: "Whisper",
    description: "A flowing midi skirt in luxurious silk that moves gracefully with every step.",
    details: {
      material: "100% Silk",
      fit: "A-line fit",
      length: "Midi-length",
      care: "Dry clean only"
    }
  }
]

export function getProductById(id: number) {
  return products.find(product => product.id === id)
}