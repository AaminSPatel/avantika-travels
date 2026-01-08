'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
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
