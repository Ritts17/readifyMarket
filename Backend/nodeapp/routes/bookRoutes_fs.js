const express = require('express');
const router = express.Router();
const {
  addBook_fs,
  getAllBooks_fs,
  getBookById_fs,
  deleteBookById_fs
} = require('../controllers/bookController_fs');

router.post('/book_fs/addBookFs', addBook_fs);

router.get('/book_fs/getAllBooksFs', getAllBooks_fs);

router.get('/book_fs/getBookByIdFs/:id', getBookById_fs);

router.delete('/book_fs/deleteBookByIdFs/:id', deleteBookById_fs);

module.exports = router;