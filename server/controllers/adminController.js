const pool = require('../config/db');

const ensureCategoriesTable = async () => {
    await pool.execute(`
        CREATE TABLE IF NOT EXISTS categories (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL UNIQUE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `);
};

const getAdminStats = async (req, res) => {
    try {
        const [[users]] = await pool.execute('SELECT COUNT(*) AS totalUsers FROM users');
        const [[courses]] = await pool.execute('SELECT COUNT(*) AS totalCourses FROM courses');
        const [[enrollments]] = await pool.execute('SELECT COUNT(*) AS totalEnrollments FROM enrollments');

        res.json({
            totalUsers: users.totalUsers,
            totalCourses: courses.totalCourses,
            totalEnrollments: enrollments.totalEnrollments
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch admin stats' });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const [rows] = await pool.execute(
            'SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC'
        );
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch users' });
    }
};

const updateUserRole = async (req, res) => {
    try {
        const { role } = req.body;

        if (!['student', 'admin'].includes(role)) {
            return res.status(400).json({ message: 'Invalid role' });
        }

        await pool.execute(
            'UPDATE users SET role = ? WHERE id = ?',
            [role, req.params.id]
        );

        res.json({ message: 'User role updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update user role' });
    }
};

const deleteUser = async (req, res) => {
    try {
        if (Number(req.params.id) === req.user.id) {
            return res.status(400).json({ message: 'You cannot delete your own account' });
        }

        await pool.execute('DELETE FROM users WHERE id = ?', [req.params.id]);
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete user' });
    }
};

const getCategories = async (req, res) => {
    try {
        await ensureCategoriesTable();

        const [rows] = await pool.execute(
            `SELECT name FROM categories
             UNION
             SELECT DISTINCT category AS name FROM courses WHERE category IS NOT NULL AND category <> ''
             ORDER BY name ASC`
        );

        res.json(rows.map((row) => row.name));
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch categories' });
    }
};

const createCategory = async (req, res) => {
    try {
        await ensureCategoriesTable();
        const name = req.body.name?.trim();

        if (!name) {
            return res.status(400).json({ message: 'Category name is required' });
        }

        await pool.execute(
            'INSERT INTO categories (name) VALUES (?)',
            [name]
        );

        res.status(201).json({ message: 'Category created successfully' });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ message: 'Category already exists' });
        }

        res.status(500).json({ message: 'Failed to create category' });
    }
};

const deleteCategory = async (req, res) => {
    try {
        await ensureCategoriesTable();
        const categoryName = decodeURIComponent(req.params.name);

        const [courseRows] = await pool.execute(
            'SELECT id FROM courses WHERE category = ? LIMIT 1',
            [categoryName]
        );

        if (courseRows.length > 0) {
            return res.status(400).json({ message: 'Cannot delete a category that is assigned to a course' });
        }

        await pool.execute(
            'DELETE FROM categories WHERE name = ?',
            [categoryName]
        );

        res.json({ message: 'Category deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete category' });
    }
};

module.exports = {
    getAdminStats,
    getAllUsers,
    updateUserRole,
    deleteUser,
    getCategories,
    createCategory,
    deleteCategory
};
