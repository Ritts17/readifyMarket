const Book = require('../models/book');

async function getAllBooks(req, res) {
  try {
    const books = await Book.find({});
    return res.status(200).json(books);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

async function getBookById(req, res) {
  try {
    const { id } = req.params;
    const book = await Book.findById(id);
    
    if (!book) return res.status(404).json({ message: `Cannot find any book with ID ${id}` });
    return res.status(200).json(book);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

async function addBook(req, res) {
  console.log('Request body:', req.body);
  console.log('Request file:', req.file);
  
  try {
    const bookData = {
      title: req.body.title,
      author: req.body.author,
      description: req.body.description,
      price: req.body.price,
      stockQuantity: req.body.stockQuantity,
      category: req.body.category,
      // Use req.file if available (multipart upload), otherwise use req.body.coverImage (for tests/direct JSON)
      coverImage: req.file ? `/uploads/books/${req.file.filename}` : req.body.coverImage
    };

    const newBook = await Book.create(bookData);
    return res.status(201).json({ message: "Book Added Successfully", book: newBook });
  } catch (err) {
    console.error('Error adding book:', err);
    return res.status(500).json({ message: err.message });
  }
}

async function updateBook(req, res) {
  try {
    const { id } = req.params;
    
    const updateData = {
      title: req.body.title,
      author: req.body.author,
      description: req.body.description,
      price: req.body.price,
      stockQuantity: req.body.stockQuantity,
      category: req.body.category
    };

    // Update coverImage if:
    // 1. A new file is uploaded (req.file exists), OR
    // 2. coverImage is provided in body (for tests/direct updates)
    if (req.file) {
      updateData.coverImage = `/uploads/books/${req.file.filename}`;
    } else if (req.body.coverImage) {
      updateData.coverImage = req.body.coverImage;
    }
    // If neither exists, keep the existing coverImage (don't include it in updateData)

    const updatedBook = await Book.findByIdAndUpdate(id, updateData, { 
      new: true,
      runValidators: true 
    });
    
    if (!updatedBook) return res.status(404).json({ message: `Cannot find any book with ID ${id}` });
    
    return res.status(200).json({ message: 'Book Updated Successfully', book: updatedBook });
  } catch (err) {
    console.error('Error updating book:', err);
    return res.status(500).json({ message: err.message });
  }
}

async function deleteBook(req, res) {
  try {
    const { id } = req.params;
    const deleted = await Book.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: `Cannot find any book with ID ${id}` });
    return res.status(200).json({ message: 'Book Deleted Successfully' });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

module.exports = {
  getAllBooks,
  getBookById,
  addBook,
  updateBook,
  deleteBook
};