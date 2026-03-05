"use client";

import React, { useEffect, useState } from "react";
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { Font } from '@react-pdf/renderer';
// Register Helvetica font for react-pdf
Font.register({ family: 'Helvetica', src: null });
// PDF Invoice component
const InvoicePDF = ({ order }: { order: any }) => (
  <Document>
    <Page size="A4" style={pdfStyles.page}>
      {/* LuxeLabels Branding Header */}
      <View style={pdfStyles.brandHeader}>
        <Text style={pdfStyles.brandTitle}>LuxeLabels</Text>
        <Text style={pdfStyles.brandSubtitle}>Premium Fashion Labels</Text>
      </View>
      {/* Invoice Title & Info */}
      <View style={pdfStyles.header}>
        <Text style={pdfStyles.title}>Order Invoice</Text>
        <Text>Order ID: {order.orderId || order.id}</Text>
        <Text>Date: {order.createdAt?.toDate ? order.createdAt.toDate().toLocaleString() : order.created || '-'}</Text>
      </View>
      {/* Customer & Address Info */}
      <View style={pdfStyles.sectionRow}>
        <View style={pdfStyles.sectionCol}>
          <Text style={pdfStyles.subtitle}>Customer</Text>
          <Text>{order.customer?.name || order.name || '-'}</Text>
          <Text>{order.customer?.email || order.email || '-'}</Text>
          <Text>{order.customer?.phone || order.phone || '-'}</Text>
        </View>
        <View style={pdfStyles.sectionCol}>
          <Text style={pdfStyles.subtitle}>Billing Address</Text>
          <Text>{order.billing?.name || order.address?.name || '-'}</Text>
          <Text>{order.billing?.address || order.address?.address1 || '-'}</Text>
          <Text>{order.billing?.city || order.address?.city || '-'}, {order.billing?.zip || order.address?.zip || '-'}</Text>
          <Text>{order.billing?.country || order.address?.country || '-'}</Text>
        </View>
        <View style={pdfStyles.sectionCol}>
          <Text style={pdfStyles.subtitle}>Shipping Address</Text>
          <Text>{order.shipping?.name || order.address?.name || '-'}</Text>
          <Text>{order.shipping?.address || order.address?.address1 || '-'}</Text>
          <Text>{order.shipping?.city || order.address?.city || '-'}, {order.shipping?.zip || order.address?.zip || '-'}</Text>
          <Text>{order.shipping?.country || order.address?.country || '-'}</Text>
        </View>
      </View>
      {/* Order Status, Courier, Tracking */}
      <View style={pdfStyles.sectionRow}>
        <View style={pdfStyles.sectionCol}>
          <Text>Status: {order.order_status || order.status || '-'}</Text>
          <Text>Courier: {order.courier_partner || '-'}</Text>
          <Text>Tracking: {order.tracking_number || '-'}</Text>
        </View>
        <View style={pdfStyles.sectionCol}>
          <Text>Channel: {order.channel || order.source || '-'}</Text>
          <Text>Payment Method: {order.razorpay?.method || order.razorpay?.payment_method || order.paymentMethod || order.paymentStatus || '-'}</Text>
        </View>
      </View>
      {/* Items Table */}
      <View style={pdfStyles.section}>
        <Text style={pdfStyles.subtitle}>Products</Text>
        <View style={pdfStyles.tableHeader}>
          <Text style={pdfStyles.th}>Product</Text>
          <Text style={pdfStyles.th}>SKU</Text>
          <Text style={pdfStyles.th}>Qty</Text>
          <Text style={pdfStyles.th}>Price</Text>
          <Text style={pdfStyles.th}>Discount</Text>
          <Text style={pdfStyles.th}>Line Total</Text>
        </View>
        {Array.isArray(order.items) && order.items.map((item: any, idx: number) => (
          <View key={String(item.id || '') + '-' + String(item.sku || '') + '-' + String(item.product || '') + '-' + idx} style={pdfStyles.tableRow}>
            <Text style={pdfStyles.td}>{item.product || item.name}</Text>
            <Text style={pdfStyles.td}>{item.sku ? item.sku : (item.id || '-')}</Text>
            <Text style={pdfStyles.td}>{item.qty || item.quantity}</Text>
            <Text style={pdfStyles.td}>₹{item.price}</Text>
            <Text style={pdfStyles.td}>₹{item.discount || 0}</Text>
            <Text style={pdfStyles.td}>₹{item.total || (item.price * (item.qty || item.quantity))}</Text>
          </View>
        ))}
      </View>
      {/* Totals Section */}
      <View style={pdfStyles.sectionRow}>
        <View style={pdfStyles.sectionCol}>
          <Text>Subtotal: ₹{order.totals?.subtotal || order.subtotal || '-'}</Text>
          <Text>Shipping: ₹{order.totals?.shipping || order.shipping || '-'}</Text>
          <Text>Tax: ₹{order.totals?.tax || order.tax || '-'}</Text>
          <Text>Discounts: ₹{order.totals?.discounts || order.discount || '-'}</Text>
        </View>
        <View style={pdfStyles.sectionCol}>
          <Text style={pdfStyles.bold}>Grand Total: ₹{order.totals?.grand || order.total || '-'}</Text>
          <Text>Paid: ₹{order.totals?.paid || order.total || '-'}</Text>
          <Text>Remaining: ₹{order.totals?.remaining || '-'}</Text>
        </View>
      </View>
      {/* System-generated Bill Note */}
      <View style={pdfStyles.section}>
        <Text style={pdfStyles.noteTitle}>System-generated Bill Note</Text>
        <Text style={pdfStyles.noteText}>This invoice was generated electronically by LuxeLabels. No signature is required. For any queries, contact contact@luxelabels.co.in.</Text>
      </View>
    </Page>
  </Document>
);

