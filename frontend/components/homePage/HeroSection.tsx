import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import toast from "react-hot-toast";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const HeroSection = () => {
  const { isSignedIn } = useUser();
  const navigate = useNavigate();

  const handleExploreProducts = () => {
    if (isSignedIn) navigate("/features");
    else {
      toast("Please Sign In to explore our products", {
        icon: "🚀",
      });
    }
  };


  const slides = [
    "/chatbot.jpg",
    "/dashboard.jpg",
    "/paysystem.avif",
    "/vision.png"
  ];

  const AUTOPLAY_DELAY = 3000; // ms
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<any>(null);

  useEffect(() => {
    if (isPaused) return;
    intervalRef.current = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, AUTOPLAY_DELAY);

    return () => clearInterval(intervalRef.current);
  }, [isPaused]);

  function goTo(i: number) {
    setIndex(i);
  }

  // --- FULL HERO SLIDESHOW ENABLED (with autoplay + dots navigation) ---
  return (
    <section
      className="relative w-full h-[68vh] md:h-[78vh] lg:h-[82vh] max-w-full mx-auto overflow-hidden rounded-2xl"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Slides (background images) */}
      <AnimatePresence initial={true} mode="wait">
        {slides.map((src, i) =>
          i === index ? (
            <motion.div
              key={src}
              className="absolute inset-0 w-full h-full bg-center bg-cover"
              style={{ backgroundImage: `url('${src}')` }}
              initial={{ opacity: 0, scale: 1.02 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.9, ease: "easeOut" }}
            >
              {/* subtle overlay to improve text/button contrast */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
            </motion.div>
          ) : null
        )}
      </AnimatePresence>


      {/* Explore Button (bottom-center above dots) */}
      <div className="absolute left-1/2 transform -translate-x-1/2 bottom-24 sm:bottom-28 z-30">
        <motion.button
          onClick={handleExploreProducts}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          className="px-6 py-3 rounded-full bg-gradient-to-r from-yellow-400 to-green-400 text-zinc-900 font-semibold shadow-2xl backdrop-blur-sm border border-white/10"
        >
          Explore Now!
        </motion.button>
      </div>


      {/* Pagination dots */}
      <div className="absolute left-1/2 transform -translate-x-1/2 bottom-8 z-30 flex items-center gap-3">
        {slides.map((_, i) => (
          <button
            key={i}
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => goTo(i)}
            className={`w-10 h-3 rounded-full transition-all duration-300 focus:outline-none ${i === index ? "bg-white shadow-lg w-14" : "bg-white/30"
              }`}
          />
        ))}
      </div>


      {/* Decorative floating CTA (bottom-right) - optional small helper */}
      <div className="absolute right-6 bottom-6 z-20 hidden md:block">
        <div className="w-12 h-12 rounded-full bg-black/50 flex items-center justify-center shadow-lg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6 text-white/80"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h4l3 8 4-16 3 8h4" />
          </svg>
        </div>
      </div>


      {/* Accessibility: hidden offscreen headings for screen readers */}
      <h2 className="sr-only">DevVitals Featured slides</h2>
    </section>
  );

};

export default HeroSection;
