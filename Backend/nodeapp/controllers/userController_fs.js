const fs = require('fs');
const path = require('path');
const usersFile = path.join(__dirname, '..', 'data', 'usersData.json');

function readUsers() {
  try {
    if (!fs.existsSync(usersFile)) return [];
    const raw = fs.readFileSync(usersFile, 'utf8');
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    return [];
  }
}

function writeUsers(users) {
  fs.mkdirSync(path.dirname(usersFile), { recursive: true });
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2), 'utf8');
}

async function register_fs(req, res) {
  try {
    const users = readUsers();
    const { email } = req.body;
    if (users.find(u => u.email === email)) {
      return res.status(400).json({ error: true, message: 'Email already exists', data: null });
    }
    const newUser = { id: String(users.length + 1), ...req.body };
    users.push(newUser);
    writeUsers(users);
    return res.status(200).json({ error: false, message: 'User Registration Successful', data: null });
  } catch (err) {
    return res.status(500).json({ error: true, message: err.message });
  }
}

async function login_fs(req, res) {
  try {
    const users = readUsers();
    const { email, password } = req.body;
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) return res.status(404).json({ error: true, message: 'Invalid credentials', data: null });
    return res.status(200).json({ error: false, message: 'Login Successfully', email: user.email });
  } catch (err) {
    return res.status(500).json({ error: true, message: err.message });
  }
}

async function resetPassword_fs(req, res) {
  try {
    const users = readUsers();
    const { email, password } = req.body;
    const idx = users.findIndex(u => u.email === email);
    if (idx === -1) return res.status(404).json({ error: true, message: 'User not found', data: null });
    users[idx].password = password;
    writeUsers(users);
    return res.status(200).json({ error: false, message: 'User Password has been updated successfully', data: null });
  } catch (err) {
    return res.status(500).json({ error: true, message: err.message });
  }
}

async function getAllUsers_fs(req, res) {
  try {
    const users = readUsers().map(({ password, ...rest }) => rest);
    return res.status(200).json({ error: false, message: 'users found successfully', data: users });
  } catch (err) {
    return res.status(500).json({ error: true, message: err.message });
  }
}

module.exports = {
  register_fs,
  login_fs,
  resetPassword_fs,
  getAllUsers_fs
};
