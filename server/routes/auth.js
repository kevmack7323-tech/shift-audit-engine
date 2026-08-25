const express = require('express');
const router = express.Router();
const db = require('../db');

// Simple user login route to verify credentials and return role data
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    
    try {
        const query = `SELECT id, username, role FROM users WHERE username = $1 AND password_hash = $2;`;
        const result = await db.query(query, [username, password]);

        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        const user = result.rows[0];
        res.json({
            message: 'Login successful',
            user: {
                id: user.id,
                username: user.username,
                role: user.role
            }
        });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ error: 'Server error during authentication' });
    }
});

exports.default = router;
module.exports = router;