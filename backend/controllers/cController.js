const registerCase = async (req, res) => {
    try {
      console.log("Decoded User:", req.user); // ✅ Check if user ID and role exist
  
      if (!req.user || !req.user.id) {
        return res.status(400).json({ message: "User authentication failed" });
      }
  
      const { caseNumber, defendant, caseDetails } = req.body;
      if (!caseNumber || !defendant || !caseDetails) {
        return res.status(400).json({ message: "All fields are required" });
      }
  
      const newCase = new Case({
        caseNumber,
        petitioner: req.user.id, // ✅ Ensure req.user.id is available
        defendant,
        caseDetails,
        status: "Pending",
      });
  
      await newCase.save();
      res.status(201).json({ message: "Case registered successfully", newCase });
  
    } catch (error) {
      console.error("Error registering case:", error);
      res.status(500).json({ message: "Error registering case", error: error.message });
    }
  };
  