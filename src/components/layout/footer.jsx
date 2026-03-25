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
    { name: "Holiday Packages", href: "/packages?type=holiday", title: "Best Holiday Packages in Madhya Pradesh" },
    { name: "Adventure Trips", href: "/packages?type=adventure", title: "Adventure Activities & Trekking in MP" },
    { name: "Honeymoon Tours", href: "/packages?type=honeymoon", title: "Romantic Honeymoon Packages in Pachmarhi & Mandu" },
    { name: "Pilgrimage Tours", href: "/packages?type=pilgrimage", title: "Mahakal Darshan & Omkareshwar Yatra Packages" },
    { name: "Family Vacations", href: "/packages?type=family", title: "Family Tour Packages for Ujjain & Indore" },
    { name: "Weekend Getaways", href: "/packages?type=weekend", title: "Short Weekend Trips from Indore" },
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
    href="https://share.google/ROllp7phdAfAwrSoI"
    target="_blank"
    rel="noopener noreferrer"
    className="inline-block bg-primary text-white px-6 py-3 rounded-full font-semibold hover:bg-primary/90 transition-colors text-sm"
  >
    View Google Reviews
  </a>
</div>

        </div>

        {/* Contact Info Bar */}
        <div className="mt-12 pt-8 border-t border-white/10">
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
  href="https://share.google/ROllp7phdAfAwrSoI"
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
            Designed with ❤️ by{" "}
            <a
              href="https://website-developers.vercel.app"
              target="_blank"
              rel="noopener noreferrer nofollow" // Added nofollow for external link
              className="hover:text-primary text-gray-400 transition-colors"
            >
              Website Developers
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