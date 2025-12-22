"use client"

import { use } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { FiMapPin, FiCalendar, FiStar, FiArrowRight } from "react-icons/fi"
import PageHeader from "@/components/ui/page-header"
import PackageCard from "@/components/ui/package-card"
import { useSite } from "@/context/site-context"

export default function PlaceDetailsPage({ params }) {
  const resolvedParams = use(params)
  const { places, packages, siteData } = useSite()

  const place = places.find((p) => p.slug === resolvedParams.slug)
  const relatedPackages = packages.filter((pkg) => pkg.location.toLowerCase().includes(place?.name.toLowerCase()))

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

  return (
    <>
      <PageHeader title={place.name} subtitle={place.shortDescription} backgroundImage={place.image} />

      {/* Main Content */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Left Content */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative h-[400px] rounded-2xl overflow-hidden mb-8"
              >
                <Image src={place.image || "/placeholder.svg"} alt={place.name} fill className="object-cover" />
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <h2 className="text-2xl font-bold text-foreground mb-4">About {place.name}</h2>
                <p className="text-muted-foreground leading-relaxed mb-8">{place.description}</p>

                <h3 className="text-xl font-bold text-foreground mb-4">Top Attractions</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                  {place.attractions.map((attraction, index) => (
                    <div key={index} className="flex items-center gap-3 p-4 bg-muted rounded-xl">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <FiStar className="w-5 h-5 text-primary" />
                      </div>
                      <span className="font-medium text-foreground">{attraction}</span>
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
                <h3 className="text-xl font-bold text-foreground mb-6">Quick Info</h3>

                <div className="space-y-4 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <FiMapPin className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Location</p>
                      <p className="font-medium text-foreground">{siteData.region}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <FiCalendar className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Best Time to Visit</p>
                      <p className="font-medium text-foreground">{place.bestTime}</p>
                    </div>
                  </div>
                </div>

                <Link
                  href="/packages"
                  className="block w-full bg-primary text-white text-center font-semibold py-3 rounded-full hover:bg-primary-dark transition-colors"
                >
                  View Packages
                </Link>
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
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">Packages in {place.name}</h2>
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
          </div>
        </section>
      )}
    </>
  )
}
