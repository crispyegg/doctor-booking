import jwt from "jsonwebtoken";

// Creates the JWT that we put in the admin's cookie after login
export function signAdminToken(adminId) {
  return jwt.sign({ id: adminId }, process.env.JWT_SECRET, { expiresIn: "1d" });
}
