const User = require("../models/user");
const { generateToken } = require("../middleware/auth");
const jwt = require("jsonwebtoken");

const SECRET = process.env.JWT_SECRET || "221122";

async function addUser(req, res) {
  console.log("Signup request received:", req.body);
  try {
    const { userName, email, password, confirmPassword, mobileNumber, role } = req.body;

    const user = new User({ userName, email, password, mobileNumber, role });
    await user.save();

    console.log("User saved:", user);
    return res.status(200).json({ message: "Success" });
  } catch (err) {
    console.error("Signup error:", err.message);
    return res.status(500).json({ message: err.message });
  }
}

async function getUserByEmailAndPassword(req, res) {
  console.log("Login request received:", req.body);
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    console.log("User fetched from DB:", user);

    if (!user) return res.status(404).json({ message: "User not found" });

    let isMatch = false;

    if (typeof user.comparePassword === "function") {
      isMatch = await user.comparePassword(password);
      console.log("Password match:", isMatch);
    } else {
      isMatch = user.password === password;
    }

    if (!isMatch) return res.status(200).json({ message: "Invalid credentials" });

    const token = generateToken(user._id, user.role);

    return res.status(200).json({
      userId: user._id,
      userName: user.userName,
      role: user.role,
      token,
      message: "Login successful",
    });
  } catch (err) {
    console.error("Login error:", err.message);
    return res.status(500).json({ message: err.message });
  }
}

async function logout(req, res) {
  return res.json({ message: "Logged out successfully" });
}

// ADD THIS NEW FUNCTION - This is what was missing!
async function validateTokenEndpoint(req, res) {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    
    if (!token) {
      return res.status(401).json({ valid: false, message: "No token provided" });
    }

    const decoded = jwt.verify(token, SECRET);
    
    // Optionally verify user still exists in database
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(401).json({ valid: false, message: "User not found" });
    }

    console.log("Token valid for user:", decoded.userId);
    return res.status(200).json({ 
      valid: true, 
      decoded: {
        userId: decoded.userId,
        role: decoded.role
      }
    });
  } catch (err) {
    console.error("Token validation failed:", err.message);
    
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ valid: false, message: "Invalid token" });
    }
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ valid: false, message: "Token expired" });
    }
    
    return res.status(401).json({ valid: false, message: "Token validation failed" });
  }
}

async function verifyEmail(req, res) {
  console.log("Verify email request received:", req.body);
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(200).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(200).json({ message: "User not found" });
    }

    return res.status(200).json({ message: "Email verified" });
  } catch (err) {
    console.error("Verify email error:", err.message);
    return res.status(500).json({ message: err.message });
  }
}

async function resetPassword(req, res) {
  console.log("Reset password request received:", req.body);
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res.status(200).json({ message: "Email and new password are required" });
    }

    if (newPassword.length < 6) {
      return res.status(200).json({ message: "Password must be at least 6 characters" });
    }

    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(200).json({ message: "User not found" });
    }

    // Update the password
    user.password = newPassword;
    await user.save();

    console.log("Password reset successful for user:", email);
    return res.status(200).json({ message: "Password reset successful" });
  } catch (err) {
    console.error("Reset password error:", err.message);
    return res.status(500).json({ message: err.message });
  }
}

async function getAllUsers(req, res) {
  console.log(req.body);
  try {
    const users = await User.find({}, 'userName email mobileNumber role');
    return res.status(200).json(users);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

// Update the module.exports to include the new function
module.exports = {
  addUser,
  getUserByEmailAndPassword,
  logout,
  validateTokenEndpoint,  // ADD THIS
  verifyEmail,
  resetPassword,
  getAllUsers
};