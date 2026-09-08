"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { FiFilter, FiX, FiCheck, FiInfo, FiPhone, FiMessageCircle, FiArrowRight } from "react-icons/fi"
import PageHeader from "@/components/ui/page-header"
import PackageCard from "@/components/ui/package-card"
import Pagination from "@/components/ui/pagination"
import { useSite } from "@/context/site-context"
import Head from "next/head"
import Link from "next/link"
import { FaWhatsapp } from "react-icons/fa"

export default function PackagesPage() {
  const { packages, places, siteData } = useSite()
  const [selectedLocation, setSelectedLocation] = useState("all")
  const [selectedDuration, setSelectedDuration] = useState("all")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [showFilters, setShowFilters] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 12

  // JSON-LD Schema
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": packages.slice(0, 10).map((pkg, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "Product",
        "name": pkg.title,
        "description": pkg.description,
        "offers": {
          "@type": "Offer",
          "priceCurrency": "INR",
          "price": pkg.price || "1000"
        }
      }
    }))
  }

  // Categories logic
  const uniqueCategories = [...new Set(packages.map(pkg => pkg.category).filter(Boolean))]

  const filteredPackages = packages.filter((pkg) => {
    const locationMatch =
      selectedLocation === "all" || pkg.location?.toLowerCase().includes(selectedLocation.toLowerCase()) || pkg.destination?.toLowerCase().includes(selectedLocation.toLowerCase())
    const durationMatch = selectedDuration === "all" || pkg.duration?.includes(selectedDuration)
    const categoryMatch = selectedCategory === "all" || pkg.category === selectedCategory
    return locationMatch && durationMatch && categoryMatch
  })

  // Pagination logic
  const totalItems = filteredPackages.length
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedPackages = filteredPackages.slice(startIndex, endIndex)

  const handlePageChange = (page) => {
    setCurrentPage(page)
    const element = document.getElementById('package-grid-start');
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  }

  useEffect(() => {
    setCurrentPage(1)
  }, [selectedLocation, selectedDuration, selectedCategory])

  const durations = ["1 Day", "2 Days", "3 Days", "4 Days", "5 Days", "7 Days"]

  return (
    <>
      <Head>
        <title>Best Ujjain Tour Packages 2026 | Mahakal Darshan & Indore Taxi</title>
        <meta name="description" content="Book affordable Ujjain tour packages, Omkareshwar yatra, and Indore to Ujjain taxi services. Compare prices for family, couple & group trips." />
        <meta name="keywords" content="Ujjain Tour Packages, Mahakal Darshan Booking, Indore to Ujjain Taxi Fare, Omkareshwar Trip Cost, Ujjain Tourism, MP Travel Agency" />
        <link rel="canonical" href="https://avantikatravels.com/packages" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </Head>

      <PageHeader
        title="Ujjain & MP Tour Packages"
        subtitle="Affordable Mahakal Darshan, Omkareshwar Yatra & Indore Taxi Services tailored for you."
        backgroundImage="/omkareshwar2.jpeg"
      />

      <main className="bg-gray-50">
        
        {/* Intro SEO Text */}
        <section className="bg-white border-b border-gray-200 py-8 hidden md:block">
          <div className="container mx-auto px-4 text-center max-w-4xl">
             <h2 className="text-2xl font-semibold text-gray-800 mb-2">Plan Your Spiritual Journey with Avantika Travels</h2>
             <p className="text-gray-600">
               Looking for the <strong>best Ujjain tour packages</strong>? Whether you need a quick <strong>1-day Mahakal darshan</strong> or a complete <strong>Indore-Ujjain-Omkareshwar itinerary</strong>, we offer the best rates. 
             </p>
          </div>
        </section>

        <section id="package-grid-start" className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            
            {/* Filter Bar (Same as before) */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8 bg-white p-4 rounded-xl shadow-sm border border-gray-100 sticky top-20 z-20 md:static">
              {/* ... Filters Logic kept same for brevity ... */}
               <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-start">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="md:hidden flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-full font-medium shadow-md"
                >
                  <FiFilter className="w-4 h-4" />
                  Filters
                </button>
                <span className="md:hidden text-sm text-gray-500 font-medium">{filteredPackages.length} Packages</span>

                <div className="hidden md:flex items-center gap-6">
                  <div className="flex items-center gap-3">
                    <span className="text-gray-500 font-medium text-sm uppercase tracking-wide">Destination:</span>
                    <div className="flex gap-2">
                        <button onClick={() => setSelectedLocation("all")} className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${selectedLocation === "all" ? "bg-primary/10 text-primary" : "text-gray-600 hover:bg-gray-100"}`}>All</button>
                        {places.slice(0, 4).map((place, pIdx) => (
                        <button key={place._id || place.id || place.name || pIdx} onClick={() => setSelectedLocation(place.name)} className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${selectedLocation === place.name ? "bg-primary/10 text-primary" : "text-gray-600 hover:bg-gray-100"}`}>{place.name}</button>
                        ))}
                    </div>
                  </div>
                  <div className="h-6 w-px bg-gray-300"></div>
                  <div className="flex items-center gap-3">
                    <span className="text-gray-500 font-medium text-sm uppercase tracking-wide">Type:</span>
                     <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="bg-transparent font-medium text-gray-700 focus:outline-none cursor-pointer hover:text-primary">
                        <option value="all">All Categories</option>
                        {uniqueCategories.map((cat, cIdx) => <option key={cat || cIdx} value={cat}>{cat}</option>)}
                     </select>
                  </div>
                </div>
              </div>
              <p className="hidden md:block text-gray-500 text-sm">Showing <span className="text-gray-900 font-bold">{filteredPackages.length}</span> results</p>
            </div>

            {/* Mobile Filters Drawer */}
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="md:hidden mb-8 p-6 bg-white rounded-2xl shadow-lg border border-gray-100"
              >
                 <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold text-lg text-gray-900">Filter Packages</h3>
                  <button onClick={() => setShowFilters(false)} className="p-2 bg-gray-100 rounded-full"><FiX className="w-5 h-5" /></button>
                </div>
                <div className="space-y-6">
                  <div>
                    <p className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wider">Duration</p>
                    <div className="flex flex-wrap gap-2">
                      <button onClick={() => setSelectedDuration("all")} className={`px-4 py-2 rounded-lg text-sm transition-colors ${selectedDuration === "all" ? "bg-primary text-white" : "bg-gray-100 text-gray-700"}`}>All</button>
                      {durations.map((duration) => (
                        <button key={duration} onClick={() => setSelectedDuration(duration)} className={`px-4 py-2 rounded-lg text-sm transition-colors ${selectedDuration === duration ? "bg-primary text-white" : "bg-gray-100 text-gray-700"}`}>{duration}</button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Package Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 min-h-[400px]">
              {paginatedPackages.map((pkg, index) => (
                <PackageCard key={pkg._id || pkg.slug || index} pkg={pkg} index={index} />
              ))}
            </div>

             {/* Empty State */}
             {filteredPackages.length === 0 && (
              <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300 mt-6">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FiInfo className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No packages found</h3>
                <p className="text-gray-500 mb-6">Try adjusting your filters to find what you're looking for.</p>
                <button onClick={() => { setSelectedLocation("all"); setSelectedDuration("all"); setSelectedCategory("all") }} className="text-primary font-semibold hover:underline">Clear all filters</button>
              </div>
            )}

            {/* Pagination */}
            {totalItems > itemsPerPage && (
              <div className="mt-12">
                <Pagination totalItems={totalItems} itemsPerPage={itemsPerPage} currentPage={currentPage} onPageChange={handlePageChange} />
              </div>
            )}
          </div>
        </section>

        {/* --- DYNAMIC RESPONSIVE TABLE SECTION --- */}
        {paginatedPackages.length > 0 && (
            <section className="bg-white py-12 border-t border-gray-200">
                <div className="container mx-auto px-4">
                    <div className="mb-6 md:mb-8 text-center md:text-left">
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                             Compare Packages
                        </h2>
                        <p className="text-gray-600 text-sm md:text-base">
                            Quickly compare prices and features of top packages.
                        </p>
                    </div>
                    
                    {/* Mobile Scroll Hint */}
                    <div className="md:hidden flex items-center justify-center gap-2 text-xs text-gray-500 mb-2 animate-pulse">
                        <span>← Swipe left to view table →</span>
                    </div>

                    {/* Table Container with Overflow and Min-Width */}
                    <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm custom-scrollbar pb-2">
                        <table className="w-full text-left border-collapse min-w-[800px]">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-200">
                                    <th className="p-4 font-semibold text-gray-700 text-sm uppercase tracking-wider sticky left-0 bg-gray-50 z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">Package Name</th>
                                    <th className="p-4 font-semibold text-gray-700 text-sm uppercase tracking-wider">Duration</th>
                                    <th className="p-4 font-semibold text-gray-700 text-sm uppercase tracking-wider">Destinations</th>
                                    <th className="p-4 font-semibold text-gray-700 text-sm uppercase tracking-wider">Category</th>
                                    <th className="p-4 font-semibold text-gray-700 text-sm uppercase tracking-wider text-right">Details</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {paginatedPackages.map((pkg, index) => (
                                    <tr key={`table-${pkg._id || pkg.slug || index}`} className="hover:bg-blue-50/50 transition-colors group">
                                        <td className="p-4 font-medium text-gray-900 sticky left-0 bg-white group-hover:bg-blue-50/50 z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                                            {pkg.name}
                                        </td>
                                        <td className="p-4 text-gray-600 whitespace-nowrap">{pkg.duration}</td>
                                        <td className="p-4 text-gray-600 text-sm overflow-hidden">
                                            {pkg.destination || "Ujjain"}
                                        </td>
                                        <td className="p-4">
                                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
                                                {pkg.category || "Standard"}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <Link href={`/packages/${pkg.slug}`} area-label={`Book ${pkg.name} Package`} className="text-primary font-bold text-sm hover:underline flex items-center justify-end gap-1">
                                                View <FiArrowRight />
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>
        )}

        {/* --- DEEP SEO CONTENT BLOCK --- */}
        <article className="bg-gray-50 py-16 border-t border-gray-200">
            <div className="container mx-auto px-4 max-w-5xl">
                <header className="mb-10 text-center">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Complete Guide to Ujjain & Omkareshwar Tourism</h2>
                </header>
                <div className="grid md:grid-cols-2 gap-12 text-gray-600 leading-relaxed">
                    <section>
                        <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                             <FiCheck className="text-primary" /> Why Book Ujjain Tour Packages?
                        </h3>
                        <p className="mb-6">
                            Ujjain, the city of Mahakal, is a divine destination for millions. Booking a professional <strong>Ujjain tour package</strong> ensures you don't miss out on important rituals like the <em>Bhasma Aarti</em>. At Avantika Travels, we specialize in customizing trips that cover <strong>Mahakaleshwar</strong>, <strong>Kaal Bhairav</strong>, and the newly built <strong>Mahakal Lok Corridor</strong>.
                        </p>
                    </section>
                    <section>
                        <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                             <FiCheck className="text-primary" /> Omkareshwar & Mamleshwar Add-ons
                        </h3>
                        <p className="mb-6">
                            A trip to Ujjain is often incomplete without visiting the <strong>Omkareshwar Jyotirlinga</strong>. Located about 140km from Ujjain. Our <strong>Ujjain to Omkareshwar tour packages</strong> allow you to complete both Jyotirlinga darshans comfortably.
                        </p>
                    </section>
                    <section>
                      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                 <Link
                    href={`tel:${siteData.contactInfo?.phone || '+91 8720006707'}`}
                    className="flex items-center gap-2 bg-primary text-white font-bold px-4 py-2 rounded-full shadow-lg hover:text-primary hover:bg-gray-100 hover:scale-105 transition-all text-lg"
                 >
                    <FiPhone className="w-5 h-5" />
                    Get Free Consultation
                 </Link>

                 <a
                    href={`https://wa.me/${siteData.contactInfo?.phone || '+91 8720006707'}?text=Hi, I need a custom package for Ujjain.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-white text-primary font-bold px-4 py-2 rounded-full shadow-lg hover:bg-green-600 hover:scale-105 transition-all text-lg"
                 >
                    <FaWhatsapp className="w-5 h-5 text-green-500 font-extrabold" />
                    Chat on WhatsApp
                 </a>
              </div>
              <p className="mt-6 text-sm text-blue-700 opacity-80">
                 Trusted by 5000+ Yatris • 24/7 Support during Trip
              </p>
                    </section>
                </div>
            </div>
        </article>
      </main>
    </>
  )
}