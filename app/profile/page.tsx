"use client";
import { useState, useEffect } from "react";
import { auth, db } from "@/lib/firebaseClient";
import { onAuthStateChanged, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
// Country codes for dropdown
const COUNTRY_CODES = [
  { code: "+91", name: "India" },
  { code: "+1", name: "USA" },
  { code: "+44", name: "UK" },
  { code: "+61", name: "Australia" },
  { code: "+81", name: "Japan" },
  { code: "+49", name: "Germany" },
  { code: "+33", name: "France" },
  { code: "+86", name: "China" },
  { code: "+971", name: "UAE" },
  { code: "+7", name: "Russia" },
];
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";


export default function ProfilePage() {
        const [personalEditData, setPersonalEditData] = useState({
          name: "",
          phone: "",
          dob: ""
        });
        const [securityEditData, setSecurityEditData] = useState({
          currentPassword: "",
          newPassword: "",
          confirmNewPassword: ""
        });
        const [securityError, setSecurityError] = useState("");
    const [countryCode, setCountryCode] = useState<string>("+91");
    const [phone, setPhone] = useState<string>("");
    const [otpSent, setOtpSent] = useState<boolean>(false);
    const [otp, setOtp] = useState<string>("");
    // Helper to sanitize phone number
      // Stub for handleVerifyOtp to fix missing function error
      const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Implement OTP verification logic
        setSuccess("OTP verified (stub)");
        setShowCompleteForm(false);
      };
    const sanitizePhone = (code: string, number: string): string => {
      return code + number.replaceAll(/\D/g, "");
    };
    const [success, setSuccess] = useState<string>("");
    const [user, setUser] = useState<any>(null);
    const [showCompleteForm, setShowCompleteForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: ""
  });
  const [error, setError] = useState("");
  // Edit states
  const [editPersonal, setEditPersonal] = useState(false);
  const [editSecurity, setEditSecurity] = useState(false);
  const [editPrefs, setEditPrefs] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        // Try to get user profile from Firestore
        const userDoc = await import("firebase/firestore").then(m => m.getDoc(m.doc(db, "users", firebaseUser.uid)));
        let loadedUser;
        if (userDoc.exists()) {
          loadedUser = { ...firebaseUser, ...userDoc.data() };
          setUser(loadedUser);
        } else {
          loadedUser = firebaseUser;
          setUser(firebaseUser);
        }
        // Check for provider types using providerData array
        const providerData = (loadedUser as any)?.providerData || [];
        const hasPhone = providerData.some((p: any) => p.providerId === "phone");
        const hasPassword = providerData.some((p: any) => p.providerId === "password");
        // Check for missing required fields and show popup if needed
        const missingFields = [
          !("name" in loadedUser && (loadedUser as any).name),
          !("email" in loadedUser && (loadedUser as any).email),
          !("phone" in loadedUser && (loadedUser as any).phone)
        ].filter(Boolean);
        if (missingFields.length > 0) {
          setShowCompleteForm(true);
          setFormData(f => ({
            ...f,
            name: (loadedUser as any).name || "",
            email: (loadedUser as any).email || "",
            phone: (loadedUser as any).phone || "",
            password: "",
            confirmPassword: ""
          }));
        } else {
          setShowCompleteForm(false);
        }
        // Store provider flags in user state for later use
        setUser((u: any) => ({ ...loadedUser, hasPhone, hasPassword }));
      } else {
        setUser(null);
        setShowCompleteForm(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) {
      setError("Enter valid phone number");
      return;
    }
    // Only send OTP if not already signed in with phone
    if (user?.provider === "phone") {
      setError("");
      setSuccess("");
      return;
    }
    // Setup reCAPTCHA
    if (!(globalThis as any).recaptchaVerifier) {
      (globalThis as any).recaptchaVerifier = new RecaptchaVerifier(
        auth,
        'recaptcha-container',
        { size: 'invisible', callback: () => {} }
      );
    }
    const appVerifier = (globalThis as any).recaptchaVerifier;
    try {
      // Use PhoneAuthProvider to get credential for linking
      const { PhoneAuthProvider } = await import("firebase/auth");
      const phoneProvider = new PhoneAuthProvider(auth);
      const verificationId = await phoneProvider.verifyPhoneNumber(sanitizePhone(countryCode, phone), appVerifier);
      (globalThis as any).verificationId = verificationId;
      setOtpSent(true);
      setError("");
      setSuccess("OTP sent to your phone number.");
    } catch (err: any) {
      setError(err?.message || "Failed to send OTP");
    }
  };
  // ...existing code...

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-16 md:py-20 max-w-2xl">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-primary">Profile & Settings</h1>
        {showCompleteForm && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <form className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md space-y-4" onSubmit={async e => {
              e.preventDefault();
              // If phone provider, ask for email, password, confirm password for email linking
              if (user?.hasPhone && !user?.hasPassword) {
                if (!formData.name || !formData.phone || !formData.email || !formData.password || !formData.confirmPassword) {
                  setError("All fields are required.");
                  return;
                }
                if (formData.password !== formData.confirmPassword) {
                  setError("Passwords do not match.");
                  return;
                }
                try {
                  if (auth.currentUser) {
                    // Link email/password to phone-auth user
                    const { EmailAuthProvider, linkWithCredential } = await import("firebase/auth");
                    const credential = EmailAuthProvider.credential(formData.email, formData.password);
                    let linkedUser = null;
                    try {
                      linkedUser = await linkWithCredential(auth.currentUser, credential);
                    } catch (err: any) {
                      if (err.code === "auth/provider-already-linked") {
                        // Provider already linked, just update Firestore and show friendly message
                        await setDoc(doc(db, "users", auth.currentUser.uid), {
                          name: formData.name,
                          phone: formData.phone,
                          email: formData.email
                        });
                        setUser({
                          uid: auth.currentUser.uid,
                          name: formData.name,
                          phone: formData.phone,
                          email: formData.email
                        });
                        setShowCompleteForm(false);
                        setError("");
                        setSuccess("Email already linked. Profile updated.");
                        setSuccess("Logged in Successfully");
                        if (typeof window !== "undefined") {
                          window.location.replace("/");
                        }
                        return;
                      } else {
                        throw err;
                      }
                    }
                    // Save only allowed fields to Firestore
                    await setDoc(doc(db, "users", auth.currentUser.uid), {
                      name: formData.name,
                      phone: formData.phone,
                      email: formData.email
                    });
                    // Update user state with merged info and correct provider
                    setUser({
                      uid: linkedUser.user.uid,
                      name: formData.name,
                      phone: formData.phone,
                      email: formData.email
                    });
                    setShowCompleteForm(false);
                    setError("");
                    setSuccess("Profile completed and email linked.");
                    setSuccess("Logged in Successfully");
                    if (typeof window !== "undefined") {
                      window.location.replace("/");
                    }
                  }
                } catch (err: any) {
                  setError(err?.message || "Failed to save profile or link email.");
                }
                return;
              }
              // Otherwise, use OTP flow
              if (otpSent) {
                await handleVerifyOtp(e);
              } else {
                await handleSendOtp(e);
              }
            }}>
              <h2 className="text-xl font-bold mb-2 text-primary">Complete Your Profile</h2>
              {success && <div className="bg-green-100 text-green-800 rounded-xl px-4 py-3 text-center font-bold shadow">{success}</div>}
              {error && <div className="bg-red-100 text-red-800 rounded-xl px-4 py-3 text-center font-bold shadow">{error}</div>}
              <input type="text" className="border p-3 rounded w-full" placeholder="Full Name" value={formData.name} onChange={e => setFormData(f => ({ ...f, name: e.target.value }))} disabled={user?.provider === "phone"} />
              <div className="flex gap-2">
                <select
                  className="border p-3 rounded w-1/3 max-h-48 overflow-y-auto bg-white"
                  style={{ minWidth: 120 }}
                  value={countryCode}
                  onChange={e => setCountryCode(e.target.value)}
                  required
                  disabled={user?.hasPhone && !user?.hasPassword}
                >
                  {COUNTRY_CODES.map(c => (
                    <option key={c.code} value={c.code}>{c.name} {c.code}</option>
                  ))}
                </select>
                <input type="tel" className="border p-3 rounded w-2/3" placeholder="Phone number" value={formData.phone} onChange={e => setFormData(f => ({ ...f, phone: e.target.value }))} required disabled={user?.hasPhone && !user?.hasPassword} />
              </div>
              {/* If phone provider, ask for email and password fields */}
              {user?.hasPhone && !user?.hasPassword && (
                <>
                  <input type="email" className="border p-3 rounded w-full" placeholder="Email" value={formData.email} onChange={e => setFormData(f => ({ ...f, email: e.target.value }))} />
                  <input type="password" className="border p-3 rounded w-full" placeholder="Password" value={formData.password} onChange={e => setFormData(f => ({ ...f, password: e.target.value }))} />
                  <input type="password" className="border p-3 rounded w-full" placeholder="Confirm Password" value={formData.confirmPassword} onChange={e => setFormData(f => ({ ...f, confirmPassword: e.target.value }))} />
                </>
              )}
              {/* OTP input if sent and not phone provider */}
              {otpSent && !(user?.hasPhone && !user?.hasPassword) && (
                <input type="text" className="border p-3 rounded w-full" placeholder="Enter OTP" value={otp} onChange={e => setOtp(e.target.value)} />
              )}
              {/* Show password field only for email/password users (if needed) */}
              {user?.hasPassword && (
                <input type="password" className="border p-3 rounded w-full" placeholder="Password" />
              )}
              <div id="recaptcha-container" style={{ display: 'none' }}></div>
              <button type="submit" className="w-full py-3 rounded bg-primary text-white font-bold text-lg hover:bg-primary/90 transition">
                {user?.provider === "phone" ? "Save" : (otpSent ? "Verify & Save" : "Send OTP & Save")}
              </button>
            </form>
          </div>
        )}
        {/* Profile Cards */}
        {!showCompleteForm && user && (
            <div className="space-y-8">
              {/* Personal Info Card */}
              <div className="bg-white dark:bg-card p-6 rounded-xl shadow-lg border border-border/30">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="font-semibold text-lg">Personal Info</h2>
                  {editPersonal ? (
                    <button className="text-primary underline" onClick={() => setEditPersonal(false)}>Cancel</button>
                  ) : (
                    <button className="text-primary underline" onClick={() => {
                      setPersonalEditData({
                        name: user.name || "",
                        phone: user.phone || "",
                        dob: user.dob || ""
                      });
                      setEditPersonal(true);
                    }}>Edit</button>
                  )}
                </div>
                {editPersonal ? (
                  <form className="space-y-2" onSubmit={async e => {
                    e.preventDefault();
                    try {
                      if (auth.currentUser) {
                        await setDoc(doc(db, "users", auth.currentUser.uid), {
                          ...user,
                          name: personalEditData.name,
                          phone: personalEditData.phone,
                          dob: personalEditData.dob
                        });
                        setUser((u: any) => ({ ...u, name: personalEditData.name, phone: personalEditData.phone, dob: personalEditData.dob }));
                        setEditPersonal(false);
                      }
                    } catch (err: any) {
                      setError(err?.message || "Failed to update profile.");
                    }
                  }}>
                    <input type="text" className="border p-3 rounded w-full" value={personalEditData.name} placeholder="Full Name" onChange={e => setPersonalEditData(d => ({ ...d, name: e.target.value }))} />
                    <input type="email" className="border p-3 rounded w-full" value={user.email} placeholder="Email" readOnly />
                    <input type="tel" className="border p-3 rounded w-full" value={personalEditData.phone} placeholder="Phone" onChange={e => setPersonalEditData(d => ({ ...d, phone: e.target.value }))} />
                    <input type="date" className="border p-3 rounded w-full" value={personalEditData.dob} placeholder="Date of Birth" onChange={e => setPersonalEditData(d => ({ ...d, dob: e.target.value }))} />
                    <button type="submit" className="mt-2 px-6 py-2 rounded bg-primary text-white font-bold">Save</button>
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
              <div className="bg-white dark:bg-card p-6 rounded-xl shadow-lg border border-border/30">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="font-semibold text-lg">Security</h2>
                  {editSecurity ? (
                    <button className="text-primary underline" onClick={() => setEditSecurity(false)}>Cancel</button>
                  ) : (
                    <button className="text-primary underline" onClick={() => setEditSecurity(true)}>Edit</button>
                  )}
                </div>
                {editSecurity ? (
                  (auth.currentUser && auth.currentUser.providerData.some((p: any) => p.providerId === 'password') ? (
                    <form className="space-y-2" onSubmit={async e => {
                      e.preventDefault();
                      setSecurityError("");
                      if (!securityEditData.currentPassword || !securityEditData.newPassword || !securityEditData.confirmNewPassword) {
                        setSecurityError("All fields are required.");
                        return;
                      }
                      if (securityEditData.newPassword !== securityEditData.confirmNewPassword) {
                        setSecurityError("New passwords do not match.");
                        return;
                      }
                      try {
                        const user = auth.currentUser;
                        if (user) {
                          // Check if user is email/password user and session
                          const isPasswordProvider = user.providerData.some((p: any) => p.providerId === 'password');
                          if (isPasswordProvider && user.email) {
                            const credential = await import("firebase/auth").then(m => m.EmailAuthProvider.credential(user.email!, securityEditData.currentPassword));
                            await import("firebase/auth").then(m => m.reauthenticateWithCredential(user, credential));
                            await import("firebase/auth").then(m => m.updatePassword(user, securityEditData.newPassword));
                            setEditSecurity(false);
                            setSecurityEditData({ currentPassword: "", newPassword: "", confirmNewPassword: "" });
                          } else {
                            setSecurityError("Password change is only available for email/password users.");
                          }
                        }
                      } catch (err: any) {
                        if (err.code === 'auth/wrong-password') {
                          setSecurityError("Current password is incorrect.");
                        } else if (err.code === 'auth/invalid-credential') {
                          setSecurityError("To change your password, please log in with your email and password.");
                        } else {
                          setSecurityError(err?.message || "Failed to change password.");
                        }
                      }
                    }}>
                      <input type="password" className="border p-3 rounded w-full" placeholder="Current Password" value={securityEditData.currentPassword} onChange={e => setSecurityEditData(d => ({ ...d, currentPassword: e.target.value }))} />
                      <input type="password" className="border p-3 rounded w-full" placeholder="New Password" value={securityEditData.newPassword} onChange={e => setSecurityEditData(d => ({ ...d, newPassword: e.target.value }))} />
                      <input type="password" className="border p-3 rounded w-full" placeholder="Confirm New Password" value={securityEditData.confirmNewPassword} onChange={e => setSecurityEditData(d => ({ ...d, confirmNewPassword: e.target.value }))} />
                      {securityError && <div className="text-red-500 text-sm">{securityError}</div>}
                      <button type="submit" className="mt-2 px-6 py-2 rounded bg-primary text-white font-bold">Update Password</button>
                    </form>
                  ) : (
                    <div className="text-red-500 text-sm font-semibold py-4">To change your password, please log in with your email and password.</div>
                  ))
                ) : (
                  <div className="space-y-2">
                    <div><span className="font-semibold">Password:</span> ********</div>
                    <div><span className="font-semibold">Providers:</span> {user.hasPhone && user.hasPassword ? "Phone, Email/Password" : user.hasPhone ? "Phone" : user.hasPassword ? "Email/Password" : "-"}</div>
                  </div>
                )}
              </div>
              {/* Logout Button */}
              <div className="flex justify-end mt-8">
                <button
                  className="flex items-center gap-2 px-6 py-2 rounded-xl bg-gradient-to-r from-red-500 to-red-700 text-white font-bold shadow-lg hover:scale-105 hover:from-red-600 hover:to-red-800 transition-all duration-150"
                  onClick={async () => {
                    if (window.confirm("Are you sure you want to log out?")) {
                      await import("firebase/auth").then(m => m.signOut(auth));
                      setUser(null);
                      // Redirect to login page
                      if (typeof window !== "undefined") {
                        window.location.href = "/login";
                      }
                    }
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1" />
                  </svg>
                  Log Out
                </button>
              </div>
            </div>
        )}
        {!showCompleteForm && !user && (
            <div className="text-center py-20 text-lg text-gray-500">No profile found. Please log in or register.</div>
        )}
      </main>
      <Footer />
    </div>
  );
}
