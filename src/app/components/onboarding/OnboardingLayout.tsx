import { motion } from "motion/react";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router";

interface OnboardingLayoutProps {
  step: number;
  totalSteps: number;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  onBack?: () => void;
}

export default function OnboardingLayout({
  step,
  totalSteps,
  title,
  subtitle,
  children,
  onBack,
}: OnboardingLayoutProps) {
  const navigate = useNavigate();
  const progress = (step / totalSteps) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8faf9] to-[#e6f4ea] flex flex-col">
      <div className="sticky top-0 bg-white/80 backdrop-blur-md z-10 border-b border-[#5fa777]/10">
        <div className="max-w-md mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            {onBack ? (
              <button
                onClick={onBack}
                className="p-2 rounded-full hover:bg-[#e6f4ea] transition-colors"
              >
                <ChevronLeft className="w-6 h-6 text-[#5fa777]" />
              </button>
            ) : (
              <div className="w-10" />
            )}
            <span className="text-sm text-[#718096]">
              {step} of {totalSteps}
            </span>
          </div>
          <div className="w-full h-1.5 bg-[#e6f4ea] rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-[#5fa777] to-[#81c995] rounded-full"
            />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-md mx-auto px-6 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl text-[#2d3748] mb-2">{title}</h2>
            {subtitle && (
              <p className="text-[#718096] mb-8">{subtitle}</p>
            )}
            {children}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
