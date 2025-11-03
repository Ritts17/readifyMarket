const express = require('express');
const router = express.Router();
const {
  register_fs,
  login_fs,
  resetPassword_fs,
  getAllUsers_fs
} = require('../controllers/userController_fs');

router.post('/user_fs/registerFs', register_fs);

router.post('/user_fs/loginFs', login_fs);

router.put('/user_fs/resetPasswordFs', resetPassword_fs);

router.get('/user_fs/getAllUsersFs', getAllUsers_fs);

module.exports = router;
