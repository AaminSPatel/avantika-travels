"use client"

import { createContext, useContext, useState } from "react"

const SiteContext = createContext()

// Site configuration data
const siteData = {
  name: "Avantika Travels",
  tagline: "Discover the Divine Beauty of Madhya Pradesh",
  description:
    "Experience the spiritual essence and cultural heritage of Madhya Pradesh with Avantika Travels. We specialize in pilgrimages to Mahakal Mandir and tours across Ujjain, Indore, and Dewas.",
  logo: "/logo.jpg",
  secondaryImage: "/pik2.avif",
  email: "info@avanikatravels.com",
  phone: "+91 98765 43210",
  alternatePhone: "+91 87654 32109",
  location: "Ujjain, Madhya Pradesh, India",
  address: "123, Mahakal Road, Near Mahakal Mandir, Ujjain, MP - 456001",
  region: "Madhya Pradesh",
  mainAttraction: "Mahakal Mandir",
  socialLinks: {
    facebook: "https://facebook.com/avanikatravels",
    instagram: "https://instagram.com/avanikatravels",
    twitter: "https://twitter.com/avanikatravels",
    youtube: "https://youtube.com/avanikatravels",
  },
  workingHours: "Mon - Sat: 9:00 AM - 7:00 PM",
}

// Initial places data
const initialPlaces = [
  {
    id: 1,
    name: "Ujjain",
    slug: "ujjain",
    image: "/bg6.jpg",
    shortDescription: "The ancient city of temples and spiritual significance",
    description:
      "Ujjain, one of the seven sacred cities of India, is a major Hindu pilgrimage center. Home to the famous Mahakaleshwar Jyotirlinga, this city holds immense religious importance.",
    attractions: ["Mahakaleshwar Temple", "Ram Ghat", "Kal Bhairav Temple", "Vedh Shala"],
    bestTime: "October to March",
    events: 45,
  },
  {
    id: 2,
    name: "Indore",
    slug: "indore",
    image: "/bg5.jpg",
    shortDescription: "The commercial capital with rich heritage",
    description:
      "Indore, the largest city in Madhya Pradesh, blends modernity with tradition. Known for its cleanliness, food culture, and historical landmarks.",
    attractions: ["Rajwada Palace", "Lal Bagh Palace", "Sarafa Bazaar", "Patalpani Waterfall"],
    bestTime: "October to March",
    events: 32,
  },
  {
    id: 3,
    name: "Dewas",
    slug: "dewas",
    image: "/bg4.jpg",
    shortDescription: "Hill temples and serene landscapes",
    description:
      "Dewas is famous for its hilltop temples and peaceful atmosphere. The Tekri temples dedicated to Chamunda Mata and Tulja Bhavani attract devotees throughout the year.",
    attractions: ["Tekri Temple", "Malwa Fort", "Dewas Lake", "Kaila Devi Temple"],
    bestTime: "September to February",
    events: 21,
  },
]

