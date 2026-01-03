"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { FiChevronDown, FiSearch } from "react-icons/fi"
import { BsMouse } from "react-icons/bs"
import { useSite } from "@/context/site-context"

export default function HeroSection() {
  const { siteData, places,packages } = useSite()
  const [selectedRegion, setSelectedRegion] = useState("")
  const [selectedTripType, setSelectedTripType] = useState("")
  const [isDestinationOpen, setIsDestinationOpen] = useState(false)
  const [isTripTypeOpen, setIsTripTypeOpen] = useState(false)

  const tripTypes = [
    "Holiday Packages",
    "Adventure Trips",
    "Honeymoon Tours",
    "Pilgrimage Tours",
    "Family Vacations",
    "Weekend Getaways"
  ]

  return (
    <section className="relative min-h-[85vh] flex items-center">
      {/* Background Image - Change to more general travel image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/bg2.jpg')`, // Change to generic travel image
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10 mt-6">
        <div className="max-w-3xl">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6"
          >
            <span className="bold">Discover Your</span> <span className="text-primary">Perfect Journey</span>
            <br />
            <span className="">Explore India & Beyond</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg md:text-xl text-white/90 mb-8"
          >
            Holiday Packages • Adventure Trips • Honeymoon Tours • Pilgrimage Experiences
          </motion.p>

          {/* Enhanced Search Bar with Trip Type Filter */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-3"
          >
            {/* Trip Type Filter */}
            <div className="relative flex-1">
              <button
                onClick={() => setIsTripTypeOpen(!isTripTypeOpen)}
                className="w-full bg-white rounded-full py-4 px-6 flex items-center justify-between text-left"
              >
                <span className={selectedTripType ? "text-foreground" : "text-muted-foreground"}>
                  {selectedTripType || "Select trip type"}
                </span>
                <FiChevronDown
                  className={`w-5 h-5 text-muted-foreground transition-transform ${isTripTypeOpen ? "rotate-180" : ""}`}
                />
              </button>

              {isTripTypeOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl overflow-hidden z-30">
                  {tripTypes.map((type) => (
                    <button
                      key={type}
                      onClick={() => {
                        setSelectedTripType(type)
                        setIsTripTypeOpen(false)
                      }}
                      className="w-full px-6 py-3 text-left hover:bg-muted transition-colors"
                    >
                      {type}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Destination Filter */}
            <div className="relative flex-1">
              <button
                onClick={() => setIsDestinationOpen(!isDestinationOpen)}
                className="w-full bg-white rounded-full py-4 px-6 flex items-center justify-between text-left"
              >
                <span className={selectedRegion ? "text-foreground" : "text-muted-foreground"}>
                  {selectedRegion || "Select destination"}
                </span>
                <FiChevronDown
                  className={`w-5 h-5 text-muted-foreground transition-transform ${isDestinationOpen ? "rotate-180" : ""}`}
                />
              </button>

              {isDestinationOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl overflow-hidden z-20">
                  {places.map((place) => (
                    <button
                      key={place._id}
                      onClick={() => {
                        setSelectedRegion(place.name)
                        setIsDestinationOpen(false)
                      }}
                      className="w-full px-6 py-3 text-left hover:bg-muted transition-colors"
                    >
                      {place.location}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button className="bg-primary hover:bg-primary-dark text-white font-semibold px-8 py-4 rounded-full transition-colors flex items-center justify-center gap-2">
              <FiSearch className="w-5 h-5" />
              Search Tours
            </button>
          </motion.div>

          {/* Quick Trip Type Icons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-wrap gap-3 my-3"
          >
            {tripTypes.slice(0, 4).map((type) => (
              <button
                key={type}
                onClick={() => setSelectedTripType(type)}
                className="bg-white/20 backdrop-blur-sm text-white sm:px-4 sm:py-2 px-2 py-1 rounded-full hover:bg-white/30 transition-colors"
              >
                {type}
              </button>
            ))}
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
        {/* <BsMouse className="w-6 h-6" /> */}
       {/*  <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}
          className="w-0.5 h-8 bg-white/50 rounded-full"
        /> */}
      </motion.div>
    </section>
  )
}