import jwt from "jsonwebtoken";

// Reads the httpOnly cookie and returns the admin id, or null if not logged in.
// Next.js route handlers have no app.use(), so controllers call this at the top instead.
export function getAdminId(request) {
  const token = request.cookies.get("admin_token")?.value;
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.id;
  } catch (error) {
    return null; // expired or tampered token
  }
}
