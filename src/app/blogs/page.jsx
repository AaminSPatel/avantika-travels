"use client"

import { useState, useEffect } from "react"
import PageHeader from "@/components/ui/page-header"
import BlogCard from "@/components/ui/blog-card"
import Pagination from "@/components/ui/pagination"
import { useSite } from "@/context/site-context"

export default function BlogsPage() {
  const { blogs } = useSite()
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 9

  const categories = ["All", ...new Set(blogs.map((blog) => blog.category))]

  const filteredBlogs = selectedCategory === "All" ? blogs : blogs.filter((blog) => blog.category === selectedCategory)

  // Pagination logic
  const totalItems = filteredBlogs.length
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedBlogs = filteredBlogs.slice(startIndex, endIndex)

  const handlePageChange = (page) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Reset to page 1 when category changes
  useEffect(() => {
    setCurrentPage(1)
  }, [selectedCategory])

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
            {paginatedBlogs.map((blog, index) => (
              <BlogCard key={blog._id} blog={blog} index={index} />
            ))}
          </div>

          {/* Pagination */}
          {totalItems > itemsPerPage && (
            <Pagination
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
              currentPage={currentPage}
              onPageChange={handlePageChange}
            />
          )}

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
