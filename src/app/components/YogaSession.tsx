import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  X,
  Volume2,
  VolumeX,
  Check,
  Flame,
} from "lucide-react";
import { apiFetch } from "../../utils/apiClient";

const poses = [
  {
    id: 1,
    name: "Mountain Pose (Tadasana)",
    duration: 120,
    instructions: [
      "Stand with feet together, arms at sides",
      "Distribute weight evenly across both feet",
      "Engage thigh muscles and lift kneecaps",
      "Draw shoulders back and down",
      "Breathe deeply and hold the position",
    ],
    benefits: "Improves posture and balance",
    difficulty: "Beginner",
  },
  {
    id: 2,
    name: "Downward Dog (Adho Mukha Svanasana)",
    duration: 180,
    instructions: [
      "Start on hands and knees",
      "Lift hips up and back, forming an inverted V",
      "Press hands firmly into the mat",
      "Straighten legs as much as comfortable",
      "Relax head between arms",
    ],
    benefits: "Stretches spine and strengthens arms",
    difficulty: "Beginner",
  },
  {
    id: 3,
    name: "Warrior II (Virabhadrasana II)",
    duration: 240,
    instructions: [
      "Stand with legs wide apart",
      "Turn right foot out 90 degrees",
      "Bend right knee over right ankle",
      "Extend arms parallel to the floor",
      "Gaze over right fingertips",
    ],
    benefits: "Builds strength and stamina",
    difficulty: "Intermediate",
  },
  {
    id: 4,
    name: "Child's Pose (Balasana)",
    duration: 120,
    instructions: [
      "Kneel on the mat with big toes touching",
      "Sit back on your heels",
      "Fold forward, extending arms ahead",
      "Rest forehead on the mat",
      "Breathe deeply and relax",
    ],
    benefits: "Gentle stretch for back and hips",
    difficulty: "Beginner",
  },
];

