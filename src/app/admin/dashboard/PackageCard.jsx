"use client";

import { motion } from "framer-motion";

export default function PackageCard({ pkg }) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white rounded-xl shadow overflow-hidden"
    >
      <img
        src={pkg.image}
        alt={pkg.title}
        className="h-40 w-full object-cover"
      />
      <div className="p-4">
        <h3 className="font-semibold">{pkg.title}</h3>
        <p className="text-sm text-gray-500">{pkg.location}</p>
        <p className="text-blue-600 font-bold mt-2">
          ₹{pkg.price}
        </p>
      </div>
    </motion.div>
  );
}