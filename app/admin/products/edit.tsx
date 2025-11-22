"use client";
import { useState } from "react";
import AdminLayout from "../AdminLayout";
const dummyProduct = {
  name: "Luxury Silk Dress",
  slug: "luxury-silk-dress",
  sku: "LSK-001",
  brand: "LuxeLabel",
  categories: ["Dresses"],
  tags: ["Silk", "Luxury"],
  basePrice: 4999,
  salePrice: 3999,
  taxClass: "GST 12%",
  costPrice: 3000,
  stockQty: 12,
  stockStatus: "in-stock",
  lowStock: 3,
  backorders: false,
  featured: true,
  visible: true,
  published: true,
  metaTitle: "Luxury Silk Dress - LuxeLabel",
  metaDesc: "Premium silk dress for luxury occasions.",
  urlHandle: "luxury-silk-dress",
  mainImage: "/product1.jpg",
  gallery: ["/product1.jpg", "/product2.jpg"],
};
  const [product, setProduct] = useState(dummyProduct);
  return (
    <AdminLayout>
      <h1 className="text-3xl font-extrabold text-primary mb-8">Edit Product</h1>
      <form className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white/80 rounded-2xl shadow p-8">
        {/* Basic Info */}
        <div>
          <h2 className="font-bold text-lg mb-4 text-primary">Basic Info</h2>
          <input className="mb-3 w-full px-4 py-2 rounded border" placeholder="Name" value={product.name} />
          <input className="mb-3 w-full px-4 py-2 rounded border" placeholder="Slug" value={product.slug} />
          <input className="mb-3 w-full px-4 py-2 rounded border" placeholder="SKU" value={product.sku} />
          <input className="mb-3 w-full px-4 py-2 rounded border" placeholder="Brand" value={product.brand} />
          <input className="mb-3 w-full px-4 py-2 rounded border" placeholder="Categories" value={product.categories.join(", ")} />
          <input className="mb-3 w-full px-4 py-2 rounded border" placeholder="Tags" value={product.tags.join(", ")} />
        </div>
        {/* Pricing */}
        <div>
          <h2 className="font-bold text-lg mb-4 text-primary">Pricing</h2>
          <input className="mb-3 w-full px-4 py-2 rounded border" placeholder="Base Price" value={product.basePrice} />
          <input className="mb-3 w-full px-4 py-2 rounded border" placeholder="Sale Price" value={product.salePrice} />
          <input className="mb-3 w-full px-4 py-2 rounded border" placeholder="Tax Class" value={product.taxClass} />
          <input className="mb-3 w-full px-4 py-2 rounded border" placeholder="Cost Price" value={product.costPrice} />
        </div>
        {/* Inventory */}
        <div>
          <h2 className="font-bold text-lg mb-4 text-primary">Inventory</h2>
          <input className="mb-3 w-full px-4 py-2 rounded border" placeholder="Stock Qty" value={product.stockQty} />
          <input className="mb-3 w-full px-4 py-2 rounded border" placeholder="Stock Status" value={product.stockStatus} />
          <input className="mb-3 w-full px-4 py-2 rounded border" placeholder="Low Stock Threshold" value={product.lowStock} />
          <select className="mb-3 w-full px-4 py-2 rounded border" value={product.backorders ? "yes" : "no"}>
            <option value="no">Allow Backorders: No</option>
            <option value="yes">Allow Backorders: Yes</option>
          </select>
        </div>
        {/* Media */}
        <div>
          <h2 className="font-bold text-lg mb-4 text-primary">Media</h2>
          <img src={product.mainImage} alt="Main" className="w-32 h-32 object-cover rounded-xl mb-3" />
          <div className="flex gap-2">
            {product.gallery.map((img, i) => (
              <img key={i} src={img} alt="Gallery" className="w-16 h-16 object-cover rounded-lg" />
            ))}
          </div>
        </div>
        {/* SEO */}
        <div>
          <h2 className="font-bold text-lg mb-4 text-primary">SEO</h2>
          <input className="mb-3 w-full px-4 py-2 rounded border" placeholder="Meta Title" value={product.metaTitle} />
          <input className="mb-3 w-full px-4 py-2 rounded border" placeholder="Meta Description" value={product.metaDesc} />
          <input className="mb-3 w-full px-4 py-2 rounded border" placeholder="URL Handle" value={product.urlHandle} />
        </div>
        {/* Flags */}
        <div>
          <h2 className="font-bold text-lg mb-4 text-primary">Flags</h2>
          <label className="flex items-center gap-2 mb-2"><input type="checkbox" checked={product.featured} /> Featured</label>
          <label className="flex items-center gap-2 mb-2"><input type="checkbox" checked={product.visible} /> Visible</label>
          <label className="flex items-center gap-2 mb-2"><input type="checkbox" checked={product.published} /> Published</label>
        </div>
      </form>
    </AdminLayout>
  );
}