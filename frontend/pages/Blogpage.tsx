import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect } from "react";

const BlogDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const blog = location.state; // blog data passed from Blog page

  // Converting Buffer into Base64 for Image and Video Rendering
  const bufferToBase64 = (buffer: number[]) => {
    const binary = buffer.reduce((acc, byte) => acc + String.fromCharCode(byte), "");
    return btoa(binary);
  };

  if (!blog) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white text-gray-800 relative overflow-hidden">
        {/* Subtle background accent */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(0,0,0,0.05),_transparent_50%)] animate-pulse" />

        {/* Gradient heading */}
        <h2 className="text-4xl md:text-5xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 drop-shadow-lg">
          Blog Not Found
        </h2>

        <p className="text-gray-600 text-center mb-8 text-sm md:text-base max-w-md">
          Oops! The blog you’re looking for might have been removed or never existed.
        </p>

        {/* Frosted glass button */}
        <button
          onClick={() => navigate("/Blog")}
          className="backdrop-blur-lg bg-gray-100 hover:bg-gray-200 transition-all duration-300 ease-in-out px-8 py-3 rounded-2xl text-lg font-semibold text-gray-800 shadow-md hover:shadow-lg"
        >
          🔙 Back to Blogs
        </button>

        {/* Subtle floating animation */}
        <div className="absolute bottom-10 text-sm text-gray-500 animate-bounce">
          ✨ Keep exploring amazing stories ✨
        </div>
      </div>
    );
  }

  useEffect(() => {
    document.title = `${blog.title} - Resume Analyzer`;
  }, [blog.title]);

  return (
    <div className="min-h-screen bg-white text-gray-900 px-6 py-16 flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl w-full bg-gray-50 backdrop-blur-md p-8 rounded-2xl shadow-lg border border-gray-200"
      >
        {blog.mediaSrc?.[0]?.data ? (
          blog.mediaType === "image" ? (
            <img
              src={`data:${blog.mediaSrc[0].contentType};base64,${bufferToBase64(
                blog.mediaSrc[0].data.data
              )}`}
              alt={blog.title}
              className="w-full h-80 object-cover rounded-xl mb-8 shadow-md"
            />
          ) : (
            <video
              src={`data:${blog.mediaSrc[0].contentType};base64,${bufferToBase64(
                blog.mediaSrc[0].data.data
              )}`}
              className="w-full h-80 object-cover rounded-xl mb-8 shadow-md"
              autoPlay
              muted
              loop
            />
          )
        ) : (
          <p className="text-gray-500">No media available</p>
        )}

        {/* Blog Content */}
        <h1 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
          {blog.title}
        </h1>
        <p className="text-gray-700 leading-relaxed text-lg whitespace-pre-line">
          {blog.fullContent}
        </p>

        <button
          onClick={() => navigate("/Blog")}
          className="mt-10 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-medium py-2 px-6 rounded-lg shadow-md hover:shadow-lg transition"
        >
          ← Back to Blogs
        </button>
      </motion.div>
    </div>
  );
};

export default BlogDetail;