import api from "./api";

// Admin calls. The JWT travels in an httpOnly cookie, so no token handling is needed here.
export async function loginAdmin(email, password) {
  const response = await api.post("/admin/login", { email, password });
  return response.data;
}

export async function logoutAdmin() {
  const response = await api.post("/admin/logout");
  return response.data;
}

export async function forgotPassword(email) {
  const response = await api.post("/admin/forgot-password", { email });
  return response.data;
}

export async function resetPassword(token, password) {
  const response = await api.post("/admin/reset-password", { token, password });
  return response.data;
}

export async function getAllAppointments() {
  const response = await api.get("/admin/appointments");
  return response.data;
}

export async function updateAppointmentStatus(id, status) {
  const response = await api.patch("/admin/appointments", { id, status });
  return response.data;
}

export async function createAdmin(email, password) {
  const response = await api.post("/admin/create", { email, password });
  return response.data;
}