const pdfStyles = StyleSheet.create({
  page: { padding: 24, fontSize: 12, fontFamily: 'Helvetica' },
  brandHeader: { marginBottom: 10, paddingBottom: 8, borderBottomWidth: 1, borderBottomColor: '#eee', alignItems: 'center' },
  brandTitle: { fontSize: 28, fontWeight: 'bold', color: '#6B21A8', marginBottom: 2 },
  brandSubtitle: { fontSize: 14, color: '#374151', marginBottom: 2 },
  header: { marginBottom: 16 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 8, color: '#6B21A8' },
  subtitle: { fontSize: 14, fontWeight: 'bold', marginBottom: 4, color: '#6B21A8' },
  section: { marginBottom: 12 },
  sectionRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  sectionCol: { flex: 1, marginRight: 12 },
  tableHeader: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#6B21A8', backgroundColor: '#F3E8FF', paddingVertical: 4 },
  th: { flex: 1, fontWeight: 'bold', color: '#6B21A8', fontSize: 12 },
  tableRow: { flexDirection: 'row', borderBottomWidth: 0.5, borderBottomColor: '#eee', paddingVertical: 2 },
  td: { flex: 1, fontSize: 11 },
  bold: { fontWeight: 'bold', marginTop: 8 },
  noteTitle: { fontWeight: 'bold', fontSize: 13, marginTop: 10, color: '#6B21A8' },
  noteText: { fontSize: 11, color: '#374151', marginTop: 2 },
});
import Link from "next/link";
import AdminLayout from "../../AdminLayout";
import { fetchOrderById } from "../ordersLogic";


