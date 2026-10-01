import mongoose from "mongoose";

const AppointmentSchema = new mongoose.Schema(
  {
    treatment: { type: mongoose.Schema.Types.ObjectId, ref: "Treatment", required: true },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", required: true },
    patientName: { type: String, required: true },
    patientEmail: { type: String, required: true },
    patientPhone: { type: String, required: true },
    date: { type: String, required: true }, // "YYYY-MM-DD", plain string keeps slot checks simple
    timeSlot: { type: String, required: true },
    status: { type: String, enum: ["pending", "confirmed", "cancelled"], default: "pending" },
  },
  { timestamps: true }
);

export default mongoose.models.Appointment || mongoose.model("Appointment", AppointmentSchema);
