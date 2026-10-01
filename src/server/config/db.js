import mongoose from "mongoose";

// Cache the connection on global so Next.js hot reload doesn't open a new one every time
let cached = global.mongooseCache;
if (!cached) cached = global.mongooseCache = { conn: null };

export async function connectDB() {
  if (cached.conn) return cached.conn;
  cached.conn = await mongoose.connect(process.env.MONGODB_URI);
  return cached.conn;
}
