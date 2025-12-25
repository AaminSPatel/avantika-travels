'use client'

import { useEffect, useState } from 'react'
import { useSite } from '../../../context/site-context'
import { X, Edit, Trash2, Eye, Plus, Calendar, User, Tag, Eye as EyeIcon, Upload, Image as ImageIcon, Check, AlertCircle, FileText } from 'lucide-react'

export default function AdminBlogs() {
  const { blogs:allBlogs, fetchBlogs, createBlog, updateBlog, deleteBlog, toggleBlogPublished } = useSite()
  const [viewMode, setViewMode] = useState('grid')
  const [showForm, setShowForm] = useState(false)
  const [showDetails, setShowDetails] = useState(null)
  const [editingBlog, setEditingBlog] = useState(null)
  const [alert, setAlert] = useState({ show: false, type: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState('')
  const [newTag, setNewTag] = useState('')
  const [blogs , setBlogs] = useState([])
  const categories = ['Travel Tips', 'Destination Guides', 'Adventure', 'Culture', 'Food', 'Luxury', 'Budget Travel', 'Family Travel', 'Solo Travel']

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    author: '',
    category: 'Travel Tips',
    tags: [],
    image: {
      public_id: '',
      url: ''
    },
    views: 0
  })

  useEffect(() => {
    setBlogs(allBlogs)
  }, [allBlogs])

  const showAlert = (type, message) => {
    setAlert({ show: true, type, message })
    setTimeout(() => {
      setAlert({ show: false, type: '', message: '' })
    }, 3000)
  }

  const handleAdd = () => {
    setEditingBlog(null)
    setImageFile(null)
    setImagePreview('')
    setFormData({
      title: '',
      content: '',
      author: '',
      category: 'Travel Tips',
      tags: [],
      image: {
        public_id: '',
        url: ''
      },
      views: 0
    })
    setShowForm(true)
  }

  const handleEdit = (blog) => {
    setEditingBlog(blog)
    setImagePreview(blog.image?.url || '')
    setFormData({
      title: blog.title,
      content: blog.content,
      author: blog.author || '',
      category: blog.category || 'Travel Tips',
      tags: blog.tags || [],
      image: blog.image || { public_id: '', url: '' },
      views: blog.views || 0
    })
    setShowForm(true)
  }

  const handleViewDetails = (blog) => {
    setShowDetails(blog)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this blog post?')) {
      try {
        const token = localStorage.getItem('adminToken')
        await deleteBlog(id, token)
        showAlert('success', 'Blog post deleted successfully!')
      } catch (error) {
        showAlert('error', 'Error deleting blog post')
      }
    }
  }

  const handleTogglePublished = async (id) => {
    try {
      const token = localStorage.getItem('adminToken')
      await toggleBlogPublished(id, token)
      showAlert('success', 'Status updated successfully!')
    } catch (error) {
      showAlert('error', 'Error updating status')
    }
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImageFile(file)
      
      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveImage = () => {
    setImageFile(null)
    setImagePreview('')
    setFormData({
      ...formData,
      image: { public_id: '', url: '' }
    })
  }

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, newTag.trim()]
      })
      setNewTag('')
    }
  }

  const handleRemoveTag = (tagToRemove) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const token = localStorage.getItem('adminToken')

      const dataToSubmit = {
        ...formData,
        image: imageFile || formData.image, // Send the file or existing image data
        date: editingBlog ? undefined : new Date() // Only set date for new blogs
      }

      if (editingBlog) {
        await updateBlog(editingBlog._id, dataToSubmit, token)
        showAlert('success', 'Blog post updated successfully!')
      } else {
        await createBlog(dataToSubmit, token)
        showAlert('success', 'Blog post created successfully!')
      }

      setShowForm(false)
    } catch (error) {
      showAlert('error', `Error saving blog post: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
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
            <h1 className="text-2xl md:text-3xl font-bold text-black">Blog Posts</h1>
            <p className="text-gray-600 mt-1">Manage your travel blog posts and articles</p>
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
              Add Blog Post
            </button>
          </div>
        </div>

        {/* Grid View */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map((blog) => (
              <div key={blog._id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                {/* Image */}
                <div className="relative h-48">
                  <img 
                    src={blog.image?.url || '/placeholder.jpg'} 
                    alt={blog.title} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 bg-black/80 text-white text-xs font-medium rounded-full">
                      {blog.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-bold text-black line-clamp-2">{blog.title}</h3>
                    <div className="flex items-center text-sm text-gray-500">
                      <EyeIcon className="w-4 h-4 mr-1" />
                      {blog.views}
                    </div>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{blog.content.substring(0, 150)}...</p>
                  
                  <div className="flex items-center text-sm text-gray-500 mb-3">
                    <User className="w-4 h-4 mr-2" />
                    <span className="mr-4">{blog.author}</span>
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>{formatDate(blog.date)}</span>
                  </div>

                  {/* Tags */}
                  {blog.tags && blog.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {blog.tags.slice(0, 3).map((tag, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                          {tag}
                        </span>
                      ))}
                      {blog.tags.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                          +{blog.tags.length - 3} more
                        </span>
                      )}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-100">
                    <button
                      onClick={() => handleViewDetails(blog)}
                      className="flex-1 min-w-[80px] px-3 py-2 bg-gray-100 text-black rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center text-sm"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </button>
                    <button
                      onClick={() => handleEdit(blog)}
                      className="flex-1 min-w-[80px] px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center text-sm"
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(blog._id)}
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
                      Blog Post
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Author
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Views
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {blogs.map((blog) => (
                    <tr key={blog._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="h-12 w-12 flex-shrink-0">
                            <img
                              className="h-12 w-12 rounded-lg object-cover"
                              src={blog.image?.url || '/placeholder.jpg'}
                              alt={blog.title}
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-black">{blog.title}</div>
                            <div className="text-sm text-gray-500 line-clamp-1 max-w-xs">
                              {blog.content.substring(0, 60)}...
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-black">
                          <User className="w-4 h-4 mr-2 text-gray-400" />
                          {blog.author}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                          {blog.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                          {formatDate(blog.date)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-700">
                          <EyeIcon className="w-4 h-4 mr-2" />
                          {blog.views}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleViewDetails(blog)}
                            className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-xs"
                          >
                            View
                          </button>
                          <button
                            onClick={() => handleEdit(blog)}
                            className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-xs"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(blog._id)}
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
        {blogs.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <FileText className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No blog posts yet</h3>
            <p className="text-gray-600 mb-6">Start by creating your first blog post.</p>
            <button
              onClick={handleAdd}
              className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors inline-flex items-center"
            >
              <Plus className="w-5 h-5 mr-2" />
              Write First Post
            </button>
          </div>
        )}

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
                <h2 className="text-xl font-bold text-black">
                  {editingBlog ? 'Edit Blog Post' : 'Create New Blog Post'}
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
                        Title *
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
                        Author *
                      </label>
                      <input
                        type="text"
                        value={formData.author}
                        onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                        required
                      />
                    </div>

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

                    {/* Image Upload */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Featured Image *
                      </label>
                      
                      {imagePreview ? (
                        <div className="relative mb-4">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-full h-48 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={handleRemoveImage}
                            className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : formData.image?.url ? (
                        <div className="relative mb-4">
                          <img
                            src={formData.image.url}
                            alt="Current"
                            className="w-full h-48 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={handleRemoveImage}
                            className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-4">
                          <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-sm text-gray-600 mb-4">
                            Upload a featured image for your blog post
                          </p>
                        </div>
                      )}
                      
                      <div className="flex items-center justify-center">
                        <label className="cursor-pointer">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                          />
                          <div className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center">
                            <Upload className="w-4 h-4 mr-2" />
                            {imagePreview || formData.image?.url ? 'Change Image' : 'Upload Image'}
                          </div>
                        </label>
                      </div>
                      <p className="text-xs text-gray-500 mt-2 text-center">
                        Recommended: 1200x630 pixels, max 5MB
                      </p>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Content *
                      </label>
                      <textarea
                        value={formData.content}
                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent h-64"
                        rows="10"
                        placeholder="Write your blog post content here..."
                        required
                      />
                    </div>

                    {/* Tags */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tags
                      </label>
                      <div className="flex gap-2 mb-3">
                        <input
                          type="text"
                          value={newTag}
                          onChange={(e) => setNewTag(e.target.value)}
                          placeholder="Add a tag"
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                        />
                        <button
                          type="button"
                          onClick={handleAddTag}
                          className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                        >
                          <Plus className="w-5 h-5" />
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {formData.tags.map((tag, index) => (
                          <div key={index} className="inline-flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full">
                            <Tag className="w-3 h-3 text-gray-500" />
                            <span className="text-sm">{tag}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveTag(tag)}
                              className="ml-1 text-gray-500 hover:text-gray-700"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Views */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Initial Views Count
                      </label>
                      <input
                        type="number"
                        value={formData.views}
                        onChange={(e) => setFormData({ ...formData, views: parseInt(e.target.value) || 0 })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                        min="0"
                      />
                    </div>

                    {/* Preview Section */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="text-sm font-medium text-gray-700 mb-3">Quick Preview</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Title:</span>
                          <span className="text-black font-medium truncate max-w-[200px]">{formData.title || 'Not set'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Author:</span>
                          <span className="text-black font-medium">{formData.author || 'Not set'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Category:</span>
                          <span className="text-black font-medium">{formData.category}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Tags:</span>
                          <span className="text-black font-medium">{formData.tags.length} added</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Image:</span>
                          <span className="text-black font-medium">
                            {(imagePreview || formData.image?.url) ? '✓ Uploaded' : 'No image'}
                          </span>
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
                    disabled={loading || uploading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={loading || uploading}
                  >
                    {loading || uploading ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        {uploading ? 'Uploading Image...' : 'Saving...'}
                      </span>
                    ) : (
                      editingBlog ? 'Update Blog Post' : 'Publish Blog Post'
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
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
                <h2 className="text-xl font-bold text-black">Blog Post Details</h2>
                <button
                  onClick={() => setShowDetails(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6">
                {/* Featured Image */}
                <div className="mb-6">
                  <img
                    src={showDetails.image?.url || '/placeholder.jpg'}
                    alt={showDetails.title}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                </div>

                {/* Blog Info */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-2xl font-bold text-black mb-2">{showDetails.title}</h3>
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-2" />
                        <span className="font-medium text-black">{showDetails.author}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span>{formatDate(showDetails.date)}</span>
                      </div>
                      <div className="flex items-center">
                        <EyeIcon className="w-4 h-4 mr-2" />
                        <span>{showDetails.views} views</span>
                      </div>
                      <span className="px-3 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded-full">
                        {showDetails.category}
                      </span>
                    </div>
                  </div>

                  {/* Tags */}
                  {showDetails.tags && showDetails.tags.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Tags</h4>
                      <div className="flex flex-wrap gap-2">
                        {showDetails.tags.map((tag, index) => (
                          <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full flex items-center">
                            <Tag className="w-3 h-3 mr-1" />
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Content */}
                  <div>
                    <h4 className="text-lg font-semibold text-black mb-3">Content</h4>
                    <div className="prose max-w-none text-gray-700">
                      {showDetails.content.split('\n').map((paragraph, index) => (
                        <p key={index} className="mb-4">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </div>

                  <div className="pt-6 border-t">
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-gray-500">
                        Created: {formatDate(showDetails.createdAt || showDetails.date)}
                      </div>
                      <div className="flex gap-3">
                        <button
                          onClick={() => {
                            setShowDetails(null)
                            handleEdit(showDetails)
                          }}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Edit Post
                        </button>
                        <button
                          onClick={() => handleDelete(showDetails._id)}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                          Delete Post
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