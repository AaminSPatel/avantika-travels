"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { FiChevronDown } from "react-icons/fi"
import PackageCard from "@/components/ui/package-card"
import { useSite } from "@/context/site-context"

export default function PackagesSection() {
  const { packages, siteData } = useSite()
  const [activeFilter, setActiveFilter] = useState("popular")

  const filteredPackages =
    activeFilter === "popular"
      ? [...packages].sort((a, b) => b.rating - a.rating)
      : [...packages].sort((a, b) => b.id - a.id)

  return (
    <section className="py-16 md:py-24 bg-muted">
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
              {siteData.region} Packages
            </motion.h2>
            <FiChevronDown className="w-5 h-5 text-foreground" />
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2">
            <button
              onClick={() => setActiveFilter("popular")}
              className={`px-6 py-2 rounded-full font-semibold transition-colors ${
                activeFilter === "popular" ? "bg-primary text-white" : "bg-white text-foreground hover:bg-gray-100"
              }`}
            >
              Popular
            </button>
            <button
              onClick={() => setActiveFilter("newest")}
              className={`px-6 py-2 rounded-full font-semibold transition-colors ${
                activeFilter === "newest" ? "bg-primary text-white" : "bg-white text-foreground hover:bg-gray-100"
              }`}
            >
              Newest
            </button>
          </div>
        </div>

        {/* Package Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {filteredPackages.slice(0, 8).map((pkg, index) => (
            <PackageCard key={pkg.id} pkg={pkg} index={index} />
          ))}
        </div>

        {/* Show More Button */}
        <div className="text-center">
          <Link
            href="/packages"
            className="inline-block bg-primary hover:bg-primary-dark text-white font-semibold px-8 py-3 rounded-full transition-colors"
          >
            Show more
          </Link>
        </div>
      </div>
    </section>
  )
}
