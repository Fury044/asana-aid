
import pool from './src/database/db.js';

const POSES_TO_SEED = [
    // BACK
    { id: '10100000-0000-4000-8000-000000000101', name: 'Cat-Cow Stretch', focus_area: 'Back', media_url: 'https://media.post.rvohealth.io/wp-content/uploads/sites/2/2020/07/Cat-Cow.gif' },
    { id: '10200000-0000-4000-8000-000000000102', name: "Child's Pose", focus_area: 'Back', media_url: 'https://media.post.rvohealth.io/wp-content/uploads/sites/2/2020/07/childs-pose.gif' },
    { id: '10300000-0000-4000-8000-000000000103', name: 'Cobra Pose', focus_area: 'Back', media_url: 'https://media.post.rvohealth.io/wp-content/uploads/sites/2/2020/07/Cobra-Pose.gif' },
    { id: '10400000-0000-4000-8000-000000000104', name: 'Bridge Pose', focus_area: 'Back', media_url: 'https://media.post.rvohealth.io/wp-content/uploads/sites/2/2019/05/bridge.gif' },
    { id: '10500000-0000-4000-8000-000000000105', name: 'Downward Dog', focus_area: 'Back', media_url: 'https://media.post.rvohealth.io/wp-content/uploads/sites/2/2020/07/downward-dog.gif' },

    // NAVEL
    { id: '20100000-0000-4000-8000-000000000201', name: 'Boat Pose (Navasana)', focus_area: 'Navel', media_url: 'https://64.media.tumblr.com/tumblr_m79mq2pFKQ1rysr6eo1_400.gifv' },
    { id: '20200000-0000-4000-8000-000000000202', name: 'Dhanurasana (Bow Pose)', focus_area: 'Navel', media_url: 'https://media.post.rvohealth.io/wp-content/uploads/sites/2/2020/07/Cobra-Pose.gif' },
    { id: '20300000-0000-4000-8000-000000000203', name: 'Pawanmuktasana', focus_area: 'Navel', media_url: 'https://media.post.rvohealth.io/wp-content/uploads/sites/2/2019/05/bridge.gif' },
    { id: '20400000-0000-4000-8000-000000000204', name: 'Plank Pose', focus_area: 'Navel', media_url: 'https://cdn.jefit.com/assets/img/exercises/gifs/631.gif' },
    { id: '20500000-0000-4000-8000-000000000205', name: 'Ustrasana (Camel Pose)', focus_area: 'Navel', media_url: 'https://media.post.rvohealth.io/wp-content/uploads/sites/2/2020/07/Cobra-Pose.gif' },

    // STRESS
    { id: '30100000-0000-4000-8000-000000000301', name: 'Shavasana (Corpse Pose)', focus_area: 'Stress', media_url: 'https://cdn.yogajournal.com/wp-content/uploads/2022/10/Savasana_Andrew-McGonigle.gif?width=3840&auto=webp&quality=75&fit=cover' },
    { id: '30200000-0000-4000-8000-000000000302', name: 'Anulom Vilom Breathing', focus_area: 'Stress', media_url: 'https://media.post.rvohealth.io/wp-content/uploads/sites/2/2020/06/400x400-Tree_Pose.gif' },
    { id: '30300000-0000-4000-8000-000000000303', name: 'Legs Up Wall', focus_area: 'Stress', media_url: 'https://media.post.rvohealth.io/wp-content/uploads/2020/11/Legs-Up-the-Wall-Pose.gif' },
    { id: '30400000-0000-4000-8000-000000000304', name: 'Balasana (Child\'s Pose)', focus_area: 'Stress', media_url: 'https://media.post.rvohealth.io/wp-content/uploads/sites/2/2020/07/childs-pose.gif' },

    // POSTURE
    { id: '40100000-0000-4000-8000-000000000401', name: 'Mountain Pose (Tadasana)', focus_area: 'Posture', media_url: 'https://media.post.rvohealth.io/wp-content/uploads/sites/2/2020/06/400x400-Mountain_Pose.gif' },
    { id: '40200000-0000-4000-8000-000000000402', name: 'Tree Pose (Vrksasana)', focus_area: 'Posture', media_url: 'https://media.post.rvohealth.io/wp-content/uploads/sites/2/2020/06/400x400-Tree_Pose.gif' },
    { id: '40300000-0000-4000-8000-000000000403', name: 'Warrior II', focus_area: 'Posture', media_url: 'https://res.cloudinary.com/peloton-cycle/image/fetch/https://images.ctfassets.net/6ilvqec50fal/1sSTZZJo3KXrSCDqIhElXm/59dd3e773d2365c50f5c34589fbc16a0/warrior_2.gif' },
    { id: '40400000-0000-4000-8000-000000000404', name: 'Eagle Pose', focus_area: 'Posture', media_url: 'https://res.cloudinary.com/peloton-cycle/image/fetch/https://downloads.ctfassets.net/6ilvqec50fal/7dZSxy9vloF1aZuuhggSQ3/188105ef90e8a4d8d4bee13acc399034/eagle_pose.gif' },

    // FLEXIBILITY
    { id: '50100000-0000-4000-8000-000000000501', name: 'Forward Fold', focus_area: 'Flexibility', media_url: 'https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHQ0NzRteWJ3NmFrcmZ1ZjlqZ3NpYjI3bXU4bWpja2l1MWR0NTI1cSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/YQ4EE1iBXyLacDRm8A/giphy.gif' },
    { id: '50200000-0000-4000-8000-000000000502', name: 'Triangle Pose', focus_area: 'Flexibility', media_url: 'https://post.healthline.com/wp-content/uploads/2017/10/Extended-Triangle.gif' },
    { id: '50300000-0000-4000-8000-000000000503', name: 'Pigeon Pose', focus_area: 'Flexibility', media_url: 'https://static.wixstatic.com/media/13e392_bd824f1f74ac4927b6a01b22af477a89~mv2.gif' },
    { id: '50400000-0000-4000-8000-000000000504', name: 'Butterfly Pose', focus_area: 'Flexibility', media_url: 'https://ghost-cms.s3.ap-south-1.amazonaws.com/2021/07/Butterfly-pose--bandhakonasana-.gif' },

    // MOOD
    { id: '60100000-0000-4000-8000-000000000601', name: 'Sun Salutation A', focus_area: 'Mood', media_url: 'https://2ndstartotherightyoga.wordpress.com/wp-content/uploads/2011/01/sun_salutation_a.gif' },
    { id: '60200000-0000-4000-8000-000000000602', name: 'Dancer Pose', focus_area: 'Mood', media_url: 'https://pictures.picasion.com/pic55/c391fefeb6a1ce2dceb26ff86555177a.gif' },
    { id: '60300000-0000-4000-8000-000000000603', name: 'Warrior I', focus_area: 'Mood', media_url: 'https://cdn.jefit.com/assets/img/exercises/gifs/541.gif' },
    { id: '60400000-0000-4000-8000-000000000604', name: 'Upward Dog', focus_area: 'Mood', media_url: 'https://64.media.tumblr.com/3daf3260ef2d77a497d024d6f575583a/tumblr_o8pq9eiWLy1rysr6eo1_400.gif' }
];

