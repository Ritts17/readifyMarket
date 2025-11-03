const mongoose = require('mongoose');
const { Schema } = mongoose;


const reviewSchema = new Schema({
  reviewText:
  {
    type: String,
    required: true,
    trim: true
  },
  rating:
  {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  date:
  {
    type: Date,
    default: Date.now
  },
  user:
  {
    type: Schema.Types.ObjectId, ref: 'User',
    required: true
  },
  book: {
    type: Schema.Types.ObjectId,
    ref: 'Book',
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Review', reviewSchema);

