"use client"

import { use } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { FiMapPin, FiClock, FiStar, FiCheck, FiPhone, FiMail } from "react-icons/fi"
import PageHeader from "@/components/ui/page-header"
import PackageCard from "@/components/ui/package-card"
import { useSite } from "@/context/site-context"

export default function PackageDetailsPage({ params }) {
  const resolvedParams = use(params)
  const { packages, siteData } = useSite()

  const pkg = packages.find((p) => p.slug === resolvedParams.slug)
  const relatedPackages = packages.filter((p) => p.id !== pkg?.id).slice(0, 4)

  if (!pkg) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Package not found</h1>
          <Link href="/packages" className="text-primary hover:underline">
            Back to Packages
          </Link>
        </div>
      </div>
    )
  }

  // Use first image as main image, fallback to placeholder
  const mainImage = pkg.images && pkg.images.length > 0 ? pkg.images[0].url : "/placeholder.svg"

  return (
    <>
      <PageHeader title={pkg.name} subtitle={pkg.description.substring(0, 100)} backgroundImage={mainImage} />

      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Image Gallery */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative h-[400px] rounded-2xl overflow-hidden mb-8"
              >
                <Image 
                  src={mainImage} 
                  alt={pkg.name} 
                  fill 
                  className="object-cover" 
                  priority
                />
              </motion.div>

              {/* Additional Images */}
              {pkg.images && pkg.images.length > 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="grid grid-cols-3 gap-3 mb-8"
                >
                  {pkg.images.slice(1).map((image, index) => (
                    <div key={index} className="relative h-32 rounded-xl overflow-hidden">
                      <Image 
                        src={image.url} 
                        alt={`${pkg.name} - ${index + 2}`} 
                        fill 
                        className="object-cover"
                      />
                    </div>
                  ))}
                </motion.div>
              )}

              {/* Quick Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex flex-wrap gap-6 mb-8"
              >
                <div className="flex items-center gap-2">
                  <FiClock className="w-5 h-5 text-primary" />
                  <span className="font-medium">{pkg.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiMapPin className="w-5 h-5 text-primary" />
                  <span className="font-medium">{pkg.destination}</span>
                </div>
              </motion.div>

              {/* Description */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mb-8"
              >
                <h2 className="text-2xl font-bold text-foreground mb-4">Overview</h2>
                <p className="text-muted-foreground leading-relaxed">{pkg.description}</p>
              </motion.div>

              {/* What's Included */}
              {pkg.inclusions && pkg.inclusions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="mb-8"
                >
                  <h2 className="text-2xl font-bold text-foreground mb-4">Inclusions</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {pkg.inclusions.map((item, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                          <FiCheck className="w-4 h-4 text-green-600" />
                        </div>
                        <span className="text-foreground">{item}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Exclusions */}
              {pkg.exclusions && pkg.exclusions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="mb-8"
                >
                  <h2 className="text-2xl font-bold text-foreground mb-4">Exclusions</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {pkg.exclusions.map((item, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
                          <span className="w-2 h-2 bg-red-600 rounded-full" />
                        </div>
                        <span className="text-foreground">{item}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Itinerary */}
              {pkg.itinerary && pkg.itinerary.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ delay: 0.6 }}
                >
                  <h2 className="text-2xl font-bold text-foreground mb-6">Itinerary</h2>
                  <div className="space-y-4">
                    {pkg.itinerary.map((day, index) => (
                      <div
                        key={index}
                        className="relative pl-8 pb-8 border-l-2 border-primary/20 last:border-0 last:pb-0"
                      >
                        <div className="absolute left-0 top-0 w-4 h-4 bg-primary rounded-full -translate-x-[9px]" />
                        <div className="bg-muted rounded-xl p-5">
                          <h3 className="font-semibold text-foreground mb-2">
                            Day {index + 1}
                          </h3>
                          <p className="text-muted-foreground">{day}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="sticky top-24 bg-muted rounded-2xl p-6"
              >
                <div className="mb-6">
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-3xl font-bold text-primary">
                      ₹{pkg.price.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-muted-foreground">per person</p>
                  {pkg.status === false && (
                    <div className="mt-3 px-4 py-2 bg-red-100 text-red-800 rounded-lg text-sm">
                      Currently Unavailable
                    </div>
                  )}
                </div>

                <div className="space-y-4 mb-6">
                  {pkg.status !== false ? (
                    <>
                      <Link
                        href="/contact"
                        className="block w-full bg-primary text-white text-center font-semibold py-3 rounded-full hover:bg-primary-dark transition-colors"
                      >
                        Book Now
                      </Link>
                      <a
                        href={`tel:${siteData.phone}`}
                        className="flex items-center justify-center gap-2 w-full border-2 border-primary text-primary font-semibold py-3 rounded-full hover:bg-primary hover:text-white transition-colors"
                      >
                        <FiPhone className="w-4 h-4" />
                        Call to Enquire
                      </a>
                    </>
                  ) : (
                    <button
                      disabled
                      className="block w-full bg-gray-400 text-white text-center font-semibold py-3 rounded-full cursor-not-allowed"
                    >
                      Currently Unavailable
                    </button>
                  )}
                </div>

                <div className="pt-6 border-t border-border">
                  <h4 className="font-semibold text-foreground mb-4">Need Help?</h4>
                  <div className="space-y-3 text-sm">
                    <a
                      href={`tel:${siteData.phone}`}
                      className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                    >
                      <FiPhone className="w-4 h-4" />
                      {siteData.phone}
                    </a>
                    <a
                      href={`mailto:${siteData.email}`}
                      className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                    >
                      <FiMail className="w-4 h-4" />
                      {siteData.email}
                    </a>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Packages */}
      <section className="py-16 md:py-24 bg-muted">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8">You May Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedPackages.map((relatedPkg, index) => (
              <PackageCard key={relatedPkg.id} pkg={relatedPkg} index={index} />
            ))}
          </div>
        </div>
      </section>
    </>
  )
}