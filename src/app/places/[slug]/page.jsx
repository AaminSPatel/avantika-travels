"use client"

import { use, useState, useEffect } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import Head from "next/head"
import { FiMapPin, FiCalendar, FiStar, FiArrowRight, FiUsers, FiTrendingUp, FiClock, FiInfo, FiPhone, FiMap } from "react-icons/fi"
import { FaWhatsapp, FaGoogle } from "react-icons/fa"
import PageHeader from "@/components/ui/page-header"
import PackageCard from "@/components/ui/package-card"
import { useSite } from "@/context/site-context"
import AIEnhancements from "@/components/seo/AIEnhancements"

export default function PlaceDetailsPage({ params }) {
  // Next.js 15+ Params handling
  const resolvedParams = use(params)
  const { places, packages, siteData } = useSite()
  const [currentUrl, setCurrentUrl] = useState("")

  const place = places.find((p) => p.slug === resolvedParams.slug)
  
  // Filter packages by destination 
  const relatedPackages = packages.filter((pkg) => 
    pkg.destination.toLowerCase().includes(place?.location?.toLowerCase() || place?.title?.toLowerCase())
  )

  useEffect(() => {
    if (typeof window !== "undefined") setCurrentUrl(window.location.href)
  }, [])

  if (!place) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Destination not found</h1>
          <Link href="/places" className="text-primary hover:underline font-medium">
            ← Back to All Destinations
          </Link>
        </div>
      </div>
    )
  }

  // Use first image as main image, fallback to placeholder
  const mainImage = place.images && place.images.length > 0 ? place.images[0].url : "/placeholder.svg"

  // --- SEO STRATEGY: JSON-LD SCHEMA ---
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TouristAttraction",
    "name": place.title,
    "description": place.description,
    "image": mainImage,
    "url": currentUrl,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": place.location,
      "addressRegion": "Madhya Pradesh",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "23.1765", // You can make these dynamic if you have lat/lng in DB
      "longitude": "75.7885"
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
      ],
      "opens": "06:00",
      "closes": "22:00"
    },
