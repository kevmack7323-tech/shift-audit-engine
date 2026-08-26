const express = require('express');
const router = express.Router();
const db = require('../db');

// Get active shift and checklist status
router.get('/active', async (req, res) => {
    try {
        const query = `SELECT * FROM shifts WHERE status = 'ACTIVE' ORDER BY created_at DESC LIMIT 1;`;
        const result = await db.query(query);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'No active shift found' });
        }
        
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error fetching active shift:', err);
        res.status(500).json({ error: 'Server error fetching shift data' });
    }
});

// Update checklist items or sign off shift
router.patch('/:id/checklist', async (req, res) => {
    const { id } = req.params;
    const { checklist_progress, status } = req.body;

    try {
        const query = `
            UPDATE shifts 
            SET checklist_progress = COALESCE($1, checklist_progress), 
                status = COALESCE($2, status)
            WHERE id = $3 RETURNING *;
        `;
        const result = await db.query(query, [checklist_progress, status, id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Shift not found' });
        }

        res.json({
            message: 'Shift updated successfully',
            shift: result.rows[0]
        });
    } catch (err) {
        console.error('Error updating shift checklist:', err);
        res.status(500).json({ error: 'Server error updating shift' });
    }
});

module.exports = router;