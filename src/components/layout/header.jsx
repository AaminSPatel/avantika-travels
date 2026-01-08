"use client"

import { useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { FiMenu, FiX, FiPhone, FiMail } from "react-icons/fi"
import { useSite } from "@/context/site-context"

const navLinks = [
  { name: "Home", href: "/", title: "Avantika Travels - Best Travel Agency in Madhya Pradesh" },
  { name: "Destinations", href: "/places", title: "Explore Religious Pilgrimage Sites in Madhya Pradesh - Avantika Travels" },
  { name: "Packages", href: "/packages", title: "Tour Packages to Madhya Pradesh - Holiday, Pilgrimage & Adventure Tours" },
  { name: "Services", href: "/services", title: "Travel Services - Car Rental, Hotel Booking, Tour Guide in Madhya Pradesh" },
  { name: "Blogs", href: "/blogs", title: "Travel Blogs - Madhya Pradesh Tourism Guide & Travel Tips" },
  { name: "About Us", href: "/about", title: "About Avantika Travels - Leading Travel Agency in Indore, Madhya Pradesh" },
  { name: "Contact", href: "/contact", title: "Contact Avantika Travels - Get in Touch for Your Next Trip" },
]

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { siteData } = useSite()

  return (
    <header className="w-full bg-white shadow-sm sticky top-0 z-50">
      {/* Top bar */}
      <div className="hidden md:block bg-primary text-white py-2">
        <div className="container mx-auto px-4 flex justify-between items-center text-sm">
          <div className="flex items-center gap-6">
            <a href={`tel:${siteData.contactInfo.phone}`} className="flex items-center gap-2 hover:text-white/80 transition-colors">
              <FiPhone className="w-4 h-4" />
              {siteData.contactInfo.phone}
            </a>
            <a
              href={`mailto:${siteData.contactInfo.email}`}
              className="flex items-center gap-2 hover:text-white/80 transition-colors"
            >
              <FiMail className="w-4 h-4" />
              {siteData.contactInfo.email}
            </a>
          </div>
          <div className="text-white/90">{siteData.workingHours}</div>
        </div>
      </div>

      {/* Main navigation */}
      <nav className="container mx-auto px-4 py-2">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-1">
          <img src="/logobg1.png" alt="Avantika Travels" className="h-10 w-10 hover:scale-110 transition " />
            <span className="text-2xl font-bold text-foreground tracking-tight">
              {siteData.name.split(" ")[0]}
              <span className="text-primary">{siteData.name.split(" ")[1] || ""}</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-foreground hover:text-primary transition-colors font-medium"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden lg:block">
            <Link
              href="/packages"
              className="bg-primary text-white px-4 py-2.5 rounded-full font-semibold hover:bg-primary/90 transition-colors flex"
            >
              Book Now
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 text-foreground"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden overflow-hidden"
            >
              <div className="py-4 space-y-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    prefetch={link.name === "Home" || link.name === "Packages" ? true : false}
                    className="block text-foreground hover:text-primary transition-colors font-medium py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}
                <Link
                  href="/packages"
                  className=" bg-primary text-white px-6 py-3 rounded-full font-semibold text-center hover:bg-primary/90 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Book Now
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  )
}
