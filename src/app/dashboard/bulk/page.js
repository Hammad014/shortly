'use client'
import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import Papa from 'papaparse';
import { useShortenLink } from '../../hooks/ShortenUtility';
import { FiAlertTriangle, FiUploadCloud, FiPlay, FiStopCircle, FiDownloadCloud, FiInfo } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { ProtectedRoute } from '@/app/components/ProtectedRoute';
import DashboardLayout from '../layout'

export default function BulkShortener() {
  const { sessionId, fetchLinks } = useShortenLink();
  const [results, setResults] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [fileName, setFileName] = useState('');
  const [batchId, setBatchId] = useState('');
  const [fileContent, setFileContent] = useState([]);
  const [isStopped, setIsStopped] = useState(false);
  const [validationError, setValidationError] = useState('');

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 
      'text/csv': ['.csv'], 
      'text/plain': ['.txt'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls']
    },
    multiple: false,
    onDrop: files => handleFile(files[0]),
    disabled: processing
  });

  const validateFile = (urls) => {
    if(urls.length > 100) {
      setValidationError('Maximum 100 URLs per batch allowed');
      return false;
    }
    
    const invalidUrls = urls.filter(url => {
      try {
        new URL(url);
        return !url.startsWith('http://') && !url.startsWith('https://');
      } catch {
        return true;
      }
    });

    if(invalidUrls.length > 0) {
      setValidationError(`Found ${invalidUrls.length} invalid URLs starting with: ${invalidUrls[0]}`);
      return false;
    }

    setValidationError('');
    return true;
  };

  const handleFile = (file) => {
    if(file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || 
       file.type === 'application/vnd.ms-excel') {
      // Handle Excel files
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const urls = XLSX.utils.sheet_to_json(firstSheet, { header: 1 })
          .flat()
          .filter(url => typeof url === 'string')
          .map(url => url.trim())
          .filter(url => url.length > 0);

        if(validateFile(urls)) {
          setFileName(file.name);
          setFileContent(urls);
        }
      };
      reader.readAsArrayBuffer(file);
    } else {
      // Handle CSV/TXT
      Papa.parse(file, {
        complete: (results) => {
          const urls = results.data
            .flat()
            .filter(url => typeof url === 'string')
            .map(url => url.trim())
            .filter(url => url.length > 0);

          if(validateFile(urls)) {
            setFileName(file.name);
            setFileContent(urls);
          }
        },
        error: () => {
          setValidationError('Invalid file format. Please upload a valid file.');
        }
      });
    }
  };

  const processUrls = useCallback(async () => {
    setProcessing(true);
    setIsStopped(false);
    try {
      const sessionId = localStorage.getItem('sessionId');
      if (!sessionId) throw new Error('No active session found');

      const processedResults = [];
      for(const url of fileContent) {
        if(isStopped) break;
        
        try {
          const { data } = await axios.post('/api/bulk', { 
            urls: [url],
            sessionId
          });
          processedResults.push(data.results[0]);
          setResults(prev => [...prev, data.results[0]]);
        } catch (error) {
          processedResults.push({
            originalUrl: url,
            error: error.response?.data?.error || 'Processing failed'
          });
          setResults(prev => [...prev, {
            originalUrl: url,
            error: error.response?.data?.error || 'Processing failed'
          }]);
        }
      }

      setBatchId(`batch-${Date.now()}`);
      await fetchLinks();
    } catch (error) {
      alert(`Processing failed: ${error.response?.data?.error || error.message}`);
    }
    setProcessing(false);
  }, [fileContent, isStopped, fetchLinks]);

  const stopProcessing = () => {
    setIsStopped(true);
    setProcessing(false);
  };

  const downloadCSV = () => {
    const csvData = results.map(item => ({
      'Original URL': item.originalUrl,
      'Short URL': item.shortUrl || '',
      'Status': item.error || 'Success',
      'Tracking URL': item.shortUrl ? 
        `${item.shortUrl}?utm_source=bulk&utm_medium=csv` : ''
    }));

    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bulk-links-${batchId}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <ProtectedRoute>
      <DashboardLayout>
    <div className="min-h-screen sm:px-2 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-2xl p-6 mb-8 border border-slate-700"
        >
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-6 flex items-center gap-2">
            <FiUploadCloud className="text-purple-400" />
            Bulk URL Shortener
          </h1>

          <div className="mb-8 bg-slate-700/30 p-4 rounded-lg border border-slate-600">
            <div className="flex items-start gap-3">
              <FiInfo className="text-purple-400 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-slate-200 mb-2">How it works</h3>
                <ul className="list-disc pl-5 text-slate-400 space-y-2">
                  <li>Upload Excel/CSV/TXT files (max 100 URLs)</li>
                  <li>Files are scanned for security before processing</li>
                  <li>Real-time progress tracking with pause/resume</li>
                  <li>Download professionally formatted reports</li>
                </ul>
              </div>
            </div>
          </div>

          <motion.div 
            {...getRootProps()}
            whileHover={{ scale: 1.02 }}
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all
              ${isDragActive ? 'border-purple-500 bg-slate-700/20' : 'border-slate-600 hover:border-purple-400'}
              ${processing ? 'opacity-50 pointer-events-none' : ''}`}
          >
            <input {...getInputProps()} />
            <div className="space-y-4">
              <FiUploadCloud className="mx-auto h-12 w-12 text-slate-500" />
              <p className="text-slate-400">
                {isDragActive ? 'Drop file here' : 'Drag & drop files or click to browse'}
              </p>
              <p className="text-sm text-slate-500">Supported formats: XLSX, CSV, TXT (max 100 URLs)</p>
            </div>
          </motion.div>

          {validationError && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4 p-3 bg-red-400/10 border border-red-400/30 rounded-lg flex items-center gap-2 text-red-400"
            >
              <FiAlertTriangle />
              {validationError}
            </motion.div>
          )}

          {fileName && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4 p-4 bg-slate-800/30 rounded-lg border border-slate-700"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-200">{fileName}</p>
                  <p className="text-sm text-slate-500">
                    {fileContent.length} URLs detected • {results.length} processed
                  </p>
                </div>
                <div className="flex gap-3">
                  {!processing && fileContent.length > 0 && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      onClick={processUrls}
                      disabled={processing || results.length > 0}
                      className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      <FiPlay /> Start Processing
                    </motion.button>
                  )}
                  {processing && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      onClick={stopProcessing}
                      className="px-4 py-2 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-lg hover:from-red-700 hover:to-pink-700 flex items-center gap-2"
                    >
                      <FiStopCircle /> Stop Processing
                    </motion.button>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {results.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-8 border border-slate-700 rounded-lg overflow-hidden bg-slate-800/20"
            >
              <div className="bg-slate-800/30 p-4 border-b border-slate-700 flex items-center justify-between">
                <h3 className="font-semibold text-slate-200">Processing Results</h3>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={downloadCSV}
                  className="px-4 py-2 bg-gradient-to-r from-green-600 to-cyan-600 text-white rounded-lg hover:from-green-700 hover:to-cyan-700 flex items-center gap-2"
                >
                  <FiDownloadCloud /> Download CSV
                </motion.button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-800/40">
                    <tr>
                      <th className="px-4 py-3 text-left text-slate-300 font-medium">Original URL</th>
                      <th className="px-4 py-3 text-left text-slate-300 font-medium">Short URL</th>
                      <th className="px-4 py-3 text-left text-slate-300 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700">
                    {results.map((item, index) => (
                      <motion.tr
                        key={index}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="hover:bg-slate-800/30 transition-colors"
                      >
                        <td className="px-4 py-3 max-w-xs truncate text-slate-400">{item.originalUrl}</td>
                        <td className="px-4 py-3">
                          {item.shortUrl && (
                            <a
                              href={item.shortUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-400 hover:text-blue-300 transition-colors"
                            >
                              {item.shortUrl}
                            </a>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${
                            item.error ? 'bg-red-400/20 text-red-400' : 'bg-green-400/20 text-green-400'
                          }`}>
                            {item.error || 'Success'}
                          </span>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {processing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-6 p-4 bg-blue-400/10 rounded-lg flex items-center gap-3 text-blue-400 border border-blue-400/20"
            >
              <div className="animate-pulse h-3 w-3 bg-blue-400 rounded-full"></div>
              <span className="animate-pulse">Processing {results.length} of {fileContent.length} URLs...</span>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
    </DashboardLayout>
    </ProtectedRoute>
  );
}