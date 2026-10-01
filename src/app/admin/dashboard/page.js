"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getAllAppointments, updateAppointmentStatus, logoutAdmin } from "@/client/services/adminService";
import Header from "@/client/components/Header";

// Status colors live in one object so the select and its look can't drift apart
const STATUS_STYLE = {
  pending: "bg-amber-50 text-amber-800 border-amber-200",
  confirmed: "bg-emerald-50 text-emerald-800 border-emerald-200",
  cancelled: "bg-red-50 text-red-700 border-red-200",
};

export default function Dashboard() {
  const router = useRouter();
  const [appointments, setAppointments] = useState([]);

  async function loadAppointments() {
    try {
      const appointmentList = await getAllAppointments();
      setAppointments(appointmentList);
    } catch (error) {
      // 401 means no valid cookie, so send the user to login
      if (error.response?.status === 401) router.push("/admin/login");
    }
  }

  useEffect(() => {
    loadAppointments();
  }, []);

  async function changeStatus(id, status) {
    await updateAppointmentStatus(id, status);
    await loadAppointments();
  }

  async function handleLogout() {
    await logoutAdmin();
    router.push("/admin/login");
  }

  const countOf = (status) => appointments.filter((item) => item.status === status).length;
  const stats = [["Total", appointments.length], ["Pending", countOf("pending")], ["Confirmed", countOf("confirmed")], ["Cancelled", countOf("cancelled")]];

  return (
    <>
      <Header />
      <main className="mx-auto max-w-6xl px-5 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-extrabold">Bookings</h1>
          <div className="flex gap-2">
            <Link href="/admin/new-admin" className="btn">Add admin</Link>
            <button className="btn !bg-white !text-ink border border-line hover:!bg-mint" onClick={handleLogout}>Log out</button>
          </div>
        </div>

        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {stats.map(([label, value]) => (
            <div key={label} className="rounded-2xl border border-line bg-white p-4">
              <p className="text-sm text-ink/60">{label}</p>
              <p className="text-3xl font-extrabold">{value}</p>
            </div>
          ))}
        </div>

        <div className="overflow-x-auto rounded-2xl border border-line bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-mint/60 text-ink/70">
              <tr>
                {["Patient", "Contact", "Treatment", "Doctor", "Date", "Time", "Status"].map((heading) => (
                  <th key={heading} className="p-3 font-semibold">{heading}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {appointments.map((item) => (
                <tr key={item._id} className="border-t border-line">
                  <td className="p-3 font-semibold">{item.patientName}</td>
                  <td className="p-3">{item.patientEmail}<br /><span className="text-ink/60">{item.patientPhone}</span></td>
                  <td className="p-3">{item.treatment?.name}</td>
                  <td className="p-3">{item.doctor?.name}</td>
                  <td className="p-3">{item.date}</td>
                  <td className="p-3">{item.timeSlot}</td>
                  <td className="p-3">
                    <select className={`!my-0 !w-auto !rounded-full !py-1.5 text-sm font-semibold ${STATUS_STYLE[item.status]}`} value={item.status} onChange={(event) => changeStatus(item._id, event.target.value)}>
                      <option value="pending">pending</option>
                      <option value="confirmed">confirmed</option>
                      <option value="cancelled">cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {appointments.length === 0 && <p className="p-6 text-center text-ink/60">No bookings yet. New appointments will show up here.</p>}
        </div>
      </main>
    </>
  );
}
