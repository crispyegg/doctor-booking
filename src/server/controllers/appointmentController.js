import { NextResponse } from "next/server";
import { connectDB } from "@/server/config/db";
import Appointment from "@/server/models/Appointment";
import Doctor from "@/server/models/Doctor";
import Treatment from "@/server/models/Treatment";
import { sendMail } from "@/server/utils/mailer";
import { getAdminId } from "@/server/middleware/adminAuth";

// ---------- public ----------

// GET /api/appointments?doctorId=x&date=YYYY-MM-DD -> slots already taken
export async function getBookedSlots(request) {
  await connectDB();
  const doctorId = request.nextUrl.searchParams.get("doctorId");
  const date = request.nextUrl.searchParams.get("date");
  const booked = await Appointment.find({ doctor: doctorId, date, status: { $ne: "cancelled" } });
  const slots = booked.map((item) => item.timeSlot);
  return NextResponse.json(slots);
}

// POST /api/appointments
export async function createAppointment(request) {
  await connectDB();
  const body = await request.json();
  const { treatmentId, doctorId, patientName, patientEmail, patientPhone, date, timeSlot } = body;

  if (!treatmentId || !doctorId || !patientName || !patientEmail || !patientPhone || !date || !timeSlot) {
    return NextResponse.json({ message: "All fields are required" }, { status: 400 });
  }

  // Check again on the server, two people may pick the same slot at the same time
  const alreadyBooked = await Appointment.findOne({
    doctor: doctorId, date, timeSlot, status: { $ne: "cancelled" },
  });
  if (alreadyBooked) {
    return NextResponse.json({ message: "This slot was just booked, pick another" }, { status: 409 });
  }

  const appointment = await Appointment.create({
    treatment: treatmentId, doctor: doctorId, patientName, patientEmail, patientPhone, date, timeSlot,
  });

  const doctor = await Doctor.findById(doctorId);
  const treatment = await Treatment.findById(treatmentId);
  const details = `<p><b>Treatment:</b> ${treatment.name}<br/><b>Doctor:</b> ${doctor.name}<br/><b>Date:</b> ${date}<br/><b>Time:</b> ${timeSlot}</p>`;

  // Mail failure should not undo a saved booking, so we catch it and still return success
  try {
    await sendMail(patientEmail, "Your appointment is booked", `<p>Hi ${patientName}, your appointment request is received.</p>${details}`);
    await sendMail(process.env.SMTP_USER, "New appointment booked", `<p>${patientName} (${patientPhone}) booked.</p>${details}`);
  } catch (error) {
    console.error("Mail error:", error.message);
  }

  return NextResponse.json({ message: "Appointment booked", id: appointment._id }, { status: 201 });
}

// ---------- admin only ----------

// GET /api/admin/appointments
export async function listAppointments(request) {
  if (!getAdminId(request)) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  await connectDB();
  const appointments = await Appointment.find().populate("doctor", "name").populate("treatment", "name").sort({ createdAt: -1 });
  return NextResponse.json(appointments);
}

// PATCH /api/admin/appointments
export async function updateAppointmentStatus(request) {
  if (!getAdminId(request)) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  await connectDB();
  const { id, status } = await request.json();
  await Appointment.findByIdAndUpdate(id, { status });
  return NextResponse.json({ message: "Status updated" });
}
