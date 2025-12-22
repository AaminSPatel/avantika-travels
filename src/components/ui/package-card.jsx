"use client"

import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { FiStar, FiMapPin, FiClock, FiArrowRight } from "react-icons/fi"

export default function PackageCard({ pkg, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group"
    >
      <Link href={`/packages/${pkg.slug}`}>
        <div className="relative rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-xl transition-all duration-300">
          {/* Image */}
          <div className="relative h-52 overflow-hidden">
            <Image
              src={pkg.image || "/placeholder.svg"}
              alt={pkg.name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
            />
            {pkg.discount > 0 && (
              <div className="absolute top-3 right-3 bg-primary text-white text-xs font-bold px-2 py-1 rounded-full">
                -{pkg.discount}%
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <FiClock className="w-4 h-4" />
              <span>{pkg.duration}</span>
              <span className="mx-1">·</span>
              <FiMapPin className="w-4 h-4" />
              <span>{pkg.location}</span>
            </div>

            <h3 className="font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
              {pkg.name}
            </h3>

            <div className="flex items-center gap-1 mb-3">
              <FiStar className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              <span className="font-semibold text-foreground">{pkg.rating}</span>
              <span className="text-muted-foreground text-sm">({pkg.reviews})</span>
            </div>

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
        </div>
      </Link>
    </motion.div>
  )
}
