'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import HeroSection from "@/components/home/hero-section"

// Dynamic imports for non-critical components
const PlacesSection = dynamic(() => import("@/components/home/places-section"))
const PackagesSection = dynamic(() => import("@/components/home/packages-section"))
const ReviewsSection = dynamic(() => import("@/components/home/reviews-section"))
const SearchResultsSection = dynamic(() => import("@/components/home/search-results-section"))
const ContactPopup = dynamic(() => import("@/components/ui/contact-popup"))

export default function HomePage() {
  const router = useRouter()
  const [selectedTripType, setSelectedTripType] = useState("")
  const [selectedRegion, setSelectedRegion] = useState("")
  const [hasSearched, setHasSearched] = useState(false)

  useEffect(() => {
    const handleKeyDown = (event) => {
      // Secret admin access: Ctrl + Shift + A
      if (event.ctrlKey && event.shiftKey && event.key === 'A') {
        event.preventDefault()
        router.push('/admin/login')
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [router])

  const handleSearch = () => {
    if (selectedRegion) {
      setHasSearched(true)
    }
  }

  const clearSearch = () => {
    setSelectedRegion("")
    setSelectedTripType("")
    setHasSearched(false)
  }

  return (
    <>
      <Head>
        <title>Avantika Travels | Mahakal Mandir Tours, Ujjain Pilgrimage & Madhya Pradesh Travel</title>
        <meta name="description" content="Discover Mahakal Mandir tours, Ujjain pilgrimage packages, and Madhya Pradesh travel experiences with Avantika Travels. Best spiritual journeys and taxi services." />
        <meta name="keywords" content="Mahakal Mandir tours, Ujjain pilgrimage, Madhya Pradesh travel, Avantika Travels, spiritual tours, pilgrimage packages" />
        <meta property="og:title" content="Avantika Travels | Mahakal Mandir Tours, Ujjain Pilgrimage & Madhya Pradesh Travel" />
        <meta property="og:description" content="Discover Mahakal Mandir tours, Ujjain pilgrimage packages, and Madhya Pradesh travel experiences with Avantika Travels. Best spiritual journeys and taxi services." />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/logo.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Avantika Travels - Mahakal Mandir Tours & Ujjain Pilgrimage" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Avantika Travels | Mahakal Mandir Tours, Ujjain Pilgrimage & Madhya Pradesh Travel" />
        <meta name="twitter:description" content="Discover Mahakal Mandir tours, Ujjain pilgrimage packages, and Madhya Pradesh travel experiences with Avantika Travels. Best spiritual journeys and taxi services." />
        <meta name="twitter:image" content="/logo.png" />
        <meta name="robots" content="index, follow" />
        <meta name="revisit-after" content="7 days" />
        <meta name="language" content="en-IN" />
        <meta name="geo.region" content="IN-MP" />
        <link rel="canonical" href="https://avantikatravels.com/" />
      </Head>
      <HeroSection
        selectedTripType={selectedTripType}
        setSelectedTripType={setSelectedTripType}
        selectedRegion={selectedRegion}
        setSelectedRegion={setSelectedRegion}
        onSearch={handleSearch}
      />

      {hasSearched && (
        <SearchResultsSection
          selectedTripType={selectedTripType}
          selectedRegion={selectedRegion}
          onClearSearch={clearSearch}
        />
      )}

      <PlacesSection />
      <PackagesSection />
      <ReviewsSection />
      <ContactPopup />
    </>
  )
}
