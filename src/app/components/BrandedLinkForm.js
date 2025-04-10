// components/BrandedLinkForm.js
'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import CustomAliasField from './CustomAliasField';

export default function BrandedLinkForm({ onCreate }) {
  const [originalUrl, setOriginalUrl] = useState('');
  const [customDomain, setCustomDomain] = useState('');
  const [customAlias, setCustomAlias] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch('/api/links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          originalUrl,
          customDomain: customDomain || process.env.NEXT_PUBLIC_BASE_URL,
          customAlias: customAlias || undefined
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      
      onCreate(data);
      setOriginalUrl('');
      setCustomDomain('');
      setCustomAlias('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.form 
      onSubmit={handleSubmit}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4"
    >
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-300">Destination URL</label>
        <input
          type="url"
          value={originalUrl}
          onChange={(e) => setOriginalUrl(e.target.value)}
          placeholder="https://example.com/long-url"
          className="w-full px-4 py-3 bg-slate-700/50 rounded-lg border border-slate-600 focus:ring-2 focus:ring-blue-500/30 text-slate-100"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-300">Custom Domain (optional)</label>
        <input
          type="text"
          value={customDomain}
          onChange={(e) => setCustomDomain(e.target.value.replace(/(^\w+:|^)\/\//, ''))}
          placeholder="your-domain.com"
          className="w-full px-4 py-3 bg-slate-700/50 rounded-lg border border-slate-600 focus:ring-2 focus:ring-blue-500/30 text-slate-100"
        />
      </div>

      <CustomAliasField
        value={customAlias}
        onChange={setCustomAlias}
        baseUrl={customDomain || process.env.NEXT_PUBLIC_BASE_URL}
      />

      {error && <p className="text-red-400 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
      >
        {loading ? 'Creating...' : 'Create Branded Link'}
      </button>
    </motion.form>
  );
}