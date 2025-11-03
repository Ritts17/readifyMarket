const jwt = require("jsonwebtoken");
const SECRET = process.env.JWT_SECRET || "221122";

function generateToken(id, role) {
  return jwt.sign({ userId: id, role }, SECRET, { expiresIn: "24h" });
}

function validateToken(req, res, next) {
  try {
    if (req.headers.authorization) {
      const authHeader = req.headers.authorization;
      if (authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
      }
    }
    
    if (!token) {
      console.log("❌ No token found in cookies or header");
      return res.status(401).json({ message: "Authentication failed" });
    }
    
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded; // { userId, role }
    console.log("✅ Decoded JWT:", decoded);
    next();
  } catch (err) {
    console.log("❌ Token verification error:", err.message);
    return res.status(401).json({ message: "Authentication failed" });
  }
}

function authorizeRoles(...roles) {
  return (req, res, next) => {
    console.log("🔎 Authorize check:", req.user);
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden: Insufficient permissions" });
    }
    next();
  };
}

module.exports = {
  generateToken,
  validateToken,
  authorizeRoles,
};