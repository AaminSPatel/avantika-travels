"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { FiCheck, FiUsers, FiAward, FiMap, FiHeart } from "react-icons/fi"
import PageHeader from "@/components/ui/page-header"
import { useSite } from "@/context/site-context"

export default function AboutPage() {
  const { siteData } = useSite()

  const stats = [
    { icon: FiUsers, value: "10,000+", label: "Happy Travelers" },
    { icon: FiMap, value: "50+", label: "Tour Packages" },
    { icon: FiAward, value: "15+", label: "Years Experience" },
    { icon: FiHeart, value: "100%", label: "Satisfaction Rate" },
  ]

  const values = [
    {
      title: "Authentic Experiences",
      description:
        "We provide genuine cultural and spiritual experiences that connect you with the heart of Madhya Pradesh.",
    },
    {
      title: "Expert Guidance",
      description: "Our knowledgeable guides ensure you understand the significance of every destination you visit.",
    },
    {
      title: "Personalized Service",
      description: "Every journey is tailored to your preferences, ensuring a memorable and comfortable experience.",
    },
    {
      title: "Responsible Tourism",
      description:
        "We promote sustainable travel practices that respect local communities and preserve heritage sites.",
    },
  ]

  return (
    <>
      <PageHeader
        title="About Us"
        subtitle={`Your trusted travel partner for exploring ${siteData.region}`}
        backgroundImage="/pik8.avif"
      />

      {/* Story Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative h-[400px] rounded-2xl overflow-hidden">
                <Image
                  src="/pik4.avif"
                  alt="Avantika Travels Team"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-primary text-white p-6 rounded-2xl shadow-xl">
                <p className="text-4xl font-bold">15+</p>
                <p className="text-white/80">Years of Excellence</p>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Discover the Divine with {siteData.name}
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Founded in Ujjain, the land of Lord Mahakal, {siteData.name} has been helping travelers discover the
                spiritual and cultural treasures of {siteData.region} for over 15 years. Our deep-rooted connection with
                this sacred land allows us to offer authentic experiences that go beyond typical tourism.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-8">
                From arranging the sacred Bhasma Aarti at Mahakal Mandir to exploring the hidden gems of Indore
                and Dewas, we ensure every journey is memorable, comfortable, and spiritually enriching. Experience
                the divine presence at Mahakal Mandir, witness the mesmerizing evening aarti, and immerse yourself
                in the spiritual heritage that has drawn pilgrims for centuries.
              </p>

              <div className="space-y-3">
                {[
                  "Experienced local guides",
                  "24/7 customer support",
                  "Best price guarantee",
                  "Customized itineraries",
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center">
                      <FiCheck className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-primary">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center text-white"
              >
                <stat.icon className="w-10 h-10 mx-auto mb-3 text-white/80" />
                <p className="text-3xl md:text-4xl font-bold mb-1">{stat.value}</p>
                <p className="text-white/80">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 md:py-24 bg-muted">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Our Values</h2>
            <p className="text-muted-foreground">
              What sets us apart and drives our commitment to exceptional travel experiences
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 md:p-8"
              >
                <h3 className="text-xl font-bold text-foreground mb-3">{value.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Ready to Start Your Journey?</h2>
            <p className="text-muted-foreground mb-8">
              {"Let us help you create unforgettable memories in the heart of India"}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/packages"
                className="bg-primary text-white font-semibold px-8 py-3 rounded-full hover:bg-primary-dark transition-colors"
              >
                Explore Packages
              </Link>
              <Link
                href="/contact"
                className="border-2 border-primary text-primary font-semibold px-8 py-3 rounded-full hover:bg-primary hover:text-white transition-colors"
              >
                Contact Us
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
}
