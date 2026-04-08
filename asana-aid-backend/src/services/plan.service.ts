import pool from '../database/db.js';

// Expanded Mock asana library for dedicated problem solutions
const MOCK_ASANA_LIBRARY: Record<string, any[]> = {
  'back pain': [
    {
      id: 101, name: 'Cat-Cow Stretch', base_duration: 60, focus_area: 'Back',
      mediaUrl: 'https://media.post.rvohealth.io/wp-content/uploads/sites/2/2020/07/Cat-Cow.gif',
      instructions: [
        'Move between arching and rounding your back with breath.',
        'Seniors: Move slowly, taking 3 full breaths for each transition.',
        'Keep a micro-bend in elbows to protect joints.'
      ]
    },
    {
      id: 102, name: 'Child\'s Pose', base_duration: 90, focus_area: 'Back',
      mediaUrl: 'https://media.post.rvohealth.io/wp-content/uploads/sites/2/2020/07/childs-pose.gif',
      instructions: [
        'Rest your forehead on the mat and sink hips to heels.',
        'Use a folded blanket under knees if they feel sensitive.',
        'Breath deeply into your lower back.'
      ]
    },
    {
      id: 103, name: 'Cobra Pose (Bhujangasana)', base_duration: 60, focus_area: 'Back',
      mediaUrl: 'https://media.post.rvohealth.io/wp-content/uploads/sites/2/2020/07/Cobra-Pose.gif',
      instructions: [
        'Lift chest off the floor using back muscles.',
        'Avoid pushing too high; keep shoulders away from ears.',
        'Engage core to protect lower back.'
      ]
    },
    {
      id: 104, name: 'Bridge Pose', base_duration: 60, focus_area: 'Back',
      mediaUrl: 'https://media.post.rvohealth.io/wp-content/uploads/sites/2/2019/05/bridge.gif',
      instructions: [
        'Lift hips while keeping shoulders on the mat.',
        'Keep knees parallel, avoid letting them splay out.',
        'Gentle lift is enough for therapeutic benefit.'
      ]
    },
    {
      id: 105, name: 'Downward Dog', base_duration: 60, focus_area: 'Back',
      mediaUrl: 'https://media.post.rvohealth.io/wp-content/uploads/sites/2/2020/07/downward-dog.gif',
      instructions: [
        'Push hips up into an inverted V shape.',
        'Keep a generous bend in knees if hamstrings are tight.',
        'Press firmly through all ten fingers to protect wrists.'
      ]
    }
  ],
  'navel issues': [
    {
      id: 201, name: 'Boat Pose (Navasana)', base_duration: 45, focus_area: 'Navel',
      mediaUrl: 'https://64.media.tumblr.com/tumblr_m79mq2pFKQ1rysr6eo1_400.gifv',
      instructions: ['Balance on sit bones with legs and torso at 45 degrees.', 'Keep spine long; avoid rounding the back.', 'Hold for 3 breaths, then rest.']
    },
    {
      id: 202, name: 'Dhanurasana (Bow Pose)', base_duration: 60, focus_area: 'Navel',
      mediaUrl: 'https://media.post.rvohealth.io/wp-content/uploads/sites/2/2020/07/Cobra-Pose.gif', // Safe substitute for movement guidance
      instructions: ['Reach back and hold ankles, lifting chest and knees.', 'Breathe into your belly to massage internal organs.', 'Gentle rocking is beneficial.']
    },
    {
      id: 203, name: 'Pawanmuktasana', base_duration: 60, focus_area: 'Navel',
      mediaUrl: 'https://media.post.rvohealth.io/wp-content/uploads/sites/2/2019/05/bridge.gif', // Movement guidance
      instructions: ['Hug knees to chest while lying on your back.', 'Rock side to side to massage lower back.', 'Excellent for digestion.']
    },
    {
      id: 204, name: 'Plank Pose', base_duration: 60, focus_area: 'Navel',
      mediaUrl: 'https://cdn.jefit.com/assets/img/exercises/gifs/631.gif',
      instructions: ['Maintain a straight line from head to heels.', 'Keep core engaged to protect the spine.', 'Drop knees to mat for a safer modified version.']
    },
    { id: 205, name: 'Ustrasana (Camel Pose)', base_duration: 45, focus_area: 'Navel', mediaUrl: 'https://media.post.rvohealth.io/wp-content/uploads/sites/2/2020/07/Cobra-Pose.gif', instructions: ['Kneel and arch back to touch heels with hands.', 'Support lower back with hands if reaching heels is far.', 'Focus on chest opening.'] }
  ],
  'stress': [
    { id: 301, name: 'Shavasana (Corpse Pose)', base_duration: 300, focus_area: 'Stress', mediaUrl: 'https://cdn.yogajournal.com/wp-content/uploads/2022/10/Savasana_Andrew-McGonigle.gif?width=3840&auto=webp&quality=75&fit=cover', instructions: ['Lie flat on back and relax every muscle.', 'Close eyes and focus on the natural rhythm of breath.', 'Stay as still as possible.'] },
    { id: 302, name: 'Anulom Vilom Breathing', base_duration: 180, focus_area: 'Stress', mediaUrl: 'https://media.post.rvohealth.io/wp-content/uploads/sites/2/2020/06/400x400-Tree_Pose.gif', instructions: ['Alternate nostril breathing for mental calm.', 'Inhale for 4 counts, exhale for 6 counts.', 'Keep spine erect.'] },
    { id: 303, name: 'Legs Up Wall', base_duration: 300, focus_area: 'Stress', mediaUrl: 'https://media.post.rvohealth.io/wp-content/uploads/2020/11/Legs-Up-the-Wall-Pose.gif', instructions: ['Rest legs vertically against a wall while lying on back.', 'Place a pillow under hips if more comfort is needed.', 'Great for circulation.'] },
    { id: 304, name: 'Balasana (Child\'s Pose)', base_duration: 120, focus_area: 'Stress', mediaUrl: 'https://media.post.rvohealth.io/wp-content/uploads/sites/2/2020/07/childs-pose.gif', instructions: ['Gentle forward rest position.', 'Rest your forehead on your hands if mat is too low.', 'Feel your breath in your back.'] }
  ],
  'posture': [
    { id: 401, name: 'Mountain Pose (Tadasana)', base_duration: 60, focus_area: 'Posture', mediaUrl: 'https://media.post.rvohealth.io/wp-content/uploads/sites/2/2020/06/400x400-Mountain_Pose.gif', instructions: ['Stand tall with weight evenly distributed.', 'Engage thighs and roll shoulders back/down.', 'Grow tall through the crown of your head.'] },
    { id: 402, name: 'Tree Pose (Vrksasana)', base_duration: 60, focus_area: 'Posture', mediaUrl: 'https://media.post.rvohealth.io/wp-content/uploads/sites/2/2020/06/400x400-Tree_Pose.gif', instructions: ['Balance on one leg with other foot on inner thigh.', 'Avoid placing foot directly on the knee joint.', 'Use a wall or chair for balance support if needed.'] },
    { id: 403, name: 'Warrior II', base_duration: 60, focus_area: 'Posture', mediaUrl: 'https://res.cloudinary.com/peloton-cycle/image/fetch/https://images.ctfassets.net/6ilvqec50fal/1sSTZZJo3KXrSCDqIhElXm/59dd3e773d2365c50f5c34589fbc16a0/warrior_2.gif', instructions: ['Wide stance, focus arms parallel to floor.', 'Check that your front knee is over your ankle.', 'Breathe strength into your arms.'] },
    { id: 404, name: 'Eagle Pose', base_duration: 60, focus_area: 'Posture', mediaUrl: 'https://res.cloudinary.com/peloton-cycle/image/fetch/https://downloads.ctfassets.net/6ilvqec50fal/7dZSxy9vloF1aZuuhggSQ3/188105ef90e8a4d8d4bee13acc399034/eagle_pose.gif', instructions: ['Wrap one leg and one arm around the other.', 'Keep elbows at shoulder height.', 'If balance is hard, keep toes of the top leg touching floor.'] }
  ],
  'flexibility': [
    { id: 501, name: 'Forward Fold', base_duration: 90, focus_area: 'Flexibility', mediaUrl: 'https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHQ0NzRteWJ3NmFrcmZ1ZjlqZ3NpYjI3bXU4bWpja2l1MWR0NTI1cSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/YQ4EE1iBXyLacDRm8A/giphy.gif', instructions: ['Hinge at hips and reach for toes.', 'Bend knees as much as needed to protect back.', 'Let your head hang heavy.'] },
    { id: 502, name: 'Triangle Pose', base_duration: 60, focus_area: 'Flexibility', mediaUrl: 'https://post.healthline.com/wp-content/uploads/2017/10/Extended-Triangle.gif', instructions: ['Side stretch with hand reaching for ankle.', 'Keep both legs straight but not locked.', 'Open your chest towards the sky.'] },
    { id: 503, name: 'Pigeon Pose', base_duration: 120, focus_area: 'Flexibility', mediaUrl: 'https://static.wixstatic.com/media/13e392_bd824f1f74ac4927b6a01b22af477a89~mv2.gif', instructions: ['Deep hip opening stretch.', 'Use a block or pillow under the hip of the front leg.', 'Breathe into the sensation.'] },
    { id: 504, name: 'Butterfly Pose', base_duration: 90, focus_area: 'Flexibility', mediaUrl: 'https://ghost-cms.s3.ap-south-1.amazonaws.com/2021/07/Butterfly-pose--bandhakonasana-.gif', instructions: ['Sit and press soles of feet together.', 'Flap "wings" gently or sit in stillness.', 'Keep spine upright.'] }
  ],
  'mood': [
    { id: 601, name: 'Sun Salutation A', base_duration: 180, focus_area: 'Mood', mediaUrl: 'https://2ndstartotherightyoga.wordpress.com/wp-content/uploads/2011/01/sun_salutation_a.gif', instructions: ['Flowing sequence of 12 linked poses.', 'Move with one breath, one movement.', 'Warm up the whole body and mind.'] },
    { id: 602, name: 'Dancer Pose', base_duration: 60, focus_area: 'Mood', mediaUrl: 'https://pictures.picasion.com/pic55/c391fefeb6a1ce2dceb26ff86555177a.gif', instructions: ['Stand and reach back to lift one foot high.', 'Find focus at one point in front of you.', 'Use a wall for support.'] },
    { id: 603, name: 'Warrior I', base_duration: 60, focus_area: 'Mood', mediaUrl: 'https://cdn.jefit.com/assets/img/exercises/gifs/541.gif', instructions: ['Confident lunge with arms raised high.', 'Keep back heel grounded at 45 degrees.', 'Focus your gaze upward.'] },
    { id: 604, name: 'Upward Dog', base_duration: 60, focus_area: 'Mood', mediaUrl: 'https://64.media.tumblr.com/3daf3260ef2d77a497d024d6f575583a/tumblr_o8pq9eiWLy1rysr6eo1_400.gif', instructions: ['Lift chest and legs off floor, weight on hands/feet tops.', 'Press floor away to lift out of shoulders.', 'Gaze gently forward.'] }
  ]
};

