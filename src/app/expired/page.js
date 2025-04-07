// app/expired/page.js
import { motion } from 'framer-motion';
import Link from 'next/link';

// app/expired/page.js
export default function ExpiredPage() {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="text-center p-8 max-w-md">
          <div className="mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 text-red-400 mx-auto"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-red-400 mb-4">
            Link Expired
          </h1>
          <p className="text-slate-300 mb-8">
            This short link has expired and is no longer active.
          </p>
          <a
            href="/"
            className="inline-block px-6 py-3 bg-slate-700/50 hover:bg-slate-700 rounded-lg text-slate-300 hover:text-white transition-colors"
          >
            Return to Homepage
          </a>
        </div>
      </div>
    );
  }