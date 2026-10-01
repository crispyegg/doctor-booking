import { NextResponse } from "next/server";
import { connectDB } from "@/server/config/db";
import Doctor from "@/server/models/Doctor";

// GET /api/doctors?treatmentId=xxx
export async function getDoctors(request) {
  await connectDB();
  const treatmentId = request.nextUrl.searchParams.get("treatmentId");
  const filter = treatmentId ? { treatments: treatmentId } : {};
  const doctors = await Doctor.find(filter);
  return NextResponse.json(doctors);
}
