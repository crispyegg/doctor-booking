"use client";
import { useState } from "react";
import Link from "next/link";
import { forgotPassword } from "@/client/services/adminService";
import AuthCard from "@/client/components/AuthCard";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    const data = await forgotPassword(email);
    setMessage(data.message);
  }

  return (
    <AuthCard title="Forgot password" subtitle="Enter your admin email and we'll send a reset link.">
      <form onSubmit={handleSubmit}>
        <input type="email" placeholder="Admin email" value={email} onChange={(event) => setEmail(event.target.value)} required />
        <button className="btn mt-3 w-full">Send reset link</button>
      </form>
      {message && <p className="mt-3 text-sm font-medium text-brand">{message}</p>}
      <p className="mt-5 text-sm"><Link className="font-medium text-brand hover:underline" href="/admin/login">Back to login</Link></p>
    </AuthCard>
  );
}
