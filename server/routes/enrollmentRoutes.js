const express = require('express');
const router = express.Router();
const { enrollInCourse, getMyCourses } = require('../controllers/enrollmentController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, enrollInCourse);
router.get('/my-courses', authMiddleware, getMyCourses);

module.exports = router;