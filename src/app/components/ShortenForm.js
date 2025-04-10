//components/ShortenForm.js

'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useState } from 'react';
import { FiLock, FiUnlock } from 'react-icons/fi';
import CustomAliasField from './CustomAliasField';

export default function ShortenForm({
  inputValue,
  handleInputChange,
  buttonText,
  buttonClickHandler,
  autoPaste,
  handleSwitchClick,
  shortenedUrl,
  // New props from hook
  aliasError,
  isValidAlias,
  showCustomAlias,
  customAlias,
  handleCustomAliasChange,
  toggleCustomAlias,
  
}) {
  const [localShowAlias, setLocalShowAlias] = useState(showCustomAlias);

  const handleShortenClick = async () => {
    try {
      await buttonClickHandler({
        originalUrl: inputValue,
        customAlias: localShowAlias ? customAlias : null
      });
    } catch (error) {
      // Errors handled in hook
    }
  };
  

  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="max-w-3xl mx-auto bg-slate-800/50 backdrop-blur-lg rounded-xl p-2 shadow-xl"
    >
      <div className="flex flex-col gap-4">
        {/* URL Input Section */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-4 flex items-center">
              <Image 
                src='/images/link.png' 
                width={24}
                height={24} 
                alt="link icon"
                className="opacity-70"
              />
            </div>
            <input
              value={shortenedUrl || inputValue}
              onChange={handleInputChange}
              placeholder="Paste your long link here..."
              className="w-full pl-12 pr-4 py-3 md:py-4 bg-slate-700/50 rounded-lg border border-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 text-slate-100 transition-all"
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleShortenClick}
            className="px-6 cursor-pointer py-3 md:py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg flex items-center justify-center gap-2 transition-all shadow-lg"
          >
            <span>{buttonText}</span>
            <svg
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 448 512"
            >
              <path d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z"/>
            </svg>
          </motion.button>
        </div>

        {/* Custom Alias Section */}
        <div className="space-y-4 px-2">
          <button
            type="button"
            onClick={() => {
              toggleCustomAlias();
              setLocalShowAlias(!localShowAlias);
            }}
            className="flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm"
          >
            {localShowAlias ? <FiUnlock className="text-lg" /> : <FiLock className="text-lg" />}
            {localShowAlias ? 'Using Custom Back Half' : 'Add Custom Back half'}
          </button>

          
{showCustomAlias &&  (
  <p className="text-yellow-400 text-sm mt-2">
    To get advanced management on Custom aliases. 
    <button 
      onClick={() => router.push('/register')} 
      className="ml-1 text-blue-400 hover:text-blue-300"
    >
      Register now
    </button> to claim free of cost!
  </p>
)}


          {localShowAlias && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-2"
            >
              <CustomAliasField
                value={customAlias}
                onChange={handleCustomAliasChange}
                baseUrl={process.env.NEXT_PUBLIC_BASE_URL}
                onValidate={(isValid) => {}}
              />
              {aliasError && <p className="text-red-400 text-sm">{aliasError}</p>}
            </motion.div>
          )}
        </div>

        {/* Auto Paste Section */}
        <div className="flex items-center justify-center gap-4 mt-2">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className={`switch ${autoPaste ? 'on' : ''} cursor-pointer transition-colors duration-300`}
            onClick={handleSwitchClick}
          >
            <div className="slider transition-transform duration-300" />
          </motion.div>
          <span className="text-slate-400 text-sm md:text-base">Auto Paste from Clipboard</span>
        </div>
      </div>
    </motion.div>
  );
}