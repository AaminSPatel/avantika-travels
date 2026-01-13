"use client"

import { createContext, useContext, useState, useEffect } from "react"
import axios from "axios"

const SiteContext = createContext()

// API base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

// Default site configuration data (fallback)
const defaultSiteData = {
  name: "Avantika Travels",
  tagline: "Discover the Divine Beauty of Madhya Pradesh",
  description:
    "Experience the spiritual essence and cultural heritage of Madhya Pradesh with Avantika Travels. We specialize in pilgrimages to Mahakal Mandir and tours across Ujjain, Indore, and Dewas.",
  keywords: [
    "avantika",
    "travels",
    "avantika travels",
    "ujjain travels",
    "Mahakal Mandir",
    "Ujjain travel",
    "Madhya Pradesh pilgrimage",
    "Indore tours",
    "Dewas travel",
    "spiritual tours India",
    "Mahakal Temple Ujjain",
    "religious tourism Madhya Pradesh",
    "pilgrimage packages India",
    "temple tours central India",
    "sacred sites Madhya Pradesh"
  ],
  logo: "/logo.png",
  secondaryImage: "/pik2.avif",
  heroImage: "/pik5.avif",
contactInfo: { email: "info@avanikatravels.com",
  phone: "+91 8720006707",
  alternatePhone: "+91 8720006707",
  location: "Ujjain, Madhya Pradesh, India",
  address: "123, Mahakal Road, Near Mahakal Mandir, Ujjain, MP - 456001",
  region: "Madhya Pradesh"},
  mainAttraction: "Mahakal Mandir",
  socialLinks: {
    facebook: "https://facebook.com/avanikatravels",
    instagram: "https://instagram.com/avanikatravels",
    twitter: "https://twitter.com/avanikatravels",
    youtube: "https://youtube.com/avanikatravels",
  },
  workingHours: "Mon - Sat: 9:00 AM - 7:00 PM",
  theme: {
    primaryColor: "#f9307a",
    secondaryColor: "#ffffff"
  }
}

