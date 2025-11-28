import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const BannerSection = () => {
  const bannerpoint = [
    "🌱 Limited time: 15% discount on premium resume analysis!",
    "💼 Unlock recruiter-ready insights with AI precision.",
    "📊 Optimize your ATS score and stand out instantly.",
    "✨ Upgrade today and access exclusive resume templates.",
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % bannerpoint.length);
    }, 4000); // change every 4 seconds
    return () => clearInterval(interval);
  }, [bannerpoint.length]);

  return (
    <div
      className="w-full bg-gradient-to-r from-green-200 via-emerald-300 to-green-400
                 text-gray-900 py-1.5 px-6 text-center font-semibold text-sm md:text-base
                 overflow-hidden rounded-xl shadow-md relative"
    >
      {/* Decorative Glow */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent blur-xl"
        animate={{ opacity: [0.2, 0.4, 0.2] }}
        transition={{ repeat: Infinity, duration: 6 }}
      />

      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="inline-block text-gray-900"
        >
          {bannerpoint[currentIndex]}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default BannerSection;