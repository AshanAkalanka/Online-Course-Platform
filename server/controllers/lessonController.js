const pool = require('../config/db');

const addLesson = async (req, res) => {
    try {
        const { course_id, title, video_url, content, lesson_order } = req.body;

        const [result] = await pool.execute(
            `INSERT INTO lessons (course_id, title, video_url, content, lesson_order)
       VALUES (?, ?, ?, ?, ?)`,
            [course_id, title, video_url, content, lesson_order]
        );

        res.status(201).json({
            message: 'Lesson added successfully',
            lessonId: result.insertId
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to add lesson' });
    }
};

const updateLesson = async (req, res) => {
    try {
        const { title, video_url, content, lesson_order } = req.body;

        await pool.execute(
            `UPDATE lessons
       SET title = ?, video_url = ?, content = ?, lesson_order = ?
       WHERE id = ?`,
            [title, video_url, content, lesson_order, req.params.id]
        );

        res.json({ message: 'Lesson updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update lesson' });
    }
};

const deleteLesson = async (req, res) => {
    try {
        await pool.execute('DELETE FROM lessons WHERE id = ?', [req.params.id]);
        res.json({ message: 'Lesson deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete lesson' });
    }
};

module.exports = { addLesson, updateLesson, deleteLesson };