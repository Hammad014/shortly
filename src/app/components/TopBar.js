"use client"

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { CgProfile } from "react-icons/cg";
import { FiChevronDown, FiMenu } from "react-icons/fi";
import { useAuth } from "../hooks/useAuth";

const TopBar = ({ toggleSidebar }) => {
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { user, loading } = useAuth();

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setIsDropdownOpen(false);
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-gray-900/80 backdrop-blur-sm border-b border-gray-700 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center">
             <button
              onClick={toggleSidebar}
              className="lg:hidden mr-3 text-gray-400 hover:text-blue-400 transition-colors"
            >
              <FiMenu className="text-2xl" />
            </button>
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Linkly
              </span>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {!loading && (
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center cursor-pointer space-x-2 bg-gray-800/50 px-4 py-2 rounded-lg hover:bg-gray-700/50 transition-colors group"
                >
                  <div className="flex items-center space-x-2">
                    <CgProfile className="text-xl text-blue-400" />
                    <span className="text-gray-200 font-medium">
                      {user?.firstName || "Guest"}
                    </span>
                  </div>
                  <FiChevronDown
                    className={`text-gray-400 transition-transform ${
                      isDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                      className="absolute right-0 mt-2 w-56 origin-top-right"
                    >
                      <div className="bg-gray-800/95 backdrop-blur-lg rounded-xl shadow-2xl border border-gray-700 overflow-hidden">
                        <div className="p-4 border-b border-gray-700">
                          <p className="text-sm font-medium text-gray-200 truncate">
                            {user?.firstName || "User"}
                          </p>
                          <p className="text-xs text-gray-400 mt-1 break-words max-w-full">
                            {user?.email}
                          </p>
                        </div>
                        <div className="p-2">
                          <button
                            onClick={handleLogout}
                            className="w-full flex cursor-pointer  items-center px-4 py-2.5 text-sm text-red-400 hover:bg-red-900/10 rounded-lg transition-all duration-200"
                          >
                            <span className="flex-1 text-left">Log out</span>
                            <svg
                              className="w-4 h-4 ml-2"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default TopBar;
