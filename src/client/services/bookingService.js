import api from "./api";

// Public booking calls. Each one returns response.data so pages stay clean.
export async function getTreatments() {
  const response = await api.get("/treatments");
  return response.data;
}

export async function getDoctors(treatmentId) {
  const response = await api.get("/doctors", { params: { treatmentId } });
  return response.data;
}

export async function getBookedSlots(doctorId, date) {
  const response = await api.get("/appointments", { params: { doctorId, date } });
  return response.data;
}

export async function createAppointment(appointmentData) {
  const response = await api.post("/appointments", appointmentData);
  return response.data;
}
