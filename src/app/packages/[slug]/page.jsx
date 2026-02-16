"use client"

import { use, useState, useEffect } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import Head from "next/head"
import { FiMapPin, FiClock, FiCheck, FiPhone, FiInfo, FiHelpCircle, FiShield, FiX, FiAlertCircle, FiShare2 } from "react-icons/fi"
import { FaWhatsapp, FaGooglePay } from "react-icons/fa"
import { FaTelegram, FaInstagram, FaTwitter } from "react-icons/fa"
import PageHeader from "@/components/ui/page-header"
import PackageCard from "@/components/ui/package-card"
import { useSite } from "@/context/site-context"
import PackageSchema from "@/components/seo/PackageSchema"
import AIEnhancements from "@/components/seo/AIEnhancements"

export default function PackageDetailsPage({ params }) {
  const resolvedParams = use(params)
  const { packages, siteData } = useSite()
  const [currentUrl, setCurrentUrl] = useState("")

  const pkg = packages.find((p) => p.slug === resolvedParams.slug)

  // Related packages logic
  let relatedPackages = packages.filter((p) =>
    p._id !== pkg?._id && (p.category === pkg?.category || p.destination === pkg?.destination)
  )

  if (relatedPackages.length < 3) {
    const remainingPackages = packages.filter((p) =>
      p._id !== pkg?._id && !relatedPackages.some(rp => rp._id === p._id)
    )
    const additionalNeeded = 4 - relatedPackages.length
    const additionalPackages = remainingPackages.slice(0, additionalNeeded)
    relatedPackages = [...relatedPackages, ...additionalPackages]
  } else {
    relatedPackages = relatedPackages.slice(0, 4)
  }

  useEffect(() => {
    if (typeof window !== "undefined") setCurrentUrl(window.location.href)
  }, [])

  if (!pkg) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Package not found</h1>
          <Link href="/packages" className="text-primary hover:underline">
            ← Back to All Packages
          </Link>
        </div>
      </div>
    )
  }

  const mainImage = pkg.images && pkg.images.length > 0 ? pkg.images[0].url : "/placeholder.svg"

  // SEO Metadata
  const pageTitle = `${pkg.name} | ${pkg.duration} Tour Package @ ₹${pkg.price}`
  const pageDesc = `Book ${pkg.name} covering ${pkg.destination}. Includes ${pkg.inclusions?.slice(0, 3).join(', ')}. Guide charges apply for small groups.`

  // Static FAQ
  const commonFaqs = [
    {
      question: "How do I book this package?",
      answer: "You can book by calling us directly or sending a WhatsApp message. We require a small advance payment to confirm your booking."
    },
    {
      question: "Is the guide fee included?",
      answer: "Guide charges are included for groups of 12 or more people. For smaller groups (<12), an extra fee of ₹1000/day applies."
    },
    {
      question: "Can I customize this itinerary?",
      answer: "Absolutely! We specialize in custom tours. Contact us to add or remove destinations like Omkareshwar or Maheshwar."
    }
  ]

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": commonFaqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  }

  return (
    <>
      <AIEnhancements pageType="package" data={pkg} />
      
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDesc} />
        <meta name="keywords" content={`${pkg.name}, ${pkg.destination} tour package, Ujjain tour cost, Mahakal darshan package`} />
        
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDesc} />
        <meta property="og:image" content={mainImage} />
        <meta property="og:type" content="product" />
        <meta property="product:price:amount" content={pkg.price} />
        <meta property="product:price:currency" content="INR" />
        
        <link rel="canonical" href={currentUrl} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      </Head>

      <PageHeader 
        title={pkg.name} 
        subtitle={`Experience the best of ${pkg.destination} with our premium service.`} 
        backgroundImage={mainImage} 
      />
      
      <PackageSchema packageData={pkg} mainImage={mainImage} />

      <main className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* --- LEFT COLUMN: CONTENT --- */}
            <div className="lg:col-span-8">
              
              {/* Image Gallery */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative h-[300px] md:h-[450px] rounded-3xl overflow-hidden mb-6 shadow-lg group"
              >
                <Image 
                  src={mainImage} 
                  alt={`Tour package for ${pkg.name}`} 
                  fill 
                  className="object-cover group-hover:scale-105 transition-transform duration-700" 
                  priority
                  quality={85}
                  sizes="(max-width: 768px) 100vw, 800px"
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-sm font-bold text-gray-800 shadow-sm">
                   {pkg.category || "Premium Tour"}
                </div>
              </motion.div>

              {/* Thumbnails */}
              {pkg.images && pkg.images.length > 1 && (
                <div className="grid grid-cols-4 gap-3 mb-10">
                  {pkg.images.slice(1, 5).map((image, index) => (
                    <div key={index} className="relative h-20 md:h-24 rounded-xl overflow-hidden cursor-pointer border-2 border-transparent hover:border-primary transition-all">
                      <Image
                        src={image.url}
                        alt={`${pkg.name} view ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Share Package Section */}
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm mb-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                      <FiShare2 className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Share this Package</p>
                      <p className="text-xs text-gray-500">Help others discover great experiences</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    {/* WhatsApp Share */}
                    <button
                      onClick={() => {
                        const text = `Check out this amazing tour package: ${pkg.name}\n\n - Destination: ${pkg.destination}\n - Duration: ${pkg.duration}\n - Price: ₹${pkg.price}\n\n${pkg.pickupPoint ? `- Pickup: ${pkg.pickupPoint}\n` : ''}${pkg.dropPoint ? `- Drop: ${pkg.dropPoint}\n` : ''}${pkg.tripDate ? `- Date: ${new Date(pkg.tripDate).toLocaleDateString()}\n` : ''}\n${currentUrl}`
                        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`
                        window.open(whatsappUrl, '_blank')
                      }}
                      className="w-10 h-10 bg-green-500 hover:bg-green-600 text-white rounded-full flex items-center justify-center transition-colors"
                      title="Share on WhatsApp"
                    >
                      <FaWhatsapp className="w-5 h-5" />
                    </button>

                    {/* Telegram Share */}
                    <button
                      onClick={() => {
                        const text = `Check out this amazing tour package: ${pkg.name}\n\n📍 Destination: ${pkg.destination}\n⏱️ Duration: ${pkg.duration}\n💰 Price: ₹${pkg.price}\n\n${pkg.pickupPoint ? `🚗 Pickup: ${pkg.pickupPoint}\n` : ''}${pkg.dropPoint ? `🏁 Drop: ${pkg.dropPoint}\n` : ''}${pkg.tripDate ? `📅 Date: ${new Date(pkg.tripDate).toLocaleDateString()}\n` : ''}\n${currentUrl}`
                        const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(text)}`
                        window.open(telegramUrl, '_blank')
                      }}
                      className="w-10 h-10 bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center justify-center transition-colors"
                      title="Share on Telegram"
                    >
                      <FaTelegram className="w-5 h-5" />
                    </button>

                    {/* Twitter Share */}
                    <button
                      onClick={() => {
                        const text = `Check out this amazing tour package: ${pkg.name} - ${pkg.destination}, ${pkg.duration} @ ₹${pkg.price} ${pkg.tripDate ? `on ${new Date(pkg.tripDate).toLocaleDateString()}` : ''}`
                        const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(currentUrl)}`
                        window.open(twitterUrl, '_blank')
                      }}
                      className="w-10 h-10 bg-blue-400 hover:bg-blue-500 text-white rounded-full flex items-center justify-center transition-colors"
                      title="Share on Twitter"
                    >
                      <FaTwitter className="w-5 h-5" />
                    </button>

                    {/* Instagram Share (opens Instagram app/website) */}
                    <button
                      onClick={() => {
                        const text = `Check out this amazing tour package: ${pkg.name}\n\n📍 Destination: ${pkg.destination}\n⏱️ Duration: ${pkg.duration}\n💰 Price: ₹${pkg.price}\n\n${pkg.pickupPoint ? `🚗 Pickup: ${pkg.pickupPoint}\n` : ''}${pkg.dropPoint ? `🏁 Drop: ${pkg.dropPoint}\n` : ''}${pkg.tripDate ? `📅 Date: ${new Date(pkg.tripDate).toLocaleDateString()}\n` : ''}\n${currentUrl}`
                        navigator.clipboard.writeText(text).then(() => {
                          window.open('https://www.instagram.com/', '_blank')
                          alert('Package details copied to clipboard! You can now paste it in Instagram.')
                        })
                      }}
                      className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-full flex items-center justify-center transition-colors"
                      title="Share on Instagram"
                    >
                      <FaInstagram className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Quick Info Bar */}
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-wrap gap-6 mb-8 items-center justify-between">
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                        <FiClock className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 uppercase font-bold">Duration</p>
                        <p className="font-semibold text-gray-900">{pkg.duration}</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center text-green-600">
                        <FiMapPin className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 uppercase font-bold">Destination</p>
                        <p className="font-semibold text-gray-900">{pkg.destination}</p>
                    </div>
                 </div>
                 {pkg.pickupPoint && (
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-orange-50 rounded-full flex items-center justify-center text-orange-600">
                          <FiMapPin className="w-5 h-5" />
                      </div>
                      <div>
                          <p className="text-xs text-gray-500 uppercase font-bold">Pickup Point</p>
                          <p className="font-semibold text-gray-900">{pkg.pickupPoint}</p>
                      </div>
                   </div>
                 )}
                 {pkg.dropPoint && (
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center text-red-600">
                          <FiMapPin className="w-5 h-5" />
                      </div>
                      <div>
                          <p className="text-xs text-gray-500 uppercase font-bold">Drop Point</p>
                          <p className="font-semibold text-gray-900">{pkg.dropPoint}</p>
                      </div>
                   </div>
                 )}
                 {pkg.tripDate && (
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600">
                          <FiClock className="w-5 h-5" />
                      </div>
                      <div>
                          <p className="text-xs text-gray-500 uppercase font-bold">Trip Date</p>
                          <p className="font-semibold text-gray-900">{new Date(pkg.tripDate).toLocaleDateString()}</p>
                      </div>
                   </div>
                 )}
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-50 rounded-full flex items-center justify-center text-purple-600">
                        <FiShield className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 uppercase font-bold">Type</p>
                        <p className="font-semibold text-gray-900">Private Tour</p>
                    </div>
                 </div>
              </div>

              {/* Description */}
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Package Overview</h2>
                <div className="prose prose-lg max-w-none text-gray-600 bg-white p-6 rounded-2xl border border-gray-100 mb-8">
                    <p>{pkg.description}</p>
                </div>
              </motion.div>

              {/* Itinerary */}
              {pkg.itinerary && pkg.itinerary.length > 0 && (
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Day-wise Itinerary</h2>
                  <div className="space-y-0">
                    {pkg.itinerary.map((day, index) => (
                      <div key={index} className="flex gap-4">
                        <div className="flex flex-col items-center">
                            <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm shrink-0 z-10">
                                {index + 1}
                            </div>
                            {index !== pkg.itinerary.length - 1 && <div className="w-0.5 h-full bg-gray-200 -mt-2 -mb-2"></div>}
                        </div>
                        <div className="pb-8">
                            <h3 className="text-lg font-bold text-gray-800 mb-2">Day {index + 1}</h3>
                            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm text-gray-600">
                                {day}
                            </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Inclusions & Exclusions */}
              <div className="grid md:grid-cols-2 gap-8 mb-10">
                 {pkg.inclusions && pkg.inclusions.length > 0 && (
                    <div className="bg-green-50/50 p-6 rounded-2xl border border-green-100">
                        <h3 className="font-bold text-green-800 mb-4 flex items-center gap-2">
                            <FiCheck className="w-5 h-5 bg-green-200 rounded-full p-0.5" /> What's Included
                        </h3>
                        <ul className="space-y-3">
                            {pkg.inclusions.map((item, idx) => (
                                <li key={idx} className="flex items-start gap-3 text-sm text-gray-700">
                                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5 shrink-0"></span>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                 )}
                 {pkg.exclusions && pkg.exclusions.length > 0 && (
                    <div className="bg-red-50/50 p-6 rounded-2xl border border-red-100">
                        <h3 className="font-bold text-red-800 mb-4 flex items-center gap-2">
                            <FiX className="w-5 h-5 bg-red-200 rounded-full p-0.5" /> What's Excluded
                        </h3>
                        <ul className="space-y-3">
                            {pkg.exclusions.map((item, idx) => (
                                <li key={idx} className="flex items-start gap-3 text-sm text-gray-700">
                                    <span className="w-1.5 h-1.5 bg-red-400 rounded-full mt-1.5 shrink-0"></span>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                 )}
              </div>

              {/* FAQ */}
              <div className="mb-10">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                     <FiHelpCircle className="text-primary" /> Frequently Asked Questions
                  </h2>
                  <div className="space-y-4">
                      {commonFaqs.map((faq, idx) => (
                          <div key={idx} className="bg-white border border-gray-200 rounded-xl p-5 hover:border-primary/30 transition-colors">
                              <h3 className="font-bold text-gray-800 mb-2 text-lg">{faq.question}</h3>
                              <p className="text-gray-600">{faq.answer}</p>
                          </div>
                      ))}
                  </div>
              </div>
            </div>

            {/* --- RIGHT COLUMN: STICKY BOOKING CARD --- */}
<div className="lg:col-span-4 w-full">
              <div className="flex flex-col md:flex-row stic w-full space-y-6 gap-8">
                
                {/* 1. Price & Booking Card */}
                <div className="bg-white flex-1 rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                    <div className="bg-gradient-to-r from-primary to-pink-500 p-6 text-white text-center">
                        <p className="text-gray-700 text-sm font-medium uppercase tracking-wider mb-1">Best Deal Offer</p>
                        <div className="flex items-baseline justify-center gap-1 text-black">
                            <span className="text-4xl font-bold">₹{pkg.price.toLocaleString()}</span>
                            <span className="text-sm opacity-80">/ person</span>
                        </div>
                    </div>
                    
                    <div className="p-6 flex flex-col gap-2">
                        {/* --- IMPORTANT NOTE ABOUT GUIDE FEE --- */}
                      {/*   <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-5 flex gap-3 items-start">
                             <FiAlertCircle className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
                             <div className="text-xs text-yellow-800">
                                 <strong>Note:</strong> Guide fee of <strong>₹1000/day</strong> is applicable if the group size is less than 12 people.
                             </div>
                        </div> */}

                        <div className="text-sm text-center px-2 text-gray-500 bg-gray-50 py-2 rounded-lg border border-gray-200 mb-5">
                            No hidden charges • Instant Confirmation
                        </div>
                        
                        <div className="space-y-3 text-gray-700">
                            {pkg.status !== false ? (
                                <>
                                    <Link
                                        href={`https://wa.me/${siteData.contactInfo?.phone?.replace(/\D/g, '') || '918720006707'}?text=Hi, I want to book ${pkg.name}. Please confirm price including Guide fee.`}
                                        target="_blank"
                                        className="flex items-center justify-center gap-2 w-full font-bold py-3 rounded-xl hover:bg-[#20bd5a] transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                                    >
                                        <FaWhatsapp className="w-5 h-5" /> Book via WhatsApp
                                    </Link>
                                    <Link
                                        href={`tel:${siteData.contactInfo?.phone || '+91 8720006707'}`}
                                        className="flex items-center justify-center gap-2 w-full bg-white border-2 border-primary text-primary font-bold py-3 rounded-xl hover:bg-primary hover:text-white transition-all"
                                    >
                                        <FiPhone className="w-5 h-5" /> Call to Book
                                    </Link>
                                </>
                            ) : (
                                <button disabled className="w-full bg-gray-300 text-white font-bold py-3.5 rounded-xl cursor-not-allowed">
                                    Sold Out
                                </button>
                            )}
                        </div>
                        
                        <div className="flex items-center justify-center gap-4 text-gray-400 pt-4 border-t border-gray-100 mt-5">
                             <FaGooglePay className="w-10 h-6" />
                             <span className="text-xs">UPI Accepted</span>
                        </div>
                    </div>
                </div>

                {/* 2. Trust Badges */}
                <div className="flex flex-col gap-6 md:w-1/2">

                <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm space-y-4">
                    <h4 className="font-bold text-gray-800 mb-2">Why Book with Avantika Travels?</h4>
                    <div className="flex gap-3 items-start">
                        <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center shrink-0">
                            <FiCheck className="text-blue-600 w-4 h-4" />
                        </div>
                        <div>
                            <p className="font-semibold text-sm text-gray-900">Verified Taxi & Hotels</p>
                            <p className="text-xs text-gray-500">We use only clean cabs & top-rated stays.</p>
                        </div>
                    </div>
                    <div className="flex gap-3 items-start">
                        <div className="w-8 h-8 bg-green-50 rounded-full flex items-center justify-center shrink-0">
                            <FiCheck className="text-green-600 w-4 h-4" />
                        </div>
                        <div>
                            <p className="font-semibold text-sm text-gray-900">24/7 Support</p>
                            <p className="text-xs text-gray-500">On-call support throughout your trip.</p>
                        </div>
                    </div>
                </div>

                {/* 3. Need Custom Plan? */}
                <div className="bg-gray-900 text-white rounded-2xl p-8 text-center">
                    <h4 className="font-bold text-lg mb-2">Need a Custom Plan?</h4>
                    <p className="text-gray-400 text-sm mb-4">We can customize this package for your family.</p>
                    <Link href="/contact" className="text-primary font-semibold hover:text-white transition-colors underline">
                        Request Custom Quote
                    </Link>
                </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </main>

      {/* Related Packages */}
      <section className="py-16 bg-white border-t border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
             <h2 className="text-2xl font-bold text-gray-900">Similar Packages</h2>
             <Link href="/packages" className="text-primary font-semibold hover:underline hidden md:block">
                View All
             </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedPackages.map((relatedPkg, index) => (
              <PackageCard key={relatedPkg.id} pkg={relatedPkg} index={index} />
            ))}
          </div>
        </div>
      </section>
    </>
  )
}