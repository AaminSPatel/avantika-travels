"use client"

import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { FiClock, FiUser, FiArrowRight } from "react-icons/fi"

export default function BlogCard({ blog, index = 0 }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group"
    >
      <Link href={`/blogs/${blog.slug}`}>
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
          <div className="relative h-52 overflow-hidden">
            <Image
              src={blog.image || "/placeholder.svg"}
              alt={blog.title}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute top-3 left-3 bg-primary text-white text-xs font-semibold px-3 py-1 rounded-full">
              {blog.category}
            </div>
          </div>

          <div className="p-5">
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
              <span className="flex items-center gap-1">
                <FiUser className="w-4 h-4" />
                {blog.author}
              </span>
              <span className="flex items-center gap-1">
                <FiClock className="w-4 h-4" />
                {blog.readTime}
              </span>
            </div>

            <h3 className="font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
              {blog.title}
            </h3>

            <p className="text-muted-foreground text-sm line-clamp-2 mb-4">{blog.excerpt}</p>

            <span className="inline-flex items-center gap-2 text-primary font-semibold text-sm group-hover:gap-3 transition-all">
              Read More
              <FiArrowRight className="w-4 h-4" />
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  )
}
