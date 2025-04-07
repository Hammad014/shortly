// app/features/page.js
'use client'
import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { 
  FiLink, FiBarChart, FiEdit, FiClock, FiTrash2,
  FiGlobe, FiSmartphone, FiUploadCloud, FiShield, 
  FiDatabase, FiPieChart, FiActivity, FiLock, FiSliders
} from 'react-icons/fi'
import { QrCode } from 'lucide-react'
import { TbBulk, TbClick } from 'react-icons/tb';
import { GuestRoute } from "@/app/components/GuestRoute";

const FeatureSection = ({ id, title, icon, description, stats, visualization, technicalSpec, actionLink }) => {
  const pathname = usePathname()

  useEffect(() => {
    if (window.location.hash === `#${id}`) {
      const element = document.getElementById(id)
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }, 300)
      }
    }
  }, [pathname, id])

  return (
    <motion.div 
      id={id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="py-16 border-b border-gray-800"
    >
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl text-white">
              {icon}
            </div>
            <h2 className="text-3xl font-bold text-gray-100">{title}</h2>
          </div>
          
          <p className="text-lg text-gray-300 leading-relaxed">{description}</p>
          
          {technicalSpec && (
            <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
              <h4 className="text-sm font-semibold text-blue-400 mb-2">Technical Specifications</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                {technicalSpec.map((spec, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <FiSliders className="text-purple-400" />
                    <span>{spec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <Link href={actionLink} className="inline-block">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl text-white font-semibold flex items-center gap-2 group"
            >
              Try Now
              <span className="group-hover:translate-x-1 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
                </svg>
              </span>
            </motion.button>
          </Link>
        </div>

        <div className="bg-gray-800/30 p-8 rounded-2xl border border-gray-700 shadow-xl">
          {visualization}
        </div>
      </div>
    </motion.div>
  )
}

const CustomProgressBar = ({ percent, color, label }) => (
  <div className="w-full space-y-2">
    <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${percent}%` }}
        transition={{ duration: 0.8 }}
        className="h-full rounded-full"
        style={{ backgroundColor: color }}
      />
    </div>
    {label && <span className="text-sm text-gray-400">{label}</span>}
  </div>
)

export default function FeaturesPage() {
  return (
    <>
    <GuestRoute>
    <div className="bg-gray-900 min-h-screen">
      <Navbar showSignIn={true} showRegister={true} showHome={true} />

      <header className="pt-32 pb-20 text-center">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
        >
          Enterprise Link Management Platform
        </motion.h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
          Industrial-grade solutions for modern digital asset management with military-grade security and real-time analytics
        </p>
      </header>

      {/* URL Shortening */}
      <FeatureSection
        id="url-shortening"
        title="Advanced URL Compression"
        icon={<FiLink className="w-8 h-8" />}
        description="Enterprise-grade URL shortening infrastructure with real-time threat detection and automatic SSL provisioning."
        technicalSpec={[
          'SHA-256 URL fingerprinting with HMAC validation',
          'Real-time malware/phishing detection',
          'Custom domain management with automatic SSL',
          'Rate-limited API endpoints (10,000 RPM)',
          'Bulk processing (CSV/JSON/XLSX) support',
          'Geo-targeted redirects with failover routing'
        ]}
        actionLink="/dashboard"
        visualization={
          <div className="space-y-8">
            <div className="p-6 bg-gray-700/30 rounded-xl">
              <div className="flex items-center gap-4 mb-4">
                <FiActivity className="text-blue-400 text-xl" />
                <h3 className="text-lg font-semibold text-gray-200">Performance Metrics</h3>
              </div>
              <CustomProgressBar percent={100} color="#3B82F6" label="Encryption Strength" />
              <CustomProgressBar percent={95} color="#10B981" label="System Uptime (30d)" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <StatBox value="<250ms" label="P95 Latency" color="purple" />
              <StatBox value="TLS 1.3" label="Encryption" color="green" />
            </div>
          </div>
        }
      />

      {/* QR Generation */}
      <FeatureSection
        id="qr-generation"
        title="Dynamic QR Code System"
        icon={<QrCode className="w-8 h-8" />}
        description="Professional QR code generation with brand customization, dynamic content updates, and detailed scan analytics."
        technicalSpec={[
          'Vector-based QR rendering (SVG/PDF)',
          'Dynamic content updates with version control',
          'Scan analytics with geographic heatmaps',
          'Custom logo watermarking with size optimization',
          'Color profiles with gradient support',
          'Bulk generation with template system'
        ]}
        actionLink="/dashboard/qr-code"
        visualization={
          <div className="space-y-6">
            <div className="relative p-4 bg-white rounded-xl w-full aspect-square">
              <div className="grid grid-cols-3 gap-2 w-full h-full">
                {[...Array(9)].map((_, i) => (
                  <div key={i} className="bg-black rounded-sm animate-pulse" />
                ))}
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-1/3 h-1/3 bg-blue-500 rounded animate-pulse" />
              </div>
            </div>
            <div className="flex justify-center gap-4">
              {['#3B82F6', '#10B981', '#8B5CF6'].map((color, i) => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-gray-600" style={{ backgroundColor: color }} />
              ))}
            </div>
          </div>
        }
      />

      {/* Custom Aliases */}
      <FeatureSection
        id="custom-aliases"
        title="Branded Short Links"
        icon={<FiEdit className="w-8 h-8" />}
        description="Create and manage custom branded URLs with enterprise-grade security controls and detailed usage analytics."
        technicalSpec={[
          'Custom domain management with DNS validation',
          'Regex-based alias validation engine',
          'Team-based permission system (RBAC)',
          'Version history with rollback support',
          'A/B testing with traffic splitting',
          'API-driven management with webhooks'
        ]}
        actionLink="/dashboard/custom-names"
        visualization={
          <div className="space-y-6">
            <div className="p-4 bg-gray-700/30 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="font-mono text-blue-400 flex-1 truncate">brand.link/spring-sale-24</div>
                <FiLock className="text-green-400" />
              </div>
              <div className="mt-2 flex items-center gap-4">
                <div className="text-sm text-gray-400">Clicks: <span className="text-purple-400">2.4K</span></div>
                <div className="text-sm text-gray-400">Status: <span className="text-green-400">Active</span></div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <StatBox value="15K" label="Active Aliases" color="blue" />
              <StatBox value="98%" label="Availability" color="purple" />
            </div>
          </div>
        }
      />

      {/* Link Expiration */}
      <FeatureSection
        id="expiration"
        title="Precision Expiration Controls"
        icon={<FiClock className="w-8 h-8" />}
        description="Granular expiration policies with multiple trigger types and automated compliance workflows."
        technicalSpec={[
          'Time-based expiration (date/time)',
          'Click-based usage limits',
          'Manual expiration with approval workflows',
          'Temporary deactivation periods',
          'Automatic redirect to fallback URLs',
          'Expiration warning notifications'
        ]}
        actionLink="/dashboard/expiration"
        visualization={
          <div className="space-y-6">
            <div className="p-4 bg-gray-700/30 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400">Active Until</span>
                <span className="text-blue-400">2024-12-31</span>
              </div>
              <CustomProgressBar percent={60} color="#F59E0B" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <StatBox value="24h" label="Quick Expire" color="yellow" />
              <StatBox value="∞" label="Permanent" color="green" />
            </div>
          </div>
        }
      />

      {/* Analytics */}
      <FeatureSection
        id="analytics"
        title="Advanced Link Analytics"
        icon={<FiBarChart className="w-8 h-8" />}
        description="Comprehensive analytics suite with real-time monitoring and detailed engagement metrics."
        technicalSpec={[
          'Real-time click tracking',
          'Geographic heatmaps',
          'Device & browser breakdowns',
          'Referrer tracking',
          'UTM parameter analysis',
          'Custom report generation'
        ]}
        actionLink="/dashboard/analytics"
        visualization={
          <div className="space-y-6">
            <div className="p-4 bg-gray-700/30 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <FiGlobe className="text-blue-400" />
                <FiSmartphone className="text-purple-400" />
              </div>
              <CustomProgressBar percent={75} color="#3B82F6" label="Mobile Traffic" />
              <CustomProgressBar percent={25} color="#8B5CF6" label="Desktop Traffic" />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <StatBox value="45%" label="Direct" color="blue" />
              <StatBox value="30%" label="Social" color="purple" />
              <StatBox value="25%" label="Search" color="green" />
            </div>
          </div>
        }
      />

      {/* Secure Deletion */}
      <FeatureSection
        id="deletion"
        title="Secure Data Destruction"
        icon={<FiTrash2 className="w-8 h-8" />}
        description="GDPR-compliant data deletion workflows with cryptographic proof and audit trails."
        technicalSpec={[
          '256-bit secure erase protocols',
          'Bulk deletion with dry-run mode',
          'Automated audit logging',
          '7-day recovery window',
          'Role-based deletion permissions',
          'Compliance certification reports'
        ]}
        actionLink="/dashboard"
        visualization={
          <div className="space-y-6">
            <div className="p-4 bg-gray-700/30 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400">Deletion Progress</span>
                <FiLock className="text-red-400" />
              </div>
              <CustomProgressBar percent={100} color="#EF4444" />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <StatBox value="0ms" label="Recovery" color="red" />
              <StatBox value="256-bit" label="Wiping" color="purple" />
              <StatBox value="Audit" label="Logs" color="blue" />
            </div>
          </div>
        }
      />

       {/* Technical Footer */}
       <div className="py-16 bg-gray-800/50 mt-12">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="p-4">
            <FiDatabase className="text-blue-400 w-8 h-8 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-100 mb-2">Infrastructure</h3>
            <p className="text-sm text-gray-400">
              Redis · PostgreSQL<br/>
              MongoDB · S3
            </p>
          </div>
          <div className="p-4">
            <FiShield className="text-green-400 w-8 h-8 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-100 mb-2">Security</h3>
            <p className="text-sm text-gray-400">
              GDPR · SOC2<br/>
              ISO 27001 · PCI DSS
            </p>
          </div>
          <div className="p-4">
            <TbClick className="text-purple-400 w-8 h-8 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-100 mb-2">Performance</h3>
            <p className="text-sm text-gray-400">
              Anycast DNS<br/>
              Global CDN · Edge
            </p>
          </div>
          <div className="p-4">
            <FiPieChart className="text-yellow-400 w-8 h-8 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-100 mb-2">Analytics</h3>
            <p className="text-sm text-gray-400">
              ClickHouse<br/>
              Grafana · Webhooks
            </p>
          </div>
        </div>
      </div>
    
      <Footer />
    </div>
    </GuestRoute>
    </>
  )
}

// Reusable Components
const StatBox = ({ value, label, color }) => {
  const colors = {
    blue: 'text-blue-400',
    purple: 'text-purple-400',
    green: 'text-green-400',
    yellow: 'text-yellow-400',
    red: 'text-red-400'
  }

  return (
    <div className="p-3 bg-gray-700/30 rounded-lg">
      <div className={`text-xl font-bold mb-1 ${colors[color]}`}>{value}</div>
      <div className="text-xs text-gray-400">{label}</div>
    </div>
  )
}