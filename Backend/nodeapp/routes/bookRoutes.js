const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const {
  getAllBooks,
  getBookById,
  addBook,
  updateBook,
  deleteBook
} = require('../controllers/bookController');
const { validateToken, authorizeRoles } = require("../middleware/auth");

router.get('/book/getAllBooks', getAllBooks);
router.get('/book/getBookById/:id', getBookById);

router.post('/book/addBook', validateToken, authorizeRoles("admin"), upload.single('coverImage'), addBook);
router.put('/book/updateBook/:id', validateToken, authorizeRoles("admin"), upload.single('coverImage'), updateBook);
router.delete('/book/deleteBook/:id', validateToken, authorizeRoles("admin"), deleteBook);

module.exports = router;