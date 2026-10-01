import mongoose from "mongoose";

const DoctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  speciality: String,
  // A doctor can perform many treatments, this is how we filter doctors by treatment
  treatments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Treatment" }],
});

export default mongoose.models.Doctor || mongoose.model("Doctor", DoctorSchema);
