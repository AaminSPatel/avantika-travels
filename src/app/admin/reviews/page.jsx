'use client'

import { useEffect, useState, useRef } from 'react'
import { useSite } from '../../../context/site-context'
import { X, Edit, Trash2, Eye, Star, User, Mail, Calendar, CheckCircle, Clock, AlertCircle, Check, Package, MapPin, Upload, Plus } from 'lucide-react'

export default function AdminReviews() {
  const { reviews, fetchReviews, updateReview, deleteReview, toggleReviewStatus } = useSite()
  const [viewMode, setViewMode] = useState('grid')
  const [showForm, setShowForm] = useState(false)
  const [showDetails, setShowDetails] = useState(null)
  const [editingReview, setEditingReview] = useState(null)
  const [alert, setAlert] = useState({ show: false, type: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterType, setFilterType] = useState('all')
  const [ratingFilter, setRatingFilter] = useState('all')
  const [sortBy, setSortBy] = useState('newest')

  const statusOptions = [
    { value: 'pending', label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'approved', label: 'Approved', color: 'bg-green-100 text-green-800' },
    { value: 'rejected', label: 'Rejected', color: 'bg-red-100 text-red-800' }
  ]

  const ratingOptions = [
    { value: '5', label: '★★★★★', color: 'text-yellow-400' },
    { value: '4', label: '★★★★☆', color: 'text-yellow-400' },
    { value: '3', label: '★★★☆☆', color: 'text-yellow-400' },
    { value: '2', label: '★★☆☆☆', color: 'text-yellow-400' },
    { value: '1', label: '★☆☆☆☆', color: 'text-yellow-400' }
  ]

  const [formData, setFormData] = useState({
    userName: '',
    email: '',
    rating: 5,
    comment: '',
    status: 'pending',
    packageId: '',
    placeId: '',
    images: []
  })

  // Image upload states
  const [images, setImages] = useState([])
  const [selectedFiles, setSelectedFiles] = useState([])
  const fileInputRef = useRef(null)

  useEffect(() => {
    fetchReviews()
  }, [fetchReviews])

  const showAlert = (type, message) => {
    setAlert({ show: true, type, message })
    setTimeout(() => {
      setAlert({ show: false, type: '', message: '' })
    }, 3000)
  }

  const handleEdit = (review) => {
    setEditingReview(review)
    setImages(review.images || [])
    setFormData({
      userName: review.userName,
      email: review.email,
      rating: review.rating,
      comment: review.comment,
      status: review.status,
      packageId: review.packageId?._id || '',
      placeId: review.placeId?._id || '',
      images: review.images || []
    })
    setShowForm(true)
  }

  const handleViewDetails = (review) => {
    setShowDetails(review)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        const token = localStorage.getItem('adminToken')
        await deleteReview(id, token)
        showAlert('success', 'Review deleted successfully!')
      } catch (error) {
        showAlert('error', 'Error deleting review')
      }
    }
  }

  const handleStatusChange = async (id, newStatus) => {
    try {
      const token = localStorage.getItem('adminToken')
      await updateReview(id, { status: newStatus }, token)
      showAlert('success', `Review ${newStatus} successfully!`)
    } catch (error) {
      showAlert('error', 'Error updating review status')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const token = localStorage.getItem('adminToken')
      await updateReview(editingReview._id, formData, token)
      showAlert('success', 'Review updated successfully!')
      setShowForm(false)
    } catch (error) {
      showAlert('error', `Error updating review: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files)
    const newImages = files.map(file => ({ url: URL.createObjectURL(file), public_id: `temp_${Date.now()}_${Math.random()}` }))
    setImages([...images, ...newImages])
    setSelectedFiles(files)
  }

  const handleImageRemove = (index) => {
    const newImages = [...images]
    newImages.splice(index, 1)
    setImages(newImages)
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Render star rating
  const renderStars = (rating) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
          />
        ))}
        <span className="ml-2 text-sm font-medium">{rating.toFixed(1)}</span>
      </div>
    )
  }

  // Filter and sort reviews
  const filteredReviews = reviews
    .filter(review => {
      const matchesSearch = 
        review.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (review.packageId?.title?.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (review.placeId?.title?.toLowerCase().includes(searchTerm.toLowerCase()))
      
      const matchesStatus = filterStatus === 'all' || review.status === filterStatus
      const matchesType = filterType === 'all' || 
        (filterType === 'package' && review.packageId) ||
        (filterType === 'place' && review.placeId)
      const matchesRating = ratingFilter === 'all' || review.rating === parseInt(ratingFilter)
      
      return matchesSearch && matchesStatus && matchesType && matchesRating
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt)
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt)
        case 'rating-high':
          return b.rating - a.rating
        case 'rating-low':
          return a.rating - b.rating
        case 'name':
          return a.userName.localeCompare(b.userName)
        default:
          return new Date(b.createdAt) - new Date(a.createdAt)
      }
    })

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Alert Component */}
      {alert.show && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
          alert.type === 'success' ? 'bg-green-100 text-green-800 border-l-4 border-green-500' : 
          'bg-red-100 text-red-800 border-l-4 border-red-500'
        }`}>
          <div className="flex items-center">
            {alert.type === 'success' ? (
              <Check className="w-5 h-5 mr-2" />
            ) : (
              <AlertCircle className="w-5 h-5 mr-2" />
            )}
            <span>{alert.message}</span>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-black">Customer Reviews</h1>
            <p className="text-gray-600 mt-1">Manage and moderate customer reviews</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 mt-4 md:mt-0">
            <button
              onClick={() => setViewMode(viewMode === 'grid' ? 'table' : 'grid')}
              className="px-4 py-2 bg-white border border-gray-300 text-black rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center"
            >
              {viewMode === 'grid' ? 'Table View' : 'Grid View'}
            </button>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Search Reviews</label>
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name, email, comment, or item..."
                  className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                />
                <User className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              >
                <option value="all">All Statuses</option>
                {statusOptions.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              >
                <option value="all">All Types</option>
                <option value="package">Packages</option>
                <option value="place">Places</option>
              </select>
            </div>

            {/* Rating Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
              <select
                value={ratingFilter}
                onChange={(e) => setRatingFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              >
                <option value="all">All Ratings</option>
                {ratingOptions.map((rating) => (
                  <option key={rating.value} value={rating.value}>
                    {rating.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Sort By */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
            <div className="flex flex-wrap gap-2">
              {[
                { value: 'newest', label: 'Newest First' },
                { value: 'oldest', label: 'Oldest First' },
                { value: 'rating-high', label: 'Highest Rating' },
                { value: 'rating-low', label: 'Lowest Rating' },
                { value: 'name', label: 'Name A-Z' }
              ].map((sort) => (
                <button
                  key={sort.value}
                  type="button"
                  onClick={() => setSortBy(sort.value)}
                  className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                    sortBy === sort.value
                      ? 'bg-black text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {sort.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Reviews</p>
                <p className="text-2xl font-bold text-black">{reviews.length}</p>
              </div>
              <Star className="w-8 h-8 text-gray-400" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {reviews.filter(r => r.status === 'pending').length}
                </p>
              </div>
              <Clock className="w-8 h-8 text-yellow-400" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-green-600">
                  {reviews.filter(r => r.status === 'approved').length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Average Rating</p>
                <p className="text-2xl font-bold text-pink-600">
                  {reviews.length > 0 
                    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
                    : '0.0'
                  }
                </p>
              </div>
              <Star className="w-8 h-8 text-pink-400" />
            </div>
          </div>
        </div>

        {/* Grid View */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredReviews.map((review) => (
              <div key={review._id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="p-5">
                  {/* Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-black">{review.userName}</h3>
                      <p className="text-sm text-gray-600">{formatDate(review.createdAt)}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      statusOptions.find(s => s.value === review.status)?.color || 'bg-gray-100 text-gray-800'
                    }`}>
                      {statusOptions.find(s => s.value === review.status)?.label || review.status}
                    </span>
                  </div>

                  {/* Rating */}
                  <div className="mb-4">
                    {renderStars(review.rating)}
                  </div>

                  {/* Comment */}
                  <div className="mb-4">
                    <p className="text-gray-600 text-sm line-clamp-3">{review.comment}</p>
                  </div>

                  {/* Review For */}
                  <div className="mb-4">
                    <div className="flex items-center text-sm text-gray-600 mb-2">
                      {review.packageId ? (
                        <>
                          <Package className="w-4 h-4 mr-2" />
                          <span>Package Review</span>
                        </>
                      ) : review.placeId ? (
                        <>
                          <MapPin className="w-4 h-4 mr-2" />
                          <span>Place Review</span>
                        </>
                      ) : null}
                    </div>
                    <p className="text-sm font-medium text-black">
                      {review.packageId?.title || review.placeId?.title || 'Unknown Item'}
                    </p>
                  </div>

                  {/* Contact Info */}
                  <div className="mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Mail className="w-4 h-4 mr-2" />
                      <a 
                        href={`mailto:${review.email}`}
                        className="text-pink-600 hover:text-pink-700 truncate"
                      >
                        {review.email}
                      </a>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-100">
                    <button
                      onClick={() => handleViewDetails(review)}
                      className="flex-1 min-w-[80px] px-3 py-2 bg-gray-100 text-black rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center text-sm"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </button>
                    <button
                      onClick={() => handleEdit(review)}
                      className="flex-1 min-w-[80px] px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center text-sm"
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(review._id)}
                      className="flex-1 min-w-[80px] px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center text-sm"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Delete
                    </button>
                  </div>

                  {/* Quick Status Actions */}
                  <div className="flex flex-wrap gap-2 mt-4">
                    {statusOptions
                      .filter(status => status.value !== review.status)
                      .map((status) => (
                        <button
                          key={status.value}
                          onClick={() => handleStatusChange(review._id, status.value)}
                          className={`px-3 py-1 text-xs rounded-lg transition-colors ${
                            status.value === 'approved' 
                              ? 'bg-green-100 text-green-800 hover:bg-green-200'
                              : status.value === 'rejected'
                              ? 'bg-red-100 text-red-800 hover:bg-red-200'
                              : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                          }`}
                        >
                          Mark as {status.label}
                        </button>
                      ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Table View */
          <div className="bg-white rounded-xl shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Reviewer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rating
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Review For
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredReviews.map((review) => (
                    <tr key={review._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-black">{review.userName}</div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">
                            <a href={`mailto:${review.email}`} className="text-pink-600 hover:text-pink-700">
                              {review.email}
                            </a>
                          </div>
                          <div className="text-sm text-gray-600 truncate max-w-xs mt-1">
                            {review.comment.substring(0, 60)}...
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          {renderStars(review.rating)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-black">
                          {review.packageId?.title || review.placeId?.title || 'Unknown Item'}
                        </div>
                        <div className="text-xs text-gray-500">
                          {review.packageId ? 'Package' : 'Place'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                          {formatDate(review.createdAt)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          statusOptions.find(s => s.value === review.status)?.color || 'bg-gray-100 text-gray-800'
                        }`}>
                          {statusOptions.find(s => s.value === review.status)?.label || review.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleViewDetails(review)}
                            className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-xs"
                          >
                            View
                          </button>
                          <button
                            onClick={() => handleEdit(review)}
                            className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-xs"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(review._id)}
                            className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-xs"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Empty State */}
        {filteredReviews.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Star className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm || filterStatus !== 'all' || filterType !== 'all' || ratingFilter !== 'all' 
                ? 'No matching reviews found' 
                : 'No reviews yet'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || filterStatus !== 'all' || filterType !== 'all' || ratingFilter !== 'all'
                ? 'Try adjusting your search or filter criteria'
                : 'Customer reviews will appear here once submitted'}
            </p>
            {(searchTerm || filterStatus !== 'all' || filterType !== 'all' || ratingFilter !== 'all') && (
              <button
                onClick={() => {
                  setSearchTerm('')
                  setFilterStatus('all')
                  setFilterType('all')
                  setRatingFilter('all')
                }}
                className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors inline-flex items-center"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}

        {/* Form Modal */}
        {showForm && editingReview && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
                <h2 className="text-xl font-bold text-black">Edit Review</h2>
                <button
                  onClick={() => setShowForm(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6">
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Reviewer Name *
                      </label>
                      <input
                        type="text"
                        value={formData.userName}
                        onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rating *
                    </label>
                    <div className="flex items-center space-x-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setFormData({ ...formData, rating: star })}
                          className="p-1"
                        >
                          <Star
                            className={`w-8 h-8 ${star <= formData.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                          />
                        </button>
                      ))}
                      <span className="ml-4 text-lg font-bold text-black">{formData.rating} / 5</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Comment *
                    </label>
                    <textarea
                      value={formData.comment}
                      onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent h-32"
                      rows="6"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    >
                      {statusOptions.map((status) => (
                        <option key={status.value} value={status.value}>
                          {status.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Review For
                    </label>
                    <div className="text-sm text-black p-3 bg-gray-50 rounded-lg">
                      {editingReview.packageId ? (
                        <div className="flex items-center">
                          <Package className="w-4 h-4 mr-2 text-gray-400" />
                          <span>Package: {editingReview.packageId.title}</span>
                        </div>
                      ) : editingReview.placeId ? (
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                          <span>Place: {editingReview.placeId.title}</span>
                        </div>
                      ) : (
                        <span className="text-gray-500">Not associated with any item</span>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Images
                    </label>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleFileSelect}
                          multiple
                          accept="image/*"
                          className="hidden"
                        />
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
                        >
                          <Upload className="w-4 h-4" />
                          Select Images
                        </button>
                        <span className="text-sm text-gray-500">
                          {images.length} image{images.length !== 1 ? 's' : ''} selected
                        </span>
                      </div>

                      {images.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                          {images.map((image, index) => (
                            <div key={index} className="relative group">
                              <img
                                src={image.url}
                                alt={`Preview ${index + 1}`}
                                className="w-full h-24 object-cover rounded-lg border"
                              />
                              <button
                                type="button"
                                onClick={() => handleImageRemove(index)}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-700 mb-3">Review Information</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Submitted:</span>
                        <span className="text-black font-medium">{formatDate(editingReview.createdAt)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Last Updated:</span>
                        <span className="text-black font-medium">
                          {editingReview.updatedAt ? formatDate(editingReview.updatedAt) : 'Never'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Current Rating:</span>
                        <span className="text-black font-medium">{editingReview.rating} stars</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Saving...
                      </span>
                    ) : (
                      'Save Changes'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Details Modal */}
        {showDetails && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
                <h2 className="text-xl font-bold text-black">Review Details</h2>
                <button
                  onClick={() => setShowDetails(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6">
                <div className="space-y-6">
                  {/* Header */}
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-2xl font-bold text-black">{showDetails.userName}</h3>
                      <div className="flex items-center mt-2 text-gray-600">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span>{formatDate(showDetails.createdAt)}</span>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      statusOptions.find(s => s.value === showDetails.status)?.color || 'bg-gray-100 text-gray-800'
                    }`}>
                      {statusOptions.find(s => s.value === showDetails.status)?.label || showDetails.status}
                    </span>
                  </div>

                  {/* Rating */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Rating</h4>
                    <div className="flex items-center">
                      {renderStars(showDetails.rating)}
                      <span className="ml-4 text-lg font-bold text-pink-600">{showDetails.rating} / 5</span>
                    </div>
                  </div>

                  {/* Review For */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Review For</h4>
                    <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                      {showDetails.packageId ? (
                        <>
                          <Package className="w-5 h-5 text-gray-400 mr-3" />
                          <div>
                            <div className="font-medium text-black">{showDetails.packageId.title}</div>
                            <div className="text-sm text-gray-600">Package</div>
                          </div>
                        </>
                      ) : showDetails.placeId ? (
                        <>
                          <MapPin className="w-5 h-5 text-gray-400 mr-3" />
                          <div>
                            <div className="font-medium text-black">{showDetails.placeId.title}</div>
                            <div className="text-sm text-gray-600">Place</div>
                          </div>
                        </>
                      ) : (
                        <span className="text-gray-500">Not associated with any item</span>
                      )}
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Contact Information</h4>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <Mail className="w-5 h-5 text-gray-400 mr-3" />
                        <div>
                          <div className="text-sm text-gray-500">Email</div>
                          <a 
                            href={`mailto:${showDetails.email}`}
                            className="text-black font-medium hover:text-pink-600"
                          >
                            {showDetails.email}
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Comment */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Comment</h4>
                    <div className="text-gray-700 p-4 bg-gray-50 rounded-lg whitespace-pre-wrap">
                      {showDetails.comment}
                    </div>
                  </div>

                  <div className="pt-6 border-t">
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-gray-500">
                        Last updated: {showDetails.updatedAt ? formatDate(showDetails.updatedAt) : 'Never'}
                      </div>
                      <div className="flex gap-3">
                        <button
                          onClick={() => {
                            setShowDetails(null)
                            handleEdit(showDetails)
                          }}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Edit Review
                        </button>
                        <button
                          onClick={() => handleDelete(showDetails._id)}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}