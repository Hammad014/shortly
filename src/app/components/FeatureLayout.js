import Link from 'next/link';

export default function FeatureLayout({ 
  title, 
  description, 
  icon,
  children 
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Back Navigation */}
        <Link href="/features" className="inline-flex items-center text-gray-400 hover:text-blue-400 mb-8">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Features
        </Link>

        {/* Feature Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl mb-6">
            {icon}
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">
            {title}
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            {description}
          </p>
        </div>

        {/* Feature Content Container */}
        <div className="bg-gray-800/50 rounded-2xl p-8 shadow-2xl backdrop-blur-lg">
          {children}
        </div>
      </div>
    </div>
  );
}