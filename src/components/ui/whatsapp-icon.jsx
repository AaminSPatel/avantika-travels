"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { FaWhatsapp } from "react-icons/fa"
import { useSite } from "@/context/site-context"

export default function WhatsAppIcon() {
  const { siteData } = useSite()
  const [isHovered, setIsHovered] = useState(false)

  const handleClick = () => {
    // Clean the phone number by removing non-digit characters
    const cleanPhone = siteData.contactInfo.phone.replace(/\D/g, "")
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=Hi%20Avantika%20Travels,%20I%20need%20help%20with%20travel%20planning.`
    window.open(whatsappUrl, "_blank")
  }

  return (
    <AnimatePresence>
 <motion.div
  initial={{ scale: 0, opacity: 0 }}
  animate={{ scale: 1, opacity: 1 }}
  exit={{ scale: 0, opacity: 0 }}
  transition={{
    type: "spring",
    stiffness: 260,
    damping: 20,
    delay: 1
  }}
  className="fixed bottom-6 left-6 z-50 "
>
  <motion.div
    whileHover={{
      scale: 1.12,
      rotateX: 5,
      rotateY: -5
    }}
    whileTap={{ scale: 0.95 }}
    style={{ perspective: 800 }}
    onHoverStart={() => setIsHovered(true)}
    onHoverEnd={() => setIsHovered(false)}
    className="relative "
  >
    {/* Pulsing glow ring */}
    <motion.div
      animate={{
        scale: [1, 1.4, 1],
        opacity: [0.6, 0, 0.6]
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      className="absolute  inset-0 rounded-full bg-green-400 blur-lg"
    />

    {/* 3D Button */}
    <motion.button
      onClick={handleClick}
      whileHover={{ rotate: [0, -8, 8, 0] }}
      transition={{ duration: 0.4 }}
      className="
        relative p-3 rounded-full 
        bg-gradient-to-b from-green-400 to-green-700
        shadow-[0_15px_25px_rgba(0,0,0,0.4),inset_0_3px_6px_rgba(255,255,255,0.4)]
        hover:shadow-[0_25px_40px_rgba(0,0,0,0.6),inset_0_4px_8px_rgba(255,255,255,0.45)]
        transition-all duration-300  hover:cursor-pointer
        flex items-center justify-center
      "
    >
      {/* Inner glossy layer */}
      <span className="absolute inset-1 rounded-full bg-gradient-to-t from-transparent to-white/30 pointer-events-none" />

      {/* WhatsApp Icon */}
      <FaWhatsapp className="w-7 h-7 text-white drop-shadow-[0_3px_3px_rgba(0,0,0,0.6)] relative z-10" />
    </motion.button>

    {/* Tooltip */}
    <AnimatePresence>
      {isHovered && (
        <motion.div
          initial={{ opacity: 0, x: -10, scale: 0.8 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: -10, scale: 0.8 }}
          transition={{ duration: 0.2 }}
          className="
            absolute left-full ml-3 top-1/2 -translate-y-1/2 
            bg-gray-900 text-white px-3 py-2 rounded-lg text-sm 
            whitespace-nowrap shadow-xl
          "
        >
          Chat with us on WhatsApp
          <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900"></div>
        </motion.div>
      )}
    </AnimatePresence>
  </motion.div>
</motion.div>

    </AnimatePresence>
  )
}