// Removed invalid aggregateRating schema (fake reviewCount)
// Real reviews needed for compliance - omitted to fix Google validation error
    "isAccessibleForFree": place.entryFee === 0
  }

  return (
    <>
      <AIEnhancements pageType="place" data={place} />
      
      <Head>
        <title>{`${place.title} Timings, Entry Fee & History | Visit ${place.location}`}</title>
        <meta name="description" content={`Complete travel guide for ${place.title} in ${place.location}. Check timings, entry fee, history, and how to reach. Book taxi for ${place.title} with Avantika Travels.`} />
        <meta name="keywords" content={`${place.title}, ${place.title} timings, ${place.title} history, how to reach ${place.location}, places to visit in ${place.location}, taxi for ${place.title}`} />
        
        {/* Open Graph */}
        <meta property="og:title" content={`${place.title} - Complete Travel Guide`} />
        <meta property="og:description" content={place.description.substring(0, 150)} />
        <meta property="og:image" content={mainImage} />
        <meta property="og:type" content="place" />
        
        <link rel="canonical" href={currentUrl} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </Head>

      <PageHeader 
        title={place.title} 
        subtitle={`Discover the history, beauty, and spirituality of ${place.location}'s finest gem.`} 
        backgroundImage={mainImage} 
      />

      {/* Main Content */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* --- LEFT COLUMN (Content) --- */}
            <div className="lg:col-span-8">
              {/* Main Image Gallery */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative h-[400px] md:h-[500px] rounded-3xl overflow-hidden mb-6 shadow-xl"
              >
                <Image 
                  src={mainImage} 
                  alt={`View of ${place.title} - Best Tourist Spot in ${place.location}`} 
                  fill 
                  className="object-cover hover:scale-105 transition-transform duration-700" 
                  priority
                  sizes="(max-width: 768px) 100vw, 800px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                
                {place.rating > 0 && (
                  <div className="absolute top-6 right-6 bg-white/95 backdrop-blur-md px-4 py-2 rounded-full flex items-center gap-2 shadow-lg">
                    <FiStar className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                    <span className="font-bold text-gray-900">{place.rating.toFixed(1)}</span>
                    <span className="text-xs text-gray-500">/ 5.0</span>
                  </div>
                )}
              </motion.div>

              {/* Thumbnails */}
              {place.images && place.images.length > 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="grid grid-cols-4 gap-3 mb-10"
                >
                  {place.images.slice(1, 5).map((image, index) => (
                    <div key={index} className="relative h-24 rounded-xl overflow-hidden cursor-pointer shadow-sm hover:shadow-md transition-all">
                      <Image 
                        src={image.url} 
                        alt={`${place.title} gallery image ${index + 1}`} 
                        fill 
                        className="object-cover"
                      />
                    </div>
                  ))}
                </motion.div>
              )}

              {/* About Section */}
              <motion.article 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: 0.2 }}
                className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-600 prose-a:text-primary"
              >
                <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <span className="w-2 h-8 bg-primary rounded-full inline-block"></span>
                    About {place.title}
                </h2>
                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 mb-8">
                    <p className="leading-relaxed m-0 text-gray-700">
                        {place.description}
                    </p>
                </div>

                {/* Key Highlights / Stats Grid */}
                {(place.visitors > 0 || place.trips > 0) && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10 not-prose">
                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-center">
                        <FiUsers className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                        <span className="block font-bold text-xl text-blue-900">{place.visitors ? place.visitors.toLocaleString() : "50K+"}</span>
                        <span className="text-xs text-blue-700 font-medium uppercase tracking-wide">Yearly Visitors</span>
                    </div>
                    <div className="bg-green-50 p-4 rounded-xl border border-green-100 text-center">
                        <FiTrendingUp className="w-6 h-6 text-green-600 mx-auto mb-2" />
                        <span className="block font-bold text-xl text-green-900">Top Rated</span>
                        <span className="text-xs text-green-700 font-medium uppercase tracking-wide">Destinations</span>
                    </div>
                    <div className="bg-orange-50 p-4 rounded-xl border border-orange-100 text-center col-span-2 md:col-span-1">
                        <FiStar className="w-6 h-6 text-orange-600 mx-auto mb-2" />
                        <span className="block font-bold text-xl text-orange-900">{place.cleaness || 4.5}/5</span>
                        <span className="text-xs text-orange-700 font-medium uppercase tracking-wide">Cleanliness</span>
                    </div>
                  </div>
                )}
                
                {/* SEO Content Injection: Travel Tips */}
                <h3 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Travel Tips for {place.title} Visitors</h3>
                <ul className="space-y-3 list-none pl-0 not-prose">
                    <li className="flex gap-3 items-start">
                        <FiInfo className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                        <span className="text-gray-700"><strong>Best time to visit:</strong> The ideal time to explore {place.location} is between October and March when the weather is pleasant.</span>
                    </li>
                    <li className="flex gap-3 items-start">
                        <FiMap className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                        <span className="text-gray-700"><strong>How to reach:</strong> It is easily accessible by road from Indore and Ujjain. You can book a taxi with Avantika Travels for a comfortable journey.</span>
                    </li>
                    <li className="flex gap-3 items-start">
                        <FiClock className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                        <span className="text-gray-700"><strong>Recommended Duration:</strong> Plan for at least {place.category === 'Historical' ? '2-3 hours' : '1-2 hours'} to fully explore this location.</span>
                    </li>
                </ul>
              </motion.article>
            </div>

            {/* --- RIGHT COLUMN (Sticky Sidebar) --- */}
            <div className="lg:col-span-4">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="sticky top-24 space-y-6"
              >
                {/* 1. Quick Info Card */}
                <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                  <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <span className="text-2xl">ℹ️</span> Key Information
                  </h3>

                  <div className="space-y-5">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center flex-shrink-0">
                        <FiMapPin className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase font-semibold">Location</p>
                        <p className="font-medium text-gray-900">{place.location}</p>
                        <a href={`https://www.google.com/maps/search/?api=1&query=${place.title} ${place.location}`} target="_blank" className="text-xs text-primary underline mt-1 block">View on Map</a>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center flex-shrink-0">
                        <FiClock className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase font-semibold">Opening Hours</p>
                        <p className="font-medium text-gray-900">{place.openingHours || "06:00 AM - 09:00 PM"}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-primary font-bold text-lg">₹</span>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase font-semibold">Entry Fee</p>
                        <p className="font-medium text-gray-900">
                           {place.entryFee > 0 ? `₹${place.entryFee} / Person` : "Free Entry"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. CTA Booking Card (Pink Theme Gradient) */}
                <div className="bg-gradient-to-br from-primary via-pink-600 to-gray-700 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
                    
                    <h3 className="font-bold text-xl text-gray-900  mb-2 relative z-10">Visit {place.title} Today!</h3>
                    <p className="text-gray-700 text-sm mb-6 relative z-10">
                        Book a hassle-free taxi from Indore or Ujjain. Comfortable cars & experienced drivers.
                    </p>

                    <div className="space-y-3 relative z-10">
                         <a
                            href={`https://wa.me/${siteData.contactInfo?.phone?.replace(/\D/g, '') || '918720006707'}?text=I want to visit ${place.title}. Please send taxi rates.`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 w-full bg-white text-green-500 font-bold py-3 rounded-xl hover:bg-green-50 transition-all shadow-md"
                        >
                            <FaWhatsapp className="w-5 h-5" /> Chat for Rates
                        </a>
                        <Link
                            href={`tel:${siteData.contactInfo?.phone}`}
                            className="flex items-center justify-center gap-2 w-full text-black bg-white/20 backdrop-blur-md border border-white/30 font-semibold py-3 rounded-xl hover:bg-white/30 transition-all"
                        >
                            <FiPhone className="w-4 h-4" /> Call Now
                        </Link>
                    </div>
                </div>

                {/* 3. Status Badge */}
                {place.isAtive === false && (
                    <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex gap-3 items-start">
                        <FiInfo className="text-red-600 mt-1 flex-shrink-0" />
                        <div>
                            <p className="font-bold text-red-800 text-sm">Temporarily Closed</p>
                            <p className="text-red-600 text-xs">This location is currently not accepting visitors.</p>
                        </div>
                    </div>
                )}

              </motion.div>
            </div>

          </div>
        </div>
      </section>

      {/* Related Packages */}
      {relatedPackages.length > 0 && (
        <section className="py-16 md:py-24 bg-gray-50 border-t border-gray-200">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-4">
              <div>
                 <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                    Tours Including {place.title}
                 </h2>
                 <p className="text-gray-500 mt-2">Best value packages covering {place.location} and nearby spots.</p>
              </div>
              <Link
                href="/packages"
                className="hidden md:flex items-center gap-2 bg-white px-5 py-2.5 rounded-full border border-gray-200 text-gray-700 font-semibold hover:border-primary hover:text-primary transition-all shadow-sm"
              >
                View All Packages
                <FiArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedPackages.slice(0, 3).map((pkg, index) => (
                <PackageCard key={pkg.id} pkg={pkg} index={index} />
              ))}
            </div>
            
            <div className="mt-8 text-center md:hidden">
                <Link href="/packages" className="text-primary font-semibold">View all packages →</Link>
            </div>
          </div>
        </section>
      )}
    </>
  )
}