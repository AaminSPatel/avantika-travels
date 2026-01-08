"use client"

import { useEffect } from "react"
import Head from "next/head"
import { useSite } from "@/context/site-context"

export function MetadataProvider({ children }) {
  const { siteData } = useSite()

  useEffect(() => {
    if (siteData && siteData.name) {
      // Update document title dynamically
      document.title = `${siteData.name} | ${siteData.tagline}`

      // Update meta description
      const metaDescription = document.querySelector('meta[name="description"]')
      if (metaDescription) {
        metaDescription.setAttribute('content', siteData.description)
      }

      // Update keywords
      const metaKeywords = document.querySelector('meta[name="keywords"]')
      if (metaKeywords && siteData.keywords) {
        metaKeywords.setAttribute('content', siteData.keywords.join(', '))
      }

      // Update Open Graph tags
      const ogTitle = document.querySelector('meta[property="og:title"]')
      if (ogTitle) {
        ogTitle.setAttribute('content', `${siteData.name} | ${siteData.tagline}`)
      }

      const ogDescription = document.querySelector('meta[property="og:description"]')
      if (ogDescription) {
        ogDescription.setAttribute('content', siteData.description)
      }

      // Update Twitter tags
      const twitterTitle = document.querySelector('meta[name="twitter:title"]')
      if (twitterTitle) {
        twitterTitle.setAttribute('content', `${siteData.name} | ${siteData.tagline}`)
      }

      const twitterDescription = document.querySelector('meta[name="twitter:description"]')
      if (twitterDescription) {
        twitterDescription.setAttribute('content', siteData.description)
      }
    }
  }, [siteData])

  return (
    <>
      <Head>
        <title>{siteData?.name ? `${siteData.name} | ${siteData.tagline}` : "Avantika Travels | Discover the Divine Beauty of Madhya Pradesh"}</title>
       <meta name="google-site-verification" content="wvy-XHnWdz5nBgkWv8T5oQJ6qDHnmaUD0KSYaNBz1Bk" />
        <meta name="description" content={siteData?.description || "Experience the spiritual essence and cultural heritage of Madhya Pradesh with Avantika Travels. We specialize in pilgrimages to Mahakal Mandir and tours across Ujjain, Indore, and Dewas."} />
        <meta name="keywords" content={siteData?.keywords ? siteData.keywords.join(', ') : "Mahakal Mandir, Ujjain travel, Madhya Pradesh pilgrimage, Indore tours, Dewas travel, spiritual tours India"} />
        <meta property="og:title" content={siteData?.name ? `${siteData.name} | ${siteData.tagline}` : "Avantika Travels | Discover the Divine Beauty of Madhya Pradesh"} />
        <meta property="og:description" content={siteData?.description || "Your trusted travel partner for exploring the spiritual and cultural heritage of Madhya Pradesh."} />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="en_IN" />
        <meta property="og:image" content={siteData?.secondaryImage ? `${typeof window !== 'undefined' ? window.location.origin : ''}${siteData.secondaryImage}` : `${typeof window !== 'undefined' ? window.location.origin : ''}/pik2.avif`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Avantika Travels - Madhya Pradesh Tourism" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={siteData?.name ? `${siteData.name} | ${siteData.tagline}` : "Avantika Travels | Madhya Pradesh Tours"} />
        <meta name="twitter:description" content={siteData?.description || "Experience the divine beauty of Madhya Pradesh with our curated travel packages."} />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={typeof window !== 'undefined' ? window.location.origin : ''} />
      </Head>
      {children}
    </>
  )
}
