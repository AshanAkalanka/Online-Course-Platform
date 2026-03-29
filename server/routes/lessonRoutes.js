const express = require('express');
const router = express.Router();
const { addLesson, updateLesson, deleteLesson } = require('../controllers/lessonController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.post('/', authMiddleware, roleMiddleware('admin'), addLesson);
router.put('/:id', authMiddleware, roleMiddleware('admin'), updateLesson);
router.delete('/:id', authMiddleware, roleMiddleware('admin'), deleteLesson);

module.exports = router;