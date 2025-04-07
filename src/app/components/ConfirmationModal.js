// components/ConfirmationModal.js
'use client';
import { motion } from 'framer-motion';

export const ConfirmationModal = ({ isOpen, onConfirm, onCancel, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-black/60 via-purple-900/30 to-blue-900/20 backdrop-blur-xl flex items-center justify-center p-4 z-[9999]">
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-8 max-w-md w-full shadow-2xl border border-slate-700/50"
      >
        {/* Decorative gradient blob */}
        <div className="absolute -inset-4 -z-10 opacity-50">
          <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 to-purple-600/20 blur-3xl rounded-3xl" />
        </div>

        <div className="flex flex-col items-center text-center">
          {/* Warning icon */}
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="mb-6 p-4 bg-red-500/20 rounded-full border border-red-400/30"
          >
            <svg
              className="w-12 h-12 text-red-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
              />
            </svg>
          </motion.div>

          <h3 className="text-2xl font-bold bg-gradient-to-r from-red-100 to-pink-200 bg-clip-text text-transparent mb-4">
            Confirm Action
          </h3>
          <p className="text-slate-300 text-lg mb-8 font-medium leading-relaxed">
            {message}
          </p>

          <div className="flex justify-center gap-4 w-full">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onCancel}
              className="px-8 py-3.5 rounded-xl bg-slate-700/50 hover:bg-slate-700/70 text-slate-300 font-semibold transition-all 
                        border border-slate-600/50 hover:border-slate-500/50 flex-1 max-w-[160px]"
            >
              Cancel
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onConfirm}
              className="px-8 py-3.5 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 
                        text-white font-semibold shadow-lg shadow-red-500/20 hover:shadow-red-500/30 transition-all flex-1 max-w-[160px]"
            >
              Delete
            </motion.button>
          </div>
        </div>

        {/* Animated border effect */}
        <div className="absolute inset-0 rounded-2xl pointer-events-none border border-slate-700/50" />
      </motion.div>
    </div>
  );
};