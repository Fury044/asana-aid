import { useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import OnboardingLayout from "./OnboardingLayout";
import { User } from "lucide-react";

export default function OnboardingBasicInfo() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
  });

  const [error, setError] = useState("");

  const handleContinue = () => {
    const ageNum = parseInt(formData.age);
    if (ageNum < 1 || ageNum > 120) {
      setError("Please enter a valid age.");
      return;
    }

    if (formData.name && formData.age && formData.gender) {
      const existingData = JSON.parse(localStorage.getItem("asanaAidUser") || "{}");
      localStorage.setItem(
        "asanaAidUser",
        JSON.stringify({ ...existingData, ...formData })
      );
      navigate("/onboarding/body-details");
    }
  };

  const isValid = formData.name && formData.age && formData.gender;

  return (
    <OnboardingLayout
      step={1}
      totalSteps={6}
      title="Let's get to know you"
      subtitle="Tell us a bit about yourself"
    >
      <div className="space-y-6">
        <div className="flex justify-center mb-8">
          <div className="bg-gradient-to-br from-[#5fa777] to-[#81c995] rounded-full p-6">
            <User className="w-12 h-12 text-white" />
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
          <label className="block text-[#2d3748] mb-2">Your Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Enter your name"
            className="w-full px-4 py-3 bg-white border-2 border-[#e6f4ea] rounded-2xl focus:border-[#5fa777] focus:outline-none transition-colors"
          />
        </div>

        <div>
          <label className="block text-[#2d3748] mb-2">Age</label>
          <input
            type="number"
            min="1"
            max="120"
            value={formData.age}
            onChange={(e) => {
                setError("");
                setFormData({ ...formData, age: e.target.value });
            }}
            placeholder="Enter your age"
            className="w-full px-4 py-3 bg-white border-2 border-[#e6f4ea] rounded-2xl focus:border-[#5fa777] focus:outline-none transition-colors"
          />
        </div>

        <div>
          <label className="block text-[#2d3748] mb-2">Gender</label>
          <div className="grid grid-cols-3 gap-3">
            {["Male", "Female", "Other"].map((gender) => (
              <button
                key={gender}
                onClick={() => setFormData({ ...formData, gender })}
                className={`px-4 py-3 rounded-2xl border-2 transition-all ${
                  formData.gender === gender
                    ? "bg-[#5fa777] border-[#5fa777] text-white"
                    : "bg-white border-[#e6f4ea] text-[#2d3748] hover:border-[#5fa777]"
                }`}
              >
                {gender}
              </button>
            ))}
          </div>
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
