"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { FaBarsStaggered } from "react-icons/fa6";
import { motion, AnimatePresence } from "framer-motion";
import { FiLogIn, FiUserPlus } from "react-icons/fi";

const Navbar = ({ showSignIn, showRegister, showHome }) => {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  const handleMenuToggle = (e) => {
    e.stopPropagation();
    setMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const closeMenu = () => setMenuOpen(false);
    document.body.addEventListener("click", closeMenu);
    return () => document.body.removeEventListener("click", closeMenu);
  }, []);

  const navVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 }
  };

  const menuVariants = {
    open: { opacity: 1, scaleY: 1 },
    closed: { opacity: 0, scaleY: 0 }
  };

  return (
    <motion.nav 
      initial="hidden"
      animate="visible"
      variants={navVariants}
      transition={{ duration: 0.5 }}
      className="top-0 z-50 bg-[#0b101b]/90 backdrop-blur-lg border-b border-slate-800 shadow-2xl"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-28 items-center">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 hover:scale-105 transition-transform">
            <Image
              src="/images/Linkly.png"
              height={50}
              width={160}
              alt="Linkly Logo"
              className="hover:drop-shadow-[0_0_8px_rgba(67,97,238,0.6)] transition-all"
            />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-6">
            <Link
              href="/features"
              className="text-gray-300 hover:text-white transition-colors px-4 py-2 font-bold rounded-lg"
            >
              Features
            </Link>
            <div className="flex items-center gap-4">
              {showSignIn && (
                <Link
                  href="/login"
                  className="flex items-center gap-2 px-6 py-3 rounded-full border border-blue-500/50 hover:border-blue-400 bg-gradient-to-r from-blue-600/20 to-purple-600/10 hover:from-blue-600/30 hover:to-purple-600/20 transition-all group"
                >
                  <span className="font-semibold bg-gradient-to-r from-blue-400 to-purple-300 bg-clip-text text-transparent">
                    Login
                  </span>
                  <FiLogIn className="text-blue-400 group-hover:text-blue-300 text-xl" />
                </Link>
              )}

              {showRegister && (
                <Link
                  href="/register"
                  className="flex items-center gap-2 px-8 py-3 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40"
                >
                  <span className="font-bold text-white">Register Now</span>
                  <FiUserPlus className="text-white text-xl" />
                </Link>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={handleMenuToggle}
            className="lg:hidden p-2 rounded-lg hover:bg-slate-800/50 transition-colors z-50 relative"
          >
            <FaBarsStaggered className="text-2xl text-blue-400" />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
            className="lg:hidden absolute w-full bg-slate-900/95 backdrop-blur-xl shadow-xl z-40"
            style={{ originY: 0 }}
          >
            <div className="px-4 pt-2 pb-6 space-y-4">
              <Link
                href="/features"
                className="flex items-center gap-3 px-6 py-4 rounded-xl hover:bg-blue-600/20 transition-colors"
              >
                <span className="font-semibold text-gray-300">Features</span>
              </Link>

              {showSignIn && (
                <Link
                  href="/login"
                  className="flex items-center gap-3 px-6 py-4 rounded-xl bg-slate-800/50 hover:bg-blue-600/20 transition-colors"
                >
                  <FiLogIn className="text-blue-400 text-xl" />
                  <span className="font-semibold text-blue-300">Login</span>
                </Link>
              )}

              {showRegister && (
                <Link
                  href="/register"
                  className="flex items-center gap-3 px-6 py-4 rounded-xl bg-gradient-to-r from-blue-600/80 to-purple-600/80 hover:from-blue-500 hover:to-purple-500 transition-all"
                >
                  <FiUserPlus className="text-white text-xl" />
                  <span className="font-bold text-white">Register Now</span>
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;