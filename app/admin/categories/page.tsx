"use client";
import AdminLayout from "../AdminLayout";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebaseClient";
import { collection, addDoc, getDocs } from "firebase/firestore";
export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [form, setForm] = useState({ name: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    async function fetchCategories() {
      const catSnap = await getDocs(collection(db, "categories"));
      const cats = catSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      // For each category, count products
      const prodSnap = await getDocs(collection(db, "products"));
      const products = prodSnap.docs.map(doc => doc.data());
      cats.forEach(cat => {
        cat.count = products.filter(p => p.category === cat.name).length;
      });
      setCategories(cats);
    }
    fetchCategories();
  }, []);

  const handleAddCategory = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      if (!form.name.trim()) throw new Error("Category name required");
      await addDoc(collection(db, "categories"), { name: form.name });
      setSuccess("Category added!");
      setForm({ name: "" });
      // Refresh categories
      const catSnap = await getDocs(collection(db, "categories"));
      const cats = catSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const prodSnap = await getDocs(collection(db, "products"));
      const products = prodSnap.docs.map(doc => doc.data());
      cats.forEach(cat => {
        cat.count = products.filter(p => p.category === cat.name).length;
      });
      setCategories(cats);
    } catch (err: any) {
      setError(err.message || "Failed to add category");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-extrabold text-primary">Categories</h1>
      </div>
      {/* Category List */}
      <div className="mb-8 overflow-x-auto rounded-2xl shadow bg-white/90">
        <table className="min-w-full text-sm">
          <thead className="bg-linear-to-r from-blue-100 via-purple-100 to-pink-100">
            <tr>
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Product Count</th>
            </tr>
          </thead>
          <tbody>
            {categories.map(c => (
              <tr key={c.id} className="border-b last:border-none hover:bg-blue-50/30">
                <td className="p-4 font-bold text-primary">{c.name}</td>
                <td className="p-4 font-semibold text-blue-700">{c.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Category Form */}
      <form className="grid grid-cols-1 gap-8 bg-white/80 rounded-2xl shadow p-8" onSubmit={handleAddCategory}>
        <div>
          <h2 className="font-bold text-lg mb-4 text-primary">Create Category</h2>
          <input
            className="mb-3 w-full px-4 py-2 rounded border"
            placeholder="Category Name"
            value={form.name}
            onChange={e => setForm({ name: e.target.value })}
          />
          <button
            type="submit"
            className="px-4 py-2 rounded bg-blue-600 text-white font-bold mt-2"
            disabled={loading}
          >{loading ? "Adding..." : "Add Category"}</button>
          {error && <div className="mt-2 text-red-600 font-bold">{error}</div>}
          {success && <div className="mt-2 text-green-600 font-bold">{success}</div>}
        </div>
      </form>
    </AdminLayout>
  );
}