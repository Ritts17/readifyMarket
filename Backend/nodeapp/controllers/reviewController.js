const Review = require('../models/review');

async function addReview(req, res) {
  try {
    const review = await Review.create(req.body);
    return res.status(201).json({ message: 'Review Added Successfully', review });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

async function deleteReview(req, res) {
  try {
    const { id } = req.params;
    const deleted = await Review.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: `Cannot find any review with ID ${id}` });
    return res.status(200).json({ message: 'Review Deleted Successfully' });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

async function getReviewsByBookId(req, res) {
  try {
    const { bookId } = req.params;
    const reviews = await Review.find({ book: bookId }).populate('user');
    return res.status(200).json({ reviews });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

async function getReviewsByUserId(req, res) {
  try {
    const { userId } = req.params;
    const reviews = await Review.find({ user: userId }).populate('book');
    return res.status(200).json({ reviews });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

async function getAllReviews(req, res) {
  try {
    const reviews = await Review.find({}).populate('user').populate('book');
    return res.status(200).json({ reviews });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

module.exports = {
  addReview,
  deleteReview,
  getReviewsByBookId,
  getReviewsByUserId,
  getAllReviews,
};