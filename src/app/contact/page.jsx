"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { FiPhone, FiMail, FiMapPin, FiClock, FiSend, FiCheck } from "react-icons/fi"
import Head from "next/head"
import PageHeader from "@/components/ui/page-header"
import { useSite } from "@/context/site-context"
import axios from "axios"

export default function ContactPage() {
  const { siteData } = useSite()
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
      setTimeout(() => setIsSubmitted(false), 5000)
    } catch (err) {
      console.error('Error submitting contact form:', err)
      setError('Failed to send message. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const contactInfo = [
    {
      icon: FiPhone,
      title: "Phone",
      details: [siteData.contactInfo.phone, siteData.alternatePhone],
      link: `tel:${siteData.contactInfo.phone}`,
    },
    {
      icon: FiMail,
      title: "Email",
      details: [siteData.contactInfo.email],
      link: `mailto:${siteData.contactInfo.email}`,
    },
    {
      icon: FiMapPin,
      title: "Address",
      details: [siteData.contactInfo.address],
    },
    {
      icon: FiClock,
      title: "Working Hours",
      details: [siteData.workingHours],
    },
  ]

  return (
    <>
      <Head>
        <title>Contact Avantika Travels | Book Your Ujjain Taxi Now</title>
        <meta name="description" content="Contact Avantika Travels for taxi booking in Ujjain and Indore. Call +91 8720006707 for instant quotes and 24/7 travel assistance." />
        <meta name="keywords" content="Contact Avantika Travels, Ujjain taxi number, book car in Indore" />
        <meta property="og:title" content="Contact Avantika Travels | Book Your Ujjain Taxi Now" />
        <meta property="og:description" content="Contact Avantika Travels for taxi booking in Ujjain and Indore. Call +91 8720006707 for instant quotes and 24/7 travel assistance." />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/pik9.avif" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Contact Avantika Travels | Book Your Ujjain Taxi Now" />
        <meta name="twitter:description" content="Contact Avantika Travels for taxi booking in Ujjain and Indore. Call +91 8720006707 for instant quotes and 24/7 travel assistance." />
        <meta name="twitter:image" content="/pik9.avif" />
      </Head>
      <PageHeader
        title="Contact Us"
        subtitle="Get in touch with us for any inquiries or to plan your perfect trip"
        backgroundImage="/pik9.avif"
      />

      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-1"
            >
              <h2 className="text-2xl font-bold text-foreground mb-6">Get in Touch</h2>
              <p className="text-muted-foreground mb-8">
                {
                  "We'd love to hear from you. Reach out to us through any of the following channels or fill out the form."
                }
              </p>

              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                      <info.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">{info.title}</h3>
                      {info.details.map((detail, idx) => (
                        <p key={idx} className="text-muted-foreground">
                          {info.link ? (
                            <a href={info.link} className="hover:text-primary transition-colors">
                              {detail}
                            </a>
                          ) : (
                            detail
                          )}
                        </p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Map Placeholder */}
              <div className="mt-8 p-6 rounded-2xl overflow-hidden h-[200px] bg-muted flex items-center justify-center">
                <div className="text-center">
                  <FiMapPin className="w-8 h-8 text-primary mx-auto mb-2" />
                  <p className="text-muted-foreground text-sm">{siteData.contactInfo.location}, {siteData.contactInfo.region}</p>
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-2"
            >
              <div className="bg-muted rounded-2xl p-6 md:p-10">
                <h2 className="text-2xl font-bold text-foreground mb-6">Send us a Message</h2>

                {isSubmitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12"
                  >
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FiCheck className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-2">Message Sent!</h3>
                    <p className="text-muted-foreground">{"We'll get back to you within 24 hours."}</p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                      <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                        <p className="text-red-600 text-sm">{error}</p>
                      </div>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 rounded-xl border border-border bg-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                          placeholder="Your name"
                        />
                      </div>

                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 rounded-xl border border-border bg-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                          placeholder="your@email.com"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl border border-border bg-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                          placeholder="+91 98765 43210"
                        />
                      </div>

                      <div>
                        <label htmlFor="subject" className="block text-sm font-medium text-foreground mb-2">
                          Subject *
                        </label>
                        <select
                          id="subject"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 rounded-xl border border-border bg-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                        >
                          <option value="">Select a subject</option>
                          <option value="booking">Package Booking</option>
                          <option value="inquiry">General Inquiry</option>
                          <option value="custom">Custom Tour Request</option>
                          <option value="feedback">Feedback</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                        Message *
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={5}
                        className="w-full px-4 py-3 rounded-xl border border-border bg-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
                        placeholder="Tell us about your travel plans or questions..."
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full md:w-auto bg-primary text-white font-semibold px-8 py-3 rounded-full hover:bg-primary-dark transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <FiSend className="w-5 h-5" />
                          Send Message
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  )
}
