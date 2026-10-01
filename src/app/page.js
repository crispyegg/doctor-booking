"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getTreatments } from "@/client/services/bookingService";
import Header from "@/client/components/Header";

export default function HomePage() {
  const [treatments, setTreatments] = useState([]);

  // Only needed for the Treatments cards below
  useEffect(() => {
    async function loadTreatments() {
      const treatmentList = await getTreatments();
      setTreatments(treatmentList);
    }
    loadTreatments();
  }, []);

  return (
    <>
      <Header />

      <section className="bg-gradient-to-b from-mint to-paper">
        <div className="mx-auto max-w-6xl px-5 pb-16 pt-16">
          <h1 className="max-w-2xl text-4xl font-extrabold leading-tight sm:text-5xl">
            See the right doctor, without the waiting room.
          </h1>
          <p className="mt-4 max-w-xl text-lg text-ink/70">Pick a treatment, choose a doctor, and lock in a time. Takes about a minute.</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/book" className="btn">Book an appointment</Link>
            <Link href="/#treatments" className="btn !bg-white !text-ink border border-line hover:!bg-mint">See treatments</Link>
          </div>
        </div>
      </section>

      {/* Treatments: each card opens the booking page with that treatment already selected */}
      <section id="treatments" className="mx-auto max-w-6xl px-5 py-14">
        <h2 className="text-3xl font-extrabold">Our treatments</h2>
        <p className="mt-2 max-w-xl text-ink/70">Choose what you need and we'll show only the doctors who offer it.</p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {treatments.map((item) => (
            <div key={item._id} className="flex flex-col rounded-2xl border border-line bg-white p-6">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-mint text-lg font-bold text-brand">{item.name.charAt(0)}</span>
              <h3 className="mt-4 text-lg font-bold">{item.name}</h3>
              <p className="mt-1 flex-1 text-sm text-ink/60">{item.description}</p>
              <Link href={`/book?treatment=${item._id}`} className="mt-4 self-start text-sm font-bold text-brand hover:underline">
                Book this treatment
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section id="about" className="bg-mint">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-2">
          <div>
            <h2 className="text-3xl font-extrabold">About CareSlot</h2>
            <p className="mt-3 text-ink/70">
              CareSlot makes booking a doctor simple. You tell us what you need, pick a doctor who offers it, and choose a time that is actually free.
              No phone calls, no waiting on hold.
            </p>
          </div>
          <ul className="space-y-4">
            {[
              ["Doctors matched to your treatment", "You only see doctors who offer the treatment you picked."],
              ["No double bookings", "A taken slot is greyed out, and we check again before saving."],
              ["Instant email confirmation", "Your appointment details land in your inbox right after booking."],
            ].map(([title, text]) => (
              <li key={title} className="rounded-2xl bg-white p-5">
                <p className="font-bold">{title}</p>
                <p className="mt-1 text-sm text-ink/60">{text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
