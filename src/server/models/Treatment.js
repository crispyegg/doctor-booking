import mongoose from "mongoose";

const TreatmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
});

export default mongoose.models.Treatment || mongoose.model("Treatment", TreatmentSchema);
