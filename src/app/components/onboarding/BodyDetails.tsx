import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import OnboardingLayout from "./OnboardingLayout";
import { Scale } from "lucide-react";

export default function OnboardingBodyDetails() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    height: "",
    weight: "",
  });
  const [error, setError] = useState("");

  const handleContinue = () => {
    const h = parseFloat(formData.height);
    const w = parseFloat(formData.weight);

    if (h < 50 || h > 250) {
        setError("Please enter a valid height.");
        return;
    }
    if (w < 20 || w > 500) {
        setError("Please enter a valid weight.");
        return;
    }

    if (formData.height && formData.weight) {
      const existingData = JSON.parse(localStorage.getItem("asanaAidUser") || "{}");
      localStorage.setItem(
        "asanaAidUser",
        JSON.stringify({ ...existingData, ...formData })
      );
      navigate("/onboarding/health-conditions");
    }
  };

  const isValid = formData.height && formData.weight;

  return (
    <OnboardingLayout
      step={2}
      totalSteps={6}
      title="Body details"
      subtitle="Help us personalize your experience"
      onBack={() => navigate("/onboarding/basic-info")}
    >
      <div className="space-y-6">
        <div className="flex justify-center mb-8">
          <div className="bg-gradient-to-br from-[#5fa777] to-[#81c995] rounded-full p-6">
            <Scale className="w-12 h-12 text-white" />
          </div>
        </div>

        {error && (
            <motion.div 
               initial={{ opacity: 0, y: -10 }}
               animate={{ opacity: 1, y: 0 }}
               className="bg-red-50 text-red-500 p-3 rounded-xl text-sm border border-red-100 italic"
            >
                {error}
            </motion.div>
        )}

        <div>
          <label className="block text-[#2d3748] mb-2">Height (cm)</label>
          <input
            type="number"
            min="50"
            max="250"
            value={formData.height}
            onChange={(e) => {
                setError("");
                setFormData({ ...formData, height: e.target.value });
            }}
            placeholder="Enter your height"
            className="w-full px-4 py-3 bg-white border-2 border-[#e6f4ea] rounded-2xl focus:border-[#5fa777] focus:outline-none transition-colors"
          />
        </div>

        <div>
          <label className="block text-[#2d3748] mb-2">Weight (kg)</label>
          <input
            type="number"
            min="20"
            max="500"
            value={formData.weight}
            onChange={(e) => {
                setError("");
                setFormData({ ...formData, weight: e.target.value });
            }}
            placeholder="Enter your weight"
            className="w-full px-4 py-3 bg-white border-2 border-[#e6f4ea] rounded-2xl focus:border-[#5fa777] focus:outline-none transition-colors"
          />
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
