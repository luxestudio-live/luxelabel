"use client";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import Link from "next/link";

import { useState } from "react";

export default function AccountProfile() {
  // Dummy user data
  const user = {
    name: "Jane Doe",
    email: "jane@email.com",
    phone: "+91 9876543210",
    dob: "1990-01-01",
    newsletter: true,
    communication: "email",
  };
  // Edit states
  const [editPersonal, setEditPersonal] = useState(false);
  const [editSecurity, setEditSecurity] = useState(false);
  const [editPrefs, setEditPrefs] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-16 md:py-20 max-w-2xl">
        <div className="bg-white dark:bg-card p-8 rounded-xl shadow-lg border border-border/30 w-full mx-auto space-y-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-8 text-primary">Profile & Settings</h1>
          {/* Personal Info Card */}
          <div className="bg-secondary/20 p-6 rounded-xl mb-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold text-lg">Personal Info</h2>
              {editPersonal ? (
                <button className="text-primary underline" onClick={() => setEditPersonal(false)}>Cancel</button>
              ) : (
                <button className="text-primary underline" onClick={() => setEditPersonal(true)}>Edit</button>
              )}
            </div>
            {editPersonal ? (
              <form className="space-y-2">
                <input type="text" className="border p-3 rounded w-full" defaultValue={user.name} placeholder="Full Name" />
                <input type="email" className="border p-3 rounded w-full" defaultValue={user.email} placeholder="Email" readOnly />
                <input type="tel" className="border p-3 rounded w-full" defaultValue={user.phone} placeholder="Phone" />
                <input type="date" className="border p-3 rounded w-full" defaultValue={user.dob} placeholder="Date of Birth" />
                <button type="button" className="mt-2 px-6 py-2 rounded bg-primary text-white font-bold" onClick={() => setEditPersonal(false)}>Save</button>
              </form>
            ) : (
              <div className="space-y-2">
                <div><span className="font-semibold">Full Name:</span> {user.name}</div>
                <div><span className="font-semibold">Email:</span> {user.email}</div>
                <div><span className="font-semibold">Phone:</span> {user.phone}</div>
                <div><span className="font-semibold">Date of Birth:</span> {user.dob || "-"}</div>
              </div>
            )}
          </div>
          {/* Security Card */}
          <div className="bg-secondary/20 p-6 rounded-xl mb-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold text-lg">Security</h2>
              {editSecurity ? (
                <button className="text-primary underline" onClick={() => setEditSecurity(false)}>Cancel</button>
              ) : (
                <button className="text-primary underline" onClick={() => setEditSecurity(true)}>Edit</button>
              )}
            </div>
            {editSecurity ? (
              <form className="space-y-2">
                <input type="password" className="border p-3 rounded w-full" placeholder="Current Password" />
                <input type="password" className="border p-3 rounded w-full" placeholder="New Password" />
                <input type="password" className="border p-3 rounded w-full" placeholder="Confirm New Password" />
                <button type="button" className="mt-2 px-6 py-2 rounded bg-primary text-white font-bold" onClick={() => setEditSecurity(false)}>Save</button>
              </form>
            ) : (
              <div className="space-y-2">
                <div><span className="font-semibold">Password:</span> ********</div>
                <div>
                  <Link href="/account/manage-signin" className="text-primary underline">Manage sign‑in methods</Link>
                </div>
              </div>
            )}
          </div>
          {/* Preferences Card */}
          <div className="bg-secondary/20 p-6 rounded-xl mb-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold text-lg">Preferences</h2>
              {editPrefs ? (
                <button className="text-primary underline" onClick={() => setEditPrefs(false)}>Cancel</button>
              ) : (
                <button className="text-primary underline" onClick={() => setEditPrefs(true)}>Edit</button>
              )}
            </div>
            {editPrefs ? (
              <form className="space-y-2">
                <label className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked={user.newsletter} />
                  <span>Subscribe to newsletter</span>
                </label>
                <select className="border p-3 rounded w-full" defaultValue={user.communication}>
                  <option value="email">Email</option>
                  <option value="sms">SMS</option>
                  <option value="none">None</option>
                </select>
                <button type="button" className="mt-2 px-6 py-2 rounded bg-primary text-white font-bold" onClick={() => setEditPrefs(false)}>Save</button>
              </form>
            ) : (
              <div className="space-y-2">
                <div><span className="font-semibold">Newsletter:</span> {user.newsletter ? "Subscribed" : "Not Subscribed"}</div>
                <div><span className="font-semibold">Communication:</span> {user.communication}</div>
              </div>
            )}
          </div>
          <div className="mt-8 text-center">
            <Link href="/account/dashboard" className="text-primary underline">Back to Dashboard</Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