// Initial packages data
const initialPackages = [
  {
    id: 1,
    name: "Mahakal Divine Darshan",
    slug: "mahakal-divine-darshan",
    image: "/bg3.jpg",
    duration: "2 Days",
    location: "Ujjain",
    price: 4999,
    originalPrice: 5999,
    discount: 20,
    rating: 4.98,
    reviews: 156,
    shortDescription: "Experience the divine blessings of Lord Mahakal",
    description:
      "Embark on a spiritual journey to the sacred Mahakaleshwar Temple. This package includes comfortable accommodation, guided temple visits, and participation in the famous Bhasma Aarti.",
    includes: ["Hotel Stay", "All Meals", "Temple Guide", "Bhasma Aarti Pass", "Local Transport"],
    itinerary: [
      {
        day: 1,
        title: "Arrival & Temple Visit",
        activities: ["Arrival in Ujjain", "Check-in to hotel", "Evening Aarti at Mahakal Temple"],
      },
      {
        day: 2,
        title: "Bhasma Aarti & Departure",
        activities: ["Early morning Bhasma Aarti", "Breakfast", "Visit Ram Ghat", "Departure"],
      },
    ],
  },
  {
    id: 2,
    name: "MP Heritage Circuit",
    slug: "mp-heritage-circuit",
    image: "/bg2.jpg",
    duration: "5 Days",
    location: "Ujjain, Indore, Dewas",
    price: 12999,
    originalPrice: 15999,
    discount: 19,
    rating: 4.95,
    reviews: 89,
    shortDescription: "Complete tour of Madhya Pradesh heritage",
    description:
      "Explore the rich cultural heritage of Madhya Pradesh covering three major cities. Visit ancient temples, historic palaces, and experience the local culture.",
    includes: ["Hotel Stay", "All Meals", "AC Transport", "Guide", "Entry Tickets"],
    itinerary: [
      { day: 1, title: "Ujjain Arrival", activities: ["Arrival", "Mahakal Temple", "Ram Ghat Aarti"] },
      { day: 2, title: "Ujjain Exploration", activities: ["Kal Bhairav Temple", "Vedh Shala", "Local Markets"] },
      { day: 3, title: "Travel to Indore", activities: ["Rajwada Palace", "Lal Bagh Palace", "Sarafa Bazaar"] },
      { day: 4, title: "Indore & Dewas", activities: ["Patalpani Waterfall", "Travel to Dewas", "Tekri Temple"] },
      { day: 5, title: "Departure", activities: ["Morning puja", "Shopping", "Departure"] },
    ],
  },
  {
    id: 3,
    name: "Weekend Temple Trail",
    slug: "weekend-temple-trail",
    image: "/bg1.jpg",
    duration: "3 Days",
    location: "Ujjain",
    price: 6999,
    originalPrice: 8499,
    discount: 18,
    rating: 4.92,
    reviews: 68,
    shortDescription: "Perfect weekend spiritual getaway",
    description:
      "A compact yet fulfilling weekend package covering major temples of Ujjain. Ideal for those seeking a quick spiritual retreat.",
    includes: ["Hotel Stay", "Breakfast & Dinner", "Temple Guide", "Local Transport"],
    itinerary: [
      { day: 1, title: "Arrival", activities: ["Arrival", "Hotel check-in", "Evening Aarti"] },
      { day: 2, title: "Temple Tour", activities: ["Mahakal Temple", "Harsiddhi Temple", "Gopal Temple"] },
      { day: 3, title: "Departure", activities: ["Mangalnath Temple", "Shopping", "Departure"] },
    ],
  },
  {
    id: 4,
    name: "Indore Food & Heritage",
    slug: "indore-food-heritage",
    image: "/bg4.jpg",
    duration: "2 Days",
    location: "Indore",
    price: 5499,
    originalPrice: 6499,
    discount: 15,
    rating: 4.89,
    reviews: 124,
    shortDescription: "Taste the flavors of Indore",
    description:
      "Experience the culinary delights and heritage of Indore. This package combines sightseeing with a food trail through the famous Sarafa Bazaar.",
    includes: ["Hotel Stay", "Food Trail", "Heritage Walk", "Local Guide"],
    itinerary: [
      { day: 1, title: "Heritage Tour", activities: ["Rajwada Palace", "Lal Bagh Palace", "Evening Food Trail"] },
      { day: 2, title: "Food & Departure", activities: ["Breakfast at Chappan Dukan", "Shopping", "Departure"] },
    ],
  },
  {
    id: 5,
    name: "Spiritual Dewas Experience",
    slug: "spiritual-dewas-experience",
    image: "/bg8.jpg",
    duration: "2 Days",
    location: "Dewas",
    price: 3999,
    originalPrice: 4999,
    discount: 20,
    rating: 4.85,
    reviews: 45,
    shortDescription: "Hilltop temples and peaceful retreat",
    description:
      "Visit the famous Tekri temples of Dewas and experience the serene atmosphere of this spiritual destination.",
    includes: ["Hotel Stay", "All Meals", "Temple Visit", "Local Transport"],
    itinerary: [
      { day: 1, title: "Arrival & Tekri", activities: ["Arrival", "Tekri Temple visit", "Evening prayers"] },
      { day: 2, title: "Exploration", activities: ["Morning puja", "Local sightseeing", "Departure"] },
    ],
  },
  {
    id: 6,
    name: "Complete MP Darshan",
    slug: "complete-mp-darshan",
    image: "/bg7.jpg",
    duration: "7 Days",
    location: "Ujjain, Indore, Dewas",
    price: 19999,
    originalPrice: 24999,
    discount: 20,
    rating: 4.97,
    reviews: 203,
    shortDescription: "The ultimate Madhya Pradesh experience",
    description:
      "Our most comprehensive package covering all major attractions across Ujjain, Indore, and Dewas with luxury accommodation and personalized service.",
    includes: ["Luxury Hotel", "All Meals", "AC Vehicle", "Personal Guide", "All Entry Fees", "Airport Transfer"],
    itinerary: [
      { day: 1, title: "Arrival Ujjain", activities: ["Airport pickup", "Hotel check-in", "Evening Aarti"] },
      { day: 2, title: "Ujjain Temples", activities: ["Bhasma Aarti", "Mahakal Temple", "Kal Bhairav"] },
      { day: 3, title: "Ujjain Heritage", activities: ["Ram Ghat", "Vedh Shala", "Local markets"] },
      { day: 4, title: "To Indore", activities: ["Travel to Indore", "Rajwada Palace", "Evening leisure"] },
      { day: 5, title: "Indore Exploration", activities: ["Lal Bagh Palace", "Central Museum", "Sarafa Bazaar"] },
      { day: 6, title: "Dewas Visit", activities: ["Travel to Dewas", "Tekri Temple", "Local sightseeing"] },
      { day: 7, title: "Departure", activities: ["Morning puja", "Shopping", "Airport drop"] },
    ],
  },
]