export default function OrderDetailPage({ params }: Readonly<{ params: { id: string } }>) {
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState(false);
  const [status, setStatus] = useState("");
  const [courier, setCourier] = useState("");
  const [tracking, setTracking] = useState("");

  // Unwrap params using React.use()
  const unwrappedParams = typeof params?.then === "function" ? React.use(params) : params;
  const orderId = unwrappedParams?.id;

  useEffect(() => {
    async function loadOrder() {
      setLoading(true);
      setError("");
      try {
        const data = await fetchOrderById(orderId);
        setOrder(data);
        setStatus(data.order_status || data.status || "");
        setCourier(data.courier_partner || "");
        setTracking(data.tracking_number || "");
      } catch (err: any) {
        setError(err.message || "Order not found");
      } finally {
        setLoading(false);
      }
    }
    if (orderId) loadOrder();
  }, [orderId]);

  if (loading) return <AdminLayout><div className="p-8 text-center">Loading order...</div></AdminLayout>;
  if (error) return <AdminLayout><div className="p-8 text-center text-red-600">{error}</div></AdminLayout>;
  if (!order) return <AdminLayout><div className="p-8 text-center">No order data.</div></AdminLayout>;

  const o = order;
  const statusOptions = ["Placed", "Confirmed", "Preparing", "Dispatched", "Delivered", "Shipped", "Pending", "Cancelled"];

  async function handleStatusUpdate() {
    setUpdating(true);
    try {
      const { doc, updateDoc } = await import("firebase/firestore");
      const ref = doc(require("@/lib/firebaseClient").db, "orders", o.id);
      await updateDoc(ref, {
        order_status: status,
        courier_partner: courier,
        tracking_number: tracking,
      });
      setOrder({ ...o, order_status: status, courier_partner: courier, tracking_number: tracking });
    } catch (err: any) {
      alert("Failed to update order: " + (err?.message || JSON.stringify(err)));
    } finally {
      setUpdating(false);
    }
  }

  async function handleCancelOrder() {
    if (!globalThis.confirm("Are you sure you want to cancel this order?")) return;
    setUpdating(true);
    try {
      const { doc, updateDoc } = await import("firebase/firestore");
      const ref = doc(require("@/lib/firebaseClient").db, "orders", o.id);
      await updateDoc(ref, { status: "Cancelled" });
      setOrder({ ...o, status: "Cancelled" });
      setStatus("Cancelled");
    } catch {
      alert("Failed to cancel order");
    } finally {
      setUpdating(false);
    }
  }

  return (
    <AdminLayout>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-primary">Order {o.id}</h1>
          <div className="text-muted-foreground text-sm">
            Created: {
              (() => {
                if (o.created) {
                  if (typeof o.created === "object" && typeof o.created.toLocaleString === "function") {
                    return o.created.toLocaleString();
                  }
                  return o.created;
                } else if (o.createdAt?.toDate && typeof o.createdAt.toDate() === "object" && typeof o.createdAt.toDate().toLocaleString === "function") {
                  return o.createdAt.toDate().toLocaleString();
                } else {
                  return o.createdAt?.toDate?.() || "-";
                }
              })()
            }
            | Source: {o.source || o.channel || "-"}
          </div>
        </div>
        <div>
          <button
            className="px-4 py-2 rounded-xl bg-primary text-white font-bold shadow hover:bg-blue-700 transition"
            onClick={() => window.print()}
          >
            Print Invoice
          </button>
        </div>
      </div>
      {/* Customer & Addresses */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <div className="bg-white/90 rounded-2xl shadow p-6">
          <h2 className="font-bold text-lg mb-2 text-primary">Customer</h2>
          <div>{o.customer?.name || o.name || '-'}</div>
        </div>
        <div className="bg-white/90 rounded-2xl shadow p-6">
          <h2 className="font-bold text-lg mb-2 text-primary">Billing Address</h2>
          <div>{o.billing?.name || o.address?.name || '-'}</div>
          <div>{o.billing?.address || o.address?.address1 || '-'}</div>
          <div>{o.billing?.city || o.address?.city || '-'}, {o.billing?.zip || o.address?.zip || '-'}</div>
          <div>{o.billing?.country || o.address?.country || '-'}</div>
        </div>
        <div className="bg-white/90 rounded-2xl shadow p-6">
          <h2 className="font-bold text-lg mb-2 text-primary">Shipping Address</h2>
          <div>{o.shipping?.name || o.address?.name || '-'}</div>
          <div>{o.shipping?.address || o.address?.address1 || '-'}</div>
          <div>{o.shipping?.city || o.address?.city || '-'}, {o.shipping?.zip || o.address?.zip || '-'}</div>
          <div>{o.shipping?.country || o.address?.country || '-'}</div>
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
            {Array.isArray(o.items) && o.items.filter(Boolean).map((item: any, idx: number) => {
              // Defensive: ensure item is an object and fields exist
              const product = item?.product || item?.name || '-';
              const sku = item?.sku ? item.sku : (item?.id || '-');
              const qty = item?.qty ?? item?.quantity ?? '-';
              const price = typeof item?.price === 'number' ? item.price : 0;
              const discount = typeof item?.discount === 'number' ? item.discount : 0;
              const lineTotal = typeof item?.total === 'number'
                ? item.total
                : (typeof price === 'number' && typeof qty === 'number' ? price * qty : 0);
              return (
                <tr key={String(sku) + '-' + String(product) + '-' + idx} className="border-b last:border-none">
                  <td className="p-2">{product}</td>
                  <td className="p-2 font-mono text-xs">{sku}</td>
                  <td className="p-2">{qty}</td>
                  <td className="p-2">₹{price}</td>
                  <td className="p-2">₹{discount}</td>
                  <td className="p-2 font-semibold text-blue-700">₹{lineTotal}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {/* Totals */}
      <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white/90 rounded-2xl shadow p-6">
          <h2 className="font-bold text-lg mb-2 text-primary">Totals</h2>
          <div>Subtotal: ₹{o.totals?.subtotal || o.subtotal || '-'}</div>
          <div>Shipping: ₹{o.totals?.shipping || o.shipping || '-'}</div>
          <div>Tax: ₹{o.totals?.tax || o.tax || '-'}</div>
          <div>Discounts: ₹{o.totals?.discounts || o.discount || '-'}</div>
          <div className="font-bold mt-2">Grand Total: ₹{o.totals?.grand || o.total || '-'}</div>
          <div>Paid: ₹{o.totals?.paid || o.total || '-'}</div>
          <div>Remaining: ₹{o.totals?.remaining || '-'}</div>
          <div>Payment Method: <span className="font-semibold">{o.razorpay?.method || o.razorpay?.payment_method || o.paymentMethod || o.paymentStatus || '-'}</span></div>
          <div>Status: <span className="font-semibold">{o.order_status || o.status || '-'}</span></div>
          <div>Channel: <span className="font-semibold">{o.channel || o.source || '-'}</span></div>
          <div>Courier Partner: <span className="font-semibold">{o.courier_partner || '-'}</span></div>
          <div>Tracking Number: <span className="font-semibold">{o.tracking_number || '-'}</span></div>
        </div>
        <div className="bg-white/90 rounded-2xl shadow p-6">
          <h2 className="font-bold text-lg mb-2 text-primary">Notes & Actions</h2>
          <div className="mb-2">{o.notes}</div>
          <div className="flex flex-wrap gap-2 mt-2">
            <div className="flex flex-col gap-2">
              <label className="font-semibold" htmlFor="order-status">Order Status</label>
              <select id="order-status" value={status} onChange={e => setStatus(e.target.value)} className="px-3 py-1 rounded border">
                {statusOptions.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
              <label className="font-semibold mt-2" htmlFor="courier-partner">Courier Partner</label>
              <input id="courier-partner" type="text" value={courier} onChange={e => setCourier(e.target.value)} className="px-3 py-1 rounded border" placeholder="Courier name" />
              <label className="font-semibold mt-2" htmlFor="tracking-number">Tracking Number</label>
              <input id="tracking-number" type="text" value={tracking} onChange={e => setTracking(e.target.value)} className="px-3 py-1 rounded border" placeholder="Tracking number" />
              <button
                className="px-3 py-1 mt-2 rounded bg-blue-100 text-blue-700 font-semibold hover:bg-blue-200"
                onClick={handleStatusUpdate}
                disabled={updating}
              >
                {updating ? "Updating..." : "Update Order"}
              </button>
              <button
                className="px-3 py-1 mt-2 rounded bg-red-100 text-red-700 font-semibold hover:bg-red-200"
                onClick={handleCancelOrder}
                disabled={updating || status === "Cancelled"}
              >
                {updating && status === "Cancelled" ? "Cancelling..." : "Cancel Order"}
              </button>
            </div>
            <button className="px-3 py-1 rounded bg-yellow-100 text-yellow-700 font-semibold hover:bg-yellow-200">Resend Email</button>
            <button className="px-3 py-1 rounded bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200">Edit Notes</button>
            <button className="px-3 py-1 rounded bg-red-100 text-red-700 font-semibold hover:bg-red-200">Refund</button>
            <PDFDownloadLink
              document={<InvoicePDF order={o} />}
              fileName={`invoice-${o.orderId || o.id}.pdf`}
              className="px-3 py-1 rounded bg-purple-100 text-purple-700 font-semibold hover:bg-purple-200"
            >
              {({ loading }) => loading ? 'Generating PDF...' : 'Download Invoice PDF'}
            </PDFDownloadLink>
          </div>
        </div>
      </div>
      {/* Timeline */}
      <div className="mb-8 bg-white/90 rounded-2xl shadow p-6">
        <h2 className="font-bold text-lg mb-4 text-primary">Timeline</h2>
        <ol className="list-decimal ml-6">
          {Array.isArray(o.timeline) && o.timeline.map((t: any) => (
            <li key={t.date + t.status} className="mb-2">
              <span className="font-bold">{t.status}</span> <span className="text-muted-foreground">{t.date}</span>
            </li>
          ))}
        </ol>
      </div>
    </AdminLayout>
  );
}
