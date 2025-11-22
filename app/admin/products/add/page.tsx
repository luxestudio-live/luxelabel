"use client";
import AdminLayout from "../../AdminLayout";
import Link from "next/link";
import { useState } from "react";
import dynamic from "next/dynamic";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";

export default function AddProductPage() {
  const [form, setForm] = useState({
    name: "",
    slug: "",
    shortDesc: "",
    fullDesc: "",
    regularPrice: "",
    salePrice: "",
    saleStart: "",
    saleEnd: "",
    costPrice: "",
    taxClass: "taxable",
    sku: "",
    barcode: "",
    stockQty: "",
    stockStatus: "in",
    lowStock: "",
    backorders: false,
    categories: [],
    subcategory: "",
    brand: "",
    tags: "",
    attributes: [],
    hasVariants: false,
    variants: [],
    mainImage: null,
    gallery: [],
    videoUrl: "",
    weight: "",
    length: "",
    width: "",
    height: "",
    shippingClass: "",
    metaTitle: "",
    metaDesc: "",
    ogImage: null,
    customFields: "",
    status: "draft",
  });
  // Auto-generate slug from name
  const handleNameChange = (e: any) => {
    const name = e.target.value;
    setForm(f => ({ ...f, name, slug: name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") }));
  };
  return (
    <AdminLayout>
      <form className="max-w-5xl mx-auto p-8 bg-white rounded-2xl shadow-xl" autoComplete="off">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex gap-4 items-center">
            <h1 className="text-3xl font-extrabold text-primary">Add Product</h1>
            <Link href="/admin/products" className="px-4 py-2 rounded-xl bg-gray-200 text-gray-700 font-bold shadow hover:bg-gray-300 transition">← Back to Products</Link>
          </div>
        </div>
        <div>
          <h2 className="text-xl font-bold text-primary mb-4">Basic Info</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="font-semibold mb-1 block">Product Name *</label>
              <input className="px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-300 w-full transition" required value={form.name} onChange={handleNameChange} />
            </div>
            <div>
              <label className="font-semibold mb-1 block">Slug/URL Handle</label>
              <input className="px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-300 w-full transition" value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} />
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-6 mt-6">
            <div>
              <label className="font-semibold mb-1 block">Short Description</label>
              <input className="px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-300 w-full transition" value={form.shortDesc} onChange={e => setForm(f => ({ ...f, shortDesc: e.target.value }))} />
            </div>
            <div>
              <label className="font-semibold mb-1 block">OG Image</label>
              <div className="relative w-full">
                <input
                  type="file"
                  accept="image/*"
                  id="ogImage"
                  className="opacity-0 absolute inset-0 w-full h-full cursor-pointer z-10"
                  onChange={e => setForm(f => ({ ...f, ogImage: e.target.files?.[0] }))}
                />
                <label htmlFor="ogImage" className="flex items-center justify-between px-4 py-3 rounded-xl border bg-linear-to-r from-blue-100 to-blue-50 shadow cursor-pointer transition hover:from-blue-200 hover:to-blue-100">
                  <span>{form.ogImage ? form.ogImage.name : "Choose File"}</span>
                  <span className="text-gray-400 text-sm">{!form.ogImage && "No file chosen"}</span>
                </label>
              </div>
            </div>
          </div>
          <div className="mt-6">
            <label className="font-semibold mb-1 block">Full Description</label>
            <div className="bg-white rounded-xl border shadow focus-within:ring-2 focus-within:ring-blue-300 p-4 min-h-80 overflow-hidden">
              <ReactQuill
                theme="snow"
                value={form.fullDesc}
                onChange={val => setForm(f => ({ ...f, fullDesc: val }))}
                className="min-h-56 h-80 rounded-xl text-lg quill-editor-custom"
                modules={{
                  toolbar: [
                    [{ 'header': [1, 2, false] }],
                    ['bold', 'italic', 'underline', 'strike', { 'color': [] }, { 'background': [] }],
                    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                    ['link', 'image', 'video'],
                    ['clean']
                  ]
                }}
              />
            </div>
          </div>
        </div>
        <hr className="my-2 border-blue-100" />
        {/* Pricing */}
        <div>
          <h2 className="text-xl font-bold text-primary mb-4">Pricing</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <label className="font-semibold mb-1 block">Regular Price (INR)</label>
              <input type="number" className="px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-300 w-full transition" value={form.regularPrice} onChange={e => setForm(f => ({ ...f, regularPrice: e.target.value }))} />
            </div>
            <div>
              <label className="font-semibold mb-1 block">Sale Price (INR)</label>
              <input type="number" className="px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-300 w-full transition" value={form.salePrice} onChange={e => setForm(f => ({ ...f, salePrice: e.target.value }))} />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="font-semibold mb-1 block">Sale Start</label>
                <input type="date" className="px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-300 w-full transition" value={form.saleStart} onChange={e => setForm(f => ({ ...f, saleStart: e.target.value }))} />
              </div>
              <div>
                <label className="font-semibold mb-1 block">Sale End</label>
                <input type="date" className="px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-300 w-full transition" value={form.saleEnd} onChange={e => setForm(f => ({ ...f, saleEnd: e.target.value }))} />
              </div>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-6 mt-6">
            <div>
              <label className="font-semibold mb-1 block">Cost Price (Internal)</label>
              <input type="number" className="px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-300 w-full transition" value={form.costPrice} onChange={e => setForm(f => ({ ...f, costPrice: e.target.value }))} />
            </div>
            <div>
              <label className="font-semibold mb-1 block">Tax Class</label>
              <select className="px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-300 w-full transition" value={form.taxClass} onChange={e => setForm(f => ({ ...f, taxClass: e.target.value }))}>
                <option value="taxable">Taxable</option>
                <option value="non-taxable">Non-Taxable</option>
              </select>
            </div>
          </div>
        </div>
        <hr className="my-2 border-blue-100" />
        {/* Inventory */}
        <div>
          <h2 className="text-xl font-bold text-primary mb-4">Inventory</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <label className="font-semibold mb-1 block">SKU *</label>
              <input className="px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-300 w-full transition" required value={form.sku} onChange={e => setForm(f => ({ ...f, sku: e.target.value }))} />
            </div>
            <div>
              <label className="font-semibold mb-1 block">Barcode/GTIN</label>
              <input className="px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-300 w-full transition" value={form.barcode} onChange={e => setForm(f => ({ ...f, barcode: e.target.value }))} />
            </div>
            <div>
              <label className="font-semibold mb-1 block">Stock Quantity</label>
              <input type="number" className="px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-300 w-full transition" value={form.stockQty} onChange={e => setForm(f => ({ ...f, stockQty: e.target.value }))} />
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-6 mt-6">
            <div>
              <label className="font-semibold mb-1 block">Stock Status</label>
              <select className="px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-300 w-full transition" value={form.stockStatus} onChange={e => setForm(f => ({ ...f, stockStatus: e.target.value }))}>
                <option value="in">In Stock</option>
                <option value="out">Out of Stock</option>
              </select>
            </div>
            <div>
              <label className="font-semibold mb-1 block">Low-Stock Threshold</label>
              <input type="number" className="px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-300 w-full transition" value={form.lowStock} onChange={e => setForm(f => ({ ...f, lowStock: e.target.value }))} />
            </div>
            <div>
              <label className="font-semibold mb-1 block">Allow Backorders</label>
              <select className="px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-300 w-full transition" value={form.backorders ? "yes" : "no"} onChange={e => setForm(f => ({ ...f, backorders: e.target.value === "yes" }))}>
                <option value="no">No</option>
                <option value="yes">Yes</option>
              </select>
            </div>
          </div>
        </div>
        <hr className="my-2 border-blue-100" />
        {/* Organization & Attributes */}
        <div>
          <h2 className="text-xl font-bold text-primary mb-4">Organization & Attributes</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <label className="font-semibold mb-1 block">Category</label>
              <select className="px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-300 w-full transition" multiple value={form.categories} onChange={e => setForm(f => ({ ...f, categories: Array.from(e.target.selectedOptions, opt => opt.value) }))}>
                <option value="Dresses">Dresses</option>
                <option value="Accessories">Accessories</option>
                <option value="Jewelry">Jewelry</option>
              </select>
            </div>
            <div>
              <label className="font-semibold mb-1 block">Subcategory</label>
              <input className="px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-300 w-full transition" value={form.subcategory} onChange={e => setForm(f => ({ ...f, subcategory: e.target.value }))} />
            </div>
            <div>
              <label className="font-semibold mb-1 block">Brand</label>
              <input className="px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-300 w-full transition" value={form.brand} onChange={e => setForm(f => ({ ...f, brand: e.target.value }))} />
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-6 mt-6">
            <div>
              <label className="font-semibold mb-1 block">Tags</label>
              <input className="px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-300 w-full transition" placeholder="Comma separated" value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))} />
            </div>
            <div>
              <label className="font-semibold mb-1 block">Attributes (Color, Size, Material, etc.)</label>
              <input className="px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-300 w-full transition" placeholder="e.g. Color: Red, Size: M" value={form.attributes.join(", ")} onChange={e => setForm(f => ({ ...f, attributes: e.target.value.split(",") }))} />
            </div>
          </div>
        </div>
        <hr className="my-2 border-blue-100" />
        {/* Variants */}
        <div>
          <h2 className="text-xl font-bold text-primary mb-4">Variants</h2>
          <label className="font-semibold mb-1 block">This product has variants?</label>
          <select className="px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-300 w-full mb-4 transition" value={form.hasVariants ? "yes" : "no"} onChange={e => setForm(f => ({ ...f, hasVariants: e.target.value === "yes" }))}>
            <option value="no">No</option>
            <option value="yes">Yes</option>
          </select>
          {form.hasVariants && (
            <div className="bg-gray-50 rounded-xl p-4 border border-blue-100">
              <div className="font-bold mb-2">Variant Table (dummy)</div>
              <table className="min-w-full text-sm">
                <thead>
                  <tr>
                    <th className="p-2 text-left">Variant Name</th>
                    <th className="p-2 text-left">SKU</th>
                    <th className="p-2 text-left">Price</th>
                    <th className="p-2 text-left">Stock Qty</th>
                    <th className="p-2 text-left">Weight/Dimensions</th>
                    <th className="p-2 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-2">Red / M</td>
                    <td className="p-2">VAR-001</td>
                    <td className="p-2">₹4999</td>
                    <td className="p-2">10</td>
                    <td className="p-2">0.5kg / 30x20x5cm</td>
                    <td className="p-2">Enabled</td>
                  </tr>
                  <tr>
                    <td className="p-2">Blue / L</td>
                    <td className="p-2">VAR-002</td>
                    <td className="p-2">₹4999</td>
                    <td className="p-2">5</td>
                    <td className="p-2">0.5kg / 30x20x5cm</td>
                    <td className="p-2">Enabled</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
        <hr className="my-2 border-blue-100" />
        {/* Media */}
        <div>
          <h2 className="text-xl font-bold text-primary mb-4">Media</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="font-semibold mb-1 block">Main Product Image</label>
              <div className="relative w-full">
                <input
                  type="file"
                  id="mainImage"
                  accept="image/*"
                  className="opacity-0 absolute inset-0 w-full h-full cursor-pointer z-10"
                  onChange={e => setForm(f => ({ ...f, mainImage: e.target.files?.[0] }))}
                />
                <label htmlFor="mainImage" className="flex items-center justify-between px-4 py-3 rounded-xl border bg-linear-to-r from-blue-100 to-blue-50 shadow cursor-pointer transition hover:from-blue-200 hover:to-blue-100">
                  <span>{form.mainImage ? form.mainImage.name : "Choose File"}</span>
                  <span className="text-gray-400 text-sm">{!form.mainImage && "No file chosen"}</span>
                </label>
              </div>
            </div>
            <div>
              <label className="font-semibold mb-1 block">Gallery Images</label>
              <div className="relative w-full">
                <input
                  type="file"
                  id="galleryImages"
                  multiple
                  accept="image/*"
                  className="opacity-0 absolute inset-0 w-full h-full cursor-pointer z-10"
                  onChange={e => setForm(f => ({ ...f, gallery: Array.from(e.target.files || []) }))}
                />
                <label htmlFor="galleryImages" className="flex items-center justify-between px-4 py-3 rounded-xl border bg-linear-to-r from-blue-100 to-blue-50 shadow cursor-pointer transition hover:from-blue-200 hover:to-blue-100">
                  <span>{form.gallery && form.gallery.length > 0 ? `${form.gallery.length} file(s) selected` : "Choose Files"}</span>
                  <span className="text-gray-400 text-sm">{(!form.gallery || form.gallery.length === 0) && "No files chosen"}</span>
                </label>
              </div>
            </div>
          </div>
          <div className="mt-6">
            <label className="font-semibold mb-1 block">Product Video/360° Media URL</label>
            <input className="px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-300 w-full transition" value={form.videoUrl} onChange={e => setForm(f => ({ ...f, videoUrl: e.target.value }))} />
          </div>
        </div>
        <hr className="my-2 border-blue-100" />
        {/* Shipping & Dimensions */}
        <div>
          <h2 className="text-xl font-bold text-primary mb-4">Shipping & Dimensions</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div>
              <label className="font-semibold mb-1 block">Weight</label>
              <input className="px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-300 w-full transition" value={form.weight} onChange={e => setForm(f => ({ ...f, weight: e.target.value }))} />
            </div>
            <div>
              <label className="font-semibold mb-1 block">Length</label>
              <input className="px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-300 w-full transition" value={form.length} onChange={e => setForm(f => ({ ...f, length: e.target.value }))} />
            </div>
            <div>
              <label className="font-semibold mb-1 block">Width</label>
              <input className="px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-300 w-full transition" value={form.width} onChange={e => setForm(f => ({ ...f, width: e.target.value }))} />
            </div>
            <div>
              <label className="font-semibold mb-1 block">Height</label>
              <input className="px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-300 w-full transition" value={form.height} onChange={e => setForm(f => ({ ...f, height: e.target.value }))} />
            </div>
          </div>
          <div className="mt-6">
            <label className="font-semibold mb-1 block">Shipping Class/Type</label>
            <input className="px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-300 w-full transition" value={form.shippingClass} onChange={e => setForm(f => ({ ...f, shippingClass: e.target.value }))} />
          </div>
        </div>
        <hr className="my-2 border-blue-100" />
        {/* SEO & Metadata */}
        <div>
          <h2 className="text-xl font-bold text-primary mb-4">SEO & Metadata</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="font-semibold mb-1 block">Meta Title</label>
              <input className="px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-300 w-full transition" value={form.metaTitle} onChange={e => setForm(f => ({ ...f, metaTitle: e.target.value }))} />
            </div>
            <div>
              <label className="font-semibold mb-1 block">Meta Description</label>
              <input className="px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-300 w-full transition" value={form.metaDesc} onChange={e => setForm(f => ({ ...f, metaDesc: e.target.value }))} />
            </div>
          </div>
          {/* Removed duplicate OG Image input at the end of the form */}
        </div>
        <hr className="my-2 border-blue-100" />
        {/* Custom Fields */}
        <div>
          <h2 className="text-xl font-bold text-primary mb-4">Custom Fields</h2>
          <label className="font-semibold mb-1 block">Custom Fields (JSON or text)</label>
          <textarea className="px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-300 w-full min-h-20 transition" value={form.customFields} onChange={e => setForm(f => ({ ...f, customFields: e.target.value }))} />
        </div>
        <hr className="my-2 border-blue-100" />
        {/* Status & Visibility */}
        <div>
          <h2 className="text-xl font-bold text-primary mb-4">Status & Visibility</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="font-semibold mb-1 block">Product Status</label>
              <select className="px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-300 w-full transition" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>
        </div>
        <button type="submit" className="px-8 py-4 rounded-2xl bg-linear-to-r from-blue-600 via-purple-600 to-indigo-600 text-white font-extrabold shadow-lg hover:scale-105 transition text-lg mt-8">Add Product</button>
      </form>
    </AdminLayout>
  );
}
