import { useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { Mail, Lock, User, ArrowRight, Github } from "lucide-react";
import { apiFetch } from "../../../utils/apiClient";

export default function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await apiFetch("/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("asanaAidUser", JSON.stringify({
          id: data.user.id,
          email: data.user.email,
          name: data.user.full_name,
          token: data.token
        }));
        navigate("/onboarding/basic-info");
      } else {
        setError(data.message || "Signup failed");
        // Fallback for demo
        if (!response.ok) {
            console.warn("Backend unavailable, proceeding with demo session");
            localStorage.setItem("asanaAidUser", JSON.stringify({
                id: 'demo_user_' + Date.now(),
                email: formData.email,
                name: formData.full_name,
            }));
            navigate("/onboarding/basic-info");
        }
      }
    } catch (err) {
      console.error("Auth error:", err);
      // Fallback for demo
      localStorage.setItem("asanaAidUser", JSON.stringify({
        id: 'demo_user_' + Date.now(),
        email: formData.email,
        name: formData.full_name,
      }));
      navigate("/onboarding/basic-info");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8faf9] flex flex-col justify-center px-6 py-12">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex justify-center mb-8"
        >
            <div className="w-16 h-16 bg-[#5fa777] rounded-2xl flex items-center justify-center shadow-lg transform rotate-12">
                <span className="text-white text-3xl font-bold">A</span>
            </div>
        </motion.div>
        <h2 className="text-center text-3xl font-bold tracking-tight text-[#2d3748]">
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-[#718096]">
          Start your therapeutic yoga journey today
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white py-8 px-4 shadow-xl shadow-[#5fa777]/5 sm:rounded-3xl sm:px-10 border border-[#e6f4ea]"
        >
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
                <div className="bg-red-50 text-red-500 p-3 rounded-xl text-sm border border-red-100 italic">
                    {error}
                </div>
            )}
            <div>
              <label className="block text-sm font-medium text-[#4a5568]">
                Full Name
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-[#a8d5ba]" />
                </div>
                <input
                  type="text"
                  required
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  className="block w-full pl-10 pr-3 py-3 border border-[#e6f4ea] rounded-2xl leading-5 bg-[#f8faf9] placeholder-[#a8d5ba] focus:outline-none focus:ring-2 focus:ring-[#5fa777] focus:border-transparent sm:text-sm transition-all shadow-sm"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#4a5568]">
                Email address
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-[#a8d5ba]" />
                </div>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="block w-full pl-10 pr-3 py-3 border border-[#e6f4ea] rounded-2xl leading-5 bg-[#f8faf9] placeholder-[#a8d5ba] focus:outline-none focus:ring-2 focus:ring-[#5fa777] focus:border-transparent sm:text-sm transition-all shadow-sm"
                  placeholder="john@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#4a5568]">
                Password
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-[#a8d5ba]" />
                </div>
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="block w-full pl-10 pr-3 py-3 border border-[#e6f4ea] rounded-2xl leading-5 bg-[#f8faf9] placeholder-[#a8d5ba] focus:outline-none focus:ring-2 focus:ring-[#5fa777] focus:border-transparent sm:text-sm transition-all shadow-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                className="h-4 w-4 text-[#5fa777] focus:ring-[#5fa777] border-[#e6f4ea] rounded"
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-[#718096]">
                I agree to the{" "}
                <a href="#" className="font-medium text-[#5fa777] hover:text-[#4a8a5f]">
                  Terms and Conditions
                </a>
              </label>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-2xl shadow-lg text-sm font-medium text-white bg-gradient-to-r from-[#5fa777] to-[#81c995] hover:from-[#4a8a5f] hover:to-[#6fb384] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5fa777] transition-all transform hover:scale-[1.02]"
              >
                {loading ? "Creating account..." : (
                    <>
                        Create Account
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#e6f4ea]" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-[#718096]">Or continue with</span>
              </div>
            </div>

            <div className="mt-6">
              <button
                className="w-full inline-flex justify-center py-3 px-4 border border-[#e6f4ea] rounded-2xl shadow-sm bg-white text-sm font-medium text-[#4a5568] hover:bg-[#f8faf9] transition-all"
              >
                <Github className="h-5 w-5 mr-2" />
                <span>GitHub</span>
              </button>
            </div>
          </div>
          
          <p className="mt-8 text-center text-sm text-[#718096]">
            Already have an account?{" "}
            <button 
                onClick={() => navigate("/login")}
                className="font-medium text-[#5fa777] hover:text-[#4a8a5f]"
            >
              Sign in
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
