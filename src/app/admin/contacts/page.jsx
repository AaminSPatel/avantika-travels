'use client'

import { useEffect, useState } from 'react'
import { useSite } from '../../../context/site-context'
import { X, Edit, Trash2, Eye, Mail, Phone, User, MessageSquare, Calendar, CheckCircle, Clock, AlertCircle, Check } from 'lucide-react'

export default function AdminContacts() {
  const { contacts, fetchContacts, updateContact, deleteContact, toggleContactStatus } = useSite()
  const [viewMode, setViewMode] = useState('grid')
  const [showForm, setShowForm] = useState(false)
  const [showDetails, setShowDetails] = useState(null)
  const [editingContact, setEditingContact] = useState(null)
  const [alert, setAlert] = useState({ show: false, type: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [sortBy, setSortBy] = useState('newest')

  const statusOptions = [
    { value: 'pending', label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'in-progress', label: 'In Progress', color: 'bg-blue-100 text-blue-800' },
    { value: 'resolved', label: 'Resolved', color: 'bg-green-100 text-green-800' },
    { value: 'archived', label: 'Archived', color: 'bg-gray-100 text-gray-800' }
  ]

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    status: 'pending',
    notes: ''
  })

  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    fetchContacts(token)
  }, [fetchContacts])

  const showAlert = (type, message) => {
    setAlert({ show: true, type, message })
    setTimeout(() => {
      setAlert({ show: false, type: '', message: '' })
    }, 3000)
  }

  const handleEdit = (contact) => {
    setEditingContact(contact)
    setFormData({
      name: contact.name,
      email: contact.email,
      subject: contact.subject || '',
      message: contact.message,
      status: contact.status || 'pending',
      notes: contact.notes || ''
    })
    setShowForm(true)
  }

  const handleViewDetails = (contact) => {
    setShowDetails(contact)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this contact inquiry?')) {
      try {
        const token = localStorage.getItem('adminToken')
        await deleteContact(id, token)
        showAlert('success', 'Contact inquiry deleted successfully!')
      } catch (error) {
        showAlert('error', 'Error deleting contact inquiry')
      }
    }
  }

  const handleStatusChange = async (id, newStatus) => {
    try {
      const token = localStorage.getItem('adminToken')
      await updateContact(id, { status: newStatus }, token)
      showAlert('success', `Status updated to ${newStatus}`)
    } catch (error) {
      showAlert('error', 'Error updating status')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const token = localStorage.getItem('adminToken')
      await updateContact(editingContact._id, formData, token)
      showAlert('success', 'Contact inquiry updated successfully!')
      setShowForm(false)
    } catch (error) {
      showAlert('error', `Error updating contact: ${error.message}`)
    } finally {
      setLoading(false)
    }
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

  // Filter and sort contacts
  const filteredContacts = contacts
    .filter(contact => {
      const matchesSearch = 
        contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.message.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesStatus = filterStatus === 'all' || contact.status === filterStatus
      
      return matchesSearch && matchesStatus
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt)
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt)
        case 'name':
          return a.name.localeCompare(b.name)
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
            <h1 className="text-2xl md:text-3xl font-bold text-black">Contact Inquiries</h1>
            <p className="text-gray-600 mt-1">Manage customer inquiries and support requests</p>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name, email, or message..."
                  className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                />
                <Mail className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
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

            {/* Sort By */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="name">Name A-Z</option>
              </select>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Inquiries</p>
                <p className="text-2xl font-bold text-black">{contacts.length}</p>
              </div>
              <MessageSquare className="w-8 h-8 text-gray-400" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {contacts.filter(c => c.status === 'pending').length}
                </p>
              </div>
              <Clock className="w-8 h-8 text-yellow-400" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-blue-600">
                  {contacts.filter(c => c.status === 'in-progress').length}
                </p>
              </div>
              <AlertCircle className="w-8 h-8 text-blue-400" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Resolved</p>
                <p className="text-2xl font-bold text-green-600">
                  {contacts.filter(c => c.status === 'resolved').length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
          </div>
        </div>

        {/* Grid View */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredContacts.map((contact) => (
              <div key={contact._id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="p-5">
                  {/* Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-black">{contact.name}</h3>
                      <p className="text-sm text-gray-600">{formatDate(contact.createdAt)}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      statusOptions.find(s => s.value === contact.status)?.color || 'bg-gray-100 text-gray-800'
                    }`}>
                      {statusOptions.find(s => s.value === contact.status)?.label || contact.status}
                    </span>
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 text-gray-400 mr-3" />
                      <a 
                        href={`mailto:${contact.email}`}
                        className="text-sm text-pink-600 hover:text-pink-700 truncate"
                      >
                        {contact.email}
                      </a>
                    </div>
                    {contact.phone && (
                      <div className="flex items-center">
                        <Phone className="w-4 h-4 text-gray-400 mr-3" />
                        <a 
                          href={`tel:${contact.phone}`}
                          className="text-sm text-black truncate"
                        >
                          {contact.phone}
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Subject */}
                  {contact.subject && (
                    <div className="mb-3">
                      <p className="text-sm font-medium text-gray-700">Subject</p>
                      <p className="text-black">{contact.subject}</p>
                    </div>
                  )}

                  {/* Message Preview */}
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 line-clamp-3">{contact.message}</p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-100">
                    <button
                      onClick={() => handleViewDetails(contact)}
                      className="flex-1 min-w-[80px] px-3 py-2 bg-gray-100 text-black rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center text-sm"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </button>
                    <button
                      onClick={() => handleEdit(contact)}
                      className="flex-1 min-w-[80px] px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center text-sm"
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(contact._id)}
                      className="flex-1 min-w-[80px] px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center text-sm"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Delete
                    </button>
                  </div>

                  {/* Quick Status Actions */}
                  <div className="flex flex-wrap gap-2 mt-4">
                    {statusOptions
                      .filter(status => status.value !== contact.status)
                      .map((status) => (
                        <button
                          key={status.value}
                          onClick={() => handleStatusChange(contact._id, status.value)}
                          className={`px-3 py-1 text-xs rounded-lg transition-colors ${
                            status.value === 'resolved' 
                              ? 'bg-green-100 text-green-800 hover:bg-green-200'
                              : status.value === 'pending'
                              ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
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
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Subject
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
                  {filteredContacts.map((contact) => (
                    <tr key={contact._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-black">{contact.name}</div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">
                            <a href={`mailto:${contact.email}`} className="text-pink-600 hover:text-pink-700">
                              {contact.email}
                            </a>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-black max-w-xs truncate">{contact.subject || 'No Subject'}</div>
                        <div className="text-sm text-gray-500 max-w-xs truncate">
                          {contact.message.substring(0, 60)}...
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                          {formatDate(contact.createdAt)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          statusOptions.find(s => s.value === contact.status)?.color || 'bg-gray-100 text-gray-800'
                        }`}>
                          {statusOptions.find(s => s.value === contact.status)?.label || contact.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleViewDetails(contact)}
                            className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-xs"
                          >
                            View
                          </button>
                          <button
                            onClick={() => handleEdit(contact)}
                            className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-xs"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(contact._id)}
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
        {filteredContacts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <MessageSquare className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm || filterStatus !== 'all' ? 'No matching contacts found' : 'No contact inquiries yet'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || filterStatus !== 'all' 
                ? 'Try adjusting your search or filter criteria'
                : 'Contact inquiries from users will appear here'}
            </p>
            {(searchTerm || filterStatus !== 'all') && (
              <button
                onClick={() => {
                  setSearchTerm('')
                  setFilterStatus('all')
                }}
                className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors inline-flex items-center"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}

        {/* Form Modal */}
        {showForm && editingContact && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
                <h2 className="text-xl font-bold text-black">Edit Contact Inquiry</h2>
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
                        Name *
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
                      Subject *
                    </label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Message *
                    </label>
                    <textarea
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
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
                      Internal Notes
                    </label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder="Add internal notes or follow-up information..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent h-24"
                      rows="4"
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      These notes are for internal use only and won't be shared with the contact.
                    </p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-700 mb-3">Contact Information</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Received:</span>
                        <span className="text-black font-medium">{formatDate(editingContact.createdAt)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Last Updated:</span>
                        <span className="text-black font-medium">
                          {editingContact.updatedAt ? formatDate(editingContact.updatedAt) : 'Never'}
                        </span>
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
                <h2 className="text-xl font-bold text-black">Contact Inquiry Details</h2>
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
                      <h3 className="text-2xl font-bold text-black">{showDetails.name}</h3>
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

                  {/* Contact Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-3">Contact Information</h4>
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
                        {showDetails.phone && (
                          <div className="flex items-center">
                            <Phone className="w-5 h-5 text-gray-400 mr-3" />
                            <div>
                              <div className="text-sm text-gray-500">Phone</div>
                              <a 
                                href={`tel:${showDetails.phone}`}
                                className="text-black font-medium"
                              >
                                {showDetails.phone}
                              </a>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-3">Inquiry Details</h4>
                      <div className="space-y-3">
                        <div>
                          <div className="text-sm text-gray-500">Subject</div>
                          <div className="text-black font-medium">{showDetails.subject || 'No Subject'}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Message Length</div>
                          <div className="text-black font-medium">{showDetails.message.length} characters</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Subject */}
                  {showDetails.subject && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Subject</h4>
                      <div className="text-black p-3 bg-gray-50 rounded-lg">
                        {showDetails.subject}
                      </div>
                    </div>
                  )}

                  {/* Message */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Message</h4>
                    <div className="text-gray-700 p-4 bg-gray-50 rounded-lg whitespace-pre-wrap">
                      {showDetails.message}
                    </div>
                  </div>

                  {/* Internal Notes */}
                  {showDetails.notes && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Internal Notes</h4>
                      <div className="text-gray-700 p-3 bg-yellow-50 rounded-lg border border-yellow-100">
                        {showDetails.notes}
                      </div>
                    </div>
                  )}

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
                          Edit Inquiry
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