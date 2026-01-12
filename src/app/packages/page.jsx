"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { FiFilter, FiX } from "react-icons/fi"
import PageHeader from "@/components/ui/page-header"
import PackageCard from "@/components/ui/package-card"
import Pagination from "@/components/ui/pagination"
import { useSite } from "@/context/site-context"
import Head from "next/head"



export default function PackagesPage() {
  const { packages, places, siteData } = useSite()
  const [selectedLocation, setSelectedLocation] = useState("all")
  const [selectedDuration, setSelectedDuration] = useState("all")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [showFilters, setShowFilters] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 12

  // Get unique categories from packages
  const uniqueCategories = [...new Set(packages.map(pkg => pkg.category).filter(Boolean))]

  const filteredPackages = packages.filter((pkg) => {
    const locationMatch =
      selectedLocation === "all" || pkg.location.toLowerCase().includes(selectedLocation.toLowerCase())
    const durationMatch = selectedDuration === "all" || pkg.duration.includes(selectedDuration)
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
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [selectedLocation, selectedDuration, selectedCategory])

  const durations = ["2 Days", "3 Days", "5 Days", "7 Days"]

  return (
    <>
      <Head>
        <title>Ujjain & Indore Tour Packages | Mahakal Darshan Booking</title>
        <meta name="description" content="Affordable pilgrimage and leisure packages. Get customized Ujjain-Indore-Omkareshwar tour itineraries from Avantika Travels." />
        <meta name="keywords" content="Ujjain tour packages, Mahakal Darshan booking, Indore holiday packages, Pilgrimage tours" />
        <meta property="og:title" content="Ujjain & Indore Tour Packages | Mahakal Darshan Booking" />
        <meta property="og:description" content="Affordable pilgrimage and leisure packages. Get customized Ujjain-Indore-Omkareshwar tour itineraries from Avantika Travels." />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/logo.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Ujjain & Indore Tour Packages - Avantika Travels" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Ujjain & Indore Tour Packages | Mahakal Darshan Booking" />
        <meta name="twitter:description" content="Affordable pilgrimage and leisure packages. Get customized Ujjain-Indore-Omkareshwar tour itineraries from Avantika Travels." />
        <meta name="twitter:image" content="/logo.png" />
        <meta name="robots" content="index, follow" />
        <meta name="revisit-after" content="7 days" />
        <meta name="language" content="en-IN" />
        <meta name="geo.region" content="IN-MP" />
        <link rel="canonical" href="https://avantikatravels.com/packages" />
      </Head>
      <PageHeader
        title="Tour Packages"
        subtitle={`Curated spiritual journeys and heritage tours across ${siteData.region}`}
        backgroundImage="/pik4.avif"
      />

      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          {/* Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="md:hidden flex items-center gap-2 px-4 py-2 bg-muted rounded-full font-medium"
              >
                <FiFilter className="w-4 h-4" />
                Filters
              </button>

              {/* Desktop Filters */}
              <div className="hidden md:flex items-center gap-6">
                <div className="flex items-center gap-3">
                  <span className="text-muted-foreground font-medium">Location:</span>
                  <button
                    onClick={() => setSelectedLocation("all")}
                    className={`px-4 py-2 rounded-full font-medium transition-colors ${
                      selectedLocation === "all" ? "bg-primary text-white" : "bg-muted text-foreground hover:bg-gray-200"
                    }`}
                  >
                    All
                  </button>
                  {places.map((place) => (
                    <button
                      key={place.id}
                      onClick={() => setSelectedLocation(place.name)}
                      className={`px-4 py-2 rounded-full font-medium transition-colors ${
                        selectedLocation === place.name
                          ? "bg-primary text-white"
                          : "bg-muted text-foreground hover:bg-gray-200"
                      }`}
                    >
                      {place.name}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-muted-foreground font-medium">Category:</span>
                  <button
                    onClick={() => setSelectedCategory("all")}
                    className={`px-4 py-2 rounded-full font-medium transition-colors ${
                      selectedCategory === "all" ? "bg-primary text-white" : "bg-muted text-foreground hover:bg-gray-200"
                    }`}
                  >
                    All
                  </button>
                  {uniqueCategories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-4 py-2 rounded-full font-medium transition-colors ${
                        selectedCategory === category
                          ? "bg-primary text-white"
                          : "bg-muted text-foreground hover:bg-gray-200"
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <p className="text-muted-foreground">
              Showing <span className="text-foreground font-semibold">{filteredPackages.length}</span> packages
            </p>
          </div>

          {/* Mobile Filters */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden mb-8 p-4 bg-muted rounded-2xl"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Filters</h3>
                <button onClick={() => setShowFilters(false)}>
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium mb-2">Location</p>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setSelectedLocation("all")}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                        selectedLocation === "all" ? "bg-primary text-white" : "bg-white text-foreground"
                      }`}
                    >
                      All
                    </button>
                    {places.map((place) => (
                      <button
                        key={place.id}
                        onClick={() => setSelectedLocation(place.name)}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                          selectedLocation === place.name ? "bg-primary text-white" : "bg-white text-foreground"
                        }`}
                      >
                        {place.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium mb-2">Duration</p>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setSelectedDuration("all")}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                        selectedDuration === "all" ? "bg-primary text-white" : "bg-white text-foreground"
                      }`}
                    >
                      All
                    </button>
                    {durations.map((duration) => (
                      <button
                        key={duration}
                        onClick={() => setSelectedDuration(duration.split(" ")[0])}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                          selectedDuration === duration.split(" ")[0]
                            ? "bg-primary text-white"
                            : "bg-white text-foreground"
                        }`}
                      >
                        {duration}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium mb-2">Category</p>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setSelectedCategory("all")}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                        selectedCategory === "all" ? "bg-primary text-white" : "bg-white text-foreground"
                      }`}
                    >
                      All
                    </button>
                    {uniqueCategories.map((category) => (
                      <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                          selectedCategory === category ? "bg-primary text-white" : "bg-white text-foreground"
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Package Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {paginatedPackages.map((pkg, index) => (
              <PackageCard key={pkg._id} pkg={pkg} index={index} />
            ))}
          </div>

          {/* Pagination */}
          {totalItems > itemsPerPage && (
            <Pagination
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
              currentPage={currentPage}
              onPageChange={handlePageChange}
            />
          )}

          {filteredPackages.length === 0 && (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg">No packages found matching your criteria.</p>
              <button
                onClick={() => {
                  setSelectedLocation("all")
                  setSelectedDuration("all")
                  setSelectedCategory("all")
                }}
                className="mt-4 text-primary font-semibold hover:underline"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
