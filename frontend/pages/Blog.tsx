import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";

type BlogType = {
  _id: string;
  title: string;
  description: string;
  fullContent: string;
  mediaType: "image" | "video";
  mediaSrc: {
    _id: string;
    name?: string;
    contentType: string;
    data: {
      type: string;
      data: number[];
    };
    base64?: string;
  }[];
  authors: {
    _id: string;
    fullName: string;
    email?: string;
    isAdmin?: boolean;
  }[];
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
};

const Blog = () => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState<BlogType[]>([]);
  const [loading, setLoading] = useState(true);

  const bufferToBase64 = (buffer: number[]) => {
    const binary = buffer.reduce((acc, byte) => acc + String.fromCharCode(byte), "");
    return btoa(binary);
  };

  useEffect(() => {
    document.title = "Blog - Resume Analyzer";
    const fetchBlogs = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/getBlogs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });

        const result = await response.json();

        if (result.success) {
          setBlogs(result.data);
        }
      } catch (error) {
        toast.error("Failed to fetch blogs. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-gray-800 px-4">
        <div className="text-center animate-fade-in">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-xl sm:text-2xl font-semibold tracking-wide animate-pulse">
            Loading Blogs...
          </p>
          <p className="mt-2 text-sm sm:text-base text-gray-500">
            Please wait while we fetch the latest insights for you.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 px-4 sm:px-6 md:px-10 py-16 flex flex-col items-center">
      <Toaster position="top-center" reverseOrder={true} />

      {/* Featured Blog Banner */}
      {blogs.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-6xl mb-12 rounded-2xl shadow-lg overflow-hidden relative"
        >
          {/* Media Section */}
          {blogs[0].mediaSrc?.[0]?.data ? (
            blogs[0].mediaType === "image" ? (
              <img
                src={`data:${blogs[0].mediaSrc[0].contentType};base64,${bufferToBase64(
                  blogs[0].mediaSrc[0].data.data
                )}`}
                alt={blogs[0].title}
                className="w-full h-72 object-cover"
              />
            ) : (
              <video loop muted autoPlay className="w-full h-72 object-cover">
                <source
                  src={`data:${blogs[0].mediaSrc[0].contentType};base64,${bufferToBase64(
                    blogs[0].mediaSrc[0].data.data
                  )}`}
                  type={blogs[0].mediaSrc[0].contentType}
                />
              </video>
            )
          ) : (
            <p className="text-center text-gray-400 p-6">No media available</p>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent p-6 flex flex-col justify-end">
            <h2 className="text-3xl font-bold text-white mb-2">{blogs[0].title}</h2>
            <p className="text-gray-200 line-clamp-2">{blogs[0].description}</p>
            <button
              onClick={() => navigate(`/Blog/${blogs[0]._id}`, { state: blogs[0] })}
              className="mt-4 bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2 px-4 rounded-lg transition"
            >
              Read Featured →
            </button>
          </div>
        </motion.div>
      )}

      {/* Page Heading */}
      <h1 className="text-4xl md:text-5xl font-extrabold mb-12 text-center bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent">
        Our Blogs
      </h1>

      {/* Categories Section */}
      <div className="flex flex-wrap justify-center gap-4 mb-12">
        {["AI", "Career", "Resume Tips", "Tech Trends"].map((category, i) => (
          <motion.span
            key={i}
            whileHover={{ scale: 1.1 }}
            className="px-4 py-2 rounded-full bg-gray-100 text-gray-700 font-medium shadow hover:shadow-md cursor-pointer transition"
          >
            {category}
          </motion.span>
        ))}
      </div>

      {/* Blog Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 w-full max-w-7xl">
        {blogs.map((blog) => (
          <motion.div
            key={blog._id}
            whileHover={{ scale: 1.03, y: -5 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="bg-gray-50 rounded-2xl shadow-md hover:shadow-xl overflow-hidden border border-gray-200 transition-all flex flex-col h-full mx-auto w-full max-w-[380px] sm:max-w-none"
          >
            {/* Media Section */}
            {blog.mediaSrc?.[0]?.data ? (
              blog.mediaType === "image" ? (
                <img
                  src={`data:${blog.mediaSrc[0].contentType};base64,${bufferToBase64(
                    blog.mediaSrc[0].data.data
                  )}`}
                  alt={blog.title}
                  className="w-full h-48 object-cover"
                />
              ) : (
                <video loop muted autoPlay className="w-full h-48 object-cover">
                  <source
                    src={`data:${blog.mediaSrc[0].contentType};base64,${bufferToBase64(
                      blog.mediaSrc[0].data.data
                    )}`}
                    type={blog.mediaSrc[0].contentType}
                  />
                </video>
              )
            ) : (
              <p className="text-center text-gray-400 p-6">No media available</p>
            )}

            {/* Content */}
            <div className="p-6 flex flex-col justify-between flex-1">
              <div>
                <h2 className="text-xl font-semibold mb-2 leading-snug text-gray-900">
                  {blog.title}
                </h2>
                <p className="text-sm text-gray-600 leading-relaxed mb-3 line-clamp-3">
                  {blog.description}
                </p>
                {blog.authors?.length > 0 && (
                  <p className="text-xs text-gray-500">
                    By{" "}
                    <span className="font-medium">
                      {blog.authors.map((author) => author.fullName).join(", ")}
                    </span>
                  </p>
                )}
              </div>

              <button
                onClick={() => navigate(`/Blog/${blog._id}`, { state: blog })}
                className="mt-5 bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2 px-4 rounded-lg transition w-fit self-start"
              >
                Read More →
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Authors Section */}
      {blogs.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mt-16 w-full max-w-6xl"
        >
          <h2 className="text-2xl font-bold mb-6 text-gray-900 text-center">
            Meet Our Authors
          </h2>

          <div className="flex flex-wrap justify-center gap-6">
            {Array.from(
              new Map(
                blogs.flatMap((blog) =>
                  blog.authors.map((author) => [author._id, author])
                )
              ).values()
            ).map((author) => {
              const authoredBlogs = blogs.filter((b) =>
                b.authors.some((a) => a._id === author._id)
              );

              return (
                <AuthorCard
                  key={author._id}
                  author={author}
                  authoredBlogs={authoredBlogs}
                />
              );
            })}
          </div>
        </motion.div>
      )}
    </div>
  );
};

