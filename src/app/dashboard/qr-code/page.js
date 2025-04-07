'use client';
import { useState, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { QRCodeSVG } from 'qrcode.react';
import { Download, RefreshCw, Link2, ClipboardPaste } from 'lucide-react';
import {ProtectedRoute} from '@/app/components/ProtectedRoute';
import DashboardLayout from '../layout'

// Custom UI Components
const Button = ({ children, className, ...props }) => (
  <button
    className={`px-6 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${className}`}
    {...props}
  >
    {children}
  </button>
);

const Input = ({ className, ...props }) => (
  <input
    className={`w-full p-3 rounded-lg bg-gray-800 border-2 border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 text-gray-100 placeholder-gray-400 ${className}`}
    {...props}
  />
);

const Label = ({ children, className }) => (
  <label className={`block text-sm font-medium mb-2 text-gray-300 ${className}`}>
    {children}
  </label>
);

const ChromePicker = dynamic(
  () => import('react-color').then((mod) => mod.ChromePicker),
  { ssr: false, loading: () => <div className="h-[200px] bg-gray-800 rounded-lg animate-pulse" /> }
);

// Color presets
const COLOR_PRESETS = [
  { fg: '#000000', bg: '#ffffff', name: 'Classic' },
  { fg: '#2563eb', bg: '#f3f4f6', name: 'Blue Steel' },
  { fg: '#dc2626', bg: '#fef2f2', name: 'Red Alert' },
  { fg: '#16a34a', bg: '#f0fdf4', name: 'Green Nature' },
  { fg: '#7c3aed', bg: '#f5f3ff', name: 'Purple Haze' },
  { fg: '#ea580c', bg: '#fff7ed', name: 'Orange Crush' },
];

export default function QrCodeGenerator() {
  const initialFormState = {
    url: '',
    fgColor: '#000000',
    bgColor: '#ffffff',
    size: 300,
    errorLevel: 'H',
    logo: null,
  };

  const [formData, setFormData] = useState(initialFormState);
  const [qrCode, setQrCode] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  // Auto-paste functionality
  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setFormData(prev => ({ ...prev, url: text }));
      }
    } catch (err) {
      setError('Clipboard access denied. Please paste manually.');
    }
  };

  // Reset all fields
  const resetForm = () => {
    setFormData(initialFormState);
    setQrCode(null);
    setLogoPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setError('File size must be less than 2MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => setLogoPreview(e.target.result);
    reader.readAsDataURL(file);
  };

  const generateQRCode = async () => {
    try {
      setLoading(true);
      setError('');

      if (!formData.url) {
        setError('URL is required');
        return;
      }

      const formPayload = new FormData();
      formPayload.append('url', formData.url);
      formPayload.append('fgColor', formData.fgColor);
      formPayload.append('bgColor', formData.bgColor);
      formPayload.append('size', formData.size);
      formPayload.append('errorLevel', formData.errorLevel);
      if (fileInputRef.current?.files[0]) {
        formPayload.append('logo', fileInputRef.current.files[0]);
      }

      const response = await fetch('/api/qrcode/generate', {
        method: 'POST',
        body: formPayload
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to generate QR code');

      setQrCode({
        ...data.formats,
        displayUrl: formData.url,
        logo: logoPreview
      });

      resetForm();

    } catch (err) {
      setError(err.message || 'Failed to generate QR code');
    } finally {
      setLoading(false);
    }
  };

  const downloadQR = (format) => {
    if (!qrCode?.[format]) {
      setError('File not available yet');
      return;
    }
    
    const link = document.createElement('a');
    link.download = `qr-${Date.now()}.${format}`;
    link.href = qrCode[format];
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Dummy QR code preview
  const showDummy = !qrCode && (formData.fgColor || formData.bgColor || formData.size);

  return (
    <ProtectedRoute>
      <DashboardLayout>
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="max-w-4xl mx-auto rounded-2xl p-8 bg-gray-800/50 backdrop-blur-lg shadow-2xl">
        <h1 className="text-4xl font-bold text-white mb-10 text-center">
          <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            QR Code Generator
          </span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-8">
            <div>
              <Label>Destination URL</Label>
              <div className="flex gap-2">
                <Input
                  value={formData.url}
                  onChange={(e) => handleInputChange('url', e.target.value)}
                  placeholder="https://example.com"
                />
                <Button
                  onClick={handlePaste}
                  className="bg-gray-700 hover:bg-gray-600"
                  title="Paste from clipboard"
                >
                  <ClipboardPaste className="w-5 h-5 text-white" />
                </Button>
              </div>
            </div>

            <div>
              <Label>Color Presets</Label>
              <div className="grid grid-cols-3 gap-3 mb-4">
                {COLOR_PRESETS.map((preset, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      handleInputChange('fgColor', preset.fg);
                      handleInputChange('bgColor', preset.bg);
                    }}
                    className="h-10 rounded-lg border-2 border-gray-600 overflow-hidden relative group"
                    title={preset.name}
                  >
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                    <div className="w-full h-full flex">
                      <div className="flex-1" style={{ backgroundColor: preset.fg }} />
                      <div className="flex-1" style={{ backgroundColor: preset.bg }} />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label>Foreground Color</Label>
                <div className="rounded-xl overflow-hidden shadow-lg">
                  <ChromePicker
                    color={formData.fgColor}
                    onChangeComplete={(color) => handleInputChange('fgColor', color.hex)}
                  />
                </div>
              </div>
              <div>
                <Label>Background Color</Label>
                <div className="rounded-xl overflow-hidden shadow-lg">
                  <ChromePicker
                    color={formData.bgColor}
                    onChangeComplete={(color) => handleInputChange('bgColor', color.hex)}
                  />
                </div>
              </div>
            </div>

            <div>
              <Label>Company Logo (Optional)</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                ref={fileInputRef}
                className="file:bg-blue-600 file:text-white file:border-0 file:rounded-lg file:px-4 file:py-2 hover:file:bg-blue-700"
              />
            </div>

            <div className="space-y-6">
              <div>
                <Label>QR Code Size ({formData.size}px)</Label>
                <input
                  type="range"
                  min="100"
                  max="1000"
                  value={formData.size}
                  onChange={(e) => handleInputChange('size', parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer range-lg accent-blue-500"
                />
              </div>

              <div>
                <Label>Error Correction</Label>
                <select
                  value={formData.errorLevel}
                  onChange={(e) => handleInputChange('errorLevel', e.target.value)}
                  className="w-full p-3 rounded-lg bg-gray-700 border-2 border-gray-600 text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
                >
                  {['L', 'M', 'Q', 'H'].map(level => (
                    <option key={level} value={level} className="bg-gray-800">Level {level}</option>
                  ))}
                </select>
              </div>
            </div>

            {error && <div className="p-3 rounded-lg bg-red-500/20 text-red-300 text-sm">{error}</div>}

            <Button
              onClick={generateQRCode}
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Link2 className="w-5 h-5" />
                  Generate QR Code
                </>
              )}
            </Button>
          </div>

          {/* Preview Panel */}
          <div className="flex flex-col items-center justify-center p-8 rounded-xl bg-gray-700/30">
            {qrCode ? (
              <div className="w-full space-y-8">
                <div className="relative mb-8 flex justify-center">
                  <div 
                    className="p-4 bg-white rounded-xl shadow-2xl"
                    style={{ backgroundColor: formData.bgColor }}
                  >
                    <QRCodeSVG
                      value={qrCode.displayUrl}
                      size={formData.size}
                      bgColor={formData.bgColor}
                      fgColor={formData.fgColor}
                      level={formData.errorLevel}
                      className="rounded-lg"
                    />
                    {qrCode.logo && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <img
                          src={qrCode.logo}
                          alt="Logo"
                          className="object-contain"
                          style={{ 
                            width: `${formData.size * 0.2}px`,
                            height: `${formData.size * 0.2}px`,
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button
                    onClick={() => downloadQR('png')}
                    className="bg-gray-700 hover:bg-gray-600 text-gray-100"
                  >
                    <Download className="w-5 h-5" />
                    PNG
                  </Button>
                  <Button
                    onClick={() => downloadQR('svg')}
                    className="bg-gray-700 hover:bg-gray-600 text-gray-100"
                  >
                    <Download className="w-5 h-5" />
                    SVG
                  </Button>
                  <Button
                    onClick={() => downloadQR('pdf')}
                    className="bg-gray-700 hover:bg-gray-600 text-gray-100"
                  >
                    <Download className="w-5 h-5" />
                    PDF
                  </Button>
                </div>
              </div>
            ) : (
              <div className="w-full space-y-8">
                <div className="relative mb-8 flex justify-center">
                  <div 
                    className="p-4 bg-white rounded-xl shadow-2xl"
                    style={{ backgroundColor: formData.bgColor }}
                  >
                    {showDummy && (
                      <>
                        <QRCodeSVG
                          value="https://example.com/preview"
                          size={formData.size}
                          bgColor={formData.bgColor}
                          fgColor={formData.fgColor}
                          level={formData.errorLevel}
                          className="rounded-lg"
                        />
                        {logoPreview && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <img
                              src={logoPreview}
                              alt="Logo Preview"
                              className="object-contain"
                              style={{ 
                                width: `${formData.size * 0.2}px`,
                                height: `${formData.size * 0.2}px`,
                              }}
                            />
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
                <div className="text-gray-400 text-center p-8 rounded-xl bg-gray-800/30">
                  <p className="text-lg">{showDummy ? 'Live Preview' : 'Your QR code preview'}</p>
                  <p className="text-sm mt-2 text-gray-500">
                    {showDummy ? 'Adjust settings to see changes' : 'Configure options and generate QR code'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    </DashboardLayout>
    </ProtectedRoute>
  );
}