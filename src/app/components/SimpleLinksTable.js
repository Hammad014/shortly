'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { FaRegCopy } from "react-icons/fa";
import { Tooltip, IconButton } from '@mui/material';
import copy from 'copy-to-clipboard';

export default function SimpleLinksTable({ 
  links, 
  showAll, 
  setShowAll,
  copiedLink,
  handleCopyWithMessage
}) {
    if (!links || links.length === 0) return null;
  const getStatusBadge = (link) => {
    const isExpired = link.status === 'expired' || 
                     (link.expirationType === 'datetime' && new Date(link.expiresAt) < new Date()) ||
                     (link.expirationType === 'clicks' && link.totalClicks >= link.expireAfterClicks);
  
    return isExpired ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400';
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-lg rounded-xl overflow-hidden shadow-2xl">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px]">
          <thead className="bg-slate-700/50">
            <tr className="text-left text-slate-400">
              <th className="px-4 py-3 md:px-6 md:py-4">Short Link</th>
              <th className="px-4 py-3 md:px-6 md:py-4">Original Link</th>
              <th className="px-4 py-3 md:px-6 md:py-4">Status</th>
              <th className="px-4 py-3 md:px-6 md:py-4">Created</th>
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
                  <td className="px-4 py-3 md:px-6 md:py-4">
                    <span className={`px-3 py-1 rounded-full text-sm md:text-base ${getStatusBadge(link)}`}>
                      {link.status === 'expired' ? 'Expired' : 
                       (link.expirationType === 'datetime' && new Date(link.expiresAt) < new Date()) ? 
                       'Expired' : 'Active'}
                    </span>
                  </td>
                  <td className="px-4 py-3 md:px-6 md:py-4 text-slate-400 text-sm md:text-base">
                    {new Date(link.date).toLocaleDateString()}
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
  );
}