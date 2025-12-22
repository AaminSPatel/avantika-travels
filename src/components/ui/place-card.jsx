"use client"

import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { FiArrowRight } from "react-icons/fi"

export default function PlaceCard({ place, index = 0, variant = "default" }) {
  const isLarge = variant === "large"

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`group relative ${isLarge ? "col-span-2 row-span-2" : ""}`}
    >
      <Link href={`/places/${place.slug}`}>
        <div className={`relative rounded-2xl overflow-hidden ${isLarge ? "h-[420px]" : "h-48"}`}>
          <Image
            src={place.image || "/placeholder.svg"}
            alt={place.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

          <div className="absolute bottom-0 left-0 right-0 p-4">
            <div className="flex items-end justify-between">
              <div>
                <h3 className={`font-semibold text-white ${isLarge ? "text-2xl" : "text-lg"}`}>{place.name}</h3>
                <p className="text-primary text-sm font-medium">{place.events} events</p>
              </div>
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center group-hover:bg-white transition-colors">
                <FiArrowRight className="w-4 h-4 text-white group-hover:text-primary transition-colors" />
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
