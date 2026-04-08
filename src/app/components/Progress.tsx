import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { Calendar, TrendingUp, Award, Flame } from "lucide-react";
import { apiFetch } from "../../utils/apiClient";

// achievements can stay for UI but the logic should eventually be syncable too
const achievements = [
  { name: "First Step", icon: "🎯", description: "Completed first session", unlocked: true },
  { name: "Week Warrior", icon: "💪", description: "7 days streak", unlocked: false },
  { name: "Dedicated Yogi", icon: "🧘", description: "30 sessions completed", unlocked: false },
  { name: "Flexibility Master", icon: "🌟", description: "Advanced poses unlocked", unlocked: false },
];

export default function Progress() {
  const [userData, setUserData] = useState<any>(null);
  const [weeklyActivity, setWeeklyActivity] = useState<any[]>([]);
  const [timeRange, setTimeRange] = useState("week");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("asanaAidUser") || "{}");
    setUserData(data);

    const fetchData = async () => {
      if (!data.id) return;
      try {
        setLoading(true);
        const [statsRes, streaksRes, weeklyRes] = await Promise.all([
          apiFetch(`/analytics/stats?userId=${data.id}`),
          apiFetch(`/analytics/streaks?userId=${data.id}`),
          apiFetch(`/analytics/weekly-activity?userId=${data.id}`)
        ]);

        if (statsRes.ok && streaksRes.ok && weeklyRes.ok) {
          const stats = await statsRes.json();
          const streaks = await streaksRes.json();
          const weekly = await weeklyRes.json();

          setUserData((prev: any) => ({
            ...prev,
            sessions: stats.completedSessions,
            totalMinutes: stats.totalMinutes,
            streak: streaks.current_streak,
            caloriesBurned: stats.completedSessions * 85
          }));
          setWeeklyActivity(weekly);
        }
      } catch (err) {
        console.error("Failed to fetch cloud stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const totalMinutes = weeklyActivity.reduce((sum, day) => sum + (day.minutes || 0), 0);
  const avgMinutes = weeklyActivity.length > 0 ? Math.round(totalMinutes / weeklyActivity.length) : 0;

  return (
    <div className="min-h-screen">
      <div className="bg-white sticky top-0 z-10 border-b border-[#e6f4ea]">
        <div className="px-6 pt-12 pb-6">
          <h1 className="text-3xl text-[#2d3748]">Progress</h1>
          <p className="text-[#718096] mt-1">Track your yoga journey</p>
        </div>
      </div>

      <div className="px-6 py-6">
        <div className="grid grid-cols-2 gap-3 mb-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-br from-[#5fa777] to-[#81c995] rounded-2xl p-5 text-white"
          >
            <Calendar className="w-8 h-8 mb-3" />
            <div className="text-3xl mb-1">{userData?.streak || 0}</div>
            <div className="text-sm text-white/80">Day Streak</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-[#ff6b6b] to-[#ff8e53] rounded-2xl p-5 text-white"
          >
            <Flame className="w-8 h-8 mb-3" />
            <div className="text-3xl mb-1">{userData?.caloriesBurned || 0}</div>
            <div className="text-sm text-white/80">Calories Burned</div>
          </motion.div>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#e6f4ea] mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg text-[#2d3748]">Last 7 Days Activity</h3>
            <div className="flex gap-2">
              {["week", "month"].map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-3 py-1 text-sm rounded-lg transition-colors ${timeRange === range
                      ? "bg-[#5fa777] text-white"
                      : "bg-[#f1f5f3] text-[#718096]"
                    }`}
                >
                  {range.charAt(0).toUpperCase() + range.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={weeklyActivity}>
              <XAxis
                dataKey="label"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#718096", fontSize: 12 }}
              />
              <YAxis hide />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e6f4ea",
                  borderRadius: "12px",
                  fontSize: "14px",
                }}
              />
              <Bar
                dataKey="minutes"
                fill="#5fa777"
                radius={[8, 8, 0, 0]}
                maxBarSize={40}
              />
            </BarChart>
          </ResponsiveContainer>

          <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-[#e6f4ea]">
            <div>
              <div className="text-sm text-[#718096] mb-1">Total Minutes</div>
              <div className="text-2xl text-[#2d3748]">{totalMinutes}</div>
            </div>
            <div>
              <div className="text-sm text-[#718096] mb-1">Daily Average</div>
              <div className="text-2xl text-[#2d3748]">{avgMinutes}</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#e6f4ea] mb-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-[#5fa777]" />
            <h3 className="text-lg text-[#2d3748]">Insights</h3>
          </div>
          <div className="space-y-3">
            {userData?.sessions > 0 ? (
                <>
                    <div className="flex items-start gap-3 p-3 bg-[#e6f4ea] rounded-xl">
                        <div className="text-2xl">📈</div>
                        <div>
                            <div className="text-sm text-[#2d3748]">
                                You've practiced for {userData.totalMinutes} minutes this week!
                            </div>
                        </div>
                    </div>
                    {userData.streak > 2 && (
                        <div className="flex items-start gap-3 p-3 bg-[#e6f4ea] rounded-xl">
                            <div className="text-2xl">🔥</div>
                            <div>
                                <div className="text-sm text-[#2d3748]">
                                    Amazing {userData.streak} day streak! Consistency is key to yoga.
                                </div>
                            </div>
                        </div>
                    )}
                </>
            ) : (
                <div className="flex items-start gap-3 p-3 bg-[#f8faf9] rounded-xl">
                    <div className="text-2xl">💡</div>
                    <div>
                        <div className="text-sm text-[#2d3748]">
                            Start your first session to see personalized activity insights!
                        </div>
                    </div>
                </div>
            )}
            <div className="flex items-start gap-3 p-3 bg-[#e6f4ea] rounded-xl">
              <div className="text-2xl">✨</div>
              <div>
                <div className="text-sm text-[#2d3748]">
                  Goal Focus: {(userData?.goals || []).join(", ") || "General Wellness"}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#e6f4ea]">
          <div className="flex items-center gap-2 mb-4">
            <Award className="w-5 h-5 text-[#5fa777]" />
            <h3 className="text-lg text-[#2d3748]">Achievements</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {achievements.map((achievement, index) => (
              <motion.div
                key={achievement.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 rounded-2xl text-center ${achievement.unlocked
                    ? "bg-gradient-to-br from-[#5fa777] to-[#81c995] text-white"
                    : "bg-[#f1f5f3] text-[#a8d5ba]"
                  }`}
              >
                <div className="text-3xl mb-2">{achievement.icon}</div>
                <div className="text-sm mb-1">{achievement.name}</div>
                <div className="text-xs opacity-80">
                  {achievement.description}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
