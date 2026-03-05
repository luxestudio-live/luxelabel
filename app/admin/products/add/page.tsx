"use client";
import AdminLayout from "../../AdminLayout";
import Link from "next/link";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebaseClient";
import { collection, getDocs } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { handleAddProduct } from "../addProductLogic";
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

export default function AddProductPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();
  // Step control for two-part form
  const [step, setStep] = useState(1);
  // Category state and fetch
  const [categories, setCategories] = useState<string[]>([]);
  useEffect(() => {
    async function fetchCategories() {
      const catSnap = await getDocs(collection(db, "categories"));
      setCategories(catSnap.docs.map(doc => doc.data().name));
    }
    fetchCategories();
  }, []);
  // Cleaned up form state
  const [form, setForm] = useState({
    name: "",
    slug: "",
    shortDesc: "",
    fullDesc: "",
    regularPrice: "",
    salePrice: "",
    sku: "",
    stockQty: "",
    stockStatus: "in",
    category: "",
    tags: "",
    hasVariants: false,
    variants: [],
    mainImage: null,
    gallery: [],
    ogImage: null,
    status: "draft",
  });

  // TipTap editor setup
  const editor = useEditor({
    extensions: [StarterKit],
    content: form.fullDesc,
    onUpdate: ({ editor }) => {
      setForm(f => ({ ...f, fullDesc: editor.getHTML() }));
    },
    immediatelyRender: false,
  });
  // Auto-generate slug from name
  const handleNameChange = (e: any) => {
    const name = e.target.value;
    // Always trim and lowercase for slug and sku
    setForm(f => ({
      ...f,
      name,
      slug: name.trim().toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
      sku: name.trim().toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")
    }));
  };
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (loading) return; // Prevent duplicate submissions
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      await handleAddProduct(form);
      setSuccess("Product added successfully!");
      setForm({
        name: "",
        slug: "",
        shortDesc: "",
        fullDesc: "",
        regularPrice: "",
        sku: "",
        stockQty: "",
        stockStatus: "in",
        tags: "",
        hasVariants: false,
        variants: [],
        mainImage: null,
        gallery: [],
        ogImage: null,
        status: "draft",
      });
      // Redirect to admin products page after success
      setTimeout(() => {
        router.push("/admin/products");
      }, 500);
    } catch (err: any) {
      setError(err?.message || "Failed to add product.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto p-8 bg-white rounded-2xl shadow-xl">
        {/* Stepper Navigation */}
        <div className="flex gap-4 mb-8">
          <button type="button" className={`px-4 py-2 rounded-xl font-bold shadow ${step === 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`} onClick={() => setStep(1)}>Step 1: Product Data</button>
          <button type="button" className={`px-4 py-2 rounded-xl font-bold shadow ${step === 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`} onClick={() => setStep(2)}>Step 2: Images</button>
        </div>
        {loading && <div className="text-blue-600 font-bold mb-4">Adding product, please wait...</div>}
        {error && <div className="bg-red-100 text-red-800 rounded-xl px-4 py-3 text-center font-bold shadow mb-4">{error}</div>}
        {success && <div className="bg-green-100 text-green-800 rounded-xl px-4 py-3 text-center font-bold shadow mb-4">{success}</div>}
        <div className="flex gap-4 items-center mb-6">
          <h1 className="text-3xl font-extrabold text-primary">Add Product</h1>
          <Link href="/admin/products" className="px-4 py-2 rounded-xl bg-gray-200 text-gray-700 font-bold shadow hover:bg-gray-300 transition">← Back to Products</Link>
        </div>
        {/* Step 1: Product Data */}
        {step === 1 && (
          <form autoComplete="off" onSubmit={e => { e.preventDefault(); setStep(2); }}>
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
                <label className="font-semibold mb-1 block">Category</label>
                <select className="px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-300 w-full transition" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                  <option value="">Select Category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mt-6">
              <label className="font-semibold mb-1 block">Full Description (Rich Text)</label>
              <div className="bg-white rounded-xl border shadow focus-within:ring-2 focus-within:ring-blue-300 p-4 min-h-80 overflow-hidden">
                {/* TipTap Menu Bar */}
                {editor && (
                  <div className="flex flex-wrap gap-2 mb-2">
                    <button type="button" className="px-2 py-1 rounded border text-sm" onClick={() => editor.chain().focus().toggleBold().run()} style={{ fontWeight: editor.isActive('bold') ? 'bold' : 'normal' }}>B</button>
                    <button type="button" className="px-2 py-1 rounded border text-sm italic" onClick={() => editor.chain().focus().toggleItalic().run()} style={{ fontStyle: editor.isActive('italic') ? 'italic' : 'normal' }}>I</button>
                    <button type="button" className="px-2 py-1 rounded border text-sm underline" onClick={() => editor.chain().focus().toggleUnderline().run()} style={{ textDecoration: editor.isActive('underline') ? 'underline' : 'none' }}>U</button>
                    <button type="button" className="px-2 py-1 rounded border text-sm" onClick={() => editor.chain().focus().toggleBulletList().run()} style={{ background: editor.isActive('bulletList') ? '#e0e7ff' : 'white' }}>• List</button>
                    <button type="button" className="px-2 py-1 rounded border text-sm" onClick={() => editor.chain().focus().toggleOrderedList().run()} style={{ background: editor.isActive('orderedList') ? '#e0e7ff' : 'white' }}>1. List</button>
                    <button type="button" className="px-2 py-1 rounded border text-sm" onClick={() => editor.chain().focus().setParagraph().run()} style={{ background: editor.isActive('paragraph') ? '#e0e7ff' : 'white' }}>P</button>
                    <button type="button" className="px-2 py-1 rounded border text-sm" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} style={{ background: editor.isActive('heading', { level: 1 }) ? '#e0e7ff' : 'white' }}>H1</button>
                    <button type="button" className="px-2 py-1 rounded border text-sm" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} style={{ background: editor.isActive('heading', { level: 2 }) ? '#e0e7ff' : 'white' }}>H2</button>
                    <button type="button" className="px-2 py-1 rounded border text-sm" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} style={{ background: editor.isActive('heading', { level: 3 }) ? '#e0e7ff' : 'white' }}>H3</button>
                    <button type="button" className="px-2 py-1 rounded border text-sm" onClick={() => editor.chain().focus().toggleBlockquote().run()} style={{ background: editor.isActive('blockquote') ? '#e0e7ff' : 'white' }}>❝</button>
                    <button type="button" className="px-2 py-1 rounded border text-sm" onClick={() => editor.chain().focus().setHorizontalRule().run()}>―</button>
                    <button type="button" className="px-2 py-1 rounded border text-sm" onClick={() => editor.chain().focus().undo().run()}>↺ Undo</button>
                    <button type="button" className="px-2 py-1 rounded border text-sm" onClick={() => editor.chain().focus().redo().run()}>↻ Redo</button>
                  </div>
                )}
                <EditorContent editor={editor} className="min-h-56 h-80 w-full rounded-xl text-lg" />
                <div className="text-xs text-gray-400 mt-2">You can format text, add links, lists, headings, and more.</div>
              </div>
            </div>
            <div className="grid md:grid-cols-4 gap-6 mt-6">
              <div>
                <label className="font-semibold mb-1 block">Regular Price (INR)</label>
                <input type="number" className="px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-300 w-full transition" value={form.regularPrice} onChange={e => setForm(f => ({ ...f, regularPrice: e.target.value }))} />
              </div>
              <div>
                <label className="font-semibold mb-1 block">Sale Price (INR)</label>
                <input type="number" className="px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-300 w-full transition" value={form.salePrice || ""} onChange={e => setForm(f => ({ ...f, salePrice: e.target.value }))} />
              </div>
              <div>
                <label className="font-semibold mb-1 block">SKU</label>
                <input className="px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-300 w-full transition" value={form.sku} onChange={e => setForm(f => ({ ...f, sku: e.target.value }))} />
              </div>
              <div>
                <label className="font-semibold mb-1 block">Stock Quantity</label>
                <input type="number" className="px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-300 w-full transition" value={form.stockQty} onChange={e => setForm(f => ({ ...f, stockQty: e.target.value }))} />
              </div>
            </div>
            <div className="mt-6">
              <label className="font-semibold mb-1 block">Tags</label>
              <input className="px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-300 w-full transition" value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))} />
            </div>
            <div className="mt-6">
              <label className="font-semibold mb-1 block">Active Status</label>
              <select className="px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-300 w-full transition" value={form.active ? "true" : "false"} onChange={e => setForm(f => ({ ...f, active: e.target.value === "true" }))}>
                <option value="true">Active (Visible)</option>
                <option value="false">Inactive (Hidden)</option>
              </select>
            </div>
            <div className="mt-6">
              <label className="font-semibold mb-1 block">Has Variants?</label>
              <input type="checkbox" checked={form.hasVariants} onChange={e => setForm(f => ({ ...f, hasVariants: e.target.checked }))} />
            </div>
            {form.hasVariants && (
              <div className="mt-6 border rounded-xl p-4 bg-blue-50">
                <label className="font-semibold mb-2 block">Product Variants</label>
                {(form.variants || []).map((variant: any, idx: number) => (
                  <div key={idx} className="grid md:grid-cols-2 gap-4 mb-4 items-end">
                    <div>
                      <label className="text-sm font-semibold">Type</label>
                      <select className="px-2 py-2 rounded border w-full" value={variant.type || "color"} onChange={e => {
                        const variants = [...form.variants];
                        variants[idx].type = e.target.value;
                        if (e.target.value === "color") variants[idx].sizeName = "";
                        if (e.target.value === "size") variants[idx].colorName = "";
                        setForm(f => ({ ...f, variants }));
                      }}>
                        <option value="color">Color</option>
                        <option value="size">Size</option>
                      </select>
                    </div>
                    {variant.type === "color" && (
                      <div>
                        <label className="text-sm font-semibold">Color Name</label>
                        <input className="px-2 py-2 rounded border w-full" value={variant.colorName || ""} onChange={e => {
                          const variants = [...form.variants];
                          variants[idx].colorName = e.target.value;
                          setForm(f => ({ ...f, variants }));
                        }} />
                      </div>
                    )}
                    {variant.type === "size" && (
                      <div>
                        <label className="text-sm font-semibold">Size Name</label>
                        <input className="px-2 py-2 rounded border w-full" value={variant.sizeName || ""} onChange={e => {
                          const variants = [...form.variants];
                          variants[idx].sizeName = e.target.value;
                          setForm(f => ({ ...f, variants }));
                        }} />
                      </div>
                    )}
                    <div>
                      <button type="button" className="px-3 py-2 rounded bg-red-100 text-red-700 font-bold" onClick={() => {
                        const variants = [...form.variants];
                        variants.splice(idx, 1);
                        setForm(f => ({ ...f, variants }));
                      }}>Remove</button>
                    </div>
                  </div>
                ))}
                <button type="button" className="px-4 py-2 rounded bg-blue-600 text-white font-bold mt-2" onClick={() => setForm(f => ({ ...f, variants: [...(f.variants || []), { type: "color", colorName: "", sizeName: "" }] }))}>Add Variant</button>
              </div>
            )}
            {/* Next button */}
            <div className="mt-8 flex justify-end">
              <button type="submit" className="px-6 py-3 rounded-xl bg-blue-600 text-white font-bold shadow hover:bg-blue-700 transition">Next: Images</button>
            </div>
          </form>
        )}
        {/* Step 2: Image Upload */}
        {step === 2 && (
          <form autoComplete="off" onSubmit={handleSubmit}>
            <h2 className="text-xl font-bold text-primary mb-4">Product Images</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="font-semibold mb-1 block">Main Image</label>
                <input type="file" accept="image/*" onChange={e => setForm(f => ({ ...f, mainImage: e.target.files?.[0] }))} />
                {form.mainImage && <div className="mt-2 text-sm text-gray-600">Selected: {form.mainImage.name}</div>}
              </div>
              <div>
                <label className="font-semibold mb-1 block">Gallery Images</label>
                <input type="file" accept="image/*" multiple onChange={e => setForm(f => ({ ...f, gallery: Array.from(e.target.files || []) }))} />
                {form.gallery && form.gallery.length > 0 && <div className="mt-2 text-sm text-gray-600">{form.gallery.length} images selected</div>}
              </div>
            </div>
            <div className="mt-6">
              <label className="font-semibold mb-1 block">OG Image</label>
              <input type="file" accept="image/*" onChange={e => setForm(f => ({ ...f, ogImage: e.target.files?.[0] }))} />
              {form.ogImage && <div className="mt-2 text-sm text-gray-600">Selected: {form.ogImage.name}</div>}
            </div>
            <div className="mt-8 flex justify-between">
              <button type="button" className="px-6 py-3 rounded-xl bg-gray-200 text-gray-700 font-bold shadow hover:bg-gray-300 transition" onClick={() => setStep(1)}>Back</button>
              <button type="submit" className="px-6 py-3 rounded-xl bg-blue-600 text-white font-bold shadow hover:bg-blue-700 transition" disabled={loading}>{loading ? "Submitting..." : "Submit Product"}</button>
            </div>
          </form>
        )}
      </div>
    </AdminLayout>
  );
}