// Initial blogs data
const initialBlogs = [
  {
    id: 1,
    title: "The Mystical Bhasma Aarti of Mahakaleshwar",
    slug: "mystical-bhasma-aarti-mahakaleshwar",
    image: "/bg6.jpg",
    excerpt: "Discover the ancient ritual of Bhasma Aarti performed at the sacred Mahakaleshwar Temple in Ujjain.",
    content:
      "The Bhasma Aarti is one of the most sacred rituals performed at the Mahakaleshwar Temple in Ujjain. This unique ceremony takes place in the early morning hours, typically starting around 4 AM. The ritual involves applying sacred ash (bhasma) to the Shiva Lingam while chanting powerful mantras. Devotees from across the world visit Ujjain to witness this divine spectacle. The atmosphere during the Bhasma Aarti is truly electrifying, filled with devotion and spiritual energy. To attend the Bhasma Aarti, one needs to book passes in advance through the official temple website or through authorized travel agencies like Avantika Travels.",
    author: "Pandit Ramesh Sharma",
    date: "2024-01-15",
    category: "Spiritual",
    readTime: "5 min read",
  },
  {
    id: 2,
    title: "Top 10 Must-Visit Places in Ujjain",
    slug: "top-10-must-visit-places-ujjain",
    image: "/bg5.jpg",
    excerpt:
      "A comprehensive guide to the most significant temples and historical sites in the ancient city of Ujjain.",
    content:
      "Ujjain, one of the seven sacred cities of Hinduism, offers a treasure trove of spiritual and historical sites. From the magnificent Mahakaleshwar Temple to the serene ghats of the Shipra River, every corner of this city tells a story. The Kal Bhairav Temple, Harsiddhi Temple, and the ancient Vedh Shala (observatory) are among the must-visit attractions. The city also hosts the famous Kumbh Mela every 12 years, drawing millions of pilgrims.",
    author: "Dr. Anjali Verma",
    date: "2024-01-10",
    category: "Travel Guide",
    readTime: "8 min read",
  },
  {
    id: 3,
    title: "Indore Street Food Trail: A Foodie's Paradise",
    slug: "indore-street-food-trail-foodie-paradise",
    image: "/pik4.avif",
    excerpt: "Explore the famous street food culture of Indore from Sarafa Bazaar to Chappan Dukan.",
    content:
      "Indore has earned the title of India's cleanest city multiple times, but it's equally famous for its incredible street food scene. The Sarafa Bazaar comes alive after midnight, offering everything from garadu to sabudana khichdi. Chappan Dukan, with its 56 shops, serves the famous Indori Poha and Jalebi that have made the city legendary among food lovers. The Vijay Chat House and Johnny Hot Dogs are institutions in themselves.",
    author: "Chef Vikram Singh",
    date: "2024-01-05",
    category: "Food & Culture",
    readTime: "6 min read",
  },
  {
    id: 4,
    title: "Planning Your First Pilgrimage to Mahakal Temple",
    slug: "planning-first-pilgrimage-mahakal-temple",
    image: "/bg3.jpg",
    excerpt: "Essential tips and guidelines for first-time visitors to the sacred Mahakaleshwar Temple.",
    content:
      "Planning a visit to Mahakaleshwar Temple requires some preparation to make the most of your spiritual journey. The best time to visit is during the winter months from October to March. For Bhasma Aarti, online booking opens 3 days in advance. Dress modestly and carry minimal belongings. The temple complex also includes the Shri Ram Temple and Goddess Harsiddhi Temple which should be visited.",
    author: "Swami Premananda",
    date: "2023-12-28",
    category: "Travel Tips",
    readTime: "7 min read",
  },
  {
    id: 5,
    title: "The Hidden Gems of Dewas",
    slug: "hidden-gems-dewas",
    image: "/bg2.jpg",
    excerpt: "Discover the lesser-known attractions and peaceful retreats in the city of Dewas.",
    content:
      "While Dewas may not be as famous as Ujjain or Indore, it holds its own charm with unique attractions. The twin temples on Tekri hill offer panoramic views of the city. The Kaila Devi Temple and the ancient Malwa Fort are worth exploring. The city is also known for its textile industry and makes for a peaceful day trip from Indore.",
    author: "Traveler Meera Joshi",
    date: "2023-12-20",
    category: "Exploration",
    readTime: "5 min read",
  },
  {
    id: 6,
    title: "Festivals of Madhya Pradesh You Must Experience",
    slug: "festivals-madhya-pradesh-must-experience",
    image: "/bg1.jpg",
    excerpt: "From Simhastha Kumbh to local fairs, discover the vibrant festival culture of MP.",
    content:
      "Madhya Pradesh celebrates festivals with unmatched enthusiasm. The Simhastha Kumbh Mela in Ujjain is the largest gathering, occurring every 12 years. Navratri celebrations at Mahakal Temple, the annual Kartik Mela, and local fairs like the Malwa Utsav showcase the rich cultural heritage. These festivals offer visitors a unique opportunity to experience authentic Indian traditions.",
    author: "Cultural Expert Rajesh Tiwari",
    date: "2023-12-15",
    category: "Culture",
    readTime: "6 min read",
  },
]

export function SiteProvider({ children }) {
  const [places, setPlaces] = useState(initialPlaces)
  const [packages, setPackages] = useState(initialPackages)
  const [blogs, setBlogs] = useState(initialBlogs)

  const updatePlaces = (newPlaces) => setPlaces(newPlaces)
  const updatePackages = (newPackages) => setPackages(newPackages)
  const updateBlogs = (newBlogs) => setBlogs(newBlogs)

  const addPlace = (place) => setPlaces([...places, place])
  const addPackage = (pkg) => setPackages([...packages, pkg])
  const addBlog = (blog) => setBlogs([...blogs, blog])

  const value = {
    siteData,
    places,
    packages,
    blogs,
    updatePlaces,
    updatePackages,
    updateBlogs,
    addPlace,
    addPackage,
    addBlog,
  }

  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>
}

export function useSite() {
  const context = useContext(SiteContext)
  if (!context) {
    throw new Error("useSite must be used within a SiteProvider")
  }
  return context
}
