const express = require("express");
const Case = require("../models/Case"); 
const { registerCase } = require("../controllers/cController.js");
const { verifyToken, isPetitioner, isJudge } = require("../middleware/caseMiddleware"); // Updated import

const router = express.Router();

/** 
 * 1️⃣ Register a Case (Petitioner) 
 */
router.post("/register", verifyToken, isPetitioner, async (req, res) => {
  try {
    const { caseNumber, defendant, caseDetails } = req.body;
    if (!caseNumber || !defendant || !caseDetails) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const existingCase = await Case.findOne({ caseNumber });
    if (existingCase) {
      return res.status(400).json({ message: "Case number already exists" });
    }
    const newCase = new Case({
      caseNumber,
      petitioner: req.user.id, // Extract from token
      defendant,
      caseDetails,
      status: "Pending",
    });

    await newCase.save();
    res.status(201).json({ message: "Case registered successfully", case: newCase });
  } catch (error) {
    res.status(500).json({ error: "Error registering case", details: error.message });
  }
});

/** 
 * 2️⃣ View Cases (All Roles) 
 */
router.get("/", verifyToken, async (req, res) => {
  try {
    let cases;
    if (req.user.role === "Judge") {
      cases = await Case.find(); // Judge sees all cases
    } else {
      cases = await Case.find({ 
        $or: [{ petitioner: req.user.id }, { defendant: req.user.id }] 
      }); // Petitioner & Defendant see only related cases
    }
    res.status(200).json(cases);
  } catch (error) {
    res.status(500).json({ error: "Error fetching cases", details: error.message });
  }
});

/** 
 * 3️⃣ Assign Hearing Date (Judge) 
 */
router.put("/assign-hearing/:caseId", verifyToken, isJudge, async (req, res) => {
  try {
    const { hearingDate } = req.body;

    const updatedCase = await Case.findByIdAndUpdate(
      req.params.caseId,
      { hearingDate, status: "Scheduled", judge: req.user.id },
      { new: true }
    );

    if (!updatedCase) return res.status(404).json({ error: "Case not found" });

    res.status(200).json({ message: "Hearing date assigned", case: updatedCase });
  } catch (error) {
    res.status(500).json({ error: "Error assigning hearing date", details: error.message });
  }
});

module.exports = router;
