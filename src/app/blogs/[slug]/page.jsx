"use client"

import { use } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { FiUser, FiClock, FiCalendar, FiArrowLeft, FiShare2, FiFacebook, FiTwitter } from "react-icons/fi"
import BlogCard from "@/components/ui/blog-card"
import { useSite } from "@/context/site-context"

export default function BlogDetailsPage({ params }) {
  const resolvedParams = use(params)
  const { blogs, siteData } = useSite()

  const blog = blogs.find((b) => b.slug === resolvedParams.slug)
  const relatedBlogs = blogs.filter((b) => b.id !== blog?.id && b.category === blog?.category).slice(0, 3)

  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Blog not found</h1>
          <Link href="/blogs" className="text-primary hover:underline">
            Back to Blogs
          </Link>
        </div>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>{blog.title} | Avantika Travels Blog</title>
        <meta name="description" content={blog.excerpt} />
        <meta name="keywords" content={`Ujjain travel blog, ${blog.category}, ${blog.title}`} />
        <meta property="og:title" content={`${blog.title} | Avantika Travels Blog`} />
        <meta property="og:description" content={blog.excerpt} />
        <meta property="og:type" content="article" />
        <meta property="og:image" content={blog.image?.url || "/logo.png"} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content={blog.title} />
        <meta property="article:author" content={blog.author} />
        <meta property="article:published_time" content={blog.date} />
        <meta property="article:section" content={blog.category} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${blog.title} | Avantika Travels Blog`} />
        <meta name="twitter:description" content={blog.excerpt} />
        <meta name="twitter:image" content={blog.image?.url || "/logo.png"} />
        <meta name="robots" content="index, follow" />
        <meta name="revisit-after" content="7 days" />
        <meta name="language" content="en-IN" />
        <meta name="geo.region" content="IN-MP" />
        <link rel="canonical" href={`https://avantikatravels.com/blogs/${blog.slug}`} />
      </Head>
      {/* Hero Section */}
      <section className="relative py-20 md:py-32">
        <div className="absolute inset-0">
          <Image src={blog.image?.url || "/placeholder.svg"} alt={blog.title} fill className="object-cover" />
          <div className="absolute inset-0 bg-black/50" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <Link
            href="/blogs"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
          >
            <FiArrowLeft className="w-4 h-4" />
            Back to Blogs
          </Link>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
            <span className="inline-block bg-primary text-white text-sm font-semibold px-4 py-1 rounded-full mb-4">
              {blog.category}
            </span>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">{blog.title}</h1>

            <div className="flex flex-wrap items-center gap-6 text-white/80">
              <span className="flex items-center gap-2">
                <FiUser className="w-4 h-4" />
                {blog.author}
              </span>
              <span className="flex items-center gap-2">
                <FiCalendar className="w-4 h-4" />
                {new Date(blog.date).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
              <span className="flex items-center gap-2">
                <FiClock className="w-4 h-4" />
                {blog.readTime}
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Main Content */}
            <article className="lg:col-span-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="prose prose-lg max-w-none"
              >
                <p className="text-xl text-muted-foreground leading-relaxed mb-6">{blog.excerpt}</p>
                <div className="text-foreground leading-relaxed whitespace-pre-line">{blog.content}</div>
              </motion.div>

              {/* Share Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-12 pt-8 border-t border-border"
              >
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-2 text-foreground font-medium">
                    <FiShare2 className="w-5 h-5" />
                    Share this article:
                  </span>
                  <div className="flex gap-3">
                    <a
                      href="#"
                      className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors"
                    >
                      <FiFacebook className="w-5 h-5" />
                    </a>
                    <a
                      href="#"
                      className="w-10 h-10 bg-sky-500 text-white rounded-full flex items-center justify-center hover:bg-sky-600 transition-colors"
                    >
                      <FiTwitter className="w-5 h-5" />
                    </a>
                  </div>
                </div>
              </motion.div>
            </article>

            {/* Sidebar */}
            <aside className="lg:col-span-4">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="sticky top-24 space-y-8"
              >
                {/* Author Card */}
                <div className="bg-muted rounded-2xl p-6">
                  <h3 className="font-semibold text-foreground mb-4">About the Author</h3>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                      <FiUser className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{blog.author}</p>
                      <p className="text-sm text-muted-foreground">{siteData.name}</p>
                    </div>
                  </div>
                </div>

                {/* CTA Card */}
                <div className="bg-primary rounded-2xl p-6 text-white">
                  <h3 className="font-semibold text-xl mb-3">Plan Your Trip</h3>
                  <p className="text-white/80 mb-4">
                    Ready to explore {siteData.region}? Check out our curated tour packages.
                  </p>
                  <Link
                    href="/packages"
                    className="block w-full bg-white text-primary text-center font-semibold py-3 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    View Packages
                  </Link>
                </div>
              </motion.div>
            </aside>
          </div>
        </div>
      </section>

      {/* Related Blogs */}
      {relatedBlogs.length > 0 && (
        <section className="py-16 md:py-24 bg-muted">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedBlogs.map((relatedBlog, index) => (
                <BlogCard key={relatedBlog.id} blog={relatedBlog} index={index} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
