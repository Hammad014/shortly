'use client';
import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function Preview({ targetUrl, metadata }) {
  const [seconds, setSeconds] = useState(5);
  const [redirecting, setRedirecting] = useState(false);

  const startRedirect = useCallback(() => {
    if (!redirecting) {
      setRedirecting(true);
      window.location.href = targetUrl;
    }
  }, [redirecting, targetUrl]);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds(prev => {
        if (prev <= 1) {
          startRedirect();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [startRedirect]);

  const handleCancel = () => window.history.back();

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-900/95 to-blue-900/30 backdrop-blur-xl z-50 flex items-center justify-center p-2 sm:p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="bg-gradient-to-br from-white to-gray-50 rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-[95%] sm:max-w-md lg:max-w-lg overflow-hidden border border-white/20"
        style={{ maxHeight: '90vh' }}
      >
        {/* Header */}
        <div className="px-4 sm:px-6 pt-4 sm:pt-6 pb-2 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="p-1.5 sm:p-2 bg-blue-100 rounded-md sm:rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">Secure Link Preview</h2>
          </div>
        </div>

        {/* Content Container */}
        <div className="flex flex-col h-[calc(90vh-80px)]">
          {/* Scrollable Content */}
          <div className="overflow-y-auto flex-1">
            {/* Image Section */}
            <div className="relative aspect-video sm:h-48 group overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 to-transparent z-10" />
              {metadata?.image?.url ? (
                <Image
                  src={metadata.image.url}
                  alt={metadata.title}
                  fill
                  className="object-cover transform transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 40vw"
                />
              ) : (
                <div className="h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
                  <motion.div 
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    className="p-3 sm:p-4 bg-white/90 backdrop-blur-sm rounded-lg sm:rounded-xl shadow-lg"
                  >
                    <Image
                      src={metadata.favicon}
                      alt="Favicon"
                      width={40}
                      height={40}
                      className="rounded-lg"
                    />
                  </motion.div>
                </div>
              )}
            </div>

            {/* Text Content */}
            <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
              <div className="flex items-start gap-2 sm:gap-3">
                <div className="shrink-0 p-1 sm:p-1.5 bg-white rounded-md sm:rounded-lg shadow border border-gray-100">
                  <Image
                    src={metadata.favicon}
                    alt="Favicon"
                    width={28}
                    height={28}
                    className="rounded"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h1 className="text-base sm:text-lg font-semibold text-gray-900 line-clamp-1">
                    {metadata.title}
                  </h1>
                  <p className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1 line-clamp-1">
                    {metadata.siteName || new URL(targetUrl).hostname}
                  </p>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-gray-600 line-clamp-2 sm:line-clamp-3 leading-relaxed">
                {metadata.description || 'You are being securely redirected to this destination'}
              </p>
            </div>
          </div>

          {/* Fixed Footer */}
          <div className="p-4 sm:p-6 border-t border-gray-100 bg-gray-50">
            {/* Progress Bar */}
            <div className="pb-3 sm:pb-4">
              <div className="relative h-1 bg-gray-200 rounded-full">
                <motion.div
                  className="absolute h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                  initial={{ width: '100%' }}
                  animate={{ width: '0%' }}
                  transition={{ duration: 5, ease: 'linear' }}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              <button
                onClick={handleCancel}
                className="px-3 sm:px-4 py-2 text-sm sm:text-base text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg 
                         font-medium transition-colors shadow-sm"
              >
                Cancel
              </button>
              <button
                onClick={startRedirect}
                className="px-3 sm:px-4 py-2 text-sm sm:text-base bg-gradient-to-r from-blue-600 to-purple-600 text-white 
                         rounded-lg font-medium shadow-lg hover:shadow-md transition-all"
              >
                Continue ({seconds}s)
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}