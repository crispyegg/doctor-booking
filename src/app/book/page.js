"use client";
import { useEffect, useState } from "react";
import { getTreatments, getDoctors, getBookedSlots, createAppointment } from "@/client/services/bookingService";
import Header from "@/client/components/Header";

const TIME_SLOTS = ["10:00 AM", "11:00 AM", "12:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM"];

// Small title with a number badge, the steps really are a sequence so numbering is useful here
function StepTitle({ number, title, done }) {
  return (
    <div className="mb-3 flex items-center gap-3">
      <span className={`grid h-7 w-7 place-items-center rounded-full text-sm font-bold ${done ? "bg-brand text-white" : "bg-mint text-brand"}`}>
        {done ? "✓" : number}
      </span>
      <h2 className="text-lg font-bold">{title}</h2>
    </div>
  );
}

export default function BookingPage() {
  const [treatments, setTreatments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [treatmentId, setTreatmentId] = useState("");
  const [doctorId, setDoctorId] = useState("");
  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [patientName, setPatientName] = useState("");
  const [patientEmail, setPatientEmail] = useState("");
  const [patientPhone, setPatientPhone] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [isBooked, setIsBooked] = useState(false);
  const [loading, setLoading] = useState(false);

  // Step 1: load treatments once on page load
  useEffect(() => {
    async function loadTreatments() {
      const treatmentList = await getTreatments();
      setTreatments(treatmentList);
      // Home page cards link here as /book?treatment=<id>. We read window.location
      // instead of useSearchParams so this page doesn't need a Suspense wrapper.
      const preselected = new URLSearchParams(window.location.search).get("treatment");
      if (preselected) setTreatmentId(preselected);
    }
    loadTreatments();
  }, []);

  // Step 2: when treatment changes, load only doctors who do that treatment
  useEffect(() => {
    async function loadDoctors() {
      if (!treatmentId) return;
      const doctorList = await getDoctors(treatmentId);
      setDoctors(doctorList);
    }
    setDoctorId("");
    setTimeSlot("");
    loadDoctors();
  }, [treatmentId]);

  // Step 3: when doctor or date changes, grey out slots already taken
  useEffect(() => {
    async function loadSlots() {
      if (!doctorId || !date) return;
      const slots = await getBookedSlots(doctorId, date);
      setBookedSlots(slots);
    }
    setTimeSlot("");
    loadSlots();
  }, [doctorId, date]);

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      await createAppointment({ treatmentId, doctorId, patientName, patientEmail, patientPhone, date, timeSlot });
      setIsBooked(true);
    } catch (error) {
      setIsError(true);
      setMessage(error.response?.data?.message || "Something went wrong");
    }
    setLoading(false);
  }

  function bookAnother() {
    setIsBooked(false); setIsError(false); setMessage("");
    setTreatmentId(""); setDoctorId(""); setDate(""); setTimeSlot("");
    setPatientName(""); setPatientEmail(""); setPatientPhone("");
  }

  const today = new Date().toISOString().split("T")[0];
  const chosenTreatment = treatments.find((item) => item._id === treatmentId);
  const chosenDoctor = doctors.find((item) => item._id === doctorId);
  // Locked steps stay visible but dimmed, so the page doesn't jump around as the user moves forward
  const lock = (isOpen) => (isOpen ? "" : "pointer-events-none opacity-40");

  return (
    <>
      <Header />

      <section className="bg-gradient-to-b from-mint to-paper">
        <div className="mx-auto max-w-6xl px-5 pb-6 pt-10">
          <h1 className="text-3xl font-extrabold sm:text-4xl">Book an appointment</h1>
          <p className="mt-2 max-w-xl text-ink/70">Pick a treatment, choose a doctor, and lock in a time. Takes about a minute.</p>
        </div>
      </section>

      <main className="mx-auto grid max-w-6xl gap-8 px-5 pb-16 lg:grid-cols-[1fr_320px]">
        {isBooked ? (
          <div className="rounded-3xl border border-line bg-white p-10 text-center lg:col-span-2">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-mint text-3xl text-brand">✓</div>
            <h2 className="mt-4 text-2xl font-extrabold">You're booked, {patientName.split(" ")[0]}</h2>
            <p className="mt-2 text-ink/70">
              {chosenTreatment?.name} with {chosenDoctor?.name} on {date} at {timeSlot}. A confirmation email is on its way.
            </p>
            <button className="btn mt-6" onClick={bookAnother}>Book another appointment</button>
          </div>
        ) : (
          <>
            <div className="space-y-8">
              <section>
                <StepTitle number={1} title="Choose a treatment" done={!!treatmentId} />
                <div className="grid gap-3 sm:grid-cols-2">
                  {treatments.map((item) => (
                    <button key={item._id} type="button" className={`choice ${treatmentId === item._id ? "active" : ""}`} onClick={() => setTreatmentId(item._id)}>
                      <span className="block font-bold">{item.name}</span>
                      <span className="text-sm text-ink/60">{item.description}</span>
                    </button>
                  ))}
                </div>
              </section>

              <section className={lock(treatmentId)}>
                <StepTitle number={2} title="Choose a doctor" done={!!doctorId} />
                <div className="grid gap-3 sm:grid-cols-2">
                  {doctors.map((item) => (
                    <button key={item._id} type="button" className={`choice flex items-center gap-3 ${doctorId === item._id ? "active" : ""}`} onClick={() => setDoctorId(item._id)}>
                      {/* Initials avatar, so we don't need doctor photos in the database */}
                      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-brand font-bold text-white">
                        {item.name.replace("Dr. ", "").charAt(0)}
                      </span>
                      <span>
                        <span className="block font-bold">{item.name}</span>
                        <span className="text-sm text-ink/60">{item.speciality}</span>
                      </span>
                    </button>
                  ))}
                </div>
              </section>

              <section className={lock(doctorId)}>
                <StepTitle number={3} title="Pick a date and time" done={!!timeSlot} />
                <input type="date" min={today} value={date} onChange={(event) => setDate(event.target.value)} />
                {date && (
                  <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {TIME_SLOTS.map((slot) => (
                      <button key={slot} type="button" disabled={bookedSlots.includes(slot)} className={`choice !p-3 text-center text-sm font-semibold ${timeSlot === slot ? "active" : ""}`} onClick={() => setTimeSlot(slot)}>
                        {slot}
                      </button>
                    ))}
                  </div>
                )}
              </section>

              <form onSubmit={handleSubmit} className={lock(timeSlot)}>
                <StepTitle number={4} title="Your details" done={false} />
                <input placeholder="Full name" value={patientName} onChange={(event) => setPatientName(event.target.value)} required />
                <input type="email" placeholder="Email" value={patientEmail} onChange={(event) => setPatientEmail(event.target.value)} required />
                <input placeholder="Phone" value={patientPhone} onChange={(event) => setPatientPhone(event.target.value)} required />
                <button className="btn mt-3 w-full sm:w-auto" disabled={loading}>{loading ? "Booking..." : "Confirm appointment"}</button>
                {message && <p className={`mt-3 text-sm font-medium ${isError ? "text-red-600" : "text-brand"}`}>{message}</p>}
              </form>
            </div>

            {/* Sticky summary, so the user always sees what they have picked so far */}
            <aside className="h-fit rounded-3xl border border-line bg-white p-6 lg:sticky lg:top-6">
              <h3 className="font-extrabold">Your appointment</h3>
              <dl className="mt-4 space-y-3 text-sm">
                {[["Treatment", chosenTreatment?.name], ["Doctor", chosenDoctor?.name], ["Date", date], ["Time", timeSlot]].map(([label, value]) => (
                  <div key={label} className="flex justify-between gap-3 border-b border-line pb-2">
                    <dt className="text-ink/60">{label}</dt>
                    <dd className={value ? "font-semibold" : "text-ink/30"}>{value || "Not chosen"}</dd>
                  </div>
                ))}
              </dl>
            </aside>
          </>
        )}
      </main>
    </>
  );
}
