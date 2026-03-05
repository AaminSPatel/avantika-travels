"use client";

import { motion } from "framer-motion";

export default function StatCard({ title, value, icon }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="bg-white p-4 rounded-xl shadow flex justify-between items-center"
    >
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <h3 className="text-lg font-semibold">{value}</h3>
      </div>
      <div className="text-blue-500 text-xl">{icon}</div>
    </motion.div>
  );
}