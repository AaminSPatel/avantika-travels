"use client"

import { createContext, useContext, useState, useEffect } from "react"
import axios from "axios"

const SiteContext = createContext()
/* const allPlaces = [
  {
    title: "Ujjain",
    slug: "ujjain-madhya-pradesh",
    description: "Ujjain is one of the holiest cities in India, famous for the Mahakaleshwar Jyotirlinga temple and the Kumbh Mela. It's an ancient city with rich cultural and spiritual heritage.",
    location: "Ujjain, Madhya Pradesh",
    images: [
      {
        public_id: "ujjain_mahakal_temple_1",
        url: "/bg1.jpg"
      },
      {
        public_id: "ujjain_mahakal_temple_2",
        url: "/bg2.jpg"
      }
    ],
    price: 0,
    visitors: 15000,
    trips: 4500,
    cleaness: 4,
    category: "Spiritual & Religious",
    openingHours: "Temples: 4:00 AM - 11:00 PM",
    bestTimeToVisit: "October to March",
    rating: 4.5,
    entryFee: 0,
    isAtive: true
  },
  {
    title: "Indore",
    slug: "indore-madhya-pradesh",
    description: "Indore is the largest city in Madhya Pradesh, known as the commercial capital and famous for its street food, historical palaces, and vibrant culture.",
    location: "Indore, Madhya Pradesh",
    images: [
      {
        public_id: "indore_rajwada_1",
        url: "/bg3.jpg"
      },
      {
        public_id: "indore_sarafa_1",
        url: "/bg4.jpg"
      }
    ],
    price: 500,
    visitors: 25000,
    trips: 8000,
    cleaness: 4,
    category: "City & Food",
    openingHours: "24/7",
    bestTimeToVisit: "November to February",
    rating: 4.3,
    entryFee: 0,
    isAtive: true
  },
  {
    title: "Dewas",
    slug: "dewas-madhya-pradesh",
    description: "Dewas is known for its industrial growth and spiritual significance with the Chamunda Mata Temple and Tulja Bhavani Temple attracting numerous devotees.",
    location: "Dewas, Madhya Pradesh",
    images: [
      {
        public_id: "dewas_chamunda_temple_1",
        url: "/bg5.jpg"
      },
      {
        public_id: "dewas_city_1",
        url: "/bg6.jpg"
      }
    ],
    price: 200,
    visitors: 8000,
    trips: 2500,
    cleaness: 3.5,
    category: "Industrial & Spiritual",
    openingHours: "Temples: 6:00 AM - 9:00 PM",
    bestTimeToVisit: "October to March",
    rating: 3.8,
    entryFee: 0,
    isAtive: true
  },
  {
    title: "Bhopal",
    slug: "bhopal-madhya-pradesh",
    description: "Bhopal, the capital city of Madhya Pradesh, is known as the City of Lakes. It boasts beautiful lakes, historic monuments, museums, and a rich cultural heritage.",
    location: "Bhopal, Madhya Pradesh",
    images: [
      {
        public_id: "bhopal_lake_1",
        url: "/bg7.jpg"
      },
      {
        public_id: "bhopal_taj_ul_masajid_1",
        url: "/bg4.jpg"
      }
    ],
    price: 800,
    visitors: 30000,
    trips: 10000,
    cleaness: 4,
    category: "Capital City & Lakes",
    openingHours: "24/7",
    bestTimeToVisit: "October to March",
    rating: 4.2,
    entryFee: 0,
    isAtive: true
  },
  {
    title: "Omkareshwar",
    slug: "omkareshwar-madhya-pradesh",
    description: "Omkareshwar is a sacred island town situated on the Narmada River, home to one of the 12 Jyotirlingas. The island is shaped like the Hindu symbol 'Om'.",
    location: "Omkareshwar, Khandwa District, Madhya Pradesh",
    images: [
      {
        public_id: "bhopal_lake_1",
        url: "/bg2.jpg"
      },
      {
        public_id: "bhopal_taj_ul_masajid_1",
        url: "/bg1.jpg"
      }
    ],
    price: 0,
    visitors: 12000,
    trips: 4000,
    cleaness: 4,
    category: "Spiritual & Pilgrimage",
    openingHours: "Temple: 5:00 AM - 10:00 PM",
    bestTimeToVisit: "October to March",
    rating: 4.4,
    entryFee: 0,
    isAtive: true
  },
  {
    title: "Sanchi",
    slug: "sanchi-madhya-pradesh",
    description: "Sanchi is famous for its Great Stupa, a UNESCO World Heritage Site. It's one of the oldest stone structures in India and an important Buddhist pilgrimage site.",
    location: "Sanchi, Raisen District, Madhya Pradesh",
    images: [
      {
        public_id: "bhopal_lake_1",
        url: "/bg7.jpg"
      },
      {
        public_id: "bhopal_taj_ul_masajid_1",
        url: "/bg8.jpg"
      }
    ],
    price: 40,
    visitors: 18000,
    trips: 6000,
    cleaness: 4.5,
    category: "Historical & UNESCO",
    openingHours: "8:00 AM - 6:00 PM",
    bestTimeToVisit: "October to March",
    rating: 4.6,
    entryFee: 40,
    isAtive: true
  }
];
 const allBlogs = [
  {
    title: "Exploring the Spiritual Heart of India: A Journey Through Ujjain",
    slug: "exploring-spiritual-heart-india-ujjain-journey",
    content: "Ujjain, one of the seven sacred cities of Hinduism, offers a unique spiritual experience. The Mahakaleshwar Temple, with its majestic architecture and powerful energy, draws millions of devotees annually. The city comes alive during the Simhastha Kumbh Mela, where saints and pilgrims gather for sacred rituals in the Shipra River. Beyond spirituality, Ujjain's ancient observatory, Vedh Shala, showcases India's astronomical heritage dating back to the 17th century. The evening aarti at Ram Ghat is a spectacle of devotion, with lamps floating on the river creating a magical atmosphere.",
    author: "Rajesh Verma",
    image: {
        public_id: "ujjain_mahakal_temple_1",
        url: "/bg1.jpg"
      },
    tags: ["Spiritual", "Ujjain", "Temples", "Pilgrimage", "Hinduism"],
    date: new Date("2024-03-15"),
    category: "Spiritual Travel",
    views: 1250,
    published: true
  },
  {
    title: "Indore Food Trail: A Gastronomic Adventure in Central India",
    slug: "indore-food-trail-gastronomic-adventure-central-india",
    content: "Indore is not just the commercial capital of Madhya Pradesh but also the undisputed food capital. Starting your day with poha-jalebi at Sarafa Bazaar's night food market is a must. The famous Chappan Dukan offers 56 shops serving everything from sabudana khichdi to garadu. Don't miss the bhutte ka kees, a local specialty made from grated corn. For sweet lovers, the malpua and rabdi are heavenly. This blog takes you through the best eateries, street food joints, and traditional restaurants that make Indore a food lover's paradise.",
    author: "Priya Sharma",
    image: {
        public_id: "ujjain_mahakal_temple_1",
        url: "/bg2.jpg"
      },
    tags: ["Food", "Indore", "Street Food", "Gastronomy", "Culinary"],
    date: new Date("2024-04-22"),
    category: "Food & Culture",
    views: 2840,
    published: true
  },
  {
    title: "Bhopal: Where History Meets Modernity in the City of Lakes",
    slug: "bhopal-history-meets-modernity-city-lakes",
    content: "Bhopal presents a fascinating blend of old and new. The upper lake (Bada Talab) and lower lake (Chhota Talab) create a serene landscape in the heart of the city. Visit the majestic Taj-ul-Masajid, one of Asia's largest mosques, and the Shaukat Mahal showcasing Indo-Islamic architecture. The State Museum houses exquisite sculptures and manuscripts, while Van Vihar National Park offers wildlife encounters. The tragic Bhopal Gas Tragedy is remembered at the memorial, reminding visitors of the city's resilience. Evening boat rides on the lakes provide breathtaking sunset views.",
    author: "Amit Patel",
    image: {
        public_id: "ujjain_mahakal_temple_1",
        url: "/bg3.jpg"
      },
    tags: ["Bhopal", "Lakes", "History", "Architecture", "City Guide"],
    date: new Date("2024-02-10"),
    category: "City Exploration",
    views: 1920,
    published: true
  },
  {
    title: "Sanchi Stupa: Tracing Buddhist Heritage in Central India",
    slug: "sanchi-stupa-tracing-buddhist-heritage-central-india",
    content: "The Great Stupa at Sanchi is a UNESCO World Heritage Site and one of the oldest stone structures in India. Commissioned by Emperor Ashoka in the 3rd century BCE, it showcases exquisite carvings depicting Buddha's life through Jataka tales. The four toranas (gateways) are masterpieces of Buddhist art, with intricate carvings of yakshis, elephants, and spiritual symbols. The site includes several stupas, monasteries, and pillars spread across a hilltop. The nearby archaeological museum houses important artifacts found during excavations. Visiting Sanchi offers profound insights into early Buddhist art and architecture.",
    author: "Dr. Neha Singh",
    image: {
        public_id: "ujjain_mahakal_temple_1",
        url: "/bg4.jpg"
      },
    tags: ["Buddhist", "UNESCO", "History", "Archaeology", "Sanchi"],
    date: new Date("2024-01-18"),
    category: "Historical",
    views: 1560,
    published: true
  },
  {
    title: "Omkareshwar: The Sacred Island Shaped Like 'Om'",
    slug: "omkareshwar-sacred-island-shaped-om",
    content: "Located on an island formed by the Narmada River, Omkareshwar is one of the 12 Jyotirlingas. The island's shape resembles the sacred syllable 'Om', adding to its spiritual significance. Pilgrims take a boat ride to reach the temple, creating a serene journey across the river. Apart from the main Omkareshwar Temple, there are 108 other shrines on the island. The Mamleshwar Temple on the south bank is equally important. The best time to visit is during the monsoon when the Narmada River is in full flow, creating a majestic landscape. The evening aarti with thousands of lamps is a sight to behold.",
    author: "Ravi Joshi",
    image: {
        public_id: "ujjain_mahakal_temple_1",
        url: "/bg5.jpg"
      },
    tags: ["Pilgrimage", "Narmada", "Jyotirlinga", "Spiritual", "Rivers"],
    date: new Date("2024-05-30"),
    category: "Spiritual Travel",
    views: 980,
    published: true
  },
  {
    title: "Hidden Gems of Madhya Pradesh: Beyond the Popular Destinations",
    slug: "hidden-gems-madhya-pradesh-beyond-popular-destinations",
    content: "While places like Khajuraho and Pachmarhi get most attention, Madhya Pradesh has numerous hidden treasures. Visit Orchha for its magnificent palaces and temples by the Betwa River. The rock paintings of Bhimbetka offer a glimpse into prehistoric life. Bandhavgarh National Park provides excellent tiger sightings. The marble rocks of Bhedaghat create a spectacular gorge on the Narmada. Chanderi is famous for its traditional handloom sarees, and Mandu showcases Afghan architecture with its romantic tales. These lesser-known destinations offer authentic experiences away from tourist crowds.",
    author: "Anjali Deshmukh",
    image: {
        public_id: "ujjain_mahakal_temple_1",
        url: "/bg6.jpg"
      },
    tags: ["Hidden Gems", "Offbeat", "Nature", "Wildlife", "Culture"],
    date: new Date("2024-06-12"),
    category: "Travel Tips",
    views: 2150,
    published: true
  }
];

const allPackages = [
  {
    name: "Spiritual Circuit of Madhya Pradesh",
    slug: "spiritual-circuit-madhya-pradesh",
    description: "A divine journey through the sacred cities of Madhya Pradesh, covering major pilgrimage sites and spiritual centers. Experience the spiritual essence of central India with temple visits, river ceremonies, and cultural immersion.",
    price: 24999,
    duration: "7 Days / 6 Nights",
    destination: "Ujjain, Omkareshwar, Maheshwar, Amarkantak",
    images: [
      {
        public_id: "spiritual_circuit_1",
        url: "/pik7.avif"
      },
      {
        public_id: "spiritual_circuit_2",
        url: "/pik8.avif"
      }
    ],
    itinerary: [
      "Day 1: Arrival in Indore, transfer to Ujjain",
      "Day 2: Ujjain - Mahakaleshwar Temple, Ram Ghat Aarti",
      "Day 3: Drive to Omkareshwar, visit Omkareshwar Temple",
      "Day 4: Maheshwar Fort and Ahilya Ghat",
      "Day 5: Amarkantak - Narmada Udgam Temple",
      "Day 6: Return to Indore, city tour",
      "Day 7: Departure"
    ],
    inclusions: [
      "Accommodation in 3-star hotels",
      "Daily breakfast and dinner",
      "AC vehicle for all transfers",
      "Tour guide services",
      "All temple entry fees",
      "Boat ride in Omkareshwar"
    ],
    exclusions: [
      "Airfare/train tickets",
      "Lunch expenses",
      "Personal expenses",
      "Travel insurance",
      "Camera fees at monuments"
    ],
    status: true,
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-06-20")
  },
  {
    name: "Royal Heritage Tour - Palaces and Forts",
    slug: "royal-heritage-tour-palaces-forts",
    description: "Explore the royal legacy of Madhya Pradesh through magnificent palaces, ancient forts, and architectural marvels. This package takes you through the regal history of central Indian kingdoms.",
    price: 35999,
    duration: "8 Days / 7 Nights",
    destination: "Gwalior, Orchha, Datia, Jhansi",
   images: [
      {
        public_id: "spiritual_circuit_1",
        url: "/pik2.avif"
      },
      {
        public_id: "spiritual_circuit_2",
        url: "/pik1.avif"
      }
    ],
    itinerary: [
      "Day 1: Arrival in Gwalior, check-in",
      "Day 2: Gwalior Fort, Jai Vilas Palace",
      "Day 3: Drive to Orchha, visit Orchha Fort",
      "Day 4: Jahangir Mahal, Ram Raja Temple",
      "Day 5: Datia Palace, Pehwa Kund",
      "Day 6: Jhansi Fort and Rani Mahal",
      "Day 7: Return to Gwalior, light & sound show",
      "Day 8: Departure"
    ],
    inclusions: [
      "Luxury accommodation in heritage properties",
      "All meals (breakfast, lunch, dinner)",
      "AC SUV for entire journey",
      "Expert historian guide",
      "All monument entry tickets",
      "Cultural performance at Orchha"
    ],
    exclusions: [
      "Transport to/from Gwalior",
      "Personal shopping",
      "Alcoholic beverages",
      "Guide tips",
      "Any adventure activities"
    ],
    status: true,
    createdAt: new Date("2024-02-10"),
    updatedAt: new Date("2024-07-15")
  },
  {
    name: "Wildlife Safari Adventure",
    slug: "wildlife-safari-adventure-madhya-pradesh",
    description: "Embark on an exciting jungle safari across Madhya Pradesh's famous tiger reserves. Experience thrilling wildlife encounters, jungle stays, and nature trails in some of India's best national parks.",
    price: 41999,
    duration: "6 Days / 5 Nights",
    destination: "Bandhavgarh, Kanha, Pench",
    images: [
       {
        public_id: "spiritual_circuit_1",
        url: "/pik7.avif"
      },
      {
        public_id: "spiritual_circuit_2",
        url: "/pik8.avif"
      }
    ],
    itinerary: [
      "Day 1: Arrive Jabalpur, transfer to Bandhavgarh",
      "Day 2: Morning & evening safari in Bandhavgarh",
      "Day 3: Drive to Kanha, evening nature walk",
      "Day 4: Safari in Kanha National Park",
      "Day 5: Transfer to Pench, evening safari",
      "Day 6: Morning safari, departure"
    ],
    inclusions: [
      "Jungle lodge accommodation",
      "All safari permits and fees",
      "Expert naturalist guide",
      "All meals included",
      "4x4 Jeep safaris",
      "Nature walks and bird watching"
    ],
    exclusions: [
      "Travel to/from Jabalpur",
      "Camera fees (professional cameras)",
      "Personal expenses",
      "Insurance",
      "Tips to staff"
    ],
    status: true,
    createdAt: new Date("2024-03-05"),
    updatedAt: new Date("2024-08-10")
  },
  {
    name: "Cultural and Food Trail of Central India",
    slug: "cultural-food-trail-central-india",
    description: "A gastronomic and cultural journey through Madhya Pradesh, focusing on local cuisines, traditional arts, crafts, and festivals. Perfect for food enthusiasts and culture lovers.",
    price: 28999,
    duration: "5 Days / 4 Nights",
    destination: "Indore, Bhopal, Sanchi, Ujjain",
    images: [
       {
        public_id: "spiritual_circuit_1",
        url: "/pik6.avif"
      },
      {
        public_id: "spiritual_circuit_2",
        url: "/pik5.avif"
      }
    ],
    itinerary: [
      "Day 1: Arrival in Indore, street food tour at Sarafa",
      "Day 2: Indore - Chappan Dukan, Rajwada Palace",
      "Day 3: Bhopal - local cuisine, old city walk",
      "Day 4: Sanchi Stupa, tribal village visit",
      "Day 5: Ujjain food and temples, departure"
    ],
    inclusions: [
      "Hotel accommodation",
      "All food experiences included",
      "Cooking class with local chef",
      "Market visits with guide",
      "All transportation",
      "Cultural performance tickets"
    ],
    exclusions: [
      "Alcoholic drinks",
      "Personal shopping",
      "Extra food orders",
      "Airport transfers",
      "Hotel room service"
    ],
    status: true,
    createdAt: new Date("2024-04-20"),
    updatedAt: new Date("2024-09-05")
  },
  {
    name: "Ancient Temple Architecture Tour",
    slug: "ancient-temple-architecture-tour",
    description: "Discover the architectural marvels of ancient Indian temples in Madhya Pradesh. From Khajuraho's erotic sculptures to Bhojpur's monolithic marvel, this tour is perfect for architecture and history enthusiasts.",
    price: 32999,
    duration: "7 Days / 6 Nights",
    destination: "Khajuraho, Bhojpur, Udayagiri, Bhimbetka",
    images: [
       {
        public_id: "spiritual_circuit_1",
        url: "/pik4.avif"
      },
      {
        public_id: "spiritual_circuit_2",
        url: "/pik3.avif"
      }
    ],
    itinerary: [
      "Day 1: Arrive Khajuraho, evening light show",
      "Day 2: Western and Eastern group of temples",
      "Day 3: Drive to Bhojpur, Shiva Temple",
      "Day 4: Udayagiri Caves visit",
      "Day 5: Bhimbetka rock shelters",
      "Day 6: Sanchi Stupa exploration",
      "Day 7: Departure"
    ],
    inclusions: [
      "4-star hotel accommodation",
      "Expert architecture guide",
      "All entry fees and permits",
      "AC transportation",
      "Breakfast and dinner",
      "Guidebook and maps"
    ],
    exclusions: [
      "International flights",
      "Video camera fees",
      "Personal expenses",
      "Lunch",
      "Travel insurance"
    ],
    status: true,
    createdAt: new Date("2024-05-12"),
    updatedAt: new Date("2024-10-18")
  },
  {
    name: "Weekend Getaway to Hill Stations",
    slug: "weekend-getaway-hill-stations-madhya-pradesh",
    description: "Escape to the beautiful hill stations of Madhya Pradesh for a refreshing weekend. Enjoy cool climate, scenic beauty, adventure activities, and relaxation in nature's lap.",
    price: 15999,
    duration: "3 Days / 2 Nights",
    destination: "Pachmarhi, Bhedaghat",
    images: [
      {
        public_id: "spiritual_circuit_1",
        url: "/pik2.avif"
      },
      {
        public_id: "spiritual_circuit_2",
        url: "/pik1.avif"
      }
    ],
    itinerary: [
      "Day 1: Arrive Pachmarhi, check-in, local sightseeing",
      "Day 2: Full day Pachmarhi - waterfalls, caves, viewpoints",
      "Day 3: Bhedaghat marble rocks, boat ride, departure"
    ],
    inclusions: [
      "Resort accommodation",
      "All transfers in AC vehicle",
      "Breakfast and dinner",
      "Boat ride at Bhedaghat",
      "Guide services",
      "All entry tickets"
    ],
    exclusions: [
      "Train/airfare to starting point",
      "Adventure activities",
      "Lunch expenses",
      "Personal shopping",
      "Tips and gratuities"
    ],
    status: true,
    createdAt: new Date("2024-06-08"),
    updatedAt: new Date("2024-11-22")
  }
]; */
// API base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

