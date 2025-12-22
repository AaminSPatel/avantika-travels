"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { FiChevronDown, FiSearch } from "react-icons/fi"
import { BsMouse } from "react-icons/bs"
import { useSite } from "@/context/site-context"

export default function HeroSection() {
  const { siteData, places } = useSite()
  const [selectedRegion, setSelectedRegion] = useState("")
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  return (
    <section className="relative min-h-[85vh] flex items-center">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/pik1.avif')`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-2xl">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6"
          >
            <span className="italic">Bring more</span> <span className="text-primary">divine</span>
            <br />
            <span className="italic">to your journey</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg md:text-xl text-white/90 mb-8"
          >
            Find and book the best spiritual experiences and pilgrimage tours in {siteData.region}.
          </motion.p>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-3"
          >
            <div className="relative flex-1">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full bg-white rounded-full py-4 px-6 flex items-center justify-between text-left"
              >
                <span className={selectedRegion ? "text-foreground" : "text-muted-foreground"}>
                  {selectedRegion || "Select destination"}
                </span>
                <FiChevronDown
                  className={`w-5 h-5 text-muted-foreground transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
                />
              </button>

              {isDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl overflow-hidden z-20">
                  {places.map((place) => (
                    <button
                      key={place.id}
                      onClick={() => {
                        setSelectedRegion(place.name)
                        setIsDropdownOpen(false)
                      }}
                      className="w-full px-6 py-3 text-left hover:bg-muted transition-colors"
                    >
                      {place.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button className="bg-primary hover:bg-primary-dark text-white font-semibold px-8 py-4 rounded-full transition-colors flex items-center justify-center gap-2">
              <FiSearch className="w-5 h-5" />
              Search all
            </button>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/70"
      >
        <BsMouse className="w-6 h-6" />
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}
          className="w-0.5 h-8 bg-white/50 rounded-full"
        />
      </motion.div>
    </section>
  )
}
