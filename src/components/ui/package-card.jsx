"use client"

import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { FiMapPin, FiClock, FiCalendar, FiTrendingDown } from "react-icons/fi"

export default function PackageCard({ pkg, index = 0 }) {
  // Helper to get min and max prices for group sizes
  const getPriceRange = () => {
    if (!pkg.personPricing || pkg.personPricing.length === 0) {
      return { min: pkg.price, max: pkg.price, hasDiscount: false }
    }

    const prices = pkg.personPricing.map(p => Number(p.price || pkg.price))
    const min = Math.min(...prices)
    const max = Math.max(...prices)
    const hasDiscount = min < max // If min and max differ, there's group discount

    return { min, max, hasDiscount }
  }

  const { min: minPrice, max: maxPrice, hasDiscount } = getPriceRange()
  const discountPercent = hasDiscount && maxPrice > 0 
    ? Math.round(((maxPrice - minPrice) / maxPrice) * 100)
    : 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group h-full"
    >
      <div className="relative rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full border border-gray-100">
        <Link href={`/packages/${pkg.slug}`} className="block">
          {/* Image Container */}
          <div className="relative h-48 overflow-hidden">
            <Image
              src={pkg.images[0]?.url || "/placeholder.svg"}
              alt={`${pkg.name} - ${pkg.duration} Tour Package to ${pkg.destination}, Madhya Pradesh | Avantika Travels`}
              fill
              quality={75}
              className="object-cover group-hover:scale-110 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            
            {/* Discount Badge */}
            {hasDiscount && discountPercent > 0 && (
              <div className="absolute top-3 right-3 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-md">
                <FiTrendingDown className="w-3 h-3" />
                Save {discountPercent}%
              </div>
            )}

            {/* Package Type Badge */}
            {pkg.category && (
              <div className="absolute top-3 left-3 capitalize bg-white/90 backdrop-blur-sm text-gray-800 text-xs font-semibold px-3 py-1 rounded-full">
                {pkg.category}
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-4 flex flex-col flex-1">
            {/* Duration & Destination */}
            <div className="flex items-center gap-2 text-xs text-gray-600 mb-2 min-h-[20px]">
              <FiClock className="w-3.5 h-3.5 flex-shrink-0 text-blue-600" />
              <span className="font-medium whitespace-nowrap">{pkg.duration}</span>
              <span className="text-gray-300">•</span>
              <FiMapPin className="w-3.5 h-3.5 flex-shrink-0 text-green-600" />
              <span className="font-medium line-clamp-1">{pkg.destination}</span>
            </div>

            {/* Package Name */}
            <h3 className={`font-bold text-foreground capitalize mb-2 line-clamp-2 group-hover:text-primary transition-colors text-base`}>
              {pkg.name}
            </h3>

            {/* Package Description */}
            {pkg.description && (
              <p className={`text-sm text-gray-500 mb-3 ${pkg.type == "personal" ? 'line-clamp-2': 'sm:line-clamp-5 line-clamp-2'}  leading-relaxed`}>
                {pkg.description}
              </p>
            )}

            {/* Per-Person Pricing Info */}
            {pkg.personPricing && pkg.personPricing.length > 0 && (
              <div className="mb-3 p-2 bg-blue-50 rounded-lg border border-blue-100">
                <p className="text-xs text-blue-700 font-semibold mb-1">Personal Group Pricing Available</p>
                <div className="flex items-center gap-1 text-xs text-gray-600">
                  <span>1 Person: ₹{(pkg.personPricing[0]?.price || pkg.price).toLocaleString()}</span>
                  <span className="text-gray-400">→</span>
                  <span>12 Persons: ₹{(pkg.personPricing[11]?.price || pkg.price).toLocaleString()}</span>
                </div>
              </div>
            )}

            {/* Price Section */}
            <div className="mt-auto">
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-primary font-bold text-xl">₹{minPrice.toLocaleString()}</span>
                {hasDiscount && maxPrice > minPrice && (
                  <span className="text-gray-400 text-sm line-through">
                    ₹{maxPrice.toLocaleString()}
                  </span>
                )}
                <span className="text-gray-600 text-xs">/person</span>
              </div>
              {hasDiscount && maxPrice > minPrice && (
                <p className="text-xs text-green-600 font-semibold">
                  Lowest group rate - book with friends!
                </p>
              )}
            </div>
          </div>
        </Link>

        {/* Book Now Button */}
        <div className="px-4 pb-4 pt-0">
          <Link 
            href={`/booking?packageId=${pkg._id}`}
            className="block"
            area-label={`Book ${pkg.name} Package`}
          >
            <button className="w-full bg-primary text-white py-2.5 px-4 rounded-lg font-semibold hover:bg-primary/90 transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              <FiCalendar className="w-4 h-4" />
              Book Now
            </button>
          </Link>
        </div>
      </div>
    </motion.div>
  )
}