const express = require('express');
const cors = require('cors');
const db = require('./db');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

const shiftRoutes = require('./routes/shifts');
app.use('/api/shifts', shiftRoutes);

// Mount Auth Routes (Must be before app.listen)
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// Test Database Connection Route
app.get('/api/health', async (req, res) => {
    try {
        const result = await db.query('SELECT NOW()');
        res.status(200).json({ status: 'healthy', dbTime: result.rows[0].now });
    } catch (err) {
        console.error('Database health check failed:', err);
        res.status(500).json({ error: 'Database connection failed' });
    }
});

// ==========================================
// SHIFT & CHECKLIST API ROUTES
// ==========================================

// 1. Get all active or past shifts
app.get('/api/shifts', async (req, res) => {
    try {
        const query = `
            SELECT shifts.id, shifts.status, shifts.start_time, shifts.end_time, users.username, users.role 
            FROM shifts 
            JOIN users ON shifts.user_id = users.id 
            ORDER BY shifts.start_time DESC;
        `;
        const result = await db.query(query);
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching shifts:', err);
        res.status(500).json({ error: 'Server error fetching shifts' });
    }
});

// 2. Open a new shift log
app.post('/api/shifts', async (req, res) => {
    const { user_id } = req.body;
    try {
        const query = `INSERT INTO shifts (user_id, status) VALUES ($1, 'Active') RETURNING *;`;
        const result = await db.query(query, [user_id]);
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Error opening shift:', err);
        res.status(500).json({ error: 'Server error opening shift' });
    }
});

// 3. Update checklist item status (complete/incomplete)
app.put('/api/checklist/:id', async (req, res) => {
    const { id } = req.params;
    const { completed, notes } = req.body;
    try {
        const query = `
            UPDATE checklist_items 
            SET completed = COALESCE($1, completed), notes = COALESCE($2, notes) 
            WHERE id = $3 RETURNING *;
        `;
        const result = await db.query(query, [completed, notes, id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Checklist item not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error updating checklist:', err);
        res.status(500).json({ error: 'Server error updating checklist item' });
    }
});

// 4. Supervisor sign-off & shift closure
app.put('/api/shifts/:id/close', async (req, res) => {
    const { id } = req.params;
    try {
        const query = `
            UPDATE shifts 
            SET status = 'Closed', end_time = CURRENT_TIMESTAMP 
            WHERE id = $1 RETURNING *;
        `;
        const result = await db.query(query, [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Shift not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error closing shift:', err);
        res.status(500).json({ error: 'Server error closing shift' });
    }
});

// Get all checklist items for the active shift
app.get('/api/checklist', async (req, res) => {
    try {
        const query = `SELECT id, task, completed, notes FROM checklist_items ORDER BY id ASC;`;
        const result = await db.query(query);
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching checklist items:', err);
        res.status(500).json({ error: 'Server error fetching checklist items' });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});