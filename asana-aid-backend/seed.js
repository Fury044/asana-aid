
import pool from './src/database/db.js';

const POSES_TO_SEED = [
    {
        id: '10100000-0000-4000-8000-000000000101',
        name: 'Cat-Cow Stretch',
        difficulty: 'Beginner',
        focus_area: 'Back',
        media_url: 'https://media.post.rvohealth.io/wp-content/uploads/sites/2/2020/07/Cat-Cow.gif',
        duration: 60,
        instructions: ["Move between arching and rounding your back with breath.", "Keep a micro-bend in elbows."]
    },
    {
        id: '10200000-0000-4000-8000-000000000102',
        name: "Child's Pose",
        difficulty: 'Beginner',
        focus_area: 'Back',
        media_url: 'https://media.post.rvohealth.io/wp-content/uploads/sites/2/2020/07/childs-pose.gif',
        duration: 90,
        instructions: ["Rest forehead on mat.", "Sink hips to heels."]
    },
    {
        id: '10300000-0000-4000-8000-000000000103',
        name: 'Cobra Pose',
        difficulty: 'Beginner',
        focus_area: 'Back',
        media_url: 'https://media.post.rvohealth.io/wp-content/uploads/sites/2/2020/07/Cobra-Pose.gif',
        duration: 60,
        instructions: ["Lift chest off floor.", "Engage core to protect back."]
    },
    {
        id: '10400000-0000-4000-8000-000000000104',
        name: 'Bridge Pose',
        difficulty: 'Beginner',
        focus_area: 'Back',
        media_url: 'https://media.post.rvohealth.io/wp-content/uploads/sites/2/2019/05/bridge.gif',
        duration: 60,
        instructions: ["Lift hips.", "Keep knees parallel."]
    },
    {
        id: '10500000-0000-4000-8000-000000000105',
        name: 'Downward Dog',
        difficulty: 'Beginner',
        focus_area: 'Back',
        media_url: 'https://media.post.rvohealth.io/wp-content/uploads/sites/2/2020/07/downward-dog.gif',
        duration: 60,
        instructions: ["Push hips up into inverted V.", "Press hands firmly."]
    },
    {
        id: '40100000-0000-4000-8000-000000000401',
        name: 'Mountain Pose',
        difficulty: 'Beginner',
        focus_area: 'Posture',
        media_url: 'https://media.post.rvohealth.io/wp-content/uploads/sites/2/2020/06/400x400-Mountain_Pose.gif',
        duration: 60,
        instructions: ["Stand tall.", "Weight evenly distributed."]
    },
    {
        id: '40200000-0000-4000-8000-000000000402',
        name: 'Tree Pose',
        difficulty: 'Beginner',
        focus_area: 'Posture',
        media_url: 'https://media.post.rvohealth.io/wp-content/uploads/sites/2/2020/06/400x400-Tree_Pose.gif',
        duration: 60,
        instructions: ["Balance on one leg.", "Foot on inner thigh."]
    }
];

async function seedData() {
    console.log("🚀 Seeding master yoga poses and fixing medical_conditions IDs...");
    try {
        // 1. Ensure Medical Conditions exist with clear names for matching
        const conditions = ['Back Pain Relief', 'Navel Correction', 'Stress Relief', 'Posture Improvement', 'Flexibility Flow', 'Mood Boost'];
        for (const c of conditions) {
            await pool.query('INSERT INTO medical_conditions (name) VALUES ($1) ON CONFLICT (name) DO NOTHING', [c]);
        }

        // 2. Insert Poses with fixed UUIDs
        for (const pose of POSES_TO_SEED) {
            await pool.query(`
                INSERT INTO yoga_poses (id, name, difficulty_level, focus_area, media_url, base_duration, instructions)
                VALUES ($1, $2, $3, $4, $5, $6, $7)
                ON CONFLICT (name) DO UPDATE SET 
                    id = EXCLUDED.id,
                    media_url = EXCLUDED.media_url,
                    focus_area = EXCLUDED.focus_area
            `, [pose.id, pose.name, pose.difficulty, pose.focus_area, pose.media_url, pose.duration, JSON.stringify(pose.instructions)]);
        }

        console.log("✅ Data Seeding Complete.");
    } catch (err) {
        console.error("❌ Seeding failed:", err);
    } finally {
        await pool.end();
        process.exit();
    }
}

seedData();
