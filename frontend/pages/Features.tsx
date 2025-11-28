import { useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const products = [
  { id: 1, name: "AI Resume Analyzer", description: "An advanced AI-powered tool that analyzes resumes to provide insights and improvement suggestions.", status: "Launched", image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=900&q=80", path: "/Resume_checker" },
  { id: 2, name: "Smart Analytics Dashboard", description: "An intelligent analytics platform for monitoring user data, engagement, and growth metrics.", status: "In Development", image: "/dashboard.jpg", path: "/features/analytics-dashboard" },
  { id: 3, name: "AI-Powered Chatbot", description: "Our upcoming product to provide automated, context-aware support and lead generation.", status: "Coming Soon", image: "/chatbot.jpg", path: "/features/ai-chatbot" },
  { id: 4, name: "Smart Payment System", description: "A seamless, secure, and fast digital payment solution integrated with multiple APIs.", status: "Planned", image: "/paysystem.avif", path: "/features/payment-system" },
];

const Features = () => {
  useEffect(() => {
    document.title = "Our Products - MyApp";
  }, []);

  return (
    <div className="min-h-screen bg-transparent text-gray-900 px-6 pt-16 pb-20 flex flex-col items-center">
      {/* Page Header */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl md:text-5xl font-extrabold mb-12 text-center bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent"
      >
        Our Products & Upcoming Features
      </motion.h1>

      {/* Product Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 w-full max-w-7xl">
        {products.map((product, index) => (
          <motion.div
            key={product.id}
            whileHover={{ scale: 1.07, rotate: 1 }}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-2xl border border-gray-200 shadow-md hover:shadow-2xl overflow-hidden flex flex-col transition-all duration-300"
          >
            <Link to={product.path} className="flex flex-col h-full">
              <motion.img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover"
                whileHover={{ scale: 1.12 }}
                transition={{ duration: 0.5 }}
              />
              <div className="p-6 flex flex-col justify-between flex-grow">
                <div>
                  <h2 className="text-xl font-semibold mb-2 hover:text-pink-500 transition-colors">
                    {product.name}
                  </h2>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {product.description}
                  </p>
                </div>
                <span
                  className={`inline-block px-3 py-1 text-sm font-medium rounded-full self-start ${product.status === "Launched"
                      ? "bg-green-100 text-green-700"
                      : product.status === "In Development"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-pink-100 text-pink-700"
                    }`}
                >
                  {product.status}
                </span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Extra Section: Testimonials */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="mt-20 max-w-6xl w-full text-center"
      >
        <h2 className="text-2xl md:text-3xl font-bold mb-10 bg-gradient-to-r from-indigo-500 to-pink-500 bg-clip-text text-transparent">
          What Our Users Say
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              quote:
                "These AI-powered tools have transformed the way we work. The dashboard insights and resume analyzer saved us countless hours!",
              name: "Aditi Sharma",
              role: "HR Manager",
              avatar: "👩‍💼",
            },
            {
              quote:
                "The chatbot integration was seamless and helped us automate customer support. Truly a game-changer!",
              name: "Rahul Verma",
              role: "Startup Founder",
              avatar: "👨‍💻",
            },
            {
              quote:
                "Smart Analytics Dashboard gave us real-time insights that improved our decision-making drastically.",
              name: "Sneha Patel",
              role: "Data Analyst",
              avatar: "📊",
            },
          ].map((testimonial, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.2 }}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl p-6 flex flex-col items-center text-gray-700 transition-all duration-300"
            >
              <div className="text-4xl mb-4">{testimonial.avatar}</div>
              <p className="italic mb-4 text-sm md:text-base">“{testimonial.quote}”</p>
              <div className="font-semibold text-pink-600">{testimonial.name}</div>
              <div className="text-xs text-gray-500">{testimonial.role}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Extra Section: Call to Action */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="mt-16 bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 text-white rounded-2xl shadow-lg p-10 max-w-3xl text-center"
      >
        <h3 className="text-2xl font-bold mb-4">Ready to Experience the Future?</h3>
        <p className="mb-6">Explore our launched products or stay tuned for upcoming features that will revolutionize your workflow.</p>
        <Link
          to="/Contact"
          className="inline-block px-6 py-3 rounded-full bg-white text-pink-600 font-semibold shadow-md hover:bg-gray-100 transition"
        >
          Contact Us
        </Link>
      </motion.div>
    </div>
  );
};

export default Features;