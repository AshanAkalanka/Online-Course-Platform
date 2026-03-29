const pool = require('../config/db');

const ensureContactTable = async () => {
    await pool.execute(`
        CREATE TABLE IF NOT EXISTS contact_messages (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL,
            subject VARCHAR(255) NOT NULL,
            message TEXT NOT NULL,
            is_read BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `);
};

const submitContactMessage = async (req, res) => {
    try {
        await ensureContactTable();
        const { name, email, subject, message } = req.body;

        if (!name || !email || !subject || !message) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        await pool.execute(
            'INSERT INTO contact_messages (name, email, subject, message) VALUES (?, ?, ?, ?)',
            [name, email, subject, message]
        );

        res.status(201).json({ message: 'Message sent successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to send message' });
    }
};

const getContactMessages = async (req, res) => {
    try {
        await ensureContactTable();
        const [rows] = await pool.execute(
            'SELECT * FROM contact_messages ORDER BY created_at DESC'
        );
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch messages' });
    }
};

const markMessageRead = async (req, res) => {
    try {
        await pool.execute(
            'UPDATE contact_messages SET is_read = TRUE WHERE id = ?',
            [req.params.id]
        );
        res.json({ message: 'Message marked as read' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update message' });
    }
};

const deleteContactMessage = async (req, res) => {
    try {
        await pool.execute(
            'DELETE FROM contact_messages WHERE id = ?',
            [req.params.id]
        );
        res.json({ message: 'Message deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete message' });
    }
};

module.exports = {
    submitContactMessage,
    getContactMessages,
    markMessageRead,
    deleteContactMessage
};
