"use client"

import { useSite } from "@/context/site-context"

export function StructuredData() {
  const { siteData } = useSite()

  // Base URL constant taaki hydration issues na ho
  const baseUrl = "https://avantikatravels.com"

  if (!siteData || !siteData.name) {
    return null
  }

  // 1. LocalBusiness Schema
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    "name": siteData.name,
    "description": siteData.description,
    "url": baseUrl,
    "logo": `${baseUrl}${siteData.logo}`,
    "image": `${baseUrl}${siteData.secondaryImage}`,
    "telephone": siteData.contactInfo?.phone,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": siteData.contactInfo?.address,
      "addressLocality": siteData.contactInfo?.location,
      "addressRegion": siteData.contactInfo?.region,
      "postalCode": "456001",
      "addressCountry": "IN"
    },
    "sameAs": [
      siteData.socialLinks?.facebook,
      siteData.socialLinks?.instagram,
      siteData.socialLinks?.twitter,
      siteData.socialLinks?.youtube
    ].filter(Boolean),
    "priceRange": "₹₹"
  }

  // 2. Organization Schema
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": siteData.name,
    "url": baseUrl,
    "logo": `${baseUrl}${siteData.logo}`,
    "sameAs": localBusinessSchema.sameAs
  }

  // 3. FAQ Schema
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is the best time to visit Mahakal Mandir in Ujjain?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The best time to visit is from October to March when the weather is pleasant for darshan and sightseeing."
        }
      },
      {
        "@type": "Question",
        "name": "How can I book a taxi from Ujjain to Indore?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "You can book a taxi directly by calling us at +91 8720006707 or through our website's booking section."
        }
      }
    ]
  }

  // 4. Breadcrumb Schema (Aapne ise render nahi kiya tha)
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": baseUrl },
      { "@type": "ListItem", "position": 2, "name": "Tour Packages", "item": `${baseUrl}/packages` },
      { "@type": "ListItem", "position": 3, "name": "Places to Visit", "item": `${baseUrl}/places` }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  )
}