export const generatePlan = async (userId: string, incomingConditions: string[] = [], incomingGoals: string[] = []) => {
  let userProfile = { experience_level: 'Beginner', full_name: 'Yogi' };
  let conditions = incomingConditions;
  let goals = incomingGoals;

  try {
    // 1. Fetch user health metrics
    const profileResult = await pool.query('SELECT * FROM user_health_profiles WHERE user_id = $1', [userId]);
    if (profileResult.rows.length > 0) {
      userProfile = profileResult.rows[0];
    }

    // 2. Fetch medical conditions from DB and merge
    const conditionsResult = await pool.query(
      'SELECT mc.name FROM medical_conditions mc JOIN user_medical_conditions umc ON mc.id = umc.condition_id WHERE umc.user_id = $1',
      [userId]
    );
    const dbConditions = conditionsResult.rows.map((r: any) => r.name);
    conditions = [...new Set([...dbConditions, ...incomingConditions])];

    // 3. Fetch goals from DB and merge
    const goalsResult = await pool.query('SELECT goal_type FROM user_goals WHERE user_id = $1', [userId]);
    const dbGoals = goalsResult.rows.map((r: any) => r.goal_type);
    goals = [...new Set([...dbGoals, ...incomingGoals])];
  } catch (dbError) {
    console.warn("Database unavailable, using provided conditions/goals:", dbError);
    // Continue with incoming parameters only
  }

  // 4. Recommendation Logic (Enhanced therapeutic matching)
  const conditionToFocusMap: Record<string, string> = {
    'back pain': 'Back',
    'back pain relief': 'Back',
    'navel issues': 'Navel',
    'navel correction': 'Navel',
    'stress': 'Stress',
    'stress relief': 'Stress',
    'posture': 'Posture',
    'posture improvement': 'Posture',
    'flexibility': 'Flexibility',
    'flexibility flow': 'Flexibility',
    'mood': 'Mood',
    'mood boost': 'Mood'
  };

  const normalizedConditions = conditions.map(c => c.toLowerCase());
  const targetFocusAreas = normalizedConditions
    .map(c => conditionToFocusMap[c])
    .filter(f => f !== undefined);

  console.log("Analyzing conditions:", normalizedConditions, "Targeting focus areas:", targetFocusAreas);

  let candidatePoses: any[] = [];
  try {
    const posesResult = await pool.query('SELECT * FROM yoga_poses');
    candidatePoses = posesResult.rows;
  } catch (err) {
    console.warn("Database poses table unreachable, using Mock Library");
  }

  // FALLBACK: If DB is empty or unreachable, use Mock library
  if (candidatePoses.length === 0) {
    targetFocusAreas.forEach(area => {
      const problemKey = Object.keys(conditionToFocusMap).find(k => conditionToFocusMap[k] === area);
      if (problemKey && MOCK_ASANA_LIBRARY[problemKey]) {
        candidatePoses = [...candidatePoses, ...MOCK_ASANA_LIBRARY[problemKey]];
      }
    });

    if (candidatePoses.length === 0) {
      candidatePoses = MOCK_ASANA_LIBRARY['stress'] || [];
    }
  }

  // Calculate scores for each pose
  const scoredPoses = candidatePoses.map((p: any) => {
    let score = 0;
    if (targetFocusAreas.includes(p.focus_area)) score += 10;
    if (goals.includes(p.goal_type)) score += 5;
    if (p.difficulty_level === userProfile.experience_level) score += 3;
    return { ...p, score };
  });

  const finalSequence = scoredPoses
    .sort((a, b) => b.score - a.score)
    .slice(0, 8);

  // 5. Create a new User Plan (Mock IDs if DB fails)
  let planId = `mock_plan_${Date.now()}`;
  let sessionId = `mock_session_${Date.now()}`;

  try {
    const planResult = await pool.query('INSERT INTO user_plans (user_id, is_active) VALUES ($1, true) RETURNING id', [userId]);
    planId = planResult.rows[0].id;

    const sessionResult = await pool.query(
      'INSERT INTO yoga_sessions (program_id, title, difficulty) VALUES (NULL, $1, $2) RETURNING id',
      [`Daily Session for ${userProfile.full_name}`, userProfile.experience_level]
    );
    sessionId = sessionResult.rows[0].id;

    for (let i = 0; i < finalSequence.length; i++) {
      await pool.query(
        'INSERT INTO session_poses (session_id, pose_id, order_index) VALUES ($1, $2, $3)',
        [sessionId, finalSequence[i].id, i]
      );
    }
  } catch (err) {
    console.warn("Database storage failed, returning mock session data");
  }

  return { planId, sessionId, poses: finalSequence };
};
