'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import HeroSection from "@/components/home/hero-section"
import PlacesSection from "@/components/home/places-section"
import PackagesSection from "@/components/home/packages-section"

export default function HomePage() {
  const router = useRouter()

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

  return (
    <>
      <HeroSection />
      <PlacesSection />
      <PackagesSection />
    </>
  )
}
