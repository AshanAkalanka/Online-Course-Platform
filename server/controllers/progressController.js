const pool = require('../config/db');

const markLessonComplete = async (req, res) => {
    try {
        const userId = req.user.id;
        const { course_id, lesson_id } = req.body;

        if (!course_id || !lesson_id) {
            return res.status(400).json({ message: 'Course ID and Lesson ID are required' });
        }

        await pool.execute(
            `INSERT INTO lesson_progress (user_id, course_id, lesson_id, completed, completed_at)
       VALUES (?, ?, ?, 1, NOW())
       ON DUPLICATE KEY UPDATE completed = 1, completed_at = NOW()`,
            [userId, course_id, lesson_id]
        );

        res.json({ message: 'Lesson marked as completed' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update lesson progress' });
    }
};

const getCourseProgress = async (req, res) => {
    try {
        const userId = req.user.id;
        const courseId = req.params.courseId;

        const [lessons] = await pool.execute(
            'SELECT id FROM lessons WHERE course_id = ?',
            [courseId]
        );

        const totalLessons = lessons.length;

        const [progressRows] = await pool.execute(
            `SELECT lesson_id
       FROM lesson_progress
       WHERE user_id = ? AND course_id = ? AND completed = 1`,
            [userId, courseId]
        );

        const completedLessons = progressRows.length;
        const completedLessonIds = progressRows.map((row) => row.lesson_id);
        const percentage = totalLessons === 0 ? 0 : Math.round((completedLessons / totalLessons) * 100);

        res.json({
            totalLessons,
            completedLessons,
            completedLessonIds,
            percentage
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch progress' });
    }
};

const getMyCoursesProgress = async (req, res) => {
    try {
        const userId = req.user.id;

        const [courses] = await pool.execute(
            `SELECT c.id, c.title, c.thumbnail
       FROM enrollments e
       JOIN courses c ON e.course_id = c.id
       WHERE e.user_id = ?`,
            [userId]
        );

        const results = [];

        for (const course of courses) {
            const [lessonRows] = await pool.execute(
                'SELECT id FROM lessons WHERE course_id = ?',
                [course.id]
            );

            const [progressRows] = await pool.execute(
                `SELECT lesson_id
         FROM lesson_progress
         WHERE user_id = ? AND course_id = ? AND completed = 1`,
                [userId, course.id]
            );

            const totalLessons = lessonRows.length;
            const completedLessons = progressRows.length;
            const percentage = totalLessons === 0 ? 0 : Math.round((completedLessons / totalLessons) * 100);

            results.push({
                ...course,
                totalLessons,
                completedLessons,
                percentage
            });
        }

        res.json(results);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch course progress list' });
    }
};

module.exports = {
    markLessonComplete,
    getCourseProgress,
    getMyCoursesProgress
};