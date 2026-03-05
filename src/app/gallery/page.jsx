"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiMaximize2,
  FiX,
  FiMapPin,
  FiChevronRight,
  FiUser,
} from "react-icons/fi";
import PageHeader from "@/components/ui/page-header";
import { useSite } from "@/context/site-context";

export default function GalleryPage() {
  const [galleries, setGalleries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { siteData } = useSite();

  const [activeTrip, setActiveTrip] = useState(null);
  const [mainImage, setMainImage] = useState("");
const [selectedLocation, setSelectedLocation] = useState("All");
const [isFilterOpen, setIsFilterOpen] = useState(false);
const locations = [
  "All",
  ...new Set(galleries.map((trip) => trip.location)),
];

const filteredGalleries =
  selectedLocation === "All"
    ? galleries
    : galleries.filter((trip) => trip.location === selectedLocation);

  useEffect(() => {
    const fetchGalleries = async () => {
      try {
        const API_BASE_URL =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
        const response = await fetch(`${API_BASE_URL}/galleries`);
        if (!response.ok) {
          throw new Error("Failed to fetch galleries");
        }
        const data = await response.json();
        setGalleries(data);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching galleries:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchGalleries();
  }, []);

  const openLightbox = (trip) => {
    setActiveTrip(trip);
    setMainImage(trip.images[0]?.url || trip.images[0]);
  };

  return (
    <>
      <PageHeader
        title="Travel Memories"
        subtitle="Dekhiye hamare happy passengers ki kahaniyan unhi ki zubani."
        backgroundImage="/pik4.avif"
      />

      <main className="bg-gray-50 min-h-screen py-16">
        <div className="container mx-auto px-4">
         {/* ================= FILTER SECTION ================= */}
<div className="mb-10">

  {/* Filter Toggle Button */}
  <button
    onClick={() => setIsFilterOpen(!isFilterOpen)}
    className="flex items-center gap-2 bg-white px-6 py-3 rounded-2xl shadow-md border border-gray-200 hover:shadow-lg transition-all"
  >
    <FiMapPin className="text-primary" />
    <span className="font-semibold text-gray-800">
      Filter by Location
    </span>
  </button>

  {/* Collapsible Panel */}
  <AnimatePresence>
    {isFilterOpen && (
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: "auto", opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <div className="mt-6 flex flex-wrap gap-3">

          {locations.map((location, index) => (
            <button
              key={index}
              onClick={() => setSelectedLocation(location)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all
              ${
                selectedLocation === location
                  ? "bg-primary text-white shadow-lg shadow-primary/20"
                  : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-100"
              }`}
            >
              {location}
            </button>
          ))}

        </div>
      </motion.div>
    )}
  </AnimatePresence>
</div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            {filteredGalleries.map((trip) => (
              <motion.div
                key={trip.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="group bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 
                 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500"
              >
                {/* ================= MOBILE LAYOUT ================= */}
                <div
                  className="block md:hidden p-4 space-y-4"
                  onClick={() => openLightbox(trip)}
                >
                  {/* Hero Image */}
                  <div className="relative rounded-3xl overflow-hidden h-64">
                    <img
                      src={trip.images[0]?.url || trip.images[0]}
                      className="w-full h-full object-cover"
                      alt={'We Traveled to' +trip.location + 'with Avantika Travels' +trip.story }
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                    <div className="absolute bottom-4 left-4 text-white">
                      <div className="flex items-center gap-2 text-xs uppercase tracking-widest opacity-80">
                        <FiMapPin size={12} />
                        {trip.location}
                      </div>
                      <h3 className="text-lg font-bold mt-1">{trip.name}</h3>
                    </div>
                  </div>

                  {/* Thumbnails */}
                  <div className="grid grid-cols-3 gap-3">
                    {trip.images.slice(1, 4).map((img, index) => (
                      <div
                        key={index}
                        className="rounded-2xl overflow-hidden h-24"
                      >
                        <img
                          src={img?.url || img}
                          className="w-full h-full object-cover"
                          loading="lazy"
                          alt={'We Traveled to' +trip.location + 'with Avantika Travels' +trip.story }
                        />
                      </div>
                    ))}
                  </div>

                 
                </div>

                {/* ================= DESKTOP LAYOUT ================= */}
                <div
                  className="hidden md:grid relative grid-cols-4 grid-rows-2 gap-3 h-80 p-4 cursor-pointer"
                  onClick={() => openLightbox(trip)}
                >
                  <div className="col-span-2 row-span-2 rounded-3xl overflow-hidden">
                    <img
                      src={trip.images[0]?.url || trip.images[0]}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
                      alt=""
                    />
                  </div>

                  {trip.images.slice(1, 4).map((img, index) => (
                    <div key={index} className="rounded-2xl overflow-hidden">
                      <img
                        src={img?.url || img}
                        className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                        alt=""
                      />
                    </div>
                  ))}

                  <div className="rounded-2xl overflow-hidden relative">
                    <img
                      src={trip.images[4]?.url || trip.images[4]}
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                      alt=""
                    />

                    {trip.images.length > 5 && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-bold text-lg">
                        +{trip.images.length - 4}
                      </div>
                    )}
                  </div>
                </div>

                {/* Desktop Info Section */}
                <div className="px-6 pb-6 pt-4 flex justify-between items-start bg-pink-50">
                  <div>
                    <div className="flex items-center gap-2 text-primary text-sm font-semibold uppercase tracking-wide mb-1">
                      <FiMapPin size={14} />
                      {trip.location}
                    </div>

                    <h3 className="text-2xl font-extrabold text-gray-900 leading-tight">
                      {trip.name}
                    </h3>

                    <p className="text-gray-500 mt-2 text-sm italic line-clamp-1">
                      "{trip.story}"
                    </p>
                  </div>

                  <button
                    onClick={() => openLightbox(trip)}
                    className="p-3 bg-gray-900 text-white rounded-2xl 
                     hover:bg-primary transition-all duration-300 
                     group-hover:scale-110"
                  >
                    <FiChevronRight size={20} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* --- Advanced Lightbox Modal --- */}
        <AnimatePresence>
          {activeTrip && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] bg-white flex flex-col"
            >
              {/* Modal Header */}
              <div className="p-4 flex justify-between items-center border-b">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                    <FiUser />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 leading-none">
                      {activeTrip.passengerName}
                    </h4>
                    <span className="text-xs text-gray-500">
                      {activeTrip.location} Trip
                    </span>
                  </div>
                </div>
                <button
                  className="p-3 bg-gray-100 rounded-full hover:bg-gray-200 text-gray-900 transition-all"
                  onClick={() => setActiveTrip(null)}
                >
                  <FiX size={24} />
                </button>
              </div>

              <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
                {/* Left Side: Big Image Display */}
                <div className="flex-[2] bg-gray-50 p-4 md:p-10 flex items-center justify-center relative">
                  <motion.img
                    key={mainImage}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    src={mainImage}
                    className="max-w-full max-h-full rounded-3xl shadow-2xl object-contain bg-white"
                  />
                </div>

                {/* Right Side: Thumbnails & Story */}
                <div className="flex-1 bg-white p-6 md:p-10 border-l overflow-y-auto">
                  <h2 className="text-3xl font-black text-gray-900 mb-4">
                    {activeTrip.name}
                  </h2>
                  <p className="text-gray-600 leading-relaxed text-lg italic mb-8 border-l-4 border-primary pl-4">
                    "{activeTrip.story}"
                  </p>

                  <h5 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-4">
                    View Photos
                  </h5>
                  <div className="grid grid-cols-3 gap-3">
                    {activeTrip.images.map((img, idx) => (
                      <motion.div
                        key={idx}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`aspect-square rounded-2xl overflow-hidden cursor-pointer border-4 transition-all ${mainImage === (img.url || img) ? "border-primary" : "border-transparent opacity-50"}`}
                        onClick={() => setMainImage(img.url || img)}
                      >
                        <img
                          src={img.url || img}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </motion.div>
                    ))}
                  </div>

                  <div className="mt-10 p-6 bg-primary/5 rounded-3xl">
                    <p className="text-sm font-bold text-primary mb-1">
                      Want a similar experience?
                    </p>
                    <p className="text-xs text-gray-600 mb-4">
                      Book your custom package for {activeTrip.location} today.
                    </p>
                    <button
                      onClick={() => {
                        const phoneNumber = siteData.contactInfo?.phone; // 👈 apna number daalo
                        console.log("phoneNumber", phoneNumber);

                        const message = `Hello 👋

I am interested in the "${activeTrip.name}" trip from Gallery.

📍 Location: ${activeTrip.location}
👤 Review: ${activeTrip.story}

Please share more details about this package.

Thank you!`;

                        const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

                        window.open(whatsappURL, "_blank");
                      }}
                      className="w-full py-3 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all"
                    >
                      Enquire Now
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </>
  );
}
