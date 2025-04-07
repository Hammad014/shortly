//dashboard/page.js

'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ShortenForm from '../components/ShortenForm'
import LinksTable from '../components/LinksTable'  // Use the same LinksTable component
import { useShortenLink } from '../hooks/ShortenUtility'
import { ProtectedRoute } from '../components/ProtectedRoute'
import DashboardLayout from './layout'

export default function DashboardHomePage() {
  const {
    autoPaste,
    inputValue,
    links = [],
    isLoading,
    handleSwitchClick,
    handleInputChange,
    buttonText,
    buttonClickHandler,
    handleCopyClick,
    copiedLink,
    showAll,
    setShowAll,
    deleteLink,
    handleEditClick,
    toggleCustomAlias,
    handleCustomAliasChange,
    fetchLinks,
  } = useShortenLink();

  const [stats, setStats] = useState({
    totalLinks: 0,
    totalClicks: 0,
    activeLinks: 0
  });

  const refreshLinks = async () => {
    const sessionId = localStorage.getItem("sessionId");
    if (sessionId) {
      await fetchLinks(sessionId);
    }
  };

  useEffect(() => {
    setStats({
      totalLinks: links.length,
      totalClicks: links.reduce((sum, link) => sum + (link.totalClicks || 0), 0),
      activeLinks: links.filter(link => link?.status === 'active').length
    });
  }, [links]);

  return (
    <>
    <ProtectedRoute>
    <DashboardLayout> 
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
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
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-gray-800/50 p-6 rounded-xl border border-gray-700 mb-8"
      >
        <h2 className="text-xl font-semibold mb-6 text-gray-100">
          Create New Short Link
        </h2>
        <ShortenForm
          handleCustomAliasChange={handleCustomAliasChange}
          toggleCustomAlias={toggleCustomAlias}
          inputValue={inputValue}
          handleInputChange={handleInputChange}
          buttonText={buttonText}
          buttonClickHandler={buttonClickHandler}
          autoPaste={autoPaste}
          handleSwitchClick={handleSwitchClick}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-gray-800/50 rounded-xl border border-gray-700"
      >

{links.length > 0 && (
    <>
        <LinksTable
            links={links}
            refreshLinks={refreshLinks} // Add this prop
            showAll={showAll}
            setShowAll={setShowAll}
            handleCopyWithMessage={handleCopyClick}
            copiedLink={copiedLink}
            handleEditClick={handleEditClick}
            deleteLink={deleteLink}
            fetchLinks={fetchLinks}
          />
  </>
  )}
      </motion.div>
      </DashboardLayout>
      </ProtectedRoute>
    </>
  );
}