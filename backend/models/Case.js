const mongoose = require("mongoose");

const caseSchema = new mongoose.Schema({
  caseNumber: { type: String, required: true, unique: true },
  petitioner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  defendant: { type: String, required: true }, // Store defendant name or email
  caseDetails: { type: String, required: true },
  status: { type: String, default: "Pending" },
  hearingDate: { type: Date },
  judge: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
});


module.exports = mongoose.model("Case", caseSchema);
