import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

const FrequentlyAsked = () => {
  const faqs = [
    {
      question: "What does DevVitals specialize in?",
      answer:
        "DevVitals is a forward-thinking software company that builds AI-driven digital products and enterprise solutions. We specialize in web and mobile app development, AI integration, and data-driven business automation.",
    },
    {
      question: "Do you offer custom software development?",
      answer:
        "Absolutely. Our team works closely with clients to understand their vision and craft tailored software solutions — from scalable SaaS platforms to intelligent business dashboards — ensuring innovation meets functionality.",
    },
    {
      question: "How does DevVitals ensure product quality?",
      answer:
        "We follow a multi-layered quality assurance process involving code reviews, automated testing, and performance benchmarking. Every product undergoes continuous optimization to meet enterprise-grade standards.",
    },
    {
      question: "Is my data and project information secure?",
      answer:
        "Yes. We prioritize data protection and confidentiality. Our systems use end-to-end encryption, cloud-based security frameworks, and NDA-backed workflows to safeguard every client project.",
    },
    {
      question: "Does DevVitals collaborate with startups or enterprises?",
      answer:
        "Both. We partner with innovative startups to bring new ideas to life and assist enterprises in modernizing their infrastructure through automation, analytics, and AI-enhanced systems.",
    },
    {
      question: "What are DevVitals’ future goals?",
      answer:
        "We aim to redefine the intersection of design and intelligence — developing smart tools, adaptive platforms, and sustainable digital ecosystems that shape the future of technology.",
    },
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="relative py-20 px-6 lg:px-16 bg-gray-50 overflow-hidden">
      {/* Animated Background Accent */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-purple-100 via-pink-100 to-blue-100 opacity-40 blur-3xl -z-10"
        animate={{ x: [0, 40, -40, 0], y: [0, 20, -20, 0] }}
        transition={{ duration: 20, repeat: Infinity }}
      />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="relative max-w-5xl mx-auto text-gray-800"
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <h2 className="text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Learn more about{" "}
            <span className="text-green-600 font-semibold">DevVitals</span> — our vision, values, and
            commitment to building innovative, secure, and human-centered technology.
          </p>
        </motion.div>

        {/* FAQ Cards */}
        <div className="space-y-5">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
              className="bg-white border border-gray-200 rounded-2xl p-5 md:p-6 transition-all duration-300 hover:border-purple-400 hover:shadow-lg hover:scale-[1.02]"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="flex justify-between items-center w-full text-left"
              >
                <span className="font-semibold text-lg">{faq.question}</span>
                <motion.span
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-purple-500"
                >
                  ▼
                </motion.span>
              </button>

              <AnimatePresence initial={false}>
                {openIndex === index && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto", marginTop: 12 }}
                    exit={{ opacity: 0, height: 0, marginTop: 0 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                  >
                    <p className="text-gray-600">{faq.answer}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Closing Tagline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-14 text-center text-gray-600"
        >
          <p>
            Still have questions?{" "}
            <span className="text-green-600 font-semibold hover:underline cursor-pointer">
              <Link to="/contact">Contact our team</Link>
            </span>{" "}
            — we’d love to help you shape your next digital innovation.
          </p>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default FrequentlyAsked;