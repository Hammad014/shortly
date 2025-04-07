// components/LinksTable.js
'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaRegCopy, FaEdit, FaTrash, FaClock } from "react-icons/fa";
import { LuMousePointerClick } from "react-icons/lu";
import { Tooltip, IconButton } from '@mui/material';
import { ConfirmationModal } from './ConfirmationModal';
import axios from 'axios';

export default function LinksTable({ 
  links, 
  showAll, 
  setShowAll,
  handleCopyWithMessage, 
  copiedLink,
  handleEditClick, 
  deleteLink,
  refreshLinks,
  fetchLinks
}) {
  if (!links || links.length === 0) return null;
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [linkToDelete, setLinkToDelete] = useState(null);
  const [expirationModalOpen, setExpirationModalOpen] = useState(false);
  const [selectedLink, setSelectedLink] = useState(null);
  const [expirationType, setExpirationType] = useState('none');
  const [expiresAt, setExpiresAt] = useState('');
  const [expireAfterClicks, setExpireAfterClicks] = useState('');
  const [showBulkLinks, setShowBulkLinks] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      setIsLoggedIn(!!token && !!user);
    };
    checkAuth();
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  const handleDeleteClick = (link) => {
    setLinkToDelete(link);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!linkToDelete) return;
    
    setDeletingId(linkToDelete._id);
    try {
      await deleteLink(linkToDelete._id);
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete link. Please try again.');
    } finally {
      setDeletingId(null);
      setShowDeleteModal(false);
      setLinkToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setLinkToDelete(null);
  };

  const handleSetExpiration = (link) => {
    setSelectedLink(link);
    setExpirationType(link.expirationType || 'none');
    setExpiresAt(link.expiresAt ? new Date(link.expiresAt).toISOString().slice(0,16) : '');
    setExpireAfterClicks(link.expireAfterClicks || '');
    setExpirationModalOpen(true);
  };

  const saveExpirationSettings = async () => {
    try {
      // Validate inputs
      if (expirationType === 'datetime' && !expiresAt) {
        alert('Please select an expiration date');
        return;
      }
      
      if (expirationType === 'clicks' && (!expireAfterClicks || expireAfterClicks < 1)) {
        alert('Click limit must be at least 1');
        return;
      }
  
      const payload = {
        id: selectedLink._id,
        expirationType,
        expiresAt: expirationType === 'datetime' ? new Date(expiresAt) : null,
        expireAfterClicks: expirationType === 'clicks' ? Number(expireAfterClicks) : null
      };
  
      const response = await axios.patch('/api/links', payload);
      
      if (refreshLinks) {
        await refreshLinks();
      }
      
      setExpirationModalOpen(false);
    } catch (error) {
      console.error('Error saving settings:', error.response?.data);
      alert(error.response?.data?.error || 'Failed to save settings');
    }
  };


  const getStatusBadge = (link) => {
    const isExpired = link.status === 'expired' || 
                     (link.expirationType === 'datetime' && new Date(link.expiresAt) < new Date()) ||
                     (link.expirationType === 'clicks' && link.totalClicks >= link.expireAfterClicks);
  
    return isExpired ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400';
  };


  const handleBulkToggle = () => {
    setShowBulkLinks(prev => !prev);
    fetchLinks(!showBulkLinks); // ✅ Only call when toggle changes
  };


useEffect(() => {
  const checkAuth = () => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    setIsLoggedIn(!!token && !!user);
  };
  checkAuth();
  window.addEventListener('storage', checkAuth);
  return () => window.removeEventListener('storage', checkAuth);
}, []);

