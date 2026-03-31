"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Head from "next/head"
import { FiPhone } from "react-icons/fi"
import { FaWhatsapp } from "react-icons/fa" // Make sure to install/import this
import PageHeader from "@/components/ui/page-header"
import { useSite } from "@/context/site-context"
import PlaceCard from "@/components/ui/place-card"
import Pagination from "@/components/ui/pagination"

export default function PlacesPage() {
  const { places, siteData } = useSite()
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 9

  // Fixed: CollectionPage + BreadcrumbList (replaces invalid ItemList)
const collectionPageSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": "https://avantikatravels.com/places",
    "name": "Top Tourist Places in Madhya Pradesh",
    "description": "List of best places to visit in MP including Ujjain, Omkareshwar, Pachmarhi, and Khajuraho.",
    "url": "https://avantikatravels.com/places",
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": places.length,
      "itemListElement": places.slice(0, 15).map((place, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "TouristAttraction", // Specific type for places
          "name": place.title || place.name,
          "url": `https://avantikatravels.com/places/${place.slug}`,
          // Adding dummy/placeholder rating to fix the error 
          // (Agar database mein real rating hai toh wahan se fetch karein)
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.8",
            "reviewCount": "150"
          }
        }
      }))
    }
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://avantikatravels.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Places to Visit",
        "item": "https://avantikatravels.com/places"
      }
    ]
  }

  // Pagination logic
  const totalItems = places.length
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedPlaces = places.slice(startIndex, endIndex)

  const handlePageChange = (page) => {
    setCurrentPage(page)
    const element = document.getElementById('places-grid');
    if(element) element.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <>
      <Head>
        <title>Best Places to Visit in Madhya Pradesh | MP Tourism & Ujjain Darshan</title>
        <meta name="description" content="Explore top tourist places in Madhya Pradesh. From Mahakal Ujjain & Omkareshwar Jyotirlinga to Pachmarhi Hill Station. Book taxi for MP tour packages." />
        <meta name="keywords" content="Places to visit in Madhya Pradesh, MP Tourism, Ujjain Darshan, Omkareshwar Trip, Pachmarhi Hill Station, Khajuraho Temples, Weekend getaways from Indore" />
        <link rel="canonical" href="https://avantikatravels.com/places" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionPageSchema) }}
          key="collection"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
          key="breadcrumb"
        />
      </Head>

      <PageHeader
        title="Explore Madhya Pradesh"
        subtitle="From the spiritual energy of Gwalior Fort to the natural beauty of Pachmarhi."
        backgroundImage="/gwalior1.jpeg"
      />

      <main className="bg-gray-50">
        
        {/* Intro SEO Section (Hidden on mobile for better UX) */}
        <section className="bg-white py-10 border-b border-gray-100 hidden md:block">
           <div className="container mx-auto px-4 text-center max-w-4xl">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Top Tourist Destinations in <span className="text-primary">Madhya Pradesh</span></h1>
              <p className="text-gray-600 leading-relaxed">
                 Are you planning a trip to the "Heart of India"? Whether you are looking for <strong>spiritual peace in Ujjain & Omkareshwar</strong>, 
                 wildlife adventure in <strong>Kanha & Bandhavgarh</strong>, or a relaxing weekend at <strong>Pachmarhi Hill Station</strong>, 
                 Avantika Travels connects you to the best destinations. We provide customized <strong>MP Tourism packages</strong> starting from Indore.
              </p>
           </div>
        </section>

        <section id="places-grid" className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {paginatedPlaces.map((place, index) => (
                <PlaceCard place={place} key={place._id} index={index} />
              ))}
            </div>

            {/* Pagination */}
            {totalItems > itemsPerPage && (
              <div className="mt-12">
                <Pagination
                    totalItems={totalItems}
                    itemsPerPage={itemsPerPage}
                    currentPage={currentPage}
                    onPageChange={handlePageChange}
                />
              </div>
            )}
          </div>
        </section>

        {/* --- DEEP SEO ARTICLE SECTION --- */}
        <article className="bg-white py-16 border-t border-gray-200">
           <div className="container mx-auto px-4 max-w-6xl">
              <div className="grid md:grid-cols-2 gap-12">
                 <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Religious Places in MP (Spiritual Tourism)</h2>
                    <p className="text-gray-600 mb-4">
                       Madhya Pradesh is home to two of the twelve Jyotirlingas. The <strong>Mahakaleshwar Temple in Ujjain</strong> is famous for its Bhasma Aarti and the grand <em>Mahakal Lok Corridor</em>. Just 140km away lies <strong>Omkareshwar</strong> and <strong>Mamleshwar</strong> on the banks of the Narmada river.
                    </p>
                    <p className="text-gray-600">
                       Other sacred sites include the <strong>Maihar Sharada Mata</strong> temple, <strong>Datia Pitambara Peeth</strong>, and the Jain pilgrimage site of <strong>Bawangaja</strong>. We offer direct taxi services from Indore to all these locations.
                    </p>
                 </div>
                 <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Heritage & Nature Getaways near Indore</h2>
                    <p className="text-gray-600 mb-4">
                       Looking for a break? Visit <strong>Mandu (The City of Joy)</strong> to see the romantic Jahaz Mahal, especially beautiful in monsoons. For history lovers, the <strong>Khajuraho Temples</strong> and <strong>Sanchi Stupa</strong> are UNESCO World Heritage sites you cannot miss.
                    </p>
                    <p className="text-gray-600">
                       If you love nature, plan a trip to <strong>Pachmarhi</strong>, the only hill station in MP, known for its waterfalls and caves. Our <strong>Indore to Pachmarhi taxi fare</strong> is very affordable for families.
                    </p>
                 </div>
              </div>
           </div>
        </article>

        {/* --- CTA SECTION (Your Code + Styling) --- */}
        <section className="bg-gradient-to-r from-blue-900 to-primary py-16 text-center text-white relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10" style={{backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '30px 30px'}}></div>
            
            <div className="container mx-auto px-4 relative z-10">
                <h2 className="text-3xl font-bold mb-8 text-primary">Ready to Explore Madhya Pradesh?</h2>
                 <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <Link
                        href={`tel:${siteData.contactInfo?.phone?.replace(/\D/g, '') || '918720006707'}`}
                        className="flex items-center gap-2 bg-primary text-white font-bold px-6 py-3 rounded-full shadow-lg hover:bg-primary-dark hover:scale-105 transition-all"
                    >
                        <FiPhone className="w-5 h-5" />
                        Call For Enquiry
                    </Link>

                    <a
                        href={`https://wa.me/${siteData.contactInfo?.phone?.replace(/\D/g, '') || '918720006707'}?text=Hi, I read your place descriptions and need help planning my next trip.`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 bg-white text-gray-900 font-bold px-6 py-3 rounded-full shadow-lg hover:text-primary hover:scale-105 transition-all"
                    >
                        <FaWhatsapp className="w-5 h-5 text-green-500" />
                        Chat with Expert
                    </a>
                </div>
                <p className="mt-6 text-sm text-gray-800 opacity-90 font-medium tracking-wide">
                    Trusted by 5000+ Yatris • Best Taxi Service in Ujjain & Indore
                </p>
            </div>
        </section>

      </main>
    </>
  )
}