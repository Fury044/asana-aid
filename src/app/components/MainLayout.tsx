import { Outlet, useLocation, useNavigate } from "react-router";
import { Home, FolderHeart, TrendingUp, User } from "lucide-react";

const navItems = [
  { path: "/app", icon: Home, label: "Home" },
  { path: "/app/programs", icon: FolderHeart, label: "Programs" },
  { path: "/app/progress", icon: TrendingUp, label: "Progress" },
  { path: "/app/profile", icon: User, label: "Profile" },
];

export default function MainLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f8faf9] flex flex-col">
      <div className="flex-1 overflow-y-auto pb-20">
        <Outlet />
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#e6f4ea] z-50">
        <div className="max-w-md mx-auto px-4">
          <nav className="flex items-center justify-around py-3">
            {navItems.map(({ path, icon: Icon, label }) => {
              const isActive = location.pathname === path;
              return (
                <button
                  key={path}
                  onClick={() => navigate(path)}
                  className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${
                    isActive ? "text-[#5fa777]" : "text-[#a8d5ba]"
                  }`}
                >
                  <Icon
                    className={`w-6 h-6 ${
                      isActive ? "fill-[#5fa777]/10" : ""
                    }`}
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                  <span className="text-xs">{label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
}
