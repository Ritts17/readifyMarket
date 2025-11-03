const express = require("express");
const router = express.Router();
const { 
  addUser, 
  getUserByEmailAndPassword, 
  logout, 
  validateTokenEndpoint,  // CHANGED: Use the endpoint function instead
  verifyEmail, 
  resetPassword, 
  getAllUsers 
} = require("../controllers/userController");
const { validateToken, authorizeRoles } = require("../middleware/auth");

router.post("/users/signup", addUser);
router.post("/users/login", getUserByEmailAndPassword);
router.post("/users/logout", logout);

// CHANGED: This now uses validateTokenEndpoint controller function
router.get("/users/validate-token", validateTokenEndpoint);

router.post('/users/verify-email', verifyEmail);
router.post('/users/reset-password', resetPassword);
router.get('/users/getAllUsers', validateToken, authorizeRoles("admin"), getAllUsers);

module.exports = router;