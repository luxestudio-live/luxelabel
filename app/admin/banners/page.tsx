"use client";
import AdminLayout from "../AdminLayout";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebaseClient";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";

export default function BannersPage() {
  const [banners, setBanners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string|null>(null);
  const [form, setForm] = useState({ text: "", couponCode: "" });

  useEffect(() => {
    async function fetchBanners() {
      setLoading(true);
      try {
        const snap = await getDocs(collection(db, "banners"));
        setBanners(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (err: any) {
        setError("Failed to fetch banners");
      } finally {
        setLoading(false);
      }
    }
    fetchBanners();
  }, []);

  async function handleAddOrEdit(e: any) {
    e.preventDefault();
    setError("");
    try {
      if (editId) {
        await updateDoc(doc(db, "banners", editId), { text: form.text, couponCode: form.couponCode });
        setBanners(banners => banners.map(b => b.id === editId ? { ...b, text: form.text, couponCode: form.couponCode } : b));
      } else {
        const ref = await addDoc(collection(db, "banners"), { text: form.text, couponCode: form.couponCode });
        setBanners(banners => [...banners, { id: ref.id, text: form.text, couponCode: form.couponCode }]);
      }
      setShowForm(false);
      setEditId(null);
      setForm({ text: "", couponCode: "" });
    } catch (err: any) {
      setError("Failed to save banner");
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Delete this banner?")) return;
    try {
      await deleteDoc(doc(db, "banners", id));
      setBanners(banners => banners.filter(b => b.id !== id));
    } catch {
      setError("Failed to delete banner");
    }
  }

  function startEdit(banner: any) {
    setEditId(banner.id);
    setForm({ text: banner.text, couponCode: banner.couponCode || "" });
    setShowForm(true);
  }

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-extrabold text-primary">Banners / Promotions</h1>
      </div>
      <div className="mb-6 flex gap-4 items-center">
        <button className="px-5 py-2 rounded-xl bg-primary text-white font-bold shadow hover:bg-blue-700 transition" onClick={() => { setShowForm(true); setEditId(null); setForm({ text: "", couponCode: "" }); }}>+ Add Banner</button>
      </div>
      {showForm && (
        <form className="bg-white p-6 rounded-xl shadow mb-6 max-w-md" onSubmit={handleAddOrEdit}>
          <h2 className="font-bold text-lg mb-4">{editId ? "Edit Banner" : "Add Banner"}</h2>
          <input type="text" className="border p-3 rounded w-full mb-3" placeholder="Text" value={form.text} onChange={e => setForm(f => ({ ...f, text: e.target.value }))} required />
          <input type="text" className="border p-3 rounded w-full mb-3" placeholder="Coupon Code (optional)" value={form.couponCode} onChange={e => setForm(f => ({ ...f, couponCode: e.target.value }))} />
          <div className="flex gap-2 mt-2">
            <button type="submit" className="px-5 py-2 rounded bg-primary text-white font-bold">{editId ? "Update" : "Add"}</button>
            <button type="button" className="px-5 py-2 rounded bg-gray-300 text-gray-700 font-bold" onClick={() => { setShowForm(false); setEditId(null); setForm({ text: "", couponCode: "" }); }}>Cancel</button>
          </div>
          {error && <div className="text-red-500 mt-2">{error}</div>}
        </form>
      )}
      <div className="overflow-x-auto rounded-2xl shadow bg-white/90">
        {loading ? (
          <div className="p-8 text-center text-blue-600 font-bold">Loading banners...</div>
        ) : banners.length === 0 ? (
          <div className="p-8 text-center text-red-600 font-bold">No banners found.</div>
        ) : (
          <table className="min-w-full text-sm">
            <thead className="bg-linear-to-r from-blue-100 via-purple-100 to-pink-100">
              <tr>
                <th className="p-4 text-left">Text</th>
                <th className="p-4 text-left">Coupon Code (optional)</th>
                <th className="p-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {banners.map(b => (
                <tr key={b.id} className="border-b last:border-none hover:bg-blue-50/30">
                  <td className="p-4 font-bold text-primary">{b.text}</td>
                  <td className="p-4">{b.couponCode || "-"}</td>
                  <td className="p-4">
                    <button className="px-3 py-1 rounded bg-blue-100 text-blue-700 font-semibold hover:bg-blue-200 mr-2" onClick={() => startEdit(b)}>Edit</button>
                    <button className="px-3 py-1 rounded bg-red-100 text-red-700 font-semibold hover:bg-red-200" onClick={() => handleDelete(b.id)}>Delete</button>
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
