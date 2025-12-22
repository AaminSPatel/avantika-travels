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

  return (
    <>
      <PageHeader title={pkg.name} subtitle={pkg.shortDescription} backgroundImage={pkg.image} />

      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative h-[400px] rounded-2xl overflow-hidden mb-8"
              >
                <Image src={pkg.image || "/placeholder.svg"} alt={pkg.name} fill className="object-cover" />
                {pkg.discount > 0 && (
                  <div className="absolute top-4 right-4 bg-primary text-white text-sm font-bold px-4 py-2 rounded-full">
                    {pkg.discount}% OFF
                  </div>
                )}
              </motion.div>

              {/* Quick Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex flex-wrap gap-6 mb-8"
              >
                <div className="flex items-center gap-2">
                  <FiClock className="w-5 h-5 text-primary" />
                  <span className="font-medium">{pkg.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiMapPin className="w-5 h-5 text-primary" />
                  <span className="font-medium">{pkg.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiStar className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  <span className="font-medium">
                    {pkg.rating} ({pkg.reviews} reviews)
                  </span>
                </div>
              </motion.div>

              {/* Description */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-8"
              >
                <h2 className="text-2xl font-bold text-foreground mb-4">Overview</h2>
                <p className="text-muted-foreground leading-relaxed">{pkg.description}</p>
              </motion.div>

              {/* What's Included */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mb-8"
              >
                <h2 className="text-2xl font-bold text-foreground mb-4">{"What's Included"}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {pkg.includes.map((item, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                        <FiCheck className="w-4 h-4 text-green-600" />
                      </div>
                      <span className="text-foreground">{item}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Itinerary */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
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
                          Day {day.day}: {day.title}
                        </h3>
                        <ul className="space-y-2">
                          {day.activities.map((activity, actIndex) => (
                            <li key={actIndex} className="flex items-center gap-2 text-muted-foreground">
                              <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                              {activity}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
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
                <div className="mb-6">
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-3xl font-bold text-primary">₹{pkg.price.toLocaleString()}</span>
                    {pkg.originalPrice > pkg.price && (
                      <span className="text-lg text-muted-foreground line-through">
                        ₹{pkg.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                  <p className="text-muted-foreground">per person</p>
                </div>

                <div className="space-y-4 mb-6">
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
