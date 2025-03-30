const express = require("express");
const Case = require("../models/Case");
const User = require("../models/User"); // Import User model
const { verifyToken, isPetitioner, isJudge } = require("../middleware/caseMiddleware");

const router = express.Router();

/**
 * 1️⃣ Register a Case (Petitioner Only)
 */
router.post("/register", verifyToken, isPetitioner, async (req, res) => {
  try {
    const { caseNumber, defendant, caseDetails } = req.body;
    if (!caseNumber || !defendant || !caseDetails) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Ensure case number is unique
    const existingCase = await Case.findOne({ caseNumber });
    if (existingCase) {
      return res.status(400).json({ message: "Case number already exists" });
    }
    // Convert defendant from email to ObjectId
    const defendantUser = await User.findOne({ email: defendant });
    if (!defendantUser) {
      return res.status(400).json({ message: "Defendant not found" });
    }

    const newCase = new Case({
      caseNumber,
      petitioner: req.user.id,
      defendant: defendantUser._id, // Store as ObjectId
      caseDetails,
      status: "Pending",
    });

    await newCase.save();
    console.log("✅ Case Registered:", newCase);
    res.status(201).json({ message: "Case registered successfully", case: newCase });
  } catch (error) {
    console.error("❌ Error registering case:", error.message);
    res.status(500).json({ error: "Error registering case", details: error.message });
  }
});

/**
 * 2️⃣ View Cases (Judge, Petitioner, Defendant)
 */
router.get("/", verifyToken, async (req, res) => {
  try {
    let cases;
    console.log("🔍 Fetching cases for user:", req.user.id, "| Role:", req.user.role);

    if (req.user.role === "judge") {
      cases = await Case.find().populate("petitioner defendant judge", "name email");
    } else {
      cases = await Case.find({
        $or: [{ petitioner: req.user.id }, { defendant: req.user.id }]
      }).populate("petitioner defendant judge", "name email");
    }

    console.log("📢 Cases Retrieved:", cases);
    res.status(200).json(cases);
  } catch (error) {
    console.error("❌ Error fetching cases:", error.message);
    res.status(500).json({ error: "Error fetching cases", details: error.message });
  }
});

/**
 * 3️⃣ Assign Hearing Date (Judge Only)
 */
router.put("/assign-hearing/:caseNumber", verifyToken, isJudge, async (req, res) => {
  try {
    
    const { hearingDate } = req.body;
    if (!hearingDate) {
      return res.status(400).json({ error: "Hearing date is required" });
    }
      const casees = await Case.findOne({caseNumber : Number(req.params.caseNumber)}); ;
    if (!casees) {
      return res.status(404).json({ error: "Case not found" });
    }
    const caseId = casees._id; // Get the ObjectId of the case
    const updatedCase = await Case.findByIdAndUpdate(
      caseId,
      { hearingDate, status: "Scheduled", judge: req.user.id },
      { new: true }
    );

    if (!updatedCase) return res.status(404).json({ error: "Case not found" });

    console.log("✅ Hearing Date Assigned:", updatedCase);
    res.status(200).json({ message: "Hearing date assigned", case: updatedCase });
  } catch (error) {
    console.error("❌ Error assigning hearing date:", error.message);
    res.status(500).json({ error: "Error assigning hearing date", details: error.message });
  }
});

module.exports = router;
