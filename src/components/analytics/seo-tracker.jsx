"use client"

import { useEffect, useRef } from "react"
import { usePathname } from "next/navigation"

export default function SEOTracker() {
  const pathname = usePathname()
  const pageStartTime = useRef(Date.now())
  const hasTracked = useRef(false)

  useEffect(() => {
    // Reset tracking for new page
    pageStartTime.current = Date.now()
    hasTracked.current = false

    // Track page view
    const trackPageView = () => {
      if (hasTracked.current) return
      hasTracked.current = true

      const pageData = {
        url: window.location.href,
        pathname: pathname,
        referrer: document.referrer,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString(),
        title: document.title,
      }

      // Store in localStorage for analytics
      try {
        const existingData = JSON.parse(localStorage.getItem('seo-analytics') || '[]')
        existingData.push(pageData)

        // Keep only last 100 entries
        if (existingData.length > 100) {
          existingData.splice(0, existingData.length - 100)
        }

        localStorage.setItem('seo-analytics', JSON.stringify(existingData))
      } catch (error) {
        console.warn('SEO Analytics storage failed:', error)
      }

      // Send to Google Analytics if available
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('config', process.env.NEXT_PUBLIC_GA_ID || 'GA_MEASUREMENT_ID', {
          page_path: pathname,
        })
      }
    }

    // Track immediately and on visibility change
    trackPageView()

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        trackPageView()
      }
    }

    const handleBeforeUnload = () => {
      const timeSpent = Date.now() - pageStartTime.current

      // Track time spent on page
      try {
        const timeData = {
          url: window.location.href,
          pathname: pathname,
          timeSpent: timeSpent,
          timestamp: new Date().toISOString(),
        }

        const existingTimeData = JSON.parse(localStorage.getItem('seo-time-tracking') || '[]')
        existingTimeData.push(timeData)

        // Keep only last 50 entries
        if (existingTimeData.length > 50) {
          existingTimeData.splice(0, existingTimeData.length - 50)
        }

        localStorage.setItem('seo-time-tracking', JSON.stringify(existingTimeData))
      } catch (error) {
        console.warn('SEO Time tracking failed:', error)
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('beforeunload', handleBeforeUnload)
      handleBeforeUnload() // Track on unmount
    }
  }, [pathname])

  // Track search rankings (mock implementation)
  useEffect(() => {
    const trackKeywordRankings = async () => {
      // This would integrate with a keyword tracking API
      // For now, we'll just log the current page for potential keyword analysis
      try {
        const keywordData = {
          page: pathname,
          title: document.title,
          timestamp: new Date().toISOString(),
        }

        const existingKeywordData = JSON.parse(localStorage.getItem('seo-keyword-tracking') || '[]')
        existingKeywordData.push(keywordData)

        // Keep only last 20 entries
        if (existingKeywordData.length > 20) {
          existingKeywordData.splice(0, existingKeywordData.length - 20)
        }

        localStorage.setItem('seo-keyword-tracking', JSON.stringify(existingKeywordData))
      } catch (error) {
        console.warn('SEO Keyword tracking failed:', error)
      }
    }

    trackKeywordRankings()
  }, [pathname])

  return null // This component doesn't render anything
}
