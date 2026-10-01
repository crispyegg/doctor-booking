import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/server/config/db";
import Treatment from "@/server/models/Treatment";
import Doctor from "@/server/models/Doctor";
import Admin from "@/server/models/Admin";

// Run once in the browser: http://localhost:3000/api/seed
export async function seedDatabase() {
  // Blocked in production so nobody can reset your data
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ message: "Not allowed" }, { status: 403 });
  }
  await connectDB();

  if ((await Treatment.countDocuments()) === 0) {
    const dental = await Treatment.create({ name: "Dental Checkup", description: "Cleaning and exam" });
    const skin = await Treatment.create({ name: "Skin Consultation", description: "Acne, allergies, rashes" });
    const eye = await Treatment.create({ name: "Eye Test", description: "Vision and eye health" });
    await Doctor.create({ name: "Dr. Sharma", speciality: "Dentist", treatments: [dental._id] });
    await Doctor.create({ name: "Dr. Khan", speciality: "Dermatologist", treatments: [skin._id] });
    await Doctor.create({ name: "Dr. Rao", speciality: "General", treatments: [dental._id, skin._id, eye._id] });
  }

  if ((await Admin.countDocuments()) === 0) {
    const hashed = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
    await Admin.create({ email: process.env.ADMIN_EMAIL, password: hashed });
  }

  return NextResponse.json({ message: "Seeded" });
}
