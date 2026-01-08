'use client'

import { useEffect, useState } from 'react'
import { useSite } from '../../../context/site-context'
import {
  Save, RefreshCw, Globe, Mail, Phone, MapPin,
  Facebook, Instagram, Twitter, Palette, Image,
  AlertCircle, CheckCircle, Eye, Upload, Youtube, X
} from 'lucide-react'

export default function AdminWebsite() {
  const { siteData, refreshData, updateWebsiteData } = useSite()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [uploading, setUploading] = useState({ logo: false, heroImage: false })
  const [formData, setFormData] = useState({
    name: '',
    tagline: '',
    description: '',
    secondaryImage: '/pik2.avif',
    contactInfo: {
      email: '',
      phone: '',
      alternatePhone: '',
      location: '',
      address: '',
      region: ''
    },
    mainAttraction: '',
    socialLinks: {
      facebook: '',
      instagram: '',
      twitter: '',
      youtube: ''
    },
    workingHours: '',
    theme: {
      primaryColor: '#000000',
      secondaryColor: '#ffffff'
    }
  })

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

  useEffect(() => {
    loadWebsiteData()
  }, [])

  const loadWebsiteData = async () => {
    try {
      setLoading(true)
      await refreshData()
      // Update form data with the latest site data
      setFormData({
        name: siteData.name || '',
        tagline: siteData.tagline || '',
        description: siteData.description || '',
        secondaryImage: siteData.secondaryImage || '/pik2.avif',
        contactInfo: {
          email: siteData.contactInfo?.email || '',
          phone: siteData.contactInfo?.phone || '',
          alternatePhone: siteData.contactInfo?.alternatePhone || '',
          location: siteData.contactInfo?.location || '',
          address: siteData.contactInfo?.address || '',
          region: siteData.contactInfo?.region || ''
        },
        mainAttraction: siteData.mainAttraction || '',
        socialLinks: {
          facebook: siteData.socialLinks?.facebook || '',
          instagram: siteData.socialLinks?.instagram || '',
          twitter: siteData.socialLinks?.twitter || '',
          youtube: siteData.socialLinks?.youtube || ''
        },
        workingHours: siteData.workingHours || '',
        theme: {
          primaryColor: siteData.theme?.primaryColor || '#000000',
          secondaryColor: siteData.theme?.secondaryColor || '#ffffff'
        }
      })
    } catch (error) {
      console.error('Error loading website data:', error)
      setError('Failed to load website data')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleNestedInputChange = (parent, field, value) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value
      }
    }))
  }

  const handleImageUpload = async (field, file) => {
    if (!file) return

    setUploading(prev => ({ ...prev, [field]: true }))
    setError('')

    try {
      const formDataUpload = new FormData()
      formDataUpload.append('file', file)
      formDataUpload.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'avantika-travels')

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'your-cloud-name'}/image/upload`,
        {
          method: 'POST',
          body: formDataUpload
        }
      )

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      const data = await response.json()

      handleNestedInputChange(field, 'url', data.secure_url)
      handleNestedInputChange(field, 'publicId', data.public_id)

      setSuccess(`${field === 'logo' ? 'Logo' : 'Hero image'} uploaded successfully!`)
    } catch (error) {
      console.error('Upload error:', error)
      setError(`Failed to upload ${field === 'logo' ? 'logo' : 'hero image'}`)
    } finally {
      setUploading(prev => ({ ...prev, [field]: false }))
    }
  }

  const handleImageUrlChange = (field, url) => {
    handleNestedInputChange(field, 'url', url)
    // Clear publicId when URL is manually entered
    handleNestedInputChange(field, 'publicId', '')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSuccess('')

    try {
      const token = localStorage.getItem('adminToken')
      await updateWebsiteData(formData, token)
      setSuccess('Website settings saved successfully!')
    } catch (error) {
      console.error('Error saving website data:', error)
      setError(error.response?.data?.message || 'Failed to save website settings')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 animate-spin text-pink-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading website settings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-black">Website Settings</h1>
            <p className="text-gray-600 mt-1">Manage your website configuration and branding</p>
          </div>
          <div className="flex gap-3 mt-4 md:mt-0">
            <button
              onClick={loadWebsiteData}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors flex items-center"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </button>
            <button
              onClick={handleSubmit}
              disabled={saving}
              className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center disabled:opacity-50"
            >
              {saving ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>

        {/* Status Messages */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
            <AlertCircle className="w-5 h-5 text-red-500 mr-3" />
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center">
            <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
            <p className="text-green-700">{success}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center mb-6">
              <Globe className="w-5 h-5 text-blue-500 mr-3" />
              <h2 className="text-xl font-bold text-black">Basic Information</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Website Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="Enter website name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tagline
                </label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={(e) => handleInputChange('tagline', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="Enter website tagline"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hero Image
                </label>
                <select
                  value={formData.secondaryImage}
                  onChange={(e) => handleInputChange('secondaryImage', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                >
                  <option value="/pik1.avif">Image 1</option>
                  <option value="/pik2.avif">Image 2</option>
                  <option value="/pik3.avif">Image 3</option>
                  <option value="/pik4.avif">Image 4</option>
                  <option value="/pik5.avif">Image 5</option>
                  <option value="/pik6.avif">Image 6</option>
                  <option value="/pik7.avif">Image 7</option>
                  <option value="/pik8.avif">Image 8</option>
                  <option value="/pik9.avif">Image 9</option>
                </select>
                {formData.secondaryImage && (
                  <div className="mt-3">
                    <img
                      src={formData.secondaryImage}
                      alt="Hero image preview"
                      className="w-full h-32 object-cover border border-gray-200 rounded-lg"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Main Attraction
                </label>
                <input
                  type="text"
                  value={formData.mainAttraction}
                  onChange={(e) => handleInputChange('mainAttraction', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="Enter main attraction"
                />
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Working Hours
              </label>
              <input
                type="text"
                value={formData.workingHours}
                onChange={(e) => handleInputChange('workingHours', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                placeholder="e.g., Mon - Sat: 9:00 AM - 7:00 PM"
              />
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                placeholder="Enter website description"
                required
              />
            </div>
{/* 
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hero Image
              </label>
              <div className="space-y-3">
                
                <div className="flex items-center space-x-3">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload('heroImage', e.target.files[0])}
                    className="hidden"
                    id="hero-upload"
                    disabled={uploading.heroImage}
                  />
                  <label
                    htmlFor="hero-upload"
                    className="flex items-center px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 cursor-pointer transition-colors disabled:opacity-50"
                  >
                    {uploading.heroImage ? (
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Upload className="w-4 h-4 mr-2" />
                    )}
                    {uploading.heroImage ? 'Uploading...' : 'Upload Hero Image'}
                  </label>
                  {formData.heroImage.url && (
                    <button
                      type="button"
                      onClick={() => {
                        handleNestedInputChange('heroImage', 'url', '')
                        handleNestedInputChange('heroImage', 'publicId', '')
                      }}
                      className="p-1 text-red-500 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <input
                  type="url"
                  value={formData.heroImage.url}
                  onChange={(e) => handleImageUrlChange('heroImage', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="https://example.com/hero-image.jpg or upload above"
                />

                {formData.heroImage.url && (
                  <div className="mt-2">
                    <img
                      src={formData.heroImage.url}
                      alt="Hero image preview"
                      className="w-full h-32 object-cover border border-gray-200 rounded"
                    />
                  </div>
                )}
              </div>
            </div> */}
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center mb-6">
              <Mail className="w-5 h-5 text-green-500 mr-3" />
              <h2 className="text-xl font-bold text-black">Contact Information</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    value={formData.contactInfo.email}
                    onChange={(e) => handleNestedInputChange('contactInfo', 'email', e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="info@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <input
                    type="tel"
                    value={formData.contactInfo.phone}
                    onChange={(e) => handleNestedInputChange('contactInfo', 'phone', e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="+91 1234567890"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Alternate Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <input
                    type="tel"
                    value={formData.contactInfo.alternatePhone}
                    onChange={(e) => handleNestedInputChange('contactInfo', 'alternatePhone', e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="+91 9876543210"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={formData.contactInfo.location}
                    onChange={(e) => handleNestedInputChange('contactInfo', 'location', e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="City, State"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Region
                </label>
                <input
                  type="text"
                  value={formData.contactInfo.region}
                  onChange={(e) => handleNestedInputChange('contactInfo', 'region', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="Region/State"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <textarea
                    value={formData.contactInfo.address}
                    onChange={(e) => handleNestedInputChange('contactInfo', 'address', e.target.value)}
                    rows={3}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="Enter full address"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center mb-6">
              <Facebook className="w-5 h-5 text-blue-600 mr-3" />
              <h2 className="text-xl font-bold text-black">Social Media Links</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Facebook
                </label>
                <div className="relative">
                  <Facebook className="absolute left-3 top-3 w-4 h-4 text-blue-600" />
                  <input
                    type="url"
                    value={formData.socialLinks.facebook}
                    onChange={(e) => handleNestedInputChange('socialLinks', 'facebook', e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="https://facebook.com/yourpage"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Instagram
                </label>
                <div className="relative">
                  <Instagram className="absolute left-3 top-3 w-4 h-4 text-pink-600" />
                  <input
                    type="url"
                    value={formData.socialLinks.instagram}
                    onChange={(e) => handleNestedInputChange('socialLinks', 'instagram', e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="https://instagram.com/youraccount"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Twitter
                </label>
                <div className="relative">
                  <Twitter className="absolute left-3 top-3 w-4 h-4 text-blue-400" />
                  <input
                    type="url"
                    value={formData.socialLinks.twitter}
                    onChange={(e) => handleNestedInputChange('socialLinks', 'twitter', e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="https://twitter.com/youraccount"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  YouTube
                </label>
                <div className="relative">
                  <Youtube className="absolute left-3 top-3 w-4 h-4 text-red-600" />
                  <input
                    type="url"
                    value={formData.socialLinks.youtube}
                    onChange={(e) => handleNestedInputChange('socialLinks', 'youtube', e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="https://youtube.com/yourchannel"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Theme Settings */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center mb-6">
              <Palette className="w-5 h-5 text-purple-500 mr-3" />
              <h2 className="text-xl font-bold text-black">Theme Settings</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Primary Color
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={formData.theme.primaryColor}
                    onChange={(e) => handleNestedInputChange('theme', 'primaryColor', e.target.value)}
                    className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.theme.primaryColor}
                    onChange={(e) => handleNestedInputChange('theme', 'primaryColor', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="#000000"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Secondary Color
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={formData.theme.secondaryColor}
                    onChange={(e) => handleNestedInputChange('theme', 'secondaryColor', e.target.value)}
                    className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.theme.secondaryColor}
                    onChange={(e) => handleNestedInputChange('theme', 'secondaryColor', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="#ffffff"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Preview Section */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center mb-6">
              <Eye className="w-5 h-5 text-gray-500 mr-3" />
              <h2 className="text-xl font-bold text-black">Preview</h2>
            </div>

            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <div className="text-center">
               {/*  {formData.logo.url && (
                  <img
                    src={formData.logo.url}
                    alt="Logo"
                    className="w-16 h-16 object-contain mx-auto mb-4"
                  />
                )} */}
                <h3 className="text-lg font-bold" style={{ color: formData.theme.primaryColor }}>
                  {formData.name || 'Website Name'}
                </h3>
                <p className="text-gray-600 mt-2">{formData.description || 'Website description will appear here'}</p>
                <div className="mt-4 flex justify-center space-x-4">
                  {formData.contactInfo.email && (
                    <span className="text-sm text-gray-500">{formData.contactInfo.email}</span>
                  )}
                  {formData.contactInfo.phone && (
                    <span className="text-sm text-gray-500">{formData.contactInfo.phone}</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-8 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center disabled:opacity-50"
            >
              {saving ? (
                <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
              ) : (
                <Save className="w-5 h-5 mr-2" />
              )}
              {saving ? 'Saving Changes...' : 'Save All Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
