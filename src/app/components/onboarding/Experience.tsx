import { useState } from "react";
import { useNavigate } from "react-router";
import OnboardingLayout from "./OnboardingLayout";
import { Trophy } from "lucide-react";
import { apiFetch } from "../../../utils/apiClient";

const levels = [
  {
    level: "Beginner",
    description: "New to yoga or have practiced occasionally",
  },
  {
    level: "Intermediate",
    description: "Practice regularly, familiar with basic poses",
  },
  {
    level: "Advanced",
    description: "Experienced practitioner, comfortable with complex poses",
  },
];

export default function OnboardingExperience() {
  const navigate = useNavigate();
  const [selectedLevel, setSelectedLevel] = useState("");

  const handleContinue = async () => {
    if (selectedLevel) {
      const existingData = JSON.parse(localStorage.getItem("asanaAidUser") || "{}");
      localStorage.setItem(
        "asanaAidUser",
        JSON.stringify({ ...existingData, experience: selectedLevel })
      );

      // FINAL SYNC TO POSTGRES
      try {
          if (existingData.id) {
              await apiFetch(`/user/${existingData.id}/profile`, {
                  method: "PATCH",
                  headers: { 
                      "Content-Type": "application/json",
                      "Authorization": `Bearer ${existingData.token}`
                  },
                  body: JSON.stringify({
                      age: existingData.age,
                      weight: existingData.weight,
                      height: existingData.height,
                      gender: existingData.gender,
                      experience_level: selectedLevel
                  })
              });
              console.log("Health Profile officially stored in Railway Postgres");
          }
      } catch (err) {
          console.error("Failed to sync profile to cloud:", err);
      }

      navigate("/plan-generation");
    }
  };

  return (
    <OnboardingLayout
      step={6}
      totalSteps={6}
      title="Experience level"
      subtitle="Help us match the right intensity for you"
      onBack={() => navigate("/onboarding/goals")}
    >
      <div className="space-y-6">
        <div className="flex justify-center mb-8">
          <div className="bg-gradient-to-br from-[#5fa777] to-[#81c995] rounded-full p-6">
            <Trophy className="w-12 h-12 text-white" />
          </div>
        </div>

        <div className="space-y-4">
          {levels.map(({ level, description }) => (
            <button
              key={level}
              onClick={() => setSelectedLevel(level)}
              className={`w-full text-left px-6 py-5 rounded-2xl border-2 transition-all ${
                selectedLevel === level
                  ? "bg-[#e6f4ea] border-[#5fa777]"
                  : "bg-white border-[#e6f4ea] hover:border-[#5fa777]"
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-[#2d3748] mb-1">{level}</div>
                  <div className="text-sm text-[#718096]">{description}</div>
                </div>
                {selectedLevel === level && (
                  <div className="bg-[#5fa777] rounded-full p-1.5 flex-shrink-0 ml-3">
                    <div className="w-3 h-3 bg-white rounded-full" />
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>

        <button
          onClick={handleContinue}
          disabled={!selectedLevel}
          className={`w-full py-4 rounded-2xl text-white transition-all mt-8 ${
            selectedLevel
              ? "bg-gradient-to-r from-[#5fa777] to-[#81c995] hover:shadow-lg"
              : "bg-[#cbd5e0] cursor-not-allowed"
          }`}
        >
          Create My Plan
        </button>
      </div>
    </OnboardingLayout>
  );
}
