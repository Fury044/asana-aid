
import pool from './src/database/db.js';

async function resetAndSeed() {
    console.log("⚠️ Starting Full Database Reset and Seed...");
    
    try {
        // 1. DROP ALL TABLES (Ordered to respect foreign keys)
        console.log("🗑️ Dropping existing tables...");
        const tables = [
            'activity_logs', 'streaks', 'session_progress', 'session_poses', 
            'yoga_sessions', 'yoga_programs', 'yoga_poses', 'user_plans',
            'user_medical_conditions', 'medical_conditions', 'user_goals', 
            'user_health_profiles', 'users'
        ];
        
        for (const table of tables) {
            await pool.query(`DROP TABLE IF EXISTS ${table} CASCADE`);
        }
        console.log("✅ Tables dropped.");

        // 2. RECREATE TABLES (Using init.sql logic)
        console.log("🏗️ Recreating tables...");
        const schema = `
        CREATE TABLE users (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            email VARCHAR(255) UNIQUE NOT NULL,
            password_hash VARCHAR(255) NOT NULL,
            full_name VARCHAR(100),
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE user_health_profiles (
            user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
            age INT,
            weight DECIMAL(5,2),
            height DECIMAL(5,2),
            gender VARCHAR(10),
            experience_level VARCHAR(20) DEFAULT 'Beginner',
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE medical_conditions (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            name VARCHAR(100) UNIQUE NOT NULL,
            description TEXT
        );

        CREATE TABLE user_medical_conditions (
            user_id UUID REFERENCES users(id) ON DELETE CASCADE,
            condition_id UUID REFERENCES medical_conditions(id) ON DELETE CASCADE,
            PRIMARY KEY (user_id, condition_id)
        );

        CREATE TABLE user_goals (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            user_id UUID REFERENCES users(id) ON DELETE CASCADE,
            goal_type VARCHAR(50) NOT NULL
        );

        CREATE TABLE yoga_poses (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            name VARCHAR(100) UNIQUE NOT NULL,
            description TEXT,
            difficulty_level VARCHAR(20),
            focus_area VARCHAR(50),
            media_url VARCHAR(255),
            base_duration INT DEFAULT 30,
            instructions JSONB
        );

        CREATE TABLE yoga_programs (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            title VARCHAR(100) NOT NULL,
            description TEXT,
            focus_area VARCHAR(50),
            created_by UUID REFERENCES users(id)
        );

        CREATE TABLE user_plans (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            user_id UUID REFERENCES users(id) ON DELETE CASCADE,
            start_date DATE DEFAULT CURRENT_DATE,
            end_date DATE,
            is_active BOOLEAN DEFAULT TRUE,
            plan_config JSONB,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE yoga_sessions (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            program_id UUID REFERENCES yoga_programs(id) ON DELETE CASCADE,
            plan_id UUID REFERENCES user_plans(id) ON DELETE CASCADE,
            title VARCHAR(100) NOT NULL,
            duration INT,
            difficulty VARCHAR(20),
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE session_poses (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            session_id UUID REFERENCES yoga_sessions(id) ON DELETE CASCADE,
            pose_id UUID REFERENCES yoga_poses(id) ON DELETE CASCADE,
            order_index INT NOT NULL,
            duration_override INT
        );

        CREATE TABLE session_progress (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            user_id UUID REFERENCES users(id) ON DELETE CASCADE,
            session_id UUID REFERENCES yoga_sessions(id) ON DELETE CASCADE,
            status VARCHAR(20) DEFAULT 'Not Started',
            current_pose_index INT DEFAULT 0,
            started_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            last_accessed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            completed_at TIMESTAMP WITH TIME ZONE
        );

        CREATE TABLE activity_logs (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            user_id UUID REFERENCES users(id) ON DELETE CASCADE,
            action_type VARCHAR(50) NOT NULL,
            timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            metadata JSONB
        );

        CREATE TABLE streaks (
            user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
            current_streak INT DEFAULT 0,
            max_streak INT DEFAULT 0,
            last_session_date DATE,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
        `;
        await pool.query(schema);
        console.log("✅ Schema recreated.");

        // 3. SEED DATA
        console.log("🌱 Seeding master data...");
        
        // Medical Conditions
        const medicalConditions = [
            'Back Pain Relief', 'Navel Correction', 'Stress Relief', 
            'Posture Improvement', 'Flexibility Flow', 'Mood Boost'
        ];
        for (const name of medicalConditions) {
            await pool.query('INSERT INTO medical_conditions (name) VALUES ($1)', [name]);
        }

        // Poses with verified URLs
        const poses = [
            // Back
            { id: '10100000-0000-4000-8000-000000000101', name: 'Cat-Cow Stretch', focus_area: 'Back', media_url: 'https://media.post.rvohealth.io/wp-content/uploads/sites/2/2020/07/Cat-Cow.gif' },
            { id: '10200000-0000-4000-8000-000000000102', name: "Child's Pose", focus_area: 'Back', media_url: 'https://media.post.rvohealth.io/wp-content/uploads/sites/2/2020/07/childs-pose.gif' },
            { id: '10300000-0000-4000-8000-000000000103', name: 'Cobra Pose', focus_area: 'Back', media_url: 'https://media.post.rvohealth.io/wp-content/uploads/sites/2/2020/07/Cobra-Pose.gif' },
            { id: '10400000-0000-4000-8000-000000000104', name: 'Bridge Pose', focus_area: 'Back', media_url: 'https://media.post.rvohealth.io/wp-content/uploads/sites/2/2019/05/bridge.gif' },
            { id: '10500000-0000-4000-8000-000000000105', name: 'Downward Dog', focus_area: 'Back', media_url: 'https://media.post.rvohealth.io/wp-content/uploads/sites/2/2020/07/downward-dog.gif' },
            
            // Navel
            { id: '20100000-0000-4000-8000-000000000201', name: 'Boat Pose (Navasana)', focus_area: 'Navel', media_url: 'https://64.media.tumblr.com/tumblr_m79mq2pFKQ1rysr6eo1_400.gifv' },
            { id: '20200000-0000-4000-8000-000000000202', name: 'Dhanurasana (Bow Pose)', focus_area: 'Navel', media_url: 'https://media.post.rvohealth.io/wp-content/uploads/sites/2/2020/07/Cobra-Pose.gif' },

            // Stress
            { id: '30100000-0000-4000-8000-000000000301', name: 'Shavasana (Corpse Pose)', focus_area: 'Stress', media_url: 'https://cdn.yogajournal.com/wp-content/uploads/2022/10/Savasana_Andrew-McGonigle.gif?width=3840&auto=webp&quality=75&fit=cover' },
            
            // Posture
            { id: '40100000-0000-4000-8000-000000000401', name: 'Mountain Pose (Tadasana)', focus_area: 'Posture', media_url: 'https://media.post.rvohealth.io/wp-content/uploads/sites/2/2020/06/400x400-Mountain_Pose.gif' },
            { id: '40200000-0000-4000-8000-000000000402', name: 'Tree Pose (Vrksasana)', focus_area: 'Posture', media_url: 'https://media.post.rvohealth.io/wp-content/uploads/sites/2/2020/06/400x400-Tree_Pose.gif' }
        ];

        for (const pose of poses) {
            await pool.query(`
                INSERT INTO yoga_poses (id, name, focus_area, media_url, difficulty_level, base_duration, instructions)
                VALUES ($1, $2, $3, $4, 'Beginner', 60, $5)
            `, [pose.id, pose.name, pose.focus_area, pose.media_url, JSON.stringify(["Focus on breathing.", "Hold for 60 seconds."])]);
        }

        // System Programs
        const programs = [
            { id: 'a1111111-1111-4111-a111-111111111111', title: '7-Day Back Pain Relief', focus_area: 'Back', description: 'Gentle flow to relieve lower back tension.' },
            { id: 'b2222222-2222-4222-b222-222222222222', title: 'Deep Stress Relief', focus_area: 'Stress', description: 'Calming sequence for mental peace.' }
        ];

        for (const prog of programs) {
            await pool.query('INSERT INTO yoga_programs (id, title, focus_area, description) VALUES ($1, $2, $3, $4)', [prog.id, prog.title, prog.focus_area, prog.description]);
        }

        console.log("✅ Master data seeded.");

    } catch (err) {
        console.error("❌ Reset/Seed failed:", err);
    } finally {
        await pool.end();
        console.log("🏁 Database operation complete.");
        process.exit();
    }
}

resetAndSeed();
