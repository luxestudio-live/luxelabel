"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebaseClient";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      const { db } = await import("@/lib/firebaseClient");
      const { doc, getDoc, setDoc } = await import("firebase/firestore");
      const userRef = doc(db, "users", userCred.user.uid);
      let userSnap = await getDoc(userRef);
      if (!userSnap.exists()) {
        // Create user doc with isAdmin false by default
        await setDoc(userRef, {
          email: userCred.user.email,
          isAdmin: false,
        });
        userSnap = await getDoc(userRef);
      }
      if (!userSnap.data().isAdmin) {
        setError("You are not authorized to access the admin panel.");
        await import("firebase/auth").then(m => m.signOut(auth));
        return;
      }
      localStorage.setItem("adminLoggedIn", "true");
      document.cookie = "adminLoggedIn=true; path=/;";
      router.replace("/admin/dashboard");
    } catch (err: any) {
      setError("Invalid credentials");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded shadow-md w-full max-w-sm space-y-6">
        <h1 className="text-2xl font-bold mb-4 text-center">Admin Login</h1>
        {error && <div className="text-red-600 text-center">{error}</div>}
        <input
          type="email"
          placeholder="Email"
          className="border p-3 rounded w-full"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="border p-3 rounded w-full"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="w-full py-3 rounded bg-primary text-white font-bold text-lg hover:bg-primary/90 transition">Login</button>
      </form>
    </div>
  );
}
