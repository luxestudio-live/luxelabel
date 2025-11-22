export function generateStaticParams() {
  // Dummy order IDs for static export
  return [
    { id: "ORD1001" },
    { id: "ORD1002" },
    { id: "ORD1003" },
  ];
}
import Link from "next/link";
import AdminLayout from "../../AdminLayout";

const dummyOrder = {
  id: "ORD1001",
  created: "2025-11-21 10:30",
  source: "Website",
  notes: "Express shipping requested.",
  customer: {
    name: "Jane Doe",
    email: "jane@example.com",
    phone: "+91-9876543210",
    profile: "/admin/customers/1",
  },
  billing: {
    name: "Jane Doe",
    address: "123 Main St, Mumbai",
    city: "Mumbai",
    zip: "400001",
    country: "India",
  },
  shipping: {
    name: "Jane Doe",
    address: "123 Main St, Mumbai",
    city: "Mumbai",
    zip: "400001",
    country: "India",
  },
  items: [
    { product: "Luxury Silk Dress", sku: "LSK-001", qty: 1, price: 4999, discount: 0, total: 4999 },
    { product: "Premium Leather Bag", sku: "PLB-002", qty: 1, price: 7999, discount: 500, total: 7499 },
  ],
  totals: {
    subtotal: 12498,
    shipping: 200,
    tax: 500,
    discounts: 500,
    grand: 12698,
    paid: 12698,
    remaining: 0,
  },
  timeline: [
    { status: "Placed", date: "2025-11-21 10:30" },
    { status: "Paid", date: "2025-11-21 10:35" },
    { status: "Shipped", date: "2025-11-21 14:00" },
    { status: "Delivered", date: "2025-11-22 09:00" },
  ],
};

export default function OrderDetailPage() {
  const o = dummyOrder;
  return (
    <AdminLayout>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-primary">Order {o.id}</h1>
          <div className="text-muted-foreground text-sm">Created: {o.created} | Source: {o.source}</div>
        </div>
        <div>
          <Link href="#" className="px-4 py-2 rounded-xl bg-primary text-white font-bold shadow hover:bg-blue-700 transition">Print Invoice</Link>
        </div>
      </div>
      {/* Customer & Addresses */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <div className="bg-white/90 rounded-2xl shadow p-6">
          <h2 className="font-bold text-lg mb-2 text-primary">Customer</h2>
          <div>{o.customer.name}</div>
          <div className="text-sm text-muted-foreground">{o.customer.email}</div>
          <div className="text-sm">{o.customer.phone}</div>
          <Link href={o.customer.profile} className="text-blue-700 underline text-xs mt-2 inline-block">View Profile</Link>
        </div>
        <div className="bg-white/90 rounded-2xl shadow p-6">
          <h2 className="font-bold text-lg mb-2 text-primary">Billing Address</h2>
          <div>{o.billing.name}</div>
          <div>{o.billing.address}</div>
          <div>{o.billing.city}, {o.billing.zip}</div>
          <div>{o.billing.country}</div>
        </div>
        <div className="bg-white/90 rounded-2xl shadow p-6">
          <h2 className="font-bold text-lg mb-2 text-primary">Shipping Address</h2>
          <div>{o.shipping.name}</div>
          <div>{o.shipping.address}</div>
          <div>{o.shipping.city}, {o.shipping.zip}</div>
          <div>{o.shipping.country}</div>
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
              <th className="p-2 text-left">Price</th>
              <th className="p-2 text-left">Discount</th>
              <th className="p-2 text-left">Line Total</th>
            </tr>
          </thead>
          <tbody>
            {o.items.map((item, idx) => (
              <tr key={idx} className="border-b last:border-none">
                <td className="p-2">{item.product}</td>
                <td className="p-2 font-mono text-xs">{item.sku}</td>
                <td className="p-2">{item.qty}</td>
                <td className="p-2">₹{item.price}</td>
                <td className="p-2">₹{item.discount}</td>
                <td className="p-2 font-semibold text-blue-700">₹{item.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Totals */}
      <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white/90 rounded-2xl shadow p-6">
          <h2 className="font-bold text-lg mb-2 text-primary">Totals</h2>
          <div>Subtotal: ₹{o.totals.subtotal}</div>
          <div>Shipping: ₹{o.totals.shipping}</div>
          <div>Tax: ₹{o.totals.tax}</div>
          <div>Discounts: ₹{o.totals.discounts}</div>
          <div className="font-bold mt-2">Grand Total: ₹{o.totals.grand}</div>
          <div>Paid: ₹{o.totals.paid}</div>
          <div>Remaining: ₹{o.totals.remaining}</div>
        </div>
        <div className="bg-white/90 rounded-2xl shadow p-6">
          <h2 className="font-bold text-lg mb-2 text-primary">Notes & Actions</h2>
          <div className="mb-2">{o.notes}</div>
          <div className="flex flex-wrap gap-2 mt-2">
            <button className="px-3 py-1 rounded bg-blue-100 text-blue-700 font-semibold hover:bg-blue-200">Update Status</button>
            <button className="px-3 py-1 rounded bg-green-100 text-green-700 font-semibold hover:bg-green-200">Add Tracking</button>
            <button className="px-3 py-1 rounded bg-yellow-100 text-yellow-700 font-semibold hover:bg-yellow-200">Resend Email</button>
            <button className="px-3 py-1 rounded bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200">Edit Notes</button>
            <button className="px-3 py-1 rounded bg-red-100 text-red-700 font-semibold hover:bg-red-200">Refund</button>
            <button className="px-3 py-1 rounded bg-purple-100 text-purple-700 font-semibold hover:bg-purple-200">Print/Download Invoice</button>
          </div>
        </div>
      </div>
      {/* Timeline */}
      <div className="mb-8 bg-white/90 rounded-2xl shadow p-6">
        <h2 className="font-bold text-lg mb-4 text-primary">Timeline</h2>
        <ol className="list-decimal ml-6">
          {o.timeline.map((t, idx) => (
            <li key={idx} className="mb-2">
              <span className="font-bold">{t.status}</span> <span className="text-muted-foreground">{t.date}</span>
            </li>
          ))}
        </ol>
      </div>
    </AdminLayout>
  );
}
