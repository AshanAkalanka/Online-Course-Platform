const pool = require('../config/db');

const enrollInCourse = async (req, res) => {
    try {
        const userId = req.user.id;
        const { course_id } = req.body;

        if (!course_id) {
            return res.status(400).json({ message: 'Course ID is required' });
        }

        const [courseRows] = await pool.execute(
            'SELECT id FROM courses WHERE id = ?',
            [course_id]
        );

        if (courseRows.length === 0) {
            return res.status(404).json({ message: 'Course not found' });
        }

        const [existingRows] = await pool.execute(
            'SELECT id FROM enrollments WHERE user_id = ? AND course_id = ?',
            [userId, course_id]
        );

        if (existingRows.length > 0) {
            return res.status(400).json({ message: 'Already enrolled' });
        }

        await pool.execute(
            'INSERT INTO enrollments (user_id, course_id) VALUES (?, ?)',
            [userId, course_id]
        );

        res.status(201).json({ message: 'Enrolled successfully' });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ message: 'Already enrolled' });
        }
        res.status(500).json({ message: 'Enrollment failed' });
    }
};

const getMyCourses = async (req, res) => {
    try {
        const [rows] = await pool.execute(
            `SELECT c.*
       FROM enrollments e
       JOIN courses c ON e.course_id = c.id
       WHERE e.user_id = ?`,
            [req.user.id]
        );

        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch enrolled courses' });
    }
};

module.exports = { enrollInCourse, getMyCourses };
