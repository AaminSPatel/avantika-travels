"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import Head from "next/head"
import { FiArrowRight, FiMapPin } from "react-icons/fi"
import PageHeader from "@/components/ui/page-header"
import { useSite } from "@/context/site-context"
import PlaceCard from "@/components/ui/place-card"
import Pagination from "@/components/ui/pagination"

export default function PlacesPage() {
  const { places, siteData } = useSite()
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 9

  // Pagination logic
  const totalItems = places.length
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedPlaces = places.slice(startIndex, endIndex)

  const handlePageChange = (page) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <>
      <Head>
        <title>Explore Destinations | Avantika Travels</title>
        <meta name="description" content="Discover the divine beauty and cultural heritage of Madhya Pradesh. Explore sacred places like Mahakal Temple, Omkareshwar, and more with Avantika Travels." />
        <meta name="keywords" content="Madhya Pradesh destinations, Ujjain places to visit, Mahakal Temple, Omkareshwar, spiritual tourism India" />
        <meta property="og:title" content="Explore Destinations | Avantika Travels" />
        <meta property="og:description" content="Discover the divine beauty and cultural heritage of Madhya Pradesh. Explore sacred places like Mahakal Temple, Omkareshwar, and more with Avantika Travels." />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/pik7.avif" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Madhya Pradesh destinations" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Explore Destinations | Avantika Travels" />
        <meta name="twitter:description" content="Discover the divine beauty and cultural heritage of Madhya Pradesh. Explore sacred places like Mahakal Temple, Omkareshwar, and more with Avantika Travels." />
        <meta name="twitter:image" content="/pik7.avif" />
        <meta name="robots" content="index, follow" />
        <meta name="revisit-after" content="7 days" />
        <meta name="language" content="en-IN" />
        <meta name="geo.region" content="IN-MP" />
        <link rel="canonical" href="https://avantikatravels.com/places" />
      </Head>
      <PageHeader
        title="Explore Destinations"
        subtitle={`Discover the divine beauty and cultural heritage of ${siteData.region}`}
        backgroundImage="/pik7.avif"
      />

      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {paginatedPlaces.map((place, index) => (
              <PlaceCard place={place}  key={place._id} index={index} />
            ))}
          </div>

          {/* Pagination */}
          {totalItems > itemsPerPage && (
            <Pagination
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
              currentPage={currentPage}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      </section>
    </>
  )
}
