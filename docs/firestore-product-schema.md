// Firestore Product Document Schema Example
// Collection: products
// Each product document (ID: auto-generated or slug)
{
  name: string,           // Product name
  slug: string,           // URL-friendly slug
  shortDesc: string,      // Short description
  fullDesc: string,       // Rich text HTML from TipTap
  regularPrice: number,   // Regular price
  salePrice: number,      // Sale price
  saleStart: string,      // ISO date string
  saleEnd: string,        // ISO date string
  costPrice: number,      // Cost price
  taxClass: string,       // Tax class
  sku: string,            // SKU
  barcode: string,        // Barcode
  stockQty: number,       // Stock quantity
  stockStatus: string,    // 'in' or 'out'
  lowStock: number,       // Low stock threshold
  backorders: boolean,    // Allow backorders
  categories: [string],   // Array of category IDs
  subcategory: string,    // Subcategory ID
  brand: string,          // Brand ID
  tags: [string],         // Array of tags
  attributes: [           // Array of attribute objects
    {
      name: string,
      value: string
    }
  ],
  hasVariants: boolean,   // If product has variants
  variants: [             // Array of variant objects
    {
      name: string,
      price: number,
      sku: string,
      stockQty: number
    }
  ],
  mainImage: string,      // Storage URL
  gallery: [string],      // Array of Storage URLs
  videoUrl: string,       // Video URL
  weight: string,         // Weight
  length: string,         // Length
  width: string,          // Width
  height: string,         // Height
  shippingClass: string,  // Shipping class
  metaTitle: string,      // SEO meta title
  metaDesc: string,       // SEO meta description
  ogImage: string,        // Storage URL for Open Graph image
  customFields: string,   // Custom fields (JSON or string)
  status: string,         // 'draft', 'published', etc.
  createdAt: Timestamp,   // Firestore timestamp
  updatedAt: Timestamp    // Firestore timestamp
}

// Storage Structure
// /products/{productId}/main.jpg         (main image)
// /products/{productId}/gallery/{n}.jpg (gallery images)
// /products/{productId}/og.jpg          (Open Graph image)

// Firestore Security Rules Example
// Only authenticated users can read/write products
service cloud.firestore {
  match /databases/{database}/documents {
    match /products/{productId} {
      allow read, write: if request.auth != null;
    }
  }
}

// Storage Security Rules Example
// Only authenticated users can upload/read product images
service firebase.storage {
  match /b/{bucket}/o {
    match /products/{productId}/{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
