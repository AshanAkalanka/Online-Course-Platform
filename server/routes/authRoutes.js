const express = require('express');
const router = express.Router();
const { register, login, getProfile, updateProfile, updatePassword } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.post('/register', register);
router.post('/login', login);
router.get('/me', authMiddleware, getProfile);
router.put('/me', authMiddleware, upload.single('profile_image'), updateProfile);
router.put('/me/password', authMiddleware, updatePassword);

module.exports = router;
