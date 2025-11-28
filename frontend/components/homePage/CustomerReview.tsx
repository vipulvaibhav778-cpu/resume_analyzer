import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

const testimonials = [
    {
        name: "Akshat",
        review: "Cracked my dream job with confidence thanks to this platform!",
        rating: 5,
        avatar: "/avatars/boy1.webp",
    },
    {
        name: "Ritika",
        review: "The guidance and resources here are top-notch. Highly recommended!",
        rating: 4,
        avatar: "/avatars/girl1.jpg",
    },
    {
        name: "Kunal",
        review: "Mock tests and notes were a lifesaver during my prep.",
        rating: 5,
        avatar: "/avatars/boy2.avif",
    },
    {
        name: "Sneha",
        review: "Structured DSA approach boosted my confidence and clarity.",
        rating: 4,
        avatar: "/avatars/girl2.avif",
    },
    {
        name: "Ravi",
        review: "Mentorship and support made all the difference in my journey.",
        rating: 5,
        avatar: "/avatars/boy1.webp",
    },
];

export default function PortfolioReviewSection() {
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const scrollContainer = scrollRef.current;
        if (!scrollContainer) return;

        let scrollX = 0;
        const speed = 0.6;

        const animateScroll = () => {
            scrollX += speed;
            if (scrollX >= scrollContainer.scrollWidth / 2) scrollX = 0;
            scrollContainer.scrollLeft = scrollX;
            requestAnimationFrame(animateScroll);
        };

        requestAnimationFrame(animateScroll);
    }, []);

    return (
        <section className="relative w-full py-15 lg:py-18 bg-gray-100 overflow-hidden mt-1 mb-1">
            {/* Heading */}
            <div className="text-center mb-16">
                <h2 className="text-4xl lg:text-5xl font-bold text-gray-800">
                    <span className="font-cursive text-5xl text-green-600 block">
                        <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">
                            DevXVitals
                        </span> Testimonials
                    </span>
                    <span className="relative inline-block mt-2">
                        Our <span className="font-bold text-gray-900">Whats Customer's Say</span>
                        <motion.div
                            className="absolute bottom-0 left-0 w-full h-1"
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ duration: 1.2, ease: "easeOut" }}
                            style={{ transformOrigin: "left" }}
                        />
                    </span>
                </h2>
            </div>

            {/* Horizontal Scroll */}
            <div ref={scrollRef} className="w-full overflow-hidden py-10">
                <div className="flex space-x-10 px-6 overflow-visible">
                    {[...testimonials, ...testimonials].map((user, index) => (
                        <motion.div
                            key={index}
                            whileHover={{ scale: 1.08 }}
                            className="flex flex-col items-center min-w-[280px] max-w-[300px] bg-white rounded-2xl shadow-xl p-8 transition-all duration-300 cursor-pointer hover:z-10"
                        >
                            <img
                                src={user.avatar}
                                alt={user.name}
                                className="w-24 h-24 rounded-full object-cover shadow-md mb-4"
                            />
                            <h3 className="text-lg font-semibold text-gray-900">{user.name}</h3>
                            <p className="text-gray-600 text-center mt-2 italic">
                                "{user.review}"
                            </p>
                            <div className="flex mt-4">
                                {Array.from({ length: user.rating }).map((_, i) => (
                                    <span key={i} className="text-yellow-400 text-xl">
                                        ★
                                    </span>
                                ))}
                                {Array.from({ length: 5 - user.rating }).map((_, i) => (
                                    <span key={i} className="text-gray-300 text-xl">
                                        ★
                                    </span>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Background Accent */}
            <motion.div
                className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-green-200 via-blue-200 to-purple-200 opacity-20 blur-3xl -z-10"
                animate={{ x: [0, 50, -50, 0] }}
                transition={{ duration: 15, repeat: Infinity }}
            />
        </section>
    );
}