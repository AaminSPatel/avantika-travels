"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import Head from "next/head"
import { FiCheck, FiUsers, FiAward, FiMap, FiHeart, FiShield, FiSmile } from "react-icons/fi"
import PageHeader from "@/components/ui/page-header"
import { useSite } from "@/context/site-context"

export default function AboutPage() {
  const { siteData } = useSite()

  const stats = [
    { icon: FiUsers, value: "5,00+", label: "Happy Yatris" },
    { icon: FiMap, value: "100+", label: "MP Destinations" },
    { icon: FiAward, value: "5+", label: "Years Serving" },
    { icon: FiShield, value: "100%", label: "Safe Journeys" },
  ]

  const values = [
    {
      title: "Spiritual Integrity",
      description:
        "We understand the sanctity of your pilgrimage. From Bhasma Aarti to Narmada Snan, we ensure your religious sentiments are respected.",
      icon: FiHeart
    },
    {
      title: "Local Expertise",
      description: "Being locals of Ujjain, we know every street, ghat, and hidden gem in Madhya Pradesh that big portals often miss.",
      icon: FiMap
    },
    {
      title: "Safety First",
      description: "Our fleet of taxis is regularly serviced, and our drivers are verified professionals, ensuring a safe trip for families and solo travelers.",
      icon: FiShield
    },
    {
      title: "Customer Delight",
      description:
        "We don't just book tickets; we craft memories. Our 24/7 support ensures you are never alone during your journey.",
      icon: FiSmile
    },
  ]

  // SEO Schema for Organization
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    "name": "Avantika Travels",
    "alternateName": "Avantika Tour & Travels Ujjain",
    "url": "https://avantikatravels.com",
    "logo": "https://avantikatravels.com/logo.png",
    "foundingDate": "2020",
    "description": "Leading travel agency in Ujjain providing Mahakal Darshan packages, Indore taxi services, and Madhya Pradesh tourism packages.",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Ujjain",
      "addressRegion": "Madhya Pradesh",
      "addressCountry": "IN"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+918720006707",
      "contactType": "customer service",
      "areaServed": "IN",
      "availableLanguage": ["English", "Hindi"]
    },
    "sameAs": [
      siteData.socialLinks.facebook,
      siteData.socialLinks.instagram,
      siteData.socialLinks.twitter,
      siteData.socialLinks.youtube
    ]
  }

  return (
    <>
      <Head>
        <title>About Avantika Travels | Best Travel Agency in Ujjain & MP Tourism</title>
        <meta name="description" content="Avantika Travels is a trusted tour operator in Ujjain with 5+ years of experience. We specialize in Mahakal Darshan, Omkareshwar trips, and complete Madhya Pradesh travel services." />
        <meta name="keywords" content="Travel agency in Ujjain, Madhya Pradesh tourism packages, best tour operator for Mahakal, Indore taxi service provider, Avantika Travels history" />
        <link rel="canonical" href="https://avantikatravels.com/about" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </Head>

      <PageHeader
        title="About Avantika Travels"
        subtitle={`Connecting devotees and travelers to the soul of ${siteData.region} since 2020.`}
        backgroundImage="/pik8.avif"
      />

      {/* Story Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative h-[450px] rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src="/ujjain.png"
                  alt="Avantika Travels Team managing tour in Ujjain"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              </div>
              <div className="absolute -bottom-6 -right-6 bg-primary text-white p-8 rounded-3xl shadow-xl border-4 border-white hidden md:block">
                <p className="text-5xl font-bold mb-1">5+</p>
                <p className="text-white/90 font-medium">Years of Trust</p>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <span className="text-primary font-bold tracking-wider uppercase text-sm">Our Journey</span>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-6">
                Welcome to Avantika Travels
              </h2>
   <div className="text-gray-700 mb-12 space-y-10">

  {/* Intro */}
  <div className="prose prose-lg max-w-none">
    <h2>Welcome to Avantika Travels</h2>
    <p>
      At <strong>Avantika Travels</strong>, we believe that travel is not just about reaching a destination—it is about creating unforgettable experiences and lifelong memories.
    </p>
    <p>
      We provide well-planned travel solutions including pilgrimage tours, customized trips, hotel bookings, and transportation services—ensuring every journey is smooth and meaningful.
    </p>

    <div className="bg-gray-100 border-l-4 border-blue-500 p-4 rounded-lg">
      <p className="font-semibold text-gray-800">
        “Journeys You Can Trust.”
      </p>
    </div>
  </div>

  {/* Mission & Vision */}
  <div className="grid md:grid-cols-2 gap-6">
    <div className="bg-white shadow-md rounded-2xl p-6 border">
      <h3 className="text-xl font-semibold mb-3">Our Mission</h3>
      <p>
        To provide safe, affordable, and well-organized travel experiences while maintaining high standards of service and customer satisfaction.
      </p>
    </div>

    <div className="bg-white shadow-md rounded-2xl p-6 border">
      <h3 className="text-xl font-semibold mb-3">Our Vision</h3>
      <ul className="list-disc pl-5 space-y-2">
        <li>Connect people with spiritual and cultural destinations</li>
        <li>Use modern technology for seamless planning</li>
        <li>Build long-term trust with travelers</li>
        <li>Expand across India and internationally</li>
      </ul>
    </div>
  </div>

  {/* Services */}
  <div>
    <h3 className="text-xl font-semibold mb-4">What We Offer</h3>
    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
      {[
        "Domestic Tour Packages",
        "Pilgrimage Tours",
        "Customized Trips",
        "Hotel Bookings",
        "Transportation Services",
        "Complete Travel Management"
      ].map((item, i) => (
        <div key={i} className="bg-gray-50 border rounded-xl p-4 text-center shadow-sm">
          <p className="font-medium">{item}</p>
        </div>
      ))}
    </div>
  </div>

  {/* Founder */}
  <div className="bg-white border rounded-2xl shadow-md p-6">
    <h3 className="text-xl font-semibold mb-3">About the Founder</h3>
    <p>
      <strong>Gautam Rathore</strong> started Avantika Travels with a vision to create a reliable travel brand.
    </p>
    <p className="mt-2">
      With hands-on experience in operations, itinerary planning, and customer support, he focuses on delivering quality service and meaningful travel experiences.
    </p>
  </div>

  {/* Founder Vision */}
  <div>
    <h3 className="text-xl font-semibold mb-4">Founder’s Vision</h3>
    <div className="grid sm:grid-cols-2 gap-4">
      {[
        "Expand tours across India",
        "Build strong operational systems",
        "Organize large group tours",
        "Create a trusted travel brand"
      ].map((item, i) => (
        <div key={i} className="flex items-center gap-3 bg-gray-50 p-4 rounded-xl border">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          <p>{item}</p>
        </div>
      ))}
    </div>
  </div>

  {/* Goal */}
  <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
    <h3 className="text-xl font-semibold mb-2">Our Goal</h3>
    <p>
      To grow into a customer-focused travel brand that combines traditional hospitality with modern technology and serves thousands of travelers every year.
    </p>
  </div>

</div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  "Government Registered Agency",
                  "Verified Drivers & Guides",
                  "No Hidden Charges",
                  "24/7 On-Trip Assistance",
                  "Customized MP Tour Packages",
                  "Clean & Sanitized Vehicles",
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center shrink-0">
                      <FiCheck className="w-3 h-3 text-green-600" />
                    </div>
                    <span className="text-gray-700 font-medium text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-gray-900 to-black/90 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                    <stat.icon className="w-8 h-8 text-white" />
                </div>
                <p className="text-4xl font-bold mb-2">{stat.value}</p>
                <p className="text-blue-100 font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us (Values) */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Travelers Trust Us?</h2>
            <p className="text-gray-600 text-lg">
              We don't just provide cars; we provide care. Here is why thousands of families choose Avantika Travels for their MP tours.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-shadow border border-gray-100 group"
              >
                <div className="w-14 h-14 bg-primary/5 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors text-primary">
                    <value.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed text-sm">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Detailed Service Area (SEO Content) */}
      <section className="py-16 bg-white border-t border-gray-100">
          <div className="container mx-auto px-4 max-w-5xl">
              <div className="text-center mb-10">
                  <h2 className="text-2xl font-bold text-gray-900">Our Service Areas in Madhya Pradesh</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-8 text-gray-600 text-sm leading-relaxed bg-gray-50 p-8 rounded-3xl">
                  <div>
                      <h4 className="font-bold text-gray-800 mb-2">Ujjain & Indore Hub</h4>
                      <p>
                          We operate a large fleet of taxis in Ujjain and Indore. Whether you need an <strong>airport pickup from Indore (IDR)</strong> or a railway station transfer from Ujjain Junction, our drivers are available 24/7. We specialize in local sightseeing including Mahakal Lok, Kal Bhairav, and Khajrana Ganesh.
                      </p>
                  </div>
                  <div>
                      <h4 className="font-bold text-gray-800 mb-2">Heritage & Pilgrimage Tours</h4>
                      <p>
                          Our services extend across the state covering <strong>Omkareshwar, Maheshwar, Mandu, Sanchi, and Pachmarhi</strong>. We offer complete package tours that include hotel stay, meals, and comfortable transportation, allowing you to explore the "Heart of India" without any stress.
                      </p>
                  </div>
              </div>
          </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-900 text-white text-center">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Plan Your MP Trip With Experts</h2>
            <p className="text-gray-300 mb-8 text-lg">
              Get a customized itinerary designed by locals. Transparent pricing and unforgettable memories guaranteed.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/packages"
                className="bg-primary text-white font-bold px-8 py-4 rounded-full hover:bg-primary-dark transition-all shadow-lg hover:shadow-primary/25"
              >
                View Our Packages
              </Link>
              <Link
                href="/contact"
                className="bg-transparent border-2 border-white text-white font-bold px-8 py-4 rounded-full hover:bg-white hover:text-gray-900 transition-all"
              >
                Contact Us
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
}