// Site configuration data
const siteData = {
  name: "Avantika Travels",
  tagline: "Discover the Divine Beauty of Madhya Pradesh",
  description:
    "Experience the spiritual essence and cultural heritage of Madhya Pradesh with Avantika Travels. We specialize in pilgrimages to Mahakal Mandir and tours across Ujjain, Indore, and Dewas.",
  logo: "/logo.jpg",
  secondaryImage: "/pik2.avif",
  email: "info@avanikatravels.com",
  phone: "+91 8720006707",
  alternatePhone: "+91 8720006707",
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

export function SiteProvider({ children }) {
  const [places, setPlaces] = useState([])
  const [packages, setPackages] = useState([])
  const [blogs, setBlogs] = useState([])
  const [contacts, setContacts] = useState([])
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch all data on component mount
  useEffect(() => {
    fetchAllData()
  }, [])

  const fetchAllData = async () => {
    try {
      setLoading(true)
      setError(null)

      const [placesRes, packagesRes, blogsRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/places`),
        axios.get(`${API_BASE_URL}/packages`),
        axios.get(`${API_BASE_URL}/blogs`)
      ])

      setPlaces(placesRes.data)
      setPackages(packagesRes.data)
      setBlogs(blogsRes.data)
    } catch (err) {
      console.error('Error fetching data:', err)
      setError('Failed to load data from server')
    } finally {
      setLoading(false)
    }
  }

  // Places CRUD operations
  const fetchPlaces = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/places`)
      setPlaces(response.data)
      return response.data
    } catch (err) {
      console.error('Error fetching places:', err)
      throw err
    }
  }

  const createPlace = async (placeData, token) => {
    try {
      let response
      if (placeData.selectedFiles && placeData.selectedFiles.length > 0) {
        // Send as FormData for image uploads
        const formData = new FormData()
        Object.keys(placeData).forEach(key => {
          if (key === 'selectedFiles') {
            placeData.selectedFiles.forEach(file => formData.append('images', file))
          } else if (key !== 'images') {
            formData.append(key, placeData[key])
          }
        })
        response = await axios.post(`${API_BASE_URL}/places`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        })
      } else {
        // Send as JSON for no images
        const { selectedFiles, ...dataToSend } = placeData
        response = await axios.post(`${API_BASE_URL}/places`, dataToSend, {
          headers: { Authorization: `Bearer ${token}` }
        })
      }
      setPlaces(prev => [...prev, response.data])
      return response.data
    } catch (err) {
      console.error('Error creating place:', err)
      throw err
    }
  }

  const updatePlace = async (id, placeData, token) => {
    try {
      let response
      if (placeData.selectedFiles && placeData.selectedFiles.length > 0) {
        // Send as FormData for image uploads
        const formData = new FormData()
        Object.keys(placeData).forEach(key => {
          if (key === 'selectedFiles') {
            placeData.selectedFiles.forEach(file => formData.append('images', file))
          } else if (key !== 'images') {
            formData.append(key, placeData[key])
          }
        })
        response = await axios.put(`${API_BASE_URL}/places/${id}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        })
      } else {
        // Send as JSON for no images
        const { selectedFiles, ...dataToSend } = placeData
        response = await axios.put(`${API_BASE_URL}/places/${id}`, dataToSend, {
          headers: { Authorization: `Bearer ${token}` }
        })
      }
      setPlaces(prev => prev.map(place => place._id === id ? response.data : place))
      return response.data
    } catch (err) {
      console.error('Error updating place:', err)
      throw err
    }
  }

  const deletePlace = async (id, token) => {
    try {
      await axios.delete(`${API_BASE_URL}/places/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setPlaces(prev => prev.filter(place => place._id !== id))
    } catch (err) {
      console.error('Error deleting place:', err)
      throw err
    }
  }

  const uploadPlaceImages = async (files, token) => {
    try {
      const formData = new FormData()
      files.forEach(file => formData.append('images', file))

      const response = await axios.post(`${API_BASE_URL}/places/upload-images`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      })
      return response.data
    } catch (err) {
      console.error('Error uploading place images:', err)
      throw err
    }
  }



  // Packages CRUD operations
  const fetchPackages = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/packages`)
      setPackages(response.data)
      return response.data
    } catch (err) {
      console.error('Error fetching packages:', err)
      throw err
    }
  }

  const createPackage = async (packageData, token) => {
    try {
      let response
      if (packageData.selectedFiles && packageData.selectedFiles.length > 0) {
        // Send as FormData for image uploads
        const formData = new FormData()
        Object.keys(packageData).forEach(key => {
          if (key === 'selectedFiles') {
            packageData.selectedFiles.forEach(file => formData.append('images', file))
          } else if (key !== 'images') {
            formData.append(key, packageData[key])
          }
        })
        response = await axios.post(`${API_BASE_URL}/packages`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        })
      } else {
        // Send as JSON for no images
        const { selectedFiles, ...dataToSend } = packageData
        response = await axios.post(`${API_BASE_URL}/packages`, dataToSend, {
          headers: { Authorization: `Bearer ${token}` }
        })
      }
      setPackages(prev => [...prev, response.data])
      return response.data
    } catch (err) {
      console.error('Error creating package:', err)
      throw err
    }
  }

  const updatePackage = async (id, packageData, token) => {
    try {
      let response
      if (packageData.selectedFiles && packageData.selectedFiles.length > 0) {
        // Send as FormData for image uploads
        const formData = new FormData()
        Object.keys(packageData).forEach(key => {
          if (key === 'selectedFiles') {
            packageData.selectedFiles.forEach(file => formData.append('images', file))
          } else if (key !== 'images') {
            formData.append(key, packageData[key])
          }
        })
        response = await axios.put(`${API_BASE_URL}/packages/${id}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        })
      } else {
        // Send as JSON for no images
        const { selectedFiles, ...dataToSend } = packageData
        response = await axios.put(`${API_BASE_URL}/packages/${id}`, dataToSend, {
          headers: { Authorization: `Bearer ${token}` }
        })
      }
      setPackages(prev => prev.map(pkg => pkg._id === id ? response.data : pkg))
      return response.data
    } catch (err) {
      console.error('Error updating package:', err)
      throw err
    }
  }

  const deletePackage = async (id, token) => {
    try {
      await axios.delete(`${API_BASE_URL}/packages/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setPackages(prev => prev.filter(pkg => pkg._id !== id))
    } catch (err) {
      console.error('Error deleting package:', err)
      throw err
    }
  }



  // Blogs CRUD operations
  const fetchBlogs = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/blogs/published`)
      setBlogs(response.data)
      return response.data
    } catch (err) {
      console.error('Error fetching blogs:', err)
      throw err
    }
  }

  const createBlog = async (blogData, token) => {
    try {
      let response
      if (blogData.image) {
        // Send as FormData for image upload
        const formData = new FormData()
        Object.keys(blogData).forEach(key => {
          if (key === 'image') {
            formData.append('image', blogData.image)
          } else {
            formData.append(key, blogData[key])
          }
        })
        response = await axios.post(`${API_BASE_URL}/blogs`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        })
      } else {
        // Send as JSON for no image
        response = await axios.post(`${API_BASE_URL}/blogs`, blogData, {
          headers: { Authorization: `Bearer ${token}` }
        })
      }
      setBlogs(prev => [...prev, response.data])
      return response.data
    } catch (err) {
      console.error('Error creating blog:', err)
      throw err
    }
  }

  const updateBlog = async (id, blogData, token) => {
    try {
      let response
      if (blogData.image && blogData.image instanceof File) {
        // Send as FormData for image upload
        const formData = new FormData()
        Object.keys(blogData).forEach(key => {
          if (key === 'image') {
            formData.append('image', blogData.image)
          } else {
            formData.append(key, blogData[key])
          }
        })
        response = await axios.put(`${API_BASE_URL}/blogs/${id}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        })
      } else {
        // Send as JSON for no image update
        response = await axios.put(`${API_BASE_URL}/blogs/${id}`, blogData, {
          headers: { Authorization: `Bearer ${token}` }
        })
      }
      setBlogs(prev => prev.map(blog => blog._id === id ? response.data : blog))
      return response.data
    } catch (err) {
      console.error('Error updating blog:', err)
      throw err
    }
  }

  const deleteBlog = async (id, token) => {
    try {
      await axios.delete(`${API_BASE_URL}/blogs/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setBlogs(prev => prev.filter(blog => blog._id !== id))
    } catch (err) {
      console.error('Error deleting blog:', err)
      throw err
    }
  }



  // Contacts CRUD operations
  const fetchContacts = async (token = null) => {
    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {}
      const response = await axios.get(`${API_BASE_URL}/contacts`, { headers })
      setContacts(response.data)
      return response.data
    } catch (err) {
      console.error('Error fetching contacts:', err)
      throw err
    }
  }

  const updateContact = async (id, contactData, token) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/contacts/${id}`, contactData, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setContacts(prev => prev.map(contact => contact._id === id ? response.data : contact))
      return response.data
    } catch (err) {
      console.error('Error updating contact:', err)
      throw err
    }
  }

  const deleteContact = async (id, token) => {
    try {
      await axios.delete(`${API_BASE_URL}/contacts/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setContacts(prev => prev.filter(contact => contact._id !== id))
    } catch (err) {
      console.error('Error deleting contact:', err)
      throw err
    }
  }

  // Reviews CRUD operations
  const fetchReviews = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/reviews`)
      setReviews(response.data)
      return response.data
    } catch (err) {
      console.error('Error fetching reviews:', err)
      throw err
    }
  }

  const updateReview = async (id, reviewData, token) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/reviews/${id}`, reviewData, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setReviews(prev => prev.map(review => review._id === id ? response.data : review))
      return response.data
    } catch (err) {
      console.error('Error updating review:', err)
      throw err
    }
  }

  const deleteReview = async (id, token) => {
    try {
      await axios.delete(`${API_BASE_URL}/reviews/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setReviews(prev => prev.filter(review => review._id !== id))
    } catch (err) {
      console.error('Error deleting review:', err)
      throw err
    }
  }

  // Toggle status functions
  const togglePlaceStatus = async (id, token) => {
    const place = places.find(p => p._id === id)
    if (place) {
      await updatePlace(id, { ...place, isAtive: !place.isAtive }, token)
    }
  }

  const togglePackageStatus = async (id, token) => {
    const pkg = packages.find(p => p._id === id)
    if (pkg) {
      await updatePackage(id, { ...pkg, status: !pkg.status }, token)
    }
  }

  const toggleBlogPublished = async (id, token) => {
    const blog = blogs.find(b => b._id === id)
    if (blog) {
      await updateBlog(id, { ...blog, published: !blog.published }, token)
    }
  }

  const toggleContactStatus = async (id, token) => {
    const contact = contacts.find(c => c._id === id)
    if (contact) {
      const newStatus = contact.status === 'pending' ? 'responded' : 'pending'
      await updateContact(id, { ...contact, status: newStatus }, token)
    }
  }

  const toggleReviewStatus = async (id, token) => {
    const review = reviews.find(r => r._id === id)
    if (review) {
      let newStatus
      if (review.status === 'pending') newStatus = 'approved'
      else if (review.status === 'approved') newStatus = 'rejected'
      else newStatus = 'pending'
      await updateReview(id, { ...review, status: newStatus }, token)
    }
  }

  const value = {
    siteData,
    places,
    packages,
    blogs,
    contacts,
    reviews,
    loading,
    error,
    // Places
    fetchPlaces,
    createPlace,
    updatePlace,
    deletePlace,
    uploadPlaceImages,
    // Packages
    fetchPackages,
    createPackage,
    updatePackage,
    deletePackage,
    // Blogs
    fetchBlogs,
    createBlog,
    updateBlog,
    deleteBlog,
    // Contacts
    fetchContacts,
    updateContact,
    deleteContact,
    // Reviews
    fetchReviews,
    updateReview,
    deleteReview,
    // Toggle status
    togglePlaceStatus,
    togglePackageStatus,
    toggleBlogPublished,
    toggleContactStatus,
    toggleReviewStatus,
    
    // Utility
    refreshData: fetchAllData
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
