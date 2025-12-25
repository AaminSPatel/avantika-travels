"use client"

import { useState } from "react"
import PageHeader from "@/components/ui/page-header"
import BlogCard from "@/components/ui/blog-card"
import { useSite } from "@/context/site-context"

export default function BlogsPage() {
  const { blogs } = useSite()
  const [selectedCategory, setSelectedCategory] = useState("All")

  const categories = ["All", ...new Set(blogs.map((blog) => blog.category))]

  const filteredBlogs = selectedCategory === "All" ? blogs : blogs.filter((blog) => blog.category === selectedCategory)

  return (
    <>
      <PageHeader
        title="Travel Blog"
        subtitle="Stories, tips, and insights from our journeys across Madhya Pradesh"
        backgroundImage="/pik5.avif"
      />

      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-3 mb-6">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-2 rounded-full font-medium capitalize transition-colors ${
                  selectedCategory === category ? "bg-primary text-white" : "bg-muted text-foreground hover:bg-gray-200"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Blog Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredBlogs.map((blog, index) => (
              <BlogCard key={blog._id} blog={blog} index={index} />
            ))}
          </div>

          {filteredBlogs.length === 0 && (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg">No blogs found in this category.</p>
              <button
                onClick={() => setSelectedCategory("all")}
                className="mt-4 text-primary font-semibold hover:underline"
              >
                View all blogs
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
