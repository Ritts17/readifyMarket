const express = require('express');
const router = express.Router();
const { 
  addReview, 
  deleteReview, 
  getReviewsByBookId, 
  getReviewsByUserId,
  getAllReviews 
} = require('../controllers/reviewController');
const { validateToken, authorizeRoles } = require("../middleware/auth");

router.post('/review/addReview', validateToken, authorizeRoles("user"), addReview);
router.delete('/review/deleteReview/:id', validateToken, authorizeRoles("user", "admin"), deleteReview);

// ADD THESE NEW ROUTES
router.get('/review/getReviewsByBookId/:bookId', getReviewsByBookId);
router.get('/review/getReviewsByUserId/:userId', validateToken, authorizeRoles("user", "admin"), getReviewsByUserId);
router.get('/review/getAllReviews', validateToken, authorizeRoles("admin"), getAllReviews);

module.exports = router;