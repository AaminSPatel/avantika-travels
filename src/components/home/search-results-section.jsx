"use client"

import { useState, useEffect, useMemo } from "react"
import { motion } from "framer-motion"
import { FiSearch, FiX, FiFilter } from "react-icons/fi"
import PackageCard from "@/components/ui/package-card"
import { useSite } from "@/context/site-context"

export default function SearchResultsSection({ selectedTripType, selectedRegion, onClearSearch }) {
  const { packages } = useSite()
  const [filteredPackages, setFilteredPackages] = useState([])
  const [isVisible, setIsVisible] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState("All Categories")
  const [showCategoryFilter, setShowCategoryFilter] = useState(false)
  const [hasInitialSearch, setHasInitialSearch] = useState(false)

  // Extract unique categories from packages
  const uniqueCategories = useMemo(() => {
    if (!packages || packages.length === 0) return []
    
    const categories = packages
      .map(pkg => pkg.category)
      .filter(Boolean)
      .map(category => 
        category
          .split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ')
      )
    
    return ["All Categories", ...new Set(categories)]
  }, [packages])

  // Initial visibility setup (only based on search)
  useEffect(() => {
    if (selectedRegion && !hasInitialSearch) {
      setIsVisible(true)
      setHasInitialSearch(true)
    }
  }, [selectedRegion, hasInitialSearch])

  // Filter packages
  useEffect(() => {
    let filtered = packages

    // Filter by region/destination
    if (selectedRegion) {
      filtered = filtered.filter(pkg =>
        pkg.destination?.toLowerCase().includes(selectedRegion.toLowerCase()) ||
        pkg.location?.toLowerCase().includes(selectedRegion.toLowerCase()) ||
        pkg.title?.toLowerCase().includes(selectedRegion.toLowerCase())
      )
    }

    // Filter by category if selected
    if (selectedCategory && selectedCategory !== "All Categories") {
      filtered = filtered.filter(pkg => {
        const packageCategory = pkg.category
          ?.split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ')
        return packageCategory === selectedCategory
      })
    }

    setFilteredPackages(filtered)
    
    // Section visible rahega jab:
    // 1. Search kiya gaya ho (hasInitialSearch true ho)
    // 2. Category filter change hone par bhi visible rahe
    if (hasInitialSearch) {
      setIsVisible(true)
    }
  }, [selectedRegion, selectedCategory, packages, hasInitialSearch])

  const handleCategorySelect = (category) => {
    setSelectedCategory(category)
    setShowCategoryFilter(false)
  }

  const handleCloseSection = () => {
    setIsVisible(false)
    setHasInitialSearch(false)
    onClearSearch()
  }

  if (!isVisible) {
    return null
  }

  return (
    <section className="py-12 bg-gradient-to-br from-blue-50 via-white to-purple-50 relative">
      {/* Close Button - Top Right Corner */}
      <button
        onClick={handleCloseSection}
        className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-100 transition-colors group"
        aria-label="Close search results"
      >
        <FiX className="w-5 h-5 text-gray-600 group-hover:text-gray-800" />
      </button>

      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <FiSearch className="w-6 h-6 text-primary" />
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              Search Results
            </h2>
          </div>

          {/* Search Criteria and Filter */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
            {/* Search Criteria */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              {selectedRegion && (
                <span className="bg-primary text-white px-4 py-2 rounded-full text-sm">
                  Destination: {selectedRegion}
                </span>
              )}
              {selectedCategory && selectedCategory !== "All Categories" && (
                <span className="bg-secondary text-white px-4 py-2 rounded-full text-sm">
                  Category: {selectedCategory}
                </span>
              )}
            </div>

            {/* Category Filter Button */}
            <div className="relative">
              <button
                onClick={() => setShowCategoryFilter(!showCategoryFilter)}
                className="flex items-center gap-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-full text-sm transition-colors shadow-sm"
              >
                <FiFilter className="w-4 h-4" />
                Filter by Category
                {selectedCategory && selectedCategory !== "All Categories" && (
                  <span className="bg-primary text-white w-5 h-5 rounded-full text-xs flex items-center justify-center">
                    1
                  </span>
                )}
              </button>

              {/* Category Filter Dropdown */}
              {showCategoryFilter && uniqueCategories.length > 0 && (
                <div className="absolute top-full left-0 sm:left-auto sm:right-0 mt-2 bg-white rounded-xl shadow-lg overflow-hidden z-30 min-w-[200px] max-h-60 overflow-y-auto border border-gray-200">
                  {uniqueCategories.map((category) => (
                    <button
                      key={category}
                      onClick={() => handleCategorySelect(category)}
                      className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 ${
                        selectedCategory === category ? "bg-primary/10 text-primary font-medium" : ""
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Results Count */}
          <p className="text-muted-foreground">
            {filteredPackages.length > 0 ? (
              <>
                Found {filteredPackages.length} package{filteredPackages.length !== 1 ? 's' : ''} 
                {selectedCategory && selectedCategory !== "All Categories" ? ` in ${selectedCategory}` : ''}
              </>
            ) : selectedCategory !== "All Categories" ? (
              "No packages found in this category"
            ) : (
              "No packages found for your search"
            )}
          </p>
        </motion.div>

        {/* Category Quick Filter Chips */}
        {uniqueCategories.length > 1 && filteredPackages.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-wrap gap-2 mb-8 justify-center"
          >
            {uniqueCategories.slice(0, 6).map((category) => (
              <button
                key={category}
                onClick={() => handleCategorySelect(category)}
                className={`px-4 py-2 rounded-full text-sm transition-all ${
                  selectedCategory === category
                    ? "bg-primary text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                {category}
              </button>
            ))}
          </motion.div>
        )}

        {/* Package Grid OR Empty State */}
        {filteredPackages.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {filteredPackages.map((pkg, index) => (
              <PackageCard key={pkg._id} pkg={pkg} index={index} />
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-200"
          >
            {selectedCategory !== "All Categories" ? (
              <>
                <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <FiX className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  No Packages in {selectedCategory}
                </h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  We couldn't find any packages in the {selectedCategory} category 
                  {selectedRegion ? ` for "${selectedRegion}"` : ''}. 
                  Try selecting a different category or destination.
                </p>
                
                {/* Try Other Categories */}
                <div className="flex flex-wrap gap-2 justify-center mb-6">
                  {uniqueCategories
                    .filter(cat => cat !== selectedCategory && cat !== "All Categories")
                    .slice(0, 4)
                    .map((category) => (
                      <button
                        key={category}
                        onClick={() => handleCategorySelect(category)}
                        className="bg-primary/10 hover:bg-primary/20 text-primary px-4 py-2 rounded-full text-sm transition-colors"
                      >
                        Try {category}
                      </button>
                    ))}
                </div>
              </>
            ) : (
              <>
                <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <FiSearch className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  No Packages Found
                </h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  We couldn't find any packages matching your search criteria.
                  Try searching for a different destination or browse our popular categories.
                </p>
              </>
            )}
            
            <button
              onClick={() => {
                setSelectedCategory("All Categories")
                if (uniqueCategories.length > 0) {
                  handleCategorySelect("All Categories")
                }
              }}
              className="inline-flex items-center gap-2 bg-primary text-white hover:bg-primary-dark px-6 py-3 rounded-full font-medium transition-colors"
            >
              View All Packages
            </button>
          </motion.div>
        )}
      </div>
    </section>
  )
}