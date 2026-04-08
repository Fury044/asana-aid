import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { Sparkles, Check } from "lucide-react";
import { apiFetch } from "../../utils/apiClient";

const steps = [
  "Analyzing your profile...",
  "Identifying key focus areas...",
  "Selecting personalized poses...",
  "Creating your daily schedule...",
  "Finalizing your yoga plan...",
];

export default function PlanGeneration() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < steps.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 1000);

    const generatePlanOnBackend = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem("asanaAidUser") || "{}");
        const userId = userData.id || 'default_user';

        // Map conditions and goals for the API
        const response = await apiFetch("/plans/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: userId,
            conditions: userData.medicalConditions || userData.healthConditions || [],
            goals: userData.goals || []
          })
        });

        const result = await response.json();
        
        // Update local storage with plan result
        localStorage.setItem(
          "asanaAidUser",
          JSON.stringify({
            ...userData,
            planGenerated: true,
            currentPlanId: result.planId,
            currentSessionId: result.sessionId,
            sessions: 0,
            streak: 0,
            totalMinutes: 0,
            caloriesBurned: 0,
          })
        );
        
        // Brief delay for the animation to feel natural
        setTimeout(() => {
          navigate("/app");
        }, 1500); 
      } catch (err) {
        console.error("Backend generation failed:", err);
        // Fallback or navigate anyway
        setTimeout(() => navigate("/app"), 2000);
      }
    };

    generatePlanOnBackend();

    return () => {
      clearInterval(stepInterval);
    };
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e6f4ea] via-[#f8faf9] to-[#d4e8dc] flex flex-col items-center justify-center p-6">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full"
      >
        <div className="text-center mb-12">
          <motion.div
            animate={{
              rotate: 360,
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear",
            }}
            className="inline-block mb-6"
          >
            <div className="bg-white/90 backdrop-blur-sm rounded-full p-8 shadow-xl">
              <Sparkles className="w-16 h-16 text-[#5fa777]" />
            </div>
          </motion.div>

          <h2 className="text-3xl text-[#2d3748] mb-3">
            Creating your personalized yoga routine...
          </h2>
          <p className="text-[#718096]">
            This won't take long. We're tailoring the perfect plan for you.
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 space-y-4">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{
                opacity: index <= currentStep ? 1 : 0.3,
                x: 0,
              }}
              transition={{ delay: index * 0.2 }}
              className="flex items-center gap-4"
            >
              <div
                className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                  index < currentStep
                    ? "bg-[#5fa777]"
                    : index === currentStep
                    ? "bg-[#5fa777] animate-pulse"
                    : "bg-[#e6f4ea]"
                }`}
              >
                {index < currentStep ? (
                  <Check className="w-5 h-5 text-white" />
                ) : (
                  <div
                    className={`w-3 h-3 rounded-full ${
                      index === currentStep ? "bg-white" : "bg-[#a8d5ba]"
                    }`}
                  />
                )}
              </div>
              <span
                className={`${
                  index <= currentStep ? "text-[#2d3748]" : "text-[#a8d5ba]"
                }`}
              >
                {step}
              </span>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-8 text-center text-sm text-[#718096]"
        >
          Powered by personalized AI wellness
        </motion.div>
      </motion.div>
    </div>
  );
}
