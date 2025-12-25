'use client'

import { useEffect, useState, useRef } from 'react'
import { useSite } from '../../../context/site-context'
import { X, Edit, Trash2, Eye, Upload, Plus, Star, MapPin, Clock, Calendar, Users, Check, AlertCircle } from 'lucide-react'

export default function AdminPlaces() {
  const { places, fetchPlaces, createPlace, updatePlace, deletePlace, togglePlaceStatus, uploadPlaceImages } = useSite()
  const [viewMode, setViewMode] = useState('grid')
  const [showForm, setShowForm] = useState(false)
  const [showDetails, setShowDetails] = useState(null)
  const [editingPlace, setEditingPlace] = useState(null)
  const [alert, setAlert] = useState({ show: false, type: '', message: '' })
  const [images, setImages] = useState([])
  const [newImage, setNewImage] = useState('')
  const [selectedFiles, setSelectedFiles] = useState([])
  const [loading, setLoading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef(null)

  const categories = ['Hill Station', 'Beach', 'Temple', 'Historical', 'Adventure', 'Wildlife', 'City', 'Cultural', 'Religious']

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    price: '',
    category: 'Hill Station',
    openingHours: '',
    bestTimeToVisit: '',
    rating: 0,
    entryFee: '',
    visitors: '',
    trips: '',
    cleaness: 0,
    isActive: true
  })

  useEffect(() => {
    fetchPlaces()
  }, [fetchPlaces])

  const showAlert = (type, message) => {
    setAlert({ show: true, type, message })
    setTimeout(() => {
      setAlert({ show: false, type: '', message: '' })
    }, 3000)
  }

  const handleAdd = () => {
    setEditingPlace(null)
    setImages([])
    setSelectedFiles([])
    setFormData({
      title: '',
      description: '',
      location: '',
      price: '',
      category: 'Hill Station',
      openingHours: '',
      bestTimeToVisit: '',
      rating: 0,
      entryFee: '',
      visitors: '',
      trips: '',
      cleaness: 0,
      isActive: true
    })
    setShowForm(true)
  }

  const handleEdit = (place) => {
    setEditingPlace(place)
    setImages(place.images || [])
    setSelectedFiles([])
    setFormData({
      title: place.title || '',
      description: place.description || '',
      location: place.location || '',
      price: place.price || '',
      category: place.category || 'Hill Station',
      openingHours: place.openingHours || '',
      bestTimeToVisit: place.bestTimeToVisit || '',
      rating: place.rating || 0,
      entryFee: place.entryFee || '',
      visitors: place.visitors || '',
      trips: place.trips || '',
      cleaness: place.cleaness || 0,
      isActive: place.isActive !== undefined ? place.isActive : true
    })
    setShowForm(true)
  }

  const handleViewDetails = (place) => {
    setShowDetails(place)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this place?')) {
      try {
        const token = localStorage.getItem('adminToken')
        await deletePlace(id, token)
        showAlert('success', 'Place deleted successfully!')
      } catch (error) {
        showAlert('error', 'Error deleting place')
      }
    }
  }

  const handleToggleStatus = async (id) => {
    try {
      const token = localStorage.getItem('adminToken')
      await togglePlaceStatus(id, token)
      showAlert('success', 'Status updated successfully!')
    } catch (error) {
      showAlert('error', 'Error updating status')
    }
  }

  const handleImageAdd = () => {
    if (newImage.trim()) {
      setImages([...images, { url: newImage, public_id: `temp_${Date.now()}` }])
      setNewImage('')
    }
  }

  const handleImageRemove = (index) => {
    const newImages = [...images]
    newImages.splice(index, 1)
    setImages(newImages)
  }

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files)
    setSelectedFiles(files)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setDragOver(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    const files = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith('image/'))
    if (files.length > 0) {
      setSelectedFiles(files)
    }
  }

  const handleBrowseClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileUpload = async () => {
    if (selectedFiles.length === 0) return

    try {
      setLoading(true)
      const token = localStorage.getItem('adminToken')
      const uploadedImages = await uploadPlaceImages(selectedFiles, token)
      setImages([...images, ...uploadedImages])
      setSelectedFiles([])
      showAlert('success', 'Images uploaded successfully!')
    } catch (error) {
      showAlert('error', 'Error uploading images')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const token = localStorage.getItem('adminToken')
      const dataToSubmit = {
        ...formData,
        selectedFiles: selectedFiles, // Send the selected files for upload
        images: images, // Send the uploaded image objects
        price: Number(formData.price),
        rating: Number(formData.rating),
        entryFee: Number(formData.entryFee),
        visitors: Number(formData.visitors),
        trips: Number(formData.trips),
        cleaness: Number(formData.cleaness),
        isActive: formData.isActive
      }

      if (editingPlace) {
        await updatePlace(editingPlace._id, dataToSubmit, token)
        showAlert('success', 'Place updated successfully!')
      } else {
        await createPlace(dataToSubmit, token)
        showAlert('success', 'Place created successfully!')
      }

      setShowForm(false)
    } catch (error) {
      showAlert('error', `Error saving place: ${error.message}`)
    } finally {
      setLoading(false)
    }
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
            <h1 className="text-2xl md:text-3xl font-bold text-black">Tourist Places</h1>
            <p className="text-gray-600 mt-1">Manage tourist destinations and attractions</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 mt-4 md:mt-0">
            <button
              onClick={() => setViewMode(viewMode === 'grid' ? 'table' : 'grid')}
              className="px-4 py-2 bg-white border border-gray-300 text-black rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center"
            >
              {viewMode === 'grid' ? 'Table View' : 'Grid View'}
            </button>
            <button
              onClick={handleAdd}
              className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Place
            </button>
          </div>
        </div>

        {/* Grid View */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {places.map((place) => (
              <div key={place._id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                {/* Image */}
                <div className="relative h-48">
                  <img 
                    src={place.images?.[0]?.url || '/placeholder.jpg'} 
                    alt={place.title} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 bg-white/90 text-black text-xs font-medium rounded-full">
                      {place.category}
                    </span>
                  </div>
                  <div className="absolute bottom-3 left-3 right-3">
                    <h3 className="text-white font-bold text-lg truncate">{place.title}</h3>
                    <div className="flex items-center text-white/90 text-sm">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span className="truncate">{place.location}</span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="flex items-center mb-1">
                        {renderStars(place.rating || 0)}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Users className="w-4 h-4 mr-1" />
                        <span>{place.visitors?.toLocaleString() || 0} visitors</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-pink-600">₹{place.price}</div>
                      <div className="text-sm text-gray-500">Entry: ₹{place.entryFee || 0}</div>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{place.description}</p>
                  
                  <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2 text-gray-400" />
                      <span className="text-gray-700 truncate">{place.openingHours || 'N/A'}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                      <span className="text-gray-700 truncate">{place.bestTimeToVisit || 'All Year'}</span>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex justify-between mb-4 text-sm">
                    <div className="text-center">
                      <div className="font-bold text-black">{place.trips || 0}</div>
                      <div className="text-gray-500">Trips</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-black">{place.cleaness || 0}/10</div>
                      <div className="text-gray-500">Cleanliness</div>
                    </div>
                    <div className="text-center">
                      <div className={`font-bold ${place.isActive ? 'text-green-600' : 'text-red-600'}`}>
                        {place.isActive ? 'Active' : 'Inactive'}
                      </div>
                      <div className="text-gray-500">Status</div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-100">
                    <button
                      onClick={() => handleViewDetails(place)}
                      className="flex-1 min-w-[80px] px-3 py-2 bg-gray-100 text-black rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center text-sm"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </button>
                    <button
                      onClick={() => handleEdit(place)}
                      className="flex-1 min-w-[80px] px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center text-sm"
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleToggleStatus(place._id)}
                      className={`flex-1 min-w-[80px] px-3 py-2 rounded-lg transition-colors flex items-center justify-center text-sm ${
                        place.isActive 
                          ? 'bg-yellow-600 text-white hover:bg-yellow-700' 
                          : 'bg-green-600 text-white hover:bg-green-700'
                      }`}
                    >
                      {place.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                    <button
                      onClick={() => handleDelete(place._id)}
                      className="flex-1 min-w-[80px] px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center text-sm"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Delete
                    </button>
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
                      Place
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rating
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
                  {places.map((place) => (
                    <tr key={place._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            <img
                              className="h-10 w-10 rounded-lg object-cover"
                              src={place.images?.[0]?.url || '/placeholder.jpg'}
                              alt={place.title}
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-black">{place.title}</div>
                            <div className="text-sm text-gray-500">
                              Visitors: {place.visitors?.toLocaleString() || 0}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                          {place.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                          {place.location}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-pink-600">
                        ₹{place.price}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {renderStars(place.rating || 0)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          place.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {place.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleViewDetails(place)}
                            className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-xs"
                          >
                            View
                          </button>
                          <button
                            onClick={() => handleEdit(place)}
                            className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-xs"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(place._id)}
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
        {places.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <MapPin className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No places added yet</h3>
            <p className="text-gray-600 mb-6">Start by adding your first tourist destination.</p>
            <button
              onClick={handleAdd}
              className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors inline-flex items-center"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add First Place
            </button>
          </div>
        )}

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
                <h2 className="text-xl font-bold text-black">
                  {editingPlace ? 'Edit Place' : 'Add New Place'}
                </h2>
                <button
                  onClick={() => setShowForm(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left Column */}
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Place Name *
                      </label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description *
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent h-32"
                        rows="4"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Location *
                      </label>
                      <input
                        type="text"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Category *
                        </label>
                        <select
                          value={formData.category}
                          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                          required
                        >
                          {categories.map((cat) => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Price (₹) *
                        </label>
                        <input
                          type="number"
                          value={formData.price}
                          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                          required
                          min="0"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Entry Fee (₹)
                        </label>
                        <input
                          type="number"
                          value={formData.entryFee}
                          onChange={(e) => setFormData({ ...formData, entryFee: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                          min="0"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Rating (0-5)
                        </label>
                        <input
                          type="number"
                          value={formData.rating}
                          onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                          min="0"
                          max="5"
                          step="0.1"
                        />
                      </div>
                    </div>

                    {/* Images */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Images *
                      </label>

                      {/* Drag and Drop File Upload Section */}
                      <div className="mb-4">
                        <div
                          onDragOver={handleDragOver}
                          onDragLeave={handleDragLeave}
                          onDrop={handleDrop}
                          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                            dragOver
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                          onClick={handleBrowseClick}
                        >
                          <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                          <p className="text-sm text-gray-600 mb-1">
                            Drag and drop images here, or click to browse
                          </p>
                          <p className="text-xs text-gray-500">
                            Supports multiple image files
                          </p>
                        </div>
                        <input
                          ref={fileInputRef}
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handleFileSelect}
                          className="hidden"
                        />
                        {selectedFiles.length > 0 && (
                          <div className="mt-2">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-sm text-gray-600">{selectedFiles.length} file(s) selected</span>
                              <button
                                type="button"
                                onClick={handleFileUpload}
                                disabled={loading}
                                className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                              >
                                {loading ? 'Uploading...' : 'Upload'}
                              </button>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                              {selectedFiles.map((file, index) => (
                                <div key={index} className="relative">
                                  <img
                                    src={URL.createObjectURL(file)}
                                    alt={`Preview ${index + 1}`}
                                    className="w-full h-16 object-cover rounded-lg"
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* URL Input Section */}
                      <div className="flex gap-2 mb-4">
                        <input
                          type="text"
                          value={newImage}
                          onChange={(e) => setNewImage(e.target.value)}
                          placeholder="Enter image URL"
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                        />
                        <button
                          type="button"
                          onClick={handleImageAdd}
                          className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                        >
                          <Plus className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {images.map((img, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={img.url}
                              alt={`Place ${index + 1}`}
                              className="w-full h-24 object-cover rounded-lg"
                            />
                            <button
                              type="button"
                              onClick={() => handleImageRemove(index)}
                              className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Opening Hours
                      </label>
                      <input
                        type="text"
                        value={formData.openingHours}
                        onChange={(e) => setFormData({ ...formData, openingHours: e.target.value })}
                        placeholder="e.g., 9:00 AM - 6:00 PM"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Best Time to Visit
                      </label>
                      <input
                        type="text"
                        value={formData.bestTimeToVisit}
                        onChange={(e) => setFormData({ ...formData, bestTimeToVisit: e.target.value })}
                        placeholder="e.g., October to March"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Total Visitors
                        </label>
                        <input
                          type="number"
                          value={formData.visitors}
                          onChange={(e) => setFormData({ ...formData, visitors: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                          min="0"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Total Trips
                        </label>
                        <input
                          type="number"
                          value={formData.trips}
                          onChange={(e) => setFormData({ ...formData, trips: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                          min="0"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Cleanliness Rating (0-10)
                      </label>
                      <div className="flex items-center">
                        <input
                          type="range"
                          value={formData.cleaness}
                          onChange={(e) => setFormData({ ...formData, cleaness: e.target.value })}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                          min="0"
                          max="10"
                          step="1"
                        />
                        <span className="ml-4 text-black font-medium w-8">{formData.cleaness}</span>
                      </div>
                    </div>

                    {/* Status */}
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="isActive"
                        checked={formData.isActive}
                        onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                        className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
                      />
                      <label htmlFor="isActive" className="ml-2 text-sm text-gray-700">
                        Active Place
                      </label>
                    </div>

                    {/* Preview Section */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="text-sm font-medium text-gray-700 mb-3">Quick Preview</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Name:</span>
                          <span className="text-black font-medium">{formData.title || 'Not set'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Location:</span>
                          <span className="text-black font-medium">{formData.location || 'Not set'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Price:</span>
                          <span className="text-pink-600 font-bold">₹{formData.price || 0}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Images:</span>
                          <span className="text-black font-medium">{images.length} added</span>
                        </div>
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
                      editingPlace ? 'Update Place' : 'Create Place'
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
                <h2 className="text-xl font-bold text-black">Place Details</h2>
                <button
                  onClick={() => setShowDetails(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6">
                {/* Images Carousel */}
                <div className="mb-6">
                  <div className="grid grid-cols-3 gap-2">
                    {showDetails.images?.map((img, index) => (
                      <img
                        key={index}
                        src={img.url}
                        alt={`${showDetails.title} ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    ))}
                  </div>
                </div>

                {/* Place Info */}
                <div className="space-y-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-2xl font-bold text-black">{showDetails.title}</h3>
                      <div className="flex items-center mt-1 text-gray-600">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span>{showDetails.location}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-pink-600">₹{showDetails.price}</div>
                      <span className="text-sm text-gray-500">Starting price</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="text-sm text-gray-500">Category</div>
                      <div className="font-medium text-black">{showDetails.category}</div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="text-sm text-gray-500">Rating</div>
                      <div className="font-medium text-black">{renderStars(showDetails.rating || 0)}</div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="text-sm text-gray-500">Visitors</div>
                      <div className="font-medium text-black">{showDetails.visitors?.toLocaleString() || 0}</div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="text-sm text-gray-500">Status</div>
                      <div className={`font-medium ${showDetails.isActive ? 'text-green-600' : 'text-red-600'}`}>
                        {showDetails.isActive ? 'Active' : 'Inactive'}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-black mb-2">Description</h4>
                    <p className="text-gray-700">{showDetails.description}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-lg font-semibold text-black mb-3">Information</h4>
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <Clock className="w-5 h-5 text-gray-400 mr-3" />
                          <div>
                            <div className="text-sm text-gray-500">Opening Hours</div>
                            <div className="text-black">{showDetails.openingHours || 'Not specified'}</div>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="w-5 h-5 text-gray-400 mr-3" />
                          <div>
                            <div className="text-sm text-gray-500">Best Time to Visit</div>
                            <div className="text-black">{showDetails.bestTimeToVisit || 'All year'}</div>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <Users className="w-5 h-5 text-gray-400 mr-3" />
                          <div>
                            <div className="text-sm text-gray-500">Total Trips</div>
                            <div className="text-black">{showDetails.trips || 0}</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold text-black mb-3">Pricing</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Entry Fee:</span>
                          <span className="text-black font-medium">₹{showDetails.entryFee || 0}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Starting Price:</span>
                          <span className="text-pink-600 font-bold">₹{showDetails.price}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Cleanliness:</span>
                          <span className="text-black font-medium">{showDetails.cleaness || 0}/10</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t">
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-sm text-gray-500">Last updated:</span>
                        <span className="ml-2 text-black">
                          {new Date(showDetails.updatedAt || showDetails.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex gap-3">
                        <button
                          onClick={() => {
                            setShowDetails(null)
                            handleEdit(showDetails)
                          }}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Edit Place
                        </button>
                        <button
                          onClick={() => handleToggleStatus(showDetails._id)}
                          className={`px-4 py-2 rounded-lg transition-colors ${
                            showDetails.isActive 
                              ? 'bg-yellow-600 text-white hover:bg-yellow-700' 
                              : 'bg-green-600 text-white hover:bg-green-700'
                          }`}
                        >
                          {showDetails.isActive ? 'Deactivate' : 'Activate'}
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