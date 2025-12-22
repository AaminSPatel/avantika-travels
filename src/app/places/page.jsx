"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { FiArrowRight, FiMapPin } from "react-icons/fi"
import PageHeader from "@/components/ui/page-header"
import { useSite } from "@/context/site-context"

export default function PlacesPage() {
  const { places, siteData } = useSite()

  return (
    <>
      <PageHeader
        title="Explore Destinations"
        subtitle={`Discover the divine beauty and cultural heritage of ${siteData.region}`}
        backgroundImage="/ujjain-mahakal-temple-ancient-city.jpg"
      />

      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {places.map((place, index) => (
              <motion.article
                key={place.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group"
              >
                <Link href={`/places/${place.slug}`}>
                  <div className="relative rounded-2xl overflow-hidden bg-white shadow-lg hover:shadow-2xl transition-all duration-300">
                    <div className="relative h-64 overflow-hidden">
                      <Image
                        src={place.image || "/placeholder.svg"}
                        alt={place.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4">
                        <div className="flex items-center gap-2 text-white/80 text-sm mb-2">
                          <FiMapPin className="w-4 h-4" />
                          {siteData.region}
                        </div>
                        <h2 className="text-2xl font-bold text-white">{place.name}</h2>
                      </div>
                    </div>

                    <div className="p-6">
                      <p className="text-muted-foreground mb-4 line-clamp-2">{place.shortDescription}</p>

                      <div className="flex items-center justify-between">
                        <span className="text-primary font-semibold">{place.events} Events</span>
                        <span className="inline-flex items-center gap-2 text-primary font-semibold group-hover:gap-3 transition-all">
                          Explore
                          <FiArrowRight className="w-4 h-4" />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
