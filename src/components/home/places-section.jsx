"use client";

import { motion } from "framer-motion";
//import PlaceCard from "@/components/ui/place-card";
import FeaturedPlaceCard from "@/components/home/featured-place-card";
import { useSite } from "@/context/site-context";
import { FiArrowRight, FiMapPin } from "react-icons/fi";
import Image from "next/image";
import Link from "next/link";

export default function PlacesSection() {
  const { places = [] } = useSite();

  const categorizedPlaces = {
    popular: places.slice(0, 3),
  };

  return (
    <section className="py-16 md:py-24 bg-white lg:px-10 sm:px-2">
      <div className="container mx-auto px-4">
        
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
          <div className="max-w-2xl">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
            >
              Top Places to Visit in <span className="text-primary">Ujjain & MP</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-gray-600 text-lg"
            >
              Discover the spiritual energy of <strong>Mahakaleshwar Jyotirlinga</strong> and the serene beauty of the Shipra River.
            </motion.p>
          </div>
          <Link href="/places" className="text-primary font-semibold hover:underline flex items-center gap-2">
            View All Destinations <FiArrowRight />
          </Link>
        </div>

        {/* Featured Destination Banner (Local Static Data & Art-Directed Responsive Images) */}
        <div className="mb-12">
          <FeaturedPlaceCard />
        </div>

        {/* Popular Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-16">
          {categorizedPlaces.popular.map((place, index) => (
            <motion.div
              key={place._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative"
            >
              <Link href={`/places/${place.slug}`}>
                <div className="relative rounded-2xl overflow-hidden h-64 shadow-md">
                  <Image
                    src={place.images[0]?.url || '/placeholder-destination.jpg'}
                    alt={`Visit ${place.title} - Best Tourism Spot in Ujjain Madhya Pradesh`}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                    sizes="(min-width: 768px) 33vw, 100vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="font-bold text-white text-lg truncate">{place.title}</h3>
                    <div className="flex items-center gap-1 text-gray-300 text-sm">
                      <FiMapPin className="w-4 h-4" /> {place.location}
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
          
           {/* 'Explore All' Card */}
           <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative rounded-2xl overflow-hidden h-64 bg-gray-100 border-2 border-gray-300 hover:border-primary transition-colors cursor-pointer group"
           style={{backgroundImage:`url('/pik8.avif')`}}
          >
            <Link href={'/places'} className="flex flex-col inset-0 bg-white/10 backdrop-blur-xs items-center justify-center object-cover h-full text-center p-4">
               <div className="w-12 h-12 rounded-full flex items-center justify-center mb-3 bg-primary text-white transition-all group-hover:scale-110">
                  <FiArrowRight className="w-6 h-6" />
               </div>
               <span className="font-bold text-white">Explore All Places</span>
               <span className="text-sm text-gray-100">Omkareshwar, Maheshwar & More</span>
             
            </Link>
          </motion.div>
        
        </div>

        {/* SEO Article Section - Adds genuine word count without breaking layout */}
        <article className="bg-gray-50 rounded-3xl p-6 md:p-10">
          <header className="mb-6">
             <h3 className="text-2xl font-bold text-gray-900">Ujjain Tourism Guide 2026</h3>
             <p className="text-sm text-gray-500 uppercase tracking-wide">Plan your spiritual getaway</p>
          </header>
          
          <div className="prose prose-gray max-w-none grid md:grid-cols-2 gap-x-12 gap-y-6 text-gray-600">
            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-2">The Spiritual Capital of MP</h4>
              <p>
                Ujjain, situated on the banks of the sacred Shipra River, is home to the <strong>Mahakaleshwar Jyotirlinga</strong>, one of the twelve Jyotirlingas in India. Every day, thousands of devotees search for <em>Ujjain me ghumne ki jagah</em>, and the city never disappoints. The newly developed <strong>Mahakal Lok Corridor</strong> has added a majestic charm to the temple complex, showcasing stories of Lord Shiva through grand statues and murals.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-2">How to Plan Your Trip?</h4>
              <p>
                Most travelers arrive via Indore. The <strong>Indore to Ujjain distance</strong> is about 55km, which takes roughly 1 to 1.5 hours by <Link href="/services" className="text-primary hover:underline">taxi</Link>. At <Link href="/about" className="text-primary hover:underline">Avantika Travels</Link>, we suggest a <strong>2-day itinerary</strong>: Day 1 for Mahakal Darshan, Kaal Bhairav, and Harsiddhi Mata Temple; Day 2 for an <strong>Omkareshwar & Mamleshwar Jyotirlinga trip</strong>. Don't forget to <Link href="/contact" className="text-primary hover:underline">book your <em>Bhasma Aarti</em> tickets</Link> online in advance!
              </p>
            </div>
          </div>
        </article>

      </div>
    </section>
  );
}