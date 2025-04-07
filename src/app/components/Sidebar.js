"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { FiHome, FiBarChart2, FiLink, FiClock, FiLock, FiBox, FiSettings, FiUsers } from "react-icons/fi"

const Sidebar = ({ isMobileOpen }) => {
  const pathname = usePathname()
  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    const checkDesktop = () => setIsDesktop(window.innerWidth >= 1024)
    checkDesktop()
    window.addEventListener('resize', checkDesktop)
    return () => window.removeEventListener('resize', checkDesktop)
  }, [])

  const navItems = [
    { name: "Home", path: "/dashboard", icon: FiHome },
    { name: "Analytics", path: "/dashboard/analytics", icon: FiBarChart2 },
    { name: "Custom Alias", path: "/dashboard/custom-name", icon: FiLink },
    { name: "QR-Code", path: "/dashboard/qr-code", icon: FiClock },
    { name: "Bulk Shortening", path: "/dashboard/bulk", icon: FiBox },
    // { name: "Password Protection", path: "/dashboard/protection", icon: FiLock },
    // { name: "API Settings", path: "/dashboard/api", icon: FiSettings },
    // { name: "Branding", path: "/dashboard/branding", icon: FiUsers },
  ]

  return (
    <>
      <AnimatePresence>
        {isMobileOpen && !isDesktop && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          />
        )}
      </AnimatePresence>

      <motion.aside
        className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-gray-900/80 backdrop-blur-sm border-r border-gray-700 overflow-y-auto z-40"
        animate={{
          x: isDesktop ? 0 : (isMobileOpen ? 0 : -256)
        }}
        transition={{ type: "tween", duration: 0.2 }}
      >
        <nav className="p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                pathname === item.path
                  ? "bg-blue-600/20 text-blue-400"
                  : "text-gray-300 hover:bg-gray-700/50"
              }`}
            >
              <item.icon className="mr-3 text-lg" />
              <span className="text-sm lg:text-base">{item.name}</span>
            </Link>
          ))}
        </nav>
      </motion.aside>
    </>
  )
}

export default Sidebar