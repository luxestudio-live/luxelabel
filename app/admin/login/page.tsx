"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebaseClient";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function completeAdminLogin(uid: string) {
    const { db } = await import("@/lib/firebaseClient");
    const { doc, getDoc } = await import("firebase/firestore");
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists() || userSnap.data()?.isAdmin !== true) {
      setError("Your account is logged in, but does not have admin access (users/{uid}.isAdmin must be true).");
      await import("firebase/auth").then(m => m.signOut(auth));
      return;
    }

    localStorage.setItem("adminLoggedIn", "true");
    document.cookie = "adminLoggedIn=true; path=/;";
    router.replace("/admin/dashboard");
  }

  useEffect(() => {
    const existingUser = auth.currentUser;
    if (!existingUser) return;
    completeAdminLogin(existingUser.uid).catch(() => {});
  }, []);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const normalizedEmail = email.trim().toLowerCase();
      const userCred = await signInWithEmailAndPassword(auth, normalizedEmail, password);
      await completeAdminLogin(userCred.user.uid);
    } catch (err: any) {
      if (err?.code === "auth/invalid-credential") {
        setError("Invalid email or password. If this admin account uses Google/Phone login, sign in there first, then open admin.");
      } else if (err?.code === "auth/user-not-found") {
        setError("No Firebase Auth user found for this email.");
      } else if (err?.code === "auth/wrong-password") {
        setError("Incorrect password.");
      } else if (err?.code === "auth/too-many-requests") {
        setError("Too many failed attempts. Please wait and try again.");
      } else if (err?.code === "auth/operation-not-allowed") {
        setError("Email/password sign-in is disabled in Firebase Authentication for this project.");
      } else {
        setError(err?.message || "Admin login failed.");
      }
    } finally {
      setLoading(false);
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
        <button type="submit" disabled={loading} className="w-full py-3 rounded bg-primary text-white font-bold text-lg hover:bg-primary/90 transition disabled:opacity-70">{loading ? "Logging in..." : "Login"}</button>
      </form>
    </div>
  );
}
