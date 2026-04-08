import { useState } from "react";
import { useNavigate } from "react-router";
import OnboardingLayout from "./OnboardingLayout";
import { Heart, Check } from "lucide-react";

const conditions = [
  "Back pain",
  "Neck pain",
  "Digestive issues",
  "Stress / Anxiety",
  "Flexibility issues",
  "Joint pain",
];

export default function OnboardingHealthConditions() {
  const navigate = useNavigate();
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [customCondition, setCustomCondition] = useState("");

  const toggleCondition = (condition: string) => {
    setSelectedConditions((prev) =>
      prev.includes(condition)
        ? prev.filter((c) => c !== condition)
        : [...prev, condition]
    );
  };

  const handleContinue = () => {
    const allConditions = [...selectedConditions];
    if (customCondition.trim()) {
      allConditions.push(customCondition.trim());
    }

    const existingData = JSON.parse(localStorage.getItem("asanaAidUser") || "{}");
    localStorage.setItem(
      "asanaAidUser",
      JSON.stringify({ ...existingData, healthConditions: allConditions })
    );
    navigate("/onboarding/medical-history");
  };

  return (
    <OnboardingLayout
      step={3}
      totalSteps={6}
      title="Health conditions"
      subtitle="Select any conditions you'd like to address"
      onBack={() => navigate("/onboarding/body-details")}
    >
      <div className="space-y-6">
        <div className="flex justify-center mb-8">
          <div className="bg-gradient-to-br from-[#5fa777] to-[#81c995] rounded-full p-6">
            <Heart className="w-12 h-12 text-white" />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {conditions.map((condition) => (
            <button
              key={condition}
              onClick={() => toggleCondition(condition)}
              className={`flex items-center justify-between px-4 py-4 rounded-2xl border-2 transition-all ${
                selectedConditions.includes(condition)
                  ? "bg-[#e6f4ea] border-[#5fa777]"
                  : "bg-white border-[#e6f4ea] hover:border-[#5fa777]"
              }`}
            >
              <span className="text-[#2d3748]">{condition}</span>
              {selectedConditions.includes(condition) && (
                <div className="bg-[#5fa777] rounded-full p-1">
                  <Check className="w-4 h-4 text-white" />
                </div>
              )}
            </button>
          ))}
        </div>

        <div>
          <label className="block text-[#2d3748] mb-2">Other (optional)</label>
          <input
            type="text"
            value={customCondition}
            onChange={(e) => setCustomCondition(e.target.value)}
            placeholder="Add custom condition"
            className="w-full px-4 py-3 bg-white border-2 border-[#e6f4ea] rounded-2xl focus:border-[#5fa777] focus:outline-none transition-colors"
          />
        </div>

        <button
          onClick={handleContinue}
          className="w-full py-4 rounded-2xl text-white bg-gradient-to-r from-[#5fa777] to-[#81c995] hover:shadow-lg transition-all mt-8"
        >
          Continue
        </button>
      </div>
    </OnboardingLayout>
  );
}
