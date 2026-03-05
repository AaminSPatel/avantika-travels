"use client"

import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import {  FiMapPin, FiClock, FiArrowRight, FiCalendar } from "react-icons/fi"

export default function PackageCard({ pkg, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group"
    >
        <div className="relative rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full">
      <Link href={`/packages/${pkg.slug}`}>
          {/* Image */}
          <div className="relative h-52 overflow-hidden">
            <Image
              src={pkg.images[0]?.url || "/placeholder.svg"}
              alt={`${pkg.name} - ${pkg.duration} Tour Package to ${pkg.destination}, Madhya Pradesh | Avantika Travels`}
              fill
              priority={index < 3}
              quality={75}
              className="object-cover group-hover:scale-110 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            {pkg.discount > 0 && (
              <div className="absolute top-3 right-3 bg-primary text-white text-xs font-bold px-2 py-1 rounded-full">
                -{pkg.discount}%
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-4 flex-1 flex flex-col">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <FiClock className="w-4 h-4" />
              <span>{pkg.duration}</span>
              <span className="mx-1">·</span>
              <FiMapPin className="w-4 h-4" />
              <span>{pkg.destination}</span>
            </div>

            <h3 className="font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors sm:min-h-12 min-h-6">
              {pkg.name}
            </h3>

            <div className="flex items-center justify-between">
              <div>
                <span className="text-primary font-bold text-lg">₹{pkg.price.toLocaleString()}</span>
                {pkg.originalPrice > pkg.price && (
                  <span className="text-muted-foreground text-sm line-through ml-2">
                    ₹{pkg.originalPrice.toLocaleString()}
                  </span>
                )}
                <span className="text-muted-foreground text-sm"> per person</span>
              </div>
              <FiArrowRight className="w-5 h-5 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
      </Link>
      {/* Book Now Button - Outside the Link to prevent nesting issues */}
      <Link 
        href={`/booking?packageId=${pkg._id}`}
        className="mt-3 w-full block"
      >
        <button className="w-full bg-primary text-white py-2.5 px-4 rounded-lg font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
          <FiCalendar className="w-4 h-4" />
          Book Now
        </button>
      </Link>
        </div>

    </motion.div>
  )
}
