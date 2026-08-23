const { Pool } = require('pg');
require('dotenv').config();

// Initialize connection pool using environment variables (AWS RDS credentials)
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false 
    }
});

async function testConnection() {
    try {
        const client = await pool.connect();
        const res = await client.query('SELECT NOW()');
        console.log('Successfully connected to AWS RDS PostgreSQL!');
        console.log('Database Time:', res.rows[0].now);
        client.release();
    } catch (err) {
        console.error('Database connection error:', err.stack);
    } finally {
        await pool.end();
    }
}

testConnection();