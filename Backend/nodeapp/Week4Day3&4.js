const fs = require('fs');
const path = require('path');
const dataFile = path.join(__dirname, 'userData.json');

const dataArray = [];

function addData(userData, callback) {
  try {
    dataArray.push(userData);
    if (typeof callback === 'function') callback(null, userData);
  } catch (err) {
    if (typeof callback === 'function') callback(err);
    else console.error(err);
  }
}

function displayData() {
  dataArray.forEach((u, idx) => {
    console.log(`${idx + 1}.`, u);
  });
}

function callbackFunction(err, addedUserData) {
  if (err) {
    console.error('Error:', err);
  } else {
    console.log('User added successfully', addedUserData);
  }
}

function writeDataToFile() {
  const ws = fs.createWriteStream(dataFile, { encoding: 'utf8' });
  ws.write(JSON.stringify(dataArray, null, 2));
  ws.end();
  ws.on('finish', () => console.log('Data written to userData.json using streams'));
}

function readDataAndPrint() {
  if (!fs.existsSync(dataFile)) return console.log('No file');
  const rs = fs.createReadStream(dataFile, { encoding: 'utf8' });
  let content = '';
  rs.on('data', chunk => (content += chunk));
  rs.on('end', () => {
    try {
      const parsed = JSON.parse(content || '[]');
      parsed.forEach((u, idx) => console.log(`${idx + 1}.`, u));
    } catch (err) {
      console.error(err);
    }
  });
  rs.on('error', err => console.error(err));
}

module.exports = {
  addData,
  displayData,
  callbackFunction,
  writeDataToFile,
  readDataAndPrint
};
