"use client";
import AdminLayout from "../../AdminLayout";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { handleUpdateProduct, handleDeleteProduct, fetchProductById } from "../addProductLogic";
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

export default function EditProductPage({ params }: { params: { sku: string } }) {
  console.log("EditProductPage mounted, params:", params); // Debug log

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<any>(null);
  const [removeImages, setRemoveImages] = useState<string[]>([]);

  useEffect(() => {
    async function loadProduct() {
      setLoading(true);
      console.log('Fetching product for SKU:', params.sku); // Debug log before fetch
      try {
        const product = await fetchProductById(params.sku);
        setForm(product);
        console.log('Fetched product:', product); // Debug output
      } catch (err: any) {
        console.error('Error fetching product:', err); // Debug error log
        setError("Failed to load product.");
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [params.sku]);

  // TipTap editor setup
  const editor = useEditor({
    extensions: [StarterKit],
    content: form?.fullDesc || "",
    onUpdate: ({ editor }) => {
      setForm((f: any) => ({ ...f, fullDesc: editor.getHTML() }));
    },
    immediatelyRender: false,
  });

  const handleNameChange = (e: any) => {
    const name = e.target.value;
    setForm((f: any) => ({ ...f, name, slug: name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") }));
  };

  const handleUpdate = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      await handleUpdateProduct(form, removeImages);
      setSuccess("Product updated successfully!");
      setTimeout(() => {
        router.push("/admin/products");
      }, 500);
    } catch (err: any) {
      setError(err?.message || "Failed to update product.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    setError("");
    try {
      await handleDeleteProduct(form.sku);
      setSuccess("Product deleted successfully!");
      setTimeout(() => {
        router.push("/admin/products");
      }, 500);
    } catch (err: any) {
      setError(err?.message || "Failed to delete product.");
    } finally {
      setLoading(false);
    }
  };

  if (!form) return <AdminLayout><div>Loading...</div></AdminLayout>;

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto p-8 bg-white rounded-2xl shadow-xl">
        <div className="flex gap-4 mb-8">
          <button type="button" className={`px-4 py-2 rounded-xl font-bold shadow ${step === 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`} onClick={() => setStep(1)}>Step 1: Product Data</button>
          <button type="button" className={`px-4 py-2 rounded-xl font-bold shadow ${step === 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`} onClick={() => setStep(2)}>Step 2: Images</button>
        </div>
        {loading && <div className="text-blue-600 font-bold mb-4">Processing, please wait...</div>}
        {error && <div className="bg-red-100 text-red-800 rounded-xl px-4 py-3 text-center font-bold shadow mb-4">{error}</div>}
        {success && <div className="bg-green-100 text-green-800 rounded-xl px-4 py-3 text-center font-bold shadow mb-4">{success}</div>}
        <div className="flex gap-4 items-center mb-6">
          <h1 className="text-3xl font-extrabold text-primary">Edit Product</h1>
          <Link href="/admin/products" className="px-4 py-2 rounded-xl bg-gray-200 text-gray-700 font-bold shadow hover:bg-gray-300 transition">← Back to Products</Link>
          <button type="button" className="px-4 py-2 rounded-xl bg-red-600 text-white font-bold shadow hover:bg-red-700 transition" onClick={handleDelete}>Delete Product</button>
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
                <input className="px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-300 w-full transition" value={form.slug} onChange={e => setForm((f: any) => ({ ...f, slug: e.target.value }))} />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-6 mt-6">
              <div>
                <label className="font-semibold mb-1 block">Short Description</label>
                <input className="px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-300 w-full transition" value={form.shortDesc} onChange={e => setForm((f: any) => ({ ...f, shortDesc: e.target.value }))} />
              </div>
              <div>
                <label className="font-semibold mb-1 block">Category</label>
                <select className="px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-300 w-full transition" value={form.category} onChange={e => setForm((f: any) => ({ ...f, category: e.target.value }))}>
                  <option value="">Select Category</option>
                  <option value="Dresses">Dresses</option>
                  <option value="Accessories">Accessories</option>
                  <option value="Jewelry">Jewelry</option>
                </select>
              </div>
            </div>
            <div className="mt-6">
              <label className="font-semibold mb-1 block">Full Description (Rich Text)</label>
              <div className="bg-white rounded-xl border shadow focus-within:ring-2 focus-within:ring-blue-300 p-4 min-h-80 overflow-hidden">
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
                <input type="number" className="px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-300 w-full transition" value={form.regularPrice} onChange={e => setForm((f: any) => ({ ...f, regularPrice: e.target.value }))} />
              </div>
              <div>
                <label className="font-semibold mb-1 block">Sale Price (INR)</label>
                <input type="number" className="px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-300 w-full transition" value={form.salePrice || ""} onChange={e => setForm((f: any) => ({ ...f, salePrice: e.target.value }))} />
              </div>
              <div>
                <label className="font-semibold mb-1 block">SKU</label>
                <input className="px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-300 w-full transition" value={form.sku} onChange={e => setForm((f: any) => ({ ...f, sku: e.target.value }))} />
              </div>
              <div>
                <label className="font-semibold mb-1 block">Stock Quantity</label>
                <input type="number" className="px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-300 w-full transition" value={form.stockQty} onChange={e => setForm((f: any) => ({ ...f, stockQty: e.target.value }))} />
              </div>
            </div>
            <div className="mt-6">
              <label className="font-semibold mb-1 block">Tags</label>
              <input className="px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-300 w-full transition" value={form.tags} onChange={e => setForm((f: any) => ({ ...f, tags: e.target.value }))} />
            </div>
            <div className="mt-6">
              <label className="font-semibold mb-1 block">Active Status</label>
              <select className="px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-300 w-full transition" value={form.active ? "true" : "false"} onChange={e => setForm((f: any) => ({ ...f, active: e.target.value === "true" }))}>
                <option value="true">Active (Visible)</option>
                <option value="false">Inactive (Hidden)</option>
              </select>
            </div>
            <div className="mt-6">
              <label className="font-semibold mb-1 block">Has Variants?</label>
              <input type="checkbox" checked={form.hasVariants} onChange={e => setForm((f: any) => ({ ...f, hasVariants: e.target.checked }))} />
            </div>
            {form.hasVariants && (
              <div className="mt-6 border rounded-xl p-4 bg-blue-50">
                <label className="font-semibold mb-2 block">Product Variants</label>
                {(form.variants || []).map((variant: any, idx: number) => (
                  <div key={idx} className="grid md:grid-cols-5 gap-4 mb-4 items-end">
                    <div>
                      <label className="text-sm font-semibold">Type</label>
                      <select className="px-2 py-2 rounded border w-full" value={variant.type || "color"} onChange={e => {
                        const variants = [...form.variants];
                        variants[idx].type = e.target.value;
                        if (e.target.value === "color") variants[idx].size = "";
                        if (e.target.value === "size") variants[idx].color = "";
                        setForm((f: any) => ({ ...f, variants }));
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
                          setForm((f: any) => ({ ...f, variants }));
                        }} />
                      </div>
                    )}
                    {variant.type === "size" && (
                      <>
                        <div>
                          <label className="text-sm font-semibold">Size Name</label>
                          <input className="px-2 py-2 rounded border w-full" value={variant.sizeName || ""} onChange={e => {
                            const variants = [...form.variants];
                            variants[idx].sizeName = e.target.value;
                            setForm((f: any) => ({ ...f, variants }));
                          }} />
                        </div>
                        <div>
                          <label className="text-sm font-semibold">Width</label>
                          <input className="px-2 py-2 rounded border w-full" value={variant.width || ""} onChange={e => {
                            const variants = [...form.variants];
                            variants[idx].width = e.target.value;
                            setForm((f: any) => ({ ...f, variants }));
                          }} />
                        </div>
                        <div>
                          <label className="text-sm font-semibold">Bust</label>
                          <input className="px-2 py-2 rounded border w-full" value={variant.bust || ""} onChange={e => {
                            const variants = [...form.variants];
                            variants[idx].bust = e.target.value;
                            setForm((f: any) => ({ ...f, variants }));
                          }} />
                        </div>
                        <div>
                          <label className="text-sm font-semibold">Sleeve Length</label>
                          <input className="px-2 py-2 rounded border w-full" value={variant.sleeveLength || ""} onChange={e => {
                            const variants = [...form.variants];
                            variants[idx].sleeveLength = e.target.value;
                            setForm((f: any) => ({ ...f, variants }));
                          }} />
                        </div>
                      </>
                    )}
                    <div>
                      <label className="text-sm font-semibold">Price</label>
                      <input type="number" className="px-2 py-2 rounded border w-full" value={variant.price || ""} onChange={e => {
                        const variants = [...form.variants];
                        variants[idx].price = e.target.value;
                        setForm((f: any) => ({ ...f, variants }));
                      }} />
                    </div>
                    <div>
                      <label className="text-sm font-semibold">Stock Qty</label>
                      <input type="number" className="px-2 py-2 rounded border w-full" value={variant.stockQty || ""} onChange={e => {
                        const variants = [...form.variants];
                        variants[idx].stockQty = e.target.value;
                        setForm((f: any) => ({ ...f, variants }));
                      }} />
                    </div>
                    <div>
                      <button type="button" className="px-3 py-2 rounded bg-red-100 text-red-700 font-bold" onClick={() => {
                        const variants = [...form.variants];
                        variants.splice(idx, 1);
                        setForm((f: any) => ({ ...f, variants }));
                      }}>Remove</button>
                    </div>
                  </div>
                ))}
                <button type="button" className="px-4 py-2 rounded bg-blue-600 text-white font-bold mt-2" onClick={() => setForm((f: any) => ({ ...f, variants: [...(f.variants || []), { type: "color", color: "", size: "", price: "", stockQty: "" }] }))}>Add Variant</button>
              </div>
            )}
            <div className="mt-8 flex justify-end">
              <button type="submit" className="px-6 py-3 rounded-xl bg-blue-600 text-white font-bold shadow hover:bg-blue-700 transition">Next: Images</button>
            </div>
          </form>
        )}
        {/* Step 2: Image Edit */}
        {step === 2 && (
          <form autoComplete="off" onSubmit={handleUpdate}>
            <h2 className="text-xl font-bold text-primary mb-4">Product Images</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="font-semibold mb-1 block">Main Image</label>
                {form.mainImage && (
                  <div className="mb-2">
                    <img src={form.mainImage.url || form.mainImage} alt="Main" className="rounded-xl w-32 h-32 object-cover" />
                    <button type="button" className="ml-2 px-2 py-1 rounded bg-red-100 text-red-700 font-bold" onClick={() => setRemoveImages(imgs => [...imgs, form.mainImage.url || form.mainImage])}>Remove</button>
                  </div>
                )}
                <input type="file" accept="image/*" onChange={e => setForm((f: any) => ({ ...f, mainImage: e.target.files?.[0] }))} />
              </div>
              <div>
                <label className="font-semibold mb-1 block">Gallery Images</label>
                {form.gallery && form.gallery.length > 0 && (
                  <div className="mb-2 flex flex-wrap gap-2">
                    {form.gallery.map((img: any, idx: number) => (
                      <div key={idx} className="relative">
                        <img src={img.url || img} alt={`Gallery ${idx}`} className="rounded-xl w-24 h-24 object-cover" />
                        <button type="button" className="absolute top-1 right-1 px-2 py-1 rounded bg-red-100 text-red-700 font-bold" onClick={() => setRemoveImages(imgs => [...imgs, img.url || img])}>Remove</button>
                      </div>
                    ))}
                  </div>
                )}
                <input type="file" accept="image/*" multiple onChange={e => setForm((f: any) => ({ ...f, gallery: [...(Array.isArray(f.gallery) ? f.gallery : []), ...Array.from(e.target.files || [])] }))} />
              </div>
            </div>
            <div className="mt-6">
              <label className="font-semibold mb-1 block">OG Image</label>
              {form.ogImage && (
                <div className="mb-2">
                  <img src={form.ogImage.url || form.ogImage} alt="OG" className="rounded-xl w-32 h-32 object-cover" />
                  <button type="button" className="ml-2 px-2 py-1 rounded bg-red-100 text-red-700 font-bold" onClick={() => setRemoveImages(imgs => [...imgs, form.ogImage.url || form.ogImage])}>Remove</button>
                </div>
              )}
              <input type="file" accept="image/*" onChange={e => setForm((f: any) => ({ ...f, ogImage: e.target.files?.[0] }))} />
            </div>
            <div className="mt-8 flex justify-between">
              <button type="button" className="px-6 py-3 rounded-xl bg-gray-200 text-gray-700 font-bold shadow hover:bg-gray-300 transition" onClick={() => setStep(1)}>Back</button>
              <button type="submit" className="px-6 py-3 rounded-xl bg-blue-600 text-white font-bold shadow hover:bg-blue-700 transition">Update Product</button>
            </div>
          </form>
        )}
      </div>
    </AdminLayout>
  );
}
