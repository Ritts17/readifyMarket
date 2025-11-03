const express = require("express");
const router = express.Router();
const {
  addOrder,
  getAllOrders,
  getOrderById,
  getOrdersByUserId,
  updateOrder,
  deleteOrder,
} = require("../controllers/orderController");
const { validateToken, authorizeRoles } = require("../middleware/auth");

router.post("/order/addOrder", validateToken, authorizeRoles("user"), addOrder);

router.get("/order/getAllOrders", validateToken, authorizeRoles("admin"), getAllOrders);

router.get("/order/getOrderById/:id", validateToken, authorizeRoles("user", "admin"), getOrderById);
router.get("/order/getOrdersByUserId/:userId", validateToken, authorizeRoles("user", "admin"), getOrdersByUserId);

// FIXED: Allow both admin and user to update orders
router.put("/order/updateOrder/:id", validateToken, authorizeRoles("user", "admin"), updateOrder);

// FIXED: Allow both admin and user to delete orders (if needed)
router.delete("/order/deleteOrder/:id", validateToken, authorizeRoles("user", "admin"), deleteOrder);

module.exports = router;