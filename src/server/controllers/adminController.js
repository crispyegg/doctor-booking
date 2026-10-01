import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { connectDB } from "@/server/config/db";
import Admin from "@/server/models/Admin";
import { signAdminToken } from "@/server/utils/token";
import { sendMail } from "@/server/utils/mailer";
import { getAdminId } from "@/server/middleware/adminAuth";

export async function loginAdmin(request) {
  await connectDB();
  const { email, password } = await request.json();

  const admin = await Admin.findOne({ email });
  // Same message for both cases so attackers can't find out which emails exist
  if (!admin) return NextResponse.json({ message: "Invalid email or password" }, { status: 401 });

  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) return NextResponse.json({ message: "Invalid email or password" }, { status: 401 });

  const token = signAdminToken(admin._id);
  const response = NextResponse.json({ message: "Logged in" });
  // httpOnly: JavaScript in the browser can't read it, which protects from XSS token theft
  response.cookies.set("admin_token", token, {
    httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24, path: "/",
  });
  return response;
}

export async function logoutAdmin() {
  const response = NextResponse.json({ message: "Logged out" });
  response.cookies.set("admin_token", "", { maxAge: 0, path: "/" });
  return response;
}

export async function forgotPassword(request) {
  await connectDB();
  const { email } = await request.json();
  const admin = await Admin.findOne({ email });

  if (admin) {
    const token = crypto.randomBytes(32).toString("hex");
    // Save the hash, email the real token
    admin.resetTokenHash = crypto.createHash("sha256").update(token).digest("hex");
    admin.resetTokenExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
    await admin.save();

    const link = `${process.env.APP_URL}/admin/reset-password/${token}`;
    await sendMail(email, "Reset your admin password", `<p>Click to reset (valid 15 minutes):</p><a href="${link}">${link}</a>`);
  }

  // Always the same reply, so we don't reveal whether the email exists
  return NextResponse.json({ message: "If this email exists, a reset link was sent" });
}

export async function resetPassword(request) {
  await connectDB();
  const { token, password } = await request.json();

  if (!password || password.length < 8) {
    return NextResponse.json({ message: "Password must be at least 8 characters" }, { status: 400 });
  }

  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
  const admin = await Admin.findOne({ resetTokenHash: tokenHash, resetTokenExpires: { $gt: new Date() } });
  if (!admin) return NextResponse.json({ message: "Link is invalid or expired" }, { status: 400 });

  admin.password = await bcrypt.hash(password, 10);
  // Clear the token so the same link can't be used twice
  admin.resetTokenHash = undefined;
  admin.resetTokenExpires = undefined;
  await admin.save();

  return NextResponse.json({ message: "Password updated" });
}

// POST /api/admin/create  (only a logged-in admin can add another admin)
export async function createAdmin(request) {
  // Without this check, anyone on the internet could make themselves an admin
  if (!getAdminId(request)) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  await connectDB();
  const { email, password } = await request.json();

  if (!email || !password || password.length < 8) {
    return NextResponse.json({ message: "Email and a password of 8+ characters are required" }, { status: 400 });
  }

  const cleanEmail = email.trim();
  const alreadyExists = await Admin.findOne({ email: cleanEmail });
  if (alreadyExists) return NextResponse.json({ message: "An admin with this email already exists" }, { status: 409 });

  // Hash before saving, the plain password is never stored
  const hashedPassword = await bcrypt.hash(password, 10);
  await Admin.create({ email: cleanEmail, password: hashedPassword });

  return NextResponse.json({ message: "Admin created" }, { status: 201 });
}
