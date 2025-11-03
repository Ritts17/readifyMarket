const mongoose = require("mongoose");
const { Schema } = mongoose;

const allowedStatuses = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];

const orderSchema = new Schema(
  {
    orderDate: {
      type: Date,
      default: Date.now,
    },
    orderStatus: {
      type: String,
      required: true,
      enum: allowedStatuses,
    },
    shippingAddress: {
      type: String,
      required: true,
    },
    billingAddress: {
      type: String,
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    orderItems: [
      {
        type: Schema.Types.ObjectId,
        ref: "OrderItem",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
