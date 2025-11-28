import React, { useEffect, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast';
import { useUser } from '@clerk/clerk-react';
import CustomerReview from '../components/homePage/CustomerReview.tsx';

interface ContactFormData {
  fullName: string;
  phone: string;
  email: string;
  query: string;
}

const Contact = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    fullName: "",
    phone: "",
    email: "",
    query: "",
  });

  const [isDisabled, setIsDisabled] = useState(false); // Toggle for form login according to user signin status

  const { user, isSignedIn } = useUser();

  useEffect(() => {
    document.title = "Contact Us - Resume Analyzer";
    let intervalId: ReturnType<typeof setInterval> | null = null;

    if (isSignedIn) {
      setIsDisabled(false);
      if (intervalId) clearInterval(intervalId);
    } else {
      setIsDisabled(true);
      intervalId = setInterval(() => {
        toast.error("Please Login To Send the Query");
      }, 20000);
    }

    setFormData((prev) => ({
      ...prev,
      email: user?.primaryEmailAddress?.emailAddress || "Please Login to AutoFill Email",
      fullName: user?.fullName || "Please Login to AutoFill Name",
    }));

    return () => {
      if (intervalId) clearInterval(intervalId); // Cleanup on unmount or re-run
    };
  }, [isSignedIn]);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const phoneRegex = /^[0-9]{10}$/;
    if (formData.phone && !phoneRegex.test(formData.phone)) {
      toast.error("Please enter a valid 10-digit phone number.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/api/contactForm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        setMessage(result.message);
        toast.success(result.message);
        setFormData({ fullName: "", phone: "", email: "", query: "" });
      } else {
        toast.error(result.message || "Submission failed. Please try again.");
        setMessage("❌ Submission failed. Please try again.");
      }
    } catch (error) {
      toast.error("Unable to connect to the server.");
      setMessage("❌ Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-white text-gray-800 py-20 px-6 flex flex-col items-center">
  <Toaster position="top-center" reverseOrder={true} />
  <h1 className="text-5xl font-extrabold mb-16 text-center text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 drop-shadow-lg">
    Contact Us
  </h1>

  <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
    {/* Left Visual Section */}
    <div className="w-full h-full flex items-center justify-center">
      <img
        src="/homeImage.jpg"
        alt="Contact Visual"
        className="rounded-3xl shadow-xl object-cover w-full h-full max-h-[500px]"
      />
    </div>

    {/* Contact Form Section */}
    <div className="w-full bg-white/60 backdrop-blur-md border border-gray-200 rounded-3xl shadow-xl p-8 transition-all hover:shadow-2xl">
      <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800">
        Get in Touch
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Full Name */}
        <div>
          <label className="block text-lg font-medium mb-2">Full Name</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            placeholder="Enter your name"
            className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-400"
            required
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-lg font-medium mb-2">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            placeholder="Enter your email"
            className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-400"
            required
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block text-lg font-medium mb-2">Phone</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Enter your phone number"
            className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-400"
          />
        </div>

        {/* Query Description */}
        <div>
          <label className="block text-lg font-medium mb-2">Query Description</label>
          <textarea
            name="query"
            value={formData.query}
            onChange={handleChange}
            rows={5}
            placeholder="Describe your query..."
            className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-400"
            required
          ></textarea>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center pt-4">
          <button
            type="submit"
            disabled={loading || isDisabled}
            className={`px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl text-white font-semibold shadow-md transition-all duration-300 ${
              loading ? "opacity-70 cursor-not-allowed" : "hover:scale-105"
            }`}
          >
            {loading ? "Sending..." : "Submit"}
            {isDisabled && " (Sign In to Send Query)"}
          </button>
        </div>

        {/* Status Message */}
        {message && (
          <p className="text-center text-gray-600 mt-4">{message}</p>
        )}
      </form>
    </div>
  </div>

  {/* Contact Info Glass Card */}
  <div className="w-full max-w-4xl mt-16 bg-white/60 backdrop-blur-md border border-gray-200 rounded-3xl shadow-xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 transition-all hover:shadow-2xl">
    <div className="text-center md:text-left space-y-2">
      <h3 className="text-2xl font-bold text-gray-800">Need Help?</h3>
      <p className="text-gray-600">
        Feel free to reach out to our support team anytime!
      </p>
    </div>

    <div className="space-y-2 text-center md:text-right text-gray-700">
      <p>
        📧 <span className="font-semibold">support@yourdomain.com</span>
      </p>
      <p>
        📞 <span className="font-semibold">+91 98765 43210</span>
      </p>
      <p>🏢 221B Innovation Street, Tech City, India</p>
    </div>
  </div>

  {/* Social Icons */}
  <div className="mt-8 flex gap-6 justify-center text-gray-500">
    <a href="#" className="hover:text-pink-500 transition">
      <i className="fab fa-facebook-f text-xl"></i>
    </a>
    <a href="#" className="hover:text-pink-500 transition">
      <i className="fab fa-twitter text-xl"></i>
    </a>
    <a href="#" className="hover:text-pink-500 transition">
      <i className="fab fa-instagram text-xl"></i>
    </a>
  </div>

  <CustomerReview />
</div>
  );
}

export default Contact
