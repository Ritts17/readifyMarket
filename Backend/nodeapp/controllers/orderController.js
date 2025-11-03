const mongoose = require("mongoose");
const Order = require("../models/order");
const Book = require("../models/book");
const OrderItem = require("../models/orderItem");

async function addOrder(req, res) {
  try {
    const { orderItems, user, shippingAddress, billingAddress } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: "Order must contain at least one item." });
    }

    if (!mongoose.Types.ObjectId.isValid(user)) {
      return res.status(400).json({ message: "Invalid user ID format." });
    }

    let newOrder = new Order({
      orderStatus: "Pending",
      shippingAddress,
      billingAddress,
      totalAmount: 0,
      user,
      orderItems: [],
    });

    await newOrder.save();

    let totalAmount = 0;
    let orderItemIds = [];

    for (const item of orderItems) {
      const { bookId, quantity } = item;

      if (!mongoose.Types.ObjectId.isValid(bookId)) {
        return res.status(400).json({ message: `Invalid book ID: ${bookId}` });
      }

      const book = await Book.findById(bookId);
      if (!book) {
        return res.status(404).json({ message: `Book not found with ID ${bookId}` });
      }

      if (book.stockQuantity < quantity) {
        return res.status(400).json({ message: `Not enough stock for book ${book.title}` });
      }

      book.stockQuantity -= quantity;
      await book.save();

      const orderItem = new OrderItem({
        quantity,
        price: book.price,
        book: book._id,
        order: newOrder._id,
      });

      await orderItem.save();
      orderItemIds.push(orderItem._id);

      totalAmount += book.price * quantity;
    }

    newOrder.orderItems = orderItemIds;
    newOrder.totalAmount = totalAmount;
    await newOrder.save();

    return res.status(201).json({
      message: "Order Placed Successfully",
      order: newOrder,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

async function getAllOrders(req, res) {
  try {
    const query = Order.find({});
    if (typeof query.populate === "function") {
      query.populate("user", "userName email mobileNumber");
      query.populate({
        path: "orderItems",
        populate: { path: "book", select: "title category coverImage price" },
      });
      const orders = typeof query.exec === "function" ? await query.exec() : await query;
      return res.status(200).json(orders);
    }
    const orders = await Order.find({});
    return res.status(200).json(orders);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

async function getOrderById(req, res) {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: `Invalid order ID format: ${id}` });
    }

    const order = await Order.findById(id)
      .populate("user", "userName email mobileNumber")
      .populate({
        path: "orderItems",
        populate: { path: "book", select: "title category coverImage price" },
      });

    if (!order) {
      return res.status(404).json({ message: `Cannot find any order with ID ${id}` });
    }

    return res.status(200).json(order);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

async function getOrdersByUserId(req, res) {
  try {
    const { userId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: `Invalid user ID format: ${userId}` });
    }

    const orders = await Order.find({ user: userId })
      .populate("user", "userName email mobileNumber")
      .populate({
        path: "orderItems",
        populate: { path: "book", select: "title category coverImage price" },
      });

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: `No orders found for user ID ${userId}` });
    }

    return res.status(200).json(orders);
  } catch (err) {
    return res.status(500).json({ message: "Error fetching orders" });
  }
}

async function updateOrder(req, res) {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: `Invalid order ID format: ${id}` });
    }

    const existingOrder = await Order.findById(id);
    
    if (!existingOrder) {
      return res.status(404).json({ message: `Cannot find any order with ID ${id}` });
    }

    // If order is being cancelled, restore stock quantities
    if (req.body.orderStatus === 'Cancelled' && existingOrder.orderStatus !== 'Cancelled') {
      console.log('Cancelling order - restoring stock quantities');
      
      // Get all order items
      const orderItems = await OrderItem.find({ _id: { $in: existingOrder.orderItems } });
      
      // Restore stock for each item
      for (const item of orderItems) {
        const book = await Book.findById(item.book);
        if (book) {
          book.stockQuantity += item.quantity;
          await book.save();
          console.log(`Restored ${item.quantity} units to book: ${book.title}`);
        }
      }
    }

    // Prevent cancelled orders from being changed to other statuses
    if (existingOrder.orderStatus === 'Cancelled' && req.body.orderStatus !== 'Cancelled') {
      return res.status(400).json({ 
        message: 'Cannot modify a cancelled order. Cancelled orders cannot be reactivated.' 
      });
    }

    const updatedOrder = await Order.findByIdAndUpdate(id, req.body, { new: true });

    return res.status(200).json({
      message: "Order Updated Successfully",
      order: updatedOrder,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}


async function deleteOrder(req, res) {
  try {
    const { id } = req.params;
    
    // Simple delete like deleteBook function
    await Order.findByIdAndDelete(id);
    
    return res.status(200).json({ 
      message: "Order Deleted Successfully"
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

// async function deleteOrder(req, res) {
//   try {
//     const { id } = req.params;
    
//     // First, check if order exists
//     const order = await Order.findById(id);
    
//     if (!order) {
//       return res.status(404).json({ message: `Cannot find any order with ID ${id}` });
//     }

//     // Get order items before deleting
//     const orderItemIds = order.orderItems;

//     // Restore stock before deleting (if order wasn't cancelled)
//     if (order.orderStatus !== 'Cancelled' && orderItemIds && orderItemIds.length > 0) {
//       const orderItems = await OrderItem.find({ _id: { $in: orderItemIds } });
      
//       for (const item of orderItems) {
//         const book = await Book.findById(item.book);
//         if (book) {
//           book.stockQuantity += item.quantity;
//           await book.save();
//         }
//       }
      
//       // Delete order items
//       await OrderItem.deleteMany({ _id: { $in: orderItemIds } });
//     }

//     // Delete order
//     await Order.findByIdAndDelete(id);
    
//     return res.status(200).json({ 
//       message: "Order Deleted Successfully"
//     });
//   } catch (err) {
//     return res.status(500).json({ message: err.message });
//   }
// }

module.exports = {
  addOrder,
  getAllOrders,
  getOrderById,
  getOrdersByUserId,
  updateOrder,
  deleteOrder,
};