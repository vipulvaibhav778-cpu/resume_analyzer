import { useRef } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const features = [
  {
    icon: "🧠",
    title: "AI Resume Analyzer",
    description:
      "Leverages deep learning to evaluate resumes for structure, tone, and job-fit accuracy.",
    points: ["ATS Scoring", "Grammar & Content Feedback", "Skill Matching"],
    path: "/Resume_checker",
    image: "/homeProduct.png",
  },
  {
    icon: "📊",
    title: "Smart Dashboard Insights",
    description:
      "Dynamic dashboards that visualize complex business data in seconds using AI analytics.",
    points: ["Real-time Reports", "Custom Visualization", "Predictive Metrics"],
    path: "/dashboard-ai",
    image: "/dashboard.jpg",
  },
  {
    icon: "🎨",
    title: "DesignGen Studio",
    description:
      "Create stunning UI/UX layouts instantly using AI-assisted design suggestions.",
    points: ["Auto Color Palette", "Layout Recommendations", "Typography Generator"],
    path: "/designgen",
    image: "/homeImage.jpg",
  },

  {
    icon: "🤖",
    title: "ChatOps Automation",
    description:
      "Streamline workflows and automate repetitive tasks with conversational AI bots.",
    points: ["Slack & Discord Integration", "Custom Workflows", "Multi-language Support"],
    path: "/chatops",
    image: "/chatbot.jpg",
  },

  {
    icon: "🔒",
    title: "AI Security Guard",
    description:
      "Protect digital products with AI-driven anomaly detection and real-time alerts.",
    points: ["Threat Prediction", "Real-time Monitoring", "Auto Recovery"],
    path: "/ai-security",
    image: "/ai.png",
  },

];

export default function ScrollableFeatures() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    const container = scrollRef.current;
    if (!container) return;
    const scrollAmount = 340;
    container.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <section className="relative w-full py-20 px-6 lg:px-16 bg-gray-50 overflow-hidden ">
      {/* Animated Gradient Background */}
      <motion.div
        className="absolute inset-0 -z-10"
        animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        style={{
          backgroundImage:
            "linear-gradient(135deg, rgba(255,235,59,0.15), rgba(76,175,80,0.15), rgba(33,150,243,0.15), rgba(156,39,176,0.15))",
          backgroundSize: "400% 400%",
        }}
      />

      {/* Decorative floating shapes */}
      <motion.div
        className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-20 blur-3xl -z-10"
        animate={{ y: [0, 30, -30, 0] }}
        transition={{ duration: 10, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-10 right-10 w-40 h-40 bg-gradient-to-r from-green-400 to-blue-400 rounded-full opacity-20 blur-3xl -z-10"
        animate={{ x: [0, 40, -40, 0] }}
        transition={{ duration: 12, repeat: Infinity }}
      />

      {/* Animated line accents */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 320"
        className="absolute top-0 left-0 w-full h-32 opacity-30 -z-10"
        preserveAspectRatio="none"
      >
        <path
          d="M0,160 C480,300 960,20 1440,180"
          fill="none"
          stroke="url(#lineGradient)"
          strokeWidth="2"
          strokeDasharray="6 6"
        >
          <animate
            attributeName="stroke-dashoffset"
            from="0"
            to="1000"
            dur="12s"
            repeatCount="indefinite"
          />
        </path>
        <defs>
          <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#8b5cf6" />
            <stop offset="50%" stopColor="#ec4899" />
            <stop offset="100%" stopColor="#22d3ee" />
          </linearGradient>
        </defs>
      </svg>

      {/* Header */}
      <div className="text-center mb-12 relative z-10">
        <h2 className="text-3xl lg:text-4xl font-bold text-gray-800">
          🚀 Our AI-Powered Products
        </h2>
        <p className="text-gray-600 mt-2">
          Explore tools built for speed, scale, and smart decisions.
        </p>
      </div>

      {/* Arrow Controls */}
      <div className="absolute top-1/2 left-4 transform -translate-y-1/2 z-10">
        <button
          onClick={() => scroll("left")}
          className="bg-white shadow-md rounded-full p-2 hover:bg-gray-100 transition"
        >
          ←
        </button>
      </div>
      <div className="absolute top-1/2 right-4 transform -translate-y-1/2 z-10">
        <button
          onClick={() => scroll("right")}
          className="bg-white shadow-md rounded-full p-2 hover:bg-gray-100 transition"
        >
          →
        </button>
      </div>

      {/* Scrollable Cards */}
      <div
        ref={scrollRef}
        className="flex space-x-12 overflow-x-auto scroll-smooth px-2 py-6 relative z-10 [&::-webkit-scrollbar]:hidden -ms-overflow-style:none scrollbar-width:none"
      >
        {features.map((feature, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.05, y: -5 }}
            className="min-w-[300px] max-w-[320px] bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer flex flex-col"
          >
            {/* Image Banner */}
            <div className="h-40 w-full overflow-hidden">
              <motion.img
                src={feature.image}
                alt={feature.title}
                className="w-full h-full object-cover rounded-t-2xl group-hover:scale-110 transition-transform duration-700"
              />
            </div>

            {/* Card Content */}
            <div className="p-6 flex flex-col flex-grow justify-between">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-12 w-12 bg-gradient-to-r from-yellow-400/40 to-green-400/40 flex items-center justify-center rounded-full text-2xl">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800">
                    {feature.title}
                  </h3>
                </div>

                <p className="text-gray-600 mb-3">{feature.description}</p>

                <ul className="space-y-1 text-sm text-gray-500 mb-5">
                  {feature.points.map((point, i) => (
                    <li key={i}>• {point}</li>
                  ))}
                </ul>
              </div>

              <Link
                to={feature.path}
                className="inline-block bg-gradient-to-r from-purple-400 to-blue-400 px-4 py-2 rounded-lg text-sm font-semibold text-white hover:from-yellow-300 hover:to-green-300 transition-all duration-300 shadow-md"
              >
                Explore →
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}