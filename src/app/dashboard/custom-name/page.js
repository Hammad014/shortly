'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { FiCopy, FiTrash2, FiEdit, FiCheck, FiX, FiSearch, FiArrowUp, FiArrowDown, FiDownload} from 'react-icons/fi';
import { QRCodeCanvas as QRCode } from 'qrcode.react';
import { LuQrCode } from "react-icons/lu";
import { Modal } from '../../components/Modal';
import { ProtectedRoute } from '@/app/components/ProtectedRoute';
import DashboardLayout from '../layout'

export default function CustomNamesPage() {
  const { sessionId } = useAuth();
  const [links, setLinks] = useState([]);
  const [filteredLinks, setFilteredLinks] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });
  const [selectedLinks, setSelectedLinks] = useState([]);
  const [qrCodeData, setQrCodeData] = useState(null);
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    const fetchLinks = async () => {
      const res = await fetch(`/api/links?sessionId=${sessionId}`);
      const data = await res.json();
      setLinks(data.filter(link => link.customAlias));
    };
    sessionId && fetchLinks();
  }, [sessionId]);

  useEffect(() => {
    let filtered = links.filter(link => 
      link.customAlias.toLowerCase().includes(searchTerm.toLowerCase()) ||
      link.originalUrl.toLowerCase().includes(searchTerm.toLowerCase())
    );

    filtered.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });

    setFilteredLinks(filtered);
  }, [links, searchTerm, sortConfig]);

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const validateAlias = async (alias) => {
    if (!/^[a-z0-9_-]{3,20}$/.test(alias)) {
      setValidationError('Invalid format (3-20 lowercase letters, numbers, - or _)');
      return false;
    }

    try {
      const res = await fetch(`/api/links/validate?alias=${alias}`);
      const data = await res.json();
      if (!data.available) {
        setValidationError('Alias already in use');
        return false;
      }
      setValidationError('');
      return true;
    } catch (error) {
      setValidationError('Validation failed');
      return false;
    }
  };

  const handleUpdate = async (linkId) => {
    const isValid = await validateAlias(editValue);
    if (!isValid) return;
  
    try {
      const res = await fetch(`/api/links?id=${linkId}&sessionId=${sessionId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customAlias: editValue })
      });
  
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Update failed');
      }
  
      setLinks(links.map(link => 
        link._id === linkId ? { ...link, customAlias: editValue } : link
      ));
      cancelEdit();
    } catch (error) {
      console.error('Update failed:', error);
      setValidationError(error.message);
    }
  };

  // Add these functions inside your CustomNamesPage component
const handleDelete = async (linkId) => {
  if (confirm('Are you sure you want to delete this custom alias?')) {
    try {
      const res = await fetch(`/api/links?id=${linkId}&sessionId=${sessionId}`, {
        method: 'DELETE'
      });
      
      if (res.ok) {
        setLinks(links.filter(link => link._id !== linkId));
      }
    } catch (error) {
      console.error('Delete failed:', error);
    }
  }
};

const cancelEdit = () => {
  setEditingId(null);
  setEditValue('');
  setValidationError('');
};

  const handleBulkDelete = async () => {
    if (confirm(`Delete ${selectedLinks.length} selected aliases permanently?`)) {
      try {
        const res = await fetch('/api/links/bulk', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ids: selectedLinks })
        });

        if (res.ok) {
          setLinks(links.filter(link => !selectedLinks.includes(link._id)));
          setSelectedLinks([]);
        }
      } catch (error) {
        console.error('Bulk delete failed:', error);
      }
    }
  };

  const exportToCSV = () => {
    const csvContent = [
      ['Custom Alias', 'Original URL', 'Clicks', 'Created Date'],
      ...filteredLinks.map(link => [
        link.customAlias,
        link.originalUrl,
        link.totalClicks,
        new Date(link.date).toLocaleDateString()
      ])
    ].map(e => e.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'custom-aliases.csv';
    a.click();
  };

  return (
  <ProtectedRoute>
    <DashboardLayout>
      <div className="max-w-6xl mx-auto min-h-screen bg-gray-900">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold text-gray-100 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text ">
            Managed Custom Aliases
          </h1>
          
          <div className="flex gap-4 w-full md:w-auto">
            <div className="relative flex-1">
              <FiSearch className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search aliases..."
                className="pl-10 pr-4 py-2 bg-gray-800 rounded-lg text-gray-100 w-full border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <button
              onClick={exportToCSV}
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center gap-2 text-gray-300 hover:text-white transition-colors border border-gray-700"
            >
              <FiDownload className="text-blue-400" /> Export
            </button>
          </div>
        </div>
  
        <div className="mb-6 flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <span className="text-gray-400">Sort by:</span>
            <button
              onClick={() => handleSort('customAlias')}
              className="px-3 py-1.5 bg-gray-800 rounded-lg flex items-center gap-1 text-gray-300 hover:bg-gray-700 transition-colors"
            >
              Name {sortConfig.key === 'customAlias' && (
                sortConfig.direction === 'asc' ? <FiArrowUp /> : <FiArrowDown />
              )}
            </button>
            <button
              onClick={() => handleSort('totalClicks')}
              className="px-3 py-1.5 bg-gray-800 rounded-lg flex items-center gap-1 text-gray-300 hover:bg-gray-700 transition-colors"
            >
              Clicks {sortConfig.key === 'totalClicks' && (
                sortConfig.direction === 'asc' ? <FiArrowUp /> : <FiArrowDown />
              )}
            </button>
            <button
              onClick={() => handleSort('date')}
              className="px-3 py-1.5 bg-gray-800 rounded-lg flex items-center gap-1 text-gray-300 hover:bg-gray-700 transition-colors"
            >
              Date {sortConfig.key === 'date' && (
                sortConfig.direction === 'asc' ? <FiArrowUp /> : <FiArrowDown />
              )}
            </button>
          </div>
  
          {selectedLinks.length > 0 && (
            <button
              onClick={handleBulkDelete}
              className="ml-4 px-4 py-2 bg-red-600/20 hover:bg-red-600/30 rounded-lg flex items-center gap-2 text-red-400 hover:text-red-300 transition-colors border border-red-500/30"
            >
              <FiTrash2 /> Delete Selected ({selectedLinks.length})
            </button>
          )}
        </div>
  
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredLinks.map(link => (
            <div key={link._id} className="bg-gray-800 rounded-xl p-4 border border-gray-700 hover:border-blue-500/50 transition-colors group relative">
              <div className="flex items-start gap-3 mb-4">
                <input
                  type="checkbox"
                  checked={selectedLinks.includes(link._id)}
                  onChange={(e) => setSelectedLinks(prev => 
                    e.target.checked ? [...prev, link._id] : prev.filter(id => id !== link._id)
                  )}
                  className="w-4 h-4 accent-blue-500 mt-1.5"
                />
                
                <div className="flex-1 min-w-0">
                  {editingId === link._id ? (
                    <div className="relative">
                      <input
                        value={editValue}
                        onChange={(e) => {
                          setEditValue(e.target.value.toLowerCase());
                          setValidationError('');
                        }}
                        className="bg-gray-700 text-gray-100 px-3 py-1.5 rounded w-full text-sm focus:ring-1 focus:ring-blue-500 border border-gray-600"
                      />
                      {validationError && (
                        <div className="absolute -bottom-5 text-red-400 text-xs">
                          {validationError}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <h3 className="text-blue-400 font-mono truncate text-sm">
                        {link.customAlias}
                      </h3>
                      <p className="text-gray-400 truncate text-xs">
                        → {link.originalUrl}
                      </p>
                    </div>
                  )}
                </div>
  
                <div className="flex items-center gap-1.5 ml-2">
                  <button
                    onClick={() => navigator.clipboard.writeText(link.fullShortUrl)}
                    className="text-gray-400 hover:text-blue-400 p-1.5 rounded-lg hover:bg-gray-700/50 transition-colors"
                    title="Copy"
                  >
                    <FiCopy className="text-sm" />
                  </button>
                  <button
                    onClick={() => setQrCodeData(link.fullShortUrl)}
                    className="text-gray-400 hover:text-green-400 p-1.5 rounded-lg hover:bg-gray-700/50 transition-colors"
                    title="QR Code"
                  >
                    <LuQrCode className="text-sm" />
                  </button>
                  <button
                    onClick={() => editingId === link._id ? cancelEdit() : setEditingId(link._id)}
                    className="text-gray-400 hover:text-yellow-400 p-1.5 rounded-lg hover:bg-gray-700/50 transition-colors"
                    title={editingId === link._id ? "Cancel" : "Edit"}
                  >
                    {editingId === link._id ? <FiX className="text-sm" /> : <FiEdit className="text-sm" />}
                  </button>
                  <button
                    onClick={() => handleDelete(link._id)}
                    className="text-gray-400 hover:text-red-400 p-1.5 rounded-lg hover:bg-gray-700/50 transition-colors"
                    title="Delete"
                  >
                    <FiTrash2 className="text-sm" />
                  </button>
                </div>
              </div>
  
              {editingId === link._id && (
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => handleUpdate(link._id)}
                    className="px-3 py-1.5 bg-green-600/20 hover:bg-green-600/30 text-green-400 rounded-lg text-sm flex items-center gap-1 border border-green-500/30"
                    disabled={!!validationError}
                  >
                    <FiCheck className="text-xs" /> Save
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="px-3 py-1.5 bg-gray-700/20 hover:bg-gray-700/30 text-gray-400 rounded-lg text-sm border border-gray-600/30"
                  >
                    Cancel
                  </button>
                </div>
              )}
  
              <div className="pt-3 mt-3 border-t border-gray-700/50">
                <div className="flex justify-between text-xs text-gray-400">
                  <span>Clicks:</span>
                  <span className="text-blue-400 font-medium">{link.totalClicks}</span>
                </div>
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>Created:</span>
                  <span className="text-gray-300">{new Date(link.date).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
  
        {filteredLinks.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            {searchTerm ? 'No matching aliases found' : 'No custom aliases created yet. Create one using the URL shortener!'}
          </div>
        )}
  
        <Modal isOpen={!!qrCodeData} onClose={() => setQrCodeData(null)}>
          {qrCodeData && (
            <div className="text-center p-6 bg-gray-800 rounded-xl">
              <QRCode value={qrCodeData} size={256} className="mx-auto" />
              <button
                onClick={() => {
                  const canvas = document.querySelector('canvas');
                  const url = canvas.toDataURL();
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `${qrCodeData.split('/').pop()}-qrcode.png`;
                  a.click();
                }}
                className="mt-4 px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 rounded-lg border border-blue-500/30 transition-colors"
              >
                Download QR Code
              </button>
            </div>
          )}
        </Modal>
      </div>
    </DashboardLayout>
      </ProtectedRoute>
    );
  }