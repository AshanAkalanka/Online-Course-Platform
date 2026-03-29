const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const generateToken = require('../utils/generateToken');

const ensureUserProfileColumns = async () => {
    const [columns] = await pool.execute('SHOW COLUMNS FROM users LIKE "profile_image"');

    if (columns.length === 0) {
        await pool.execute('ALTER TABLE users ADD COLUMN profile_image VARCHAR(255) NULL');
    }
};

const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const [existing] = await pool.execute(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );

        if (existing.length > 0) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const [result] = await pool.execute(
            'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
            [name, email, hashedPassword]
        );

        const user = {
            id: result.insertId,
            name,
            email,
            role: 'student'
        };

        res.status(201).json({
            message: 'User registered successfully',
            token: generateToken(user),
            user
        });
    } catch (error) {
        res.status(500).json({ message: 'Register failed' });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const [rows] = await pool.execute(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );

        if (rows.length === 0) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const user = rows[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        res.json({
            message: 'Login successful',
            token: generateToken(user),
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Login failed' });
    }
};

const getProfile = async (req, res) => {
    try {
        await ensureUserProfileColumns();
        const [rows] = await pool.execute(
            'SELECT id, name, email, role, profile_image, created_at FROM users WHERE id = ?',
            [req.user.id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch profile' });
    }
};

const updateProfile = async (req, res) => {
    try {
        await ensureUserProfileColumns();
        const { name, email } = req.body;
        const profileImage = req.file ? `/uploads/${req.file.filename}` : undefined;

        if (!name || !email) {
            return res.status(400).json({ message: 'Name and email are required' });
        }

        const [existingRows] = await pool.execute(
            'SELECT id FROM users WHERE email = ? AND id <> ?',
            [email, req.user.id]
        );

        if (existingRows.length > 0) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        const [currentRows] = await pool.execute(
            'SELECT profile_image FROM users WHERE id = ?',
            [req.user.id]
        );

        const nextProfileImage = profileImage !== undefined
            ? profileImage
            : currentRows[0]?.profile_image || null;

        await pool.execute(
            'UPDATE users SET name = ?, email = ?, profile_image = ? WHERE id = ?',
            [name, email, nextProfileImage, req.user.id]
        );

        const [rows] = await pool.execute(
            'SELECT id, name, email, role, profile_image FROM users WHERE id = ?',
            [req.user.id]
        );

        res.json({
            message: 'Profile updated successfully',
            user: rows[0]
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update profile' });
    }
};

const updatePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: 'Current password and new password are required' });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ message: 'New password must be at least 6 characters long' });
        }

        const [rows] = await pool.execute(
            'SELECT password FROM users WHERE id = ?',
            [req.user.id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(currentPassword, rows[0].password);

        if (!isMatch) {
            return res.status(400).json({ message: 'Current password is incorrect' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await pool.execute(
            'UPDATE users SET password = ? WHERE id = ?',
            [hashedPassword, req.user.id]
        );

        res.json({ message: 'Password updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update password' });
    }
};

module.exports = { register, login, getProfile, updateProfile, updatePassword };
