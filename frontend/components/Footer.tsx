import { FaGithub, FaLinkedin, FaTwitter, FaInstagram } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="relative bg-black text-gray-300 text-center py-8 mt-8 overflow-x-hidden">
      {/* Gradient separator line */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-400 via-pink-500 to-indigo-500"></div>

      {/* Footer Content */}
      <p className="text-base opacity-90">
        © {new Date().getFullYear()}{" "}
        <span className="font-semibold bg-gradient-to-r from-purple-400 via-pink-500 to-indigo-500 bg-clip-text text-transparent">
          DevXVitals
        </span>{" "}
        · Built with ❤️ by Vivek Raj
      </p>

      {/* Links */}
      <div className="mt-4 flex justify-center space-x-6 text-sm">
        <a
          href="#privacy"
          className="hover:text-purple-400 hover:underline transition-colors duration-300"
        >
          Privacy Policy
        </a>
        <span className="text-gray-500">•</span>
        <a
          href="#terms"
          className="hover:text-purple-400 hover:underline transition-colors duration-300"
        >
          Terms
        </a>
        <span className="text-gray-500">•</span>
        <a
          href="#contact"
          className="hover:text-purple-400 hover:underline transition-colors duration-300"
        >
          Contact
        </a>
      </div>

      {/* Social Media Icons */}
      <div className="mt-6 flex justify-center space-x-6 text-xl">
        <a
          href="https://github.com/yourprofile"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-white transition-transform transform hover:scale-110"
        >
          <FaGithub />
        </a>
        <a
          href="https://linkedin.com/in/yourprofile"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-blue-400 transition-transform transform hover:scale-110"
        >
          <FaLinkedin />
        </a>
        <a
          href="https://twitter.com/yourprofile"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-sky-400 transition-transform transform hover:scale-110"
        >
          <FaTwitter />
        </a>
        <a
          href="https://instagram.com/yourprofile"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-pink-400 transition-transform transform hover:scale-110"
        >
          <FaInstagram />
        </a>
      </div>
    </footer>
  );
};

export default Footer;