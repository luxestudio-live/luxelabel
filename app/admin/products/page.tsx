
"use client";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebaseClient";
import { collection, getDocs, query, where } from "firebase/firestore";
import AdminLayout from "../AdminLayout";
import Link from "next/link";

export default function ProductsPage() {
  const [filter, setFilter] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteIdx, setDeleteIdx] = useState<number|null>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [status, setStatus] = useState("");
  useEffect(() => {
    async function fetchProducts() {
      const snapshot = await getDocs(collection(db, "products"));
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProducts(items);
    }
    fetchProducts();
  }, []);
  const filteredProducts = filter ? products.filter(p => p.category === filter) : products;
  const handleDelete = (idx: number) => {
    setDeleteIdx(idx);
    setShowConfirm(true);
  };
  const confirmDelete = async () => {
    if (deleteIdx === null) return;
    setStatus("Deleting product...");
    const sku = filteredProducts[deleteIdx].sku;
    try {
      // Find Firestore document ID by SKU
      const productsRef = collection(db, "products");
      const q = query(productsRef, where("sku", "==", sku));
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) throw new Error("Product not found");
      const docId = querySnapshot.docs[0].id;
      // Delete document
      const { deleteDoc, doc } = await import("firebase/firestore");
      await deleteDoc(doc(db, "products", docId));
      setStatus("Product deleted successfully!");
      // Remove from local state
      setProducts(products => products.filter(p => p.sku !== sku));
    } catch (err: any) {
      setStatus(err?.message || "Failed to delete product.");
    } finally {
      setShowConfirm(false);
      setDeleteIdx(null);
      setTimeout(() => setStatus(""), 2000);
    }
  };
  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-extrabold text-primary">Products</h1>
        <Link href="/admin/products/add" className="px-5 py-2 rounded-xl bg-primary text-white font-bold shadow hover:bg-blue-700 transition">+ Add Product</Link>
      </div>
      <div className="mb-6 flex gap-4 items-center">
        <select className="px-3 py-2 rounded border" value={filter} onChange={e => setFilter(e.target.value)}>
          <option value="">All Categories</option>
          <option value="Dresses">Dresses</option>
          <option value="Accessories">Accessories</option>
          <option value="Jewelry">Jewelry</option>
        </select>
      </div>
      {status && (
        <div className="mb-4 text-center font-bold text-blue-600">{status}</div>
      )}
      <div className="overflow-x-auto rounded-2xl shadow bg-white/90">
        <table className="min-w-full text-sm">
          <thead className="bg-linear-to-r from-blue-100 via-purple-100 to-pink-100">
            <tr>
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">SKU</th>
              <th className="p-4 text-left">Price</th>
              <th className="p-4 text-left">Sale Price</th>
              <th className="p-4 text-left">Stock</th>
              <th className="p-4 text-left">Category</th>
              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((p, idx) => (
              <tr key={p.sku} className="border-b last:border-none hover:bg-blue-50/30">
                <td className="p-4 font-bold text-primary">{p.name}</td>
                <td className="p-4 font-mono text-xs">{p.sku}</td>
                <td className="p-4">₹{p.regularPrice}</td>
                <td className="p-4">₹{p.salePrice || '-'}</td>
                <td className="p-4">{p.stockQty}</td>
                <td className="p-4">{p.category}</td>
                <td className="p-4 flex gap-2">
                  <Link href={`/admin/products/edit/${p.sku}`} className="px-3 py-1 rounded bg-blue-100 text-blue-700 font-semibold hover:bg-blue-200">Edit</Link>
                  <button className="px-3 py-1 rounded bg-red-100 text-red-700 font-semibold hover:bg-red-200" onClick={() => handleDelete(idx)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showConfirm && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-sm w-full text-center">
            <div className="text-xl font-bold mb-4">Confirm Delete</div>
            <div className="mb-6">Are you sure you want to delete this product?</div>
            <div className="flex gap-4 justify-center">
              <button className="px-5 py-2 rounded-xl bg-red-600 text-white font-bold shadow hover:bg-red-700 transition" onClick={confirmDelete}>Delete</button>
              <button className="px-5 py-2 rounded-xl bg-gray-200 text-gray-700 font-bold shadow hover:bg-gray-300 transition" onClick={() => setShowConfirm(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}