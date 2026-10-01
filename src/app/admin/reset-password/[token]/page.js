"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { resetPassword } from "@/client/services/adminService";
import AuthCard from "@/client/components/AuthCard";

export default function ResetPassword() {
  const { token } = useParams();
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      await resetPassword(token, password);
      setIsError(false);
      setMessage("Password updated. Redirecting to login...");
      setTimeout(() => router.push("/admin/login"), 1500);
    } catch (err) {
      setIsError(true);
      setMessage(err.response?.data?.message || "Something went wrong");
    }
  }

  return (
    <AuthCard title="Set a new password" subtitle="Use at least 8 characters.">
      <form onSubmit={handleSubmit}>
        <input type="password" placeholder="New password" value={password} onChange={(event) => setPassword(event.target.value)} required />
        <button className="btn mt-3 w-full">Update password</button>
      </form>
      {message && <p className={`mt-3 text-sm font-medium ${isError ? "text-red-600" : "text-brand"}`}>{message}</p>}
    </AuthCard>
  );
}