// Custom toggle switch component
const ToggleSwitch = ({ checked, onChange }) => (
  <div 
    onClick={onChange}
    className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${
      checked ? 'bg-blue-600' : 'bg-slate-700'
    }`}
  >
    <motion.div
      className="w-4 h-4 bg-white rounded-full shadow-md"
      animate={{ x: checked ? 24 : 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    />
  </div>
);

  return (
    <>
      <ConfirmationModal
        isOpen={showDeleteModal}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        message="Are you sure you want to permanently delete this link?"
      />

        {/* Toggle Switch */}
      <div className="mb-4 flex items-center justify-end gap-4 bg-slate-800/50 p-4 rounded-lg">
        <span className="text-slate-300 text-sm">Show Bulk Links</span>
        <div 
          onClick={handleBulkToggle}
          className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${
            showBulkLinks ? 'bg-blue-600' : 'bg-slate-700'
          }`}
        >
          <motion.div
            className="w-4 h-4 bg-white rounded-full shadow-md"
            animate={{ x: showBulkLinks ? 24 : 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          />
        </div>
      </div>

      {/* Expiration Settings Modal */}
    
{expirationModalOpen && (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
  >
    <motion.div
      initial={{ scale: 0.95, y: 20 }}
      animate={{ scale: 1, y: 0 }}
      exit={{ scale: 0.95, y: 20 }}
      className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 max-w-md w-full border border-slate-700 shadow-2xl"
    >
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-6"
      >
        <h3 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Link Expiration Settings
        </h3>
        <button
          onClick={() => setExpirationModalOpen(false)}
          className="text-white hover:text-slate-200 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </motion.div>

      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <label className="block text-sm font-medium text-white mb-2">
            Expiration Type
          </label>
          <div className="relative">
            <select
              value={expirationType}
              onChange={(e) => setExpirationType(e.target.value)}
              className="w-full text-white bg-slate-700/50 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all border border-slate-600 appearance-none"
            >
              <option value="none" className="bg-slate-800">No Expiration</option>
              <option value="datetime" className="bg-slate-800">Expire at Date/Time</option>
              <option value="clicks" className="bg-slate-800">Expire After Clicks</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </motion.div>

        {expirationType === 'datetime' && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <label className="block text-sm font-medium text-white mb-2">
              Expiration Date & Time
            </label>
            <input
              type="datetime-local"
              value={expiresAt}
              onChange={(e) => setExpiresAt(e.target.value)}
              className="w-full text-white bg-slate-700/50 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all border border-slate-600"
              min={new Date().toISOString().slice(0,16)}
            />
          </motion.div>
        )}

        {expirationType === 'clicks' && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <label className="block text-sm font-medium text-white mb-2">
              Click Limit
            </label>
            <input
              type="number"
              min="1"
              value={expireAfterClicks}
              onChange={(e) => setExpireAfterClicks(e.target.value)}
              className="w-full text-white bg-slate-700/50 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all border border-slate-600"
              placeholder="Enter click limit"
            />
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex gap-3 justify-end mt-6"
        >
          <button
            onClick={() => setExpirationModalOpen(false)}
            className="px-5 py-2.5 rounded-lg border border-slate-600 hover:border-slate-400 text-slate-300 hover:text-slate-100 transition-all duration-300 flex items-center gap-2"
          >
            <span>Cancel</span>
          </button>
          <button
            onClick={saveExpirationSettings}
            className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-400 hover:to-purple-400 rounded-lg text-white font-medium transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20 flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span>Save Changes</span>
          </button>
        </motion.div>
      </div>
    </motion.div>
  </motion.div>
)}

      <div className="bg-slate-800/50 backdrop-blur-lg rounded-xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead className="bg-slate-700/50">
              <tr className="text-left text-slate-400">
                <th className="px-4 py-3 md:px-6 md:py-4">Short Link</th>
                <th className="px-4 py-3 md:px-6 md:py-4">Original Link</th>
                <th className="px-4 py-3 md:px-6 md:py-4 text-center">Clicks</th>
                <th className="px-4 py-3 md:px-6 md:py-4">Status</th>
                <th className="px-4 py-3 md:px-6 md:py-4">Expiration</th>
                <th className="px-4 py-3 md:px-6 md:py-4">Created</th>
                <th className="px-4 py-3 md:px-6 md:py-4">Source</th>
                <th className="px-4 py-3 md:px-6 md:py-4">Actions</th>
                
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
              {(showAll ? links : links.slice(0, 5)).map((link) => (
                  <motion.tr
                    key={link._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="group border-t border-slate-700/30 hover:bg-slate-700/20 transition-colors"
                  >
                    <td className="px-4 py-3 md:px-6 md:py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-blue-400 font-mono text-sm md:text-base truncate max-w-[150px] md:max-w-[250px]">
                          {link.fullShortUrl}
                        </span>
                        <Tooltip title="Copy">
                          <motion.div className="relative">
                            <IconButton
                              onClick={() => handleCopyWithMessage(link.fullShortUrl)}
                              className="text-slate-400 hover:text-blue-500"
                            >
                              <FaRegCopy className="text-white text-sm md:text-base" />
                            </IconButton>
                            {copiedLink === link.fullShortUrl && (
                              <motion.span
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 bg-green-500/20 text-green-400 text-sm rounded-md"
                              >
                                Copied!
                              </motion.span>
                            )}
                          </motion.div>
                        </Tooltip>
                      </div>
                    </td>
                    <td className="px-4 py-3 md:px-6 md:py-4 max-w-[200px] md:max-w-[400px] truncate">
                      <a
                        href={link.originalUrl}
                        className="text-slate-300 hover:text-blue-400 transition-colors text-sm md:text-base"
                        target="_blank"
                        rel="noopener"
                      >
                        {link.originalUrl}
                      </a>
                    </td>
                    <td className="px-4 py-3 md:px-6 md:py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <LuMousePointerClick className="text-blue-400" />
                        <span className="font-medium text-white">{link.totalClicks}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 md:px-6 md:py-4">
  <span className={`px-3 py-1 rounded-full text-sm md:text-base ${getStatusBadge(link)}`}>
    {link.status === 'expired' ? 'Expired' : (
      link.expirationType === 'datetime' && new Date(link.expiresAt) < new Date() ? 
      'Expired' : 
      'Live' // Changed from 'Active' to 'Live'
    )}
  </span>
</td>
                    <td className="px-4 py-3 md:px-6 md:py-4 text-slate-400 text-sm md:text-base">
  {link.expirationType === 'datetime' && link.expiresAt ? (
    new Date(link.expiresAt) > new Date() ? (
      `Expires ${new Date(link.expiresAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })}`
    ) : 'Expired'
  ) : link.expirationType === 'clicks' ? (
    link.totalClicks < link.expireAfterClicks ? 
      `${link.expireAfterClicks - link.totalClicks} clicks left` : 
      'Expired'
  ) : 'Never expires'}
</td>
                    <td className="px-4 py-3 md:px-6 md:py-4 text-slate-400 text-sm md:text-base">
                      {new Date(link.date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 md:px-6 md:py-4">
  {link.source === 'bulk' ? (
    <span className="bg-purple-500/20 text-purple-400 px-2 py-1 rounded-full text-xs">
      Bulk
    </span>
  ) : (
    <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full text-xs">
      Single
    </span>
  )}
</td>
                      <td className="px-4 py-3 md:px-6 md:py-4">
                        <div className="flex gap-2">
                          <Tooltip title="Set Expiration">
                            <IconButton
                              onClick={() => handleSetExpiration(link)}
                              className="text-slate-400 hover:text-blue-500"
                            >
                              <FaClock className="text-white text-sm md:text-base" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Edit">
                            <IconButton
                              onClick={() => handleEditClick(link.originalUrl)}
                              className="text-slate-400 hover:text-blue-500"
                            >
                              <FaEdit className="text-white text-sm md:text-base" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton
                              onClick={() => handleDeleteClick(link)}
                              disabled={deletingId === link._id}
                              className="text-slate-400 hover:text-red-500 disabled:opacity-50"
                            >
                              {deletingId === link._id ? (
                                <div className="animate-spin">⏳</div>
                              ) : (
                                <FaTrash className="text-white text-sm md:text-base" />
                              )}
                            </IconButton>
                          </Tooltip>
                        </div>
                      </td>
                      
                    
                    
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {links.length > 5 && (
          <div className="border-t border-slate-700/30 p-4 flex justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAll(!showAll)}
              className="px-6 py-2 cursor-pointer bg-slate-700/50 hover:bg-slate-700 rounded-lg text-slate-300 flex items-center gap-2 transition-all"
            >
              {showAll ? 'Show Less' : 'Show More'}
            </motion.button>
          </div>
        )}
      </div>
    </>
  );
}