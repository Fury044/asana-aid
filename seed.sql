-- SEED DATA FOR ASANA AID

-- 1. Insert Medical Conditions
INSERT INTO medical_conditions (name, description) VALUES
('Back Pain', 'Pain or discomfort in the upper, middle, or lower back.'),
('Navel Issues', 'Digestive issues, displacement of navel, or core weakness.'),
('Hypertension', 'High blood pressure; requiring gentle movements.'),
('Anxiety', 'High stress or anxiety; requiring grounding and calming poses.'),
('Neck Stiffness', 'Tension in the cervical region and shoulders.');

-- 2. Insert Yoga Poses with specific focus areas
INSERT INTO yoga_poses (name, description, difficulty_level, focus_area, base_duration, instructions) VALUES
-- Back Pain Focused
('Cat-Cow', 'Synchronized breath movement to stretch the spine.', 'Beginner', 'Back', 60, '{"steps": ["Hands and knees on floor", "Inhale, arch back (Cow)", "Exhale, round spine (Cat)"]}'),
('Child''s Pose', 'Resting pose that stretches the lower back.', 'Beginner', 'Back', 90, '{"steps": ["Kneel on floor", "Touch big toes together", "Sit on heels", "Fold forward over thighs"]}'),
('Cobra Pose', 'Strengthens the spine and stretches the chest.', 'Beginner', 'Back', 45, '{"steps": ["Lie on belly", "Hands under shoulders", "Lift chest slightly", "Keep pelvis on floor"]}'),
('Bird Dog', 'Core stability and spinal alignment.', 'Intermediate', 'Back', 60, '{"steps": ["All fours", "Extend opposite arm and leg", "Hold for 5 seconds", "Switch sides"]}'),

-- Navel/Core Focused
('Naukasana (Boat)', 'Strengthens abdominal muscles and fixes navel center.', 'Intermediate', 'Navel', 30, '{"steps": ["Sit with legs extended", "Lift legs to 45 deg", "Extend arms forward", "Balance on sit bones"]}'),
('Dhanurasana (Bow)', 'Stretches the entire front of the body and massages organs.', 'Intermediate', 'Navel', 45, '{"steps": ["Lie on belly", "Bend knees", "Hold ankles", "Lift chest and thighs"]}'),
('Pawanmuktasana', 'Gas-releasing pose; good for digestive health.', 'Beginner', 'Navel', 60, '{"steps": ["Lie on back", "Bring knees to chest", "Hug knees", "Lift forehead to knees"]}'),
('Plank Pose', 'Total core strengthening.', 'Intermediate', 'Navel', 60, '{"steps": ["Standard push-up position", "Core tight", "Straight line from head to heels"]}'),

-- General/Flexibility
('Trikonasana (Triangle)', 'Deep stretch for legs and torso.', 'Intermediate', 'Flexibility', 60, '{"steps": ["Feet wide apart", "Turn right foot out", "Reach right hand down to shin", "Left arm up"]}'),
('Tree Pose', 'Balance and hip opening.', 'Beginner', 'Flexibility', 45, '{"steps": ["Stand tall", "Place foot on inner thigh", "Hands at heart center", "Fix gaze on one point"]}'),
('Forward Fold', 'Calming pose that stretches the hamstrings.', 'Beginner', 'Flexibility', 60, '{"steps": ["Stand feet hip-width", "Hinge at hips", "Let head hang heavy", "Belly to thighs"]}'),

-- Restorative/Stress
('Shavasana', 'Complete relaxation and integration.', 'Beginner', 'Stress', 300, '{"steps": ["Lie flat on back", "Arms at sides", "Palms up", "Release all tension"]}'),
('Balasana (Extended)', 'Grounding and calming.', 'Beginner', 'Stress', 120, '{"steps": ["Child''s pose with arms extended forward"]}');

-- 3. Create pre-defined programs for specific problems
INSERT INTO yoga_programs (title, description, focus_area) VALUES
('Back Pain Relief', 'A gentle sequence to decompress the spine and strengthen the lower back.', 'Back'),
('Core & Navel Health', 'Focuses on the solar plexus and digestive health.', 'Navel'),
('Daily Calm', 'A sequence designed to reduce stress and improve mental clarity.', 'Stress');

-- 4. Map Sessions to Programs
INSERT INTO yoga_sessions (program_id, title, duration, difficulty) 
SELECT id, 'Session 1: Initial Relief', 600, 'Beginner' FROM yoga_programs WHERE title = 'Back Pain Relief';

INSERT INTO yoga_sessions (program_id, title, duration, difficulty) 
SELECT id, 'Session 1: Centering', 600, 'Beginner' FROM yoga_programs WHERE title = 'Core & Navel Health';

-- 5. Add Poses to Sessions (Linking back pain poses to back pain session)
-- Back Pain Session
INSERT INTO session_poses (session_id, pose_id, order_index)
SELECT s.id, p.id, 1 FROM yoga_sessions s, yoga_poses p WHERE s.title = 'Session 1: Initial Relief' AND p.name = 'Cat-Cow';
INSERT INTO session_poses (session_id, pose_id, order_index)
SELECT s.id, p.id, 2 FROM yoga_sessions s, yoga_poses p WHERE s.title = 'Session 1: Initial Relief' AND p.name = 'Child''s Pose';
INSERT INTO session_poses (session_id, pose_id, order_index)
SELECT s.id, p.id, 3 FROM yoga_sessions s, yoga_poses p WHERE s.title = 'Session 1: Initial Relief' AND p.name = 'Cobra Pose';

-- Navel Session
INSERT INTO session_poses (session_id, pose_id, order_index)
SELECT s.id, p.id, 1 FROM yoga_sessions s, yoga_poses p WHERE s.title = 'Session 1: Centering' AND p.name = 'Pawanmuktasana';
INSERT INTO session_poses (session_id, pose_id, order_index)
SELECT s.id, p.id, 2 FROM yoga_sessions s, yoga_poses p WHERE s.title = 'Session 1: Centering' AND p.name = 'Naukasana (Boat)';
INSERT INTO session_poses (session_id, pose_id, order_index)
SELECT s.id, p.id, 3 FROM yoga_sessions s, yoga_poses p WHERE s.title = 'Session 1: Centering' AND p.name = 'Plank Pose';
