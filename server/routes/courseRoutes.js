const express = require('express');
const router = express.Router();
const {
    getCourses,
    getCourseById,
    getCourseCategories,
    createCourse,
    updateCourse,
    deleteCourse
} = require('../controllers/courseController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/', getCourses);
router.get('/categories', getCourseCategories);
router.get('/:id', getCourseById);
router.post('/', authMiddleware, roleMiddleware('admin'), upload.single('thumbnail'), createCourse);
router.put('/:id', authMiddleware, roleMiddleware('admin'), upload.single('thumbnail'), updateCourse);
router.delete('/:id', authMiddleware, roleMiddleware('admin'), deleteCourse);

module.exports = router;
