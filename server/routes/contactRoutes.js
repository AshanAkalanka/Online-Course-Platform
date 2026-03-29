const express = require('express');
const router = express.Router();
const {
    submitContactMessage,
    getContactMessages,
    markMessageRead,
    deleteContactMessage
} = require('../controllers/contactController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// Public — anyone can submit a message
router.post('/', submitContactMessage);

// Admin only
router.get('/', authMiddleware, roleMiddleware('admin'), getContactMessages);
router.put('/:id/read', authMiddleware, roleMiddleware('admin'), markMessageRead);
router.delete('/:id', authMiddleware, roleMiddleware('admin'), deleteContactMessage);

module.exports = router;
