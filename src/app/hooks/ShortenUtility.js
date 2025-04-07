// hooks/ShortenUtility.js
"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import copy from "copy-to-clipboard";

const useShortenLink = () => {
  const [autoPaste, setAutoPaste] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [shortenedUrl, setShortenedUrl] = useState("");
  const [originalUrl, setOriginalUrl] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copiedLinks, setCopiedLinks] = useState({});
  const [links, setLinks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState("");
  const [copiedLink, setCopiedLink] = useState(''); 
  const [showAll, setShowAll] = useState(false);
  // New states for custom alias
  const [customAlias, setCustomAlias] = useState('');
  const [isValidAlias, setIsValidAlias] = useState(false);
  const [showCustomAlias, setShowCustomAlias] = useState(false);
  const [aliasError, setAliasError] = useState('');

  const clearInput = () => {
    setInputValue("");
    setShortenedUrl("");
    setIsCopied(false);
    setCustomAlias("");
    setAliasError("");
  };

  const handleSwitchClick = async () => {
    let newAutoPasteState = autoPaste;
    try {
      if (!autoPaste) {
        const textFromClipboard = await navigator.clipboard.readText();
        setInputValue(textFromClipboard);
      }
    } catch (error) {
      console.error("Error reading from clipboard:", error);
    }
    setAutoPaste(!autoPaste);
  };

  useEffect(() => {
    const storedSessionId = localStorage.getItem("sessionId");
    if (storedSessionId) {
      setSessionId(storedSessionId);
      fetchLinks(false); // Initial fetch with bulk links shown
    } else {
      setLinks([]);
    }
  }, []);

  const fetchLinks = async (showBulk = true) => {
    try {
      const sessionId = localStorage.getItem("sessionId");
      if (!sessionId) return;
  
      const response = await axios.get(`/api/links?sessionId=${sessionId}&showBulk=${showBulk}`);
      
      setLinks(response.data.map(link => ({
        ...link,
        expiresAt: link.expiresAt ? new Date(link.expiresAt) : null,
        expireAfterClicks: Number(link.expireAfterClicks) || null,
        fullShortUrl: link.fullShortUrl,
        displayUrl: link.customAlias ? 
          `${process.env.NEXT_PUBLIC_BASE_URL}/${link.customAlias}` : 
          link.fullShortUrl
      })));
    } catch (error) {
      console.error("Error fetching links:", error);
    }
  };

  const deleteLink = async (linkId) => {
    try {
      const sessionId = localStorage.getItem("sessionId");
      if (!sessionId) throw new Error("No session found");

      await axios.delete(`/api/links`, {
        params: { 
          id: linkId,
          sessionId: sessionId 
        }
      });

      fetchLinks(sessionId);
      return true;
    } catch (error) {
      console.error("Error deleting link:", error);
      throw error;
    }
  };

  const handleEditClick = (originalUrl) => {
    setInputValue(originalUrl);
    setShortenedUrl("");
    setIsCopied(false);
  };

  const validateAlias = async (alias) => {
    setAliasError('');
    
    // Format validation
    if (!/^[a-z0-9_-]{3,20}$/.test(alias)) {
      setAliasError('Invalid format (3-20 chars: a-z, 0-9, _, -)');
      setIsValidAlias(false);
      return false;
    }

    // Availability check
    try {
      const res = await axios.get(`/api/links/validate?alias=${alias}`);
      if (!res.data.available) {
        setAliasError('Alias already in use');
        setIsValidAlias(false);
        return false;
      }
      setIsValidAlias(true);
      return true;
    } catch (error) {
      setAliasError('Validation failed');
      setIsValidAlias(false);
      return false;
    }
  };

  const shortenLink = async (alias = '') => {
    try {
      const response = await axios.post("/api/links", {
        originalUrl: inputValue,
        sessionId,
        customAlias: alias || undefined
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  };

 const createNewSession = async () => {
  try {
    const response = await fetch('/api/session', {
      method: 'POST',
      credentials: 'include'
    });
    const sessionData = await response.json();
    localStorage.setItem("sessionId", sessionData.sessionId);
    return sessionData.sessionId;
  } catch (error) {
    console.error('Session creation failed:', error);
    throw error;
  }
};

  // Updated handleShortenClick function
const handleShortenClick = async () => {
  if (!inputValue.trim()) return;
  setIsLoading(true);
  setAliasError('');

  try {
    let aliasToUse = '';
    if (showCustomAlias) {
      if (!customAlias) {
        setAliasError('Custom alias is required');
        return;
      }
      
      const isValid = await validateAlias(customAlias);
      if (!isValid) return;

      aliasToUse = customAlias;
    }

    let currentSessionId = sessionId;
    
    // Create new session if none exists
    if (!currentSessionId) {
      currentSessionId = await createNewSession();
    }

    // Shorten the link
    const response = await axios.post("/api/links", {
      originalUrl: inputValue,
      sessionId: currentSessionId,
      customAlias: aliasToUse || undefined
    });

    setShortenedUrl(response.data.shortUrl);
    setInputValue(response.data.shortUrl);
    await fetchLinks(currentSessionId);
    setCustomAlias("");
  } catch (error) {
    const errorMsg = error.response?.data?.error || 'Failed to create short link';
    setAliasError(errorMsg.includes('alias') ? errorMsg : '');
  } finally {
    setIsLoading(false);
  }
};

// Remove the old session creation block

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
    setShortenedUrl("");
    setIsCopied(false);
  };

  const handleCustomAliasChange = (value) => {
    const cleanedValue = value.toLowerCase().replace(/[^a-z0-9_-]/g, '');
    setCustomAlias(cleanedValue);
    setAliasError('');
  };

  

  const handleCopyClick = (url) => {
    copy(url);
    setCopiedLink(url);
    setTimeout(() => setCopiedLink(null), 1500);
  };

  const handleLinkClick = async (shortUrl, originalUrl) => {
    try {
      window.open(originalUrl, "_blank");
    } catch (error) {
      console.error("Error tracking link click:", error);
    }
  };

  

  const buttonText = shortenedUrl ? (isCopied ? "Copied!" : "Copy") : 
                   isLoading ? "Shortening..." : "Shorten";
  const buttonClickHandler = shortenedUrl ? 
    () => setIsCopied(copy(shortenedUrl)) : 
    handleShortenClick;

  return {
    autoPaste,
    setAutoPaste,
    inputValue,
    setInputValue,
    shortenedUrl,
    setShortenedUrl,
    originalUrl,
    setOriginalUrl,
    links,
    setLinks,
    handleSwitchClick,
    handleShortenClick,
    isLoading,
    handleInputChange,
    handleCopyClick,
    handleLinkClick,
    buttonText,
    buttonClickHandler,
    deleteLink,
    clearInput,
    copiedLink, 
    showAll, 
    setShowAll,
    deleteLink,
    handleEditClick,
    // New custom alias properties
    customAlias,
    isValidAlias,
    showCustomAlias,
    aliasError,
    handleCustomAliasChange,
    toggleCustomAlias: () => setShowCustomAlias(!showCustomAlias),
    fetchLinks,
  };
};

export { useShortenLink };
