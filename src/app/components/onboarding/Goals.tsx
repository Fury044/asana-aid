import { useState } from "react";
import { useNavigate } from "react-router";
import OnboardingLayout from "./OnboardingLayout";
import { Target, Check } from "lucide-react";

const goals = [
  "Improve flexibility",
  "Reduce pain",
  "Weight loss",
  "Mental wellness",
  "General fitness",
  "Better posture",
];

export default function OnboardingGoals() {
  const navigate = useNavigate();
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);

  const toggleGoal = (goal: string) => {
    setSelectedGoals((prev) =>
      prev.includes(goal) ? prev.filter((g) => g !== goal) : [...prev, goal]
    );
  };

  const handleContinue = () => {
    if (selectedGoals.length > 0) {
      const existingData = JSON.parse(localStorage.getItem("asanaAidUser") || "{}");
      localStorage.setItem(
        "asanaAidUser",
        JSON.stringify({ ...existingData, goals: selectedGoals })
      );
      navigate("/onboarding/experience");
    }
  };

  const isValid = selectedGoals.length > 0;

  return (
    <OnboardingLayout
      step={5}
      totalSteps={6}
      title="Your goals"
      subtitle="What would you like to achieve?"
      onBack={() => navigate("/onboarding/medical-history")}
    >
      <div className="space-y-6">
        <div className="flex justify-center mb-8">
          <div className="bg-gradient-to-br from-[#5fa777] to-[#81c995] rounded-full p-6">
            <Target className="w-12 h-12 text-white" />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {goals.map((goal) => (
            <button
              key={goal}
              onClick={() => toggleGoal(goal)}
              className={`flex items-center justify-between px-4 py-4 rounded-2xl border-2 transition-all ${
                selectedGoals.includes(goal)
                  ? "bg-[#e6f4ea] border-[#5fa777]"
                  : "bg-white border-[#e6f4ea] hover:border-[#5fa777]"
              }`}
            >
              <span className="text-[#2d3748]">{goal}</span>
              {selectedGoals.includes(goal) && (
                <div className="bg-[#5fa777] rounded-full p-1">
                  <Check className="w-4 h-4 text-white" />
                </div>
              )}
            </button>
          ))}
        </div>

        <button
          onClick={handleContinue}
          disabled={!isValid}
          className={`w-full py-4 rounded-2xl text-white transition-all mt-8 ${
            isValid
              ? "bg-gradient-to-r from-[#5fa777] to-[#81c995] hover:shadow-lg"
              : "bg-[#cbd5e0] cursor-not-allowed"
          }`}
        >
          Continue
        </button>
      </div>
    </OnboardingLayout>
  );
}
