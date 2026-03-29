const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
    markLessonComplete,
    getCourseProgress,
    getMyCoursesProgress
} = require('../controllers/progressController');

router.post('/complete', authMiddleware, markLessonComplete);
router.get('/course/:courseId', authMiddleware, getCourseProgress);
router.get('/my-courses', authMiddleware, getMyCoursesProgress);

module.exports = router;