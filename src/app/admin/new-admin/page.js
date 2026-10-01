"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createAdmin } from "@/client/services/adminService";
import AuthCard from "@/client/components/AuthCard";

export default function NewAdmin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");
    try {
      await createAdmin(email, password);
      setIsError(false);
      setMessage("Admin created. They can log in now.");
      setEmail("");
      setPassword("");
    } catch (error) {
      // 401 means the session expired, so send the user back to login
      if (error.response?.status === 401) return router.push("/admin/login");
      setIsError(true);
      setMessage(error.response?.data?.message || "Something went wrong");
    }
  }

  return (
    <AuthCard title="Add a new admin" subtitle="Create a login for another team member.">
      <form onSubmit={handleSubmit}>
        <input type="email" placeholder="New admin email" value={email} onChange={(event) => setEmail(event.target.value)} required />
        <input type="password" placeholder="Password (min 8 characters)" value={password} onChange={(event) => setPassword(event.target.value)} required />
        <button className="btn mt-3 w-full">Create admin</button>
      </form>
      {message && <p className={`mt-3 text-sm font-medium ${isError ? "text-red-600" : "text-brand"}`}>{message}</p>}
      <p className="mt-5 text-sm"><Link className="font-medium text-brand hover:underline" href="/admin/dashboard">Back to dashboard</Link></p>
    </AuthCard>
  );
}
