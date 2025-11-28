import { useUser } from '@clerk/clerk-react';
import DocumentTable from '../components/documentPage/DocumentTable.tsx';
import UploadFile from '../components/documentPage/UploadFile.tsx';
import PromoSection from '../components/documentPage/PromoSection.tsx';
import { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

type documentType = {
    document_name: string,
    status: number,
    ats_score: number
}

const DocumentsPage = () => {
    const { user } = useUser();
    const [documents, setdocuments] = useState<documentType[]>([]);
    let email: string | any = "";

    const getDocuments = async () => {
        try {
            email = user?.primaryEmailAddress?.emailAddress;
            const response = await fetch("http://localhost:8000/api/getDocuments", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const result = await response.json();
            const filteredDocs = (result.all_documents ?? []).map((doc: any) => ({
                document_name: doc.document_name,
                status: doc.status,
                ats_score: doc.ats_score,
            }));
            setdocuments(filteredDocs);
        } catch (error: any) {
            toast.error(error.message);
        }
    }

    useEffect(() => {
        document.title = "Documents - Resume Analyzer";
        getDocuments();
    }, [user]);

    // Calculate average ATS score
    const avgATS =
        documents.length > 0
            ? Math.round(
                documents.reduce((acc, doc) => acc + (doc.ats_score || 0), 0) /
                documents.length
            )
            : 0;

    return (
        <div className="relative min-h-screen w-full max-w-screen overflow-x-hidden overflow-y-hidden px-6 md:px-16 py-12 bg-white text-gray-900">
            <Toaster position="top-center" reverseOrder={true} />

            {/* Page Heading */}
            <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-3xl md:text-4xl font-extrabold mb-10 text-center text-gray-800 tracking-tight"
            >
                Your Document Summary
            </motion.h1>

            {/* Average ATS Score Circle */}
            {documents.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                    className="flex justify-center mb-12"
                >
                    <div className="relative w-44 h-44">
                        <motion.svg
                            initial={{ rotate: -90 }}
                            className="w-full h-full"
                            viewBox="0 0 100 100"
                        >
                            <circle
                                cx="50"
                                cy="50"
                                r="45"
                                stroke="#e5e7eb"
                                strokeWidth="8"
                                fill="none"
                            />
                            <motion.circle
                                cx="50"
                                cy="50"
                                r="45"
                                stroke="url(#gradient)"
                                strokeWidth="8"
                                fill="none"
                                strokeDasharray="283"
                                strokeDashoffset={283 - (283 * avgATS) / 100}
                                initial={{ strokeDashoffset: 283 }}
                                animate={{ strokeDashoffset: 283 - (283 * avgATS) / 100 }}
                                transition={{ duration: 1.2, ease: "easeOut" }}
                            />
                            <defs>
                                <linearGradient id="gradient" x1="0" y1="0" x2="1" y2="1">
                                    <stop offset="0%" stopColor="#ec4899" />
                                    <stop offset="100%" stopColor="#6366f1" />
                                </linearGradient>
                            </defs>
                        </motion.svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-lg font-semibold text-gray-700">
                                Avg ATS Score
                            </span>
                            <span className="text-2xl font-bold text-gray-900">
                                {avgATS}%
                            </span>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Documents Table */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mb-12 bg-white rounded-xl shadow-lg hover:shadow-xl p-6 transition-all"
            >
                <DocumentTable documents={documents as any} />
            </motion.div>

            {/* Upload Button Section */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="mb-12 flex justify-center bg-white rounded-xl shadow-lg hover:shadow-xl p-6 transition-all"
            >
                <UploadFile />
            </motion.div>

            {/* Promotional Section (Now Used) */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mb-16"
            >
                <PromoSection />
            </motion.div>

            {/* Promotional Section (Enhanced) */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mb-16 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white rounded-xl shadow-lg p-10 text-center"
            >
                <h2 className="text-2xl font-bold mb-4">Boost Your Resume Today 🚀</h2>
                <p className="mb-6 text-gray-100">
                    Upload your documents and get instant ATS scoring with actionable
                    insights to improve your chances.
                </p>
                <Link
                    to="/Resume_checker"
                    className="inline-block px-6 py-3 rounded-full bg-white text-pink-600 font-semibold shadow-md hover:bg-gray-100 transition"
                >
                    Upload New Document
                </Link>
            </motion.div>

            {/* Testimonials Section */}
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="mt-10 max-w-6xl mx-auto text-center"
            >
                <h2 className="text-2xl md:text-3xl font-bold mb-8 text-gray-800 tracking-tight">
                    What Our Users Say
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
                    {[
                        {
                            quote:
                                "The resume analyzer gave me actionable feedback instantly. It boosted my confidence!",
                            name: "Aditi Sharma",
                            role: "Job Seeker",
                            avatar: "👩‍💼",
                        },
                        {
                            quote:
                                "Uploading documents was seamless. The ATS scoring helped me tailor my resume perfectly.",
                            name: "Rahul Verma",
                            role: "Software Engineer",
                            avatar: "👨‍💻",
                        },
                        {
                            quote:
                                "The dashboard insights are fantastic. It saved me hours of manual analysis.",
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
                            className="bg-gray-50 rounded-xl shadow-md hover:shadow-lg p-6 flex flex-col items-center text-gray-700 transition-all duration-300 max-w-sm"
                        >
                            <div className="text-4xl mb-4">{testimonial.avatar}</div>
                            <p className="italic mb-4 text-sm md:text-base text-gray-700">
                                “{testimonial.quote}”
                            </p>
                            <div className="font-semibold text-gray-900">
                                {testimonial.name}
                            </div>
                            <div className="text-xs text-gray-500">{testimonial.role}</div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </div>
    );
};

export default DocumentsPage;