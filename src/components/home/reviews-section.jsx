'use client'

import { useState, useEffect } from 'react'
import { FaStar, FaFilter } from 'react-icons/fa'

export default function ReviewsSection() {
  const [reviews, setReviews] = useState([])
  const [filteredReviews, setFilteredReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    userName: '',
    email: '',
    rating: 5,
    comment: ''
  })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [filter, setFilter] = useState('all') // all, 5, 4, 3, 2, 1
  const [showSuccessAlert, setShowSuccessAlert] = useState(false)

  useEffect(() => {
    fetchReviews()
  }, [])

  useEffect(() => {
    filterReviews()
  }, [reviews, filter])

  const fetchReviews = async () => {
    try {
      const response = await fetch('/api/website/reviews')
      if (response.ok) {
        const data = await response.json()
        setReviews(data)
      }
    } catch (error) {
      console.error('Error fetching reviews:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterReviews = () => {
    if (filter === 'all') {
      setFilteredReviews(reviews)
    } else {
      setFilteredReviews(reviews.filter(review => review.rating === parseInt(filter)))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.userName.trim()) newErrors.userName = 'Name is required'
    if (!formData.email.trim()) newErrors.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid'
    if (!formData.comment.trim()) newErrors.comment = 'Comment is required'
    if (formData.rating < 1 || formData.rating > 5) newErrors.rating = 'Rating must be between 1 and 5'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    setSubmitting(true)
    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
      /*   alert('Thank you for your review! It will be published after approval.') */
        setFormData({ userName: '', email: '', rating: 5, comment: '' })
        setShowForm(false)
        setErrors({})
      } else {
        alert('Failed to submit review. Please try again.')
      }
    } catch (error) {
      console.error('Error submitting review:', error)
      alert('An error occurred. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <FaStar
        key={i}
        className={`text-sm ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
      />
    ))
  }

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center">Loading reviews...</div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">Customer Reviews</h2>
          <p className="text-muted-foreground">See what our customers say about their experience</p>
        </div>

        {/* Post Review Button */}
        <div className="text-center mb-8">
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
          >
            {showForm ? 'Cancel' : 'Post a Review'}
          </button>
        </div>

        {/* Post Review Form */}
        {showForm && (
          <div className="max-w-2xl mx-auto bg-card p-6 rounded-lg shadow-md mb-8 border">
            <h3 className="text-xl font-semibold mb-4 text-card-foreground">Share Your Experience</h3>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-card-foreground mb-1">Name *</label>
                  <input
                    type="text"
                    value={formData.userName}
                    onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                    className={`w-full p-2 border rounded bg-background ${errors.userName ? 'border-destructive' : 'border-border'}`}
                    required
                  />
                  {errors.userName && <p className="text-destructive text-sm mt-1">{errors.userName}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-card-foreground mb-1">Email *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={`w-full p-2 border rounded bg-background ${errors.email ? 'border-destructive' : 'border-border'}`}
                    required
                  />
                  {errors.email && <p className="text-destructive text-sm mt-1">{errors.email}</p>}
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-card-foreground mb-2">Rating *</label>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFormData({ ...formData, rating: star })}
                      className="text-2xl hover:scale-110 transition-transform"
                    >
                      <FaStar
                        className={star <= formData.rating ? 'text-primary' : 'text-muted-foreground'}
                      />
                    </button>
                  ))}
                  <span className="ml-2 text-sm text-muted-foreground">
                    ({formData.rating} star{formData.rating !== 1 ? 's' : ''})
                  </span>
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-card-foreground mb-1">Comment *</label>
                <textarea
                  value={formData.comment}
                  onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                  className={`w-full p-2 border rounded h-24 bg-background ${errors.comment ? 'border-destructive' : 'border-border'}`}
                  placeholder="Tell us about your experience..."
                  required
                />
                {errors.comment && <p className="text-destructive text-sm mt-1">{errors.comment}</p>}
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-primary text-primary-foreground py-2 px-4 rounded hover:bg-primary/90 disabled:opacity-50"
              >
                {submitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          </div>
        )}

        {/* Filter Options */}
        <div className="flex justify-center items-center mb-8">
          <FaFilter className="mr-2 text-muted-foreground" />
          <span className="mr-4 text-foreground">Filter by rating:</span>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="p-2 border border-border rounded bg-background text-foreground"
          >
            <option value="all">All Reviews</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>
        </div>

        {/* Reviews Display */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReviews.length === 0 ? (
            <div className="col-span-full text-center py-8">
              <p className="text-muted-foreground">No reviews found for the selected filter.</p>
            </div>
          ) : (
            filteredReviews.map((review) => (
              <div key={review._id} className="bg-card p-6 rounded-lg shadow-md border">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                      <span className="text-primary font-semibold">
                        {review.userName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-card-foreground">{review.userName}</h4>
                      <div className="flex items-center">
                        {renderStars(review.rating)}
                        <span className="ml-2 text-sm text-muted-foreground">({review.rating})</span>
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-card-foreground mb-4">{review.comment}</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(review.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  )
}