async function seedData() {
    console.log("🚀 Seeding ALL yoga poses with GIF links to remote Postgres...");
    try {
        // Essential medical conditions
        const conditions = ['Back Pain Relief', 'Navel Correction', 'Stress Relief', 'Posture Improvement', 'Flexibility Flow', 'Mood Boost'];
        for (const c of conditions) {
            await pool.query('INSERT INTO medical_conditions (name) VALUES ($1) ON CONFLICT (name) DO NOTHING', [c]);
        }

        // Essential goals
        const goals = ['Flexibility', 'Strength', 'Weight Loss', 'Stress Relief'];
        for (const g of goals) {
            await pool.query('INSERT INTO user_goals (goal_type) VALUES ($1) ON CONFLICT DO NOTHING', [g]);
        }

        // Poses sync
        for (const pose of POSES_TO_SEED) {
            await pool.query(`
                INSERT INTO yoga_poses (id, name, difficulty_level, focus_area, media_url, base_duration, instructions)
                VALUES ($1, $2, 'Beginner', $3, $4, 60, $5)
                ON CONFLICT (name) DO UPDATE SET 
                    id = EXCLUDED.id,
                    media_url = EXCLUDED.media_url,
                    focus_area = EXCLUDED.focus_area,
                    base_duration = 60
            `, [pose.id, pose.name, pose.focus_area, pose.media_url, JSON.stringify(["Follow visual guide for movement.", "Breath deeply."])]);
        }

        console.log("✅ All Poses Seeded Successfully.");
    } catch (err) {
        console.error("❌ Seeding failed:", err);
    } finally {
        await pool.end();
        process.exit();
    }
}

seedData();
