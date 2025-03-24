const jwt = require("jsonwebtoken");

exports.verifyToken = (req, res, next) => {
  const token = req.header("Authorization");
  console.log("Received Token:", token);

  if (!token) return res.status(401).json({ error: "No Token Provided" });

  try {
    const actualToken = token.startsWith("Bearer ") ? token.split(" ")[1] : token;
    console.log("Extracted Token:", actualToken);

    const verified = jwt.verify(actualToken, process.env.JWT_SECRET);
    console.log("Decoded Token:", verified);

    req.user = verified;

    // 🔴 Check if role exists and is correct
    if (!req.user.role || req.user.role !== "petitioner") {
      return res.status(403).json({ error: "Access Denied: Only petitioners can register cases" });
    }

    next();
  } catch (error) {
    console.error("Token Verification Error:", error.message);
    res.status(400).json({ error: "Invalid Token" });
  }
};


// Middleware to check if user is Petitioner
exports.isPetitioner = (req, res, next) => {
  console.log("Checking Role in isPetitioner Middleware: ", req.user.role); // Debug Log

  if (req.user.role !== "petitioner") {
    return res.status(403).json({ error: "Access Denied: Only petitioners can register cases" });
  }
  
  next(); // Proceed if role is correct
};


// Middleware to check if user is Judge
exports.isJudge = (req, res, next) => {
  if (req.user.role !== "Judge") {
    return res.status(403).json({ error: "Access denied" });
  }
  next();
};
