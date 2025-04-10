//components/CustomAliasField.js

'use client';
import { useState, useEffect } from 'react';
import { FiCheck, FiX, FiLoader } from 'react-icons/fi';

export default function CustomAliasField({ value, onChange, baseUrl }) {
  const [status, setStatus] = useState({ state: 'idle', message: '' });

  useEffect(() => {
    const validateAlias = async () => {
      if (!value) {
        setStatus({ state: 'idle', message: '' });
        return;
      }

      try {
        setStatus({ state: 'loading', message: 'Checking availability...' });
        const res = await fetch(`/api/links/validate?alias=${value}`);
        const data = await res.json();
        
        if (data.valid) {
          setStatus({ state: 'valid', message: data.message });
        } else {
          setStatus({ state: 'invalid', message: data.message });
        }
      } catch (error) {
        setStatus({ state: 'error', message: 'Validation failed' });
      }
    };

    const timeout = setTimeout(validateAlias, 500);
    return () => clearTimeout(timeout);
  }, [value]);

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-gray-300">
        <span className="text-sm">{baseUrl}/</span>
        <div className="relative flex-1">
          <input
            value={value}
            onChange={(e) => onChange(e.target.value.toLowerCase())}
            placeholder="custom-alias"
            className={`w-full px-3 py-2 rounded-lg border-2 bg-gray-800 focus:outline-none transition-all ${
              status.state === 'valid' ? 'border-green-500' :
              status.state === 'invalid' ? 'border-red-500' :
              'border-gray-600 focus:border-blue-500'
            }`}
            maxLength={20}
          />
          <div className="absolute right-3 top-2.5">
            {status.state === 'valid' && <FiCheck className="text-green-500 text-lg" />}
            {status.state === 'invalid' && <FiX className="text-red-500 text-lg" />}
            {status.state === 'loading' && (
              <FiLoader className="animate-spin text-gray-400 text-lg" />
            )}
          </div>
        </div>
      </div>
      
      {status.message && (
        <p className={`text-sm ${
          status.state === 'valid' ? 'text-green-400' :
          status.state === 'invalid' ? 'text-red-400' :
          'text-gray-400'
        }`}>
          {status.message}
        </p>
      )}
    </div>
  );
}