export function SiteProvider({ children }) {
  const [places, setPlaces] = useState([])
  const [packages, setPackages] = useState([])
  const [blogs, setBlogs] = useState([])
  const [contacts, setContacts] = useState([])
  const [reviews, setReviews] = useState([])
  const [siteData, setSiteData] = useState(defaultSiteData)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch all data on component mount
  useEffect(() => {
    fetchAllData()
  }, [])

  const fetchAllData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Fetch other data in parallel
      const [placesRes, packagesRes, blogsRes, contactsRes, reviewsRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/places`),
        axios.get(`${API_BASE_URL}/packages`),
        axios.get(`${API_BASE_URL}/blogs/published`),
        axios.get(`${API_BASE_URL}/contacts`),
        axios.get(`${API_BASE_URL}/reviews`)
      ])

      setPlaces(placesRes.data)
      setPackages(packagesRes.data)
      setBlogs(blogsRes.data)
      setContacts(contactsRes.data)
      setReviews(reviewsRes.data)

      // Fetch website data separately - only update if successful
      try {
        const websiteRes = await axios.get(`${API_BASE_URL}/website`)
        
        setSiteData(websiteRes.data)
       // console.log('website data',websiteRes.data);
        
      } catch (websiteErr) {
        console.warn('Website data not loaded, keeping default data:', websiteErr)
        // Keep existing siteData (default data)
      }
    } catch (err) {
      console.error('Error fetching data:', err)
      setError('Failed to load data from server')
      // Keep default site data on error
    } finally {
      setLoading(false)
    }
  }

  // Places CRUD operations
  const fetchPlaces = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/places`)
      setPlaces(response.data)
      return response.data
    } catch (err) {
      console.error('Error fetching places:', err)
      throw err
    }
  }

  const createPlace = async (placeData, token) => {
    try {
      let response
      if (placeData.selectedFiles && placeData.selectedFiles.length > 0) {
        // Send as FormData for image uploads
        const formData = new FormData()
        Object.keys(placeData).forEach(key => {
          if (key === 'selectedFiles') {
            placeData.selectedFiles.forEach(file => formData.append('images', file))
          } else if (key !== 'images') {
            formData.append(key, placeData[key])
          }
        })
        response = await axios.post(`${API_BASE_URL}/places`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        })
      } else {
        // Send as JSON for no images
        const { selectedFiles, ...dataToSend } = placeData
        response = await axios.post(`${API_BASE_URL}/places`, dataToSend, {
          headers: { Authorization: `Bearer ${token}` }
        })
      }
      setPlaces(prev => [...prev, response.data])
      return response.data
    } catch (err) {
      console.error('Error creating place:', err)
      throw err
    }
  }

  const updatePlace = async (id, placeData, token) => {
    try {
      let response
      if (placeData.selectedFiles && placeData.selectedFiles.length > 0) {
        // Send as FormData for image uploads
        const formData = new FormData()
        Object.keys(placeData).forEach(key => {
          if (key === 'selectedFiles') {
            placeData.selectedFiles.forEach(file => formData.append('images', file))
          } else if (key !== 'images') {
            formData.append(key, placeData[key])
          }
        })
        response = await axios.put(`${API_BASE_URL}/places/${id}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        })
      } else {
        // Send as JSON for no images
        const { selectedFiles, ...dataToSend } = placeData
        response = await axios.put(`${API_BASE_URL}/places/${id}`, dataToSend, {
          headers: { Authorization: `Bearer ${token}` }
        })
      }
      setPlaces(prev => prev.map(place => place._id === id ? response.data : place))
      return response.data
    } catch (err) {
      console.error('Error updating place:', err)
      throw err
    }
  }

  const deletePlace = async (id, token) => {
    try {
      await axios.delete(`${API_BASE_URL}/places/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setPlaces(prev => prev.filter(place => place._id !== id))
    } catch (err) {
      console.error('Error deleting place:', err)
      throw err
    }
  }

  const uploadPlaceImages = async (files, token) => {
    try {
      const formData = new FormData()
      files.forEach(file => formData.append('images', file))

      const response = await axios.post(`${API_BASE_URL}/places/upload-images`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      })
      return response.data
    } catch (err) {
      console.error('Error uploading place images:', err)
      throw err
    }
  }



  // Packages CRUD operations
  const fetchPackages = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/packages`)
      setPackages(response.data)
      return response.data
    } catch (err) {
      console.error('Error fetching packages:', err)
      throw err
    }
  }

  const createPackage = async (packageData, token) => {
    try {
      let response
      if (packageData.selectedFiles && packageData.selectedFiles.length > 0) {
        // Send as FormData for image uploads
        const formData = new FormData()
        Object.keys(packageData).forEach(key => {
          if (key === 'selectedFiles') {
            packageData.selectedFiles.forEach(file => formData.append('images', file))
          } else if (key !== 'images') {
            formData.append(key, packageData[key])
          }
        })
        response = await axios.post(`${API_BASE_URL}/packages`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        })
      } else {
        // Send as JSON for no images
        const { selectedFiles, ...dataToSend } = packageData
        response = await axios.post(`${API_BASE_URL}/packages`, dataToSend, {
          headers: { Authorization: `Bearer ${token}` }
        })
      }
      setPackages(prev => [...prev, response.data])
      return response.data
    } catch (err) {
      console.error('Error creating package:', err)
      throw err
    }
  }

  const updatePackage = async (id, packageData, token) => {
    try {
      let response
      if (packageData.selectedFiles && packageData.selectedFiles.length > 0) {
        // Send as FormData for image uploads
        const formData = new FormData()
        Object.keys(packageData).forEach(key => {
          if (key === 'selectedFiles') {
            packageData.selectedFiles.forEach(file => formData.append('images', file))
          } else if (key !== 'images') {
            formData.append(key, packageData[key])
          }
        })
        response = await axios.put(`${API_BASE_URL}/packages/${id}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        })
      } else {
        // Send as JSON for no images
        const { selectedFiles, ...dataToSend } = packageData
        response = await axios.put(`${API_BASE_URL}/packages/${id}`, dataToSend, {
          headers: { Authorization: `Bearer ${token}` }
        })
      }
      setPackages(prev => prev.map(pkg => pkg._id === id ? response.data : pkg))
      return response.data
    } catch (err) {
      console.error('Error updating package:', err)
      throw err
    }
  }

  const deletePackage = async (id, token) => {
    try {
      await axios.delete(`${API_BASE_URL}/packages/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setPackages(prev => prev.filter(pkg => pkg._id !== id))
    } catch (err) {
      console.error('Error deleting package:', err)
      throw err
    }
  }



  // Blogs CRUD operations
  const fetchBlogs = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/blogs/published`)
      setBlogs(response.data)
      return response.data
    } catch (err) {
      console.error('Error fetching blogs:', err)
      throw err
    }
  }

  const createBlog = async (blogData, token) => {
    try {
      let response
      if (blogData.image) {
        // Send as FormData for image upload
        const formData = new FormData()
        Object.keys(blogData).forEach(key => {
          if (key === 'image') {
            formData.append('image', blogData.image)
          } else {
            formData.append(key, blogData[key])
          }
        })
        response = await axios.post(`${API_BASE_URL}/blogs`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        })
      } else {
        // Send as JSON for no image
        response = await axios.post(`${API_BASE_URL}/blogs`, blogData, {
          headers: { Authorization: `Bearer ${token}` }
        })
      }
      setBlogs(prev => [...prev, response.data])
      return response.data
    } catch (err) {
      console.error('Error creating blog:', err)
      throw err
    }
  }

  const updateBlog = async (id, blogData, token) => {
    try {
      let response
      if (blogData.image && blogData.image instanceof File) {
        // Send as FormData for image upload
        const formData = new FormData()
        Object.keys(blogData).forEach(key => {
          if (key === 'image') {
            formData.append('image', blogData.image)
          } else {
            formData.append(key, blogData[key])
          }
        })
        response = await axios.put(`${API_BASE_URL}/blogs/${id}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        })
      } else {
        // Send as JSON for no image update
        response = await axios.put(`${API_BASE_URL}/blogs/${id}`, blogData, {
          headers: { Authorization: `Bearer ${token}` }
        })
      }
      setBlogs(prev => prev.map(blog => blog._id === id ? response.data : blog))
      return response.data
    } catch (err) {
      console.error('Error updating blog:', err)
      throw err
    }
  }

  const deleteBlog = async (id, token) => {
    try {
      await axios.delete(`${API_BASE_URL}/blogs/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setBlogs(prev => prev.filter(blog => blog._id !== id))
    } catch (err) {
      console.error('Error deleting blog:', err)
      throw err
    }
  }



  // Contacts CRUD operations
  const fetchContacts = async (token = null) => {
    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {}
      const response = await axios.get(`${API_BASE_URL}/contacts`, { headers })
      setContacts(response.data)
      return response.data
    } catch (err) {
      console.error('Error fetching contacts:', err)
      throw err
    }
  }

  const updateContact = async (id, contactData, token) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/contacts/${id}`, contactData, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setContacts(prev => prev.map(contact => contact._id === id ? response.data : contact))
      return response.data
    } catch (err) {
      console.error('Error updating contact:', err)
      throw err
    }
  }

  const deleteContact = async (id, token) => {
    try {
      await axios.delete(`${API_BASE_URL}/contacts/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setContacts(prev => prev.filter(contact => contact._id !== id))
    } catch (err) {
      console.error('Error deleting contact:', err)
      throw err
    }
  }

  // Reviews CRUD operations
  const fetchReviews = async (token = null) => {
    try {
      const authToken = token || localStorage.getItem('adminToken')
      const headers = authToken ? { Authorization: `Bearer ${authToken}` } : {}
      const response = await axios.get(`${API_BASE_URL}/reviews`, { headers })
      setReviews(response.data)
      return response.data
    } catch (err) {
      console.error('Error fetching reviews:', err)
      throw err
    }
  }

  const updateReview = async (id, reviewData, token) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/reviews/${id}`, reviewData, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setReviews(prev => prev.map(review => review._id === id ? response.data : review))
      return response.data
    } catch (err) {
      console.error('Error updating review:', err)
      throw err
    }
  }

  const deleteReview = async (id, token) => {
    try {
      await axios.delete(`${API_BASE_URL}/reviews/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setReviews(prev => prev.filter(review => review._id !== id))
    } catch (err) {
      console.error('Error deleting review:', err)
      throw err
    }
  }

  // Toggle status functions
  const togglePlaceStatus = async (id, token) => {
    const place = places.find(p => p._id === id)
    if (place) {
      await updatePlace(id, { ...place, isAtive: !place.isAtive }, token)
    }
  }

  const togglePackageStatus = async (id, token) => {
    const pkg = packages.find(p => p._id === id)
    if (pkg) {
      await updatePackage(id, { ...pkg, status: !pkg.status }, token)
    }
  }

  const toggleBlogPublished = async (id, token) => {
    const blog = blogs.find(b => b._id === id)
    if (blog) {
      await updateBlog(id, { ...blog, published: !blog.published }, token)
    }
  }

  const toggleContactStatus = async (id, token) => {
    const contact = contacts.find(c => c._id === id)
    if (contact) {
      const newStatus = contact.status === 'pending' ? 'responded' : 'pending'
      await updateContact(id, { ...contact, status: newStatus }, token)
    }
  }

  const toggleReviewStatus = async (id, token) => {
    const review = reviews.find(r => r._id === id)
    if (review) {
      let newStatus
      if (review.status === 'pending') newStatus = 'approved'
      else if (review.status === 'approved') newStatus = 'rejected'
      else newStatus = 'pending'
      await updateReview(id, { ...review, status: newStatus }, token)
    }
  }

  // Website data management
  const updateWebsiteData = async (websiteData, token) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/website`, websiteData, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setSiteData(response.data)
      return response.data
    } catch (err) {
      console.error('Error updating website data:', err)
      throw err
    }
  }


  function timeAgo(jsonDate) {
  const date = new Date(jsonDate);
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

  if (isNaN(seconds) || seconds < 0) return "just now";

  const intervals = [
    { label: "year", seconds: 31536000 },
    { label: "month", seconds: 2592000 },
    { label: "day", seconds: 86400 },
    { label: "hour", seconds: 3600 },
    { label: "minute", seconds: 60 },
  ];

  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds);
    if (count >= 1) {
      return `${count} ${interval.label}${count > 1 ? "s" : ""} ago`;
    }
  }

  return "just now";
}

  const value = {
    timeAgo,
    siteData,
    places,
    packages,
    blogs,
    contacts,
    reviews,
    loading,
    error,
    // Places
    fetchPlaces,
    createPlace,
    updatePlace,
    deletePlace,
    uploadPlaceImages,
    // Packages
    fetchPackages,
    createPackage,
    updatePackage,
    deletePackage,
    // Blogs
    fetchBlogs,
    createBlog,
    updateBlog,
    deleteBlog,
    // Contacts
    fetchContacts,
    updateContact,
    deleteContact,
    // Reviews
    fetchReviews,
    updateReview,
    deleteReview,
    // Website
    updateWebsiteData,
    // Toggle status
    togglePlaceStatus,
    togglePackageStatus,
    toggleBlogPublished,
    toggleContactStatus,
    toggleReviewStatus,

    // Utility
    refreshData: fetchAllData
  }

  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>
}

export function useSite() {
  const context = useContext(SiteContext)
  if (!context) {
    throw new Error("useSite must be used within a SiteProvider")
  }
  return context
}
