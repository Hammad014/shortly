//(auth) register/page.js

"use client";
import React, { useState, useEffect } from 'react';
import Footer from '../../components/Footer';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';
import Animate from '../../components/RouteAnimate';
import { FaEyeSlash, FaEye, FaUser, FaCheckCircle, FaTimesCircle, FaRocket } from "react-icons/fa";
import { MdEmail, MdLink } from "react-icons/md";
import { FaLock } from "react-icons/fa6";
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { CgProfile } from "react-icons/cg";
import { GuestRoute } from "@/app/components/GuestRoute";

const Register = () => {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [showRequirements, setShowRequirements] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [passwordValidations, setPasswordValidations] = useState({
    minLength: false,
    containsNum: false,
    containsAlpha: false,
  });
  const [isAnimating, setIsAnimating] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (formSubmitted) {
      setIsAnimating(true);
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [formSubmitted]);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' });

    if (name === 'password') {
      const minLength = value.length >= 8;
      const containsNum = /\d/.test(value);
      const containsAlpha = /[a-zA-Z]/.test(value);
      setPasswordValidations({ minLength, containsNum, containsAlpha });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!passwordValidations.minLength || !passwordValidations.containsNum || !passwordValidations.containsAlpha) {
      setErrors({ ...errors, password: 'Password does not meet all requirements' });
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setErrors({ ...errors, confirmPassword: 'Passwords do not match' });
      return;
    }

    setIsRegistering(true);
    try {
      await axios.post('/api/user/register', {
        firstName: formData.firstName,
        email: formData.email,
        password: formData.password,
      });
      setFormSubmitted(true);
    } catch (error) {
      console.error('Error registering user:', error?.response?.data);
      setErrors({
        ...errors,
        email: error?.response?.data?.error || 'Something went wrong',
      });
    } finally {
      setIsRegistering(false);
    }
  };

  const LoadingSpinner = () => (
    <motion.div
      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 0.75 }}
    />
  );

  const FloatingLink = ({ initialX, initialY, delay }) => (
    <motion.div
      className="absolute text-white/5" // Reduced opacity from 20% to 5%
      initial={{ x: initialX, y: initialY, scale: 0 }}
      animate={{ 
        scale: [1, 1.5, 1], // Increased scale range
        rotate: [0, 180, 360],
      }}
      transition={{
        duration: 6 + Math.random() * 4, // Slower animation
        repeat: Infinity,
        repeatType: "loop",
        delay,
      }}
    >
      <MdLink style={{fontSize:'300px'}}  /> {/* Increased from text-4xl to text-7xl */}
    </motion.div>
  );

  return (
    <>
    <GuestRoute>
  <Animate>
      <div className="min-h-screen flex flex-col">
        <Navbar showSignIn={true} showRegister={false} showHome={true} />
        
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2">
          {/* Left Column - Registration Form */}
          <div className="flex items-center justify-center p-8 bg-gradient-to-br from-gray-900 via-slate-900 to-indigo-900/20">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="w-full max-w-md p-8 rounded-2xl bg-gray-900/80 backdrop-blur-lg border border-gray-700 shadow-2xl"
            >
              {formSubmitted ? (
                <div className="text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                  >
                    <FaCheckCircle className="text-4xl text-green-500 mx-auto mb-4" />
                  </motion.div>
                  <p className="text-xl text-gray-200 mb-4">
                    Registration successful! We’ve sent you a verification email.
                  </p>
                  <p className="text-gray-400">
                    Already verified?{" "}
                    <Link href="../login" className="text-indigo-400 hover:text-indigo-300 transition-colors">
                      Sign in
                    </Link>
                  </p>
                </div>
              ) : (
                <>
                  <div className="flex flex-col items-center mb-8">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className="p-4 bg-indigo-500/10 rounded-full mb-4"
                    >
                      <CgProfile className="text-5xl text-indigo-400" />
                    </motion.div>
                    <h1 className="text-3xl font-bold text-gray-100 mb-2">Create Account</h1>
                    <p className="text-gray-400">Start shortening links like a pro</p>
                  </div>

                  <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="relative">
                      <div className="flex items-center bg-gray-800/50 rounded-lg px-4 py-3 transition-all duration-300 focus-within:ring-2 ring-indigo-500">
                        <FaUser className="text-gray-400 text-lg mr-3" />
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          placeholder="First Name"
                          className="w-full bg-transparent py-2 text-gray-100 placeholder-gray-400 focus:outline-none"
                          required
                        />
                      </div>
                    </div>

                    <div className="relative">
                      <div className="flex items-center bg-gray-800/50 rounded-lg px-4 py-3 transition-all duration-300 focus-within:ring-2 ring-indigo-500">
                        <MdEmail className="text-gray-400 text-xl mr-3" />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="Email"
                          className="w-full bg-transparent py-2 text-gray-100 placeholder-gray-400 focus:outline-none"
                          required
                        />
                      </div>
                    </div>

                    <div className="relative">
                      <div className="flex items-center bg-gray-800/50 rounded-lg px-4 py-3 transition-all duration-300 focus-within:ring-2 ring-indigo-500">
                        <FaLock className="text-gray-400 text-lg mr-3" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          name="password"
                          value={formData.password}
                          onFocus={() => setShowRequirements(true)}
                          onBlur={() => setShowRequirements(false)}
                          onChange={handleInputChange}
                          placeholder="Password"
                          className="w-full bg-transparent py-2 text-gray-100 placeholder-gray-400 focus:outline-none"
                          required
                        />
                        <button
                          type="button"
                          onClick={togglePasswordVisibility}
                          className="text-gray-400 cursor-pointer hover:text-indigo-400 transition-colors"
                        >
                          {showPassword ? <FaEye /> : <FaEyeSlash />}
                        </button>
                      </div>
                    </div>

                    <AnimatePresence>
                      {showRequirements && (
                        <motion.ul
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="list-disc pl-5 text-sm text-gray-400 space-y-2"
                        >
                          <li className={passwordValidations.minLength ? 'text-green-400' : 'text-gray-400'}>
                            At least 8 characters
                          </li>
                          <li className={passwordValidations.containsAlpha ? 'text-green-400' : 'text-gray-400'}>
                            Contains an alphabet
                          </li>
                          <li className={passwordValidations.containsNum ? 'text-green-400' : 'text-gray-400'}>
                            Contains a number
                          </li>
                        </motion.ul>
                      )}
                    </AnimatePresence>

                    <div className="relative">
                      <div className="flex items-center bg-gray-800/50 rounded-lg px-4 py-3 transition-all duration-300 focus-within:ring-2 ring-indigo-500">
                        <FaLock className="text-gray-400 text-lg mr-3" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          placeholder="Confirm Password"
                          className="w-full bg-transparent py-2 text-gray-100 placeholder-gray-400 focus:outline-none"
                          required
                        />
                      </div>
                    </div>

                    <AnimatePresence>
                      {(errors.confirmPassword || errors.email || errors.password) && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="flex items-center gap-2 text-red-400 bg-red-900/30 px-4 py-3 rounded-lg"
                        >
                          <FaTimesCircle />
                          {errors.confirmPassword || errors.email || errors.password}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <button
                      className="w-full cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-indigo-500/20"
                      type="submit"
                      disabled={isRegistering}
                    >
                      {isRegistering ? (
                        <>
                          <LoadingSpinner />
                          Registering...
                        </>
                      ) : (
                        'Sign Up'
                      )}
                    </button>
                  </form>

                  <p className="text-center mt-8 text-gray-400">
                    Already have an account?{" "}
                    <Link href="../login" className="text-indigo-400 hover:text-indigo-300 transition-colors font-medium">
                      Sign in
                    </Link>
                  </p>
                </>
              )}
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
              <motion.div
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="inline-block mb-12"
              >
                <FaRocket className="text-6xl text-white/80 transform rotate-45" />
              </motion.div>
              
              <h2 className="text-5xl font-bold text-white mb-6">
                Supercharge Your Links
              </h2>
              
              <p className="text-xl text-indigo-200 mb-8">
                Advanced analytics • Custom domains • Team collaboration
              </p>

              <div className="grid grid-cols-2 gap-6 text-left">
                {[
                  { icon: '🚀', text: 'Instant Link Management' },
                  { icon: '📈', text: 'Real-time Analytics' },
                  { icon: '🛡️', text: 'Secure Link Encryption' },
                  { icon: '💡', text: 'Smart URL Routing' },
                ].map((feature, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 bg-white/5 rounded-xl">
                    <span className="text-3xl">{feature.icon}</span>
                    <span className="text-gray-100">{feature.text}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Animated Background Elements */}
            <FloatingLink initialX="-50%" initialY="-30%" delay={0} />
            <FloatingLink initialX="40%" initialY="-10%" delay={0.5} />
            <FloatingLink initialX="-20%" initialY="40%" delay={1} />
            <FloatingLink initialX="60%" initialY="50%" delay={1.5} />

            <motion.div 
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
              animate={{
                x: ['-100%', '100%'],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          </div>
        </div>
      </div>
      <Footer />
    </Animate>
    </GuestRoute>
    </>
  );
};

export default Register;