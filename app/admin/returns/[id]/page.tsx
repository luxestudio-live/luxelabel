"use client";
import AdminLayout from "../../AdminLayout";

const dummyReturn = {
  id: "R1001",
  orderId: "ORD1001",
  customer: "Jane Doe",
  items: [
    { product: "Luxury Silk Dress", sku: "LSK-001", qty: 1 },
  ],
  reason: "Wrong size",
  resolution: "Refund",
  notes: "Customer requested refund, processed on 2025-11-22.",
  status: "resolved",
  updates: [
    { status: "open", date: "2025-11-22" },
    { status: "resolved", date: "2025-11-23" },
  ],
};

export default function ReturnDetailPage() {
  const r = dummyReturn;
  return (
    <AdminLayout>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-primary">Return {r.id}</h1>
          <div className="text-muted-foreground text-sm">Order: {r.orderId} | Customer: {r.customer}</div>
        </div>
      </div>
      {/* Items */}
      <div className="mb-8 bg-white/90 rounded-2xl shadow p-6">
        <h2 className="font-bold text-lg mb-4 text-primary">Items</h2>
        <table className="min-w-full text-sm">
          <thead className="bg-linear-to-r from-blue-100 via-purple-100 to-pink-100">
            <tr>
              <th className="p-2 text-left">Product</th>
              <th className="p-2 text-left">SKU</th>
              <th className="p-2 text-left">Qty</th>
            </tr>
          </thead>
          <tbody>
            {r.items.map(item => (
              <tr key={item.sku} className="border-b last:border-none">
                <td className="p-2">{item.product}</td>
                <td className="p-2 font-mono text-xs">{item.sku}</td>
                <td className="p-2">{item.qty}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Reason & Resolution */}
      <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white/90 rounded-2xl shadow p-6">
          <h2 className="font-bold text-lg mb-2 text-primary">Reason</h2>
          <div>{r.reason}</div>
        </div>
        <div className="bg-white/90 rounded-2xl shadow p-6">
          <h2 className="font-bold text-lg mb-2 text-primary">Resolution</h2>
          <div>{r.resolution}</div>
        </div>
      </div>
      {/* Notes & Status Updates */}
      <div className="mb-8 bg-white/90 rounded-2xl shadow p-6">
        <h2 className="font-bold text-lg mb-4 text-primary">Internal Notes</h2>
        <div className="mb-2">{r.notes}</div>
        <h2 className="font-bold text-lg mb-4 text-primary">Status Updates</h2>
        <ol className="list-decimal ml-6">
          {r.updates.map(u => (
            <li key={u.status} className="mb-2">
              <span className="font-bold">{u.status}</span> <span className="text-muted-foreground">{u.date}</span>
            </li>
          ))}
        </ol>
      </div>
    </AdminLayout>
  );
}

