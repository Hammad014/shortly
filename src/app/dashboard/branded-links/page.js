// app/dashboard/branded-links/page.js
'use client';
import { useEffect, useState } from 'react';
import BrandedLinkForm from '../../components/BrandedLinkForm';
import Link from 'next/link';

export default function BrandedLinksPage() {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const sessionId = localStorage.getItem("sessionId");
        if (!sessionId) {
          setLinks([]);
          return;
        }

        const response = await fetch(`/api/links?sessionId=${sessionId}`);
        if (!response.ok) throw new Error('Failed to fetch links');
        
        const data = await response.json();
        setLinks(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message);
        setLinks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLinks();
  }, []);

  return (
    <div className="max-w-6xl mx-auto ml-20 px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Branded Links</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form Section */}
        <div className="bg-slate-800/50 p-6 rounded-xl">
          <h2 className="text-xl font-semibold mb-4 text-white">Create New Branded Link</h2>
          <BrandedLinkForm onCreate={() => window.location.reload()} />
        </div>

        {/* Links List Section */}
        <div className="bg-slate-800/50 p-6 rounded-xl">
          <h2 className="text-xl font-semibold mb-4 text-white">Your Branded Links</h2>
          
          {error && <div className="text-red-400 mb-4">{error}</div>}

          {loading ? (
            <div className="text-gray-400">Loading links...</div>
          ) : links.length === 0 ? (
            <div className="text-gray-400">No branded links created yet</div>
          ) : (
            <div className="space-y-4">
              {links.map((link) => (
                <div key={link._id} className="bg-slate-700/50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-blue-400">{link.domain}/</span>
                        <span className="text-white">{link.shortUrl}</span>
                      </div>
                      <a
                        href={link.originalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 text-sm hover:text-blue-400 truncate"
                      >
                        → {link.originalUrl}
                      </a>
                    </div>
                    <button
                      onClick={() => navigator.clipboard.writeText(link.fullShortUrl)}
                      className="p-2 hover:bg-slate-600/50 rounded-lg transition-colors"
                    >
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}