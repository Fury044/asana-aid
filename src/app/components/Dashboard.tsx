import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { Flame, Target, Clock, Play, ChevronRight } from "lucide-react";
import { apiFetch } from "../../utils/apiClient";

export default function Dashboard() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<any>(null);
  const [greeting, setGreeting] = useState("");
  const [dailyPoses, setDailyPoses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("asanaAidUser") || "{}");
    setUserData(data);

    // Always fetch daily plan, using 'default_user' as fallback
    const userId = data.id || 'default_user';
    setLoading(true);
    setError(null);

    apiFetch(`/plans/daily/${userId}`)
      .then(res => {
        if (!res.ok) throw new Error(`Server returned ${res.status}`);
        return res.json();
      })
      .then(result => {
        if (result && result.poses && result.poses.length > 0) {
          setDailyPoses(result.poses);
        } else {
          setError("No exercises found for your plan. Try restarting onboarding.");
        }
      })
      .catch(err => {
        console.error("Failed to fetch daily plan:", err);
        setError("Unable to connect to health server. Please check your connection.");
      })
      .finally(() => setLoading(false));

    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 18) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");
  }, []);

  const stats = [
    {
      icon: Flame,
      label: "Calories",
      value: userData?.caloriesBurned || 0,
      color: "from-[#ff6b6b] to-[#ff8e53]",
    },
    {
      icon: Target,
      label: "Sessions",
      value: userData?.sessions || 0,
      color: "from-[#5fa777] to-[#81c995]",
    },
    {
      icon: Clock,
      label: "Minutes",
      value: userData?.totalMinutes || 0,
      color: "from-[#4facfe] to-[#00f2fe]",
    },
  ];

  return (
    <div className="min-h-screen">
      <div className="bg-gradient-to-br from-[#5fa777] to-[#81c995] rounded-b-[2.5rem] px-6 pt-12 pb-8 text-white">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl mb-2">
            {greeting}, {userData?.name || "Yogi"}!
          </h1>
          <p className="text-white/80">
            Ready for your yoga practice today?
          </p>

          <div className="mt-6 bg-white/20 backdrop-blur-md rounded-2xl p-4 flex items-center justify-between">
            <div>
              <div className="text-sm text-white/80 mb-1">Current Streak</div>
              <div className="text-2xl">🔥 {userData?.streak || 0} days</div>
            </div>
            <div className="text-right">
              <div className="text-sm text-white/80 mb-1">Progress</div>
              <div className="text-2xl">
                {userData?.sessions || 0}/{userData?.goalSessions || 30}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="px-6 -mt-6">
        <div className="grid grid-cols-3 gap-3 mb-8">
          {stats.map(({ icon: Icon, label, value, color }, index) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              className={`bg-gradient-to-br ${color} rounded-2xl p-4 text-white`}
            >
              <Icon className="w-6 h-6 mb-2" />
              <div className="text-2xl mb-1">{value}</div>
              <div className="text-xs text-white/80">{label}</div>
            </motion.div>
          ))}
        </div>

        <div className="mb-6">
          <h3 className="text-xl text-[#2d3748] mb-4">Today's Practice</h3>
          <div className="space-y-3">
            {loading && (
              <div className="text-center p-6 bg-white/50 rounded-2xl animate-pulse text-[#718096]">
                Fetching your sequence...
              </div>
            )}
            {error && !loading && (
              <div className="text-center p-6 bg-red-50 rounded-2xl border border-red-100 text-red-500">
                {error}
              </div>
            )}
            {!error && dailyPoses.length === 0 && !loading && (
              <div className="text-center p-6 bg-white/50 rounded-2xl border border-dashed border-[#5fa777]/30 text-[#718096]">
                Generating your personalized routine...
              </div>
            )}
            {dailyPoses.map((pose, index) => (
              <motion.div
                key={pose.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="bg-white rounded-2xl p-4 shadow-sm border border-[#e6f4ea] hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="text-[#2d3748] mb-1">{pose.name}</h4>
                    <div className="flex items-center gap-3 text-sm text-[#718096]">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {pose.base_duration || 60} sec
                      </span>
                      <span className="flex items-center gap-1">
                        <Flame className="w-4 h-4" />
                        {Math.floor((pose.base_duration || 60) * 0.1)} cal
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs px-3 py-1 bg-[#e6f4ea] text-[#5fa777] rounded-full">
                      {pose.difficulty_level || 'Beginner'}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <button
          onClick={() => navigate("/session")}
          className="w-full bg-gradient-to-r from-[#5fa777] to-[#81c995] text-white rounded-2xl p-4 flex items-center justify-center gap-2 shadow-lg mb-6"
        >
          <Play className="w-5 h-5" fill="white" />
          <span className="text-lg">Start Practice</span>
        </button>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl text-[#2d3748]">Recommended Programs</h3>
            <button
              onClick={() => navigate("/app/programs")}
              className="text-[#5fa777] text-sm flex items-center gap-1"
            >
              View All
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { name: "Back Pain Relief", sessions: 12, color: "from-[#667eea] to-[#764ba2]" },
              { name: "Stress Relief", sessions: 8, color: "from-[#f093fb] to-[#f5576c]" },
            ].map((program, index) => (
              <motion.button
                key={program.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                onClick={() => navigate("/app/programs")}
                className={`bg-gradient-to-br ${program.color} rounded-2xl p-5 text-left text-white`}
              >
                <div className="text-lg mb-2">{program.name}</div>
                <div className="text-sm text-white/80">
                  {program.sessions} sessions
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
