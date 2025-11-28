import { useUser } from '@clerk/clerk-react';
import { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { motion } from "framer-motion";
import { useNavigate } from 'react-router-dom';
import BannerSection from '../../components/Features/resume_analyzer/BannerTop.tsx';

type resultStruct = {
  email: string,
  document_name: string,
  status: string,
  comments: string,
  ratings: object,
  ats_score: number,
  suggestions: string
};

const Resume_checker = () => {
  const { user, isSignedIn } = useUser();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [result, setResult] = useState<resultStruct>();
  const [userDescription, setUserDescription] = useState("")
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  let email: string | any = "";
  let fullName: string | any = "";
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Resume Checker - Resume Analyzer";
    email = user?.primaryEmailAddress?.emailAddress;
  }, [user]);

  const handleFileChange = (e: any) => {
    const file = e.target.files[0];
    if (file && (file.type === "application/pdf" || file.name.endsWith(".docx"))) {
      setSelectedFile(file);
    } else {
      toast.error("Please upload only .pdf or .docx files");
      e.target.value = "";
    }
  };

  const handleUpload = async () => {

    if (!isSignedIn) {
      toast.error("Please login to proceed analysis your resume.");
      return;
    }

    if (!selectedFile) {
      toast('Please Attach the file before proceeding further', {
        icon: '📁',
      });
      return;
    }

    if (!userDescription) {
      toast('Please Describe For Whcih Purpose You Want this Resume to be Analyzed', {
        icon: '🤷‍♂️',
      });
      return;
    }

    // Preparing the Form Data
    email = user?.primaryEmailAddress?.emailAddress; // For secondary Safety
    fullName = user?.fullName;
    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('email', email);
    formData.append('fullName', fullName);
    formData.append('document_desc', userDescription);

    try {
      setIsLoading(true);
      setProgress(0);

      // Simulate Progress by 10% increments every 300ms
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(interval);
            return prev;
          }
          return prev + 10; // increment by 10%
        });
      }, 300);

      const response = await fetch("http://localhost:8000/api/fileHandling", {
        method: 'POST',
        body: formData
      });

      const result = await response.json();
      if (result.success) {
        toast.success(result.message)
        const lastestDocument = await fetch("http://localhost:8000/api/getRecentDetail", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email }) // Replace with dynamic email if needed
        });

        const latestDocumentResult = await lastestDocument.json();
        setResult(latestDocumentResult.document)
      }
      else
        toast.error(result.message)
    } catch (error) {
      toast.error('Error while AI API Request')
    } finally {
      setIsLoading(false);
      setProgress(100);
    }
  };

  return (
    <div className="bg-white min-h-screen w-full flex flex-col items-center justify-center">
      <Toaster position="top-center" reverseOrder={true} />
      <BannerSection />

      {/* Main Content Section */}
      <div className="overflow-x-hidden min-h-screen flex justify-center items-center text-gray-900 pt-2 px-6 md:px-12 relative z-10">

        <div className="flex flex-col md:flex-row justify-center items-center gap-12 w-full max-w-6xl">

          {/* LEFT: Upload Section */}
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full md:w-1/2 flex flex-col justify-center items-start gap-8
    bg-white/40 backdrop-blur-xl p-8 rounded-3xl border border-gray-200
    shadow-[0_10px_40px_rgba(0,0,0,0.06)] transition-all hover:shadow-[0_12px_50px_rgba(0,0,0,0.08)]"
          >
            {/* Welcome Heading */}
            <div className="w-full flex items-center justify-between">
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">
                Welcome {user?.fullName || "Guest"} 👋
              </h2>
              <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-indigo-500 rounded-full flex items-center justify-center text-white shadow-md">
                📄
              </div>
            </div>

            {/* Intro Text */}
            <p className="text-gray-600 text-lg leading-relaxed">
              “Your resume tells your story — let’s refine it to perfection.
              Upload your document & watch the magic happen!”
            </p>

            {/* Feature Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full mt-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl flex items-center justify-center shadow">
                  ✨
                </div>
                <span className="text-sm text-gray-700 font-medium">AI-Powered Suggestions</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl flex items-center justify-center shadow">
                  📊
                </div>
                <span className="text-sm text-gray-700 font-medium">Keyword Optimization</span>
              </div>
            </div>

            {/* Description Box */}
            <div className="w-full flex flex-col gap-2 mt-4">
              <label className="text-gray-700 text-sm font-semibold">
                Add a brief career objective or highlight:
              </label>
              <textarea
                value={userDescription}
                onChange={(e) => setUserDescription(e.target.value)}
                rows={4}
                placeholder="E.g. Passionate backend developer seeking impactful roles..."
                className="w-full text-sm text-gray-800 bg-white/70 border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none transition"
              />
            </div>

            {/* Upload Section */}
            <div className="w-full flex flex-col items-center gap-4 mt-2">
              <input
                type="file"
                accept=".pdf,.docx"
                onChange={handleFileChange}
                className="w-full text-sm text-gray-800 bg-white border border-gray-300 rounded-lg cursor-pointer
        focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0
        file:text-sm file:font-semibold file:bg-gradient-to-r file:from-pink-500 file:to-indigo-500
        file:text-white hover:file:opacity-90 transition-all"
              />

              <motion.button
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: selectedFile ? 1.05 : 1 }}
                onClick={handleUpload}
                disabled={!selectedFile}
                className={`${selectedFile
                  ? "bg-gradient-to-r from-pink-500 to-indigo-500 hover:opacity-90"
                  : "bg-gray-400 cursor-not-allowed"
                  } text-white font-semibold px-6 py-3 rounded-lg transition-all shadow-md`}
              >
                Upload & Analyze
              </motion.button>

              {selectedFile && (
                <p className="text-sm text-gray-700">
                  Selected: <span className="font-semibold">{selectedFile.name}</span>
                </p>
              )}
            </div>

            {/* Progress Indicator */}
            <div className="w-full mt-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-600">Resume Readiness</span>
                <span className="text-sm font-semibold text-pink-600">{progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-pink-500 to-indigo-500 rounded-full"
                />
              </div>
            </div>

          </motion.div>

          {/* RIGHT: Analysis Section */}
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="
    right w-full md:w-1/2 flex flex-col justify-center items-center
    bg-white/40 backdrop-blur-xl p-8 rounded-3xl border border-gray-200
    shadow-[0_10px_40px_rgba(0,0,0,0.06)] min-h-[420px] text-center relative overflow-hidden
    transition-all hover:shadow-[0_12px_50px_rgba(0,0,0,0.08)]
  "
          >

            {/* Placeholder when no result */}
            {!isLoading && !result && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="flex flex-col items-center justify-center gap-4 
               p-8 rounded-2xl bg-white/60 backdrop-blur-md border border-gray-200 
               shadow-md hover:shadow-lg transition-all z-10"
              >
                {/* Decorative Icon */}
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="w-14 h-14 flex items-center justify-center 
                 rounded-full bg-gradient-to-r from-pink-500 to-indigo-500 
                 text-white text-2xl shadow-lg"
                >
                  📄
                </motion.div>

                {/* Animated Text */}
                <motion.p
                  animate={{ opacity: [0.6, 1, 0.6] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="text-gray-700 italic text-lg font-medium text-center"
                >
                  Upload your resume to see detailed insights
                  <motion.span
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ repeat: Infinity, duration: 1 }}
                    className="text-pink-500"
                  >
                    .
                  </motion.span>
                  <motion.span
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
                    className="text-pink-500"
                  >
                    .
                  </motion.span>
                  <motion.span
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}
                    className="text-pink-500"
                  >
                    .
                  </motion.span>
                </motion.p>

                {/* Subtext */}
                <p className="text-sm text-gray-500">
                  Start by uploading a PDF or DOCX file ✨
                </p>
              </motion.div>
            )}

            {/* Analysis Result */}
            {result && (
              <div
                className="text-gray-900 w-full text-left relative z-10 
               h-[500px] md:h-[600px]   /* match left section height */
               overflow-y-auto overflow-x-hidden 
               p-6 rounded-2xl bg-white/40 backdrop-blur-md border border-gray-200 shadow-lg"
              >
                {/* Inner Content */}
                <div className="space-y-6">
                  {/* Status */}
                  <motion.div
                    initial={{ opacity: 0, x: -25 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="p-5 rounded-xl bg-white/60 backdrop-blur-md border border-gray-200 shadow-md hover:shadow-lg transition-all"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <span className="w-8 h-8 flex items-center justify-center rounded-full bg-gradient-to-r from-pink-500 to-indigo-500 text-white shadow">
                        ✅
                      </span>
                      <p className="font-semibold text-indigo-600 text-lg">Status</p>
                    </div>
                    <p className="text-gray-800">{result.status}</p>
                  </motion.div>

                  {/* Comments */}
                  <motion.div
                    initial={{ opacity: 0, x: -25 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="p-5 rounded-xl bg-white/60 backdrop-blur-md border border-gray-200 shadow-md hover:shadow-lg transition-all"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <span className="w-8 h-8 flex items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow">
                        💬
                      </span>
                      <p className="font-semibold text-indigo-600 text-lg">Comments</p>
                    </div>
                    <ul className="list-disc list-inside text-gray-700 mt-2 space-y-2">
                      {result.suggestions?.split("\n").map((line, idx) => (
                        <motion.li
                          key={idx}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.4 + idx * 0.1 }}
                          className="hover:text-pink-600 transition"
                        >
                          {line}
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>

                  {/* Suggestions */}
                  <motion.div
                    initial={{ opacity: 0, x: -25 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.35 }}
                    className="p-5 rounded-xl bg-white/60 backdrop-blur-md border border-gray-200 shadow-md hover:shadow-lg transition-all"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <span className="w-8 h-8 flex items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow">
                        💡
                      </span>
                      <p className="font-semibold text-indigo-600 text-lg">Suggestions</p>
                    </div>
                    <ul className="list-disc list-inside text-gray-700 mt-2 space-y-2">
                      {result.comments?.split("\n").map((line, idx) => (
                        <motion.li
                          key={idx}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.45 + idx * 0.1 }}
                          className="hover:text-indigo-600 transition"
                        >
                          {line}
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>

                  {/* Ratings */}
                  <motion.div
                    initial={{ opacity: 0, x: -25 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="p-5 rounded-xl bg-white/60 backdrop-blur-md border border-gray-200 shadow-md hover:shadow-lg transition-all"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <span className="w-8 h-8 flex items-center justify-center rounded-full bg-gradient-to-r from-pink-500 to-indigo-500 text-white shadow">
                        ⭐
                      </span>
                      <p className="font-semibold text-indigo-600 text-lg">Ratings</p>
                    </div>
                    <div className="mt-3 space-y-4">
                      {Object.entries(result.ratings || {}).map(([key, value], idx) => {
                        const pct = (Math.min(Math.max(value, 0), 10) / 10) * 100;
                        return (
                          <motion.div
                            key={key}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 + idx * 0.1 }}
                          >
                            <div className="flex justify-between text-sm mb-1">
                              <span className="capitalize text-gray-800">{key}</span>
                              <span className="text-pink-500 font-semibold">{value} / 10</span>
                            </div>
                            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${pct}%` }}
                                transition={{ duration: 1, ease: "easeOut" }}
                                className="h-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-full shadow-[0_0_6px_rgba(255,0,204,0.6)]"
                              />
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </motion.div>

                  {/* ATS Score Circle */}
                  {result.ats_score !== undefined && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.45, type: "spring", stiffness: 120 }}
                      className="flex flex-col items-center mt-8"
                    >
                      <span className="font-semibold text-indigo-600 mb-3 text-lg tracking-wide">
                        ATS Score
                      </span>
                      <div className="relative w-32 h-32">
                        <motion.div
                          className="absolute inset-0 rounded-full border-4 border-pink-300/40"
                          animate={{ scale: [1, 1.1, 1], opacity: [0.6, 0.2, 0.6] }}
                          transition={{ repeat: Infinity, duration: 2 }}
                        />
                        <svg className="w-full h-full transform -rotate-90">
                          <circle cx="64" cy="64" r="50" stroke="gray" strokeWidth="6" className="opacity-20" fill="transparent" />
                          <motion.circle
                            cx="64"
                            cy="64"
                            r="50"
                            stroke="url(#atsGradient)"
                            strokeWidth="8"
                            fill="transparent"
                            strokeDasharray="314"
                            strokeDashoffset={314 - (314 * result.ats_score) / 100}
                            strokeLinecap="round"
                            initial={{ strokeDashoffset: 314 }}
                            animate={{ strokeDashoffset: 314 - (314 * result.ats_score) / 100 }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            className="drop-shadow-[0_0_8px_rgba(255,0,204,0.6)]"
                          />
                          <defs>
                            <linearGradient id="atsGradient">
                              <stop offset="0%" stopColor="#ff00cc" />
                              <stop offset="100%" stopColor="#333399" />
                            </linearGradient>
                          </defs>
                        </svg>
                        <motion.span
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.6 }}
                          className="absolute inset-0 flex items-center justify-center text-2xl font-extrabold text-indigo-700"
                        >
                          {result.ats_score}%
                        </motion.span>
                      </div>
                      <p className="mt-3 text-sm text-gray-600 italic">Higher ATS scores improve recruiter visibility ✨</p>
                    </motion.div>
                  )}
                </div>
              </div>
            )}
            {/* LOADING */}
            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 flex flex-col justify-center items-center 
               bg-white/70 backdrop-blur-xl z-50 rounded-3xl"
              >
                {/* Loader */}
                <div className="relative w-28 h-28 flex items-center justify-center">
                  {/* Outer rotating ring */}
                  <motion.div
                    className="absolute inset-0 border-4 border-transparent border-t-pink-500 rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                  />
                  {/* Inner rotating ring */}
                  <motion.div
                    className="absolute inset-2 border-4 border-transparent border-b-indigo-500 rounded-full opacity-70"
                    animate={{ rotate: -360 }}
                    transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                  />
                  {/* Pulsing center glow */}
                  <motion.div
                    className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-500 to-indigo-500 shadow-lg"
                    animate={{ scale: [1, 1.2, 1], opacity: [0.8, 1, 0.8] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  />
                </div>

                {/* Animated Loading Text */}
                <motion.h2
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6 }}
                  className="mt-8 text-gray-700 font-semibold text-lg flex items-center gap-1"
                >
                  Analyzing your resume
                  <motion.span
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ repeat: Infinity, duration: 1 }}
                    className="text-pink-500"
                  >
                    .
                  </motion.span>
                  <motion.span
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
                    className="text-pink-500"
                  >
                    .
                  </motion.span>
                  <motion.span
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}
                    className="text-pink-500"
                  >
                    .
                  </motion.span>
                </motion.h2>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Subscribe Section */}
      <div className="w-full flex flex-col items-center justify-center py-16 px-6 bg-gradient-to-br from-white via-white to-gray-50">
        {/* Glassmorphic CTA Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative w-full max-w-6xl bg-white/40 backdrop-blur-xl border border-gray-200 rounded-3xl shadow-xl p-12 flex flex-col items-center gap-10 transition-all hover:shadow-2xl"
        >
          {/* Soft Animated Background */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-pink-100/20 via-purple-100/20 to-indigo-100/20 blur-3xl"
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ repeat: Infinity, duration: 6 }}
          />

          {/* Heading */}
          <h2 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-center z-10">
            Unlock Full Resume Insights 🚀
          </h2>
          <p className="text-gray-700 text-center max-w-2xl z-10">
            Get advanced ATS analysis, recruiter‑ready suggestions, and AI‑powered optimization for your resume.
          </p>

          {/* Feature Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full mt-4 z-10">
            {[
              { icon: "📊", label: "ATS Optimization", gradient: "from-pink-500 to-indigo-500" },
              { icon: "🤖", label: "AI Suggestions", gradient: "from-purple-500 to-pink-500" },
              { icon: "👔", label: "Recruiter Visibility", gradient: "from-indigo-500 to-purple-500" },
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.05 }}
                className={`flex flex-col items-center gap-2 bg-white/30 backdrop-blur-md px-6 py-5 rounded-xl shadow-md transition-all`}
              >
                <div className={`w-12 h-12 flex items-center justify-center rounded-xl bg-gradient-to-r ${feature.gradient} text-white shadow-lg`}>
                  {feature.icon}
                </div>
                <span className="text-sm font-medium text-gray-700">{feature.label}</span>
              </motion.div>
            ))}
          </div>

          {/* Subscribe Button */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center justify-center mt-6 z-10"
          >
            <button
              onClick={() => navigate(`/Payments/AI ResumeAnalyzer`)}
              className="relative group px-10 py-4 rounded-2xl font-semibold text-white
                   bg-gradient-to-r from-fuchsia-500 via-purple-600 to-indigo-500
                   shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 opacity-0 group-hover:opacity-30 blur-xl transition-all duration-500"></span>
              <span className="relative z-10">Subscribe Now ✨</span>
            </button>
          </motion.div>

          {/* Trust Line */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-base text-gray-600 italic mt-6 z-10 relative"
          >
            <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent font-semibold">
              “Join thousands of professionals
            </span>{" "}
            refining their resumes with AI precision.”
          </motion.p>

          {/* Soothing Quote Block */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-10 px-8 py-6 bg-white/60 backdrop-blur-xl border border-gray-200 
             rounded-2xl shadow-lg max-w-2xl text-center relative overflow-hidden"
          >
            {/* Decorative Gradient Glow */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-pink-200/20 via-purple-200/20 to-indigo-200/20 blur-2xl"
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ repeat: Infinity, duration: 6 }}
            />

            {/* Quote Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1, type: "spring" }}
              className="text-3xl text-pink-500 mb-3"
            >
              ❝
            </motion.div>

            {/* Quote Text */}
            <motion.p
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ repeat: Infinity, duration: 4 }}
              className="text-gray-700 text-lg italic font-medium relative z-10"
            >
              “A great resume doesn’t just list your experience — it tells your story with clarity and impact.”
            </motion.p>

            {/* Author / Subtext */}
            <p className="mt-4 text-sm text-gray-500 font-light relative z-10">
              — AI Resume Analyzer Insights ✨
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export default Resume_checker