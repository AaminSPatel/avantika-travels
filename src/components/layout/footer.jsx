"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image"; // Optimization: Use Next.js Image
import {
  FiFacebook,
  FiInstagram,
  FiTwitter,
  FiYoutube,
  FiMail,
  FiMapPin,
  FiPhone,
  FiCreditCard,
  FiShield,
} from "react-icons/fi";
import { useSite } from "@/context/site-context";

export default function Footer() {
  const { siteData } = useSite();
  const router = useRouter();
  const [tapCount, setTapCount] = useState(0);
  const tapTimeoutRef = useRef(null);

  const handleSecretTap = () => {
    setTapCount((prev) => prev + 1);
    if (tapTimeoutRef.current) {
      clearTimeout(tapTimeoutRef.current);
    }
    tapTimeoutRef.current = setTimeout(() => {
      setTapCount(0);
    }, 2000); 

    if (tapCount + 1 >= 5) {
      router.push("/admin/login");
      setTapCount(0);
    }
  };

  const quickLinks = [
    { name: "About Us", href: "/about", title: "About Avantika Travels - Leading Travel Agency in Ujjain" },
    { name: "Gallery", href: "/gallery", title: "Travel Memories - Customer Stories & Photos from Madhya Pradesh Tours" },
    { name: "Contact Us", href: "/contact", title: "Contact for Ujjain Taxi & Tour Booking" },
    { name: "Blogs", href: "/blogs", title: "Read Latest MP Tourism Guides & Tips" },
    { name: "Privacy Policy", href: "/privacy-policy", title: "Read our Privacy Policy" },
    { name: "Terms & Conditions", href: "/terms-and-conditions", title: "Read Terms of Service" },
  ];

  const destinations = [
    { name: "Spritual Packages", href: "/packages?type=spritual", title: "Best Holiday Packages in Madhya Pradesh" },
   /*  { name: "Adventure Trips", href: "/packages?type=adventure", title: "Adventure Activities & Trekking in MP" },
    { name: "Honeymoon Tours", href: "/packages?type=honeymoon", title: "Romantic Honeymoon Packages in Pachmarhi & Mandu" },
    */ { name: "Pilgrimage Tours", href: "/packages?type=pilgrim", title: "Mahakal Darshan & Omkareshwar Yatra Packages" },
    { name: "Group Tour Vacations", href: "/packages?type=group-tour-package", title: "Family Tour Packages for Ujjain & Indore" },
   /*  { name: "Weekend Getaways", href: "/packages?type=weekend", title: "Short Weekend Trips from Indore" }, */
  ];

  const paymentMethods = [
    { name: "RuPay", src: "/payments/rupay.svg", alt: "RuPay Debit & Credit Cards" },
    { name: "Visa", src: "/payments/visa.svg", alt: "Visa Cards" },
    { name: "Mastercard", src: "/payments/mastercard.svg", alt: "Mastercard" },
    { name: "Maestro", src: "/payments/maestro.svg", alt: "Maestro Cards" },
    { name: "American Express", src: "/payments/amex.svg", alt: "American Express" },
    { name: "UPI", src: "/payments/upi.svg", alt: "UPI Payments" },
  ];

  return (
    <footer className="bg-foreground text-white" itemScope itemType="http://schema.org/WPFooter">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          
          {/* Company Info - Logo & Description */}
          <div className="space-y-4" itemScope itemType="http://schema.org/Organization">
            <Link href="/" className="flex items-center gap-2 group" title="Avantika Travels Home">
              <div className="relative h-16 w-16 overflow-hidden rounded shadow-2xl shadow-white/20 group-hover:scale-105 transition-transform">
                 <Image
                    src="/logo1.png"
                    alt="Avantika Travels - Best Travel Agency in Ujjain"
                    fill
                    className="object-cover rounded-2xl rounded-t-4xl rounded-b-sm"
                    sizes="64px"
                 />
              </div>
              <h3 className="text-2xl font-bold" itemProp="name">
                {siteData.name.split(" ")[0]}
                <span className="text-primary">
                  {siteData.name.split(" ")[1] || ""}
                </span>
              </h3>
            </Link>

            <p className="text-gray-300 leading-relaxed text-sm" itemProp="description">
              {siteData.description.slice(0, 180)}... Trusted for Mahakal Darshan & MP Tours.
            </p>
            
            {/* Social Links with Aria Labels for Accessibility */}
            <div className="flex gap-4">
              <a href={siteData.socialLinks.facebook} target="_blank" rel="noopener noreferrer" aria-label="Follow us on Facebook" className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center hover:bg-primary transition-colors">
                <FiFacebook className="w-5 h-5" />
              </a>
              <a href={siteData.socialLinks.instagram} target="_blank" rel="noopener noreferrer" aria-label="Follow us on Instagram" className="w-10 h-10  bg-pink-500  rounded-full flex items-center justify-center hover:bg-primary transition-colors">
                <FiInstagram className="w-5 h-5" />
              </a>
              <a href={siteData.socialLinks.twitter} target="_blank" rel="noopener noreferrer" aria-label="Follow us on Twitter" className="w-10 h-10 b bg-sky-500  rounded-full flex items-center justify-center hover:bg-primary transition-colors">
                <FiTwitter className="w-5 h-5" />
              </a>
              <a href={siteData.socialLinks.youtube} target="_blank" rel="noopener noreferrer" aria-label="Subscribe on YouTube" className="w-10 h-10 b bg-red-500  rounded-full flex items-center justify-center hover:bg-primary transition-colors">
                <FiYoutube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <nav aria-label="Footer Quick Links">
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    title={link.title}
                    className="text-gray-300 hover:text-primary transition-colors hover:pl-1"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Destinations */}
          <nav aria-label="Popular Destinations">
            <h4 className="text-lg font-semibold mb-4">Popular Tours</h4>
            <ul className="space-y-3">
              {destinations.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    title={link.title}
                    className="text-gray-300 hover:text-primary transition-colors hover:pl-1"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Newsletter / CTA */}
      <div className="hidden lg:block">
  <h4 className="text-lg font-semibold mb-4">Rated 5★ on Google</h4>

  <p className="text-gray-300 text-sm mb-4">
    See what our happy travelers say about Mahakal Darshan & MP Tours.
  </p>

  <a
    href="https://maps.app.goo.gl/7mFuWB7EmXvgBng77"
    target="_blank"
    rel="noopener noreferrer"
    className="inline-block bg-primary text-white px-6 py-3 rounded-full font-semibold hover:bg-primary/90 transition-colors text-sm"
  >
    View Google Reviews
  </a>
</div>

        </div>

        {/* We Accept Payments From Cards Section */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-5 bg-white/[0.04] border border-white/10 rounded-2xl px-6 py-5 shadow-lg shadow-black/20">
            <div className="flex flex-col sm:flex-row items-center gap-3.5 text-center sm:text-left">
              <div className="w-11 h-11 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-primary shrink-0 shadow-inner">
                <FiCreditCard className="w-5 h-5" />
              </div>
              <div>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <h4 className="text-base font-semibold text-white tracking-wide">
                    We Accept Payments from Cards
                  </h4>
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                    <FiShield className="w-3 h-3" /> 100% Secure Checkout
                  </span>
                </div>
                <p className="text-xs text-gray-300 mt-1">
                  Credit Cards, Debit Cards, RuPay, Visa, Mastercard, Maestro, Amex & UPI accepted for seamless tour & taxi booking.
                </p>
              </div>
            </div>

            {/* Payment Icons */}
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5">
              {paymentMethods.map((method) => (
                <div
                  key={method.name}
                  className="bg-white rounded-lg px-2.5 py-1.5 h-8 sm:h-9 min-w-[50px] flex items-center justify-center shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200 border border-gray-100/20 group"
                  title={method.alt}
                >
                  <img
                    src={method.src}
                    alt={method.alt}
                    className="h-4 sm:h-5 w-auto max-w-[56px] object-contain transition-transform group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Contact Info Bar */}
        <div className="mt-8 pt-6 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-wrap justify-center md:justify-start gap-6 text-gray-300 text-sm" itemScope itemType="http://schema.org/PostalAddress">
              <a href={`tel:${siteData.contactInfo.phone}`} className="flex items-center gap-2 hover:text-primary transition-colors" title="Call for Booking">
                <FiPhone className="w-4 h-4" />
                <span itemProp="telephone">{siteData.contactInfo.phone}</span>
              </a>
              <a href={`mailto:${siteData.contactInfo.email}`} className="flex items-center gap-2 hover:text-primary transition-colors" title="Email for Enquiry">
                <FiMail className="w-4 h-4" />
                <span itemProp="email">{siteData.contactInfo.email}</span>
              </a>
              <a
  href="https://maps.app.goo.gl/7mFuWB7EmXvgBng77"
  target="_blank"
  rel="noopener noreferrer"
  className="flex items-center gap-2 hover:text-primary transition-colors"
  title="View Avantika Travels on Google Maps"
>
  <FiMapPin className="w-4 h-4 shrink-0" />
  <span itemProp="addressLocality">
    {siteData.contactInfo.address}
  </span>
</a>

            </div>
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} <span itemProp="legalName">Avantika Travels</span>. All rights reserved.
            </p>
          </div>

          <p className="text-center text-gray-500 text-xs mt-6">
            Designed & Developed with ❤️ by{" "}
            <a
              href="https://business-sathi.vercel.app"
              target="_blank"
              rel="noopener noreferrer nofollow" // Added nofollow for external link
              className="hover:text-primary text-gray-400 transition-colors"
            >
              Business Sathi
            </a>
          </p>
        </div>
      </div>

      {/* Secret admin access for mobile - tap 5 times */}
      <div
        onClick={handleSecretTap}
        className="fixed bottom-0 right-0 w-16 h-16 z-50 cursor-default" // Made smaller and invisible but clickable
        aria-hidden="true"
      />
    </footer>
  );
}