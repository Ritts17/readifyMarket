const mongoose = require('mongoose');
const { Schema } = mongoose;

const allowedCategories = [
  'Fiction', 'Non-fiction', 'Science', 'Comics', 'Romance', 'Thriller', 'Fantasy', 'Children'
];

const bookSchema = new Schema({
  title:
  {
    type: String,
    required: true,
    trim: true
  },
  author:
  {
    type: String,
    required: true,
    trim: true
  },
  description:
  {
    type: String,
    required: true,
    trim: true
  },
  price:
  {
    type: Number,
    required: true,
    min: 0
  },
  stockQuantity:
  {
    type: Number,
    required: true,
    min: 0
  },
  category:
  {
    type: String,
    required: true,
    enum: allowedCategories
  },
  coverImage:
  {
    type: String,
    required: true,
    trim: true
  }
}, { timestamps: true });

module.exports = mongoose.model("Book", bookSchema)

