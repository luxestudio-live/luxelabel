
"use client";
import AdminLayout from "../AdminLayout";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebaseClient";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";

const COUPON_TYPES = [
  { value: "buy_get", label: "Buy X Get Y Free" },
  { value: "percent", label: "Percentage Discount" },
  { value: "flat", label: "Flat Discount" },
];


export default function CouponsPage() {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string|null>(null);
  const [filter, setFilter] = useState("");
  const [form, setForm] = useState({
    type: "buy_get",
    code: "",
    buyQty: 1,
    getQty: 1,
    percent: 0,
    amount: 0,
    minValue: 0,
    maxUses: 1,
    startDate: "",
    endDate: "",
    description: "",
    status: "active",
  });

  useEffect(() => {
    async function fetchCoupons() {
      setLoading(true);
      try {
        const snap = await getDocs(collection(db, "coupons"));
        setCoupons(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (err: any) {
        setError("Failed to fetch coupons");
      } finally {
        setLoading(false);
      }
    }
    fetchCoupons();
  }, []);

  async function handleAddOrEdit(e: any) {
    e.preventDefault();
    setError("");
    try {
      const couponData = { ...form };
      if (editId) {
        await updateDoc(doc(db, "coupons", editId), couponData);
        setCoupons(coupons => coupons.map(c => c.id === editId ? { ...c, ...couponData } : c));
      } else {
        const ref = await addDoc(collection(db, "coupons"), couponData);
        setCoupons(coupons => [...coupons, { id: ref.id, ...couponData }]);
      }
      setShowForm(false);
      setEditId(null);
      setForm({
        type: "buy_get",
        code: "",
        buyQty: 1,
        getQty: 1,
        percent: 0,
        amount: 0,
        minValue: 0,
        maxUses: 1,
        startDate: "",
        endDate: "",
        description: "",
        status: "active",
      });
    } catch (err: any) {
      setError("Failed to save coupon");
    }
  }

  async function handleDelete(id: string) {
    if (!globalThis.confirm("Delete this coupon?")) return;
    try {
      await deleteDoc(doc(db, "coupons", id));
      setCoupons(coupons => coupons.filter(c => c.id !== id));
    } catch {
      setError("Failed to delete coupon");
    }
  }

  function startEdit(coupon: any) {
    setEditId(coupon.id);
    setForm({ ...coupon });
    setShowForm(true);
  }

  function renderFormFields() {
    switch (form.type) {
      case "buy_get":
        return (
          <>
            <label className="block mb-2">Buy Quantity</label>
            <input type="number" min={1} className="border p-3 rounded w-full mb-3" value={form.buyQty} onChange={e => setForm(f => ({ ...f, buyQty: Number(e.target.value) }))} required />
            <label className="block mb-2">Get Quantity</label>
            <input type="number" min={1} className="border p-3 rounded w-full mb-3" value={form.getQty} onChange={e => setForm(f => ({ ...f, getQty: Number(e.target.value) }))} required />
          </>
        );
      case "percent":
        return (
          <>
            <label className="block mb-2">Discount %</label>
            <input type="number" min={1} max={100} className="border p-3 rounded w-full mb-3" value={form.percent} onChange={e => setForm(f => ({ ...f, percent: Number(e.target.value) }))} required />
            <label className="block mb-2">Min Cart Value</label>
            <input type="number" min={0} className="border p-3 rounded w-full mb-3" value={form.minValue} onChange={e => setForm(f => ({ ...f, minValue: Number(e.target.value) }))} required />
          </>
        );
      case "flat":
        return (
          <>
            <label className="block mb-2">Discount Amount</label>
            <input type="number" min={1} className="border p-3 rounded w-full mb-3" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: Number(e.target.value) }))} required />
            <label className="block mb-2">Min Cart Value</label>
            <input type="number" min={0} className="border p-3 rounded w-full mb-3" value={form.minValue} onChange={e => setForm(f => ({ ...f, minValue: Number(e.target.value) }))} required />
          </>
        );
      default:
        return null;
    }
  }

  const filteredCoupons = filter ? coupons.filter(c => c.status === filter) : coupons;

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-extrabold text-primary">Coupons</h1>
      </div>
      <div className="mb-6 flex gap-4 items-center">
        <select className="px-3 py-2 rounded border" value={filter} onChange={e => setFilter(e.target.value)}>
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <button className="px-5 py-2 rounded-xl bg-primary text-white font-bold shadow hover:bg-blue-700 transition" onClick={() => { setShowForm(true); setEditId(null); setForm({
          type: "buy_get",
          code: "",
          buyQty: 1,
          getQty: 1,
          percent: 0,
          amount: 0,
          minValue: 0,
          maxUses: 1,
          startDate: "",
          endDate: "",
          description: "",
          status: "active",
        }); }}>+ Add Coupon</button>
      </div>
      {showForm && (
        <form className="bg-white p-6 rounded-xl shadow mb-6 max-w-md" onSubmit={handleAddOrEdit}>
          <h2 className="font-bold text-lg mb-4">{editId ? "Edit Coupon" : "Add Coupon"}</h2>
          <label className="block mb-2">Coupon Type</label>
          <select className="border p-3 rounded w-full mb-3" value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
            {COUPON_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
          <label className="block mb-2">Coupon Code</label>
          <input type="text" className="border p-3 rounded w-full mb-3" placeholder="Coupon Code" value={form.code} onChange={e => setForm(f => ({ ...f, code: e.target.value }))} required />
          {renderFormFields()}
          <label className="block mb-2">Max Uses Per User</label>
          <input type="number" min={1} className="border p-3 rounded w-full mb-3" value={form.maxUses} onChange={e => setForm(f => ({ ...f, maxUses: Number(e.target.value) }))} required />
          <label className="block mb-2">Start Date</label>
          <input type="date" className="border p-3 rounded w-full mb-3" value={form.startDate} onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))} required />
          <label className="block mb-2">End Date</label>
          <input type="date" className="border p-3 rounded w-full mb-3" value={form.endDate} onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))} required />
          <label className="block mb-2">Description</label>
          <textarea className="border p-3 rounded w-full mb-3" placeholder="Description" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
          <label className="block mb-2">Status</label>
          <select className="border p-3 rounded w-full mb-3" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <div className="flex gap-2 mt-2">
            <button type="submit" className="px-5 py-2 rounded bg-primary text-white font-bold">{editId ? "Update" : "Add"}</button>
            <button type="button" className="px-5 py-2 rounded bg-gray-300 text-gray-700 font-bold" onClick={() => { setShowForm(false); setEditId(null); setForm({
              type: "buy_get",
              code: "",
              buyQty: 1,
              getQty: 1,
              percent: 0,
              amount: 0,
              minValue: 0,
              maxUses: 1,
              startDate: "",
              endDate: "",
              description: "",
              status: "active",
            }); }}>Cancel</button>
          </div>
          {error && <div className="text-red-500 mt-2">{error}</div>}
        </form>
      )}
      <div className="overflow-x-auto rounded-2xl shadow bg-white/90">
        {loading ? (
          <div className="p-8 text-center text-blue-600 font-bold">Loading coupons...</div>
        ) : filteredCoupons.length === 0 ? (
          <div className="p-8 text-center text-red-600 font-bold">No coupons found.</div>
        ) : (
          <table className="min-w-full text-sm">
            <thead className="bg-linear-to-r from-blue-100 via-purple-100 to-pink-100">
              <tr>
                <th className="p-4 text-left">Code</th>
                <th className="p-4 text-left">Type</th>
                <th className="p-4 text-left">Details</th>
                <th className="p-4 text-left">Max Uses/User</th>
                <th className="p-4 text-left">Validity</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCoupons.map(c => (
                <tr key={c.id} className="border-b last:border-none hover:bg-blue-50/30">
                  <td className="p-4 font-bold text-primary">{c.code}</td>
                  <td className="p-4">{COUPON_TYPES.find(t => t.value === c.type)?.label || c.type}</td>
                  <td className="p-4">
                    {c.type === "buy_get" && `Buy ${c.buyQty} Get ${c.getQty}`}
                    {c.type === "percent" && `${c.percent}% off above ₹${c.minValue}`}
                    {c.type === "flat" && `₹${c.amount} off above ₹${c.minValue}`}
                  </td>
                  <td className="p-4">{c.maxUses}</td>
                  <td className="p-4">{c.startDate} - {c.endDate}</td>
                  <td className="p-4"><span className={`px-3 py-1 rounded-lg text-xs font-bold ${c.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}>{c.status}</span></td>
                  <td className="p-4">
                    <button className="px-3 py-1 rounded bg-blue-100 text-blue-700 font-semibold hover:bg-blue-200 mr-2" onClick={() => startEdit(c)}>Edit</button>
                    <button className="px-3 py-1 rounded bg-red-100 text-red-700 font-semibold hover:bg-red-200" onClick={() => handleDelete(c.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AdminLayout>
  );
}
