'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function Preview({ targetUrl, metadata }) {
  const [seconds, setSeconds] = useState(5);
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          startRedirect();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const startRedirect = () => {
    if (!redirecting) {
      setRedirecting(true);
      window.location.href = targetUrl;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-lg z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl max-w-xl w-full overflow-hidden shadow-2xl transform transition-all duration-300 hover:shadow-3xl">
        {/* Preview Image */}
        {metadata?.image?.url ? (
          <div className="relative h-56 bg-gradient-to-r from-blue-100 to-purple-100">
            <Image
              src={metadata.image.url}
              alt={metadata.title}
              fill
              className="object-cover transition-transform duration-300 hover:scale-105"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          </div>
        ) : (
          <div className="relative h-56 bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
            <div className="flex flex-col items-center text-gray-500">
              <div className="mb-4 p-4 bg-white rounded-full shadow-lg">
                <Image
                  src={metadata.favicon}
                  alt="Favicon"
                  width={48}
                  height={48}
                  className="rounded-lg"
                  unoptimized
                />
              </div>
              <span className="font-medium text-gray-600">No preview available</span>
            </div>
          </div>
        )}

        <div className="p-6 space-y-4">
          <div className="flex items-start gap-4">
            <div className="shrink-0 p-2 bg-white rounded-lg shadow-md">
              <Image
                src={metadata.favicon}
                alt="Site favicon"
                width={40}
                height={40}
                className="rounded"
                unoptimized
              />
            </div>
            <div className="space-y-1">
              <h2 className="text-2xl font-bold text-gray-900 line-clamp-2 leading-tight">
                {metadata.title}
              </h2>
              {metadata.siteName && (
                <div className="text-sm text-purple-600 font-medium">
                  {metadata.siteName}
                </div>
              )}
            </div>
          </div>

          <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">
            {metadata.description}
          </p>

          <div className="space-y-4">
            <div className="relative pt-4">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gray-200 rounded-full">
                <div 
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-1000"
                  style={{ width: `${(seconds / 5) * 100}%` }}
                />
              </div>
            </div>

            <div className="flex items-center justify-between gap-4">
              <button
                onClick={startRedirect}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold 
                         hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-[1.02]
                         shadow-lg hover:shadow-xl active:scale-95"
              >
                Continue in {seconds}s
              </button>
              
              <a
                href={targetUrl}
                className="px-4 py-2 text-gray-600 hover:text-purple-600 font-medium transition-colors
                           border border-gray-200 rounded-xl hover:border-purple-200 hover:bg-purple-50"
                target="_blank"
                rel="noopener noreferrer"
              >
                Open in new tab
              </a>
            </div>
          </div>

          <div className="mt-4 text-sm text-gray-500 break-all px-4 py-2 bg-gray-50 rounded-lg font-mono">
            {targetUrl}
          </div>
        </div>
      </div>
    </div>
  );
}