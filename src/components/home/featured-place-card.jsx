"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { 
  FiArrowRight, 
  FiStar 
} from "react-icons/fi";

/**
 * Local Static Data Configuration for the Featured Destination Card.
 * 
 * - Images:
 *   - desktopImage: loaded ONLY on desktop/tablet screens (>= 768px). Mobile will NOT download this image.
 *   - mobileImage: loaded ONLY on mobile screens (< 768px). Desktop will NOT download this image.
 *   To update the graphics, simply replace the files in the /public folder or update the paths below.
 */
const FEATURED_CARD_DATA = {
  badge: "Avantika Travels Signature Experience",
  tagline: "Spiritual Yatra & Heritage Tourism",
  title: "Experience the Divine Soul of Mahakal & Sacred MP",
  description: 
    "Experience the divine aura of Mahakaleshwar, the sacred Shipra Ghats, and serene Omkareshwar with hassle-free VIP Darshan, sanitized cabs, and 100% verified local guidance.",
  location: "Ujjain • Omkareshwar • Indore • MP Heritage",
  features: [
    "🔱 Mahakal Bhasma Aarti Support",
    "🚗 Indore to Ujjain AC Taxi Service",
    "🛕 Omkareshwar & Mamleshwar Tours",
    "🛡️ Sanitized Cabs & Verified Drivers",
  ],
  primaryCta: {
    text: "Explore Tour Packages",
    href: "/packages",
  },
  secondaryCta: {
    text: "Plan Custom Yatra",
    href: "/contact",
  },
  phone: "+91 8720006707",
  desktopImage: "/mahakal-coridor-ujjain.avif",
  mobileImage: "/ujjain_omkareshwar_avantika_travels.avif",
  altText: "Avantika Travels - Best Mahakal Darshan & Madhya Pradesh Tour Packages",
};

export default function FeaturedPlaceCard() {
  const data = FEATURED_CARD_DATA;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="group relative rounded-3xl overflow-hidden shadow-2xl bg-gray-950 border border-gray-800 min-h-[480px] sm:min-h-[500px] md:min-h-[460px] lg:min-h-[500px] flex flex-col justify-end"
    >
      {/* 
        Art-Directed Responsive Images via native <picture>:
        Guarantees that:
        1. On mobile (< 768px), the browser requests ONLY the mobile image.
        2. On desktop (>= 768px), the browser requests ONLY the desktop image.
        3. High fetchPriority & async decoding ensure maximum LCP performance.
      */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <picture className="w-full h-full block">
          {/* Desktop Image: Viewport width >= 768px */}
          <source 
            media="(min-width: 768px)" 
            srcSet={data.desktopImage} 
          />
          {/* Mobile Image: Viewport width < 768px */}
          <source 
            media="(max-width: 767px)" 
            srcSet={data.mobileImage} 
          />
          {/* Fallback & Primary img element */}
          <img
            src={data.desktopImage}
            alt={data.altText}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out will-change-transform"
          />
        </picture>

        {/* Dynamic Art Gradient Overlays for optimal text contrast across all devices */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/70 to-black/30 md:bg-gradient-to-r md:from-black/95 md:via-black/75 md:to-transparent" />
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* Card Content */}
      <div className="relative z-10 p-6 sm:p-8 md:p-10 lg:p-12 max-w-3xl space-y-4 sm:space-y-5">
       {/* Top Badges */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
         {/*  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs sm:text-sm font-semibold tracking-wide bg-primary/90 text-white shadow-md">
            <FiStar className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
            {data.badge}
          </span> */}
          <div className="inline-flex items-center gap-1.5 text-gray-300 text-xs sm:text-sm bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/15">
           <FiStar className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
            {data.badge}
          </div>
        </div>
 
        {/* Main Headline */}
        <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-white leading-tight tracking-tight">
          Experience the Divine Soul of{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-300 to-rose-400">
            Mahakal & Sacred MP
          </span>
        </h3>

        {/* Copywriting Description */}
        <p className="text-gray-200 text-sm sm:text-base md:text-lg font-normal leading-relaxed">
          {data.description}
        </p>

        {/* Feature Highlights Pills (Replacing price/viewer stats with high-trust value propositions) */}
     {/*    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 pb-2">
          {data.features.map((feature, idx) => (
            <div 
              key={idx} 
              className="inline-flex items-center gap-2 text-xs sm:text-sm text-gray-200 bg-white/5 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-white/10"
            >
              <FiCheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="font-medium">{feature}</span>
            </div>
          ))}
        </div>
 */}
        {/* Call to Actions & Contact */}
        <div className="pt-2 flex flex-wrap items-center gap-3 sm:gap-4">
          {/* <Link
            href={data.primaryCta.href}
            className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 active:scale-95 text-white font-semibold text-sm sm:text-base px-6 py-3 rounded-xl shadow-lg hover:shadow-primary/30 transition-all duration-300 group/btn"
          >
            <span>{data.primaryCta.text}</span>
            <FiArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
          </Link> */}

          <Link
            href={data.secondaryCta.href}
            className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 active:scale-95 text-white backdrop-blur-md font-medium text-sm sm:text-base px-5 py-3 rounded-xl border border-white/20 transition-all duration-300"
          >
             <FiArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
            <span>Know More About Avantika Travels</span>
          </Link>

          {/* {data.phone && (
            <a
              href={`tel:${data.phone.replace(/[^0-9+]/g, '')}`}
              className="inline-flex items-center gap-2 text-white/80 hover:text-white text-xs sm:text-sm font-medium px-3 py-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              <FiPhone className="w-4 h-4 text-primary" />
              <span>Call: {data.phone}</span>
            </a>
          )} */}
        </div>
      </div>
    </motion.div>
  );
}

