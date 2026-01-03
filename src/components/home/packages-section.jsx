"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { FiChevronDown } from "react-icons/fi"
import PackageCard from "@/components/ui/package-card"
import { useSite } from "@/context/site-context"

export default function PackagesSection() {
  const { packages, siteData } = useSite()
  const [activeCategory, setActiveCategory] = useState("all")

  const tripCategories = [
    { id: "all", name: "All Packages" },
    { id: "holiday", name: "Holiday Packages" },
    { id: "adventure", name: "Adventure Trips" },
    { id: "honeymoon", name: "Honeymoon Tours" },
    { id: "pilgrimage", name: "Pilgrimage Tours" },
    { id: "family", name: "Family Vacations" },
    { id: "upcoming", name: "Upcoming Group Trips" },
  ]

  const filteredPackages = activeCategory === "all" 
    ? packages 
    : packages.filter(pkg => pkg.category === activeCategory)

  return (
    <section className="py-16 md:py-24 bg-muted lg:px-10 sm:px-2">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-2">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-2xl md:text-3xl font-bold text-foreground"
            >
              Explore Our Travel Packages
            </motion.h2>
            <FiChevronDown className="w-5 h-5 text-foreground" />
          </div>

          {/* Category Filter Tabs */}
          <div className="flex gap-3 flex-wrap overflow-x-auto pb-2">
            {tripCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-4 py-2 rounded-full font-semibold transition-colors whitespace-nowrap ${
                  activeCategory === category.id 
                    ? "bg-primary text-white" 
                    : "bg-white text-foreground hover:bg-gray-100"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Category Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-gray-600 mb-8 max-w-2xl"
        >
          Discover handcrafted experiences for every type of traveler. From thrilling adventures to relaxing getaways, 
          we create unforgettable journeys tailored to your preferences.
        </motion.p>

        {/* Package Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {filteredPackages.slice(0, 8).map((pkg, index) => (
            <PackageCard key={pkg._id} pkg={pkg} index={index} />
          ))}
        </div>

        {/* Empty State */}
        {filteredPackages.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No packages found for this category. Please check other categories.</p>
          </div>
        )}

        {/* Show More Button */}
        <div className="text-center">
          <Link
            href="/packages"
            className="inline-block bg-primary hover:bg-primary-dark text-white font-semibold px-8 py-3 rounded-full transition-colors"
          >
            View All Packages
          </Link>
        </div>
      </div>
    </section>
  )
}