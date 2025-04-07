//(aurh) login page

"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { MdEmail } from "react-icons/md";
import { FaLock, FaEyeSlash, FaEye, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import axios from "axios";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Animate from "../../components/RouteAnimate";
import { motion, AnimatePresence } from "framer-motion";
import { GuestRoute } from "@/app/components/GuestRoute";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loginError, setLoginError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [resetStep, setResetStep] = useState(1);
  const [resetEmail, setResetEmail] = useState("");
  const [resetOTP, setResetOTP] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [resetMessage, setResetMessage] = useState("");
  const [isAnimating, setIsAnimating] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isSendingOTP, setIsSendingOTP] = useState(false);
  const [isVerifyingOTP, setIsVerifyingOTP] = useState(false);
  const [isResettingPass, setIsResettingPass] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (successMessage) {
      setIsAnimating(true);
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };


 // In your login page's handleSubmit function
const handleSubmit = async (e) => {
  e.preventDefault();
  setLoginError("");
  setSuccessMessage("");
  setIsLoggingIn(true);

  try {
    const response = await axios.post("/api/user/login", formData);
    
    if (response.data.message === "Login successful") {
      setSuccessMessage("Login successful! Redirecting...");
      
      // Refresh auth state before redirecting
      setTimeout(() => {
        router.refresh(); // Refresh the page to update auth state
        router.push("/dashboard");
      }, 1000);
    }
  } catch (error) {
    console.error("Error logging in:", error?.response?.data);
    setLoginError(error?.response?.data?.error || "Login failed");
  } finally {
    setIsLoggingIn(false);
  }
};

  const handleResetRequest = async () => {
    try {
      setResetMessage("");
      setIsSendingOTP(true);
      const res = await axios.post("/api/user/request-password-reset", {
        email: resetEmail,
      });
      setResetMessage(res.data.message);
      setResetStep(2);
    } catch (error) {
      console.error("Error requesting password reset:", error?.response?.data);
      setResetMessage("Error requesting password reset. Make sure your email is correct.");
    } finally {
      setIsSendingOTP(false);
    }
  };

  const handleVerifyOTP = async () => {
    try {
      setResetMessage("");
      setIsVerifyingOTP(true);
      const res = await axios.post("/api/user/verify-reset-pin", {
        email: resetEmail,
        resetPin: resetOTP,
      });
      setResetMessage(res.data.message);
      setResetStep(3);
    } catch (error) {
      console.error("Error verifying OTP:", error?.response?.data);
      setResetMessage("Invalid OTP or email. Please try again.");
    } finally {
      setIsVerifyingOTP(false);
    }
  };

  const handleResetPassword = async () => {
    try {
      setResetMessage("");
      setIsResettingPass(true);
      if (newPassword !== confirmNewPassword) {
        setResetMessage("Passwords do not match!");
        return;
      }
      const res = await axios.post("/api/user/reset-password", {
        email: resetEmail,
        resetPin: resetOTP,
        newPassword,
      });
      setResetMessage(res.data.message);

      setIsResettingPassword(false);
      setResetStep(1);
      setResetEmail("");
      setResetOTP("");
      setNewPassword("");
      setConfirmNewPassword("");
      router.push("/login");
    } catch (error) {
      console.error("Error resetting password:", error?.response?.data);
      setResetMessage("Error resetting password. Try again.");
    } finally {
      setIsResettingPass(false);
    }
  };

  const LoadingSpinner = () => (
    <motion.div
      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 0.75 }}
    />
  );

  return (
    <>
    <GuestRoute>
      <Animate>
        <div className="min-h-screen flex flex-col">
          <Navbar showSignIn={false} showRegister={true} showHome={true} />
          
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-2">
            {/* Left Column - Login Form */}
            <div className="flex items-center justify-center p-8 bg-gradient-to-br from-gray-900 via-slate-900 to-indigo-900/20">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="w-full max-w-md p-8 rounded-2xl bg-gray-900/80 backdrop-blur-lg border border-gray-700 shadow-2xl"
              >
                <div className="flex flex-col items-center mb-8">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="p-4 bg-indigo-500/10 rounded-full mb-4"
                  >
                    <CgProfile className="text-5xl text-indigo-400" />
                  </motion.div>
                  <h1 className="text-3xl font-bold text-gray-100 mb-2">Welcome Back</h1>
                  <p className="text-gray-400">Shorten links and track analytics</p>
                </div>

                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="relative">
                    <div className="flex items-center bg-gray-800/50 rounded-lg px-4 py-3 transition-all duration-300 focus-within:ring-2 ring-indigo-500">
                      <MdEmail className="text-gray-400 text-xl mr-3" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Enter your email"
                        className="w-full bg-transparent py-2 text-gray-100 placeholder-gray-400 focus:outline-none"
                        required
                      />
                    </div>
                  </div>

                  <div className="relative">
                    <div className="flex items-center bg-gray-800/50 rounded-lg px-4 py-3 transition-all duration-300 focus-within:ring-2 ring-indigo-500">
                      <FaLock className="text-gray-400 text-lg mr-3" />
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="Enter password"
                        className="w-full bg-transparent py-2 text-gray-100 placeholder-gray-400 focus:outline-none"
                        required
                      />
                      <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="text-gray-400 hover:text-indigo-400 transition-colors"
                      >
                        {showPassword ? <FaEye /> : <FaEyeSlash />}
                      </button>
                    </div>
                  </div>

                  <AnimatePresence>
                    {loginError && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-2 text-red-400 bg-red-900/30 px-4 py-3 rounded-lg"
                      >
                        <FaTimesCircle />
                        {loginError}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <AnimatePresence>
                    {successMessage && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-2 text-green-400 bg-green-900/30 px-4 py-3 rounded-lg"
                      >
                        <FaCheckCircle />
                        {successMessage}
                        {isAnimating && (
                          <motion.div
                            className="ml-2"
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 1 }}
                          >
                            ⏳
                          </motion.div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <button
                    className="w-full cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-indigo-500/20"
                    type="submit"
                    disabled={isLoggingIn}
                  >
                    {isLoggingIn ? (
                      <>
                        <LoadingSpinner />
                        Logging in...
                      </>
                    ) : (
                      "Login"
                    )}
                  </button>

                  <div className="text-center mt-4">
                    <button
                      type="button"
                      onClick={() => setIsResettingPassword(true)}
                      className="text-indigo-400 cursor-pointer hover:text-indigo-300 transition-colors font-medium"
                    >
                      Forgot Password?
                    </button>
                  </div>
                </form>

                <p className="text-center mt-8 text-gray-400">
                  Don't have an account?{" "}
                  <Link 
                    href="./register" 
                    className="text-indigo-400 hover:text-indigo-300 transition-colors font-medium"
                  >
                    Sign up
                  </Link>
                </p>
              </motion.div>
            </div>

            {/* Right Column - Graphic Section */}
            <div className="hidden lg:flex items-center justify-center relative bg-gradient-to-br from-indigo-900 via-blue-900 to-purple-900">
              <div className="absolute inset-0 bg-noise opacity-10" />
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center p-12 max-w-2xl z-10"
              >
                {/* <motion.div
                  animate={{ y: [0, -15, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="inline-block mb-12"
                >
                  <img 
                    src="/images/Linkly.png" 
                    alt="Linkly Illustration"
                    className="w-64 h-64 mx-auto"
                  />
                </motion.div> */}
                
                <h2 className="text-5xl font-bold text-white mb-6">
                  Power Up Your Links
                </h2>
                
                <p className="text-xl text-indigo-200 mb-8">
                  Advanced analytics • Custom domains • Team collaboration
                </p>

                <div className="grid grid-cols-2 gap-6 text-left">
                  {[
                    { icon: '🚀', text: 'Instant Link Shortening' },
                    { icon: '📈', text: 'Real-time Analytics' },
                    { icon: '🛡️', text: 'Secure Links' },
                    { icon: '💡', text: 'Smart Routing' },
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center gap-4 p-4 bg-white/5 rounded-xl">
                      <span className="text-3xl">{feature.icon}</span>
                      <span className="text-gray-100">{feature.text}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Animated Background Elements */}
              <motion.div 
                className="absolute top-0 left-0 w-full h-full pointer-events-none"
                animate={{
                  background: [
                    'linear-gradient(45deg, rgba(99,102,241,0.1) 0%, rgba(168,85,247,0) 100%)',
                    'linear-gradient(135deg, rgba(99,102,241,0.1) 0%, rgba(168,85,247,0) 100%)',
                  ]
                }}
                transition={{ duration: 8, repeat: Infinity, repeatType: "reverse" }}
              />
            </div>
          </div>
          </div>

          <AnimatePresence>
            {isResettingPassword && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50 backdrop-blur-sm"
              >
                <motion.div
                  initial={{ scale: 0.95, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  className="bg-gray-900 border border-gray-700 rounded-xl p-8 w-full max-w-md relative"
                >
                  <button
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-200 transition-colors text-2xl"
                    onClick={() => {
                      setIsResettingPassword(false);
                      setResetStep(1);
                      setResetEmail("");
                      setResetOTP("");
                      setNewPassword("");
                      setConfirmNewPassword("");
                      setResetMessage("");
                    }}
                  >
                    ×
                  </button>

                  <h2 className="text-2xl font-bold text-gray-100 mb-6 text-center">
                    Reset Password {resetStep > 1 && <span className="text-blue-400">({resetStep}/3)</span>}
                  </h2>

                  {resetStep === 1 && (
                    <div className="space-y-6">
                      <div className="flex items-center bg-gray-800/50 rounded-full px-4">
                        <MdEmail className="text-gray-400 text-xl mr-3" />
                        <input
                          value={resetEmail}
                          onChange={(e) => setResetEmail(e.target.value)}
                          placeholder="Enter your email"
                          className="w-full bg-transparent py-3 text-gray-100 placeholder-gray-400 focus:outline-none"
                          required
                        />
                      </div>
                      <button
                        onClick={handleResetRequest}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-full font-semibold transition-colors flex items-center justify-center gap-2"
                        disabled={isSendingOTP}
                      >
                        {isSendingOTP ? (
                          <>
                            <LoadingSpinner />
                            Sending...
                          </>
                        ) : (
                          "Send OTP"
                        )}
                      </button>
                    </div>
                  )}

                  {resetStep === 2 && (
                    <div className="space-y-6">
                      <div className="bg-gray-800/50 rounded-full px-4">
                        <input
                          value={resetOTP}
                          onChange={(e) => setResetOTP(e.target.value)}
                          placeholder="Enter OTP"
                          className="w-full bg-transparent py-3 text-gray-100 placeholder-gray-400 focus:outline-none"
                          required
                        />
                      </div>
                      <button
                        onClick={handleVerifyOTP}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-full font-semibold transition-colors flex items-center justify-center gap-2"
                        disabled={isVerifyingOTP}
                      >
                        {isVerifyingOTP ? (
                          <>
                            <LoadingSpinner />
                            Verifying...
                          </>
                        ) : (
                          "Verify OTP"
                        )}
                      </button>
                    </div>
                  )}

                  {resetStep === 3 && (
                    <div className="space-y-6">
                      <div className="flex items-center bg-gray-800/50 rounded-full px-4">
                        <FaLock className="text-gray-400 text-lg mr-3" />
                        <input
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="New Password"
                          className="w-full bg-transparent py-3 text-gray-100 placeholder-gray-400 focus:outline-none"
                          required
                        />
                      </div>
                      <div className="flex items-center bg-gray-800/50 rounded-full px-4">
                        <FaLock className="text-gray-400 text-lg mr-3" />
                        <input
                          type="password"
                          value={confirmNewPassword}
                          onChange={(e) => setConfirmNewPassword(e.target.value)}
                          placeholder="Confirm Password"
                          className="w-full bg-transparent py-3 text-gray-100 placeholder-gray-400 focus:outline-none"
                          required
                        />
                      </div>
                      <button
                        onClick={handleResetPassword}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-full font-semibold transition-colors flex items-center justify-center gap-2"
                        disabled={isResettingPass}
                      >
                        {isResettingPass ? (
                          <>
                            <LoadingSpinner />
                            Resetting...
                          </>
                        ) : (
                          "Reset Password"
                        )}
                      </button>
                    </div>
                  )}

{resetMessage && (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className={`mt-4 flex items-center gap-2 px-4 py-3 rounded-lg ${
      resetMessage.toLowerCase().includes('success') || 
      resetMessage.toLowerCase().includes('sent') ||
      resetMessage.toLowerCase().includes('verified')
        ? "text-green-400 bg-green-900/30" 
        : "text-red-400 bg-red-900/30"
    }`}
  >
    {(resetMessage.toLowerCase().includes('success') || 
     resetMessage.toLowerCase().includes('sent') ||
     resetMessage.toLowerCase().includes('verified')) 
      ? <FaCheckCircle /> 
      : <FaTimesCircle />}
    {resetMessage}
  </motion.div>
)}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          <Footer />
     
      </Animate>
      </GuestRoute>
    </>
  );
};

export default Login;