import { listAppointments, updateAppointmentStatus } from "@/server/controllers/appointmentController";

export const GET = listAppointments;
export const PATCH = updateAppointmentStatus;