export default function YogaSession() {
  const navigate = useNavigate();
  const { programId } = useParams();
  const [sessionPoses, setSessionPoses] = useState<any[]>([]);
  const [currentPoseIndex, setCurrentPoseIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(60);
  const [isMuted, setIsMuted] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSessionPlan = async () => {
      setLoading(true);
      try {
        const userData = JSON.parse(localStorage.getItem("asanaAidUser") || "{}");
        const userId = userData.id || 'default_user';
        
        // If we have a programId, we generate a specific plan for that program
        // mapping back-pain -> "Back Pain Relief", etc.
        let url = `/plans/daily/${userId}`;
        let method = "GET";
        let body: any = null;

        if (programId) {
            // Map known program IDs to names
            const idToName: any = {
                'back-pain': 'Back Pain Relief',
                'navel': 'Navel Correction',
                'stress': 'Stress Relief',
                'posture': 'Posture Improvement',
                'flexibility': 'Flexibility Flow',
                'mood': 'Mood Boost'
            };
            url = "/plans/generate";
            method = "POST";
            body = JSON.stringify({
                userId,
                conditions: [idToName[programId] || programId]
            });
        }

        const res = await apiFetch(url, {
          method,
          headers: { "Content-Type": "application/json" },
          body: body
        });
        const data = await res.json();
        
        if (data.poses && data.poses.length > 0) {
          setSessionPoses(data.poses);
          setTimeRemaining(data.poses[0].base_duration || data.poses[0].duration || 60);
        }
      } catch (err) {
        console.error("Failed to load session:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSessionPlan();
  }, [programId]);

  const currentPose = sessionPoses[currentPoseIndex] || { 
      name: "Loading...", 
      duration: 60, 
      instructions: ["Please wait..."], 
      benefits: "...", 
      difficulty: "..." 
  };
  
  const duration = currentPose.base_duration || currentPose.duration || 60;
  const progress = ((duration - timeRemaining) / duration) * 100;

  useEffect(() => {
    let timer: any;
    if (isPlaying && timeRemaining > 0) {
      timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            if (currentPoseIndex < sessionPoses.length - 1) {
              const nextPose = sessionPoses[currentPoseIndex + 1];
              setCurrentPoseIndex((prev) => prev + 1);
              return nextPose.base_duration || nextPose.duration || 60;
            } else {
              setIsPlaying(false);
              setShowCompletionModal(true);
              return 0;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPlaying, timeRemaining, currentPoseIndex, sessionPoses]);

  const handleNextPose = () => {
    if (currentPoseIndex < sessionPoses.length - 1) {
      const nextPose = sessionPoses[currentPoseIndex + 1];
      setCurrentPoseIndex((prev) => prev + 1);
      setTimeRemaining(nextPose.base_duration || nextPose.duration || 60);
      setIsPlaying(false);
    }
  };

  const handlePreviousPose = () => {
    if (currentPoseIndex > 0) {
      const prevPose = sessionPoses[currentPoseIndex - 1];
      setCurrentPoseIndex((prev) => prev - 1);
      setTimeRemaining(prevPose.base_duration || prevPose.duration || 60);
      setIsPlaying(false);
    }
  };

  const handleComplete = async () => {
    const userData = JSON.parse(localStorage.getItem("asanaAidUser") || "{}");
    const userId = userData.id;
    const planId = userData.currentPlanId;
    const sessionId = userData.currentSessionId;

    try {
      // 1. Persist to Backend if we have the IDs
      if (userId && sessionId) {
        await apiFetch(`/sessions/complete/${sessionId}`, { // Fixed path: /complete/:id
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${userData.token}`
          },
          body: JSON.stringify({ userId })
        });
        console.log("Session persisted to cloud database.");
      }
    } catch (err) {
      console.warn("Failed to persist session to backend, falling back to local storage only.", err);
    }

    // 2. Local fallback/update for instant UI feedback
    const newSessions = (userData.sessions || 0) + 1;
    const totalMinutes = (userData.totalMinutes || 0) + Math.floor(sessionPoses.reduce((sum, pose) => sum + (pose.base_duration || 60), 0) / 60);
    const calories = (userData.caloriesBurned || 0) + 85;
    const streak = (userData.streak || 0) + 1;

    localStorage.setItem(
      "asanaAidUser",
      JSON.stringify({
        ...userData,
        sessions: newSessions,
        totalMinutes,
        caloriesBurned: calories,
        streak,
      })
    );

    navigate("/app");
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8faf9] to-[#e6f4ea] flex flex-col">
      <div className="bg-white/90 backdrop-blur-md px-6 py-4 flex items-center justify-between border-b border-[#e6f4ea]">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-full hover:bg-[#e6f4ea] transition-colors"
        >
          <X className="w-6 h-6 text-[#2d3748]" />
        </button>
        <div className="text-center">
          <div className="text-sm text-[#718096]">
            Pose {currentPoseIndex + 1} of {sessionPoses.length || '...'}
          </div>
        </div>
        <button
          onClick={() => setIsMuted(!isMuted)}
          className="p-2 rounded-full hover:bg-[#e6f4ea] transition-colors"
        >
          {isMuted ? (
            <VolumeX className="w-6 h-6 text-[#718096]" />
          ) : (
            <Volume2 className="w-6 h-6 text-[#5fa777]" />
          )}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6">
        <motion.div
          key={currentPoseIndex}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
        >
          <div className="bg-gradient-to-br from-[#5fa777] to-[#81c995] rounded-3xl p-6 mb-6 text-white text-center shadow-lg overflow-hidden relative">
            <div className="relative aspect-video bg-white/10 backdrop-blur-md rounded-2xl mb-4 flex items-center justify-center group overflow-hidden border border-white/20">
              {/* Visual Guide - Rendering GIF from media_url or mediaUrl */}
              {(currentPose.media_url || currentPose.mediaUrl) ? (
                <img 
                  src={currentPose.media_url || currentPose.mediaUrl} 
                  alt={currentPose.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <>
                  <div className="absolute inset-0 flex items-center justify-center opacity-40 group-hover:opacity-60 transition-opacity">
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <Flame className="w-24 h-24 text-white" />
                    </motion.div>
                  </div>
                  <div className="z-10 bg-white/20 backdrop-blur-lg rounded-full p-4 border border-white/30">
                    <Play className="w-10 h-10 text-white fill-white" />
                  </div>
                </>
              )}
              <div className="absolute bottom-3 right-3 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full text-xs text-white">
                Visual Guide
              </div>
            </div>
            
            <h2 className="text-2xl font-semibold mb-1">{currentPose.name}</h2>
            <div className="flex items-center justify-center gap-2">
              <span className="px-3 py-0.5 bg-white/20 backdrop-blur-sm rounded-full text-xs uppercase tracking-wider">
                {currentPose.difficulty}
              </span>
              <span className="px-3 py-0.5 bg-white/20 backdrop-blur-sm rounded-full text-xs uppercase tracking-wider">
                {currentPose.focus_area || 'Balance'}
              </span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#e6f4ea] mb-6">
            <div className="flex items-center justify-center mb-4">
              <div className="relative">
                <svg className="w-32 h-32 transform -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="#e6f4ea"
                    strokeWidth="8"
                    fill="none"
                  />
                  <motion.circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="#5fa777"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 56}`}
                    initial={{ strokeDashoffset: 2 * Math.PI * 56 }}
                    animate={{
                      strokeDashoffset:
                        2 * Math.PI * 56 * (1 - progress / 100),
                    }}
                    transition={{ duration: 0.5 }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-3xl text-[#2d3748]">
                    {formatTime(timeRemaining)}
                  </span>
                </div>
              </div>
            </div>

            <div className="text-center mb-6">
              <div className="text-sm text-[#718096] mb-1">Benefits</div>
              <div className="text-[#2d3748]">{currentPose.benefits}</div>
            </div>

            <div>
              <h3 className="text-lg text-[#2d3748] mb-3">Instructions</h3>
              <div className="space-y-3">
                {(() => {
                  const instructionList = Array.isArray(currentPose.instructions) 
                    ? currentPose.instructions 
                    : (currentPose.instructions?.steps || []);
                    
                  if (instructionList.length > 0) {
                    return instructionList.map((instruction: string, index: number) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 p-3 bg-[#f8faf9] rounded-xl"
                      >
                        <div className="flex-shrink-0 w-6 h-6 bg-[#5fa777] text-white rounded-full flex items-center justify-center text-sm">
                          {index + 1}
                        </div>
                        <p className="text-[#2d3748] text-sm pt-0.5">
                          {instruction}
                        </p>
                      </div>
                    ));
                  }
                  
                  return (
                    <div className="p-4 bg-[#f8faf9] rounded-xl text-[#718096] text-sm italic">
                      Follow along with the visual guide...
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="sticky bottom-0 bg-white/90 backdrop-blur-md border-t border-[#e6f4ea] px-6 py-4">
        <div className="flex items-center justify-center gap-4 mb-4">
          <button
            onClick={handlePreviousPose}
            disabled={currentPoseIndex === 0}
            className={`p-4 rounded-2xl border-2 transition-all ${
              currentPoseIndex === 0
                ? "border-[#e6f4ea] text-[#cbd5e0] cursor-not-allowed"
                : "border-[#5fa777] text-[#5fa777] hover:bg-[#e6f4ea]"
            }`}
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="px-8 py-4 bg-gradient-to-r from-[#5fa777] to-[#81c995] text-white rounded-2xl flex items-center gap-2 shadow-lg hover:shadow-xl transition-shadow"
          >
            {isPlaying ? (
              <>
                <Pause className="w-6 h-6" fill="white" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-6 h-6" fill="white" />
                <span>Play</span>
              </>
            )}
          </button>

          <button
            onClick={handleNextPose}
            disabled={currentPoseIndex === sessionPoses.length - 1}
            className={`p-4 rounded-2xl border-2 transition-all ${
              currentPoseIndex === sessionPoses.length - 1
                ? "border-[#e6f4ea] text-[#cbd5e0] cursor-not-allowed"
                : "border-[#5fa777] text-[#5fa777] hover:bg-[#e6f4ea]"
            }`}
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        <div className="w-full h-2 bg-[#e6f4ea] rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-[#5fa777] to-[#81c995]"
            initial={{ width: 0 }}
            animate={{
              width: `${((currentPoseIndex + progress / 100) / sessionPoses.length) * 100}%`,
            }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      <AnimatePresence>
        {showCompletionModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6"
            onClick={() => setShowCompletionModal(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl p-8 max-w-sm w-full text-center"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-[#5fa777] to-[#81c995] rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="w-10 h-10 text-white" strokeWidth={3} />
              </div>
              <h2 className="text-2xl text-[#2d3748] mb-2">
                Session Complete!
              </h2>
              <p className="text-[#718096] mb-6">
                Great job! You've completed your yoga practice.
              </p>
              <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="bg-[#f8faf9] rounded-xl p-3">
                  <div className="text-2xl text-[#5fa777] mb-1">
                    {sessionPoses.length}
                  </div>
                  <div className="text-xs text-[#718096]">Poses</div>
                </div>
                <div className="bg-[#f8faf9] rounded-xl p-3">
                  <div className="text-2xl text-[#5fa777] mb-1">
                    {Math.floor(sessionPoses.reduce((sum, p) => sum + (p.base_duration || 60), 0) / 60)}
                  </div>
                  <div className="text-xs text-[#718096]">Minutes</div>
                </div>
                <div className="bg-[#f8faf9] rounded-xl p-3">
                  <div className="text-2xl text-[#5fa777] mb-1">
                    {sessionPoses.length * 10 + 5}
                  </div>
                  <div className="text-xs text-[#718096]">Calories</div>
                </div>
              </div>
              <button
                onClick={handleComplete}
                className="w-full py-4 bg-gradient-to-r from-[#5fa777] to-[#81c995] text-white rounded-2xl hover:shadow-lg transition-shadow"
              >
                Continue
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
