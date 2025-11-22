export function generateStaticParams() {
  // Dummy customer IDs for static export
  return [
    { id: "1" },
    { id: "2" },
    { id: "3" },
  ];
}
import AdminLayout from "../../AdminLayout";
import Link from "next/link";

const dummyCustomer = {
  id: "1",
  name: "Jane Doe",
  email: "jane@example.com",
  phone: "+91-9876543210",
  created: "2025-10-01",
  tags: ["VIP", "Newsletter"],
  addresses: [
    { type: "Billing", address: "123 Main St, Mumbai", city: "Mumbai", zip: "400001", country: "India" },
    { type: "Shipping", address: "123 Main St, Mumbai", city: "Mumbai", zip: "400001", country: "India" },
  ],
  orders: [
    { id: "ORD1001", date: "2025-11-21", total: 4999 },
    { id: "ORD1002", date: "2025-10-15", total: 7999 },
  ],
  notes: "VIP customer, prefers express shipping.",
  lastLogin: "2025-11-22",
  consent: true,
};

export default function CustomerDetailPage() {
  const c = dummyCustomer;
  return (
    <AdminLayout>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-primary">{c.name}</h1>
          <div className="text-muted-foreground text-sm">{c.email} | {c.phone}</div>
          <div className="text-xs text-muted-foreground">Created: {c.created}</div>
          <div className="mt-2 flex gap-2">
            {c.tags.map(tag => (
              <span key={tag} className="px-2 py-1 rounded bg-blue-100 text-blue-700 text-xs font-semibold">{tag}</span>
            ))}
          </div>
        </div>
      </div>
      {/* Addresses */}
      <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        {c.addresses.map(addr => (
          <div key={addr.type} className="bg-white/90 rounded-2xl shadow p-6">
            <h2 className="font-bold text-lg mb-2 text-primary">{addr.type} Address</h2>
            <div>{addr.address}</div>
            <div>{addr.city}, {addr.zip}</div>
            <div>{addr.country}</div>
            <button className="mt-2 px-3 py-1 rounded bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200">Edit</button>
          </div>
        ))}
      </div>
      {/* Orders Tab */}
      <div className="mb-8 bg-white/90 rounded-2xl shadow p-6">
        <h2 className="font-bold text-lg mb-4 text-primary">Orders</h2>
        <table className="min-w-full text-sm">
          <thead className="bg-linear-to-r from-blue-100 via-purple-100 to-pink-100">
            <tr>
              <th className="p-2 text-left">Order ID</th>
              <th className="p-2 text-left">Date</th>
              <th className="p-2 text-left">Total</th>
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {c.orders.map(o => (
              <tr key={o.id} className="border-b last:border-none">
                <td className="p-2 font-mono text-xs">{o.id}</td>
                <td className="p-2">{o.date}</td>
                <td className="p-2 font-semibold text-blue-700">₹{o.total}</td>
                <td className="p-2">
                  <Link href={`/admin/orders/${o.id}`} className="px-3 py-1 rounded bg-blue-100 text-blue-700 font-semibold hover:bg-blue-200">View</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Activity/Notes */}
      <div className="mb-8 bg-white/90 rounded-2xl shadow p-6">
        <h2 className="font-bold text-lg mb-4 text-primary">Activity & Notes</h2>
        <div className="mb-2">Last Login: {c.lastLogin}</div>
        <div className="mb-2">Marketing Consent: {c.consent ? "Yes" : "No"}</div>
        <div className="mb-2">Admin Notes: {c.notes}</div>
        <button className="px-3 py-1 rounded bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200">Edit Notes</button>
      </div>
    </AdminLayout>
  );
}
