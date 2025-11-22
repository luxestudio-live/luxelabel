
"use client";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";


const order = {
  id: "ORD1001",
  date: "2025-11-01",
  status: "Shipped",
  paymentStatus: "Paid",
  trackingUrl: "#",
  transactionId: "TXN987654321",
  recipient: {
    name: "Jane Doe",
    address: "123, MG Road, Mumbai, Maharashtra, 400001",
    phone: "+91 9876543210",
    email: "jane@email.com",
  },
  paymentMethod: "Credit Card",
  items: [
    { id: 1, name: "Premium Silk Dress", variant: "Red, M", price: 4999, quantity: 1, image: "/dummy-dress.jpg" },
    { id: 2, name: "Luxury Leather Bag", variant: "Black", price: 7499, quantity: 2, image: "/dummy-bag.jpg" },
  ],
  subtotal: 19997,
  shipping: 199,
  discount: 500,
  tax: 800,
  total: 20696,
};

export default function OrderDetailPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-16 md:py-20 max-w-3xl">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-primary">Order Details</h1>
        <div className="bg-white dark:bg-card p-6 rounded-xl shadow-lg border border-border/30 space-y-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div>
              <div className="font-semibold text-lg">Order ID: <span className="font-mono">{order.id}</span></div>
              <div className="text-muted-foreground">Placed on {order.date}</div>
              <div className="mt-2"><span className="font-semibold">Status:</span> {order.status}</div>
              <div><span className="font-semibold">Payment Status:</span> {order.paymentStatus}</div>
            </div>
            <div className="flex gap-4 mt-4 md:mt-0">
              <a href={order.trackingUrl} className="text-primary underline">Track shipment</a>
              <button type="button" className="text-primary underline bg-transparent border-none p-0 cursor-pointer">Download invoice</button>
              <button type="button" className="text-primary underline bg-transparent border-none p-0 cursor-pointer">Request return / Raise issue</button>
            </div>
          </div>
          {/* Shipping Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="font-semibold mb-2">Shipping Info</h2>
              <div><span className="font-semibold">Recipient:</span> {order.recipient.name}</div>
              <div><span className="font-semibold">Address:</span> {order.recipient.address}</div>
              <div><span className="font-semibold">Phone:</span> {order.recipient.phone}</div>
              <div><span className="font-semibold">Email:</span> {order.recipient.email}</div>
            </div>
            <div>
              <h2 className="font-semibold mb-2">Payment Info</h2>
              <div><span className="font-semibold">Method:</span> {order.paymentMethod}</div>
              <div><span className="font-semibold">Transaction ID:</span> {order.transactionId}</div>
            </div>
          </div>
          {/* Items List */}
          <div>
            <h2 className="font-semibold mb-2">Items</h2>
            <table className="w-full text-left">
              <thead className="bg-secondary/20">
                <tr>
                  <th className="p-3">Product</th>
                  <th className="p-3">Variant</th>
                  <th className="p-3">Price (INR)</th>
                  <th className="p-3">Qty</th>
                  <th className="p-3">Total (INR)</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map(item => (
                  <tr key={item.id} className="border-b">
                    <td className="p-3 flex items-center gap-3">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                        {/* Replace with actual image */}
                        <span className="text-xs text-muted-foreground">Image</span>
                      </div>
                      <span className="font-semibold">{item.name}</span>
                    </td>
                    <td className="p-3">{item.variant}</td>
                    <td className="p-3">₹{item.price.toLocaleString()}</td>
                    <td className="p-3">{item.quantity}</td>
                    <td className="p-3 font-bold">₹{(item.price * item.quantity).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Cost Breakdown */}
          <div className="bg-secondary/10 p-4 rounded-xl">
            <h2 className="font-semibold mb-2">Cost Breakdown</h2>
            <div className="flex flex-col gap-2">
              <div className="flex justify-between"><span>Subtotal</span><span>₹{order.subtotal.toLocaleString()}</span></div>
              <div className="flex justify-between"><span>Shipping</span><span>₹{order.shipping.toLocaleString()}</span></div>
              <div className="flex justify-between"><span>Discount</span><span>-₹{order.discount.toLocaleString()}</span></div>
              <div className="flex justify-between"><span>Tax</span><span>₹{order.tax.toLocaleString()}</span></div>
              <div className="flex justify-between font-bold text-lg"><span>Grand Total</span><span>₹{order.total.toLocaleString()}</span></div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
