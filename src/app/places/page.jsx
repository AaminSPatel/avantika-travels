"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { FiArrowRight, FiMapPin } from "react-icons/fi"
import PageHeader from "@/components/ui/page-header"
import { useSite } from "@/context/site-context"
import PlaceCard from "@/components/ui/place-card"

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
              <PlaceCard place={place}  key={place._id} index={index} />
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
