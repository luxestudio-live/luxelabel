"use client";
import AdminLayout from "../../AdminLayout";

const dummyInventory = {
  lowStock: [
    { name: "Luxury Silk Dress", sku: "LSK-001", stock: 3 },
    { name: "Gold Earrings", sku: "GE-002", stock: 2 },
  ],
  outOfStock: [
    { name: "Designer Handbag", sku: "DH-003" },
  ],
  valuation: 85000,
};

export default function InventoryReportPage() {
  return (
    <AdminLayout>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-extrabold text-primary">Inventory Report</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <div className="bg-white/90 rounded-2xl shadow p-6 text-center">
          <div className="text-lg font-bold text-primary mb-2">Valuation</div>
          <div className="text-3xl font-extrabold">₹{dummyInventory.valuation.toLocaleString()}</div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white/90 rounded-2xl shadow p-6">
          <div className="font-bold text-lg mb-4 text-primary">Low Stock Products</div>
          <table className="min-w-full text-sm">
            <thead>
              <tr>
                <th className="p-2 text-left">Product</th>
                <th className="p-2 text-left">SKU</th>
                <th className="p-2 text-left">Stock</th>
              </tr>
            </thead>
            <tbody>
              {dummyInventory.lowStock.map(p => (
                <tr key={p.sku} className="border-b last:border-none">
                  <td className="p-2">{p.name}</td>
                  <td className="p-2 font-mono text-xs">{p.sku}</td>
                  <td className="p-2 font-bold text-red-600">{p.stock}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="bg-white/90 rounded-2xl shadow p-6">
          <div className="font-bold text-lg mb-4 text-primary">Out of Stock</div>
          <table className="min-w-full text-sm">
            <thead>
              <tr>
                <th className="p-2 text-left">Product</th>
                <th className="p-2 text-left">SKU</th>
              </tr>
            </thead>
            <tbody>
              {dummyInventory.outOfStock.map(p => (
                <tr key={p.sku} className="border-b last:border-none">
                  <td className="p-2">{p.name}</td>
                  <td className="p-2 font-mono text-xs">{p.sku}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
