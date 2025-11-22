"use client";
import { useState } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import Link from "next/link";

const TABS = ["Email/Password", "Phone OTP"];
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
  // ...add more as needed
];

export default function LoginPage() {
  const [tab, setTab] = useState(0);
  const [otpSent, setOtpSent] = useState(false);
  const [countryCode, setCountryCode] = useState("+91");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [errors, setErrors] = useState({});
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Validation helpers
  const validateEmail = (val) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(val);
  const validatePhone = (val) => /^\d{7,15}$/.test(val);
  const validateOtp = (val) => /^\d{6}$/.test(val);

  // Handle Send OTP
  const handleSendOtp = (e) => {
    e.preventDefault();
    let phoneError = "";
    if (!validatePhone(phone)) phoneError = "Enter valid phone number";
    setErrors({ phone: phoneError });
    if (!phoneError) {
      setOtpSent(true);
    }
  };

  // Handle Verify & Login
  const handleVerifyLogin = (e) => {
    e.preventDefault();
    let otpError = "";
    if (!validateOtp(otp)) otpError = "Enter valid 6-digit OTP";
    setErrors({ otp: otpError });
    if (!otpError) {
      // Proceed with login
    }
  };

  // Handle Email/Password Login
  const handleEmailLogin = (e) => {
    e.preventDefault();
    let emailError = "";
    let passError = "";
    if (!validateEmail(email)) emailError = "Enter valid email";
    if (password.length < 6) passError = "Password must be at least 6 chars";
    setErrors({ email: emailError, password: passError });
    if (!emailError && !passError) {
      // Proceed with login
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-16 md:py-20 flex flex-col md:flex-row gap-12">
        {/* Left: Login form */}
        <div className="bg-white dark:bg-card p-8 rounded-xl shadow-lg border border-border/30 w-full md:w-1/2 mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-8 text-primary">Login</h1>
          <div className="flex gap-2 mb-8 justify-center">
            {TABS.map((t, i) => (
              <button
                key={t}
                className={`px-4 py-2 rounded font-semibold transition-all border-b-2 ${tab === i ? "border-primary text-primary bg-secondary/40" : "border-transparent text-muted-foreground bg-secondary/10"}`}
                onClick={() => { setTab(i); setOtpSent(false); setErrors({}); setPhone(""); setOtp(""); setEmail(""); setPassword(""); }}
              >
                {t}
              </button>
            ))}
          </div>
          {tab === 0 && (
            <form className="space-y-4" onSubmit={handleEmailLogin}>
              <div>
                <input type="email" placeholder="Email" className="border p-3 rounded w-full" value={email} onChange={e => setEmail(e.target.value)} required />
                {errors.email && <div className="text-red-500 text-sm mt-1">{errors.email}</div>}
              </div>
              <div>
                <input type="password" placeholder="Password" className="border p-3 rounded w-full" value={password} onChange={e => setPassword(e.target.value)} required />
                {errors.password && <div className="text-red-500 text-sm mt-1">{errors.password}</div>}
              </div>
              <button type="submit" className="w-full py-3 rounded bg-primary text-white font-bold text-lg hover:bg-primary/90 transition">Login</button>
              <Link href="#" className="text-primary underline text-sm">Forgot password?</Link>
            </form>
          )}
          {tab === 1 && (
            <form className="space-y-4">
              <div className="flex gap-2">
                <select
                  className="border p-3 rounded w-1/3 max-h-48 overflow-y-auto bg-white"
                  style={{ minWidth: 120 }}
                  value={countryCode}
                  onChange={e => setCountryCode(e.target.value)}
                  required
                >
                  {COUNTRY_CODES.map(c => (
                    <option key={c.code} value={c.code}>{c.name} {c.code}</option>
                  ))}
                </select>
                <input type="tel" placeholder="Phone number" className="border p-3 rounded w-2/3" value={phone} onChange={e => setPhone(e.target.value)} required />
              </div>
              {errors.phone && <div className="text-red-500 text-sm mt-1">{errors.phone}</div>}
              {!otpSent && (
                <button type="button" className="w-full py-3 rounded bg-secondary text-primary font-bold text-lg hover:bg-secondary/80 transition" onClick={handleSendOtp}>
                  Send OTP
                </button>
              )}
              {otpSent && (
                <>
                  <div>
                    <input type="text" placeholder="Enter 6-digit OTP" className="border p-3 rounded w-full" value={otp} onChange={e => setOtp(e.target.value)} required />
                    {errors.otp && <div className="text-red-500 text-sm mt-1">{errors.otp}</div>}
                  </div>
                  <button type="button" className="w-full py-3 rounded bg-primary text-white font-bold text-lg hover:bg-primary/90 transition" onClick={handleVerifyLogin}>Verify & Login</button>
                </>
              )}
            </form>
          )}
          <div className="my-6 text-center">
            <button type="button" className="w-full py-3 rounded flex items-center justify-center gap-2 border border-border bg-white hover:bg-secondary/40 transition">
              <svg width="20" height="20" viewBox="0 0 48 48" className="mr-2"><g><path fill="#4285F4" d="M24 9.5c3.54 0 6.72 1.22 9.22 3.22l6.9-6.9C36.62 2.36 30.7 0 24 0 14.82 0 6.73 5.48 2.69 13.44l8.06 6.27C12.6 13.36 17.87 9.5 24 9.5z"/><path fill="#34A853" d="M46.1 24.5c0-1.64-.15-3.22-.43-4.75H24v9.02h12.44c-.54 2.9-2.17 5.36-4.63 7.02l7.18 5.59C43.98 37.36 46.1 31.36 46.1 24.5z"/><path fill="#FBBC05" d="M10.75 28.71c-1.01-2.9-1.01-6.02 0-8.92l-8.06-6.27C.64 17.82 0 21.32 0 24.5c0 3.18.64 6.68 2.69 10.48l8.06-6.27z"/><path fill="#EA4335" d="M24 48c6.7 0 12.62-2.21 16.82-6.03l-7.18-5.59c-2.01 1.35-4.59 2.14-7.64 2.14-6.13 0-11.4-3.86-13.25-9.21l-8.06 6.27C6.73 42.52 14.82 48 24 48z"/><path fill="none" d="M0 0h48v48H0z"/></g></svg>
              <span className="font-semibold text-base">Sign in with Google</span>
            </button>
          </div>
          <div className="text-center mt-8">
            <span className="text-muted-foreground">Don’t have an account?</span>
            <Link href="/register" className="ml-2 text-primary underline">Register</Link>
          </div>
        </div>
        {/* Right: Info/Benefits (optional) */}
        <div className="hidden md:flex flex-col justify-center w-1/2 px-8">
          <div className="bg-secondary/30 p-8 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Why create an account?</h2>
            <ul className="list-disc ml-6 space-y-2 text-muted-foreground">
              <li>Track your orders and returns</li>
              <li>Save addresses for faster checkout</li>
              <li>Access exclusive offers</li>
              <li>Manage your profile and preferences</li>
            </ul>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
