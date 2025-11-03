const fs = require('fs');
const path = require('path');
const booksFile = path.join(__dirname, 'booksData.json');

function writeDataToFileUsingFileSystem() {
  const booksArray = [
    { title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', description: 'A classic novel', price: 300, stockQuantity: 10, category: 'Fiction', coverImage: '/images/gatsby.jpg' },
    { title: 'A Brief History of Time', author: 'Stephen Hawking', description: 'An overview', price: 500, stockQuantity: 5, category: 'Science', coverImage: '/images/history.jpg' }
  ];
  fs.writeFileSync(booksFile, JSON.stringify(booksArray, null, 2), 'utf8');
  console.log('Data written to booksData.json');
}

function readDataAndPrintUsingFileSystem() {
  try {
    if (!fs.existsSync(booksFile)) return console.log('booksData.json not found');
    const raw = fs.readFileSync(booksFile, 'utf8');
    const readData = raw ? JSON.parse(raw) : [];
    readData.forEach((b, idx) => console.log(`${idx + 1}.`, b));
  } catch (err) {
    console.error(err);
  }
}

module.exports = {
  writeDataToFileUsingFileSystem,
  readDataAndPrintUsingFileSystem
};
