const jwt = require("jsonwebtoken");

exports.verifyToken = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) return res.status(401).json({ error: "No Token Provided" });

  try {
    const actualToken = token.startsWith("Bearer ") ? token.split(" ")[1] : token;
    const verified = jwt.verify(actualToken, process.env.JWT_SECRET);
    req.user = verified; // Add decoded user data to request

    next();
  } catch (error) {
    res.status(400).json({ error: "Invalid Token" });
  }
};

// Middleware to check if user is Petitioner
exports.isPetitioner = (req, res, next) => {
  if (req.user.role !== "petitioner") {
    return res.status(403).json({ error: "Access Denied: Only petitioners can register cases" });
  }
  
  next(); // Proceed if role is correct
};

// Middleware to check if user is Judge
exports.isJudge = (req, res, next) => {
  if (req.user.role !== "judge") {
    return res.status(403).json({ error: "Access denied" });
  }
  next();
};
