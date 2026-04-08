import { useState } from "react";
import { useNavigate } from "react-router";
import OnboardingLayout from "./OnboardingLayout";
import { ClipboardList } from "lucide-react";

export default function OnboardingMedicalHistory() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    conditions: "",
    injuries: "",
    surgeries: "",
  });

  const handleContinue = () => {
    const existingData = JSON.parse(localStorage.getItem("asanaAidUser") || "{}");
    localStorage.setItem(
      "asanaAidUser",
      JSON.stringify({ ...existingData, medicalHistory: formData })
    );
    navigate("/onboarding/goals");
  };

  return (
    <OnboardingLayout
      step={4}
      totalSteps={6}
      title="Medical history"
      subtitle="This helps us create a safer plan for you"
      onBack={() => navigate("/onboarding/health-conditions")}
    >
      <div className="space-y-6">
        <div className="flex justify-center mb-8">
          <div className="bg-gradient-to-br from-[#5fa777] to-[#81c995] rounded-full p-6">
            <ClipboardList className="w-12 h-12 text-white" />
          </div>
        </div>

        <div>
          <label className="block text-[#2d3748] mb-2">
            Medical Conditions (optional)
          </label>
          <textarea
            value={formData.conditions}
            onChange={(e) =>
              setFormData({ ...formData, conditions: e.target.value })
            }
            placeholder="E.g., diabetes, hypertension..."
            rows={3}
            className="w-full px-4 py-3 bg-white border-2 border-[#e6f4ea] rounded-2xl focus:border-[#5fa777] focus:outline-none transition-colors resize-none"
          />
        </div>

        <div>
          <label className="block text-[#2d3748] mb-2">
            Past Injuries (optional)
          </label>
          <textarea
            value={formData.injuries}
            onChange={(e) =>
              setFormData({ ...formData, injuries: e.target.value })
            }
            placeholder="E.g., sprained ankle, torn ligament..."
            rows={3}
            className="w-full px-4 py-3 bg-white border-2 border-[#e6f4ea] rounded-2xl focus:border-[#5fa777] focus:outline-none transition-colors resize-none"
          />
        </div>

        <div>
          <label className="block text-[#2d3748] mb-2">
            Surgeries (optional)
          </label>
          <textarea
            value={formData.surgeries}
            onChange={(e) =>
              setFormData({ ...formData, surgeries: e.target.value })
            }
            placeholder="E.g., knee surgery, appendectomy..."
            rows={3}
            className="w-full px-4 py-3 bg-white border-2 border-[#e6f4ea] rounded-2xl focus:border-[#5fa777] focus:outline-none transition-colors resize-none"
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
