"use client";
import { useMemo } from "react";
import { motion } from "framer-motion";

export default function UpcomingBookings({ bookings }) {
  const upcoming = useMemo(() => {
    return bookings
      .filter((b) => new Date(b.travelDate) >= new Date())
      .sort((a, b) => new Date(a.travelDate) - new Date(b.travelDate));
  }, [bookings]);

  return (
    <div className="bg-white p-4 rounded-2xl shadow w-72">
      <h2 className="font-semibold mb-4 text-sm">
        Upcoming Schedule
      </h2>

      <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
        {upcoming.length === 0 && (
          <p className="text-xs text-gray-500">
            No upcoming bookings
          </p>
        )}

        {upcoming.map((b, index) => {
          const dateObj = new Date(b.travelDate);

          return (
            <motion.div
              key={b.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex gap-3"
            >
              {/* Date Column */}
              <div className="flex flex-col items-center">
                <div className="bg-blue-600 text-white text-xs px-2 py-1 rounded-lg">
                  {dateObj.getDate()}
                </div>
                <div className="text-[10px] text-gray-500 mt-1">
                  {dateObj.toLocaleString("default", {
                    month: "short",
                  })}
                </div>
              </div>

              {/* Vertical Line */}
              <div className="w-px bg-gray-200"></div>

              {/* Booking Details */}
              <div className="flex-1 bg-gray-50 p-2 rounded-lg text-xs">
                <p className="font-medium">
                  {b.name}
                </p>
                <p className="text-gray-500">
                  ₹{b.totalPrice}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}