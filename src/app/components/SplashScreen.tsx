import { useEffect } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { Heart, Sparkles } from "lucide-react";

export default function SplashScreen() {
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem("asanaAidUser");
    const timer = setTimeout(() => {
      if (userData) {
        navigate("/app");
      } else {
        navigate("/signup");
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e6f4ea] via-[#f8faf9] to-[#d4e8dc] flex flex-col items-center justify-center p-6">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="text-center"
      >
        <div className="relative mb-8">
          <motion.div
            initial={{ rotate: -10 }}
            animate={{ rotate: 10 }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
            className="inline-block"
          >
            <div className="bg-white/80 backdrop-blur-sm rounded-full p-8 shadow-xl">
              <Heart className="w-20 h-20 text-[#5fa777]" fill="#5fa777" />
            </div>
          </motion.div>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="absolute -top-2 -right-2"
          >
            <Sparkles className="w-8 h-8 text-[#81c995]" fill="#81c995" />
          </motion.div>
        </div>

        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-5xl text-[#2d3748] mb-3 tracking-tight"
        >
          Asana Aid
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="text-lg text-[#718096]"
        >
          Your Personalized Yoga Companion
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.5 }}
          className="mt-12"
        >
          <div className="flex gap-2 justify-center">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatDelay: 0.2,
              }}
              className="w-2 h-2 rounded-full bg-[#5fa777]"
            />
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: 0.2,
                repeatDelay: 0.2,
              }}
              className="w-2 h-2 rounded-full bg-[#81c995]"
            />
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: 0.4,
                repeatDelay: 0.2,
              }}
              className="w-2 h-2 rounded-full bg-[#a8d5ba]"
            />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