const AuthorCard = ({
  author,
  authoredBlogs,
}: {
  author: { _id: string; fullName: string; email?: string; isAdmin?: boolean };
  authoredBlogs: BlogType[];
}) => {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      className="relative w-64 bg-white rounded-xl border border-gray-200 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer"
      onClick={() => setOpen(!open)}
    >
      {/* Header */}
      <div className="px-6 py-5 bg-gradient-to-r from-pink-100 via-purple-100 to-indigo-100 rounded-t-xl">
        <div className="flex items-center gap-3">
          {/* Static Icon */}
          <img
            src="https://cdn-icons-png.flaticon.com/512/9131/9131529.png"
            alt="Author Icon"
            className="w-10 h-10 rounded-full border border-gray-300"
          />
          <div className="flex-1">
            <div className="text-lg font-bold text-gray-900 flex items-center justify-between">
              {author.fullName}
              <span className="text-gray-500 text-sm">{open ? "▲" : "▼"}</span>
            </div>
            {author.email && (
              <p className="text-sm text-gray-700">{author.email}</p>
            )}
            {author.isAdmin && (
              <span className="mt-1 inline-block px-3 py-1 text-xs font-medium rounded-full bg-pink-200 text-pink-700">
                Admin
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Dropdown */}
      <motion.div
        initial={false}
        animate={open ? "open" : "closed"}
        variants={{
          open: {
            opacity: 1,
            height: "auto",
            transition: { duration: 0.4, ease: "easeOut" },
          },
          closed: {
            opacity: 0,
            height: 0,
            transition: { duration: 0.3, ease: "easeIn" },
          },
        }}
        className="overflow-hidden px-6 py-4 bg-white rounded-b-xl"
      >
        {open && (
          <>
            <p className="text-sm font-semibold text-gray-800 mb-2">
              Blogs Written:
            </p>
            <ul className="space-y-1 text-sm text-gray-700 max-h-32 overflow-y-auto">
              {authoredBlogs.map((b) => (
                <li key={b._id} className="truncate hover:text-pink-600 transition">
                  • {b.title}
                </li>
              ))}
            </ul>
          </>
        )}
      </motion.div>
    </motion.div>
  );
};
export default Blog;