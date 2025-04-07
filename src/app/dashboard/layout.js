'use client'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { Suspense } from 'react'
import TopBar from '../components/TopBar'
import Sidebar from '../components/Sidebar'

export default function DashboardLayout({ children }) {
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setIsMobileOpen(false)
  }, [pathname])

  return (
    <div className="bg-gray-900">
      <TopBar toggleSidebar={() => setIsMobileOpen(!isMobileOpen)} />
      <Sidebar isMobileOpen={isMobileOpen} />
      
      <main className="lg:ml-32 mt-7">
        <div className="mx-auto max-w-full p-4 sm:p-6 lg:p-8">
          <Suspense fallback={<LoadingSpinner />}>
            {children}
          </Suspense>
        </div>
      </main>
    </div>
  )
}

const LoadingSpinner = () => (
  <div className="flex justify-center py-8">
    <div className="w-8 h-8 border-4 border-blue-500 rounded-full animate-spin" />
  </div>
)