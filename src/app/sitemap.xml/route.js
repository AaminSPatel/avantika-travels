import { getServerSideSitemap } from 'next-sitemap'
import { NextResponse } from 'next/server'

export async function GET(request) {
  try {
    // Base URL for the sitemap
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://avantikatravels.com'

    // Static pages with their priorities and change frequencies
    const staticPages = [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1.0,
      },
      {
        url: `${baseUrl}/about`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.8,
      },
      {
        url: `${baseUrl}/contact`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.8,
      },
      {
        url: `${baseUrl}/places`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.9,
      },
      {
        url: `${baseUrl}/packages`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.9,
      },
      {
        url: `${baseUrl}/blogs`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.8,
      },
      {
        url: `${baseUrl}/services`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.7,
      },
      {
        url: `${baseUrl}/booking`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.7,
      },
      {
        url: `${baseUrl}/privacy-policy`,
        lastModified: new Date(),
        changeFrequency: 'yearly',
        priority: 0.3,
      },
      {
        url: `${baseUrl}/terms-and-conditions`,
        lastModified: new Date(),
        changeFrequency: 'yearly',
        priority: 0.3,
      },
    ]

    // Fetch dynamic content from API
    let dynamicPages = []

    try {
      // Fetch places
      const placesResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/places`, {
        cache: 'no-store'
      })

      if (placesResponse.ok) {
        const places = await placesResponse.json()
        const placePages = places.map(place => ({
          url: `${baseUrl}/places/${place.slug}`,
          lastModified: new Date(place.updatedAt || place.createdAt || new Date()),
          changeFrequency: 'weekly',
          priority: 0.8,
        }))
        dynamicPages.push(...placePages)
      }

      // Fetch packages
      const packagesResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/packages`, {
        cache: 'no-store'
      })

      if (packagesResponse.ok) {
        const packages = await packagesResponse.json()
        const packagePages = packages.map(pkg => ({
          url: `${baseUrl}/packages/${pkg.slug}`,
          lastModified: new Date(pkg.updatedAt || pkg.createdAt || new Date()),
          changeFrequency: 'weekly',
          priority: 0.8,
        }))
        dynamicPages.push(...packagePages)
      }

      // Fetch blogs
      const blogsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/blogs`, {
        cache: 'no-store'
      })

      if (blogsResponse.ok) {
        const blogs = await blogsResponse.json()
        const blogPages = blogs
          .filter(blog => blog.published !== false)
          .map(blog => ({
            url: `${baseUrl}/blogs/${blog.slug}`,
            lastModified: new Date(blog.updatedAt || blog.createdAt || blog.date || new Date()),
            changeFrequency: 'monthly',
            priority: 0.6,
          }))
        dynamicPages.push(...blogPages)
      }

      // Fetch package categories
      const packageCategories = [
        'holiday', 'adventure', 'honeymoon', 'pilgrimage', 'family', 'weekend'
      ]

      const categoryPages = packageCategories.map(category => ({
        url: `${baseUrl}/packages?type=${category}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.7,
      }))

      dynamicPages.push(...categoryPages)

    } catch (error) {
      console.error('Error fetching dynamic content for sitemap:', error)
      // Continue with static pages only
    }

    // Combine all pages
    const allPages = [...staticPages, ...dynamicPages]

    // Return sitemap using next-sitemap
    return getServerSideSitemap(allPages)

  } catch (error) {
    console.error('Error generating sitemap:', error)

    // Fallback sitemap with basic pages
    const fallbackPages = [
      {
        url: process.env.NEXT_PUBLIC_BASE_URL || 'https://avantikatravels.com',
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1.0,
      },
      {
        url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://avantikatravels.com'}/places`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.9,
      },
      {
        url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://avantikatravels.com'}/packages`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.9,
      },
      {
        url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://avantikatravels.com'}/blogs`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.8,
      },
    ]

    return getServerSideSitemap(fallbackPages)
  }
}
