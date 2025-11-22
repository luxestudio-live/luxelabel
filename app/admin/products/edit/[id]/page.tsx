"use client";
import AdminLayout from "../../../AdminLayout";
import { useState } from "react";
import { useParams } from "next/navigation";

const dummyProducts = [
  {
    id: "LSK-001",
    name: "Luxury Silk Dress",
    sku: "LSK-001",
    price: "4999",
    stock: "12",
    category: "Dresses",
    description: "A premium silk dress for luxury occasions.",
  },
  {
    id: "DH-003",
    name: "Designer Handbag",
    sku: "DH-003",
    price: "7999",
    stock: "5",
    category: "Accessories",
    description: "A stylish designer handbag for all occasions.",
  },
];

export default function EditProductPage() {
  const params = useParams();
  let productId = "";
  if (params && "id" in params) {
    if (typeof params.id === "string") {
      productId = params.id;
    } else if (Array.isArray(params.id)) {
      productId = params.id[0];
    }
  }
  const product = dummyProducts.find(p => p.id === productId) || dummyProducts[0];
  const [form, setForm] = useState(product);
  return (
    <AdminLayout>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-extrabold text-primary">Edit Product</h1>
      </div>
      <form className="bg-white/90 rounded-2xl shadow p-8 max-w-2xl mx-auto grid gap-6">
        <input className="px-4 py-3 rounded-xl border" placeholder="Product Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
        <input className="px-4 py-3 rounded-xl border" placeholder="SKU" value={form.sku} onChange={e => setForm({ ...form, sku: e.target.value })} />
        <input className="px-4 py-3 rounded-xl border" placeholder="Price (INR)" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />
        <input className="px-4 py-3 rounded-xl border" placeholder="Stock" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} />
        <input className="px-4 py-3 rounded-xl border" placeholder="Category" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} />
        <textarea className="px-4 py-3 rounded-xl border" placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
        <button type="submit" className="px-6 py-3 rounded-xl bg-primary text-white font-bold shadow hover:bg-blue-700 transition">Save Changes</button>
      </form>
    </AdminLayout>
  );
}
