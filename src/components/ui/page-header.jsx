"use client"

import { motion } from "framer-motion"

export default function PageHeader({ title, subtitle, backgroundImage }) {
  return (
    <section className="relative py-20 md:py-32 bg-foreground">
      {backgroundImage && (
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        />
      )}
      <div className="absolute inset-0  from-foreground/80 to-foreground" />

      <div className="container mx-auto px-4 relative z-10 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-5xl font-bold text-white mb-4"
        >
          {title}
        </motion.h1>
        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-gray-300 max-w-2xl mx-auto"
          >
            {subtitle}
          </motion.p>
        )}
      </div>
    </section>
  )
}
