import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router";
import {
  User,
  Bell,
  Settings,
  HelpCircle,
  LogOut,
  ChevronRight,
  Edit2,
} from "lucide-react";

export default function Profile() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<any>(null);
  const [notifications, setNotifications] = useState(true);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("asanaAidUser") || "{}");
    setUserData(data);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("asanaAidUser");
    navigate("/");
  };

  const [showSettings, setShowSettings] = useState(false);
  const [showSupport, setShowSupport] = useState(false);

  const menuItems = [
    { icon: Bell, label: "Notifications", hasToggle: true },
    { icon: Settings, label: "Settings", hasToggle: false, onClick: () => setShowSettings(true) },
    { icon: HelpCircle, label: "Help & Support", hasToggle: false, onClick: () => setShowSupport(true) },
  ];

  return (
    <div className="min-h-screen">
      {/* Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6"
            onClick={() => setShowSettings(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl p-8 max-w-sm w-full"
            >
              <h3 className="text-2xl font-bold text-[#2d3748] mb-6">Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-[#f8faf9] rounded-xl">
                    <span className="text-[#4a5568]">Unit System</span>
                    <span className="text-[#5fa777] font-medium">Metric (kg/cm)</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-[#f8faf9] rounded-xl">
                    <span className="text-[#4a5568]">Dark Mode</span>
                    <span className="text-[#718096]">System Defaults</span>
                </div>
              </div>
              <button
                onClick={() => setShowSettings(false)}
                className="w-full mt-8 py-4 bg-[#5fa777] text-white rounded-2xl shadow-lg"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Help Modal */}
      <AnimatePresence>
        {showSupport && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6"
            onClick={() => setShowSupport(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl p-8 max-w-sm w-full text-center"
            >
              <div className="w-16 h-16 bg-[#e6f4ea] rounded-full flex items-center justify-center mx-auto mb-4">
                <HelpCircle className="w-8 h-8 text-[#5fa777]" />
              </div>
              <h3 className="text-2xl font-bold text-[#2d3748] mb-2">Help & Support</h3>
              <p className="text-[#718096] mb-6">Our wellness experts are available 24/7 to guide you.</p>
              <div className="space-y-3 mb-8">
                <button 
                  onClick={() => window.open('mailto:support@asanaaid.com')}
                  className="w-full py-3 border border-[#e6f4ea] rounded-xl text-[#5fa777] hover:bg-[#f8faf9]"
                >
                    Email Support
                </button>
                <button className="w-full py-3 border border-[#e6f4ea] rounded-xl text-[#5fa777] hover:bg-[#f8faf9]">
                    Live Chat
                </button>
              </div>
              <button
                onClick={() => setShowSupport(false)}
                className="w-full py-4 bg-[#5fa777] text-white rounded-2xl shadow-lg"
              >
                Done
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-gradient-to-br from-[#5fa777] to-[#81c995] rounded-b-[2.5rem] px-6 pt-12 pb-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center text-white"
        >
          <div className="relative inline-block mb-4">
            <div className="w-24 h-24 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border-4 border-white/30">
              <User className="w-12 h-12 text-white" />
            </div>
            <button className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg">
              <Edit2 className="w-4 h-4 text-[#5fa777]" />
            </button>
          </div>
          <h2 className="text-2xl mb-1">{userData?.name || "User"}</h2>
          <p className="text-white/80">{userData?.email || "yoga@asanaaid.com"}</p>
        </motion.div>
      </div>

      <div className="px-6 py-6">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#e6f4ea] mb-6">
          <h3 className="text-lg text-[#2d3748] mb-4">Personal Info</h3>
          <div className="space-y-3">
            <div className="flex justify-between py-2">
              <span className="text-[#718096]">Age</span>
              <span className="text-[#2d3748]">{userData?.age || "N/A"}</span>
            </div>
            <div className="flex justify-between py-2 border-t border-[#e6f4ea]">
              <span className="text-[#718096]">Gender</span>
              <span className="text-[#2d3748]">{userData?.gender || "N/A"}</span>
            </div>
            <div className="flex justify-between py-2 border-t border-[#e6f4ea]">
              <span className="text-[#718096]">Height</span>
              <span className="text-[#2d3748]">
                {userData?.height ? `${userData.height} cm` : "N/A"}
              </span>
            </div>
            <div className="flex justify-between py-2 border-t border-[#e6f4ea]">
              <span className="text-[#718096]">Weight</span>
              <span className="text-[#2d3748]">
                {userData?.weight ? `${userData.weight} kg` : "N/A"}
              </span>
            </div>
            <div className="flex justify-between py-2 border-t border-[#e6f4ea]">
              <span className="text-[#718096]">Experience</span>
              <span className="text-[#2d3748]">
                {userData?.experience || "N/A"}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#e6f4ea] mb-6">
          <h3 className="text-lg text-[#2d3748] mb-4">Health Focus</h3>
          <div className="flex flex-wrap gap-2">
            {userData?.healthConditions?.length > 0 ? (
              userData.healthConditions.map((condition: string, index: number) => (
                <span
                  key={index}
                  className="px-3 py-1.5 bg-[#e6f4ea] text-[#5fa777] rounded-full text-sm"
                >
                  {condition}
                </span>
              ))
            ) : (
              <span className="text-[#718096] text-sm">No conditions specified</span>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-[#e6f4ea] mb-6 overflow-hidden">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                onClick={item.onClick}
                className={`w-full flex items-center justify-between p-4 hover:bg-[#f8faf9] transition-colors ${
                  index !== menuItems.length - 1 ? "border-b border-[#e6f4ea]" : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5 text-[#5fa777]" />
                  <span className="text-[#2d3748]">{item.label}</span>
                </div>
                {item.hasToggle ? (
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      setNotifications(!notifications);
                    }}
                    className={`w-12 h-6 rounded-full transition-colors ${
                      notifications ? "bg-[#5fa777]" : "bg-[#cbd5e0]"
                    } relative cursor-pointer`}
                  >
                    <div
                      className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                        notifications ? "translate-x-7" : "translate-x-1"
                      }`}
                    />
                  </div>
                ) : (
                  <ChevronRight className="w-5 h-5 text-[#a8d5ba]" />
                )}
              </button>
            );
          })}
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 p-4 bg-white border-2 border-[#e53e3e] text-[#e53e3e] rounded-2xl hover:bg-[#e53e3e] hover:text-white transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>Log Out</span>
        </button>

        <div className="mt-6 text-center text-sm text-[#a8d5ba]">
          Asana Aid v1.0.0
        </div>
      </div>
    </div>
  );
}
