
import pool from './src/database/db.js';

async function updateSchema() {
    console.log("🚀 Starting Schema Migration: Adding missing columns to user_plans and yoga_sessions...");
    try {
        // Fix yoga_sessions
        await pool.query('ALTER TABLE yoga_sessions ADD COLUMN IF NOT EXISTS plan_id UUID REFERENCES user_plans(id) ON DELETE CASCADE;');
        await pool.query('ALTER TABLE yoga_sessions ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;');
        
        // Fix user_plans
        await pool.query('ALTER TABLE user_plans ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;');
        
        console.log("✅ Success: Tables updated.");
        
        // Quick verification
        const res1 = await pool.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'yoga_sessions';");
        const res2 = await pool.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'user_plans';");
        console.log("📊 yoga_sessions columns:", res1.rows.map(r => r.column_name));
        console.log("📊 user_plans columns:", res2.rows.map(r => r.column_name));
        
    } catch (err) {
        console.error("❌ Migration failed:", err);
    } finally {
        await pool.end();
        process.exit();
    }
}

updateSchema();
