"use client"

import { useState, useRef } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { FiFacebook, FiInstagram, FiTwitter, FiYoutube, FiMail, FiMapPin, FiPhone } from "react-icons/fi"
import { useSite } from "@/context/site-context"

export default function Footer() {
  const { siteData } = useSite()
  const router = useRouter()
  const [tapCount, setTapCount] = useState(0)
  const tapTimeoutRef = useRef(null)
 const handleSecretTap = () => {
    setTapCount(prev => prev + 1)

    if (tapTimeoutRef.current) {
      clearTimeout(tapTimeoutRef.current)
    }

    tapTimeoutRef.current = setTimeout(() => {
      setTapCount(0)
    }, 2000) // Reset after 2 seconds

    if (tapCount + 1 >= 5) {
      router.push('/admin/login')
      setTapCount(0)
    }
  }
const quickLinks = [
    { name: "About Us", href: "/about", title: "About Avantika Travels - Leading Travel Agency in Indore, Madhya Pradesh" },
    { name: "Contact Us", href: "/contact", title: "Contact Avantika Travels - Get in Touch for Your Next Trip" },
    { name: "Blogs", href: "/blogs", title: "Travel Blogs - Madhya Pradesh Tourism Guide & Travel Tips" },
    { name: "Privacy Policy", href: "/privacy-policy", title: "Privacy Policy - Avantika Travels Data Protection" },
    { name: "Terms & Conditions", href: "/terms-and-conditions", title: "Terms & Conditions - Avantika Travels Service Agreement" },
  ]

const destinations = [
  { name: "Holiday Packages", href: "/packages?type=holiday", title: "Holiday Packages in Madhya Pradesh - Family & Group Tours" },
  { name: "Adventure Trips", href: "/packages?type=adventure", title: "Adventure Trips in Madhya Pradesh - Trekking & Outdoor Activities" },
  { name: "Honeymoon Tours", href: "/packages?type=honeymoon", title: "Romantic Honeymoon Tours in Madhya Pradesh - Couples Getaways" },
  { name: "Pilgrimage Tours", href: "/packages?type=pilgrimage", title: "Religious Pilgrimage Tours - Sacred Sites in Madhya Pradesh" },
  { name: "Family Vacations", href: "/packages?type=family", title: "Family Vacation Packages - Safe & Enjoyable Trips for All Ages" },
  { name: "Weekend Getaways", href: "/packages?type=weekend", title: "Weekend Getaways from Indore - Short Trip Packages" },
]
 

  return (
    <footer className="bg-foreground text-white">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Company Info */}
          <div className="space-y-4">
                    <div className="flex items-center gap-2">


                      <img src="/logo1.png" alt="Avantika Travels logo" className="h-16 w-18 hover:scale-110 transition rounded shadow-2xl shadow-white/80" />
            <h3 className="text-2xl font-bold">
              {siteData.name.split(" ")[0]}
              <span className="text-primary">{siteData.name.split(" ")[1] || ""}</span>
            </h3>
                      </div>  
                      
            <p className="text-gray-300 leading-relaxed">{siteData.description.slice(0, 150)}...</p>
            <div className="flex gap-4">
              <a
                href={siteData.socialLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-primary transition-colors"
              >
                <FiFacebook className="w-5 h-5" />
              </a>
              <a
                href={siteData.socialLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-primary transition-colors"
              >
                <FiInstagram className="w-5 h-5" />
              </a>
              <a
                href={siteData.socialLinks.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-primary transition-colors"
              >
                <FiTwitter className="w-5 h-5" />
              </a>
              <a
                href={siteData.socialLinks.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-primary transition-colors"
              >
                <FiYoutube className="w-5 h-5" />
              </a>
          </div>

          <p className="text-center text-gray-400 text-sm mt-4">
            Designed and developed by <a href="https://create-website-solutions.vercel.app" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Aamin Patel</a>
          </p>
        </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">{siteData.name}</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-gray-300 hover:text-primary transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Destinations */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Destinations</h4>
            <ul className="space-y-3">
              {destinations.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-gray-300 hover:text-primary transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Join Our Newsletter</h4>
            <p className="text-gray-300 mb-4">Get exclusive access to travel deals, offers and adventure ideas.</p>
            <form className="flex gap-2">
              <div className="flex-1 relative">
                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full bg-white/10 border border-white/20 rounded-full py-3 pl-10 pr-4 text-white placeholder-gray-400 focus:outline-none focus:border-primary"
                />
              </div>
              <button
                type="submit"
                className="bg-primary text-white px-6 py-3 rounded-full font-semibold hover:bg-primary/90 transition-colors whitespace-nowrap"
              >
                Join us
              </button>
            </form>
          </div>
        </div>

        {/* Contact Info */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-wrap justify-center md:justify-start gap-6 text-gray-300 text-sm">
              <a
                href={`tel:${siteData.contactInfo.phone}`}
                className="flex items-center gap-2 hover:text-primary transition-colors"
              >
                <FiPhone className="w-4 h-4" />
                {siteData.contactInfo.phone}
              </a>
              <a
                href={`mailto:${siteData.contactInfo.email}`}
                className="flex items-center gap-2 hover:text-primary transition-colors"
              >
                <FiMail className="w-4 h-4" />
                {siteData.contactInfo.email}
              </a>
              <span className="flex items-center gap-2">
                <FiMapPin className="w-4 h-4" />
                {siteData.contactInfo.location}
              </span>
            </div>
            <p className="text-gray-400 text-sm">
              All rights reserved. © {siteData.name}. {new Date().getFullYear()}
            </p>
          </div>

          <p className="text-center text-gray-400 text-sm mt-4">
            Designed and developed by <a href="https://website-developers.vercel.app" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Aamin Patel</a>
          </p>
        </div>
      </div>

      {/* Secret admin access for mobile - tap 5 times */}
      <div
        onClick={handleSecretTap}
        className="fixed bottom-0 right-0 w-20 h-20 opacity-0 bg-amber-400 cursor-pointer"
        style={{ zIndex: 1 }}
      />
    </footer>
  )
}
