"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { FiX, FiSend, FiCheck } from "react-icons/fi"
import axios from "axios"

export default function ContactPopup() {
  const [isVisible, setIsVisible] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 328)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)

    if (!isMobile) {
      const timer = setTimeout(() => {
        setIsVisible(true)
      }, 8000)

      return () => {
        clearTimeout(timer)
        window.removeEventListener('resize', checkMobile)
      }
    }

    return () => window.removeEventListener('resize', checkMobile)
  }, [isMobile])

  const handleClose = () => {
    setIsVisible(false)
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    try {
      await axios.post(`/api/contacts`, formData)
      setIsSubmitted(true)
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" })
      setTimeout(() => {
        setIsSubmitted(false)
        setIsVisible(false)
      }, 3000)
    } catch (err) {
      console.error('Error submitting contact form:', err)
      setError('Failed to send message. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isMobile) return null

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={handleClose}
          >
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, x: 20, y: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, x: 20, y: 20 }}
              className="fixed bottom-4 right-0 sm:right-4 bg-card border border-border rounded-2xl shadow-2xl max-w-sm w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={handleClose}
                area-label='Close Popup contact form'
                className="absolute top-1 right-1 w-8 h-8 bg-muted hover:bg-muted/80 rounded-full flex items-center justify-center transition-colors z-10"
              >
                <FiX className="w-5 h-5 text-muted-foreground" />
              </button>

              {/* Content */}
              {/* Content */}
<div className="p-6">
  <div className="text-center mb-6">
    <h2 className="text-xl font-bold text-foreground mb-2">
      Plan Your Mahakal Yatra 🙏
    </h2>

    <p className="text-muted-foreground text-sm leading-relaxed max-w-[320px] mx-auto">
     Need help with Darshan or your Ujjain trip? We’re here to help.
    </p>
  </div>

  {isSubmitted ? (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-8"
    >
      <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-3">
        <FiCheck className="w-6 h-6 text-green-600 dark:text-green-400" />
      </div>

      <h3 className="text-lg font-semibold text-foreground mb-1">
        Your Trip Request is Received! 🙏
      </h3>

      <p className="text-muted-foreground text-sm">
        Our travel team will contact you shortly to help plan your journey.
      </p>
    </motion.div>
  ) : (
    <form onSubmit={handleSubmit} className="space-y-4">

      {error && (
        <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
          <p className="text-destructive text-sm">
            {error}
          </p>
        </div>
      )}

      {/* Name + Email */}
      <div className="grid grid-cols-2 gap-3">
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          placeholder="Your Name *"
          className="w-full px-3 py-2.5 text-sm border border-border bg-background text-foreground rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
        />

        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          placeholder="Email *"
          className="w-full px-3 py-2.5 text-sm border border-border bg-background text-foreground rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
        />
      </div>

      {/* Phone + Requirement */}
      <div className="grid grid-cols-2 gap-3">
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          required
          placeholder="WhatsApp / Phone *"
          className="w-full px-3 py-2.5 text-sm border border-border bg-background text-foreground rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
        />

        <select
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          required
          aria-label="How can we help?"
          className="w-full px-3 py-2.5 text-sm border border-border bg-background text-foreground rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
        >
          <option value="">How can we help? *</option>
          <option value="mahakal-darshan">Mahakal Darshan</option>
          <option value="omkareshwar">Omkareshwar Trip</option>
          <option value="ujjain-trip">Booking</option>
          <option value="package-booking">Tour Package</option>
          <option value="custom-tour">Custom Tour</option>
          <option value="other">Other</option>
        </select>
      </div>

      {/* Message */}
      <textarea
        name="message"
        value={formData.message}
        onChange={handleChange}
        required
        rows={3}
        placeholder="Tell us about your trip — travel date, number of people, or anything you need help with..."
        className="w-full px-3 py-2.5 text-sm border border-border bg-background text-foreground rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent transition-all resize-none"
      />

      {/* CTA */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-primary text-primary-foreground font-medium py-3 px-4 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-70 flex items-center justify-center gap-2 text-sm"
      >
        {isSubmitting ? (
          <>
            <span className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
            Planning Your Trip...
          </>
        ) : (
          <>
            <FiSend className="w-4 h-4" />
            Get Trip Assistance
          </>
        )}
      </button>

      <p className="text-center text-[11px] text-muted-foreground">
        ✓ Quick response &nbsp; • &nbsp; No obligation
      </p>

    </form>
  )}
</div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
