import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";
import { useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { isSignedIn, user } = useUser();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);

  const handleClick = () => {
    if (isSignedIn) {
      navigate('/DocumentsPage')
    }
    else {
      toast.error("Please Login To Proceed Furthur")
      navigate('/');
    }
  }

  // Register user on sign in if not already registered also check if it is admin or not
  useEffect(() => {
    if (isSignedIn) {
      const registerUser = async () => {
        const response = await fetch('http://localhost:8000/api/registerUser', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: user?.primaryEmailAddress?.emailAddress,
            fullName: user?.fullName,
          }),
        });
        const data = await response.json();
        if (data.success) {
          toast.success(data.message);
        }
        setIsAdmin(data.isAdmin);
      };
      registerUser();
    }
  }, [isSignedIn]);

  return (
    <nav className="w-full overflow-x-hidden bg-black text-white sticky top-0 z-50">
      <Toaster position="top-center" reverseOrder={true} />
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
        {/* Logo */}
        <h2 className="text-2xl font-bold tracking-wide cursor-pointer">
          Logo
        </h2>

        {/* Desktop Menu */}
        <ul className="hidden md:flex gap-8 text-lg font-medium">
          <li className="cursor-pointer hover:text-gray-400 transition-colors duration-300 ease-in-out hover:scale-110">
            <Link to="/">Home</Link>
          </li>
          <li className="cursor-pointer hover:text-gray-400 transition-colors">
            <Link to="/Features">Our Products</Link>
          </li>
          <li className="cursor-pointer hover:text-gray-400 transition-colors">
            <Link to="/About">About</Link>
          </li>
          <li className="cursor-pointer hover:text-gray-400 transition-colors">
            <Link to="/Contact">Contact</Link>
          </li>
          <li className="cursor-pointer hover:text-gray-400 transition-colors">
            <Link to="/Blog">Blog</Link>
          </li>
        </ul>

        {/* Right Side Buttons (Desktop) */}
        <div className="flex items-center gap-4">
          {/* My Documents button */}
          <div className="hidden md:block">
            <button
              onClick={() => handleClick()}
              className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white px-5 py-2 rounded-lg font-semibold shadow-md hover:opacity-90 transition-all duration-300"
            >
              My Documents
            </button>
          </div>

          {/* Admin Button */}
          {isAdmin && <div className="hidden md:block">
            <Link
              to="/Admin"
              className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white px-5 py-2 rounded-lg font-semibold shadow-md hover:opacity-90 transition-all duration-300"
            >
              Admin
            </Link>
          </div>}

          {/* Clerk Authentication */}
          <div className="hidden md:flex items-center">
            <SignedOut>
              <SignInButton mode="modal">
                <button className="bg-white text-black font-semibold px-4 py-2 rounded-md hover:bg-gray-200 transition-all text-sm md:text-base">
                  Sign In
                </button>
              </SignInButton>
            </SignedOut>

            <SignedIn>
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "w-8 h-8 md:w-9 md:h-9",
                  },
                }}
              />
            </SignedIn>
          </div>
        </div>

        {/* Hamburger Menu (Mobile) */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden focus:outline-none"
        >
          <div className="space-y-1">
            <span
              className={`block w-6 h-0.5 bg-white transition-transform ${menuOpen ? "rotate-45 translate-y-1.5" : ""
                }`}
            ></span>
            <span
              className={`block w-6 h-0.5 bg-white ${menuOpen ? "opacity-0" : ""
                }`}
            ></span>
            <span
              className={`block w-6 h-0.5 bg-white transition-transform ${menuOpen ? "-rotate-45 -translate-y-1.5" : ""
                }`}
            ></span>
          </div>
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-black border-t border-gray-800">
          <ul className="flex flex-col gap-4 p-5 text-sm font-medium">
            <li className="cursor-pointer hover:text-gray-400 transition-colors">
              <Link to="/">Home</Link>
            </li>
            <li className="cursor-pointer hover:text-gray-400 transition-colors">
              <Link to="/Features">Our Products</Link>
            </li>
            <li className="cursor-pointer hover:text-gray-400 transition-colors">
              <Link to="/About">About</Link>
            </li>
            <li className="cursor-pointer hover:text-gray-400 transition-colors">
              <Link to="/Contact">Contact</Link>
            </li>
            <li className="cursor-pointer hover:text-gray-400 transition-colors">
              <Link to="/Blog">Blog</Link>
            </li>
            <li>
              <button
                onClick={() => handleClick()}
                className="block text-center bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white px-4 py-2 rounded-lg font-semibold shadow-md hover:opacity-90 transition-all duration-300"
              >
                My Documents
              </button>
            </li>
            {isAdmin && <li>
              <Link
                to="/Admin"
                className="block text-center bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white px-4 py-2 rounded-lg font-semibold shadow-md hover:opacity-90 transition-all duration-300"
              >
                Admin
              </Link>
            </li>}
            <li className="text-center">
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="w-full bg-white text-black font-semibold px-4 py-2 rounded-md hover:bg-gray-200 transition-all">
                    Sign In
                  </button>
                </SignInButton>
              </SignedOut>

              <SignedIn>
                <div className="flex justify-center">
                  <UserButton
                    appearance={{
                      elements: {
                        avatarBox: "w-9 h-9",
                      },
                    }}
                  />
                </div>
              </SignedIn>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
