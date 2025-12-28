"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import PageHeader from "@/components/ui/page-header"
import { useSite } from "@/context/site-context"
import { FiUser, FiMail, FiPhone, FiMessageSquare, FiSend } from "react-icons/fi"

const serviceDetails = {
  "train-ticket": {
    name: "Train Ticket",
    fields: ["from", "to", "date", "passengers"]
  },
  "bus-ticket": {
    name: "Bus Ticket",
    fields: ["from", "to", "date", "passengers"]
  },
  "flight-ticket": {
    name: "Flight Ticket",
    fields: ["from", "to", "date", "passengers", "class"]
  },
  "holiday-package": {
    name: "Holiday Package",
    fields: ["destination", "duration", "startDate", "people"]
  },
  "honeymoon-package": {
    name: "Honeymoon Package",
    fields: ["destination", "duration", "startDate", "people"]
  }
}

export default function BookingForm() {
  const searchParams = useSearchParams()
  const serviceId = searchParams.get("service")
  const { siteData } = useSite()

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    from: "",
    to: "",
    date: "",
    passengers: "1",
    class: "economy",
    destination: "",
    duration: "",
    startDate: "",
    people: "2"
  })

  const service = serviceDetails[serviceId] || { name: "General Booking", fields: [] }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // Format the booking message
    let message = `*New Booking Request*\n\n`
    message += `*Service:* ${service.name}\n`
    message += `*Name:* ${formData.name}\n`
    message += `*Email:* ${formData.email}\n`
    message += `*Phone:* ${formData.phone}\n\n`

    // Add service-specific details
    if (service.fields.includes("from")) message += `*From:* ${formData.from}\n`
    if (service.fields.includes("to")) message += `*To:* ${formData.to}\n`
    if (service.fields.includes("destination")) message += `*Destination:* ${formData.destination}\n`
    if (service.fields.includes("date")) message += `*Date:* ${formData.date}\n`
    if (service.fields.includes("startDate")) message += `*Start Date:* ${formData.startDate}\n`
    if (service.fields.includes("duration")) message += `*Duration:* ${formData.duration}\n`
    if (service.fields.includes("passengers")) message += `*Passengers:* ${formData.passengers}\n`
    if (service.fields.includes("people")) message += `*People:* ${formData.people}\n`
    if (service.fields.includes("class")) message += `*Class:* ${formData.class}\n`

    if (formData.message) {
      message += `\n*Additional Message:* ${formData.message}\n`
    }

    // Encode the message for WhatsApp URL
    const encodedMessage = encodeURIComponent(message)

    // Open WhatsApp with the message
    const whatsappUrl = `https://wa.me/${siteData.phone.replace(/\D/g, "")}?text=${encodedMessage}`
    window.open(whatsappUrl, "_blank")
  }

  return (
    <>
      <PageHeader
        title="Book Your Service"
        subtitle={`Complete your booking for ${service.name}`}
        backgroundImage="/bg2.jpg"
      />

      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100"
            >
              <h2 className="text-2xl font-bold text-foreground mb-6 text-center">
                Booking Details for {service.name}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Service Information */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Selected Service
                  </label>
                  <input
                    type="text"
                    value={service.name}
                    readOnly
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-700"
                  />
                </div>

                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Full Name *
                    </label>
                    <div className="relative">
                      <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="Enter your full name"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Email *
                    </label>
                    <div className="relative">
                      <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <FiPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Enter your phone number"
                    />
                  </div>
                </div>

                {/* Service-specific fields */}
                {service.fields.includes("from") && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        From *
                      </label>
                      <input
                        type="text"
                        name="from"
                        value={formData.from}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="Departure city"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        To *
                      </label>
                      <input
                        type="text"
                        name="to"
                        value={formData.to}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="Destination city"
                      />
                    </div>
                  </div>
                )}

                {service.fields.includes("destination") && (
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Destination *
                    </label>
                    <input
                      type="text"
                      name="destination"
                      value={formData.destination}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Preferred destination"
                    />
                  </div>
                )}

                {service.fields.includes("date") && (
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Travel Date *
                    </label>
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                )}

                {service.fields.includes("startDate") && (
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Start Date *
                    </label>
                    <input
                      type="date"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                )}

                {service.fields.includes("duration") && (
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Duration
                    </label>
                    <select
                      name="duration"
                      value={formData.duration}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="">Select duration</option>
                      <option value="2 Days">2 Days</option>
                      <option value="3 Days">3 Days</option>
                      <option value="5 Days">5 Days</option>
                      <option value="7 Days">7 Days</option>
                      <option value="10 Days">10 Days</option>
                    </select>
                  </div>
                )}

                {service.fields.includes("passengers") && (
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Number of Passengers *
                    </label>
                    <select
                      name="passengers"
                      value={formData.passengers}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="1">1 Passenger</option>
                      <option value="2">2 Passengers</option>
                      <option value="3">3 Passengers</option>
                      <option value="4">4 Passengers</option>
                      <option value="5+">5+ Passengers</option>
                    </select>
                  </div>
                )}

                {service.fields.includes("people") && (
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Number of People *
                    </label>
                    <select
                      name="people"
                      value={formData.people}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="2">2 People</option>
                      <option value="3">3 People</option>
                      <option value="4">4 People</option>
                      <option value="5">5 People</option>
                      <option value="6+">6+ People</option>
                    </select>
                  </div>
                )}

                {service.fields.includes("class") && (
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Class
                    </label>
                    <select
                      name="class"
                      value={formData.class}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="economy">Economy</option>
                      <option value="premium">Premium Economy</option>
                      <option value="business">Business</option>
                      <option value="first">First Class</option>
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Additional Message
                  </label>
                  <div className="relative">
                    <FiMessageSquare className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Any special requirements or additional information..."
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-primary text-white py-3 px-6 rounded-lg font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                >
                  <FiSend className="w-5 h-5" />
                  Send Booking Request via WhatsApp
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  )
}
