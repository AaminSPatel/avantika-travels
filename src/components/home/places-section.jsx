"use client"

import { motion } from "framer-motion"
import PlaceCard from "@/components/ui/place-card"
import { useSite } from "@/context/site-context"

export default function PlacesSection() {
  const { places } = useSite()

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-2xl md:text-3xl font-bold text-foreground mb-8"
        >
          Get Active Outdoors Or Try Something New
        </motion.h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Large featured place */}
          {places[0] && (
            <div className="col-span-2 row-span-2">
              <PlaceCard place={places[0]} index={0} variant="large" />
            </div>
          )}

          {/* Smaller place cards */}
          {places.slice(1).map((place, index) => (
            <PlaceCard key={place._id} place={place} index={index + 1} />
          ))}

          {/* Show All Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="relative rounded-2xl overflow-hidden h-48"
          >
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url('/placeholder.svg?height=300&width=400')`,
              }}
            />
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="text-center text-white">
                <p className="font-semibold text-lg">Show All</p>
                <p className="text-sm text-primary">+25 Places</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
