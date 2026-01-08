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

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)

    if (!isMobile) {
      const timer = setTimeout(() => {
        setIsVisible(true)
      }, 5000)

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
      await axios.post(`${API_BASE_URL}/contacts`, formData)
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
              className="fixed bottom-4 right-4 bg-card border border-border rounded-2xl shadow-2xl max-w-sm w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 w-8 h-8 bg-muted hover:bg-muted/80 rounded-full flex items-center justify-center transition-colors z-10"
              >
                <FiX className="w-5 h-5 text-muted-foreground" />
              </button>

              {/* Content */}
              <div className="p-6">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-foreground mb-2">Get in Touch</h2>
                  <p className="text-muted-foreground text-sm">Have questions? We'd love to hear from you!</p>
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
                    <h3 className="text-lg font-semibold text-foreground mb-1">Message Sent!</h3>
                    <p className="text-muted-foreground text-sm">We'll get back to you soon.</p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                      <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                        <p className="text-destructive text-sm">{error}</p>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          placeholder="Full Name *"
                          className="w-full px-3 py-2 text-sm border border-border bg-background text-foreground rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                        />
                      </div>
                      <div>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          placeholder="Email *"
                          className="w-full px-3 py-2 text-sm border border-border bg-background text-foreground rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="Phone"
                          className="w-full px-3 py-2 text-sm border border-border bg-background text-foreground rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                        />
                      </div>
                      <div>
                        <select
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          required
                          className="w-full px-3 py-2 text-sm border border-border bg-background text-foreground rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                        >
                          <option value="">Subject *</option>
                          <option value="booking">Package Booking</option>
                          <option value="inquiry">General Inquiry</option>
                          <option value="custom">Custom Tour</option>
                          <option value="feedback">Feedback</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={3}
                        placeholder="Your message *"
                        className="w-full px-3 py-2 text-sm border border-border bg-background text-foreground rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent transition-all resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-primary text-primary-foreground font-medium py-2 px-4 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-70 flex items-center justify-center gap-2 text-sm"
                    >
                      {isSubmitting ? (
                        <>
                          <span className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <FiSend className="w-4 h-4" />
                          Send Message
                        </>
                      )}
                    </button>
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
