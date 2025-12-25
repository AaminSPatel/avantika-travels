"use client"

import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { FiClock, FiUser, FiArrowRight, FiCalendar, FiEye } from "react-icons/fi"

export default function BlogCard({ blog, index = 0 }) {
  // Only show published blogs (you can remove this filter if needed)
  if (blog.published === false) {
    return null
  }

  // Handle image - can be string or Cloudinary object
  const imageUrl = blog.image?.url || blog.image || "/pik2.avif"
  
  // Format date
  const formattedDate = new Date(blog.date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric"
  })
  
  // Calculate read time from content (200 words per minute)
  const wordCount = blog.content?.split(/\s+/)?.length || 0
  const readTime = Math.ceil(wordCount / 200)
  
  // Get excerpt from content (first 120 characters)
  const excerpt = blog.content?.substring(0, 120) + (blog.content?.length > 120 ? "..." : "")

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group h-full flex flex-col"
    >
      <Link href={`/blogs/${blog.slug}`} className="flex-1 flex flex-col">
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex-1 flex flex-col">
          {/* Image Section */}
          <div className="relative h-52 overflow-hidden">
            <Image
              src={imageUrl}
              alt={blog.title}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            
            {/* Category Badge */}
            <div className="absolute top-3 left-3 bg-primary text-white text-xs font-semibold px-3 py-1 rounded-full">
              {blog.category}
            </div>
            
            {/* Tags (if available) */}
            {blog.tags && blog.tags.length > 0 && (
              <div className="absolute top-3 right-3 flex gap-1">
                {blog.tags.slice(0, 2).map((tag, idx) => (
                  <span 
                    key={idx}
                    className="bg-white/90 backdrop-blur-sm text-foreground text-xs font-medium px-2 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
            
            {/* Views Counter */}
            {blog.views > 0 && (
              <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1.5">
                <FiEye className="w-3 h-3" />
                {blog.views >= 1000 ? `${(blog.views/1000).toFixed(1)}K` : blog.views}
              </div>
            )}
          </div>

          {/* Content Section */}
          <div className="p-5 flex-1 flex flex-col">
            {/* Author and Date Info */}
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3 flex-wrap">
              <span className="flex items-center gap-1.5">
                <FiUser className="w-3.5 h-3.5" />
                {blog.author}
              </span>
              <span className="flex items-center gap-1.5">
                <FiCalendar className="w-3.5 h-3.5" />
                {formattedDate}
              </span>
              <span className="flex items-center gap-1.5">
                <FiClock className="w-3.5 h-3.5" />
                {readTime} min read
              </span>
            </div>

            {/* Title */}
            <h3 className="font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors text-lg">
              {blog.title}
            </h3>

            {/* Excerpt */}
            <p className="text-muted-foreground text-sm line-clamp-3 mb-4 flex-1">
              {excerpt}
            </p>

            {/* Read More Link */}
            <div className="mt-auto">
              <span className="inline-flex items-center gap-2 text-primary font-semibold text-sm group-hover:gap-3 transition-all">
                Read More
                <FiArrowRight className="w-4 h-4" />
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  )
}