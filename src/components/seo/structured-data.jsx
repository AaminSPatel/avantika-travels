"use client"

import { useSite } from "@/context/site-context"

export function StructuredData() {
  const { siteData } = useSite()

  if (!siteData || !siteData.name) {
    return null
  }

  // LocalBusiness Schema for Travel Agency
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    "name": siteData.name,
    "description": siteData.description,
    "url": typeof window !== 'undefined' ? window.location.origin : '',
    "logo": siteData.logo,
    "image": siteData.secondaryImage,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": siteData.contactInfo?.address,
      "addressLocality": siteData.contactInfo?.location,
      "addressRegion": siteData.contactInfo?.region,
      "addressCountry": "IN"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": siteData.contactInfo?.phone,
      "contactType": "customer service",
      "availableLanguage": "English"
    },
    "sameAs": [
      siteData.socialLinks?.facebook,
      siteData.socialLinks?.instagram,
      siteData.socialLinks?.twitter,
      siteData.socialLinks?.youtube
    ].filter(Boolean),
    "areaServed": {
      "@type": "Place",
      "name": "Madhya Pradesh"
    },
    "specialty": "Religious Tourism, Pilgrimage Tours, Cultural Tours",
    "priceRange": "₹₹"
  }

  // Organization Schema
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": siteData.name,
    "description": siteData.description,
    "url": typeof window !== 'undefined' ? window.location.origin : '',
    "logo": siteData.logo,
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": siteData.contactInfo?.phone,
      "contactType": "customer service"
    },
    "sameAs": [
      siteData.socialLinks?.facebook,
      siteData.socialLinks?.instagram,
      siteData.socialLinks?.twitter,
      siteData.socialLinks?.youtube
    ].filter(Boolean)
  }

  // TouristAttraction Schema for Mahakal Mandir
  const touristAttractionSchema = {
    "@context": "https://schema.org",
    "@type": "TouristAttraction",
    "name": siteData.mainAttraction,
    "description": "One of the 12 Jyotirlingas, a sacred Hindu temple dedicated to Lord Shiva",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Mahakal Temple Road",
      "addressLocality": "Ujjain",
      "addressRegion": "Madhya Pradesh",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "23.1824",
      "longitude": "75.7687"
    },
    "touristType": "Religious Tourism",
    "isAccessibleForFree": false
  }

  // FAQ Schema
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What are the main attractions in Madhya Pradesh?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Madhya Pradesh offers spiritual sites like Mahakal Mandir in Ujjain, historical monuments, wildlife sanctuaries, and cultural heritage sites across cities like Indore, Bhopal, and Dewas."
        }
      },
      {
        "@type": "Question",
        "name": "How can I book a pilgrimage tour?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "You can contact us directly through our website or call our customer service team to customize and book your pilgrimage tour packages."
        }
      },
      {
        "@type": "Question",
        "name": "What is the best time to visit Madhya Pradesh?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The best time to visit Madhya Pradesh is from October to March when the weather is pleasant and suitable for sightseeing and religious activities."
        }
      }
    ]
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(localBusinessSchema)
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema)
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(touristAttractionSchema)
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema)
        }}
      />
    </>
  )
}
