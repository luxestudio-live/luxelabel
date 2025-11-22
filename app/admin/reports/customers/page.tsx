"use client";
import AdminLayout from "../../AdminLayout";

const dummyCustomers = {
  new: 42,
  returning: 78,
  topCustomers: [
    { name: "Jane Doe", orders: 12, revenue: 25000 },
    { name: "Rahul Singh", orders: 9, revenue: 18000 },
    { name: "Priya Patel", orders: 7, revenue: 14000 },
  ],
};

export default function CustomerReportPage() {
  return (
    <AdminLayout>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-extrabold text-primary">Customer Report</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="bg-white/90 rounded-2xl shadow p-6 text-center">
          <div className="text-lg font-bold text-primary mb-2">New Customers</div>
          <div className="text-3xl font-extrabold">{dummyCustomers.new}</div>
        </div>
        <div className="bg-white/90 rounded-2xl shadow p-6 text-center">
          <div className="text-lg font-bold text-primary mb-2">Returning Customers</div>
          <div className="text-3xl font-extrabold">{dummyCustomers.returning}</div>
        </div>
      </div>
      <div className="bg-white/90 rounded-2xl shadow p-6">
        <div className="font-bold text-lg mb-4 text-primary">Top Customers</div>
        <table className="min-w-full text-sm">
          <thead>
            <tr>
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">Orders</th>
              <th className="p-2 text-left">Revenue</th>
            </tr>
          </thead>
          <tbody>
            {dummyCustomers.topCustomers.map(c => (
              <tr key={c.name} className="border-b last:border-none">
                <td className="p-2">{c.name}</td>
                <td className="p-2 font-bold text-primary">{c.orders}</td>
                <td className="p-2 font-bold text-green-700">₹{c.revenue.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
