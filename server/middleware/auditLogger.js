const db = require('../db');

const logAudit = (actionType) => {
    return async (req, res, next) => {
        // Capture original send so we can log only on successful requests
        const originalSend = res.json;
        
        res.json = function (data) {
            // Restore original send method
            res.json = originalSend;
            
            // Extract user ID from request body, query, or headers if available
            const userId = req.body.user_id || req.query.user_id || null;
            const description = `Executed action: ${actionType} on path ${req.originalPath || req.path}`;

            // Asynchronously insert audit log without blocking the response
            db.query(
                `INSERT INTO audit_logs (user_id, action_type, description) VALUES ($1, $2, $3);`,
                [userId, actionType, description]
            ).catch(err => console.error('Failed to write audit log:', err));

            return res.json(data);
        };
        
        next();
    };
};

module.exports = logAudit;