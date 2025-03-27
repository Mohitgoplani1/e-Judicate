const mongoose = require("mongoose");

const caseSchema = new mongoose.Schema({
  caseNumber: { type: String, required: true, unique: true },
  petitioner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  defendant: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  caseDetails: { type: String, required: true },
  status: { type: String, enum: ["Pending", "Scheduled", "Closed"], default: "Pending" },
  hearingDate: { type: Date, default: null },
  judge: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null }, // Judge assigned to case
}, { timestamps: true });

module.exports = mongoose.model("Case", caseSchema);
