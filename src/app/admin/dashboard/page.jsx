'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSite } from '../../../context/site-context'
import {
  MapPin, Package, FileText, MessageSquare, Star,
  Users, Calendar, TrendingUp, Eye, BarChart3,
  AlertCircle, CheckCircle, Clock, CreditCard,
  ArrowUpRight, ArrowDownRight, Activity, RefreshCw,
  DollarSign, Wallet, Ticket, UserCheck, XCircle,
  PieChart, Target, Gift, Award, BookOpen
} from 'lucide-react'
import Link from 'next/link'
import axios from 'axios'

export default function AdminDashboard() {
  const router = useRouter()
  const {
    fetchPlaces, fetchPackages, fetchBlogs, fetchContacts, fetchReviews, fetchBookings,
    timeAgo, places, packages, blogs, contacts, reviews, bookings
  } = useSite()
  
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('7d')
  const [stats, setStats] = useState({
    // Content stats
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
    avgRating: 0,
    
    // Booking stats
    totalBookings: 0,
    pendingBookings: 0,
    confirmedBookings: 0,
    completedBookings: 0,
    cancelledBookings: 0,
    totalRevenue: 0,
    advanceCollected: 0,
    balancePending: 0,
    todayBookings: 0,
    upcomingBookings: 0,
    totalTravelers: 0
  })
  
  const [growth, setGrowth] = useState({
    places: 12,
    packages: 8,
    blogs: 15,
    contacts: -5,
    reviews: 20,
    bookings: 25,
    revenue: 18
  })
  
  const [recentActivity, setRecentActivity] = useState([])
  const [popularPackages, setPopularPackages] = useState([])
  const [upcomingTrips, setUpcomingTrips] = useState([])
  const [recentBookings, setRecentBookings] = useState([])

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
          fetchReviews(),
          fetchBookings()
        ])

      } catch (error) {
        console.error('Error loading dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadDashboardData()
  }, [timeRange])

  // Calculate stats when data changes
  useEffect(() => {
    if (!places.length && !packages.length && !bookings.length) return

    // Content stats
    const activePlaces = places.filter(p => p.isActive).length
    const activePackages = packages.filter(p => p.status).length
    const publishedBlogs = blogs.length
    const pendingContacts = contacts.filter(c => c.status === 'pending').length
    const approvedReviews = reviews.filter(r => r.status === 'approved').length

    // Calculate average rating
    const avgRating = reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : 0

    // Booking stats
    const totalBookings = bookings.length
    const pendingBookings = bookings.filter(b => b.paymentStatus === 'pending').length
    const confirmedBookings = bookings.filter(b => b.paymentStatus === 'paid').length
    const completedBookings = bookings.filter(b => b.status === 'completed').length
    const cancelledBookings = bookings.filter(b => b.status === 'cancelled').length
    
    // Revenue stats
    const totalRevenue = bookings
      .filter(b => b.paymentStatus === 'paid')
      .reduce((sum, b) => sum + (b.totalPrice || 0), 0)
    
    const advanceCollected = bookings
      .filter(b => b.paymentStatus === 'paid')
      .reduce((sum, b) => sum + (b.advancePayment || 0), 0)
    
    const balancePending = bookings
      .filter(b => b.paymentStatus === 'paid')
      .reduce((sum, b) => sum + (b.balancePayment || 0), 0)

    // Today's bookings
    const today = new Date().toDateString()
    const todayBookings = bookings.filter(b => {
      const bookingDate = new Date(b.createdAt).toDateString()
      return bookingDate === today
    }).length

    // Upcoming bookings (next 7 days)
    const nextWeek = new Date()
    nextWeek.setDate(nextWeek.getDate() + 7)
    const upcomingBookings = bookings.filter(b => {
      if (!b.travelDate) return false
      const travelDate = new Date(b.travelDate)
      return travelDate >= new Date() && travelDate <= nextWeek
    }).length

    // Total travelers
    const totalTravelers = bookings.reduce((sum, b) => sum + (b.numberOfPeople || 0), 0)

    setStats({
      // Content stats
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
      avgRating,
      
      // Booking stats
      totalBookings,
      pendingBookings,
      confirmedBookings,
      completedBookings,
      cancelledBookings,
      totalRevenue,
      advanceCollected,
      balancePending,
      todayBookings,
      upcomingBookings,
      totalTravelers
    })

    // Generate recent activity
    generateRecentActivity()

    // Find popular packages
    findPopularPackages()

    // Find upcoming trips
    findUpcomingTrips()

    // Recent bookings
    setRecentBookings(bookings.slice(0, 5))
  }, [places, packages, blogs, contacts, reviews, bookings])

  const generateRecentActivity = () => {
    const activities = [
      ...bookings.slice(0, 3).map(b => ({
        id: b._id,
        type: 'booking',
        title: `New booking: ${b.name} - ${b.packageName || 'Package'}`,
        time: timeAgo(b.createdAt),
        icon: Ticket,
        color: 'text-purple-500',
        status: b.paymentStatus
      })),
      ...places.slice(0, 2).map(p => ({
        id: p._id,
        type: 'place',
        title: `New place added: ${p.title}`,
        time: timeAgo(p.createdAt),
        icon: MapPin,
        color: 'text-blue-500'
      })),
      ...packages.slice(0, 2).map(p => ({
        id: p._id,
        type: 'package',
        title: `Package "${p.name}" created`,
        time: timeAgo(p.createdAt),
        icon: Package,
        color: 'text-green-500'
      }))
    ].sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 6)
    
    setRecentActivity(activities)
  }

  const findPopularPackages = () => {
    const packageCounts = {}
    bookings.forEach(booking => {
      if (booking.packageName) {
        packageCounts[booking.packageName] = (packageCounts[booking.packageName] || 0) + 1
      }
    })
    
    const popular = Object.entries(packageCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
    
    setPopularPackages(popular)
  }

  const findUpcomingTrips = () => {
    const upcoming = bookings
      .filter(b => b.travelDate && new Date(b.travelDate) >= new Date() && b.paymentStatus === 'paid')
      .sort((a, b) => new Date(a.travelDate) - new Date(b.travelDate))
      .slice(0, 5)
    
    setUpcomingTrips(upcoming)
  }

  const refreshData = async () => {
    setLoading(true)
    try {
      await Promise.all([
        fetchPlaces(),
        fetchPackages(),
        fetchBlogs(),
        fetchContacts(),
        fetchReviews(),
        fetchBookings()
      ])
    } catch (error) {
      console.error('Error refreshing data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    switch(status) {
      case 'paid': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      case 'completed': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 animate-spin text-pink-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading dashboard data...</p>
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
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Dashboard Overview</h1>
            <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your business.</p>
          </div>
          <div className="flex gap-3 mt-4 md:mt-0">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 bg-white border border-gray-300 text-gray-900 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
            <button
              onClick={refreshData}
              className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors flex items-center justify-center"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </button>
          </div>
        </div>

        {/* Key Metrics - Booking Focused */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Bookings */}
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                <Ticket className="w-6 h-6" />
              </div>
              <span className="px-2 py-1 bg-white/20 rounded-full text-xs font-medium">
                +{growth.bookings}%
              </span>
            </div>
            <h3 className="text-lg font-semibold text-white/90">Total Bookings</h3>
            <p className="text-3xl font-bold mb-2">{stats.totalBookings}</p>
            <div className="flex items-center text-white/80 text-sm">
              <span>{stats.pendingBookings} pending</span>
              <span className="mx-2">•</span>
              <span>{stats.confirmedBookings} confirmed</span>
            </div>
          </div>

          {/* Revenue */}
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                <DollarSign className="w-6 h-6" />
              </div>
              <span className="px-2 py-1 bg-white/20 rounded-full text-xs font-medium">
                +{growth.revenue}%
              </span>
            </div>
            <h3 className="text-lg font-semibold text-white/90">Total Revenue</h3>
            <p className="text-3xl font-bold mb-2">₹{stats.totalRevenue.toLocaleString()}</p>
            <div className="flex items-center text-white/80 text-sm">
              <span>Advance: ₹{stats.advanceCollected.toLocaleString()}</span>
            </div>
          </div>

          {/* Total Travelers */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                <Users className="w-6 h-6" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-white/90">Total Travelers</h3>
            <p className="text-3xl font-bold mb-2">{stats.totalTravelers}</p>
            <div className="flex items-center text-white/80 text-sm">
              <span>Avg {(stats.totalTravelers / (stats.totalBookings || 1)).toFixed(1)} per booking</span>
            </div>
          </div>

          {/* Upcoming Trips */}
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                <Calendar className="w-6 h-6" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-white/90">Upcoming Trips</h3>
            <p className="text-3xl font-bold mb-2">{stats.upcomingBookings}</p>
            <div className="flex items-center text-white/80 text-sm">
              <span>{stats.todayBookings} today</span>
            </div>
          </div>
        </div>

        {/* Secondary Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Pending Bookings */}
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Bookings</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pendingBookings}</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          {/* Completed Bookings */}
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">{stats.completedBookings}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          {/* Cancelled */}
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-red-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Cancelled</p>
                <p className="text-2xl font-bold text-gray-900">{stats.cancelledBookings}</p>
              </div>
              <div className="p-3 bg-red-100 rounded-lg">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>

          {/* Balance Pending */}
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Balance Pending</p>
                <p className="text-2xl font-bold text-gray-900">₹{stats.balancePending.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <Wallet className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Recent Bookings */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Recent Bookings</h2>
              <Link href="/admin/bookings" className="text-pink-600 hover:text-pink-700 text-sm font-medium">
                View all →
              </Link>
            </div>
            
            <div className="space-y-4">
              {recentBookings.length > 0 ? (
                recentBookings.map((booking) => (
                  <div key={booking._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <Users className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{booking.name}</p>
                        <p className="text-sm text-gray-600">{booking.packageName || 'Custom Package'} • {booking.numberOfPeople} people</p>
                        <p className="text-xs text-gray-500">{timeAgo(booking.createdAt)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">₹{booking.totalPrice?.toLocaleString()}</p>
                      <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(booking.paymentStatus)}`}>
                        {booking.paymentStatus}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 py-4">No bookings yet</p>
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Popular Packages */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Popular Packages</h2>
              
              <div className="space-y-4">
                {popularPackages.length > 0 ? (
                  popularPackages.map((pkg, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center mr-3">
                          <Award className="w-4 h-4 text-pink-600" />
                        </div>
                        <span className="text-sm font-medium text-gray-900">{pkg.name}</span>
                      </div>
                      <span className="text-sm font-bold text-pink-600">{pkg.count} bookings</span>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500 py-4">No data available</p>
                )}
              </div>
            </div>

            {/* Upcoming Trips */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Upcoming Trips</h2>
              
              <div className="space-y-4">
                {upcomingTrips.length > 0 ? (
                  upcomingTrips.map((trip) => (
                    <div key={trip._id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{trip.name}</p>
                        <p className="text-sm text-gray-600">{trip.packageName}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(trip.travelDate).toLocaleDateString('en-IN', { 
                            day: 'numeric', month: 'short', year: 'numeric' 
                          })}
                        </p>
                      </div>
                      <span className="text-sm font-medium text-pink-600">
                        {trip.numberOfPeople} people
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500 py-4">No upcoming trips</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
            <Activity className="w-5 h-5 text-gray-400" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentActivity.map((activity) => {
              const Icon = activity.icon
              return (
                <div key={activity.id} className="flex items-start p-3 bg-gray-50 rounded-lg">
                  <div className={`p-2 rounded-lg mr-3 ${activity.color.replace('text-', 'bg-')} bg-opacity-10`}>
                    <Icon className={`w-4 h-4 ${activity.color}`} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                    {activity.status && (
                      <span className={`inline-block mt-1 px-2 py-0.5 text-xs font-medium rounded-full ${getStatusColor(activity.status)}`}>
                        {activity.status}
                      </span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Content Overview Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-md p-4">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg mr-3">
                <MapPin className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Places</p>
                <p className="text-xl font-bold text-gray-900">{stats.totalPlaces}</p>
                <p className="text-xs text-gray-500">{stats.activePlaces} active</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-4">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg mr-3">
                <Package className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Packages</p>
                <p className="text-xl font-bold text-gray-900">{stats.totalPackages}</p>
                <p className="text-xs text-gray-500">{stats.activePackages} active</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-4">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg mr-3">
                <FileText className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Blogs</p>
                <p className="text-xl font-bold text-gray-900">{stats.totalBlogs}</p>
                <p className="text-xs text-gray-500">{stats.publishedBlogs} published</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-4">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg mr-3">
                <MessageSquare className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Contacts</p>
                <p className="text-xl font-bold text-gray-900">{stats.totalContacts}</p>
                <p className="text-xs text-yellow-600">{stats.pendingContacts} pending</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-4">
            <div className="flex items-center">
              <div className="p-2 bg-pink-100 rounded-lg mr-3">
                <Star className="w-5 h-5 text-pink-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Reviews</p>
                <p className="text-xl font-bold text-gray-900">{stats.totalReviews}</p>
                <p className="text-xs text-gray-500">{stats.avgRating} ★ avg</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            <button
              onClick={() => router.push('/admin/bookings')}
              className="flex flex-col items-center justify-center p-4 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors"
            >
              <Ticket className="w-6 h-6 mb-2" />
              <span className="text-sm">View Bookings</span>
            </button>
            
            <button
              onClick={() => router.push('/admin/places')}
              className="flex flex-col items-center justify-center p-4 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <MapPin className="w-6 h-6 mb-2" />
              <span className="text-sm">Add Place</span>
            </button>
            
            <button
              onClick={() => router.push('/admin/packages')}
              className="flex flex-col items-center justify-center p-4 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
            >
              <Package className="w-6 h-6 mb-2" />
              <span className="text-sm">Add Package</span>
            </button>
            
            <button
              onClick={() => router.push('/admin/blogs')}
              className="flex flex-col items-center justify-center p-4 bg-orange-50 text-orange-600 rounded-lg hover:bg-orange-100 transition-colors"
            >
              <FileText className="w-6 h-6 mb-2" />
              <span className="text-sm">Write Blog</span>
            </button>
            
            <button
              onClick={() => router.push('/admin/contacts')}
              className="flex flex-col items-center justify-center p-4 bg-yellow-50 text-yellow-600 rounded-lg hover:bg-yellow-100 transition-colors"
            >
              <MessageSquare className="w-6 h-6 mb-2" />
              <span className="text-sm">Messages</span>
            </button>
            
            <button
              onClick={() => router.push('/admin/reviews')}
              className="flex flex-col items-center justify-center p-4 bg-pink-50 text-pink-600 rounded-lg hover:bg-pink-100 transition-colors"
            >
              <Star className="w-6 h-6 mb-2" />
              <span className="text-sm">Reviews</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}