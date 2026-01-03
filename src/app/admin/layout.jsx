'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { 
  Menu, X, Home, Package, MapPin, FileText, 
  MessageSquare, Star, LogOut, User, ChevronRight,
   Settings
} from 'lucide-react'
import { MdDashboard } from "react-icons/md";
export default function AdminLayout({ children }) {
  const router = useRouter()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [adminData, setAdminData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [pathname])

  const checkAuth = () => {
    const token = localStorage.getItem('adminToken')
    const admin = localStorage.getItem('admin')
    
    if (token && admin) {
      try {
        setAdminData(JSON.parse(admin))
        setIsAuthenticated(true)
      } catch (error) {
        localStorage.clear()
        setIsAuthenticated(false)
        router.push('/admin/login')
      }
    } else {
      setIsAuthenticated(false)
      if (pathname !== '/admin/login') {
        router.push('/admin/login')
      }
    }
    setLoading(false)
  }

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    localStorage.removeItem('admin')
    localStorage.removeItem('rememberAdmin')
    setIsAuthenticated(false)
    router.push('/admin/login')
  }

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setSidebarOpen(false)
  }, [pathname])

  // Navigation items
  const navItems = [
    /* { href: '/admin/dashboard', label: 'Dashboard', icon: Home }, */
    { href: '/admin/packages', label: 'Packages', icon: Package },
    { href: '/admin/places', label: 'Places', icon: MapPin },
   { href: '/admin/blogs', label: 'Blogs', icon: FileText },
   { href: '/admin/contacts', label: 'Contacts', icon: MessageSquare },
    /*   { href: '/admin/reviews', label: 'Reviews', icon: Star }, */
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin panel...</p>
        </div>
      </div>
    )
  }

  // If not authenticated and not on login page, don't render layout
  if (!isAuthenticated && pathname !== '/admin/login') {
    return null
  }

  // For login page, don't show layout
  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-4 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar - Fixed position */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        lg:flex lg:flex-col lg:h-screen
      `}>
        <div className="flex flex-col justify-center h-full">
          {/* Logo/Brand */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center">
                <img src='/logo1.png' className="w-14 h-12 text-white" />
              </div>
              <div>
                <h1 className="text-md font-bold text-black">Avantika Travels</h1>
                <p className="text-xs text-gray-500">Travel Management</p>
              </div>
            </div>
          </div>

          {/* Admin Info */}
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-gray-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-black truncate">
                  {adminData?.name || 'Admin User'}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {adminData?.email || 'admin@example.com'}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className=" overflow-y-auto py-4">
            <div className="px-3 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`
                      flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-colors
                      ${isActive 
                        ? 'bg-black text-white' 
                        : 'text-gray-700 hover:bg-gray-100 hover:text-black'
                      }
                    `}
                  >
                    <Icon className={`w-5 h-5 mr-3 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                    {item.label}
                    {isActive && (
                      <ChevronRight className="w-4 h-4 ml-auto" />
                    )}
                  </Link>
                )
              })}
            </div>
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-gray-100 mb-6">
            <button
              onClick={handleLogout}
              className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
            >
              <LogOut className="w-5 h-5 mr-2" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area - Takes remaining space */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Top Header */}
        <header className="sticky top-0 z-30 bg-white border-b border-gray-200 lg:static">
          <div className="flex items-center justify-between px-4 py-3 sm:px-6">
            <div className="flex items-center">
              <button
                onClick={toggleSidebar}
                className="p-2 text-gray-600 hover:text-black hover:bg-gray-100 rounded-lg lg:hidden"
                aria-label="Toggle sidebar"
              >
                {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
              
              {/* Breadcrumb */}
              <div className="hidden sm:flex items-center ml-4">
                <nav className="flex text-sm">
                  <Link href="/admin/dashboard" className="text-gray-600 hover:text-black">
                    Admin
                  </Link>
                  {pathname !== '/admin/dashboard' && (
                    <>
                      <ChevronRight className="w-4 h-4 mx-2 text-gray-400" />
                      <span className="text-black font-medium">
                        {navItems.find(item => item.href === pathname)?.label || 'Page'}
                      </span>
                    </>
                  )}
                </nav>
              </div>
            </div>

            {/* User Info */}
            <div className="flex items-center space-x-4">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium text-black">
                  {adminData?.name || 'Admin User'}
                </p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-gray-600" />
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Content Area */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <div className="p-4 sm:p-6">
            {/* Page Header */}
            <div className="mb-6">
              <h1 className="text-2xl sm:text-3xl font-bold text-black mb-2">
                {navItems.find(item => item.href === pathname)?.label || 'Dashboard'}
              </h1>
              <p className="text-gray-600">
                Manage your travel website content and settings
              </p>
            </div>

            {/* Page Content Container */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {children}
            </div>
          </div>

          {/* Footer */}
          <footer className="border-t border-gray-200 bg-white py-4 px-6">
            <div className="flex flex-col sm:flex-row items-center justify-between text-sm text-gray-600">
              <p>© {new Date().getFullYear()} Avantika Travels Admin Gautam Rathore</p>
              <p className="mt-2 sm:mt-0">
                Version 1.0.0 • Last updated: {new Date().toLocaleDateString()}
              </p>
            </div>
          </footer>
        </main>
      </div>
    </div>
  )
}