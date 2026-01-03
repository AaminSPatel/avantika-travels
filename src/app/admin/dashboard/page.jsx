'use client'

import { useEffect, useState } from 'react'
import { useSite } from '../../../context/site-context'
import { 
  MapPin, Package, FileText, MessageSquare, Star, 
  Users, Calendar, TrendingUp, Eye, BarChart3, 
  AlertCircle, CheckCircle, Clock, DollarSign,
  ArrowUpRight, ArrowDownRight, Activity, RefreshCw
} from 'lucide-react'
import Link from 'next/link'

export default function AdminDashboard() {
  const { 
    fetchPlaces, fetchPackages, fetchBlogs, fetchContacts, fetchReviews,
    places, packages, blogs, contacts, reviews 
  } = useSite()
  
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('7d')
  const [stats, setStats] = useState({
    totalPlaces: 0,
    totalPackages: 0,
    totalBlogs: 0,
    totalContacts: 0,
    totalReviews: 0,
    activePlaces: 0,
    activePackages: 0,
    publishedBlogs: 0,
    pendingContacts: 0,
    approvedReviews: 0,
    totalRevenue: 0,
    avgRating: 0
  })
  
  const [growth, setGrowth] = useState({
    places: 12,
    packages: 8,
    blogs: 15,
    contacts: -5,
    reviews: 20
  })
  
  const [recentActivity, setRecentActivity] = useState([])
  const [chartData, setChartData] = useState({})

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true)
        
        // Fetch all data
        await Promise.all([
          fetchPlaces(),
          fetchPackages(),
          fetchBlogs(),
          fetchContacts(),
          fetchReviews()
        ])

        // Calculate stats
        const activePlaces = places.filter(p => p.isActive).length
        const activePackages = packages.filter(p => p.status).length
        const publishedBlogs = blogs.length // Assuming all blogs are published
        const pendingContacts = contacts.filter(c => c.status === 'pending').length
        const approvedReviews = reviews.filter(r => r.status === 'approved').length
        
        // Calculate average rating
        const avgRating = reviews.length > 0 
          ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
          : 0
        
        // Calculate total revenue (sample calculation)
        const totalRevenue = packages.reduce((sum, p) => sum + (p.price || 0), 0)

        setStats({
          totalPlaces: places.length,
          totalPackages: packages.length,
          totalBlogs: blogs.length,
          totalContacts: contacts.length,
          totalReviews: reviews.length,
          activePlaces,
          activePackages,
          publishedBlogs,
          pendingContacts,
          approvedReviews,
          totalRevenue,
          avgRating
        })

        // Generate recent activity
        generateRecentActivity()
        
        // Generate chart data
        generateChartData()

      } catch (error) {
        console.error('Error loading dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadDashboardData()
  }, [timeRange])

  const generateRecentActivity = () => {
    const activities = [
      ...places.slice(0, 3).map(p => ({
        id: p._id,
        type: 'place',
        title: `New place added: ${p.title}`,
        time: '2 hours ago',
        icon: MapPin,
        color: 'text-blue-500'
      })),
      ...packages.slice(0, 2).map(p => ({
        id: p._id,
        type: 'package',
        title: `Package "${p.name}" created`,
        time: '4 hours ago',
        icon: Package,
        color: 'text-purple-500'
      })),
      ...blogs.slice(0, 2).map(b => ({
        id: b._id,
        type: 'blog',
        title: `Blog published: ${b.title}`,
        time: '1 day ago',
        icon: FileText,
        color: 'text-green-500'
      }))
    ].sort(() => Math.random() - 0.5).slice(0, 5)
    
    setRecentActivity(activities)
  }

  const generateChartData = () => {
    // Sample chart data - in real app, this would come from your API
    const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    const visits = [450, 520, 480, 580, 530, 600, 550]
    const revenue = [1200, 1500, 1300, 1800, 1600, 2000, 1900]
    
    setChartData({ labels, visits, revenue })
  }

  const refreshData = async () => {
    setLoading(true)
    try {
      await Promise.all([
        fetchPlaces(),
        fetchPackages(),
        fetchBlogs(),
        fetchContacts(),
        fetchReviews()
      ])
      generateRecentActivity()
      generateChartData()
    } catch (error) {
      console.error('Error refreshing data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 animate-spin text-pink-600 mx-auto mb-4" />
          <p className="text-gray-600">Page is not build yet.</p>
          <p className="text-gray-600">Loading dashboard data...</p>
          <div className="flex gap-4 mt-4 flex-col">
            <Link href='/admin/places' className='px-4 py-2 bg-black text-white rounded-md '>Places</Link>
            <Link href='/admin/packages' className='px-4 py-2 bg-black text-white rounded-md '>Packages</Link>
            <Link href='/admin/blogs' className='px-4 py-2 bg-black text-white rounded-md '>Blogs</Link>
            <Link href='/admin/contacts' className='px-4 py-2 bg-sky-500 text-white rounded-md '>Contact</Link>
          </div>
        </div>
      </div>
    )
  }
 if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 animate-spin text-pink-600 mx-auto mb-4" />
          <p className="text-gray-600">Page is not build yet.</p>
          <p className="text-gray-600">Loading dashboard data...</p>
          <div className="flex gap-4 mt-4">
            <Link href='/admin/places' className='px-4 py-2 bg-black text-white rounded-md '>Places</Link>
            <Link href='/admin/packages' className='px-4 py-2 bg-black text-white rounded-md '>Packages</Link>
            <Link href='/admin/blogs' className='px-4 py-2 bg-black text-white rounded-md '>Blogs</Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-black">Dashboard Overview</h1>
            <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your site.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 mt-4 md:mt-0">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 bg-white border border-gray-300 text-black rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
            <button
              onClick={refreshData}
              className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Revenue Card */}
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-pink-500">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-pink-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-pink-600" />
              </div>
              <span className={`px-2 py-1 text-xs font-medium rounded-full flex items-center ${growth.places > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {growth.places > 0 ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
                {Math.abs(growth.places)}%
              </span>
            </div>
            <h3 className="text-lg font-bold text-black">Total Revenue</h3>
            <p className="text-3xl font-bold text-pink-600 mb-2">
              ₹{stats.totalRevenue.toLocaleString()}
            </p>
            <p className="text-sm text-gray-600">Estimated from all packages</p>
          </div>

          {/* Total Visitors */}
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <span className={`px-2 py-1 text-xs font-medium rounded-full flex items-center ${growth.packages > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {growth.packages > 0 ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
                {Math.abs(growth.packages)}%
              </span>
            </div>
            <h3 className="text-lg font-bold text-black">Total Visitors</h3>
            <p className="text-3xl font-bold text-blue-600 mb-2">
              {places.reduce((sum, p) => sum + (p.visitors || 0), 0).toLocaleString()}
            </p>
            <p className="text-sm text-gray-600">Across all places</p>
          </div>

          {/* Average Rating */}
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Star className="w-6 h-6 text-yellow-600" />
              </div>
              <span className={`px-2 py-1 text-xs font-medium rounded-full flex items-center ${growth.reviews > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {growth.reviews > 0 ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
                {Math.abs(growth.reviews)}%
              </span>
            </div>
            <h3 className="text-lg font-bold text-black">Avg. Rating</h3>
            <p className="text-3xl font-bold text-yellow-600 mb-2">{stats.avgRating}</p>
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-4 h-4 ${star <= stats.avgRating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                />
              ))}
              <span className="ml-2 text-sm text-gray-600">({stats.totalReviews} reviews)</span>
            </div>
          </div>

          {/* Pending Actions */}
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-red-500">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-red-100 rounded-lg">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                {stats.pendingContacts}
              </span>
            </div>
            <h3 className="text-lg font-bold text-black">Pending Actions</h3>
            <p className="text-3xl font-bold text-red-600 mb-2">{stats.pendingContacts}</p>
            <p className="text-sm text-gray-600">Contact inquiries awaiting response</p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Content Overview */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-md p-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-black">Content Overview</h2>
              <Activity className="w-5 h-5 text-gray-400" />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 mb-6">
              {/* Places */}
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center mb-3">
                  <div className="p-2 bg-blue-100 rounded-lg mr-3">
                    <MapPin className="w-5 h-5 text-blue-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">Places</span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-black">{stats.totalPlaces}</p>
                    <div className="flex items-center mt-1">
                      <span className={`text-xs ${stats.activePlaces === stats.totalPlaces ? 'text-green-600' : 'text-yellow-600'}`}>
                        {stats.activePlaces} active
                      </span>
                      <span className="mx-2 text-gray-300">•</span>
                      <span className="text-xs text-gray-500">
                        {stats.totalPlaces - stats.activePlaces} inactive
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-xs font-medium ${growth.places > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {growth.places > 0 ? '+' : ''}{growth.places}%
                    </div>
                    <div className="text-xs text-gray-500">growth</div>
                  </div>
                </div>
              </div>

              {/* Packages */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center mb-3">
                  <div className="p-2 bg-purple-100 rounded-lg mr-3">
                    <Package className="w-5 h-5 text-purple-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">Packages</span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-black">{stats.totalPackages}</p>
                    <div className="flex items-center mt-1">
                      <span className={`text-xs ${stats.activePackages === stats.totalPackages ? 'text-green-600' : 'text-yellow-600'}`}>
                        {stats.activePackages} active
                      </span>
                      <span className="mx-2 text-gray-300">•</span>
                      <span className="text-xs text-gray-500">
                        {stats.totalPackages - stats.activePackages} inactive
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-xs font-medium ${growth.packages > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {growth.packages > 0 ? '+' : ''}{growth.packages}%
                    </div>
                    <div className="text-xs text-gray-500">growth</div>
                  </div>
                </div>
              </div>

              {/* Blogs */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center mb-3">
                  <div className="p-2 bg-green-100 rounded-lg mr-3">
                    <FileText className="w-5 h-5 text-green-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">Blogs</span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-black">{stats.totalBlogs}</p>
                    <div className="flex items-center mt-1">
                      <span className="text-xs text-green-600">{stats.publishedBlogs} published</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-xs font-medium ${growth.blogs > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {growth.blogs > 0 ? '+' : ''}{growth.blogs}%
                    </div>
                    <div className="text-xs text-gray-500">growth</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Performance Chart (Simplified) */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-black mb-4">Website Performance</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Page Views</span>
                    <TrendingUp className="w-4 h-4 text-green-500" />
                  </div>
                  <p className="text-2xl font-bold text-black">24.5K</p>
                  <div className="flex items-center mt-1">
                    <ArrowUpRight className="w-3 h-3 text-green-500 mr-1" />
                    <span className="text-xs text-green-600">12% increase</span>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Avg. Time</span>
                    <Clock className="w-4 h-4 text-blue-500" />
                  </div>
                  <p className="text-2xl font-bold text-black">4m 32s</p>
                  <div className="flex items-center mt-1">
                    <ArrowUpRight className="w-3 h-3 text-green-500 mr-1" />
                    <span className="text-xs text-green-600">8% increase</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity & Quick Stats */}
          <div className="space-y-6">
            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-black">Recent Activity</h2>
                <Calendar className="w-5 h-5 text-gray-400" />
              </div>
              
              <div className="space-y-4">
                {recentActivity.map((activity) => {
                  const Icon = activity.icon
                  return (
                    <div key={activity.id} className="flex items-start">
                      <div className={`p-2 rounded-lg mr-3 ${activity.color.replace('text-', 'bg-')} bg-opacity-10`}>
                        <Icon className={`w-4 h-4 ${activity.color}`} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-black">{activity.title}</p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
              
              <button className="w-full mt-4 py-2 text-sm text-pink-600 font-medium hover:text-pink-700 transition-colors">
                View all activity →
              </button>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-black">Quick Stats</h2>
                <BarChart3 className="w-5 h-5 text-gray-400" />
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <MessageSquare className="w-4 h-4 text-blue-500 mr-2" />
                    <span className="text-sm text-gray-700">Contacts</span>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-black">{stats.totalContacts}</p>
                    <div className="flex items-center justify-end">
                      <span className={`text-xs ${growth.contacts > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {growth.contacts > 0 ? '+' : ''}{growth.contacts}%
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-500 mr-2" />
                    <span className="text-sm text-gray-700">Reviews</span>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-black">{stats.totalReviews}</p>
                    <div className="text-xs text-green-600">{stats.approvedReviews} approved</div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Eye className="w-4 h-4 text-purple-500 mr-2" />
                    <span className="text-sm text-gray-700">Popular Place</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-black truncate max-w-[120px]">
                      {places.length > 0 
                        ? places.reduce((prev, current) => 
                            (prev.visitors || 0) > (current.visitors || 0) ? prev : current
                          ).title
                        : 'None'
                      }
                    </p>
                    <div className="text-xs text-gray-500">
                      {places.length > 0 
                        ? Math.max(...places.map(p => p.visitors || 0)).toLocaleString() + ' visitors'
                        : '0 visitors'
                      }
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Engagement Rate */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-green-100 rounded-lg mr-3">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-700">Engagement Rate</h3>
                <p className="text-2xl font-bold text-black">68.2%</p>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full" style={{ width: '68.2%' }}></div>
            </div>
          </div>

          {/* Conversion Rate */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-blue-100 rounded-lg mr-3">
                <ArrowUpRight className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-700">Conversion Rate</h3>
                <p className="text-2xl font-bold text-black">3.8%</p>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-500 h-2 rounded-full" style={{ width: '38%' }}></div>
            </div>
          </div>

          {/* Bounce Rate */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-red-100 rounded-lg mr-3">
                <ArrowDownRight className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-700">Bounce Rate</h3>
                <p className="text-2xl font-bold text-black">32.5%</p>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-red-500 h-2 rounded-full" style={{ width: '32.5%' }}></div>
            </div>
          </div>

          {/* Avg. Session */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-purple-100 rounded-lg mr-3">
                <Clock className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-700">Avg. Session</h3>
                <p className="text-2xl font-bold text-black">4m 32s</p>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-purple-500 h-2 rounded-full" style={{ width: '75%' }}></div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-black mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <button className="flex items-center justify-center p-4 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors">
              <MapPin className="w-5 h-5 mr-2" />
              Add New Place
            </button>
            <button className="flex items-center justify-center p-4 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors">
              <Package className="w-5 h-5 mr-2" />
              Create Package
            </button>
            <button className="flex items-center justify-center p-4 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors">
              <FileText className="w-5 h-5 mr-2" />
              Write Blog Post
            </button>
            <button className="flex items-center justify-center p-4 bg-pink-50 text-pink-600 rounded-lg hover:bg-pink-100 transition-colors">
              <MessageSquare className="w-5 h-5 mr-2" />
              Check Messages
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}