"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { loginAdmin } from "@/client/services/adminService";
import AuthCard from "@/client/components/AuthCard";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleLogin(event) {
    event.preventDefault();
    setError("");
    try {
      await loginAdmin(email, password);
      router.push("/admin/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  }

  return (
    <AuthCard title="Admin login" subtitle="Sign in to see and manage bookings.">
      <form onSubmit={handleLogin}>
        <input type="email" placeholder="Email" value={email} onChange={(event) => setEmail(event.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={(event) => setPassword(event.target.value)} required />
        <button className="btn mt-3 w-full">Log in</button>
      </form>
      {error && <p className="mt-3 text-sm font-medium text-red-600">{error}</p>}
      <p className="mt-5 text-sm"><Link className="font-medium text-brand hover:underline" href="/admin/forgot-password">Forgot password?</Link></p>
    </AuthCard>
  );
}
