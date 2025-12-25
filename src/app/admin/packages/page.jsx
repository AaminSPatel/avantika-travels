'use client'

import { useEffect, useState, useRef } from 'react'
import { useSite } from '../../../context/site-context'
import { X, Edit, Trash2, Eye, Upload, Image as ImageIcon, Plus, Check, AlertCircle } from 'lucide-react'

export default function AdminPackages() {
  const { packages, fetchPackages, createPackage, updatePackage, deletePackage, togglePackageStatus } = useSite()
  const [viewMode, setViewMode] = useState('grid')
  const [showForm, setShowForm] = useState(false)
  const [showDetails, setShowDetails] = useState(null)
  const [editingPackage, setEditingPackage] = useState(null)
  const [alert, setAlert] = useState({ show: false, type: '', message: '' })
  const [images, setImages] = useState([])
  const [selectedFiles, setSelectedFiles] = useState([])
  const [newInclusion, setNewInclusion] = useState('')
  const [newExclusion, setNewExclusion] = useState('')
  const [newItinerary, setNewItinerary] = useState('')
  const [loading, setLoading] = useState(false)
  const fileInputRef = useRef(null)

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    duration: '',
    destination: '',
    images: [],
    itinerary: [],
    inclusions: [],
    exclusions: [],
    status: true
  })

  useEffect(() => {
    fetchPackages()
  }, [fetchPackages])

  const showAlert = (type, message) => {
    setAlert({ show: true, type, message })
    setTimeout(() => {
      setAlert({ show: false, type: '', message: '' })
    }, 3000)
  }

  const handleAdd = () => {
    setEditingPackage(null)
    setImages([])
    setFormData({
      name: '',
      description: '',
      price: '',
      duration: '',
      destination: '',
      images: [],
      itinerary: [],
      inclusions: [],
      exclusions: [],
      status: true
    })
    setShowForm(true)
  }

  const handleEdit = (pkg) => {
    setEditingPackage(pkg)
    setImages(pkg.images || [])
    setFormData({
      name: pkg.name,
      description: pkg.description,
      price: pkg.price,
      duration: pkg.duration,
      destination: pkg.destination,
      images: pkg.images || [],
      itinerary: pkg.itinerary || [],
      inclusions: pkg.inclusions || [],
      exclusions: pkg.exclusions || [],
      status: pkg.status
    })
    setShowForm(true)
  }

  const handleViewDetails = (pkg) => {
    setShowDetails(pkg)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this package?')) {
      try {
        const token = localStorage.getItem('adminToken')
        await deletePackage(id, token)
        showAlert('success', 'Package deleted successfully!')
      } catch (error) {
        showAlert('error', 'Error deleting package')
      }
    }
  }

  const handleToggleStatus = async (id) => {
    try {
      const token = localStorage.getItem('adminToken')
      await togglePackageStatus(id, token)
      showAlert('success', 'Status updated successfully!')
    } catch (error) {
      showAlert('error', 'Error updating status')
    }
  }

  const handleImageRemove = (index) => {
    const newImages = [...images]
    newImages.splice(index, 1)
    setImages(newImages)
  }

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files)
    const newImages = files.map(file => ({ url: URL.createObjectURL(file), public_id: `temp_${Date.now()}_${Math.random()}` }))
    setImages([...images, ...newImages])
    setSelectedFiles(files)
  }



  const handleAddInclusion = () => {
    if (newInclusion.trim()) {
      setFormData({
        ...formData,
        inclusions: [...formData.inclusions, newInclusion]
      })
      setNewInclusion('')
    }
  }

  const handleRemoveInclusion = (index) => {
    const newInclusions = [...formData.inclusions]
    newInclusions.splice(index, 1)
    setFormData({ ...formData, inclusions: newInclusions })
  }

  const handleAddExclusion = () => {
    if (newExclusion.trim()) {
      setFormData({
        ...formData,
        exclusions: [...formData.exclusions, newExclusion]
      })
      setNewExclusion('')
    }
  }

  const handleRemoveExclusion = (index) => {
    const newExclusions = [...formData.exclusions]
    newExclusions.splice(index, 1)
    setFormData({ ...formData, exclusions: newExclusions })
  }

  const handleAddItinerary = () => {
    if (newItinerary.trim()) {
      setFormData({
        ...formData,
        itinerary: [...formData.itinerary, newItinerary]
      })
      setNewItinerary('')
    }
  }

  const handleRemoveItinerary = (index) => {
    const newItinerary = [...formData.itinerary]
    newItinerary.splice(index, 1)
    setFormData({ ...formData, itinerary: newItinerary })
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
        price: Number(formData.price)
      }

      if (editingPackage) {
        await updatePackage(editingPackage._id, dataToSubmit, token)
        showAlert('success', 'Package updated successfully!')
      } else {
        await createPackage(dataToSubmit, token)
        showAlert('success', 'Package created successfully!')
      }

      setShowForm(false)
    } catch (error) {
      showAlert('error', `Error saving package: ${error.message}`)
    } finally {
      setLoading(false)
    }
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
            <h1 className="text-2xl md:text-3xl font-bold text-black">Tour Packages</h1>
            <p className="text-gray-600 mt-1">Manage your tour packages and offerings</p>
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
              Add Package
            </button>
          </div>
        </div>

        {/* Grid View */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {packages.map((pkg) => (
              <div key={pkg._id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                {/* Image */}
                <div className="relative h-48">
                  <img 
                    src={pkg.images?.[0]?.url || '/placeholder.jpg'} 
                    alt={pkg.name} 
                    className="w-full h-full object-cover"
                  />
                  <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-sm font-medium ${
                    pkg.status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {pkg.status ? 'Active' : 'Inactive'}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-bold text-black truncate">{pkg.name}</h3>
                    <span className="text-pink-600 font-bold">₹{pkg.price}</span>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{pkg.description}</p>
                  
                  <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
                    <div>
                      <span className="text-gray-500">Duration:</span>
                      <span className="text-black ml-2">{pkg.duration}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Destination:</span>
                      <span className="text-black ml-2">{pkg.destination}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-100">
                    <button
                      onClick={() => handleViewDetails(pkg)}
                      className="flex-1 min-w-[80px] px-3 py-2 bg-gray-100 text-black rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center text-sm"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </button>
                    <button
                      onClick={() => handleEdit(pkg)}
                      className="flex-1 min-w-[80px] px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center text-sm"
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleToggleStatus(pkg._id)}
                      className={`flex-1 min-w-[80px] px-3 py-2 rounded-lg transition-colors flex items-center justify-center text-sm ${
                        pkg.status 
                          ? 'bg-yellow-600 text-white hover:bg-yellow-700' 
                          : 'bg-green-600 text-white hover:bg-green-700'
                      }`}
                    >
                      {pkg.status ? 'Deactivate' : 'Activate'}
                    </button>
                    <button
                      onClick={() => handleDelete(pkg._id)}
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
                      Package
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Destination
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Duration
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
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
                  {packages.map((pkg) => (
                    <tr key={pkg._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            <img
                              className="h-10 w-10 rounded-full object-cover"
                              src={pkg.images?.[0]?.url || '/placeholder.jpg'}
                              alt={pkg.name}
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-black">{pkg.name}</div>
                            <div className="text-sm text-gray-500 truncate max-w-xs">
                              {pkg.description.substring(0, 60)}...
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                        {pkg.destination}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                        {pkg.duration}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-pink-600">
                        ₹{pkg.price}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          pkg.status 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {pkg.status ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleViewDetails(pkg)}
                            className="text-blue-600 hover:text-blue-900"
                            title="View Details"
                          >
                            <Eye className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleEdit(pkg)}
                            className="text-green-600 hover:text-green-900"
                            title="Edit"
                          >
                            <Edit className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleToggleStatus(pkg._id)}
                            className={`${pkg.status ? 'text-yellow-600 hover:text-yellow-900' : 'text-green-600 hover:text-green-900'}`}
                            title={pkg.status ? 'Deactivate' : 'Activate'}
                          >
                            {pkg.status ? 'Deactivate' : 'Activate'}
                          </button>
                          <button
                            onClick={() => handleDelete(pkg._id)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete"
                          >
                            <Trash2 className="w-5 h-5" />
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
        {packages.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <ImageIcon className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No packages yet</h3>
            <p className="text-gray-600 mb-6">Get started by creating your first tour package.</p>
            <button
              onClick={handleAdd}
              className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors inline-flex items-center"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add First Package
            </button>
          </div>
        )}

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
                <h2 className="text-xl font-bold text-black">
                  {editingPackage ? 'Edit Package' : 'Add New Package'}
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
                        Package Name *
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                        Destination *
                      </label>
                      <input
                        type="text"
                        value={formData.destination}
                        onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Duration *
                        </label>
                        <input
                          type="text"
                          value={formData.duration}
                          onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                          placeholder="e.g., 5 days 4 nights"
                          required
                        />
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

                    {/* Images */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Images
                      </label>
                      <div className="flex gap-2 mb-4">
                        <input
                          type="file"
                          ref={fileInputRef}
                          multiple
                          accept="image/*"
                          onChange={handleFileSelect}
                          className="hidden"
                        />
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center"
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          Select Images
                        </button>
                      </div>



                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {images.map((img, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={img.url}
                              alt={`Package ${index + 1}`}
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
                    {/* Inclusions */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Inclusions
                      </label>
                      <div className="flex gap-2 mb-3">
                        <input
                          type="text"
                          value={newInclusion}
                          onChange={(e) => setNewInclusion(e.target.value)}
                          placeholder="Add inclusion"
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddInclusion())}
                        />
                        <button
                          type="button"
                          onClick={handleAddInclusion}
                          className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                        >
                          <Plus className="w-5 h-5" />
                        </button>
                      </div>
                      <div className="space-y-2 max-h-40 overflow-y-auto p-2">
                        {formData.inclusions.map((item, index) => (
                          <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                            <span className="text-sm">{item}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveInclusion(index)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Exclusions */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Exclusions
                      </label>
                      <div className="flex gap-2 mb-3">
                        <input
                          type="text"
                          value={newExclusion}
                          onChange={(e) => setNewExclusion(e.target.value)}
                          placeholder="Add exclusion"
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddExclusion())}
                        />
                        <button
                          type="button"
                          onClick={handleAddExclusion}
                          className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                        >
                          <Plus className="w-5 h-5" />
                        </button>
                      </div>
                      <div className="space-y-2 max-h-40 overflow-y-auto p-2">
                        {formData.exclusions.map((item, index) => (
                          <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                            <span className="text-sm">{item}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveExclusion(index)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Itinerary */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Itinerary (Day plan)
                      </label>
                      <div className="flex gap-2 mb-3">
                        <input
                          type="text"
                          value={newItinerary}
                          onChange={(e) => setNewItinerary(e.target.value)}
                          placeholder="Add itinerary item"
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddItinerary())}
                        />
                        <button
                          type="button"
                          onClick={handleAddItinerary}
                          className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                        >
                          <Plus className="w-5 h-5" />
                        </button>
                      </div>
                      <div className="space-y-2 max-h-40 overflow-y-auto p-2">
                        {formData.itinerary.map((item, index) => (
                          <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                            <span className="text-sm">{item}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveItinerary(index)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Status */}
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="status"
                        checked={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.checked })}
                        className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
                      />
                      <label htmlFor="status" className="ml-2 text-sm text-gray-700">
                        Active Package
                      </label>
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
                      editingPackage ? 'Update Package' : 'Create Package'
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
                <h2 className="text-xl font-bold text-black">Package Details</h2>
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
                        alt={`${showDetails.name} ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    ))}
                  </div>
                </div>

                {/* Package Info */}
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <h3 className="text-2xl font-bold text-black">{showDetails.name}</h3>
                    <span className="text-xl font-bold text-pink-600">₹{showDetails.price}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Destination</p>
                      <p className="text-black">{showDetails.destination}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Duration</p>
                      <p className="text-black">{showDetails.duration}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 mb-2">Description</p>
                    <p className="text-black">{showDetails.description}</p>
                  </div>

                  {/* Inclusions */}
                  {showDetails.inclusions?.length > 0 && (
                    <div>
                      <p className="text-sm text-gray-500 mb-2">Inclusions</p>
                      <ul className="list-disc pl-5 space-y-1">
                        {showDetails.inclusions.map((item, index) => (
                          <li key={index} className="text-black">{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Exclusions */}
                  {showDetails.exclusions?.length > 0 && (
                    <div>
                      <p className="text-sm text-gray-500 mb-2">Exclusions</p>
                      <ul className="list-disc pl-5 space-y-1">
                        {showDetails.exclusions.map((item, index) => (
                          <li key={index} className="text-black">{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Itinerary */}
                  {showDetails.itinerary?.length > 0 && (
                    <div>
                      <p className="text-sm text-gray-500 mb-2">Itinerary</p>
                      <ol className="space-y-2">
                        {showDetails.itinerary.map((item, index) => (
                          <li key={index} className="flex">
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-black text-white text-xs mr-3 flex-shrink-0">
                              {index + 1}
                            </span>
                            <span className="text-black">{item}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  )}

                  <div className="pt-4 border-t">
                    <div className="flex justify-between items-center">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        showDetails.status 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        Status: {showDetails.status ? 'Active' : 'Inactive'}
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setShowDetails(null)
                            handleEdit(showDetails)
                          }}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Edit Package
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