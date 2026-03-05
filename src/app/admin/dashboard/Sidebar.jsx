"use client";

import { motion } from "framer-motion";
import {
  FaHome,
  FaBox,
  FaShoppingCart,
  FaCalendarAlt,
  FaUsers,
} from "react-icons/fa";

export default function Sidebar() {
  const menu = [
    { name: "Dashboard", icon: <FaHome /> },
    { name: "Packages", icon: <FaBox /> },
    { name: "Bookings", icon: <FaShoppingCart /> },
    { name: "Calendar", icon: <FaCalendarAlt /> },
    { name: "Customers", icon: <FaUsers /> },
  ];

  return (
    <motion.div
      initial={{ x: -100 }}
      animate={{ x: 0 }}
      className="w-64 bg-white shadow-lg p-6 hidden md:block"
    >
      <h2 className="text-xl font-bold mb-8">Travelie</h2>

      <ul className="space-y-4">
        {menu.map((item, i) => (
          <li
            key={i}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-blue-50 cursor-pointer"
          >
            {item.icon}
            {item.name}
          </li>
        ))}
      </ul>
    </motion.div>
  );
}