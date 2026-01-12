'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Head from 'next/head'
import HeroSection from "@/components/home/hero-section"
import PlacesSection from "@/components/home/places-section"
import PackagesSection from "@/components/home/packages-section"
import ReviewsSection from "@/components/home/reviews-section"
import SearchResultsSection from "@/components/home/search-results-section"
import ContactPopup from "@/components/ui/contact-popup"

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
        <title>Avantika Travels | Best Travel Agency in Ujjain & Indore</title>
        <meta name="description" content="Book your spiritual journey with Avantika Travels. Specializing in Mahakal Darshan, Ujjain city tours, and Indore travel packages at best prices." />
        <meta name="keywords" content="Avantika Travels, Travels, Ujjain Travel, Mahakal Mandir Darshan, Indore Tourism" />
        <meta property="og:title" content="Avantika Travels | Best Travel Agency in Ujjain & Indore" />
        <meta property="og:description" content="Book your spiritual journey with Avantika Travels. Specializing in Mahakal Darshan, Ujjain city tours, and Indore travel packages at best prices." />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/logo.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Avantika Travels - Best Travel Agency in Ujjain & Indore" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Avantika Travels | Best Travel Agency in Ujjain & Indore" />
        <meta name="twitter:description" content="Book your spiritual journey with Avantika Travels. Specializing in Mahakal Darshan, Ujjain city tours, and Indore travel packages at best prices." />
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
