"use client"

import { use } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { FiMapPin, FiCalendar, FiStar, FiArrowRight, FiUsers, FiTrendingUp } from "react-icons/fi"
import PageHeader from "@/components/ui/page-header"
import PackageCard from "@/components/ui/package-card"
import { useSite } from "@/context/site-context"

export default function PlaceDetailsPage({ params }) {
  const resolvedParams = use(params)
  const { places, packages, siteData } = useSite()

  const place = places.find((p) => p.slug === resolvedParams.slug)
  
  // Filter packages by destination (using destination field from package schema)
  const relatedPackages = packages.filter((pkg) => 
    pkg.destination.toLowerCase().includes(place?.location?.toLowerCase() || place?.title?.toLowerCase())
  )

  if (!place) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Place not found</h1>
          <Link href="/places" className="text-primary hover:underline">
            Back to Places
          </Link>
        </div>
      </div>
    )
  }

  // Use first image as main image, fallback to placeholder
  const mainImage = place.images && place.images.length > 0 ? place.images[0].url : "/placeholder.svg"

  return (
    <>
      <PageHeader 
        title={place.title} 
        subtitle={place.description.substring(0, 150)} 
        backgroundImage={mainImage} 
      />

      {/* Main Content */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Left Content */}
            <div className="lg:col-span-2">
              {/* Main Image */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative h-[400px] rounded-2xl overflow-hidden mb-8"
              >
                <Image 
                  src={mainImage} 
                  alt={place.title} 
                  fill 
                  className="object-cover" 
                  priority
                />
                {place.rating > 0 && (
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-2">
                    <FiStar className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="font-bold">{place.rating.toFixed(1)}</span>
                  </div>
                )}
              </motion.div>

              {/* Additional Images */}
              {place.images && place.images.length > 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="grid grid-cols-3 gap-3 mb-8"
                >
                  {place.images.slice(1, 4).map((image, index) => (
                    <div key={index} className="relative h-32 rounded-xl overflow-hidden">
                      <Image 
                        src={image.url} 
                        alt={`${place.title} - ${index + 2}`} 
                        fill 
                        className="object-cover"
                      />
                    </div>
                  ))}
                </motion.div>
              )}

              {/* Description */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: 0.2 }}
              >
                <h2 className="text-2xl font-bold text-foreground mb-4">About {place.title}</h2>
                <p className="text-muted-foreground leading-relaxed mb-8">{place.description}</p>

                {/* Stats Section */}
                {(place.visitors > 0 || place.trips > 0 || place.cleaness > 0) && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                    {place.visitors > 0 && (
                      <div className="bg-primary/5 rounded-xl p-4 text-center">
                        <div className="flex items-center justify-center gap-2 mb-2">
                          <FiUsers className="w-5 h-5 text-primary" />
                          <span className="text-2xl font-bold">{place.visitors.toLocaleString()}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">Annual Visitors</p>
                      </div>
                    )}
                    
                    {place.trips > 0 && (
                      <div className="bg-primary/5 rounded-xl p-4 text-center">
                        <div className="flex items-center justify-center gap-2 mb-2">
                          <FiTrendingUp className="w-5 h-5 text-primary" />
                          <span className="text-2xl font-bold">{place.trips}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">Trips Available</p>
                      </div>
                    )}
                    
                    {place.cleaness > 0 && (
                      <div className="bg-primary/5 rounded-xl p-4 text-center">
                        <div className="flex items-center justify-center gap-2 mb-2">
                          <FiStar className="w-5 h-5 text-primary" />
                          <span className="text-2xl font-bold">{place.cleaness}/5</span>
                        </div>
                        <p className="text-sm text-muted-foreground">Cleanliness</p>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="sticky top-24 bg-muted rounded-2xl p-6"
              >
                <h3 className="text-xl font-bold text-foreground mb-6">Quick Info</h3>

                <div className="space-y-4 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <FiMapPin className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Location</p>
                      <p className="font-medium text-foreground">{place.location}</p>
                    </div>
                  </div>

                  {place.bestTimeToVisit && (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <FiCalendar className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Best Time to Visit</p>
                        <p className="font-medium text-foreground">{place.bestTimeToVisit}</p>
                      </div>
                    </div>
                  )}

                  {place.openingHours && (
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mt-1">
                        <span className="text-sm font-bold text-primary">⌚</span>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Opening Hours</p>
                        <p className="font-medium text-foreground">{place.openingHours}</p>
                      </div>
                    </div>
                  )}

                  {place.entryFee > 0 && (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-primary">₹</span>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Entry Fee</p>
                        <p className="font-medium text-foreground">₹{place.entryFee.toLocaleString()}</p>
                      </div>
                    </div>
                  )}

                  {place.category && (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-primary">🏷️</span>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Category</p>
                        <p className="font-medium text-foreground">{place.category}</p>
                      </div>
                    </div>
                  )}
                </div>

                {place.price > 0 && (
                  <div className="mb-6 p-4 bg-primary/5 rounded-xl">
                    <p className="text-sm text-muted-foreground mb-1">Starting From</p>
                    <p className="text-2xl font-bold text-primary">₹{place.price.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">per person</p>
                  </div>
                )}

                <Link
                  href="/packages"
                  className="block w-full bg-primary text-white text-center font-semibold py-3 rounded-full hover:bg-primary-dark transition-colors"
                >
                  View Packages
                </Link>

                {place.isAtive === false && (
                  <div className="mt-4 px-4 py-2 bg-red-100 text-red-800 rounded-lg text-sm text-center">
                    Currently Closed for Visitors
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Packages */}
      {relatedPackages.length > 0 && (
        <section className="py-16 md:py-24 bg-muted">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                Packages in {place.location}
              </h2>
              <Link
                href="/packages"
                className="hidden md:flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all"
              >
                View All
                <FiArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedPackages.slice(0, 3).map((pkg, index) => (
                <PackageCard key={pkg.id} pkg={pkg} index={index} />
              ))}
            </div>

            {relatedPackages.length > 3 && (
              <div className="mt-8 text-center md:hidden">
                <Link
                  href="/packages"
                  className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all"
                >
                  View All Packages
                  <FiArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>
        </section>
      )}
    </>
  )
}