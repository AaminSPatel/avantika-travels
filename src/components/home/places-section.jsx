"use client";

import { motion } from "framer-motion";
import PlaceCard from "@/components/ui/place-card";
import { useSite } from "@/context/site-context";
import { FiArrowRight, FiDollarSign, FiMapPin, FiStar } from "react-icons/fi";
import Image from "next/image";
import Link from "next/link";

export default function PlacesSection() {
  const { places } = useSite();

  // Categorize places by type for better organization
  const categorizedPlaces = {
    featured: places[0], // Keep first as featured
    popular: places.slice(1, 4), // Next 3 as popular
    adventure: places.filter(p => p.category?.includes('Adventure')).slice(0, 2),
    cultural: places.filter(p => p.category?.includes('Cultural')).slice(0, 2)
  }

  return (
    <section className="py-16 md:py-24 bg-white lg:px-10 sm:px-2">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-2xl md:text-3xl font-bold text-foreground mb-4"
        >
          Discover Amazing Destinations
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-gray-600 mb-8 max-w-2xl"
        >
          From serene beaches to majestic mountains, explore destinations that inspire unforgettable memories
        </motion.p>

        {/* Featured Destination */}
        <div className="mb-12">
          <h3 className="text-xl font-semibold text-foreground mb-6">Featured Destination</h3>
          <div className="col-span-2 row-span-2">
            {categorizedPlaces.featured && (
              <PlaceCard  key={categorizedPlaces._id}  place={categorizedPlaces.featured} index={0} variant="large" />
            )}
          </div>
        </div>

        {/* Popular Destinations Grid */}
        <h3 className="text-xl font-semibold text-foreground mb-6">Popular Destinations</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-12">
          {categorizedPlaces.popular.map((place, index) => (
            <motion.div
              key={place._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative"
            >
              <Link href={`/places/${place.slug}`}>
                <div className="relative rounded-2xl overflow-hidden h-64">
                  <Image
                    src={place.images[0]?.url || '/placeholder-destination.jpg'}
                    alt={`${place.title || place.name} - Religious Pilgrimage Site in Madhya Pradesh, India | Avantika Travels`}
                    fill
                    priority={index < 3}
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    sizes="(min-width: 768px) 33vw, 100vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                  {/* Category Badge */}
                  {place.category && (
                    <div className="absolute top-4 sm:left-4 left-2 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full">
                      <span className="text-sm font-semibold text-foreground">
                        {place.category}
                      </span>
                    </div>
                  )}

                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <div className="flex items-end sm:flex-row flex-col justify-between">
                      <div className="space-y-1">
                        <h3 className="font-semibold sm:pl-2 text-white text-lg">
                          {place.title || place.name}
                        </h3>
                        <div className="flex sm:items-center gap-1.5 text-white/90 text-sm">
                          <FiMapPin className="w-5 5 hidden sm:block" />
                          <span><FiMapPin className="w-5 5  sm:hidden" />{place.location}</span>
                        </div>
                      </div>
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center group-hover:bg-white transition-colors">
                        <FiArrowRight className="w-4 h-4  text-white group-hover:text-primary transition-colors" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}

          {/* Show All Destinations Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="relative rounded-2xl overflow-hidden h-64"
             style={{backgroundImage:`url('/pik8.avif')`}}
          >
            <Link href={'/places'} className=" p-6">
              <div className="absolute inset-0 bg-white/10 backdrop-blur-xs flex items-center justify-center object-cover">
                <div className="text-center text-white p-6">
                  <p className="font-bold text-xl mb-2">Explore All</p>
                  <p className="text-sm opacity-90">+{places.length} Destinations</p>
                  <FiArrowRight className="w-8 h-8 mx-auto mt-4 opacity-80" />
                </div>
              </div>
            </Link>
          </motion.div>
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-linear-to-r from-primary to-primary/60 rounded-2xl p-8 text-center text-white"
        >
          <h3 className="text-2xl font-bold mb-4">Need Help Choosing?</h3>
          <p className="mb-6 max-w-2xl mx-auto">
            Our travel experts can help you plan the perfect vacation based on your preferences and budget.
          </p>
          <Link
            href="/contact"
            className="inline-block bg-white text-primary font-semibold px-8 py-3 rounded-full hover:bg-gray-100 transition-colors"
          >
            Get Free Consultation
          </Link>
        </motion.div>
      </div>
    </section>
  );
}