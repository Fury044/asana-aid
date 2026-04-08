import { motion } from "motion/react";
import { useNavigate } from "react-router";
import {
  Heart,
  Zap,
  Moon,
  Target,
  Smile,
  Activity,
  ChevronRight,
} from "lucide-react";

const programs = [
  {
    id: "back-pain",
    name: "Back Pain Relief",
    description: "Gentle stretches to ease back tension",
    sessions: 12,
    duration: "15-20 min",
    icon: Heart,
    color: "from-[#667eea] to-[#764ba2]",
  },
  {
    id: "navel",
    name: "Navel Correction",
    description: "Core strengthening and alignment",
    sessions: 10,
    duration: "12-18 min",
    icon: Target,
    color: "from-[#f093fb] to-[#f5576c]",
  },
  {
    id: "stress",
    name: "Stress Relief",
    description: "Calming poses for mental wellness",
    sessions: 8,
    duration: "10-15 min",
    icon: Moon,
    color: "from-[#4facfe] to-[#00f2fe]",
  },
  {
    id: "posture",
    name: "Posture Improvement",
    description: "Build strength for better alignment",
    sessions: 14,
    duration: "18-25 min",
    icon: Activity,
    color: "from-[#43e97b] to-[#38f9d7]",
  },
  {
    id: "flexibility",
    name: "Flexibility Flow",
    description: "Increase range of motion",
    sessions: 16,
    duration: "20-30 min",
    icon: Zap,
    color: "from-[#fa709a] to-[#fee140]",
  },
  {
    id: "mood",
    name: "Mood Boost",
    description: "Uplifting sequences for positive energy",
    sessions: 7,
    duration: "10-12 min",
    icon: Smile,
    color: "from-[#30cfd0] to-[#330867]",
  },
];

export default function Programs() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      <div className="bg-white sticky top-0 z-10 border-b border-[#e6f4ea]">
        <div className="px-6 pt-12 pb-6">
          <h1 className="text-3xl text-[#2d3748]">Programs</h1>
          <p className="text-[#718096] mt-1">
            Specialized yoga routines for your goals
          </p>
        </div>
      </div>

      <div className="px-6 py-6">
        <div className="space-y-4">
          {programs.map((program, index) => {
            const Icon = program.icon;
            return (
              <motion.button
                key={program.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
                onClick={() => navigate(`/session/${program.id}`)}
                className="w-full bg-white rounded-2xl overflow-hidden shadow-sm border border-[#e6f4ea] hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-4 p-4">
                  <div
                    className={`flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br ${program.color} flex items-center justify-center`}
                  >
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="text-lg text-[#2d3748] mb-1">
                      {program.name}
                    </h3>
                    <p className="text-sm text-[#718096] mb-2">
                      {program.description}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-[#a8d5ba]">
                      <span>{program.sessions} sessions</span>
                      <span>•</span>
                      <span>{program.duration}</span>
                    </div>
                  </div>
                  <ChevronRight className="w-6 h-6 text-[#a8d5ba] flex-shrink-0" />
                </div>
              </motion.button>
            );
          })}
        </div>

        <div className="mt-8 bg-gradient-to-br from-[#e6f4ea] to-[#d4e8dc] rounded-2xl p-6 text-center">
          <h3 className="text-xl text-[#2d3748] mb-2">
            Need a custom program?
          </h3>
          <p className="text-[#718096] mb-4">
            Connect with our wellness coaches for personalized guidance
          </p>
          <button 
            onClick={() => window.open('mailto:support@asanaaid.com')}
            className="px-6 py-3 bg-white text-[#5fa777] rounded-xl hover:shadow-md transition-shadow"
          >
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
}
