"use client"

import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import { FiSearch } from "react-icons/fi"
import Image from "next/image"
import { useSite } from "@/context/site-context"

export default function HeroSection({
  selectedTripType,
  setSelectedTripType,
  selectedRegion,
  setSelectedRegion,
  onSearch,
}) {
  const { siteData, places, packages } = useSite()
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearchClick = () => {
    // Agar search query hai to use region mein set karo
    if (searchQuery.trim()) {
      setSelectedRegion(searchQuery.trim())
    }
    
    if (onSearch) {
      onSearch()
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearchClick()
    }
  }

  return (
    <section className="relative py-8 flex items-center">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={siteData.heroImage}
          alt="Avantika Travels - Mahakal Mandir Tours & Ujjain Pilgrimage"
          fill
          priority
          quality={90}
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/60 to-black/40" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10  ">
        <div className="max-w-3xl">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6"
          >
            {/* <span className="bold">Discover Your</span> <span className="text-primar">Perfect Journey</span> */}
            
            <span className=""> Explore India & Beyond with </span><span className="bold text-5xl  md:text-6xl lg:text-7xl  text-primary">Avantika Travels</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg md:text-xl text-white/90 mb-8"
          >
            Experience the divine beauty of Madhya Pradesh and Discover amazing travel packages for your spiritual journey
          </motion.p>

          {/* Search Input Bar */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-3"
          >
            {/* Search Input */}
            <div className="relative flex-1">
              <div className="relative">
                <FiSearch className="absolute left-6 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Search for destinations, packages..."
                  className="w-full bg-white rounded-full py-4 pl-14 pr-6 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            {/* Search Button */}
            <button 
              onClick={handleSearchClick}
              disabled={!searchQuery.trim()}
              className={`bg-primary text-white font-semibold px-8 py-4 rounded-full transition-colors flex items-center justify-center gap-2 ${
                !searchQuery.trim() 
                  ? "opacity-80 cursor-not-allowed" 
                  : "hover:bg-primary-dark"
              }`}
            >
              <FiSearch className="w-5 h-5" />
              Search Tours
            </button>
          </motion.div>

          {/* Popular Destinations Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-wrap sm:gap-3 gap-2 mt-4"
          >
            {["Indore", "Ujjain", "Omkareshwar", "Dewas", "Gwalior", "Rajsthan"].map((dest) => (
              <button
                key={dest}
                onClick={() => {
                  setSearchQuery(dest)
                  setSelectedRegion(dest)
                  onSearch()
                }}
                className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 sm:px-4 sm:py-2 rounded-full hover:bg-white/30 transition-colors"
              >
                {dest}
              </button>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}