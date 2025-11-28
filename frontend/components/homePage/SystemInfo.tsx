import { motion } from "framer-motion";
import { useLayoutEffect, useRef } from "react";

const slides = [
  { icon: "🚀", title: "Fast Deployment", description: "Launch AI systems quickly with modular backend and scalable infrastructure." },
  { icon: "🔒", title: "Secure Architecture", description: "Built-in security layers for data protection and user privacy." },
  { icon: "🧠", title: "Intelligent Automation", description: "Leverage AI to automate workflows and enhance decision-making." },
];

export default function SystemInfo() {
  const scrollRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    let scrollY = 1; // start >0 so it moves immediately
    const speed = 0.5;

    const animateScroll = () => {
      scrollY += speed;

      if (scrollY >= container.scrollHeight / 2) {
        scrollY = 0;
      }

      container.scrollTop = scrollY;
      requestAnimationFrame(animateScroll);
    };

    requestAnimationFrame(animateScroll);
  }, []);

  return (
    <section className="relative flex flex-col lg:flex-row items-center justify-between w-full min-h-screen px-6 lg:px-12 py-20 lg:py-28 text-black overflow-hidden">
      {/* Backgrounds remain unchanged */}
      <div className="absolute inset-0 bg-white/40 backdrop-blur-xl border border-gray-200 rounded-none shadow-2xl -z-10"></div>
      <motion.div
        className="absolute inset-0 -z-20"
        animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        style={{
          backgroundImage:
            "linear-gradient(135deg, rgba(59,130,246,0.15), rgba(16,185,129,0.15), rgba(236,72,153,0.15), rgba(139,92,246,0.15))",
          backgroundSize: "400% 400%",
        }}
      />

      {/* Left Vertical Auto‑Scroll Section */}
      <div className="w-full lg:w-1/2 flex justify-center">
        <div
          ref={scrollRef}
          className="h-full max-h-[calc(100vh-8rem)] overflow-hidden flex flex-col gap-6 [&::-webkit-scrollbar]:hidden -ms-overflow-style:none scrollbar-width:none"
        >
          {[...slides, ...slides].map((slide, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.08 }}
              className="flex flex-col items-center bg-white/60 backdrop-blur-md rounded-3xl shadow-md p-6 w-full hover:shadow-2xl transition-all duration-300"
            >
              <div className="text-5xl drop-shadow-lg">{slide.icon}</div>
              <h3 className="text-lg font-semibold text-center mt-2">
                {slide.title}
              </h3>
              <p className="text-gray-700 text-center text-sm mt-1">
                {slide.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Right Static Info Section */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full lg:w-1/2 flex flex-col space-y-6 mt-10 lg:mt-0"
      >
        <h2 className="text-3xl lg:text-4xl font-bold leading-snug bg-gradient-to-r from-green-600 via-emerald-500 to-teal-400 bg-clip-text text-transparent">
          Empowering Innovation with Scalable AI Systems
        </h2>

        <p className="text-gray-700 leading-relaxed">
          At <span className="text-green-600 font-semibold">DevVitals</span>, we
          specialize in crafting intelligent, scalable, and secure AI-driven
          platforms.
        </p>

        <p className="text-gray-700 leading-relaxed">
          From data-driven insights to enterprise-grade web ecosystems, we
          design technology that grows with your business.
        </p>

        {/* Highlight Banner */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          animate={{ y: [0, -5, 0] }}
          transition={{ delay: 0.2, duration: 2, repeat: Infinity }}
          className="mt-10 bg-green-100/40 border border-green-300 backdrop-blur-md rounded-2xl p-6 shadow-lg hover:shadow-green-300/40 transition-all"
        >
          <p className="text-black font-medium text-center">
            🌟 Building systems that evolve with your vision.
          </p>
        </motion.div>

        {/* Decorative Divider */}
        <div className="w-full h-1 bg-gradient-to-r from-green-400 via-teal-400 to-blue-400 rounded-full my-6" />

        {/* Interactive Feature Highlights */}
        <div className="grid grid-cols-2 gap-6">
          {[
            { icon: "⚡", text: "Lightning Fast" },
            { icon: "🔐", text: "Secure by Design" },
            { icon: "📈", text: "Scalable Growth" },
            { icon: "🤝", text: "Trusted Support" },
          ].map((item, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05, rotate: 1 }}
              className="flex flex-col items-center justify-center bg-white/50 backdrop-blur-sm rounded-xl shadow-md p-4 cursor-pointer hover:shadow-lg transition-all"
            >
              <div className="text-2xl">{item.icon}</div>
              <p className="text-sm font-medium text-gray-700 mt-2">{item.text}</p>
            </motion.div>
          ))}
        </div>

        {/* Animated Stats Counters */}
        <div className="flex justify-around mt-8">
          {[
            { value: "10K+", label: "Users" },
            { value: "500+", label: "Projects" },
            { value: "99.9%", label: "Uptime" },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.2 }}
              className="flex flex-col items-center"
            >
              <p className="text-2xl font-bold text-green-600">{stat.value}</p>
              <p className="text-sm text-gray-600">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}