// app/dashboard/expiration/page.js
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function ExpirationPage() {
  const [links, setLinks] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [copiedLink, setCopiedLink] = useState('');
  const router = useRouter();

  // Fetch links with expiration data
  const fetchLinks = async () => {
    try {
      const sessionId = localStorage.getItem('sessionId');
      const res = await axios.get('/api/links', {
        params: { sessionId }
      });
      const linksWithExpiration = res.data.map(link => ({
        ...link,
        isExpired: checkExpiration(link)
      }));
      setLinks(linksWithExpiration);
      calculateStats(linksWithExpiration);
    } catch (error) {
      console.error('Error fetching links:', error);
    } finally {
      setLoading(false);
    }
  };

  // Check link expiration status
  const checkExpiration = (link) => {
    if (link.status === 'expired') return true;
    if (link.expirationType === 'datetime' && new Date() > new Date(link.expiresAt)) return true;
    if (link.expirationType === 'clicks' && link.totalClicks >= link.expireAfterClicks) return true;
    return false;
  };

  // Calculate statistics
  const calculateStats = (links) => {
    const now = new Date();
    const stats = {
      totalExpiring: links.filter(l => l.expirationType !== 'none').length,
      expiringSoon: links.filter(l => 
        l.expirationType === 'datetime' && 
        new Date(l.expiresAt) < new Date(now.getTime() + 7 * 86400000)
      ).length,
      expiredThisWeek: links.filter(l => 
        l.status === 'expired' && 
        new Date(l.updatedAt) > new Date(now.getTime() - 7 * 86400000)
      ).length
    };
    setStats(stats);
  };

  // Manual expiration handler
  const expireLink = async (linkId) => {
    try {
      await axios.patch('/api/links', { 
        id: linkId,
        action: 'expire'
      });
      fetchLinks();
    } catch (error) {
      console.error('Error expiring link:', error);
    }
  };

  // Copy to clipboard
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedLink(text);
    setTimeout(() => setCopiedLink(''), 2000);
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  if (loading) return <div className="p-6 text-gray-500">Loading...</div>;

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-bold">Link Expiration Manager</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Active Expirations</h3>
          <p className="text-2xl font-bold">{stats.totalExpiring}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Expiring Soon</h3>
          <p className="text-2xl font-bold text-amber-600">{stats.expiringSoon}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Recently Expired</h3>
          <p className="text-2xl font-bold text-red-600">{stats.expiredThisWeek}</p>
        </div>
      </div>

      {/* Links Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left">Short Link</th>
              <th className="px-4 py-3 text-left">Original Link</th>
              <th className="px-4 py-3 text-center">Clicks</th>
              <th className="px-4 py-3 text-left">Expiration</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {links.map(link => (
              <tr key={link._id}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="text-blue-600">{link.shortUrl}</span>
                    <button 
                      onClick={() => copyToClipboard(link.fullShortUrl)}
                      className="text-gray-400 hover:text-blue-600"
                    >
                      {copiedLink === link.fullShortUrl ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                </td>
                <td className="px-4 py-3 max-w-[200px] truncate">
                  <a
                    href={link.originalUrl}
                    className="text-gray-600 hover:text-blue-600"
                    target="_blank"
                    rel="noopener"
                  >
                    {link.originalUrl}
                  </a>
                </td>
                <td className="px-4 py-3 text-center">{link.totalClicks}</td>
                <td className="px-4 py-3">
                  {link.expirationType === 'datetime' && (
                    new Date(link.expiresAt).toLocaleDateString()
                  )}
                  {link.expirationType === 'clicks' && (
                    `${link.expireAfterClicks - link.totalClicks} clicks left`
                  )}
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded ${
                    link.isExpired ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {link.isExpired ? 'Expired' : 'Active'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => expireLink(link._id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Expire Now
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}