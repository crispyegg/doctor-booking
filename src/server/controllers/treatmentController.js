import { NextResponse } from "next/server";
import { connectDB } from "@/server/config/db";
import Treatment from "@/server/models/Treatment";

export async function getTreatments() {
  await connectDB();
  const treatments = await Treatment.find();
  return NextResponse.json(treatments);
}
