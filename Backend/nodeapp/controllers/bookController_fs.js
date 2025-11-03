const fs = require('fs');
const path = require('path');
const booksFile = path.join(__dirname, '..', 'data', 'booksData.json');

function readBooks() {
  if (!fs.existsSync(booksFile)) return [];
  const raw = fs.readFileSync(booksFile, 'utf8');
  return raw ? JSON.parse(raw) : [];
}

function writeBooks(arr) {
  fs.mkdirSync(path.dirname(booksFile), { recursive: true });
  fs.writeFileSync(booksFile, JSON.stringify(arr, null, 2), 'utf8');
}

async function addBook_fs(req, res) {
  try {
    const books = readBooks();
    const { title, author } = req.body;
    if (books.find(b => b.title === title && b.author === author)) {
      return res.status(400).json({ error: true, message: 'Book already exists', data: null });
    }
    const newBook = { id: String(books.length + 1), ...req.body };
    books.push(newBook);
    writeBooks(books);
    return res.status(200).json({ error: false, message: 'Book Added Successfully', data: newBook });
  } catch (err) {
    return res.status(500).json({ error: true, message: err.message });
  }
}

async function getAllBooks_fs(req, res) {
  try {
    const books = readBooks();
    return res.status(200).json({ error: false, message: 'All Books found successfully', data: books });
  } catch (err) {
    return res.status(500).json({ error: true, message: err.message });
  }
}

async function getBookById_fs(req, res) {
  try {
    const books = readBooks();
    const { id } = req.params;
    const book = books.find(b => String(b.id) === String(id));
    if (!book) return res.status(404).json({ error: true, message: `No book found with ID ${id}` });
    return res.status(200).json({ error: false, message: 'Book found successfully', data: book });
  } catch (err) {
    return res.status(500).json({ error: true, message: err.message });
  }
}

async function deleteBookById_fs(req, res) {
  try {
    const books = readBooks();
    const { id } = req.params;
    const idx = books.findIndex(b => String(b.id) === String(id));
    if (idx === -1) return res.status(404).json({ error: true, message: `No book found with ID ${id}` });
    const deleted = books.splice(idx, 1);
    writeBooks(books);
    return res.status(200).json({ error: false, message: 'Book Deleted Successfully', data: deleted[0] });
  } catch (err) {
    return res.status(500).json({ error: true, message: err.message });
  }
}

module.exports = {
  addBook_fs,
  getAllBooks_fs,
  getBookById_fs,
  deleteBookById_fs
};
