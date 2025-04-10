'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ShortenForm from '../components/ShortenForm';
import SimpleLinksTable from '../components/SimpleLinksTable';
import { useShortenLink } from '../hooks/ShortenUtility';
import { FiLock, FiX, FiChevronRight, FiUploadCloud } from 'react-icons/fi';
import { useRouter } from "next/navigation";
import { FaLink, FaQrcode, FaChartLine, FaEdit, FaRegClock, FaMagic } from 'react-icons/fa';
import { TbChartArcs, TbClick } from 'react-icons/tb';
import { GuestRoute } from "@/app/components/GuestRoute";

export default function Home() {
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const router = useRouter();
  const {
    autoPaste,
    inputValue,
    shortenedUrl,
    links,
    isLoading,
    handleSwitchClick,
    handleInputChange,
    buttonText,
    buttonClickHandler,
    handleCopyClick,
    copiedLink,
    showAll,
    setShowAll,
    toggleCustomAlias,
    showCustomAlias,
    handleCustomAliasChange,
  } = useShortenLink();

  useEffect(() => {
    const timer = setTimeout(() => {
      const hasSeenModal = sessionStorage.getItem('hasSeenModal');
      if (!hasSeenModal) {
        setShowRegistrationModal(true);
      }
    }, 15000);

    return () => clearTimeout(timer);
  }, []);

  const handleModalClose = () => {
    sessionStorage.setItem('hasSeenModal', 'true');
    setShowRegistrationModal(false);
  };

  const handleRegisterClick = () => {
    sessionStorage.setItem('hasSeenModal', 'true');
    router.push('/register');
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 }
  };

   // Custom Components
   const ProcessStep = ({ number, title, description, icon }) => (
    <motion.div 
      className="flex gap-4 items-start p-6 bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 hover:border-purple-400/30 transition-all"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
    >
      <div className="flex flex-col items-center">
        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-sm font-bold">
          {number}
        </div>
        <div className="h-full w-px bg-slate-700 mt-4" />
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-3">
          {icon}
          <h3 className="text-xl font-semibold text-slate-100">{title}</h3>
        </div>
        <p className="text-slate-400 leading-relaxed">{description}</p>
      </div>
    </motion.div>
  );

  const FeatureVisualization = ({ title, description, visual, reverse = false }) => (
    <div className={`grid md:grid-cols-2 gap-12 items-center ${reverse ? 'md:flex-row-reverse' : ''}`}>
      <motion.div 
        className={`${reverse ? 'md:order-2' : ''}`}
        initial={{ opacity: 0, x: reverse ? 50 : -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
      >
        {visual}
      </motion.div>
      <motion.div 
        className={`${reverse ? 'md:order-1' : ''}`}
        initial={{ opacity: 0, x: reverse ? -50 : 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
      >
        <h3 className="text-2xl font-bold text-slate-100 mb-4">{title}</h3>
        <p className="text-slate-400 leading-relaxed">{description}</p>
      </motion.div>
    </div>
  );

  // Advanced Visualizations
  const linkShorteningVisual = (
    <div className="relative p-8 bg-slate-800 rounded-2xl">
      <svg viewBox="0 0 400 300" className="w-full h-auto">
        {/* Animated URL transformation */}
        <motion.text
          x="50"
          y="100"
          fill="#818cf8"
          fontSize="14"
          initial={{ opacity: 1 }}
          animate={{ opacity: [1, 0.5, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          https://example.com/very-long-url-path
        </motion.text>
        
        <motion.path
          d="M50 150h300"
          stroke="#4f46e5"
          strokeWidth="2"
          strokeDasharray="8 4"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5 }}
        />
        
        <motion.g transform="translate(150,200)" className="animate-pulse">
          <circle cx="0" cy="0" r="20" fill="#6366f1" />
          <motion.path
            d="M-10,-10 L10,0 L-10,10 Z"
            fill="#ffffff"
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.g>
      </svg>
    </div>
  );

  const analyticsVisual = (
    <div className="relative p-10 bg-slate-800 rounded-2xl">
      <div className="relative h-64">
        {/* Animated map visualization */}
        <div className="absolute inset-0 opacity-30 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI1MCIgdmlld0JveD0iMCAwIDQwMCAyNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPGNpcmNsZSBjeD0iMTAwIiBjeT0iMTAwIiByPSI4IiBmaWxsPSIjN2QzZWI5Ii8+CiAgPGNpcmNsZSBjeD0iMjUwIiBjeT0iNzAiIHI9IjEyIiBmaWxsPSIjN2QzZWI5Ii8+CiAgPGNpcmNsZSBjeD0iMTgwIiBjeT0iMTgwIiByPSIxMCIgZmlsbD0iIzdkM2ViOSIvPgogIDxjaXJjbGUgY3g9IjMwMCIgY3k9IjE1MCIgcj0iNiIgZmlsbD0iIzdkM2ViOSIvPgo8L3N2Zz4K')]"/>
        
        {/* Interactive bars */}
        {[65, 85, 45, 85, 75].map((h, i) => (
          <motion.div
            key={i}
            className="absolute w-8 bg-gradient-to-t from-purple-500 to-blue-500 rounded-t-lg"
            style={{
              left: `${20 + i * 15}%`,
              bottom: '40px',
              height: `${h}%`
            }}
            initial={{ height: 0 }}
            animate={{ height: `${h}%` }}
            transition={{ delay: i * 0.2, duration: 0.8 }}
          >
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs text-slate-300">
              {['US', 'IN', 'UK', 'DE', 'JP'][i]}
            </div>
          </motion.div>
        ))}
        
        {/* Animated trend line */}
        <svg className="absolute inset-0" viewBox="0 0 400 250">
          <motion.path
            d="M50 200 L100 150 L150 180 L200 120 L250 160 L300 140 L350 190"
            stroke="#818cf8"
            strokeWidth="2"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2 }}
          />
        </svg>
      </div>
    </div>
  );

  return (
    <>
    <GuestRoute>
    <div className="min-h-screen bg-transparent">
      {/* Registration Modal */}
      {showRegistrationModal && (
        <motion.div
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={modalVariants}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-black/30 backdrop-blur-lg z-50 flex items-center justify-center p-4"
        >
          <div className="relative bg-gradient-to-br from-purple-900/80 to-blue-900/80 rounded-2xl p-8 max-w-lg w-full border border-white/10 shadow-2xl">
            <button
              onClick={handleModalClose}
              className="absolute top-4 right-4 p-2 text-white/70 hover:text-white transition-colors"
            >
              <FiX className="w-6 h-6" />
            </button>

            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <div className="p-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full">
                  <FiLock className="text-3xl text-white" />
                </div>
              </div>
              
              <h3 className="text-3xl font-bold bg-gradient-to-r from-purple-300 to-blue-300 bg-clip-text text-transparent">
                Unlock Premium Features
              </h3>
              
              <p className="text-white/80 text-lg leading-relaxed">
                Create custom short URLs, track clicks, and access advanced analytics by registering a free account!
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={handleModalClose}
                  className="px-8 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-white font-semibold flex-1"
                >
                  Explore First
                </button>
                <button
                  onClick={handleRegisterClick}
                  className="px-8 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold shadow-lg hover:shadow-purple-500/30 transition-all flex-1"
                >
                  Get Started Free
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Loading Overlay */}
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
        >
          <div className="flex flex-col items-center space-y-4">
            <div className="w-12 h-12 border-4 border-t-blue-500 border-r-blue-500 rounded-full animate-spin" />
            <motion.p className="text-blue-100 font-semibold tracking-wide">
              Shortening...
            </motion.p>
          </div>
        </motion.div>
      )}

      <div className={`relative ${isLoading ? 'blur-sm' : ''}`}>
        <Navbar showSignIn={true} showRegister={true} showHome={false} />

        <main className="max-w-6xl mx-auto px-4 py-8 md:py-12 lg:py-16">
          {/* Hero Section */}
          <section className="text-center mb-8 md:mb-12 lg:mb-16">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6"
            >
              <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                Transform Lengthy Links
              </span>
              <span className="block mt-2 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                Into Neat Short URLs ✨
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-slate-300 text-lg md:text-xl max-w-2xl mx-auto mb-6 md:mb-8"
            >
              Instantly condense long web addresses into manageable, trackable links
            </motion.p>

            <ShortenForm
              inputValue={inputValue}
              handleInputChange={handleInputChange}
              buttonText={buttonText}
              buttonClickHandler={buttonClickHandler}
              autoPaste={autoPaste}
              handleSwitchClick={handleSwitchClick}
              toggleCustomAlias={toggleCustomAlias}
              showCustomAlias={showCustomAlias}
              handleCustomAliasChange={handleCustomAliasChange}
            />
          </section>

          {/* Recent Links Section */}
          <section className="mt-12 md:mt-16">
            {links.length > 0 && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mb-6 md:mb-8"
                >
                  {/* <h2 className="text-xl md:text-2xl font-bold text-slate-200 bg-slate-800 w-max px-6 py-3 rounded-r-full shadow-lg">
                    Your Recent Links
                  </h2> */}
                </motion.div>

                <SimpleLinksTable
                  links={links}
                  showAll={showAll}
                  setShowAll={setShowAll}
                  handleCopyWithMessage={handleCopyClick}
                  copiedLink={copiedLink}
                />
              </>
            )}
          </section>

          {/* Enterprise Section */}
            {/* Enterprise Section */}
            <section className="py-20">
            <div className="max-w-7xl mx-auto px-4">
              <motion.div 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="mb-20 text-center"
              >
                <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-6">
                  Professional Link Management
                </h2>
                <p className="text-slate-300 max-w-3xl mx-auto">
                  Comprehensive solutions for secure and efficient URL management
                </p>
              </motion.div>

              <div className="space-y-20 hidden md:block">
                <FeatureVisualization
                  title="Secure Bulk Processing"
                  description="Process multiple URLs simultaneously through secure file uploads with automatic validation"
                  visual={
                    <div className="relative bg-slate-800 rounded-2xl p-8">
                      <div className="flex flex-col items-center gap-6">
                        <motion.div 
                          className="p-4 rounded-xl bg-slate-700/50 border border-slate-600"
                          animate={{ y: [0, -10, 0] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <FiUploadCloud className="text-4xl text-blue-400" />
                        </motion.div>
                        <div className="flex gap-2">
                          <motion.div
                            className="px-3 py-1 bg-slate-700 rounded-full text-sm"
                            whileHover={{ scale: 1.05 }}
                          >
                            CSV
                          </motion.div>
                          <motion.div
                            className="px-3 py-1 bg-slate-700 rounded-full text-sm"
                            whileHover={{ scale: 1.05 }}
                          >
                            XLSX
                          </motion.div>
                          <motion.div
                            className="px-3 py-1 bg-slate-700 rounded-full text-sm"
                            whileHover={{ scale: 1.05 }}
                          >
                            TXT
                          </motion.div>
                        </div>
                      </div>
                    </div>
                  }
                />

                <FeatureVisualization
                  title="Advanced Analytics Dashboard"
                  description="Interactive analytics with geographic visualization and real-time click tracking"
                  visual={analyticsVisual}
                  reverse
                />

                <FeatureVisualization
                  title="Smart Link Transformation"
                  description="Instant URL conversion with intelligent validation and preview capabilities"
                  visual={linkShorteningVisual}
                />
              </div>

               {/* Process Steps */}
               <div className="mt-20 grid md:grid-cols-3 gap-8">
               
                <ProcessStep
                  number="1"
                  title="Create & Shorten"
                  description="Convert long URLs instantly with custom aliases"
                  icon={<FaLink className="text-xl text-purple-400" />}
                />
                <ProcessStep
                  number="2"
                  title="Analyze & Track"
                  description="Monitor link performance with detailed analytics"
                  icon={<TbChartArcs className="text-xl text-blue-400" />}
                />
                <ProcessStep
                  number="3"
                  title="Manage & Optimize"
                  description="Edit, expire, or remove links as needed"
                  icon={<FaEdit className="text-xl text-green-400" />}
                />
              </div>
               

              {/* CTA Section */}
              <motion.div 
                className="mt-20 text-center bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-2xl p-12"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h3 className="text-2xl md:text-3xl font-bold text-slate-100 mb-4">
                  Ready to Elevate Your Link Management?
                </h3>
                <p className="text-slate-300 mb-8 max-w-xl mx-auto">
                  Start creating professional short URLs with enterprise-grade features
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={() => router.push('/register')}
                    className="px-8 py-4 cursor-pointer rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold shadow-lg hover:shadow-purple-500/30 transition-all flex items-center gap-2"
                  >
                    <FaMagic className="text-lg" />
                    Register Now
                  </button>
                  <button
                    onClick={() => router.push('/features')}
                    className="px-8 py-4 cursor-pointer rounded-xl bg-slate-700/50 border border-slate-600 hover:border-slate-400 text-slate-300 hover:text-white transition-all flex items-center gap-2"
                  >
                    <FiChevronRight className="text-md" />
                    Explore Features
                  </button>
                </div>
              </motion.div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </div>
    </GuestRoute>
    </>
  );
}