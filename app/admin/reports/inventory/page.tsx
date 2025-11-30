
"use client";
import AdminLayout from "../../AdminLayout";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebaseClient";
import { collection, getDocs } from "firebase/firestore";


export default function InventoryReportPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        const snap = await getDocs(collection(db, "products"));
        setProducts(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  // Inventory logic
  const lowStock = products.filter(p => p.stockQty > 0 && p.stockQty < 20);
  const outOfStock = products.filter(p => !p.stockQty || p.stockQty === 0);
  const valuation = products.reduce((sum, p) => sum + (p.stockQty || 0) * (p.salePrice || p.regularPrice || 0), 0);

  return (
    <AdminLayout>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-extrabold text-primary">Inventory Report</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <div className="bg-white/90 rounded-2xl shadow p-6 text-center">
          <div className="text-lg font-bold text-primary mb-2">Valuation</div>
          <div className="text-3xl font-extrabold">₹{valuation.toLocaleString()}</div>
        </div>
      </div>

      {/* Active/Current Count Table */}
      <div className="mb-8 bg-white/90 rounded-2xl shadow p-6">
        <div className="font-bold text-lg mb-4 text-primary">Product Active & Current Count</div>
        {loading ? (
          <div className="p-4 text-blue-600 font-bold">Loading...</div>
        ) : (
          <table className="min-w-full text-sm">
            <thead>
              <tr>
                <th className="p-2 text-left">Product</th>
                <th className="p-2 text-left">SKU</th>
                <th className="p-2 text-left">Active</th>
                <th className="p-2 text-left">Current Stock</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr><td colSpan={4} className="p-4 text-red-600 font-bold">No products found.</td></tr>
              ) : products.map(p => (
                <tr key={p.sku} className="border-b last:border-none">
                  <td className="p-2">{p.name}</td>
                  <td className="p-2 font-mono text-xs">{p.sku}</td>
                  <td className="p-2 font-bold text-green-600">{p.active ? "Yes" : "No"}</td>
                  <td className="p-2 font-bold">{p.stockQty}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white/90 rounded-2xl shadow p-6">
          <div className="font-bold text-lg mb-2 text-primary">Low Stock Products</div>
          <div className="mb-4 text-gray-600 text-sm">Low Stock Product (Qty &lt; 20)</div>
          {loading ? (
            <div className="p-4 text-blue-600 font-bold">Loading...</div>
          ) : (
            <table className="min-w-full text-sm">
              <thead>
                <tr>
                  <th className="p-2 text-left">Product</th>
                  <th className="p-2 text-left">SKU</th>
                  <th className="p-2 text-left">Stock</th>
                </tr>
              </thead>
              <tbody>
                {lowStock.length === 0 ? (
                  <tr><td colSpan={3} className="p-4 text-red-600 font-bold">No low stock products.</td></tr>
                ) : lowStock.map(p => (
                  <tr key={p.sku} className="border-b last:border-none">
                    <td className="p-2">{p.name}</td>
                    <td className="p-2 font-mono text-xs">{p.sku}</td>
                    <td className="p-2 font-bold text-red-600">{p.stockQty}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <div className="bg-white/90 rounded-2xl shadow p-6">
          <div className="font-bold text-lg mb-4 text-primary">Out of Stock</div>
          {loading ? (
            <div className="p-4 text-blue-600 font-bold">Loading...</div>
          ) : (
            <table className="min-w-full text-sm">
              <thead>
                <tr>
                  <th className="p-2 text-left">Product</th>
                  <th className="p-2 text-left">SKU</th>
                </tr>
              </thead>
              <tbody>
                {outOfStock.length === 0 ? (
                  <tr><td colSpan={2} className="p-4 text-red-600 font-bold">No out of stock products.</td></tr>
                ) : outOfStock.map(p => (
                  <tr key={p.sku} className="border-b last:border-none">
                    <td className="p-2">{p.name}</td>
                    <td className="p-2 font-mono text-xs">{p.sku}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
