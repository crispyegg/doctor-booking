import mongoose from "mongoose";

const AdminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // bcrypt hash, never plain text
  resetTokenHash: String, // we store only the hash, so a DB leak can't be used to reset
  resetTokenExpires: Date,
});

export default mongoose.models.Admin || mongoose.model("Admin", AdminSchema);
